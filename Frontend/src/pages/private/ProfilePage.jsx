import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import DashboardLayout from '../../components/DashboardLayout'
import { User, GraduationCap, Briefcase, Award, Save, RotateCcw, Camera, MapPin, Mail, Phone as PhoneIcon, ArrowRight } from 'lucide-react'
import { fetchProfile, updateCandidateProfile } from '../../redux/actions/profileActions'
import toast from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'
import { useMountTimer } from '../../hooks/useMountTimer'

const ProfilePage = () => {
    useMountTimer('ProfilePage')
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
        { id: 'personal', label: 'Overview', icon: <User size={18} /> },
        { id: 'education', label: 'Education', icon: <GraduationCap size={18} /> },
        { id: 'experience', label: 'Experience', icon: <Briefcase size={18} /> },
        { id: 'skills', label: 'Skills', icon: <Award size={18} /> },
    ]

    if (loading && !profile?.candidate) {
        return (
            <DashboardLayout>
               <div className="flex items-center justify-center h-[60vh]">
                    <div className="relative">
                        <div className="w-12 h-12 border-4 border-blue-100 rounded-full"></div>
                        <div className="w-12 h-12 border-4 border-[#1a3c8f] border-t-transparent rounded-full animate-spin absolute top-0"></div>
                    </div>
                </div>
            </DashboardLayout>
        )
    }

    const inputClasses = "w-full bg-white border border-gray-200 text-gray-900 text-sm rounded-2xl py-3.5 px-4 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#1a3c8f] transition-all shadow-sm font-medium"
    const labelClasses = "block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1"

    return (
        <DashboardLayout>
            <div className="max-w-5xl mx-auto space-y-8 pb-10">
                {/* ── Page Header ── */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-[#0f172a] tracking-tight">Profile Settings</h1>
                        <p className="text-gray-500 font-medium">Manage your public and private informations</p>
                    </div>
                </div>

                {/* ── Profile Header Card ── */}
                <div className="bg-white rounded-[2.5rem] shadow-xl shadow-blue-900/5 border border-gray-100 p-8 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16 opacity-50"></div>
                    
                    <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                        <div className="relative group">
                            <div className="w-32 h-32 rounded-[2.5rem] bg-gradient-to-br from-[#1a3c8f] to-blue-500 p-1 shadow-lg">
                                <div className="w-full h-full rounded-[2.2rem] bg-white flex items-center justify-center overflow-hidden border-4 border-white">
                                    {profile?.candidate?.fullName ? (
                                        <div className="w-full h-full flex items-center justify-center bg-[#1a3c8f] text-white text-4xl font-black">
                                            {profile.candidate.fullName.charAt(0)}
                                        </div>
                                    ) : (
                                        <User size={48} className="text-gray-200" />
                                    )}
                                </div>
                            </div>
                            <button className="absolute bottom-0 right-0 bg-white p-2.5 rounded-2xl shadow-xl border border-gray-100 text-[#1a3c8f] hover:scale-110 transition-transform active:scale-95">
                                <Camera size={18} />
                            </button>
                        </div>
                        
                        <div className="text-center md:text-left space-y-1">
                            <h2 className="text-3xl font-black text-gray-900 leading-tight">
                                {profile?.candidate?.fullName || user?.fullName || 'Candidate'}
                            </h2>
                            <p className="text-[#1a3c8f] font-black text-xs uppercase tracking-widest opacity-80">
                                {profile?.designation || 'Fullstack Developer'}
                            </p>
                            <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-4 pt-2 border-t border-gray-50">
                                <div className="flex items-center gap-2 text-gray-400 text-xs font-bold">
                                    <MapPin size={14} className="text-[#1a3c8f]" />
                                    {profile?.city ? `${profile.city}, ${profile.state}` : 'Location hidden'}
                                </div>
                                <div className="flex items-center gap-2 text-gray-400 text-xs font-bold">
                                    <Mail size={14} className="text-[#1a3c8f]" />
                                    {profile?.candidate?.email || 'Email missing'}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 relative z-10">
                         <div className="bg-blue-50 px-6 py-3 rounded-2xl text-center hidden sm:block">
                            <p className="text-xl font-black text-[#1a3c8f]">65%</p>
                            <p className="text-[9px] font-black text-blue-300 uppercase tracking-widest">Strength</p>
                        </div>
                    </div>
                </div>

                {/* ── Tabs Navigation ── */}
                <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar p-1.5 bg-gray-100/50 rounded-2xl w-fit">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2.5 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                                activeTab === tab.id
                                    ? 'bg-white text-[#1a3c8f] shadow-sm active:scale-95'
                                    : 'text-gray-400 hover:text-gray-600'
                            }`}
                        >
                            <span className={activeTab === tab.id ? 'text-[#1a3c8f]' : 'text-gray-400'}>
                                {tab.icon}
                            </span>
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* ── Tab Content Area ── */}
                <motion.div 
                    layout
                    className="bg-white rounded-[2.5rem] shadow-xl shadow-blue-900/5 border border-gray-100 p-8 md:p-12 overflow-hidden"
                >
                    <form onSubmit={handleSubmit}>
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                transition={{ duration: 0.2 }}
                            >
                                {activeTab === 'personal' && (
                                    <div className="space-y-10">
                                        <div className="border-l-4 border-[#1a3c8f] pl-4">
                                            <h3 className="text-xl font-black text-gray-900">Personal Information</h3>
                                            <p className="text-sm font-medium text-gray-400">Basic details about your identity</p>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                                            <div>
                                                <label className={labelClasses}>First Name</label>
                                                <input 
                                                    type="text" 
                                                    name="firstName"
                                                    value={formData.firstName}
                                                    onChange={handleInputChange}
                                                    className={inputClasses}
                                                />
                                            </div>
                                            <div>
                                                <label className={labelClasses}>Last Name</label>
                                                <input 
                                                    type="text" 
                                                    name="lastName"
                                                    value={formData.lastName}
                                                    onChange={handleInputChange}
                                                    className={inputClasses}
                                                />
                                            </div>
                                            <div>
                                                <label className={labelClasses}>Email Address</label>
                                                <input 
                                                    type="email" 
                                                    name="email"
                                                    disabled
                                                    value={formData.email}
                                                    onChange={handleInputChange}
                                                    className={inputClasses + " bg-gray-50 cursor-not-allowed"}
                                                />
                                            </div>
                                            <div>
                                                <label className={labelClasses}>Phone Number</label>
                                                <input 
                                                    type="tel" 
                                                    name="mobile"
                                                    value={formData.mobile}
                                                    onChange={handleInputChange}
                                                    className={inputClasses}
                                                />
                                            </div>
                                            <div>
                                                <label className={labelClasses}>Date of Birth</label>
                                                <input 
                                                    type="text" 
                                                    name="dob"
                                                    value={formData.dob}
                                                    onChange={handleInputChange}
                                                    placeholder="DD-MM-YYYY"
                                                    className={inputClasses}
                                                />
                                            </div>
                                            <div>
                                                <label className={labelClasses}>Gender</label>
                                                <div className="relative">
                                                     <select 
                                                        name="gender"
                                                        value={formData.gender}
                                                        onChange={handleInputChange}
                                                        className={inputClasses + " appearance-none"}
                                                    >
                                                        <option value="Male">Male</option>
                                                        <option value="Female">Female</option>
                                                        <option value="Other">Other</option>
                                                    </select>
                                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                                         <ArrowRight size={14} className="rotate-90" />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className={labelClasses}>Permanent Address</label>
                                                <input 
                                                    type="text" 
                                                    name="address"
                                                    value={formData.address}
                                                    onChange={handleInputChange}
                                                    className={inputClasses}
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:col-span-2">
                                                <div>
                                                    <label className={labelClasses}>City</label>
                                                    <input 
                                                        type="text" 
                                                        name="city"
                                                        value={formData.city}
                                                        onChange={handleInputChange}
                                                        className={inputClasses}
                                                    />
                                                </div>
                                                <div>
                                                    <label className={labelClasses}>State</label>
                                                    <input 
                                                        type="text" 
                                                        name="state"
                                                        value={formData.state}
                                                        onChange={handleInputChange}
                                                        className={inputClasses}
                                                    />
                                                </div>
                                                <div className="col-span-2 md:col-span-1">
                                                    <label className={labelClasses}>PIN Code</label>
                                                    <input 
                                                        type="text" 
                                                        name="pinCode"
                                                        value={formData.pinCode}
                                                        onChange={handleInputChange}
                                                        className={inputClasses}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'education' && (
                                    <div className="space-y-10">
                                         <div className="border-l-4 border-orange-500 pl-4">
                                            <h3 className="text-xl font-black text-gray-900">Education Details</h3>
                                            <p className="text-sm font-medium text-gray-400">Your academic background</p>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                                            <div>
                                                <label className={labelClasses}>Highest Qualification</label>
                                                <input 
                                                    type="text" 
                                                    name="qualification"
                                                    value={formData.qualification}
                                                    onChange={handleInputChange}
                                                    placeholder="e.g. B.Tech, MBA"
                                                    className={inputClasses}
                                                />
                                            </div>
                                            <div>
                                                <label className={labelClasses}>College/University</label>
                                                <input 
                                                    type="text" 
                                                    name="college"
                                                    value={formData.college}
                                                    onChange={handleInputChange}
                                                    className={inputClasses}
                                                />
                                            </div>
                                            <div>
                                                <label className={labelClasses}>Passing Year</label>
                                                <input 
                                                    type="text" 
                                                    name="passingYear"
                                                    value={formData.passingYear}
                                                    onChange={handleInputChange}
                                                    className={inputClasses}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'experience' && (
                                    <div className="space-y-10">
                                         <div className="border-l-4 border-green-500 pl-4">
                                            <h3 className="text-xl font-black text-gray-900">Work Experience</h3>
                                            <p className="text-sm font-medium text-gray-400">Professional career history</p>
                                        </div>
                                        <div className="mb-10 p-6 bg-gray-50 rounded-[2rem] border border-gray-100">
                                            <label className="flex items-center gap-4 cursor-pointer">
                                                <div className="relative">
                                                    <input 
                                                        type="checkbox" 
                                                        name="isExperienced"
                                                        checked={formData.isExperienced}
                                                        onChange={handleInputChange}
                                                        className="sr-only p-4"
                                                    />
                                                    <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${formData.isExperienced ? 'bg-green-500 border-green-500' : 'bg-white border-gray-200'}`}>
                                                        {formData.isExperienced && <div className="w-2 h-2 bg-white rounded-full" />}
                                                    </div>
                                                </div>
                                                <span className="text-sm font-black text-gray-700 uppercase tracking-widest">I have work experience</span>
                                            </label>
                                        </div>
                                        
                                        {formData.isExperienced ? (
                                            <motion.div 
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8"
                                            >
                                                <div>
                                                    <label className={labelClasses}>Current/Last Company</label>
                                                    <input 
                                                        type="text" 
                                                        name="companyName"
                                                        value={formData.companyName}
                                                        onChange={handleInputChange}
                                                        className={inputClasses}
                                                    />
                                                </div>
                                                <div>
                                                    <label className={labelClasses}>Designation</label>
                                                    <input 
                                                        type="text" 
                                                        name="designation"
                                                        value={formData.designation}
                                                        onChange={handleInputChange}
                                                        className={inputClasses}
                                                    />
                                                </div>
                                                <div>
                                                    <label className={labelClasses}>Years of Experience</label>
                                                    <input 
                                                        type="text" 
                                                        name="yearsOfExp"
                                                        value={formData.yearsOfExp}
                                                        onChange={handleInputChange}
                                                        className={inputClasses}
                                                    />
                                                </div>
                                            </motion.div>
                                        ) : (
                                            <div className="p-10 text-center bg-gray-50/50 rounded-[2rem] border border-dashed border-gray-100">
                                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest italic">Check the box above if you have experience</p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {activeTab === 'skills' && (
                                    <div className="space-y-10">
                                         <div className="border-l-4 border-purple-500 pl-4">
                                            <h3 className="text-xl font-black text-gray-900">Key Skills</h3>
                                            <p className="text-sm font-medium text-gray-400">List your professional technical skills</p>
                                        </div>
                                        <div>
                                            <label className={labelClasses}>Core Competencies (Comma separated)</label>
                                            <textarea 
                                                name="skills"
                                                value={formData.skills}
                                                onChange={handleInputChange}
                                                rows="6"
                                                placeholder="e.g. React, Node.js, Design, Management"
                                                className={inputClasses + " resize-none"}
                                            ></textarea>
                                            <p className="mt-4 text-[10px] font-black text-gray-300 uppercase tracking-widest ml-1">Example: Adobe XD, Figma, React, Tailwind CSS</p>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>

                        {/* Form Actions */}
                        <div className="mt-16 pt-10 border-t border-gray-50 flex flex-wrap items-center justify-end gap-6">
                            <button 
                                type="button" 
                                onClick={() => dispatch(fetchProfile())}
                                className="flex items-center gap-2 text-gray-400 font-black text-[10px] uppercase tracking-widest hover:text-[#1a3c8f] transition-colors active:scale-95"
                            >
                                <RotateCcw size={14} />
                                Reset Fields
                            </button>
                            <button 
                                type="submit" 
                                disabled={loading}
                                className="flex items-center gap-3 bg-gray-900 text-white font-black text-[10px] uppercase tracking-widest px-10 py-5 rounded-2xl hover:bg-black transition-all shadow-xl shadow-gray-900/10 disabled:opacity-50 active:scale-95"
                            >
                                <Save size={16} />
                                {loading ? 'Saving...' : 'Save Profile Details'}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </DashboardLayout>
    )
}

export default ProfilePage
