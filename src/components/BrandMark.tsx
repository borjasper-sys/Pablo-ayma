import Image from "next/image";

type BrandMarkProps = {
  tone?: "light" | "dark";
};

export function BrandMark({ tone = "light" }: BrandMarkProps) {
  const isDark = tone === "dark";

  return (
    <div className="flex items-center gap-3">
      <div className={isDark ? "bg-transparent" : "bg-ink px-3 py-2"}>
        <Image
          src="/logo-light-pabloayma.png"
          alt="Pablo Aymà"
          width={178}
          height={42}
          priority
          className="h-auto w-36"
        />
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
