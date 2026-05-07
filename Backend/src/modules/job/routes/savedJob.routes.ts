import { Router } from 'express'
import { protect, restrictTo } from '../../auth/middleware/auth.middleware'
import {
    toggleSaveJob,
    getMySavedJobs,
    checkIfSaved
} from '../controllers/savedJob.controller'

const router = Router()

router.use(protect)
router.use(restrictTo('CANDIDATE'))

router.post('/toggle/:jobId', toggleSaveJob)
router.get('/', getMySavedJobs)
router.get('/check/:jobId', checkIfSaved)

export default router
