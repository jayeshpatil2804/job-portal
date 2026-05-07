import React, { useState } from 'react'
import { useNavigate, useLocation, useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import AuthLayout from '../../../../components/AuthLayout'
import api from '../../../../utils/api'
import toast from 'react-hot-toast'
import { KeyRound, MessageCircle, Phone, MessageSquare } from 'lucide-react'
import { verifyCandidateOtp } from '../../../../redux/actions/authActions'

const CandidateOtpVerify = () => {
    const [otp, setOtp] = useState(['', '', '', '', '', '']) 
    const { email } = useParams()
    const navigate = useNavigate()
    const location = useLocation()
    const dispatch = useDispatch()

    const whatsappLink = "https://wa.me/918140411130?text=Hello%20Admin,%20I%20just%20signed%20up%20on%20Losodhan%20Portal.%20Please%20provide%20my%20OTP%20for%20email:%20" + encodeURIComponent(email || '');

    const handleChange = (element, index) => {
        if (isNaN(element.value)) return false

        setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))])

        // Focus next input
        if (element.nextSibling && element.value !== '') {
            element.nextSibling.focus()
        }
    }

    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace') {
            if (otp[index] === '' && e.target.previousSibling) {
                e.target.previousSibling.focus()
            }
        }
    }

    const handlePaste = (e) => {
        const pasteData = e.clipboardData.getData('text').slice(0, 6).split('')
        const newOtp = [...otp]
        
        pasteData.forEach((char, index) => {
            if (index < 6 && !isNaN(char)) {
                newOtp[index] = char
            }
        })
        
        setOtp(newOtp)

        // Focus the last filled input or the first empty one
        const nextIndex = Math.min(pasteData.length, 5)
        const inputs = e.target.parentElement.querySelectorAll('input')
        if (inputs[nextIndex]) {
            inputs[nextIndex].focus()
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const otpCode = otp.join('')
        if (otpCode.length < 6) {
            toast.error('Please enter complete OTP')
            return
        }

        try {
            const result = await dispatch(verifyCandidateOtp({ email, otp: otpCode })).unwrap();
            toast.success(result.message || 'OTP Verified!')
            
            if (location.state?.purpose === 'reset-password') {
                navigate('/candidate/reset-password', { state: { email, otp: otpCode } })
            } else {
                navigate('/profile')
            }
        } catch (error) {
            toast.error(error.message || 'Verification failed')
        }
    }

    const handleResend = async () => {
        if (!email) {
            toast.error('Email not found. Please try signing up again.')
            return
        }
        try {
            const response = await api.post('/candidate/resend-otp', { email })
            toast.success(response.data.message || 'OTP Resent!')
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to resend OTP')
        }
    }

    return (
        <AuthLayout 
            title="Verify OTP" 
            subtitle={<>We sent a code to <span className="font-semibold text-gray-900">{email}</span></>}
            theme="blue"
        >
            <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="flex justify-center flex-col items-center gap-4">
                    <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-2">
                        <KeyRound size={28} className="text-[#1a3c8f]" />
                    </div>
                    
                    <div className="flex gap-3 justify-center">
                        {otp.map((data, index) => (
                            <input
                                className="w-12 h-14 text-center text-xl font-bold bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a3c8f] focus:border-[#1a3c8f] transition-all"
                                type="text"
                                name="otp"
                                maxLength="1"
                                key={index}
                                value={data}
                                onChange={e => handleChange(e.target, index)}
                                onKeyDown={e => handleKeyDown(e, index)}
                                onPaste={handlePaste}
                                onFocus={e => e.target.select()}
                            />
                        ))}
                    </div>
                </div>

                <div>
                    <button
                        type="submit"
                        className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#1a3c8f] hover:bg-[#162f72] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1a3c8f] transition-colors mt-8"
                    >
                        Verify & Continue
                    </button>
                </div>
            </form>

            <div className="mt-8 text-center">
                <p className="text-sm text-gray-500">
                    Didn't receive code?{' '}
                    <button 
                        type="button"
                        onClick={handleResend}
                        className="text-[#1a3c8f] font-bold hover:underline"
                    >
                        Resend OTP
                    </button>
                </p>
            </div>

            <div className="mt-8 space-y-4">
                <div className="relative">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
                    <div className="relative flex justify-center"><span className="bg-white px-4 text-[10px] font-black text-gray-300 uppercase tracking-widest">Contact Admin for OTP</span></div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <a 
                        href={whatsappLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 py-3 bg-green-50 text-green-700 rounded-xl font-bold text-xs hover:bg-green-100 transition-colors border border-green-100"
                    >
                        <MessageSquare size={16} />
                        WhatsApp
                    </a>
                    <a 
                        href="tel:+918140411130"
                        className="flex items-center justify-center gap-2 py-3 bg-blue-50 text-[#1a3c8f] rounded-xl font-bold text-xs hover:bg-blue-100 transition-colors border border-blue-100"
                    >
                        <Phone size={16} />
                        Call
                    </a>
                </div>
            </div>
        </AuthLayout>
    )
}

export default CandidateOtpVerify
