import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Search,
    Calendar,
    Clock,
    AlertTriangle,
    CheckCircle,
    XCircle,
    RefreshCw,
    Eye,
    Filter,
    User,
    Building2,
    TrendingUp,
    DollarSign
} from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../../../utils/api'
import AdminLayout from '../../../components/admin/AdminLayout'
import Pagination from '../../../components/common/Pagination'

const SubscriptionManagement = () => {
    const [subscriptions, setSubscriptions] = useState([])
    const [expiringToday, setExpiringToday] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [filterType, setFilterType] = useState('all') // all, candidate, recruiter
    const [filterStatus, setFilterStatus] = useState('all') // all, active, expired, unpaid
    const [renewModal, setRenewModal] = useState(null)
    const [profileModal, setProfileModal] = useState(null)
    const [renewDuration, setRenewDuration] = useState(12)
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: 10
    })

    useEffect(() => {
        fetchData()
    }, [pagination.currentPage, pagination.itemsPerPage, filterType, filterStatus])

    const fetchData = async () => {
        try {
            setLoading(true)
            const [subsRes, expiringRes] = await Promise.all([
                api.get('/admin/subscriptions', {
                    params: {
                        page: pagination.currentPage,
                        limit: pagination.itemsPerPage,
                        type: filterType === 'all' ? undefined : filterType,
                        status: filterStatus === 'all' ? undefined : filterStatus
                    }
                }),
                api.get('/admin/subscriptions/expiring-today')
            ])
            setSubscriptions(subsRes.data.data || [])
            setExpiringToday(expiringRes.data.data.expiringToday || [])
            if (subsRes.data.pagination) {
                setPagination(prev => ({
                    ...prev,
                    ...subsRes.data.pagination
                }))
            }
        } catch (error) {
            toast.error('Failed to load subscription data')
        } finally {
            setLoading(false)
        }
    }

    const handleRenew = async () => {
        if (!renewModal) return

        try {
            const endpoint = renewModal.type === 'Candidate'
                ? `/admin/candidates/${renewModal.id}/renew`
                : `/admin/recruiters/${renewModal.id}/renew`

            await api.post(endpoint, { durationMonths: renewDuration })
            toast.success(`${renewModal.type} subscription renewed for ${renewDuration} months`)
            setRenewModal(null)
            setRenewDuration(12)
            fetchData()
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

    const openProfile = async (item) => {
        try {
            const endpoint = item.type === 'Candidate'
                ? `/admin/candidates/${item.id}`
                : `/admin/recruiters/${item.id}`

            const res = await api.get(endpoint)
            setProfileModal(item.type === 'Candidate' ? res.data.candidate : res.data.recruiter)
        } catch (error) {
            toast.error('Failed to load profile')
        }
    }

    const filtered = subscriptions.filter(item => {
        const matchSearch = item.name?.toLowerCase().includes(search.toLowerCase()) ||
            item.email?.toLowerCase().includes(search.toLowerCase()) ||
            item.companyName?.toLowerCase().includes(search.toLowerCase())

        const matchType = filterType === 'all' || item.type.toLowerCase() === filterType
        const matchStatus = filterStatus === 'all' ||
            (filterStatus === 'active' && !item.isExpired && item.isPaid) ||
            (filterStatus === 'expired' && item.isExpired) ||
            (filterStatus === 'unpaid' && !item.isPaid)

        return matchSearch && matchType && matchStatus
    })

    const stats = {
        total: subscriptions.length,
        active: subscriptions.filter(s => s.isPaid && !s.isExpired).length,
        expired: subscriptions.filter(s => s.isExpired).length,
        expiringSoon: subscriptions.filter(s => s.isExpiringSoon).length,
        expiringToday: expiringToday.length
    }

    if (loading) return (
        <AdminLayout title="Subscription Management">
            <div className="flex h-64 items-center justify-center">
                <div className="w-8 h-8 border-4 border-[#1a3c8f] border-t-transparent rounded-full animate-spin" />
            </div>
        </AdminLayout>
    )

    return (
        <AdminLayout title="Subscription Management">
            <div className="mb-6">
                <h2 className="text-2xl font-extrabold text-[#0f172a]">Subscription Management</h2>
                <p className="text-sm text-gray-500 mt-0.5">Track and renew candidate & recruiter subscriptions</p>
            </div>

            {/* Expiring Today Alert */}
            {expiringToday.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 bg-gradient-to-r from-orange-50 to-amber-50 border-2 border-orange-200 rounded-2xl p-5"
                >
                    <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center shrink-0">
                            <AlertTriangle size={20} className="text-orange-600" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold text-orange-900 mb-1">
                                {expiringToday.length} Subscription{expiringToday.length > 1 ? 's' : ''} Expiring Today!
                            </h3>
                            <p className="text-sm text-orange-700 mb-3">
                                These users need immediate renewal to maintain access
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {expiringToday.map(user => (
                                    <div key={user.id} className="bg-white rounded-xl px-3 py-2 text-sm border border-orange-200">
                                        <span className="font-semibold">{user.name}</span>
                                        <span className="text-orange-600 ml-2">({user.type})</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
                <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
                            <TrendingUp size={18} className="text-blue-600" />
                        </div>
                    </div>
                    <p className="text-2xl font-extrabold text-[#0f172a]">{stats.total}</p>
                    <p className="text-xs text-gray-500 font-medium">Total</p>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center">
                            <CheckCircle size={18} className="text-green-600" />
                        </div>
                    </div>
                    <p className="text-2xl font-extrabold text-green-600">{stats.active}</p>
                    <p className="text-xs text-gray-500 font-medium">Active</p>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center">
                            <XCircle size={18} className="text-red-600" />
                        </div>
                    </div>
                    <p className="text-2xl font-extrabold text-red-600">{stats.expired}</p>
                    <p className="text-xs text-gray-500 font-medium">Expired</p>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center">
                            <Clock size={18} className="text-orange-600" />
                        </div>
                    </div>
                    <p className="text-2xl font-extrabold text-orange-600">{stats.expiringSoon}</p>
                    <p className="text-xs text-gray-500 font-medium">Expiring Soon</p>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center">
                            <Calendar size={18} className="text-amber-600" />
                        </div>
                    </div>
                    <p className="text-2xl font-extrabold text-amber-600">{stats.expiringToday}</p>
                    <p className="text-xs text-gray-500 font-medium">Today</p>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 w-full">
                        <div className="relative">
                            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by name, email, or company..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1a3c8f] focus:ring-2 focus:ring-blue-100 transition"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                            <Filter size={16} className="text-gray-400 hidden sm:block" />
                            <select
                                value={filterType}
                                onChange={e => setFilterType(e.target.value)}
                                className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:border-[#1a3c8f] cursor-pointer w-full sm:w-auto"
                            >
                                <option value="all">All Types</option>
                                <option value="candidate">Candidates</option>
                                <option value="recruiter">Recruiters</option>
                            </select>
                        </div>

                        <select
                            value={filterStatus}
                            onChange={e => setFilterStatus(e.target.value)}
                            className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:border-[#1a3c8f] cursor-pointer w-full sm:w-auto"
                        >
                            <option value="all">All Status</option>
                            <option value="active">Active</option>
                            <option value="expired">Expired</option>
                            <option value="unpaid">Unpaid</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Subscriptions Table */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left whitespace-nowrap min-w-[800px]">
                        <thead>
                            <tr className="border-b border-gray-100 bg-gray-50">
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">User</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider hidden md:table-cell">Type</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Start Date</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Expiry Date</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Days Left</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="py-12 text-center text-gray-400 text-sm">
                                        No subscriptions found
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((item, i) => {
                                    const daysColor = item.isExpired
                                        ? 'text-red-600 bg-red-50'
                                        : item.isExpiringSoon
                                            ? 'text-orange-600 bg-orange-50'
                                            : 'text-green-600 bg-green-50'

                                    return (
                                        <motion.tr
                                            key={item.id}
                                            initial={{ opacity: 0, y: 8 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.03 }}
                                            className="hover:bg-gray-50/50 transition-colors"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${item.type === 'Candidate' ? 'bg-blue-100' : 'bg-purple-100'
                                                        }`}>
                                                        {item.type === 'Candidate'
                                                            ? <User size={16} className="text-blue-600" />
                                                            : <Building2 size={16} className="text-purple-600" />
                                                        }
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="font-semibold text-sm text-gray-900 truncate max-w-[180px]">
                                                            {item.name}
                                                        </p>
                                                        <p className="text-xs text-gray-400 truncate max-w-[180px]">
                                                            {item.email}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 hidden md:table-cell">
                                                <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold ${item.type === 'Candidate'
                                                    ? 'bg-blue-100 text-blue-700'
                                                    : 'bg-purple-100 text-purple-700'
                                                    }`}>
                                                    {item.type}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600 hidden lg:table-cell">
                                                {item.subscriptionStartDate || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                                                {item.subscriptionExpiryDate || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center justify-center px-3 py-1 rounded-lg text-xs font-bold ${daysColor}`}>
                                                    {item.isExpired ? 'Expired' : item.daysRemaining !== null ? `${item.daysRemaining}d` : 'N/A'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col gap-1">
                                                    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-bold ${item.isPaid
                                                        ? 'bg-green-100 text-green-700'
                                                        : 'bg-gray-100 text-gray-600'
                                                        }`}>
                                                        {item.isPaid ? 'PAID' : 'UNPAID'}
                                                    </span>
                                                    {item.isExpired && (
                                                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-bold bg-red-100 text-red-700">
                                                            EXPIRED
                                                        </span>
                                                    )}
                                                    {item.isExpiringSoon && !item.isExpired && (
                                                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-bold bg-orange-100 text-orange-700">
                                                            EXPIRING SOON
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => openProfile(item)}
                                                        className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-bold rounded-lg transition-colors flex items-center gap-1"
                                                    >
                                                        <Eye size={12} /> View
                                                    </button>
                                                    <button
                                                        onClick={() => setRenewModal(item)}
                                                        className="px-3 py-1.5 bg-green-50 hover:bg-green-100 text-green-600 text-xs font-bold rounded-lg transition-colors flex items-center gap-1"
                                                    >
                                                        <RefreshCw size={12} /> Renew
                                                    </button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    )
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

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
                                    {renewModal.name} ({renewModal.type})
                                </p>
                            </div>

                            <div className="space-y-4 mb-6">
                                <div className="bg-gray-50 rounded-xl p-4">
                                    <p className="text-xs text-gray-500 mb-1">Current Expiry</p>
                                    <p className="font-bold text-gray-900">
                                        {renewModal.subscriptionExpiryDate || 'N/A'}
                                    </p>
                                </div>

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

            {/* Profile Modal */}
            <AnimatePresence>
                {profileModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
                        onClick={() => setProfileModal(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            onClick={e => e.stopPropagation()}
                            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="font-bold text-xl text-[#0f172a]">
                                    {profileModal.type === 'Candidate' ? 'Candidate' : 'Recruiter'} Profile
                                </h3>
                                <button
                                    onClick={() => setProfileModal(null)}
                                    className="p-2 rounded-xl hover:bg-gray-100 text-gray-500 transition-colors"
                                >
                                    <XCircle size={20} />
                                </button>
                            </div>

                            {/* Subscription Info */}
                            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-5 mb-6 border border-blue-100">
                                <h4 className="font-bold text-[#0f172a] mb-3 flex items-center gap-2">
                                    <Calendar size={18} className="text-[#1a3c8f]" />
                                    Subscription Details
                                </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="bg-white rounded-xl p-3">
                                        <p className="text-xs text-gray-500 mb-1">Start Date</p>
                                        <p className="font-bold text-gray-900">{profileModal.subscriptionStartDate || 'N/A'}</p>
                                    </div>
                                    <div className="bg-white rounded-xl p-3">
                                        <p className="text-xs text-gray-500 mb-1">Expiry Date</p>
                                        <p className="font-bold text-gray-900">{profileModal.subscriptionExpiryDate || 'N/A'}</p>
                                    </div>
                                    <div className="bg-white rounded-xl p-3">
                                        <p className="text-xs text-gray-500 mb-1">Days Remaining</p>
                                        <p className={`font-bold ${profileModal.isExpired ? 'text-red-600' : profileModal.isExpiringSoon ? 'text-orange-600' : 'text-green-600'
                                            }`}>
                                            {profileModal.subscriptionDaysRemaining !== null
                                                ? `${profileModal.subscriptionDaysRemaining} days`
                                                : 'N/A'}
                                        </p>
                                    </div>
                                    <div className="bg-white rounded-xl p-3">
                                        <p className="text-xs text-gray-500 mb-1">Status</p>
                                        <p className={`font-bold ${profileModal.isPaid ? 'text-green-600' : 'text-gray-600'
                                            }`}>
                                            {profileModal.isPaid ? 'PAID' : 'UNPAID'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* User Info */}
                            <div className="space-y-3 mb-6">
                                <h4 className="font-bold text-[#0f172a]">User Information</h4>
                                <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                                    <p className="text-sm"><span className="font-semibold">Name:</span> {profileModal.fullName}</p>
                                    <p className="text-sm"><span className="font-semibold">Email:</span> {profileModal.email}</p>
                                    <p className="text-sm"><span className="font-semibold">Mobile:</span> {profileModal.mobile}</p>
                                    {profileModal.companyName && (
                                        <p className="text-sm"><span className="font-semibold">Company:</span> {profileModal.companyName}</p>
                                    )}
                                </div>
                            </div>

                            {/* Payment History */}
                            {profileModal.paymentHistory && profileModal.paymentHistory.length > 0 && (
                                <div className="mb-6">
                                    <h4 className="font-bold text-[#0f172a] mb-3">Payment History</h4>
                                    <div className="space-y-2">
                                        {profileModal.paymentHistory.map(payment => (
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
                                onClick={() => setProfileModal(null)}
                                className="w-full py-2.5 bg-[#1a3c8f] text-white font-bold rounded-xl hover:bg-[#153275] transition-colors"
                            >
                                Close
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Pagination */}
            <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                totalItems={pagination.totalItems}
                itemsPerPage={pagination.itemsPerPage}
                onPageChange={handlePageChange}
                onLimitChange={handleLimitChange}
            />
        </AdminLayout>
    )
}

export default SubscriptionManagement
