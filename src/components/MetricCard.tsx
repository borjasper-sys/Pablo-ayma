type MetricCardProps = {
  label: string;
  value: string;
  detail: string;
};

export function MetricCard({ label, value, detail }: MetricCardProps) {
  return (
    <article className="border border-line bg-white p-6 shadow-soft">
      <p className="text-xs font-bold uppercase tracking-[0.24em] text-ash">
        {label}
      </p>
      <p className="mt-5 text-4xl font-black tracking-normal text-ink">
        {value}
      </p>
      <p className="mt-3 text-sm leading-6 text-ash">{detail}</p>
    </article>
  );
}
