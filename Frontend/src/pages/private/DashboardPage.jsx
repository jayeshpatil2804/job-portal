import React from 'react'
import DashboardLayout from '../../components/DashboardLayout'
import { FileText, Bookmark, Eye, Phone } from 'lucide-react'

// Dummy Data
const stats = [
    {
        title: 'Applied Jobs',
        count: '12',
        icon: <FileText size={24} className="text-[#3b82f6]" />,
        bgColor: 'bg-blue-50',
    },
    {
        title: 'Saved Jobs',
        count: '8',
        icon: <Bookmark size={24} className="text-[#f97316]" />,
        bgColor: 'bg-orange-50',
    },
    {
        title: 'Profile Views',
        count: '45',
        icon: <Eye size={24} className="text-[#22c55e]" />,
        bgColor: 'bg-green-50',
    },
    {
        title: 'Interview Calls',
        count: '3',
        icon: <Phone size={24} className="text-[#a855f7]" />,
        bgColor: 'bg-purple-50',
    },
]

const recentApplications = [
    {
        id: 1,
        jobTitle: 'Senior Textile Designer',
        company: 'Arvind Mills',
        appliedDate: '2026-03-10',
        status: 'Interview',
    },
    {
        id: 2,
        jobTitle: 'Production Manager',
        company: 'Welspun India',
        appliedDate: '2026-03-08',
        status: 'Shortlisted',
    },
    {
        id: 3,
        jobTitle: 'Merchandiser',
        company: 'Raymond Limited',
        appliedDate: '2026-03-05',
        status: 'Viewed',
    },
]

const recommendedJobs = [
    {
        id: 1,
        title: 'Textile Quality Controller',
        company: 'Vardhman Textiles',
        location: 'Ludhiana, Punjab',
        salary: '₹4-6 LPA',
    },
    {
        id: 2,
        title: 'Fashion Designer',
        company: 'Trident Group',
        location: 'Mumbai, Maharashtra',
        salary: '₹5-8 LPA',
    },
]

// Helpers for Status Styling
const getStatusClasses = (status) => {
    switch (status) {
        case 'Interview':
            return 'bg-green-100 text-green-700'
        case 'Shortlisted':
            return 'bg-purple-100 text-purple-700'
        case 'Viewed':
            return 'bg-yellow-100 text-yellow-700'
        default:
            return 'bg-gray-100 text-gray-700'
    }
}

const DashboardPage = () => {
    return (
        <DashboardLayout>
            <div className="mb-8">
                <h1 className="text-3xl font-extrabold text-[#0f172a]">Dashboard</h1>
                <p className="text-gray-500 mt-1">Welcome back! Here's your job search overview</p>
            </div>

            {/* ── Stats Grid ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center gap-4 hover:shadow-md transition-shadow">
                        <div className={`w-14 h-14 rounded-lg flex items-center justify-center shrink-0 ${stat.bgColor}`}>
                            {stat.icon}
                        </div>
                        <div>
                            <h3 className="text-2xl font-extrabold text-gray-900 leading-tight">{stat.count}</h3>
                            <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Main Content Area (Two Columns) ── */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                
                {/* ── Left Column: Recent Applications ── */}
                <div className="xl:col-span-2 space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-lg font-bold text-gray-900 mb-6">Recent Applications</h2>
                        
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-gray-100">
                                        <th className="pb-3 text-sm font-semibold text-gray-600">Job Title</th>
                                        <th className="pb-3 text-sm font-semibold text-gray-600">Company</th>
                                        <th className="pb-3 text-sm font-semibold text-gray-600">Applied Date</th>
                                        <th className="pb-3 text-sm font-semibold text-gray-600">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentApplications.map((app) => (
                                        <tr key={app.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                                            <td className="py-4 pr-4">
                                                <div className="font-semibold text-gray-900 text-sm">{app.jobTitle}</div>
                                            </td>
                                            <td className="py-4 pr-4">
                                                <div className="text-sm text-gray-500">{app.company}</div>
                                            </td>
                                            <td className="py-4 pr-4">
                                                <div className="text-sm text-gray-500">{app.appliedDate}</div>
                                            </td>
                                            <td className="py-4">
                                                <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${getStatusClasses(app.status)}`}>
                                                    {app.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* ── Right Column: Recommended Jobs ── */}
                <div className="space-y-6">
                    <div className="bg-transparent rounded-xl">
                        <h2 className="text-lg font-bold text-gray-900 mb-6">Recommended Jobs</h2>
                        
                        <div className="space-y-4">
                            {recommendedJobs.map((job) => (
                                <div key={job.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:border-gray-200 transition-colors cursor-pointer group">
                                    <h3 className="font-bold text-gray-900 text-base mb-1 group-hover:text-[#1a3c8f] transition-colors">{job.title}</h3>
                                    <p className="text-sm text-gray-500 mb-3">{job.company}</p>
                                    
                                    <div className="flex flex-col gap-1">
                                        <span className="text-xs text-gray-500">{job.location}</span>
                                        <span className="text-sm font-bold text-orange-500">{job.salary}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        </DashboardLayout>
    )
}

export default DashboardPage
