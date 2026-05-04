import { useNavigate, Link } from 'react-router-dom'
import { useState } from 'react'
import {
    MapPin,
    Phone,
    Mail,
    ShieldCheck,
    ChevronDown,
    ChevronUp,
    ArrowRight
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'

import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import logo from '../../assets/logo.png'
import banner2 from '../../assets/banner2.jpg'
import banner3 from '../../assets/banner3.jpg'
import banner4 from '../../assets/banner4.jpg'
import cardProdMgr from '../../assets/card_prod_mgr.png'
import cardTextileDesign from '../../assets/card_textile_design.png'
import cardMachineOp from '../../assets/card_machine_op.png'

const HomePage = () => {
    const navigate = useNavigate()
    const [openPolicy, setOpenPolicy] = useState(null)
    const [showAllPolicyMobile, setShowAllPolicyMobile] = useState(false)

    const ads = [
        { title: 'Production Manager', img: cardProdMgr },
        { title: 'Textile Designer', img: cardTextileDesign },
        { title: 'Machine Operator', img: cardMachineOp }
    ]

    const policies = [
        { id: 1, title: 'Information We Collect', content: 'We collect personal information that you provide to us, such as name, contact information, and professional details, to facilitate job matching.' },
        { id: 2, title: 'Purpose of Data Collection', content: 'Your data is used to provide and improve our services, connect you with recruiters, and send relevant job alerts.' },
        { id: 3, title: 'Data Sharing', content: 'We share your professional profile with recruiters and employers when you apply for a job or express interest in a role.' },
        { id: 4, title: 'Data Security', content: 'We implement industry-standard security measures to protect your data from unauthorized access or disclosure.' },
        { id: 5, title: 'User Control', content: 'You have the right to access, update, or delete your personal information at any time through your account settings.' }
    ]

    const sliderImages = [banner2, banner3, banner4]

    /* ─────────────────────────────────────────
       MOBILE LAYOUT  (h-screen, no scroll)
    ───────────────────────────────────────── */
    const MobileLayout = () => (
        <div className={`min-h-screen w-full bg-[#f8fafc] flex flex-col font-sans overflow-x-hidden md:hidden ${showAllPolicyMobile ? 'overflow-y-auto' : 'h-screen overflow-y-hidden'}`}>
            <Navbar />
            <main className="flex-1 flex flex-col pt-16 overflow-hidden">
                <div className="flex-1 flex flex-col gap-2 px-3 pt-2 pb-0.5 overflow-hidden justify-between">
                    {/* Banner (35% - Big Image) */}
                    <section className="h-[35%] w-full rounded-2xl overflow-hidden shadow-sm flex-shrink-0">
                        <Swiper modules={[Autoplay]} autoplay={{ delay: 5000 }} loop className="h-full w-full">
                            {sliderImages.map((img, i) => (
                                <SwiperSlide key={i}>
                                    <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${img})` }} />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </section>

                    {/* Ads (24%) */}
                    <section className="h-[24%] flex flex-col flex-shrink-0 overflow-hidden">
                        <p className="text-center text-[10px] font-black uppercase tracking-widest text-[#ff7a20] mb-0.5">ADS BANNERS</p>
                        <div className="flex-1">
                            <Swiper slidesPerView={3} spaceBetween={8} className="h-full">
                                {ads.map((ad, i) => (
                                    <SwiperSlide key={i} className="h-full">
                                        <div className="bg-white rounded-xl h-full flex flex-col p-2 shadow-sm border border-slate-100">
                                            <div className="flex-1 rounded-lg overflow-hidden mb-1">
                                                <img src={ad.img} alt={ad.title} className="w-full h-full object-cover" />
                                            </div>
                                            <p className="text-[7px] font-black text-slate-800 text-center uppercase truncate leading-none mb-1">{ad.title}</p>
                                            <button onClick={() => navigate('/login')} className="bg-[#ff7a20] text-white py-1 rounded text-[7px] font-bold w-full uppercase">View</button>
                                        </div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </div>
                    </section>

                    {/* Login (10.5%) */}
                    <section className="h-[10.5%] flex items-center justify-center flex-shrink-0">
                        <button onClick={() => navigate('/login')} className="bg-[#ff7a20] text-white w-full h-11 rounded-2xl text-base font-black uppercase tracking-[0.1em] shadow-lg border-b-4 border-[#cc5d14]">
                            LOGIN NOW
                        </button>
                    </section>

                    {/* Privacy (10.5%) */}
                    <section className="h-[10.5%] bg-white rounded-2xl px-4 flex flex-col justify-center flex-shrink-0 shadow-sm border border-slate-100">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <ShieldCheck size={14} className="text-[#ff7a20]" />
                                <p className="text-[10px] font-black text-slate-800 uppercase">Privacy Policy</p>
                            </div>
                            <button onClick={() => setShowAllPolicyMobile(true)} className="text-[10px] font-black text-[#ff7a20] border-l border-slate-100 pl-3">View All</button>
                        </div>
                        <div className="grid grid-cols-2 gap-2 mt-1">
                            {policies.slice(0, 2).map(p => (
                                <p key={p.id} className="text-[8px] font-bold text-slate-500 truncate">• {p.title}</p>
                            ))}
                        </div>

                        {/* Overlay */}
                        <AnimatePresence>
                            {showAllPolicyMobile && (
                                <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }}
                                    className="fixed inset-0 bg-white z-[999] flex flex-col p-5 pt-16">
                                    <div className="flex justify-between items-center mb-4 border-b pb-3">
                                        <h4 className="text-sm font-black text-slate-800 uppercase flex items-center gap-2"><ShieldCheck size={16} className="text-[#ff7a20]" /> Privacy Policy</h4>
                                        <button onClick={() => setShowAllPolicyMobile(false)} className="bg-slate-100 px-3 py-1 rounded-full text-xs font-black">Close</button>
                                    </div>
                                    <div className="flex-1 space-y-3 overflow-y-auto custom-scrollbar">
                                        {policies.map(p => (
                                            <div key={p.id} className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                                <p className="text-[11px] font-black text-[#ff7a20] uppercase mb-1">{p.title}</p>
                                                <p className="text-[11px] text-slate-600 font-bold leading-relaxed">{p.content}</p>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </section>
                </div>

                {/* Footer - Perfectly at bottom (20%) */}
                <section className="h-[20%] bg-[#1e293b] px-5 pt-3 pb-2 text-white flex flex-col justify-between overflow-hidden shadow-[0_-5px_20px_rgba(0,0,0,0.1)] flex-shrink-0 w-full">
                    <div className="grid grid-cols-3 gap-3">
                        <div className="space-y-0.5">
                            <h5 className="text-[9px] font-black uppercase text-[#ff7a20] mb-0.5 border-b border-slate-700 pb-0.5">Links</h5>
                            <ul className="text-[7px] font-bold text-slate-400 space-y-0.5"><li>Home</li><li>About</li><li>Jobs</li><li>Contact</li></ul>
                        </div>
                        <div className="space-y-0.5">
                            <h5 className="text-[9px] font-black uppercase text-[#ff7a20] mb-0.5 border-b border-slate-700 pb-0.5">Legal</h5>
                            <ul className="text-[7px] font-bold text-slate-400 space-y-0.5"><li>Privacy</li><li>Terms</li><li>Refund</li><li>Payment</li></ul>
                        </div>
                        <div className="space-y-0.5">
                            <h5 className="text-[9px] font-black uppercase text-[#ff7a20] mb-0.5 border-b border-slate-700 pb-0.5">Reach Us</h5>
                            <div className="space-y-0.5 text-[6px] font-bold text-slate-300">
                                <p className="flex items-start gap-1"><MapPin size={7} className="text-[#ff7a20] mt-0.5 flex-shrink-0" /> Pandesara, Surat</p>
                                <p className="flex items-center gap-1"><Phone size={7} className="text-[#ff7a20]" /> +91 8511952831</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center justify-between border-t border-slate-800 pt-1.5">
                        <img src={logo} alt="Losodhan" className="h-4 object-contain opacity-90" />
                        <p className="text-[8px] font-black tracking-widest text-[#ff7a20] uppercase">LOSODHAN © 2026</p>
                    </div>
                </section>
            </main>

            <style dangerouslySetInnerHTML={{ __html: `.custom-scrollbar::-webkit-scrollbar{width:4px}.custom-scrollbar::-webkit-scrollbar-thumb{background:#ff7a20;border-radius:10px}` }} />
        </div>
    )

    /* ─────────────────────────────────────────
       DESKTOP LAYOUT  (full page, scrollable)
    ───────────────────────────────────────── */
    const DesktopLayout = () => (
        <div className="min-h-screen bg-[#f0f4f8] font-sans hidden md:flex flex-col">
            <Navbar />

            {/* Hero Banner (75vh for Big Display) */}
            <section className="w-full h-[75vh] mt-20 overflow-hidden">
                <Swiper modules={[Autoplay, Pagination]} autoplay={{ delay: 5000 }} pagination={{ clickable: true }} loop className="h-full w-full">
                    {sliderImages.map((img, i) => (
                        <SwiperSlide key={i}>
                            <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${img})` }} />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </section>

            {/* Ads */}
            <section className="py-16 px-6 bg-[#f0f4f8] max-w-7xl mx-auto w-full">
                <h2 className="text-center text-4xl font-black mb-12 tracking-tight">
                    ADS <span className="text-[#ff7a20]">BANNERS</span>
                </h2>
                <div className="grid grid-cols-3 gap-8">
                    {ads.map((ad, i) => (
                        <div key={i} className="bg-[#e8ecf0] rounded-2xl overflow-hidden shadow-md flex flex-col p-4 hover:shadow-xl transition-shadow border border-white/60">
                            <div className="aspect-[4/3] rounded-xl overflow-hidden mb-5 shadow-inner">
                                <img src={ad.img} alt={ad.title} className="w-full h-full object-cover" />
                            </div>
                            <h3 className="text-xl font-black text-slate-800 text-center mb-5">{ad.title}</h3>
                            <button onClick={() => navigate('/login')} className="bg-[#ff7a20] text-white py-3 rounded-full font-bold flex items-center justify-center gap-2 shadow-md hover:bg-orange-600 transition-colors">
                                View All Details <ArrowRight size={18} />
                            </button>
                        </div>
                    ))}
                </div>
            </section>

            {/* Login Now */}
            <section className="py-12 flex justify-center bg-[#f0f4f8]">
                <button onClick={() => navigate('/login')}
                    className="bg-[#ff7a20] text-white px-24 py-5 rounded-full text-3xl font-black uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all border-b-4 border-[#cc5d14]">
                    LOGIN NOW
                </button>
            </section>

            {/* Privacy Policy */}
            <section className="py-16 px-6 bg-[#f0f4f8] max-w-5xl mx-auto w-full">
                <h2 className="text-center text-4xl font-black mb-10">
                    Privacy <span className="text-[#ff7a20]">Policy</span>
                </h2>
                <div className="space-y-3">
                    {policies.map(p => (
                        <div key={p.id} className="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-100">
                            <button onClick={() => setOpenPolicy(openPolicy === p.id ? null : p.id)}
                                className="w-full flex items-center justify-between px-6 py-4 text-left font-bold text-slate-700 hover:bg-slate-50 transition-colors text-base">
                                {p.title}
                                {openPolicy === p.id ? <ChevronUp size={20} className="text-[#ff7a20]" /> : <ChevronDown size={20} className="text-[#ff7a20]" />}
                            </button>
                            <AnimatePresence>
                                {openPolicy === p.id && (
                                    <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                                        <p className="px-6 pb-5 text-slate-500 text-sm leading-relaxed border-t border-slate-50">{p.content}</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            </section>

            {/* Footer */}
            <Footer />
        </div>
    )

    return (
        <>
            <MobileLayout />
            <DesktopLayout />
        </>
    )
}

export default HomePage
