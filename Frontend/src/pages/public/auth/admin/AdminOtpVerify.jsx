import { useState, useRef } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ShieldCheck, ArrowLeft, RefreshCw } from 'lucide-react'
import toast from 'react-hot-toast'
import logo from '../../../../assets/logo.png'
import api from '../../../../utils/api'

const AdminOtpVerify = () => {
    const navigate = useNavigate()
    const { email } = useParams()
    const decodedEmail = decodeURIComponent(email || '')
    const [otp, setOtp] = useState(['', '', '', '', '', ''])
    const [loading, setLoading] = useState(false)
    const [resending, setResending] = useState(false)
    const inputsRef = useRef([])

    const handleChange = (i, val) => {
        if (!/^\d?$/.test(val)) return
        const next = [...otp]
        next[i] = val
        setOtp(next)
        if (val && i < 5) inputsRef.current[i + 1]?.focus()
    }

    const handleKeyDown = (i, e) => {
        if (e.key === 'Backspace' && !otp[i] && i > 0) {
            inputsRef.current[i - 1]?.focus()
        }
    }

    const handlePaste = (e) => {
        e.preventDefault()
        const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6).split('')
        const next = [...otp]
        pasted.forEach((ch, idx) => { next[idx] = ch })
        setOtp(next)
        inputsRef.current[Math.min(pasted.length, 5)]?.focus()
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const code = otp.join('')
        if (code.length < 6) { toast.error('Enter all 6 digits'); return }
        setLoading(true)
        try {
            await api.post('/auth/admin/verify-otp', { adminEmail: decodedEmail, otp: code })
            toast.success('OTP verified!')
            navigate('/auth/admin/secure/reset-password', { state: { email: decodedEmail, otp: code } })
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Incorrect OTP. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const handleResend = async () => {
        setResending(true)
        try {
            await api.post('/auth/admin/forgot-password', { adminEmail: decodedEmail })
            toast.success('OTP resent to your email!')
            setOtp(['', '', '', '', '', ''])
            inputsRef.current[0]?.focus()
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Failed to resend OTP')
        } finally {
            setResending(false)
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
                            <span className="text-white text-xs font-bold tracking-widest uppercase">OTP Verification</span>
                        </div>
                    </div>

                    <div className="px-8 py-8">
                        <Link
                            to="/auth/admin/secure/forgot-password"
                            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-[#1a3c8f] transition-colors mb-6 group"
                        >
                            <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
                            Back
                        </Link>

                        <h2 className="text-2xl font-extrabold text-[#0f172a] mb-1">Verify OTP</h2>
                        <p className="text-sm text-gray-400 mb-2">
                            Enter the 6-digit code sent to:
                        </p>
                        <p className="text-sm font-bold text-[#1a3c8f] mb-7 truncate">{decodedEmail}</p>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* OTP Inputs */}
                            <div className="flex gap-3 justify-center" onPaste={handlePaste}>
                                {otp.map((digit, i) => (
                                    <motion.input
                                        key={i}
                                        ref={el => inputsRef.current[i] = el}
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={1}
                                        value={digit}
                                        onChange={e => handleChange(i, e.target.value)}
                                        onKeyDown={e => handleKeyDown(i, e)}
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ delay: i * 0.06 }}
                                        className={`w-12 h-14 text-center text-2xl font-extrabold border-2 rounded-xl focus:outline-none transition-all duration-200 ${
                                            digit
                                                ? 'border-[#1a3c8f] bg-blue-50 text-[#1a3c8f]'
                                                : 'border-gray-200 text-gray-900 focus:border-[#1a3c8f] focus:ring-2 focus:ring-blue-50'
                                        }`}
                                    />
                                ))}
                            </div>

                            <button
                                type="submit"
                                disabled={loading || otp.join('').length < 6}
                                className="w-full flex items-center justify-center gap-2 py-3 bg-[#1a3c8f] hover:bg-[#162f72] text-white font-bold rounded-xl transition-all duration-200 shadow-lg disabled:opacity-50 text-sm"
                            >
                                {loading ? (
                                    <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Verifying...</>
                                ) : (
                                    <><ShieldCheck size={16} /> Verify OTP</>
                                )}
                            </button>
                        </form>

                        <div className="mt-5 text-center">
                            <button
                                onClick={handleResend}
                                disabled={resending}
                                className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-[#1a3c8f] transition-colors mx-auto"
                            >
                                <RefreshCw size={13} className={resending ? 'animate-spin' : ''} />
                                {resending ? 'Resending...' : 'Resend OTP'}
                            </button>
                        </div>
                    </div>

                    <div className="bg-gray-50 border-t border-gray-100 px-8 py-4 text-center">
                        <p className="text-[11px] text-gray-400">🔒 OTP expires in 10 minutes &nbsp;|&nbsp; Demo OTP: 123456</p>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}

export default AdminOtpVerify
