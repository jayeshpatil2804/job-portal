import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Clock, MapPin, Video, Monitor, User, AlignLeft } from 'lucide-react';

const ScheduleInterviewModal = ({ isOpen, onClose, onConfirm, applicantName, loading }) => {
    const [formData, setFormData] = useState({
        date: '',
        time: '',
        mode: 'ONLINE',
        location: '',
        duration: '60',
        notes: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        // Combine date and time into an ISO string if needed by backend, 
        // but our backend expects 'date' as a full string/Date
        onConfirm({
            ...formData,
            date: `${formData.date}T${formData.time}`
        });
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden relative"
                >
                    {/* Header */}
                    <div className="bg-[#1a3c8f] p-8 text-white relative">
                        <button 
                            onClick={onClose}
                            className="absolute top-6 right-6 p-2 hover:bg-white/10 rounded-full transition-colors"
                        >
                            <X size={20} />
                        </button>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md">
                                <Calendar size={24} className="text-white" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black tracking-tight">Schedule Interview</h3>
                                <p className="text-blue-100/80 text-sm font-medium">Setting up meeting with {applicantName}</p>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                    <Calendar size={12} />
                                    Date
                                </label>
                                <input
                                    required
                                    type="date"
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent focus:border-[#1a3c8f] focus:bg-white rounded-2xl outline-none transition-all font-bold text-gray-700"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                    <Clock size={12} />
                                    Time
                                </label>
                                <input
                                    required
                                    type="time"
                                    value={formData.time}
                                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent focus:border-[#1a3c8f] focus:bg-white rounded-2xl outline-none transition-all font-bold text-gray-700"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                <Video size={12} />
                                Interview Mode
                            </label>
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, mode: 'ONLINE' })}
                                    className={`py-3 rounded-2xl font-bold flex items-center justify-center gap-2 border-2 transition-all ${
                                        formData.mode === 'ONLINE' 
                                        ? 'bg-blue-50 border-[#1a3c8f] text-[#1a3c8f]' 
                                        : 'bg-white border-gray-100 text-gray-400 hover:border-gray-200'
                                    }`}
                                >
                                    <Monitor size={18} />
                                    Online
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, mode: 'OFFLINE' })}
                                    className={`py-3 rounded-2xl font-bold flex items-center justify-center gap-2 border-2 transition-all ${
                                        formData.mode === 'OFFLINE' 
                                        ? 'bg-blue-50 border-[#1a3c8f] text-[#1a3c8f]' 
                                        : 'bg-white border-gray-100 text-gray-400 hover:border-gray-200'
                                    }`}
                                >
                                    <MapPin size={18} />
                                    Offline
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                <MapPin size={12} />
                                {formData.mode === 'ONLINE' ? 'Meeting Link' : 'Physical Address'}
                            </label>
                            <input
                                required
                                type="text"
                                placeholder={formData.mode === 'ONLINE' ? 'Google Meet, Zoom link...' : 'Office address details...'}
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent focus:border-[#1a3c8f] focus:bg-white rounded-2xl outline-none transition-all font-bold text-gray-700"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                <AlignLeft size={12} />
                                Preparation Notes
                            </label>
                            <textarea
                                rows="3"
                                placeholder="Any specific instructions for the candidate..."
                                value={formData.notes}
                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent focus:border-[#1a3c8f] focus:bg-white rounded-2xl outline-none transition-all font-bold text-gray-700 resize-none"
                            ></textarea>
                        </div>

                        <div className="flex gap-4 pt-2">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 py-4 bg-gray-100 text-gray-600 rounded-2xl font-black hover:bg-gray-200 transition-all uppercase tracking-widest text-xs"
                            >
                                Cancel
                            </button>
                            <button
                                disabled={loading}
                                type="submit"
                                className="flex-1 py-4 bg-[#1a3c8f] text-white rounded-2xl font-black shadow-xl shadow-blue-900/20 hover:bg-blue-800 transition-all disabled:opacity-50 uppercase tracking-widest text-xs"
                            >
                                {loading ? 'Scheduling...' : 'Confirm Schedule'}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default ScheduleInterviewModal;
