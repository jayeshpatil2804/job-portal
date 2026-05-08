import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, XCircle, Clock, Search, Eye, Building2, Globe, ChevronDown, Calendar, RefreshCw, Mail, Phone, FileText, Shield, AlertCircle, CheckSquare, Square, User, MapPin, Briefcase, Image, Upload, Camera, Key, X, KeyRound, Copy, MessageSquare } from 'lucide-react'
import toast from 'react-hot-toast'
import Swal from 'sweetalert2'
import api from '../../../utils/api'
import AdminLayout from '../../../components/admin/AdminLayout'
import Pagination from '../../../components/common/Pagination'

const STATUS_MAP = {
    PENDING: { label: 'Pending', classes: 'bg-yellow-100 text-yellow-700', icon: <Clock size={12} /> },
    APPROVED: { label: 'Approved', classes: 'bg-green-100 text-green-700', icon: <CheckCircle size={12} /> },
    REJECTED: { label: 'Rejected', classes: 'bg-red-100 text-red-700', icon: <XCircle size={12} /> },
}

const VERIFICATION_CHECKLIST = [
    { key: 'companyInfo', label: 'Company Information', icon: <Building2 size={14} /> },
    { key: 'contactInfo', label: 'Contact Details', icon: <Phone size={14} /> },
    { key: 'website', label: 'Website Verification', icon: <Globe size={14} /> },
    { key: 'companyLogo', label: 'Company Logo', icon: <Image size={14} /> },
    { key: 'documents', label: 'Documents Uploaded', icon: <FileText size={14} /> },
    { key: 'emailVerified', label: 'Email Verified', icon: <Mail size={14} /> },
]

