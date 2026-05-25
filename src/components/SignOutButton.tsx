"use client";

import { signOut } from "next-auth/react";

type SignOutButtonProps = {
  tone?: "light" | "dark";
};

export function SignOutButton({ tone = "light" }: SignOutButtonProps) {
  const isDark = tone === "dark";

  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/" })}
      className={`border px-5 py-3 text-xs font-bold uppercase tracking-[0.2em] transition ${
        isDark
          ? "border-white/25 text-white hover:bg-white hover:text-ink"
          : "border-ink text-ink hover:bg-ink hover:text-white"
      }`}
    >
      Salir
    </button>
  );
}
