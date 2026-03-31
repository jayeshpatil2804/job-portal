import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Shield,
    FileText,
    Database,
    CreditCard,
    RotateCcw,
    Mail,
    Phone,
    ChevronDown,
    Lock,
    Eye,
    Users,
    AlertTriangle,
    CheckCircle2,
    Clock,
    ArrowLeft,
    Sparkles,
} from 'lucide-react'
import Navbar from '../../components/Navbar'

// ─── Policy Data ─────────────────────────────────────────────────────────────

const policies = [
    {
        id: 'privacy',
        icon: Shield,
        label: 'Privacy Policy',
        color: 'from-blue-600 to-[#1a3c8f]',
        lightColor: 'bg-blue-50 text-blue-700',
        borderColor: 'border-blue-200',
        effectiveDate: '06-02-2026',
        sections: [
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
        ],
    },
    {
        id: 'terms',
        icon: FileText,
        label: 'Terms & Conditions',
        color: 'from-purple-600 to-indigo-700',
        lightColor: 'bg-purple-50 text-purple-700',
        borderColor: 'border-purple-200',
        sections: [
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
        ],
    },
    {
        id: 'data',
        icon: Database,
        label: 'Data Collection Policy',
        color: 'from-teal-600 to-emerald-700',
        lightColor: 'bg-teal-50 text-teal-700',
        borderColor: 'border-teal-200',
        sections: [
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
        ],
    },
    {
        id: 'payment',
        icon: CreditCard,
        label: 'Payment Policy',
        color: 'from-orange-500 to-amber-600',
        lightColor: 'bg-orange-50 text-orange-700',
        borderColor: 'border-orange-200',
        sections: [
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
        ],
    },
    {
        id: 'refund',
        icon: RotateCcw,
        label: 'Return & Refund Policy',
        color: 'from-rose-600 to-pink-700',
        lightColor: 'bg-rose-50 text-rose-700',
        borderColor: 'border-rose-200',
        sections: [
            {
                icon: FileText,
                title: 'Nature of Services',
                description:
                    'All services are digital, therefore no physical return is applicable.',
            },
            {
                icon: CheckCircle2,
                title: 'Refund Conditions',
                description: 'Refunds may be approved only if:',
                items: [
                    'Payment deducted but service not activated',
                    "Technical failure from LOSODHAN's side",
                ],
            },
            {
                icon: AlertTriangle,
                title: 'Non-Refundable Cases',
                items: [
                    'Service already used',
                    'Wrong plan chosen by user',
                    'Account suspended due to policy violation',
                ],
            },
            {
                icon: Clock,
                title: 'Refund Timeline',
                description:
                    'Approved refunds are processed within 7–10 working days to the original payment method.',
                footer: 'Billing Support: billing@losodhan.com',
            },
        ],
    },
]

// ─── Sub-components ───────────────────────────────────────────────────────────

const SectionCard = ({ section, index }) => {
    const SectionIcon = section.icon
    return (
    <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.07 }}
        className="bg-white rounded-3xl border border-gray-100 shadow-md shadow-gray-100 p-7 flex flex-col gap-4"
    >
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center shrink-0">
                <SectionIcon size={18} className="text-[#1a3c8f]" />
            </div>
            <h3 className="font-black text-gray-900 text-base tracking-tight">{section.title}</h3>
        </div>

        {section.description && (
            <p className="text-gray-500 text-sm font-medium leading-relaxed">{section.description}</p>
        )}

        {section.items && (
            <ul className="space-y-2.5 mt-1">
                {section.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-gray-600 font-medium">
                        <span className="mt-1 w-1.5 h-1.5 rounded-full bg-[#1a3c8f] shrink-0" />
                        {item}
                    </li>
                ))}
            </ul>
        )}

        {section.footer && (
            <p className="text-xs font-black text-[#1a3c8f] uppercase tracking-widest mt-1 pt-4 border-t border-gray-50">
                {section.footer}
            </p>
        )}
    </motion.div>
    )
}

