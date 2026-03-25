import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, PhoneCall, CheckCircle2, Info, UserCheck, CreditCard, Sparkles, RefreshCw } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { createPaymentOrder, verifyPayment } from '../../redux/actions/paymentActions';
import toast from 'react-hot-toast';

const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID;

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (document.getElementById('razorpay-script')) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.id = 'razorpay-script';
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const ActivationDialog = ({ isOpen, isPaid, userType = 'CANDIDATE', onPaymentSuccess }) => {
  const dispatch = useDispatch();
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentDone, setPaymentDone] = useState(false);

  const showSuccessUI = isPaid || paymentDone;

  const adminNumber = "+91 98765 43210";
  const PRICE = userType === 'RECRUITER' ? 1199 : 299;

  const handlePayment = async () => {
    setPaymentLoading(true);
    try {
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        toast.error('Razorpay failed to load. Please check your connection.');
        setPaymentLoading(false);
        return;
      }

      const orderData = await dispatch(createPaymentOrder()).unwrap();

      const options = {
        key: RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'LOSODHAN',
        description: `Annual Subscription - ${userType === 'RECRUITER' ? 'Recruiter' : 'Candidate'} Plan`,
        order_id: orderData.order_id,
        handler: async (response) => {
          try {
            await dispatch(verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            })).unwrap();
            toast.success('Payment successful! Please call admin to activate your account.');
            setPaymentDone(true);
            if (onPaymentSuccess) onPaymentSuccess();
          } catch {
            toast.error('Payment verification failed. Please contact support.');
          }
        },
        prefill: {},
        theme: { color: '#1a3c8f' },
        modal: {
          ondismiss: () => setPaymentLoading(false),
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', () => {
        toast.error('Payment failed. Please try again.');
        setPaymentLoading(false);
      });
      rzp.open();
    } catch (error) {
      toast.error(error || 'Could not initiate payment. Please try again.');
    } finally {
      setPaymentLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
        {/* Premium Glass Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-[#0a192f]/60 backdrop-blur-xl"
        />

        {/* Dialog Card - Responsive & Scrollable */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-lg bg-white sm:rounded-[3rem] rounded-[2rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] overflow-hidden border border-white/20 flex flex-col max-h-[90vh]"
        >
          {/* Top Decorative Gradient */}
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-orange-500 via-[#1a3c8f] to-orange-500 z-10" />

          {/* Scrollable Content Area */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-6 sm:p-10">
            <div className="space-y-6 sm:space-y-8">
              {/* Header: Icon & Title */}
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-orange-50 rounded-2xl sm:rounded-[2rem] flex items-center justify-center relative">
                  <ShieldAlert className="w-8 h-8 sm:w-10 sm:h-10 text-orange-600" />
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg border-2 border-white"
                  >
                    <Info size={12} />
                  </motion.div>
                </div>
                <div className="text-center">
                  <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight leading-tight">
                    Account Activation Required
                  </h2>
                  <p className="text-[10px] sm:text-xs font-bold text-gray-400 mt-1 uppercase tracking-[0.2em]">
                    Unlock Premium Professional Features
                  </p>
                </div>
              </div>

              {showSuccessUI ? (
                /* Post-payment success state */
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-green-50 rounded-2xl sm:rounded-[2rem] p-5 sm:p-6 border border-green-100 space-y-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/20">
                      <CheckCircle2 className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-green-800 uppercase tracking-widest">Payment Received</p>
                      <p className="text-xs sm:text-sm font-bold text-green-700">₹{PRICE} has been verified.</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-green-200">
                    <div className="flex items-center gap-4 bg-white/50 p-4 rounded-xl">
                      <div className="w-10 h-10 bg-[#1a3c8f] text-white rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/20">
                        <PhoneCall size={18} />
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Call Admin to Activate</p>
                        <p className="text-base sm:text-lg font-black text-gray-900 leading-none">{adminNumber}</p>
                      </div>
                    </div>
                    <p className="text-[10px] text-gray-500 mt-4 text-center italic font-medium">
                      Admin will activate your account instantly after a quick verification.
                    </p>
                  </div>
                </motion.div>
              ) : (
                <>
                  {/* Pricing / Plan Section */}
                  <div className="relative bg-gradient-to-br from-[#1a3c8f] to-blue-700 rounded-2xl sm:rounded-[2rem] p-5 sm:p-7 text-white overflow-hidden shadow-xl shadow-blue-900/10">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-8 -mt-8" />
                    <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full -ml-4 -mb-4" />
                    
                    <div className="relative flex items-center justify-between">
                      <div>
                        <div className="inline-flex items-center gap-1.5 bg-white/10 px-2.5 py-1 rounded-full mb-2">
                          <Sparkles size={10} className="text-yellow-300" />
                          <span className="text-[8px] font-black uppercase tracking-widest">Annual Membership</span>
                        </div>
                        <div className="flex items-baseline gap-1">
                          <span className="text-3xl sm:text-4xl font-black">₹{PRICE}</span>
                          <span className="text-xs font-bold text-blue-200">/year</span>
                        </div>
                        <p className="text-[10px] font-medium text-blue-200 mt-1">One-time annual activation fee</p>
                      </div>
                      <div className="bg-white/10 rounded-2xl p-3 sm:p-4 backdrop-blur-sm border border-white/10">
                        <UserCheck className="w-6 h-6 sm:w-8 sm:h-8 text-blue-100" />
                      </div>
                    </div>

                    <div className="mt-5 flex flex-wrap gap-2">
                      {[
                        userType === 'RECRUITER' ? 'Post Unlimited Jobs' : 'Apply to Verified Jobs',
                        'Direct Admin Support',
                        'Priority Rank'
                      ].map(feature => (
                        <span key={feature} className="inline-flex items-center gap-1.5 text-[8px] sm:text-[9px] font-bold uppercase tracking-wider bg-white/10 px-3 py-1.5 rounded-full border border-white/5">
                          <CheckCircle2 size={10} className="text-blue-300" /> {feature}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* CTA Section */}
                  <div className="space-y-4">
                    <button
                      onClick={handlePayment}
                      disabled={paymentLoading}
                      className="w-full relative group"
                    >
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-500 to-orange-600 rounded-[1.5rem] sm:rounded-[2rem] blur opacity-30 group-hover:opacity-60 transition duration-200" />
                      <div className="relative flex items-center justify-center gap-3 px-8 py-4 sm:py-5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-[1.5rem] sm:rounded-[2rem] font-black text-xs sm:text-sm uppercase tracking-[0.15em] shadow-lg transition-all active:scale-[0.98] disabled:opacity-60">
                        {paymentLoading ? (
                          <><RefreshCw size={18} className="animate-spin" /> Processing...</>
                        ) : (
                          <><CreditCard size={18} /> Pay ₹{PRICE} & Activate</>
                        )}
                      </div>
                    </button>

                    <div className="flex items-center gap-3 px-4">
                      <div className="flex-1 h-px bg-gray-100" />
                      <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Simple Process</span>
                      <div className="flex-1 h-px bg-gray-100" />
                    </div>

                    {/* Support Info Box */}
                    <div className="bg-gray-50 rounded-2xl sm:rounded-[2rem] p-5 border border-gray-100/50">
                      <div className="flex items-start gap-3 mb-4">
                        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm border border-gray-100 flex-shrink-0">
                          <Info className="w-4 h-4 text-[#1a3c8f]" />
                        </div>
                        <p className="text-[11px] sm:text-xs font-bold text-gray-500 leading-relaxed">
                          Pay once and enjoy premium access for 365 days. Simply call admin with your payment code for instant activation.
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                        <div className="w-10 h-10 bg-[#1a3c8f] text-white rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/10">
                          <PhoneCall size={18} />
                        </div>
                        <div>
                          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Direct Activation Line</p>
                          <p className="text-base sm:text-lg font-black text-gray-900 leading-none">{adminNumber}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Fixed Footer */}
          <div className="bg-gray-50/80 backdrop-blur-sm px-6 sm:px-10 py-4 text-center border-t border-gray-100">
            <div className="flex items-center justify-center gap-2 text-blue-600/60">
              <ShieldAlert size={14} />
              <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.15em]">Secure Payments · SSL Encrypted</span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ActivationDialog;
