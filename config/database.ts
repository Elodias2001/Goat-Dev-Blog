// import Env from '@ioc:Adonis/Core/Env'
// import { DatabaseConfig } from '@ioc:Adonis/Lucid/Database'

// const databaseConfig: DatabaseConfig = {
//   connection: Env.get('DB_CONNECTION'),
//   connections: {
//     pg: {
//       client: 'pg',
//       connection: {
//         host: Env.get('PG_HOST'),
//         port: Env.get('PG_PORT'),
//         user: Env.get('PG_USER'),
//         password: Env.get('PG_PASSWORD', ''),
//         database: Env.get('PG_DB_NAME'),
//       },
//       migrations: {
//         naturalSort: true,
//       },
//       healthCheck: false,
//       debug: false,
//     },
//   }
// }

// export default databaseConfig

import app from '@adonisjs/core/services/app'
import { defineConfig } from '@adonisjs/lucid'

const dbConfig = defineConfig({
  connection: 'sqlite',
  connections: {
    sqlite: {
      client: 'better-sqlite3',
      connection: {
        filename: app.tmpPath('db.sqlite3'),
      },
      useNullAsDefault: true,
      migrations: {
        naturalSort: true,
        paths: ['database/migrations'],
      },
    },
  },
})

export default dbConfig
