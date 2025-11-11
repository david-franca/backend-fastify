import { Database } from "@/domain/models/database.model";
import { FastifyInstance } from "fastify";
import fp from "fastify-plugin"; // fastify-plugin é importante!
import {
  Kysely,
  PostgresDialect,
} from "kysely";
import { Pool } from "pg";
import { env } from "@/env";

// Este plugin irá "decorar" a instância do Fastify com 'app.db'
async function databasePlugin(app: FastifyInstance) {
  const pool = new Pool({
    host: env.DATABASE_HOST,
    port: env.DATABASE_PORT,
    user: env.DATABASE_USER,
    password: env.DATABASE_PASSWORD,
    database: env.DATABASE_NAME,
  });

  const dialect = new PostgresDialect({
    pool,
  });

  const db = new Kysely<Database>({
    dialect,
  });

  try {
    // Tenta conectar para validar as credenciais
    await pool.query("SELECT 1");
    console.log("Database connection successful");

    // Disponibiliza o pool para toda a aplicação via 'app.db'
    app.decorate("db", db);

    // Garante que o pool será fechado quando o app desligar
    app.addHook("onClose", async () => {
      await pool.end();
      console.log("Database connection closed");
    });
  } catch (error) {
    console.error("Failed to connect to database:", error);
    // Impede o servidor de iniciar se o DB falhar
    throw error;
  }
}

export const database = fp(databasePlugin);

declare module "fastify" {
  // Define que a interface FastifyInstance agora
  // possui uma propriedade 'db' do tipo Kysely<Database>
  export interface FastifyInstance {
    db: Kysely<Database>;
  }
}
