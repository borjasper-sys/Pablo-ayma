"use client";

export function PdfActions() {
  return (
    <div className="flex flex-wrap gap-3">
      <button
        type="button"
        onClick={() => window.print()}
        className="bg-ink px-5 py-3 text-xs font-black uppercase tracking-[0.2em] text-white transition hover:bg-graphite"
      >
        Generar PDF cobros
      </button>
      <button
        type="button"
        onClick={() => window.print()}
        className="border border-ink px-5 py-3 text-xs font-black uppercase tracking-[0.2em] text-ink transition hover:bg-ink hover:text-white"
      >
        Generar PDF alumno
      </button>
    </div>
  );
}
