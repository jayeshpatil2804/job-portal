import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getJobById, updateJob } from '../../../../redux/actions/jobActions';
import { clearSelectedJob } from '../../../../redux/slices/jobSlice';
import RecruiterLayout from '../../../../components/RecruiterLayout';
import { 
    Briefcase, Building2, MapPin, DollarSign, 
    Users, FileText, ArrowLeft, Save, Clock
} from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const InputField = ({ icon: Icon, label, name, value, onChange, type = "text", placeholder, required = false }) => (
    <div className="space-y-2">
        <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
            <Icon size={16} className="text-[#1a3c8f]" />
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all font-medium"
            required={required}
        />
    </div>
);

const TextAreaField = ({ icon: Icon, label, name, value, onChange, placeholder, required = false }) => (
    <div className="space-y-2">
        <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
            <Icon size={16} className="text-[#1a3c8f]" />
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        <textarea
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            rows="4"
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all font-medium resize-none"
            required={required}
        />
    </div>
);

const EditJob = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { selectedJob, loading, success } = useSelector((state) => state.job);

    const [formData, setFormData] = useState({
        jobTitle: '',
        department: '',
        jobType: 'Full Time',
        experience: '',
        minSalary: '',
        maxSalary: '',
        location: '',
        vacancies: 1,
        description: '',
        responsibilities: '',
        requirements: '',
        skills: '',
        benefits: '',
        deadline: '',
        isRemote: false,
        isFeatured: false,
        status: 'OPEN'
    });

    useEffect(() => {
        dispatch(getJobById(id));
        return () => dispatch(clearSelectedJob());
    }, [dispatch, id]);

    useEffect(() => {
        if (selectedJob) {
            setFormData({
                jobTitle: selectedJob.title || '',
                department: selectedJob.department || '',
                jobType: selectedJob.jobType || 'Full Time',
                experience: selectedJob.experience || '',
                minSalary: selectedJob.salaryMin || '',
                maxSalary: selectedJob.salaryMax || '',
                location: selectedJob.location || '',
                vacancies: selectedJob.vacancies || 1,
                description: selectedJob.description || '',
                responsibilities: selectedJob.responsibilities || '',
                requirements: selectedJob.requirements || '',
                skills: selectedJob.skills || '',
                benefits: selectedJob.benefits || '',
                deadline: selectedJob.deadline ? new Date(selectedJob.deadline).toISOString().split('T')[0] : '',
                isRemote: selectedJob.isRemote || false,
                isFeatured: selectedJob.isFeatured || false,
                status: selectedJob.status || 'OPEN'
            });
        }
    }, [selectedJob]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const payload = {
            title: formData.jobTitle,
            department: formData.department,
            jobType: formData.jobType,
            experience: formData.experience,
            salaryMin: formData.minSalary,
            salaryMax: formData.maxSalary,
            location: formData.location,
            vacancies: formData.vacancies,
            description: formData.description,
            responsibilities: formData.responsibilities,
            requirements: formData.requirements,
            skills: formData.skills,
            benefits: formData.benefits,
            deadline: formData.deadline,
            isRemote: formData.isRemote,
            isFeatured: formData.isFeatured,
            status: formData.status
        };

        try {
            await dispatch(updateJob({ id, jobData: payload })).unwrap();
            toast.success("Job updated successfully!");
            navigate('/recruiter/manage-jobs');
        } catch (error) {
            toast.error(error || "Failed to update job");
        }
    };

    return (
        <RecruiterLayout>
            <div className="max-w-4xl mx-auto space-y-6 pb-20">
                <button 
                    onClick={() => navigate(-1)}
                    className="inline-flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-[#1a3c8f] transition-colors"
                >
                    <ArrowLeft size={16} />
                    CANCEL EDITING
                </button>

                <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-sm border border-gray-100">
                    <div className="mb-10 text-center">
                        <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Edit Job Posting</h1>
                        <p className="text-gray-500 font-medium tracking-wide">Update your job details and requirements</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="grid md:grid-cols-2 gap-6">
                            <InputField 
                                icon={Briefcase} 
                                label="Job Title" 
                                name="jobTitle" 
                                value={formData.jobTitle} 
                                onChange={handleChange} 
                                placeholder="e.g. Senior Designer"
                                required 
                            />
                            <InputField 
                                icon={Building2} 
                                label="Department" 
                                name="department" 
                                value={formData.department} 
                                onChange={handleChange} 
                                placeholder="e.g. Design"
                                required 
                            />
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                    <Clock size={16} className="text-[#1a3c8f]" />
                                    Job Type
                                </label>
                                <select 
                                    name="jobType" 
                                    value={formData.jobType} 
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all font-medium appearance-none"
                                >
                                    <option value="FULL_TIME">Full-time</option>
                                    <option value="PART_TIME">Part-time</option>
                                    <option value="CONTRACT">Contract</option>
                                    <option value="INTERNSHIP">Internship</option>
                                </select>
                            </div>
                            <InputField 
                                icon={Clock} 
                                label="Experience Level" 
                                name="experience" 
                                value={formData.experience} 
                                onChange={handleChange} 
                                placeholder="e.g. 3-5 Years"
                                required 
                            />
                            <InputField 
                                icon={DollarSign} 
                                label="Min Salary (LPA)" 
                                name="minSalary" 
                                value={formData.minSalary} 
                                onChange={handleChange} 
                                type="number"
                                placeholder="e.g. 5"
                            />
                            <InputField 
                                icon={DollarSign} 
                                label="Max Salary (LPA)" 
                                name="maxSalary" 
                                value={formData.maxSalary} 
                                onChange={handleChange} 
                                type="number"
                                placeholder="e.g. 10"
                            />
                            <InputField 
                                icon={MapPin} 
                                label="Location" 
                                name="location" 
                                value={formData.location} 
                                onChange={handleChange} 
                                placeholder="e.g. Mumbai, India"
                                required 
                            />
                            <InputField 
                                icon={Users} 
                                label="Vacancies" 
                                name="vacancies" 
                                value={formData.vacancies} 
                                onChange={handleChange} 
                                type="number"
                                placeholder="1"
                            />
                        </div>

                        <div className="space-y-6">
                            <TextAreaField 
                                icon={FileText} 
                                label="General Description" 
                                name="description" 
                                value={formData.description} 
                                onChange={handleChange} 
                                placeholder="Describe the overview of the role..."
                                required 
                            />
                            <TextAreaField 
                                icon={FileText} 
                                label="Responsibilities" 
                                name="responsibilities" 
                                value={formData.responsibilities} 
                                onChange={handleChange} 
                                placeholder="List key responsibilities..."
                            />
                            <TextAreaField 
                                icon={FileText} 
                                label="Requirements" 
                                name="requirements" 
                                value={formData.requirements} 
                                onChange={handleChange} 
                                placeholder="What is expected from the candidate?"
                            />
                        </div>

                        <div className="bg-blue-50/50 p-6 rounded-[2rem] border border-blue-100/50 flex flex-col md:flex-row gap-6">
                           <div className="flex-1 space-y-4">
                               <label className="flex items-center gap-3 cursor-pointer group">
                                   <input 
                                       type="checkbox" 
                                       name="isRemote" 
                                       checked={formData.isRemote} 
                                       onChange={handleChange}
                                       className="w-5 h-5 rounded border-gray-300 text-[#1a3c8f] focus:ring-[#1a3c8f]"
                                   />
                                   <span className="text-sm font-bold text-gray-700 group-hover:text-[#1a3c8f] transition-colors">This is a Remote Position</span>
                               </label>
                               <label className="flex items-center gap-3 cursor-pointer group">
                                   <input 
                                       type="checkbox" 
                                       name="isFeatured" 
                                       checked={formData.isFeatured} 
                                       onChange={handleChange}
                                       className="w-5 h-5 rounded border-gray-300 text-[#1a3c8f] focus:ring-[#1a3c8f]"
                                   />
                                   <span className="text-sm font-bold text-gray-700 group-hover:text-[#1a3c8f] transition-colors">Feature this job on Homepage</span>
                               </label>
                           </div>
                           <div className="md:w-64 space-y-2">
                               <label className="text-xs font-black text-blue-900 uppercase tracking-widest pl-1">Application Deadline</label>
                               <input 
                                   type="date" 
                                   name="deadline" 
                                   value={formData.deadline} 
                                   onChange={handleChange}
                                   className="w-full px-4 py-2.5 bg-white border border-blue-200 rounded-xl outline-none font-bold text-sm"
                               />
                           </div>
                        </div>

                        <div className="pt-6 flex justify-end gap-4">
                            <button 
                                type="button" 
                                onClick={() => navigate(-1)}
                                className="px-8 py-3 text-gray-500 font-bold hover:text-gray-900 transition-colors uppercase text-sm tracking-wider"
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit" 
                                disabled={loading}
                                className="px-12 py-4 bg-[#1a3c8f] text-white rounded-2xl font-black shadow-xl shadow-blue-900/20 hover:bg-blue-800 transition-all active:scale-95 flex items-center gap-2 uppercase text-sm tracking-widest"
                            >
                                <Save size={18} />
                                {loading ? "Updating..." : "Update Job Posting"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </RecruiterLayout>
    );
};

export default EditJob;
