import { getServerSession } from "next-auth";
import { notFound, redirect } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { ModulePageView } from "@/components/ModulePageView";
import { authOptions } from "@/lib/auth";
import { findModule, modules, type Role } from "@/lib/erp";

export function generateStaticParams() {
  return modules.map((moduleItem) => ({ module: moduleItem.slug }));
}

export default async function ModulePage({
  params
}: {
  params: Promise<{ module: string }>;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const { module: slug } = await params;
  const moduleItem = findModule(slug);

  if (!moduleItem) {
    notFound();
  }

  const role = (session.user?.role ?? "TRAINER") as Role;

  if (!moduleItem.roles.includes(role)) {
    redirect("/dashboard");
  }

  return (
    <AppShell title={moduleItem.title} eyebrow={moduleItem.eyebrow}>
      <ModulePageView moduleItem={moduleItem} />
    </AppShell>
  );
}
