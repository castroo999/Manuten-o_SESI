CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "user" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'user',
    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "chamados" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "local" TEXT NOT NULL DEFAULT '',
    "prioridade" TEXT NOT NULL DEFAULT 'media',
    "user_id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'aberto',
    "foto" TEXT NOT NULL DEFAULT '',
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "chamados_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "chamados_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "app_migrations" (
    "id" TEXT NOT NULL,
    "applied_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "app_migrations_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "user_email_key" ON "user"("email");
CREATE INDEX "chamados_user_id_idx" ON "chamados"("user_id");
CREATE INDEX "chamados_criado_em_idx" ON "chamados"("criado_em");
