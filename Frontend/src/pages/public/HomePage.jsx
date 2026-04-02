import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import {
    Search,
    MapPin,
    Scissors,
    Settings2,
    ShoppingBag,
    TrendingUp,
    Shirt,
    CheckCircle2,
    UserPlus,
    Briefcase,
    CheckCircle,
    Mail,
    Phone,
    MapPinned,
    Sparkles,
    ArrowRight,
    Building2,
    Zap,
    ShieldCheck,
    Award
} from 'lucide-react'
import Navbar from '../../components/Navbar'
import jobsImg from '../../assets/banner.jpeg'
import banner2 from '../../assets/banner 2.jpeg'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, EffectFade } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/effect-fade'
import { motion } from 'framer-motion'
import { useMountTimer } from '../../hooks/useMountTimer'
import { getAllOpenJobs } from '../../redux/actions/jobActions'

// ─── Data ────────────────────────────────────────────────────────────────────

const categories = [
    { icon: <Scissors size={28} />, label: 'Textile Designer', jobs: 245, color: 'bg-blue-50 text-blue-700' },
    { icon: <Settings2 size={28} />, label: 'Machine Operator', jobs: 389, color: 'bg-indigo-50 text-indigo-700' },
    { icon: <ShoppingBag size={28} />, label: 'Merchandiser', jobs: 156, color: 'bg-sky-50 text-sky-700' },
    { icon: <TrendingUp size={28} />, label: 'Production Manager', jobs: 98, color: 'bg-emerald-50 text-emerald-700' },
    { icon: <Shirt size={28} />, label: 'Sales Executive', jobs: 234, color: 'bg-orange-50 text-orange-700' },
]

const howItWorks = [
    {
        step: '1',
        icon: <UserPlus size={24} />,
        title: 'Create Account',
        desc: 'Build your professional profile in minutes.',
        color: 'bg-blue-50 text-blue-600'
    },
    {
        step: '2',
        icon: <Briefcase size={24} />,
        title: 'Apply Jobs',
        desc: 'Access verified roles across India.',
        color: 'bg-indigo-50 text-indigo-600'
    },
    {
        step: '3',
        icon: <CheckCircle size={24} />,
        title: 'Get Hired',
        desc: 'Connect with top-tier textile recruiters.',
        color: 'bg-emerald-50 text-emerald-600'
    },
]

const companies = [
    'Arvind Mills',
    'Raymond Limited',
    'Welspun India',
    'Vardhman Textiles',
    'Trident Group',
    'Alok Industries',
    'Bombay Dyeing',
    'Grasim Industries',
]

const testimonials = [
    {
        id: 1,
        name: 'Priya Sharma',
        role: 'Textile Designer',
        company: 'Arvind Mills',
        text: 'LOSODHAN streamlined my career search. I landed a great role at Arvind Mills efficiently and quickly.',
    },
    {
        id: 2,
        name: 'Rajesh Kumar',
        role: 'Production Manager',
        company: 'Welspun India',
        text: 'The quality of talent here is wonderful. As a recruiter, it\'s our most reliable source for verified professionals.',
    },
    {
        id: 3,
        name: 'Anita Desai',
        role: 'Merchandiser',
        company: 'Raymond Limited',
        text: 'A clean experience and genuine opportunities. It truly understands the specific needs of our industry.',
    },
]

// ─── Component ────────────────────────────────────────────────────────────────

