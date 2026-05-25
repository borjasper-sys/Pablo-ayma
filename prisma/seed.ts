import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const masterPasswordHash =
  "$2b$12$EGQeRbalGXvsu7TqHafOdOxBgopMmIRjEujf5BfMxLzFWzg9DT/6O";

async function main() {
  await prisma.user.upsert({
    where: { username: "Master" },
    update: {
      name: "Master",
      passwordHash: masterPasswordHash,
      role: "MASTER"
    },
    create: {
      username: "Master",
      name: "Master",
      passwordHash: masterPasswordHash,
      role: "MASTER"
    }
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
