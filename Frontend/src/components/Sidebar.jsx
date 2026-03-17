import { Link, useLocation, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Search, FileText, User, LogOut } from 'lucide-react'
import { toast } from 'react-hot-toast'
import api from '../utils/api'
import logo from '../assets/logo.png'

const Sidebar = () => {
    const location = useLocation()

    const navigate = useNavigate()
    const navLinks = [
        { path: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
        { path: '/jobs', label: 'Search Jobs', icon: <Search size={20} /> },
        { path: '/applied', label: 'Applied Jobs', icon: <FileText size={20} /> },
        { path: '/profile', label: 'Profile', icon: <User size={20} /> },
    ]

    const handleLogout = async () => {
        try {
            // Both roles clear the same 'token' cookie
            await api.post('/candidate/logout')
            toast.success('Logged out successfully')
            navigate('/login')
        } catch (error) {
            toast.error('Logout failed')
        }
    }

    return (
        <aside className="w-64 h-screen bg-[#1a3c8f] text-white flex flex-col fixed left-0 top-0 overflow-y-auto">
            <div className="p-8 flex justify-center border-b border-blue-800/50">
                <Link to="/" className="flex items-center">
                    <img src={logo} alt="LOSODHAN" className="h-16 w-auto object-contain brightness-0 invert" />
                </Link>
            </div>

            <nav className="flex-1 mt-6">
                <ul className="space-y-2 px-4">
                    {navLinks.map((link) => {
                        const isActive = location.pathname.startsWith(link.path)
                        return (
                            <li key={link.path}>
                                <Link
                                    to={link.path}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${
                                        isActive 
                                        ? 'bg-[#f97316] text-white font-medium shadow-md' 
                                        : 'text-blue-200 hover:bg-[#162f72] hover:text-white'
                                    }`}
                                >
                                    {link.icon}
                                    <span className="text-sm">{link.label}</span>
                                </Link>
                            </li>
                        )
                    })}
                </ul>
            </nav>

            <div className="p-4 border-t border-blue-800">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 w-full rounded-md text-blue-200 hover:bg-[#162f72] hover:text-white transition-colors"
                >
                    <LogOut size={20} />
                    <span className="text-sm font-medium">Logout</span>
                </button>
            </div>
        </aside>
    )
}

export default Sidebar
