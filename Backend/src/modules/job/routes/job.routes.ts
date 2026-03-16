import { Router } from 'express'
import { protect, restrictTo } from '../../auth/middleware/auth.middleware'
import { validateJob } from '../middleware/job.validation'
import {
    createJob,
    getMyJobs,
    getJobById,
    editJob,
    closeJob,
    deleteJob,
    getAllOpenJobs
} from '../controllers/job.controller'

const router = Router()

// ─────────────────────────────────────────────────────────────
// PUBLIC routes (candidates & guests can browse open jobs)
// ─────────────────────────────────────────────────────────────
router.get('/', getAllOpenJobs)            // GET  /api/jobs
router.get('/:id', getJobById)            // GET  /api/jobs/:id

// ─────────────────────────────────────────────────────────────
// RECRUITER-ONLY routes
// ─────────────────────────────────────────────────────────────
router.use(protect, restrictTo('RECRUITER'))

router.post('/', validateJob, createJob)              // POST   /api/jobs
router.get('/recruiter/my-jobs', getMyJobs)           // GET    /api/jobs/recruiter/my-jobs
router.put('/:id', validateJob, editJob)              // PUT    /api/jobs/:id
router.patch('/:id/close', closeJob)                  // PATCH  /api/jobs/:id/close
router.delete('/:id', deleteJob)                      // DELETE /api/jobs/:id

export default router
