import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import DashboardLayout from '../../components/DashboardLayout'
import { FileText, Bookmark, Eye, Phone, TrendingUp } from 'lucide-react'
import { fetchCandidateStats } from '../../redux/actions/dashboardActions'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

// Helpers for Status Styling
const getStatusClasses = (status) => {
    switch (status) {
        case 'INTERVIEW_SCHEDULED':
            return 'bg-green-100 text-green-700'
        case 'SHORTLISTED':
            return 'bg-purple-100 text-purple-700'
        case 'VIEWED':
            return 'bg-yellow-100 text-yellow-700'
        case 'REJECTED':
            return 'bg-red-100 text-red-700'
        default:
            return 'bg-gray-100 text-gray-700'
    }
}

const formatStatus = (status) => {
    return status.split('_').map(word => word.charAt(0) + word.slice(1).toLowerCase()).join(' ');
}

const DashboardPage = () => {
    const dispatch = useDispatch()
    const { candidateStats, loading } = useSelector((state) => state.dashboard)
    const { stats, recentApplications } = candidateStats

    useEffect(() => {
        dispatch(fetchCandidateStats())
    }, [dispatch])

    const statCards = [
        {
            title: 'Total Applied',
            count: stats?.totalApplications || 0,
            icon: <FileText size={24} className="text-[#3b82f6]" />,
            bgColor: 'bg-blue-50',
        },
        {
            title: 'Shortlisted',
            count: stats?.shortlistedCount || 0,
            icon: <Bookmark size={24} className="text-[#f97316]" />,
            bgColor: 'bg-orange-50',
        },
        {
            title: 'Interviews',
            count: stats?.interviewCount || 0,
            icon: <Phone size={24} className="text-[#a855f7]" />,
            bgColor: 'bg-purple-50',
        },
        {
            title: 'Application Success',
            count: stats?.totalApplications ? Math.round(((stats.shortlistedCount + stats.interviewCount) / stats.totalApplications) * 100) + '%' : '0%',
            icon: <TrendingUp size={24} className="text-[#22c55e]" />,
            bgColor: 'bg-green-50',
        },
    ]

    const chartData = stats?.statusBreakdown || []

    const COLORS = ['#3b82f6', '#f97316', '#a855f7', '#22c55e', '#ef4444', '#64748b']

    if (loading && !stats) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center h-64">
                    <div className="w-8 h-8 border-4 border-[#1a3c8f] border-t-transparent rounded-full animate-spin"></div>
                </div>
            </DashboardLayout>
        )
    }

    return (
        <DashboardLayout>
            <div className="mb-8">
                <h1 className="text-3xl font-extrabold text-[#0f172a]">Dashboard</h1>
                <p className="text-gray-500 mt-1">Welcome back! Here's your job search overview</p>
            </div>

            {/* ── Stats Grid ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {statCards.map((stat, index) => (
                    <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center gap-4 hover:shadow-md transition-all duration-200">
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

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                
                <div className="xl:col-span-2 space-y-8">
                    {/* ── Bar Chart: Application Status ── */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-lg font-bold text-gray-900 mb-6">Application Status Breakdown</h2>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis 
                                        dataKey="status" 
                                        axisLine={false} 
                                        tickLine={false} 
                                        tick={{ fill: '#64748b', fontSize: 12 }}
                                        tickFormatter={formatStatus}
                                    />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                                    <Tooltip 
                                        cursor={{ fill: '#f8fafc' }}
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                        formatter={(value) => [value, 'Applications']}
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

                    {/* ── Recent Applications ── */}
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
                                    {recentApplications && recentApplications.length > 0 ? (
                                        recentApplications.map((app) => (
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
                                                    <span className={`inline-block px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full ${getStatusClasses(app.status)}`}>
                                                        {formatStatus(app.status)}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" className="py-8 text-center text-gray-400 italic">No applications found</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* ── Right Column: Recommended Jobs (Keeping as mock for now or could link to jobs) ── */}
                <div className="space-y-6">
                    <div className="bg-transparent rounded-xl">
                        <h2 className="text-lg font-bold text-gray-900 mb-6 font-display">Recommended Jobs</h2>
                        <div className="space-y-4">
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center border-dashed">
                                <p className="text-sm text-gray-400 italic">Personalized recommendations will appear here soon!</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    )
}

export default DashboardPage
