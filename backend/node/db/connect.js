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
      foto TEXT,
      criado_em TEXT
    )
  `);

  const colunasChamados = await db.all("PRAGMA table_info(chamados)");
  const temFoto = colunasChamados.some((coluna) => coluna.name === "foto");

  if (!temFoto) {
    await db.exec("ALTER TABLE chamados ADD COLUMN foto TEXT");
  }

  // tabela usuarios
  await db.exec(`
    CREATE TABLE IF NOT EXISTS user(
      id TEXT PRIMARY KEY,
      user TEXT,
      email TEXT,
      password TEXT,
      role TEXT
    )
  `);

  const colunasUser = await db.all("PRAGMA table_info(user)");
  const temEmail = colunasUser.some((coluna) => coluna.name === "email");

  if (!temEmail) {
    await db.exec("ALTER TABLE user ADD COLUMN email TEXT");
  }

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
      "INSERT INTO user (id, user, email, password, role) VALUES (?, ?, ?, ?, ?)",
      [id, "castro", process.env.ADMIN_EMAIL || "castro@local.com", senha, "admin"]
    );
  } else if (!adminExiste.email) {
    await db.run(
      "UPDATE user SET email = ? WHERE id = ?",
      [process.env.ADMIN_EMAIL || "castro@local.com", adminExiste.id]
    );
  }

  return db;
}
