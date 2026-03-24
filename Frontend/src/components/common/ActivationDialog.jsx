import React, { useState } from 'react';
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
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-blue-900/40 backdrop-blur-md"
        />

        {/* Dialog Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-lg bg-white rounded-[3.5rem] shadow-2xl shadow-blue-900/30 overflow-hidden border border-white"
        >
          {/* Header Gradient Bar */}
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-500 via-[#1a3c8f] to-orange-500" />

          <div className="p-10 space-y-8">
            {/* Icon & Title */}
            <div className="flex flex-col items-center gap-4">
              <div className="w-20 h-20 bg-orange-50 rounded-[2rem] flex items-center justify-center relative">
                <ShieldAlert className="w-10 h-10 text-orange-600" />
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="absolute -top-2 -right-2 w-7 h-7 bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg border-4 border-white"
                >
                  <Info size={14} />
                </motion.div>
              </div>
              <div className="text-center">
                <h2 className="text-2xl font-black text-gray-900 tracking-tight">Account Inactive</h2>
                <p className="text-gray-400 font-semibold text-xs mt-1 uppercase tracking-widest">
                  Activation required to continue
                </p>
              </div>
            </div>

            {showSuccessUI ? (
              /* Post-payment success state */
              <div className="bg-green-50 rounded-[2rem] p-6 border border-green-100 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-green-800 uppercase tracking-widest">Payment Successful!</p>
                    <p className="text-xs font-bold text-green-700">₹{PRICE} received. Now call admin to activate.</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 pt-3 border-t border-green-200">
                  <div className="w-10 h-10 bg-[#1a3c8f] text-white rounded-xl flex items-center justify-center">
                    <PhoneCall size={18} />
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Call Admin Now</p>
                    <p className="text-lg font-black text-gray-900">{adminNumber}</p>
                  </div>
                </div>
              </div>
            ) : (
              <>
                {/* Pricing Section */}
                <div className="relative bg-gradient-to-br from-[#1a3c8f] to-blue-600 rounded-[2rem] p-6 text-white overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-8 -mt-8" />
                  <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full -ml-4 -mb-4" />
                  <div className="relative flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-200">Annual Plan</p>
                      <p className="text-4xl font-black mt-1">₹{PRICE}</p>
                      <p className="text-[10px] font-bold text-blue-300 mt-1">Per year · One-time activation</p>
                    </div>
                    <div className="bg-white/10 rounded-2xl p-3">
                      <Sparkles className="w-8 h-8 text-yellow-300" />
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {[userType === 'RECRUITER' ? 'Post Unlimited Jobs' : 'Apply to All Jobs', 'Priority Support', 'Verified Badge'].map(feature => (
                      <span key={feature} className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wider bg-white/10 px-3 py-1 rounded-full">
                        <CheckCircle2 size={10} /> {feature}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Pay Now Button */}
                <button
                  onClick={handlePayment}
                  disabled={paymentLoading}
                  className="w-full flex items-center justify-center gap-3 px-8 py-5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-[2rem] font-black text-sm uppercase tracking-[0.15em] shadow-xl shadow-orange-500/30 hover:from-orange-600 hover:to-orange-700 transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {paymentLoading ? (
                    <><RefreshCw size={18} className="animate-spin" /> Processing...</>
                  ) : (
                    <><CreditCard size={18} /> Pay ₹{PRICE} & Activate</>
                  )}
                </button>

                {/* Divider */}
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px bg-gray-100" />
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Then Call Admin</span>
                  <div className="flex-1 h-px bg-gray-100" />
                </div>

                {/* Admin Contact */}
                <div className="bg-gray-50 rounded-[2rem] p-5 border border-gray-100">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm border border-gray-100 flex-shrink-0">
                      <UserCheck className="w-5 h-5 text-[#1a3c8f]" />
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-[10px] font-black text-[#1a3c8f] uppercase tracking-widest">Activation Process</p>
                      <p className="text-xs font-bold text-gray-600 leading-relaxed">
                        After payment, call admin to verify & activate your {userType.toLowerCase()} profile instantly.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
                    <div className="w-10 h-10 bg-[#1a3c8f] text-white rounded-xl flex items-center justify-center shadow-lg">
                      <PhoneCall size={18} />
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Admin Number</p>
                      <p className="text-lg font-black text-gray-900">{adminNumber}</p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-10 py-4 text-center border-t border-gray-100">
            <div className="flex items-center justify-center gap-2 text-green-600">
              <CheckCircle2 size={14} />
              <span className="text-[10px] font-black uppercase tracking-widest">Secured by Razorpay · 100% Safe</span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ActivationDialog;
