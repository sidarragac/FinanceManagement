import app from '@adonisjs/core/services/app'
import { defineConfig } from '@adonisjs/lucid'
import env from '#start/env'

const dbConfig = defineConfig({
  /**
   * Conexión por defecto (PostgreSQL)
   */
  connection: env.get('DB_CONNECTION') ?? 'postgres',

  /**
   * Imprime las consultas SQL formateadas en modo desarrollo
   */
  prettyPrintDebugQueries: true,

  connections: {
    postgres: {
      client: 'pg',
      connection: {
        host: env.get('DB_HOST'),
        port: env.get('DB_PORT') ? Number(env.get('DB_PORT')) : 5432,
        user: env.get('DB_USER'),
        password: env.get('DB_PASSWORD'),
        database: env.get('DB_DATABASE'),
      },
      migrations: {
        naturalSort: true,
        paths: ['database/migrations'],
      },
      debug: app.inDev,
    },
  },
})

export default dbConfig
