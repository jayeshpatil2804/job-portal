import { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Lock, Eye, EyeOff, ShieldCheck, CheckCircle, ArrowLeft } from 'lucide-react'
import toast from 'react-hot-toast'
import logo from '../../../../assets/logo.png'
import api from '../../../../utils/api'

const PasswordStrength = ({ password }) => {
    const checks = [
        { label: 'At least 8 characters', ok: password.length >= 8 },
        { label: 'Uppercase letter', ok: /[A-Z]/.test(password) },
        { label: 'Number', ok: /\d/.test(password) },
        { label: 'Special character', ok: /[!@#$%^&*]/.test(password) },
    ]
    const score = checks.filter(c => c.ok).length
    const colors = ['bg-red-400', 'bg-orange-400', 'bg-yellow-400', 'bg-green-500']
    const labels = ['Weak', 'Fair', 'Good', 'Strong']

    return (
        <div className="mt-2 space-y-2">
            {password.length > 0 && (
                <>
                    <div className="flex gap-1">
                        {[0, 1, 2, 3].map(i => (
                            <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${i < score ? colors[score - 1] : 'bg-gray-200'}`} />
                        ))}
                    </div>
                    <p className={`text-xs font-semibold ${score <= 1 ? 'text-red-500' : score === 2 ? 'text-yellow-500' : 'text-green-600'}`}>
                        {labels[score - 1] || 'Too weak'}
                    </p>
                    <ul className="space-y-1">
                        {checks.map(c => (
                            <li key={c.label} className={`flex items-center gap-1.5 text-[11px] ${c.ok ? 'text-green-600' : 'text-gray-400'}`}>
                                <CheckCircle size={11} className={c.ok ? 'text-green-500' : 'text-gray-300'} />
                                {c.label}
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </div>
    )
}

const AdminResetPassword = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const { email, otp } = location.state || {}
    const [form, setForm] = useState({ password: '', confirm: '' })
    const [show, setShow] = useState({ password: false, confirm: false })
    const [loading, setLoading] = useState(false)
    const [done, setDone] = useState(false)

    const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }))
    const toggleShow = (key) => setShow(s => ({ ...s, [key]: !s[key] }))

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!email || !otp) { toast.error('Session expired. Please restart flow.'); return }
        if (form.password !== form.confirm) { toast.error('Passwords do not match'); return }
        if (form.password.length < 8) { toast.error('Password too short'); return }
        
        setLoading(true)
        try {
            await api.post('/auth/admin/reset-password', {
                adminEmail: email,
                otp,
                newPassword: form.password
            })
            setDone(true)
            toast.success('Password reset successful!')
            setTimeout(() => navigate('/auth/admin/secure/login'), 1800)
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Failed to reset password')
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
                            <span className="text-white text-xs font-bold tracking-widest uppercase">Reset Admin Password</span>
                        </div>
                    </div>

                    <div className="px-8 py-8">
                        <Link
                            to="/auth/admin/secure/login"
                            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-[#1a3c8f] transition-colors mb-6 group"
                        >
                            <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
                            Back to Login
                        </Link>

                        {done ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex flex-col items-center py-8 text-center"
                            >
                                <div className="w-20 h-20 rounded-2xl bg-green-100 flex items-center justify-center mb-5">
                                    <CheckCircle size={40} className="text-green-500" />
                                </div>
                                <h3 className="text-xl font-extrabold text-[#0f172a] mb-2">Password Reset!</h3>
                                <p className="text-sm text-gray-400">Redirecting to admin login...</p>
                            </motion.div>
                        ) : (
                            <>
                                <h2 className="text-2xl font-extrabold text-[#0f172a] mb-1">New Password</h2>
                                <p className="text-sm text-gray-400 mb-7">Choose a strong password for your admin account.</p>

                                <form onSubmit={handleSubmit} className="space-y-5">
                                    {/* New Password */}
                                    <div>
                                        <label className="block text-xs font-bold text-gray-600 mb-1.5">New Password</label>
                                        <div className="relative">
                                            <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                            <input
                                                type={show.password ? 'text' : 'password'}
                                                name="password"
                                                value={form.password}
                                                onChange={handleChange}
                                                placeholder="••••••••••••"
                                                required
                                                className="w-full pl-10 pr-11 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1a3c8f] focus:ring-2 focus:ring-blue-100 transition"
                                            />
                                            <button type="button" onClick={() => toggleShow('password')} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                                                {show.password ? <EyeOff size={16} /> : <Eye size={16} />}
                                            </button>
                                        </div>
                                        <PasswordStrength password={form.password} />
                                    </div>

                                    {/* Confirm Password */}
                                    <div>
                                        <label className="block text-xs font-bold text-gray-600 mb-1.5">Confirm Password</label>
                                        <div className="relative">
                                            <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                            <input
                                                type={show.confirm ? 'text' : 'password'}
                                                name="confirm"
                                                value={form.confirm}
                                                onChange={handleChange}
                                                placeholder="••••••••••••"
                                                required
                                                className={`w-full pl-10 pr-11 py-3 border rounded-xl text-sm focus:outline-none transition ${
                                                    form.confirm && form.confirm !== form.password
                                                        ? 'border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-50'
                                                        : form.confirm && form.confirm === form.password
                                                        ? 'border-green-400 focus:border-green-400 focus:ring-2 focus:ring-green-50'
                                                        : 'border-gray-200 focus:border-[#1a3c8f] focus:ring-2 focus:ring-blue-100'
                                                }`}
                                            />
                                            <button type="button" onClick={() => toggleShow('confirm')} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                                                {show.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
                                            </button>
                                        </div>
                                        {form.confirm && form.confirm !== form.password && (
                                            <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
                                        )}
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full flex items-center justify-center gap-2 py-3 bg-[#1a3c8f] hover:bg-[#162f72] text-white font-bold rounded-xl transition-all duration-200 shadow-lg disabled:opacity-60 text-sm mt-2"
                                    >
                                        {loading ? (
                                            <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Resetting...</>
                                        ) : (
                                            <><ShieldCheck size={16} /> Reset Password</>
                                        )}
                                    </button>
                                </form>
                            </>
                        )}
                    </div>

                    <div className="bg-gray-50 border-t border-gray-100 px-8 py-4 text-center">
                        <p className="text-[11px] text-gray-400">🔒 Your new password is encrypted end-to-end</p>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}

export default AdminResetPassword
