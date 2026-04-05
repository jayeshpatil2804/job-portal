import React from 'react'
import { motion } from 'framer-motion'
import { Shield, Eye, FileText, Users, Lock, CheckCircle2, ArrowLeft, Mail } from 'lucide-react'
import { Link } from 'react-router-dom'
import Navbar from '../../../components/Navbar'
import Footer from '../../../components/Footer'

const PrivacyPolicy = () => {
    const sections = [
        {
            icon: Eye,
            title: 'Information We Collect',
            items: [
                'Personal details: Name, mobile number, email ID',
                'Account credentials (securely encrypted)',
                'Resume details: education, experience, skills',
                'Job applications and profile activity',
                'Device data: IP address, device type, app version',
            ],
        },
        {
            icon: FileText,
            title: 'Purpose of Data Collection',
            items: [
                'Account creation and login authentication',
                'Job search and candidate–recruiter matching',
                'Application tracking and notifications',
                'App improvement and security monitoring',
            ],
        },
        {
            icon: Users,
            title: 'Data Sharing',
            items: [
                'Candidate data is visible to recruiters only through the platform',
                'We do not sell or rent user data',
                'Data may be shared if legally required by authorities',
            ],
        },
        {
            icon: Lock,
            title: 'Data Security',
            description:
                'We use standard security practices such as encryption, access control, and secure servers to protect user data.',
        },
        {
            icon: CheckCircle2,
            title: 'User Control',
            items: [
                'Users can edit or delete their profile',
                'Users may request permanent account deletion',
            ],
            footer: 'Contact: support@losodhan.com',
        },
    ]

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            <Navbar />
            
            {/* Header Area */}
            <main className="flex-1 max-w-4xl mx-auto w-full px-4 pt-32 pb-16">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12 text-center"
                >
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-blue-100 text-blue-700 mb-6">
                        <Shield size={32} />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-4">Privacy Policy</h1>
                    <p className="text-gray-500 font-medium">Effective Date: 06-02-2026</p>
                </motion.div>

                {/* Content */}
                <div className="space-y-6">
                    {sections.map((section, idx) => {
                        const Icon = section.icon
                        return (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-8"
                            >
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                                        <Icon size={24} />
                                    </div>
                                    <h2 className="text-xl font-black text-gray-900">{section.title}</h2>
                                </div>
                                
                                {section.description && (
                                    <p className="text-gray-600 font-medium leading-relaxed">{section.description}</p>
                                )}
                                
                                {section.items && (
                                    <ul className="space-y-3 mt-4">
                                        {section.items.map((item, i) => (
                                            <li key={i} className="flex items-start gap-3 text-gray-600 font-medium">
                                                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                )}

                                {section.footer && (
                                    <div className="mt-6 pt-4 border-t border-gray-50 text-sm font-bold text-blue-600 uppercase tracking-wider flex items-center gap-2">
                                        <Mail size={16} /> {section.footer}
                                    </div>
                                )}
                            </motion.div>
                        )
                    })}
                </div>

                <div className="mt-12 text-center">
                    <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-blue-600 font-bold uppercase tracking-widest transition-colors">
                        <ArrowLeft size={16} /> Back to Home
                    </Link>
                </div>
            </main>

            <Footer />
        </div>
    )
}

export default PrivacyPolicy
