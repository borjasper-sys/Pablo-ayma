"use client";

import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard";

    const result = await signIn("credentials", {
      username: formData.get("username"),
      password: formData.get("password"),
      redirect: false,
      callbackUrl
    });

    setLoading(false);

    if (!result?.ok) {
      setError("Usuario o contraseña incorrectos.");
      return;
    }

    router.push(result.url ?? callbackUrl);
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="mt-10 space-y-5">
      <label className="block">
        <span className="text-xs font-bold uppercase tracking-[0.22em] text-ash">
          Usuario
        </span>
        <input
          name="username"
          type="text"
          autoComplete="username"
          required
          className="mt-3 w-full border border-line bg-court px-4 py-4 text-base text-ink outline-none transition focus:border-ink"
          placeholder="Master"
        />
      </label>

      <label className="block">
        <span className="text-xs font-bold uppercase tracking-[0.22em] text-ash">
          Contraseña
        </span>
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="mt-3 w-full border border-line bg-court px-4 py-4 text-base text-ink outline-none transition focus:border-ink"
          placeholder="********"
        />
      </label>

      {error ? (
        <p className="border border-ink bg-ink px-4 py-3 text-sm text-white">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-ink px-6 py-4 text-sm font-black uppercase tracking-[0.22em] text-white transition hover:bg-graphite disabled:cursor-wait disabled:opacity-60"
      >
        {loading ? "Entrando" : "Entrar"}
      </button>
    </form>
  );
}
