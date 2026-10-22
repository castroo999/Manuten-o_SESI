import { connectDB } from "../banco.js";
import { randomUUID } from "node:crypto";
import bcrypt from "bcrypt";

export async function initDB() {
  const db = await connectDB();

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
  await db.exec("ALTER TABLE chamados ADD COLUMN IF NOT EXISTS foto TEXT");

  await db.exec(`
    CREATE TABLE IF NOT EXISTS user (
      id TEXT PRIMARY KEY,
      user TEXT,
      email TEXT,
      password TEXT,
      role TEXT
    )
  `);
  await db.exec("ALTER TABLE user ADD COLUMN IF NOT EXISTS email TEXT");

  await db.run(
    "UPDATE user SET role = 'superadmin' WHERE lower(replace(role, ' ', '')) = 'superadmin'"
  );

  const bootstrapId = "initial_accounts_v1";
  await db.exec(`
    CREATE TABLE IF NOT EXISTS app_migrations (
      id TEXT PRIMARY KEY,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
  const bootstrapDone = await db.get("SELECT id FROM app_migrations WHERE id = ?", [bootstrapId]);

  if (!bootstrapDone) {
    const accounts = [
      {
        user: "castro",
        email: "castro@gmail.com",
        password: process.env.BOOTSTRAP_CASTRO_PASSWORD,
        role: "superadmin",
      },
      {
        user: "rene",
        email: "rene@gmail.com",
        password: process.env.BOOTSTRAP_RENE_PASSWORD,
        role: "admin",
      },
    ];

    for (const account of accounts) {
      if (!account.password) {
        throw new Error(`Defina BOOTSTRAP_${account.user.toUpperCase()}_PASSWORD no .env`);
      }

      const existing = await db.get("SELECT id FROM user WHERE lower(trim(user)) = ?", [account.user]);
      const passwordHash = await bcrypt.hash(account.password, 10);

      if (existing) {
        await db.run(
          "UPDATE user SET user = ?, email = ?, password = ?, role = ? WHERE id = ?",
          [account.user, account.email, passwordHash, account.role, existing.id]
        );
      } else {
        await db.run(
          "INSERT INTO user (id, user, email, password, role) VALUES (?, ?, ?, ?, ?)",
          [randomUUID(), account.user, account.email, passwordHash, account.role]
        );
      }
    }

    await db.run("INSERT INTO app_migrations (id) VALUES (?)", [bootstrapId]);
  }

  return db;
}
