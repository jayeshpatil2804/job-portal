import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Eye, Building2, MapPin, Briefcase, Calendar, DollarSign, Clock, Filter, X, ChevronDown, Users, Star, TrendingUp, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../../../utils/api'
import AdminLayout from '../../../components/admin/AdminLayout'
import Pagination from '../../../components/common/Pagination'

const JOB_CATEGORIES = [
    'All',
    'Design',
    'Production', 
    'Sales',
    'IT',
    'HR',
    'Marketing',
    'Finance',
    'Engineering',
    'Healthcare',
    'Education',
    'Other'
]

const JOB_TYPES = {
    'FULL_TIME': 'Full-time',
    'PART_TIME': 'Part-time',
    'CONTRACT': 'Contract',
    'INTERNSHIP': 'Internship'
}

const EXPERIENCE_LEVELS = {
    'Fresher': 'Fresher',
    '1-3 Years': '1-3 Years',
    '3-5 Years': '3-5 Years',
    '5+ Years': '5+ Years'
}

const STATUS_COLORS = {
    'OPEN': 'bg-green-100 text-green-700',
    'CLOSED': 'bg-red-100 text-red-700',
    'DRAFT': 'bg-gray-100 text-gray-700',
    'EXPIRED': 'bg-orange-100 text-orange-700'
}

