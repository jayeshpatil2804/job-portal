import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { LayoutDashboard, PlusCircle, Briefcase, Users, Calendar, LogOut, User, X, MessageSquare } from 'lucide-react'
import { toast } from 'react-hot-toast'
import api from '../utils/api'
import logo from '../assets/logo.png'
import { motion, AnimatePresence } from 'framer-motion'

const RecruiterSidebar = ({ isOpen, setIsOpen }) => {
    const location = useLocation()
    const navigate = useNavigate()
    const [isMobile, setIsMobile] = useState(window.innerWidth < 1024)

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 1024)
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    const navLinks = [
        { path: '/recruiter/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
        { path: '/recruiter/post-job', label: 'Post Job', icon: <PlusCircle size={20} /> },
        { path: '/recruiter/manage-jobs', label: 'Manage Jobs', icon: <Briefcase size={20} /> },
        { path: '/recruiter/applicants', label: 'Applicants', icon: <Users size={20} /> },
        { path: '/recruiter/interviews', label: 'Interviews', icon: <Calendar size={20} /> },
        { path: '/recruiter/profile', label: 'Profile', icon: <User size={20} /> },
    ]

    const handleLogout = async () => {
        try {
            await api.post('/recruiter/logout')
            toast.success('Logged out successfully')
            navigate('/login')
        } catch (error) {
            toast.error('Logout failed')
        }
    }

    const sidebarVariants = {
        open: { x: 0, transition: { type: 'spring', stiffness: 300, damping: 30 } },
        closed: { x: '-100%', transition: { type: 'spring', stiffness: 300, damping: 30 } }
    }

    return (
        <>
            {/* Mobile Backdrop */}
            <AnimatePresence>
                {isMobile && isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsOpen(false)}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar Aside */}
            <motion.aside
                initial={isMobile ? "closed" : false}
                animate={isMobile ? (isOpen ? 'open' : 'closed') : 'open'}
                variants={sidebarVariants}
                className={`fixed left-0 top-0 h-screen w-64 bg-[#1a3c8f] text-white flex flex-col z-50 shadow-2xl lg:shadow-none border-r border-blue-800/10`}
            >
                <div className="p-8 pb-10 flex items-center justify-between border-b border-blue-800/20">
                    <Link to="/" className="flex items-center group">
                        <div className="relative">
                            <img src={logo} alt="LOSODHAN" className="h-14 w-auto object-contain brightness-0 invert transition-all duration-500 group-hover:scale-110 group-hover:rotate-3" />
                            <div className="absolute -inset-4 bg-blue-400/10 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                    </Link>
                    <button 
                        onClick={() => setIsOpen(false)}
                        className="lg:hidden p-2 hover:bg-white/10 rounded-full text-white/70 hover:text-white"
                    >
                        <X size={20} />
                    </button>
                </div>

                <nav className="flex-1 mt-8 overflow-y-auto custom-scrollbar">
                    <div className="px-4 mb-4">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-300/50 px-4 mb-4">Recruiter Portal</p>
                        <ul className="space-y-1">
                            {navLinks.map((link) => {
                                const isActive = location.pathname.startsWith(link.path)
                                return (
                                    <li key={link.path}>
                                        <Link
                                            to={link.path}
                                            onClick={() => isMobile && setIsOpen(false)}
                                            className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 relative group ${
                                                isActive 
                                                ? 'bg-gradient-to-r from-[#f97316] to-[#ea580c] text-white font-black shadow-lg shadow-orange-900/30' 
                                                : 'text-blue-100/70 hover:bg-white/5 hover:text-white font-bold'
                                            }`}
                                        >
                                            {isActive && (
                                                <motion.div 
                                                    layoutId="recruiterActiveNav"
                                                    className="absolute inset-0 bg-white/10 rounded-2xl"
                                                />
                                            )}
                                            <div className={`relative ${isActive ? 'scale-110' : 'opacity-70 group-hover:opacity-100 transition-opacity'}`}>
                                                {link.icon}
                                            </div>
                                            <span className="relative text-[11px] uppercase tracking-[0.15em]">{link.label}</span>
                                        </Link>
                                    </li>
                                )
                            })}
                        </ul>
                    </div>
                </nav>

                <div className="p-6 border-t border-blue-800/50 bg-[#162f72]/50">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-4 px-5 py-4 w-full rounded-2xl text-blue-100/60 hover:bg-red-500/10 hover:text-red-400 transition-all font-bold group"
                    >
                        <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="text-[10px] uppercase tracking-[0.15em]">Sign Out</span>
                    </button>
                    <a
                        href={`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000/api'}/auth/support/whatsapp`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-4 px-5 py-4 w-full rounded-2xl text-blue-100/60 hover:bg-blue-400/10 hover:text-white transition-all font-bold group mt-2"
                    >
                        <MessageSquare size={20} className="group-hover:scale-110 transition-transform text-blue-300" />
                        <span className="text-[10px] uppercase tracking-[0.15em]">Help & Support</span>
                    </a>
                </div>
            </motion.aside>
        </>
    )
}

export default RecruiterSidebar
