import express from 'express'
import { getAllUsers, createUser, deleteUser } from '../controllers/user.controller.js'

const router = express.Router()

// GET /api/users
router.get('/', getAllUsers);

// POST /api/users
router.post('/', createUser);

// DELETE /api/users/:id
router.delete('/:id', deleteUser);

export default router
