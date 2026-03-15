import React from 'react'
import RecruiterLayout from '../../../../components/RecruiterLayout'
import { Calendar, Clock, MapPin, Video, Edit, X, RefreshCcw } from 'lucide-react'
import { motion } from 'framer-motion'

const InterviewCard = ({ candidate, position, date, time, mode, location }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-4">
        <div className="flex justify-between items-start">
            <div>
                <h4 className="text-lg font-bold text-gray-900">{candidate}</h4>
                <p className="text-sm text-gray-500 font-medium lowercase">{position}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                mode === 'Online' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
            }`}>
                {mode}
            </span>
        </div>

        <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm text-gray-600">
                <Calendar size={16} className="text-blue-600" />
                <span>{date}</span>
                <Clock size={16} className="text-blue-600 ml-4" />
                <span>{time}</span>
            </div>
            <div className="flex items-start gap-3 text-sm text-gray-600">
                {mode === 'Online' ? <Video size={16} className="text-blue-600 shrink-0" /> : <MapPin size={16} className="text-blue-600 shrink-0" />}
                <span className="truncate">{location}</span>
            </div>
        </div>

        <div className="flex gap-2 pt-2 border-t border-gray-50">
            <button className="flex-1 py-1.5 border border-blue-600 text-blue-600 rounded text-xs font-bold hover:bg-blue-50 transition-colors uppercase">Edit</button>
            <button className="flex-1 py-1.5 border border-[#1a3c8f] text-[#1a3c8f] rounded text-xs font-bold hover:bg-blue-50 transition-colors uppercase">Reschedule</button>
            <button className="flex-1 py-1.5 border border-red-500 text-red-500 rounded text-xs font-bold hover:bg-red-50 transition-colors uppercase">Cancel</button>
        </div>
    </div>
)

const Interviews = () => {
    const scheduledInterviews = [
        { id: 1, candidate: 'Rahul Kumar', position: 'Senior Textile Designer', date: '2026-03-15', time: '10:00 AM', mode: 'Online', location: 'https://meet.google.com/abc-defg-hij' },
        { id: 2, candidate: 'Amit Patel', position: 'Production Manager', date: '2026-03-16', time: '2:00 PM', mode: 'Offline', location: 'Office - Conference Room A' },
        { id: 3, candidate: 'Priya Sharma', position: 'Senior Textile Designer', date: '2026-03-17', time: '11:00 AM', mode: 'Online', location: 'https://meet.google.com/xyz-abcd-efg' },
    ]

    return (
        <RecruiterLayout>
            <div className="space-y-8">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Interview Scheduling</h1>
                    <p className="text-gray-500">Schedule and manage candidate interviews</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Schedule Form */}
                    <div className="lg:col-span-4 bg-white p-8 rounded-xl shadow-sm border border-gray-100 h-fit space-y-6">
                        <h3 className="text-lg font-bold text-gray-800 border-b pb-4">Schedule Interview</h3>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-2 uppercase">Select Candidate</label>
                                <select className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none text-sm">
                                    <option>Select Candidate</option>
                                    <option>Rahul Kumar</option>
                                    <option>Priya Sharma</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-2 uppercase">Interview Date</label>
                                <input type="date" className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none text-sm" />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-2 uppercase">Interview Time</label>
                                <input type="time" className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none text-sm" />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-2 uppercase">Interview Mode</label>
                                <select className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none text-sm">
                                    <option>Online (Video Call)</option>
                                    <option>Offline (In-Person)</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-2 uppercase">Meeting Link / Location</label>
                                <input type="text" placeholder="Enter meeting link or office location" className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none text-sm" />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-2 uppercase">Additional Notes</label>
                                <textarea rows="3" placeholder="Any special instructions or requirements..." className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none text-sm resize-none" />
                            </div>

                            <label className="flex items-center gap-3 cursor-pointer py-2">
                                <input type="checkbox" className="w-4 h-4 rounded text-blue-600 border-gray-300 focus:ring-blue-500" />
                                <span className="text-xs font-bold text-gray-700 uppercase">Send email notification to candidate</span>
                            </label>

                            <button className="w-full bg-[#1a3c8f] text-white py-3 rounded-lg font-bold hover:bg-blue-800 transition-colors shadow-md uppercase tracking-wide">
                                Schedule Interview
                            </button>
                        </div>
                    </div>

                    {/* Scheduled List */}
                    <div className="lg:col-span-8 space-y-6">
                        <h3 className="text-lg font-bold text-gray-800">Scheduled Interviews</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {scheduledInterviews.map((interview) => (
                                <motion.div 
                                    key={interview.id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                >
                                    <InterviewCard {...interview} />
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </RecruiterLayout>
    )
}

export default Interviews
