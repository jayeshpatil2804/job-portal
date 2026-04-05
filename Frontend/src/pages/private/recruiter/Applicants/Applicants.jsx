import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import RecruiterLayout from '../../../../components/RecruiterLayout'
import { Search, Download, Mail, CheckCircle, XCircle, Calendar, Filter, User, MapPin, Briefcase } from 'lucide-react'
import { motion } from 'framer-motion'
import { getJobApplicants, updateApplicationStatus } from '../../../../redux/actions/applicationActions'
import { scheduleInterview } from '../../../../redux/actions/interviewActions'
import { clearInterviewStates } from '../../../../redux/slices/interviewSlice'
import ScheduleInterviewModal from '../../../../components/ScheduleInterviewModal'
import { toast } from 'react-hot-toast'
import ActivationDialog from '../../../../components/common/ActivationDialog'

const SummaryCard = ({ label, count, color, icon: Icon }) => (
    <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex-1 min-w-[180px] relative overflow-hidden group">
        <div className={`absolute top-0 right-0 w-24 h-24 rounded-full blur-3xl opacity-10 -mr-12 -mt-12 transition-all group-hover:scale-150 ${color.replace('text-', 'bg-')}`} />
        <div className="relative flex items-center justify-between">
            <div>
                <h4 className="text-4xl font-black text-gray-900 tracking-tight">{count}</h4>
                <p className={`text-xs font-black uppercase tracking-widest mt-1 ${color}`}>{label}</p>
            </div>
            {Icon && <Icon size={24} className={`${color} opacity-40`} />}
        </div>
    </div>
)

