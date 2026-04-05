import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import DashboardLayout from '../../components/DashboardLayout'
import { Eye, Briefcase, MapPin, Calendar, Clock, ChevronRight, Search, Filter } from 'lucide-react'
import { getMyApplications } from '../../redux/actions/applicationActions'
import { motion, AnimatePresence } from 'framer-motion'
import { useMountTimer } from '../../hooks/useMountTimer'

import { useNavigate } from 'react-router-dom'
import ActivationDialog from '../../components/common/ActivationDialog'

const AppliedJobsPage = () => {
    useMountTimer('AppliedJobsPage')
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { myApplications: applications, loading } = useSelector(state => state.application)
    const { isActive, isPaid } = useSelector(state => state.profile)
    const [statusFilter, setStatusFilter] = useState('ALL')
    const [searchQuery, setSearchQuery] = useState('')

    useEffect(() => {
        dispatch(getMyApplications())
    }, [dispatch])

    const filters = [
        { label: 'All Jobs', value: 'ALL' },
        { label: 'Shortlisted', value: 'SHORTLISTED', color: 'bg-purple-100 text-purple-700' },
        { label: 'Interviews', value: 'INTERVIEW_SCHEDULED', color: 'bg-green-100 text-green-700' },
        { label: 'Rejected', value: 'REJECTED', color: 'bg-red-100 text-red-700' }
    ]

    const filteredApplications = applications.filter(app => {
        const matchesStatus = statusFilter === 'ALL' || app.status === statusFilter
        const matchesSearch = app.job.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             app.job.recruiter.companyName.toLowerCase().includes(searchQuery.toLowerCase())
        return matchesStatus && matchesSearch
    })

    const getStatusStyles = (status) => {
        switch (status) {
            case 'APPLIED': return 'bg-blue-50 text-blue-600 border-blue-100'
            case 'VIEWED': return 'bg-yellow-50 text-yellow-600 border-yellow-100'
            case 'SHORTLISTED': return 'bg-purple-50 text-purple-600 border-purple-100'
            case 'INTERVIEW_SCHEDULED': return 'bg-green-50 text-green-600 border-green-100'
            case 'REJECTED': return 'bg-red-50 text-red-600 border-red-100'
            default: return 'bg-gray-50 text-gray-500 border-gray-100'
        }
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    }

    return (
        <DashboardLayout>
            {!isActive && (
                <ActivationDialog 
                    isOpen={true} 
                    isPaid={isPaid} 
                    userType="CANDIDATE" 
                    onClose={() => navigate('/dashboard')} 
                />
            )}
            <div className="max-w-6xl mx-auto space-y-10 pb-20">
                {/* ── Page Header ── */}
                <div className="relative overflow-hidden rounded-[2.5rem] bg-white p-8 md:p-12 shadow-xl shadow-blue-900/5 border border-gray-50">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full -mr-32 -mt-32 opacity-40 blur-3xl"></div>
                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                        <div className="space-y-2">
                             <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-2xl bg-[#1a3c8f] flex items-center justify-center text-white shadow-lg">
                                    <Briefcase size={20} />
                                </div>
                                <h1 className="text-4xl font-black text-[#0f172a] tracking-tight">Applied Jobs</h1>
                             </div>
                            <p className="text-gray-500 font-medium ml-1">Track and manage your {applications.length} professional applications</p>
                        </div>
                        <div className="flex gap-4">
                            <div className="px-8 py-4 bg-gray-50 rounded-[2rem] border border-gray-100 text-center">
                                <p className="text-3xl font-black text-[#1a3c8f] leading-none mb-1">{applications.length}</p>
                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Applications</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Search & Filter Bar ── */}
                <div className="flex flex-col lg:flex-row gap-6">
                    <div className="flex-1 relative group">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#1a3c8f] transition-colors" size={18} />
                        <input 
                            type="text"
                            placeholder="Search by company or role..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-14 pr-6 py-4 bg-white border border-gray-100 rounded-[1.5rem] text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#1a3c8f] transition-all shadow-sm"
                        />
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="flex items-center gap-2 p-1.5 bg-gray-100/50 rounded-2xl">
                            {filters.map((f) => (
                                <button
                                    key={f.value}
                                    onClick={() => setStatusFilter(f.value)}
                                    className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                        statusFilter === f.value
                                            ? 'bg-white text-[#1a3c8f] shadow-sm active:scale-95'
                                            : 'text-gray-400 hover:text-gray-600'
                                    }`}
                                >
                                    {f.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── Content Area ── */}
                {loading ? (
                    <div className="grid grid-cols-1 gap-6">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-32 bg-gray-100 rounded-[2.5rem] animate-pulse" />
                        ))}
                    </div>
                ) : filteredApplications.length === 0 ? (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white p-24 rounded-[3.5rem] border border-dashed border-gray-200 text-center space-y-8 shadow-sm"
                    >
                        <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto text-[#1a3c8f] shadow-inner">
                            <Search size={40} />
                        </div>
                        <div className="max-w-md mx-auto space-y-2">
                            <h3 className="text-2xl font-black text-gray-900 tracking-tight">No results found</h3>
                            <p className="text-gray-500 font-medium">We couldn't find any applications matching your current filters or search query.</p>
                        </div>
                        <button 
                            onClick={() => { setStatusFilter('ALL'); setSearchQuery(''); }}
                            className="px-10 py-4 bg-gray-900 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-gray-900/10 hover:bg-black transition-all active:scale-95"
                        >
                            Reset All Filters
                        </button>
                    </motion.div>
                ) : (
                    <motion.div 
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-1 gap-6"
                    >
                        <AnimatePresence mode="popLayout">
                            {filteredApplications.map((app) => (
                                <motion.div
                                    key={app.id}
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    whileHover={{ y: -4, shadow: '0 20px 25px -5px rgb(0 0 0 / 0.05)' }}
                                    className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 hover:border-[#1a3c8f] transition-all group relative overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/30 rounded-full -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    
                                    <div className="flex flex-col md:flex-row gap-8 items-center relative z-10">
                                        <div className="w-20 h-20 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-3xl flex items-center justify-center text-[#1a3c8f] shrink-0 font-black text-2xl shadow-inner border border-white">
                                            {app.job.recruiter.companyName.charAt(0)}
                                        </div>
                                        
                                        <div className="flex-1 space-y-5 text-center md:text-left">
                                            <div>
                                                <h3 className="text-2xl font-black text-gray-900 group-hover:text-[#1a3c8f] transition-colors tracking-tight">{app.job.title}</h3>
                                                <div className="flex items-center justify-center md:justify-start gap-2 mt-1">
                                                     <p className="font-black text-xs text-gray-400 uppercase tracking-widest">{app.job.recruiter.companyName}</p>
                                                     <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                                     <p className="font-bold text-gray-400 text-xs">{app.job.location}</p>
                                                </div>
                                            </div>
                                            
                                            <div className="flex flex-wrap justify-center md:justify-start gap-6">
                                                <div className="flex items-center gap-2.5 px-4 py-2 bg-gray-50 rounded-xl text-gray-400 text-[11px] font-black uppercase tracking-widest border border-gray-100">
                                                    <Calendar size={14} className="text-[#1a3c8f]" />
                                                    Applied {new Date(app.createdAt).toLocaleDateString()}
                                                </div>
                                                <div className="flex items-center gap-2.5 px-4 py-2 bg-gray-50 rounded-xl text-gray-400 text-[11px] font-black uppercase tracking-widest border border-gray-100">
                                                    <Eye size={14} className="text-[#1a3c8f]" />
                                                    Visible to Recruiter
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col items-center md:items-end gap-5 min-w-[180px]">
                                            <span className={`px-8 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest border-2 shadow-sm ${getStatusStyles(app.status)}`}>
                                                {app.status.replace('_', ' ')}
                                            </span>
                                            <button className="group/btn flex items-center gap-3 text-[10px] font-black text-gray-900 uppercase tracking-widest hover:text-[#1a3c8f] transition-all">
                                                Application Details
                                                <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover/btn:bg-[#1a3c8f] group-hover/btn:text-white transition-all shadow-sm">
                                                     <ChevronRight size={14} />
                                                </div>
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                )}
            </div>
        </DashboardLayout>
    )
}

export default AppliedJobsPage
