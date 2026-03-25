import React, { useState } from 'react'
import { useNavigate, useLocation, useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import AuthLayout from '../../../../components/AuthLayout'
import api from '../../../../utils/api'
import toast from 'react-hot-toast'
import { KeyRound } from 'lucide-react'
import { verifyCandidateOtp } from '../../../../redux/actions/authActions'

const CandidateOtpVerify = () => {
    const [otp, setOtp] = useState(['', '', '', '', '', '']) 
    const { email } = useParams()
    const navigate = useNavigate()
    const location = useLocation()
    const dispatch = useDispatch()

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
            } else if (result.user?.isProfileCompleted) {
                navigate('/dashboard')
            } else {
                navigate('/candidate/complete-profile')
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

            <div className="mt-8 text-center text-sm">
                <p className="text-gray-500 mb-2">Didn't receive the code?</p>
                <button 
                    onClick={handleResend}
                    className="font-medium text-[#1a3c8f] hover:text-[#162f72]"
                >
                    Resend Code
                </button>
            </div>
        </AuthLayout>
    )
}

export default CandidateOtpVerify
