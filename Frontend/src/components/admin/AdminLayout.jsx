import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
    LayoutDashboard,
    UserCheck,
    Users,
    Briefcase,
    ShieldCheck,
    BarChart3,
    LogOut,
    ChevronRight,
    Menu,
    X,
    Bell,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import logo from '../../assets/logo.png'

const navLinks = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/recruiters', label: 'Recruiter Approval', icon: UserCheck },
    { path: '/admin/candidates', label: 'Candidates', icon: Users },
    { path: '/admin/jobs', label: 'Job Moderation', icon: Briefcase },
    { path: '/admin/sub-admins', label: 'Sub Admins', icon: ShieldCheck },
    { path: '/admin/reports', label: 'Reports', icon: BarChart3 },
]

const AdminLayout = ({ children, title = 'Admin Panel' }) => {
    const location = useLocation()
    const navigate = useNavigate()
    const [mobileOpen, setMobileOpen] = useState(false)

    const handleLogout = () => {
        navigate('/login')
    }

    const SidebarContent = () => (
        <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="px-6 py-6 border-b border-white/10">
                <Link to="/" className="flex items-center gap-3">
                    <img src={logo} alt="LOSODHAN" className="h-10 w-auto object-contain brightness-0 invert" />
                    <div>
                        <p className="text-[10px] font-bold tracking-[0.2em] text-blue-300 uppercase">Admin Panel</p>
                    </div>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                {navLinks.map(({ path, label, icon: Icon }) => {
                    const isActive = location.pathname === path
                    return (
                        <Link
                            key={path}
                            to={path}
                            onClick={() => setMobileOpen(false)}
                            className={`group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 relative ${
                                isActive
                                    ? 'bg-[#f97316] text-white shadow-lg shadow-orange-500/30'
                                    : 'text-blue-200 hover:bg-white/10 hover:text-white'
                            }`}
                        >
                            <Icon size={19} className="shrink-0" />
                            <span className="text-sm font-medium">{label}</span>
                            {isActive && (
                                <motion.div
                                    layoutId="activeIndicator"
                                    className="absolute right-3"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                >
                                    <ChevronRight size={16} />
                                </motion.div>
                            )}
                        </Link>
                    )
                })}
            </nav>

            {/* Logout */}
            <div className="px-4 py-4 border-t border-white/10">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-blue-200 hover:bg-white/10 hover:text-white transition-all duration-200"
                >
                    <LogOut size={19} />
                    <span className="text-sm font-medium">Logout</span>
                </button>
            </div>
        </div>
    )

    return (
        <div className="flex min-h-screen bg-[#f0f4ff]">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:flex w-64 h-screen bg-[#1a3c8f] text-white flex-col fixed left-0 top-0">
                <SidebarContent />
            </aside>

            {/* Mobile Overlay */}
            <AnimatePresence>
                {mobileOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setMobileOpen(false)}
                            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                        />
                        <motion.aside
                            initial={{ x: -280 }}
                            animate={{ x: 0 }}
                            exit={{ x: -280 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            className="fixed left-0 top-0 h-screen w-64 bg-[#1a3c8f] text-white z-50 lg:hidden"
                        >
                            <SidebarContent />
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <main className="flex-1 lg:ml-64 flex flex-col min-h-screen">
                {/* Top Header */}
                <header className="sticky top-0 z-30 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setMobileOpen(true)}
                            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
                        >
                            <Menu size={22} />
                        </button>
                        <div>
                            <h1 className="text-lg font-bold text-[#0f172a]">{title}</h1>
                            <p className="text-xs text-gray-400 hidden sm:block">Welcome back, Super Admin</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="relative p-2 rounded-xl hover:bg-gray-100 text-gray-600 transition-colors">
                            <Bell size={20} />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#f97316] rounded-full"></span>
                        </button>
                        <div className="w-9 h-9 rounded-xl bg-[#1a3c8f] flex items-center justify-center text-white font-bold text-sm">
                            SA
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <div className="flex-1 p-6 md:p-8">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    )
}

export default AdminLayout
