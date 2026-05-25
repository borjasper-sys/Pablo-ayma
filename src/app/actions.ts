"use server";

import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type PaymentMethod = "DIRECT_DEBIT" | "CASH" | "CARD";

function asString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function asNumber(formData: FormData, key: string) {
  const value = Number(asString(formData, key));
  return Number.isFinite(value) ? value : 0;
}

function asDate(formData: FormData, key: string) {
  const value = asString(formData, key);
  return value ? new Date(value) : new Date();
}

async function requireMaster() {
  const session = await getServerSession(authOptions);

  if (session?.user?.role !== "MASTER") {
    throw new Error("No autorizado");
  }

  return session;
}

async function requireStaff() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.role) {
    throw new Error("No autorizado");
  }

  return session;
}

export async function createTrainer(formData: FormData) {
  await requireMaster();

  const name = asString(formData, "name");
  const surname = asString(formData, "surname");
  const email = asString(formData, "email");
  const phone = asString(formData, "phone");
  const password = asString(formData, "password");

  if (!name || !surname || !email || password.length < 8) {
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.user.create({
    data: {
      name: `${name} ${surname}`,
      email,
      passwordHash,
      role: "TRAINER",
      trainer: {
        create: {
          name,
          surname,
          email,
          phone,
          active: true
        }
      }
    }
  });

  revalidatePath("/entrenadores");
}

export async function createClassBonus(formData: FormData) {
  await requireMaster();

  const studentId = asString(formData, "studentId");
  const studentRateId = asString(formData, "studentRateId");
  const totalClasses = asNumber(formData, "totalClasses");
  const amountPaid = asNumber(formData, "amountPaid");

  if (!studentId || !studentRateId || totalClasses <= 0) {
    return;
  }

  await prisma.classBonus.create({
    data: {
      studentId,
      studentRateId,
      paymentDate: asDate(formData, "paymentDate"),
      amountPaid,
      totalClasses,
      remainingClasses: totalClasses,
      status: "ACTIVE"
    }
  });

  revalidatePath("/bonos");
}

export async function registerCollection(formData: FormData) {
  await requireMaster();

  const studentId = asString(formData, "studentId");

  if (!studentId) {
    return;
  }

  await prisma.collection.create({
    data: {
      studentId,
      bonusId: asString(formData, "bonusId") || undefined,
      date: asDate(formData, "date"),
      amount: asNumber(formData, "amount"),
      paymentMethod: (asString(formData, "paymentMethod") || "DIRECT_DEBIT") as PaymentMethod,
      notes: asString(formData, "notes")
    }
  });

  revalidatePath("/cobros");
}

export async function registerExpense(formData: FormData) {
  await requireMaster();

  const concept = asString(formData, "concept");

  if (!concept) {
    return;
  }

  await prisma.expense.create({
    data: {
      date: asDate(formData, "date"),
      concept,
      type: asString(formData, "type") || "General",
      amount: asNumber(formData, "amount"),
      linkedToClass: asString(formData, "linkedToClass") === "on",
      notes: asString(formData, "notes")
    }
  });

  revalidatePath("/gastos");
}

export async function createAvailability(formData: FormData) {
  const session = await requireStaff();
  const trainerId = asString(formData, "trainerId");
  const weekdays = formData.getAll("weekdays").map(String).join(",");

  if (!trainerId || !weekdays) {
    return;
  }

  if (session.user?.role === "TRAINER") {
    const trainer = await prisma.trainer.findFirst({
      where: { user: { email: session.user.email ?? "" } }
    });

    if (!trainer || trainer.id !== trainerId) {
      throw new Error("No autorizado");
    }
  }

  await prisma.trainerAvailability.create({
    data: {
      trainerId,
      startDate: asDate(formData, "startDate"),
      endDate: asDate(formData, "endDate"),
      weekdays,
      startTime: asString(formData, "startTime"),
      endTime: asString(formData, "endTime")
    }
  });

  revalidatePath("/disponibilidad");
}

export async function registerTrainingClass(formData: FormData) {
  const session = await requireStaff();
  const studentId = asString(formData, "studentId");
  const trainerId = asString(formData, "trainerId");
  const studentRateId = asString(formData, "studentRateId");
  const durationHours = asNumber(formData, "durationHours") || 1;
  const courtCost = asNumber(formData, "courtCost");

  if (!studentId || !trainerId || !studentRateId) {
    return;
  }

  if (session.user?.role === "TRAINER") {
    const trainer = await prisma.trainer.findFirst({
      where: { user: { email: session.user.email ?? "" } }
    });

    if (!trainer || trainer.id !== trainerId) {
      throw new Error("No autorizado");
    }
  }

  await prisma.$transaction(async (tx) => {
    const bonus = await tx.classBonus.findFirst({
      where: {
        studentId,
        studentRateId,
        status: "ACTIVE",
        remainingClasses: { gt: 0 }
      },
      orderBy: { paymentDate: "asc" }
    });

    const studentRate = await tx.studentRate.findUnique({ where: { id: studentRateId } });
    const trainerRate = await tx.trainerRate.findUnique({
      where: { trainerId_studentRateId: { trainerId, studentRateId } }
    });

    const accruedAmount = studentRate
      ? (studentRate.price / studentRate.numberOfClasses) * durationHours
      : 0;
    const trainerCost = (trainerRate?.pricePerHour ?? 0) * durationHours;

    await tx.trainingClass.create({
      data: {
        studentId,
        trainerId,
        studentRateId,
        date: asDate(formData, "date"),
        startTime: asString(formData, "startTime"),
        endTime: asString(formData, "endTime"),
        durationHours,
        court: asString(formData, "court"),
        courtCost,
        studentPaymentStatus: bonus ? "PAID" : "PENDING",
        accruedAmount,
        trainerCost,
        notes: asString(formData, "notes")
      }
    });

    if (bonus) {
      const remainingClasses = Math.max(bonus.remainingClasses - 1, 0);

      await tx.classBonus.update({
        where: { id: bonus.id },
        data: {
          consumedClasses: bonus.consumedClasses + 1,
          remainingClasses,
          status: remainingClasses === 0 ? "CONSUMED" : "ACTIVE"
        }
      });
    }
  });

  revalidatePath("/clases");
  revalidatePath("/bonos");
  revalidatePath("/resumen-economico");
}
