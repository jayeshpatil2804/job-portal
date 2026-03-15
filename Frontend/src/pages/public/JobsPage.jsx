import React from 'react'
import DashboardLayout from '../../components/DashboardLayout'
import { Search, MapPin, Briefcase, Bookmark, ChevronDown } from 'lucide-react'

// Dummy Data
const jobsData = [
    {
        id: 1,
        title: 'Senior Textile Designer',
        company: 'Arvind Mills',
        location: 'Mumbai, Maharashtra',
        salary: '₹6-8 LPA',
        experience: '3-5 years',
        type: 'Full Time',
        tag: 'Design',
        postedAt: 'Posted 2 days ago'
    },
    {
        id: 2,
        title: 'Production Manager',
        company: 'Welspun India',
        location: 'Ahmedabad, Gujarat',
        salary: '₹8-12 LPA',
        experience: '5-8 years',
        type: 'Full Time',
        tag: 'Production',
        postedAt: 'Posted 3 days ago'
    },
    {
        id: 3,
        title: 'Merchandiser',
        company: 'Raymond Limited',
        location: 'Bangalore, Karnataka',
        salary: '₹5-7 LPA',
        experience: '2-4 years',
        type: 'Full Time',
        tag: 'Merchandising',
        postedAt: 'Posted 1 week ago'
    },
    {
        id: 4,
        title: 'Machine Operator',
        company: 'Vardhman Textiles',
        location: 'Ludhiana, Punjab',
        salary: '₹3-5 LPA',
        experience: '1-3 years',
        type: 'Full Time',
        tag: 'Operations',
        postedAt: 'Posted 4 days ago'
    },
    {
        id: 5,
        title: 'Sales Executive',
        company: 'Trident Group',
        location: 'Delhi NCR',
        salary: '₹4-6 LPA',
        experience: '1-3 years',
        type: 'Full Time',
        tag: 'Sales',
        postedAt: 'Posted 5 days ago'
    }
]

