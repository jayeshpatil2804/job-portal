import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import candidateAuthRoutes from './modules/auth/routes/candidate.routes'
import recruiterAuthRoutes from './modules/auth/routes/recruiter.routes'
import adminAuthRoutes from './modules/auth/routes/admin.routes'
import adminManagementRoutes from './modules/admin/routes/admin.management.routes'
import googleAuthRoutes from './modules/auth/routes/google.routes'
import authRoutes from './modules/auth/routes/auth.routes'
import fileRoutes from './modules/file/routes/file.routes'
import jobRoutes from './modules/job/routes/job.routes'
import applicationRoutes from './modules/job/routes/application.routes'
import interviewRoutes from './modules/job/routes/interview.routes'
import paymentRoutes from './modules/payment/routes/payment.routes'
import contactRoutes from './modules/contact/routes/contact.routes'
import path from 'path'
import { createServer } from 'http'
import { Server } from 'socket.io'

import cookieParser from 'cookie-parser'

dotenv.config()

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer, {
    cors: {
        origin: (origin, callback) => {
            callback(null, true) // Allow all origins
        },
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        credentials: true
    },
    transports: ['websocket', 'polling']
})

// Attach io to requests
app.use((req, res, next) => {
    (req as any).io = io
    next()
})

// Socket.io connections
io.on('connection', (socket) => {
    console.log('Socket client connected:', socket.id)
    
    socket.on('joinRoom', (userId) => {
        socket.join(userId)
        console.log(`User ${userId} joined socket room`)
    })

    socket.on('disconnect', () => {
        console.log('Socket client disconnected:', socket.id)
    })
})

// Middleware
app.use(cors({
    origin: (origin, callback) => {
        // Allow all origins for now or specify yours
        callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin']
}));

app.use(express.json())
app.use(cookieParser())

// Performance Logger Middleware
app.use((req, res, next) => {
    const startTime = Date.now();
    const timestamp = new Date().toISOString();
    
    res.on('finish', () => {
        const duration = Date.now() - startTime;
        const method = req.method.padEnd(7);
        const url = req.originalUrl;
        
        if (duration > 500) {
            console.warn(`\x1b[33m[SLOW REQUEST] ${timestamp} | ${method} | ${url} | ${duration}ms\x1b[0m`);
        } else {
            console.log(`\x1b[32m[PERF] ${timestamp} | ${method} | ${url} | ${duration}ms\x1b[0m`);
        }
    });
    next();
});

// Routes
app.use('/api/candidate', candidateAuthRoutes)
app.use('/api/recruiter', recruiterAuthRoutes)
app.use('/api/auth/admin', adminAuthRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/admin', adminManagementRoutes)
app.use('/api/users', googleAuthRoutes) // For Frontend API
app.use('/api/file', fileRoutes)
app.use('/api/jobs', jobRoutes)
app.use('/api/applications', applicationRoutes)
app.use('/api/interviews', interviewRoutes)
app.use('/api/payment', paymentRoutes)
app.use('/api/contact', contactRoutes)
app.use('/users', googleAuthRoutes)     // For Google Console Redirect

// Test route
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'Losodhan API is running' })
})

app.get('/api/debug-auth', (req, res) => {
    res.json({
        cookies: req.cookies,
        headers: req.headers,
        env: process.env.NODE_ENV
    })
})

const PORT = process.env.PORT || 5000

httpServer.listen(PORT, () => {
    console.log(`Server and Socket.IO running on port ${PORT}`)
})
