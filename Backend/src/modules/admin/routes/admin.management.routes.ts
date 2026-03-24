import { Router } from 'express'
import { getDashboardStats, getRecentActivity } from '../controllers/dashboard.controller'
import { 
    getAllRecruiters, 
    updateRecruiterStatus, 
    getAllCandidates,
    toggleRecruiterActivation,
    toggleCandidateActivation
} from '../controllers/management.controller'
import { getAllJobs, toggleJobFlag, toggleJobRemove } from '../controllers/jobs.controller'
import { getSubAdmins, createSubAdmin, updateSubAdmin, deleteSubAdmin } from '../controllers/subadmin.controller'
import { downloadReport, getReportsMetadata } from '../controllers/reports.controller'
import { protect, restrictTo } from '../../auth/middleware/auth.middleware'

const router = Router()

// All routes here require ADMIN role
router.use(protect, restrictTo('ADMIN'))

// Dashboard
router.get('/stats', getDashboardStats)
router.get('/activity', getRecentActivity)

// Users
router.get('/recruiters', getAllRecruiters)
router.patch('/recruiters/:id/status', updateRecruiterStatus)
router.patch('/recruiters/:id/activate', toggleRecruiterActivation)

router.get('/candidates', getAllCandidates)
router.patch('/candidates/:id/activate', toggleCandidateActivation)

// Jobs Moderation
router.get('/jobs', getAllJobs)
router.patch('/jobs/:id/flag', toggleJobFlag)
router.patch('/jobs/:id/status', toggleJobRemove)

// Sub Admins
router.get('/subadmins', getSubAdmins)
router.post('/subadmins', createSubAdmin)
router.put('/subadmins/:id', updateSubAdmin)
router.delete('/subadmins/:id', deleteSubAdmin)

// Reports
router.get('/reports', getReportsMetadata)
router.get('/reports/:reportId/download', downloadReport)

export default router
