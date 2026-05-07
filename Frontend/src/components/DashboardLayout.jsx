import React, { useState, useEffect, useRef } from 'react'
import Sidebar from './Sidebar'
import { Menu, ShieldAlert, Phone, MessageSquare, ArrowRight } from 'lucide-react'
import { useSelector, useDispatch } from 'react-redux'
import { fetchProfileStatus } from '../redux/actions/profileActions'
import { verifyCandidateOtp } from '../redux/actions/authActions'
import toast from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'
import { useLocation, useNavigate } from 'react-router-dom'
import logo from '../assets/logo.png'
import socket from '../utils/socket'

const DashboardLayout = ({ children }) => {
    const dispatch = useDispatch()
    const location = useLocation()
    const navigate = useNavigate()
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const [otp, setOtp] = useState('')
    const [verifying, setVerifying] = useState(false)
    const { isActive, status: profileStatus } = useSelector(state => state.profile)
    const { user } = useSelector(state => state.auth)
    const toastShown = useRef(false)

    const isUnverified = user?.role === 'CANDIDATE' && !user?.isVerified
    const isProfilePage = location.pathname === '/profile'

    const handleOtpVerify = async (e) => {
        e.preventDefault()
        if (otp.length !== 6) {
            toast.error('Please enter a valid 6-digit code')
            return
        }
        try {
            setVerifying(true)
            await dispatch(verifyCandidateOtp({ email: user.email, otp })).unwrap()
            toast.success('Account verified successfully!')
            setOtp('')
        } catch (error) {
            toast.error(error.message || 'Verification failed')
        } finally {
            setVerifying(false)
        }
    }


    // Real-time activation via Socket.IO
    useEffect(() => {
        if (!user?.id) return

        socket.connect()
        socket.emit('joinRoom', user.id)

        socket.on('accountStatusChanged', ({ isActive }) => {
            dispatch(fetchProfileStatus())
        })

        return () => {
            socket.off('accountStatusChanged')
            socket.disconnect()
        }
    }, [user?.id, dispatch])

    return (
        <div className="flex min-h-screen bg-gray-50 font-sans antialiased text-slate-900">
            {/* Verification Modal for Unverified Candidates */}
            <AnimatePresence>
                {isUnverified && !isProfilePage && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/60 backdrop-blur-md"
                        />
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl overflow-hidden p-10 text-center"
                        >
                            <div className="w-20 h-20 bg-rose-50 rounded-[2rem] flex items-center justify-center text-rose-500 mx-auto mb-6 shadow-inner">
                                <ShieldAlert size={40} />
                            </div>
                            
                            <h3 className="text-2xl font-black text-gray-900 tracking-tight mb-2 leading-tight">Verification Required</h3>
                            <p className="text-gray-500 font-bold text-sm mb-8 px-2 leading-relaxed">
                                Enter the secure code provided by our administrator to activate your account.
                            </p>

                            <form onSubmit={handleOtpVerify} className="space-y-4 mb-8">
                                <div className="relative group">
                                    <input 
                                        type="text"
                                        maxLength="6"
                                        placeholder="Enter 6-digit OTP"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                        className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-center text-2xl font-black tracking-[0.3em] text-[#1a3c8f] focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#1a3c8f] transition-all shadow-inner"
                                    />
                                </div>
                                <button 
                                    type="submit"
                                    disabled={verifying || otp.length !== 6}
                                    className="w-full py-4 bg-[#1a3c8f] text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-blue-500/10 hover:bg-blue-900 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                                >
                                    {verifying ? 'Verifying...' : 'Verify & Access'}
                                    {!verifying && <ArrowRight size={14} />}
                                </button>
                            </form>

                            <div className="grid grid-cols-2 gap-3 mb-6">
                                <a 
                                    href="https://wa.me/91XXXXXXXXXX" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-2 py-3 bg-[#25D366] text-white rounded-xl font-black uppercase tracking-widest text-[9px] hover:scale-[1.02] transition-all active:scale-95"
                                >
                                    <MessageSquare size={14} /> WhatsApp
                                </a>
                                <a 
                                    href="tel:+91XXXXXXXXXX" 
                                    className="flex items-center justify-center gap-2 py-3 bg-[#1a3c8f] text-white rounded-xl font-black uppercase tracking-widest text-[9px] hover:scale-[1.02] transition-all active:scale-95"
                                >
                                    <Phone size={14} /> Call Now
                                </a>
                            </div>

                            <button 
                                onClick={() => navigate('/profile')}
                                className="w-full py-2 text-gray-400 font-black uppercase tracking-widest text-[9px] hover:text-[#1a3c8f] transition-all"
                            >
                                Continue to Profile Page Only
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Mobile Header - Merged & Premium */}
            <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-[#1a3c8f] text-white flex items-center justify-between px-6 z-30 shadow-2xl border-b border-white/10 backdrop-blur-md">
                <div className="flex items-center gap-3 group">
                    <div className="relative">
                        <img src={logo} alt="Logo" className="h-10 w-auto brightness-0 invert transition-transform group-hover:rotate-12" />
                    </div>
                </div>
                <button
                    onClick={() => setIsSidebarOpen(true)}
                    className="p-2 hover:bg-white/10 rounded-xl transition-all active:scale-95"
                >
                    <Menu size={24} />
                </button>
            </header>

            {/* Sidebar Component */}
            <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

            {/* Main content area */}
            <main className="flex-1 min-h-screen overflow-y-auto w-full pt-16 lg:pt-0 lg:ml-64 relative bg-[#F8FAFC]">
                {/* Subtle background glow */}
                <div className="absolute top-0 right-0 -z-10 w-1/2 h-1/2 bg-blue-100/30 blur-[120px] rounded-full" />
                <div className="absolute bottom-0 left-0 -z-10 w-1/2 h-1/2 bg-orange-50/30 blur-[120px] rounded-full" />
                
                <div className="p-4 md:p-8 lg:p-12 max-w-7xl mx-auto min-h-full">
                    {children}
                </div>
            </main>
        </div>
    )
}

export default DashboardLayout
