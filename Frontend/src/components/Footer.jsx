import { Link } from 'react-router-dom'
import { Mail, MapPin, Phone, Linkedin, Instagram, Facebook, ArrowRight, Sparkles, Building2, UserCircle, Briefcase, ExternalLink, Lock } from 'lucide-react'
import logo from '../assets/logo.png'

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const footerLinks = {
        explore: [
            { label: 'Home', path: '/' },
            { label: 'About Us', path: '/about' },
            { label: 'Latest Jobs', path: '/jobs' },
            { label: 'Contact Us', path: '/contact' },
        ],
        resources: [
            { label: 'Privacy Policy', path: '/policies#privacy' },
            { label: 'Terms of Use', path: '/policies#terms' },
            { label: 'Support Center', path: '/contact' },
            { label: 'Help Desk', path: '/contact' },
        ],
        segments: [
            { label: 'Manufacturing', path: '/jobs?category=manufacturing' },
            { label: 'Fashion Design', path: '/jobs?category=design' },
            { label: 'Textile Production', path: '/jobs?category=production' },
            { label: 'Quality Control', path: '/jobs?category=quality' },
        ]
    }

    return (
        <footer className="relative bg-[#0a0f1c] text-slate-400 pt-24 pb-12 overflow-hidden border-t border-white/5">
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-600/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                {/* ── Main Footer Header ── */}
                <div className="flex flex-col lg:flex-row justify-between items-start gap-12 pb-16 border-b border-white/5 mb-20">
                    <div className="max-w-md space-y-8">
                        <Link to="/" className="inline-block transform hover:scale-105 transition-transform duration-300">
                            <span className="text-white font-black text-3xl tracking-tighter uppercase flex items-center gap-3">
                                <span className="p-2 bg-primary-900 rounded-xl shadow-lg shadow-primary-900/40">
                                    <Sparkles size={24} className="text-white" />
                                </span>
                                LOSO<span className="text-blue-500">DHAN</span>
                            </span>
                        </Link>
                        <p className="text-slate-400 font-medium leading-relaxed">
                            India's first dedicated platform designed exclusively for the <span className="text-white font-bold italic">Textile Industry</span>. Connecting world-class talent with industry-leading manufacturers and design houses.
                        </p>
                        <div className="flex items-center gap-5">
                            {[
                                { icon: <Instagram size={20} />, label: 'Instagram' },
                                { icon: <Linkedin size={20} />, label: 'LinkedIn' },
                                { icon: <Facebook size={20} />, label: 'Facebook' }
                            ].map((social) => (
                                <a
                                    key={social.label}
                                    href="#"
                                    className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-primary-900 hover:text-white transition-all duration-300 border border-white/10 group"
                                    aria-label={social.label}
                                >
                                    <span className="group-hover:scale-110 transition-transform">{social.icon}</span>
                                </a>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-6 w-full lg:w-auto">
                        <div className="p-8 bg-white/5 rounded-3xl border border-white/10 glass-effect-dark w-full sm:w-[280px]">
                            <Building2 className="text-blue-500 mb-4" size={24} />
                            <h4 className="text-white font-black text-xs uppercase tracking-widest mb-2">For Employers</h4>
                            <p className="text-[11px] mb-6">Find specialized textile talent faster with focused candidate filtering.</p>
                            <Link to="/recruiter/login" className="text-[10px] font-bold text-white flex items-center gap-2 hover:gap-3 transition-all uppercase tracking-widest">
                                Recruit Now <ArrowRight size={14} />
                            </Link>
                        </div>
                        <div className="p-8 bg-white/5 rounded-3xl border border-white/10 glass-effect-dark w-full sm:w-[280px]">
                            <UserCircle className="text-indigo-500 mb-4" size={24} />
                            <h4 className="text-white font-black text-xs uppercase tracking-widest mb-2">For Candidates</h4>
                            <p className="text-[11px] mb-6">Explore the best textile job opportunities across all industry segments.</p>
                            <Link to="/candidate/login" className="text-[10px] font-bold text-white flex items-center gap-2 hover:gap-3 transition-all uppercase tracking-widest">
                                Discover Jobs <ArrowRight size={14} />
                            </Link>
                        </div>
                    </div>
                </div>

                {/* ── Footer Navigation ── */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 xl:gap-24 mb-20 text-center sm:text-left">
                    <div>
                        <h4 className="text-white font-black text-xs uppercase tracking-[0.2em] mb-8">Navigation</h4>
                        <ul className="space-y-4">
                            {footerLinks.explore.map((link) => (
                                <li key={link.label}>
                                    <Link to={link.path} className="text-sm font-medium hover:text-blue-400 transition-colors duration-300">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white font-black text-xs uppercase tracking-[0.2em] mb-8">Segments</h4>
                        <ul className="space-y-4">
                            {footerLinks.segments.map((link) => (
                                <li key={link.label}>
                                    <Link to={link.path} className="text-sm font-medium hover:text-blue-400 transition-colors duration-300">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white font-black text-xs uppercase tracking-[0.2em] mb-8">Resources</h4>
                        <ul className="space-y-4">
                            {footerLinks.resources.map((link) => (
                                <li key={link.label}>
                                    <Link to={link.path} className="text-sm font-medium hover:text-blue-400 transition-colors duration-300">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="col-span-2 lg:col-span-1 border-t lg:border-t-0 border-white/5 pt-12 lg:pt-0">
                        <h4 className="text-white font-black text-xs uppercase tracking-[0.2em] mb-8">Direct Contact</h4>
                        <ul className="space-y-6">
                            <li className="flex items-start gap-4 justify-center sm:justify-start">
                                <div className="p-3 bg-white/5 rounded-xl border border-white/10 shrink-0">
                                    <MapPin size={18} className="text-blue-500" />
                                </div>
                                <div>
                                    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">HQ Address</p>
                                    <p className="text-slate-300 text-sm font-semibold">Pandesara, Surat, GJ, India</p>
                                </div>
                            </li>
                            <li className="flex items-start gap-4 justify-center sm:justify-start">
                                <div className="p-3 bg-white/5 rounded-xl border border-white/10 shrink-0">
                                    <Phone size={18} className="text-blue-500" />
                                </div>
                                <div>
                                    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">Direct Line</p>
                                    <p className="text-slate-300 text-sm font-semibold hover:text-blue-400 transition-colors">+91-8511952831</p>
                                </div>
                            </li>
                            <li className="flex items-start gap-4 justify-center sm:justify-start">
                                <div className="p-3 bg-white/5 rounded-xl border border-white/10 shrink-0">
                                    <Mail size={18} className="text-blue-500" />
                                </div>
                                <div>
                                    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">Official Inquiry</p>
                                    <p className="text-slate-300 text-sm font-semibold hover:text-blue-400 transition-colors">info@losodhan.com</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* ── Sub Footer ── */}
                <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
                    <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500">
                        © {currentYear} LOSODHAN — Your Textile Job Partner. <span className="hidden sm:inline">Engineered for professional growth.</span>
                    </p>

                    <div className="flex flex-wrap justify-center gap-8">
                        <Link to="/policies#privacy" className="text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors">Privacy</Link>
                        <Link to="/policies#terms" className="text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors">Terms</Link>
                        <Link to="/contact" className="text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors">Cookies</Link>
                        <a href="https://losodhan.com" className="text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors flex items-center gap-1">Website <ExternalLink size={10} /></a>
                        <Link to="/auth/admin/secure/login" className="opacity-1 hover:opacity-10 transition-opacity bg-transparent p-1" title="Portal">
                            <Lock size={10} className="text-slate-700" />
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
