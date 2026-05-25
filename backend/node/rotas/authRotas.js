import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { randomUUID } from "node:crypto";

export async function authRoutes(server, db) {

  // registrar
  server.post("/registrar", async (request, reply) => {

    try {

      const { user, password } = request.body;

      if (!user || !password) {
        return reply.status(400).send({
          error: "Preencha todos os campos!"
        });
      }

      if (password.length < 6) {
        return reply.status(400).send({
          error: "Senha precisa ter pelo menos 6 caracteres!"
        });
      }

      const existe = await db.get(
        "SELECT * FROM user WHERE user = ?",
        [user]
      );

      if (existe) {
        return reply.status(400).send({
          error: "Usuário já existe"
        });
      }

      const hash = await bcrypt.hash(password, 10);

      const id = randomUUID();

      const role = "user";

      await db.run(
        "INSERT INTO user (id, user, password, role) VALUES (?, ?, ?, ?)",
        [id, user, hash, role]
      );

      return reply.status(201).send({
        message: "Usuário cadastrado com sucesso!"
      });

    } catch (error) {

      console.log(error);

      return reply.status(500).send({
        error: "Erro no servidor"
      });
    }
  });

  // login
  server.post("/login", async (request, reply) => {

    try {

      const { user, password } = request.body;

      if (!user || !password) {
        return reply.status(400).send({
          error: "Preencha todos os campos!"
        });
      }

      const usuario = await db.get(
        "SELECT * FROM user WHERE user = ?",
        [user]
      );

      if (!usuario) {
        return reply.status(404).send({
          error: "Usuário não encontrado"
        });
      }

      const senhaCorreta = await bcrypt.compare(
        password,
        usuario.password
      );

      if (!senhaCorreta) {
        return reply.status(401).send({
          error: "Senha incorreta"
        });
      }

      const token = jwt.sign(
        {
          id: usuario.id,
          user: usuario.user,
          role: usuario.role
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "1h"
        }
      );

      return reply.send({ token });

    } catch (error) {

      console.log(error);

      return reply.status(500).send({
        error: "Erro no servidor"
      });
    }
  });
}