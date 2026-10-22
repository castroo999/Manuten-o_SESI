import pg from "pg";

const { Pool } = pg;

function prepararSQL(sql) {
  let parametro = 0;

  // Mantém compatibilidade com as consultas existentes, que usam ? no SQLite.
  return sql
    .replace(/\?/g, () => `$${++parametro}`)
    // USER é uma palavra reservada no PostgreSQL e precisa ser citada como identificador.
    .replace(/\buser\b/gi, '"user"');
}

export async function connectDB() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL não está definida no arquivo .env");
  }

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });

  // Verifica a conexão na inicialização para falhar com uma mensagem clara.
  await pool.query("SELECT 1");

  return {
    exec: (sql) => pool.query(prepararSQL(sql)),
    all: async (sql, params = []) => (await pool.query(prepararSQL(sql), params)).rows,
    get: async (sql, params = []) => (await pool.query(prepararSQL(sql), params)).rows[0],
    run: async (sql, params = []) => {
      const result = await pool.query(prepararSQL(sql), params);
      return { changes: result.rowCount, rows: result.rows };
    },
    close: () => pool.end(),
  };
}
