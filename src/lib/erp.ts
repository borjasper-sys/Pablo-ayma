export type Role = "MASTER" | "TRAINER";

export type ErpModule = {
  slug: string;
  title: string;
  eyebrow: string;
  description: string;
  roles: Role[];
  metrics: Array<{ label: string; value: string; detail: string }>;
  actions: string[];
  tableTitle: string;
  rows: Array<Record<string, string>>;
};

export const masterModules = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/entrenadores", label: "Entrenadores" },
  { href: "/alumnos", label: "Alumnos" },
  { href: "/parametros", label: "Parámetros" },
  { href: "/tarifas-alumnos", label: "Tarifas alumnos" },
  { href: "/tarifas-entrenadores", label: "Tarifas entrenadores" },
  { href: "/disponibilidad", label: "Disponibilidad" },
  { href: "/clases", label: "Clases" },
  { href: "/bonos", label: "Bonos" },
  { href: "/cobros", label: "Cobros" },
  { href: "/pagos-entrenadores", label: "Pagos entrenadores" },
  { href: "/gastos", label: "Gastos" },
  { href: "/resumen-economico", label: "Resumen económico" },
  { href: "/informes-pdf", label: "Informes PDF" }
];

export const trainerModules = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/alumnos", label: "Mis alumnos" },
  { href: "/disponibilidad", label: "Disponibilidad" },
  { href: "/clases", label: "Registro clases" },
  { href: "/bonos", label: "Bonos" }
];

export const sampleData = {
  trainers: [
    { name: "Claudia Romero", email: "claudia@pabloayma.com", phone: "600 124 381", active: "Activo", occupancy: 82 },
    { name: "Marc Vidal", email: "marc@pabloayma.com", phone: "611 452 003", active: "Activo", occupancy: 76 },
    { name: "Sonia Costa", email: "sonia@pabloayma.com", phone: "634 771 209", active: "Histórico", occupancy: 41 }
  ],
  students: [
    { name: "Laura Prats", trainer: "Claudia Romero", city: "Barcelona", level: "Intermedio", payment: "Domiciliación", status: "Activo", remaining: 2 },
    { name: "Hugo Soler", trainer: "Marc Vidal", city: "Badalona", level: "Competición", payment: "Tarjeta", status: "Activo", remaining: 1 },
    { name: "Irene Martí", trainer: "Claudia Romero", city: "Sabadell", level: "Iniciación", payment: "Efectivo", status: "Baja histórica", remaining: 0 }
  ],
  studentRates: [
    { name: "Bono 4 clases", category: "Adulto", price: 160, classes: 4, active: "Activo" },
    { name: "Bono 8 clases", category: "Adulto", price: 296, classes: 8, active: "Activo" },
    { name: "Escuela mensual", category: "Junior", price: 120, classes: 8, active: "Activo" }
  ],
  trainerRates: [
    { trainer: "Claudia Romero", rate: "Bono 4 clases", pricePerHour: 26 },
    { trainer: "Marc Vidal", rate: "Bono 8 clases", pricePerHour: 29 },
    { trainer: "Sonia Costa", rate: "Escuela mensual", pricePerHour: 24 }
  ],
  bonuses: [
    { student: "Laura Prats", rate: "Bono 4 clases", paid: 160, total: 4, consumed: 2, remaining: 2, status: "Activo" },
    { student: "Hugo Soler", rate: "Bono 8 clases", paid: 296, total: 8, consumed: 7, remaining: 1, status: "Agotándose" }
  ],
  classes: [
    { date: "2026-05-07", student: "Laura Prats", trainer: "Claudia Romero", duration: 1, accrued: 40, trainerCost: 26, courtCost: 12 },
    { date: "2026-05-13", student: "Hugo Soler", trainer: "Marc Vidal", duration: 1.5, accrued: 55.5, trainerCost: 43.5, courtCost: 16 },
    { date: "2026-05-18", student: "Laura Prats", trainer: "Claudia Romero", duration: 1, accrued: 40, trainerCost: 26, courtCost: 12 }
  ],
  collections: [
    { date: "2026-05-01", student: "Laura Prats", trainer: "Claudia Romero", rate: "Bono 4 clases", method: "Domiciliación", amount: 160, consumed: "2/4" },
    { date: "2026-05-03", student: "Hugo Soler", trainer: "Marc Vidal", rate: "Bono 8 clases", method: "Tarjeta", amount: 296, consumed: "7/8" }
  ],
  expenses: [
    { date: "2026-05-04", concept: "Material técnico", type: "Material", amount: 84 },
    { date: "2026-05-16", concept: "Publicidad campus", type: "Marketing", amount: 135 }
  ],
  availability: [
    { trainer: "Claudia Romero", range: "01/05 - 31/05", weekdays: "L, X, V", time: "09:00 - 13:00" },
    { trainer: "Marc Vidal", range: "01/05 - 31/05", weekdays: "M, J", time: "16:00 - 20:30" }
  ]
};