const JobManagement = () => {
    const [jobs, setJobs] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('All')
    const [selectedType, setSelectedType] = useState('All')
    const [selectedExperience, setSelectedExperience] = useState('All')
    const [selectedStatus, setSelectedStatus] = useState('All')
    const [sortBy, setSortBy] = useState('newest')
    const [showFilters, setShowFilters] = useState(false)
    const [selectedJob, setSelectedJob] = useState(null)
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: 12
    })

    useEffect(() => {
        fetchJobs()
    }, [pagination.currentPage, pagination.itemsPerPage, selectedCategory, selectedType, selectedExperience, selectedStatus, sortBy])

    const fetchJobs = async () => {
        try {
            setLoading(true)
            const params = {
                page: pagination.currentPage,
                limit: pagination.itemsPerPage,
                search: search || undefined,
                category: selectedCategory !== 'All' ? selectedCategory : undefined,
                jobType: selectedType !== 'All' ? selectedType : undefined,
                experience: selectedExperience !== 'All' ? selectedExperience : undefined,
                status: selectedStatus !== 'All' ? selectedStatus : undefined,
                sort: sortBy
            }
            
            const res = await api.get('/admin/jobs', { params })
            setJobs(res.data.jobs || [])
            if (res.data.pagination) {
                setPagination(prev => ({
                    ...prev,
                    ...res.data.pagination
                }))
            }
        } catch (error) {
            toast.error('Failed to load jobs')
        } finally {
            setLoading(false)
        }
    }

    const handleStatusChange = async (jobId, newStatus) => {
        try {
            await api.patch(`/admin/jobs/${jobId}/status`, { status: newStatus })
            setJobs(prev => prev.map(job => 
                job.id === jobId ? { ...job, status: newStatus } : job
            ))
            toast.success(`Job status updated to ${newStatus}`)
        } catch (error) {
            toast.error('Failed to update job status')
        }
    }

    const handleDeleteJob = async (jobId) => {
        if (!confirm('Are you sure you want to delete this job?')) return
        
        try {
            await api.delete(`/admin/jobs/${jobId}`)
            setJobs(prev => prev.filter(job => job.id !== jobId))
            toast.success('Job deleted successfully')
        } catch (error) {
            toast.error('Failed to delete job')
        }
    }

    const handleSearch = (e) => {
        setSearch(e.target.value)
        setPagination(prev => ({ ...prev, currentPage: 1 }))
    }

    const handleFilterChange = (filterType, value) => {
        switch(filterType) {
            case 'category':
                setSelectedCategory(value)
                break
            case 'type':
                setSelectedType(value)
                break
            case 'experience':
                setSelectedExperience(value)
                break
            case 'status':
                setSelectedStatus(value)
                break
        }
        setPagination(prev => ({ ...prev, currentPage: 1 }))
    }

    const clearFilters = () => {
        setSelectedCategory('All')
        setSelectedType('All')
        setSelectedExperience('All')
        setSelectedStatus('All')
        setSortBy('newest')
        setSearch('')
        setPagination(prev => ({ ...prev, currentPage: 1 }))
    }

    const handlePageChange = (page) => {
        setPagination(prev => ({ ...prev, currentPage: page }))
    }

    const handleLimitChange = (limit) => {
        setPagination(prev => ({ ...prev, itemsPerPage: limit, currentPage: 1 }))
    }

    const getDaysAgo = (dateString) => {
        const jobDate = new Date(dateString)
        const currentDate = new Date()
        const diffTime = Math.abs(currentDate - jobDate)
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        
        if (diffDays === 0) return 'Today'
        if (diffDays === 1) return 'Yesterday'
        if (diffDays < 7) return `${diffDays} days ago`
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
        return `${Math.floor(diffDays / 30)} months ago`
    }

    const getApplicationStats = (job) => {
        const applications = Array.isArray(job.applications) ? job.applications : []
        const total = applications.length
        const newApplications = applications.filter(app => app.status === 'NEW').length
        const shortlisted = applications.filter(app => app.status === 'SHORTLISTED').length
        return { total, new: newApplications, shortlisted }
    }

    if (loading) return (
        <AdminLayout title="Job Management">
            <div className="flex h-64 items-center justify-center">
                <div className="w-8 h-8 border-4 border-[#1a3c8f] border-t-transparent rounded-full animate-spin" />
            </div>
        </AdminLayout>
    )

    return (
        <AdminLayout title="Job Management">
            <div className="mb-6">
                <h2 className="text-2xl font-extrabold text-[#0f172a]">Job Management</h2>
                <p className="text-sm text-gray-500 mt-0.5">Manage and monitor all job postings</p>
            </div>

            {/* Search and Filters */}
            <div className="mb-6 space-y-4">
                {/* Search Bar */}
                <div className="relative">
                    <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by title, company, or location..."
                        value={search}
                        onChange={handleSearch}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1a3c8f] focus:ring-2 focus:ring-blue-100 transition"
                    />
                </div>

                {/* Filter Controls */}
                <div className="flex flex-wrap gap-3 items-center">
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
                    >
                        <Filter size={14} />
                        Filters
                        {(selectedCategory !== 'All' || selectedType !== 'All' || selectedExperience !== 'All' || selectedStatus !== 'All') && (
                            <span className="w-2 h-2 bg-[#f97316] rounded-full" />
                        )}
                    </button>

                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1a3c8f]"
                    >
                        <option value="newest">Newest First</option>
                        <option value="oldest">Oldest First</option>
                        <option value="applications">Most Applications</option>
                        <option value="deadline">Closing Soon</option>
                    </select>

                    {(selectedCategory !== 'All' || selectedType !== 'All' || selectedExperience !== 'All' || selectedStatus !== 'All') && (
                        <button
                            onClick={clearFilters}
                            className="flex items-center gap-1 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            <X size={14} />
                            Clear Filters
                        </button>
                    )}
                </div>

                {/* Expandable Filters */}
                <AnimatePresence>
                    {showFilters && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="bg-gray-50 rounded-xl p-4 space-y-3"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-2">Category</label>
                                    <select
                                        value={selectedCategory}
                                        onChange={(e) => handleFilterChange('category', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#1a3c8f]"
                                    >
                                        {JOB_CATEGORIES.map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-2">Job Type</label>
                                    <select
                                        value={selectedType}
                                        onChange={(e) => handleFilterChange('type', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#1a3c8f]"
                                    >
                                        <option value="All">All Types</option>
                                        {Object.entries(JOB_TYPES).map(([key, value]) => (
                                            <option key={key} value={key}>{value}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-2">Experience</label>
                                    <select
                                        value={selectedExperience}
                                        onChange={(e) => handleFilterChange('experience', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#1a3c8f]"
                                    >
                                        <option value="All">All Levels</option>
                                        {Object.keys(EXPERIENCE_LEVELS).map(level => (
                                            <option key={level} value={level}>{EXPERIENCE_LEVELS[level]}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-2">Status</label>
                                    <select
                                        value={selectedStatus}
                                        onChange={(e) => handleFilterChange('status', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#1a3c8f]"
                                    >
                                        <option value="All">All Status</option>
                                        <option value="OPEN">Open</option>
                                        <option value="CLOSED">Closed</option>
                                        <option value="DRAFT">Draft</option>
                                        <option value="EXPIRED">Expired</option>
                                    </select>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Job Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {jobs.map((job, i) => {
                    const stats = getApplicationStats(job)
                    const isExpired = new Date(job.deadline) < new Date()
                    const isExpiringSoon = new Date(job.deadline) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                    
                    return (
                        <motion.div
                            key={job.id}
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.06 }}
                            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-all duration-300 group"
                        >
                            {/* Job Header */}
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-gray-900 text-sm mb-1 line-clamp-2">{job.title}</h3>
                                    <p className="text-xs text-[#1a3c8f] font-semibold mb-2">{job.companyName}</p>
                                    
                                    <div className="flex flex-wrap gap-1.5 mb-2">
                                        <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold ${
                                            isExpired ? 'bg-red-100 text-red-700' :
                                            isExpiringSoon ? 'bg-orange-100 text-orange-700' :
                                            STATUS_COLORS[job.status] || 'bg-gray-100 text-gray-700'
                                        }`}>
                                            {isExpired ? 'Expired' : isExpiringSoon ? 'Closing Soon' : job.status}
                                        </span>
                                        <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-lg text-[10px] font-bold">
                                            {job.category}
                                        </span>
                                        <span className="px-2 py-0.5 bg-purple-50 text-purple-700 rounded-lg text-[10px] font-bold">
                                            {JOB_TYPES[job.jobType] || job.jobType}
                                        </span>
                                    </div>
                                </div>
                                
                                <div className="flex flex-col items-end gap-1">
                                    <span className="text-xs text-gray-400">{getDaysAgo(job.createdAt)}</span>
                                    {job.isFeatured && (
                                        <div className="flex items-center gap-1 text-xs text-amber-600">
                                            <Star size={12} fill="currentColor" />
                                            <span>Featured</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Job Details */}
                            <div className="space-y-2 mb-4">
                                <div className="flex items-center gap-2 text-xs text-gray-600">
                                    <MapPin size={11} className="text-gray-400" />
                                    <span className="truncate">{job.location}</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-gray-600">
                                    <Briefcase size={11} className="text-gray-400" />
                                    <span>{EXPERIENCE_LEVELS[job.experience] || job.experience}</span>
                                </div>
                                {(job.minSalary || job.maxSalary) && (
                                    <div className="flex items-center gap-2 text-xs text-gray-600">
                                        <DollarSign size={11} className="text-gray-400" />
                                        <span>
                                            {job.minSalary && job.maxSalary 
                                                ? `₹${job.minSalary}L - ₹${job.maxSalary}L` 
                                                : job.minSalary 
                                                    ? `₹${job.minSalary}L+` 
                                                    : `Up to ₹${job.maxSalary}L`
                                            }
                                        </span>
                                    </div>
                                )}
                                {job.deadline && (
                                    <div className="flex items-center gap-2 text-xs text-gray-600">
                                        <Calendar size={11} className="text-gray-400" />
                                        <span className={isExpired ? 'text-red-600' : isExpiringSoon ? 'text-orange-600' : ''}>
                                            Deadline: {new Date(job.deadline).toLocaleDateString()}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Application Stats */}
                            <div className="bg-gray-50 rounded-xl p-3 mb-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Users size={14} className="text-gray-400" />
                                        <span className="text-xs font-semibold text-gray-700">Applications</span>
                                    </div>
                                    <span className="text-sm font-bold text-gray-900">{stats.total}</span>
                                </div>
                                {stats.total > 0 && (
                                    <div className="flex gap-3 mt-2">
                                        <div className="flex items-center gap-1">
                                            <div className="w-2 h-2 bg-blue-500 rounded-full" />
                                            <span className="text-xs text-gray-600">New: {stats.new}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <div className="w-2 h-2 bg-green-500 rounded-full" />
                                            <span className="text-xs text-gray-600">Shortlisted: {stats.shortlisted}</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Skills */}
                            {job.skills && job.skills.length > 0 && (
                                <div className="flex flex-wrap gap-1 mb-4">
                                    {job.skills.slice(0, 4).map((skill, index) => (
                                        <span key={index} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-lg text-[9px] font-medium">
                                            {skill}
                                        </span>
                                    ))}
                                    {job.skills.length > 4 && (
                                        <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-lg text-[9px] font-medium">
                                            +{job.skills.length - 4}
                                        </span>
                                    )}
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setSelectedJob(job)}
                                    className="flex-1 flex items-center justify-center gap-1.5 py-2 border border-[#1a3c8f] text-[#1a3c8f] text-xs font-bold rounded-xl hover:bg-[#1a3c8f] hover:text-white transition-all duration-200"
                                >
                                    <Eye size={14} /> View
                                </button>
                                <select
                                    value={job.status}
                                    onChange={(e) => handleStatusChange(job.id, e.target.value)}
                                    className="px-3 py-2 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:border-[#1a3c8f]"
                                >
                                    <option value="OPEN">Open</option>
                                    <option value="CLOSED">Closed</option>
                                    <option value="DRAFT">Draft</option>
                                </select>
                                <button
                                    onClick={() => handleDeleteJob(job.id)}
                                    className="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-colors"
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        </motion.div>
                    )
                })}
            </div>

            {/* Empty State */}
            {jobs.length === 0 && (
                <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Briefcase size={32} className="text-gray-400" />
                    </div>
                    <p className="text-gray-400 text-sm">No jobs found</p>
                    <p className="text-gray-400 text-xs mt-1">Try adjusting your filters or search terms</p>
                </div>
            )}

            {/* Pagination */}
            <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                totalItems={pagination.totalItems}
                itemsPerPage={pagination.itemsPerPage}
                onPageChange={handlePageChange}
                onLimitChange={handleLimitChange}
            />

            {/* Job Detail Modal */}
            <AnimatePresence>
                {selectedJob && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
                        onClick={() => setSelectedJob(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            onClick={e => e.stopPropagation()}
                            className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="font-bold text-xl text-[#0f172a]">Job Details</h3>
                                <button
                                    onClick={() => setSelectedJob(null)}
                                    className="p-2 rounded-xl hover:bg-gray-100 text-gray-500 transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="space-y-6">
                                {/* Job Header */}
                                <div className="border-b border-gray-100 pb-4">
                                    <h2 className="text-xl font-bold text-gray-900 mb-2">{selectedJob.title}</h2>
                                    <p className="text-[#1a3c8f] font-semibold mb-3">{selectedJob.companyName}</p>
                                    
                                    <div className="flex flex-wrap gap-2">
                                        <span className={`px-3 py-1 rounded-lg text-sm font-bold ${
                                            STATUS_COLORS[selectedJob.status] || 'bg-gray-100 text-gray-700'
                                        }`}>
                                            {selectedJob.status}
                                        </span>
                                        <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-sm font-bold">
                                            {selectedJob.category}
                                        </span>
                                        <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-lg text-sm font-bold">
                                            {JOB_TYPES[selectedJob.jobType] || selectedJob.jobType}
                                        </span>
                                        {selectedJob.isFeatured && (
                                            <span className="px-3 py-1 bg-amber-50 text-amber-700 rounded-lg text-sm font-bold flex items-center gap-1">
                                                <Star size={14} fill="currentColor" />
                                                Featured
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Job Details Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                            <MapPin size={16} className="text-gray-400" />
                                            <div>
                                                <p className="text-xs text-gray-500">Location</p>
                                                <p className="text-sm font-medium text-gray-900">{selectedJob.location}</p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                            <Briefcase size={16} className="text-gray-400" />
                                            <div>
                                                <p className="text-xs text-gray-500">Experience</p>
                                                <p className="text-sm font-medium text-gray-900">{EXPERIENCE_LEVELS[selectedJob.experience] || selectedJob.experience}</p>
                                            </div>
                                        </div>

                                        {(selectedJob.minSalary || selectedJob.maxSalary) && (
                                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                                <DollarSign size={16} className="text-gray-400" />
                                                <div>
                                                    <p className="text-xs text-gray-500">Salary Range</p>
                                                    <p className="text-sm font-medium text-gray-900">
                                                        {selectedJob.minSalary && selectedJob.maxSalary 
                                                            ? `₹${selectedJob.minSalary}L - ₹${selectedJob.maxSalary}L` 
                                                            : selectedJob.minSalary 
                                                                ? `₹${selectedJob.minSalary}L+` 
                                                                : `Up to ₹${selectedJob.maxSalary}L`
                                                        }
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-3">
                                        {selectedJob.deadline && (
                                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                                <Calendar size={16} className="text-gray-400" />
                                                <div>
                                                    <p className="text-xs text-gray-500">Application Deadline</p>
                                                    <p className="text-sm font-medium text-gray-900">
                                                        {new Date(selectedJob.deadline).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                            <Users size={16} className="text-gray-400" />
                                            <div>
                                                <p className="text-xs text-gray-500">Vacancies</p>
                                                <p className="text-sm font-medium text-gray-900">{selectedJob.vacancies || 1} position{selectedJob.vacancies !== 1 ? 's' : ''}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                            <Clock size={16} className="text-gray-400" />
                                            <div>
                                                <p className="text-xs text-gray-500">Posted</p>
                                                <p className="text-sm font-medium text-gray-900">{getDaysAgo(selectedJob.createdAt)}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Description */}
                                {selectedJob.description && (
                                    <div>
                                        <h4 className="font-bold text-gray-900 mb-2">Job Description</h4>
                                        <div className="bg-gray-50 rounded-xl p-4">
                                            <p className="text-sm text-gray-700 whitespace-pre-wrap">{selectedJob.description}</p>
                                        </div>
                                    </div>
                                )}

                                {/* Responsibilities */}
                                {selectedJob.responsibilities && (
                                    <div>
                                        <h4 className="font-bold text-gray-900 mb-2">Key Responsibilities</h4>
                                        <div className="bg-gray-50 rounded-xl p-4">
                                            <p className="text-sm text-gray-700 whitespace-pre-wrap">{selectedJob.responsibilities}</p>
                                        </div>
                                    </div>
                                )}

                                {/* Requirements */}
                                {selectedJob.requirements && (
                                    <div>
                                        <h4 className="font-bold text-gray-900 mb-2">Candidate Requirements</h4>
                                        <div className="bg-gray-50 rounded-xl p-4">
                                            <p className="text-sm text-gray-700 whitespace-pre-wrap">{selectedJob.requirements}</p>
                                        </div>
                                    </div>
                                )}

                                {/* Benefits */}
                                {selectedJob.benefits && (
                                    <div>
                                        <h4 className="font-bold text-gray-900 mb-2">Benefits & Perks</h4>
                                        <div className="bg-gray-50 rounded-xl p-4">
                                            <p className="text-sm text-gray-700 whitespace-pre-wrap">{selectedJob.benefits}</p>
                                        </div>
                                    </div>
                                )}

                                {/* Skills */}
                                {selectedJob.skills && selectedJob.skills.length > 0 && (
                                    <div>
                                        <h4 className="font-bold text-gray-900 mb-2">Required Skills</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedJob.skills.map((skill, index) => (
                                                <span key={index} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="mt-6 flex gap-3">
                                <button
                                    onClick={() => setSelectedJob(null)}
                                    className="flex-1 py-2.5 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors"
                                >
                                    Close
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </AdminLayout>
    )
}

export default JobManagement
