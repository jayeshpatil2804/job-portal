import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import DashboardLayout from '../../components/DashboardLayout'
import { Search, MapPin, Briefcase, Bookmark, ChevronDown, DollarSign, Filter, RefreshCcw, X } from 'lucide-react'
import { getAllOpenJobs } from '../../redux/actions/jobActions'
import { motion, AnimatePresence } from 'framer-motion'

const JobCard = React.forwardRef(({ job, navigate }, ref) => (
    <motion.div 
        ref={ref}
        layout
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 hover:shadow-xl hover:shadow-blue-900/5 transition-all group relative overflow-hidden"
    >
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16 opacity-0 group-hover:opacity-50 transition-all blur-3xl" />
        
        <div className="relative flex flex-col md:flex-row gap-8 items-start">
            <div className="w-16 h-16 rounded-3xl bg-blue-600 shadow-lg flex items-center justify-center text-white shrink-0 group-hover:scale-110 transition-transform">
                <Briefcase size={28} />
            </div>

            <div className="flex-1 space-y-6">
                <div className="space-y-1">
                    <h3 className="text-2xl font-black text-gray-900 group-hover:text-[#1a3c8f] transition-colors">{job.title}</h3>
                    <p className="text-lg font-bold text-gray-400">{job.recruiter?.fullName || job.recruiter?.companyName}</p>
                </div>

                <div className="flex flex-wrap gap-x-8 gap-y-4 text-sm font-bold text-gray-500">
                    <div className="flex items-center gap-2">
                        <MapPin size={18} className="text-blue-600" />
                        {job.location}
                    </div>
                    <div className="flex items-center gap-2">
                        <DollarSign size={18} className="text-blue-600" />
                        ₹{job.salaryMin} - {job.salaryMax} LPA
                    </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-6 pt-6 border-t border-gray-50 mt-2">
                    <div className="flex items-center gap-3">
                        <span className="bg-blue-50 text-blue-700 text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full">
                            {job.department || 'General'}
                        </span>
                        <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">
                            {new Date(job.createdAt).toLocaleDateString()}
                        </span>
                    </div>
                    
                    <div className="flex gap-4 w-full sm:w-auto">
                        <button 
                            onClick={() => navigate(`/job/${job.id}`)}
                            className="flex-1 sm:flex-none px-8 py-4 bg-gray-900 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-gray-800 transition-all shadow-xl shadow-gray-900/10 active:scale-95"
                        >
                            View Details
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </motion.div>
))

