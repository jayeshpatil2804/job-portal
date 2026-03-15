import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthLayout from '../../../../components/AuthLayout'
import api from '../../../../utils/api'
import toast from 'react-hot-toast'
import { Mail } from 'lucide-react'

const RecruiterForgotPassword = () => {
    const navigate = useNavigate()
    const [email, setEmail] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const response = await api.post('/recruiter/forgot-password', { workEmail: email })
            toast.success(response.data.message || 'OTP sent to your work email')
            navigate(`/recruiter/verify-otp/${email}`, { state: { purpose: 'reset-password' } })
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to send OTP')
        }
    }

    return (
        <AuthLayout 
            title="Reset Password" 
            subtitle="Enter your employer email address to receive a verification OTP"
            theme="orange"
        >
            <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Work Email</label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Mail className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="focus:ring-[#f97316] focus:border-[#f97316] block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2.5 outline-none border"
                            placeholder="you@company.com"
                        />
                    </div>
                </div>

                <div>
                    <button
                        type="submit"
                        className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#f97316] hover:bg-[#ea580c] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#f97316] transition-colors"
                    >
                        Send OTP
                    </button>
                </div>
            </form>

            <div className="mt-6 text-center">
                <Link
                    to="/recruiter/login"
                    className="font-medium text-sm text-[#f97316] hover:text-[#ea580c]"
                >
                    &larr; Back to login
                </Link>
            </div>
        </AuthLayout>
    )
}

export default RecruiterForgotPassword
