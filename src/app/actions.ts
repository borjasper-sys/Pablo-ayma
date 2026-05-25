"use server";

import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type PaymentMethod = "DIRECT_DEBIT" | "CASH" | "CARD";
export type ActionState = {
  ok: boolean;
  message: string;
};

const actionError = (message: string): ActionState => ({ ok: false, message });
const actionSuccess = (message: string): ActionState => ({ ok: true, message });

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

function asOptionalDate(formData: FormData, key: string) {
  const value = asString(formData, key);
  return value ? new Date(value) : null;
}

async function requireMaster() {
  const session = await getServerSession(authOptions);

  if (session?.user?.role !== "MASTER") {
    throw new Error("No autorizado");
  }

  return session;
}

async function withMasterAction(action: () => Promise<ActionState>) {
  try {
    await requireMaster();
    return await action();
  } catch (error) {
    return actionError(error instanceof Error ? error.message : "No se pudo completar la acción.");
  }
}

async function requireStaff() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.role) {
    throw new Error("No autorizado");
  }

  return session;
}

async function currentTrainerId() {
  const session = await requireStaff();

  if (session.user?.role !== "TRAINER") {
    return null;
  }

  const trainer = await prisma.trainer.findFirst({
    where: { user: { email: session.user.email ?? "" } },
    select: { id: true }
  });

  if (!trainer) {
    throw new Error("No se ha encontrado el perfil del entrenador.");
  }

  return trainer.id;
}

