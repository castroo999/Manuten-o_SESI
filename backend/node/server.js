import fastify from "fastify";
import cors from "@fastify/cors";
import multipart from "@fastify/multipart";
import fastifyStatic from "@fastify/static";
import "dotenv/config";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { adminRoutes } from "./rotas/adminRotas.js";
import { initDB } from "./db/connect.js";
import { authRoutes } from "./rotas/authRotas.js";
import { chamadosRoutes } from "./rotas/chamadosRotas.js";
import { recuperarSenha } from "./rotas/esqueceuSenha.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// cria servidor
const server = fastify();

// conecta banco
const db = await initDB();

// cors
await server.register(cors, {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
});

await server.register(multipart, {
  limits: {
    fileSize: 5 * 1024 * 1024
  }
});

await server.register(fastifyStatic, {
  root: join(__dirname, "uploads"),
  prefix: "/uploads/"
});

//rotas
authRoutes(server, db);
chamadosRoutes(server, db);
adminRoutes(server, db);
recuperarSenha(server, db);


// erro global
server.setErrorHandler((error, request, reply) => {

  console.error("ERRO GLOBAL:", error);

  if (error.validation) {
    return reply.status(400).send({
      error: "Dados inválidos"
    });
  }

  return reply.status(500).send({
    error: "Erro interno do servidor"
  });
});

// iniciar servidor
server.listen({
  port: process.env.PORT || 3000
}, () => {
  console.log("Servidor rodando na porta 3000");
});
