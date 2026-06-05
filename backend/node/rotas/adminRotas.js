import { verificarToken } from "../middleware/auth.js";

export async function adminRoutes(server, db) {

  // estatísticas do sistema
  server.get(
    "/admin/stats",
    { preHandler: verificarToken },
    async (request, reply) => {

      const isAdmin =
        request.user.role === "admin" ||
        request.user.role === "superadmin";

      if (!isAdmin) {
        return reply.status(403).send({
          error: "Acesso negado"
        });
      }

      const usuarios = await db.get(
        "SELECT COUNT(*) as total FROM user"
      );

      const chamados = await db.get(
        "SELECT COUNT(*) as total FROM chamados"
      );

      const abertos = await db.get(
        "SELECT COUNT(*) as total FROM chamados WHERE status = 'aberto'"
      );

      const andamento = await db.get(
        "SELECT COUNT(*) as total FROM chamados WHERE status = 'em andamento'"
      );

      const resolvidos = await db.get(
        "SELECT COUNT(*) as total FROM chamados WHERE status = 'resolvido'"
      );

      return {
        usuarios: usuarios.total,
        chamados: chamados.total,
        abertos: abertos.total,
        andamento: andamento.total,
        resolvidos: resolvidos.total,
      };
    }
  );

  // listar usuários e quantidade de chamados
  server.get(
    "/admin/usuarios",
    { preHandler: verificarToken },
    async (request, reply) => {

      const isAdmin =
        request.user.role === "admin" ||
        request.user.role === "superadmin";

      if (!isAdmin) {
        return reply.status(403).send({
          error: "Acesso negado"
        });
      }

      const usuarios = await db.all(`
        SELECT
          user.id,
          user.user,
          user.role,
          COUNT(chamados.id) as chamados
        FROM user
        LEFT JOIN chamados
          ON chamados.user_id = user.id
        GROUP BY user.id
        ORDER BY chamados DESC
      `);

      return usuarios;
    }
  );

  // deletar usuário (somente superadmin)
  server.delete(
    "/admin/usuarios/:id",
    { preHandler: verificarToken },
    async (request, reply) => {

      if (request.user.role !== "superadmin") {
        return reply.status(403).send({
          error: "Apenas superadmins podem excluir usuários"
        });
      }

      const { id } = request.params;

      await db.run(
        "DELETE FROM chamados WHERE user_id = ?",
        [id]
      );

      await db.run(
        "DELETE FROM user WHERE id = ?",
        [id]
      );

      return {
        message: "Usuário removido com sucesso"
      };
    }
  );

}