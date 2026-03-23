import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { Mail, Lock, ShieldCheck, Eye, EyeOff, AlertTriangle } from 'lucide-react'
import toast from 'react-hot-toast'
import logo from '../../../../assets/logo.png'
import { loginAdmin } from '../../../../redux/actions/authActions'

const AdminLogin = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { loading } = useSelector(state => state.auth)
    const [form, setForm] = useState({ email: '', password: '' })
    const [showPass, setShowPass] = useState(false)

    const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            await dispatch(loginAdmin(form)).unwrap()
            toast.success('Welcome, Super Admin!')
            navigate('/admin/dashboard')
        } catch (error) {
            toast.error(error?.message || 'Invalid admin credentials.')
        }
    }


    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0b1f4d] via-[#1a3c8f] to-[#0f2b6b] flex items-center justify-center p-4">
            {/* Floating decorative blobs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#f97316]/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, ease: 'easeOut' }}
                className="relative w-full max-w-md"
            >
                {/* Card */}
                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
                    {/* Top Banner */}
                    <div className="bg-gradient-to-r from-[#1a3c8f] to-[#0f2b6b] px-8 py-7 flex flex-col items-center">
                        <img src={logo} alt="LOSODHAN" className="h-10 w-auto object-contain brightness-0 invert mb-4" />
                        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                            <ShieldCheck size={15} className="text-[#f97316]" />
                            <span className="text-white text-xs font-bold tracking-widest uppercase">Secure Admin Portal</span>
                        </div>
                    </div>

                    {/* Form */}
                    <div className="px-8 py-8">
                        <h2 className="text-2xl font-extrabold text-[#0f172a] mb-1">Admin Sign In</h2>
                        <p className="text-sm text-gray-400 mb-7">Authorised personnel only</p>

                        {/* Security notice */}
                        <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-3 mb-6">
                            <AlertTriangle size={16} className="text-amber-500 shrink-0 mt-0.5" />
                            <p className="text-xs text-amber-700 leading-relaxed">
                                This portal is restricted to administrators. Unauthorised access attempts are logged and monitored.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Email */}
                            <div>
                                <label className="block text-xs font-bold text-gray-600 mb-1.5">Admin Email</label>
                                <div className="relative">
                                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                    <input
                                        type="email"
                                        name="email"
                                        value={form.email}
                                        onChange={handleChange}
                                        placeholder="admin@losodhan.in"
                                        required
                                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1a3c8f] focus:ring-2 focus:ring-blue-100 transition"
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block text-xs font-bold text-gray-600 mb-1.5">Password</label>
                                <div className="relative">
                                    <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                    <input
                                        type={showPass ? 'text' : 'password'}
                                        name="password"
                                        value={form.password}
                                        onChange={handleChange}
                                        placeholder="••••••••••••"
                                        required
                                        className="w-full pl-10 pr-11 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1a3c8f] focus:ring-2 focus:ring-blue-100 transition"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPass(s => !s)}
                                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>

                            {/* Forgot password */}
                            <div className="flex justify-end -mt-2">
                                <Link
                                    to="/auth/admin/secure/forgot-password"
                                    className="text-xs font-semibold text-[#1a3c8f] hover:text-[#f97316] transition-colors"
                                >
                                    Forgot password?
                                </Link>
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex items-center justify-center gap-2 py-3 bg-[#1a3c8f] hover:bg-[#162f72] text-white font-bold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-60 text-sm"
                            >
                                {loading ? (
                                    <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Authenticating...</>
                                ) : (
                                    <><ShieldCheck size={16} /> Sign in as Admin</>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Footer */}
                    <div className="bg-gray-50 border-t border-gray-100 px-8 py-4 text-center">
                        <p className="text-[11px] text-gray-400">
                            🔒 Encrypted connection &nbsp;|&nbsp; Session expires after 8 hours
                        </p>
                    </div>
                </div>

                {/* Back link */}
                <p className="text-center mt-5 text-xs text-white/50">
                    Not an admin?{' '}
                    <Link to="/login" className="text-white/80 hover:text-white underline underline-offset-2 transition-colors">
                        Go to public login
                    </Link>
                </p>
            </motion.div>
        </div>
    )
}

export default AdminLogin
