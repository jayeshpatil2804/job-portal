import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Trash2, ShieldCheck, Edit3, X, Check } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../../../utils/api'
import AdminLayout from '../../../components/admin/AdminLayout'

const PERMISSION_LIST = [
    { key: 'RECRUITER_APPROVAL', label: 'Recruiter Approval' },
    { key: 'JOB_MODERATION', label: 'Job Moderation' },
    { key: 'CANDIDATE_MANAGEMENT', label: 'Candidate Management' },
    { key: 'SUB_ADMIN_MANAGEMENT', label: 'Sub Admin Management' },
    { key: 'REPORTS', label: 'Reports' },
]

const avatarColors = ['bg-[#1a3c8f]', 'bg-purple-600', 'bg-orange-500', 'bg-green-600', 'bg-rose-500']

const SubAdminManagement = () => {
    const [admins, setAdmins] = useState([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [form, setForm] = useState({ name: '', email: '', permissions: [] })
    const [editId, setEditId] = useState(null)

    useEffect(() => {
        fetchAdmins()
    }, [])

    const fetchAdmins = async () => {
        try {
            const res = await api.get('/admin/subadmins')
            setAdmins(res.data.admins)
        } catch (error) {
            toast.error('Failed to load sub-admins')
        } finally {
            setLoading(false)
        }
    }

    const togglePermission = (key) => {
        setForm(f => ({
            ...f,
            permissions: f.permissions.includes(key)
                ? f.permissions.filter(p => p !== key)
                : [...f.permissions, key]
        }))
    }

    const handleCreate = async () => {
        if (!form.name || !form.email) return
        try {
            if (editId) {
                await api.put(`/admin/subadmins/${editId}`, form)
                setAdmins(prev => prev.map(a => a.id === editId ? { ...a, ...form } : a))
                toast.success('Sub-admin updated successfully')
                setEditId(null)
            } else {
                await api.post('/admin/subadmins', form)
                fetchAdmins() // Refresh list since the server creates ID
                toast.success('Sub-admin created successfully')
            }
            setForm({ name: '', email: '', permissions: [] })
            setShowForm(false)
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to save sub-admin')
        }
    }

    const handleEdit = (admin) => {
        setForm({ name: admin.name, email: admin.email, permissions: admin.permissions })
        setEditId(admin.id)
        setShowForm(true)
    }

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this sub-admin?')) return
        try {
            await api.delete(`/admin/subadmins/${id}`)
            setAdmins(prev => prev.filter(a => a.id !== id))
            toast.success('Sub-admin deleted')
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete sub-admin')
        }
    }

    if (loading) return (
        <AdminLayout title="Sub Admin Management">
            <div className="flex h-64 items-center justify-center">
                <div className="w-8 h-8 border-4 border-[#1a3c8f] border-t-transparent rounded-full animate-spin" />
            </div>
        </AdminLayout>
    )

    return (
        <AdminLayout title="Sub Admin Management">
            <div className="mb-6 flex items-start justify-between gap-4 flex-wrap">
                <div>
                    <h2 className="text-2xl font-extrabold text-[#0f172a]">Sub Admin Management</h2>
                    <p className="text-sm text-gray-500 mt-0.5">Create and manage admin roles with permissions</p>
                </div>
                <button
                    onClick={() => { setShowForm(true); setEditId(null); setForm({ name: '', email: '', permissions: [] }) }}
                    className="flex items-center gap-2 px-4 py-2.5 bg-[#1a3c8f] hover:bg-[#162f72] text-white text-sm font-bold rounded-xl transition-colors shadow-md"
                >
                    <Plus size={16} /> Add Sub Admin
                </button>
            </div>

            {/* Create / Edit Form */}
            {showForm && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl border border-[#1a3c8f]/20 shadow-lg p-6 mb-6"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-[#0f172a]">{editId ? 'Edit Sub Admin' : 'Create Sub Admin'}</h3>
                        <button onClick={() => setShowForm(false)} className="p-2 rounded-xl hover:bg-gray-100 text-gray-500 transition-colors"><X size={16} /></button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                        <div>
                            <label className="block text-xs font-bold text-gray-600 mb-1.5">Full Name</label>
                            <input
                                type="text"
                                placeholder="e.g. Rahul Admin"
                                value={form.name}
                                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1a3c8f] focus:ring-2 focus:ring-blue-100 transition"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-600 mb-1.5">Email Address</label>
                            <input
                                type="email"
                                placeholder="admin@losodhan.in"
                                value={form.email}
                                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1a3c8f] focus:ring-2 focus:ring-blue-100 transition"
                            />
                        </div>
                    </div>
                    <div className="mb-5">
                        <label className="block text-xs font-bold text-gray-600 mb-2">Permissions</label>
                        <div className="flex flex-wrap gap-2">
                            {PERMISSION_LIST.map(p => (
                                <button
                                    key={p.key}
                                    onClick={() => togglePermission(p.key)}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border-2 transition-all duration-200 ${
                                        form.permissions.includes(p.key)
                                            ? 'border-[#1a3c8f] bg-[#1a3c8f] text-white'
                                            : 'border-gray-200 text-gray-600 hover:border-[#1a3c8f]'
                                    }`}
                                >
                                    {form.permissions.includes(p.key) && <Check size={11} />}
                                    {p.label}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button onClick={handleCreate} className="px-5 py-2.5 bg-[#f97316] hover:bg-orange-600 text-white text-sm font-bold rounded-xl transition-colors">
                            {editId ? 'Save Changes' : 'Create Admin'}
                        </button>
                        <button onClick={() => setShowForm(false)} className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm font-bold rounded-xl transition-colors">
                            Cancel
                        </button>
                    </div>
                </motion.div>
            )}

            {/* Admin Cards */}
            <div className="space-y-4">
                {admins.map((admin, i) => (
                    <motion.div
                        key={admin.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.06 }}
                        className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-all duration-300"
                    >
                        <div className="flex items-start gap-4">
                            <div className={`w-12 h-12 rounded-xl ${avatarColors[i % avatarColors.length]} flex items-center justify-center text-white font-bold text-sm shrink-0`}>
                                {admin.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <p className="font-bold text-gray-900 text-sm">{admin.name}</p>
                                    {admin.role === 'SUPER_ADMIN' && (
                                        <span className="flex items-center gap-1 px-2 py-0.5 bg-[#1a3c8f] text-white text-[10px] font-bold rounded-full">
                                            <ShieldCheck size={10} /> Super Admin
                                        </span>
                                    )}
                                </div>
                                <p className="text-xs text-gray-400 mt-0.5">{admin.email}</p>
                                <p className="text-xs text-gray-400 mt-0.5">Created: {admin.createdOn}</p>
                                <div className="flex flex-wrap gap-1.5 mt-3">
                                    {admin.permissions.map(pk => {
                                        const perm = PERMISSION_LIST.find(p => p.key === pk)
                                        return perm ? (
                                            <span key={pk} className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-bold rounded-lg">{perm.label}</span>
                                        ) : null
                                    })}
                                    {admin.permissions.length === 0 && <span className="text-xs text-gray-400 italic">No permissions assigned</span>}
                                </div>
                            </div>
                            {admin.role !== 'SUPER_ADMIN' && (
                                <div className="flex items-center gap-2 shrink-0">
                                    <button
                                        onClick={() => handleEdit(admin)}
                                        className="p-2 rounded-xl hover:bg-blue-50 text-gray-400 hover:text-[#1a3c8f] transition-colors"
                                    >
                                        <Edit3 size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(admin.id)}
                                        className="p-2 rounded-xl hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>
        </AdminLayout>
    )
}

export default SubAdminManagement
