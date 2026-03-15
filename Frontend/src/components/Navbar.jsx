import { Link, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'

const Navbar = () => {
    const [mobileOpen, setMobileOpen] = useState(false)
    const location = useLocation()

    const navLinks = [
        { label: 'Home', path: '/' },
        { label: 'Jobs', path: '/jobs' },
        { label: 'Recruiter', path: '/recruiter' },
    ]

    return (
        <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="text-[#1a3c8f] font-extrabold text-xl tracking-tight">
                        LOSODHAN
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
                    </div>
                </div>
            )}
        </nav>
    )
}

export default Navbar
