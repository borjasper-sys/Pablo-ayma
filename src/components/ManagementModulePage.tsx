import { GameLevelManager, StudentRateManager, TrainerRateManager } from "@/components/ManagementForms";
import { KpiGrid } from "@/components/KpiGrid";
import { prisma } from "@/lib/prisma";
import type { ErpModule } from "@/lib/erp";

const money = (value: number) =>
  new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0
  }).format(value);

function Header({ moduleItem }: { moduleItem: ErpModule }) {
  return (
    <section className="border border-line bg-white p-6 shadow-soft">
      <p className="text-xs font-black uppercase tracking-[0.24em] text-ash">
        {moduleItem.eyebrow}
      </p>
      <h2 className="mt-4 text-3xl font-black uppercase tracking-normal text-ink">
        {moduleItem.title}
      </h2>
      <p className="mt-4 max-w-3xl text-sm leading-7 text-graphite">
        {moduleItem.description}
      </p>
    </section>
  );
}

export async function ManagementModulePage({ moduleItem }: { moduleItem: ErpModule }) {
  if (moduleItem.slug === "parametros") {
    const levels = await prisma.gameLevel.findMany({
      orderBy: [{ order: "asc" }, { name: "asc" }]
    });
    const activeLevels = levels.filter((level) => level.active).length;

    return (
      <div className="space-y-8">
        <Header moduleItem={moduleItem} />
        <KpiGrid
          metrics={[
            { label: "Niveles", value: String(levels.length), detail: "Total de niveles creados." },
            { label: "Activos", value: String(activeLevels), detail: "Disponibles para asignar a alumnos." },
            { label: "Inactivos", value: String(levels.length - activeLevels), detail: "Conservados en histórico." }
          ]}
        />
        <GameLevelManager levels={levels} />
      </div>
    );
  }

  if (moduleItem.slug === "tarifas-alumnos") {
    const rates = await prisma.studentRate.findMany({
      orderBy: [{ active: "desc" }, { name: "asc" }]
    });
    const activeRates = rates.filter((rate) => rate.active);
    const averagePrice =
      activeRates.length > 0
        ? activeRates.reduce((sum, rate) => sum + rate.price, 0) / activeRates.length
        : 0;

    return (
      <div className="space-y-8">
        <Header moduleItem={moduleItem} />
        <KpiGrid
          metrics={[
            { label: "Tarifas", value: String(rates.length), detail: "Total configurado." },
            { label: "Activas", value: String(activeRates.length), detail: "Disponibles para nuevos bonos." },
            { label: "Precio medio", value: money(averagePrice), detail: "Media de tarifas activas." }
          ]}
        />
        <StudentRateManager rates={rates} />
      </div>
    );
  }

  const [trainers, studentRates, trainerRates] = await Promise.all([
    prisma.trainer.findMany({ where: { active: true }, orderBy: [{ name: "asc" }, { surname: "asc" }] }),
    prisma.studentRate.findMany({ where: { active: true }, orderBy: { name: "asc" } }),
    prisma.trainerRate.findMany({
      include: { trainer: true, studentRate: true },
      orderBy: [{ trainer: { name: "asc" } }, { studentRate: { name: "asc" } }]
    })
  ]);

  const averageCost =
    trainerRates.length > 0
      ? trainerRates.reduce((sum, rate) => sum + rate.pricePerHour, 0) / trainerRates.length
      : 0;

  return (
    <div className="space-y-8">
      <Header moduleItem={moduleItem} />
      <KpiGrid
        metrics={[
          { label: "Reglas", value: String(trainerRates.length), detail: "Combinaciones entrenador/tarifa." },
          { label: "Entrenadores", value: String(trainers.length), detail: "Entrenadores activos." },
          { label: "Coste medio", value: money(averageCost), detail: "Media por hora configurada." }
        ]}
      />
      <TrainerRateManager
        trainers={trainers}
        studentRates={studentRates}
        trainerRates={trainerRates.map((rate) => ({
          id: rate.id,
          trainerId: rate.trainerId,
          studentRateId: rate.studentRateId,
          pricePerHour: rate.pricePerHour,
          trainerName: `${rate.trainer.name} ${rate.trainer.surname}`,
          studentRateName: rate.studentRate.name
        }))}
      />
    </div>
  );
}
