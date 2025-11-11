import { promises as fs } from 'fs'
import * as path from 'path'
import { Pool } from 'pg'
import {
  Kysely,
  Migrator,
  PostgresDialect,
  FileMigrationProvider,
} from 'kysely'
import { config } from 'dotenv'
import { Database } from '@/domain/models/database.model'

config()

async function migrate(command: string) {
  const db = new Kysely<Database>({
    dialect: new PostgresDialect({
      pool: new Pool({
        host: process.env.DATABASE_HOST,
        port: +process.env.DATABASE_PORT!,
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
      }),
    }),
  })

  const migrator = new Migrator({
    db,
    provider: new FileMigrationProvider({
      fs,
      path,
      migrationFolder: path.join(__dirname, 'migrations'),
    }),
  })

  let error: any
  let results: any[] | undefined

  console.log(`Running migration command: "${command}"...`)

  if (command === 'latest') {
    ({ error, results } = await migrator.migrateToLatest())
  } else if (command === 'up') {
    ({ error, results } = await migrator.migrateUp())
  } else if (command === 'down') {
    ({ error, results } = await migrator.migrateDown())
  } else {
    console.error(`Unknown command: ${command}`)
    process.exit(1)
  }

  results?.forEach((it) => {
    if (it.status === 'Success') {
      console.log(`✅ migration "${it.migrationName}" was executed successfully`)
    } else if (it.status === 'Error') {
      console.error(`❌ failed to execute migration "${it.migrationName}"`)
    }
  })

  if (error) {
    console.error('Failed to migrate')
    console.error(error)
    process.exit(1)
  }

  await db.destroy()
  console.log('Migration finished.')
}

// Pega o comando da linha de comando (ex: 'latest', 'up', 'down')
const command = process.argv[2]

if (!command) {
  console.error('Please provide a command: latest, up, or down')
  process.exit(1)
}

migrate(command)