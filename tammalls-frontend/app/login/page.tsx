"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { api, ApiError } from "../../lib/api";
import { useAppDispatch } from "../../store/hooks";
import { setAuth } from "../../store/slices/authSlice";

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading">("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setStatus("loading");
    try {
      const res = await api.auth.login({ username, password });
      dispatch(
        setAuth({
          token: res.token,
          username: res.user?.username ?? username,
          role: res.user?.role ?? null,
        })
      );
      router.push("/");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : err instanceof Error ? err.message : "Login failed");
    } finally {
      setStatus("idle");
    }
  }

  return (
    <div className="bg-zinc-50">
      <div className="mx-auto w-full max-w-6xl px-4 py-10">
        <div className="mx-auto max-w-md rounded-3xl border border-black/10 bg-white p-6">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-950">Sign in</h1>
          <p className="mt-2 text-sm text-zinc-600">Welcome back. Enter your credentials to continue.</p>

          {error ? <div className="mt-4 rounded-2xl bg-red-50 p-3 text-sm text-red-700">{error}</div> : null}

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
                placeholder="yourname"
                autoComplete="username"
                required
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
                placeholder="••••••••"
                type="password"
                autoComplete="current-password"
                required
              />
            </label>

            <button
              type="submit"
              disabled={status === "loading"}
              className="inline-flex h-11 w-full items-center justify-center rounded-full bg-black px-6 text-sm font-semibold text-white hover:bg-zinc-900 disabled:opacity-60"
            >
              {status === "loading" ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <p className="mt-5 text-sm text-zinc-600">
            Don’t have an account?{" "}
            <Link href="/register" className="font-semibold text-zinc-900 hover:text-black">
              Create one
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}

