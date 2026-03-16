import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getJobById, closeJob, updateJobStatus } from '../../../../redux/actions/jobActions';
import { clearSelectedJob } from '../../../../redux/slices/jobSlice';
import RecruiterLayout from '../../../../components/RecruiterLayout';
import ConfirmationModal from '../../../../components/ConfirmationModal';
import { 
    Calendar, MapPin, Briefcase, DollarSign, 
    Users, Clock, ArrowLeft, Edit2, CheckCircle, 
    XCircle, AlertCircle, PlusCircle
} from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const DetailItem = ({ icon: Icon, label, value }) => (
    <div className="flex items-center gap-3">
        <div className="p-2.5 bg-gray-50 rounded-xl text-gray-500">
            <Icon size={20} />
        </div>
        <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{label}</p>
            <p className="text-sm font-bold text-gray-900">{value || 'Not specified'}</p>
        </div>
    </div>
);

const Section = ({ title, content }) => {
    if (!content) return null;
    return (
        <div className="space-y-3">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <div className="w-1.5 h-6 bg-[#1a3c8f] rounded-full" />
                {title}
            </h3>
            <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                <p className="text-gray-600 leading-relaxed whitespace-pre-wrap text-sm">
                    {content}
                </p>
            </div>
        </div>
    );
};

