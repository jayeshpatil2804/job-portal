import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useSearchParams } from 'react-router-dom'
import DashboardLayout from '../../components/DashboardLayout'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import { Search, MapPin, Briefcase, Bookmark, ChevronDown, DollarSign, Filter, RefreshCcw, X, ArrowRight, Zap } from 'lucide-react'
import { getAllOpenJobs } from '../../redux/actions/jobActions'
import { motion, AnimatePresence } from 'framer-motion'
import { useMountTimer } from '../../hooks/useMountTimer'
import ActivationDialog from '../../components/common/ActivationDialog'
import toast from 'react-hot-toast'

const JobCard = React.forwardRef(({ job, navigate, onJobClick }, ref) => (
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
                        <h3 className="text-2xl font-black text-gray-900 group-hover:text-[#1a3c8f] transition-colors leading-tight tracking-tight">
                            {job.designation ? job.designation.name : job.title}
                        </h3>
                        <div className="flex items-center gap-2">
                             <p className="text-sm font-black text-gray-400 uppercase tracking-widest">
                                {job.recruiter?.companyName || 'Premium Company'}
                             </p>
                             <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-sm shadow-green-500/50" />
                        </div>
                    </div>
                    <div className="hidden md:flex gap-2">
                         <span className="bg-blue-50 text-[#1a3c8f] text-[9px] font-black uppercase tracking-widest px-4 py-2 rounded-xl">
                            {job.department || 'General'}
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
    const [searchParams] = useSearchParams()
    
    const initialKeyword = searchParams.get('keyword') || ''
    const initialLocation = searchParams.get('location') || ''

    const { jobs = [], loading = false } = useSelector(state => state.job || {})
    const { user, isAuthenticated } = useSelector(state => state.auth || {})
    const { isActive, isPaid } = useSelector(state => state.profile || {})
    
    const [showActivation, setShowActivation] = useState(false)
    
    const [filters, setFilters] = useState({
        location: initialLocation,
        experience: '',
        department: '',
        salaryRange: '',
        search: initialKeyword
    })

    const [activeFilters, setActiveFilters] = useState({})

    useEffect(() => {
        const query = {}
        if (initialLocation) query.location = initialLocation
        if (initialKeyword) query.search = initialKeyword
        
        dispatch(getAllOpenJobs(query))
        
        if (initialLocation || initialKeyword) {
            setActiveFilters({
                location: initialLocation,
                search: initialKeyword
            })
        }
    }, [dispatch, initialKeyword, initialLocation])

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

    const handleJobClick = (jobId) => {
        if (isAuthenticated && user?.role === 'CANDIDATE' && !isActive) {
            toast.error('Payment not full. Please activate to view details.')
            setShowActivation(true)
            return
        }
        navigate(`/job/${jobId}`)
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
            <ActivationDialog 
                isOpen={showActivation} 
                isPaid={isPaid} 
                userType="CANDIDATE" 
                onClose={() => setShowActivation(false)} 
            />
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
                                    <label className={labelClasses}>Deep Search</label>
                                    <div className="relative group">
                                        <Search size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#1a3c8f] transition-colors" />
                                        <input 
                                            name="search"
                                            value={filters.search}
                                            onChange={handleFilterChange}
                                            placeholder="Keywords, skills, roles..."
                                            className="w-full pl-14 pr-6 py-4 bg-gray-50 border-2 border-transparent focus:border-[#1a3c8f] focus:bg-white rounded-[1.5rem] font-bold text-sm text-gray-700 outline-none transition-all shadow-sm"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2 relative">
                                    <label className={labelClasses}>Location</label>
                                    <div className="relative">
                                        <select 
                                            name="location"
                                            value={filters.location}
                                            onChange={handleFilterChange}
                                            className={selectClasses}
                                        >
                                            <option value="">All Regions</option>
                                            <option value="Mumbai">Mumbai</option>
                                            <option value="Ahmedabad">Ahmedabad</option>
                                            <option value="Surat">Surat</option>
                                            <option value="Coimbatore">Coimbatore</option>
                                        </select>
                                        <ChevronDown size={14} className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
                                    </div>
                                </div>

                                <div className="space-y-2 relative">
                                    <label className={labelClasses}>Primary Category</label>
                                    <div className="relative">
                                        <select 
                                            name="department"
                                            value={filters.department}
                                            onChange={handleFilterChange}
                                            className={selectClasses}
                                        >
                                            <option value="">All Specialties</option>
                                            <option value="Design">Design</option>
                                            <option value="Production">Production</option>
                                            <option value="Merchandising">Merchandising</option>
                                            <option value="Quality Control">Quality Control</option>
                                        </select>
                                        <ChevronDown size={14} className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
                                    </div>
                                </div>

                                <button 
                                    onClick={applyFilters}
                                    className="w-full py-6 bg-gray-900 text-white rounded-[2rem] font-black uppercase tracking-widest text-xs shadow-2xl shadow-gray-900/10 hover:bg-black transition-all active:scale-95 flex items-center justify-center gap-3"
                                >
                                    <Filter size={16} />
                                    Search Jobs
                                </button>
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
                             {Object.values(activeFilters).some(v => v) && (
                                <div className="flex flex-wrap gap-2">
                                    {Object.entries(activeFilters).map(([key, val]) => val && (
                                        <div key={key} className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-[#1a3c8f] rounded-xl font-black text-[9px] uppercase tracking-wider border border-blue-100">
                                            {val}
                                            <X 
                                                size={12} 
                                                className="cursor-pointer hover:text-red-500 transition-colors" 
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
                        </div>

                        {/* Job List */}
                        <div className="grid grid-cols-1 gap-8">
                            {loading ? (
                                Array.from({ length: 4 }).map((_, i) => (
                                    <div key={i} className="bg-white rounded-[3rem] p-10 h-56 animate-pulse border border-gray-100 shadow-sm" />
                                ))
                            ) : jobs.length === 0 ? (
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
                            ) : (
                                <AnimatePresence mode="popLayout">
                                    {jobs.map(job => <JobCard key={job.id} job={job} navigate={navigate} onJobClick={handleJobClick} />)}
                                </AnimatePresence>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default JobsPage
