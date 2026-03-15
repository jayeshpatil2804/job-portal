import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import AuthLayout from '../../../../components/AuthLayout'
import api from '../../../../utils/api'
import toast from 'react-hot-toast'
import { Lock } from 'lucide-react'

const CandidateResetPassword = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const [formData, setFormData] = useState({
        newPassword: '',
        confirmPassword: ''
    })

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (formData.newPassword !== formData.confirmPassword) {
            toast.error('Passwords do not match')
            return
        }

        const email = location.state?.email
        const otp = location.state?.otp

        if (!email || !otp) {
            toast.error('Session expired. Please try again.')
            navigate('/candidate/forgot-password')
            return
        }

        try {
            const response = await api.post('/candidate/reset-password', {
                email,
                otp,
                newPassword: formData.newPassword
            })
            toast.success(response.data.message || 'Password reset successful!')
            navigate('/candidate/login')
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to reset password')
        }
    }

    return (
        <AuthLayout 
            title="Set New Password" 
            subtitle="Enter your new candidate password below"
            theme="blue"
        >
            <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                    <label className="block text-sm font-medium text-gray-700">New Password</label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="password"
                            required
                            value={formData.newPassword}
                            onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                            className="focus:ring-[#1a3c8f] focus:border-[#1a3c8f] block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2.5 outline-none border"
                            placeholder="••••••••"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="password"
                            required
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                            className="focus:ring-[#1a3c8f] focus:border-[#1a3c8f] block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2.5 outline-none border"
                            placeholder="••••••••"
                        />
                    </div>
                </div>

                <div>
                    <button
                        type="submit"
                        className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#1a3c8f] hover:bg-[#162f72] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1a3c8f] transition-colors"
                    >
                        Save New Password
                    </button>
                </div>
            </form>

            <div className="mt-6 text-center">
                <Link
                    to="/candidate/login"
                    className="font-medium text-sm text-[#1a3c8f] hover:text-[#162f72]"
                >
                    &larr; Back to login
                </Link>
            </div>
        </AuthLayout>
    )
}

export default CandidateResetPassword
