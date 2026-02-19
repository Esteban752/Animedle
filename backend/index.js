import express from 'express';
import dotenv from 'dotenv';
import { initializeScheduler } from './config/scheduler.js';
import userRoutes from './routes/user.routes.js';
import anilistRoutes from './routes/anilist.routes.js';
import dailyRoutes from './routes/daily.routes.js';
import cors from 'cors';

dotenv.config()

console.log("INDEX LOADED FROM:", process.cwd())
console.log("DB USER:", process.env.DB_USER)

// Crée l'app Express
const app = express()

// Middleware
app.use(express.json())

app.use(cors({
  origin: 'http://localhost:5173'
}))

// fonction executé tous les jours à 00h00
initializeScheduler();

// API routes
app.use('/api/users', userRoutes);

app.use('/api/anime', anilistRoutes);

app.use('/api/daily', dailyRoutes);


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

