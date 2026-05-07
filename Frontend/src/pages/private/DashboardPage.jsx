import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import DashboardLayout from '../../components/DashboardLayout'
import { FileText, Bookmark, Eye, Phone, TrendingUp, ArrowRight, Star, Clock, Briefcase, MapPin, ShieldAlert, MessageSquare } from 'lucide-react'
import { fetchCandidateStats } from '../../redux/actions/dashboardActions'
import { getMySavedJobs } from '../../redux/actions/savedJobActions'
import { motion } from 'framer-motion'
import { useMountTimer } from '../../hooks/useMountTimer'

const DashboardPage = () => {
    useMountTimer('DashboardPage')
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { candidateStats, loading } = useSelector((state) => state.dashboard)
    const { savedJobs = [] } = useSelector((state) => state.savedJob)
    const { user } = useSelector((state) => state.auth)
    const { stats, recentApplications } = candidateStats

    const fetchStatus = React.useRef(false)
    useEffect(() => {
        if (!fetchStatus.current) {
            dispatch(fetchCandidateStats())
            if (user?.isVerified) {
                dispatch(getMySavedJobs())
            }
            fetchStatus.current = true
        }
    }, [dispatch, user])

    const statCards = [
        {
            title: 'Saved Jobs',
            count: savedJobs.length || 0,
            icon: <Bookmark size={20} />,
            color: 'text-[#3b82f6]',
            bgColor: 'bg-blue-50',
            borderColor: 'border-blue-100',
        },
        {
            title: 'Active Roles',
            count: stats?.totalApplications || 0,
            icon: <Briefcase size={20} />,
            color: 'text-[#f97316]',
            bgColor: 'bg-orange-50',
            borderColor: 'border-orange-100',
        },
        {
            title: 'Success Rate',
            count: stats?.totalApplications ? Math.round(((stats.shortlistedCount) / stats.totalApplications) * 100) + '%' : '0%',
            icon: <TrendingUp size={20} />,
            color: 'text-[#22c55e]',
            bgColor: 'bg-green-50',
            borderColor: 'border-green-100',
        },
    ]

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    }

    if (loading && !stats) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center h-[60vh]">
                    <div className="relative">
                        <div className="w-12 h-12 border-4 border-blue-100 rounded-full"></div>
                        <div className="w-12 h-12 border-4 border-[#1a3c8f] border-t-transparent rounded-full animate-spin absolute top-0"></div>
                    </div>
                </div>
            </DashboardLayout>
        )
    }

    return (
        <DashboardLayout>
            <motion.div 
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="max-w-[1400px] mx-auto space-y-8 pb-10"
            >
                {/* ── Hero Banner ── */}
                <motion.div 
                    variants={itemVariants}
                    className="relative overflow-hidden bg-gradient-to-br from-[#1a3c8f] to-[#2563eb] rounded-[2.5rem] p-8 md:p-12 text-white shadow-2xl shadow-blue-900/20"
                >
                    <div className="relative z-10 max-w-2xl">
                        <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">
                            Welcome back, <span className="text-blue-200">{user?.fullName?.split(' ')[0] || 'User'}!</span>
                        </h1>
                        <p className="text-blue-100 text-lg md:text-xl font-medium opacity-90 leading-relaxed mb-8">
                            Your career journey is looking great. You have {savedJobs.length || 0} saved jobs waiting for your attention.
                        </p>
                                <div className="flex flex-wrap gap-4">
                                    <button 
                                        onClick={() => navigate('/jobs')}
                                        className="bg-white text-[#1a3c8f] px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-blue-50 transition-all shadow-lg active:scale-95"
                                    >
                                        Search New Jobs
                                    </button>

                            <a 
                                href={`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000/api'}/auth/support/whatsapp`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-white/20 transition-all active:scale-95 flex items-center justify-center"
                            >
                                Contact Support
                            </a>
                        </div>
                    </div>
                    {/* Decorative Elements */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                    <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl"></div>
                </motion.div>

                {/* ── Stats Grid ── */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {statCards.map((stat, index) => (
                        <motion.div 
                            key={index} 
                            variants={itemVariants}
                            whileHover={{ y: -5 }}
                            className={`bg-white rounded-[2rem] p-6 border ${stat.borderColor} shadow-sm flex items-center gap-5 hover:shadow-xl hover:shadow-blue-900/5 transition-all transition-all duration-300`}
                        >
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${stat.bgColor} ${stat.color}`}>
                                {stat.icon}
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{stat.title}</p>
                                <h3 className="text-3xl font-black text-gray-900 leading-tight">{stat.count}</h3>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                    {/* ── Saved Jobs ── */}
                    <div className="xl:col-span-2 space-y-8">
                        {!user?.isVerified ? (
                            <motion.div 
                                variants={itemVariants}
                                className="bg-white rounded-[2.5rem] p-12 shadow-sm border border-gray-100 text-center space-y-8"
                            >
                                <div className="w-20 h-20 bg-rose-50 rounded-[2rem] flex items-center justify-center text-rose-500 mx-auto shadow-inner">
                                    <ShieldAlert size={40} />
                                </div>
                                <div className="max-w-md mx-auto space-y-4">
                                    <h3 className="text-2xl font-black text-gray-900 tracking-tight">Account Verification Pending</h3>
                                    <p className="text-gray-500 font-medium">Your account is waiting for administrator verification. Please contact support to activate your dashboard features.</p>
                                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                        <a href="https://wa.me/91XXXXXXXXXX" target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 py-4 bg-[#25D366] text-white rounded-2xl font-black uppercase tracking-widest text-[10px]">
                                            <MessageSquare size={16} /> WhatsApp
                                        </a>
                                        <a href="tel:+91XXXXXXXXXX" className="flex-1 flex items-center justify-center gap-2 py-4 bg-[#1a3c8f] text-white rounded-2xl font-black uppercase tracking-widest text-[10px]">
                                            <Phone size={16} /> Call Now
                                        </a>
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            /* Saved Jobs List */
                            <motion.div 
                                variants={itemVariants}
                                className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100"
                            >
                                <div className="flex items-center justify-between mb-8">
                                    <h2 className="text-xl font-black text-gray-900 tracking-tight">Saved for Later</h2>
                                    <button 
                                        onClick={() => navigate('/saved')}
                                        className="text-[10px] font-black text-[#1a3c8f] uppercase tracking-widest hover:underline"
                                    >
                                        View All
                                    </button>
                                </div>
                                <div className="space-y-4">
                                    {savedJobs && savedJobs.length > 0 ? (
                                        savedJobs.slice(0, 4).map((job) => (
                                            <div 
                                                key={job.id} 
                                                onClick={() => navigate(`/job/${job.id}`)}
                                                className="group cursor-pointer p-4 rounded-[1.5rem] border border-gray-50 hover:border-blue-100 hover:bg-blue-50/30 transition-all flex items-center justify-between gap-4"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-400 group-hover:bg-[#1a3c8f] group-hover:text-white transition-colors">
                                                        <Bookmark size={20} />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-sm font-black text-gray-900 group-hover:text-[#1a3c8f] transition-colors">{job.title}</h3>
                                                        <p className="text-xs font-bold text-gray-400">{job.recruiter?.companyName}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-6">
                                                    <div className="hidden md:flex items-center gap-2 text-xs font-bold text-gray-400">
                                                        <MapPin size={14} />
                                                        {job.location}
                                                    </div>
                                                    <ArrowRight size={18} className="text-gray-300 group-hover:text-[#1a3c8f] group-hover:translate-x-1 transition-all" />
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="py-10 text-center text-gray-400 font-bold text-sm bg-gray-50 rounded-[1.5rem] border border-dashed border-gray-200">
                                            No saved jobs yet
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </div>

                    {/* ── Right Column: Sidebar ── */}
                    <div className="space-y-6">
                        <motion.div 
                            variants={itemVariants}
                            className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 relative overflow-hidden group"
                        >
                            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-500"></div>
                            <h2 className="text-xl font-black text-gray-900 tracking-tight relative z-10">Recommended Jobs</h2>
                            <p className="text-xs font-bold text-gray-400 mt-2 mb-8 relative z-10">Based on your skills and preferences</p>
                            
                            <div className="space-y-6 relative z-10">
                                <div className="p-8 text-center bg-gray-50 rounded-[2rem] border border-dashed border-gray-200">
                                    <Star className="mx-auto mb-4 text-gray-300" size={32} />
                                    <p className="text-xs font-bold text-gray-400 leading-relaxed italic">
                                        Personalized recommendations for you will appear here soon!
                                    </p>
                                </div>
                                <button className="w-full py-4 bg-gray-900 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-gray-900/10 hover:bg-gray-800 transition-all active:scale-95">
                                    Browse All Jobs
                                </button>
                            </div>
                        </motion.div>

                        <motion.div 
                            variants={itemVariants}
                            className="bg-[#1a3c8f] rounded-[2.5rem] p-8 text-white relative overflow-hidden"
                        >
                            <h2 className="text-xl font-black mb-2">Complete Profile</h2>
                            <p className="text-blue-100 text-xs font-medium opacity-80 mb-6">Completing your profile increases hire chance by 80%</p>
                            <div className="w-full bg-white/10 h-2 rounded-full mb-6">
                                <div className="bg-white h-full rounded-full w-[65%]"></div>
                            </div>
                            <button className="text-xs font-black uppercase tracking-widest border-b border-white hover:opacity-80 transition-opacity">
                                Finish Setup
                            </button>
                        </motion.div>
                    </div>
                </div>
            </motion.div>
        </DashboardLayout>
    )
}

export default DashboardPage
