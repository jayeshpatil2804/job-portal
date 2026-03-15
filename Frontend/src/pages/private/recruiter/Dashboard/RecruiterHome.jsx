import React from 'react'
import RecruiterLayout from '../../../../components/RecruiterLayout'
import { Briefcase, Users, UserCheck, Calendar } from 'lucide-react'
import { motion } from 'framer-motion'

const StatCard = ({ title, value, icon, color }) => (
    <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-6"
    >
        <div className={`p-4 rounded-lg ${color} bg-opacity-10 text-xl`}>
            {icon}
        </div>
        <div>
            <h3 className="text-3xl font-bold text-gray-800">{value}</h3>
            <p className="text-sm text-gray-500 font-medium">{title}</p>
        </div>
    </motion.div>
)

const RecruiterHome = () => {
    const stats = [
        { title: 'Active Jobs', value: '24', icon: <Briefcase className="text-blue-600" />, color: 'bg-blue-600' },
        { title: 'Total Applicants', value: '156', icon: <Users className="text-orange-600" />, color: 'bg-orange-600' },
        { title: 'Shortlisted', value: '48', icon: <UserCheck className="text-green-600" />, color: 'bg-green-600' },
        { title: 'Interviews Scheduled', value: '12', icon: <Calendar className="text-purple-600" />, color: 'bg-purple-600' },
    ]

    const recentJobs = [
        { id: 1, title: 'Senior Textile Designer', applicants: 45, status: 'Active', date: '2026-03-08' },
        { id: 2, title: 'Production Manager', applicants: 38, status: 'Active', date: '2026-03-05' },
        { id: 3, title: 'Machine Operator', applicants: 52, status: 'Active', date: '2026-03-01' },
        { id: 4, title: 'Quality Inspector', applicants: 21, status: 'Closed', date: '2026-02-25' },
    ]

    return (
        <RecruiterLayout>
            <div className="space-y-8">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Recruiter Dashboard</h1>
                    <p className="text-gray-500">Welcome back! Here's your recruitment overview</p>
                </div>

                {/* Stat Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, index) => (
                        <StatCard key={index} {...stat} />
                    ))}
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Applications Overview */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-bold text-gray-800 mb-6">Applications Overview</h3>
                        <div className="h-64 flex items-end justify-around gap-2 px-4 border-b border-l border-gray-200">
                            {[40, 65, 160].map((height, i) => (
                                <div key={i} className="flex flex-col items-center flex-1">
                                    <motion.div 
                                        initial={{ height: 0 }}
                                        animate={{ height: `${height}%` }}
                                        transition={{ duration: 1, delay: i * 0.2 }}
                                        className="w-full max-w-[80px] bg-[#1a3c8f] rounded-t-md hover:bg-blue-700 transition-colors"
                                    />
                                    <span className="text-xs text-gray-500 mt-2">{['Jan', 'Feb', 'Mar'][i]}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Job Postings Trend */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-bold text-gray-800 mb-6">Job Postings Trend</h3>
                        <div className="h-64 relative border-b border-l border-gray-100">
                            {/* Simple SVG Line Chart Mock */}
                            <svg viewBox="0 0 400 200" className="w-full h-full">
                                <motion.path
                                    d="M 50 150 L 200 100 L 350 80"
                                    fill="none"
                                    stroke="#f97316"
                                    strokeWidth="3"
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: 1 }}
                                    transition={{ duration: 1.5 }}
                                />
                                {[50, 200, 350].map((x, i) => (
                                    <circle key={i} cx={x} cy={[150, 100, 80][i]} r="5" fill="#f97316" />
                                ))}
                            </svg>
                            <div className="flex justify-around mt-2">
                                <span className="text-xs text-gray-500">Jan</span>
                                <span className="text-xs text-gray-500">Feb</span>
                                <span className="text-xs text-gray-500">Mar</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Job Postings Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                        <h3 className="text-lg font-bold text-gray-800">Recent Job Postings</h3>
                        <button className="text-blue-600 text-sm font-medium hover:underline">View All</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    <th className="px-6 py-4">Job Title</th>
                                    <th className="px-6 py-4">Applicants</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Posted Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 uppercase">
                                {recentJobs.map((job) => (
                                    <tr key={job.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-900">{job.title}</td>
                                        <td className="px-6 py-4 text-gray-600">{job.applicants}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                                                job.status === 'Active' 
                                                ? 'bg-green-100 text-green-700' 
                                                : 'bg-gray-100 text-gray-700'
                                            }`}>
                                                {job.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500 text-sm">{job.date}</td>
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

export default RecruiterHome
