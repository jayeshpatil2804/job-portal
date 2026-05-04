import { Link } from 'react-router-dom'
import { MapPin, Phone, Mail } from 'lucide-react'
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
            { label: 'Privacy Policy', path: '/policies' },
            { label: 'Terms of Use', path: '/terms' },
            { label: 'Data Collection Policy', path: '/data-policy' },
            { label: 'Payment Policy', path: '/payment-policy' },
            { label: 'Return & Refund Policy', path: '/refund-policy' },
        ],
        segments: [
            { label: 'Manufacturing', path: '/jobs?cat=manufacturing' },
            { label: 'Fashion Design', path: '/jobs?cat=design' },
            { label: 'Textile Production', path: '/jobs?cat=production' },
            { label: 'Quality Control', path: '/jobs?cat=quality' },
        ]
    }

    return (
        <footer className="bg-[#e5e7eb] py-16 px-6 md:px-12 border-t border-slate-300 w-full">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-12 text-center sm:text-left">
                    {/* Logo & Info */}
                    <div className="space-y-8 flex flex-col items-center sm:items-start lg:col-span-1">
                        <img src={logo} alt="LOSODHAN" className="h-12 w-auto" />
                        <p className="text-slate-500 text-sm font-medium leading-relaxed">
                            India's first dedicated platform designed exclusively for the Textile Industry. Connecting world-class talent with industry-leading manufacturers.
                        </p>
                    </div>

                    {/* Navigation */}
                    <div className="flex flex-col items-center sm:items-start">
                        <h4 className="font-black text-slate-800 mb-6 text-xl tracking-tight uppercase border-b-2 border-[#ff7a20] pb-1 inline-block">Navigation</h4>
                        <ul className="space-y-4 text-base font-bold text-slate-600">
                            {footerLinks.explore.map((link) => (
                                <li key={link.label}>
                                    <Link to={link.path} className="hover:text-[#ff7a20] transition-colors">{link.label}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Segments */}
                    <div className="flex flex-col items-center sm:items-start">
                        <h4 className="font-black text-slate-800 mb-6 text-xl tracking-tight uppercase border-b-2 border-[#ff7a20] pb-1 inline-block">Segments</h4>
                        <ul className="space-y-4 text-base font-bold text-slate-600">
                            {footerLinks.segments.map((link) => (
                                <li key={link.label}>
                                    <Link to={link.path} className="hover:text-[#ff7a20] transition-colors">{link.label}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Resources */}
                    <div className="flex flex-col items-center sm:items-start">
                        <h4 className="font-black text-slate-800 mb-6 text-xl tracking-tight uppercase border-b-2 border-[#ff7a20] pb-1 inline-block">Resources</h4>
                        <ul className="space-y-4 text-base font-bold text-slate-600">
                            {footerLinks.resources.map((link) => (
                                <li key={link.label}>
                                    <Link to={link.path} className="hover:text-[#ff7a20] transition-colors">{link.label}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Direct Contact */}
                    <div className="flex flex-col items-center sm:items-start">
                        <h4 className="font-black text-slate-800 mb-6 text-xl tracking-tight uppercase border-b-2 border-[#ff7a20] pb-1 inline-block">Direct Contact</h4>
                        <ul className="space-y-6 w-full">
                            <li className="flex items-center gap-4 justify-center sm:justify-start">
                                <div className="p-3 bg-[#ff7a20] rounded-full text-white shadow-lg flex-shrink-0">
                                    <MapPin size={20} />
                                </div>
                                <div className="text-sm">
                                    <p className="font-black text-slate-800 uppercase tracking-tighter">Address</p>
                                    <p className="text-slate-600 font-bold">Pandesara, Surat, GJ, India</p>
                                </div>
                            </li>
                            <li className="flex items-center gap-4 justify-center sm:justify-start">
                                <div className="p-3 bg-[#ff7a20] rounded-full text-white shadow-lg flex-shrink-0">
                                    <Phone size={20} />
                                </div>
                                <div className="text-sm">
                                    <p className="font-black text-slate-800 uppercase tracking-tighter">Direct Line</p>
                                    <p className="text-slate-600 font-bold">+91-8511952831</p>
                                </div>
                            </li>
                            <li className="flex items-center gap-4 justify-center sm:justify-start">
                                <div className="p-3 bg-[#ff7a20] rounded-full text-white shadow-lg flex-shrink-0">
                                    <Mail size={20} />
                                </div>
                                <div className="text-sm">
                                    <p className="font-black text-slate-800 uppercase tracking-tighter">Official Inquiry</p>
                                    <p className="text-slate-600 font-bold">info@losodhan.com</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-16 pt-8 border-t border-slate-300 text-center">
                    <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">
                        © {currentYear} LOSODHAN — Your Textile Job Partner.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
