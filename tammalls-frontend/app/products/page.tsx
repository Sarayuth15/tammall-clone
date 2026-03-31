import Link from "next/link";
import { api } from "../../lib/api";
import { ProductCard } from "../../components/product/ProductCard";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const sp = searchParams || {};
  const qRaw = sp.q;
  const q = Array.isArray(qRaw) ? qRaw[0] : qRaw;

  const data = q ? await api.products.search(q) : await api.products.list({ page: 0, size: 24, sortBy: "createdAt" });

  return (
    <div className="bg-zinc-50">
      <div className="mx-auto w-full max-w-6xl px-4 py-10">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-950">Products</h1>
            <p className="mt-1 text-sm text-zinc-600">
              {q ? (
                <>
                  Search results for <span className="font-semibold text-zinc-900">“{q}”</span>
                </>
              ) : (
                "Browse all products."
              )}
            </p>
          </div>
          <Link href="/categories" className="text-sm font-semibold text-zinc-900 hover:text-black">
            Browse categories
          </Link>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {data.content.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </div>
  );
}

