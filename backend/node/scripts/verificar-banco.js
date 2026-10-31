import { prisma } from "../db/client.js";

try {
  const [usuarios, chamados] = await Promise.all([prisma.user.count(), prisma.chamado.count()]);
  console.log(JSON.stringify({ usuarios, chamados }));
} finally {
  await prisma.$disconnect();
}
