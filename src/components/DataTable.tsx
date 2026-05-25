type DataTableProps = {
  title: string;
  rows: Array<Record<string, string>>;
};

export function DataTable({ title, rows }: DataTableProps) {
  const columns = rows[0] ? Object.keys(rows[0]) : [];

  return (
    <section className="border border-line bg-white p-5 shadow-soft">
      <div className="flex flex-col gap-2 border-b border-line pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-ash">
            Vista operativa
          </p>
          <h2 className="mt-2 text-2xl font-black uppercase tracking-normal text-ink">
            {title}
          </h2>
        </div>
        <p className="text-sm text-ash">{rows.length} registros</p>
      </div>

      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[720px] border-collapse text-left text-sm">
          <thead>
            <tr>
              {columns.map((column) => (
                <th
                  key={column}
                  className="border-b border-line pb-3 pr-5 text-xs font-black uppercase tracking-[0.18em] text-ash"
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={index} className="border-b border-line last:border-b-0">
                {columns.map((column) => (
                  <td key={column} className="py-4 pr-5 font-medium text-graphite">
                    {row[column]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
