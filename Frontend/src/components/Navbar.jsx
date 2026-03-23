import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Menu, X } from 'lucide-react'
import logo from '../assets/logo.png'

const Navbar = () => {
    const [mobileOpen, setMobileOpen] = useState(false)
    const location = useLocation()
    const { user } = useSelector(state => state.auth)

    const navLinks = [
        { label: 'Home', path: '/' },
        { label: 'Jobs', path: user ? '/jobs' : '/candidate/login' },
        { label: 'Recruiter', path: user?.role === 'RECRUITER' ? '/recruiter/dashboard' : '/recruiter/login' },
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
            {mobileOpen && (
                <div className="md:hidden bg-white border-t border-gray-100 px-4 pb-4">
                    {navLinks.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            onClick={() => setMobileOpen(false)}
                            className="block py-2 text-sm font-medium text-gray-700 hover:text-[#1a3c8f]"
                        >
                            {link.label}
                        </Link>
                    ))}
                    <div className="flex gap-3 mt-3">
                        {!user ? (
                            <>
                                <Link
                                    to="/login"
                                    onClick={() => setMobileOpen(false)}
                                    className="text-sm font-medium text-gray-700 hover:text-[#1a3c8f]"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/signup"
                                    onClick={() => setMobileOpen(false)}
                                    className="bg-[#1a3c8f] text-white text-sm font-semibold px-4 py-2 rounded-md hover:bg-[#162f72]"
                                >
                                    Sign Up
                                </Link>
                            </>
                        ) : (
                            <Link
                                to={user.role === 'RECRUITER' ? "/recruiter/dashboard" : "/dashboard"}
                                onClick={() => setMobileOpen(false)}
                                className="bg-[#1a3c8f] text-white text-sm font-semibold px-4 py-2 rounded-md hover:bg-[#162f72]"
                            >
                                Dashboard
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </nav>
    )
}

export default Navbar
