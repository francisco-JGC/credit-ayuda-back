import 'dotenv/config'
import { DataSource } from 'typeorm'

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  // logging: true,
  synchronize: false,
  ssl: {
    rejectUnauthorized: false
  },
  entities:
    process.env.NODE_ENV === 'production'
      ? ['build/entities/**/*.entity.js']
      : ['src/entities/**/*.entity.ts']
})
