import { motion } from 'framer-motion'
import {
    AreaChart,
    Area,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from 'recharts'

const DashboardCharts = ({ monthlyData, appBreakdown }) => {
    return (
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-6 mb-8">
            {/* Growth Chart */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="xl:col-span-3 bg-white rounded-2xl border border-gray-100 shadow-sm p-6"
            >
                <h3 className="text-base font-bold text-[#0f172a] mb-1">Platform Growth</h3>
                <p className="text-xs text-gray-400 mb-5">Candidates & Jobs (last 6 months)</p>
                <div className="h-[240px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={monthlyData}>
                            <defs>
                                <linearGradient id="gradCand" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#1a3c8f" stopOpacity={0.25} />
                                    <stop offset="95%" stopColor="#1a3c8f" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="gradJobs" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.25} />
                                    <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                            <Tooltip
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', fontSize: 13 }}
                            />
                            <Area type="monotone" dataKey="candidates" stroke="#1a3c8f" strokeWidth={2.5} fill="url(#gradCand)" name="Candidates" dot={{ r: 4, fill: '#1a3c8f' }} />
                            <Area type="monotone" dataKey="jobs" stroke="#f97316" strokeWidth={2.5} fill="url(#gradJobs)" name="Jobs" dot={{ r: 4, fill: '#f97316' }} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
                <div className="flex gap-5 mt-3">
                    <span className="flex items-center gap-2 text-xs text-gray-500"><span className="w-3 h-3 rounded-full bg-[#1a3c8f] inline-block" />Candidates</span>
                    <span className="flex items-center gap-2 text-xs text-gray-500"><span className="w-3 h-3 rounded-full bg-[#f97316] inline-block" />Jobs</span>
                </div>
            </motion.div>

            {/* Application Funnel */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="xl:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6"
            >
                <h3 className="text-base font-bold text-[#0f172a] mb-1">Application Funnel</h3>
                <p className="text-xs text-gray-400 mb-5">Overall breakdown</p>
                <div className="h-[240px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={appBreakdown} layout="vertical" barSize={14}>
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                            <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                            <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} width={70} />
                            <Tooltip
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', fontSize: 13 }}
                            />
                            <Bar dataKey="value" radius={[0, 6, 6, 0]} name="Count">
                                {appBreakdown.map((entry, i) => (
                                    <Cell key={i} fill={entry.color} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </motion.div>
        </div>
    )
}

export default DashboardCharts 
