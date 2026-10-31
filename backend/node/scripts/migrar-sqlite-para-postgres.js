import "dotenv/config";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import { fileURLToPath } from "node:url";
import { prisma } from "../db/client.js";

const origem = await open({ filename: fileURLToPath(new URL("../database.db", import.meta.url)), driver: sqlite3.Database });

try {
  const usuarios = await origem.all('SELECT id, "user", email, password, role FROM "user"');
  const chamados = await origem.all("SELECT id, titulo, descricao, local, prioridade, user_id, status, foto, criado_em FROM chamados");

  for (const usuario of usuarios) {
      await prisma.user.upsert({
        where: { id: usuario.id },
        create: { id: usuario.id, username: usuario.user, email: usuario.email || `${usuario.id}@migrated.invalid`, password: usuario.password, role: usuario.role || "user" },
        update: { username: usuario.user, email: usuario.email || `${usuario.id}@migrated.invalid`, password: usuario.password, role: usuario.role || "user" },
      });
  }

  let chamadosSemUsuario = 0;
  for (const chamado of chamados) {
      const usuarioCorrespondente = usuarios.some((usuario) => usuario.id === chamado.user_id);
      if (!usuarioCorrespondente) {
        chamadosSemUsuario += 1;
      }
      const criadoEm = chamado.criado_em ? new Date(chamado.criado_em) : new Date();
      await prisma.chamado.upsert({
        where: { id: chamado.id },
        create: { id: chamado.id, titulo: chamado.titulo || "", descricao: chamado.descricao || "", local: chamado.local || "", prioridade: chamado.prioridade || "media", userId: usuarioCorrespondente ? chamado.user_id : null, status: chamado.status || "aberto", foto: chamado.foto || "", criadoEm: Number.isNaN(criadoEm.getTime()) ? new Date() : criadoEm },
        update: { titulo: chamado.titulo || "", descricao: chamado.descricao || "", local: chamado.local || "", prioridade: chamado.prioridade || "media", userId: usuarioCorrespondente ? chamado.user_id : null, status: chamado.status || "aberto", foto: chamado.foto || "", criadoEm: Number.isNaN(criadoEm.getTime()) ? new Date() : criadoEm },
      });
  }
  console.log(`Migração local concluída: ${usuarios.length} usuários e ${chamados.length} chamados importados (${chamadosSemUsuario} sem usuário correspondente).`);
} finally {
  await origem.close();
  await prisma.$disconnect();
}
