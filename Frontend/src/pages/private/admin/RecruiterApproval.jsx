import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, XCircle, Clock, Search, Eye, Building2, Globe, ChevronDown } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../../../utils/api'
import AdminLayout from '../../../components/admin/AdminLayout'

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

    useEffect(() => {
        fetchRecruiters()
    }, [])

    const fetchRecruiters = async () => {
        try {
            const res = await api.get('/admin/recruiters')
            setRecruiters(res.data.recruiters)
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
                                        <td className="px-6 py-4">
                                            {r.isPaid ? (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-green-100 text-green-700">
                                                    Paid
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-gray-100 text-gray-400">
                                                    Unpaid
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
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
        </AdminLayout>
    )
}

export default RecruiterApproval
