import { connectDB } from "../banco.js";
import { randomUUID } from "node:crypto";
import bcrypt from "bcrypt";

// conecta banco
export async function initDB() {

  const db = await connectDB();

  // tabela chamados
  await db.exec(`
    CREATE TABLE IF NOT EXISTS chamados (
      id TEXT PRIMARY KEY,
      titulo TEXT,
      descricao TEXT,
      local TEXT,
      prioridade TEXT,
      user_id TEXT,
      status TEXT DEFAULT 'aberto',
      criado_em TEXT
    )
  `);

  // tabela usuarios
  await db.exec(`
    CREATE TABLE IF NOT EXISTS user(
      id TEXT PRIMARY KEY,
      user TEXT,
      password TEXT,
      role TEXT
    )
  `);

  // admin automatico
  const adminExiste = await db.get(
    "SELECT * FROM user WHERE user = ?",
    ["castro"]
  );

  if (!adminExiste) {

    const id = randomUUID();

    const senha = await bcrypt.hash(
      "Felipinho04",
      10
    );

    await db.run(
      "INSERT INTO user (id, user, password, role) VALUES (?, ?, ?, ?)",
      [id, "castro", senha, "admin"]
    );
  }

  return db;
}