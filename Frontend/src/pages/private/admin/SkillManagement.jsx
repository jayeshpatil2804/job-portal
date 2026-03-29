import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Search, Edit2, Trash2, X, Filter, CheckCircle2 } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../../../utils/api'
import AdminLayout from '../../../components/admin/AdminLayout'

const SkillManagement = () => {
    const [skills, setSkills] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [categoryFilter, setCategoryFilter] = useState('')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingId, setEditingId] = useState(null)
    const [formData, setFormData] = useState({ name: '', category: 'IT' })
    const [submitting, setSubmitting] = useState(false)

    useEffect(() => {
        fetchSkills()
    }, [])

    const fetchSkills = async () => {
        try {
            const res = await api.get('/admin/skills')
            setSkills(res.data.skills)
        } catch (error) {
            toast.error('Failed to load skills')
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSubmitting(true)
        try {
            if (editingId) {
                await api.put(`/admin/skills/${editingId}`, formData)
                toast.success('Skill updated')
            } else {
                await api.post('/admin/skills', formData)
                toast.success('Skill created')
            }
            setIsModalOpen(false)
            setFormData({ name: '', category: 'IT' })
            setEditingId(null)
            fetchSkills()
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error saving skill')
        } finally {
            setSubmitting(false)
        }
    }

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure?')) return
        try {
            await api.delete(`/admin/skills/${id}`)
            toast.success('Skill deleted')
            fetchSkills()
        } catch (error) {
            toast.error('Failed to delete skill')
        }
    }

    const openModal = (skill = null) => {
        if (skill) {
            setEditingId(skill.id)
            setFormData({ name: skill.name, category: skill.category || 'IT' })
        } else {
            setEditingId(null)
            setFormData({ name: '', category: 'IT' })
        }
        setIsModalOpen(true)
    }

    const filtered = skills.filter(s => 
        s.name.toLowerCase().includes(search.toLowerCase()) &&
        (categoryFilter === '' || s.category === categoryFilter)
    )

    const categories = ['IT', 'Non-IT', 'Healthcare', 'Finance', 'Engineering', 'Other']

    return (
        <AdminLayout title="Skills">
            <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-extrabold text-[#0f172a]">Job Skills Library</h2>
                    <p className="text-sm text-gray-500 mt-1">Manage technical and soft skills for job postings</p>
                </div>
                <button
                    onClick={() => openModal()}
                    className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#f97316] text-white rounded-xl font-bold shadow-lg shadow-orange-500/20 hover:bg-orange-600 transition-all"
                >
                    <Plus size={18} />
                    Add New Skill
                </button>
            </div>

            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search skills..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all text-sm"
                    />
                </div>
                <div className="md:w-64 relative">
                    <Filter size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <select
                        value={categoryFilter}
                        onChange={e => setCategoryFilter(e.target.value)}
                        className="w-full pl-11 pr-10 py-3 bg-white border border-gray-200 rounded-2xl appearance-none focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all text-sm"
                    >
                        <option value="">All Categories</option>
                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
            </div>

            {/* Grid of Skills */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {loading ? (
                    <div className="col-span-full py-10 text-center text-gray-400">Loading...</div>
                ) : filtered.length === 0 ? (
                    <div className="col-span-full py-10 text-center text-gray-400">No skills found</div>
                ) : (
                    filtered.map((item) => (
                        <motion.div
                            layout
                            key={item.id}
                            className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between group"
                        >
                            <div>
                                <h4 className="font-bold text-gray-900 leading-tight">{item.name}</h4>
                                <span className="text-[10px] font-bold text-blue-500 uppercase tracking-wider">{item.category}</span>
                            </div>
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                                <button 
                                    onClick={() => openModal(item)}
                                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"
                                >
                                    <Edit2 size={13} />
                                </button>
                                <button 
                                    onClick={() => handleDelete(item.id)}
                                    className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
                                >
                                    <Trash2 size={13} />
                                </button>
                            </div>
                        </motion.div>
                    ))
                )}
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
                                    {editingId ? 'Edit Skill' : 'Add New Skill'}
                                </h3>
                                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                    <X size={20} />
                                </button>
                            </div>
                            <form onSubmit={handleSubmit} className="p-8 space-y-5">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Skill Name</label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="e.g. React.js"
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all text-sm font-medium"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
                                    <select
                                        value={formData.category}
                                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all text-sm font-medium"
                                    >
                                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
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
                                        className="flex-1 py-3 px-4 bg-[#f97316] text-white rounded-2xl font-bold text-sm hover:bg-orange-600 shadow-lg shadow-orange-500/20 transition-all disabled:opacity-50"
                                    >
                                        {submitting ? 'Saving...' : 'Save Skill'}
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

export default SkillManagement
