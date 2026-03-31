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
import { motion, AnimatePresence } from 'framer-motion'
import { useMountTimer } from '../../hooks/useMountTimer'
import { getAllOpenJobs } from '../../redux/actions/jobActions'

// ─── Data ────────────────────────────────────────────────────────────────────

const categories = [
    { icon: <Scissors size={32} />, label: 'Textile Designer', jobs: 245, color: 'bg-blue-50 text-blue-600' },
    { icon: <Settings2 size={32} />, label: 'Machine Operator', jobs: 389, color: 'bg-purple-50 text-purple-600' },
    { icon: <ShoppingBag size={32} />, label: 'Merchandiser', jobs: 156, color: 'bg-orange-50 text-orange-600' },
    { icon: <TrendingUp size={32} />, label: 'Production Manager', jobs: 98, color: 'bg-green-50 text-green-600' },
    { icon: <Shirt size={32} />, label: 'Sales Executive', jobs: 234, color: 'bg-red-50 text-red-600' },
]

const featuredJobs = [
    {
        id: 1,
        type: 'Full Time',
        title: 'Senior Textile Designer',
        company: 'Arvind Mills',
        location: 'Mumbai, Maharashtra',
        salary: '₹6-8 LPA',
    },
    {
        id: 2,
        type: 'Full Time',
        title: 'Production Manager',
        company: 'Welspun India',
        location: 'Ahmedabad, Gujarat',
        salary: '₹8-12 LPA',
    },
    {
        id: 3,
        type: 'Full Time',
        title: 'Merchandiser',
        company: 'Raymond Limited',
        location: 'Bangalore, Karnataka',
        salary: '₹5-7 LPA',
    },
]

