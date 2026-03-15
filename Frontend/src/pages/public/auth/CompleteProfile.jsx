import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import AuthLayout from '../../../components/AuthLayout'
import { supabase } from '../../../utils/supabase'
import api from '../../../utils/api'
import toast from 'react-hot-toast'
import { Phone, Lock, Briefcase } from 'lucide-react'
import { useDispatch } from 'react-redux'
import { setUser } from '../../../redux/slices/authSlice'
import FormInput from '../../../components/FormInput'

const CompleteProfile = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const { user, role } = location.state || {};

    const [formData, setFormData] = useState({
        mobile: '',
        password: '',
        confirmPassword: '',
        companyName: ''
    });

    const isRecruiter = role === 'RECRUITER';

    if (!user) {
        navigate('/login');
        return null;
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (formData.password !== formData.confirmPassword) {
            return toast.error('Passwords do not match');
        }

        try {
            const response = await api.post('/users/complete-profile', {
                id: user.id,
                role: user.role,
                mobile: formData.mobile,
                password: formData.password,
                companyName: formData.companyName
            });

            // Update Redux state with the completed user
            if (response.data.status === 'success') {
                const completedUser = response.data.user;
                dispatch(setUser(completedUser));
                
                toast.success('Basic profile setup completed!');
                
                // Role-specific redirection
                if (completedUser.role === 'RECRUITER') {
                    navigate('/recruiter/complete-profile', { replace: true });
                } else {
                    navigate('/candidate/complete-profile', { replace: true });
                }
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to complete profile');
        }
    };

    return (
        <AuthLayout 
            title="Complete Your Profile" 
            subtitle={`Just a few more details to set up your ${role?.toLowerCase()} account`}
            theme={isRecruiter ? "orange" : "blue"}
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                {isRecruiter && (
                    <FormInput 
                        label="Company Name"
                        name="companyName"
                        icon={Briefcase}
                        placeholder="Acme Corp"
                        value={formData.companyName}
                        onChange={handleChange}
                        required
                        theme="orange"
                    />
                )}

                <FormInput 
                    label="Mobile Number"
                    name="mobile"
                    type="tel"
                    icon={Phone}
                    placeholder="+91 98765 43210"
                    value={formData.mobile}
                    onChange={handleChange}
                    required
                    theme={isRecruiter ? "orange" : "blue"}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormInput 
                        label="Set Password"
                        name="password"
                        type="password"
                        icon={Lock}
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        theme={isRecruiter ? "orange" : "blue"}
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
                        theme={isRecruiter ? "orange" : "blue"}
                    />
                </div>

                <div className="mt-6">
                    <button
                        type="submit"
                        className={`w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white transition-colors ${
                            isRecruiter ? 'bg-[#f97316] hover:bg-[#ea580c]' : 'bg-[#1a3c8f] hover:bg-[#162f72]'
                        }`}
                    >
                        Complete Setup
                    </button>
                </div>
            </form>
        </AuthLayout>
    );
};

export default CompleteProfile;
