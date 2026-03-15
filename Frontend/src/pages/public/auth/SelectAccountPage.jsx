import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { User, Briefcase, Check } from 'lucide-react'

const SelectAccountPage = () => {
    const navigate = useNavigate()

    return (
        <div className="min-h-screen bg-[#1a3c8f] flex flex-col items-center justify-center p-4">
            
            <div className="text-center mb-10">
                <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2">Welcome to LOSODHAN</h1>
                <p className="text-blue-200">Choose your account type to continue</p>
            </div>

            <div className="flex flex-col md:flex-row gap-6 max-w-4xl w-full">
                
                {/* ── Candidate Card ── */}
                <div className="bg-white rounded-xl p-8 flex-1 flex flex-col items-center text-center shadow-2xl relative overflow-hidden group hover:-translate-y-1 transition-transform">
                    {/* Background decoration */}
                    <div className="absolute top-0 left-0 w-full h-2 bg-[#1a3c8f]" />
                    
                    <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center mb-6 mt-2">
                        <User size={32} className="text-[#1a3c8f]" />
                    </div>
                    
                    <h2 className="text-2xl font-extrabold text-gray-900 mb-3">Candidate</h2>
                    <p className="text-gray-500 text-sm mb-8 px-4">
                        Looking for your dream job in the textile industry? Create a profile and start applying today.
                    </p>

                    <div className="w-full space-y-3 mb-8 text-left px-4">
                        <div className="flex items-center gap-3">
                            <Check size={16} className="text-green-500 shrink-0" />
                            <span className="text-gray-600 text-sm">Search thousands of textile jobs</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Check size={16} className="text-green-500 shrink-0" />
                            <span className="text-gray-600 text-sm">Apply with one click</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Check size={16} className="text-green-500 shrink-0" />
                            <span className="text-gray-600 text-sm">Track your applications</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Check size={16} className="text-green-500 shrink-0" />
                            <span className="text-gray-600 text-sm">Get hired by top companies</span>
                        </div>
                    </div>

                    <button 
                        onClick={() => navigate('/candidate/login')}
                        className="mt-auto w-full bg-[#1a3c8f] text-white font-bold py-3.5 rounded-lg hover:bg-[#162f72] transition-colors shadow-md"
                    >
                        Continue as Candidate
                    </button>
                </div>

                {/* ── Recruiter Card ── */}
                <div className="bg-white rounded-xl p-8 flex-1 flex flex-col items-center text-center shadow-2xl relative overflow-hidden group hover:-translate-y-1 transition-transform">
                    {/* Background decoration */}
                    <div className="absolute top-0 left-0 w-full h-2 bg-[#f97316]" />
                    
                    <div className="w-20 h-20 rounded-full bg-orange-50 flex items-center justify-center mb-6 mt-2">
                        <Briefcase size={32} className="text-[#f97316]" />
                    </div>
                    
                    <h2 className="text-2xl font-extrabold text-gray-900 mb-3">Recruiter</h2>
                    <p className="text-gray-500 text-sm mb-8 px-4">
                        Looking to hire talented textile professionals? Post jobs and find the perfect candidates.
                    </p>

                    <div className="w-full space-y-3 mb-8 text-left px-4">
                        <div className="flex items-center gap-3">
                            <Check size={16} className="text-[#f97316] shrink-0" />
                            <span className="text-gray-600 text-sm">Post unlimited jobs</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Check size={16} className="text-[#f97316] shrink-0" />
                            <span className="text-gray-600 text-sm">Access qualified candidates</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Check size={16} className="text-[#f97316] shrink-0" />
                            <span className="text-gray-600 text-sm">Manage applications easily</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Check size={16} className="text-[#f97316] shrink-0" />
                            <span className="text-gray-600 text-sm">Schedule interviews online</span>
                        </div>
                    </div>

                    <button 
                        onClick={() => navigate('/recruiter/login')}
                        className="mt-auto w-full bg-[#f97316] text-white font-bold py-3.5 rounded-lg hover:bg-[#ea580c] transition-colors shadow-md"
                    >
                        Continue as Recruiter
                    </button>
                </div>

            </div>

            <Link to="/" className="text-blue-200 mt-10 text-sm hover:text-white transition-colors flex items-center gap-2">
                &larr; Back to Home
            </Link>

        </div>
    )
}

export default SelectAccountPage
