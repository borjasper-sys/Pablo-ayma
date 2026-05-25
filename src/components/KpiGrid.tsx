import { MetricCard } from "@/components/MetricCard";

type KpiGridProps = {
  metrics: Array<{ label: string; value: string; detail: string }>;
};

export function KpiGrid({ metrics }: KpiGridProps) {
  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {metrics.map((metric) => (
        <MetricCard
          key={metric.label}
          label={metric.label}
          value={metric.value}
          detail={metric.detail}
        />
      ))}
    </section>
  );
}
