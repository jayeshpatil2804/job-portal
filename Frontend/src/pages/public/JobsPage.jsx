import React, { useEffect, useState, useCallback, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useSearchParams } from 'react-router-dom'
import DashboardLayout from '../../components/DashboardLayout'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import { Search, MapPin, Briefcase, Bookmark, ChevronDown, DollarSign, Filter, RefreshCcw, X, ArrowRight, Zap, Clock, Users, Building2 } from 'lucide-react'
import { getAllOpenJobs } from '../../redux/actions/jobActions'
import { toggleSaveJob, getMySavedJobs } from '../../redux/actions/savedJobActions'
import { fetchDepartments } from '../../redux/slices/metaSlice'
import { motion, AnimatePresence } from 'framer-motion'
import { useMountTimer } from '../../hooks/useMountTimer'
import toast from 'react-hot-toast'

const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value)
    useEffect(() => {
        const handler = setTimeout(() => setDebouncedValue(value), delay)
        return () => clearTimeout(handler)
    }, [value, delay])
    return debouncedValue
}

const JobCard = React.forwardRef(({ job, navigate, onJobClick, isCandidate, isSaved, onSaveToggle }, ref) => (
    <motion.div 
        ref={ref}
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        whileHover={{ y: -5, shadow: '0 20px 25px -5px rgb(0 0 0 / 0.05)' }}
        className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 hover:border-blue-100 transition-all group relative overflow-hidden"
    >
        <div className="absolute top-0 right-0 w-40 h-40 bg-blue-50/50 rounded-full -mr-20 -mt-20 opacity-0 group-hover:opacity-100 transition-all blur-3xl" />
        
        <div className="relative flex flex-col md:flex-row gap-8 items-start">
            <div className="w-20 h-20 rounded-[2rem] bg-gradient-to-br from-[#1a3c8f] to-blue-500 shadow-xl flex items-center justify-center text-white shrink-0 group-hover:scale-105 transition-transform border-4 border-white">
                {job.recruiter?.companyName ? (
                    <span className="text-2xl font-black">{job.recruiter.companyName.charAt(0)}</span>
                ) : (
                    <Briefcase size={32} />
                )}
            </div>

            <div className="flex-1 space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <h3 className="text-2xl font-black text-gray-900 group-hover:text-[#1a3c8f] transition-colors leading-tight tracking-tight">
                                {job.title}
                            </h3>
                            {isCandidate && (
                                <button 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onSaveToggle(job.id);
                                    }}
                                    className={`p-2 rounded-xl transition-all ${
                                        isSaved 
                                            ? 'bg-blue-50 text-[#1a3c8f] border border-blue-100' 
                                            : 'bg-gray-50 text-gray-400 border border-gray-100 hover:bg-blue-50 hover:text-[#1a3c8f]'
                                    }`}
                                >
                                    <Bookmark size={18} fill={isSaved ? "currentColor" : "none"} />
                                </button>
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                             <p className="text-sm font-black text-gray-400 uppercase tracking-widest">
                                {job.recruiter?.companyName || 'Premium Company'}
                             </p>
                             <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-sm shadow-green-500/50" />
                        </div>
                    </div>
                    <div className="hidden md:flex gap-2">
                         <span className="bg-blue-50 text-[#1a3c8f] text-[9px] font-black uppercase tracking-widest px-4 py-2 rounded-xl">
                            {job.department ? job.department.name : 'General'}
                        </span>
                    </div>
                </div>

                <div className="flex flex-wrap gap-x-8 gap-y-4 text-xs font-black text-gray-400 uppercase tracking-widest">
                    <div className="flex items-center gap-2.5">
                        <MapPin size={16} className="text-[#1a3c8f]" />
                        {job.location}
                    </div>
                    <div className="flex items-center gap-2.5">
                        <DollarSign size={16} className="text-[#1a3c8f]" />
                        ₹{job.salaryMin} - {job.salaryMax} LPA
                    </div>
                    <div className="flex items-center gap-2.5">
                        <Zap size={16} className="text-orange-400" />
                        Quick Apply
                    </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-6 pt-6 border-t border-gray-50 mt-2">
                    <div className="flex items-center gap-4">
                        <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">
                             Posted {new Date(job.createdAt).toLocaleDateString()}
                        </span>
                    </div>
                    
                    <button 
                        onClick={() => onJobClick ? onJobClick(job.id) : navigate(`/job/${job.id}`)}
                        className="group flex items-center gap-3 bg-gray-900 text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-gray-900/10 hover:bg-black transition-all active:scale-95 whitespace-nowrap"
                    >
                        View Details
                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-[#1a3c8f] transition-colors">
                             <ArrowRight size={14} />
                        </div>
                    </button>
                </div>
            </div>
        </div>
    </motion.div>
))

const JobsPage = () => {
    useMountTimer('JobsPage')
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [searchParams, setSearchParams] = useSearchParams()
    
    const initialKeyword = searchParams.get('keyword') || ''
    const initialLocation = searchParams.get('location') || ''
    const initialDeptId = searchParams.get('departmentId') || ''

    const { jobs = [], loading = false, pagination } = useSelector(state => state.job || {})
    const { user, isAuthenticated } = useSelector(state => state.auth || {})
    const { departments = [] } = useSelector(state => state.meta || {})
    const { savedJobs = [] } = useSelector(state => state.savedJob || {})

    const isCandidate = isAuthenticated && user?.role === 'CANDIDATE'
    const savedJobIds = savedJobs.map(sj => sj.id)

    const [filters, setFilters] = useState({
        location: initialLocation,
        experience: '',
        departmentId: initialDeptId,
        jobType: '',
        minSalary: '',
        maxSalary: '',
        search: initialKeyword
    })

    const [activeFilters, setActiveFilters] = useState({
        location: initialLocation,
        departmentId: initialDeptId,
        search: initialKeyword
    })

    const debouncedSearch = useDebounce(filters.search, 500)
    const observer = useRef()
    const lastJobElementRef = useCallback(node => {
        if (loading) return
        if (observer.current) observer.current.disconnect()
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && pagination?.hasNextPage) {
                const query = {
                    ...filters,
                    search: debouncedSearch,
                    page: (pagination?.page || 1) + 1
                }
                dispatch(getAllOpenJobs(query))
            }
        })
        if (node) observer.current.observe(node)
    }, [loading, pagination?.hasNextPage, pagination?.page, filters, debouncedSearch, dispatch])

    useEffect(() => {
        dispatch(fetchDepartments())
        if (isCandidate) {
            dispatch(getMySavedJobs())
        }
    }, [dispatch, isCandidate])

    useEffect(() => {
        const query = {
            ...filters,
            search: debouncedSearch,
            page: 1
        }
        dispatch(getAllOpenJobs(query))
        setActiveFilters({
            ...filters,
            search: debouncedSearch
        })
    }, [dispatch, debouncedSearch, filters.location, filters.departmentId, filters.experience, filters.jobType, filters.minSalary, filters.maxSalary])

    const handleFilterChange = (e) => {
        const { name, value } = e.target
        setFilters(prev => ({ ...prev, [name]: value }))
    }

    const clearFilters = () => {
        const reset = {
            location: '',
            experience: '',
            departmentId: '',
            jobType: '',
            minSalary: '',
            maxSalary: '',
            search: ''
        }
        setFilters(reset)
        setActiveFilters(reset)
    }

    const handleJobClick = (jobId) => {
        navigate(`/job/${jobId}`)
    }

    const handleSaveToggle = async (jobId) => {
        try {
            const isSavedNow = await dispatch(toggleSaveJob(jobId))
            toast.success(isSavedNow ? 'Job saved!' : 'Job removed from saved')
        } catch (error) {
            toast.error('Action failed')
        }
    }

    const selectClasses = "w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:border-[#1a3c8f] focus:bg-white rounded-2xl font-black text-[10px] uppercase tracking-widest text-gray-500 outline-none appearance-none cursor-pointer transition-all shadow-sm"
    const labelClasses = "text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-2 mb-2 block"

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

    return (
        <Layout>

            <div className="max-w-[1440px] mx-auto space-y-12 pb-20">
                {/* ── Hero Section ── */}
                <div className="relative overflow-hidden bg-[#1a3c8f] rounded-[3.5rem] p-12 md:p-20 text-white shadow-2xl shadow-blue-900/20">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl opacity-50"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-400/20 rounded-full -ml-32 -mb-32 blur-3xl opacity-50"></div>
                    
                    <div className="relative z-10 max-w-3xl space-y-8">
                        <div className="inline-flex items-center gap-3 px-6 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-xs font-black uppercase tracking-widest">
                            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                            Latest textile opportunities
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none">
                            Discover Your <span className="text-blue-300">Next Move.</span>
                        </h1>
                        <p className="text-xl md:text-2xl font-medium text-blue-100/80 leading-relaxed max-w-xl">
                            Join thousands of professionals finding the best roles in textile production and design.
                        </p>

                        {/* Integrated Search Bar */}
                        <div className="max-w-2xl bg-white/10 backdrop-blur-xl p-2 rounded-[2.5rem] border border-white/20 shadow-2xl mt-12 group focus-within:bg-white/20 transition-all">
                            <div className="flex flex-col md:flex-row items-center gap-2">
                                <div className="flex-1 relative w-full">
                                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-blue-100 group-focus-within:text-white transition-colors" size={20} />
                                    <input 
                                        type="text"
                                        name="search"
                                        value={filters.search}
                                        onChange={handleFilterChange}
                                        placeholder="Search by role, company or skills..."
                                        className="w-full bg-transparent pl-16 pr-6 py-5 text-lg font-bold text-white placeholder:text-blue-100/50 outline-none"
                                    />
                                </div>
                                <div className="hidden md:block w-[1px] h-10 bg-white/20 mx-2"></div>
                                <div className="flex-1 relative w-full">
                                    <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 text-blue-100 group-focus-within:text-white transition-colors" size={20} />
                                    <input 
                                        type="text"
                                        name="location"
                                        value={filters.location}
                                        onChange={handleFilterChange}
                                        placeholder="City or state..."
                                        className="w-full bg-transparent pl-16 pr-6 py-5 text-lg font-bold text-white placeholder:text-blue-100/50 outline-none"
                                    />
                                </div>
                                <button 
                                    onClick={() => setActiveFilters(filters)}
                                    className="bg-white text-[#1a3c8f] px-10 py-5 rounded-[2rem] font-black uppercase tracking-widest text-[10px] hover:bg-blue-50 transition-all active:scale-95 shadow-xl"
                                >
                                    Search
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-12">
                    {/* ── Left Sidebar: Advanced Filters ── */}
                    <aside className="w-full lg:w-[380px] shrink-0">
                        <div className="bg-white/80 backdrop-blur-xl rounded-[3rem] shadow-xl shadow-blue-900/5 border border-white p-10 sticky top-10 space-y-10">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                                    <Filter size={24} className="text-[#1a3c8f]" />
                                    Filter Jobs
                                </h2>
                                <button 
                                    onClick={clearFilters}
                                    className="w-10 h-10 flex items-center justify-center rounded-2xl bg-gray-50 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all active:scale-90 shadow-sm"
                                    title="Reset All"
                                >
                                    <RefreshCcw size={18} />
                                </button>
                            </div>

                            <div className="space-y-8">
                                <div className="space-y-2">
                                    <label className={labelClasses}>Job Type</label>
                                    <div className="relative">
                                        <select 
                                            name="jobType"
                                            value={filters.jobType}
                                            onChange={handleFilterChange}
                                            className={selectClasses}
                                        >
                                            <option value="">All Types</option>
                                            <option value="FULL_TIME">Full Time</option>
                                            <option value="PART_TIME">Part Time</option>
                                            <option value="CONTRACT">Contract</option>
                                            <option value="INTERNSHIP">Internship</option>
                                            <option value="FREELANCE">Freelance</option>
                                        </select>
                                        <ChevronDown size={14} className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
                                    </div>
                                </div>

                                <div className="space-y-2 relative">
                                    <label className={labelClasses}>Department</label>
                                    <div className="relative">
                                        <select 
                                            name="departmentId"
                                            value={filters.departmentId}
                                            onChange={handleFilterChange}
                                            className={selectClasses}
                                        >
                                            <option value="">All Departments</option>
                                            {departments.map(dept => (
                                                <option key={dept.id} value={dept.id}>{dept.name}</option>
                                            ))}
                                        </select>
                                        <ChevronDown size={14} className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className={labelClasses}>Salary (LPA)</label>
                                    <div className="grid grid-cols-2 gap-4">
                                        <input 
                                            type="number" 
                                            name="minSalary"
                                            placeholder="Min"
                                            value={filters.minSalary}
                                            onChange={handleFilterChange}
                                            className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:border-[#1a3c8f] focus:bg-white rounded-2xl font-black text-[10px] outline-none transition-all shadow-sm"
                                        />
                                        <input 
                                            type="number" 
                                            name="maxSalary"
                                            placeholder="Max"
                                            value={filters.maxSalary}
                                            onChange={handleFilterChange}
                                            className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:border-[#1a3c8f] focus:bg-white rounded-2xl font-black text-[10px] outline-none transition-all shadow-sm"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* ── Right Content: Job Grid ── */}
                    <div className="flex-1 space-y-10">
                        {/* Status Bar */}
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 bg-white px-8 py-6 rounded-[2.5rem] border border-gray-100 shadow-sm">
                             <div className="flex items-center gap-4">
                                <p className="text-xs font-black text-gray-400 uppercase tracking-widest">
                                    {loading ? 'Scanning results...' : (
                                        <>Showing <span className="text-gray-900">{jobs.length}</span> verified positions</>
                                    )}
                                </p>
                             </div>
                             {Object.entries(activeFilters).some(([k, v]) => v && ['search', 'location', 'jobType', 'departmentId'].includes(k)) && (
                                <div className="flex flex-wrap gap-2">
                                    {Object.entries(activeFilters)
                                        .filter(([key, val]) => val && ['search', 'location', 'jobType', 'departmentId'].includes(key))
                                        .map(([key, val]) => {
                                            let displayVal = val;
                                            if (key === 'departmentId') {
                                                displayVal = departments.find(d => d.id === val)?.name || 'Dept';
                                            }
                                            if (key === 'jobType') {
                                                displayVal = val.replace('_', ' ');
                                            }
                                            
                                            return (
                                                <div key={key} className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-[#1a3c8f] rounded-xl font-black text-[9px] uppercase tracking-wider border border-blue-100">
                                                    <span className="text-blue-300 mr-1">{key.replace('Id', '')}:</span>
                                                    {displayVal}
                                                    <X 
                                                        size={12} 
                                                        className="ml-1 cursor-pointer hover:text-red-500 transition-colors" 
                                                        onClick={() => {
                                                            const next = { ...filters, [key]: '' }
                                                            setFilters(next)
                                                        }}
                                                    />
                                                </div>
                                            );
                                        })}
                                </div>
                            )}
                        </div>

                        {/* Job List */}
                        <div className="grid grid-cols-1 gap-8">
                            <AnimatePresence mode="popLayout">
                                {jobs.map((job, index) => (
                                    <JobCard 
                                        key={job.id} 
                                        ref={index === jobs.length - 1 ? lastJobElementRef : null}
                                        job={job} 
                                        navigate={navigate} 
                                        onJobClick={handleJobClick} 
                                        isCandidate={isCandidate}
                                        isSaved={savedJobIds.includes(job.id)}
                                        onSaveToggle={handleSaveToggle}
                                    />
                                ))}
                            </AnimatePresence>
                            
                            {loading && (
                                <div className="space-y-8">
                                    {[1, 2].map(i => (
                                        <div key={i} className="bg-white rounded-[3rem] p-10 h-56 animate-pulse border border-gray-100 shadow-sm" />
                                    ))}
                                </div>
                            )}

                            {!loading && jobs.length === 0 && (
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="bg-white p-24 rounded-[3.5rem] border border-dashed border-gray-200 text-center space-y-8 shadow-sm"
                                >
                                    <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto text-[#1a3c8f] shadow-inner">
                                        <Briefcase size={40} />
                                    </div>
                                    <div className="max-w-md mx-auto space-y-2">
                                        <h3 className="text-3xl font-black text-gray-900 tracking-tight">No Matching Jobs</h3>
                                        <p className="text-gray-500 font-medium">We couldn't find any positions matching your specific requirements. Try broader search terms.</p>
                                    </div>
                                    <button 
                                        onClick={clearFilters}
                                        className="px-12 py-5 bg-gray-100 text-gray-800 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-gray-200 transition-all shadow-sm active:scale-95"
                                    >
                                        Reset and refresh
                                    </button>
                                </motion.div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default JobsPage
