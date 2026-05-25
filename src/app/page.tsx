import Link from "next/link";
import { BrandMark } from "@/components/BrandMark";

export default function HomePage() {
  return (
    <main className="min-h-screen px-6 py-6 sm:px-10">
      <section className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-7xl flex-col">
        <header className="flex items-center justify-between border-b border-line pb-6">
          <BrandMark />
          <Link
            href="/login"
            className="border border-ink px-5 py-3 text-xs font-bold uppercase tracking-[0.2em] text-ink transition hover:bg-ink hover:text-white"
          >
            Login
          </Link>
        </header>

        <div className="grid flex-1 items-center gap-12 py-16 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.35em] text-ash">
              ERP deportivo
            </p>
            <h1 className="mt-8 max-w-5xl text-5xl font-black uppercase leading-[0.95] tracking-normal text-ink sm:text-7xl lg:text-8xl">
              Pablo Aymà Gestión Deportiva funcionando
            </h1>
            <p className="mt-8 max-w-2xl text-lg leading-8 text-graphite">
              Base operativa para coordinar academias, alumnos, sesiones,
              equipos y gestión interna con una experiencia sobria, clara y
              preparada para crecer.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/dashboard"
                className="bg-ink px-7 py-4 text-sm font-black uppercase tracking-[0.22em] text-white transition hover:bg-graphite"
              >
                Ir al dashboard
              </Link>
              <Link
                href="/login"
                className="border border-line bg-white px-7 py-4 text-sm font-black uppercase tracking-[0.22em] text-ink transition hover:border-ink"
              >
                Acceso Master
              </Link>
            </div>
          </div>

          <aside className="border border-line bg-white p-6 shadow-soft">
            <div className="aspect-[4/5] bg-ink p-6 text-white">
              <div className="flex h-full flex-col justify-between border border-white/20 p-6">
                <p className="text-xs font-bold uppercase tracking-[0.28em] text-white/60">
                  Padel Training
                </p>
                <div>
                  <p className="text-6xl font-black uppercase leading-none">
                    01
                  </p>
                  <p className="mt-5 max-w-xs text-sm uppercase leading-6 tracking-[0.2em] text-white/70">
                    Gestión interna, rendimiento y estructura para la academia.
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
