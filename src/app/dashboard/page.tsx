import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { DashboardView } from "@/components/DashboardView";
import { authOptions } from "@/lib/auth";
import type { Role } from "@/lib/erp";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <AppShell
      title={session.user?.role === "MASTER" ? "Dashboard Master" : "Dashboard Entrenador"}
      eyebrow="Pablo Aymà Gestión Deportiva"
    >
      <DashboardView role={(session.user?.role ?? "TRAINER") as Role} />
    </AppShell>
  );
}
