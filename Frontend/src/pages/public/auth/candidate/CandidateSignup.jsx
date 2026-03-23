import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import AuthLayout from '../../../../components/AuthLayout'
import FormInput from '../../../../components/FormInput'
import api from '../../../../utils/api'
import toast from 'react-hot-toast'
import { User, Mail, Phone, Lock } from 'lucide-react'
import { supabase } from '../../../../utils/supabase'

const CandidateSignup = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        mobile: '',
        password: '',
        confirmPassword: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Remove confirmPassword and sanitize mobile
            const { confirmPassword, ...submitData } = formData;
            const sanitizedData = {
                ...submitData,
                mobile: submitData.mobile.replace(/\D/g, '') // Keep only digits
            };
            
            const response = await api.post('/candidate/signup', sanitizedData);
            toast.success(response.data.message || 'Signup successful!');
            navigate(`/candidate/verify-otp/${formData.email}`);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Signup failed. Please try again.');
        }
    };

    const handleGoogleLogin = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${import.meta.env.VITE_GOOGLE_CALLBACK_URL}?role=CANDIDATE`,
                flowType: 'pkce'
            }
        });
        if (error) toast.error(error.message);
    };

    return (
        <AuthLayout 
            title="Candidate Registration" 
            subtitle="Create your profile to start applying to jobs"
            theme="blue"
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormInput 
                        label="Full Name"
                        name="fullName"
                        icon={User}
                        placeholder="John Doe"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                        theme="blue"
                    />

                    <FormInput 
                        label="Mobile Number"
                        name="mobile"
                        type="tel"
                        icon={Phone}
                        placeholder="+91 98765 43210"
                        value={formData.mobile}
                        onChange={handleChange}
                        required
                        theme="blue"
                    />
                </div>

                <FormInput 
                    label="Email address"
                    name="email"
                    type="email"
                    icon={Mail}
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    theme="blue"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormInput 
                        label="Password"
                        name="password"
                        type="password"
                        icon={Lock}
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        theme="blue"
                    />
                    
                    <FormInput 
                        label="Confirm Password"
                        name="confirmPassword"
                        type="password"
                        icon={Lock}
                        placeholder="••••••••"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        theme="blue"
                    />
                </div>

                <div>
                    <button
                        type="submit"
                        className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#1a3c8f] hover:bg-[#162f72] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1a3c8f] transition-colors"
                    >
                        Create Account
                    </button>
                </div>
            </form>

            <div className="mt-6">
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">Or continue with</span>
                    </div>
                </div>

                <div className="mt-6">
                    <button
                        type="button"
                        onClick={handleGoogleLogin}
                        className="w-full flex justify-center items-center gap-2 py-2.5 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                    >
                        <svg className="h-5 w-5" viewBox="0 0 24 24">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                        Sign up with Google
                    </button>
                </div>
            </div>

            <div className="mt-6">
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">Already have an account?</span>
                    </div>
                </div>

                <div className="mt-6 text-center">
                    <Link
                        to="/candidate/login"
                        className="font-medium text-[#1a3c8f] hover:text-[#162f72]"
                    >
                        Sign in instead
                    </Link>
                </div>
            </div>
        </AuthLayout>
    )
}

export default CandidateSignup
