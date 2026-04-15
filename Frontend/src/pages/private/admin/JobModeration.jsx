import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, Trash2, Flag, Eye, CheckCircle, Building2, MapPin, Clock } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../../../utils/api'
import AdminLayout from '../../../components/admin/AdminLayout'
import Pagination from '../../../components/common/Pagination'

const typeColor = {
    'Full-time': 'bg-blue-50 text-blue-700',
    'Part-time': 'bg-purple-50 text-purple-700',
    'Contract': 'bg-orange-50 text-orange-700',
}

const JobModeration = () => {
    const [jobs, setJobs] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [filter, setFilter] = useState('ALL')
    const [designations, setDesignations] = useState([])
    const [selectedDesignation, setSelectedDesignation] = useState('ALL')
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: 10
    })

    useEffect(() => {
        fetchJobs()
    }, [pagination.currentPage, pagination.itemsPerPage])

    const fetchJobs = async () => {
        try {
            setLoading(true)
            const [jobsRes, desigRes] = await Promise.all([
                api.get('/admin/jobs', {
                    params: {
                        page: pagination.currentPage,
                        limit: pagination.itemsPerPage
                    }
                }),
                api.get('/admin/designations')
            ])
            setJobs(jobsRes.data.jobs)
            if (jobsRes.data.pagination) {
                setPagination(prev => ({
                    ...prev,
                    ...jobsRes.data.pagination
                }))
            }
            setDesignations(desigRes.data.designations)
        } catch (error) {
            toast.error('Failed to load data')
        } finally {
            setLoading(false)
        }
    }

    const handleRemove = async (id) => {
        try {
            await api.patch(`/admin/jobs/${id}/status`, { removed: true })
            setJobs(prev => prev.map(j => j.id === id ? { ...j, status: 'REMOVED' } : j))
            toast.success('Job removed successfully')
        } catch (error) {
            toast.error('Failed to remove job')
        }
    }

    const handleRestore = async (id) => {
        try {
            await api.patch(`/admin/jobs/${id}/status`, { removed: false })
            setJobs(prev => prev.map(j => j.id === id ? { ...j, status: 'ACTIVE' } : j))
            toast.success('Job restored successfully')
        } catch (error) {
            toast.error('Failed to restore job')
        }
    }

    const handleToggleFlag = async (id) => {
        try {
            await api.patch(`/admin/jobs/${id}/flag`)
            setJobs(prev => prev.map(j => j.id === id ? { ...j, flagged: !j.flagged } : j))
            toast.success('Job flag updated')
        } catch (error) {
            toast.error('Failed to update job flag')
        }
    }

    const counts = {
        ALL: jobs.length,
        ACTIVE: jobs.filter(j => j.status === 'ACTIVE').length,
        FLAGGED: jobs.filter(j => j.flagged).length,
        REMOVED: jobs.filter(j => j.status === 'REMOVED').length,
    }

    if (loading) return (
        <AdminLayout title="Job Moderation">
            <div className="flex h-64 items-center justify-center">
                <div className="w-8 h-8 border-4 border-[#1a3c8f] border-t-transparent rounded-full animate-spin" />
            </div>
        </AdminLayout>
    )

    const filtered = jobs.filter(j => {
        const matchSearch = j.title.toLowerCase().includes(search.toLowerCase()) || 
                           j.company.toLowerCase().includes(search.toLowerCase()) ||
                           (j.designation?.name || '').toLowerCase().includes(search.toLowerCase())
        
        const matchDesignation = selectedDesignation === 'ALL' || j.designationId === selectedDesignation
        
        const matchStatus = filter === 'ALL' ? true : (filter === 'FLAGGED' ? j.flagged : j.status === filter)
        
        return matchSearch && matchDesignation && matchStatus
    })

    return (
        <AdminLayout title="Job Moderation">
            <div className="mb-6">
                <h2 className="text-2xl font-extrabold text-[#0f172a]">Job Moderation</h2>
                <p className="text-sm text-gray-500 mt-0.5">Review and remove suspicious or fake job listings</p>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-4 mb-5 items-center">
                <div className="flex flex-wrap gap-2">
                    {['ALL', 'ACTIVE', 'FLAGGED', 'REMOVED'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setFilter(tab)}
                            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                                filter === tab
                                    ? 'bg-[#1a3c8f] text-white shadow-md'
                                    : 'bg-white text-gray-600 border border-gray-200 hover:border-[#1a3c8f]'
                            }`}
                        >
                            {tab === 'FLAGGED' ? '🚩 ' : ''}{tab.charAt(0) + tab.slice(1).toLowerCase()} ({counts[tab]})
                        </button>
                    ))}
                </div>

                <div className="h-8 w-px bg-gray-200 mx-2 hidden md:block" />

                <select 
                    value={selectedDesignation}
                    onChange={e => setSelectedDesignation(e.target.value)}
                    className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 outline-none focus:border-[#1a3c8f] focus:ring-2 focus:ring-blue-100 transition min-w-[180px]"
                >
                    <option value="ALL">All Designations</option>
                    {designations.map(d => (
                        <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                </select>
            </div>

            {/* Search */}
            <div className="relative mb-6">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search by title or company..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1a3c8f] focus:ring-2 focus:ring-blue-100 transition"
                />
            </div>

            {/* Job Cards */}
            <div className="space-y-3">
                {filtered.length === 0 && (
                    <div className="py-16 text-center text-gray-400 bg-white rounded-2xl border border-gray-100">No jobs found.</div>
                )}
                {filtered.map((job, i) => (
                    <motion.div
                        key={job.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className={`bg-white rounded-2xl border shadow-sm p-5 hover:shadow-md transition-all duration-300 ${
                            job.flagged ? 'border-red-200 bg-red-50/30' : 'border-gray-100'
                        } ${job.status === 'REMOVED' ? 'opacity-60' : ''}`}
                    >
                        <div className="flex items-start gap-4">
                            <div className="w-11 h-11 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
                                <Building2 size={18} className="text-[#1a3c8f]" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2 flex-wrap">
                                    <div>
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <h4 className="font-bold text-gray-900 text-sm">
                                                {job.designation ? job.designation.name : job.title}
                                            </h4>
                                            {job.designation && (
                                                <span className="px-2 py-0.5 bg-blue-100 text-[#1a3c8f] text-[9px] font-black uppercase tracking-widest rounded-lg">
                                                    {job.title}
                                                </span>
                                            )}
                                            {job.flagged && (
                                                <span className="flex items-center gap-1 px-2 py-0.5 bg-red-100 text-red-600 text-[10px] font-bold rounded-full">
                                                    <Flag size={10} /> Flagged
                                                </span>
                                            )}
                                            {job.status === 'REMOVED' && (
                                                <span className="px-2 py-0.5 bg-gray-200 text-gray-500 text-[10px] font-bold rounded-full">Removed</span>
                                            )}
                                        </div>
                                        <p className="text-xs text-gray-500 mt-0.5">{job.company}</p>
                                    </div>
                                    <span className={`text-xs font-bold px-2.5 py-1 rounded-xl ${typeColor[job.type] || 'bg-gray-100 text-gray-600'}`}>{job.type}</span>
                                </div>
                                <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-400">
                                    <span className="flex items-center gap-1"><MapPin size={11} />{job.location}</span>
                                    <span className="flex items-center gap-1"><Clock size={11} />{job.posted}</span>
                                    <span className="font-semibold text-[#f97316]">{job.applications} applications</span>
                                    <span className="font-semibold text-gray-700">{job.salary}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-gray-100 flex-wrap">
                            <button
                                onClick={() => handleToggleFlag(job.id)}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                                    job.flagged
                                        ? 'bg-red-100 text-red-600 hover:bg-red-200'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                            >
                                <Flag size={12} /> {job.flagged ? 'Unflag' : 'Flag'}
                            </button>

                            {job.status === 'ACTIVE' ? (
                                <button
                                    onClick={() => handleRemove(job.id)}
                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-xs font-bold transition-colors"
                                >
                                    <Trash2 size={12} /> Remove Job
                                </button>
                            ) : (
                                <button
                                    onClick={() => handleRestore(job.id)}
                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded-lg text-xs font-bold transition-colors"
                                >
                                    <CheckCircle size={12} /> Restore
                                </button>
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>
        </AdminLayout>
    )
}

export default JobModeration
