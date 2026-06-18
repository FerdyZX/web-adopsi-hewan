import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import dotenv from 'dotenv'
import authRoutes from './routes/authRoutes.js'
import animalRoutes from './routes/animalRoutes.js'
import shelterRoutes from './routes/shelterRoutes.js'
import adoptionRoutes from './routes/adoptionRoutes.js'
import articleRoutes from './routes/articleRoutes.js'

dotenv.config()

const app = express()

// Middleware
app.use(helmet())
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ limit: '10mb', extended: true }))

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
})
app.use(limiter)

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() })
})

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/hewan', animalRoutes)
app.use('/api/shelter', shelterRoutes)
app.use('/api/adopsi', adoptionRoutes)
app.use('/api/artikel', articleRoutes)

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    status: err.status || 500,
  })
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Endpoint tidak ditemukan' })
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`✅ Server berjalan di port ${PORT}`)
  console.log(`Environment: ${process.env.NODE_ENV}`)
})
