"use client";

import { signOut } from "next-auth/react";

export function SignOutButton() {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/" })}
      className="border border-ink px-5 py-3 text-xs font-bold uppercase tracking-[0.2em] text-ink transition hover:bg-ink hover:text-white"
    >
      Salir
    </button>
  );
}