const howItWorks = [
    {
        step: '01',
        icon: <UserPlus size={24} />,
        title: 'Create Account',
        desc: 'Build your elite professional profile in minutes.',
        color: 'from-blue-600 to-[#1a3c8f]'
    },
    {
        step: '02',
        icon: <Briefcase size={24} />,
        title: 'Apply Jobs',
        desc: 'Access verified premium roles across India.',
        color: 'from-purple-600 to-indigo-600'
    },
    {
        step: '03',
        icon: <CheckCircle size={24} />,
        title: 'Get Hired',
        desc: 'Connect with top-tier textile recruiters directly.',
        color: 'from-green-600 to-teal-600'
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
        text: 'LOSODHAN revolutionized my career search. I landed a premium role at Arvind Mills within weeks of signing up.',
    },
    {
        id: 2,
        name: 'Rajesh Kumar',
        role: 'Production Manager',
        company: 'Welspun India',
        text: 'The quality of talent on this platform is unmatched. As a recruiter, it\'s our primary source for textile professionals.',
    },
    {
        id: 3,
        name: 'Anita Desai',
        role: 'Merchandiser',
        company: 'Raymond Limited',
        text: 'Elite UX and genuine opportunities. Finally, a platform that understands the specific needs of the textile industry.',
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

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    }

    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            {/* ── Hero Section with Swiper Background ── */}
            <section className="relative py-24 md:py-32 px-4 overflow-hidden min-h-[600px] flex items-center">
                {/* Swiper Background Slider */}
                <div className="absolute inset-0 z-0">
                    <Swiper
                        modules={[Autoplay, EffectFade]}
                        effect="fade"
                        speed={2000}
                        autoplay={{
                            delay: 5000,
                            disableOnInteraction: false,
                        }}
                        loop={true}
                        className="h-full w-full"
                    >
                        <SwiperSlide>
                            <div 
                                className="w-full h-full bg-cover bg-center bg-no-repeat"
                                style={{ backgroundImage: `url(${jobsImg})` }}
                            />
                        </SwiperSlide>
                        <SwiperSlide>
                            <div 
                                className="w-full h-full bg-cover bg-center bg-no-repeat"
                                style={{ backgroundImage: `url(${banner2})` }}
                            />
                        </SwiperSlide>
                    </Swiper>
                    {/* Unified Contrast Overlay */}
                    <div className="absolute inset-0 bg-black/40 z-10" />
                </div>
                
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full -mr-64 -mt-64 blur-3xl animate-pulse" />
                <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-400/10 rounded-full -ml-32 -mb-32 blur-3xl" />
                
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-6xl mx-auto text-center relative z-20"
                >
                    <div className="inline-flex items-center gap-2 px-6 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white text-[10px] font-black uppercase tracking-[0.2em] mb-10">
                        <Sparkles size={14} className="text-blue-300" />
                        India's #1 Textile Job Network
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-[1.1] tracking-tighter">
                        Find Your Next <br/> <span className="text-blue-300">Elite Career Path.</span>
                    </h1>
                    <p className="text-blue-100/70 text-lg md:text-xl mb-14 max-w-2xl mx-auto font-medium leading-relaxed">
                        Connecting verified textile professionals with premium opportunities across India's leading textile organizations.
                    </p>

                    {/* Premium Search Bar */}
                    <div className="bg-white p-3 rounded-[2.5rem] shadow-2xl shadow-black/20 flex flex-col md:flex-row items-center max-w-4xl mx-auto border border-white/10">
                        <div className="flex items-center gap-4 px-8 py-4 flex-1 w-full md:border-r border-gray-100">
                            <Search size={20} className="text-[#1a3c8f] shrink-0" />
                            <input
                                type="text"
                                placeholder="Job Title or Keywords"
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                                className="flex-1 outline-none text-sm font-bold text-gray-900 placeholder-gray-400 bg-transparent"
                            />
                        </div>
                        <div className="flex items-center gap-4 px-8 py-4 flex-1 w-full">
                            <MapPin size={20} className="text-[#1a3c8f] shrink-0" />
                            <input
                                type="text"
                                placeholder="Preferred Location"
                                value={loc}
                                onChange={(e) => setLoc(e.target.value)}
                                className="flex-1 outline-none text-sm font-bold text-gray-900 placeholder-gray-400 bg-transparent"
                            />
                        </div>
                        <button 
                            onClick={handleSearch}
                            className="bg-gray-900 text-white font-black uppercase tracking-[0.2em] text-[10px] px-12 py-5 rounded-[1.8rem] hover:bg-black transition-all w-full md:w-auto shadow-xl active:scale-95"
                        >
                            Search Roles
                        </button>
                    </div>

                    <div className="mt-16 flex flex-wrap items-center justify-center gap-10 opacity-40">
                        <div className="flex items-center gap-2 text-white font-black text-[10px] uppercase tracking-widest">
                            <ShieldCheck size={16} /> Verified Roles
                        </div>
                        <div className="flex items-center gap-2 text-white font-black text-[10px] uppercase tracking-widest">
                            <Zap size={16} /> Instant Apply
                        </div>
                        <div className="flex items-center gap-2 text-white font-black text-[10px] uppercase tracking-widest">
                            <Building2 size={16} /> Top Recruiters
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* ── Browse by Category ── */}
            <section className="bg-white py-24 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                        <div className="space-y-4">
                            <h2 className="text-4xl font-black text-gray-900 tracking-tight">
                                Explore Specialties
                            </h2>
                            <p className="text-gray-400 font-bold max-w-lg">
                                Dive into specific textile industry sectors to find roles tailored to your unique skill set.
                            </p>
                        </div>
                        <button className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-[#1a3c8f] group hover:translate-x-2 transition-transform">
                            View All Categories <ArrowRight size={16} />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                        {categories.map((cat, i) => (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                key={cat.label}
                                className="bg-white rounded-[2.5rem] border border-gray-50 shadow-xl shadow-blue-900/5 p-8 flex flex-col items-center text-center hover:border-blue-100 hover:-translate-y-2 transition-all cursor-pointer group"
                            >
                                <div className={`w-20 h-20 rounded-[2rem] ${cat.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
                                    {cat.icon}
                                </div>
                                <h3 className="font-black text-gray-900 text-sm mb-2">{cat.label}</h3>
                                <div className="px-3 py-1 bg-gray-50 rounded-full text-[9px] font-black text-gray-400 uppercase tracking-widest">
                                    {cat.jobs} Openings
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Featured Jobs ── */}
            <section className="bg-gray-50 py-24 px-4 overflow-hidden relative">
                <div className="absolute top-0 left-0 w-96 h-96 bg-blue-50 rounded-full -ml-48 -mt-48 blur-3xl" />
                
                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="text-center space-y-4 mb-20">
                        <h2 className="text-4xl font-black text-gray-900 tracking-tight">
                            Premium Opportunities
                        </h2>
                        <p className="text-gray-400 font-bold max-w-lg mx-auto">
                            High-impact roles from the country's most prestigious textile conglomerates.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {displayJobs.map((job, i) => (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.1 }}
                                key={job.id}
                                className="bg-white rounded-[3rem] p-8 shadow-xl shadow-blue-900/5 hover:shadow-2xl hover:shadow-blue-900/10 transition-all flex flex-col gap-6 relative group border border-gray-50"
                            >
                                <div className="flex justify-between items-start">
                                    <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-[#1a3c8f] font-black text-2xl border border-blue-100 uppercase">
                                        {job.recruiter?.companyName?.charAt(0) || job.title.charAt(0)}
                                    </div>
                                    <span className="bg-orange-50 text-orange-600 text-[9px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full border border-orange-100">
                                        {job.jobType?.replace('_', ' ') || 'Part Time'}
                                    </span>
                                </div>
                                
                                <div className="space-y-2">
                                    <h3 className="font-black text-gray-900 text-xl tracking-tight leading-none group-hover:text-[#1a3c8f] transition-colors line-clamp-1">{job.title}</h3>
                                    <p className="text-gray-400 font-bold text-sm line-clamp-1">{job.recruiter?.companyName || 'Elite Textiles'}</p>
                                </div>
                                
                                <div className="flex items-center justify-between pt-6 border-t border-gray-50 mt-auto">
                                    <div className="flex items-center gap-2 text-gray-400 text-[10px] font-black uppercase tracking-widest">
                                        <MapPin size={12} className="text-blue-600" />
                                        {job.location.split(',')[0]}
                                    </div>
                                    <p className="text-[#1a3c8f] font-black text-xs">₹{job.salaryMin}-{job.salaryMax} LPA</p>
                                </div>

                                <Link
                                    to={`/job/${job.id}`}
                                    className="w-full bg-gray-50 text-gray-900 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-center hover:bg-[#1a3c8f] hover:text-white transition-all shadow-sm"
                                >
                                    View Position
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                    
                    <div className="mt-16 text-center">
                        <button 
                            onClick={handleBrowseJobs}
                            className="inline-flex items-center gap-3 px-10 py-5 bg-[#1a3c8f] text-white rounded-[2rem] font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl shadow-blue-900/30 hover:bg-blue-800 transition-all active:scale-95"
                        >
                            Browse All Jobs <ArrowRight size={18} />
                        </button>
                    </div>
                </div>
            </section>

            {/* ── How It Works ── */}
            <section className="bg-white py-24 px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center space-y-4 mb-24">
                        <h2 className="text-4xl font-black text-gray-900 tracking-tight">
                            Elite Candidate Roadmap
                        </h2>
                        <p className="text-gray-400 font-bold max-w-xl mx-auto italic leading-relaxed">
                            Our streamlined process is engineered for the modern professional.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-16 text-center relative">
                        <div className="hidden md:block absolute top-[60px] left-[20%] right-[20%] h-[2px] bg-gray-100 -z-0" />
                        
                        {howItWorks.map((item, i) => (
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.2 }}
                                key={item.step} 
                                className="flex flex-col items-center gap-8 relative z-10 group"
                            >
                                <div className={`w-28 h-28 rounded-[2.5rem] bg-gradient-to-br ${item.color} flex items-center justify-center shadow-2xl shadow-blue-900/20 group-hover:scale-110 transition-transform duration-500 border-8 border-white`}>
                                    <div className="text-white">
                                        {item.icon}
                                    </div>
                                    <div className="absolute -top-4 -right-4 w-10 h-10 bg-white shadow-xl rounded-2xl flex items-center justify-center font-black text-sm text-gray-900 border border-gray-100">
                                        {item.step}
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <h3 className="font-black text-gray-900 text-xl tracking-tight leading-none">{item.title}</h3>
                                    <p className="text-gray-400 font-bold text-sm leading-relaxed max-w-[200px]">{item.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Top Recruiter Companies ── */}
            <section className="bg-gray-50 py-24 px-4 overflow-hidden relative">
                 <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-100/50 rounded-full -mr-40 -mb-40 blur-3xl" />
                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="text-center space-y-4 mb-16">
                        <h2 className="text-4xl font-black text-gray-900 tracking-tight">
                            Industry Titans
                        </h2>
                        <p className="text-gray-400 font-bold text-sm uppercase tracking-widest">Trusted by the biggest names in textiles</p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {companies.map((company, i) => (
                            <motion.div
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                transition={{ delay: i * 0.05 }}
                                key={company}
                                className="bg-white/50 backdrop-blur-sm border border-white rounded-[2rem] py-10 px-6 text-center font-black text-gray-900 text-xs uppercase tracking-widest hover:bg-white hover:shadow-xl hover:shadow-blue-900/5 transition-all cursor-pointer hover:-translate-y-1"
                            >
                                {company}
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Testimonials ── */}
            <section className="bg-[#1a3c8f] py-24 px-4 overflow-hidden relative">
                 <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl" />
                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="text-center space-y-4 mb-20">
                         <div className="inline-flex items-center gap-2 px-4 py-1 bg-white/10 text-blue-200 rounded-full text-[9px] font-black uppercase tracking-widest border border-white/10">
                            Community Stories
                        </div>
                        <h2 className="text-4xl font-black text-white tracking-tight">
                            Voice of Excellence
                        </h2>
                        <p className="text-blue-100/60 font-medium">Hear from professionals who've found their place in the industry.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {testimonials.map((t, i) => (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                key={t.id}
                                className="bg-white/10 backdrop-blur-md border border-white/10 rounded-[3rem] p-10 flex flex-col gap-8 group hover:bg-white/20 transition-all hover:-translate-y-2"
                            >
                                <div className="w-12 h-12 bg-blue-400/20 rounded-2xl flex items-center justify-center text-blue-300">
                                    <Sparkles size={24} />
                                </div>

                                <p className="text-blue-50 text-lg leading-relaxed font-bold italic">
                                    "{t.text}"
                                </p>
                                <div className="pt-8 border-t border-white/10 mt-auto">
                                    <p className="font-black text-white text-base tracking-tight">{t.name}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                         <p className="text-blue-300 font-black text-[10px] uppercase tracking-widest">{t.role}</p>
                                         <div className="w-1 h-1 bg-white/20 rounded-full" />
                                         <p className="text-blue-100/50 text-[10px] font-bold uppercase tracking-widest">{t.company}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Footer ── */}
            <footer className="bg-gray-950 text-gray-500 pt-24 pb-12 px-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-900/20 rounded-full -mr-32 -mt-32 blur-3xl opacity-30" />
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-16 mb-20">
                        {/* Brand */}
                        <div className="space-y-6">
                            <h3 className="text-white font-black text-3xl tracking-tighter italic">LOSODHAN.</h3>
                            <p className="text-sm font-medium leading-relaxed max-w-[250px]">
                                Bridging the gap between extraordinary textile talent and elite industry leaders across India.
                            </p>
                            <div className="flex items-start gap-3 text-xs font-medium leading-relaxed max-w-[220px]">
                                <MapPinned size={15} className="text-blue-400 shrink-0 mt-0.5" />
                                <span>Pandesara, Surat, GJ — 394221</span>
                            </div>
                            <div className="flex gap-4">
                               <div className="w-10 h-10 bg-white/5 rounded-xl border border-white/5 flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer">
                                  <Mail size={16} className="text-blue-400" />
                               </div>
                               <div className="w-10 h-10 bg-white/5 rounded-xl border border-white/5 flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer">
                                  <Phone size={16} className="text-blue-400" />
                               </div>
                            </div>
                        </div>

                        {/* Navigation */}
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:col-span-3 gap-12">
                             <div className="space-y-6">
                                <h4 className="text-white font-black text-[10px] uppercase tracking-[0.2em]">Platform</h4>
                                <ul className="space-y-4 text-xs font-bold uppercase tracking-widest">
                                    <li><Link to="/jobs" className="hover:text-blue-400 transition-colors">Elite Jobs</Link></li>
                                    <li><Link to="/candidate/signup" className="hover:text-blue-400 transition-colors">Candidate Pool</Link></li>
                                    <li><Link to="/recruiter/signup" className="hover:text-blue-400 transition-colors">Post Roles</Link></li>
                                </ul>
                            </div>
                            <div className="space-y-6">
                                <h4 className="text-white font-black text-[10px] uppercase tracking-[0.2em]">Company</h4>
                                <ul className="space-y-4 text-xs font-bold uppercase tracking-widest">
                                    <li><Link to="/about" className="hover:text-blue-400 transition-colors">Our Vision</Link></li>
                                    <li><Link to="/contact" className="hover:text-blue-400 transition-colors">Assistance</Link></li>
                                    <li><Link to="/careers" className="hover:text-blue-400 transition-colors">Careers</Link></li>
                                </ul>
                            </div>
                            <div className="space-y-6">
                                <h4 className="text-white font-black text-[10px] uppercase tracking-[0.2em]">Legal</h4>
                                <ul className="space-y-4 text-xs font-bold uppercase tracking-widest">
                                    <li><Link to="/policies" className="hover:text-blue-400 transition-colors">Privacy Policy</Link></li>
                                    <li><Link to="/policies" className="hover:text-blue-400 transition-colors">Terms & Conditions</Link></li>
                                    <li><Link to="/policies" className="hover:text-blue-400 transition-colors">Refund Policy</Link></li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                        <p className="text-center text-[10px] font-black uppercase tracking-widest text-gray-700">
                            © {new Date().getFullYear()} LOSODHAN. Engineered by Elite Teams.
                        </p>
                        <div className="flex items-center gap-8 opacity-20 filter grayscale">
                             {/* Placeholder icons for payments/security */}
                             <ShieldCheck size={20} className="text-white" />
                             <CheckCircle2 size={20} className="text-white" />
                             <Award size={20} className="text-white" />
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}

export default HomePage
