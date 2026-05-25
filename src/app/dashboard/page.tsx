import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { BrandMark } from "@/components/BrandMark";
import { MetricCard } from "@/components/MetricCard";
import { SignOutButton } from "@/components/SignOutButton";
import { authOptions } from "@/lib/auth";

const modules = [
  "Academias",
  "Alumnos",
  "Clases",
  "Monitores",
  "Eventos",
  "Facturación"
];

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen px-6 py-6 sm:px-10">
      <section className="mx-auto max-w-7xl">
        <header className="flex flex-col gap-6 border-b border-line pb-6 sm:flex-row sm:items-center sm:justify-between">
          <BrandMark />
          <SignOutButton />
        </header>

        <section className="py-12">
          <p className="text-sm font-black uppercase tracking-[0.35em] text-ash">
            Dashboard
          </p>
          <div className="mt-7 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="max-w-4xl text-5xl font-black uppercase leading-none tracking-normal text-ink sm:text-7xl">
                Control deportivo y operativo.
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-graphite">
                Bienvenido, {session.user?.name}. Esta es la base del ERP para
                centralizar actividad, alumnos, equipo técnico y datos de
                gestión.
              </p>
            </div>
            <div className="border border-line bg-white px-5 py-4 text-xs font-bold uppercase tracking-[0.2em] text-ash">
              Rol: {session.user?.role ?? "STAFF"}
            </div>
          </div>
        </section>

        <section className="grid gap-5 md:grid-cols-3">
          <MetricCard
            label="Academias"
            value="05"
            detail="Estructura preparada para gestionar sedes y centros asociados."
          />
          <MetricCard
            label="Sesiones"
            value="128"
            detail="Vista inicial para el seguimiento semanal de entrenamiento."
          />
          <MetricCard
            label="Ocupación"
            value="84%"
            detail="Indicador provisional para medir capacidad deportiva."
          />
        </section>

        <section className="mt-10 border border-line bg-white p-6 shadow-soft">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-ash">
                Módulos
              </p>
              <h2 className="mt-3 text-3xl font-black uppercase tracking-normal text-ink">
                Estructura inicial
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-ash">
              Estos bloques son la primera capa del ERP. A partir de aquí se
              pueden añadir CRUDs, permisos, calendarios y reporting.
            </p>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {modules.map((moduleName) => (
              <div
                key={moduleName}
                className="border border-line bg-court px-5 py-5 text-sm font-black uppercase tracking-[0.2em] text-graphite"
              >
                {moduleName}
              </div>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
