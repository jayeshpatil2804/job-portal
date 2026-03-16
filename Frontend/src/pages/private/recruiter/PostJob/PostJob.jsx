import React, { useState } from 'react'
import RecruiterLayout from '../../../../components/RecruiterLayout'
import { motion } from 'framer-motion'
import { useDispatch } from 'react-redux'
import { createJob } from '../../../../redux/actions/jobActions'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

const PostJob = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        jobTitle: '',
        department: '',
        jobType: '',
        experience: '',
        minSalary: '',
        maxSalary: '',
        location: '',
        vacancies: '',
        description: '',
        responsibilities: '',
        requirements: '',
        skills: '',
        benefits: '',
        deadline: '',
        isFeatured: false,
        isRemote: false,
    })

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }))
    }

    const handleSubmit = async (e, status = 'OPEN') => {
        e.preventDefault();
        
        if (!formData.jobTitle || !formData.department || !formData.experience || !formData.location || !formData.description) {
            toast.error("Please fill all required fields (Title, Dept, Exp, Location, Description)");
            return;
        }
        
        try {
            setLoading(true);
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
                isFeatured: formData.isFeatured,
                isRemote: formData.isRemote,
                status: status
            };

            const resultAction = await dispatch(createJob(payload)).unwrap();
            toast.success(status === 'DRAFT' ? "Job saved as draft!" : "Job published successfully!");
            navigate('/recruiter/dashboard'); // Or manage jobs page
        } catch (error) {
            console.error("Job post error:", error);
            toast.error(error || "Failed to process job");
        } finally {
            setLoading(false);
        }
    }

    return (
        <RecruiterLayout>
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Post a Job</h1>
                    <p className="text-gray-500">Create a new job posting to attract top talent</p>
                </div>

                <form className="space-y-8" onSubmit={handleSubmit}>
                    {/* Job Information Section */}
                    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 space-y-6">
                        <h3 className="text-lg font-bold text-gray-800 border-b pb-4">Job Information</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Job Title *</label>
                                <input 
                                    name="jobTitle"
                                    value={formData.jobTitle}
                                    onChange={handleChange}
                                    type="text" 
                                    placeholder="e.g., Senior Textile Designer" 
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Department *</label>
                                <select name="department" value={formData.department} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required>
                                    <option value="">Select Department</option>
                                    <option value="Design">Design</option>
                                    <option value="Production">Production</option>
                                    <option value="Sales">Sales</option>
                                    <option value="IT">IT</option>
                                    <option value="HR">HR</option>
                                    <option value="Marketing">Marketing</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Job Type</label>
                                <select name="jobType" value={formData.jobType} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                                    <option value="">Select Job Type</option>
                                    <option value="Full-time">Full-time</option>
                                    <option value="Part-time">Part-time</option>
                                    <option value="Contract">Contract</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Experience Required *</label>
                                <select name="experience" value={formData.experience} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required>
                                    <option value="">Select Experience</option>
                                    <option value="Fresher">Fresher</option>
                                    <option value="1-3 Years">1-3 Years</option>
                                    <option value="3-5 Years">3-5 Years</option>
                                    <option value="5+ Years">5+ Years</option>
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Min Salary (LPA)</label>
                                    <input name="minSalary" value={formData.minSalary} onChange={handleChange} type="number" placeholder="e.g., 5" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Max Salary (LPA)</label>
                                    <input name="maxSalary" value={formData.maxSalary} onChange={handleChange} type="number" placeholder="e.g., 8" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Location *</label>
                                <input name="location" value={formData.location} onChange={handleChange} type="text" placeholder="e.g., Mumbai, Maharashtra" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Number of Vacancies</label>
                                <input name="vacancies" value={formData.vacancies} onChange={handleChange} type="number" placeholder="1" min="1" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                            </div>
                        </div>
                    </div>

                    {/* Job Description Section */}
                    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 space-y-6">
                        <h3 className="text-lg font-bold text-gray-800 border-b pb-4">Job Description</h3>
                        
                        <div className="space-y-6 items-start text-left normal-case font-normal text-sm">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase">Job Description *</label>
                                <textarea name="description" value={formData.description} onChange={handleChange} rows="4" placeholder="Describe the job role, responsibilities, and what you're looking for..." className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none" required />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase">Key Responsibilities</label>
                                <textarea name="responsibilities" value={formData.responsibilities} onChange={handleChange} rows="3" placeholder="List the main responsibilities (one per line)..." className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none" />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase">Candidate Requirements</label>
                                <textarea name="requirements" value={formData.requirements} onChange={handleChange} rows="3" placeholder="List the required qualifications, skills, and experience (one per line)..." className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none" />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase">Required Skills (comma separated)</label>
                                <input name="skills" value={formData.skills} onChange={handleChange} type="text" placeholder="e.g., Textile Design, Adobe Illustrator, Pattern Making" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                            </div>
                        </div>
                    </div>

                    {/* Benefits Section */}
                    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 space-y-6">
                        <h3 className="text-lg font-bold text-gray-800 border-b pb-4">Benefits & Perks (Optional)</h3>
                        <textarea name="benefits" value={formData.benefits} onChange={handleChange} rows="3" placeholder="List benefits and perks (one per line)..." className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none" />
                    </div>

                    {/* Application Settings Section */}
                    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 space-y-6">
                        <h3 className="text-lg font-bold text-gray-800 border-b pb-4">Application Settings</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Application Deadline</label>
                                <input name="deadline" value={formData.deadline} onChange={handleChange} type="date" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                            </div>
                            <div className="space-y-3 pb-2">
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <input name="isFeatured" checked={formData.isFeatured} onChange={handleChange} type="checkbox" className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                                    <span className="text-sm font-semibold text-gray-700 group-hover:text-blue-600 transition-colors uppercase">Mark this job as featured (appears on homepage)</span>
                                </label>
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <input name="isRemote" checked={formData.isRemote} onChange={handleChange} type="checkbox" className="w-5 h-5 rounded border-gray-300 text-blue-100 text-blue-700" />
                                    <span className="text-sm font-semibold text-gray-700 group-hover:text-blue-600 transition-colors uppercase">Remote work available</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Form Buttons */}
                    <div className="flex justify-end gap-4">
                        <button 
                            type="button" 
                            onClick={(e) => handleSubmit(e, 'DRAFT')} 
                            disabled={loading} 
                            className="px-6 py-2.5 border border-[#1a3c8f] text-[#1a3c8f] font-bold rounded-lg hover:bg-blue-50 transition-colors uppercase disabled:opacity-50"
                        >
                            {loading ? "Saving..." : "Save as Draft"}
                        </button>
                        <button 
                            type="submit" 
                            disabled={loading} 
                            className="px-10 py-2.5 bg-[#1a3c8f] text-white font-bold rounded-lg hover:bg-blue-800 transition-shadow shadow-md uppercase disabled:opacity-50"
                        >
                            {loading ? "Publishing..." : "Publish Job"}
                        </button>
                    </div>
                </form>
            </div>
        </RecruiterLayout>
    )
}

export default PostJob

