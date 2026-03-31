import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-black/5 bg-white">
      <div className="mx-auto w-full max-w-6xl px-4 py-10">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="text-sm font-semibold">TamMalls</div>
            <p className="mt-2 max-w-md text-sm leading-6 text-zinc-600">
              A modern eCommerce UI powered by your TamMalls REST API. Fast product discovery, clean checkout, and a
              polished shopping experience.
            </p>
          </div>
          <div>
            <div className="text-sm font-semibold">Shop</div>
            <ul className="mt-3 space-y-2 text-sm text-zinc-600">
              <li>
                <Link href="/products" className="hover:text-black">
                  All products
                </Link>
              </li>
              <li>
                <Link href="/categories" className="hover:text-black">
                  Categories
                </Link>
              </li>
              <li>
                <Link href="/cart" className="hover:text-black">
                  Cart
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <div className="text-sm font-semibold">Account</div>
            <ul className="mt-3 space-y-2 text-sm text-zinc-600">
              <li>
                <Link href="/login" className="hover:text-black">
                  Sign in
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-black">
                  Create account
                </Link>
              </li>
              <li>
                <Link href="/account/orders" className="hover:text-black">
                  Orders
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-10 flex flex-col gap-2 border-t border-black/5 pt-6 text-xs text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
          <div>© {new Date().getFullYear()} TamMalls</div>
          <div className="flex gap-4">
            <Link href="/" className="hover:text-black">
              Home
            </Link>
            <Link href="/products" className="hover:text-black">
              Shop
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

