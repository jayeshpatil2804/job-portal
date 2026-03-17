import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import DashboardLayout from '../../components/DashboardLayout'
import { MapPin, Briefcase, Calendar, DollarSign, Clock, Users, ChevronLeft, Send, CheckCircle2, AlertCircle } from 'lucide-react'
import { getJobById } from '../../redux/actions/jobActions'
import { applyToJob } from '../../redux/actions/applicationActions'
import { clearApplicationStates } from '../../redux/slices/applicationSlice'
import { toast } from 'react-hot-toast'
import { motion } from 'framer-motion'

const JobDetailPage = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    
    const { selectedJob: job, loading } = useSelector(state => state.job)
    const { loading: applying, success: applySuccess, error: applyError } = useSelector(state => state.application)
    const { user } = useSelector(state => state.auth)

    useEffect(() => {
        dispatch(getJobById(id))
        return () => {
            dispatch(clearApplicationStates())
        }
    }, [dispatch, id])

    useEffect(() => {
        if (applySuccess) {
            toast.success('Successfully applied for the job!')
        }
    }, [applySuccess])

    const handleApply = () => {
        if (!user) {
            toast.error('Please login as a candidate to apply')
            navigate('/candidate/login')
            return
        }
        dispatch(applyToJob(id))
    }

    if (loading) {
        return (
            <DashboardLayout>
                <div className="flex flex-col items-center justify-center py-32 space-y-4">
                    <div className="w-12 h-12 border-4 border-[#1a3c8f] border-t-transparent rounded-full animate-spin" />
                    <p className="font-black text-gray-400 uppercase tracking-widest text-xs">Loading job details...</p>
                </div>
            </DashboardLayout>
        )
    }

    if (!job) return null

    return (
        <DashboardLayout>
            <div className="max-w-[1200px] mx-auto pb-20">
                {/* Back Button */}
                <button 
                    onClick={() => navigate('/jobs')}
                    className="group flex items-center gap-2 text-xs font-black text-gray-400 hover:text-[#1a3c8f] uppercase tracking-widest transition-all mb-8"
                >
                    <div className="p-2 rounded-full bg-gray-50 group-hover:bg-blue-50 transition-colors">
                        <ChevronLeft size={16} />
                    </div>
                    Back to all jobs
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Header Card */}
                        <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full -mr-32 -mt-32 opacity-50 blur-3xl" />
                            
                            <div className="relative flex flex-col md:flex-row gap-8 items-start">
                                <div className="w-24 h-24 bg-blue-600 rounded-[2rem] shadow-xl flex items-center justify-center text-white shrink-0">
                                    <Briefcase size={40} />
                                </div>
                                <div className="space-y-4 flex-1">
                                    <div className="space-y-1">
                                        <h1 className="text-4xl font-black text-gray-900 tracking-tight leading-tight">{job.title}</h1>
                                        <p className="text-xl font-bold text-[#1a3c8f]">{job.recruiter.companyName}</p>
                                    </div>
                                    <div className="flex flex-wrap gap-4 text-sm font-bold text-gray-400">
                                        <div className="flex items-center gap-1.5 px-4 py-2 bg-gray-50 rounded-full">
                                            <MapPin size={16} className="text-blue-600" />
                                            {job.location}
                                        </div>
                                        <div className="flex items-center gap-1.5 px-4 py-2 bg-gray-50 rounded-full">
                                            <DollarSign size={16} className="text-blue-600" />
                                            ₹{job.salaryMin} - {job.salaryMax} LPA
                                        </div>
                                        <div className="flex items-center gap-1.5 px-4 py-2 bg-gray-50 rounded-full">
                                            <Clock size={16} className="text-blue-600" />
                                            {job.jobType.replace('_', ' ')}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100 space-y-8">
                            <div className="space-y-4">
                                <h3 className="text-2xl font-black text-gray-900 tracking-tight">Job Description</h3>
                                <div className="text-gray-600 leading-relaxed font-medium text-lg whitespace-pre-wrap">
                                    {job.description}
                                </div>
                            </div>

                            {job.skills && (
                                <div className="space-y-4">
                                    <h3 className="text-lg font-black text-gray-900 uppercase tracking-widest">Required Skills</h3>
                                    <div className="flex flex-wrap gap-3">
                                        {job.skills.split(',').map((skill, i) => (
                                            <span key={i} className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-2xl font-black text-sm uppercase tracking-wider">
                                                {skill.trim()}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="space-y-4 pt-8 border-t border-gray-50">
                                <h3 className="text-2xl font-black text-gray-900 tracking-tight">Key Requirements</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="p-6 bg-blue-50 rounded-[2rem] space-y-1">
                                        <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Education</p>
                                        <p className="text-lg font-black text-blue-900">{job.education || 'N/A'}</p>
                                    </div>
                                    <div className="p-6 bg-purple-50 rounded-[2rem] space-y-1">
                                        <p className="text-[10px] font-black text-purple-600 uppercase tracking-widest">Experience</p>
                                        <p className="text-lg font-black text-purple-900">{job.experience || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Sidebar: Apply Action */}
                    <div className="space-y-8">
                        <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-gray-100 sticky top-10 space-y-8">
                            <div className="space-y-4">
                                <h3 className="text-xl font-black text-gray-900 tracking-tight">Overview</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="font-bold text-gray-400 uppercase tracking-widest text-[10px]">Posted On</span>
                                        <span className="font-black text-gray-700">{new Date(job.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="font-bold text-gray-400 uppercase tracking-widest text-[10px]">Department</span>
                                        <span className="font-black text-gray-700">{job.department || 'N/A'}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="font-bold text-gray-400 uppercase tracking-widest text-[10px]">Openings</span>
                                        <span className="font-black text-gray-700">{job.totalOpenings || 1} Positions</span>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 space-y-4">
                                {applySuccess ? (
                                    <div className="bg-green-50 p-6 rounded-[2rem] border-2 border-green-100 flex flex-col items-center gap-3 text-center">
                                        <CheckCircle2 size={40} className="text-green-600" />
                                        <p className="font-black text-green-900 uppercase tracking-widest text-xs">Application Submitted</p>
                                        <p className="text-[10px] text-green-700 font-bold">You've successfully applied. Track status in your dashboard.</p>
                                    </div>
                                ) : (
                                    <>
                                        {applyError && (
                                            <div className="bg-red-50 p-4 rounded-2xl flex items-center gap-3 text-red-600 border border-red-100">
                                                <AlertCircle size={20} className="shrink-0" />
                                                <p className="text-xs font-black uppercase tracking-widest leading-normal">{applyError}</p>
                                            </div>
                                        )}
                                        <button 
                                            disabled={applying}
                                            onClick={handleApply}
                                            className="w-full py-5 bg-[#1a3c8f] text-white rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs shadow-2xl shadow-blue-900/20 hover:bg-blue-800 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
                                        >
                                            <Send size={18} />
                                            {applying ? 'Sending Application...' : 'Apply for this Job'}
                                        </button>
                                        <p className="text-[10px] text-center font-bold text-gray-400">
                                            By applying, you agree to share your profile and resume with the recruiter.
                                        </p>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Company Card */}
                        <div className="bg-[#1a3c8f] p-8 rounded-[3rem] shadow-xl text-white space-y-6">
                            <h3 className="text-xl font-black tracking-tight border-b border-white/10 pb-4">Company Profile</h3>
                            <div className="space-y-4">
                                <h4 className="text-2xl font-black uppercase">{job.recruiter.companyName}</h4>
                                <div className="space-y-4 opacity-80 font-medium text-sm leading-relaxed">
                                    <p>{job.recruiter.aboutCompany || 'No description available for this company.'}</p>
                                </div>
                                <div className="pt-4 flex flex-col gap-3">
                                    <div className="flex items-center gap-3 text-[10px] font-black tracking-widest uppercase">
                                        <MapPin size={14} className="text-white/50" />
                                        Headquarters: {job.recruiter.hqAddress || 'N/A'}
                                    </div>
                                    <div className="flex items-center gap-3 text-[10px] font-black tracking-widest uppercase">
                                        <Users size={14} className="text-white/50" />
                                        Team Size: {job.recruiter.teamSize || 'N/A'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    )
}

export default JobDetailPage
