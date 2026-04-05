import React from 'react'
import { motion } from 'framer-motion'
import { FileText, CheckCircle2, Users, AlertTriangle, Shield, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import Navbar from '../../../components/Navbar'
import Footer from '../../../components/Footer'

const TermsAndConditions = () => {
    const sections = [
        {
            icon: CheckCircle2,
            title: 'Acceptance of Terms',
            description:
                'By registering or using the LOSODHAN Job Portal App, users agree to these Terms & Conditions.',
        },
        {
            icon: Users,
            title: 'User Eligibility',
            items: [
                'Minimum age: 18 years',
                'Users must provide accurate and lawful information',
            ],
        },
        {
            icon: FileText,
            title: 'User Responsibilities',
            items: [
                'Maintain confidentiality of login credentials',
                'Ensure uploaded data is genuine and lawful',
            ],
        },
        {
            icon: AlertTriangle,
            title: 'Prohibited Activities',
            items: [
                'Fake profiles or misleading job posts',
                'Uploading illegal, abusive, or false content',
                'Misuse of candidate or recruiter data',
            ],
        },
        {
            icon: Shield,
            title: 'Platform Disclaimer',
            description:
                'LOSODHAN acts only as a job facilitation platform and is not responsible for hiring decisions, salary negotiations or disputes, or fraud or misconduct by users.',
        },
        {
            icon: AlertTriangle,
            title: 'Account Termination',
            description:
                'Accounts violating policies may be suspended or terminated without prior notice.',
        },
    ]

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            <Navbar />
            
            <main className="flex-1 max-w-4xl mx-auto w-full px-4 pt-32 pb-16">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12 text-center"
                >
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-purple-100 text-purple-700 mb-6">
                        <FileText size={32} />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-4">Terms & Conditions</h1>
                </motion.div>

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
                                    <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
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
                                                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </motion.div>
                        )
                    })}
                </div>

                <div className="mt-12 text-center">
                    <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-purple-600 font-bold uppercase tracking-widest transition-colors">
                        <ArrowLeft size={16} /> Back to Home
                    </Link>
                </div>
            </main>

            <Footer />
        </div>
    )
}

export default TermsAndConditions
