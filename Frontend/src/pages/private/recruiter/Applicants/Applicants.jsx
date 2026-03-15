import React from 'react'
import RecruiterLayout from '../../../../components/RecruiterLayout'
import { Search, Download, Mail, MessageSquare, CheckCircle, XCircle } from 'lucide-react'
import { motion } from 'framer-motion'

const SummaryCard = ({ label, count, color }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex-1 min-w-[150px] text-center">
        <h4 className="text-3xl font-bold text-gray-800">{count}</h4>
        <p className={`text-sm font-medium mt-1 ${color}`}>{label}</p>
    </div>
)

const Applicants = () => {
    const applicants = [
        { id: 1, name: 'Rahul Kumar', email: 'rahul.kumar@email.com', phone: '+91 9876543210', position: 'Senior Textile Designer', exp: '5 years', location: 'Mumbai', date: '2026-03-10', status: 'New' },
        { id: 2, name: 'Priya Sharma', email: 'priya.sharma@email.com', phone: '+91 9876543211', position: 'Senior Textile Designer', exp: '4 years', location: 'Bangalore', date: '2026-03-09', status: 'Reviewed' },
        { id: 3, name: 'Amit Patel', email: 'amit.patel@email.com', phone: '+91 9876543212', position: 'Production Manager', exp: '7 years', location: 'Ahmedabad', date: '2026-03-08', status: 'Shortlisted' },
        { id: 4, name: 'Sneha Reddy', email: 'sneha.reddy@email.com', phone: '+91 9876543213', position: 'Machine Operator', exp: '3 years', location: 'Ludhiana', date: '2026-03-07', status: 'Interviewed' },
        { id: 5, name: 'Rajesh Singh', email: 'rajesh.singh@email.com', phone: '+91 9876543214', position: 'Quality Inspector', exp: '2 years', location: 'Surat', date: '2026-03-06', status: 'Rejected' },
    ]

    const getStatusStyle = (status) => {
        switch (status) {
            case 'New': return 'bg-blue-100 text-blue-700'
            case 'Reviewed': return 'bg-yellow-100 text-yellow-700'
            case 'Shortlisted': return 'bg-purple-100 text-purple-700'
            case 'Interviewed': return 'bg-green-100 text-green-700'
            case 'Rejected': return 'bg-red-100 text-red-700'
            default: return 'bg-gray-100 text-gray-700'
        }
    }

    return (
        <RecruiterLayout>
            <div className="space-y-8">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Applicants</h1>
                    <p className="text-gray-500">Review and manage job applications</p>
                </div>

                {/* Filters Row */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col lg:flex-row gap-4 items-center">
                    <div className="relative flex-1 w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search by name, email, or phone..." 
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        />
                    </div>
                    <div className="flex gap-4 w-full lg:w-auto">
                        <select className="flex-1 lg:w-64 px-4 py-2 border border-gray-200 rounded-lg outline-none text-sm font-medium">
                            <option>All Positions</option>
                            <option>Senior Textile Designer</option>
                            <option>Production Manager</option>
                        </select>
                        <select className="flex-1 lg:w-48 px-4 py-2 border border-gray-200 rounded-lg outline-none text-sm font-medium">
                            <option>All Status</option>
                            <option>New</option>
                            <option>Shortlisted</option>
                        </select>
                    </div>
                </div>

                {/* Summary Row */}
                <div className="flex flex-wrap gap-4">
                    <SummaryCard label="Total" count="156" color="text-gray-600" />
                    <SummaryCard label="New" count="45" color="text-blue-600" />
                    <SummaryCard label="Shortlisted" count="48" color="text-purple-600" />
                    <SummaryCard label="Interviewed" count="32" color="text-green-600" />
                    <SummaryCard label="Rejected" count="31" color="text-red-600" />
                </div>

                {/* Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    <th className="px-6 py-4 w-10">
                                        <input type="checkbox" className="rounded" />
                                    </th>
                                    <th className="px-6 py-4">Name</th>
                                    <th className="px-6 py-4">Position</th>
                                    <th className="px-6 py-4">Experience</th>
                                    <th className="px-6 py-4">Location</th>
                                    <th className="px-6 py-4">Applied Date</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 uppercase font-bold text-[11px]">
                                {applicants.map((app) => (
                                    <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <input type="checkbox" className="rounded" />
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-gray-900">{app.name}</span>
                                                <span className="text-[10px] text-gray-500 normal-case">{app.email}</span>
                                                <span className="text-[10px] text-gray-500">{app.phone}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-700">{app.position}</td>
                                        <td className="px-6 py-4 text-gray-600">{app.exp}</td>
                                        <td className="px-6 py-4 text-gray-600">{app.location}</td>
                                        <td className="px-6 py-4 text-gray-500">{app.date}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-[9px] font-bold ${getStatusStyle(app.status)}`}>
                                                {app.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center gap-2">
                                                <button title="Download Resume" className="p-2 bg-[#1a3c8f] text-white rounded hover:bg-blue-800 transition-colors">
                                                    <Download size={14} />
                                                </button>
                                                <button title="Message" className="p-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors">
                                                    <Mail size={14} />
                                                </button>
                                                <button title="Shortlist" className="p-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors">
                                                    <CheckCircle size={14} />
                                                </button>
                                                <button title="Reject" className="p-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors">
                                                    <XCircle size={14} />
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

export default Applicants
