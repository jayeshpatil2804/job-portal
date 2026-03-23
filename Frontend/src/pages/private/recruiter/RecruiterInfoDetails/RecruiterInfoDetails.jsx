import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2, MapPin, Globe, CreditCard,
  FileCheck, ChevronRight, ChevronLeft,
  Upload, X, CheckCircle2, Briefcase
} from 'lucide-react';
import FormInput from '../../../../components/FormInput';
import toast from 'react-hot-toast';
import {
  fetchRecruiterProfileStatus,
  updateRecruiterProfile
} from '../../../../redux/actions/recruiterProfileActions';
import { uploadResume } from '../../../../redux/actions/fileActions';
import { setRecruiterStep } from '../../../../redux/slices/recruiterProfileSlice';
import PaymentProcess from '../../../../components/common/PaymentProcess';

const RecruiterInfoDetails = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { step } = useParams();

  const [showPayment, setShowPayment] = useState(false);
  const [localLoading, setLocalLoading] = useState(false);

  // Redux state
  const {
    data: savedData,
    currentStep: reduxStep,
    isProfileCompleted,
    isPaid,
    loading: reduxLoading,
    status: profileStatus
  } = useSelector(state => state.recruiterProfile);

  const handlePaymentSuccess = async () => {
    try {
      await dispatch(fetchRecruiterProfileStatus()).unwrap();
      navigate('/recruiter/dashboard', { replace: true });
    } catch (err) {
      console.error('Payment refresh error:', err);
      navigate('/recruiter/dashboard', { replace: true });
    }
  };

  const [formData, setFormData] = useState({
    // Step 1: Company Info
    companyName: '',
    industry: '',
    website: '',
    // Step 2: Address
    address: '',
    city: '',
    state: '',
    // Step 3: GST
    gstNumber: '',
    // Step 4: Documents
    gstCertificate: null,
    msmeCertificate: null,
    registrationCertificate: null
  });

  const steps = [
    { title: 'Company', icon: Building2 },
    { title: 'Address', icon: MapPin },
    { title: 'GST', icon: CreditCard },
    { title: 'Verification', icon: FileCheck }
  ];

  useEffect(() => {
    if (profileStatus === 'idle') {
      dispatch(fetchRecruiterProfileStatus());
    }
  }, [dispatch, profileStatus]);

  useEffect(() => {
    if (profileStatus === 'succeeded' && savedData) {
      if (isProfileCompleted && isPaid) {
        navigate('/recruiter/dashboard', { replace: true });
        return;
      }

      // If profile is done but NOT paid, auto-show payment
      if (isProfileCompleted && !isPaid) {
        setShowPayment(true);
      }

      setFormData(prev => ({
        ...prev,
        ...savedData
      }));

      const urlStep = parseInt(step);
      if (!urlStep || urlStep < 1 || urlStep > 4) {
        navigate(`/recruiter/complete-profile/${reduxStep || 1}`, { replace: true });
      }
    }
  }, [profileStatus, savedData, isProfileCompleted, navigate, reduxStep, step]);

  useEffect(() => {
    const urlStep = parseInt(step);
    if (urlStep >= 1 && urlStep <= 4) {
      dispatch(setRecruiterStep(urlStep));
    }
  }, [step, dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const prevStep = () => {
    const prev = Math.max(reduxStep - 1, 1);
    navigate(`/recruiter/complete-profile/${prev}`);
  };

  const validateStep = (s) => {
    switch (s) {
      case 1:
        if (!formData.companyName || !formData.industry) {
          toast.error('Please fill company name and industry');
          return false;
        }
        return true;
      case 2:
        if (!formData.address || !formData.city || !formData.state) {
          toast.error('Please complete address details');
          return false;
        }
        return true;
      case 3:
        if (!formData.gstNumber) {
          toast.error('GST number is required for verification');
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const nextStep = async () => {
    if (!validateStep(reduxStep)) return;

    setLocalLoading(true);
    try {
      const { gstCertificate, msmeCertificate, registrationCertificate, ...submitData } = formData;
      const nextS = Math.min(reduxStep + 1, 4);

      await dispatch(updateRecruiterProfile({
        ...submitData,
        onboardingStep: nextS,
        isProfileCompleted: false
      })).unwrap();

      navigate(`/recruiter/complete-profile/${nextS}`);
    } catch (error) {
      toast.error(error || 'Failed to save progress');
    } finally {
      setLocalLoading(false);
    }
  };

  const handleFileUpload = async (file, fieldName) => {
    if (!file) return;
    try {
      const result = await dispatch(uploadResume(file)).unwrap(); // Reusing uploadResume action as it's generic now
      return { url: result.file.fileUrl, id: result.file.id };
    } catch (error) {
      toast.error(`Failed to upload ${fieldName}`);
      return null;
    }
  };

  const handleSubmit = async () => {
    if (!formData.gstCertificate && !savedData?.gstCertificateFileId) {
      return toast.error('GST Certificate is required');
    }

    setLocalLoading(true);
    try {
      let gstData = { url: savedData?.gstCertificateUrl, id: savedData?.gstCertificateFileId };
      let msmeData = { url: savedData?.msmeCertificateUrl, id: savedData?.msmeCertificateFileId };
      let regData = { url: savedData?.registrationCertificateUrl, id: savedData?.registrationCertificateFileId };

      if (formData.gstCertificate instanceof File) {
        gstData = await handleFileUpload(formData.gstCertificate, 'GST Certificate');
      }
      if (formData.msmeCertificate instanceof File) {
        msmeData = await handleFileUpload(formData.msmeCertificate, 'MSME Certificate');
      }
      if (formData.registrationCertificate instanceof File) {
        regData = await handleFileUpload(formData.registrationCertificate, 'Registration Certificate');
      }

      const { gstCertificate, msmeCertificate, registrationCertificate, ...submitData } = formData;

      await dispatch(updateRecruiterProfile({
        ...submitData,
        gstCertificateUrl: gstData?.url,
        gstCertificateFileId: gstData?.id,
        msmeCertificateUrl: msmeData?.url,
        msmeCertificateFileId: msmeData?.id,
        registrationCertificateUrl: regData?.url,
        registrationCertificateFileId: regData?.id,
        isProfileCompleted: true,
        onboardingStep: 4
      })).unwrap();

      toast.success('Company profile saved! Finalizing verification...');
      setShowPayment(true);
    } catch (error) {
      toast.error(error || 'Failed to complete profile');
    } finally {
      setLocalLoading(false);
    }
  };

  const renderStep = () => {
    switch (reduxStep) {
      case 1:
        return (
          <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
            <div className="bg-white/50 backdrop-blur-sm p-8 rounded-2xl border border-blue-100 shadow-sm space-y-6">
              <h3 className="text-xl font-semibold text-blue-900 flex items-center gap-2">
                <Building2 className="w-6 h-6 text-blue-600" /> Company Information
              </h3>
              <div className="grid grid-cols-1 gap-6">
                <FormInput
                  label="Company Legal Name"
                  name="companyName"
                  placeholder="As per GST records"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  icon={Building2}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormInput
                    label="Industry Type"
                    name="industry"
                    placeholder="e.g. IT, Healthcare"
                    value={formData.industry}
                    onChange={handleInputChange}
                    icon={Briefcase}
                  />
                  <FormInput
                    label="Website"
                    name="website"
                    placeholder="e.g. https://company.com"
                    value={formData.website}
                    onChange={handleInputChange}
                    icon={Globe}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
            <div className="bg-white/50 backdrop-blur-sm p-8 rounded-2xl border border-blue-100 shadow-sm space-y-6">
              <h3 className="text-xl font-semibold text-blue-900 flex items-center gap-2">
                <MapPin className="w-6 h-6 text-blue-600" /> Registered Office Address
              </h3>
              <div className="grid grid-cols-1 gap-6">
                <FormInput
                  label="Registered Address"
                  name="address"
                  placeholder="Building name, Street, Area..."
                  value={formData.address}
                  onChange={handleInputChange}
                  icon={MapPin}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormInput
                    label="City"
                    name="city"
                    placeholder="e.g. Mumbai"
                    value={formData.city}
                    onChange={handleInputChange}
                  />
                  <FormInput
                    label="State"
                    name="state"
                    placeholder="e.g. Maharashtra"
                    value={formData.state}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
            <div className="bg-white/50 backdrop-blur-sm p-8 rounded-2xl border border-blue-100 shadow-sm space-y-6">
              <h3 className="text-xl font-semibold text-blue-900 flex items-center gap-2">
                <CreditCard className="w-6 h-6 text-blue-600" /> Business Identification
              </h3>
              <div className="grid grid-cols-1 gap-6">
                <FormInput
                  label="GST Number"
                  name="gstNumber"
                  placeholder="22AAAAA0000A1Z5"
                  value={formData.gstNumber}
                  onChange={handleInputChange}
                  icon={CreditCard}
                />
                <p className="text-xs text-slate-400 italic">This will be used for official communications and invoicing.</p>
              </div>
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
            <div className="bg-white/50 backdrop-blur-sm p-8 rounded-2xl border border-blue-100 shadow-sm space-y-8">
              <h3 className="text-xl font-semibold text-blue-900 flex items-center gap-2">
                <FileCheck className="w-6 h-6 text-blue-600" /> Document Verification
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* GST Upload */}
                <div className="flex flex-col gap-3">
                  <label className="text-sm font-semibold text-slate-700">GST Certificate*</label>
                  <div className="relative group">
                    <input type="file" accept=".pdf" onChange={(e) => setFormData(prev => ({ ...prev, gstCertificate: e.target.files[0] }))} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                    <div className={`p-6 border-2 border-dashed rounded-xl flex flex-col items-center justify-center text-center transition-all ${formData.gstCertificate || savedData?.gstCertificateFileId ? 'border-green-400 bg-green-50' : 'border-slate-200 group-hover:border-blue-400'}`}>
                      {formData.gstCertificate || savedData?.gstCertificateFileId ? <CheckCircle2 className="w-8 h-8 text-green-500" /> : <Upload className="w-8 h-8 text-slate-300" />}
                      <span className="mt-2 text-[10px] font-bold text-slate-500 uppercase">GST</span>
                    </div>
                  </div>
                </div>

                {/* MSME Upload */}
                <div className="flex flex-col gap-3">
                  <label className="text-sm font-semibold text-slate-700">MSME Certificate</label>
                  <div className="relative group">
                    <input type="file" accept=".pdf" onChange={(e) => setFormData(prev => ({ ...prev, msmeCertificate: e.target.files[0] }))} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                    <div className={`p-6 border-2 border-dashed rounded-xl flex flex-col items-center justify-center text-center transition-all ${formData.msmeCertificate || savedData?.msmeCertificateFileId ? 'border-green-400 bg-green-50' : 'border-slate-200 group-hover:border-blue-400'}`}>
                      {formData.msmeCertificate || savedData?.msmeCertificateFileId ? <CheckCircle2 className="w-8 h-8 text-green-500" /> : <Upload className="w-8 h-8 text-slate-300" />}
                      <span className="mt-2 text-[10px] font-bold text-slate-500 uppercase">MSME</span>
                    </div>
                  </div>
                </div>

                {/* Company Registration Upload */}
                <div className="flex flex-col gap-3">
                  <label className="text-sm font-semibold text-slate-700">Registration Docs</label>
                  <div className="relative group">
                    <input type="file" accept=".pdf" onChange={(e) => setFormData(prev => ({ ...prev, registrationCertificate: e.target.files[0] }))} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                    <div className={`p-6 border-2 border-dashed rounded-xl flex flex-col items-center justify-center text-center transition-all ${formData.registrationCertificate || savedData?.registrationCertificateFileId ? 'border-green-400 bg-green-50' : 'border-slate-200 group-hover:border-blue-400'}`}>
                      {formData.registrationCertificate || savedData?.registrationCertificateFileId ? <CheckCircle2 className="w-8 h-8 text-green-500" /> : <Upload className="w-8 h-8 text-slate-300" />}
                      <span className="mt-2 text-[10px] font-bold text-slate-500 uppercase">REGISTRATION</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  const isGlobalLoading = profileStatus === 'loading' || localLoading;

  if (profileStatus === 'loading' && !savedData?.companyName) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium">Authenticating business profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col overflow-hidden">
      <div className="w-full px-6 py-6 flex-1 overflow-y-auto custom-scrollbar">
        <div className="max-w-4xl mx-auto pb-4">
          <div className="mb-6 text-center">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-900 to-blue-600 bg-clip-text text-transparent mb-1">
              Verify Your Business
            </h1>
            <p className="text-slate-500 italic">Complete these steps to start posting jobs and hiring talent.</p>

            <div className="mt-6 flex items-center justify-center gap-4">
              {steps.map((stepItem, idx) => {
                const StepIcon = stepItem.icon;
                const isCompleted = reduxStep > idx + 1;
                const isActive = reduxStep === idx + 1;
                return (
                  <div key={idx} className="flex items-center">
                    <div className="flex flex-col items-center gap-2">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${isCompleted ? 'bg-green-500 text-white' : isActive ? 'bg-blue-900 text-white shadow-lg shadow-blue-200 scale-110' : 'bg-slate-100 text-slate-400'}`}>
                        {isCompleted ? <CheckCircle2 className="w-6 h-6" /> : <StepIcon className="w-6 h-6" />}
                      </div>
                      <span className={`text-[10px] font-bold uppercase tracking-widest ${isActive ? 'text-blue-900' : 'text-slate-400'}`}>{stepItem.title}</span>
                    </div>
                    {idx < steps.length - 1 && <div className={`w-16 h-0.5 mx-2 ${reduxStep > idx + 1 ? 'bg-green-500' : 'bg-slate-200'}`} />}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="min-h-[300px]">
            {showPayment ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-10"
              >
                <PaymentProcess 
                  amount={1} 
                  userType="RECRUITER"
                  onSuccess={handlePaymentSuccess}
                />
              </motion.div>
            ) : (
              <AnimatePresence mode="wait">{renderStep()}</AnimatePresence>
            )}
          </div>

          {!showPayment && (
            <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-6">
              <button type="button" onClick={prevStep} disabled={reduxStep === 1 || isGlobalLoading} className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium transition-all ${reduxStep === 1 ? 'text-slate-300 cursor-not-allowed' : 'text-slate-600 hover:bg-slate-100'}`}>
                <ChevronLeft className="w-5 h-5" /> Previous
              </button>

              {reduxStep < 4 ? (
                <button type="button" onClick={nextStep} disabled={isGlobalLoading} className="flex items-center gap-2 px-8 py-2.5 bg-blue-900 text-white rounded-xl font-medium hover:bg-blue-800 transition-all shadow-md active:scale-95 disabled:opacity-50">
                  {localLoading ? 'Saving...' : <>Next Step <ChevronRight className="w-5 h-5" /></>}
                </button>
              ) : (
                <button type="button" onClick={handleSubmit} disabled={isGlobalLoading} className="flex items-center gap-2 px-8 py-2.5 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-all shadow-md active:scale-95 disabled:opacity-50">
                  {localLoading ? 'Submitting...' : <>Submit for Verification <CheckCircle2 className="w-5 h-5" /></>}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecruiterInfoDetails;
