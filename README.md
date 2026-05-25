# Pablo Aymà Gestión Deportiva

ERP web responsive para la gestión completa de un club y escuela de pádel:
entrenadores, alumnos, tarifas, disponibilidad, clases, bonos, cobros, pagos,
gastos, resumen económico e informes PDF.

## Desarrollo local

```bash
npm install
npm run prisma:push
npm run prisma:seed
npm run dev -- --port 3001
```

El usuario Master se crea desde el seed inicial. Configura las variables de
entorno antes de ejecutar la aplicación.

## Variables de entorno

Para despliegue en Vercel configura:

- `DATABASE_URL`
- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`

## Despliegue

Vercel debe detectar Next.js automáticamente. `vercel.json` no define
`outputDirectory`, por lo que el build genera `.next` y no busca `public` como
carpeta de salida.

El proyecto usa Next.js App Router, TypeScript, Tailwind CSS, Prisma y NextAuth.
