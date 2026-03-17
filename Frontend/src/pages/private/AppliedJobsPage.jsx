import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import DashboardLayout from '../../components/DashboardLayout'
import { Eye, Briefcase, MapPin, Calendar, Clock, ChevronRight } from 'lucide-react'
import { getMyApplications } from '../../redux/actions/applicationActions'
import { motion, AnimatePresence } from 'framer-motion'

const AppliedJobsPage = () => {
    const dispatch = useDispatch()
    const { myApplications: applications, loading } = useSelector(state => state.application)
    const [statusFilter, setStatusFilter] = useState('ALL')

    useEffect(() => {
        dispatch(getMyApplications())
    }, [dispatch])

    const filters = [
        { label: 'All Applications', value: 'ALL' },
        { label: 'Shortlisted', value: 'SHORTLISTED' },
        { label: 'Interview Scheduled', value: 'INTERVIEW_SCHEDULED' },
        { label: 'Rejected', value: 'REJECTED' }
    ]

    const filteredApplications = statusFilter === 'ALL' 
        ? applications 
        : applications.filter(app => app.status === statusFilter)

    const getStatusStyles = (status) => {
        switch (status) {
            case 'APPLIED': return 'bg-blue-50 text-blue-700 border-blue-100'
            case 'VIEWED': return 'bg-yellow-50 text-yellow-700 border-yellow-100'
            case 'SHORTLISTED': return 'bg-purple-50 text-purple-700 border-purple-100'
            case 'INTERVIEW_SCHEDULED': return 'bg-green-50 text-green-700 border-green-100'
            case 'REJECTED': return 'bg-red-50 text-red-700 border-red-100'
            default: return 'bg-gray-50 text-gray-700 border-gray-100'
        }
    }

    return (
        <DashboardLayout>
            <div className="max-w-7xl mx-auto space-y-10 pb-20">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                    <div className="space-y-2">
                        <h1 className="text-4xl font-black text-gray-900 tracking-tight">Applied Jobs</h1>
                        <p className="text-lg font-medium text-gray-500">Keep track of all your professional opportunities</p>
                    </div>
                    <div className="flex gap-4">
                        <div className="text-center px-6 py-3 bg-white rounded-2xl border border-gray-100 shadow-sm">
                            <p className="text-2xl font-black text-gray-900">{applications.length}</p>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Sent</p>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-3">
                    {filters.map((f) => (
                        <button
                            key={f.value}
                            onClick={() => setStatusFilter(f.value)}
                            className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                statusFilter === f.value
                                    ? 'bg-[#1a3c8f] text-white shadow-xl shadow-blue-900/20 active:scale-95'
                                    : 'bg-white text-gray-400 border border-gray-100 hover:border-[#1a3c8f] hover:text-[#1a3c8f]'
                            }`}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>

                {/* Content */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32 space-y-4">
                        <div className="w-12 h-12 border-4 border-[#1a3c8f] border-t-transparent rounded-full animate-spin" />
                        <p className="font-black text-gray-400 uppercase tracking-widest text-xs">Fetching applications...</p>
                    </div>
                ) : filteredApplications.length === 0 ? (
                    <div className="bg-white p-24 rounded-[3rem] border border-dashed border-gray-200 text-center space-y-6">
                        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-300">
                            <Briefcase size={48} />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-2xl font-black text-gray-900 tracking-tight">No Applications Found</h3>
                            <p className="text-gray-500 font-medium font-bold">You haven't applied to any jobs matching this filter yet.</p>
                        </div>
                        <button className="px-10 py-4 bg-[#1a3c8f] text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-blue-900/20 hover:scale-105 transition-all">
                            Browse New Jobs
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6">
                        <AnimatePresence mode="popLayout">
                            {filteredApplications.map((app) => (
                                <motion.div
                                    key={app.id}
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 hover:border-[#1a3c8f] transition-all group"
                                >
                                    <div className="flex flex-col md:flex-row gap-8 items-center">
                                        <div className="w-16 h-16 bg-blue-50 rounded-[1.5rem] flex items-center justify-center text-[#1a3c8f] shrink-0 font-black text-xl">
                                            {app.job.recruiter.companyName.charAt(0)}
                                        </div>
                                        
                                        <div className="flex-1 space-y-4 text-center md:text-left">
                                            <div>
                                                <h3 className="text-xl font-black text-gray-900">{app.job.title}</h3>
                                                <p className="font-bold text-gray-400">{app.job.recruiter.companyName}</p>
                                            </div>
                                            <div className="flex flex-wrap justify-center md:justify-start gap-6 text-sm font-bold text-gray-400">
                                                <div className="flex items-center gap-2">
                                                    <MapPin size={16} className="text-[#1a3c8f]" />
                                                    {app.job.location}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Calendar size={16} className="text-[#1a3c8f]" />
                                                    Applied {new Date(app.createdAt).toLocaleDateString()}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col items-center md:items-end gap-4 min-w-[150px]">
                                            <span className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border-2 ${getStatusStyles(app.status)}`}>
                                                {app.status.replace('_', ' ')}
                                            </span>
                                            <button className="flex items-center gap-2 text-[10px] font-black text-[#1a3c8f] uppercase tracking-widest hover:gap-3 transition-all">
                                                View Application
                                                <ChevronRight size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </DashboardLayout>
    )
}

export default AppliedJobsPage
