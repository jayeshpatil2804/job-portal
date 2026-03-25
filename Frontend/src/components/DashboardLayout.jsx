import React, { useState, useEffect } from 'react'
import Sidebar from './Sidebar'
import { Menu } from 'lucide-react'
import { useSelector, useDispatch } from 'react-redux'
import ActivationDialog from './common/ActivationDialog'
import { fetchProfileStatus } from '../redux/actions/profileActions'
import logo from '../assets/logo.png'
import socket from '../utils/socket'

const DashboardLayout = ({ children }) => {
    const dispatch = useDispatch()
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const { isActive, isPaid } = useSelector(state => state.profile)
    const { user } = useSelector(state => state.auth)

    const handlePaymentSuccess = () => {
        dispatch(fetchProfileStatus())
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
            {/* Activation Dialog for Inactive Users */}
            <ActivationDialog isOpen={!isActive} isPaid={isPaid} userType="CANDIDATE" onPaymentSuccess={handlePaymentSuccess} />
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
