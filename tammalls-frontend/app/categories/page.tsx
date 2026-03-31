import Link from "next/link";
import { api } from "../../lib/api";

export default async function CategoriesPage() {
  const categories = await api.categories.list({ activeOnly: false });

  return (
    <div className="bg-zinc-50">
      <div className="mx-auto w-full max-w-6xl px-4 py-10">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-950">Categories</h1>
          <p className="mt-1 text-sm text-zinc-600">Find products by category.</p>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/categories/${c.id}`}
              className="rounded-2xl border border-black/10 bg-white px-4 py-4 hover:bg-zinc-50"
            >
              <div className="text-sm font-semibold text-zinc-900">{c.name}</div>
              <div className="mt-1 text-xs text-zinc-500">{c.description || "Browse products"}</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

