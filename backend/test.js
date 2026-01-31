import { pool } from './db/postgres.js'

async function test() {
  try {
    const res = await pool.query('SELECT NOW()')
    console.log('DB OK:', res.rows[0])
  } catch (err) {
    console.error('DB FAIL:', err)
  } finally {
    pool.end()
  }
}

test()