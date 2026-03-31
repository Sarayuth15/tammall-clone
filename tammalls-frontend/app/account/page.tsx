"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { clearAuth } from "../../store/slices/authSlice";
import { clearCartLocal } from "../../store/slices/cartSlice";

export default function AccountPage() {
  const router = useRouter();
  const { token, username, role } = useAppSelector((s) => s.auth);
  const dispatch = useAppDispatch();

  function signOut() {
    dispatch(clearAuth());
    dispatch(clearCartLocal());
    router.push("/");
  }

  if (!token) {
    return (
      <div className="bg-zinc-50">
        <div className="mx-auto w-full max-w-6xl px-4 py-10">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-950">Account</h1>
          <p className="mt-2 text-sm text-zinc-600">Sign in to access your account.</p>
          <div className="mt-6">
            <Link
              href="/login"
              className="inline-flex h-11 items-center justify-center rounded-full bg-black px-6 text-sm font-semibold text-white hover:bg-zinc-900"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-zinc-50">
      <div className="mx-auto w-full max-w-6xl px-4 py-10">
        <div className="rounded-3xl border border-black/10 bg-white p-6">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-950">Account</h1>
          <p className="mt-2 text-sm text-zinc-600">
            Signed in as <span className="font-semibold text-zinc-900">{username}</span>
            {role ? (
              <>
                {" "}
                (<span className="font-semibold text-zinc-900">{role}</span>)
              </>
            ) : null}
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/account/orders"
              className="inline-flex h-11 items-center justify-center rounded-full border border-black/10 bg-white px-6 text-sm font-semibold text-zinc-900 hover:bg-zinc-50"
            >
              View orders
            </Link>
            <button
              type="button"
              onClick={signOut}
              className="inline-flex h-11 items-center justify-center rounded-full bg-black px-6 text-sm font-semibold text-white hover:bg-zinc-900"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

