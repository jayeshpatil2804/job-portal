import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, XCircle, Clock, Search, Eye, Building2, Globe, ChevronDown, Calendar, RefreshCw, Mail, Phone } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../../../utils/api'
import AdminLayout from '../../../components/admin/AdminLayout'
import Pagination from '../../../components/common/Pagination'

const STATUS_MAP = {
    PENDING: { label: 'Pending', classes: 'bg-yellow-100 text-yellow-700', icon: <Clock size={12} /> },
    APPROVED: { label: 'Approved', classes: 'bg-green-100 text-green-700', icon: <CheckCircle size={12} /> },
    REJECTED: { label: 'Rejected', classes: 'bg-red-100 text-red-700', icon: <XCircle size={12} /> },
}

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

            {/* Table */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-gray-100 bg-gray-50">
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Company</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Contact</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider hidden md:table-cell">Website</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Applied</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider hidden xl:table-cell">Subscription</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Payment</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-12 text-center text-gray-400 text-sm">No recruiters found</td>
                                </tr>
                            ) : filtered.map((r, i) => {
                                const s = STATUS_MAP[r.status]
                                return (
                                    <motion.tr
                                        key={r.id}
                                        initial={{ opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.04 }}
                                        className="hover:bg-gray-50/50 transition-colors"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
                                                    <Building2 size={16} className="text-[#1a3c8f]" />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-semibold text-sm text-gray-900 truncate max-w-[180px]" title={r.company}>{r.company}</p>
                                                    <p className="text-xs text-gray-400 truncate max-w-[180px]" title={r.email}>{r.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600 truncate max-w-[140px]" title={r.contact}>{r.contact}</td>
                                        <td className="px-6 py-4 hidden md:table-cell">
                                            <a href={`https://${r.website}`} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-sm text-blue-600 hover:underline max-w-[150px]" title={r.website}>
                                                <Globe size={13} className="shrink-0" /> <span className="truncate">{r.website}</span>
                                            </a>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-400 hidden lg:table-cell">{r.appliedOn}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${s.classes}`}>
                                                {s.icon} {s.label}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 hidden xl:table-cell">
                                            {r.subscriptionExpiryDate ? (
                                                <div className="space-y-1">
                                                    <p className="text-xs font-semibold text-gray-900">{r.subscriptionExpiryDate}</p>
                                                    <div className="flex gap-1">
                                                        {r.isExpiringSoon && !r.isExpired && (
                                                            <span className="text-[9px] font-bold text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded">Soon</span>
                                                        )}
                                                        {r.isExpired && (
                                                            <span className="text-[9px] font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded">Expired</span>
                                                        )}
                                                    </div>
                                                </div>
                                            ) : (
                                                <p className="text-xs text-gray-400">N/A</p>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <select
                                                value={ r.isPaid ? 'PAID' : (r.isActive ? 'TEMP_ACTIVATED' : 'UNPAID') }
                                                onChange={(e) => handlePaymentStatusChange(r.id, e.target.value)}
                                                className={`px-3 py-1.5 text-xs font-bold rounded-lg border focus:outline-none transition-colors cursor-pointer appearance-none text-center ${
                                                    r.isPaid ? 'bg-green-100 text-green-700 border-green-200' :
                                                    r.isActive ? 'bg-orange-100 text-orange-700 border-orange-200' :
                                                    'bg-gray-100 text-gray-600 border-gray-200'
                                                }`}
                                            >
                                                <option value="PAID">Paid ✓</option>
                                                <option value="TEMP_ACTIVATED">Temp Activated ⏱</option>
                                                <option value="UNPAID">Unpaid ✗</option>
                                            </select>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                {r.isPaid && (
                                                    <button
                                                        onClick={() => setRenewModal(r)}
                                                        className="px-2 py-1.5 bg-green-50 hover:bg-green-100 text-green-600 text-xs font-bold rounded-lg transition-colors flex items-center gap-1"
                                                    >
                                                        <RefreshCw size={12} /> Renew
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => openSubscriptionProfile(r.id)}
                                                    className="px-2 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-bold rounded-lg transition-colors flex items-center gap-1"
                                                >
                                                    <Eye size={12} /> View
                                                </button>
                                                {r.status === 'PENDING' && (
                                                    <>
                                                        <button
                                                            onClick={() => handleAction(r.id, 'APPROVED')}
                                                            className="px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1"
                                                        >
                                                            <CheckCircle size={12} /> Approve
                                                        </button>
                                                        <button
                                                            onClick={() => handleAction(r.id, 'REJECTED')}
                                                            className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1"
                                                        >
                                                            <XCircle size={12} /> Reject
                                                        </button>
                                                    </>
                                                )}
                                                {r.status !== 'PENDING' && (
                                                    <button
                                                        onClick={() => handleAction(r.id, 'PENDING')}
                                                        className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-bold rounded-lg transition-colors"
                                                    >
                                                        Reset
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </motion.tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
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

                            {/* User Info */}
                            <div className="space-y-3 mb-6">
                                <div className="flex items-center gap-4 mb-5">
                                    <div className={`w-14 h-14 rounded-2xl bg-purple-500 flex items-center justify-center text-white font-bold text-lg`}>
                                        {subscriptionProfile.fullName.split(' ').map(n => n[0]).join('').toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="font-extrabold text-gray-900">{subscriptionProfile.fullName}</p>
                                        <p className="text-sm text-[#1a3c8f] font-semibold">{subscriptionProfile.companyName}</p>
                                    </div>
                                </div>
                                <div className="space-y-2 text-sm">
                                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl"><Mail size={15} className="text-gray-400" /><span>{subscriptionProfile.email}</span></div>
                                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl"><Phone size={15} className="text-gray-400" /><span>{subscriptionProfile.mobile}</span></div>
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