const ViewJob = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { selectedJob: job, loading, error } = useSelector(state => state.job);
    
    const [modalConfig, setModalConfig] = React.useState({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: () => {},
        confirmText: '',
        variant: 'warning',
        loading: false
    });

    useEffect(() => {
        dispatch(getJobById(id));
        return () => dispatch(clearSelectedJob());
    }, [dispatch, id]);

    const handlePublishClick = () => {
        setModalConfig({
            isOpen: true,
            title: 'Publish Job Posting',
            message: 'Are you sure you want to publish this job? It will become visible to all candidates.',
            confirmText: 'Publish Now',
            variant: 'info',
            onConfirm: () => confirmStatusChange('OPEN', 'published')
        });
    }

    const handleCloseClick = () => {
        setModalConfig({
            isOpen: true,
            title: 'Close Job Hiring',
            message: 'Are you sure you want to close this job? You will no longer receive new applications.',
            confirmText: 'Close Job',
            variant: 'warning',
            onConfirm: () => confirmStatusChange('CLOSED', 'closed')
        });
    }

    const handleReopenClick = () => {
        setModalConfig({
            isOpen: true,
            title: 'Re-open Job Position',
            message: 'Are you sure you want to re-open this job? New candidates will be able to apply again.',
            confirmText: 'Re-open Job',
            variant: 'info',
            onConfirm: () => confirmStatusChange('OPEN', 're-opened')
        });
    }

    const confirmStatusChange = async (status, actionLabel) => {
        setModalConfig(prev => ({ ...prev, loading: true }));
        try {
            if (status === 'CLOSED') {
                await dispatch(closeJob(id)).unwrap();
            } else {
                await dispatch(updateJobStatus({ id, status })).unwrap();
            }
            toast.success(`Job ${actionLabel} successfully`);
            setModalConfig(prev => ({ ...prev, isOpen: false }));
        } catch (error) {
            toast.error(error || `Failed to ${actionLabel} job`);
        } finally {
            setModalConfig(prev => ({ ...prev, loading: false }));
        }
    };

    if (loading) return (
        <RecruiterLayout>
            <div className="h-[60vh] flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-[#1a3c8f]/20 border-t-[#1a3c8f] rounded-full animate-spin" />
            </div>
        </RecruiterLayout>
    );

    if (error) return (
        <RecruiterLayout>
            <div className="max-w-2xl mx-auto mt-10 p-8 text-center bg-white rounded-3xl shadow-sm border border-red-100">
                <AlertCircle className="mx-auto text-red-500 mb-4" size={48} />
                <h2 className="text-2xl font-bold text-gray-900">Oops! Something went wrong</h2>
                <p className="text-gray-500 mt-2">{error}</p>
                <button 
                    onClick={() => navigate('/recruiter/manage-jobs')}
                    className="mt-6 px-6 py-2.5 bg-[#1a3c8f] text-white rounded-xl font-bold shadow-lg shadow-blue-900/10"
                >
                    Back to Jobs
                </button>
            </div>
        </RecruiterLayout>
    );

    if (!job) return null;

    const statusConfig = {
        OPEN: { icon: CheckCircle, color: "text-green-600", bg: "bg-green-50", label: "Active" },
        CLOSED: { icon: XCircle, color: "text-red-600", bg: "bg-red-50", label: "Closed" },
        DRAFT: { icon: Clock, color: "text-gray-600", bg: "bg-gray-50", label: "Draft" }
    };

    const currentStatus = statusConfig[job.status] || statusConfig.OPEN;

    return (
        <RecruiterLayout>
            <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-5xl mx-auto space-y-6 pb-20 relative"
            >
                <ConfirmationModal 
                    {...modalConfig}
                    onClose={() => setModalConfig(prev => ({ ...prev, isOpen: false }))}
                />

                {/* Header Card */}
                <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/50 rounded-full blur-3xl -mr-32 -mt-32" />
                    
                    <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div className="space-y-4">
                            <button 
                                onClick={() => navigate(-1)}
                                className="inline-flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-[#1a3c8f] transition-colors"
                            >
                                <ArrowLeft size={16} />
                                BACK TO LIST
                            </button>
                            <div className="space-y-2">
                                <div className="flex items-center gap-3">
                                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">{job.title}</h1>
                                    <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest flex items-center gap-2 ${currentStatus.bg} ${currentStatus.color}`}>
                                        <currentStatus.icon size={14} />
                                        {currentStatus.label}
                                    </span>
                                </div>
                                <p className="text-lg font-medium text-gray-500 flex items-center gap-2">
                                    {job.department} <span className="text-gray-300">•</span> {job.jobType}
                                </p>
                            </div>
                        </div>
                        
                        <div className="flex gap-3 w-full md:w-auto">
                            <button 
                                onClick={() => navigate(`/recruiter/edit-job/${job.id}`)}
                                className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-gray-100 text-gray-700 rounded-2xl font-bold hover:border-[#1a3c8f] hover:text-[#1a3c8f] transition-all active:scale-95"
                            >
                                <Edit2 size={18} />
                                Edit Job
                            </button>
                            <button className="flex-1 md:flex-none px-8 py-3 bg-[#1a3c8f] text-white rounded-2xl font-bold shadow-xl shadow-blue-900/20 hover:bg-blue-800 transition-all active:scale-95 uppercase text-sm tracking-wider">
                                View Applicants
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mt-10 pt-8 border-t border-gray-50">
                        <DetailItem icon={MapPin} label="Location" value={job.location} />
                        <DetailItem icon={Briefcase} label="Experience" value={job.experience} />
                        <DetailItem icon={DollarSign} label="Offered Salary" value={`${job.salaryMin} - ${job.salaryMax} LPA`} />
                        <DetailItem icon={Users} label="Vacancies" value={`${job.vacancies} Positions`} />
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 space-y-8">
                            <Section title="Description" content={job.description} />
                            <Section title="Key Responsibilities" content={job.responsibilities} />
                            <Section title="Candidate Requirements" content={job.requirements} />
                            <Section title="Required Skills" content={job.skills} />
                            <Section title="Benefits & Perks" content={job.benefits} />
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
                            <h4 className="text-base font-bold text-gray-900 mb-6">Posting Timeline</h4>
                            <div className="space-y-6">
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-[#1a3c8f]">
                                        <Calendar size={20} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-gray-400 uppercase">Posted On</p>
                                        <p className="text-sm font-bold text-gray-900">{new Date(job.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center text-red-600">
                                        <Clock size={20} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-gray-400 uppercase">Deadline</p>
                                        <p className="text-sm font-bold text-gray-900">
                                            {job.deadline ? new Date(job.deadline).toLocaleDateString(undefined, { dateStyle: 'long' }) : 'No deadline set'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {job.status === 'DRAFT' && (
                            <div className="bg-green-600 p-8 rounded-[2rem] text-white">
                                <h4 className="text-lg font-bold mb-2">Ready to publish?</h4>
                                <p className="text-green-50 text-sm mb-6 leading-relaxed">
                                    This job is currently a draft. Publish it now to start receiving applications from qualified candidates.
                                </p>
                                <button 
                                    onClick={handlePublishClick}
                                    className="w-full py-3 bg-white text-green-600 rounded-2xl font-bold hover:bg-green-50 transition-colors flex items-center justify-center gap-2"
                                >
                                    <CheckCircle size={18} />
                                    Publish Job
                                </button>
                            </div>
                        )}

                        {job.status === 'OPEN' && (
                            <div className="bg-[#1a3c8f] p-8 rounded-[2rem] text-white">
                                <h4 className="text-lg font-bold mb-2">Need to close this hiring?</h4>
                                <p className="text-blue-100 text-sm mb-6 leading-relaxed">
                                    Once you have found the right candidate, you can close this job posting to stop receiving new applications.
                                </p>
                                <button 
                                    onClick={handleCloseClick}
                                    className="w-full py-3 bg-white text-[#1a3c8f] rounded-2xl font-bold hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
                                >
                                    <XCircle size={18} />
                                    Close Job Now
                                </button>
                            </div>
                        )}

                        {job.status === 'CLOSED' && (
                            <div className="bg-blue-600 p-8 rounded-[2rem] text-white">
                                <h4 className="text-lg font-bold mb-2">Re-open this position?</h4>
                                <p className="text-blue-50 text-sm mb-6 leading-relaxed">
                                    Need more candidates? You can re-open this closed job posting at any time to start receiving applications again.
                                </p>
                                <button 
                                    onClick={handleReopenClick}
                                    className="w-full py-3 bg-white text-blue-600 rounded-2xl font-bold hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
                                >
                                    <PlusCircle size={18} />
                                    Re-open Job
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>
        </RecruiterLayout>
    );
};

export default ViewJob;
