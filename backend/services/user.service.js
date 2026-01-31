import { pool } from '../db/postgres.js'
console.log("USER SERVICE LOADED")


export async function findAllUsers() {
  const result = await pool.query('SELECT * FROM user')
  return result.rows
}

export async function insertUser(name) {
  const result = await pool.query(
    'INSERT INTO users(name) VALUES($1) RETURNING *',
    [name]
  )
  return result.rows[0]
}
