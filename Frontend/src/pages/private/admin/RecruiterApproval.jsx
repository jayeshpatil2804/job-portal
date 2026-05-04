import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, XCircle, Clock, Search, Eye, Building2, Globe, ChevronDown, Calendar, RefreshCw, Mail, Phone, FileText, Shield, AlertCircle, CheckSquare, Square, User, MapPin, Briefcase, Image, Upload, Camera } from 'lucide-react'
import toast from 'react-hot-toast'
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
    { key: 'payment', label: 'Payment Status', icon: <Shield size={14} /> },
]

const RecruiterApproval = () => {
    const [recruiters, setRecruiters] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [filter, setFilter] = useState('ALL')
    const [selected, setSelected] = useState(null)
    const [renewModal, setRenewModal] = useState(null)
    const [renewDuration, setRenewDuration] = useState(12)
    const [subscriptionProfile, setSubscriptionProfile] = useState(null)
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: 10
    })

    useEffect(() => {
        fetchRecruiters()
    }, [pagination.currentPage, pagination.itemsPerPage])

    const fetchRecruiters = async () => {
        try {
            setLoading(true)
            const res = await api.get('/admin/recruiters', {
                params: {
                    page: pagination.currentPage,
                    limit: pagination.itemsPerPage
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

    const handlePaymentStatusChange = async (id, status) => {
        try {
            await api.patch(`/admin/recruiters/${id}/payment-status`, { paymentStatus: status })
            setRecruiters(prev => prev.map(r => {
                if (r.id === id) {
                    if (status === 'PAID') return { ...r, isPaid: true, isActive: true }
                    if (status === 'UNPAID') return { ...r, isPaid: false, isActive: false }
                    if (status === 'TEMP_ACTIVATED') return { ...r, isPaid: false, isActive: true }
                }
                return r
            }))
            toast.success(`Payment status updated to ${status.replace('_', ' ').toLowerCase()}`)
        } catch (error) {
            toast.error('Failed to update payment status')
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

    const handleRenew = async () => {
        if (!renewModal) return

        try {
            await api.post(`/admin/recruiters/${renewModal.id}/renew`, { durationMonths: renewDuration })
            toast.success(`Recruiter subscription renewed for ${renewDuration} months`)
            setRenewModal(null)
            setRenewDuration(12)
            fetchRecruiters()
        } catch (error) {
            toast.error('Failed to renew subscription')
        }
    }

    const handlePageChange = (page) => {
        setPagination(prev => ({ ...prev, currentPage: page }))
    }

    const handleLimitChange = (limit) => {
        setPagination(prev => ({ ...prev, itemsPerPage: limit, currentPage: 1 }))
    }

    const filtered = recruiters.filter(r => {
        const matchSearch = r.company.toLowerCase().includes(search.toLowerCase()) || r.email.toLowerCase().includes(search.toLowerCase())
        const matchFilter = filter === 'ALL' || r.status === filter
        return matchSearch && matchFilter
    })

    const counts = {
        ALL: recruiters.length,
        PENDING: recruiters.filter(r => r.status === 'PENDING').length,
        APPROVED: recruiters.filter(r => r.status === 'APPROVED').length,
        REJECTED: recruiters.filter(r => r.status === 'REJECTED').length,
    }

    if (loading) return (
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

            {/* Cards Grid - Similar to Candidate Management */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {filtered.map((r, i) => {
                    const s = STATUS_MAP[r.status]
                    
                    // Mock verification status - in real app this would come from API
                    const verificationStatus = {
                        companyInfo: r.company ? true : false,
                        contactInfo: r.contact && r.email ? true : false,
                        website: r.website ? true : false,
                        companyLogo: r.companyLogo ? true : false,
                        documents: r.documentsUploaded ? true : false,
                        emailVerified: r.emailVerified ? true : false,
                        payment: r.isPaid ? true : false
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
                            {/* Company Header */}
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
                                        <span className={`px-1.5 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider ${
                                            r.isPaid ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'
                                        }`}>
                                            {r.isPaid ? 'Paid' : 'Unpaid'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Contact Information */}
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

                            {/* Location and Applied Date */}
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

                            {/* Verification Progress */}
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

                            {/* Verification Checklist */}
                            <div className="flex flex-wrap gap-1 mt-3">
                                {VERIFICATION_CHECKLIST.slice(0, 4).map(check => (
                                    <div
                                        key={check.key}
                                        className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-[9px] font-medium ${
                                            verificationStatus[check.key]
                                                ? 'bg-green-50 text-green-700 border border-green-200'
                                                : 'bg-gray-50 text-gray-500 border border-gray-200'
                                        }`}
                                        title={check.label}
                                    >
                                        {verificationStatus[check.key] ? <CheckCircle size={8} /> : <AlertCircle size={8} />}
                                        {check.label.split(' ')[0]}
                                    </div>
                                ))}
                                {totalChecks > 4 && (
                                    <div className="flex items-center gap-1 px-2 py-0.5 rounded-md text-[9px] font-medium bg-blue-50 text-blue-700 border border-blue-200">
                                        +{totalChecks - 4}
                                    </div>
                                )}
                            </div>

                            {/* Subscription Info */}
                            {r.subscriptionExpiryDate && (
                                <div className="mt-3 flex items-center gap-1 text-xs text-gray-400">
                                    <Calendar size={10} />
                                    <span>Expires: {r.subscriptionExpiryDate}</span>
                                    {r.isExpiringSoon && !r.isExpired && (
                                        <span className="text-[9px] font-bold text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded">Soon</span>
                                    )}
                                    {r.isExpired && (
                                        <span className="text-[9px] font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded">Expired</span>
                                    )}
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="mt-4 flex gap-2">
                                <button
                                    onClick={() => openSubscriptionProfile(r.id)}
                                    className="flex-[0.5] flex items-center justify-center gap-1.5 py-2 border border-[#1a3c8f] text-[#1a3c8f] text-xs font-bold rounded-xl hover:bg-[#1a3c8f] hover:text-white transition-all duration-200"
                                >
                                    <Eye size={14} /> View
                                </button>
                                {r.status === 'PENDING' && (
                                    <>
                                        <button
                                            onClick={() => handleAction(r.id, 'APPROVED')}
                                            className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-green-500 hover:bg-green-600 text-white text-xs font-bold rounded-xl transition-all duration-200"
                                        >
                                            <CheckCircle size={12} /> Approve
                                        </button>
                                        <button
                                            onClick={() => handleAction(r.id, 'REJECTED')}
                                            className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-red-500 hover:bg-red-600 text-white text-xs font-bold rounded-xl transition-all duration-200"
                                        >
                                            <XCircle size={12} /> Reject
                                        </button>
                                    </>
                                )}
                                {r.status !== 'PENDING' && (
                                    <button
                                        onClick={() => handleAction(r.id, 'PENDING')}
                                        className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-bold rounded-xl transition-all duration-200"
                                    >
                                        Reset Status
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    )
                })}
            </div>

            {/* Empty State */}
            {filtered.length === 0 && (
                <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Building2 size={32} className="text-gray-400" />
                    </div>
                    <p className="text-gray-400 text-sm">No recruiters found</p>
                </div>
            )}

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
                                    <XCircle size={20} />
                                </button>
                            </div>

                            {/* Subscription Info */}
                            {subscriptionProfile.subscriptionExpiryDate && (
                                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-5 mb-6 border border-blue-100">
                                    <h4 className="font-bold text-[#0f172a] mb-3 flex items-center gap-2">
                                        <Calendar size={18} className="text-[#1a3c8f]" />
                                        Subscription Details
                                    </h4>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="bg-white rounded-xl p-3">
                                            <p className="text-xs text-gray-500 mb-1">Start Date</p>
                                            <p className="font-bold text-gray-900">{subscriptionProfile.subscriptionStartDate || 'N/A'}</p>
                                        </div>
                                        <div className="bg-white rounded-xl p-3">
                                            <p className="text-xs text-gray-500 mb-1">Expiry Date</p>
                                            <p className="font-bold text-gray-900">{subscriptionProfile.subscriptionExpiryDate}</p>
                                        </div>
                                        <div className="bg-white rounded-xl p-3">
                                            <p className="text-xs text-gray-500 mb-1">Days Remaining</p>
                                            <p className={`font-bold ${subscriptionProfile.isExpired ? 'text-red-600' : subscriptionProfile.isExpiringSoon ? 'text-orange-600' : 'text-green-600'
                                                }`}>
                                                {subscriptionProfile.subscriptionDaysRemaining !== null
                                                    ? `${subscriptionProfile.subscriptionDaysRemaining} days`
                                                    : 'N/A'}
                                            </p>
                                        </div>
                                        <div className="bg-white rounded-xl p-3">
                                            <p className="text-xs text-gray-500 mb-1">Status</p>
                                            <p className={`font-bold ${subscriptionProfile.isPaid ? 'text-green-600' : 'text-gray-600'
                                                }`}>
                                                {subscriptionProfile.isPaid ? 'PAID' : 'UNPAID'}
                                            </p>
                                        </div>
                                    </div>
                                    {subscriptionProfile.isPaid && !subscriptionProfile.isExpired && (
                                        <button
                                            onClick={() => {
                                                setRenewModal({ id: subscriptionProfile.id, name: subscriptionProfile.fullName })
                                                setSubscriptionProfile(null)
                                            }}
                                            className="w-full mt-4 py-2.5 bg-green-500 text-white font-bold rounded-xl hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
                                        >
                                            <RefreshCw size={16} /> Renew Subscription
                                        </button>
                                    )}
                                </div>
                            )}

                            {/* Enhanced Verification Checklist */}
                            <div className="mb-6">
                                <h4 className="font-bold text-[#0f172a] mb-4 flex items-center gap-2">
                                    <Shield size={18} className="text-[#1a3c8f]" />
                                    Verification Checklist
                                </h4>
                                <div className="space-y-3">
                                    {VERIFICATION_CHECKLIST.map(check => {
                                        const isComplete = subscriptionProfile[check.key] || 
                                            (check.key === 'companyInfo' && subscriptionProfile.companyName) ||
                                            (check.key === 'contactInfo' && subscriptionProfile.email && subscriptionProfile.mobile) ||
                                            (check.key === 'website' && subscriptionProfile.website) ||
                                            (check.key === 'companyLogo' && subscriptionProfile.companyLogo) ||
                                            (check.key === 'documents' && subscriptionProfile.documentsUploaded) ||
                                            (check.key === 'emailVerified' && subscriptionProfile.emailVerified) ||
                                            (check.key === 'payment' && subscriptionProfile.isPaid)
                                        
                                        return (
                                            <div
                                                key={check.key}
                                                className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                                                    isComplete 
                                                        ? 'bg-green-50 border-green-200' 
                                                        : 'bg-yellow-50 border-yellow-200'
                                                }`}
                                            >
                                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                                    isComplete ? 'bg-green-500 text-white' : 'bg-yellow-500 text-white'
                                                }`}>
                                                    {isComplete ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                                                </div>
                                                <div className="flex-1">
                                                    <p className={`font-semibold text-sm ${
                                                        isComplete ? 'text-green-700' : 'text-yellow-700'
                                                    }`}>
                                                        {check.label}
                                                    </p>
                                                    <p className="text-xs text-gray-600 mt-0.5">
                                                        {isComplete ? 'Completed' : 'Pending verification'}
                                                    </p>
                                                </div>
                                                {check.icon}
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>

                            {/* Enhanced Card-Based User Info */}
                            <div className="mb-6">
                                <h4 className="font-bold text-[#0f172a] mb-4 flex items-center gap-2">
                                    <User size={18} className="text-[#1a3c8f]" />
                                    Company Profile Card
                                </h4>
                                
                                {/* Main Profile Card */}
                                <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl border border-blue-100 overflow-hidden shadow-lg">
                                    {/* Card Header with Image */}
                                    <div className="relative h-32 bg-gradient-to-r from-blue-600 to-purple-600">
                                        <div className="absolute inset-0 bg-black/10">
                                            <div className="absolute bottom-4 left-4 right-4">
                                                <div className="flex items-end gap-4">
                                                    {/* Company Logo/Image */}
                                                    <div className="relative">
                                                        {subscriptionProfile.companyLogo ? (
                                                            <img 
                                                                src={subscriptionProfile.companyLogo} 
                                                                alt="Company Logo"
                                                                className="w-20 h-20 rounded-xl border-4 border-white shadow-lg object-cover"
                                                            />
                                                        ) : (
                                                            <div className="w-20 h-20 rounded-xl border-4 border-white shadow-lg bg-white/90 flex items-center justify-center">
                                                                <Camera size={24} className="text-gray-400" />
                                                            </div>
                                                        )}
                                                        <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center ${
                                                            subscriptionProfile.companyLogo ? 'bg-green-500' : 'bg-yellow-500'
                                                        }`}>
                                                            {subscriptionProfile.companyLogo ? 
                                                                <CheckCircle size={14} className="text-white" /> : 
                                                                <AlertCircle size={14} className="text-white" />
                                                            }
                                                        </div>
                                                    </div>
                                                    
                                                    {/* Company Info */}
                                                    <div className="flex-1 pb-2">
                                                        <h3 className="font-bold text-white text-lg">{subscriptionProfile.companyName}</h3>
                                                        <p className="text-blue-100 text-sm">{subscriptionProfile.fullName}</p>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                                                subscriptionProfile.status === 'APPROVED' ? 'bg-white/20 text-white' :
                                                                subscriptionProfile.status === 'PENDING' ? 'bg-yellow-400/80 text-white' :
                                                                'bg-red-400/80 text-white'
                                                            }`}>
                                                                {subscriptionProfile.status}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Card Body */}
                                    <div className="p-4 space-y-3">
                                        {/* Contact Information Grid */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            <div className="bg-white/80 rounded-xl p-3 border border-white/50">
                                                <div className="flex items-center gap-2">
                                                    <Mail size={14} className="text-blue-600" />
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-xs text-gray-500">Email</p>
                                                        <p className="text-sm font-medium text-gray-900 truncate">{subscriptionProfile.email}</p>
                                                    </div>
                                                    {subscriptionProfile.emailVerified && (
                                                        <CheckCircle size={12} className="text-green-500 flex-shrink-0" />
                                                    )}
                                                </div>
                                            </div>
                                            
                                            <div className="bg-white/80 rounded-xl p-3 border border-white/50">
                                                <div className="flex items-center gap-2">
                                                    <Phone size={14} className="text-blue-600" />
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-xs text-gray-500">Phone</p>
                                                        <p className="text-sm font-medium text-gray-900 truncate">{subscriptionProfile.mobile}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            {subscriptionProfile.website && (
                                                <div className="bg-white/80 rounded-xl p-3 border border-white/50">
                                                    <div className="flex items-center gap-2">
                                                        <Globe size={14} className="text-blue-600" />
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-xs text-gray-500">Website</p>
                                                            <a href={`https://${subscriptionProfile.website}`} target="_blank" rel="noreferrer" className="text-sm font-medium text-blue-600 hover:underline truncate block">
                                                                {subscriptionProfile.website}
                                                            </a>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                            
                                            {subscriptionProfile.location && (
                                                <div className="bg-white/80 rounded-xl p-3 border border-white/50">
                                                    <div className="flex items-center gap-2">
                                                        <MapPin size={14} className="text-blue-600" />
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-xs text-gray-500">Location</p>
                                                            <p className="text-sm font-medium text-gray-900 truncate">{subscriptionProfile.location}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        
                                        {/* Upload Status */}
                                        <div className="bg-white/80 rounded-xl p-3 border border-white/50">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <Upload size={14} className="text-blue-600" />
                                                    <span className="text-sm font-medium text-gray-900">Document Upload Status</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    {subscriptionProfile.documentsUploaded ? (
                                                        <>
                                                            <CheckCircle size={12} className="text-green-500" />
                                                            <span className="text-xs font-medium text-green-700">Complete</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <AlertCircle size={12} className="text-yellow-500" />
                                                            <span className="text-xs font-medium text-yellow-700">Pending</span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Payment History */}
                            {subscriptionProfile.paymentHistory && subscriptionProfile.paymentHistory.length > 0 && (
                                <div className="mb-6">
                                    <h4 className="font-bold text-[#0f172a] mb-3">Payment History</h4>
                                    <div className="space-y-2">
                                        {subscriptionProfile.paymentHistory.map(payment => (
                                            <div key={payment.id} className="bg-gray-50 rounded-xl p-4 flex justify-between items-center">
                                                <div>
                                                    <p className="text-sm font-semibold">₹{payment.amount}</p>
                                                    <p className="text-xs text-gray-500">{payment.createdAt}</p>
                                                </div>
                                                <span className={`px-3 py-1 rounded-lg text-xs font-bold ${payment.status === 'COMPLETED'
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-yellow-100 text-yellow-700'
                                                    }`}>
                                                    {payment.status}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

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

            {/* Renew Modal */}
            <AnimatePresence>
                {renewModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
                        onClick={() => setRenewModal(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            onClick={e => e.stopPropagation()}
                            className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6"
                        >
                            <div className="mb-6">
                                <h3 className="font-bold text-xl text-[#0f172a] mb-1">Renew Subscription</h3>
                                <p className="text-sm text-gray-500">
                                    {renewModal.name} (Recruiter)
                                </p>
                            </div>

                            <div className="space-y-4 mb-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Duration (months)
                                    </label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {[3, 6, 12, 18, 24, 36].map(months => (
                                            <button
                                                key={months}
                                                onClick={() => setRenewDuration(months)}
                                                className={`py-2.5 rounded-xl text-sm font-bold transition-all ${renewDuration === months
                                                    ? 'bg-[#1a3c8f] text-white shadow-md'
                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                    }`}
                                            >
                                                {months} mo
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setRenewModal(null)}
                                    className="flex-1 py-2.5 border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleRenew}
                                    className="flex-1 py-2.5 bg-[#1a3c8f] text-white font-bold rounded-xl hover:bg-[#153275] transition-colors"
                                >
                                    Confirm Renew
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </AdminLayout>
    )
}

export default RecruiterApproval
