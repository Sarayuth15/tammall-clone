"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { api, ApiError } from "../../lib/api";
import { useAppDispatch } from "../../store/hooks";
import { setAuth } from "../../store/slices/authSlice";

export default function RegisterPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [mode, setMode] = useState<"customer" | "seller">("customer");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [status, setStatus] = useState<"idle" | "loading">("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setStatus("loading");
    try {
      const body = { username, email, password, firstName, lastName, phoneNumber };
      const res =
        mode === "customer" ? await api.auth.registerCustomer(body) : await api.auth.registerSeller(body);

      dispatch(
        setAuth({
          token: res.token,
          username: res.user?.username ?? username,
          role: res.user?.role ?? null,
        })
      );
      router.push("/");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : err instanceof Error ? err.message : "Registration failed");
    } finally {
      setStatus("idle");
    }
  }

  return (
    <div className="bg-zinc-50">
      <div className="mx-auto w-full max-w-6xl px-4 py-10">
        <div className="mx-auto max-w-md rounded-3xl border border-black/10 bg-white p-6">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-950">Create an account</h1>
          <p className="mt-2 text-sm text-zinc-600">Join TamMalls in under a minute.</p>

          {error ? <div className="mt-4 rounded-2xl bg-red-50 p-3 text-sm text-red-700">{error}</div> : null}

          <div className="mt-5 inline-flex w-full rounded-2xl border border-black/10 bg-white p-1 text-sm">
            <button
              type="button"
              onClick={() => setMode("customer")}
              className={`h-10 flex-1 rounded-2xl font-semibold ${
                mode === "customer" ? "bg-black text-white" : "text-zinc-700 hover:bg-zinc-50"
              }`}
            >
              Customer
            </button>
            <button
              type="button"
              onClick={() => setMode("seller")}
              className={`h-10 flex-1 rounded-2xl font-semibold ${
                mode === "seller" ? "bg-black text-white" : "text-zinc-700 hover:bg-zinc-50"
              }`}
            >
              Seller
            </button>
          </div>

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <label className="block">
              <div className="text-sm font-semibold text-zinc-900">Username</div>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                spellCheck={false}
                autoCorrect="off"
                autoCapitalize="none"
                className="mt-2 h-11 w-full rounded-2xl border border-black/10 px-4 text-sm text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-black/30"
                required
              />
            </label>

            <label className="block">
              <div className="text-sm font-semibold text-zinc-900">Email</div>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                spellCheck={false}
                autoCorrect="off"
                autoCapitalize="none"
                className="mt-2 h-11 w-full rounded-2xl border border-black/10 px-4 text-sm text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-black/30"
                type="email"
                required
              />
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <div className="text-sm font-semibold text-zinc-900">First name</div>
                <input
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  spellCheck={false}
                  autoCorrect="off"
                  autoCapitalize="words"
                  className="mt-2 h-11 w-full rounded-2xl border border-black/10 px-4 text-sm text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-black/30"
                />
              </label>
              <label className="block">
                <div className="text-sm font-semibold text-zinc-900">Last name</div>
                <input
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  spellCheck={false}
                  autoCorrect="off"
                  autoCapitalize="words"
                  className="mt-2 h-11 w-full rounded-2xl border border-black/10 px-4 text-sm text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-black/30"
                />
              </label>
            </div>

            <label className="block">
              <div className="text-sm font-semibold text-zinc-900">Phone number</div>
              <input
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                spellCheck={false}
                autoCorrect="off"
                autoCapitalize="none"
                inputMode="tel"
                className="mt-2 h-11 w-full rounded-2xl border border-black/10 px-4 text-sm text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-black/30"
                placeholder="+1 555 123 4567"
              />
            </label>

            <label className="block">
              <div className="text-sm font-semibold text-zinc-900">Password</div>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                spellCheck={false}
                autoCorrect="off"
                autoCapitalize="none"
                className="mt-2 h-11 w-full rounded-2xl border border-black/10 px-4 text-sm text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-black/30"
                type="password"
                required
              />
            </label>

            <button
              type="submit"
              disabled={status === "loading"}
              className="inline-flex h-11 w-full items-center justify-center rounded-full bg-black px-6 text-sm font-semibold text-white hover:bg-zinc-900 disabled:opacity-60"
            >
              {status === "loading" ? "Creating…" : "Create account"}
            </button>
          </form>

          <p className="mt-5 text-sm text-zinc-600">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-zinc-900 hover:text-black">
              Sign in
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}

