import { prisma } from "./client.js";

export async function initDB() {
  await prisma.$connect();
  const usuarios = await prisma.user.findMany({ select: { id: true, role: true } });
  await Promise.all(usuarios.map(({ id, role }) => {
    const normalizada = String(role || "user").trim().toLowerCase().replace(/\s+/g, "");
    return role === normalizada ? null : prisma.user.update({ where: { id }, data: { role: normalizada } });
  }));
  return prisma;
}
