import { pool } from '../db/postgres.js'


export async function findAllUsers() {
  const result = await pool.query('SELECT * FROM users')
  return result.rows
}

export async function insertUser(name) {
  const result = await pool.query(
    'INSERT INTO users(username) VALUES($1) RETURNING *',
    [name]
  )
  return result.rows[0]
}

export async function deleteUserbyId(id) {
  const result = await pool.query('DELETE FROM users WHERE $1 = id RETURNING *',
    [id]
  )
  return result.rows[0]
}