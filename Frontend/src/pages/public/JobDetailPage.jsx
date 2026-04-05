import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import DashboardLayout from '../../components/DashboardLayout'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import { MapPin, Briefcase, Calendar, DollarSign, Clock, Users, ChevronLeft, Send, CheckCircle2, AlertCircle, Building2, Award, Zap, ShieldCheck } from 'lucide-react'
import { getJobById } from '../../redux/actions/jobActions'
import { applyToJob } from '../../redux/actions/applicationActions'
import { clearApplicationStates } from '../../redux/slices/applicationSlice'
import { toast } from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'
import { useMountTimer } from '../../hooks/useMountTimer'
import ActivationDialog from '../../components/common/ActivationDialog'

const JobDetailPage = () => {
    useMountTimer('JobDetailPage')
    const { id } = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    
    const { selectedJob: job, loading } = useSelector(state => state.job)
    const { loading: applying, success: applySuccess, error: applyError } = useSelector(state => state.application)
    const { user, isAuthenticated } = useSelector(state => state.auth)
    const { isActive, isPaid } = useSelector(state => state.profile)

    useEffect(() => {
        dispatch(getJobById(id))
        return () => {
            dispatch(clearApplicationStates())
        }
    }, [dispatch, id])

    useEffect(() => {
        if (applySuccess) {
            toast.success('Successfully applied for the job!')
        }
    }, [applySuccess])

    const [isApplyModalOpen, setIsApplyModalOpen] = useState(false)
    const [selectedSkillIds, setSelectedSkillIds] = useState([])

    const handleApply = async () => {
        if (!user) {
            toast.error('Please login as a candidate to apply')
            navigate('/candidate/login')
            return
        }
        
        if (job.skillsReq && job.skillsReq.length > 0 && !isApplyModalOpen) {
            setIsApplyModalOpen(true)
            return
        }

        dispatch(applyToJob({ jobId: id, selectedSkillIds }))
    }

    const toggleSkill = (skillId) => {
        setSelectedSkillIds(prev => 
            prev.includes(skillId) 
                ? prev.filter(id => id !== skillId)
                : [...prev, skillId]
        )
    }

    const confirmApply = () => {
        dispatch(applyToJob({ jobId: id, selectedSkillIds }))
        setIsApplyModalOpen(false)
    }

    const PublicLayout = ({ children }) => (
        <div className="min-h-screen bg-[#f8fafc] flex flex-col font-sans">
            <Navbar />
            <div className="flex-1 pt-24 px-4 md:px-8">
                {children}
            </div>
            <Footer />
        </div>
    )

    const Layout = (isAuthenticated && user?.role === 'CANDIDATE') ? DashboardLayout : PublicLayout

    if (loading) {
        return (
            <Layout>
                <div className="flex flex-col items-center justify-center py-32 space-y-6">
                    <div className="relative">
                        <div className="w-16 h-16 border-4 border-blue-100 rounded-full" />
                        <div className="w-16 h-16 border-4 border-[#1a3c8f] border-t-transparent rounded-full animate-spin absolute top-0" />
                    </div>
                    <p className="font-black text-gray-400 uppercase tracking-widest text-[10px] animate-pulse">Loading Position Details...</p>
                </div>
            </Layout>
        )
    }

    if (!job) return null

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, staggerChildren: 0.1 } }
    }

    const cardStyles = "bg-white p-10 rounded-[3.5rem] shadow-xl shadow-blue-900/5 border border-gray-50 relative overflow-hidden"

    return (
        <Layout>
            {isAuthenticated && user?.role === 'CANDIDATE' && !isActive && (
                <ActivationDialog 
                    isOpen={true} 
                    isPaid={isPaid} 
                    userType="CANDIDATE" 
                    onClose={() => navigate('/jobs')} 
                />
            )}
            <motion.div 
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="max-w-[1300px] mx-auto pb-20"
            >
                {/* ── Top Navigation ── */}
                <div className="flex items-center justify-between mb-10">
                    <button 
                        onClick={() => navigate('/jobs')}
                        className="group flex items-center gap-4 text-xs font-black text-gray-400 hover:text-[#1a3c8f] uppercase tracking-widest transition-all"
                    >
                        <div className="w-10 h-10 flex items-center justify-center rounded-2xl bg-white border border-gray-100 shadow-sm group-hover:bg-blue-50 group-hover:border-blue-100 transition-all">
                            <ChevronLeft size={18} />
                        </div>
                        Back to Search
                    </button>
                    <div className="flex items-center gap-3">
                        <ShieldCheck size={18} className="text-green-500" />
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Verified Opportunity</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* ── Main Content Area ── */}
                    <div className="lg:col-span-2 space-y-10">
                        {/* ── Job Header Card ── */}
                        <div className={cardStyles}>
                            <div className="absolute top-0 right-0 w-80 h-80 bg-blue-50 rounded-full -mr-40 -mt-40 opacity-40 blur-3xl animate-pulse" />
                            
                            <div className="relative flex flex-col md:flex-row gap-10 items-start">
                                <div className="w-24 h-24 bg-gradient-to-br from-[#1a3c8f] to-blue-600 rounded-[2.5rem] shadow-2xl flex items-center justify-center text-white shrink-0 border-4 border-white">
                                    <h2 className="text-3xl font-black">{job.recruiter.companyName.charAt(0)}</h2>
                                </div>
                                <div className="space-y-6 flex-1">
                                    <div className="space-y-2">
                                        <div className="flex flex-wrap items-center gap-3">
                                            <span className="px-4 py-1.5 bg-blue-50 text-[#1a3c8f] text-[9px] font-black uppercase tracking-widest rounded-full border border-blue-100">
                                                {job.department || 'Premium Role'}
                                            </span>
                                            {job.designation && (
                                                <span className="px-4 py-1.5 bg-green-50 text-green-700 text-[9px] font-black uppercase tracking-widest rounded-full border border-green-100">
                                                    {job.designation.name}
                                                </span>
                                            )}
                                            <span className="px-4 py-1.5 bg-orange-50 text-orange-600 text-[9px] font-black uppercase tracking-widest rounded-full border border-orange-100">
                                                {job.jobType.replace('_', ' ')}
                                            </span>
                                        </div>
                                        <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight leading-tight">
                                            {job.designation ? job.designation.name : job.title}
                                        </h1>
                                        <p className="text-xl font-bold text-gray-400 flex items-center gap-2">
                                            at <span className="text-[#1a3c8f]">{job.recruiter.companyName}</span>
                                        </p>
                                    </div>
                                    <div className="flex flex-wrap gap-6">
                                        <div className="flex items-center gap-2.5 px-5 py-3 bg-gray-50 rounded-2xl border border-gray-100">
                                            <MapPin size={18} className="text-[#1a3c8f]" />
                                            <span className="text-sm font-black text-gray-700 uppercase tracking-tight">{job.location}</span>
                                        </div>
                                        <div className="flex items-center gap-2.5 px-5 py-3 bg-gray-50 rounded-2xl border border-gray-100">
                                            <DollarSign size={18} className="text-[#1a3c8f]" />
                                            <span className="text-sm font-black text-gray-700 uppercase tracking-tight">₹{job.salaryMin} - {job.salaryMax} LPA</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ── Description & Requirements ── */}
                        <div className={cardStyles}>
                            <div className="space-y-12">
                                <div className="space-y-6">
                                    <h3 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                                        <div className="w-1.5 h-8 bg-[#1a3c8f] rounded-full" />
                                        Context & Expectations
                                    </h3>
                                    <div className="text-gray-600 leading-relaxed font-medium text-lg whitespace-pre-wrap pl-4">
                                        {job.description}
                                    </div>
                                </div>

                                 {job.skillsReq && job.skillsReq.length > 0 && (
                                    <div className="space-y-6">
                                        <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] pl-4">Core Competencies Required</h3>
                                        <div className="flex flex-wrap gap-3 pl-4">
                                            {job.skillsReq.map((skill) => (
                                                <span key={skill.id} className="px-6 py-3 bg-blue-50/50 text-[#1a3c8f] rounded-2xl font-black text-[10px] uppercase tracking-widest border border-blue-100 hover:bg-blue-100 transition-colors">
                                                    {skill.name}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="pt-10 border-t border-gray-50 space-y-8">
                                    <h3 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                                        <div className="w-1.5 h-8 bg-purple-500 rounded-full" />
                                        Primary Qualifications
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pl-4">
                                        <div className="group p-8 bg-blue-50 rounded-[2.5rem] border border-blue-100 shadow-sm transition-all hover:bg-white hover:shadow-xl hover:shadow-blue-900/5">
                                            <div className="w-12 h-12 rounded-2xl bg-[#1a3c8f] text-white flex items-center justify-center mb-4">
                                                <Award size={24} />
                                            </div>
                                            <p className="text-[10px] font-black text-[#1a3c8f] uppercase tracking-widest mb-1">Education</p>
                                            <p className="text-xl font-black text-gray-900">{job.education || 'Industry Standard'}</p>
                                        </div>
                                        <div className="group p-8 bg-purple-50 rounded-[2.5rem] border border-purple-100 shadow-sm transition-all hover:bg-white hover:shadow-xl hover:shadow-purple-900/5">
                                             <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center mb-4">
                                                <Zap size={24} />
                                            </div>
                                            <p className="text-[10px] font-black text-purple-600 uppercase tracking-widest mb-1">Experience</p>
                                            <p className="text-xl font-black text-gray-900">{job.experience || 'Flexible'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── Right Sidebar: Interaction Area ── */}
                    <div className="space-y-10">
                        {/* Apply & Stats Card */}
                        <div className="bg-white p-10 rounded-[3.5rem] shadow-xl shadow-blue-900/5 border border-gray-50 sticky top-10 space-y-10">
                            <div className="space-y-6">
                                <h3 className="text-xl font-black text-gray-900 tracking-tight">Overview</h3>
                                <div className="space-y-5">
                                    {[
                                        { label: 'Published', value: new Date(job.createdAt).toLocaleDateString(), icon: <Calendar size={14} /> },
                                        { label: 'Department', value: job.department || 'General', icon: <Briefcase size={14} /> },
                                        { label: 'Availability', value: `${job.totalOpenings || 1} Positions`, icon: <Users size={14} /> },
                                        { label: 'Process', value: 'High Response', icon: <Zap size={14} /> }
                                    ].map((stat, i) => (
                                        <div key={i} className="flex items-center justify-between">
                                            <div className="flex items-center gap-2 font-black text-gray-400 lg:scale-[0.8] xl:scale-100 origin-left uppercase tracking-widest text-[10px]">
                                                {stat.icon}
                                                {stat.label}
                                            </div>
                                            <span className="font-black text-gray-700 text-xs">{stat.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="pt-6 border-t border-gray-50 space-y-6">
                                <AnimatePresence mode="wait">
                                    {applySuccess ? (
                                        <motion.div 
                                            initial={{ scale: 0.9, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            className="bg-green-50 p-8 rounded-[2.5rem] border-2 border-green-100 flex flex-col items-center gap-4 text-center"
                                        >
                                            <div className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-green-500/20">
                                                <CheckCircle2 size={32} />
                                            </div>
                                            <div className="space-y-1">
                                                <p className="font-black text-green-900 uppercase tracking-widest text-xs">Application Received</p>
                                                <p className="text-[10px] text-green-700 font-bold opacity-80">Check your dashboard for updates.</p>
                                            </div>
                                        </motion.div>
                                    ) : (
                                        <div className="space-y-6">
                                            {applyError && (
                                                <motion.div 
                                                    initial={{ y: 10, opacity: 0 }}
                                                    animate={{ y: 0, opacity: 1 }}
                                                    className="bg-red-50 p-5 rounded-2xl flex items-center gap-3 text-red-600 border border-red-100"
                                                >
                                                    <AlertCircle size={20} className="shrink-0" />
                                                    <p className="text-[10px] font-black uppercase tracking-widest leading-tight">{applyError}</p>
                                                </motion.div>
                                            )}
                                            <button 
                                                disabled={applying}
                                                onClick={handleApply}
                                                className="w-full py-6 bg-gray-900 text-white rounded-[2rem] font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl shadow-gray-900/10 hover:bg-black transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
                                            >
                                                <Send size={18} />
                                                {applying ? 'Transmitting...' : 'Apply Securely'}
                                            </button>
                                            <p className="text-[10px] text-center font-bold text-gray-300 leading-relaxed max-w-[220px] mx-auto italic">
                                                Recipient will receive your complete verified profile and credentials.
                                            </p>
                                        </div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>

                        {/* Company Reveal Card */}
                        <div className="bg-gradient-to-br from-[#1a3c8f] to-blue-800 p-10 rounded-[3.5rem] shadow-2xl text-white relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />
                            <h3 className="text-xl font-black tracking-tighter border-b border-white/10 pb-6 mb-8 flex items-center gap-3">
                                <Building2 size={20} className="text-blue-300" />
                                Organization
                            </h3>
                            <div className="space-y-8 relative z-10">
                                <div className="space-y-2">
                                    <h4 className="text-3xl font-black tracking-tight leading-none text-blue-100">{job.recruiter.companyName}</h4>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-green-400 rounded-full" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-blue-300">Active Recruiter</span>
                                    </div>
                                </div>
                                <div className="space-y-4 opacity-70 font-medium text-sm leading-relaxed italic">
                                    <p>{job.recruiter.aboutCompany || 'A forward-thinking organization within the textile industry ecosystem.'}</p>
                                </div>
                                <div className="pt-4 flex flex-col gap-5">
                                    <div className="flex items-center gap-4 text-[9px] font-black tracking-[0.2em] uppercase text-blue-100">
                                        <MapPin size={16} className="text-blue-300" />
                                        HQ: {job.recruiter.hqAddress || 'India'}
                                    </div>
                                    <div className="flex items-center gap-4 text-[9px] font-black tracking-[0.2em] uppercase text-blue-100">
                                        <Users size={16} className="text-blue-300" />
                                        Team: {job.recruiter.teamSize || 'Scaling'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Skill Selection Modal */}
            <AnimatePresence>
                {isApplyModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/60 backdrop-blur-md"
                            onClick={() => setIsApplyModalOpen(false)}
                        />
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="relative w-full max-w-xl bg-white rounded-[3.5rem] shadow-2xl overflow-hidden p-12"
                        >
                            <div className="space-y-8">
                                <div className="text-center space-y-3">
                                    <div className="w-16 h-16 bg-blue-50 rounded-3xl flex items-center justify-center text-[#1a3c8f] mx-auto mb-4">
                                        <ShieldCheck size={32} />
                                    </div>
                                    <h3 className="text-2xl font-black text-gray-900 tracking-tight">Select Your Skills</h3>
                                    <p className="text-gray-500 font-medium">Select the skills required for this role that you have experience in.</p>
                                </div>

                                <div className="grid grid-cols-2 gap-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                                    {job.skillsReq.map(skill => (
                                        <button
                                            key={skill.id}
                                            onClick={() => toggleSkill(skill.id)}
                                            className={`px-4 py-4 rounded-2xl border-2 text-left transition-all flex items-center justify-between group ${
                                                selectedSkillIds.includes(skill.id)
                                                    ? 'bg-blue-600 border-blue-600 text-white'
                                                    : 'bg-gray-50 border-gray-100 text-gray-700 hover:border-blue-200'
                                            }`}
                                        >
                                            <span className="text-xs font-black uppercase tracking-tight">{skill.name}</span>
                                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                                selectedSkillIds.includes(skill.id)
                                                    ? 'bg-white border-white'
                                                    : 'bg-white border-gray-200'
                                            }`}>
                                                {selectedSkillIds.includes(skill.id) && <div className="w-2.5 h-2.5 bg-blue-600 rounded-full" />}
                                            </div>
                                        </button>
                                    ))}
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button 
                                        onClick={() => setIsApplyModalOpen(false)}
                                        className="flex-1 py-5 rounded-2xl border border-gray-200 text-gray-400 font-black uppercase tracking-widest text-[10px] hover:bg-gray-50 transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        onClick={confirmApply}
                                        className="flex-2 py-5 px-10 bg-gray-900 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-gray-900/10 hover:bg-black transition-all"
                                    >
                                        Submit Application
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </Layout>
    )
}

export default JobDetailPage