const PolicyAccordion = ({ policy, isOpen, onToggle }) => {
    const Icon = policy.icon
    return (
        <div className={`rounded-[2rem] border-2 ${isOpen ? policy.borderColor : 'border-gray-100'} bg-white shadow-sm overflow-hidden transition-all duration-300`}>
            {/* Header */}
            <button
                id={`policy-tab-${policy.id}`}
                onClick={onToggle}
                className="w-full flex items-center justify-between gap-4 px-8 py-6 text-left group"
            >
                <div className="flex items-center gap-5">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${policy.color} flex items-center justify-center shadow-lg`}>
                        <Icon size={20} className="text-white" />
                    </div>
                    <div>
                        <p className="font-black text-gray-900 text-lg tracking-tight">{policy.label}</p>
                        {policy.effectiveDate && (
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-0.5">
                                Effective: {policy.effectiveDate}
                            </p>
                        )}
                    </div>
                </div>
                <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.25 }}>
                    <ChevronDown size={20} className={`transition-colors ${isOpen ? 'text-[#1a3c8f]' : 'text-gray-400'}`} />
                </motion.div>
            </button>

            {/* Body */}
            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        key="content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: 'easeInOut' }}
                        className="overflow-hidden"
                    >
                        <div className="px-8 pb-8 grid grid-cols-1 md:grid-cols-2 gap-5 border-t border-gray-50 pt-6">
                            {policy.sections.map((section, i) => (
                                <SectionCard key={i} section={section} index={i} />
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

const PoliciesPage = () => {
    const [openId, setOpenId] = useState('privacy')

    const toggle = (id) => setOpenId(prev => prev === id ? null : id)

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            {/* ── Hero Banner ── */}
            <section className="relative bg-[#1a3c8f] py-20 px-4 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(96,165,250,0.15)_0%,_transparent_60%)]" />
                <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-400/10 rounded-full -ml-36 -mb-36 blur-3xl" />

                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="max-w-4xl mx-auto text-center relative z-10"
                >
                    <div className="inline-flex items-center gap-2 px-5 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white text-[10px] font-black uppercase tracking-[0.2em] mb-8">
                        <Sparkles size={12} className="text-blue-300" />
                        Official Platform Policies
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-white mb-5 leading-tight tracking-tighter">
                        Our Commitment<br />
                        <span className="text-blue-300">to Transparency</span>
                    </h1>
                    <p className="text-blue-100/70 text-base md:text-lg font-medium max-w-2xl mx-auto leading-relaxed">
                        LOSODHAN is built on trust. Read our policies to understand how we handle your data, set platform rules, and protect every user.
                    </p>
                </motion.div>
            </section>

            {/* ── Quick Nav Pills ── */}
            <section className="bg-white border-b border-gray-100 py-5 px-4 sticky top-0 z-40 shadow-sm">
                <div className="max-w-5xl mx-auto flex flex-wrap gap-3 justify-center">
                    {policies.map(p => {
                        const PIcon = p.icon
                        return (
                        <button
                            key={p.id}
                            onClick={() => {
                                setOpenId(p.id)
                                setTimeout(() => {
                                    document.getElementById(`policy-tab-${p.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                                }, 100)
                            }}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${
                                openId === p.id
                                    ? `bg-gradient-to-r ${p.color} text-white border-transparent shadow-lg`
                                    : 'text-gray-500 border-gray-200 hover:border-gray-400 bg-white'
                            }`}
                        >
                            <PIcon size={12} />
                            {p.label}
                        </button>
                        )
                    })}
                </div>
            </section>

            {/* ── Policies Accordion ── */}
            <main className="max-w-5xl mx-auto px-4 py-14 space-y-5">
                {policies.map(policy => (
                    <PolicyAccordion
                        key={policy.id}
                        policy={policy}
                        isOpen={openId === policy.id}
                        onToggle={() => toggle(policy.id)}
                    />
                ))}
            </main>

            {/* ── Contact Block ── */}
            <section className="bg-white border-t border-gray-100 py-16 px-4">
                <div className="max-w-5xl mx-auto">
                    <div className="bg-gradient-to-br from-[#1a3c8f] to-blue-800 rounded-[3rem] p-10 md:p-14 text-center relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl" />
                        <div className="relative z-10">
                            <h2 className="text-3xl font-black text-white tracking-tight mb-3">Get in Touch</h2>
                            <p className="text-blue-100/70 font-medium mb-10 max-w-lg mx-auto">
                                Have questions about our policies? Our team is ready to help you.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-5 justify-center">
                                <a
                                    href="mailto:support@losodhan.com"
                                    className="flex items-center justify-center gap-3 px-8 py-4 bg-white text-[#1a3c8f] rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-50 transition-all shadow-xl active:scale-95"
                                >
                                    <Mail size={16} />
                                    support@losodhan.com
                                </a>
                                <a
                                    href="mailto:billing@losodhan.com"
                                    className="flex items-center justify-center gap-3 px-8 py-4 bg-white/10 text-white border border-white/20 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-white/20 transition-all active:scale-95"
                                >
                                    <CreditCard size={16} />
                                    billing@losodhan.com
                                </a>
                            </div>
                            <p className="mt-8 text-blue-100/40 text-[10px] font-black uppercase tracking-widest">
                                Business Inquiries: info@losodhan.com
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Footer Strip ── */}
            <footer className="bg-gray-950 text-gray-600 py-8 px-4 text-center">
                <p className="text-[10px] font-black uppercase tracking-widest">
                    © {new Date().getFullYear()} LOSODHAN JOB PORTAL — All Rights Reserved
                </p>
                <div className="flex justify-center gap-6 mt-4">
                    <Link to="/" className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-gray-600 hover:text-blue-400 transition-colors">
                        <ArrowLeft size={11} /> Back to Home
                    </Link>
                </div>
            </footer>
        </div>
    )
}

export default PoliciesPage
