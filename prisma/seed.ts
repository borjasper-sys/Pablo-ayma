import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const masterPasswordHash =
  "$2b$12$EGQeRbalGXvsu7TqHafOdOxBgopMmIRjEujf5BfMxLzFWzg9DT/6O";

async function main() {
  await prisma.user.upsert({
    where: { email: "Master" },
    update: {
      name: "Master",
      passwordHash: masterPasswordHash,
      role: "MASTER",
      active: true
    },
    create: {
      name: "Master",
      email: "Master",
      passwordHash: masterPasswordHash,
      role: "MASTER",
      active: true
    }
  });

  const levels = [
    ["Iniciación", "Primeros pasos técnicos y lectura básica de juego"],
    ["Intermedio", "Control de ritmo, posicionamiento y patrones"],
    ["Competición", "Entrenamiento intensivo orientado a torneos"]
  ];

  for (const [index, [name, description]] of levels.entries()) {
    const existing = await prisma.gameLevel.findFirst({ where: { name } });

    if (!existing) {
      await prisma.gameLevel.create({
        data: { name, description, order: index + 1 }
      });
    }
  }

  const rates = [
    { name: "Bono 4 clases", category: "Adulto", price: 160, numberOfClasses: 4 },
    { name: "Bono 8 clases", category: "Adulto", price: 296, numberOfClasses: 8 },
    { name: "Escuela mensual", category: "Junior", price: 120, numberOfClasses: 8 }
  ];

  for (const rate of rates) {
    const existing = await prisma.studentRate.findFirst({
      where: { name: rate.name, category: rate.category }
    });

    if (!existing) {
      await prisma.studentRate.create({ data: rate });
    }
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
