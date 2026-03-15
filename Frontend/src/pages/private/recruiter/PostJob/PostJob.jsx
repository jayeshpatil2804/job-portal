import React, { useState } from 'react'
import RecruiterLayout from '../../../../components/RecruiterLayout'
import { motion } from 'framer-motion'

const PostJob = () => {
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

    return (
        <RecruiterLayout>
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Post a Job</h1>
                    <p className="text-gray-500">Create a new job posting to attract top talent</p>
                </div>

                <form className="space-y-8">
                    {/* Job Information Section */}
                    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 space-y-6">
                        <h3 className="text-lg font-bold text-gray-800 border-b pb-4">Job Information</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Job Title</label>
                                <input 
                                    name="jobTitle"
                                    type="text" 
                                    placeholder="e.g., Senior Textile Designer" 
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Department</label>
                                <select className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                                    <option>Select Department</option>
                                    <option>Design</option>
                                    <option>Production</option>
                                    <option>Sales</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Job Type</label>
                                <select className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                                    <option>Select Job Type</option>
                                    <option>Full-time</option>
                                    <option>Part-time</option>
                                    <option>Contract</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Experience Required</label>
                                <select className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                                    <option>Select Experience</option>
                                    <option>Fresher</option>
                                    <option>1-3 Years</option>
                                    <option>3-5 Years</option>
                                    <option>5+ Years</option>
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Min Salary (LPA)</label>
                                    <input type="text" placeholder="e.g., 5" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Max Salary (LPA)</label>
                                    <input type="text" placeholder="e.g., 8" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
                                <input type="text" placeholder="e.g., Mumbai, Maharashtra" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Number of Vacancies</label>
                                <input type="number" placeholder="2" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                            </div>
                        </div>
                    </div>

                    {/* Job Description Section */}
                    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 space-y-6 uppercase font-bold text-xs0">
                        <h3 className="text-lg font-bold text-gray-800 border-b pb-4">Job Description</h3>
                        
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase">Job Description</label>
                                <textarea rows="4" placeholder="Describe the job role, responsibilities, and what you're looking for..." className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none" />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase">Key Responsibilities</label>
                                <textarea rows="3" placeholder="List the main responsibilities (one per line)..." className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none" />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase">Candidate Requirements</label>
                                <textarea rows="3" placeholder="List the required qualifications, skills, and experience (one per line)..." className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none" />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase">Required Skills (comma separated)</label>
                                <input type="text" placeholder="e.g., Textile Design, Adobe Illustrator, Pattern Making" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                            </div>
                        </div>
                    </div>

                    {/* Benefits Section */}
                    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 space-y-6">
                        <h3 className="text-lg font-bold text-gray-800 border-b pb-4">Benefits & Perks (Optional)</h3>
                        <textarea rows="3" placeholder="List benefits and perks (one per line)..." className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none" />
                    </div>

                    {/* Application Settings Section */}
                    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 space-y-6">
                        <h3 className="text-lg font-bold text-gray-800 border-b pb-4">Application Settings</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Application Deadline</label>
                                <input type="date" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                            </div>
                            <div className="space-y-3 pb-2">
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                                    <span className="text-sm font-semibold text-gray-700 group-hover:text-blue-600 transition-colors uppercase">Mark this job as featured (appears on homepage)</span>
                                </label>
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-blue-100 text-blue-700" />
                                    <span className="text-sm font-semibold text-gray-700 group-hover:text-blue-600 transition-colors uppercase">Remote work available</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Form Buttons */}
                    <div className="flex justify-end gap-4">
                        <button type="button" className="px-6 py-2.5 border border-[#1a3c8f] text-[#1a3c8f] font-bold rounded-lg hover:bg-blue-50 transition-colors uppercase">
                            Save as Draft
                        </button>
                        <button type="submit" className="px-10 py-2.5 bg-[#1a3c8f] text-white font-bold rounded-lg hover:bg-blue-800 transition-shadow shadow-md uppercase">
                            Publish Job
                        </button>
                    </div>
                </form>
            </div>
        </RecruiterLayout>
    )
}

export default PostJob
