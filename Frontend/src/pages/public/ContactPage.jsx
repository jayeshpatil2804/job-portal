import { useState } from 'react'
import { motion } from 'framer-motion'
import { Send, MapPin, Phone, Mail, Clock, Globe, Users, Target, Building2, ShieldCheck, Zap, Sparkles } from 'lucide-react'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import toast from 'react-hot-toast'
import api from '../../utils/api'

const ContactPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        mobile: '',
        subject: '',
        message: ''
    })
    const [loading, setLoading] = useState(false)

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            await api.post('/contact', formData)
            toast.success('Your message has been sent successfully! We will get back to you soon.')
            setFormData({ name: '', email: '', mobile: '', subject: '', message: '' })
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to send message. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-[#f8fafc] flex flex-col font-sans selection:bg-primary-100 selection:text-primary-900">
            <Navbar />

            {/* ── Hero Section ── */}
            <section className="relative min-h-[50vh] flex items-center justify-center pt-32 pb-20 px-4 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-slate-950 z-10 opacity-95" />
                    <div className="absolute inset-0 hero-mesh opacity-30 z-10" />
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />
                </div>
                
                <div className="max-w-7xl mx-auto text-center relative z-20 w-full">
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="inline-flex items-center gap-2 px-5 py-2 glass-effect-dark text-blue-100 rounded-full text-[10px] md:text-xs font-bold mb-10 tracking-[0.2em] uppercase border border-white/10">
                            Support & Partnership
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black text-white mb-8 leading-[1.1] tracking-tighter uppercase">
                            Connect with <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">
                                Textile Experts
                            </span>
                        </h1>
                        <p className="text-slate-400 text-lg md:text-xl mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
                            Whether you are an employer looking for skilled workforce or a job seeker searching for the right opportunity, feel free to reach out to us.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* ── Main Content Area ── */}
            <main className="flex-grow py-32 px-4 relative z-10 -mt-20">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20">
                    
                    {/* Left Column: About & Contact Info */}
                    <motion.div 
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="space-y-12"
                    >
                        {/* Info Header */}
                        <div className="space-y-8">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] border border-blue-100">
                                <Users size={14} />
                                Get In Touch
                            </div>
                            <h2 className="text-4xl font-black text-slate-950 tracking-tight leading-tight uppercase">
                                Reach Our <span className="text-primary-900">Expert Team</span>
                            </h2>
                            <p className="text-slate-500 text-lg font-medium leading-relaxed">
                                We're here to help you with all your hiring and job-related needs in the textile industry. Have any questions or need support?
                            </p>
                        </div>

                        {/* Contact Info Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.05)] hover-lift cursor-default">
                                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-6">
                                    <MapPin className="text-primary-900" size={24} />
                                </div>
                                <h3 className="font-black text-slate-900 text-lg tracking-tight mb-3 uppercase text-[12px]">Address</h3>
                                <p className="text-slate-500 font-bold text-sm leading-relaxed">Pandesara, Surat, GJ, India</p>
                            </div>
                            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.05)] hover-lift cursor-default">
                                <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6">
                                    <Phone className="text-indigo-600" size={24} />
                                </div>
                                <h3 className="font-black text-slate-900 text-lg tracking-tight mb-3 uppercase text-[12px]">Phone</h3>
                                <p className="text-slate-500 font-bold text-sm leading-relaxed truncate">+91-8511952831</p>
                            </div>
                            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.05)] hover-lift cursor-default">
                                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-6">
                                    <Mail className="text-primary-900" size={24} />
                                </div>
                                <h3 className="font-black text-slate-900 text-lg tracking-tight mb-3 uppercase text-[12px]">Email</h3>
                                <p className="text-slate-500 font-bold text-sm leading-relaxed truncate">info@losodhan.com</p>
                            </div>
                            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.05)] hover-lift cursor-default">
                                <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6">
                                    <Globe className="text-indigo-600" size={24} />
                                </div>
                                <h3 className="font-black text-slate-900 text-lg tracking-tight mb-3 uppercase text-[12px]">Website</h3>
                                <p className="text-slate-500 font-bold text-sm leading-relaxed truncate">https://losodhan.com</p>
                            </div>
                        </div>

                        {/* Business Hours */}
                        <div className="bg-slate-900 p-10 rounded-[2.5rem] text-white flex items-center gap-8 relative overflow-hidden group">
                           <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 opacity-5 blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700" />
                            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center shrink-0">
                                <Clock className="text-blue-400" size={24} />
                            </div>
                            <div className="space-y-1">
                                <h4 className="font-black text-xs uppercase tracking-[0.3em] text-blue-400">Working Hours</h4>
                                <p className="text-slate-200 font-bold text-lg">Mon — Sat: 10:00 AM - 7:00 PM</p>
                                <p className="text-slate-400 text-sm font-medium italic">Sunday: Strategic Closed</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Column: Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                    >
                        <div className="bg-white rounded-[3rem] p-10 md:p-14 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] border border-slate-100">
                            <div className="mb-10 text-center">
                                <span className="p-2 bg-primary-900 text-white rounded-full inline-block mb-6 shadow-xl shadow-primary-900/30">
                                    <Sparkles size={24} />
                                </span>
                                <h3 className="text-3xl font-black text-slate-950 tracking-tight leading-tight uppercase mb-4">Send Us a Message</h3>
                                <p className="text-slate-400 font-medium text-sm">Fill out the contact form and our team will get back to you shortly.</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Full Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-primary-900/5 focus:border-primary-900 transition-all font-bold text-slate-950"
                                            placeholder="Enter your name"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Email Address</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-primary-900/5 focus:border-primary-900 transition-all font-bold text-slate-950"
                                            placeholder="john@example.com"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Phone Number</label>
                                        <input
                                            type="tel"
                                            name="mobile"
                                            value={formData.mobile}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-primary-900/5 focus:border-primary-900 transition-all font-bold text-slate-950"
                                            placeholder="+91 — — — — — "
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Inquiry Category</label>
                                        <select
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-primary-900/5 focus:border-primary-900 transition-all font-bold text-slate-950 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M5%207.5L10%2012.5L15%207.5%22%20stroke%3D%22%2394A3B8%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22/%3E%3C/svg%3E')] bg-[length:20px] bg-[right_1.5rem_center] bg-no-repeat"
                                        >
                                            <option value="">Select Topic</option>
                                            <option value="Employer Registration">Employer Support</option>
                                            <option value="Candidate Opportunities">Candidate Support</option>
                                            <option value="Strategic Partnership">Strategic Partnership</option>
                                            <option value="General Support">General Inquiries</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Your Question</label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        rows={5}
                                        className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-primary-900/5 focus:border-primary-900 transition-all font-bold text-slate-950 resize-none"
                                        placeholder="How can we help your textile career or business?"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-5 bg-primary-900 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs transition-all active:scale-[0.98] flex items-center justify-center gap-3 shadow-2xl shadow-primary-900/40 hover:bg-navy-700 disabled:opacity-70 disabled:pointer-events-none"
                                >
                                    {loading ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            <Send size={18} strokeWidth={3} />
                                            Submit Message
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </motion.div>
                </div>
            </main>

            <Footer />
        </div>
    )
}

export default ContactPage
