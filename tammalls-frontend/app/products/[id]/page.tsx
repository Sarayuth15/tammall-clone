import Link from "next/link";
import { api } from "../../../lib/api";
import { AddToCartButton } from "../../../components/cart/AddToCartButton";

function money(n: number) {
  try {
    return new Intl.NumberFormat(undefined, { style: "currency", currency: "USD" }).format(n);
  } catch {
    return `$${n.toFixed(2)}`;
  }
}

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const productId = Number(params.id);
  const product = await api.products.byId(productId);

  return (
    <div className="bg-zinc-50">
      <div className="mx-auto w-full max-w-6xl px-4 py-10">
        <div className="text-sm text-zinc-600">
          <Link href="/products" className="font-semibold text-zinc-900 hover:text-black">
            Products
          </Link>
          {product.categoryId ? (
            <>
              <span className="px-2">/</span>
              <Link href={`/categories/${product.categoryId}`} className="font-semibold text-zinc-900 hover:text-black">
                {product.categoryName || "Category"}
              </Link>
            </>
          ) : null}
        </div>

        <div className="mt-6 grid gap-8 md:grid-cols-2">
          <div className="aspect-square overflow-hidden rounded-3xl border border-black/10 bg-white">
            <div className="flex h-full w-full items-center justify-center text-sm text-zinc-500">
              {product.imageUrl ? "Image URL present" : "Product image placeholder"}
            </div>
          </div>

          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-zinc-950">{product.name}</h1>
            <div className="mt-2 text-sm text-zinc-600">{product.sellerName ? `Sold by ${product.sellerName}` : ""}</div>

            <div className="mt-5 inline-flex items-baseline gap-2 rounded-2xl border border-black/10 bg-white px-4 py-3">
              <div className="text-2xl font-semibold text-zinc-950">{money(product.price)}</div>
              <div className="text-xs text-zinc-500">taxes not included</div>
            </div>

            <AddToCartButton productId={product.id} />

            <div className="mt-8 rounded-2xl border border-black/10 bg-white p-5">
              <div className="text-sm font-semibold text-zinc-900">Description</div>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-zinc-600">
                {product.description || "No description provided."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

