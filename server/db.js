import pg from 'pg'
import dotenv from 'dotenv'

const { Pool } = pg
dotenv.config()

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
})

export async function query(text, params) {
    const res = await pool.query(text, params)
    return res
}

export default pool
