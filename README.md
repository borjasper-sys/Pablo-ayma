# Pablo Aymà Gestión Deportiva

ERP web inicial para la gestión deportiva de Pablo Aymà.

## Desarrollo local

```bash
npm install
npm run prisma:push
npm run prisma:seed
npm run dev
```

## Variables de entorno

Para despliegue en Vercel configura:

- `DATABASE_URL`
- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`

El proyecto usa Next.js App Router, TypeScript, Tailwind CSS, Prisma y NextAuth.
