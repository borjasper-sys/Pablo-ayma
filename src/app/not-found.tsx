import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center px-6 text-center">
      <div>
        <p className="text-sm font-black uppercase tracking-[0.35em] text-ash">
          404
        </p>
        <h1 className="mt-6 text-5xl font-black uppercase leading-none tracking-normal text-ink">
          Página no encontrada
        </h1>
        <Link
          href="/"
          className="mt-8 inline-block bg-ink px-7 py-4 text-sm font-black uppercase tracking-[0.22em] text-white"
        >
          Volver al inicio
        </Link>
      </div>
    </main>
  );
}
