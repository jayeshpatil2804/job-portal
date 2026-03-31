import { lazy, Suspense, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

// UI Components
const PageLoader = () => (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="w-12 h-12 border-4 border-[#1a3c8f] border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-[#1a3c8f] font-black uppercase tracking-widest text-xs animate-pulse">Loading...</p>
    </div>
)

// Public Pages
import HomePage from './pages/public/HomePage'
const JobsPage = lazy(() => import('./pages/public/JobsPage'))
const JobDetailPage = lazy(() => import('./pages/public/JobDetailPage'))
const SelectAccountPage = lazy(() => import('./pages/public/auth/SelectAccountPage'))
const CandidateLogin = lazy(() => import('./pages/public/auth/candidate/CandidateLogin'))
const CandidateSignup = lazy(() => import('./pages/public/auth/candidate/CandidateSignup'))
const CandidateForgotPassword = lazy(() => import('./pages/public/auth/candidate/CandidateForgotPassword'))
const CandidateOtpVerify = lazy(() => import('./pages/public/auth/candidate/CandidateOtpVerify'))
const CandidateResetPassword = lazy(() => import('./pages/public/auth/candidate/CandidateResetPassword'))
const RecruiterLogin = lazy(() => import('./pages/public/auth/recruiter/RecruiterLogin'))
const RecruiterSignup = lazy(() => import('./pages/public/auth/recruiter/RecruiterSignup'))
const RecruiterForgotPassword = lazy(() => import('./pages/public/auth/recruiter/RecruiterForgotPassword'))
const RecruiterOtpVerify = lazy(() => import('./pages/public/auth/recruiter/RecruiterOtpVerify'))
const RecruiterResetPassword = lazy(() => import('./pages/public/auth/recruiter/RecruiterResetPassword'))
const GoogleCallback = lazy(() => import('./pages/public/auth/GoogleCallback'))
const CompleteProfile = lazy(() => import('./pages/public/auth/CompleteProfile'))
const PoliciesPage = lazy(() => import('./pages/public/PoliciesPage'))
const ContactPage = lazy(() => import('./pages/public/ContactPage'))

// Admin Auth Pages
const AdminLogin = lazy(() => import('./pages/public/auth/admin/AdminLogin'))
const AdminForgotPassword = lazy(() => import('./pages/public/auth/admin/AdminForgotPassword'))
const AdminOtpVerify = lazy(() => import('./pages/public/auth/admin/AdminOtpVerify'))
const AdminResetPassword = lazy(() => import('./pages/public/auth/admin/AdminResetPassword'))

// Private Pages
const ProfilePage = lazy(() => import('./pages/private/ProfilePage'))
const DashboardPage = lazy(() => import('./pages/private/DashboardPage'))
const AppliedJobsPage = lazy(() => import('./pages/private/AppliedJobsPage'))
const CandidateInfoDetails = lazy(() => import('./pages/private/candidate/CandidateInfoDetails/CandidateInfoDetails'))
const RecruiterInfoDetails = lazy(() => import('./pages/private/recruiter/RecruiterInfoDetails/RecruiterInfoDetails'))
const RecruiterHome = lazy(() => import('./pages/private/recruiter/Dashboard/RecruiterHome'))
const PostJob = lazy(() => import('./pages/private/recruiter/PostJob/PostJob'))
const ManageJobs = lazy(() => import('./pages/private/recruiter/ManageJobs/ManageJobs'))
const EditJob = lazy(() => import('./pages/private/recruiter/EditJob/EditJob'))
const ViewJob = lazy(() => import('./pages/private/recruiter/ViewJob/ViewJob'))
const Applicants = lazy(() => import('./pages/private/recruiter/Applicants/Applicants'))
const Interviews = lazy(() => import('./pages/private/recruiter/Interviews/Interviews'))
const RecruiterProfile = lazy(() => import('./pages/private/recruiter/RecruiterProfile/RecruiterProfile'))

// Lazy loaded Admin Pages
const AdminDashboard = lazy(() => import('./pages/private/admin/AdminDashboard'))
const RecruiterApproval = lazy(() => import('./pages/private/admin/RecruiterApproval'))
const CandidateManagement = lazy(() => import('./pages/private/admin/CandidateManagement'))
const JobModeration = lazy(() => import('./pages/private/admin/JobModeration'))
const SubAdminManagement = lazy(() => import('./pages/private/admin/SubAdminManagement'))
const ReportsSection = lazy(() => import('./pages/private/admin/ReportsSection'))
const DesignationManagement = lazy(() => import('./pages/private/admin/DesignationManagement'))
const SkillManagement = lazy(() => import('./pages/private/admin/SkillManagement'))

// Auth Wrappers
import CandidateProtectedRoute from './components/CandidateProtectedRoute'
import RecruiterProtectedRoute from './components/RecruiterProtectedRoute'
import AdminProtectedRoute from './components/AdminProtectedRoute'
import { checkAuth } from './redux/actions/authActions'

function App() {
    const dispatch = useDispatch()
    const { isCheckingAuth } = useSelector((state) => state.auth)

    useEffect(() => {
        dispatch(checkAuth())
    }, [dispatch])

    if (isCheckingAuth) {
        return (
            <div className="h-screen w-screen flex flex-col items-center justify-center bg-gray-50">
                <div className="w-12 h-12 border-4 border-[#1a3c8f] border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-[#1a3c8f] font-black uppercase tracking-widest text-xs">Verifying Session...</p>
            </div>
        )
    }

    return (
        <BrowserRouter>
            <Toaster position="top-center" reverseOrder={false} />
            <Suspense fallback={<PageLoader />}>
                <Routes>
                    {/* Main App Routes */}
                    <Route path="/" element={<HomePage />} />
                    <Route path="/jobs" element={<JobsPage />} />
                    <Route path="/job/:id" element={<JobDetailPage />} />
                    <Route path="/policies" element={<PoliciesPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    
                    {/* Protected Candidate Routes */}
                    <Route element={<CandidateProtectedRoute />}>
                        <Route path="/dashboard" element={<DashboardPage />} />
                        <Route path="/profile" element={<ProfilePage />} />
                        <Route path="/applied" element={<AppliedJobsPage />} />
                    </Route>

                    {/* Candidate Onboarding */}
                    <Route element={<CandidateProtectedRoute onlyAuth={true} />}>
                        <Route path="/candidate/complete-profile/:step?" element={<CandidateInfoDetails />} />
                    </Route>

                    {/* Protected Recruiter Routes */}
                    <Route element={<RecruiterProtectedRoute />}>
                        <Route path="/recruiter/dashboard" element={<RecruiterHome />} />
                        <Route path="/recruiter/post-job" element={<PostJob />} />
                        <Route path="/recruiter/manage-jobs" element={<ManageJobs />} />
                        <Route path="/recruiter/view-job/:id" element={<ViewJob />} />
                        <Route path="/recruiter/edit-job/:id" element={<EditJob />} />
                        <Route path="/recruiter/applicants/:jobId?" element={<Applicants />} />
                        <Route path="/recruiter/interviews" element={<Interviews />} />
                        <Route path="/recruiter/profile" element={<RecruiterProfile />} />
                    </Route>

                    {/* Recruiter Onboarding */}
                    <Route element={<RecruiterProtectedRoute onlyAuth={true} />}>
                        <Route path="/recruiter/complete-profile/:step?" element={<RecruiterInfoDetails />} />
                    </Route>

                    {/* Auth Selection */}
                    <Route path="/login" element={<SelectAccountPage />} />
                    <Route path="/signup" element={<SelectAccountPage />} />

                    {/* Candidate Auth Flow */}
                    <Route path="/candidate/login" element={<CandidateLogin />} />
                    <Route path="/candidate/signup" element={<CandidateSignup />} />
                    <Route path="/candidate/forgot-password" element={<CandidateForgotPassword />} />
                    <Route path="/candidate/verify-otp/:email" element={<CandidateOtpVerify />} />
                    <Route path="/candidate/reset-password" element={<CandidateResetPassword />} />

                    {/* Recruiter Auth Flow */}
                    <Route path="/recruiter/login" element={<RecruiterLogin />} />
                    <Route path="/recruiter/signup" element={<RecruiterSignup />} />
                    <Route path="/recruiter/forgot-password" element={<RecruiterForgotPassword />} />
                    <Route path="/recruiter/verify-otp/:email" element={<RecruiterOtpVerify />} />
                    <Route path="/recruiter/reset-password" element={<RecruiterResetPassword />} />

                    {/* Google Auth Callback and Flow */}
                    <Route path="/google-callback" element={<GoogleCallback />} />
                    <Route path="/auth/complete-profile" element={<CompleteProfile />} />

                    {/* Admin Routes (Protected & Lazy Loaded) */}
                    <Route element={<AdminProtectedRoute />}>
                        <Route path="/admin/dashboard" element={<AdminDashboard />} />
                        <Route path="/admin/recruiters" element={<RecruiterApproval />} />
                        <Route path="/admin/candidates" element={<CandidateManagement />} />
                        <Route path="/admin/jobs" element={<JobModeration />} />
                        <Route path="/admin/sub-admins" element={<SubAdminManagement />} />
                        <Route path="/admin/reports" element={<ReportsSection />} />
                        <Route path="/admin/designations" element={<DesignationManagement />} />
                        <Route path="/admin/skills" element={<SkillManagement />} />
                    </Route>

                    {/* Admin Auth Routes (Secure) */}
                    <Route path="/auth/admin/secure/login" element={<AdminLogin />} />
                    <Route path="/auth/admin/secure/forgot-password" element={<AdminForgotPassword />} />
                    <Route path="/auth/admin/secure/verify-otp/:email" element={<AdminOtpVerify />} />
                    <Route path="/auth/admin/secure/reset-password" element={<AdminResetPassword />} />
                </Routes>
            </Suspense>        </BrowserRouter>
    )
}

export default App 
