import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { LogIn } from 'lucide-react'
import logo from '../assets/logo.png'

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false)
    const navigate = useNavigate()
    const { user, isAuthenticated } = useSelector(state => state.auth)

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 20) {
                setScrolled(true)
            } else {
                setScrolled(false)
            }
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
            scrolled ? 'bg-white shadow-md py-2' : 'bg-white py-3'
        }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo - Increased size */}
                    <Link to="/" className="flex items-center -ml-2">
                        <img src={logo} alt="LOSODHAN" className="h-14 md:h-16 w-auto object-contain transition-transform hover:scale-105" />
                    </Link>

                    {/* Desktop Actions */}
                    <div className="flex items-center gap-4">
                        {!isAuthenticated ? (
                            <button
                                onClick={() => navigate('/login')}
                                className="bg-[#ff7a20] text-white px-6 py-2 rounded-full text-sm font-bold flex items-center gap-2 hover:bg-[#e66a1a] transition-all shadow-md active:scale-95"
                            >
                                <LogIn size={18} />
                                Login Now
                            </button>
                        ) : (
                            <Link
                                to={user.role === 'RECRUITER' ? "/recruiter/dashboard" : "/dashboard"}
                                className="bg-[#ff7a20] text-white px-6 py-2 rounded-full text-sm font-bold hover:bg-[#e66a1a] transition-all shadow-md active:scale-95"
                            >
                                Dashboard
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar
