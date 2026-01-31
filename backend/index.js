import express from 'express'
import path from 'path'
import dotenv from 'dotenv'
import userRoutes from './routes/user.routes.js'

dotenv.config()

console.log("INDEX LOADED FROM:", process.cwd())
console.log("DB USER:", process.env.DB_USER)

// Crée l'app Express
const app = express()

// Middleware
app.use(express.json())

// API routes
app.use('/api/users', userRoutes)

// Static frontend (Vue build)
app.use(express.static('../frontend/dist'))

// Test route
app.get('/ping', (req, res) => {
  res.json({ ok: true })
})

// SPA fallback
app.all('/{*any}', (req, res, next) => {})


// Start server
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})

