import { DataTable } from "@/components/DataTable";
import { KpiGrid } from "@/components/KpiGrid";
import {
  masterDashboardMetrics,
  sampleData,
  trainerDashboardMetrics,
  type Role
} from "@/lib/erp";

export function DashboardView({ role }: { role: Role }) {
  const isMaster = role === "MASTER";
  const metrics = isMaster ? masterDashboardMetrics : trainerDashboardMetrics;

  return (
    <div className="space-y-8">
      <section className="border border-line bg-white p-6 shadow-soft">
        <p className="text-xs font-black uppercase tracking-[0.24em] text-ash">
          {isMaster ? "Dashboard Master" : "Dashboard Entrenador"}
        </p>
        <h2 className="mt-4 max-w-4xl text-4xl font-black uppercase leading-none tracking-normal text-ink">
          Gestión de club, escuela, clases y resultado económico.
        </h2>
        <p className="mt-5 max-w-3xl text-sm leading-7 text-graphite">
          El panel separa caja y devengo, conserva históricos, controla bonos y
          limita la visibilidad de alumnos por rol. La base queda preparada para
          pistas, reservas, facturación y domiciliaciones SEPA.
        </p>
      </section>

      <KpiGrid metrics={metrics} />

      <div className="grid gap-8 xl:grid-cols-2">
        <DataTable
          title={isMaster ? "Bonos agotándose" : "Mis alumnos con seguimiento"}
          rows={sampleData.bonuses.map((bonus) => ({
            Alumno: bonus.student,
            Tarifa: bonus.rate,
            Restantes: String(bonus.remaining),
            Estado: bonus.status
          }))}
        />
        <DataTable
          title={isMaster ? "Ratio ocupación por entrenador" : "Disponibilidad"}
          rows={
            isMaster
              ? sampleData.trainers.map((trainer) => ({
                  Entrenador: trainer.name,
                  Estado: trainer.active,
                  Ocupación: `${trainer.occupancy}%`
                }))
              : sampleData.availability
          }
        />
      </div>
    </div>
  );
}
