import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import { extname, join } from "node:path";
import { verificarToken } from "../middleware/auth.js";

const uploadDir = join(process.cwd(), "uploads", "chamados");

async function lerDadosChamado(request) {
  if (!request.isMultipart()) {
    return {
      campos: request.body,
      foto: ""
    };
  }

  const campos = {};
  let foto = "";

  for await (const parte of request.parts()) {
    if (parte.type === "file") {
      if (!parte.filename) {
        continue;
      }

      if (!parte.mimetype.startsWith("image/")) {
        throw new Error("A foto precisa ser uma imagem");
      }

      await mkdir(uploadDir, { recursive: true });

      const extensao = extname(parte.filename) || ".jpg";
      const nomeArquivo = `${randomUUID()}${extensao}`;
      const caminhoArquivo = join(uploadDir, nomeArquivo);
      const buffer = await parte.toBuffer();

      await writeFile(caminhoArquivo, buffer);
      foto = `/uploads/chamados/${nomeArquivo}`;
      continue;
    }

    campos[parte.fieldname] = parte.value;
  }

  return {
    campos,
    foto
  };
}

export async function chamadosRoutes(server, db) {

  // criar chamado
  server.post(
    "/chamados",
    { preHandler: verificarToken },
    async (request, reply) => {

      try {

        const { campos, foto } = await lerDadosChamado(request);
        const {
          titulo,
          descricao,
          local,
          prioridade
        } = campos;

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
          (id, titulo, descricao, local, prioridade, user_id, status, foto, criado_em)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
          `,
          [
            id,
            titulo,
            descricao,
            local || "",
            prioridade || "media",
            user_id,
            status,
            foto,
            criado_em
          ]
        );

        return reply.status(201).send({
          message: "Chamado criado com sucesso!"
        });

      } catch (error) {

        console.log(error);

        if (error.message === "A foto precisa ser uma imagem") {
          return reply.status(400).send({
            error: error.message
          });
        }

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

        if (request.user.role === "admin" || 
            request.user.role === "superadmin") {

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

        if (request.user.role !== "superadmin" &&
            request.user.role !== "admin"
        ) {
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
          [titulo, descricao, local, prioridade, status, id]
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

        if (request.user.role !== "superadmin" &&
            request.user.role !== "admin"
        ) {
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
