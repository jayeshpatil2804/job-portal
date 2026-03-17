import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import candidateAuthRoutes from './modules/auth/routes/candidate.routes'
import recruiterAuthRoutes from './modules/auth/routes/recruiter.routes'
import googleAuthRoutes from './modules/auth/routes/google.routes'
import fileRoutes from './modules/file/routes/file.routes'
import jobRoutes from './modules/job/routes/job.routes'
import applicationRoutes from './modules/job/routes/application.routes'
import interviewRoutes from './modules/job/routes/interview.routes'
import path from 'path'

import cookieParser from 'cookie-parser'

dotenv.config()

const app = express()

// Middleware
app.use((req, res, next) => {
    const origin = req.headers.origin;
    
    // Set CORS headers
    if (origin) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin, X-CSRF-Token, X-Requested-With, Content-Length, Content-MD5, Date, X-Api-Version');
    
    // Handle Preflight
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }
    next();
});

app.use(express.json())
app.use(cookieParser())

// Routes
app.use('/api/candidate', candidateAuthRoutes)
app.use('/api/recruiter', recruiterAuthRoutes)
app.use('/api/users', googleAuthRoutes) // For Frontend API
app.use('/api/file', fileRoutes)
app.use('/api/jobs', jobRoutes)
app.use('/api/applications', applicationRoutes)
app.use('/api/interviews', interviewRoutes)
app.use('/users', googleAuthRoutes)     // For Google Console Redirect

// Test route
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'Losodhan API is running' })
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
