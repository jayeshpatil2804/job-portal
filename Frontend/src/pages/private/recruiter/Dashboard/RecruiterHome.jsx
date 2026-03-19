import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import RecruiterLayout from '../../../../components/RecruiterLayout'
import { Briefcase, Users, UserCheck, Calendar } from 'lucide-react'
import { motion } from 'framer-motion'
import { fetchRecruiterStats } from '../../../../redux/actions/dashboardActions'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

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

const formatStatus = (status) => {
    return status.split('_').map(word => word.charAt(0) + word.slice(1).toLowerCase()).join(' ');
}

const RecruiterHome = () => {
    const dispatch = useDispatch()
    const { recruiterStats, loading } = useSelector((state) => state.dashboard)
    const { stats, recentJobs } = recruiterStats

    useEffect(() => {
        dispatch(fetchRecruiterStats())
    }, [dispatch])

    const statCards = [
        { title: 'Total Jobs', value: stats?.totalJobs || 0, icon: <Briefcase className="text-blue-600" />, color: 'bg-blue-600' },
        { title: 'Total Applicants', value: stats?.totalApplicants || 0, icon: <Users className="text-orange-600" />, color: 'bg-orange-600' },
        { title: 'Active Jobs', value: stats?.totalJobs || 0, icon: <UserCheck className="text-green-600" />, color: 'bg-green-600' },
        { title: 'Interviews Scheduled', value: stats?.statusBreakdown?.find(s => s.status === 'INTERVIEW_SCHEDULED')?.count || 0, icon: <Calendar className="text-purple-600" />, color: 'bg-purple-600' },
    ]

    const chartData = stats?.statusBreakdown || []
    const COLORS = ['#1a3c8f', '#f97316', '#a855f7', '#22c55e', '#ef4444', '#64748b']

    if (loading && !stats) {
        return (
            <RecruiterLayout>
                <div className="flex items-center justify-center h-64">
                    <div className="w-8 h-8 border-4 border-[#1a3c8f] border-t-transparent rounded-full animate-spin"></div>
                </div>
            </RecruiterLayout>
        )
    }

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
                    {statCards.map((stat, index) => (
                        <StatCard key={index} {...stat} />
                    ))}
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Applications Status Breakdown Chart */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-bold text-gray-800 mb-6">Applications Status Breakdown</h3>
                        <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis 
                                        dataKey="status" 
                                        axisLine={false} 
                                        tickLine={false} 
                                        tick={{ fill: '#64748b', fontSize: 10 }}
                                        tickFormatter={formatStatus}
                                    />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10 }} />
                                    <Tooltip 
                                        cursor={{ fill: '#f8fafc' }}
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                        formatter={(value) => [value, 'Applicants']}
                                        labelFormatter={formatStatus}
                                    />
                                    <Bar dataKey="count" radius={[4, 4, 0, 0]} barSize={40}>
                                        {chartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Placeholder for Additional Analytics */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-center items-center text-center">
                         <div className="bg-blue-50 p-4 rounded-full mb-4">
                            <TrendingUp className="text-[#1a3c8f] w-8 h-8" />
                         </div>
                         <h3 className="text-lg font-bold text-gray-800">Recruitment Insights</h3>
                         <p className="text-gray-500 max-w-[280px] mt-2">More advanced analytics for your job postings will appear here as you receive more applications.</p>
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
                            <tbody className="divide-y divide-gray-100">
                                {recentJobs && recentJobs.length > 0 ? (
                                    recentJobs.map((job) => (
                                        <tr key={job.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 font-medium text-gray-900">{job.title}</td>
                                            <td className="px-6 py-4 text-gray-600">{job.applicants}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                                                    job.status === 'OPEN' 
                                                    ? 'bg-green-100 text-green-700' 
                                                    : 'bg-gray-100 text-gray-700'
                                                }`}>
                                                    {job.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-gray-500 text-sm">{job.date}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="py-8 text-center text-gray-400 italic font-medium">No jobs posted yet</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </RecruiterLayout>
    )
}

const TrendingUp = ({ className }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="24" 
        height="24" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={className}
    >
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
        <polyline points="17 6 23 6 23 12"></polyline>
    </svg>
);

export default RecruiterHome