async function assertStudentAccess(studentId: string) {
  const trainerId = await currentTrainerId();

  if (!trainerId) {
    return;
  }

  const student = await prisma.student.findFirst({
    where: { id: studentId, trainerId },
    select: { id: true }
  });

  if (!student) {
    throw new Error("No autorizado");
  }
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

export async function createTrainerProfile(
  _state: ActionState,
  formData: FormData
): Promise<ActionState> {
  return withMasterAction(async () => {
    const name = asString(formData, "name");
    const surname = asString(formData, "surname");
    const email = asString(formData, "email");
    const phone = asString(formData, "phone");
    const password = asString(formData, "password");

    if (!name || !surname || !email || password.length < 8) {
      return actionError("Nombre, apellidos, email y una contraseña de 8 caracteres son obligatorios.");
    }

    const existing = await prisma.user.findUnique({ where: { email } });

    if (existing) {
      return actionError("Ya existe un usuario con ese email.");
    }

    const passwordHash = await bcrypt.hash(password, 12);

    await prisma.user.create({
      data: {
        name: `${name} ${surname}`,
        email,
        passwordHash,
        role: "TRAINER",
        active: true,
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
    return actionSuccess("Entrenador creado con acceso privado.");
  });
}

export async function updateTrainerProfile(
  _state: ActionState,
  formData: FormData
): Promise<ActionState> {
  return withMasterAction(async () => {
    const id = asString(formData, "id");
    const userId = asString(formData, "userId");
    const name = asString(formData, "name");
    const surname = asString(formData, "surname");
    const email = asString(formData, "email");
    const phone = asString(formData, "phone");
    const password = asString(formData, "password");
    const active = asString(formData, "active") === "true";

    if (!id || !userId || !name || !surname || !email) {
      return actionError("Nombre, apellidos y email son obligatorios.");
    }

    const passwordData = password ? { passwordHash: await bcrypt.hash(password, 12) } : {};

    await prisma.$transaction([
      prisma.trainer.update({
        where: { id },
        data: { name, surname, email, phone, active }
      }),
      prisma.user.update({
        where: { id: userId },
        data: {
          name: `${name} ${surname}`,
          email,
          active,
          ...passwordData
        }
      })
    ]);

    revalidatePath("/entrenadores");
    return actionSuccess("Entrenador actualizado.");
  });
}

export async function toggleTrainerProfile(
  _state: ActionState,
  formData: FormData
): Promise<ActionState> {
  return withMasterAction(async () => {
    const id = asString(formData, "id");
    const userId = asString(formData, "userId");
    const active = asString(formData, "active") === "true";

    if (!id || !userId) {
      return actionError("Falta el entrenador.");
    }

    await prisma.$transaction([
      prisma.trainer.update({ where: { id }, data: { active: !active } }),
      prisma.user.update({ where: { id: userId }, data: { active: !active } })
    ]);

    revalidatePath("/entrenadores");
    return actionSuccess(active ? "Entrenador desactivado." : "Entrenador activado.");
  });
}

export async function createStudentProfile(
  _state: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const trainerFromSession = await currentTrainerId();
    const trainerId = trainerFromSession ?? asString(formData, "trainerId");
    const name = asString(formData, "name");
    const surname = asString(formData, "surname");

    if (!trainerId || !name || !surname) {
      return actionError("Entrenador, nombre y apellidos son obligatorios.");
    }

    await prisma.student.create({
      data: {
        trainerId,
        name,
        surname,
        city: asString(formData, "city"),
        paymentMethod: (asString(formData, "paymentMethod") || "DIRECT_DEBIT") as PaymentMethod,
        iban: asString(formData, "iban"),
        registrationDate: asDate(formData, "registrationDate"),
        birthDate: asOptionalDate(formData, "birthDate"),
        sex: asString(formData, "sex"),
        gameLevelId: asString(formData, "gameLevelId") || null,
        active: true
      }
    });

    revalidatePath("/alumnos");
    return actionSuccess("Alumno creado.");
  } catch (error) {
    return actionError(error instanceof Error ? error.message : "No se pudo crear el alumno.");
  }
}

export async function updateStudentProfile(
  _state: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    await requireStaff();
    const id = asString(formData, "id");
    const name = asString(formData, "name");
    const surname = asString(formData, "surname");

    if (!id || !name || !surname) {
      return actionError("Nombre y apellidos son obligatorios.");
    }

    await assertStudentAccess(id);

    const trainerFromSession = await currentTrainerId();
    const trainerId = trainerFromSession ?? asString(formData, "trainerId");
    const active = asString(formData, "active") === "true";

    if (!trainerId) {
      return actionError("Selecciona un entrenador.");
    }

    await prisma.student.update({
      where: { id },
      data: {
        trainerId,
        name,
        surname,
        city: asString(formData, "city"),
        paymentMethod: (asString(formData, "paymentMethod") || "DIRECT_DEBIT") as PaymentMethod,
        iban: asString(formData, "iban"),
        registrationDate: asDate(formData, "registrationDate"),
        birthDate: asOptionalDate(formData, "birthDate"),
        sex: asString(formData, "sex"),
        gameLevelId: asString(formData, "gameLevelId") || null,
        active,
        cancellationDate: active ? null : asOptionalDate(formData, "cancellationDate") ?? new Date()
      }
    });

    revalidatePath("/alumnos");
    return actionSuccess("Alumno actualizado.");
  } catch (error) {
    return actionError(error instanceof Error ? error.message : "No se pudo actualizar el alumno.");
  }
}

export async function toggleStudentProfile(
  _state: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    await requireStaff();
    const id = asString(formData, "id");
    const active = asString(formData, "active") === "true";

    if (!id) {
      return actionError("Falta el alumno.");
    }

    await assertStudentAccess(id);

    await prisma.student.update({
      where: { id },
      data: {
        active: !active,
        cancellationDate: active ? new Date() : null
      }
    });

    revalidatePath("/alumnos");
    return actionSuccess(active ? "Alumno dado de baja y conservado en histórico." : "Alumno reactivado.");
  } catch (error) {
    return actionError(error instanceof Error ? error.message : "No se pudo cambiar el estado del alumno.");
  }
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

export async function createGameLevel(
  _state: ActionState,
  formData: FormData
): Promise<ActionState> {
  return withMasterAction(async () => {
    const name = asString(formData, "name");

    if (!name) {
      return actionError("El nombre del nivel es obligatorio.");
    }

    await prisma.gameLevel.create({
      data: {
        name,
        description: asString(formData, "description"),
        order: asNumber(formData, "order"),
        active: true
      }
    });

    revalidatePath("/parametros");
    return actionSuccess("Nivel de juego creado.");
  });
}

export async function updateGameLevel(
  _state: ActionState,
  formData: FormData
): Promise<ActionState> {
  return withMasterAction(async () => {
    const id = asString(formData, "id");
    const name = asString(formData, "name");

    if (!id || !name) {
      return actionError("Nombre e identificador son obligatorios.");
    }

    await prisma.gameLevel.update({
      where: { id },
      data: {
        name,
        description: asString(formData, "description"),
        order: asNumber(formData, "order"),
        active: asString(formData, "active") === "true"
      }
    });

    revalidatePath("/parametros");
    return actionSuccess("Nivel de juego actualizado.");
  });
}

export async function toggleGameLevel(
  _state: ActionState,
  formData: FormData
): Promise<ActionState> {
  return withMasterAction(async () => {
    const id = asString(formData, "id");
    const active = asString(formData, "active") === "true";

    if (!id) {
      return actionError("Falta el nivel de juego.");
    }

    await prisma.gameLevel.update({
      where: { id },
      data: { active: !active }
    });

    revalidatePath("/parametros");
    return actionSuccess(active ? "Nivel desactivado." : "Nivel activado.");
  });
}

export async function createStudentRate(
  _state: ActionState,
  formData: FormData
): Promise<ActionState> {
  return withMasterAction(async () => {
    const name = asString(formData, "name");
    const category = asString(formData, "category");
    const price = asNumber(formData, "price");
    const numberOfClasses = asNumber(formData, "numberOfClasses");

    if (!name || !category || price <= 0 || numberOfClasses <= 0) {
      return actionError("Nombre, categoría, precio y clases son obligatorios.");
    }

    await prisma.studentRate.create({
      data: { name, category, price, numberOfClasses, active: true }
    });

    revalidatePath("/tarifas-alumnos");
    return actionSuccess("Tarifa de alumno creada.");
  });
}

export async function updateStudentRate(
  _state: ActionState,
  formData: FormData
): Promise<ActionState> {
  return withMasterAction(async () => {
    const id = asString(formData, "id");
    const name = asString(formData, "name");
    const category = asString(formData, "category");
    const price = asNumber(formData, "price");
    const numberOfClasses = asNumber(formData, "numberOfClasses");

    if (!id || !name || !category || price <= 0 || numberOfClasses <= 0) {
      return actionError("Todos los campos de la tarifa son obligatorios.");
    }

    await prisma.studentRate.update({
      where: { id },
      data: {
        name,
        category,
        price,
        numberOfClasses,
        active: asString(formData, "active") === "true"
      }
    });

    revalidatePath("/tarifas-alumnos");
    return actionSuccess("Tarifa de alumno actualizada.");
  });
}

export async function toggleStudentRate(
  _state: ActionState,
  formData: FormData
): Promise<ActionState> {
  return withMasterAction(async () => {
    const id = asString(formData, "id");
    const active = asString(formData, "active") === "true";

    if (!id) {
      return actionError("Falta la tarifa.");
    }

    await prisma.studentRate.update({
      where: { id },
      data: { active: !active }
    });

    revalidatePath("/tarifas-alumnos");
    return actionSuccess(active ? "Tarifa desactivada." : "Tarifa activada.");
  });
}

export async function upsertTrainerRate(
  _state: ActionState,
  formData: FormData
): Promise<ActionState> {
  return withMasterAction(async () => {
    const id = asString(formData, "id");
    const trainerId = asString(formData, "trainerId");
    const studentRateId = asString(formData, "studentRateId");
    const pricePerHour = asNumber(formData, "pricePerHour");

    if ((!id && (!trainerId || !studentRateId)) || pricePerHour <= 0) {
      return actionError("Entrenador, tarifa y precio/hora son obligatorios.");
    }

    if (id) {
      await prisma.trainerRate.update({
        where: { id },
        data: { pricePerHour }
      });
    } else {
      await prisma.trainerRate.upsert({
        where: { trainerId_studentRateId: { trainerId, studentRateId } },
        update: { pricePerHour },
        create: { trainerId, studentRateId, pricePerHour }
      });
    }

    revalidatePath("/tarifas-entrenadores");
    return actionSuccess("Tarifa de entrenador guardada.");
  });
}
