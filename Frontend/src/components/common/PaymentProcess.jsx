import React, { useState } from 'react';
import { CreditCard, ShieldCheck, Loader2, IndianRupee } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../utils/api';

const PaymentProcess = ({ 
  amount, 
  onSuccess, 
  userType = 'CANDIDATE',
  buttonText = 'Pay & Verify Account'
}) => {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    try {
      // 1. Create order on backend
      const { data: orderData } = await api.post('/payment/create-order');
      
      if (!orderData.success) {
        throw new Error(orderData.message || 'Failed to create order');
      }

      // 2. Open Razorpay Checkout
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_SSbewIRRaxmzdu', // Fallback for testing
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'LOSODHAN',
        description: `${userType} Account Verification Fee`,
        image: '/assets/logo.png',
        order_id: orderData.order_id,
        handler: async function (response) {
          try {
            // 3. Verify payment on backend
            const verifyRes = await api.post('/payment/verify-payment', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });

            if (verifyRes.data.success) {
              toast.success('Payment successful! Account verified.');
              if (onSuccess) onSuccess(verifyRes.data);
            } else {
              toast.error('Payment verification failed. Please contact support.');
            }
          } catch (err) {
            toast.error('Failed to verify payment');
          }
        },
        prefill: {
          name: '',
          email: '',
          contact: ''
        },
        theme: {
          color: '#1a3c8f'
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

      rzp.on('payment.failed', function (response) {
        toast.error('Payment failed: ' + response.error.description);
      });

    } catch (error) {
      console.error('Payment Error:', error);
      toast.error(error.message || 'Something went wrong with the payment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-md p-8 rounded-3xl border border-blue-100 shadow-xl max-w-lg mx-auto text-center space-y-6">
      <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto ring-8 ring-blue-50/50">
        <CreditCard className="w-10 h-10" />
      </div>

      <div className="space-y-2">
        <h3 className="text-2xl font-bold text-slate-800">Account Verification</h3>
        <p className="text-slate-500">To finalize your registration and access all features, a small verification fee is required.</p>
      </div>

      <div className="p-6 bg-slate-50 rounded-2xl flex items-center justify-between border border-slate-100">
        <div className="text-left">
          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Verification Fee</p>
          <div className="flex items-center gap-1 text-2xl font-black text-slate-900">
            <IndianRupee className="w-5 h-5" />
            <span>{amount}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-1.5 rounded-lg text-xs font-bold">
          <ShieldCheck className="w-4 h-4" />
          SECURE
        </div>
      </div>

      <button
        type="button"
        onClick={handlePayment}
        disabled={loading}
        className="w-full py-4 bg-[#1a3c8f] text-white rounded-2xl font-bold text-lg hover:bg-blue-800 transition-all shadow-lg active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3"
      >
        {loading ? (
          <Loader2 className="w-6 h-6 animate-spin" />
        ) : (
          <>
            <CreditCard className="w-6 h-6" />
            {buttonText}
          </>
        )}
      </button>

      <p className="text-[10px] text-slate-400">
        Powered by Razorpay. All transactions are secure and encrypted.
      </p>
    </div>
  );
};

export default PaymentProcess;
