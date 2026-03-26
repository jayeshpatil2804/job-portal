import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Menu, X, User, Home, Briefcase, UserCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import logo from '../assets/logo.png'

const Navbar = () => {
    const [mobileOpen, setMobileOpen] = useState(false)
    const location = useLocation()
    const { user } = useSelector(state => state.auth)

    const navLinks = [
        { label: 'Home', path: '/', icon: <Home size={18} /> },
        { label: 'Jobs', path: user ? '/jobs' : '/candidate/login', icon: <Briefcase size={18} /> },
        { label: 'Recruiter', path: user?.role === 'RECRUITER' ? '/recruiter/dashboard' : '/recruiter/login', icon: <UserCircle size={18} /> },
    ]

    return (
        <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
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
                                className={`text-sm font-medium transition-colors ${location.pathname === link.path
                                    ? 'text-[#1a3c8f] font-semibold'
                                    : 'text-gray-600 hover:text-[#1a3c8f]'
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
                                    className="text-sm font-medium text-gray-700 hover:text-[#1a3c8f] transition-colors"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/signup"
                                    className="bg-[#1a3c8f] text-white text-sm font-semibold px-5 py-2 rounded-md hover:bg-[#162f72] transition-colors"
                                >
                                    Sign Up
                                </Link>
                                <Link
                                    to="/auth/admin/secure/login"
                                    className="flex items-center gap-1.5 text-sm font-medium text-gray-700 hover:text-[#1a3c8f] transition-all hover:bg-gray-50 px-3 py-2 rounded-md"
                                >
                                    <User size={18} className="text-[#1a3c8f]" />
                                    Admin
                                </Link>
                            </>
                        ) : (
                            <Link
                                to={user.role === 'RECRUITER' ? "/recruiter/dashboard" : "/dashboard"}
                                className="bg-[#1a3c8f] text-white text-sm font-semibold px-5 py-2 rounded-md hover:bg-[#162f72] transition-colors"
                            >
                                Dashboard
                            </Link>
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
                                    </div>
                                ) : (
                                    <Link
                                        to={user.role === 'RECRUITER' ? "/recruiter/dashboard" : "/dashboard"}
                                        onClick={() => setMobileOpen(false)}
                                        className="w-full text-center py-4 rounded-2xl text-sm font-black text-white bg-[#1a3c8f] hover:bg-[#162f72] shadow-lg shadow-blue-900/20 transition-all uppercase tracking-widest"
                                    >
                                        Go to Dashboard
                                    </Link>
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
