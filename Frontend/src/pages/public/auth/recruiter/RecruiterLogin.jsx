import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import AuthLayout from '../../../../components/AuthLayout'
import FormInput from '../../../../components/FormInput'
import api from '../../../../utils/api'
import toast from 'react-hot-toast'
import { Mail, Lock } from 'lucide-react'
import { supabase } from '../../../../utils/supabase'

const RecruiterLogin = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Recruiter backend expects workEmail
            const loginData = {
                workEmail: formData.email,
                password: formData.password
            };
            const response = await api.post('/recruiter/login', loginData);
            toast.success(response.data.message || 'Login successful!');
            navigate('/dashboard');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Login failed. Please try again.');
        }
    };

    const handleGoogleLogin = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${import.meta.env.VITE_GOOGLE_CALLBACK_URL}?role=RECRUITER`,
                flowType: 'pkce'
            }
        });
        if (error) toast.error(error.message);
    };

    return (
        <AuthLayout 
            title="Recruiter Login" 
            subtitle="Sign in to your employer account"
            theme="orange"
        >
            <form onSubmit={handleSubmit} className="space-y-5">
                <FormInput 
                    label="Work Email"
                    name="email"
                    type="email"
                    icon={Mail}
                    placeholder="you@company.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    theme="orange"
                />

                <FormInput 
                    label="Password"
                    name="password"
                    type="password"
                    icon={Lock}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    theme="orange"
                />

                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <input
                            id="remember-me"
                            name="remember-me"
                            type="checkbox"
                            className="h-4 w-4 text-[#f97316] focus:ring-[#f97316] border-gray-300 rounded border"
                        />
                        <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                            Remember me
                        </label>
                    </div>

                    <div className="text-sm">
                        <Link to="/recruiter/forgot-password" className="font-medium text-[#f97316] hover:text-[#ea580c]">
                            Forgot your password?
                        </Link>
                    </div>
                </div>

                <div>
                    <button
                        type="submit"
                        className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#f97316] hover:bg-[#ea580c] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#f97316] transition-colors"
                    >
                        Sign in
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
                        Sign in with Google
                    </button>
                </div>
            </div>

            <div className="mt-6">
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">Don't have an employer account?</span>
                    </div>
                </div>

                <div className="mt-6">
                    <Link
                        to="/recruiter/signup"
                        className="w-full flex justify-center py-2.5 px-4 border border-[#f97316] rounded-md shadow-sm text-sm font-medium text-[#f97316] bg-white hover:bg-orange-50 transition-colors"
                    >
                        Sign up as Recruiter
                    </Link>
                </div>
            </div>
        </AuthLayout>
    )
}

export default RecruiterLogin
