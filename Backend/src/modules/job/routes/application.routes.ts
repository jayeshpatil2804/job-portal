import { Router } from 'express'
import { protect, restrictTo } from '../../auth/middleware/auth.middleware'
import {
    applyToJob,
    getMyApplications,
    getJobApplicants,
    updateApplicationStatus
} from '../controllers/application.controller'

const router = Router()

router.use(protect)

// Candidate routes
router.post('/apply/:jobId', restrictTo('CANDIDATE'), applyToJob)
router.get('/candidate/my', restrictTo('CANDIDATE'), getMyApplications)

// Recruiter routes
router.get('/job/:jobId', restrictTo('RECRUITER'), getJobApplicants)
router.patch('/:id/status', restrictTo('RECRUITER'), updateApplicationStatus)

export default router
