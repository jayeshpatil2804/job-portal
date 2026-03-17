import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

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

import CandidateProtectedRoute from './components/CandidateProtectedRoute'
import RecruiterProtectedRoute from './components/RecruiterProtectedRoute'

function App() {
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

            </Routes>
        </BrowserRouter>
    )
}

export default App
