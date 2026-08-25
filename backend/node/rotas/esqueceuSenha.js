import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

function criarTransporterEmail() {
  const porta = Number(process.env.SMTP_PORT || 587);

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: porta,
    secure: porta === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
}

function emailConfigurado() {
  return Boolean(
    process.env.SMTP_HOST &&
    process.env.SMTP_USER &&
    process.env.SMTP_PASS
  );
}

export async function recuperarSenha(server, db) {
  server.post("/auth/esqueci-senha", async (request, reply) => {
    const { email } = request.body;
    const emailNormalizado = email?.trim().toLowerCase();

    if (!emailNormalizado) {
      return reply.status(400).send({
        error: "Informe o email"
      });
    }

    const usuario = await db.get(
      "SELECT * FROM user WHERE lower(email) = ?",
      [emailNormalizado]
    );

    // Nao revela se o email existe ou nao
    if (!usuario) {
      return reply.send({
        message: "Uma requisicao de recuperacao de senha foi enviada para voce"
      });
    }

    if (!emailConfigurado()) {
      return reply.status(500).send({
        error: "Envio de email nao configurado no servidor"
      });
    }

    const tokenRecuperacao = jwt.sign(
      {
        id: usuario.id,
        tipo: "recuperacao-senha"
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "15m"
      }
    );

    const transporter = criarTransporterEmail();
    const link = `${process.env.FRONTEND_URL || "http://localhost:5173"}/esqueci-senha?token=${tokenRecuperacao}`;

    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: usuario.email,
      subject: "Recuperacao de senha",
      text: `Ola, ${usuario.user}. Use este link para redefinir sua senha: ${link}`,
      html: `
        <p>Ola, ${usuario.user}.</p>
        <p>Use o link abaixo para redefinir sua senha. Ele expira em 15 minutos.</p>
        <p><a href="${link}">Redefinir senha</a></p>
      `
    });

    return reply.send({
      message: "Uma requisicao de recuperacao de senha foi enviada para voce"
    });
  });

  server.post("/auth/redefinir-senha", async (request, reply) => {
    const { token, password } = request.body;

    if (!token || !password) {
      return reply.status(400).send({
        error: "Informe o token e a nova senha"
      });
    }

    if (password.length < 6) {
      return reply.status(400).send({
        error: "Senha precisa ter pelo menos 6 caracteres!"
      });
    }

    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);

      if (payload.tipo !== "recuperacao-senha") {
        return reply.status(401).send({
          error: "Token invalido"
        });
      }

      const usuario = await db.get(
        "SELECT * FROM user WHERE id = ?",
        [payload.id]
      );

      if (!usuario) {
        return reply.status(404).send({
          error: "Usuario nao encontrado"
        });
      }

      const hash = await bcrypt.hash(password, 10);

      await db.run(
        "UPDATE user SET password = ? WHERE id = ?",
        [hash, payload.id]
      );

      return reply.send({
        message: "Senha redefinida com sucesso"
      });
    } catch (error) {
      return reply.status(401).send({
        error: "Token invalido ou expirado"
      });
    }
  });
}
