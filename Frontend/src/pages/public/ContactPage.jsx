import { useState } from 'react'
import { motion } from 'framer-motion'
import { Send, MapPin, Phone, Mail, Clock, BrainCircuit, Globe, Users, Target } from 'lucide-react'
import Navbar from '../../components/Navbar'
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
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />

            {/* Hero Section */}
            <section className="relative bg-[#1a3c8f] py-20 px-4 overflow-hidden pt-36">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(96,165,250,0.15)_0%,_transparent_60%)]" />
                <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-400/10 rounded-full -ml-36 -mb-36 blur-3xl" />
                
                <div className="max-w-6xl mx-auto relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tighter">
                            Let's Talk About <br />
                            <span className="text-blue-300">Your Future</span>
                        </h1>
                        <p className="text-blue-100/80 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed">
                            Whether you're looking to hire top talent or find your dream job in the textile industry, our team is here to help you succeed.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Main Content Area */}
            <main className="flex-grow py-20 px-4">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
                    
                    {/* Left Column: About & Contact Info */}
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="space-y-12"
                    >
                        {/* About Us */}
                        <div className="space-y-6">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-xs font-black uppercase tracking-widest border border-blue-100">
                                <Users size={14} />
                                About LOSODHAN
                            </div>
                            <h2 className="text-3xl font-black text-gray-900 tracking-tight">
                                Empowering India's Textile Industry
                            </h2>
                            <p className="text-gray-600 leading-relaxed font-medium">
                                LOSODHAN is a premier job portal dedicated exclusively to the textile sector. We bridge the gap between industry-leading manufacturers and skilled professionals. 
                                Our mission is to streamline recruitment, foster career growth, and drive innovation within one of India's most vital economic sectors.
                            </p>
                            
                            <div className="grid grid-cols-2 gap-6 pt-4">
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                    <Target className="text-[#1a3c8f] mb-3" size={24} />
                                    <h3 className="font-bold text-gray-900 mb-2">Our Mission</h3>
                                    <p className="text-sm text-gray-500">To connect the best textile talent with world-class opportunities.</p>
                                </div>
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                    <Globe className="text-[#1a3c8f] mb-3" size={24} />
                                    <h3 className="font-bold text-gray-900 mb-2">Our Vision</h3>
                                    <p className="text-sm text-gray-500">To be the central hub for professional growth in the textile realm.</p>
                                </div>
                            </div>
                        </div>

                        {/* Contact Info */}
                        <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-blue-900/5 border border-gray-50">
                            <h3 className="text-xl font-black text-gray-900 mb-8 tracking-tight">Get In Touch</h3>
                            
                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center shrink-0">
                                        <MapPin className="text-[#1a3c8f]" size={20} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900 mb-1">Headquarters</p>
                                        <p className="text-gray-500 text-sm leading-relaxed">Pandesara, Surat, GJ — 394221<br />India</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center shrink-0">
                                        <Mail className="text-[#1a3c8f]" size={20} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900 mb-1">Email Us</p>
                                        <p className="text-gray-500 text-sm">support@losodhan.com</p>
                                        <p className="text-gray-500 text-sm">info@losodhan.com</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center shrink-0">
                                        <Clock className="text-[#1a3c8f]" size={20} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900 mb-1">Working Hours</p>
                                        <p className="text-gray-500 text-sm">Mon - Sat: 9:00 AM - 6:00 PM</p>
                                        <p className="text-gray-500 text-sm">Sunday: Closed</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Column: Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                    >
                        <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-2xl shadow-blue-900/10 border border-gray-100">
                            <div className="mb-8">
                                <h3 className="text-2xl font-black text-gray-900 tracking-tight mb-2">Send us a Message</h3>
                                <p className="text-gray-500 text-sm">Fill out the form below and we'll reply to you shortly.</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-gray-700 uppercase tracking-widest">Full Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3c8f]/20 focus:border-[#1a3c8f] transition-all font-medium"
                                            placeholder="John Doe"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-gray-700 uppercase tracking-widest">Email Address</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3c8f]/20 focus:border-[#1a3c8f] transition-all font-medium"
                                            placeholder="john@example.com"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-gray-700 uppercase tracking-widest">Mobile Number</label>
                                        <input
                                            type="tel"
                                            name="mobile"
                                            value={formData.mobile}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3c8f]/20 focus:border-[#1a3c8f] transition-all font-medium"
                                            placeholder="+91 9876543210"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-gray-700 uppercase tracking-widest">Subject</label>
                                        <select
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3c8f]/20 focus:border-[#1a3c8f] transition-all font-medium text-gray-700 appearance-none"
                                        >
                                            <option value="">Select a topic</option>
                                            <option value="General Inquiry">General Inquiry</option>
                                            <option value="Recruiter Support">Recruiter Support</option>
                                            <option value="Candidate Support">Candidate Support</option>
                                            <option value="Billing & Payments">Billing & Payments</option>
                                            <option value="Partnership">Partnership</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-700 uppercase tracking-widest">Your Message</label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        rows={5}
                                        className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3c8f]/20 focus:border-[#1a3c8f] transition-all font-medium resize-none"
                                        placeholder="How can we help you today?"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-4 bg-[#1a3c8f] hover:bg-blue-800 text-white rounded-2xl font-black uppercase tracking-widest text-xs transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-xl shadow-blue-900/20 disabled:opacity-70 disabled:pointer-events-none"
                                >
                                    {loading ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            <Send size={16} />
                                            Send Message
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </motion.div>
                </div>
            </main>

            {/* Simple Footer just for this page so it doesn't look empty at the bottom */}
            <footer className="bg-gray-950 text-gray-600 py-8 px-4 text-center mt-auto">
                <p className="text-[10px] font-black uppercase tracking-widest">
                    © {new Date().getFullYear()} LOSODHAN JOB PORTAL — All Rights Reserved
                </p>
            </footer>
        </div>
    )
}

export default ContactPage
