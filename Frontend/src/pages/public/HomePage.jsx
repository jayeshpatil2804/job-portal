import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState, useRef } from 'react'
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
import { motion, AnimatePresence } from 'framer-motion'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, EffectFade, Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/effect-fade'
import 'swiper/css/navigation'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import logo from '../../assets/logo.png'
import { getAllOpenJobs } from '../../redux/actions/jobActions'
import { useMountTimer } from '../../hooks/useMountTimer'
import jobsImg from '../../assets/banner.jpeg'
import banner2 from '../../assets/banner 2.jpeg'
import banner3 from '../../assets/banner3.jpeg'
import banner4 from '../../assets/banner4.jpeg'

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
        <div className="min-h-screen bg-[#f8fafc] flex flex-col font-sans selection:bg-primary-100 selection:text-primary-900">
            <Navbar />

            {/* ── Hero Section ── */}
            <section className="relative min-h-[90vh] flex items-center justify-center pt-20 pb-20 px-4 overflow-hidden">
                {/* Background Layer */}
                <div className="absolute inset-0 z-0">
                    <Swiper
                        modules={[Autoplay, EffectFade]}
                        effect="fade"
                        speed={2000}
                        autoplay={{ delay: 7000, disableOnInteraction: false }}
                        loop={true}
                        className="h-full w-full"
                    >
                        <SwiperSlide>
                            <div className="w-full h-full bg-cover bg-center scale-110 animate-pulse-slow" style={{ backgroundImage: `url(${jobsImg})` }} />
                        </SwiperSlide>
                        <SwiperSlide>
                            <div className="w-full h-full bg-cover bg-center scale-110" style={{ backgroundImage: `url(${banner2})` }} />
                        </SwiperSlide>
                        <SwiperSlide>
                            <div className="w-full h-full bg-cover bg-center scale-110 animate-pulse-slow" style={{ backgroundImage: `url(${banner3})` }} />
                        </SwiperSlide>
                        <SwiperSlide>
                            <div className="w-full h-full bg-cover bg-center scale-110" style={{ backgroundImage: `url(${banner4})` }} />
                        </SwiperSlide>
                    </Swiper>
                    {/* Sophisticated Gradients */}
                    <div className="absolute inset-0 bg-slate-950/60 z-10" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/30 z-10" />
                    <div className="absolute inset-0 hero-mesh opacity-40 z-10" />
                </div>

                <div className="max-w-7xl mx-auto text-center relative z-20 w-full">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <div className="inline-flex items-center gap-2 px-5 py-2 glass-effect-dark text-blue-100 rounded-full text-[10px] md:text-xs font-bold mb-10 tracking-[0.2em] uppercase border border-white/10 shadow-2xl">
                            <Sparkles size={14} className="text-blue-400 animate-pulse" />
                            India's #1 Textile Career Hub
                        </div>

                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-8 leading-[1.1] tracking-tight">
                            Elevate Your <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-blue-200">
                                Professional Journey
                            </span>
                        </h1>

                        <p className="text-slate-300 text-lg md:text-xl mb-14 max-w-3xl mx-auto leading-relaxed font-medium">
                            Join the elite network connecting verified textile professionals with India's most prestigious manufacturing and design houses.
                        </p>

                        {/* Search Bar - Modern Floating Glass */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                            className="glass-effect p-2 md:p-3 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex flex-col md:flex-row items-center max-w-5xl mx-auto border border-white/40 mb-16"
                        >
                            <div className="flex items-center gap-4 px-6 py-4 flex-1 w-full md:border-r border-gray-200/50">
                                <div className="p-2 bg-blue-50 rounded-xl text-primary-900">
                                    <Search size={22} strokeWidth={2.5} />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Position, Skill or Industry"
                                    value={keyword}
                                    onChange={(e) => setKeyword(e.target.value)}
                                    className="flex-1 outline-none text-lg font-semibold text-slate-900 placeholder-slate-400 bg-transparent"
                                />
                            </div>
                            <div className="flex items-center gap-4 px-6 py-4 flex-1 w-full">
                                <div className="p-2 bg-indigo-50 rounded-xl text-indigo-600">
                                    <MapPin size={22} strokeWidth={2.5} />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Work Location"
                                    value={loc}
                                    onChange={(e) => setLoc(e.target.value)}
                                    className="flex-1 outline-none text-lg font-semibold text-slate-900 placeholder-slate-400 bg-transparent"
                                />
                            </div>
                            <button
                                onClick={handleSearch}
                                className="bg-primary-900 text-white font-black text-sm px-10 py-5 rounded-[1.5rem] hover:bg-navy-600 transition-all w-full md:w-auto mt-4 md:mt-0 shadow-xl shadow-primary-900/30 active:scale-95 uppercase tracking-widest"
                            >
                                Find Opportunities
                            </button>
                        </motion.div>

                        <div className="flex flex-wrap items-center justify-center gap-10 text-slate-400 text-sm font-bold tracking-wide">
                            <div className="flex items-center gap-3 group cursor-default">
                                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-blue-400 transition-colors">
                                    <ShieldCheck size={20} className="text-blue-400" />
                                </div>
                                <span className="group-hover:text-blue-100 transition-colors">Verified Listings</span>
                            </div>
                            <div className="flex items-center gap-3 group cursor-default">
                                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-indigo-400 transition-colors">
                                    <Zap size={20} className="text-indigo-400" />
                                </div>
                                <span className="group-hover:text-indigo-100 transition-colors">Direct Response</span>
                            </div>
                            <div className="flex items-center gap-3 group cursor-default">
                                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-emerald-400 transition-colors">
                                    <Building2 size={20} className="text-emerald-400" />
                                </div>
                                <span className="group-hover:text-emerald-100 transition-colors">Top Enterprises</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ── Browse by Category ── */}
            <section className="bg-white py-32 px-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-50/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
                        <div className="max-w-2xl">
                            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-5 leading-tight">
                                Explore <span className="text-primary-900">Industry</span> Specializations
                            </h2>
                            <p className="text-slate-500 text-lg font-medium leading-relaxed">
                                Discover high-impact roles tailored to your unique expertise in India's dynamic textile landscape.
                            </p>
                        </div>
                        <button className="group flex items-center gap-3 text-sm font-black text-primary-900 bg-blue-50 px-6 py-3 rounded-xl hover:bg-primary-900 hover:text-white transition-all uppercase tracking-widest active:scale-95">
                            All Categories <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
                        {categories.map((cat, i) => (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                viewport={{ once: true }}
                                key={cat.label}
                                className="group relative bg-white rounded-[2rem] border border-slate-100 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.05)] p-8 flex flex-col items-center text-center hover-lift cursor-pointer overflow-hidden"
                            >
                                {/* Decorative Gradient */}
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 to-blue-50/50 opacity-0 group-hover:opacity-100 transition-opacity" />

                                <div className={`relative z-10 w-20 h-20 rounded-3xl ${cat.color} flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                                    {cat.icon}
                                </div>
                                <h3 className="relative z-10 font-black text-slate-900 mb-2 text-lg tracking-tight group-hover:text-primary-900 transition-colors">{cat.label}</h3>
                                <div className="relative z-10 inline-flex items-center gap-1.5 px-3 py-1 bg-slate-50 rounded-full text-[10px] font-bold text-slate-400 uppercase tracking-wider group-hover:bg-primary-50 group-hover:text-primary-900 transition-all">
                                    {cat.jobs} Openings
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Featured Jobs ── */}
            <section className="bg-slate-50 py-32 px-4 relative overflow-hidden">
                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-5">
                            Latest <span className="text-primary-900">Opportunities</span>
                        </h2>
                        <p className="text-slate-500 text-lg font-medium max-w-2xl mx-auto">
                            Handpicked active roles from India's most trusted textile industry leaders.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {displayJobs.map((job, i) => (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                viewport={{ once: true }}
                                key={job.id}
                                className="group bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] hover-lift flex flex-col gap-6"
                            >
                                <div className="flex justify-between items-start">
                                    <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-primary-900 font-black text-2xl border border-slate-100 group-hover:bg-primary-900 group-hover:text-white transition-all duration-300">
                                        {job.recruiter?.companyName?.charAt(0) || job.title.charAt(0)}
                                    </div>
                                    <span className="bg-emerald-50 text-emerald-700 text-[10px] font-black px-4 py-1.5 rounded-full border border-emerald-100 uppercase tracking-widest">
                                        {job.jobType?.replace('_', ' ') || 'Full Time'}
                                    </span>
                                </div>

                                <div className="flex-1">
                                    <h3 className="font-black text-slate-900 text-xl mb-2 line-clamp-1 group-hover:text-primary-900 transition-colors uppercase tracking-tight">{job.title}</h3>
                                    <p className="text-slate-400 font-bold text-sm line-clamp-1">{job.recruiter?.companyName || 'Verified Corporate Partner'}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4 py-6 border-y border-slate-50 mt-autp">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Location</span>
                                        <div className="flex items-center gap-1.5 text-slate-900 font-bold text-xs uppercase">
                                            <MapPin size={14} className="text-primary-900" />
                                            {job.location.split(',')[0]}
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-1 text-right">
                                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Package</span>
                                        <p className="text-primary-900 font-black text-xs uppercase tracking-tight">₹{job.salaryMin}-{job.salaryMax} LPA</p>
                                    </div>
                                </div>

                                <Link
                                    to={`/job/${job.id}`}
                                    className="w-full bg-slate-950 text-white py-4 rounded-2xl text-xs font-black text-center hover:bg-primary-900 transition-all uppercase tracking-[0.2em] shadow-lg shadow-slate-950/20 active:scale-95"
                                >
                                    View Details
                                </Link>
                            </motion.div>
                        ))}
                    </div>

                    <div className="mt-20 text-center">
                        <button
                            onClick={handleBrowseJobs}
                            className="group inline-flex items-center gap-3 px-10 py-5 bg-white border-2 border-slate-100 text-slate-900 rounded-2xl font-black text-xs hover:border-primary-900 hover:text-primary-900 transition-all uppercase tracking-[0.2em] active:scale-95 shadow-xl shadow-slate-200/50"
                        >
                            Explore All Positions <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>
            </section>

            {/* ── How It Works ── */}
            <section className="bg-white py-32 px-4 relative overflow-hidden">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-24">
                        <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-5">
                            Seamless <span className="text-primary-900">Experience</span>
                        </h2>
                        <p className="text-slate-500 text-lg font-medium max-w-2xl mx-auto">
                            A streamlined three-step process designed for the modern textile professional.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-16 relative">
                        {/* Connecting Line for Desktop */}
                        <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 bg-slate-100 z-0" />

                        {howItWorks.map((item, i) => (
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.2 }}
                                viewport={{ once: true }}
                                key={item.step}
                                className="flex flex-col items-center text-center relative z-10 group"
                            >
                                <div className={`w-24 h-24 rounded-[2rem] ${item.color} flex items-center justify-center mb-8 shadow-2xl shadow-current/10 border-4 border-white transition-transform group-hover:scale-110 duration-500`}>
                                    {item.icon}
                                    <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-slate-900 text-white text-[10px] font-black flex items-center justify-center border-4 border-white">
                                        0{item.step}
                                    </div>
                                </div>
                                <h3 className="font-black text-slate-900 text-xl mb-3 tracking-tight uppercase">{item.title}</h3>
                                <p className="text-slate-500 text-sm font-medium leading-relaxed max-w-[240px]">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Top Recruiter Companies ── */}
            <section className="bg-slate-50 py-24 px-4 border-y border-slate-100">
                <div className="max-w-7xl mx-auto">
                    <p className="text-center text-slate-400 font-bold text-[10px] uppercase tracking-[0.3em] mb-12">
                        Strategic Industry Partners
                    </p>
                    <div className="flex flex-wrap justify-center gap-6 md:gap-12 opacity-60 grayscale hover:grayscale-0 transition-all duration-700">
                        {companies.map((company, i) => (
                            <div
                                key={company}
                                className="px-8 py-4 bg-white text-slate-900 font-black text-xs rounded-2xl border border-slate-200 hover:border-primary-900 hover:text-primary-900 transition-all cursor-default uppercase tracking-widest shadow-sm"
                            >
                                {company}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Testimonials ── */}
            <section className="bg-slate-950 py-32 px-4 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(26,60,143,0.1),transparent)] z-0" />
                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="text-center mb-24">
                        <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-5 leading-tight">
                            Success <span className="text-blue-400">Stories</span>
                        </h2>
                        <p className="text-slate-400 text-lg font-medium">
                            Empowering the next generation of textile leadership.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {testimonials.map((t, i) => (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                viewport={{ once: true }}
                                key={t.id}
                                className="glass-effect-dark rounded-[2.5rem] p-10 border border-white/5 hover:border-blue-500/30 transition-all duration-500 flex flex-col justify-between group"
                            >
                                <div>
                                    <div className="mb-8 flex gap-1 text-blue-400">
                                        {[...Array(5)].map((_, i) => <Sparkles key={i} size={14} className="animate-pulse" />)}
                                    </div>
                                    <p className="text-slate-200 text-lg leading-relaxed mb-10 font-medium italic">
                                        "{t.text}"
                                    </p>
                                </div>
                                <div className="flex items-center gap-4 border-t border-white/5 pt-8">
                                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
                                        {t.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-black text-white text-sm uppercase tracking-wider">{t.name}</p>
                                        <p className="text-blue-400 text-[10px] font-black uppercase tracking-[0.2em]">{t.role} @ {t.company}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    )
}

export default HomePage