const JobsPage = () => {
    return (
        <DashboardLayout>
            <div className="mb-8">
                <h1 className="text-3xl font-extrabold text-gray-900">Search Jobs</h1>
                <p className="text-gray-500 mt-1">Find your perfect textile industry job</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                
                {/* ── Left Sidebar: Filters ── */}
                <aside className="w-full lg:w-72 shrink-0">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-8">
                        <h2 className="font-bold text-gray-900 mb-6 text-lg">Filters</h2>

                        <div className="space-y-5">
                            {/* Location */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-2">Location</label>
                                <div className="relative">
                                    <select className="appearance-none w-full bg-white border border-gray-300 text-gray-700 text-sm rounded-md py-2.5 px-3 pr-8 shadow-sm focus:outline-none focus:ring-1 focus:ring-[#1a3c8f] focus:border-[#1a3c8f]">
                                        <option>All Locations</option>
                                        <option>Mumbai</option>
                                        <option>Ahmedabad</option>
                                        <option>Surat</option>
                                        <option>Coimbatore</option>
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                                        <ChevronDown size={14} />
                                    </div>
                                </div>
                            </div>

                            {/* Experience */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-2">Experience</label>
                                <div className="relative">
                                    <select className="appearance-none w-full bg-white border border-gray-300 text-gray-700 text-sm rounded-md py-2.5 px-3 pr-8 shadow-sm focus:outline-none focus:ring-1 focus:ring-[#1a3c8f] focus:border-[#1a3c8f]">
                                        <option>Any Experience</option>
                                        <option>Fresher</option>
                                        <option>1-3 years</option>
                                        <option>3-5 years</option>
                                        <option>5+ years</option>
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                                        <ChevronDown size={14} />
                                    </div>
                                </div>
                            </div>

                            {/* Department */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-2">Department</label>
                                <div className="relative">
                                    <select className="appearance-none w-full bg-white border border-gray-300 text-gray-700 text-sm rounded-md py-2.5 px-3 pr-8 shadow-sm focus:outline-none focus:ring-1 focus:ring-[#1a3c8f] focus:border-[#1a3c8f]">
                                        <option>All Departments</option>
                                        <option>Design</option>
                                        <option>Production</option>
                                        <option>Merchandising</option>
                                        <option>Quality Control</option>
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                                        <ChevronDown size={14} />
                                    </div>
                                </div>
                            </div>

                            {/* Salary Range */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-2">Salary Range</label>
                                <div className="relative">
                                    <select className="appearance-none w-full bg-white border border-gray-300 text-gray-700 text-sm rounded-md py-2.5 px-3 pr-8 shadow-sm focus:outline-none focus:ring-1 focus:ring-[#1a3c8f] focus:border-[#1a3c8f]">
                                        <option>Any Salary</option>
                                        <option>Less than 3 LPA</option>
                                        <option>3 - 6 LPA</option>
                                        <option>6 - 10 LPA</option>
                                        <option>More than 10 LPA</option>
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                                        <ChevronDown size={14} />
                                    </div>
                                </div>
                            </div>

                            {/* Buttons */}
                            <div className="pt-4 space-y-3">
                                <button className="w-full bg-[#1a3c8f] text-white font-semibold text-sm py-2.5 rounded-md hover:bg-[#162f72] transition-colors shadow-sm">
                                    Apply Filters
                                </button>
                                <button className="w-full bg-white text-[#1a3c8f] border border-[#1a3c8f] font-semibold text-sm py-2.5 rounded-md hover:bg-blue-50 transition-colors">
                                    Clear All
                                </button>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* ── Right Content: Job List ── */}
                <div className="flex-1">
                    
                    {/* Search Bar */}
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex gap-3 mb-6">
                        <div className="flex-1 flex items-center gap-2 border border-gray-200 rounded-md px-3 py-2">
                            <Search size={16} className="text-gray-400 shrink-0" />
                            <input 
                                type="text" 
                                placeholder="Search by job title, company, or keywords..." 
                                className="w-full text-sm outline-none text-gray-700 bg-transparent placeholder-gray-400"
                            />
                        </div>
                        <button className="bg-[#1a3c8f] text-white font-semibold text-sm px-6 py-2 rounded-md hover:bg-[#162f72] transition-colors shadow-sm whitespace-nowrap">
                            Search
                        </button>
                    </div>

                    {/* Results count text */}
                    <div className="mb-4 text-sm text-gray-600 font-medium">
                        Showing {jobsData.length} jobs
                    </div>

                    {/* Jobs List */}
                    <div className="space-y-4">
                        {jobsData.map(job => (
                            <div key={job.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative group relative">
                                {/* Bookmark icon */}
                                <button className="absolute top-6 right-6 text-gray-300 hover:text-[#1a3c8f] transition-colors">
                                    <Bookmark size={20} />
                                </button>

                                <div className="flex items-start gap-4">
                                    {/* Company Logo Placeholder */}
                                    <div className="w-14 h-14 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                                        <Briefcase size={24} className="text-[#1a3c8f]" />
                                    </div>

                                    {/* Job Meta Data */}
                                    <div className="flex-1">
                                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#1a3c8f] transition-colors cursor-pointer pr-8">{job.title}</h3>
                                        <p className="text-sm text-gray-600 mb-4">{job.company}</p>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-6 text-sm text-gray-500 mb-5">
                                            <div className="flex items-center gap-2">
                                                <MapPin size={16} className="text-gray-400" />
                                                <span>{job.location}</span>
                                            </div>
                                            <div className="flex items-center gap-2 font-medium text-gray-700">
                                                <span className="text-gray-400">$</span> {/* Assuming user might want Rupee symbol, used default $ from some designs, but changed to Rupee in data object though */}
                                                <span>{job.salary}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span>Experience: <span className="text-gray-700 font-medium">{job.experience}</span></span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span>Type: <span className="text-gray-700 font-medium">{job.type}</span></span>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-gray-50 pt-4 mt-2">
                                            <div className="flex items-center gap-3">
                                                <span className="bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full">{job.tag}</span>
                                                <span className="text-xs text-gray-400">{job.postedAt}</span>
                                            </div>
                                            
                                            <div className="flex items-center gap-3 w-full sm:w-auto mt-3 sm:mt-0">
                                                <button className="flex-1 sm:flex-none border border-gray-300 text-gray-700 text-sm font-semibold py-2 px-4 rounded-md hover:bg-gray-50 transition-colors">
                                                    View Details
                                                </button>
                                                <button className="flex-1 sm:flex-none bg-[#1a3c8f] text-white text-sm font-semibold py-2 px-6 rounded-md hover:bg-[#162f72] transition-colors shadow-sm">
                                                    Apply Now
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </DashboardLayout>
    )
}

export default JobsPage
