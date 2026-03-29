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
import { 
    getAllDesignations, 
    createDesignation, 
    updateDesignation, 
    deleteDesignation 
} from '../controllers/designation.controller'
import { 
    getAllSkills, 
    createSkill, 
    updateSkill, 
    deleteSkill 
} from '../controllers/skill.controller'
import { protect, restrictTo, checkPermission } from '../../auth/middleware/auth.middleware'

const router = Router()

// Public or Shared read routes (Recruiters need these to post jobs)
router.get('/designations', protect, getAllDesignations)
router.get('/skills', protect, getAllSkills)
router.post('/skills', protect, restrictTo('ADMIN', 'RECRUITER'), createSkill)

// All other routes here require ADMIN role
router.use(protect, restrictTo('ADMIN'))

// Dashboard (Requires ANY admin permission or Super Admin status)
router.get('/stats', getDashboardStats)
router.get('/activity', getRecentActivity)

// Users
router.get('/recruiters', checkPermission('RECRUITER_APPROVAL'), getAllRecruiters)
router.patch('/recruiters/:id/status', checkPermission('RECRUITER_APPROVAL'), updateRecruiterStatus)
router.patch('/recruiters/:id/activate', checkPermission('RECRUITER_APPROVAL'), toggleRecruiterActivation)

router.get('/candidates', checkPermission('CANDIDATE_MANAGEMENT'), getAllCandidates)
router.patch('/candidates/:id/activate', checkPermission('CANDIDATE_MANAGEMENT'), toggleCandidateActivation)

// Jobs Moderation
router.get('/jobs', checkPermission('JOB_MODERATION'), getAllJobs)
router.patch('/jobs/:id/flag', checkPermission('JOB_MODERATION'), toggleJobFlag)
router.patch('/jobs/:id/status', checkPermission('JOB_MODERATION'), toggleJobRemove)

// Sub Admins
router.get('/subadmins', checkPermission('SUB_ADMIN_MANAGEMENT'), getSubAdmins)
router.post('/subadmins', checkPermission('SUB_ADMIN_MANAGEMENT'), createSubAdmin)
router.put('/subadmins/:id', checkPermission('SUB_ADMIN_MANAGEMENT'), updateSubAdmin)
router.delete('/subadmins/:id', checkPermission('SUB_ADMIN_MANAGEMENT'), deleteSubAdmin)

// Reports
router.get('/reports', checkPermission('REPORTS'), getReportsMetadata)
router.get('/reports/:reportId/download', checkPermission('REPORTS'), downloadReport)

// Designations modifications (ADMIN ONLY)
router.post('/designations', createDesignation)
router.put('/designations/:id', updateDesignation)
router.delete('/designations/:id', deleteDesignation)

// Skills modifications (ADMIN ONLY)
router.put('/skills/:id', updateSkill)
router.delete('/skills/:id', deleteSkill)

export default router
