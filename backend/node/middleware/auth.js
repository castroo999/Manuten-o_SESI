import jwt from "jsonwebtoken";

export async function verificarToken(request, reply) {
  try {
    const authHeader = request.headers.authorization;

    //verifica se tem token
    if (!authHeader) {
      return reply.status(401).send({ error: "Token não enviado" });
    }

    //mostra só o token
    const token = authHeader.split(" ")[1];

    //verifica se o token é válido
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    //salva os dados do usuário
    request.user = decoded;

  } catch (error) {
    return reply.status(401).send({ error: "Token inválido" });
  }
}