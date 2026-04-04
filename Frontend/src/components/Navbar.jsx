import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Menu, X, User, Home, Briefcase, UserCircle, Info, PhoneCall } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import logo from '../assets/logo.png'

const Navbar = () => {
    const [mobileOpen, setMobileOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const location = useLocation()
    const { user } = useSelector(state => state.auth)

    useState(() => {
        const handleScroll = () => {
            if (window.scrollY > 20) {
                setScrolled(true)
            } else {
                setScrolled(false)
            }
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const navLinks = [
        { label: 'Home', path: '/', icon: <Home size={18} /> },
        { label: 'About', path: '/about', icon: <Info size={18} /> },
        { label: 'Jobs', path: user ? '/jobs' : '/candidate/login', icon: <Briefcase size={18} /> },
        { label: 'Contact', path: '/contact', icon: <PhoneCall size={18} /> },
        { label: 'Recruiter', path: user?.role === 'RECRUITER' ? '/recruiter/dashboard' : '/recruiter/login', icon: <UserCircle size={18} /> },
    ]

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
            scrolled 
            ? 'glass-effect border-b border-gray-200/50 shadow-lg py-2' 
            : 'bg-transparent py-4'
        }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center -ml-2">
                        <img src={logo} alt="LOSODHAN" className="h-12 w-auto object-contain hover:scale-105 transition-transform" />
                    </Link>

                    {/* Desktop Nav Links */}
                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`text-sm font-semibold transition-all hover:scale-105 ${
                                    location.pathname === link.path
                                    ? (scrolled ? 'text-primary-900' : 'text-blue-400')
                                    : (scrolled ? 'text-gray-600 hover:text-primary-900' : 'text-gray-200 hover:text-white')
                                    }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Desktop Actions */}
                    <div className="hidden md:flex items-center gap-4">
                        {!user ? (
                            <>
                                <Link
                                    to="/login"
                                    className={`text-sm font-semibold transition-colors ${scrolled ? 'text-gray-700 hover:text-primary-900' : 'text-gray-200 hover:text-white'}`}
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/signup"
                                    className="bg-primary-900 text-white text-sm font-bold px-6 py-2.5 rounded-xl hover:bg-navy-600 transition-all shadow-lg shadow-primary-900/20 active:scale-95"
                                >
                                    Get Started
                                </Link>
                                <Link
                                    to="/auth/admin/secure/login"
                                    className={`flex items-center gap-1.5 text-sm font-semibold transition-all px-3 py-2 rounded-xl ${
                                        scrolled 
                                        ? 'text-gray-700 hover:bg-gray-100' 
                                        : 'text-gray-200 hover:bg-white/10'
                                    }`}
                                >
                                    <User size={18} className={scrolled ? 'text-primary-900' : 'text-blue-400'} />
                                    Admin
                                </Link>
                                <Link
                                    to="/login"
                                    className="text-sm font-bold text-[#1a3c8f] hover:text-blue-700 transition-colors border border-blue-100 bg-blue-50 px-4 py-2 rounded-md flex items-center gap-2"
                                >
                                    Support
                                </Link>
                            </>
                        ) : (
                            <div className="flex items-center gap-4">
                                <Link
                                    to={user.role === 'RECRUITER' ? "/recruiter/dashboard" : "/dashboard"}
                                    className="bg-[#1a3c8f] text-white text-sm font-semibold px-5 py-2 rounded-md hover:bg-[#162f72] transition-colors"
                                >
                                    Dashboard
                                </Link>
                                <a
                                    href={`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000/api'}/auth/support/whatsapp`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm font-bold text-[#1a3c8f] hover:text-blue-700 transition-colors border border-blue-100 bg-blue-50 px-4 py-2 rounded-md"
                                >
                                    Support
                                </a>
                            </div>
                        )}
                    </div>

                    {/* Mobile Hamburger */}
                    <button
                        className="md:hidden text-gray-600"
                        onClick={() => setMobileOpen(!mobileOpen)}
                    >
                        {mobileOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white border-t border-gray-100 overflow-hidden shadow-xl"
                    >
                        <div className="px-4 py-8 space-y-6">
                            <div className="space-y-2">
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4 px-4">Menu</p>
                                {navLinks.map((link) => {
                                    const isActive = location.pathname === link.path;
                                    return (
                                        <Link
                                            key={link.path}
                                            to={link.path}
                                            onClick={() => setMobileOpen(false)}
                                            className={`flex items-center gap-4 px-4 py-3 rounded-2xl transition-all ${
                                                isActive 
                                                ? 'bg-blue-50 text-[#1a3c8f] font-black' 
                                                : 'text-gray-600 hover:bg-gray-50 font-bold'
                                            }`}
                                        >
                                            <span className={isActive ? 'text-[#1a3c8f]' : 'text-gray-400'}>
                                                {link.icon}
                                            </span>
                                            <span className="text-sm tracking-tight">{link.label}</span>
                                        </Link>
                                    );
                                })}
                            </div>

                            <div className="pt-6 border-t border-gray-100 space-y-3">
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4 px-4">Account</p>
                                {!user ? (
                                    <div className="flex flex-col gap-3">
                                        <Link
                                            to="/login"
                                            onClick={() => setMobileOpen(false)}
                                            className="w-full text-center py-4 rounded-2xl text-sm font-black text-gray-700 hover:bg-gray-50 border border-gray-100 transition-all uppercase tracking-widest"
                                        >
                                            Login
                                        </Link>
                                        <Link
                                            to="/signup"
                                            onClick={() => setMobileOpen(false)}
                                            className="w-full text-center py-4 rounded-2xl text-sm font-black text-white bg-[#1a3c8f] hover:bg-[#162f72] shadow-lg shadow-blue-900/20 transition-all uppercase tracking-widest"
                                        >
                                            Sign Up
                                        </Link>
                                        <Link
                                            to="/auth/admin/secure/login"
                                            onClick={() => setMobileOpen(false)}
                                            className="flex items-center justify-center gap-2 w-full py-4 text-sm font-black text-gray-400 hover:text-[#1a3c8f] transition-all"
                                        >
                                            <User size={18} />
                                            Admin Portal
                                        </Link>
                                        <Link
                                            to="/login"
                                            onClick={() => setMobileOpen(false)}
                                            className="w-full text-center py-4 rounded-2xl text-sm font-black text-[#1a3c8f] bg-blue-50 border border-blue-100 transition-all uppercase tracking-widest"
                                        >
                                            Contact Support
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-3">
                                        <Link
                                            to={user.role === 'RECRUITER' ? "/recruiter/dashboard" : "/dashboard"}
                                            onClick={() => setMobileOpen(false)}
                                            className="w-full text-center py-4 rounded-2xl text-sm font-black text-white bg-[#1a3c8f] hover:bg-[#162f72] shadow-lg shadow-blue-900/20 transition-all uppercase tracking-widest"
                                        >
                                            Go to Dashboard
                                        </Link>
                                        <a
                                            href={`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000/api'}/auth/support/whatsapp`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            onClick={() => setMobileOpen(false)}
                                            className="w-full text-center py-4 rounded-2xl text-sm font-black text-[#1a3c8f] bg-blue-50 border border-blue-100 transition-all uppercase tracking-widest"
                                        >
                                            Contact Support
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    )
}

export default Navbar
