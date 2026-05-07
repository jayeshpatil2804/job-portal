import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Eye, MapPin, Briefcase, GraduationCap, Phone, Mail, X, Calendar, RefreshCw, Key, ShieldCheck, ShieldAlert } from 'lucide-react'
import toast from 'react-hot-toast'
import Swal from 'sweetalert2'
import api from '../../../utils/api'
import AdminLayout from '../../../components/admin/AdminLayout'
import Pagination from '../../../components/common/Pagination'

const avatarColors = ['bg-blue-500', 'bg-purple-500', 'bg-orange-500', 'bg-green-500', 'bg-rose-500', 'bg-teal-500']

const CandidateManagement = () => {
    const [candidates, setCandidates] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [profileOpen, setProfileOpen] = useState(null)
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
        fetchCandidates()
    }, [pagination.currentPage, pagination.itemsPerPage])

    const fetchCandidates = async () => {
        try {
            setLoading(true)
            const res = await api.get('/admin/candidates', {
                params: {
                    page: pagination.currentPage,
                    limit: pagination.itemsPerPage
                }
            })
            setCandidates(res.data.candidates)
            if (res.data.pagination) {
                setPagination(prev => ({
                    ...prev,
                    ...res.data.pagination
                }))
            }
        } catch (error) {
            toast.error('Failed to load candidates')
        } finally {
            setLoading(false)
        }
    }

    const handleActivationToggle = async (id, currentStatus) => {
        try {
            await api.patch(`/admin/candidates/${id}/activate`, { isActive: !currentStatus })
            setCandidates(prev => prev.map(c => c.id === id ? { ...c, isActive: !currentStatus } : c))
            toast.success(`Candidate account ${!currentStatus ? 'activated' : 'deactivated'}`)
        } catch (error) {
            toast.error('Failed to toggle activation status')
        }
    }

    const openSubscriptionProfile = async (id) => {
        try {
            const res = await api.get(`/admin/candidates/${id}`)
            setSubscriptionProfile(res.data.candidate)
        } catch (error) {
            toast.error('Failed to load candidate profile')
        }
    }

    const fetchCandidateOtp = async (email) => {
        try {
            setFetchingOtp(true)
            const res = await api.get(`/admin/candidates/${email}/otp`)
            Swal.fire({
                title: 'Candidate OTP',
                html: `
                    <div class="p-4 bg-amber-50 rounded-2xl border-2 border-amber-200">
                        <p class="text-amber-800 text-sm font-bold mb-1 uppercase tracking-widest">Verification Code</p>
                        <h2 class="text-4xl font-black text-[#1a3c8f] tracking-widest">${res.data.otp}</h2>
                    </div>
                `,
                confirmButtonText: 'Copy & Close',
                confirmButtonColor: '#1a3c8f',
                customClass: {
                    popup: 'rounded-[2rem]',
                    confirmButton: 'rounded-xl px-8 py-3 text-xs font-black uppercase tracking-widest'
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    navigator.clipboard.writeText(res.data.otp)
                    toast.success('OTP copied to clipboard!')
                }
            })
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to fetch OTP')
        } finally {
            setFetchingOtp(false)
        }
    }

    const regenerateOtp = async (email) => {
        try {
            setFetchingOtp(true)
            const res = await api.post(`/admin/candidates/${email}/otp/regenerate`)
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

    const filtered = candidates.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.role.toLowerCase().includes(search.toLowerCase()) ||
        c.location.toLowerCase().includes(search.toLowerCase())
    )

    if (loading) return (
        <AdminLayout title="Candidate Management">
            <div className="flex h-64 items-center justify-center">
                <div className="w-8 h-8 border-4 border-[#1a3c8f] border-t-transparent rounded-full animate-spin" />
            </div>
        </AdminLayout>
    )

    return (
        <AdminLayout title="Candidate Management">
            <div className="mb-6">
                <h2 className="text-2xl font-extrabold text-[#0f172a]">Candidate Management</h2>
                <p className="text-sm text-gray-500 mt-0.5">Browse and review all registered candidates</p>
            </div>

            {/* Search */}
            <div className="relative mb-6">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search by name, role, or location..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1a3c8f] focus:ring-2 focus:ring-blue-100 transition"
                />
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {filtered.map((c, i) => (
                    <motion.div
                        key={c.id}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.06 }}
                        className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-all duration-300 group"
                    >
                        <div className="flex items-start gap-4">
                            <div className={`w-12 h-12 rounded-xl ${avatarColors[i % avatarColors.length]} flex items-center justify-center text-white font-bold text-sm shrink-0`}>
                                {c.avatar}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-gray-900 text-sm truncate">{c.name}</h4>
                                <p className="text-xs text-[#1a3c8f] font-semibold">{c.role}</p>
                                <div className="flex items-center gap-3 mt-1">
                                    <div className="flex items-center gap-1 text-gray-400">
                                        <MapPin size={11} />
                                        <span className="text-xs">{c.location}</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <span className={`px-1.5 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider ${c.isActive ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'}`}>
                                            {c.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                        <span className={`px-1.5 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider ${c.isVerified ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                            {c.isVerified ? 'Verified' : 'Pending'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3 mt-4 text-xs text-gray-500">
                            <span className="flex items-center gap-1"><Briefcase size={12} />{c.experience}</span>
                            <span className="flex items-center gap-1"><GraduationCap size={12} />{c.education}</span>
                            <span className="ml-auto font-semibold text-[#f97316]">{c.applied} applied</span>
                        </div>

                        <div className="flex flex-wrap gap-1.5 mt-3">
                            {c.skills.map(sk => (
                                <span key={sk} className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-bold rounded-lg">{sk}</span>
                            ))}
                        </div>

                        <div className="mt-4 flex gap-2">
                            {!c.isVerified && (
                                <button
                                    onClick={() => fetchCandidateOtp(c.email)}
                                    className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl transition-all duration-200"
                                >
                                    <Key size={14} /> OTP
                                </button>
                            )}
                            <button
                                onClick={() => handleActivationToggle(c.id, c.isActive)}
                                className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-white text-xs font-bold rounded-xl transition-all duration-200 ${c.isActive ? 'bg-orange-500 hover:bg-orange-600' : 'bg-blue-600 hover:bg-blue-700'}`}
                            >
                                {c.isActive ? 'Deactivate' : 'Activate'}
                            </button>
                            <button
                                onClick={() => openSubscriptionProfile(c.id)}
                                className="flex-[0.5] flex items-center justify-center gap-1.5 py-2 border border-[#1a3c8f] text-[#1a3c8f] text-xs font-bold rounded-xl hover:bg-[#1a3c8f] hover:text-white transition-all duration-200"
                            >
                                <Eye size={14} /> Profile
                            </button>
                        </div>
                    </motion.div>
                ))}
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

            {/* Profile Drawer */}
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
                                <h3 className="font-bold text-xl text-[#0f172a]">Candidate Profile</h3>
                                <button
                                    onClick={() => setSubscriptionProfile(null)}
                                    className="p-2 rounded-xl hover:bg-gray-100 text-gray-500 transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* User Info */}
                            <div className="space-y-3 mb-6">
                                <div className="flex items-center gap-4 mb-5">
                                    <div className={`w-14 h-14 rounded-2xl bg-blue-500 flex items-center justify-center text-white font-bold text-lg`}>
                                        {subscriptionProfile.fullName.split(' ').map(n => n[0]).join('').toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="font-extrabold text-gray-900">{subscriptionProfile.fullName}</p>
                                        <p className="text-sm text-[#1a3c8f] font-semibold">Candidate</p>
                                    </div>
                                </div>
                                <div className="space-y-2 text-sm">
                                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl"><Mail size={15} className="text-gray-400" /><span>{subscriptionProfile.email}</span></div>
                                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl"><Phone size={15} className="text-gray-400" /><span>{subscriptionProfile.mobile}</span></div>
                                    {subscriptionProfile.profile?.city && (
                                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl"><MapPin size={15} className="text-gray-400" /><span>{subscriptionProfile.profile.city}</span></div>
                                    )}
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
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
                        onClick={() => setOtpData(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            onClick={e => e.stopPropagation()}
                            className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md overflow-hidden p-10 text-center"
                        >
                            <div className="w-20 h-20 bg-amber-50 rounded-[2rem] flex items-center justify-center text-amber-600 mx-auto mb-6 shadow-inner">
                                <Key size={36} />
                            </div>
                            
                            <h3 className="text-2xl font-black text-gray-900 tracking-tight mb-2">Verification Code</h3>
                            <p className="text-gray-500 font-bold text-sm mb-8 px-4">Provide this code to <span className="text-[#1a3c8f]">{otpData.email}</span> for account activation.</p>

                            <div className="bg-gray-50 rounded-[2rem] p-8 mb-8 border border-gray-100 shadow-inner group relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-amber-200/20 rounded-full -mr-12 -mt-12 blur-2xl"></div>
                                <div className="text-5xl font-black text-[#1a3c8f] tracking-[0.2em] relative z-10">
                                    {otpData.otp}
                                </div>
                                <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mt-4">Expires: {new Date(otpData.expiresAt).toLocaleTimeString()}</p>
                            </div>

                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={() => regenerateOtp(otpData.email)}
                                    disabled={fetchingOtp}
                                    className="w-full py-5 bg-gray-900 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-gray-900/10 hover:bg-black transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
                                >
                                    <RefreshCw size={16} className={fetchingOtp ? 'animate-spin' : ''} />
                                    {fetchingOtp ? 'Generating...' : 'Regenerate OTP'}
                                </button>
                                <button
                                    onClick={() => setOtpData(null)}
                                    className="w-full py-4 text-gray-400 font-black uppercase tracking-widest text-[10px] hover:text-gray-600 transition-all"
                                >
                                    Dismiss
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

        </AdminLayout>
    )
}

export default CandidateManagement
