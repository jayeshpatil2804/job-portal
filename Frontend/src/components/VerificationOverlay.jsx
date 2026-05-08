import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, KeyRound, MessageCircle, Phone, ArrowRight, Loader2, LogOut, MessageSquare, AlertCircle, X } from 'lucide-react';
import { verifyCandidateOtp, verifyRecruiterOtp, logoutCandidate, logoutRecruiter } from '../redux/actions/authActions';
import toast from 'react-hot-toast';
import { useLocation, useNavigate } from 'react-router-dom';

const VerificationOverlay = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useSelector(state => state.auth);
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [loading, setLoading] = useState(false);
    const inputRefs = useRef([]);

    // Only show for unverified Candidate or Recruiter
    const isUnverifiedCandidate = user?.role === 'CANDIDATE' && !user?.isVerified;
    const isUnverifiedRecruiter = user?.role === 'RECRUITER' && user?.verificationStatus !== 'APPROVED';

    // Don't show on profile page or auth pages
    const isExcludedPage = 
        location.pathname === '/profile' || 
        location.pathname === '/recruiter/profile' ||
        location.pathname.includes('/verify-otp') || 
        location.pathname.includes('/login') || 
        location.pathname.includes('/signup') ||
        location.pathname === '/';

    if (isExcludedPage || (!isUnverifiedCandidate && !isUnverifiedRecruiter)) return null;

    const handleChange = (value, index) => {
        if (isNaN(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value.substring(value.length - 1);
        setOtp(newOtp);

        if (value && index < 5) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const data = e.clipboardData.getData('text').slice(0, 6);
        if (/^\d+$/.test(data)) {
            const newOtp = [...otp];
            data.split('').forEach((char, i) => {
                if (i < 6) newOtp[i] = char;
            });
            setOtp(newOtp);
            if (data.length === 6) {
                inputRefs.current[5].focus();
            } else {
                inputRefs.current[data.length].focus();
            }
        }
    };

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
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
        navigate('/login');
    };

    const handleClose = () => {
        navigate(user.role === 'CANDIDATE' ? '/profile' : '/recruiter/profile');
    };

    const whatsappLink = `https://wa.me/918140411130?text=Hello Admin, I just signed up on Losodhan Portal. Please provide my OTP for account: ${user?.email}`;

    return (
        <AnimatePresence>
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[9999] w-full h-full flex items-center justify-center bg-slate-900/40 backdrop-blur-[12px] p-4 sm:p-6"
            >
                <motion.div 
                    initial={{ scale: 0.9, opacity: 0, y: 30 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    className="bg-white/95 backdrop-blur-md w-full max-w-[360px] max-h-[520px] rounded-[2rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] border border-white/50 overflow-hidden relative flex flex-col"
                >
                    {/* Close Button */}
                    <button 
                        onClick={handleClose}
                        className="absolute top-4 right-4 z-20 p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-full transition-all group active:scale-90"
                    >
                        <X size={16} className="group-hover:rotate-90 transition-transform" />
                    </button>

                    {/* Header with gradient - Smaller height */}
                    <div className="bg-gradient-to-br from-[#1a3c8f] to-[#2563eb] p-6 pt-8 text-center text-white shrink-0">
                        <div className="w-12 h-12 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center mx-auto mb-3 border border-white/30 shadow-2xl ring-4 ring-white/10">
                            <ShieldCheck size={24} className="text-white" />
                        </div>
                        <h2 className="text-lg font-black tracking-tight mb-0.5 uppercase">Verify Access</h2>
                        <p className="text-blue-100/60 text-[9px] font-black uppercase tracking-[0.2em]">Restricted Area</p>
                    </div>

                    <div className="p-6 space-y-5 overflow-y-auto custom-scrollbar">
                        <div className="text-center">
                            <p className="text-slate-500 text-[10px] font-bold leading-relaxed uppercase tracking-wide">
                                Enter the <span className="text-[#1a3c8f]">verification code</span> to continue
                            </p>
                        </div>

                        {/* OTP Input - Compact */}
                        <div className="flex justify-between gap-1">
                            {otp.map((digit, index) => (
                                <input
                                    key={index}
                                    ref={el => inputRefs.current[index] = el}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleChange(e.target.value, index)}
                                    onKeyDown={(e) => handleKeyDown(e, index)}
                                    onPaste={handlePaste}
                                    className="w-full h-11 text-center text-lg font-black bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-[#1a3c8f] focus:bg-white focus:ring-4 focus:ring-blue-50 outline-none transition-all text-[#1a3c8f] shadow-inner"
                                />
                            ))}
                        </div>

                        <button
                            onClick={handleSubmit}
                            disabled={loading || otp.some(d => !d)}
                            className="w-full bg-[#1a3c8f] hover:bg-[#0f172a] text-white py-3.5 rounded-xl font-black text-[9px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-xl shadow-blue-900/20 transition-all active:scale-[0.97] disabled:opacity-30"
                        >
                            {loading ? <Loader2 className="animate-spin" size={14} /> : (
                                <>
                                    Verify Account
                                    <ArrowRight size={12} />
                                </>
                            )}
                        </button>

                        <div className="flex items-center gap-2 py-0.5">
                            <div className="h-px flex-1 bg-slate-100"></div>
                            <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Support</span>
                            <div className="h-px flex-1 bg-slate-100"></div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            <a 
                                href={whatsappLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex flex-col items-center gap-1.5 p-2.5 bg-green-50/50 hover:bg-green-50 text-green-600 rounded-xl transition-all border border-green-100 group"
                            >
                                <div className="w-7 h-7 bg-white rounded-lg flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                                    <MessageSquare size={14} />
                                </div>
                                <span className="text-[8px] font-black uppercase tracking-widest">WhatsApp</span>
                            </a>
                            <a 
                                href="tel:+918140411130"
                                className="flex flex-col items-center gap-1.5 p-2.5 bg-blue-50/50 hover:bg-blue-50 text-[#1a3c8f] rounded-xl transition-all border border-blue-100 group"
                            >
                                <div className="w-7 h-7 bg-white rounded-lg flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                                    <Phone size={14} />
                                </div>
                                <span className="text-[8px] font-black uppercase tracking-widest">Call Admin</span>
                            </a>
                        </div>

                        <div className="flex flex-col items-center pt-1">
                            <button 
                                onClick={handleLogout}
                                className="text-slate-400 hover:text-red-500 font-black text-[8px] uppercase tracking-widest transition-colors flex items-center gap-2"
                            >
                                <LogOut size={10} />
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
