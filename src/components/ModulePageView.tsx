import { DataTable } from "@/components/DataTable";
import { KpiGrid } from "@/components/KpiGrid";
import { ModuleForm } from "@/components/ModuleForm";
import { PdfActions } from "@/components/PdfActions";
import type { ErpModule } from "@/lib/erp";

export function ModulePageView({ moduleItem }: { moduleItem: ErpModule }) {
  return (
    <div className="space-y-8">
      <section className="grid gap-6 xl:grid-cols-[1fr_22rem]">
        <div className="border border-line bg-white p-6 shadow-soft">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-ash">
            {moduleItem.eyebrow}
          </p>
          <h2 className="mt-4 text-3xl font-black uppercase tracking-normal text-ink">
            {moduleItem.title}
          </h2>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-graphite">
            {moduleItem.description}
          </p>
          {moduleItem.slug === "informes-pdf" ? (
            <div className="mt-6">
              <PdfActions />
            </div>
          ) : null}
        </div>

        <aside className="border border-line bg-ink p-6 text-white shadow-soft">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-white/45">
            Funcionalidad
          </p>
          <ul className="mt-5 space-y-4">
            {moduleItem.actions.map((action) => (
              <li
                key={action}
                className="border-b border-white/10 pb-4 text-sm font-medium leading-6 text-white/75 last:border-b-0 last:pb-0"
              >
                {action}
              </li>
            ))}
          </ul>
        </aside>
      </section>

      <KpiGrid metrics={moduleItem.metrics} />
      <ModuleForm slug={moduleItem.slug} />
      <DataTable title={moduleItem.tableTitle} rows={moduleItem.rows} />
    </div>
  );
}
