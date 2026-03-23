import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, ShieldCheck, ArrowLeft, Send } from 'lucide-react'
import toast from 'react-hot-toast'
import logo from '../../../../assets/logo.png'
import api from '../../../../utils/api'

const AdminForgotPassword = () => {
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [sent, setSent] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            await api.post('/auth/admin/forgot-password', { adminEmail: email })
            toast.success('OTP sent to your admin email')
            setSent(true)
            setTimeout(() => navigate(`/auth/admin/secure/verify-otp/${encodeURIComponent(email)}`), 1200)
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Failed to send OTP')
        } finally {
            setLoading(false)
        }
    }


    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0b1f4d] via-[#1a3c8f] to-[#0f2b6b] flex items-center justify-center p-4">
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
                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
                    {/* Top Banner */}
                    <div className="bg-gradient-to-r from-[#1a3c8f] to-[#0f2b6b] px-8 py-7 flex flex-col items-center">
                        <img src={logo} alt="LOSODHAN" className="h-10 w-auto object-contain brightness-0 invert mb-4" />
                        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                            <ShieldCheck size={15} className="text-[#f97316]" />
                            <span className="text-white text-xs font-bold tracking-widest uppercase">Admin Password Recovery</span>
                        </div>
                    </div>

                    <div className="px-8 py-8">
                        {/* Back */}
                        <Link
                            to="/auth/admin/secure/login"
                            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-[#1a3c8f] transition-colors mb-6 group"
                        >
                            <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
                            Back to Admin Login
                        </Link>

                        <h2 className="text-2xl font-extrabold text-[#0f172a] mb-1">Forgot Password</h2>
                        <p className="text-sm text-gray-400 mb-7">
                            Enter your registered admin email. We'll send a one-time password.
                        </p>

                        {sent ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex flex-col items-center py-6 text-center"
                            >
                                <div className="w-16 h-16 rounded-2xl bg-green-100 flex items-center justify-center mb-4">
                                    <Send size={28} className="text-green-600" />
                                </div>
                                <p className="font-bold text-gray-900 mb-1">OTP Sent!</p>
                                <p className="text-sm text-gray-400">Redirecting to verification...</p>
                            </motion.div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div>
                                    <label className="block text-xs font-bold text-gray-600 mb-1.5">Admin Email</label>
                                    <div className="relative">
                                        <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={e => setEmail(e.target.value)}
                                            placeholder="admin@losodhan.in"
                                            required
                                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1a3c8f] focus:ring-2 focus:ring-blue-100 transition"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full flex items-center justify-center gap-2 py-3 bg-[#f97316] hover:bg-orange-600 text-white font-bold rounded-xl transition-all duration-200 shadow-lg disabled:opacity-60 text-sm"
                                >
                                    {loading ? (
                                        <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Sending OTP...</>
                                    ) : (
                                        <><Send size={16} /> Send OTP</>
                                    )}
                                </button>
                            </form>
                        )}
                    </div>

                    <div className="bg-gray-50 border-t border-gray-100 px-8 py-4 text-center">
                        <p className="text-[11px] text-gray-400">🔒 OTP expires in 10 minutes</p>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}

export default AdminForgotPassword
