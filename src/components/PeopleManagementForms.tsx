"use client";

import { useActionState } from "react";
import {
  createStudentProfile,
  createTrainerProfile,
  toggleStudentProfile,
  toggleTrainerProfile,
  updateStudentProfile,
  updateTrainerProfile,
  type ActionState
} from "@/app/actions";
import type { Role } from "@/lib/erp";

const initialState: ActionState = { ok: false, message: "" };

type TrainerItem = {
  id: string;
  userId: string;
  name: string;
  surname: string;
  phone: string | null;
  email: string;
  active: boolean;
  studentsCount?: number;
};

type GameLevelItem = {
  id: string;
  name: string;
};

type StudentItem = {
  id: string;
  trainerId: string;
  name: string;
  surname: string;
  city: string | null;
  paymentMethod: "DIRECT_DEBIT" | "CASH" | "CARD";
  iban: string | null;
  registrationDate: Date | string;
  birthDate: Date | string | null;
  sex: string | null;
  gameLevelId: string | null;
  active: boolean;
  cancellationDate: Date | string | null;
  trainerName: string;
  levelName: string;
  remainingClasses: number;
};

function dateInput(value: Date | string | null) {
  if (!value) {
    return "";
  }

  return new Date(value).toISOString().slice(0, 10);
}

function Message({ state }: { state: ActionState }) {
  if (!state.message) {
    return null;
  }

  return (
    <p
      className={`mt-4 border px-4 py-3 text-sm font-bold ${
        state.ok ? "border-ink bg-court text-ink" : "border-ink bg-ink text-white"
      }`}
    >
      {state.message}
    </p>
  );
}

function Field({
  label,
  name,
  defaultValue,
  type = "text",
  required = false,
  placeholder
}: {
  label: string;
  name: string;
  defaultValue?: string | number;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="text-xs font-bold uppercase tracking-[0.18em] text-ash">
        {label}
      </span>
      <input
        name={name}
        type={type}
        defaultValue={defaultValue}
        required={required}
        placeholder={placeholder}
        className="mt-2 w-full border border-line bg-court px-4 py-3 text-sm text-ink outline-none transition focus:border-ink"
      />
    </label>
  );
}

function SubmitButton({ children }: { children: React.ReactNode }) {
  return (
    <button
      type="submit"
      className="bg-ink px-5 py-3 text-xs font-black uppercase tracking-[0.2em] text-white transition hover:bg-graphite"
    >
      {children}
    </button>
  );
}

function EmptyState({ children }: { children: React.ReactNode }) {
  return (
    <div className="border border-dashed border-line bg-court p-5 text-sm font-bold text-ash">
      {children}
    </div>
  );
}

export function TrainerManager({ trainers }: { trainers: TrainerItem[] }) {
  const [createState, createAction] = useActionState(createTrainerProfile, initialState);
  const [updateState, updateAction] = useActionState(updateTrainerProfile, initialState);
  const [toggleState, toggleAction] = useActionState(toggleTrainerProfile, initialState);

  return (
    <div className="space-y-6">
      <form action={createAction} className="border border-line bg-white p-5 shadow-soft">
        <p className="text-xs font-black uppercase tracking-[0.22em] text-ash">
          Crear entrenador
        </p>
        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <Field name="name" label="Nombre" required />
          <Field name="surname" label="Apellidos" required />
          <Field name="email" label="Email / usuario" type="email" required />
          <Field name="phone" label="Teléfono" />
          <Field name="password" label="Contraseña inicial" type="password" required />
        </div>
        <div className="mt-5">
          <SubmitButton>Crear entrenador</SubmitButton>
        </div>
        <Message state={createState} />
      </form>

      <section className="border border-line bg-white p-5 shadow-soft">
        <div className="border-b border-line pb-5">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-ash">
            Editar y activar
          </p>
          <h2 className="mt-2 text-2xl font-black uppercase tracking-normal text-ink">
            Entrenadores
          </h2>
        </div>
        <div className="mt-5 space-y-4">
          {trainers.length === 0 ? (
            <EmptyState>No hay entrenadores creados todavía.</EmptyState>
          ) : (
            trainers.map((trainer) => (
              <div key={trainer.id} className="border border-line bg-court p-4">
                <form action={updateAction} className="grid gap-4 xl:grid-cols-[1fr_1fr_1.2fr_9rem_10rem_10rem_8rem]">
                  <input type="hidden" name="id" value={trainer.id} />
                  <input type="hidden" name="userId" value={trainer.userId} />
                  <Field name="name" label="Nombre" defaultValue={trainer.name} required />
                  <Field name="surname" label="Apellidos" defaultValue={trainer.surname} required />
                  <Field name="email" label="Email" type="email" defaultValue={trainer.email} required />
                  <Field name="phone" label="Teléfono" defaultValue={trainer.phone ?? ""} />
                  <Field name="password" label="Nueva clave" type="password" placeholder="Opcional" />
                  <label className="block">
                    <span className="text-xs font-bold uppercase tracking-[0.18em] text-ash">
                      Estado
                    </span>
                    <select
                      name="active"
                      defaultValue={String(trainer.active)}
                      className="mt-2 w-full border border-line bg-white px-4 py-3 text-sm text-ink outline-none transition focus:border-ink"
                    >
                      <option value="true">Activo</option>
                      <option value="false">Inactivo</option>
                    </select>
                  </label>
                  <div className="flex items-end">
                    <SubmitButton>Guardar</SubmitButton>
                  </div>
                </form>
                <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-ash">
                    {trainer.studentsCount ?? 0} alumnos vinculados
                  </p>
                  <form action={toggleAction}>
                    <input type="hidden" name="id" value={trainer.id} />
                    <input type="hidden" name="userId" value={trainer.userId} />
                    <input type="hidden" name="active" value={String(trainer.active)} />
                    <button
                      type="submit"
                      className="text-xs font-black uppercase tracking-[0.18em] text-ash transition hover:text-ink"
                    >
                      {trainer.active ? "Desactivar entrenador" : "Activar entrenador"}
                    </button>
                  </form>
                </div>
              </div>
            ))
          )}
        </div>
        <Message state={updateState.message ? updateState : toggleState} />
      </section>
    </div>
  );
}

