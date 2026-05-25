import { GameLevelManager, StudentRateManager, TrainerRateManager } from "@/components/ManagementForms";
import { StudentManager, TrainerManager } from "@/components/PeopleManagementForms";
import { KpiGrid } from "@/components/KpiGrid";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import type { ErpModule, Role } from "@/lib/erp";

const money = (value: number) =>
  new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0
  }).format(value);

function Header({ moduleItem }: { moduleItem: ErpModule }) {
  return (
    <section className="border border-line bg-white p-6 shadow-soft">
      <p className="text-xs font-black uppercase tracking-[0.24em] text-ash">
        {moduleItem.eyebrow}
      </p>
      <h2 className="mt-4 text-3xl font-black uppercase tracking-normal text-ink">
        {moduleItem.title}
      </h2>
      <p className="mt-4 max-w-3xl text-sm leading-7 text-graphite">
        {moduleItem.description}
      </p>
    </section>
  );
}

export async function ManagementModulePage({ moduleItem }: { moduleItem: ErpModule }) {
  if (moduleItem.slug === "entrenadores") {
    const trainers = await prisma.trainer.findMany({
      include: { _count: { select: { students: true } } },
      orderBy: [{ active: "desc" }, { name: "asc" }, { surname: "asc" }]
    });
    const activeTrainers = trainers.filter((trainer) => trainer.active).length;

    return (
      <div className="space-y-8">
        <Header moduleItem={moduleItem} />
        <KpiGrid
          metrics={[
            { label: "Entrenadores", value: String(trainers.length), detail: "Total de perfiles creados." },
            { label: "Activos", value: String(activeTrainers), detail: "Con acceso vigente al ERP." },
            {
              label: "Alumnos vinculados",
              value: String(trainers.reduce((sum, trainer) => sum + trainer._count.students, 0)),
              detail: "Alumnos asignados al equipo técnico."
            }
          ]}
        />
        <TrainerManager
          trainers={trainers.map((trainer) => ({
            id: trainer.id,
            userId: trainer.userId,
            name: trainer.name,
            surname: trainer.surname,
            phone: trainer.phone,
            email: trainer.email,
            active: trainer.active,
            studentsCount: trainer._count.students
          }))}
        />
      </div>
    );
  }

  if (moduleItem.slug === "alumnos") {
    const session = await getServerSession(authOptions);
    const role = (session?.user?.role ?? "TRAINER") as Role;
    const trainerProfile =
      role === "TRAINER"
        ? await prisma.trainer.findFirst({
            where: { user: { email: session?.user?.email ?? "" } },
            select: { id: true }
          })
        : null;
    const where = trainerProfile ? { trainerId: trainerProfile.id } : {};
    const [students, trainers, gameLevels] = await Promise.all([
      prisma.student.findMany({
        where,
        include: {
          trainer: true,
          gameLevel: true,
          bonuses: { select: { remainingClasses: true, status: true } }
        },
        orderBy: [{ active: "desc" }, { surname: "asc" }, { name: "asc" }]
      }),
      prisma.trainer.findMany({
        where: { active: true },
        orderBy: [{ name: "asc" }, { surname: "asc" }]
      }),
      prisma.gameLevel.findMany({
        where: { active: true },
        orderBy: [{ order: "asc" }, { name: "asc" }]
      })
    ]);
    const activeStudents = students.filter((student) => student.active).length;
    const criticalBonuses = students.filter((student) =>
      student.bonuses.some((bonus) => bonus.status === "ACTIVE" && bonus.remainingClasses <= 2)
    ).length;

    return (
      <div className="space-y-8">
        <Header moduleItem={moduleItem} />
        <KpiGrid
          metrics={[
            { label: "Alumnos", value: String(students.length), detail: role === "MASTER" ? "Total visible para dirección." : "Alumnos asignados." },
            { label: "Activos", value: String(activeStudents), detail: "Alumnos en seguimiento." },
            { label: "Bonos agotándose", value: String(criticalBonuses), detail: "Bonos activos con 2 clases o menos." }
          ]}
        />
        <StudentManager
          role={role}
          trainers={trainers.map((trainer) => ({
            id: trainer.id,
            userId: trainer.userId,
            name: trainer.name,
            surname: trainer.surname,
            phone: trainer.phone,
            email: trainer.email,
            active: trainer.active
          }))}
          gameLevels={gameLevels.map((level) => ({ id: level.id, name: level.name }))}
          students={students.map((student) => ({
            id: student.id,
            trainerId: student.trainerId,
            name: student.name,
            surname: student.surname,
            city: student.city,
            paymentMethod: student.paymentMethod,
            iban: student.iban,
            registrationDate: student.registrationDate.toISOString(),
            birthDate: student.birthDate?.toISOString() ?? null,
            sex: student.sex,
            gameLevelId: student.gameLevelId,
            active: student.active,
            cancellationDate: student.cancellationDate?.toISOString() ?? null,
            trainerName: `${student.trainer.name} ${student.trainer.surname}`,
            levelName: student.gameLevel?.name ?? "Sin nivel",
            remainingClasses: student.bonuses
              .filter((bonus) => bonus.status === "ACTIVE")
              .reduce((sum, bonus) => sum + bonus.remainingClasses, 0)
          }))}
        />
      </div>
    );
  }

  if (moduleItem.slug === "parametros") {
    const levels = await prisma.gameLevel.findMany({
      orderBy: [{ order: "asc" }, { name: "asc" }]
    });
    const activeLevels = levels.filter((level) => level.active).length;

    return (
      <div className="space-y-8">
        <Header moduleItem={moduleItem} />
        <KpiGrid
          metrics={[
            { label: "Niveles", value: String(levels.length), detail: "Total de niveles creados." },
            { label: "Activos", value: String(activeLevels), detail: "Disponibles para asignar a alumnos." },
            { label: "Inactivos", value: String(levels.length - activeLevels), detail: "Conservados en histórico." }
          ]}
        />
        <GameLevelManager levels={levels} />
      </div>
    );
  }

  if (moduleItem.slug === "tarifas-alumnos") {
    const rates = await prisma.studentRate.findMany({
      orderBy: [{ active: "desc" }, { name: "asc" }]
    });
    const activeRates = rates.filter((rate) => rate.active);
    const averagePrice =
      activeRates.length > 0
        ? activeRates.reduce((sum, rate) => sum + rate.price, 0) / activeRates.length
        : 0;

    return (
      <div className="space-y-8">
        <Header moduleItem={moduleItem} />
        <KpiGrid
          metrics={[
            { label: "Tarifas", value: String(rates.length), detail: "Total configurado." },
            { label: "Activas", value: String(activeRates.length), detail: "Disponibles para nuevos bonos." },
            { label: "Precio medio", value: money(averagePrice), detail: "Media de tarifas activas." }
          ]}
        />
        <StudentRateManager rates={rates} />
      </div>
    );
  }

  const [trainers, studentRates, trainerRates] = await Promise.all([
    prisma.trainer.findMany({ where: { active: true }, orderBy: [{ name: "asc" }, { surname: "asc" }] }),
    prisma.studentRate.findMany({ where: { active: true }, orderBy: { name: "asc" } }),
    prisma.trainerRate.findMany({
      include: { trainer: true, studentRate: true },
      orderBy: [{ trainer: { name: "asc" } }, { studentRate: { name: "asc" } }]
    })
  ]);

  const averageCost =
    trainerRates.length > 0
      ? trainerRates.reduce((sum, rate) => sum + rate.pricePerHour, 0) / trainerRates.length
      : 0;

  return (
    <div className="space-y-8">
      <Header moduleItem={moduleItem} />
      <KpiGrid
        metrics={[
          { label: "Reglas", value: String(trainerRates.length), detail: "Combinaciones entrenador/tarifa." },
          { label: "Entrenadores", value: String(trainers.length), detail: "Entrenadores activos." },
          { label: "Coste medio", value: money(averageCost), detail: "Media por hora configurada." }
        ]}
      />
      <TrainerRateManager
        trainers={trainers}
        studentRates={studentRates}
        trainerRates={trainerRates.map((rate) => ({
          id: rate.id,
          trainerId: rate.trainerId,
          studentRateId: rate.studentRateId,
          pricePerHour: rate.pricePerHour,
          trainerName: `${rate.trainer.name} ${rate.trainer.surname}`,
          studentRateName: rate.studentRate.name
        }))}
      />
    </div>
  );
}
