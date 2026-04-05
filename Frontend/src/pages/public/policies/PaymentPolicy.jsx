import React from 'react'
import { motion } from 'framer-motion'
import { CreditCard, CheckCircle2, Lock, AlertTriangle, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import Navbar from '../../../components/Navbar'
import Footer from '../../../components/Footer'

const PaymentPolicy = () => {
    const sections = [
        {
            icon: CreditCard,
            title: 'Paid Services',
            description:
                'LOSODHAN may offer optional paid services such as premium job postings, featured candidate profiles, and enhanced visibility services.',
        },
        {
            icon: CheckCircle2,
            title: 'Payment Methods',
            items: [
                'UPI',
                'Debit / Credit Cards',
                'Net Banking',
                'Other supported digital modes',
            ],
        },
        {
            icon: Lock,
            title: 'Transaction Security',
            description:
                'All payments are processed through secure and certified payment gateways.',
        },
        {
            icon: AlertTriangle,
            title: 'Failed Transactions',
            description:
                'If an amount is deducted but service not delivered, it will be reviewed as per payment gateway and bank rules.',
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
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-orange-100 text-orange-700 mb-6">
                        <CreditCard size={32} />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-4">Payment Policy</h1>
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
                                    <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
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
                                                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0" />
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
                    <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-orange-600 font-bold uppercase tracking-widest transition-colors">
                        <ArrowLeft size={16} /> Back to Home
                    </Link>
                </div>
            </main>

            <Footer />
        </div>
    )
}

export default PaymentPolicy