export function StudentManager({
  students,
  trainers,
  gameLevels,
  role
}: {
  students: StudentItem[];
  trainers: TrainerItem[];
  gameLevels: GameLevelItem[];
  role: Role;
}) {
  const [createState, createAction] = useActionState(createStudentProfile, initialState);
  const [updateState, updateAction] = useActionState(updateStudentProfile, initialState);
  const [toggleState, toggleAction] = useActionState(toggleStudentProfile, initialState);
  const isMaster = role === "MASTER";

  return (
    <div className="space-y-6">
      <form action={createAction} className="border border-line bg-white p-5 shadow-soft">
        <p className="text-xs font-black uppercase tracking-[0.22em] text-ash">
          Crear alumno
        </p>
        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {isMaster ? (
            <TrainerSelect trainers={trainers} />
          ) : null}
          <Field name="name" label="Nombre" required />
          <Field name="surname" label="Apellidos" required />
          <Field name="city" label="Ciudad" />
          <PaymentSelect />
          <Field name="iban" label="IBAN" />
          <Field name="registrationDate" label="Fecha alta" type="date" defaultValue={dateInput(new Date())} />
          <Field name="birthDate" label="Nacimiento" type="date" />
          <Field name="sex" label="Sexo" />
          <GameLevelSelect gameLevels={gameLevels} />
        </div>
        <div className="mt-5">
          <SubmitButton>Crear alumno</SubmitButton>
        </div>
        <Message state={createState} />
      </form>

      <section className="border border-line bg-white p-5 shadow-soft">
        <div className="border-b border-line pb-5">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-ash">
            Editar y baja histórica
          </p>
          <h2 className="mt-2 text-2xl font-black uppercase tracking-normal text-ink">
            Alumnos
          </h2>
        </div>
        <div className="mt-5 space-y-4">
          {students.length === 0 ? (
            <EmptyState>No hay alumnos visibles para esta sesión.</EmptyState>
          ) : (
            students.map((student) => (
              <div key={student.id} className="border border-line bg-court p-4">
                <div className="mb-4 flex flex-col gap-2 border-b border-line pb-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-black uppercase text-ink">
                      {student.name} {student.surname}
                    </p>
                    <p className="mt-1 text-xs font-bold uppercase tracking-[0.16em] text-ash">
                      {student.trainerName} · {student.levelName} · {student.remainingClasses} clases restantes
                    </p>
                  </div>
                  <span className="w-fit border border-line bg-white px-3 py-2 text-xs font-black uppercase tracking-[0.14em] text-ink">
                    {student.active ? "Activo" : "Histórico"}
                  </span>
                </div>
                <form action={updateAction} className="grid gap-4 xl:grid-cols-4">
                  <input type="hidden" name="id" value={student.id} />
                  {isMaster ? (
                    <TrainerSelect trainers={trainers} defaultValue={student.trainerId} />
                  ) : null}
                  <Field name="name" label="Nombre" defaultValue={student.name} required />
                  <Field name="surname" label="Apellidos" defaultValue={student.surname} required />
                  <Field name="city" label="Ciudad" defaultValue={student.city ?? ""} />
                  <PaymentSelect defaultValue={student.paymentMethod} />
                  <Field name="iban" label="IBAN" defaultValue={student.iban ?? ""} />
                  <Field name="registrationDate" label="Fecha alta" type="date" defaultValue={dateInput(student.registrationDate)} />
                  <Field name="birthDate" label="Nacimiento" type="date" defaultValue={dateInput(student.birthDate)} />
                  <Field name="sex" label="Sexo" defaultValue={student.sex ?? ""} />
                  <GameLevelSelect gameLevels={gameLevels} defaultValue={student.gameLevelId ?? ""} />
                  <label className="block">
                    <span className="text-xs font-bold uppercase tracking-[0.18em] text-ash">
                      Estado
                    </span>
                    <select
                      name="active"
                      defaultValue={String(student.active)}
                      className="mt-2 w-full border border-line bg-white px-4 py-3 text-sm text-ink outline-none transition focus:border-ink"
                    >
                      <option value="true">Activo</option>
                      <option value="false">Histórico</option>
                    </select>
                  </label>
                  <Field
                    name="cancellationDate"
                    label="Fecha baja"
                    type="date"
                    defaultValue={dateInput(student.cancellationDate)}
                  />
                  <div className="flex items-end">
                    <SubmitButton>Guardar</SubmitButton>
                  </div>
                </form>
                <form action={toggleAction} className="mt-3">
                  <input type="hidden" name="id" value={student.id} />
                  <input type="hidden" name="active" value={String(student.active)} />
                  <button
                    type="submit"
                    className="text-xs font-black uppercase tracking-[0.18em] text-ash transition hover:text-ink"
                  >
                    {student.active ? "Dar de baja alumno" : "Reactivar alumno"}
                  </button>
                </form>
              </div>
            ))
          )}
        </div>
        <Message state={updateState.message ? updateState : toggleState} />
      </section>
    </div>
  );
}

