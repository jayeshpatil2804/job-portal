import React from 'react'
import RecruiterLayout from '../../../../components/RecruiterLayout'
import { Plus, Eye, Edit2, PauseCircle, Trash2, Search } from 'lucide-react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const StatusCard = ({ label, count, color }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center flex-1">
        <h4 className={`text-3xl font-bold ${color}`}>{count}</h4>
        <p className="text-gray-500 text-sm font-medium mt-1">{label}</p>
    </div>
)

const ManageJobs = () => {
    const jobs = [
        { id: 1, title: 'Senior Textile Designer', dept: 'Design', location: 'Mumbai, Maharashtra', applicants: 45, date: '2026-03-08', status: 'Active' },
        { id: 2, title: 'Production Manager', dept: 'Production', location: 'Ahmedabad, Gujarat', applicants: 38, date: '2026-03-05', status: 'Active' },
        { id: 3, title: 'Machine Operator', dept: 'Operations', location: 'Ludhiana, Punjab', applicants: 52, date: '2026-03-01', status: 'Active' },
        { id: 4, title: 'Quality Inspector', dept: 'Quality', location: 'Surat, Gujarat', applicants: 21, date: '2026-02-25', status: 'Closed' },
        { id: 5, title: 'Merchandiser', dept: 'Merchandising', location: 'Bangalore, Karnataka', applicants: 34, date: '2026-02-20', status: 'Active' },
        { id: 6, title: 'Sales Executive', dept: 'Sales', location: 'Delhi NCR', applicants: 29, date: '2026-02-15', status: 'Paused' },
    ]

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Active': return 'bg-green-100 text-green-700'
            case 'Closed': return 'bg-red-100 text-red-700'
            case 'Paused': return 'bg-yellow-100 text-yellow-700'
            default: return 'bg-gray-100 text-gray-700'
        }
    }

    return (
        <RecruiterLayout>
            <div className="space-y-8">
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
                    <StatusCard label="Total Jobs" count="24" color="text-blue-600" />
                    <StatusCard label="Active" count="18" color="text-green-600" />
                    <StatusCard label="Paused" count="3" color="text-yellow-600" />
                    <StatusCard label="Closed" count="3" color="text-red-600" />
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
                                {jobs.map((job) => (
                                    <tr key={job.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-bold text-gray-900">{job.title}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{job.dept}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{job.location}</td>
                                        <td className="px-6 py-4 text-center text-sm font-bold text-blue-600">{job.applicants}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500">{job.date}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${getStatusStyle(job.status)}`}>
                                                {job.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center gap-2">
                                                <button title="View" className="p-1.5 hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors rounded">
                                                    <Eye size={16} />
                                                </button>
                                                <button title="Edit" className="p-1.5 hover:bg-green-50 text-gray-400 hover:text-green-600 transition-colors rounded">
                                                    <Edit2 size={16} />
                                                </button>
                                                <button title="Pause/Resume" className="p-1.5 hover:bg-yellow-50 text-gray-400 hover:text-yellow-600 transition-colors rounded">
                                                    <PauseCircle size={16} />
                                                </button>
                                                <button title="Delete" className="p-1.5 hover:bg-red-50 text-gray-400 hover:text-red-50 transition-colors rounded">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </RecruiterLayout>
    )
}

export default ManageJobs