const JobsPage = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { jobs = [], loading = false } = useSelector(state => state.job || {})
    
    const [filters, setFilters] = useState({
        location: '',
        experience: '',
        department: '',
        salaryRange: '',
        search: ''
    })

    const [activeFilters, setActiveFilters] = useState({})

    useEffect(() => {
        dispatch(getAllOpenJobs())
    }, [dispatch])

    const handleFilterChange = (e) => {
        const { name, value } = e.target
        setFilters(prev => ({ ...prev, [name]: value }))
    }

    const applyFilters = () => {
        const query = {}
        if (filters.location) query.location = filters.location
        if (filters.department) query.department = filters.department
        if (filters.search) query.search = filters.search
        
        dispatch(getAllOpenJobs(query))
        setActiveFilters({ ...filters })
    }

    const clearFilters = () => {
        const reset = { location: '', experience: '', department: '', salaryRange: '', search: '' }
        setFilters(reset)
        setActiveFilters({})
        dispatch(getAllOpenJobs())
    }

    return (
        <DashboardLayout>
            <div className="max-w-[1400px] mx-auto space-y-10 pb-20">
                {/* Header Section */}
                <div className="text-center md:text-left space-y-2">
                    <h1 className="text-5xl font-black text-gray-900 tracking-tighter">Discover Your Next Move</h1>
                    <p className="text-xl font-medium text-gray-500">Find and apply to the best opportunities in the textile industry</p>
                </div>

                <div className="flex flex-col lg:flex-row gap-10">
                    {/* Left Sidebar: Advanced Filters */}
                    <aside className="w-full lg:w-[350px] shrink-0">
                        <div className="bg-white rounded-[3rem] shadow-sm border border-gray-100 p-8 sticky top-10 space-y-8">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-black text-gray-900 tracking-tight flex items-center gap-2">
                                    <Filter size={20} className="text-[#1a3c8f]" />
                                    Filter Jobs
                                </h2>
                                <button 
                                    onClick={clearFilters}
                                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                    title="Reset All"
                                >
                                    <RefreshCcw size={18} />
                                </button>
                            </div>

                            <div className="space-y-6">
                                {/* Search within filters */}
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">Job Search</label>
                                    <div className="relative group">
                                        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#1a3c8f]" />
                                        <input 
                                            name="search"
                                            value={filters.search}
                                            onChange={handleFilterChange}
                                            placeholder="Keywords..."
                                            className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-transparent focus:border-[#1a3c8f] focus:bg-white rounded-2xl font-bold text-gray-700 outline-none transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">Location</label>
                                    <select 
                                        name="location"
                                        value={filters.location}
                                        onChange={handleFilterChange}
                                        className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent focus:border-[#1a3c8f] focus:bg-white rounded-2xl font-bold text-gray-600 outline-none appearance-none cursor-pointer"
                                    >
                                        <option value="">All Locations</option>
                                        <option value="Mumbai">Mumbai</option>
                                        <option value="Ahmedabad">Ahmedabad</option>
                                        <option value="Surat">Surat</option>
                                        <option value="Coimbatore">Coimbatore</option>
                                    </select>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">Department</label>
                                    <select 
                                        name="department"
                                        value={filters.department}
                                        onChange={handleFilterChange}
                                        className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent focus:border-[#1a3c8f] focus:bg-white rounded-2xl font-bold text-gray-600 outline-none appearance-none cursor-pointer"
                                    >
                                        <option value="">All Departments</option>
                                        <option value="Design">Design</option>
                                        <option value="Production">Production</option>
                                        <option value="Merchandising">Merchandising</option>
                                        <option value="Quality Control">Quality Control</option>
                                    </select>
                                </div>

                                <button 
                                    onClick={applyFilters}
                                    className="w-full py-5 bg-[#1a3c8f] text-white rounded-[2rem] font-black uppercase tracking-widest text-xs shadow-xl shadow-blue-900/10 hover:bg-blue-800 transition-all active:scale-95"
                                >
                                    Apply Changes
                                </button>
                            </div>
                        </div>
                    </aside>

                    {/* Right Content: Job Grid */}
                    <div className="flex-1 space-y-8">
                        {/* Active Filter Tags */}
                        {Object.values(activeFilters).some(v => v) && (
                            <div className="flex flex-wrap gap-2">
                                {Object.entries(activeFilters).map(([key, val]) => val && (
                                    <div key={key} className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-[#1a3c8f] rounded-xl font-bold text-[10px] uppercase tracking-wider">
                                        {val}
                                        <X 
                                            size={14} 
                                            className="cursor-pointer hover:text-blue-900" 
                                            onClick={() => {
                                                const next = { ...filters, [key]: '' }
                                                setFilters(next)
                                                setActiveFilters(next)
                                                dispatch(getAllOpenJobs(next))
                                            }}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="flex items-center justify-between px-2">
                            <p className="text-sm font-black text-gray-400 uppercase tracking-widest">
                                {loading ? 'Scanning results...' : `${jobs.length} Positions Available`}
                            </p>
                        </div>

                        {/* Job List */}
                        <div className="grid grid-cols-1 gap-6">
                            {loading ? (
                                Array.from({ length: 4 }).map((_, i) => (
                                    <div key={i} className="bg-white rounded-[2.5rem] p-8 h-48 animate-pulse border border-gray-100" />
                                ))
                            ) : jobs.length === 0 ? (
                                <div className="bg-white p-32 rounded-[3rem] border border-dashed border-gray-200 text-center space-y-6">
                                    <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-300">
                                        <Briefcase size={48} />
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-2xl font-black text-gray-900 tracking-tight">No Matching Jobs</h3>
                                        <p className="text-gray-500 font-medium">Try adjusting your filters to find more results.</p>
                                    </div>
                                    <button 
                                        onClick={clearFilters}
                                        className="px-10 py-4 bg-gray-100 text-gray-600 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-gray-200 transition-all font-bold"
                                    >
                                        Clear and restart
                                    </button>
                                </div>
                            ) : (
                                <AnimatePresence mode="popLayout">
                                    {jobs.map(job => <JobCard key={job.id} job={job} navigate={navigate} />)}
                                </AnimatePresence>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    )
}

export default JobsPage
