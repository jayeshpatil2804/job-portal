import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import DashboardLayout from '../../components/DashboardLayout'
import { FileText, Bookmark, Eye, Phone, TrendingUp, ArrowRight, Star, Clock } from 'lucide-react'
import { fetchCandidateStats } from '../../redux/actions/dashboardActions'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { motion } from 'framer-motion'
import { useMountTimer } from '../../hooks/useMountTimer'

// Helpers for Status Styling
const getStatusClasses = (status) => {
    switch (status) {
        case 'INTERVIEW_SCHEDULED':
            return 'bg-green-100/50 text-green-700 border-green-200'
        case 'SHORTLISTED':
            return 'bg-purple-100/50 text-purple-700 border-purple-200'
        case 'VIEWED':
            return 'bg-yellow-100/50 text-yellow-700 border-yellow-200'
        case 'REJECTED':
            return 'bg-red-100/50 text-red-700 border-red-200'
        default:
            return 'bg-blue-50/50 text-blue-700 border-blue-100'
    }
}

const formatStatus = (status) => {
    return status.split('_').map(word => word.charAt(0) + word.slice(1).toLowerCase()).join(' ');
}

const DashboardPage = () => {
    useMountTimer('DashboardPage')
    const dispatch = useDispatch()
    const { candidateStats, loading } = useSelector((state) => state.dashboard)
    const { user } = useSelector((state) => state.auth)
    const { stats, recentApplications } = candidateStats

    useEffect(() => {
        dispatch(fetchCandidateStats())
    }, [dispatch])

    const statCards = [
        {
            title: 'Total Applied',
            count: stats?.totalApplications || 0,
            icon: <FileText size={20} />,
            color: 'text-[#3b82f6]',
            bgColor: 'bg-blue-50',
            borderColor: 'border-blue-100',
        },
        {
            title: 'Shortlisted',
            count: stats?.shortlistedCount || 0,
            icon: <Star size={20} />,
            color: 'text-[#f97316]',
            bgColor: 'bg-orange-50',
            borderColor: 'border-orange-100',
        },
        {
            title: 'Interviews',
            count: stats?.interviewCount || 0,
            icon: <Phone size={20} />,
            color: 'text-[#a855f7]',
            bgColor: 'bg-purple-50',
            borderColor: 'border-purple-100',
        },
        {
            title: 'Success Rate',
            count: stats?.totalApplications ? Math.round(((stats.shortlistedCount + stats.interviewCount) / stats.totalApplications) * 100) + '%' : '0%',
            icon: <TrendingUp size={20} />,
            color: 'text-[#22c55e]',
            bgColor: 'bg-green-50',
            borderColor: 'border-green-100',
        },
    ]

    const chartData = stats?.statusBreakdown || []
    const COLORS = ['#3b82f6', '#f97316', '#a855f7', '#22c55e', '#ef4444', '#64748b']

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    }

    if (loading && !stats) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center h-[60vh]">
                    <div className="relative">
                        <div className="w-12 h-12 border-4 border-blue-100 rounded-full"></div>
                        <div className="w-12 h-12 border-4 border-[#1a3c8f] border-t-transparent rounded-full animate-spin absolute top-0"></div>
                    </div>
                </div>
            </DashboardLayout>
        )
    }

    return (
        <DashboardLayout>
            <motion.div 
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="max-w-[1400px] mx-auto space-y-8 pb-10"
            >
                {/* ── Hero Banner ── */}
                <motion.div 
                    variants={itemVariants}
                    className="relative overflow-hidden bg-gradient-to-br from-[#1a3c8f] to-[#2563eb] rounded-[2.5rem] p-8 md:p-12 text-white shadow-2xl shadow-blue-900/20"
                >
                    <div className="relative z-10 max-w-2xl">
                        <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">
                            Welcome back, <span className="text-blue-200">{user?.fullName?.split(' ')[0] || 'User'}!</span>
                        </h1>
                        <p className="text-blue-100 text-lg md:text-xl font-medium opacity-90 leading-relaxed mb-8">
                            Your career journey is looking great. You have {stats?.totalApplications || 0} active applications this month.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <button className="bg-white text-[#1a3c8f] px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-blue-50 transition-all shadow-lg active:scale-95">
                                Search New Jobs
                            </button>
                            <button className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-white/20 transition-all active:scale-95">
                                View Profile
                            </button>
                        </div>
                    </div>
                    {/* Decorative Elements */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                    <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl"></div>
                </motion.div>

                {/* ── Stats Grid ── */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {statCards.map((stat, index) => (
                        <motion.div 
                            key={index} 
                            variants={itemVariants}
                            whileHover={{ y: -5 }}
                            className={`bg-white rounded-[2rem] p-6 border ${stat.borderColor} shadow-sm flex items-center gap-5 hover:shadow-xl hover:shadow-blue-900/5 transition-all transition-all duration-300`}
                        >
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${stat.bgColor} ${stat.color}`}>
                                {stat.icon}
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{stat.title}</p>
                                <h3 className="text-3xl font-black text-gray-900 leading-tight">{stat.count}</h3>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                    {/* ── Chart & Applications ── */}
                    <div className="xl:col-span-2 space-y-8">
                        {/* Application Chart */}
                        <motion.div 
                            variants={itemVariants}
                            className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-xl font-black text-gray-900 tracking-tight">Application Activity</h2>
                                <select className="bg-gray-50 border-none rounded-xl text-xs font-bold text-gray-500 px-4 py-2 outline-none">
                                    <option>Last 6 Months</option>
                                    <option>Last Year</option>
                                </select>
                            </div>
                            <div className="h-[300px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <XAxis 
                                            dataKey="status" 
                                            axisLine={false} 
                                            tickLine={false} 
                                            tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
                                            tickFormatter={formatStatus}
                                        />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }} />
                                        <Tooltip 
                                            cursor={{ fill: 'rgba(59, 130, 246, 0.05)' }}
                                            contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                                            formatter={(value) => [value, 'Applications']}
                                            labelFormatter={formatStatus}
                                        />
                                        <Bar dataKey="count" radius={[8, 8, 0, 0]} barSize={32}>
                                            {chartData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} opacity={0.8} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </motion.div>

                        {/* Recent Applications List */}
                        <motion.div 
                            variants={itemVariants}
                            className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-xl font-black text-gray-900 tracking-tight">Recent Applications</h2>
                                <button className="text-[10px] font-black text-[#1a3c8f] uppercase tracking-widest hover:underline">View All</button>
                            </div>
                            <div className="space-y-4">
                                {recentApplications && recentApplications.length > 0 ? (
                                    recentApplications.slice(0, 4).map((app) => (
                                        <div key={app.id} className="group p-4 rounded-[1.5rem] border border-gray-50 hover:border-blue-100 hover:bg-blue-50/30 transition-all flex items-center justify-between gap-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-400 group-hover:bg-[#1a3c8f] group-hover:text-white transition-colors">
                                                    <FileText size={20} />
                                                </div>
                                                <div>
                                                    <h3 className="text-sm font-black text-gray-900 group-hover:text-[#1a3c8f] transition-colors">{app.jobTitle}</h3>
                                                    <p className="text-xs font-bold text-gray-400">{app.company}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-6">
                                                <div className="hidden md:flex items-center gap-2 text-xs font-bold text-gray-400">
                                                    <Clock size={14} />
                                                    {app.appliedDate}
                                                </div>
                                                <span className={`px-4 py-1.5 text-[9px] font-black uppercase tracking-widest rounded-full border ${getStatusClasses(app.status)}`}>
                                                    {formatStatus(app.status)}
                                                </span>
                                                <ArrowRight size={18} className="text-gray-300 group-hover:text-[#1a3c8f] group-hover:translate-x-1 transition-all" />
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="py-10 text-center text-gray-400 font-bold text-sm bg-gray-50 rounded-[1.5rem] border border-dashed border-gray-200">
                                        No recent activity to show
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>

                    {/* ── Right Column: Sidebar ── */}
                    <div className="space-y-6">
                        <motion.div 
                            variants={itemVariants}
                            className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 relative overflow-hidden group"
                        >
                            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-500"></div>
                            <h2 className="text-xl font-black text-gray-900 tracking-tight relative z-10">Recommended Jobs</h2>
                            <p className="text-xs font-bold text-gray-400 mt-2 mb-8 relative z-10">Based on your skills and preferences</p>
                            
                            <div className="space-y-6 relative z-10">
                                <div className="p-8 text-center bg-gray-50 rounded-[2rem] border border-dashed border-gray-200">
                                    <Star className="mx-auto mb-4 text-gray-300" size={32} />
                                    <p className="text-xs font-bold text-gray-400 leading-relaxed italic">
                                        Personalized recommendations for you will appear here soon!
                                    </p>
                                </div>
                                <button className="w-full py-4 bg-gray-900 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-gray-900/10 hover:bg-gray-800 transition-all active:scale-95">
                                    Browse All Jobs
                                </button>
                            </div>
                        </motion.div>

                        <motion.div 
                            variants={itemVariants}
                            className="bg-[#1a3c8f] rounded-[2.5rem] p-8 text-white relative overflow-hidden"
                        >
                            <h2 className="text-xl font-black mb-2">Complete Profile</h2>
                            <p className="text-blue-100 text-xs font-medium opacity-80 mb-6">Completing your profile increases hire chance by 80%</p>
                            <div className="w-full bg-white/10 h-2 rounded-full mb-6">
                                <div className="bg-white h-full rounded-full w-[65%]"></div>
                            </div>
                            <button className="text-xs font-black uppercase tracking-widest border-b border-white hover:opacity-80 transition-opacity">
                                Finish Setup
                            </button>
                        </motion.div>
                    </div>
                </div>
            </motion.div>
        </DashboardLayout>
    )
}

export default DashboardPage
