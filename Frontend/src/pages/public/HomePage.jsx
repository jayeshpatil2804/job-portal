import { Link } from 'react-router-dom'
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
} from 'lucide-react'
import Navbar from '../../components/Navbar'

// ─── Data ────────────────────────────────────────────────────────────────────

const categories = [
    { icon: <Scissors size={36} className="text-[#1a3c8f]" />, label: 'Textile Designer', jobs: 245 },
    { icon: <Settings2 size={36} className="text-[#1a3c8f]" />, label: 'Machine Operator', jobs: 389 },
    { icon: <ShoppingBag size={36} className="text-[#1a3c8f]" />, label: 'Merchandiser', jobs: 156 },
    { icon: <TrendingUp size={36} className="text-[#1a3c8f]" />, label: 'Production Manager', jobs: 98 },
    { icon: <Shirt size={36} className="text-[#1a3c8f]" />, label: 'Sales Executive', jobs: 234 },
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
        icon: <UserPlus size={24} className="text-white" />,
        title: 'Create Account',
        desc: 'Sign up for free and build your professional profile',
    },
    {
        step: '02',
        icon: <Briefcase size={24} className="text-white" />,
        title: 'Apply Jobs',
        desc: 'Browse and apply to thousands of textile industry jobs',
    },
    {
        step: '03',
        icon: <CheckCircle size={24} className="text-white" />,
        title: 'Get Hired',
        desc: 'Connect with top recruiters and land your dream job',
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
        text: 'LOSODHAN helped me find my dream job in just 2 weeks. The platform is very user-friendly and has genuine job listings.',
    },
    {
        id: 2,
        name: 'Rajesh Kumar',
        role: 'Production Manager',
        company: 'Welspun India',
        text: 'As a recruiter, LOSODHAN has been instrumental in helping us find the right talent quickly and efficiently.',
    },
    {
        id: 3,
        name: 'Anita Desai',
        role: 'Merchandiser',
        company: 'Raymond Limited',
        text: 'The best job portal for textile professionals. I got multiple interview calls within days of posting my profile.',
    },
]

// ─── Component ────────────────────────────────────────────────────────────────

