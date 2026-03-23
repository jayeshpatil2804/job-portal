import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import * as LucideIcons from 'lucide-react'
const { FileText, Download, FileSpreadsheet, BarChart3, Calendar, ChevronDown, CheckCircle } = LucideIcons
import toast from 'react-hot-toast'
import api from '../../../utils/api'
import AdminLayout from '../../../components/admin/AdminLayout'

const formatOptions = ['Excel (.xlsx)', 'CSV (.csv)']

const ReportsSection = () => {
    const [reports, setReports] = useState([])
    const [loading, setLoading] = useState(true)
    const [formats, setFormats] = useState({})
    const [downloading, setDownloading] = useState({})
    const [downloaded, setDownloaded] = useState({})
    const [dateRange, setDateRange] = useState('last30')

    useEffect(() => {
        fetchReports()
    }, [])

    const fetchReports = async () => {
        try {
            const res = await api.get('/admin/reports')
            setReports(res.data.reports)
        } catch (error) {
            toast.error('Failed to load reports metadata')
        } finally {
            setLoading(false)
        }
    }

    const getFormat = (id) => formats[id] || 'Excel (.xlsx)'

    const setFormat = (id, value) => setFormats(f => ({ ...f, [id]: value }))

    const handleDownload = async (id, title) => {
        setDownloading(d => ({ ...d, [id]: true }))
        try {
            const format = getFormat(id) === 'Excel (.xlsx)' ? 'xlsx' : 'csv'
            const response = await api.get(`/admin/reports/${id}/download?format=${format}`, {
                responseType: 'blob'
            })

            // Create a link and trigger download
            const url = window.URL.createObjectURL(new Blob([response.data]))
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', `${title.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.csv`)
            document.body.appendChild(link)
            link.click()
            link.remove()

            setDownloaded(d => ({ ...d, [id]: true }))
            setTimeout(() => setDownloaded(d => ({ ...d, [id]: false })), 2500)
            toast.success('Report downloaded successfully')
        } catch (error) {
            toast.error('Failed to generate report')
        } finally {
            setDownloading(d => ({ ...d, [id]: false }))
        }
    }

    return (
        <AdminLayout title="Reports">
            <div className="mb-6 flex items-start justify-between gap-4 flex-wrap">
                <div>
                    <h2 className="text-2xl font-extrabold text-[#0f172a]">Reports</h2>
                    <p className="text-sm text-gray-500 mt-0.5">Download platform reports in Excel or CSV format</p>
                </div>
                {/* Date Range */}
                <div className="relative">
                    <Calendar size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    <select
                        value={dateRange}
                        onChange={e => setDateRange(e.target.value)}
                        className="pl-9 pr-8 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 font-medium appearance-none focus:outline-none focus:border-[#1a3c8f] focus:ring-2 focus:ring-blue-100 transition bg-white"
                    >
                        <option value="last7">Last 7 days</option>
                        <option value="last30">Last 30 days</option>
                        <option value="last90">Last 3 months</option>
                        <option value="alltime">All time</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {reports.map((report, i) => {
                    const Icon = LucideIcons[report.icon] || FileText
                    const isDownloading = downloading[report.id]
                    const isDone = downloaded[report.id]

                    return (
                        <motion.div
                            key={report.id}
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.07 }}
                            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-all duration-300 flex flex-col"
                        >
                            {/* Header */}
                            <div className="flex items-start gap-4 mb-4">
                                <div className={`w-12 h-12 rounded-xl ${report.iconBg} flex items-center justify-center shrink-0`}>
                                    <Icon size={22} className={report.iconColor} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 text-sm leading-snug">{report.title}</h3>
                                    <span className="inline-block mt-1 px-2 py-0.5 bg-gray-100 text-gray-500 text-[10px] font-bold rounded-lg">{report.category}</span>
                                </div>
                            </div>

                            <p className="text-xs text-gray-500 leading-relaxed mb-4 flex-1">{report.description}</p>

                            <div className="text-xs text-gray-400 font-medium mb-4 flex items-center gap-1.5">
                                <FileSpreadsheet size={13} />
                                {report.rows}
                            </div>

                            {/* Format Selector */}
                            <div className="relative mb-3">
                                <select
                                    value={getFormat(report.id)}
                                    onChange={e => setFormat(report.id, e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 appearance-none focus:outline-none focus:border-[#1a3c8f] focus:ring-2 focus:ring-blue-100 transition bg-white"
                                >
                                    {formatOptions.map(opt => (
                                        <option key={opt} value={opt}>{opt}</option>
                                    ))}
                                </select>
                                <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                            </div>

                            {/* Download Button */}
                            <button
                                onClick={() => handleDownload(report.id, report.title)}
                                disabled={isDownloading}
                                className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                                    isDone
                                        ? 'bg-green-500 text-white'
                                        : isDownloading
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        : 'bg-[#1a3c8f] hover:bg-[#162f72] text-white shadow-md hover:shadow-lg'
                                }`}
                            >
                                {isDone ? (
                                    <><CheckCircle size={15} /> Downloaded!</>
                                ) : isDownloading ? (
                                    <><div className="w-4 h-4 border-2 border-gray-300 border-t-gray-500 rounded-full animate-spin" /> Preparing...</>
                                ) : (
                                    <><Download size={15} /> Download {getFormat(report.id).split('(')[0].trim()}</>
                                )}
                            </button>
                        </motion.div>
                    )
                })}
            </div>
        </AdminLayout>
    )
}

export default ReportsSection