const RecruiterApproval = () => {
    const [recruiters, setRecruiters] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [filter, setFilter] = useState('ALL')
    const [selected, setSelected] = useState(null)
    const [subscriptionProfile, setSubscriptionProfile] = useState(null)
    const [otpData, setOtpData] = useState(null)
    const [fetchingOtp, setFetchingOtp] = useState(false)
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: 10
    })

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchRecruiters()
        }, 500)

        return () => clearTimeout(delayDebounceFn)
    }, [pagination.currentPage, pagination.itemsPerPage, search])

    const fetchRecruiters = async () => {
        try {
            setLoading(true)
            const res = await api.get('/admin/recruiters', {
                params: {
                    page: pagination.currentPage,
                    limit: pagination.itemsPerPage,
                    search: search
                }
            })
            setRecruiters(res.data.recruiters)
            if (res.data.pagination) {
                setPagination(prev => ({
                    ...prev,
                    ...res.data.pagination
                }))
            }
        } catch (error) {
            toast.error('Failed to load recruiters')
        } finally {
            setLoading(false)
        }
    }

    const handleAction = async (id, action) => {
        try {
            await api.patch(`/admin/recruiters/${id}/status`, { status: action })
            setRecruiters(prev => prev.map(r => r.id === id ? { ...r, status: action } : r))
            toast.success(`Recruiter status updated to ${action.toLowerCase()}`)
        } catch (error) {
            toast.error('Failed to update status')
        }
        setSelected(null)
    }

    const handleActivationToggle = async (id, currentStatus) => {
        try {
            await api.patch(`/admin/recruiters/${id}/activate`, { isActive: !currentStatus })
            setRecruiters(prev => prev.map(r => r.id === id ? { ...r, isActive: !currentStatus } : r))
            toast.success(`Recruiter account ${!currentStatus ? 'activated' : 'deactivated'}`)
        } catch (error) {
            toast.error('Failed to toggle activation status')
        }
    }

    const openSubscriptionProfile = async (id) => {
        try {
            const res = await api.get(`/admin/recruiters/${id}`)
            setSubscriptionProfile(res.data.recruiter)
        } catch (error) {
            toast.error('Failed to load recruiter profile')
        }
    }

    const fetchRecruiterOtp = async (email) => {
        try {
            setFetchingOtp(true)
            const res = await api.get(`/admin/recruiters/${email}/otp`)
            setOtpData({ email, otp: res.data.otp, expiresAt: res.data.expiresAt })
        } catch (error) {
            Swal.fire({
                title: 'No OTP Found',
                text: 'This recruiter does not have an active OTP. Generate one now?',
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Generate OTP',
                confirmButtonColor: '#1a3c8f',
            }).then((result) => {
                if (result.isConfirmed) {
                    regenerateOtp(email)
                }
            })
        } finally {
            setFetchingOtp(false)
        }
    }

    const regenerateOtp = async (email) => {
        try {
            setFetchingOtp(true)
            const res = await api.post(`/admin/recruiters/${email}/otp/regenerate`)
            setOtpData({ email, otp: res.data.otp, expiresAt: new Date(Date.now() + 10 * 60 * 1000) })
            toast.success('New OTP generated')
        } catch (error) {
            toast.error('Failed to regenerate OTP')
        } finally {
            setFetchingOtp(false)
        }
    }

    const handlePageChange = (page) => {
        setPagination(prev => ({ ...prev, currentPage: page }))
    }

    const handleLimitChange = (limit) => {
        setPagination(prev => ({ ...prev, itemsPerPage: limit, currentPage: 1 }))
    }

    const filtered = recruiters.filter(r => {
        const matchSearch = r.company?.toLowerCase().includes(search.toLowerCase()) || r.email?.toLowerCase().includes(search.toLowerCase())
        const matchFilter = filter === 'ALL' || r.status === filter
        return matchSearch && matchFilter
    })

    const counts = {
        ALL: recruiters.length,
        PENDING: recruiters.filter(r => r.status === 'PENDING').length,
        APPROVED: recruiters.filter(r => r.status === 'APPROVED').length,
        REJECTED: recruiters.filter(r => r.status === 'REJECTED').length,
    }

    if (loading && recruiters.length === 0) return (
        <AdminLayout title="Recruiter Approval">
            <div className="flex h-64 items-center justify-center">
                <div className="w-8 h-8 border-4 border-[#1a3c8f] border-t-transparent rounded-full animate-spin" />
            </div>
        </AdminLayout>
    )

    return (
        <AdminLayout title="Recruiter Approval">
            <div className="mb-6">
                <h2 className="text-2xl font-extrabold text-[#0f172a]">Recruiter Approval</h2>
                <p className="text-sm text-gray-500 mt-0.5">Verify and manage company registrations</p>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2 mb-5">
                {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setFilter(tab)}
                        className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                            filter === tab
                                ? 'bg-[#1a3c8f] text-white shadow-md'
                                : 'bg-white text-gray-600 border border-gray-200 hover:border-[#1a3c8f]'
                        }`}
                    >
                        {tab === 'ALL' ? 'All' : tab.charAt(0) + tab.slice(1).toLowerCase()} ({counts[tab]})
                    </button>
                ))}
            </div>

            {/* Search */}
            <div className="relative mb-6">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search by company or email..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1a3c8f] focus:ring-2 focus:ring-blue-100 transition"
                />
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {filtered.map((r, i) => {
                    const s = STATUS_MAP[r.status]
                    
                    const verificationStatus = {
                        companyInfo: r.company ? true : false,
                        contactInfo: r.contact && r.email ? true : false,
                        website: r.website ? true : false,
                        companyLogo: r.companyLogo ? true : false,
                        documents: r.documentsUploaded ? true : false,
                        emailVerified: r.emailVerified ? true : false
                    }
                    
                    const completedChecks = Object.values(verificationStatus).filter(Boolean).length
                    const totalChecks = Object.keys(verificationStatus).length
                    const verificationPercentage = Math.round((completedChecks / totalChecks) * 100)
                    
                    return (
                        <motion.div
                            key={r.id}
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.06 }}
                            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-all duration-300 group"
                        >
                            <div className="flex items-start gap-4">
                                <div className="relative">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white shrink-0 shadow-sm">
                                        {r.companyLogo ? (
                                            <img src={r.companyLogo} alt="Company Logo" className="w-full h-full rounded-xl object-cover" />
                                        ) : (
                                            <Building2 size={20} className="text-white" />
                                        )}
                                    </div>
                                    <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white flex items-center justify-center ${
                                        verificationPercentage === 100 ? 'bg-green-500' :
                                        verificationPercentage >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                                    }`}>
                                        <span className="text-[8px] text-white font-bold">{verificationPercentage}%</span>
                                    </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-bold text-gray-900 text-sm truncate">{r.company}</h4>
                                    <p className="text-xs text-[#1a3c8f] font-semibold truncate">{r.fullName || 'N/A'}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className={`px-1.5 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider ${s.classes}`}>
                                            {s.icon} {s.label}
                                        </span>
                                        <span className={`px-1.5 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider ${r.isActive ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'}`}>
                                            {r.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3 mt-4 text-xs text-gray-500">
                                <span className="flex items-center gap-1 truncate">
                                    <Mail size={11} />
                                    <span className="truncate">{r.email}</span>
                                </span>
                                <span className="flex items-center gap-1 truncate">
                                    <Phone size={11} />
                                    <span className="truncate">{r.contact}</span>
                                </span>
                            </div>

                            <div className="flex gap-3 mt-2 text-xs text-gray-500">
                                {r.location && (
                                    <span className="flex items-center gap-1 truncate">
                                        <MapPin size={11} />
                                        <span className="truncate">{r.location}</span>
                                    </span>
                                )}
                                {r.appliedOn && (
                                    <span className="flex items-center gap-1 truncate">
                                        <Calendar size={11} />
                                        <span className="truncate">{r.appliedOn}</span>
                                    </span>
                                )}
                            </div>

                            <div className="mt-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-semibold text-gray-700">Verification Status</span>
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                        verificationPercentage === 100 ? 'bg-green-100 text-green-700' :
                                        verificationPercentage >= 50 ? 'bg-yellow-100 text-yellow-700' :
                                        'bg-red-100 text-red-700'
                                    }`}>
                                        {verificationPercentage}% Complete
                                    </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div 
                                        className={`h-2 rounded-full transition-all duration-300 ${
                                            verificationPercentage === 100 ? 'bg-green-500' :
                                            verificationPercentage >= 50 ? 'bg-yellow-500' :
                                            'bg-red-500'
                                        }`}
                                        style={{ width: `${verificationPercentage}%` }}
                                    />
                                </div>
                            </div>

                            <div className="mt-4 flex gap-2">
                                <button
                                    onClick={() => openSubscriptionProfile(r.id)}
                                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 border-2 border-blue-100 text-[#1a3c8f] text-xs font-black uppercase tracking-wider rounded-xl hover:bg-blue-50 transition-all active:scale-95"
                                >
                                    <Eye size={14} /> View
                                </button>
                                <button
                                    onClick={() => handleActivationToggle(r.id, r.isActive)}
                                    className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all active:scale-95 shadow-lg ${r.isActive ? 'bg-orange-500 hover:bg-orange-600 shadow-orange-200' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-200'}`}
                                >
                                    {r.isActive ? 'Deactivate' : 'Activate'}
                                </button>
                                {r.status !== 'APPROVED' && (
                                    <button
                                        onClick={() => fetchRecruiterOtp(r.email)}
                                        className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-amber-200 active:scale-95"
                                    >
                                        <Key size={14} /> OTP
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    )
                })}
            </div>

            {/* Pagination */}
            <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                totalItems={pagination.totalItems}
                itemsPerPage={pagination.itemsPerPage}
                onPageChange={handlePageChange}
                onLimitChange={handleLimitChange}
            />

            {/* Profile Modal */}
            <AnimatePresence>
                {subscriptionProfile && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
                        onClick={() => setSubscriptionProfile(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            onClick={e => e.stopPropagation()}
                            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="font-bold text-xl text-[#0f172a]">Recruiter Profile</h3>
                                <button
                                    onClick={() => setSubscriptionProfile(null)}
                                    className="p-2 rounded-xl hover:bg-gray-100 text-gray-500 transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="mb-6">
                                <h4 className="font-bold text-[#0f172a] mb-4 flex items-center gap-2">
                                    <Shield size={18} className="text-[#1a3c8f]" />
                                    Verification Checklist
                                </h4>
                                <div className="space-y-3">
                                    {VERIFICATION_CHECKLIST.map(check => {
                                        const isComplete = subscriptionProfile[check.key]
                                        return (
                                            <div
                                                key={check.key}
                                                className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                                                    isComplete ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'
                                                }`}
                                            >
                                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isComplete ? 'bg-green-500 text-white' : 'bg-yellow-500 text-white'}`}>
                                                    {isComplete ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                                                </div>
                                                <div className="flex-1">
                                                    <p className={`font-semibold text-sm ${isComplete ? 'text-green-700' : 'text-yellow-700'}`}>{check.label}</p>
                                                    <p className="text-xs text-gray-600 mt-0.5">{isComplete ? 'Completed' : 'Pending'}</p>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>

                            <button
                                onClick={() => setSubscriptionProfile(null)}
                                className="w-full py-2.5 bg-[#1a3c8f] text-white font-bold rounded-xl hover:bg-[#153275] transition-colors"
                            >
                                Close
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* OTP Modal */}
            <AnimatePresence>
                {otpData && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-sm overflow-hidden"
                        >
                            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-8 text-center text-white relative">
                                <button 
                                    onClick={() => setOtpData(null)}
                                    className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
                                >
                                    <X size={18} />
                                </button>
                                <div className="w-16 h-16 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/30">
                                    <KeyRound size={32} />
                                </div>
                                <h3 className="text-xl font-black uppercase tracking-tight">Recruiter OTP</h3>
                                <p className="text-blue-50 text-[10px] font-bold uppercase tracking-widest mt-1 opacity-80">Access Code</p>
                            </div>

                            <div className="p-8 space-y-6">
                                <div className="text-center space-y-2">
                                    <div className="bg-slate-50 py-4 rounded-2xl border-2 border-dashed border-slate-200">
                                        <span className="text-4xl font-black text-[#1a3c8f] tracking-[0.3em]">{otpData.otp}</span>
                                    </div>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                                        Expires at: {new Date(otpData.expiresAt).toLocaleTimeString()}
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 gap-3">
                                    <button
                                        onClick={() => {
                                            navigator.clipboard.writeText(otpData.otp)
                                            toast.success('OTP copied to clipboard')
                                        }}
                                        className="w-full py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95"
                                    >
                                        <Copy size={16} /> Copy Code
                                    </button>

                                    <a
                                        href={`https://wa.me/${recruiters.find(r => r.email === otpData.email)?.mobile}?text=Hello, your Losodhan recruiter verification OTP is: ${otpData.otp}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full py-4 bg-[#25D366] hover:bg-[#128C7E] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-green-500/20"
                                    >
                                        <MessageSquare size={16} /> Send via WhatsApp
                                    </a>

                                    <button
                                        onClick={() => regenerateOtp(otpData.email)}
                                        disabled={fetchingOtp}
                                        className="w-full py-4 border-2 border-[#1a3c8f] text-[#1a3c8f] hover:bg-blue-50 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95"
                                    >
                                        <RefreshCw size={16} className={fetchingOtp ? 'animate-spin' : ''} /> Regenerate New OTP
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </AdminLayout>
    )
}

export default RecruiterApproval
