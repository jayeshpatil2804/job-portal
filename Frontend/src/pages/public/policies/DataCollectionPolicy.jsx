import React from 'react'
import { motion } from 'framer-motion'
import { Database, Eye, FileText, Lock, Users, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import Navbar from '../../../components/Navbar'
import Footer from '../../../components/Footer'

const DataCollectionPolicy = () => {
    const sections = [
        {
            icon: Eye,
            title: 'Types of Data Collected',
            items: [
                'Identification and contact details',
                'Professional and employment information',
                'Usage and interaction data',
            ],
        },
        {
            icon: FileText,
            title: 'Data Usage',
            items: [
                'Job matching and communication',
                'Service improvement and analytics',
                'Legal and compliance purposes',
            ],
        },
        {
            icon: Lock,
            title: 'Data Storage & Retention',
            items: [
                'Data stored securely on cloud servers',
                'Retained until account deletion or legal requirement',
            ],
        },
        {
            icon: Users,
            title: 'Third-Party Access',
            description:
                'Third-party tools may be used for analytics, notifications, and payment processing. All partners follow data protection standards.',
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
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-teal-100 text-teal-700 mb-6">
                        <Database size={32} />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-4">Data Collection Policy</h1>
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
                                    <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
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
                                                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-teal-500 shrink-0" />
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
                    <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-teal-600 font-bold uppercase tracking-widest transition-colors">
                        <ArrowLeft size={16} /> Back to Home
                    </Link>
                </div>
            </main>

            <Footer />
        </div>
    )
}

export default DataCollectionPolicy