const HomePage = () => {
    useMountTimer('HomePage')
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [keyword, setKeyword] = useState('')
    const [loc, setLoc] = useState('')

    const { jobs } = useSelector(state => state.job)
    const { isAuthenticated } = useSelector(state => state.auth)

    useEffect(() => {
        dispatch(getAllOpenJobs())
    }, [dispatch])

    const handleBrowseJobs = () => {
        if (isAuthenticated) {
            navigate('/jobs')
        } else {
            navigate('/candidate/login')
        }
    }

    const handleSearch = () => {
        const params = new URLSearchParams()
        if (keyword) params.append('keyword', keyword)
        if (loc) params.append('location', loc)
        
        if (isAuthenticated) {
            navigate(`/jobs?${params.toString()}`)
        } else {
            navigate('/candidate/login')
        }
    }

    // Get the 3 most recent jobs
    const displayJobs = jobs?.slice(0, 3) || []

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            <Navbar />

            {/* ── Hero Section with Professional Image Background ── */}
            <section className="relative py-28 md:py-36 px-4 overflow-hidden min-h-[600px] flex items-center justify-center">
                {/* Image Background Slider */}
                <div className="absolute inset-0 z-0">
                    <Swiper
                        modules={[Autoplay, EffectFade]}
                        effect="fade"
                        speed={1500}
                        autoplay={{ delay: 6000, disableOnInteraction: false }}
                        loop={true}
                        className="h-full w-full"
                    >
                        <SwiperSlide>
                            <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${jobsImg})` }} />
                        </SwiperSlide>
                        <SwiperSlide>
                            <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${banner2})` }} />
                        </SwiperSlide>
                    </Swiper>
                    {/* Clean Dark Overlay for text readability */}
                    <div className="absolute inset-0 bg-gray-900/75 z-10" />
                </div>
                
                <div className="max-w-6xl mx-auto text-center relative z-20 w-full mt-10">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-md text-blue-100 rounded-full text-xs font-semibold mb-8 border border-white/20">
                            <Sparkles size={14} className="text-blue-300" />
                            India's Leading Textile Network
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight tracking-tight">
                            Find Your Next <span className="text-blue-400">Professional Role.</span>
                        </h1>
                        <p className="text-gray-300 text-lg mb-12 max-w-2xl mx-auto leading-relaxed">
                            Connecting verified textile professionals with trusted opportunities across India's leading organizations.
                        </p>

                        {/* Search Bar - Professional Light Mode Overlay */}
                        <div className="bg-white p-2 rounded-2xl shadow-2xl flex flex-col md:flex-row items-center max-w-4xl mx-auto">
                            <div className="flex items-center gap-3 px-6 py-4 flex-1 w-full md:border-r border-gray-100">
                                <Search size={20} className="text-blue-600 shrink-0" />
                                <input
                                    type="text"
                                    placeholder="Job Title or Keywords"
                                    value={keyword}
                                    onChange={(e) => setKeyword(e.target.value)}
                                    className="flex-1 outline-none text-base font-medium text-gray-900 placeholder-gray-400 bg-transparent"
                                />
                            </div>
                            <div className="flex items-center gap-3 px-6 py-4 flex-1 w-full">
                                <MapPin size={20} className="text-blue-600 shrink-0" />
                                <input
                                    type="text"
                                    placeholder="Preferred Location"
                                    value={loc}
                                    onChange={(e) => setLoc(e.target.value)}
                                    className="flex-1 outline-none text-base font-medium text-gray-900 placeholder-gray-400 bg-transparent"
                                />
                            </div>
                            <button 
                                onClick={handleSearch}
                                className="bg-blue-600 text-white font-semibold text-sm px-8 py-4 rounded-xl hover:bg-blue-700 transition-colors w-full md:w-auto mt-2 md:mt-0 shadow-md"
                            >
                                Search Roles
                            </button>
                        </div>

                        <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-gray-300 text-sm font-medium">
                            <div className="flex items-center gap-2">
                                <ShieldCheck size={18} className="text-blue-400" /> Verified Roles
                            </div>
                            <div className="flex items-center gap-2">
                                <Zap size={18} className="text-blue-400" /> Instant Apply
                            </div>
                            <div className="flex items-center gap-2">
                                <Building2 size={18} className="text-blue-400" /> Top Recruiters
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ── Browse by Category ── */}
            <section className="bg-gray-50 py-24 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 tracking-tight mb-3">
                                Explore Specialties
                            </h2>
                            <p className="text-gray-600">
                                Browse roles tailored to specific sectors in the textile industry.
                            </p>
                        </div>
                        <button className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                            View All Categories <ArrowRight size={16} />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                        {categories.map((cat, i) => (
                            <motion.div
                                initial={{ opacity: 0, y: 15 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                viewport={{ once: true }}
                                key={cat.label}
                                className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex flex-col items-center text-center hover:shadow-md hover:border-blue-100 transition-all cursor-pointer"
                            >
                                <div className={`w-14 h-14 rounded-xl ${cat.color} flex items-center justify-center mb-4`}>
                                    {cat.icon}
                                </div>
                                <h3 className="font-semibold text-gray-900 mb-1">{cat.label}</h3>
                                <p className="text-sm text-gray-500">
                                    {cat.jobs} Openings
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Featured Jobs ── */}
            <section className="bg-white py-24 px-4 border-t border-gray-200">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-gray-900 tracking-tight mb-3">
                            Latest Opportunities
                        </h2>
                        <p className="text-gray-600 max-w-lg mx-auto">
                            Discover active roles from trusted industry leaders.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {displayJobs.map((job, i) => (
                            <motion.div
                                initial={{ opacity: 0, y: 15 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                viewport={{ once: true }}
                                key={job.id}
                                className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all flex flex-col gap-5"
                            >
                                <div className="flex justify-between items-start">
                                    <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center text-gray-700 font-bold text-xl border border-gray-100">
                                        {job.recruiter?.companyName?.charAt(0) || job.title.charAt(0)}
                                    </div>
                                    <span className="bg-green-50 text-green-700 text-xs font-medium px-3 py-1 rounded-full border border-green-100">
                                        {job.jobType?.replace('_', ' ') || 'Full Time'}
                                    </span>
                                </div>
                                
                                <div>
                                    <h3 className="font-bold text-gray-900 text-lg mb-1 line-clamp-1">{job.title}</h3>
                                    <p className="text-gray-600 text-sm line-clamp-1">{job.recruiter?.companyName || 'Verified Company'}</p>
                                </div>
                                
                                <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
                                    <div className="flex items-center gap-1.5 text-gray-500 text-sm">
                                        <MapPin size={14} />
                                        {job.location.split(',')[0]}
                                    </div>
                                    <p className="text-gray-900 font-semibold text-sm">₹{job.salaryMin}-{job.salaryMax} LPA</p>
                                </div>

                                <Link
                                    to={`/job/${job.id}`}
                                    className="w-full bg-blue-50 text-blue-700 py-2.5 rounded-xl text-sm font-semibold text-center hover:bg-blue-100 transition-colors mt-2"
                                >
                                    View Details
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                    
                    <div className="mt-12 text-center">
                        <button 
                            onClick={handleBrowseJobs}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-xl font-semibold text-sm hover:bg-gray-50 transition-colors"
                        >
                            View All Jobs <ArrowRight size={16} />
                        </button>
                    </div>
                </div>
            </section>

            {/* ── How It Works ── */}
            <section className="bg-gray-50 py-24 px-4 border-t border-gray-200">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-gray-900 tracking-tight mb-3">
                            How It Works
                        </h2>
                        <p className="text-gray-600 max-w-xl mx-auto">
                            A straightforward process designed for modern professionals.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                        {/* Connecting Line for Desktop */}
                        <div className="hidden md:block absolute top-10 left-[20%] right-[20%] h-px bg-gray-300 z-0" />
                        
                        {howItWorks.map((item, i) => (
                            <motion.div 
                                initial={{ opacity: 0, y: 15 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                viewport={{ once: true }}
                                key={item.step} 
                                className="flex flex-col items-center text-center relative z-10"
                            >
                                <div className={`w-20 h-20 rounded-2xl ${item.color} flex items-center justify-center mb-6 shadow-sm`}>
                                    {item.icon}
                                </div>
                                <h3 className="font-bold text-gray-900 text-xl mb-2">{item.title}</h3>
                                <p className="text-gray-600 text-sm max-w-xs">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Top Recruiter Companies ── */}
            <section className="bg-white py-20 px-4 border-t border-gray-200">
                <div className="max-w-7xl mx-auto">
                    <p className="text-center text-gray-500 font-semibold text-sm uppercase tracking-wider mb-8">
                        Trusted by Industry Leaders
                    </p>
                    <div className="flex flex-wrap justify-center gap-4 md:gap-8">
                        {companies.map((company, i) => (
                            <div
                                key={company}
                                className="px-6 py-3 bg-gray-50 text-gray-600 font-semibold text-sm rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
                            >
                                {company}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Testimonials ── */}
            <section className="bg-blue-900 py-24 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-white tracking-tight mb-3">
                            Success Stories
                        </h2>
                        <p className="text-blue-200">
                            Hear from professionals who advanced their careers.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {testimonials.map((t, i) => (
                            <motion.div
                                initial={{ opacity: 0, y: 15 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                viewport={{ once: true }}
                                key={t.id}
                                className="bg-blue-800 rounded-2xl p-8 border border-blue-700"
                            >
                                <div className="mb-6 flex gap-1 text-blue-300">
                                     {[...Array(5)].map((_, i) => <Sparkles key={i} size={16} />)}
                                </div>
                                <p className="text-blue-50 text-base leading-relaxed mb-6">
                                    "{t.text}"
                                </p>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-blue-700 rounded-full flex items-center justify-center text-blue-200 font-bold">
                                        {t.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-white text-sm">{t.name}</p>
                                        <p className="text-blue-300 text-xs">{t.role}, {t.company}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Footer ── */}
            <footer className="bg-gray-900 text-gray-400 py-16 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                        {/* Brand */}
                        <div>
                            <h3 className="text-white font-bold text-2xl mb-4">LOSODHAN</h3>
                            <p className="text-sm mb-6 max-w-xs">
                                Connecting skilled textile professionals with top organizations across India securely and efficiently.
                            </p>
                            <div className="flex items-center gap-2 text-sm mb-2">
                                <MapPinned size={16} /> Pandesara, Surat, GJ
                            </div>
                        </div>

                        {/* Navigation */}
                        <div>
                            <h4 className="text-white font-semibold mb-4">Platform</h4>
                            <ul className="space-y-3 text-sm">
                                <li><Link to="/jobs" className="hover:text-white transition-colors">Browse Jobs</Link></li>
                                <li><Link to="/candidate/signup" className="hover:text-white transition-colors">Create Profile</Link></li>
                                <li><Link to="/recruiter/signup" className="hover:text-white transition-colors">Post Opportunities</Link></li>
                            </ul>
                        </div>
                        
                        <div>
                            <h4 className="text-white font-semibold mb-4">Company</h4>
                            <ul className="space-y-3 text-sm">
                                <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
                                <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                                <li><Link to="/careers" className="hover:text-white transition-colors">Careers</Link></li>
                            </ul>
                        </div>
                        
                        <div>
                            <h4 className="text-white font-semibold mb-4">Legal</h4>
                            <ul className="space-y-3 text-sm">
                                <li><Link to="/policies" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                                <li><Link to="/policies" className="hover:text-white transition-colors">Terms of Service</Link></li>
                            </ul>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
                        <p>© {new Date().getFullYear()} LOSODHAN. All rights reserved.</p>
                        <div className="flex gap-4">
                            <span className="flex items-center gap-1"><ShieldCheck size={16} /> Secure</span>
                            <span className="flex items-center gap-1"><CheckCircle2 size={16} /> Verified</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}

export default HomePage
