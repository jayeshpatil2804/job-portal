import { Router } from 'express'
import { googleCallback, syncGoogleUser, completeProfile, logout } from '../controllers/google.controller'

const router = Router()

router.get('/google/callback', googleCallback)
router.post('/sync-google', syncGoogleUser)
router.post('/complete-profile', completeProfile)
router.get('/logout', logout)

export default router
