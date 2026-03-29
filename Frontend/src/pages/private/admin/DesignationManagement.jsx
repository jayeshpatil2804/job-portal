import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Search, Edit2, Trash2, X, AlertCircle, CheckCircle2 } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../../../utils/api'
import AdminLayout from '../../../components/admin/AdminLayout'

const DesignationManagement = () => {
    const [designations, setDesignations] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingId, setEditingId] = useState(null)
    const [formData, setFormData] = useState({ name: '' })
    const [submitting, setSubmitting] = useState(false)

    useEffect(() => {
        fetchDesignations()
    }, [])

    const fetchDesignations = async () => {
        try {
            const res = await api.get('/admin/designations')
            setDesignations(res.data.designations)
        } catch (error) {
            toast.error('Failed to load designations')
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSubmitting(true)
        try {
            if (editingId) {
                await api.put(`/admin/designations/${editingId}`, formData)
                toast.success('Designation updated')
            } else {
                await api.post('/admin/designations', formData)
                toast.success('Designation created')
            }
            setIsModalOpen(false)
            setFormData({ name: '' })
            setEditingId(null)
            fetchDesignations()
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error saving designation')
        } finally {
            setSubmitting(false)
        }
    }

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this designation?')) return
        try {
            await api.delete(`/admin/designations/${id}`)
            toast.success('Designation deleted')
            fetchDesignations()
        } catch (error) {
            toast.error('Failed to delete designation')
        }
    }

    const openModal = (designation = null) => {
        if (designation) {
            setEditingId(designation.id)
            setFormData({ name: designation.name })
        } else {
            setEditingId(null)
            setFormData({ name: '' })
        }
        setIsModalOpen(true)
    }

    const filtered = designations.filter(d => 
        d.name.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <AdminLayout title="Designations">
            <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-extrabold text-[#0f172a]">Manage Designations</h2>
                    <p className="text-sm text-gray-500 mt-1">Add and manage job titles for recruiters</p>
                </div>
                <button
                    onClick={() => openModal()}
                    className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#1a3c8f] text-white rounded-xl font-bold shadow-lg shadow-blue-500/20 hover:bg-[#162f72] transition-all"
                >
                    <Plus size={18} />
                    Add Designation
                </button>
            </div>

            {/* Search Bar */}
            <div className="mb-6 relative">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search designations..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all text-sm"
                />
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-gray-50/50 border-b border-gray-100">
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Designation Name</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Jobs Linked</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Created At</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {loading ? (
                            <tr>
                                <td colSpan="4" className="px-6 py-10 text-center text-gray-400">Loading...</td>
                            </tr>
                        ) : filtered.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="px-6 py-10 text-center text-gray-400">No designations found</td>
                            </tr>
                        ) : (
                            filtered.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50/40 transition-colors">
                                    <td className="px-6 py-4">
                                        <span className="font-semibold text-gray-900">{item.name}</span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {item._count?.jobs || 0} Jobs
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {new Date(item.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button 
                                                onClick={() => openModal(item)}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(item.id)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                            onClick={() => setIsModalOpen(false)}
                        />
                        <motion.div 
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden"
                        >
                            <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between">
                                <h3 className="text-xl font-bold text-gray-900">
                                    {editingId ? 'Edit Designation' : 'Add New Designation'}
                                </h3>
                                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                    <X size={20} />
                                </button>
                            </div>
                            <form onSubmit={handleSubmit} className="p-8 space-y-5">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Designation Name</label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="e.g. Software Engineer"
                                        value={formData.name}
                                        onChange={e => setFormData({ name: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all text-sm font-medium"
                                    />
                                </div>
                                <div className="flex gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="flex-1 py-3 px-4 border border-gray-200 text-gray-600 rounded-2xl font-bold text-sm hover:bg-gray-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="flex-1 py-3 px-4 bg-[#1a3c8f] text-white rounded-2xl font-bold text-sm hover:bg-[#162f72] shadow-lg shadow-blue-500/20 transition-all disabled:opacity-50"
                                    >
                                        {submitting ? 'Saving...' : 'Save Designation'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </AdminLayout>
    )
}

export default DesignationManagement
