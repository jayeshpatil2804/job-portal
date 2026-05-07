import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import DashboardLayout from '../../components/DashboardLayout'
import { Eye, Briefcase, MapPin, Calendar, Search, Trash2, ExternalLink, Bookmark } from 'lucide-react'
import { getMySavedJobs, toggleSaveJob } from '../../redux/actions/savedJobActions'
import Pagination from '../../components/common/Pagination'
import { motion, AnimatePresence } from 'framer-motion'
import { useMountTimer } from '../../hooks/useMountTimer'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

const SavedJobsPage = () => {
    useMountTimer('SavedJobsPage')
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { savedJobs, pagination, loading } = useSelector(state => state.savedJob)
    const { user } = useSelector(state => state.auth)
    const [searchQuery, setSearchQuery] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(10)

    useEffect(() => {
        if (user?.isVerified) {
            dispatch(getMySavedJobs(currentPage, itemsPerPage))
        }
    }, [dispatch, currentPage, itemsPerPage, user])

    const handlePageChange = (page) => {
        setCurrentPage(page)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const handleLimitChange = (limit) => {
        setItemsPerPage(limit)
        setCurrentPage(1)
    }

    const filteredJobs = savedJobs.filter(job => {
        const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             job.recruiter?.companyName?.toLowerCase().includes(searchQuery.toLowerCase())
        return matchesSearch
    })

    const handleRemove = async (e, jobId) => {
        e.stopPropagation()
        try {
            await dispatch(toggleSaveJob(jobId))
            toast.success('Job removed from saved list')
        } catch (error) {
            toast.error('Failed to remove job')
        }
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    }

    return (
        <DashboardLayout>
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
                                <h1 className="text-4xl font-black text-[#0f172a] tracking-tight">Saved Jobs</h1>
                             </div>
                            <p className="text-gray-500 font-medium ml-1">Manage your {savedJobs.length} bookmarked professional opportunities</p>
                        </div>
                        <div className="flex gap-4">
                            <div className="px-8 py-4 bg-gray-50 rounded-[2rem] border border-gray-100 text-center">
                                <p className="text-3xl font-black text-[#1a3c8f] leading-none mb-1">{savedJobs.length}</p>
                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Saved</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Search Bar ── */}
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
                </div>

                {/* ── Content Area ── */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-64 bg-gray-100 rounded-[2.5rem] animate-pulse" />
                        ))}
                    </div>
                ) : (!user?.isVerified) ? (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white p-24 rounded-[3.5rem] border border-dashed border-gray-200 text-center space-y-8 shadow-sm"
                    >
                        <div className="w-24 h-24 bg-rose-50 rounded-full flex items-center justify-center mx-auto text-rose-500 shadow-inner">
                            <ShieldAlert size={40} />
                        </div>
                        <div className="max-w-md mx-auto space-y-2">
                            <h3 className="text-2xl font-black text-gray-900 tracking-tight">Verification Required</h3>
                            <p className="text-gray-500 font-medium">Please contact admin to verify your account and view your saved jobs.</p>
                        </div>
                    </motion.div>
                ) : filteredJobs.length === 0 ? (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white p-24 rounded-[3.5rem] border border-dashed border-gray-200 text-center space-y-8 shadow-sm"
                    >
                        <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto text-[#1a3c8f] shadow-inner">
                            <Briefcase size={40} />
                        </div>
                        <div className="max-w-md mx-auto space-y-2">
                            <h3 className="text-2xl font-black text-gray-900 tracking-tight">No saved jobs</h3>
                            <p className="text-gray-500 font-medium">You haven't saved any jobs yet. Browse jobs and click the save button to keep track of interesting opportunities.</p>
                        </div>
                        <button 
                            onClick={() => navigate('/jobs')}
                            className="px-10 py-4 bg-gray-900 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-gray-900/10 hover:bg-black transition-all active:scale-95"
                        >
                            Browse Jobs
                        </button>
                    </motion.div>
                ) : (
                    <>
                        <motion.div 
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className="flex flex-wrap gap-6"
                        >
                            <AnimatePresence mode="popLayout">
                                {filteredJobs.map((job) => (
                                    <motion.div
                                        key={job.id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        whileHover={{ y: -8, shadow: '0 25px 50px -12px rgb(0 0 0 / 0.1)' }}
                                        className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 hover:border-[#1a3c8f] transition-all group relative overflow-hidden flex flex-col w-full md:w-[calc(50%-12px)] lg:w-[calc(33.33%-16px)] cursor-pointer min-h-[380px]"
                                        onClick={() => navigate(`/job/${job.id}`)}
                                    >
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/50 rounded-full -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-all blur-2xl"></div>
                                        
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="w-16 h-16 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl flex items-center justify-center text-[#1a3c8f] shrink-0 font-black text-xl shadow-inner border border-white">
                                                {job.recruiter?.companyName?.charAt(0) || 'J'}
                                            </div>
                                            <button 
                                                onClick={(e) => handleRemove(e, job.id)}
                                                className="p-2.5 rounded-xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all border border-red-100"
                                                title="Remove from saved"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>

                                        <div className="flex-1 space-y-4">
                                            <div>
                                                <h3 className="text-xl font-black text-gray-900 group-hover:text-[#1a3c8f] transition-colors tracking-tight line-clamp-2 leading-tight h-14">
                                                    {job.title}
                                                </h3>
                                                <p className="font-black text-[10px] text-gray-400 uppercase tracking-[0.15em] mt-2 truncate">
                                                    {job.recruiter?.companyName}
                                                </p>
                                            </div>

                                            <div className="space-y-3 pt-4 border-t border-gray-50">
                                                <div className="flex items-center gap-3 text-gray-500 text-[11px] font-bold">
                                                    <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-[#1a3c8f]">
                                                        <MapPin size={14} />
                                                    </div>
                                                    {job.location}
                                                </div>
                                                <div className="flex items-center gap-3 text-gray-500 text-[11px] font-bold">
                                                    <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-[#1a3c8f]">
                                                        <Calendar size={14} />
                                                    </div>
                                                    Saved {new Date(job.savedAt).toLocaleDateString()}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-6 pt-4 flex gap-3">
                                            <button 
                                                onClick={() => navigate(`/job/${job.id}`)}
                                                className="flex-1 py-4 bg-gray-50 text-gray-900 rounded-xl font-black uppercase tracking-widest text-[9px] border border-gray-100 hover:bg-gray-100 transition-all flex items-center justify-center gap-2"
                                            >
                                                View Details
                                                <Eye size={12} />
                                            </button>
                                            <button 
                                                onClick={() => navigate(`/job/${job.id}`)}
                                                className="flex-1 py-4 bg-gray-900 text-white rounded-xl font-black uppercase tracking-widest text-[9px] shadow-lg shadow-gray-900/10 group-hover:bg-[#1a3c8f] transition-all flex items-center justify-center gap-2"
                                            >
                                                Apply Now
                                                <ExternalLink size={12} />
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </motion.div>

                        <Pagination 
                            currentPage={pagination.page}
                            totalPages={pagination.totalPages}
                            totalItems={pagination.total}
                            itemsPerPage={pagination.limit}
                            onPageChange={handlePageChange}
                            onLimitChange={handleLimitChange}
                        />
                    </>
                )}
            </div>
        </DashboardLayout>
    )
}

export default SavedJobsPage
