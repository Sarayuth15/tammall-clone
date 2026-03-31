import Link from "next/link";
import Image from "next/image";
import type { ProductResponseDto } from "../../lib/types";

function money(n: number) {
  try {
    return new Intl.NumberFormat(undefined, { style: "currency", currency: "USD" }).format(n);
  } catch {
    return `$${n.toFixed(2)}`;
  }
}

export function ProductCard({ product }: { product: ProductResponseDto }) {
  return (
    <Link
      href={`/products/${product.id}`}
      className="group overflow-hidden rounded-3xl border border-black/10 bg-white transition hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(0,0,0,0.08)]"
    >
      <div className="relative aspect-[4/3] w-full bg-zinc-100">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover transition duration-300 group-hover:scale-[1.03]"
            sizes="(max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-zinc-100 via-zinc-50 to-white" />
        )}
        <div className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-zinc-900 backdrop-blur">
          {product.categoryName || "Featured"}
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold text-zinc-950">{product.name}</div>
            <div className="mt-1 truncate text-xs text-zinc-500">
              {product.sellerName ? `Sold by ${product.sellerName}` : " "}
            </div>
          </div>
          <div className="shrink-0 text-sm font-semibold text-zinc-950">{money(product.price)}</div>
        </div>
        <div className="mt-3 inline-flex items-center rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-700 group-hover:bg-zinc-200">
          View details
        </div>
      </div>
    </Link>
  );
}