function TrainerSelect({
  trainers,
  defaultValue
}: {
  trainers: TrainerItem[];
  defaultValue?: string;
}) {
  return (
    <label className="block">
      <span className="text-xs font-bold uppercase tracking-[0.18em] text-ash">
        Entrenador
      </span>
      <select
        name="trainerId"
        required
        defaultValue={defaultValue ?? ""}
        className="mt-2 w-full border border-line bg-court px-4 py-3 text-sm text-ink outline-none transition focus:border-ink"
      >
        <option value="">Seleccionar</option>
        {trainers.map((trainer) => (
          <option key={trainer.id} value={trainer.id}>
            {trainer.name} {trainer.surname}
          </option>
        ))}
      </select>
    </label>
  );
}

function GameLevelSelect({
  gameLevels,
  defaultValue
}: {
  gameLevels: GameLevelItem[];
  defaultValue?: string;
}) {
  return (
    <label className="block">
      <span className="text-xs font-bold uppercase tracking-[0.18em] text-ash">
        Nivel
      </span>
      <select
        name="gameLevelId"
        defaultValue={defaultValue ?? ""}
        className="mt-2 w-full border border-line bg-court px-4 py-3 text-sm text-ink outline-none transition focus:border-ink"
      >
        <option value="">Sin nivel</option>
        {gameLevels.map((level) => (
          <option key={level.id} value={level.id}>
            {level.name}
          </option>
        ))}
      </select>
    </label>
  );
}

function PaymentSelect({ defaultValue = "DIRECT_DEBIT" }: { defaultValue?: string }) {
  return (
    <label className="block">
      <span className="text-xs font-bold uppercase tracking-[0.18em] text-ash">
        Método cobro
      </span>
      <select
        name="paymentMethod"
        defaultValue={defaultValue}
        className="mt-2 w-full border border-line bg-court px-4 py-3 text-sm text-ink outline-none transition focus:border-ink"
      >
        <option value="DIRECT_DEBIT">Domiciliación</option>
        <option value="CASH">Efectivo</option>
        <option value="CARD">Tarjeta</option>
      </select>
    </label>
  );
}
