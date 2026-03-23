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
import JobsPage from './pages/public/JobsPage'
import JobDetailPage from './pages/public/JobDetailPage'
import SelectAccountPage from './pages/public/auth/SelectAccountPage'
import CandidateLogin from './pages/public/auth/candidate/CandidateLogin'
import CandidateSignup from './pages/public/auth/candidate/CandidateSignup'
import CandidateForgotPassword from './pages/public/auth/candidate/CandidateForgotPassword'
import CandidateOtpVerify from './pages/public/auth/candidate/CandidateOtpVerify'
import CandidateResetPassword from './pages/public/auth/candidate/CandidateResetPassword'
import RecruiterLogin from './pages/public/auth/recruiter/RecruiterLogin'
import RecruiterSignup from './pages/public/auth/recruiter/RecruiterSignup'
import RecruiterForgotPassword from './pages/public/auth/recruiter/RecruiterForgotPassword'
import RecruiterOtpVerify from './pages/public/auth/recruiter/RecruiterOtpVerify'
import RecruiterResetPassword from './pages/public/auth/recruiter/RecruiterResetPassword'
import GoogleCallback from './pages/public/auth/GoogleCallback'
import CompleteProfile from './pages/public/auth/CompleteProfile'

// Admin Auth Pages
import AdminLogin from './pages/public/auth/admin/AdminLogin'
import AdminForgotPassword from './pages/public/auth/admin/AdminForgotPassword'
import AdminOtpVerify from './pages/public/auth/admin/AdminOtpVerify'
import AdminResetPassword from './pages/public/auth/admin/AdminResetPassword'

// Private Pages
import ProfilePage from './pages/private/ProfilePage'
import DashboardPage from './pages/private/DashboardPage'
import AppliedJobsPage from './pages/private/AppliedJobsPage'
import CandidateInfoDetails from './pages/private/candidate/CandidateInfoDetails/CandidateInfoDetails'
import RecruiterInfoDetails from './pages/private/recruiter/RecruiterInfoDetails/RecruiterInfoDetails'
import RecruiterHome from './pages/private/recruiter/Dashboard/RecruiterHome'
import PostJob from './pages/private/recruiter/PostJob/PostJob'
import ManageJobs from './pages/private/recruiter/ManageJobs/ManageJobs'
import EditJob from './pages/private/recruiter/EditJob/EditJob'
import ViewJob from './pages/private/recruiter/ViewJob/ViewJob'
import Applicants from './pages/private/recruiter/Applicants/Applicants'
import Interviews from './pages/private/recruiter/Interviews/Interviews'
import RecruiterProfile from './pages/private/recruiter/RecruiterProfile/RecruiterProfile'

// Lazy loaded Admin Pages
const AdminDashboard = lazy(() => import('./pages/private/admin/AdminDashboard'))
const RecruiterApproval = lazy(() => import('./pages/private/admin/RecruiterApproval'))
const CandidateManagement = lazy(() => import('./pages/private/admin/CandidateManagement'))
const JobModeration = lazy(() => import('./pages/private/admin/JobModeration'))
const SubAdminManagement = lazy(() => import('./pages/private/admin/SubAdminManagement'))
const ReportsSection = lazy(() => import('./pages/private/admin/ReportsSection'))

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
            <Routes>
                {/* Main App Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/jobs" element={<JobsPage />} />
                <Route path="/job/:id" element={<JobDetailPage />} />
                
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
                    <Route path="/admin/dashboard" element={
                        <Suspense fallback={<PageLoader />}>
                            <AdminDashboard />
                        </Suspense>
                    } />
                    <Route path="/admin/recruiters" element={
                        <Suspense fallback={<PageLoader />}>
                            <RecruiterApproval />
                        </Suspense>
                    } />
                    <Route path="/admin/candidates" element={
                        <Suspense fallback={<PageLoader />}>
                            <CandidateManagement />
                        </Suspense>
                    } />
                    <Route path="/admin/jobs" element={
                        <Suspense fallback={<PageLoader />}>
                            <JobModeration />
                        </Suspense>
                    } />
                    <Route path="/admin/sub-admins" element={
                        <Suspense fallback={<PageLoader />}>
                            <SubAdminManagement />
                        </Suspense>
                    } />
                    <Route path="/admin/reports" element={
                        <Suspense fallback={<PageLoader />}>
                            <ReportsSection />
                        </Suspense>
                    } />
                </Route>

                {/* Admin Auth Routes (Secure) */}
                <Route path="/auth/admin/secure/login" element={<AdminLogin />} />
                <Route path="/auth/admin/secure/forgot-password" element={<AdminForgotPassword />} />
                <Route path="/auth/admin/secure/verify-otp/:email" element={<AdminOtpVerify />} />
                <Route path="/auth/admin/secure/reset-password" element={<AdminResetPassword />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App 
