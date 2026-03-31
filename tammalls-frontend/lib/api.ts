import type {
  ApiPage,
  AuthResponseDto,
  CartItemDto,
  CartResponseDto,
  CategoryDto,
  OrderResponseDto,
  ProductResponseDto,
} from "./types";

const DEFAULT_BASE_URL = "http://localhost:8080/api";

function getBaseUrl() {
  return process.env.NEXT_PUBLIC_API_BASE_URL || DEFAULT_BASE_URL;
}

export class ApiError extends Error {
  status: number;
  body?: unknown;

  constructor(message: string, status: number, body?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  token?: string | null;
  body?: unknown;
  query?: Record<string, string | number | boolean | undefined | null>;
  next?: RequestInit["next"];
  cache?: RequestInit["cache"];
};

function getErrorMessage(payload: unknown, status: number) {
  if (typeof payload === "string" && payload.trim().length > 0) return payload;
  if (payload && typeof payload === "object") {
    const rec = payload as Record<string, unknown>;
    const msg = rec.message;
    const err = rec.error;
    if (typeof msg === "string" && msg.trim().length > 0) return msg;
    if (typeof err === "string" && err.trim().length > 0) return err;
  }
  return `Request failed (${status})`;
}

function withQuery(url: string, query?: RequestOptions["query"]) {
  if (!query) return url;
  const u = new URL(url);
  for (const [k, v] of Object.entries(query)) {
    if (v === undefined || v === null || v === "") continue;
    u.searchParams.set(k, String(v));
  }
  return u.toString();
}

async function request<T>(path: string, opts: RequestOptions = {}): Promise<T> {
  const url = withQuery(`${getBaseUrl()}${path}`, opts.query);

  const res = await fetch(url, {
    method: opts.method || "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(opts.token ? { Authorization: `Bearer ${opts.token}` } : {}),
    },
    body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
    next: opts.next,
    cache: opts.cache,
  });

  const contentType = res.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  const payload = isJson ? await res.json().catch(() => undefined) : await res.text().catch(() => undefined);

  if (!res.ok) {
    const msg = getErrorMessage(payload, res.status);
    throw new ApiError(msg, res.status, payload);
  }

  return payload as T;
}

export const api = {
  categories: {
    list: (opts?: { activeOnly?: boolean }) =>
      request<CategoryDto[]>(opts?.activeOnly ? "/categories/active" : "/categories", { cache: "no-store" }),
    byId: (id: number) => request<CategoryDto>(`/categories/${id}`, { cache: "no-store" }),
  },

  products: {
    list: (params?: { page?: number; size?: number; sortBy?: string }) =>
      request<ApiPage<ProductResponseDto>>("/products", {
        query: { page: params?.page ?? 0, size: params?.size ?? 12, sortBy: params?.sortBy ?? "createdAt" },
        cache: "no-store",
      }),
    byId: (id: number) => request<ProductResponseDto>(`/products/${id}`, { cache: "no-store" }),
    byCategory: (categoryId: number, params?: { page?: number; size?: number }) =>
      request<ApiPage<ProductResponseDto>>(`/products/category/${categoryId}`, {
        query: { page: params?.page ?? 0, size: params?.size ?? 12 },
        cache: "no-store",
      }),
    search: (keyword: string, params?: { page?: number; size?: number }) =>
      request<ApiPage<ProductResponseDto>>("/products/search", {
        query: { keyword, page: params?.page ?? 0, size: params?.size ?? 12 },
        cache: "no-store",
      }),
  },

  auth: {
    login: (body: { username: string; password: string }) =>
      request<AuthResponseDto>("/auth/login", { method: "POST", body }),
    registerCustomer: (body: {
      username: string;
      email: string;
      password: string;
      firstName?: string;
      lastName?: string;
      phoneNumber?: string;
    }) =>
      request<AuthResponseDto>("/auth/register/customer", { method: "POST", body }),
    registerSeller: (body: {
      username: string;
      email: string;
      password: string;
      firstName?: string;
      lastName?: string;
      phoneNumber?: string;
    }) =>
      request<AuthResponseDto>("/auth/register/seller", { method: "POST", body }),
  },

  cart: {
    get: (token: string) => request<CartResponseDto>("/cart", { token, cache: "no-store" }),
    count: (token: string) => request<number>("/cart/count", { token, cache: "no-store" }),
    add: (token: string, body: { productId: number; quantity: number }) =>
      request<CartItemDto>("/cart/add", { method: "POST", token, body }),
    updateItemQuantity: (token: string, cartItemId: number, quantity: number) =>
      request<CartItemDto>(`/cart/items/${cartItemId}`, {
        method: "PUT",
        token,
        query: { quantity },
      }),
    removeItem: (token: string, cartItemId: number) =>
      request<string>(`/cart/items/${cartItemId}`, { method: "DELETE", token }),
    clear: (token: string) => request<string>("/cart", { method: "DELETE", token }),
  },

  orders: {
    create: (token: string, body: { shippingAddress: string; phoneNumber: string; notes?: string }) =>
      request<OrderResponseDto>("/orders", { method: "POST", token, body }),
    mine: (token: string, params?: { page?: number; size?: number }) =>
      request<ApiPage<OrderResponseDto>>("/orders", {
        token,
        query: { page: params?.page ?? 0, size: params?.size ?? 10 },
        cache: "no-store",
      }),
    byId: (token: string, id: number) => request<OrderResponseDto>(`/orders/${id}`, { token, cache: "no-store" }),
  },
};

