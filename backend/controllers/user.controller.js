import { findAllUsers, insertUser, deleteUserbyId } from '../services/user.service.js'

// GET
export async function getAllUsers(req, res) {
  try {
    const users = await findAllUsers()
    res.json(users)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'DB error' })
  }
}

// POST
export async function createUser(req, res) {
  const { name } = req.body

  if (!name) {
    return res.status(400).json({ error: 'Name is required' })
  }

  const user = await insertUser(name)
  res.status(201).json(user)
}

export async function deleteUser(req, res) {
  try {
      const { id } = req.params
      const deletedUser = await deleteUserbyId(id)
      
      if (!deletedUser) {
        return res.status(404).json({ error: 'User not found' })
      }
      
      res.json({ 
        message: 'User deleted successfully', 
        user: deletedUser 
      })
    } catch (error) {
      console.error('Error deleting user:', error)
      res.status(500).json({ error: 'Failed to delete user' })
  }
}

