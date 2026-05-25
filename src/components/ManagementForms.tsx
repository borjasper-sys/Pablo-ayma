"use client";

import { useActionState } from "react";
import {
  createGameLevel,
  createStudentRate,
  toggleGameLevel,
  toggleStudentRate,
  updateGameLevel,
  updateStudentRate,
  upsertTrainerRate,
  type ActionState
} from "@/app/actions";

const initialState: ActionState = { ok: false, message: "" };

type GameLevelItem = {
  id: string;
  name: string;
  description: string | null;
  order: number;
  active: boolean;
};

type StudentRateItem = {
  id: string;
  name: string;
  category: string;
  price: number;
  numberOfClasses: number;
  active: boolean;
};

type TrainerItem = {
  id: string;
  name: string;
  surname: string;
  active: boolean;
};

type TrainerRateItem = {
  id: string;
  trainerId: string;
  studentRateId: string;
  pricePerHour: number;
  trainerName: string;
  studentRateName: string;
};

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
  required = false
}: {
  label: string;
  name: string;
  defaultValue?: string | number;
  type?: string;
  required?: boolean;
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
        step={type === "number" ? "0.01" : undefined}
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

export function GameLevelManager({ levels }: { levels: GameLevelItem[] }) {
  const [createState, createAction] = useActionState(createGameLevel, initialState);
  const [updateState, updateAction] = useActionState(updateGameLevel, initialState);
  const [toggleState, toggleAction] = useActionState(toggleGameLevel, initialState);

  return (
    <div className="space-y-6">
      <form action={createAction} className="border border-line bg-white p-5 shadow-soft">
        <p className="text-xs font-black uppercase tracking-[0.22em] text-ash">
          Crear nivel
        </p>
        <div className="mt-5 grid gap-4 md:grid-cols-[1fr_1fr_8rem]">
          <Field name="name" label="Nombre" required />
          <Field name="description" label="Descripción" />
          <Field name="order" label="Orden" type="number" defaultValue={levels.length + 1} />
        </div>
        <div className="mt-5">
          <SubmitButton>Crear nivel</SubmitButton>
        </div>
        <Message state={createState} />
      </form>

      <section className="border border-line bg-white p-5 shadow-soft">
        <div className="border-b border-line pb-5">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-ash">
            Editar, ordenar y activar
          </p>
          <h2 className="mt-2 text-2xl font-black uppercase tracking-normal text-ink">
            Niveles de juego
          </h2>
        </div>
        <div className="mt-5 space-y-4">
          {levels.map((level) => (
            <div key={level.id} className="border border-line bg-court p-4">
              <form action={updateAction} className="grid gap-4 lg:grid-cols-[1fr_1.4fr_7rem_9rem_8rem]">
                <input type="hidden" name="id" value={level.id} />
                <Field name="name" label="Nombre" defaultValue={level.name} required />
                <Field name="description" label="Descripción" defaultValue={level.description ?? ""} />
                <Field name="order" label="Orden" type="number" defaultValue={level.order} />
                <label className="block">
                  <span className="text-xs font-bold uppercase tracking-[0.18em] text-ash">
                    Estado
                  </span>
                  <select
                    name="active"
                    defaultValue={String(level.active)}
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
              <form action={toggleAction} className="mt-3">
                <input type="hidden" name="id" value={level.id} />
                <input type="hidden" name="active" value={String(level.active)} />
                <button
                  type="submit"
                  className="text-xs font-black uppercase tracking-[0.18em] text-ash transition hover:text-ink"
                >
                  {level.active ? "Desactivar nivel" : "Activar nivel"}
                </button>
              </form>
            </div>
          ))}
        </div>
        <Message state={updateState.message ? updateState : toggleState} />
      </section>
    </div>
  );
}

export function StudentRateManager({ rates }: { rates: StudentRateItem[] }) {
  const [createState, createAction] = useActionState(createStudentRate, initialState);
  const [updateState, updateAction] = useActionState(updateStudentRate, initialState);
  const [toggleState, toggleAction] = useActionState(toggleStudentRate, initialState);

  return (
    <div className="space-y-6">
      <form action={createAction} className="border border-line bg-white p-5 shadow-soft">
        <p className="text-xs font-black uppercase tracking-[0.22em] text-ash">
          Crear tarifa
        </p>
        <div className="mt-5 grid gap-4 md:grid-cols-4">
          <Field name="name" label="Nombre" required />
          <Field name="category" label="Categoría" required />
          <Field name="price" label="Precio" type="number" required />
          <Field name="numberOfClasses" label="Clases" type="number" required />
        </div>
        <div className="mt-5">
          <SubmitButton>Crear tarifa</SubmitButton>
        </div>
        <Message state={createState} />
      </form>

      <section className="border border-line bg-white p-5 shadow-soft">
        <div className="border-b border-line pb-5">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-ash">
            Editar y activar
          </p>
          <h2 className="mt-2 text-2xl font-black uppercase tracking-normal text-ink">
            Tarifas de alumnos
          </h2>
        </div>
        <div className="mt-5 space-y-4">
          {rates.map((rate) => (
            <div key={rate.id} className="border border-line bg-court p-4">
              <form action={updateAction} className="grid gap-4 lg:grid-cols-[1fr_1fr_8rem_8rem_9rem_8rem]">
                <input type="hidden" name="id" value={rate.id} />
                <Field name="name" label="Nombre" defaultValue={rate.name} required />
                <Field name="category" label="Categoría" defaultValue={rate.category} required />
                <Field name="price" label="Precio" type="number" defaultValue={rate.price} required />
                <Field
                  name="numberOfClasses"
                  label="Clases"
                  type="number"
                  defaultValue={rate.numberOfClasses}
                  required
                />
                <label className="block">
                  <span className="text-xs font-bold uppercase tracking-[0.18em] text-ash">
                    Estado
                  </span>
                  <select
                    name="active"
                    defaultValue={String(rate.active)}
                    className="mt-2 w-full border border-line bg-white px-4 py-3 text-sm text-ink outline-none transition focus:border-ink"
                  >
                    <option value="true">Activa</option>
                    <option value="false">Inactiva</option>
                  </select>
                </label>
                <div className="flex items-end">
                  <SubmitButton>Guardar</SubmitButton>
                </div>
              </form>
              <form action={toggleAction} className="mt-3">
                <input type="hidden" name="id" value={rate.id} />
                <input type="hidden" name="active" value={String(rate.active)} />
                <button
                  type="submit"
                  className="text-xs font-black uppercase tracking-[0.18em] text-ash transition hover:text-ink"
                >
                  {rate.active ? "Desactivar tarifa" : "Activar tarifa"}
                </button>
              </form>
            </div>
          ))}
        </div>
        <Message state={updateState.message ? updateState : toggleState} />
      </section>
    </div>
  );
}

export function TrainerRateManager({
  trainers,
  studentRates,
  trainerRates
}: {
  trainers: TrainerItem[];
  studentRates: StudentRateItem[];
  trainerRates: TrainerRateItem[];
}) {
  const [createState, createAction] = useActionState(upsertTrainerRate, initialState);
  const [updateState, updateAction] = useActionState(upsertTrainerRate, initialState);

  return (
    <div className="space-y-6">
      <form action={createAction} className="border border-line bg-white p-5 shadow-soft">
        <p className="text-xs font-black uppercase tracking-[0.22em] text-ash">
          Asignar tarifa/hora
        </p>
        <div className="mt-5 grid gap-4 md:grid-cols-[1fr_1fr_10rem]">
          <label className="block">
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-ash">
              Entrenador
            </span>
            <select name="trainerId" required className="mt-2 w-full border border-line bg-court px-4 py-3 text-sm text-ink outline-none transition focus:border-ink">
              <option value="">Seleccionar</option>
              {trainers.map((trainer) => (
                <option key={trainer.id} value={trainer.id}>
                  {trainer.name} {trainer.surname}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-ash">
              Tarifa alumno
            </span>
            <select name="studentRateId" required className="mt-2 w-full border border-line bg-court px-4 py-3 text-sm text-ink outline-none transition focus:border-ink">
              <option value="">Seleccionar</option>
              {studentRates.map((rate) => (
                <option key={rate.id} value={rate.id}>
                  {rate.name}
                </option>
              ))}
            </select>
          </label>
          <Field name="pricePerHour" label="Precio/hora" type="number" required />
        </div>
        <div className="mt-5">
          <SubmitButton>Guardar regla</SubmitButton>
        </div>
        <Message state={createState} />
      </form>

      <section className="border border-line bg-white p-5 shadow-soft">
        <div className="border-b border-line pb-5">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-ash">
            Editar precio/hora
          </p>
          <h2 className="mt-2 text-2xl font-black uppercase tracking-normal text-ink">
            Tarifas de entrenadores
          </h2>
        </div>
        <div className="mt-5 space-y-4">
          {trainerRates.map((rate) => (
            <form
              key={rate.id}
              action={updateAction}
              className="grid gap-4 border border-line bg-court p-4 lg:grid-cols-[1fr_1fr_10rem_8rem]"
            >
              <input type="hidden" name="id" value={rate.id} />
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-ash">
                  Entrenador
                </p>
                <p className="mt-3 text-sm font-bold text-ink">{rate.trainerName}</p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-ash">
                  Tarifa alumno
                </p>
                <p className="mt-3 text-sm font-bold text-ink">{rate.studentRateName}</p>
              </div>
              <Field
                name="pricePerHour"
                label="Precio/hora"
                type="number"
                defaultValue={rate.pricePerHour}
                required
              />
              <div className="flex items-end">
                <SubmitButton>Guardar</SubmitButton>
              </div>
            </form>
          ))}
        </div>
        <Message state={updateState} />
      </section>
    </div>
  );
}
