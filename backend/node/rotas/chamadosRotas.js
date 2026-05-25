import { randomUUID } from "node:crypto";
import { verificarToken } from "../middleware/auth.js";

export async function chamadosRoutes(server, db) {

  // criar chamado
  server.post(
    "/chamados",
    { preHandler: verificarToken },
    async (request, reply) => {

      try {

        const {
          titulo,
          descricao,
          local,
          prioridade
        } = request.body;

        if (!titulo || !descricao) {
          return reply.status(400).send({
            error: "Título e descrição são obrigatórios!"
          });
        }

        const id = randomUUID();

        const criado_em = new Date().toISOString();

        const user_id = request.user.id;

        const status = "aberto";

        await db.run(
          `
          INSERT INTO chamados
          (id, titulo, descricao, local, prioridade, user_id, status, criado_em)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
          `,
          [
            id,
            titulo,
            descricao,
            local || "",
            prioridade || "media",
            user_id,
            status,
            criado_em
          ]
        );

        return reply.status(201).send({
          message: "Chamado criado com sucesso!"
        });

      } catch (error) {

        console.log(error);

        return reply.status(500).send({
          error: "Erro ao criar chamado"
        });
      }
    }
  );

  // listar
  server.get(
    "/chamados",
    { preHandler: verificarToken },
    async (request, reply) => {

      try {

        if (request.user.role === "admin") {

          return await db.all(
            "SELECT * FROM chamados ORDER BY criado_em DESC"
          );
        }

        return await db.all(
          `
          SELECT * FROM chamados
          WHERE user_id = ?
          ORDER BY criado_em DESC
          `,
          [request.user.id]
        );

      } catch (error) {

        console.log(error);

        return reply.status(500).send({
          error: "Erro ao listar chamados"
        });
      }
    }
  );

  // editar
  server.put(
    "/chamados/:id",
    { preHandler: verificarToken },
    async (request, reply) => {

      try {

        if (request.user.role !== "admin") {
          return reply.status(403).send({
            error: "Apenas admin pode editar"
          });
        }

        const { id } = request.params;

        const {
          titulo,
          descricao,
          local,
          prioridade,
          status
        } = request.body;

        await db.run(
          `
          UPDATE chamados
          SET
            titulo = ?,
            descricao = ?,
            local = ?,
            prioridade = ?,
            status = ?
          WHERE id = ?
          `,
          [
            titulo,
            descricao,
            local,
            prioridade,
            status,
            id
          ]
        );

        return reply.send({
          message: "Chamado atualizado"
        });

      } catch (error) {

        console.log(error);

        return reply.status(500).send({
          error: "Erro ao editar chamado"
        });
      }
    }
  );

  // deletar
  server.delete(
    "/chamados/:id",
    { preHandler: verificarToken },
    async (request, reply) => {

      try {

        if (request.user.role !== "admin") {
          return reply.status(403).send({
            error: "Apenas admin pode deletar"
          });
        }

        const { id } = request.params;

        await db.run(
          "DELETE FROM chamados WHERE id = ?",
          [id]
        );

        return reply.send({
          message: "Chamado deletado"
        });

      } catch (error) {

        console.log(error);

        return reply.status(500).send({
          error: "Erro ao deletar chamado"
        });
      }
    }
  );
}