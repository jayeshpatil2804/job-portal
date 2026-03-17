import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import RecruiterLayout from '../../../../components/RecruiterLayout'
import DashboardLayout from '../../../../components/DashboardLayout'
import { Calendar, Clock, MapPin, Video, ExternalLink, User, Briefcase, ChevronRight, Building } from 'lucide-react'
import { motion } from 'framer-motion'
import { getMyInterviews } from '../../../../redux/actions/interviewActions'

const InterviewCard = ({ interview, isRecruiter }) => {
    const { application, date, mode, location, status } = interview
    const interviewDate = new Date(date)
    
    // For recruiters, show candidate name. For candidates, show company name.
    const displayName = isRecruiter ? application.candidate.fullName : application.job.recruiter.companyName
    const displayInfo = isRecruiter ? application.job.title : application.job.title
    const Icon = isRecruiter ? User : Building

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col gap-6 group hover:border-[#1a3c8f] transition-all"
        >
            <div className="flex justify-between items-start">
                <div className="flex gap-4">
                    <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-[#1a3c8f] font-black text-xl">
                        {displayName.charAt(0)}
                    </div>
                    <div>
                        <h4 className="text-xl font-black text-gray-900 leading-tight">{displayName}</h4>
                        <p className="text-sm text-gray-400 font-bold flex items-center gap-1.5 mt-1">
                            <Briefcase size={14} className="text-[#1a3c8f]" />
                            {displayInfo}
                        </p>
                    </div>
                </div>
                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                    mode === 'ONLINE' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                }`}>
                    {mode}
                </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-2xl space-y-1">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                        <Calendar size={12} /> Date
                    </p>
                    <p className="text-sm font-black text-gray-700">{interviewDate.toLocaleDateString(undefined, { dateStyle: 'long' })}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-2xl space-y-1">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                        <Clock size={12} /> Time
                    </p>
                    <p className="text-sm font-black text-gray-700">{interviewDate.toLocaleTimeString(undefined, { timeStyle: 'short' })}</p>
                </div>
            </div>

            <div className="space-y-2">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                    {mode === 'ONLINE' ? <Video size={12} /> : <MapPin size={12} />}
                    {mode === 'ONLINE' ? 'Meeting Link' : 'Location'}
                </p>
                <div className="flex items-center justify-between gap-4 p-4 bg-gray-50 rounded-2xl group/link">
                    <span className="text-sm font-bold text-gray-600 truncate">{location || 'To be shared'}</span>
                    {mode === 'ONLINE' && location && (
                        <a 
                            href={location} 
                            target="_blank" 
                            rel="noreferrer"
                            className="p-2 bg-white text-[#1a3c8f] rounded-xl border border-gray-100 hover:border-[#1a3c8f] transition-all shadow-sm"
                        >
                            <ExternalLink size={16} />
                        </a>
                    )}
                </div>
            </div>

            <div className="flex gap-3 pt-2">
                <button className="flex-1 py-4 bg-gray-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-gray-800 transition-all shadow-xl shadow-gray-900/10 active:scale-[0.98]">
                    {mode === 'ONLINE' ? 'Join Call' : 'View Directions'}
                    <ChevronRight size={14} />
                </button>
            </div>
        </motion.div>
    )
}

const Interviews = () => {
    const dispatch = useDispatch()
    const { interviews, loading } = useSelector(state => state.interview)
    const { user } = useSelector(state => state.auth)
    const isRecruiter = user?.role === 'RECRUITER'

    useEffect(() => {
        dispatch(getMyInterviews())
    }, [dispatch])

    const Layout = isRecruiter ? RecruiterLayout : DashboardLayout

    return (
        <Layout>
            <div className="max-w-7xl mx-auto space-y-10 pb-20">
                {/* Header */}
                <div className="flex justify-between items-end">
                    <div className="space-y-2">
                        <h1 className="text-4xl font-black text-gray-900 tracking-tight">Interviews</h1>
                        <p className="text-lg font-medium text-gray-500">
                            {isRecruiter 
                                ? 'Track and manage your upcoming candidate evaluations' 
                                : 'Prepare for your upcoming professional discussions'}
                        </p>
                    </div>
                    <div className="hidden md:flex gap-4">
                        <div className="text-right">
                            <p className="text-2xl font-black text-gray-900">{interviews.length}</p>
                            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Schedules</p>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32 space-y-4">
                        <div className="w-12 h-12 border-4 border-[#1a3c8f] border-t-transparent rounded-full animate-spin" />
                        <p className="font-black text-gray-400 uppercase tracking-widest text-xs">Loading schedules...</p>
                    </div>
                ) : interviews.length === 0 ? (
                    <div className="bg-white p-20 rounded-[3rem] border border-dashed border-gray-200 text-center space-y-6">
                        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-300">
                            <Calendar size={48} />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-2xl font-black text-gray-900">No Interviews Scheduled</h3>
                            <p className="text-gray-500 font-medium">
                                {isRecruiter 
                                    ? 'Head over to the applicants page to start shortlisting candidates.' 
                                    : 'Keep applying to jobs, your next big break is coming!'}
                            </p>
                        </div>
                        {isRecruiter && (
                            <button className="px-8 py-4 bg-[#1a3c8f] text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-blue-900/20 hover:scale-105 transition-all">
                                View All Applicants
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {interviews.map((interview) => (
                            <InterviewCard key={interview.id} interview={interview} isRecruiter={isRecruiter} />
                        ))}
                    </div>
                )}
            </div>
        </Layout>
    )
}

export default Interviews
