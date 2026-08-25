import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { randomUUID } from "node:crypto";

export async function authRoutes(server, db) {

  // registrar
  server.post("/registrar", async (request, reply) => {

    try {

      const { user, email, password } = request.body;
      const emailNormalizado = email?.trim().toLowerCase();

      if (!user || !emailNormalizado || !password) {
        return reply.status(400).send({
          error: "Preencha todos os campos!"
        });
      }

      if (!emailNormalizado.includes("@")) {
        return reply.status(400).send({
          error: "Informe um email valido!"
        });
      }

      if (password.length < 6) {
        return reply.status(400).send({
          error: "Senha precisa ter pelo menos 6 caracteres!"
        });
      }

      const existe = await db.get(
        "SELECT * FROM user WHERE user = ? OR lower(email) = ?",
        [user, emailNormalizado]
      );

      if (existe) {
        return reply.status(400).send({
          error: "Usuario ou email ja existe"
        });
      }

      const hash = await bcrypt.hash(password, 10);

      const id = randomUUID();

      const role = "user";

      await db.run(
        "INSERT INTO user (id, user, email, password, role) VALUES (?, ?, ?, ?, ?)",
        [id, user, emailNormalizado, hash, role]
      );

      return reply.status(201).send({
        
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

      const { email, password } = request.body;
      const emailNormalizado = email?.trim().toLowerCase();

      if (!emailNormalizado || !password) {
        return reply.status(400).send({
          error: "Preencha todos os campos!"
        });
      }

      const usuario = await db.get(
        "SELECT * FROM user WHERE lower(email) = ?",
        [emailNormalizado]
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
          email: usuario.email,
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
