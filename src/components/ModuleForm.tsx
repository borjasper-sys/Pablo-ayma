import {
  createAvailability,
  createClassBonus,
  createTrainer,
  registerCollection,
  registerExpense,
  registerTrainingClass
} from "@/app/actions";

type Field = {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  options?: Array<{ label: string; value: string }>;
};

const weekdays = ["L", "M", "X", "J", "V", "S", "D"];

function FieldControl({ field }: { field: Field }) {
  if (field.options) {
    return (
      <label className="block">
        <span className="text-xs font-bold uppercase tracking-[0.18em] text-ash">
          {field.label}
        </span>
        <select
          name={field.name}
          className="mt-2 w-full border border-line bg-court px-4 py-3 text-sm text-ink outline-none transition focus:border-ink"
        >
          {field.options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
    );
  }

  return (
    <label className="block">
      <span className="text-xs font-bold uppercase tracking-[0.18em] text-ash">
        {field.label}
      </span>
      <input
        name={field.name}
        type={field.type ?? "text"}
        placeholder={field.placeholder}
        className="mt-2 w-full border border-line bg-court px-4 py-3 text-sm text-ink outline-none transition focus:border-ink"
      />
    </label>
  );
}

function FormFrame({
  title,
  children,
  action,
  submitLabel
}: {
  title: string;
  children: React.ReactNode;
  action: (formData: FormData) => Promise<void>;
  submitLabel: string;
}) {
  return (
    <form action={action} className="border border-line bg-white p-5 shadow-soft">
      <p className="text-xs font-black uppercase tracking-[0.22em] text-ash">
        Acción rápida
      </p>
      <h2 className="mt-2 text-2xl font-black uppercase tracking-normal text-ink">
        {title}
      </h2>
      <div className="mt-5 grid gap-4 md:grid-cols-2">{children}</div>
      <button
        type="submit"
        className="mt-5 bg-ink px-5 py-3 text-xs font-black uppercase tracking-[0.2em] text-white transition hover:bg-graphite"
      >
        {submitLabel}
      </button>
    </form>
  );
}

export function ModuleForm({ slug }: { slug: string }) {
  if (slug === "entrenadores") {
    return (
      <FormFrame title="Crear entrenador" action={createTrainer} submitLabel="Crear entrenador">
        <FieldControl field={{ name: "name", label: "Nombre" }} />
        <FieldControl field={{ name: "surname", label: "Apellidos" }} />
        <FieldControl field={{ name: "email", label: "Email / usuario" }} />
        <FieldControl field={{ name: "phone", label: "Teléfono" }} />
        <FieldControl field={{ name: "password", label: "Contraseña inicial", type: "password" }} />
      </FormFrame>
    );
  }

  if (slug === "disponibilidad") {
    return (
      <FormFrame title="Publicar disponibilidad" action={createAvailability} submitLabel="Guardar disponibilidad">
        <FieldControl field={{ name: "trainerId", label: "ID entrenador" }} />
        <FieldControl field={{ name: "startDate", label: "Fecha inicio", type: "date" }} />
        <FieldControl field={{ name: "endDate", label: "Fecha fin", type: "date" }} />
        <div className="md:col-span-2">
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-ash">
            Días
          </span>
          <div className="mt-2 grid grid-cols-7 gap-2">
            {weekdays.map((weekday) => (
              <label
                key={weekday}
                className="grid place-items-center border border-line bg-court py-3 text-xs font-black text-ink"
              >
                <input name="weekdays" value={weekday} type="checkbox" className="sr-only" />
                {weekday}
              </label>
            ))}
          </div>
        </div>
        <FieldControl field={{ name: "startTime", label: "Hora inicio", type: "time" }} />
        <FieldControl field={{ name: "endTime", label: "Hora fin", type: "time" }} />
      </FormFrame>
    );
  }

  if (slug === "clases") {
    return (
      <FormFrame title="Registrar clase" action={registerTrainingClass} submitLabel="Registrar clase">
        <FieldControl field={{ name: "studentId", label: "ID alumno" }} />
        <FieldControl field={{ name: "trainerId", label: "ID entrenador" }} />
        <FieldControl field={{ name: "studentRateId", label: "ID tarifa alumno" }} />
        <FieldControl field={{ name: "date", label: "Fecha", type: "date" }} />
        <FieldControl field={{ name: "startTime", label: "Hora inicio", type: "time" }} />
        <FieldControl field={{ name: "endTime", label: "Hora fin", type: "time" }} />
        <FieldControl field={{ name: "durationHours", label: "Duración horas", type: "number" }} />
        <FieldControl field={{ name: "court", label: "Pista" }} />
        <FieldControl field={{ name: "courtCost", label: "Coste pista", type: "number" }} />
      </FormFrame>
    );
  }

  if (slug === "bonos") {
    return (
      <FormFrame title="Crear bono" action={createClassBonus} submitLabel="Crear bono">
        <FieldControl field={{ name: "studentId", label: "ID alumno" }} />
        <FieldControl field={{ name: "studentRateId", label: "ID tarifa" }} />
        <FieldControl field={{ name: "paymentDate", label: "Fecha pago", type: "date" }} />
        <FieldControl field={{ name: "amountPaid", label: "Importe pagado", type: "number" }} />
        <FieldControl field={{ name: "totalClasses", label: "Clases compradas", type: "number" }} />
      </FormFrame>
    );
  }

  if (slug === "cobros") {
    return (
      <FormFrame title="Registrar cobro" action={registerCollection} submitLabel="Registrar cobro">
        <FieldControl field={{ name: "studentId", label: "ID alumno" }} />
        <FieldControl field={{ name: "bonusId", label: "ID bono" }} />
        <FieldControl field={{ name: "date", label: "Fecha", type: "date" }} />
        <FieldControl field={{ name: "amount", label: "Importe", type: "number" }} />
        <FieldControl
          field={{
            name: "paymentMethod",
            label: "Método",
            options: [
              { label: "Domiciliación", value: "DIRECT_DEBIT" },
              { label: "Efectivo", value: "CASH" },
              { label: "Tarjeta", value: "CARD" }
            ]
          }}
        />
        <FieldControl field={{ name: "notes", label: "Notas" }} />
      </FormFrame>
    );
  }

  if (slug === "gastos") {
    return (
      <FormFrame title="Registrar gasto" action={registerExpense} submitLabel="Guardar gasto">
        <FieldControl field={{ name: "date", label: "Fecha", type: "date" }} />
        <FieldControl field={{ name: "concept", label: "Concepto" }} />
        <FieldControl field={{ name: "type", label: "Tipo" }} />
        <FieldControl field={{ name: "amount", label: "Importe", type: "number" }} />
        <label className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.18em] text-ash">
          <input name="linkedToClass" type="checkbox" />
          Vinculado a clase
        </label>
        <FieldControl field={{ name: "notes", label: "Notas" }} />
      </FormFrame>
    );
  }

  return null;
}
