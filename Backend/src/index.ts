import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import candidateAuthRoutes from './modules/auth/routes/candidate.routes'
import recruiterAuthRoutes from './modules/auth/routes/recruiter.routes'
import googleAuthRoutes from './modules/auth/routes/google.routes'
import fileRoutes from './modules/file/routes/file.routes'
import path from 'path'

import cookieParser from 'cookie-parser'

dotenv.config()

const app = express()

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}))
app.use(express.json())
app.use(cookieParser())

// Routes
app.use('/api/candidate', candidateAuthRoutes)
app.use('/api/recruiter', recruiterAuthRoutes)
app.use('/api/users', googleAuthRoutes) // For Frontend API
app.use('/api/file', fileRoutes)
app.use('/users', googleAuthRoutes)     // For Google Console Redirect

// Test route
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'Losodhan API is running' })
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
