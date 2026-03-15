import React, { useState } from 'react'
import DashboardLayout from '../../components/DashboardLayout'
import { Eye } from 'lucide-react'

// Dummy Data
const appliedJobsData = [
    {
        id: 1,
        jobTitle: 'Senior Textile Designer',
        company: 'Arvind Mills',
        location: 'Mumbai, Maharashtra',
        salary: '₹6-8 LPA',
        appliedDate: '2026-03-10',
        status: 'Interview',
    },
    {
        id: 2,
        jobTitle: 'Production Manager',
        company: 'Welspun India',
        location: 'Ahmedabad, Gujarat',
        salary: '₹8-12 LPA',
        appliedDate: '2026-03-08',
        status: 'Shortlisted',
    },
    {
        id: 3,
        jobTitle: 'Merchandiser',
        company: 'Raymond Limited',
        location: 'Bangalore, Karnataka',
        salary: '₹5-7 LPA',
        appliedDate: '2026-03-05',
        status: 'Viewed',
    },
    {
        id: 4,
        jobTitle: 'Machine Operator',
        company: 'Vardhman Textiles',
        location: 'Ludhiana, Punjab',
        salary: '₹3-5 LPA',
        appliedDate: '2026-03-03',
        status: 'Applied',
    },
    {
        id: 5,
        jobTitle: 'Sales Executive',
        company: 'Trident Group',
        location: 'Delhi NCR',
        salary: '₹4-6 LPA',
        appliedDate: '2026-02-28',
        status: 'Rejected',
    },
]

// Status Helpers
const filters = ['All (5)', 'Applied', 'Viewed', 'Shortlisted', 'Interview', 'Rejected']

const getStatusClasses = (status) => {
    switch (status) {
        case 'Interview':
            return 'bg-green-100 text-green-700'
        case 'Shortlisted':
            return 'bg-purple-100 text-purple-700'
        case 'Viewed':
            return 'bg-yellow-100 text-yellow-700'
        case 'Applied':
            return 'bg-blue-100 text-blue-700'
        case 'Rejected':
            return 'bg-red-100 text-red-700'
        default:
            return 'bg-gray-100 text-gray-700'
    }
}

const AppliedJobsPage = () => {
    const [activeFilter, setActiveFilter] = useState('All (5)')

    return (
        <DashboardLayout>
            <div className="mb-8">
                <h1 className="text-3xl font-extrabold text-[#0f172a]">Applied Jobs</h1>
                <p className="text-gray-500 mt-1">Track your job applications and their status</p>
            </div>

            {/* ── Filters ── */}
            <div className="flex flex-wrap gap-3 mb-8">
                {filters.map((filter) => (
                    <button
                        key={filter}
                        onClick={() => setActiveFilter(filter)}
                        className={`px-5 py-2 rounded-lg text-sm font-semibold transition-colors border ${
                            activeFilter === filter
                                ? 'bg-[#1a3c8f] text-white border-[#1a3c8f]'
                                : 'bg-white text-[#1a3c8f] border-[#1a3c8f] hover:bg-blue-50'
                        }`}
                    >
                        {filter}
                    </button>
                ))}
            </div>

            {/* ── Table Container ── */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-2 md:p-6 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="border-b border-gray-100">
                                <th className="py-4 px-4 text-sm font-semibold text-gray-900">Job Title</th>
                                <th className="py-4 px-4 text-sm font-semibold text-gray-900">Company</th>
                                <th className="py-4 px-4 text-sm font-semibold text-gray-900">Location</th>
                                <th className="py-4 px-4 text-sm font-semibold text-gray-900">Salary</th>
                                <th className="py-4 px-4 text-sm font-semibold text-gray-900 pl-6">Applied Date</th>
                                <th className="py-4 px-4 text-sm font-semibold text-gray-900">Status</th>
                                <th className="py-4 px-4 text-sm font-semibold text-gray-900 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {appliedJobsData.map((job) => (
                                <tr key={job.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50 transition-colors">
                                    <td className="py-5 px-4">
                                        <div className="font-bold text-gray-900 text-sm">{job.jobTitle}</div>
                                    </td>
                                    <td className="py-5 px-4 text-sm text-gray-500">
                                        {job.company}
                                    </td>
                                    <td className="py-5 px-4 text-sm text-gray-500">
                                        {job.location}
                                    </td>
                                    <td className="py-5 px-4 text-sm font-bold text-orange-500">
                                        {job.salary}
                                    </td>
                                    <td className="py-5 px-4 text-sm text-gray-500 pl-6">
                                        {job.appliedDate}
                                    </td>
                                    <td className="py-5 px-4">
                                        <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${getStatusClasses(job.status)}`}>
                                            {job.status}
                                        </span>
                                    </td>
                                    <td className="py-5 px-4 text-center">
                                        <button className="text-[#1a3c8f] hover:text-[#162f72] transition-colors p-2 rounded-full hover:bg-blue-50 inline-flex items-center justify-center">
                                            <Eye size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

        </DashboardLayout>
    )
}

export default AppliedJobsPage
