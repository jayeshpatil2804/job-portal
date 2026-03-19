import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import DashboardLayout from '../../components/DashboardLayout'
import { User, GraduationCap, Briefcase, Award } from 'lucide-react'
import { fetchProfile, updateCandidateProfile } from '../../redux/actions/profileActions'
import toast from 'react-hot-toast'

const ProfilePage = () => {
    const dispatch = useDispatch()
    const { data: profile, loading } = useSelector((state) => state.profile)
    const { user } = useSelector((state) => state.auth)
    const [activeTab, setActiveTab] = useState('personal')

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        mobile: '',
        dob: '',
        gender: 'Male',
        address: '',
        city: '',
        state: '',
        pinCode: '',
        qualification: '',
        college: '',
        passingYear: '',
        isExperienced: false,
        companyName: '',
        designation: '',
        yearsOfExp: '',
        skills: ''
    })

    useEffect(() => {
        dispatch(fetchProfile())
    }, [dispatch])

    useEffect(() => {
        if (profile && profile.candidate) {
            const nameParts = (profile.candidate.fullName || '').split(' ')
            setFormData({
                firstName: nameParts[0] || '',
                lastName: nameParts.slice(1).join(' ') || '',
                email: profile.candidate.email || '',
                mobile: profile.candidate.mobile || '',
                dob: profile.dob || '',
                gender: profile.gender || 'Male',
                address: profile.address || '',
                city: profile.city || '',
                state: profile.state || '',
                pinCode: profile.pinCode || '',
                qualification: profile.qualification || '',
                college: profile.college || '',
                passingYear: profile.passingYear || '',
                isExperienced: profile.isExperienced || false,
                companyName: profile.companyName || '',
                designation: profile.designation || '',
                yearsOfExp: profile.yearsOfExp || '',
                skills: profile.skills || ''
            })
        }
    }, [profile])

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const submitData = {
                ...formData,
                fullName: `${formData.firstName} ${formData.lastName}`.trim()
            }
            delete submitData.firstName
            delete submitData.lastName

            await dispatch(updateCandidateProfile(submitData)).unwrap()
            toast.success('Profile updated successfully!')
        } catch (error) {
            toast.error(error || 'Failed to update profile')
        }
    }

    const tabs = [
        { id: 'personal', label: 'Personal Details', icon: <User size={16} /> },
        { id: 'education', label: 'Education', icon: <GraduationCap size={16} /> },
        { id: 'experience', label: 'Experience', icon: <Briefcase size={16} /> },
        { id: 'skills', label: 'Skills', icon: <Award size={16} /> },
    ]

    if (loading && !profile?.candidate) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center h-64">
                    <div className="w-8 h-8 border-4 border-[#1a3c8f] border-t-transparent rounded-full animate-spin"></div>
                </div>
            </DashboardLayout>
        )
    }

    return (
        <DashboardLayout>
            <div className="mb-8">
                <h1 className="text-3xl font-extrabold text-[#0f172a]">My Profile</h1>
                <p className="text-gray-500 mt-1">Manage your profile information</p>
            </div>

            {/* ── User Info Header Card ── */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col sm:flex-row items-center justify-between gap-6 mb-8">
                <div className="flex items-center gap-6">
                    <div className="w-24 h-24 rounded-full bg-gray-100 border-2 border-white shadow-sm flex items-center justify-center shrink-0 overflow-hidden">
                        {profile?.candidate?.fullName ? (
                             <div className="w-full h-full flex items-center justify-center bg-[#1a3c8f] text-white text-3xl font-bold">
                                {profile.candidate.fullName.charAt(0)}
                             </div>
                        ) : (
                            <User size={40} className="text-gray-400" />
                        )}
                    </div>
                    
                    <div>
                        <h2 className="text-2xl font-extrabold text-gray-900 mb-1">{profile?.candidate?.fullName || user?.fullName || 'User'}</h2>
                        <p className="text-gray-600 font-medium mb-1">
                            {profile?.designation || (user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1).toLowerCase() : 'User')}
                        </p>
                        <p className="text-sm text-gray-400">{profile?.city ? `${profile.city}, ${profile.state}` : 'Location not set'}</p>
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
                <form onSubmit={handleSubmit}>
                    {activeTab === 'personal' && (
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-6">Personal Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-2">First Name</label>
                                    <input 
                                        type="text" 
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleInputChange}
                                        className="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-md py-2.5 px-3 focus:outline-none focus:ring-1 focus:ring-[#1a3c8f] focus:border-[#1a3c8f] transition-shadow shadow-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-2">Last Name</label>
                                    <input 
                                        type="text" 
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleInputChange}
                                        className="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-md py-2.5 px-3 focus:outline-none focus:ring-1 focus:ring-[#1a3c8f] focus:border-[#1a3c8f] transition-shadow shadow-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-2">Email</label>
                                    <input 
                                        type="email" 
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-md py-2.5 px-3 focus:outline-none focus:ring-1 focus:ring-[#1a3c8f] focus:border-[#1a3c8f] transition-shadow shadow-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-2">Phone</label>
                                    <input 
                                        type="tel" 
                                        name="mobile"
                                        value={formData.mobile}
                                        onChange={handleInputChange}
                                        className="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-md py-2.5 px-3 focus:outline-none focus:ring-1 focus:ring-[#1a3c8f] focus:border-[#1a3c8f] transition-shadow shadow-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-2">Date of Birth</label>
                                    <input 
                                        type="text" 
                                        name="dob"
                                        value={formData.dob}
                                        onChange={handleInputChange}
                                        placeholder="DD-MM-YYYY"
                                        className="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-md py-2.5 px-3 focus:outline-none focus:ring-1 focus:ring-[#1a3c8f] focus:border-[#1a3c8f] transition-shadow shadow-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-2">Gender</label>
                                    <select 
                                        name="gender"
                                        value={formData.gender}
                                        onChange={handleInputChange}
                                        className="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-md py-2.5 px-3 focus:outline-none focus:ring-1 focus:ring-[#1a3c8f] focus:border-[#1a3c8f] transition-shadow shadow-sm appearance-none"
                                    >
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-semibold text-gray-600 mb-2">Address</label>
                                    <input 
                                        type="text" 
                                        name="address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        className="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-md py-2.5 px-3 focus:outline-none focus:ring-1 focus:ring-[#1a3c8f] focus:border-[#1a3c8f] transition-shadow shadow-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-2">City</label>
                                    <input 
                                        type="text" 
                                        name="city"
                                        value={formData.city}
                                        onChange={handleInputChange}
                                        className="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-md py-2.5 px-3 focus:outline-none focus:ring-1 focus:ring-[#1a3c8f] focus:border-[#1a3c8f] transition-shadow shadow-sm"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-600 mb-2">State</label>
                                        <input 
                                            type="text" 
                                            name="state"
                                            value={formData.state}
                                            onChange={handleInputChange}
                                            className="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-md py-2.5 px-3 focus:outline-none focus:ring-1 focus:ring-[#1a3c8f] focus:border-[#1a3c8f] transition-shadow shadow-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-600 mb-2">PIN Code</label>
                                        <input 
                                            type="text" 
                                            name="pinCode"
                                            value={formData.pinCode}
                                            onChange={handleInputChange}
                                            className="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-md py-2.5 px-3 focus:outline-none focus:ring-1 focus:ring-[#1a3c8f] focus:border-[#1a3c8f] transition-shadow shadow-sm"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'education' && (
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-6">Education Details</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-2">Highest Qualification</label>
                                    <input 
                                        type="text" 
                                        name="qualification"
                                        value={formData.qualification}
                                        onChange={handleInputChange}
                                        placeholder="e.g. B.Tech, MBA"
                                        className="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-md py-2.5 px-3 focus:outline-none focus:ring-1 focus:ring-[#1a3c8f] focus:border-[#1a3c8f] transition-shadow shadow-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-2">College/University</label>
                                    <input 
                                        type="text" 
                                        name="college"
                                        value={formData.college}
                                        onChange={handleInputChange}
                                        className="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-md py-2.5 px-3 focus:outline-none focus:ring-1 focus:ring-[#1a3c8f] focus:border-[#1a3c8f] transition-shadow shadow-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-2">Passing Year</label>
                                    <input 
                                        type="text" 
                                        name="passingYear"
                                        value={formData.passingYear}
                                        onChange={handleInputChange}
                                        className="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-md py-2.5 px-3 focus:outline-none focus:ring-1 focus:ring-[#1a3c8f] focus:border-[#1a3c8f] transition-shadow shadow-sm"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'experience' && (
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-6">Work Experience</h3>
                            <div className="mb-6">
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        name="isExperienced"
                                        checked={formData.isExperienced}
                                        onChange={handleInputChange}
                                        className="w-4 h-4 text-[#1a3c8f] border-gray-300 rounded focus:ring-[#1a3c8f]"
                                    />
                                    <span className="text-sm font-semibold text-gray-700">I have work experience</span>
                                </label>
                            </div>
                            
                            {formData.isExperienced && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-600 mb-2">Current/Last Company</label>
                                        <input 
                                            type="text" 
                                            name="companyName"
                                            value={formData.companyName}
                                            onChange={handleInputChange}
                                            className="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-md py-2.5 px-3 focus:outline-none focus:ring-1 focus:ring-[#1a3c8f] focus:border-[#1a3c8f] transition-shadow shadow-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-600 mb-2">Designation</label>
                                        <input 
                                            type="text" 
                                            name="designation"
                                            value={formData.designation}
                                            onChange={handleInputChange}
                                            className="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-md py-2.5 px-3 focus:outline-none focus:ring-1 focus:ring-[#1a3c8f] focus:border-[#1a3c8f] transition-shadow shadow-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-600 mb-2">Years of Experience</label>
                                        <input 
                                            type="text" 
                                            name="yearsOfExp"
                                            value={formData.yearsOfExp}
                                            onChange={handleInputChange}
                                            className="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-md py-2.5 px-3 focus:outline-none focus:ring-1 focus:ring-[#1a3c8f] focus:border-[#1a3c8f] transition-shadow shadow-sm"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'skills' && (
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-6">Skills</h3>
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-2">Key Skills (Comma separated)</label>
                                <textarea 
                                    name="skills"
                                    value={formData.skills}
                                    onChange={handleInputChange}
                                    rows="4"
                                    placeholder="e.g. React, Node.js, Design, Management"
                                    className="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-md py-2.5 px-3 focus:outline-none focus:ring-1 focus:ring-[#1a3c8f] focus:border-[#1a3c8f] transition-shadow shadow-sm"
                                ></textarea>
                            </div>
                        </div>
                    )}

                    {/* Form Actions */}
                    <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-end gap-4">
                        <button 
                            type="button" 
                            onClick={() => dispatch(fetchProfile())}
                            className="border border-[#1a3c8f] text-[#1a3c8f] bg-white font-semibold text-sm px-6 py-2.5 rounded-md hover:bg-blue-50 transition-colors shadow-sm"
                        >
                            Reset
                        </button>
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="bg-[#1a3c8f] text-white font-semibold text-sm px-6 py-2.5 rounded-md hover:bg-[#162f72] transition-colors shadow-sm disabled:opacity-50"
                        >
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </DashboardLayout>
    )
}

export default ProfilePage