const total = (values: number[]) => values.reduce((sum, value) => sum + value, 0);
const money = (value: number) =>
  new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(value);

export const economicSummary = {
  cashCollected: total(sampleData.collections.map((collection) => collection.amount)),
  accrued: total(sampleData.classes.map((trainingClass) => trainingClass.accrued)),
  trainerCost: total(sampleData.classes.map((trainingClass) => trainingClass.trainerCost)),
  courtCost: total(sampleData.classes.map((trainingClass) => trainingClass.courtCost)),
  expenses: total(sampleData.expenses.map((expense) => expense.amount)),
  pendingToConsume: total(sampleData.bonuses.map((bonus) => (bonus.paid / bonus.total) * Math.max(bonus.remaining, 0))),
  get result() {
    return this.accrued - this.trainerCost - this.courtCost - this.expenses;
  }
};

export const masterDashboardMetrics = [
  { label: "Cobrado este mes", value: money(economicSummary.cashCollected), detail: "Cobros reales recibidos durante el periodo." },
  { label: "Devengado este mes", value: money(economicSummary.accrued), detail: "Ingresos asociados solo a clases consumidas." },
  { label: "Cobrado pendiente", value: money(economicSummary.pendingToConsume), detail: "Bonos pagados con clases todavía por consumir." },
  { label: "Clases realizadas", value: String(sampleData.classes.length), detail: "Sesiones registradas durante el mes." },
  { label: "Bonos vendidos", value: String(sampleData.bonuses.length), detail: "Bonos activos vinculados a cobros y alumnos." },
  { label: "Clases pendientes", value: String(total(sampleData.bonuses.map((bonus) => bonus.remaining))), detail: "Crédito deportivo pendiente de consumir." },
  { label: "Coste entrenadores", value: money(economicSummary.trainerCost), detail: "Coste devengado por clases realizadas." },
  { label: "Coste pistas", value: money(economicSummary.courtCost), detail: "Costes de pista asignados a clases." },
  { label: "Otros gastos", value: money(economicSummary.expenses), detail: "Gastos no vinculados directamente a pista." },
  { label: "Resultado estimado", value: money(economicSummary.result), detail: "Devengo menos entrenadores, pistas y gastos." },
  { label: "Ratio ocupación", value: "79%", detail: "Media provisional por entrenador." }
];

export const trainerDashboardMetrics = [
  { label: "Alumnos activos", value: "18", detail: "Alumnos visibles para el entrenador conectado." },
  { label: "Clases este mes", value: "42", detail: "Sesiones registradas por el equipo técnico." },
  { label: "Horas disponibles", value: "64", detail: "Disponibilidad publicada en calendario." },
  { label: "Horas ocupadas", value: "49", detail: "Horas ya consumidas o planificadas." },
  { label: "Ratio clases", value: "77%", detail: "Clases realizadas frente a disponibilidad." },
  { label: "Bonos agotándose", value: "3", detail: "Alumnos con una o dos clases restantes." },
  { label: "Pendientes pago", value: "2", detail: "Alumnos que requieren revisión de cobro." }
];

