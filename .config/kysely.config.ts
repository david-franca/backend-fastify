import { defineConfig } from 'kysely-ctl'
import { Pool } from 'pg'
import { PostgresDialect } from 'kysely'
import 'dotenv/config' 

export default defineConfig({
  dialect: new PostgresDialect({
    pool: new Pool({
      host: process.env.DATABASE_HOST,
      port: +process.env.DATABASE_PORT!,
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
    }),
  }),
  migrations: {
    migrationFolder: '../src/database/migrations',
  },
  seeds: {
    seedFolder: '../src/database/seeds',
  }
})