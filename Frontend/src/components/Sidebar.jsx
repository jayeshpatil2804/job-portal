import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Search, FileText, User, LogOut, Menu, X, MessageSquare } from 'lucide-react'
import { toast } from 'react-hot-toast'
import api from '../utils/api'
import logo from '../assets/logo.png'
import { motion, AnimatePresence } from 'framer-motion'

const Sidebar = ({ isOpen, setIsOpen }) => {
    const location = useLocation()
    const navigate = useNavigate()
    const [isMobile, setIsMobile] = useState(window.innerWidth < 1024)

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 1024)
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    const navLinks = [
        { path: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
        { path: '/jobs', label: 'Search Jobs', icon: <Search size={20} /> },
        { path: '/applied', label: 'Applied Jobs', icon: <FileText size={20} /> },
        { path: '/profile', label: 'Profile', icon: <User size={20} /> },
    ]

    const handleLogout = async () => {
        try {
            await api.post('/candidate/logout')
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
                <div className="px-6 py-6 border-b border-white/10 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-3">
                        <img src={logo} alt="LOSODHAN" className="h-10 w-auto object-contain brightness-0 invert" />
                        <div>
                            <p className="text-[10px] font-bold tracking-[0.2em] text-blue-300 uppercase">Candidate</p>
                        </div>
                    </Link>
                    <button 
                        onClick={() => setIsOpen(false)}
                        className="lg:hidden p-2 hover:bg-white/10 rounded-full text-white/70 hover:text-white"
                    >
                        <X size={20} />
                    </button>
                </div>

                <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto custom-scrollbar">
                    <div className="px-1 mb-4">
                        <ul className="space-y-1">
                            {navLinks.map((link) => {
                                const isActive = location.pathname.startsWith(link.path)
                                return (
                                    <li key={link.path}>
                                        <Link
                                            to={link.path}
                                            onClick={() => isMobile && setIsOpen(false)}
                                        className={`group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 relative ${
                                            isActive 
                                                ? 'bg-[#f97316] text-white shadow-lg shadow-orange-500/30' 
                                                : 'text-blue-200 hover:bg-white/10 hover:text-white'
                                        }`}
                                    >
                                        <div className="shrink-0">
                                            {React.cloneElement(link.icon, { size: 19 })}
                                        </div>
                                        <span className="text-sm font-medium">{link.label}</span>
                                        {isActive && (
                                            <motion.div
                                                layoutId="activeIndicator"
                                                className="absolute right-3"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                                            </motion.div>
                                        )}
                                    </Link>
                                    </li>
                                )
                            })}
                        </ul>
                    </div>
                </nav>

                <div className="px-4 py-4 border-t border-white/10">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-blue-200 hover:bg-white/10 hover:text-white transition-all duration-200"
                    >
                        <LogOut size={19} />
                        <span className="text-sm font-medium">Logout</span>
                    </button>
                    <a
                        href={`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000/api'}/auth/support/whatsapp`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-blue-200 hover:bg-white/10 hover:text-white transition-all duration-200 mt-2"
                    >
                        <MessageSquare size={19} />
                        <span className="text-sm font-medium">Support</span>
                    </a>
                </div>
            </motion.aside>
        </>
    )
}

export default Sidebar
