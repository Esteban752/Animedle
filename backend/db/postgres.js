import pkg from 'pg'
import dotenv from 'dotenv'
dotenv.config()

const { Pool } = pkg

const pool = new Pool({
    host: process.env.DB_HOST || 'db',
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER || 'roica',
    password: process.env.DB_PASSWORD || 'roicalamar',
    database: process.env.DB_NAME || 'shonendle'
});

export { pool }