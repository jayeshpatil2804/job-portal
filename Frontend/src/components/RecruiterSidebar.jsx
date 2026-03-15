import { useNavigate, Link, useLocation } from 'react-router-dom'
import { 
    LayoutDashboard, 
    PlusCircle, 
    Briefcase, 
    Users, 
    Calendar, 
    LogOut 
} from 'lucide-react'
import api from '../utils/api'
import toast from 'react-hot-toast'

const RecruiterSidebar = () => {
    const location = useLocation()
    const navigate = useNavigate()

    const navLinks = [
        { path: '/recruiter/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
        { path: '/recruiter/post-job', label: 'Post Job', icon: <PlusCircle size={20} /> },
        { path: '/recruiter/manage-jobs', label: 'Manage Jobs', icon: <Briefcase size={20} /> },
        { path: '/recruiter/applicants', label: 'Applicants', icon: <Users size={20} /> },
        { path: '/recruiter/interviews', label: 'Interviews', icon: <Calendar size={20} /> },
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

    return (
        <aside className="w-64 h-screen bg-[#1a3c8f] text-white flex flex-col fixed left-0 top-0 overflow-y-auto">
            <div className="p-6">
                <Link to="/" className="text-2xl font-extrabold tracking-wide">
                    LOSODHAN
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
                                    className={`flex items-center gap-3 px-4 py-3 rounded-md transition-all duration-200 ${
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

export default RecruiterSidebar
