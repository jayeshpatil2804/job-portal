import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, KeyRound, MessageCircle, Phone, ArrowRight, Loader2, LogOut, MessageSquare } from 'lucide-react';
import { verifyCandidateOtp, verifyRecruiterOtp, logoutCandidate, logoutRecruiter } from '../redux/actions/authActions';
import toast from 'react-hot-toast';
import { useLocation } from 'react-router-dom';

const VerificationOverlay = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const { user } = useSelector(state => state.auth);
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [loading, setLoading] = useState(false);

    // Only show for unverified Candidate or Recruiter
    const isUnverifiedCandidate = user?.role === 'CANDIDATE' && !user?.isVerified;
    const isUnverifiedRecruiter = user?.role === 'RECRUITER' && user?.verificationStatus !== 'APPROVED';

    // Don't show on profile page as per flow: "only access the profile page when the otp is not verified"
    // Also don't show on auth pages to avoid double UI
    const isExcludedPage = 
        location.pathname.includes('/profile') || 
        location.pathname.includes('/verify-otp') || 
        location.pathname.includes('/login') || 
        location.pathname.includes('/signup');

    if (isExcludedPage || (!isUnverifiedCandidate && !isUnverifiedRecruiter)) return null;

    const handleChange = (element, index) => {
        if (isNaN(element.value)) return false;
        const newOtp = [...otp];
        newOtp[index] = element.value;
        setOtp(newOtp);

        if (element.nextSibling && element.value !== '') {
            element.nextSibling.focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace') {
            if (otp[index] === '' && e.target.previousSibling) {
                e.target.previousSibling.focus();
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const otpCode = otp.join('');
        if (otpCode.length < 6) {
            toast.error('Please enter complete 6-digit OTP');
            return;
        }

        setLoading(true);
        try {
            if (user.role === 'CANDIDATE') {
                await dispatch(verifyCandidateOtp({ email: user.email, otp: otpCode })).unwrap();
            } else {
                await dispatch(verifyRecruiterOtp({ workEmail: user.email, otp: otpCode })).unwrap();
            }
            toast.success('Account verified successfully!');
        } catch (error) {
            toast.error(error.message || 'Verification failed. Please contact Admin.');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        if (user.role === 'CANDIDATE') {
            dispatch(logoutCandidate());
        } else {
            dispatch(logoutRecruiter());
        }
    };

    const whatsappLink = "https://wa.me/918140411130?text=Hello%20Admin,%20I%20just%20signed%20up%20on%20Losodhan%20Portal.%20Please%20provide%20my%20OTP%20for%20email:%20" + encodeURIComponent(user?.email || '');

    return (
        <AnimatePresence>
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/95 backdrop-blur-xl p-4 overflow-y-auto"
            >
                <motion.div 
                    initial={{ scale: 0.9, opacity: 0, y: 40 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    className="bg-white w-full max-w-lg rounded-[3rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.3)] border border-white/20 overflow-hidden"
                >
                    {/* Header */}
                    <div className="bg-[#1a3c8f] p-10 text-center text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-400/20 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24 blur-2xl"></div>
                        
                        <div className="relative z-10">
                            <div className="w-24 h-24 bg-white/10 backdrop-blur-2xl rounded-[2.5rem] flex items-center justify-center mx-auto mb-6 border border-white/20 shadow-2xl ring-8 ring-white/5">
                                <ShieldAlert size={48} className="text-blue-200" />
                            </div>
                            <h2 className="text-4xl font-black tracking-tighter mb-3">Verify Access</h2>
                            <p className="text-blue-100/70 text-sm font-bold uppercase tracking-widest">Pending Admin Approval</p>
                        </div>
                    </div>

                    <div className="p-10 space-y-10">
                        {/* Status Message */}
                        <div className="bg-slate-50 rounded-[2rem] p-8 border border-slate-100 flex items-start gap-6 relative group">
                            <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center shrink-0 border border-slate-100 group-hover:scale-110 transition-transform">
                                <KeyRound size={28} className="text-[#1a3c8f]" />
                            </div>
                            <div className="space-y-2">
                                <p className="text-xs font-black text-[#1a3c8f] uppercase tracking-[0.2em]">Security Check</p>
                                <p className="text-slate-500 text-sm font-medium leading-relaxed">
                                    To access all features, please enter the <span className="text-slate-900 font-black">6-digit verification code</span> provided by our administration team.
                                </p>
                            </div>
                        </div>

                        {/* OTP Input */}
                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="flex justify-between gap-3 sm:gap-4">
                                {otp.map((data, index) => (
                                    <input
                                        key={index}
                                        type="text"
                                        maxLength="1"
                                        value={data}
                                        onChange={(e) => handleChange(e.target, index)}
                                        onKeyDown={(e) => handleKeyDown(e, index)}
                                        className="w-full h-16 sm:h-20 text-center text-3xl font-black bg-slate-50 border-2 border-transparent focus:border-[#1a3c8f] focus:bg-white rounded-2xl outline-none transition-all shadow-inner text-[#1a3c8f]"
                                    />
                                ))}
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-[#1a3c8f] hover:bg-blue-800 text-white py-6 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-4 shadow-2xl shadow-blue-900/20 transition-all active:scale-95 disabled:opacity-50 disabled:scale-100"
                            >
                                {loading ? <Loader2 className="animate-spin" size={24} /> : (
                                    <>
                                        Verify & Unlock Features
                                        <ArrowRight size={20} />
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Support Options */}
                        <div className="space-y-6">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
                                <div className="relative flex justify-center"><span className="bg-white px-6 text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">Need Assistance?</span></div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <a 
                                    href={whatsappLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group flex flex-col items-center justify-center gap-3 p-6 bg-green-50 text-green-700 rounded-3xl font-black text-[10px] uppercase tracking-widest hover:bg-green-100 transition-all border border-green-100 active:scale-95"
                                >
                                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                                        <MessageSquare size={24} />
                                    </div>
                                    WhatsApp Admin
                                </a>
                                <a 
                                    href="tel:+918140411130"
                                    className="group flex flex-col items-center justify-center gap-3 p-6 bg-blue-50 text-[#1a3c8f] rounded-3xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-100 transition-all border border-blue-100 active:scale-95"
                                >
                                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                                        <Phone size={24} />
                                    </div>
                                    Call Support
                                </a>
                            </div>
                        </div>

                        {/* Footer Action */}
                        <div className="pt-6 flex justify-center">
                            <button 
                                onClick={handleLogout}
                                className="text-slate-300 hover:text-red-500 font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-3 transition-colors"
                            >
                                <LogOut size={16} />
                                Sign out of account
                            </button>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default VerificationOverlay;
