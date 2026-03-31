import Link from "next/link";
import { api } from "../../../lib/api";
import { ProductCard } from "../../../components/product/ProductCard";

export default async function CategoryDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const categoryId = Number(id);

  const [category, products] = await Promise.all([
    api.categories.byId(categoryId),
    api.products.byCategory(categoryId, { page: 0, size: 24 }),
  ]);

  return (
    <div className="bg-zinc-50">
      <div className="mx-auto w-full max-w-6xl px-4 py-10">
        <div className="flex items-end justify-between gap-4">
          <div>
            <div className="text-xs font-medium text-zinc-500">Category</div>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-zinc-950">{category.name}</h1>
            <p className="mt-1 text-sm text-zinc-600">{category.description || "Browse products in this category."}</p>
          </div>
          <Link href="/categories" className="text-sm font-semibold text-zinc-900 hover:text-black">
            All categories
          </Link>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {products.content.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </div>
  );
}

