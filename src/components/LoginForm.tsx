"use client";

import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
        <div className="relative mt-3">
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            required
            className="w-full border border-line bg-court px-4 py-4 pr-14 text-base text-ink outline-none transition focus:border-ink"
            placeholder="********"
          />
          <button
            type="button"
            aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            aria-pressed={showPassword}
            onClick={() => setShowPassword((visible) => !visible)}
            className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center text-ash transition hover:text-ink focus:outline-none focus:ring-2 focus:ring-ink focus:ring-offset-2 focus:ring-offset-court"
          >
            {showPassword ? (
              <EyeOff aria-hidden="true" size={20} strokeWidth={1.8} />
            ) : (
              <Eye aria-hidden="true" size={20} strokeWidth={1.8} />
            )}
          </button>
        </div>
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
