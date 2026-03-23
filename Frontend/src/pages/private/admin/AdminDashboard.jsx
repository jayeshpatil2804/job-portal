import { useState, useEffect, useRef, lazy, Suspense } from 'react'
import { motion } from 'framer-motion'
import {
    Users,
    UserCheck,
    Briefcase,
    FileText,
    TrendingUp,
    DollarSign,
    ArrowUpRight,
    ArrowDownRight,
} from 'lucide-react'
import AdminLayout from '../../../components/admin/AdminLayout'
import api from '../../../utils/api'

// Lazy load charts to remove recharts from main bundle
const DashboardCharts = lazy(() => import('./DashboardCharts'))

const ChartSkeleton = () => (
    <div className="w-full h-[350px] bg-white rounded-2xl border border-gray-100 shadow-sm p-6 animate-pulse flex flex-col gap-4">
        <div className="w-48 h-4 bg-gray-100 rounded" />
        <div className="flex-1 bg-gray-50 rounded-xl" />
    </div>
)

// ─── Component ─────────────────────────────────────────────
const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.07, duration: 0.4, ease: 'easeOut' } }),
}

const AdminDashboard = () => {
    const [data, setData] = useState({
        stats: null,
        monthlyData: [],
        activity: []
    })
    const [loading, setLoading] = useState(true)
    const fetchInProgress = useRef(false)

    const appBreakdown = data.stats?.applicationBreakdown || []

    useEffect(() => {
        const fetchDashboardData = async () => {
            if (fetchInProgress.current) return
            fetchInProgress.current = true
            
            try {
                const [statsRes, activityRes] = await Promise.all([
                    api.get('/admin/stats'),
                    api.get('/admin/activity')
                ])
                setData({
                    stats: statsRes.data?.stats || null,
                    monthlyData: statsRes.data?.monthlyData || [],
                    activity: activityRes.data?.activity || []
                })
            } catch (error) {
                console.error('Dashboard fetch error:', error)
            } finally {
                setLoading(false)
                fetchInProgress.current = false
            }
        }
        fetchDashboardData()
    }, [])

    if (loading) return (
        <AdminLayout title="Dashboard">
            <div className="flex h-64 items-center justify-center">
                <div className="w-8 h-8 border-4 border-[#1a3c8f] border-t-transparent rounded-full animate-spin" />
            </div>
        </AdminLayout>
    )

    if (!data.stats) return (
        <AdminLayout title="Dashboard">
            <div className="flex h-64 items-center justify-center text-red-500 font-medium">
                Failed to load dashboard data. Please login again.
            </div>
        </AdminLayout>
    )

    const statsConfig = [
        {
            label: 'Total Candidates',
            value: data.stats.totalCandidates,
            change: '+8.2%', up: true, icon: Users,
            bg: 'bg-blue-50', iconColor: 'text-blue-600',
        },
        {
            label: 'Total Recruiters',
            value: data.stats.totalRecruiters,
            change: '+12.5%', up: true, icon: UserCheck,
            bg: 'bg-purple-50', iconColor: 'text-purple-600',
        },
        {
            label: 'Active Jobs',
            value: data.stats.activeJobs,
            change: '+5.1%', up: true, icon: Briefcase,
            bg: 'bg-orange-50', iconColor: 'text-orange-500',
        },
        {
            label: 'Applications',
            value: data.stats.totalApplications,
            change: '+18.7%', up: true, icon: FileText,
            bg: 'bg-green-50', iconColor: 'text-green-600',
        },
        {
            label: 'Revenue',
            value: data.stats.revenue,
            change: '+0.0%', up: true, icon: DollarSign,
            bg: 'bg-rose-50', iconColor: 'text-rose-500',
        },
    ]

    return (
        <AdminLayout title="Dashboard">
            <div className="mb-6">
                <h2 className="text-2xl font-extrabold text-[#0f172a]">Overview</h2>
                <p className="text-sm text-gray-500 mt-0.5">Platform-wide statistics at a glance</p>
            </div>

            {/* ── Stats Grid ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-5 mb-8">
                {statsConfig.map((s, i) => {
                    const Icon = s.icon
                    return (
                        <motion.div
                            key={s.label}
                            custom={i}
                            variants={cardVariants}
                            initial="hidden"
                            animate="visible"
                            className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-all duration-300 group"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className={`w-11 h-11 rounded-xl ${s.bg} flex items-center justify-center`}>
                                    <Icon size={21} className={s.iconColor} />
                                </div>
                                <span className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${s.up ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
                                    {s.up ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
                                    {s.change}
                                </span>
                            </div>
                            <p className="text-2xl font-extrabold text-[#0f172a] leading-tight">{s.value}</p>
                            <p className="text-xs text-gray-500 mt-1 font-medium">{s.label}</p>
                        </motion.div>
                    )
                })}
            </div>

            {/* ── Charts Row (Lazy Loaded) ── */}
            <Suspense fallback={<ChartSkeleton />}>
                <DashboardCharts 
                    monthlyData={data.monthlyData} 
                    appBreakdown={appBreakdown} 
                />
            </Suspense>

            {/* ── Recent Activity ── */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h3 className="text-base font-bold text-[#0f172a] mb-5">Recent Activity</h3>
                <div className="space-y-4">
                    {!data?.activity || data.activity.length === 0 ? (
                        <p className="text-sm text-gray-400">No recent activity.</p>
                    ) : data.activity.map((item, i) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.06 }}
                            className="flex items-start gap-4"
                        >
                            <div className={`mt-1.5 w-2.5 h-2.5 rounded-full shrink-0 ${item.dot}`} />
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-gray-800">{item.type}</p>
                                <p className="text-xs text-gray-400 truncate">{item.detail}</p>
                            </div>
                            <span className="text-xs text-gray-400 shrink-0">{item.time}</span>
                        </motion.div>
                    ))}
                </div>
            </div>
        </AdminLayout>
    )
}

export default AdminDashboard 
