export type ApiPage<T> = {
  content: T[];
  number: number;
  size: number;
  totalElements: number;
  totalPages: number;
};

export type CategoryDto = {
  id: number;
  name: string;
  description?: string | null;
  imageUrl?: string | null;
  active?: boolean;
};

export type ProductResponseDto = {
  id: number;
  name: string;
  description?: string | null;
  price: number;
  stockQuantity?: number | null;
  imageUrl?: string | null;
  categoryId?: number | null;
  categoryName?: string | null;
  sellerId?: number | null;
  sellerName?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type AuthResponseDto = {
  token: string;
  refreshToken?: string;
  tokenType?: string;
  user?: {
    id: number;
    username: string;
    email: string;
    firstName?: string | null;
    lastName?: string | null;
    phoneNumber?: string | null;
    profileImageUrl?: string | null;
    role?: string | null;
  };
};

export type CartItemDto = {
  id: number;
  productId?: number;
  productName?: string;
  productImageUrl?: string | null;
  price?: number;
  quantity: number;
};

export type CartResponseDto = {
  id?: number;
  items: CartItemDto[];
  totalItems?: number;
  totalPrice?: number;
};

export type OrderItemResponseDto = {
  id: number;
  productId?: number;
  productName?: string;
  quantity: number;
  price: number;
};

export type OrderResponseDto = {
  id: number;
  orderNumber: string;
  status: string;
  totalAmount: number;
  createdAt?: string;
  items: OrderItemResponseDto[];
};

