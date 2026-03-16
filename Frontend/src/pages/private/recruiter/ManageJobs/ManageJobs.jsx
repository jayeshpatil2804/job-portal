import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Plus, Eye, Edit2, PauseCircle, Trash2, Search, PlusCircle, CheckCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import RecruiterLayout from '../../../../components/RecruiterLayout'
import { getMyJobs, deleteJob, closeJob, updateJobStatus } from '../../../../redux/actions/jobActions'
import toast from 'react-hot-toast'
import ConfirmationModal from '../../../../components/ConfirmationModal'

const StatusCard = ({ label, count, color }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center flex-1">
        <h4 className={`text-3xl font-bold ${color}`}>{count}</h4>
        <p className="text-gray-500 text-sm font-medium mt-1">{label}</p>
    </div>
)

const ManageJobs = () => {
    const dispatch = useDispatch()
    const { myJobs: jobs, loading } = useSelector(state => state.job)
    
    const [modalConfig, setModalConfig] = useState({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: () => {},
        confirmText: '',
        variant: 'danger',
        loading: false
    });

    React.useEffect(() => {
        dispatch(getMyJobs())
    }, [dispatch])

    const handleDeleteClick = (id) => {
        setModalConfig({
            isOpen: true,
            title: 'Delete Job Posting',
            message: 'Are you sure you want to delete this job? This action will remove all application data associated with it and cannot be undone.',
            confirmText: 'Delete Forever',
            variant: 'danger',
            onConfirm: () => confirmDelete(id)
        });
    }

    const confirmDelete = async (id) => {
        setModalConfig(prev => ({ ...prev, loading: true }));
        try {
            await dispatch(deleteJob(id)).unwrap();
            toast.success("Job deleted successfully");
            setModalConfig(prev => ({ ...prev, isOpen: false }));
        } catch (error) {
            toast.error(error || "Failed to delete job");
        } finally {
            setModalConfig(prev => ({ ...prev, loading: false }));
        }
    }

    const handleCloseClick = (id) => {
        setModalConfig({
            isOpen: true,
            title: 'Close Job Hiring',
            message: 'Are you sure you want to close this job? You will no longer receive new applications for this position.',
            confirmText: 'Close Job',
            variant: 'warning',
            onConfirm: () => confirmClose(id)
        });
    }

    const confirmClose = async (id) => {
        setModalConfig(prev => ({ ...prev, loading: true }));
        try {
            await dispatch(closeJob(id)).unwrap();
            toast.success("Job closed successfully");
            setModalConfig(prev => ({ ...prev, isOpen: false }));
        } catch (error) {
            toast.error(error || "Failed to close job");
        } finally {
            setModalConfig(prev => ({ ...prev, loading: false }));
        }
    }

    const handlePublishClick = (id) => {
        setModalConfig({
            isOpen: true,
            title: 'Publish Job Posting',
            message: 'Are you sure you want to publish this job? It will become visible to all candidates and they will be able to apply.',
            confirmText: 'Publish Now',
            variant: 'info',
            onConfirm: () => confirmToggleStatus(id, 'OPEN', 'published')
        });
    }

    const handleReopenClick = (id) => {
        setModalConfig({
            isOpen: true,
            title: 'Re-open Job Position',
            message: 'Are you sure you want to re-open this job? New candidates will be able to view and apply for this position again.',
            confirmText: 'Re-open Job',
            variant: 'info',
            onConfirm: () => confirmToggleStatus(id, 'OPEN', 're-opened')
        });
    }

    const confirmToggleStatus = async (id, status, actionLabel) => {
        setModalConfig(prev => ({ ...prev, loading: true }));
        try {
            await dispatch(updateJobStatus({ id, status })).unwrap();
            toast.success(`Job ${actionLabel} successfully`);
            setModalConfig(prev => ({ ...prev, isOpen: false }));
        } catch (error) {
            toast.error(error || `Failed to ${status === 'OPEN' ? 'publish' : 'update'} job`);
        } finally {
            setModalConfig(prev => ({ ...prev, loading: false }));
        }
    }

    const getStatusStyle = (status) => {
        switch (status) {
            case 'OPEN': return 'bg-green-100 text-green-700'
            case 'CLOSED': return 'bg-red-100 text-red-700'
            case 'DRAFT': return 'bg-gray-100 text-gray-700'
            case 'PAUSED': return 'bg-yellow-100 text-yellow-700'
            default: return 'bg-blue-100 text-blue-700'
        }
    }

    // Status Counts
    const stats = {
        total: jobs.length,
        active: jobs.filter(j => j.status === 'OPEN').length,
        draft: jobs.filter(j => j.status === 'DRAFT').length,
        closed: jobs.filter(j => j.status === 'CLOSED').length
    }

    return (
        <RecruiterLayout>
            <div className="space-y-8 relative">
                <ConfirmationModal 
                    {...modalConfig}
                    onClose={() => setModalConfig(prev => ({ ...prev, isOpen: false }))}
                />
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Manage Jobs</h1>
                        <p className="text-gray-500">View and manage all your job postings</p>
                    </div>
                    <Link 
                        to="/recruiter/post-job"
                        className="flex items-center gap-2 bg-[#1a3c8f] text-white px-6 py-2.5 rounded-lg font-bold hover:bg-blue-800 transition-shadow shadow-md uppercase text-sm"
                    >
                        <Plus size={18} />
                        Post New Job
                    </Link>
                </div>

                {/* Status Summary */}
                <div className="flex flex-wrap gap-6">
                    <StatusCard label="Total Jobs" count={stats.total} color="text-blue-600" />
                    <StatusCard label="Active" count={stats.active} color="text-green-600" />
                    <StatusCard label="Drafts" count={stats.draft} color="text-gray-600" />
                    <StatusCard label="Closed" count={stats.closed} color="text-red-600" />
                </div>

                {/* Filters and Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between">
                        <div className="relative w-full md:w-96">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input 
                                type="text" 
                                placeholder="Search jobs..." 
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            />
                        </div>
                        <div className="flex gap-2">
                            <select className="px-4 py-2 border border-gray-200 rounded-lg outline-none text-sm font-medium">
                                <option>All Departments</option>
                            </select>
                            <select className="px-4 py-2 border border-gray-200 rounded-lg outline-none text-sm font-medium">
                                <option>All Status</option>
                            </select>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    <th className="px-6 py-4">Job Title</th>
                                    <th className="px-6 py-4">Department</th>
                                    <th className="px-6 py-4">Location</th>
                                    <th className="px-6 py-4 text-center">Applicants</th>
                                    <th className="px-6 py-4">Posted Date</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 uppercase font-bold text-xs0">
                                {loading && jobs.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="px-6 py-10 text-center text-gray-500">
                                            Loading jobs...
                                        </td>
                                    </tr>
                                ) : jobs.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="px-6 py-10 text-center text-gray-500">
                                            No jobs found. Start by posting a new job!
                                        </td>
                                    </tr>
                                ) : (
                                    jobs.map((job) => (
                                        <tr key={job.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-bold text-gray-900">{job.title}</div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">{job.department}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600">{job.location}</td>
                                            <td className="px-6 py-4 text-center text-sm font-bold text-blue-600">{job._count?.applications || 0}</td>
                                            <td className="px-6 py-4 text-sm text-gray-500">
                                                {new Date(job.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${getStatusStyle(job.status)}`}>
                                                    {job.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-center gap-2">
                                                    <Link to={`/recruiter/view-job/${job.id}`} title="View" className="p-1.5 hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors rounded">
                                                        <Eye size={16} />
                                                    </Link>
                                                    {job.status === 'DRAFT' && (
                                                        <button 
                                                            onClick={() => handlePublishClick(job.id)}
                                                            title="Publish Job" 
                                                            className="p-1.5 hover:bg-green-50 text-gray-400 hover:text-green-600 transition-colors rounded"
                                                        >
                                                            <CheckCircle size={16} />
                                                        </button>
                                                    )}
                                                    {job.status === 'OPEN' && (
                                                        <button 
                                                            onClick={() => handleCloseClick(job.id)}
                                                            title="Close Job" 
                                                            className="p-1.5 hover:bg-yellow-50 text-gray-400 hover:text-yellow-600 transition-colors rounded"
                                                        >
                                                            <PauseCircle size={16} />
                                                        </button>
                                                    )}
                                                    {job.status === 'CLOSED' && (
                                                        <button 
                                                            onClick={() => handleReopenClick(job.id)}
                                                            title="Re-open Job" 
                                                            className="p-1.5 hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors rounded"
                                                        >
                                                            <PlusCircle size={16} />
                                                        </button>
                                                    )}
                                                    <button 
                                                        onClick={() => handleDeleteClick(job.id)}
                                                        title="Delete" 
                                                        className="p-1.5 hover:bg-red-50 text-gray-400 hover:text-red-50 transition-colors rounded"
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
                </div>
            </div>
        </RecruiterLayout>
    )
}

export default ManageJobs