const Applicants = () => {
    const { jobId } = useParams()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    
    const { applicants, loading } = useSelector(state => state.application)
    const { loading: interviewLoading, success: interviewSuccess } = useSelector(state => state.interview)
    const { isActive, isPaid } = useSelector(state => state.recruiterProfile)
    
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('ALL')
    const [selectedApplicant, setSelectedApplicant] = useState(null)
    const [isInterviewModalOpen, setIsInterviewModalOpen] = useState(false)

    useEffect(() => {
        if (jobId) {
            dispatch(getJobApplicants(jobId))
        }
    }, [dispatch, jobId])

    useEffect(() => {
        if (interviewSuccess) {
            toast.success('Interview scheduled successfully!')
            setIsInterviewModalOpen(false)
            dispatch(clearInterviewStates())
            // Re-fetch to update status in UI if needed, though slice handles it
            if (jobId) dispatch(getJobApplicants(jobId))
        }
    }, [interviewSuccess, dispatch, jobId])

    const handleStatusUpdate = async (id, status, label) => {
        const result = await dispatch(updateApplicationStatus({ id, status }))
        if (updateApplicationStatus.fulfilled.match(result)) {
            toast.success(`Candidate ${label.toLowerCase()}ed successfully`)
        } else {
            toast.error(result.payload || `Failed to ${label.toLowerCase()} candidate`)
        }
    }

    const handleOpenInterviewModal = (applicant) => {
        setSelectedApplicant(applicant)
        setIsInterviewModalOpen(true)
    }

    const handleConfirmInterview = (data) => {
        dispatch(scheduleInterview({
            applicationId: selectedApplicant.id,
            ...data
        }))
    }

    const getStatusStyle = (status) => {
        switch (status) {
            case 'APPLIED': return 'bg-blue-100 text-blue-700'
            case 'VIEWED': return 'bg-yellow-100 text-yellow-700'
            case 'SHORTLISTED': return 'bg-purple-100 text-purple-700'
            case 'INTERVIEW_SCHEDULED': return 'bg-green-100 text-green-700'
            case 'REJECTED': return 'bg-red-100 text-red-700'
            case 'HIRED': return 'bg-emerald-100 text-emerald-700'
            default: return 'bg-gray-100 text-gray-700'
        }
    }

    const filteredApplicants = applicants.filter(app => {
        const matchesSearch = 
            app.candidate.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            app.candidate.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'ALL' || app.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const stats = {
        total: applicants.length,
        shortlisted: applicants.filter(a => a.status === 'SHORTLISTED').length,
        interviews: applicants.filter(a => a.status === 'INTERVIEW_SCHEDULED').length,
        rejected: applicants.filter(a => a.status === 'REJECTED').length
    }

    return (
        <RecruiterLayout>
            {!isActive && (
                <ActivationDialog 
                    isOpen={true} 
                    isPaid={isPaid} 
                    userType="RECRUITER" 
                    onClose={() => navigate('/recruiter/dashboard')} 
                />
            )}
            <ScheduleInterviewModal 
                isOpen={isInterviewModalOpen}
                onClose={() => setIsInterviewModalOpen(false)}
                onConfirm={handleConfirmInterview}
                applicantName={selectedApplicant?.candidate?.fullName}
                loading={interviewLoading}
            />

            <div className="max-w-[1400px] mx-auto space-y-10 pb-20">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                    <div className="space-y-2">
                        <button 
                            onClick={() => navigate('/recruiter/manage-jobs')}
                            className="text-xs font-black text-[#1a3c8f] uppercase tracking-widest flex items-center gap-2 hover:translate-x-1 transition-transform"
                        >
                            ← BACK TO JOBS
                        </button>
                        <h1 className="text-4xl font-black text-gray-900 tracking-tight">Job Applicants</h1>
                        <p className="text-lg font-medium text-gray-500">
                            {jobId ? 'Managing candidates for this position' : 'All your candidates in one place'}
                        </p>
                    </div>
                </div>

                {/* Statistics Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <SummaryCard label="Total Applied" count={stats.total} color="text-gray-900" icon={User} />
                    <SummaryCard label="Shortlisted" count={stats.shortlisted} color="text-purple-600" icon={CheckCircle} />
                    <SummaryCard label="Interviews" count={stats.interviews} color="text-green-600" icon={Calendar} />
                    <SummaryCard label="Rejected" count={stats.rejected} color="text-red-500" icon={XCircle} />
                </div>

                {/* Search and Filters */}
                <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col lg:flex-row gap-6 items-center">
                    <div className="relative flex-1 w-full group">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-[#1a3c8f]" size={20} />
                        <input 
                            type="text" 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search candidates by name, email or skills..." 
                            className="w-full pl-14 pr-6 py-4 bg-gray-50 border-2 border-transparent focus:border-[#1a3c8f] focus:bg-white rounded-[1.5rem] outline-none transition-all font-bold text-gray-700"
                        />
                    </div>
                    <div className="flex gap-4 w-full lg:w-auto">
                        <div className="relative flex-1 lg:w-64 group">
                            <Filter className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#1a3c8f]" size={18} />
                            <select 
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="w-full pl-14 pr-10 py-4 bg-gray-50 border-2 border-transparent focus:border-[#1a3c8f] focus:bg-white rounded-[1.5rem] outline-none shadow-none font-bold text-gray-600 appearance-none cursor-pointer"
                            >
                                <option value="ALL">All Statuses</option>
                                <option value="APPLIED">Applied</option>
                                <option value="SHORTLISTED">Shortlisted</option>
                                <option value="INTERVIEW_SCHEDULED">Interview Set</option>
                                <option value="REJECTED">Rejected</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Table Section */}
                <div className="bg-white rounded-[3rem] shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-50/50">
                                    <th className="px-10 py-6 text-left text-xs font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100">Candidate Info</th>
                                    <th className="px-10 py-6 text-left text-xs font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100">Experience</th>
                                    <th className="px-10 py-6 text-left text-xs font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100">Status</th>
                                    <th className="px-10 py-6 text-center text-xs font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {useSelector(state => state.application.error) && (
                                    <tr>
                                        <td colSpan="4" className="px-10 py-6">
                                            <div className="bg-red-50 text-red-600 p-4 rounded-2xl flex items-center gap-3 border border-red-100">
                                                <AlertCircle size={20} />
                                                <p className="text-xs font-black uppercase tracking-widest">
                                                    Error: {useSelector(state => state.application.error)}
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                                {loading ? (
                                    <tr>
                                        <td colSpan="4" className="px-10 py-20 text-center">
                                            <div className="flex flex-col items-center gap-4">
                                                <div className="w-12 h-12 border-4 border-[#1a3c8f] border-t-transparent rounded-full animate-spin" />
                                                <p className="font-bold text-gray-400 uppercase tracking-widest text-xs">Fetching applicants...</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : filteredApplicants.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="px-10 py-24 text-center">
                                            <div className="space-y-4">
                                                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-300">
                                                    <User size={40} />
                                                </div>
                                                <p className="text-xl font-black text-gray-300">No applicants found</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : filteredApplicants.map((app) => (
                                    <motion.tr 
                                        layout
                                        key={app.id} 
                                        className="hover:bg-blue-50/30 transition-colors"
                                    >
                                        <td className="px-10 py-8">
                                            <div className="flex items-center gap-5">
                                                <div className="w-16 h-16 bg-blue-100 rounded-3xl flex items-center justify-center text-[#1a3c8f] font-black text-2xl shadow-inner border-2 border-white">
                                                    {app.candidate.fullName.charAt(0)}
                                                </div>
                                                <div className="space-y-1">
                                                    <h3 className="text-lg font-black text-gray-900 leading-none">{app.candidate.fullName}</h3>
                                                    <div className="flex flex-wrap items-center gap-3 text-sm font-bold text-gray-400">
                                                        <span className="flex items-center gap-1.5"><Mail size={12} /> {app.candidate.email}</span>
                                                        <span className="text-gray-200">•</span>
                                                        <span className="flex items-center gap-1.5">
                                                            <MapPin size={12} /> 
                                                            {app.candidate.profile?.city && app.candidate.profile?.state 
                                                                ? `${app.candidate.profile.city}, ${app.candidate.profile.state}` 
                                                                : 'N/A'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8">
                                            <div className="space-y-1">
                                                <p className="text-sm font-black text-gray-900 flex items-center gap-2">
                                                    <Briefcase size={14} className="text-blue-600" />
                                                    {app.candidate.profile?.yearsOfExp || 'Fresher'}
                                                </p>
                                                <div className="flex flex-wrap gap-1">
                                                    {(app.selectedSkills && app.selectedSkills.length > 0) ? (
                                                        app.selectedSkills.map((skill) => (
                                                            <span key={skill.id} className="text-[10px] bg-[#1a3c8f] px-2 py-0.5 rounded-full font-bold text-white uppercase tracking-tighter">
                                                                {skill.name}
                                                            </span>
                                                        ))
                                                    ) : (
                                                        app.candidate.profile?.skills?.split(',').slice(0, 3).map((skill, i) => (
                                                            <span key={i} className="text-[10px] bg-gray-100 px-2 py-0.5 rounded-full font-bold text-gray-500 uppercase tracking-tighter">
                                                                {skill.trim()}
                                                            </span>
                                                        ))
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8">
                                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${getStatusStyle(app.status)}`}>
                                                {app.status.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td className="px-10 py-8">
                                            <div className="flex items-center justify-center gap-3">
                                                <a 
                                                    href={app.resumeFile?.fileUrl || app.candidate.profile?.resumeFile?.fileUrl || '#'} 
                                                    target="_blank" 
                                                    rel="noreferrer"
                                                    title="View Resume" 
                                                    className="p-3 bg-white border-2 border-gray-100 text-[#1a3c8f] rounded-2xl hover:border-[#1a3c8f] hover:shadow-lg hover:shadow-blue-900/10 transition-all active:scale-95"
                                                >
                                                    <Download size={18} />
                                                </a>
                                                
                                                {app.status !== 'REJECTED' && app.status !== 'HIRED' && (
                                                    <>
                                                        {app.status !== 'SHORTLISTED' && app.status !== 'INTERVIEW_SCHEDULED' && (
                                                            <button 
                                                                onClick={() => handleStatusUpdate(app.id, 'SHORTLISTED', 'Shortlist')}
                                                                title="Shortlist" 
                                                                className="p-3 bg-white border-2 border-purple-100 text-purple-600 rounded-2xl hover:bg-purple-600 hover:text-white hover:border-purple-600 hover:shadow-lg hover:shadow-purple-900/10 transition-all active:scale-95"
                                                            >
                                                                <CheckCircle size={18} />
                                                            </button>
                                                        )}
                                                        
                                                        {(app.status === 'SHORTLISTED' || app.status === 'INTERVIEW_SCHEDULED') && (
                                                            <button 
                                                                onClick={() => handleOpenInterviewModal(app)}
                                                                title="Schedule Interview" 
                                                                className="p-3 bg-white border-2 border-green-100 text-green-600 rounded-2xl hover:bg-green-600 hover:text-white hover:border-green-600 hover:shadow-lg hover:shadow-green-900/10 transition-all active:scale-95"
                                                            >
                                                                <Calendar size={18} />
                                                            </button>
                                                        )}

                                                        <button 
                                                            onClick={() => handleStatusUpdate(app.id, 'REJECTED', 'Reject')}
                                                            title="Reject" 
                                                            className="p-3 bg-white border-2 border-red-50 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white hover:border-red-500 hover:shadow-lg hover:shadow-red-900/10 transition-all active:scale-95"
                                                        >
                                                            <XCircle size={18} />
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </RecruiterLayout>
    )
}

export default Applicants
