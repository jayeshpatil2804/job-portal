import { motion } from 'framer-motion'
import { Target, Users, Globe, Award, Sparkles, Building2, ShieldCheck, Zap, ArrowRight, CheckCircle2 } from 'lucide-react'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import { Link } from 'react-router-dom'

const AboutPage = () => {
    return (
        <div className="min-h-screen bg-[#f8fafc] flex flex-col font-sans selection:bg-primary-100 selection:text-primary-900">
            <Navbar />

            {/* ── Hero Section ── */}
            <section className="relative min-h-[60vh] flex items-center justify-center pt-32 pb-20 px-4 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-slate-950 z-10 opacity-90" />
                    <div className="absolute inset-0 hero-mesh opacity-30 z-10" />
                    <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                </div>
                
                <div className="max-w-7xl mx-auto text-center relative z-20 w-full">
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="inline-flex items-center gap-2 px-5 py-2 glass-effect-dark text-blue-100 rounded-full text-[10px] md:text-xs font-bold mb-10 tracking-[0.2em] uppercase border border-white/10">
                            About LOSODHAN
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black text-white mb-8 leading-[1.1] tracking-tighter">
                            Dedicated to the <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">
                                Textile Industry
                            </span>
                        </h1>
                        <p className="text-slate-400 text-lg md:text-xl mb-12 max-w-3xl mx-auto leading-relaxed font-medium">
                            Welcome to Losodhan, a specialized platform that connects textile companies, factories, and businesses with skilled workers, professionals, and job seekers within the textile sector.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* ── Our Story & Mission ── */}
            <section className="py-32 px-4 bg-white relative overflow-hidden">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    <motion.div 
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="space-y-8"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-primary-900 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] border border-blue-100">
                            Our Mission
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                            Simplifying <span className="text-blue-400">Hiring</span> in Textiles.
                        </h2>
                        <p className="text-slate-500 text-lg font-medium leading-relaxed">
                            Unlike general job portals, Losodhan is built only for the textile industry, making it easier for employers to find the right talent and for job seekers to discover relevant opportunities without unnecessary distractions.
                        </p>
                        <p className="text-slate-500 text-lg font-medium leading-relaxed">
                            Our mission is to create a powerful and reliable platform that bridges the gap between textile employers and job seekers, streamlines the hiring process, and fosters growth across India's vibrant textile landscape.
                        </p>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 text-slate-600 font-bold text-sm">
                            {[
                                "Garment Manufacturing",
                                "Textile Production & Processing",
                                "Fashion Designing",
                                "Quality Control & Supervision",
                                "Machine Operators & Skilled Labor",
                                "Sales & Marketing in Textile Sector"
                            ].map((item) => (
                                <div key={item} className="flex items-center gap-2">
                                    <CheckCircle2 size={18} className="text-blue-500 shrink-0" />
                                    {item}
                                </div>
                            ))}
                        </div>
                    </motion.div>
                    
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="relative"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-[3rem] rotate-3 opacity-10" />
                        <div className="relative bg-white rounded-[3rem] p-12 border border-slate-100 shadow-2xl space-y-10">
                            <div className="flex gap-6 items-start">
                                <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center shrink-0">
                                    <Target className="text-primary-900" size={24} />
                                </div>
                                <div>
                                    <h3 className="font-black text-slate-900 text-xl tracking-tight mb-2 uppercase">The Mission</h3>
                                    <p className="text-slate-500 font-medium leading-relaxed">To create a powerful and reliable platform that bridges the gap between textile employers and job seekers.</p>
                                </div>
                            </div>
                            <div className="flex gap-6 items-start">
                                <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center shrink-0">
                                    <Globe className="text-indigo-600" size={24} />
                                </div>
                               <div>
                                    <h3 className="font-black text-slate-900 text-xl tracking-tight mb-2 uppercase">The Vision</h3>
                                    <p className="text-slate-500 font-medium leading-relaxed">To become India’s leading job portal dedicated exclusively to the textile industry.</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ── Why Choose Us ── */}
            <section className="bg-slate-50 py-32 px-4 border-y border-slate-100">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-24">
                        <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-5 leading-tight">
                            Why Choose <span className="text-primary-900">Losodhan?</span>
                        </h2>
                        <p className="text-slate-500 text-lg font-medium max-w-2xl mx-auto">
                            We aim to empower the textile ecosystem by making hiring simple, fast, and effective.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                        {[
                            { title: "Industry-specific", desc: "Built only for textile professionals and businesses." },
                            { title: "Easy Job Posting", desc: "Streamlined process for employers to find talent quickly." },
                            { title: "Targeted Search", desc: "Find highly relevant textile opportunities without distractions." },
                            { title: "Faster Hiring", desc: "Accelerating the connection between talent and industry." },
                            { title: "Focused Network", desc: "India's premier network for textile manufacturing and design." }
                        ].map((v, i) => (
                            <motion.div
                                key={v.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                viewport={{ once: true }}
                                className="bg-white p-8 rounded-3xl border border-slate-100 shadow-lg shadow-slate-200/50 hover-lift group text-center"
                            >
                                <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center mb-6 border border-slate-100 group-hover:bg-primary-900 group-hover:text-white transition-all duration-300 mx-auto">
                                    <Award size={20} />
                                </div>
                                <h3 className="font-black text-slate-900 text-sm mb-3 tracking-tight uppercase">{v.title}</h3>
                                <p className="text-slate-500 font-medium leading-relaxed text-[11px]">{v.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CTA ── */}
            <section className="py-24 px-4 bg-primary-900 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-navy-800 to-primary-900 opacity-90 z-0" />
                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <h2 className="text-3xl md:text-5xl font-black text-white mb-10 tracking-tight leading-tight uppercase">
                        Connecting Talent with <br /> Textile Industry
                    </h2>
                    <div className="flex flex-col sm:flex-row gap-6 justify-center">
                        <Link to="/signup" className="bg-white text-primary-900 px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-blue-50 transition-all active:scale-95 shadow-2xl">
                            Join the Network
                        </Link>
                        <Link to="/contact" className="px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] text-white border-2 border-white/20 hover:bg-white/10 transition-all active:scale-95">
                            Contact Us <ArrowRight size={16} className="inline ml-2" />
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    )
}

export default AboutPage
