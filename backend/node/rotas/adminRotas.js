import { verificarToken } from "../middleware/auth.js";

export async function adminRoutes(server, db) {

  server.get(
    "/admin/overview",
    { preHandler: verificarToken },
    async (request, reply) => {
      if (!["admin", "superadmin"].includes(request.user.role)) {
        return reply.status(403).send({ error: "Acesso negado" });
      }

      const [usuariosTotal, chamadosPorStatus, registros] = await Promise.all([
        db.user.count(),
        db.chamado.groupBy({ by: ["status"], _count: { _all: true } }),
        db.user.findMany({
          select: { id: true, username: true, email: true, role: true, _count: { select: { chamados: true } } },
        }),
      ]);

      const porStatus = Object.fromEntries(
        chamadosPorStatus.map(({ status, _count }) => [status, _count._all]),
      );
      const usuarios = registros
        .map(({ _count, username, ...usuario }) => ({ ...usuario, user: username, chamados: _count.chamados }))
        .sort((a, b) => b.chamados - a.chamados);

      return {
        stats: {
          usuarios: usuariosTotal,
          chamados: chamadosPorStatus.reduce((total, grupo) => total + grupo._count._all, 0),
          abertos: porStatus.aberto || 0,
          andamento: porStatus["em andamento"] || 0,
          resolvidos: porStatus.resolvido || 0,
        },
        usuarios,
      };
    },
  );

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

      const [usuarios, chamados, abertos, andamento, resolvidos] = await Promise.all([
        db.user.count(), db.chamado.count(), db.chamado.count({ where: { status: "aberto" } }),
        db.chamado.count({ where: { status: "em andamento" } }), db.chamado.count({ where: { status: "resolvido" } }),
      ]);

      return {
        usuarios,
        chamados,
        abertos,
        andamento,
        resolvidos,
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

      const registros = await db.user.findMany({
        select: { id: true, username: true, email: true, role: true, _count: { select: { chamados: true } } },
      });
      const usuarios = registros
        .map(({ _count, username, ...usuario }) => ({ ...usuario, user: username, chamados: _count.chamados }))
        .sort((a, b) => b.chamados - a.chamados);

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

      const usuarioAlvo = await db.user.findUnique({ where: { id }, select: { username: true, role: true } });

      if (!usuarioAlvo) {
        return reply.status(404).send({ error: "Usuário não encontrado" });
      }

      const cargoAlvo = String(usuarioAlvo.role || "").trim().toLowerCase().replace(/\s+/g, "");
      if (usuarioAlvo.username === "castro" || cargoAlvo === "superadmin") {
        return reply.status(403).send({ error: "Este usuário é protegido e não pode ser excluído" });
      }

      await db.user.delete({ where: { id } });

      return {
        message: "Usuário removido com sucesso"
      };
    }
  );

}
