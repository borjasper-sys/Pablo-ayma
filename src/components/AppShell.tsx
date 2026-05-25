import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import { BrandMark } from "@/components/BrandMark";
import { SignOutButton } from "@/components/SignOutButton";
import { authOptions } from "@/lib/auth";
import { masterModules, trainerModules, type Role } from "@/lib/erp";

type AppShellProps = {
  children: React.ReactNode;
  title: string;
  eyebrow?: string;
};

export async function AppShell({ children, title, eyebrow }: AppShellProps) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const role = (session.user?.role ?? "TRAINER") as Role;
  const navigation = role === "MASTER" ? masterModules : trainerModules;

  return (
    <main className="min-h-screen bg-court text-ink">
      <div className="grid min-h-screen lg:grid-cols-[18rem_1fr]">
        <aside className="border-b border-white/10 bg-ink px-6 py-6 text-white lg:border-b-0 lg:border-r">
          <div className="flex items-center justify-between gap-4 lg:block">
            <BrandMark tone="dark" />
            <div className="lg:hidden">
              <SignOutButton tone="dark" />
            </div>
          </div>

          <div className="mt-8 hidden border border-white/10 p-4 lg:block">
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.24em] text-white/45">
              Sesión
            </p>
            <p className="mt-3 text-sm font-black uppercase tracking-[0.12em]">
              {session.user?.name}
            </p>
            <p className="mt-2 text-xs uppercase tracking-[0.18em] text-white/50">
              {role === "MASTER" ? "Master" : "Entrenador"}
            </p>
          </div>

          <nav className="mt-8 flex gap-2 overflow-x-auto pb-2 lg:block lg:space-y-2 lg:overflow-visible lg:pb-0">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block shrink-0 border border-white/10 px-4 py-3 text-xs font-bold uppercase tracking-[0.16em] text-white/65 transition hover:border-white/35 hover:bg-white hover:text-ink lg:shrink"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>

        <section className="min-w-0 px-5 py-6 sm:px-8 lg:px-10">
          <header className="flex flex-col gap-5 border-b border-line pb-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.28em] text-ash">
                {eyebrow ?? "Pablo Aymà Gestión Deportiva"}
              </p>
              <h1 className="mt-4 text-4xl font-black uppercase leading-none tracking-normal text-ink sm:text-5xl">
                {title}
              </h1>
            </div>
            <div className="hidden lg:block">
              <SignOutButton />
            </div>
          </header>

          <div className="py-8">{children}</div>
        </section>
      </div>
    </main>
  );
}
