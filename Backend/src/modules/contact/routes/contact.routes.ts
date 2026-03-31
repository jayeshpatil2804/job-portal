import { Router } from 'express'
import { sendEnquiry } from '../controllers/contact.controller'

const router = Router()

// POST /api/contact - Public endpoint for submitting contact forms
router.post('/', sendEnquiry)

export default router
