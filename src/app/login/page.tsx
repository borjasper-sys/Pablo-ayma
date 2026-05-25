import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { BrandMark } from "@/components/BrandMark";
import { LoginForm } from "@/components/LoginForm";
import { authOptions } from "@/lib/auth";

export default async function LoginPage() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/dashboard");
  }

  return (
    <main className="grid min-h-screen lg:grid-cols-[0.9fr_1.1fr]">
      <section className="flex min-h-screen flex-col justify-between bg-ink px-8 py-8 text-white sm:px-12">
        <BrandMark tone="dark" />
        <div className="py-16">
          <p className="text-sm font-black uppercase tracking-[0.35em] text-white/50">
            Acceso privado
          </p>
          <h1 className="mt-8 max-w-2xl text-5xl font-black uppercase leading-none tracking-normal sm:text-7xl">
            Gestión con pulso de pista.
          </h1>
        </div>
        <p className="max-w-md text-sm uppercase leading-7 tracking-[0.18em] text-white/50">
          Panel inicial para dirección, coordinación deportiva y administración.
        </p>
      </section>

      <section className="flex min-h-screen items-center justify-center px-6 py-16">
        <div className="w-full max-w-md border border-line bg-white p-8 shadow-soft sm:p-10">
          <Link
            href="/"
            className="text-xs font-bold uppercase tracking-[0.22em] text-ash transition hover:text-ink"
          >
            Volver
          </Link>
          <h2 className="mt-8 text-4xl font-black uppercase leading-none tracking-normal text-ink">
            Entrar
          </h2>
          <p className="mt-5 text-sm leading-7 text-ash">
            Usa el usuario Master para acceder al dashboard inicial.
          </p>
          <LoginForm />
        </div>
      </section>
    </main>
  );
}
