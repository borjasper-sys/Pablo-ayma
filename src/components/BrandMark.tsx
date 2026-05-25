type BrandMarkProps = {
  tone?: "light" | "dark";
};

export function BrandMark({ tone = "light" }: BrandMarkProps) {
  const isDark = tone === "dark";

  return (
    <div className="flex items-center gap-3">
      <div
        className={`grid h-11 w-11 place-items-center border text-sm font-black tracking-[0.2em] ${
          isDark
            ? "border-white bg-white text-ink"
            : "border-ink bg-ink text-white"
        }`}
      >
        PA
      </div>
      <div>
        <p
          className={`text-sm font-bold uppercase tracking-[0.22em] ${
            isDark ? "text-white" : "text-ink"
          }`}
        >
          Pablo Aymà
        </p>
        <p
          className={`text-xs uppercase tracking-[0.18em] ${
            isDark ? "text-white/55" : "text-ash"
          }`}
        >
          Gestión Deportiva
        </p>
      </div>
    </div>
  );
}