const HomePage = () => {
    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            {/* ── Hero Section ── */}
            <section className="bg-[#1a3c8f] py-16 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-3 leading-tight">
                        Find Textile Jobs Faster
                    </h1>
                    <p className="text-blue-200 text-base md:text-lg mb-10">
                        India's Leading Job Portal for Textile Industry Professionals
                    </p>

                    {/* Search Bar */}
                    <div className="bg-white rounded-lg flex flex-col md:flex-row items-center shadow-lg overflow-hidden max-w-2xl mx-auto">
                        <div className="flex items-center gap-2 px-4 py-3 flex-1 w-full border-b md:border-b-0 md:border-r border-gray-200">
                            <Search size={18} className="text-gray-400 shrink-0" />
                            <input
                                type="text"
                                placeholder="Job Title or Keywords"
                                className="flex-1 outline-none text-sm text-gray-700 placeholder-gray-400"
                            />
                        </div>
                        <div className="flex items-center gap-2 px-4 py-3 flex-1 w-full border-b md:border-b-0 md:border-r border-gray-200">
                            <MapPin size={18} className="text-gray-400 shrink-0" />
                            <input
                                type="text"
                                placeholder="Location"
                                className="flex-1 outline-none text-sm text-gray-700 placeholder-gray-400"
                            />
                        </div>
                        <button className="bg-[#1a3c8f] text-white font-semibold text-sm px-7 py-3.5 hover:bg-[#162f72] transition-colors w-full md:w-auto">
                            Search Jobs
                        </button>
                    </div>
                </div>
            </section>

            {/* ── Browse by Category ── */}
            <section className="bg-gray-50 py-16 px-4">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-2">
                        Browse by Category
                    </h2>
                    <p className="text-center text-gray-500 text-sm mb-10">
                        Explore jobs by textile industry categories
                    </p>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                        {categories.map((cat) => (
                            <div
                                key={cat.label}
                                className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 flex flex-col items-center text-center hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer"
                            >
                                <div className="mb-4">{cat.icon}</div>
                                <h3 className="font-bold text-gray-800 text-sm mb-1">{cat.label}</h3>
                                <p className="text-gray-500 text-xs">{cat.jobs} Jobs</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Featured Jobs ── */}
            <section className="bg-white py-16 px-4">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-2">
                        Featured Jobs
                    </h2>
                    <p className="text-center text-gray-500 text-sm mb-10">
                        Top opportunities from leading textile companies
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {featuredJobs.map((job) => (
                            <div
                                key={job.id}
                                className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 hover:shadow-md hover:-translate-y-1 transition-all flex flex-col gap-3"
                            >
                                <span className="inline-block bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full w-fit">
                                    {job.type}
                                </span>
                                <div>
                                    <h3 className="font-extrabold text-gray-900 text-base">{job.title}</h3>
                                    <p className="text-gray-500 text-sm">{job.company}</p>
                                </div>
                                <div className="flex items-center gap-1 text-gray-500 text-sm">
                                    <MapPin size={14} className="text-gray-400" />
                                    <span>{job.location}</span>
                                </div>
                                <p className="text-amber-500 font-bold text-sm">{job.salary}</p>
                                <Link
                                    to={`/jobs/${job.id}`}
                                    className="mt-2 block text-center border border-[#1a3c8f] text-[#1a3c8f] text-sm font-semibold py-2 rounded-md hover:bg-[#1a3c8f] hover:text-white transition-colors"
                                >
                                    View Details
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── How It Works ── */}
            <section className="bg-gray-50 py-16 px-4">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-2">
                        How It Works
                    </h2>
                    <p className="text-center text-gray-500 text-sm mb-12">
                        Get hired in 3 easy steps
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                        {howItWorks.map((item) => (
                            <div key={item.step} className="flex flex-col items-center gap-4">
                                <div className="w-20 h-20 rounded-full bg-[#1a3c8f] flex items-center justify-center shadow-lg">
                                    <span className="text-white font-extrabold text-xl">{item.step}</span>
                                </div>
                                <h3 className="font-extrabold text-gray-900 text-base">{item.title}</h3>
                                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Top Recruiter Companies ── */}
            <section className="bg-white py-16 px-4">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-2">
                        Top Recruiter Companies
                    </h2>
                    <p className="text-center text-gray-500 text-sm mb-10">
                        Trusted by India's leading textile companies
                    </p>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {companies.map((company) => (
                            <div
                                key={company}
                                className="bg-white border border-gray-100 shadow-sm rounded-xl py-6 px-4 text-center font-semibold text-gray-800 text-sm hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer"
                            >
                                {company}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Testimonials ── */}
            <section className="bg-gray-50 py-16 px-4">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-2">
                        What Our Users Say
                    </h2>
                    <p className="text-center text-gray-500 text-sm mb-10">
                        Success stories from our community
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {testimonials.map((t) => (
                            <div
                                key={t.id}
                                className="bg-white border border-gray-100 shadow-sm rounded-xl p-6 flex flex-col gap-4 hover:shadow-md transition-all"
                            >
                                {/* Checkmark Icon */}
                                <CheckCircle2 size={32} className="text-amber-500" />

                                <p className="text-gray-600 text-sm leading-relaxed flex-1">
                                    "{t.text}"
                                </p>
                                <div>
                                    <p className="font-bold text-gray-900 text-sm">{t.name}</p>
                                    <p className="text-gray-500 text-xs">{t.role}</p>
                                    <p className="text-amber-500 text-xs font-medium">{t.company}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Footer ── */}
            <footer className="bg-[#111827] text-gray-400 pt-12 pb-6 px-4">
                <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-10">
                    {/* Brand */}
                    <div>
                        <h3 className="text-white font-extrabold text-xl mb-3">LOSODHAN</h3>
                        <p className="text-sm leading-relaxed">
                            India's Leading Textile Industry Job Portal
                        </p>
                    </div>

                    {/* About */}
                    <div>
                        <h4 className="text-white font-semibold text-sm mb-4">About</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
                            <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                            <li><Link to="/careers" className="hover:text-white transition-colors">Careers</Link></li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h4 className="text-white font-semibold text-sm mb-4">Legal</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                            <li><Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
                            <li><Link to="/cookies" className="hover:text-white transition-colors">Cookie Policy</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-white font-semibold text-sm mb-4">Contact</h4>
                        <ul className="space-y-2 text-sm">
                            <li className="flex items-center gap-2">
                                <Mail size={14} className="shrink-0" />
                                <span>Email: info@losodhan.com</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Phone size={14} className="shrink-0" />
                                <span>Phone: +91 1234567890</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <MapPinned size={14} className="shrink-0" />
                                <span>Address: Mumbai, India</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-800 pt-6">
                    <p className="text-center text-xs text-gray-500">
                        © {new Date().getFullYear()} LOSODHAN. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    )
}

export default HomePage
