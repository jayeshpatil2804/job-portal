import { Router } from 'express'
import { protect, restrictTo } from '../../auth/middleware/auth.middleware'
import {
    scheduleInterview,
    getMyInterviews
} from '../controllers/interview.controller'

const router = Router()

router.use(protect)

router.get('/my', getMyInterviews)
router.post('/schedule', restrictTo('RECRUITER'), scheduleInterview)

export default router
