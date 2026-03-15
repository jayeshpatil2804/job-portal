import React, { useState } from 'react'
import DashboardLayout from '../../components/DashboardLayout'
import { User, GraduationCap, Briefcase, Award } from 'lucide-react'

const ProfilePage = () => {
    const [activeTab, setActiveTab] = useState('personal')

    const tabs = [
        { id: 'personal', label: 'Personal Details', icon: <User size={16} /> },
        { id: 'education', label: 'Education', icon: <GraduationCap size={16} /> },
        { id: 'experience', label: 'Experience', icon: <Briefcase size={16} /> },
        { id: 'skills', label: 'Skills', icon: <Award size={16} /> },
    ]

    return (
        <DashboardLayout>
            <div className="mb-8">
                <h1 className="text-3xl font-extrabold text-[#0f172a]">My Profile</h1>
                <p className="text-gray-500 mt-1">Manage your profile information</p>
            </div>

            {/* ── User Info Header Card ── */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col sm:flex-row items-center justify-between gap-6 mb-8">
                <div className="flex items-center gap-6">
                    {/* Avatar Placeholder */}
                    <div className="w-24 h-24 rounded-full bg-gray-100 border-2 border-white shadow-sm flex items-center justify-center shrink-0">
                        <User size={40} className="text-gray-400" />
                    </div>
                    
                    <div>
                        <h2 className="text-2xl font-extrabold text-gray-900 mb-1">Rahul Kumar</h2>
                        <p className="text-gray-600 font-medium mb-1">Textile Designer</p>
                        <p className="text-sm text-gray-400">Mumbai, Maharashtra</p>
                    </div>
                </div>

                <button className="border border-[#1a3c8f] text-[#1a3c8f] bg-white font-semibold text-sm px-6 py-2.5 rounded-md hover:bg-blue-50 transition-colors shadow-sm whitespace-nowrap">
                    Change Photo
                </button>
            </div>

            {/* ── Tabs Navigation ── */}
            <div className="border-b border-gray-200 mb-8">
                <ul className="flex overflow-x-auto hide-scrollbar gap-8">
                    {tabs.map((tab) => (
                        <li key={tab.id} className="shrink-0">
                            <button
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 pb-4 px-2 text-sm font-semibold transition-colors border-b-2 ${
                                    activeTab === tab.id
                                        ? 'border-[#1a3c8f] text-[#1a3c8f]'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                <span className={activeTab === tab.id ? 'text-[#1a3c8f]' : 'text-gray-400'}>
                                    {tab.icon}
                                </span>
                                {tab.label}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            {/* ── Tab Content Area ── */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                
                {activeTab === 'personal' && (
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-6">Personal Information</h3>
                        
                        <form>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                
                                {/* First Name */}
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-2">First Name</label>
                                    <input 
                                        type="text" 
                                        defaultValue="Rahul"
                                        className="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-md py-2.5 px-3 focus:outline-none focus:ring-1 focus:ring-[#1a3c8f] focus:border-[#1a3c8f] transition-shadow shadow-sm"
                                    />
                                </div>

                                {/* Last Name */}
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-2">Last Name</label>
                                    <input 
                                        type="text" 
                                        defaultValue="Kumar"
                                        className="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-md py-2.5 px-3 focus:outline-none focus:ring-1 focus:ring-[#1a3c8f] focus:border-[#1a3c8f] transition-shadow shadow-sm"
                                    />
                                </div>

                                {/* Email */}
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-2">Email</label>
                                    <input 
                                        type="email" 
                                        defaultValue="rahul.kumar@email.com"
                                        className="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-md py-2.5 px-3 focus:outline-none focus:ring-1 focus:ring-[#1a3c8f] focus:border-[#1a3c8f] transition-shadow shadow-sm"
                                    />
                                </div>

                                {/* Phone */}
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-2">Phone</label>
                                    <input 
                                        type="tel" 
                                        defaultValue="+91 9876543210"
                                        className="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-md py-2.5 px-3 focus:outline-none focus:ring-1 focus:ring-[#1a3c8f] focus:border-[#1a3c8f] transition-shadow shadow-sm"
                                    />
                                </div>

                                {/* Date of Birth */}
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-2">Date of Birth</label>
                                    <input 
                                        type="text" 
                                        defaultValue="15-06-1995"
                                        className="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-md py-2.5 px-3 focus:outline-none focus:ring-1 focus:ring-[#1a3c8f] focus:border-[#1a3c8f] transition-shadow shadow-sm"
                                    />
                                </div>

                                {/* Gender */}
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-2">Gender</label>
                                    <select className="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-md py-2.5 px-3 focus:outline-none focus:ring-1 focus:ring-[#1a3c8f] focus:border-[#1a3c8f] transition-shadow shadow-sm appearance-none">
                                        <option>Male</option>
                                        <option>Female</option>
                                        <option>Other</option>
                                    </select>
                                </div>

                                {/* Address (Full Width) */}
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-semibold text-gray-600 mb-2">Address</label>
                                    <input 
                                        type="text" 
                                        defaultValue="123 Main Street"
                                        className="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-md py-2.5 px-3 focus:outline-none focus:ring-1 focus:ring-[#1a3c8f] focus:border-[#1a3c8f] transition-shadow shadow-sm"
                                    />
                                </div>

                                {/* City */}
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-2">City</label>
                                    <input 
                                        type="text" 
                                        defaultValue="Mumbai"
                                        className="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-md py-2.5 px-3 focus:outline-none focus:ring-1 focus:ring-[#1a3c8f] focus:border-[#1a3c8f] transition-shadow shadow-sm"
                                    />
                                </div>

                                {/* State / PIN Code Container */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-600 mb-2">State</label>
                                        <input 
                                            type="text" 
                                            defaultValue="Maharashtra"
                                            className="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-md py-2.5 px-3 focus:outline-none focus:ring-1 focus:ring-[#1a3c8f] focus:border-[#1a3c8f] transition-shadow shadow-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-600 mb-2">PIN Code</label>
                                        <input 
                                            type="text" 
                                            defaultValue="400001"
                                            className="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-md py-2.5 px-3 focus:outline-none focus:ring-1 focus:ring-[#1a3c8f] focus:border-[#1a3c8f] transition-shadow shadow-sm"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Form Actions */}
                            <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-end gap-4">
                                <button type="button" className="border border-[#1a3c8f] text-[#1a3c8f] bg-white font-semibold text-sm px-6 py-2.5 rounded-md hover:bg-blue-50 transition-colors shadow-sm">
                                    Cancel
                                </button>
                                <button type="button" className="bg-[#1a3c8f] text-white font-semibold text-sm px-6 py-2.5 rounded-md hover:bg-[#162f72] transition-colors shadow-sm">
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {activeTab !== 'personal' && (
                    <div className="py-12 text-center text-gray-500">
                        Content for {tabs.find(t => t.id === activeTab)?.label} will go here.
                    </div>
                )}

            </div>
        </DashboardLayout>
    )
}

export default ProfilePage
