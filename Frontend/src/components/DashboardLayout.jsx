import React, { useState, useEffect, useRef } from 'react'
import Sidebar from './Sidebar'
import { Menu } from 'lucide-react'
import { useSelector, useDispatch } from 'react-redux'
import { fetchProfileStatus } from '../redux/actions/profileActions'
import toast from 'react-hot-toast'

import logo from '../assets/logo.png'
import socket from '../utils/socket'

const DashboardLayout = ({ children }) => {
    const dispatch = useDispatch()
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const { isActive, isPaid, status: profileStatus } = useSelector(state => state.profile)
    const { user } = useSelector(state => state.auth)
    const toastShown = useRef(false)

    // Ensure profile status is always fresh (handles back-navigation & direct visits)
    useEffect(() => {
        if ((profileStatus === 'idle') && user?.role === 'CANDIDATE') {
            dispatch(fetchProfileStatus())
        }
    }, [dispatch, profileStatus, user])

    // Show warning toast for unpaid users instead of blocking the dashboard
    useEffect(() => {
        if (profileStatus === 'succeeded' && !isActive && !toastShown.current) {
            toast.error('Payment not paid yet. Full features locked.', { duration: 5000 })
            toastShown.current = true
        }
        if (isActive) {
            toastShown.current = false // Reset if they suddenly become active
        }
    }, [profileStatus, isActive])

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