export const modules: ErpModule[] = [
  {
    slug: "entrenadores",
    title: "Gestión de entrenadores",
    eyebrow: "Equipo técnico",
    description: "Alta de usuarios entrenadores, datos de contacto, estado activo e histórico visible para dirección.",
    roles: ["MASTER"],
    metrics: [
      { label: "Activos", value: "2", detail: "Entrenadores con acceso vigente." },
      { label: "Históricos", value: "1", detail: "Registros conservados para consulta." },
      { label: "Ocupación media", value: "79%", detail: "Ratio de clases sobre disponibilidad." }
    ],
    actions: ["Crear usuario entrenador con acceso privado", "Activar o desactivar perfil", "Asignar tarifas de pago por tarifa de alumno"],
    tableTitle: "Entrenadores",
    rows: sampleData.trainers.map((trainer) => ({
      Nombre: trainer.name,
      Email: trainer.email,
      Teléfono: trainer.phone,
      Estado: trainer.active,
      Ocupación: `${trainer.occupancy}%`
    }))
  },
  {
    slug: "alumnos",
    title: "Gestión de alumnos",
    eyebrow: "Escuela de pádel",
    description: "Alta, edición, baja histórica y seguimiento de alumnos. El entrenador solo ve sus alumnos; Master ve todo.",
    roles: ["MASTER", "TRAINER"],
    metrics: [
      { label: "Activos", value: "2", detail: "Alumnos activos en seguimiento." },
      { label: "Históricos", value: "1", detail: "Bajas conservadas para dirección." },
      { label: "Bonos críticos", value: "2", detail: "Bonos con pocas clases restantes." }
    ],
    actions: ["Crear alumno y asignarlo a entrenador", "Editar datos deportivos y de cobro", "Dar de baja sin borrar el histórico"],
    tableTitle: "Alumnos",
    rows: sampleData.students.map((student) => ({
      Alumno: student.name,
      Entrenador: student.trainer,
      Ciudad: student.city,
      Nivel: student.level,
      Cobro: student.payment,
      Estado: student.status,
      Restantes: String(student.remaining)
    }))
  },
  {
    slug: "parametros",
    title: "Parámetros",
    eyebrow: "Configuración",
    description: "Niveles de juego y reglas base para ordenar el crecimiento del ERP sin mezclar datos operativos.",
    roles: ["MASTER"],
    metrics: [
      { label: "Niveles", value: "3", detail: "Iniciación, intermedio y competición." },
      { label: "Métodos cobro", value: "3", detail: "Domiciliación, efectivo y tarjeta." },
      { label: "Estado", value: "Listo", detail: "Preparado para ampliar pistas y SEPA." }
    ],
    actions: ["Crear nivel de juego", "Ordenar niveles", "Activar o desactivar parámetros"],
    tableTitle: "Niveles de juego",
    rows: [
      { Orden: "1", Nivel: "Iniciación", Descripción: "Base técnica y control inicial", Estado: "Activo" },
      { Orden: "2", Nivel: "Intermedio", Descripción: "Ritmo, táctica y posicionamiento", Estado: "Activo" },
      { Orden: "3", Nivel: "Competición", Descripción: "Preparación orientada a torneos", Estado: "Activo" }
    ]
  },
  {
    slug: "tarifas-alumnos",
    title: "Tarifas de alumnos",
    eyebrow: "Ingresos",
    description: "Tarifas vendidas a alumnos: precio, categoría, número de clases y estado operativo.",
    roles: ["MASTER"],
    metrics: [
      { label: "Tarifas activas", value: "3", detail: "Disponibles para nuevos bonos." },
      { label: "Precio medio", value: "192 €", detail: "Media de tarifas activas." },
      { label: "Clases medias", value: "7", detail: "Media de clases por tarifa." }
    ],
    actions: ["Crear tarifa", "Editar precio y clases", "Desactivar tarifa antigua"],
    tableTitle: "Tarifas de alumnos",
    rows: sampleData.studentRates.map((rate) => ({
      Tarifa: rate.name,
      Categoría: rate.category,
      Precio: money(rate.price),
      Clases: String(rate.classes),
      Estado: rate.active
    }))
  },
  {
    slug: "tarifas-entrenadores",
    title: "Tarifas de pago a entrenadores",
    eyebrow: "Costes técnicos",
    description: "Define cuánto cobra cada entrenador por hora según la tarifa contratada por el alumno.",
    roles: ["MASTER"],
    metrics: [
      { label: "Reglas", value: "3", detail: "Combinaciones entrenador/tarifa." },
      { label: "Coste medio", value: "26 €", detail: "Promedio por hora configurada." },
      { label: "Control", value: "Devengo", detail: "Se aplica al registrar clase." }
    ],
    actions: ["Crear regla de pago", "Actualizar precio/hora", "Revisar costes por entrenador"],
    tableTitle: "Pago por entrenador",
    rows: sampleData.trainerRates.map((rate) => ({
      Entrenador: rate.trainer,
      Tarifa: rate.rate,
      "Precio hora": money(rate.pricePerHour)
    }))
  },
  {
    slug: "disponibilidad",
    title: "Disponibilidad de entrenadores",
    eyebrow: "Calendario",
    description: "Bloques por rango de fechas, días de la semana y horas. Base para calcular ocupación y capacidad.",
    roles: ["MASTER", "TRAINER"],
    metrics: [
      { label: "Bloques", value: "2", detail: "Disponibilidades abiertas." },
      { label: "Horas publicadas", value: "64", detail: "Capacidad mensual estimada." },
      { label: "Ocupación", value: "77%", detail: "Horas ocupadas frente a disponibles." }
    ],
    actions: ["Crear disponibilidad", "Seleccionar L M X J V S D", "Editar hora inicio y fin"],
    tableTitle: "Disponibilidad",
    rows: sampleData.availability.map((item) => ({
      Entrenador: item.trainer,
      Fechas: item.range,
      Días: item.weekdays,
      Horario: item.time
    }))
  },
  {
    slug: "clases",
    title: "Registro de clases",
    eyebrow: "Operación diaria",
    description: "Cada clase descuenta bono activo, calcula devengo, coste de entrenador y coste de pista.",
    roles: ["MASTER", "TRAINER"],
    metrics: [
      { label: "Clases mes", value: String(sampleData.classes.length), detail: "Sesiones registradas." },
      { label: "Devengo", value: money(economicSummary.accrued), detail: "Ingreso consumido por clases." },
      { label: "Coste técnico", value: money(economicSummary.trainerCost), detail: "Pago estimado a entrenadores." }
    ],
    actions: ["Registrar clase realizada", "Descontar una clase del bono activo", "Calcular pista, devengo y coste técnico"],
    tableTitle: "Clases registradas",
    rows: sampleData.classes.map((trainingClass) => ({
      Fecha: trainingClass.date,
      Alumno: trainingClass.student,
      Entrenador: trainingClass.trainer,
      Duración: `${trainingClass.duration} h`,
      Devengo: money(trainingClass.accrued),
      "Coste entrenador": money(trainingClass.trainerCost),
      Pista: money(trainingClass.courtCost)
    }))
  },
  {
    slug: "bonos",
    title: "Bonos de clases",
    eyebrow: "Crédito deportivo",
    description: "Control de clases compradas, consumidas y restantes por alumno y tarifa.",
    roles: ["MASTER", "TRAINER"],
    metrics: [
      { label: "Bonos activos", value: "2", detail: "Bonos disponibles para consumir." },
      { label: "Pendientes", value: "3", detail: "Clases todavía disponibles." },
      { label: "Agotándose", value: "1", detail: "Bonos con una clase restante." }
    ],
    actions: ["Crear bono", "Ver clases consumidas", "Detectar bonos pendientes de pago"],
    tableTitle: "Bonos",
    rows: sampleData.bonuses.map((bonus) => ({
      Alumno: bonus.student,
      Tarifa: bonus.rate,
      Pagado: money(bonus.paid),
      Compradas: String(bonus.total),
      Consumidas: String(bonus.consumed),
      Restantes: String(bonus.remaining),
      Estado: bonus.status
    }))
  },
  {
    slug: "cobros",
    title: "Cobros",
    eyebrow: "Caja",
    description: "Registro de pagos reales recibidos por alumno, bono, método de pago y rango de fechas.",
    roles: ["MASTER"],
    metrics: [
      { label: "Cobrado", value: money(economicSummary.cashCollected), detail: "Caja del periodo." },
      { label: "Operaciones", value: "2", detail: "Cobros registrados." },
      { label: "Pendiente consumir", value: money(economicSummary.pendingToConsume), detail: "Caja no devengada todavía." }
    ],
    actions: ["Registrar cobro", "Vincular cobro a bono", "Exportar resumen PDF"],
    tableTitle: "Cobros",
    rows: sampleData.collections.map((collection) => ({
      Fecha: collection.date,
      Alumno: collection.student,
      Entrenador: collection.trainer,
      Tarifa: collection.rate,
      Método: collection.method,
      Importe: money(collection.amount),
      Consumo: collection.consumed
    }))
  },
  {
    slug: "pagos-entrenadores",
    title: "Pagos a entrenadores",
    eyebrow: "Liquidación",
    description: "Cálculo mensual de importes devengados por entrenador y control de pagos realizados.",
    roles: ["MASTER"],
    metrics: [
      { label: "Calculado", value: money(economicSummary.trainerCost), detail: "Coste técnico del mes." },
      { label: "Pagado", value: "0 €", detail: "Importe marcado como pagado." },
      { label: "Pendiente", value: money(economicSummary.trainerCost), detail: "Liquidación pendiente." }
    ],
    actions: ["Calcular por mes", "Registrar pago", "Marcar parcial o pagado"],
    tableTitle: "Liquidaciones",
    rows: [
      { Entrenador: "Claudia Romero", Mes: "2026-05", Calculado: "52 €", Pagado: "0 €", Estado: "Pendiente" },
      { Entrenador: "Marc Vidal", Mes: "2026-05", Calculado: "44 €", Pagado: "0 €", Estado: "Pendiente" }
    ]
  },
  {
    slug: "gastos",
    title: "Gastos",
    eyebrow: "Control económico",
    description: "Gastos generales y costes vinculados o no a clases para completar el resultado mensual.",
    roles: ["MASTER"],
    metrics: [
      { label: "Otros gastos", value: money(economicSummary.expenses), detail: "Gastos generales del periodo." },
      { label: "Coste pistas", value: money(economicSummary.courtCost), detail: "Pistas consumidas por clases." },
      { label: "Resultado", value: money(economicSummary.result), detail: "Resultado estimado por devengo." }
    ],
    actions: ["Registrar gasto", "Vincular a clase si aplica", "Filtrar por tipo"],
    tableTitle: "Gastos",
    rows: sampleData.expenses.map((expense) => ({
      Fecha: expense.date,
      Concepto: expense.concept,
      Tipo: expense.type,
      Importe: money(expense.amount)
    }))
  },
  {
    slug: "resumen-economico",
    title: "Resumen económico mensual",
    eyebrow: "Caja y devengo",
    description: "Comparativa por mes o rango de fechas: cobros reales, ingresos consumidos, costes y resultado.",
    roles: ["MASTER"],
    metrics: [
      { label: "Caja", value: money(economicSummary.cashCollected), detail: "Cobros reales en el periodo." },
      { label: "Devengo", value: money(economicSummary.accrued), detail: "Ingresos de clases consumidas." },
      { label: "Resultado", value: money(economicSummary.result), detail: "Devengo menos costes y gastos." }
    ],
    actions: ["Seleccionar mes", "Seleccionar rango de fechas", "Comparar caja y devengo"],
    tableTitle: "Criterios económicos",
    rows: [
      { Criterio: "Caja", Base: "Cobros recibidos", Importe: money(economicSummary.cashCollected), Uso: "Tesorería" },
      { Criterio: "Devengo", Base: "Clases consumidas", Importe: money(economicSummary.accrued), Uso: "Resultado real" },
      { Criterio: "Pendiente consumir", Base: "Bonos no consumidos", Importe: money(economicSummary.pendingToConsume), Uso: "Pasivo operativo" }
    ]
  },
  {
    slug: "informes-pdf",
    title: "Informes PDF",
    eyebrow: "Reporting",
    description: "Informes imprimibles para cobros y ficha de alumno por rango de fechas, preparados para guardar como PDF.",
    roles: ["MASTER"],
    metrics: [
      { label: "Cobros", value: "PDF", detail: "Alumno, entrenador, tarifa, método e importe." },
      { label: "Alumno", value: "PDF", detail: "Datos, pagos, bonos, clases y restantes." },
      { label: "Rango", value: "Fechas", detail: "Filtro por fecha inicio y fin." }
    ],
    actions: ["Generar PDF resumen de cobros", "Generar PDF de alumno", "Filtrar por rango"],
    tableTitle: "Informes disponibles",
    rows: [
      { Informe: "Resumen de cobros", Incluye: "Alumno, entrenador, tarifa, método, importe y estado", Formato: "PDF" },
      { Informe: "Ficha de alumno", Incluye: "Datos, pagos, bonos, clases y clases restantes", Formato: "PDF" }
    ]
  }
];

export function findModule(slug: string) {
  return modules.find((moduleItem) => moduleItem.slug === slug);
}
