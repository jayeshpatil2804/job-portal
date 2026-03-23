import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, MapPin, GraduationCap, Briefcase, 
  Wrench, FileText, ChevronRight, ChevronLeft, 
  Upload, X, CheckCircle2 
} from 'lucide-react';
import FormInput from '../../../../components/FormInput';
import toast from 'react-hot-toast';
import { 
  fetchProfileStatus, 
  updateProfile 
} from '../../../../redux/actions/profileActions';
import { uploadResume } from '../../../../redux/actions/fileActions';
import { setStep } from '../../../../redux/slices/profileSlice';
import PaymentProcess from '../../../../components/common/PaymentProcess';

const CandidateInfoDetails = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { step } = useParams();
  
  const [showPayment, setShowPayment] = useState(false);
  const [localLoading, setLocalLoading] = useState(false);

  const handlePaymentSuccess = async () => {
    try {
      await dispatch(fetchProfileStatus()).unwrap();
      navigate('/dashboard', { replace: true });
    } catch (err) {
      console.error('Payment refresh error:', err);
      navigate('/dashboard', { replace: true });
    }
  };
  
  const { 
    data: savedData, 
    currentStep: reduxStep, 
    isProfileCompleted, 
    isPaid,
    loading: reduxLoading,
    status: profileStatus 
  } = useSelector(state => state.profile);

  const [formData, setFormData] = useState({
    // Personal Details
    address: '',
    city: '',
    state: '',
    // Education
    qualification: '',
    college: '',
    passingYear: '',
    // Experience
    isExperienced: false,
    companyName: '',
    designation: '',
    yearsOfExp: '',
    // Skills
    skills: [],
    currentSkill: '',
    // Resume
    resume: null
  });

  const steps = [
    { title: 'Personal', icon: User },
    { title: 'Education', icon: GraduationCap },
    { title: 'Experience', icon: Briefcase },
    { title: 'Resume', icon: FileText }
  ];

  // Sync saved data to local form when fetch succeeds
  useEffect(() => {
    if (profileStatus === 'succeeded' && savedData) {
      if (isProfileCompleted && isPaid) {
        navigate('/dashboard', { replace: true });
        return;
      }
      
      // If profile is done but NOT paid, auto-show payment
      if (isProfileCompleted && !isPaid) {
        setShowPayment(true);
      }

      const parsedSkills = savedData.skills 
        ? (Array.isArray(savedData.skills) ? savedData.skills : savedData.skills.split(',').map(s => s.trim()).filter(Boolean))
        : [];

      setFormData(prev => ({
        ...prev,
        ...savedData,
        skills: parsedSkills
      }));

      // Sync step from URL or Redux
      const urlStep = parseInt(step);
      if (!urlStep || urlStep < 1 || urlStep > 4) {
        navigate(`/candidate/complete-profile/${reduxStep || 1}`, { replace: true });
      }
    }
  }, [profileStatus, savedData, isProfileCompleted, navigate, reduxStep, step]);

  // Update step in Redux when URL step changes
  useEffect(() => {
    const urlStep = parseInt(step);
    if (urlStep >= 1 && urlStep <= 4) {
      dispatch(setStep(urlStep));
    }
  }, [step, dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const addSkill = () => {
    if (formData.currentSkill.trim() && !formData.skills.includes(formData.currentSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, prev.currentSkill.trim()],
        currentSkill: ''
      }));
    }
  };

  const removeSkill = (skillToRemove) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skillToRemove)
    }));
  };

  const prevStep = () => {
    const prev = Math.max(reduxStep - 1, 1);
    navigate(`/candidate/complete-profile/${prev}`);
  };

  const validateStep = (s) => {
    switch (s) {
      case 1:
        if (!formData.address || !formData.city || !formData.state) {
          toast.error('Please complete all personal details');
          return false;
        }
        return true;
      case 2:
        if (!formData.qualification || !formData.college || !formData.passingYear) {
          toast.error('Please complete all education details');
          return false;
        }
        return true;
      case 3:
        if (formData.isExperienced && (!formData.companyName || !formData.designation || !formData.yearsOfExp)) {
          toast.error('Please fill in your experience details');
          return false;
        }
        if (formData.skills.length === 0) {
          toast.error('Please add at least one skill');
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
      const { currentSkill, resume, ...submitData } = formData;
      const nextS = Math.min(reduxStep + 1, 4);
      
      const result = await dispatch(updateProfile({
        ...submitData,
        onboardingStep: nextS,
        isProfileCompleted: false
      })).unwrap();
      
      navigate(`/candidate/complete-profile/${nextS}`);
    } catch (error) {
      toast.error(error || 'Failed to save progress');
    } finally {
      setLocalLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!formData.resume) {
      return toast.error('Please upload your resume');
    }
    
    setLocalLoading(true);
    try {
      let resumeFileId = savedData?.resumeFileId;
      let resumeUrl = savedData?.resumeUrl;

      // If resume is a File object, upload it first
      if (formData.resume instanceof File) {
        const uploadResult = await dispatch(uploadResume(formData.resume)).unwrap();
        resumeFileId = uploadResult.file.id;
        resumeUrl = uploadResult.file.fileUrl;
      }

      const { currentSkill, resume, ...submitData } = formData;
      
      await dispatch(updateProfile({
        ...submitData,
        resumeFileId,
        resumeUrl,
        isProfileCompleted: true,
        onboardingStep: 4
      })).unwrap();
      
      toast.success('Profile saved! Finalizing verification...');
      setShowPayment(true);
    } catch (error) {
      toast.error(error || 'Failed to update profile');
    } finally {
      setLocalLoading(false);
    }
  };

  const renderStep = () => {
    switch (reduxStep) {
      case 1:
        return (
          <motion.div 
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="bg-white/50 backdrop-blur-sm p-8 rounded-2xl border border-blue-100 shadow-sm space-y-6">
              <h3 className="text-xl font-semibold text-blue-900 flex items-center gap-2">
                <MapPin className="w-6 h-6 text-blue-600" /> Personal Details
              </h3>
              <div className="grid grid-cols-1 gap-6">
                <FormInput
                  label="Permanent Address"
                  name="address"
                  placeholder="Street name, Area, House No..."
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

      case 2:
        return (
          <motion.div 
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="bg-white/50 backdrop-blur-sm p-8 rounded-2xl border border-blue-100 shadow-sm space-y-6">
              <h3 className="text-xl font-semibold text-blue-900 flex items-center gap-2">
                <GraduationCap className="w-6 h-6 text-blue-600" /> Education Info
              </h3>
              <div className="grid grid-cols-1 gap-6">
                <FormInput
                  label="Highest Qualification"
                  name="qualification"
                  placeholder="e.g. B.Tech in Computer Science"
                  value={formData.qualification}
                  onChange={handleInputChange}
                  icon={GraduationCap}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormInput
                    label="College/University"
                    name="college"
                    placeholder="e.g. IIT Delhi"
                    value={formData.college}
                    onChange={handleInputChange}
                  />
                  <FormInput
                    label="Passing Year"
                    name="passingYear"
                    placeholder="e.g. 2024"
                    value={formData.passingYear}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div 
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="bg-white/50 backdrop-blur-sm p-8 rounded-2xl border border-blue-100 shadow-sm space-y-6">
              <h3 className="text-xl font-semibold text-blue-900 flex items-center gap-2">
                <Briefcase className="w-6 h-6 text-blue-600" /> Professional Experience
              </h3>
              <div className="flex gap-4 p-1.5 bg-blue-50/50 rounded-xl border border-blue-100 mb-6">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, isExperienced: false }))}
                  className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all ${
                    !formData.isExperienced ? 'bg-white text-blue-600 shadow-md' : 'text-slate-500 hover:text-blue-600'
                  }`}
                >
                  Fresher
                </button>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, isExperienced: true }))}
                  className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all ${
                    formData.isExperienced ? 'bg-white text-blue-600 shadow-md' : 'text-slate-500 hover:text-blue-600'
                  }`}
                >
                  Experienced
                </button>
              </div>

              {formData.isExperienced && (
                <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-300">
                  <FormInput
                    label="Company Name"
                    name="companyName"
                    placeholder="Current or previous company"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    icon={Briefcase}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormInput
                      label="Designation"
                      name="designation"
                      placeholder="e.g. Software Engineer"
                      value={formData.designation}
                      onChange={handleInputChange}
                    />
                    <FormInput
                      label="Years of Experience"
                      name="yearsOfExp"
                      placeholder="e.g. 3 Years"
                      value={formData.yearsOfExp}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="bg-white/50 backdrop-blur-sm p-8 rounded-2xl border border-blue-100 shadow-sm space-y-6">
              <h3 className="text-xl font-semibold text-blue-900 flex items-center gap-2">
                <Wrench className="w-6 h-6 text-blue-600" /> Skills & Expertise
              </h3>
              <div className="space-y-6">
                <div className="flex gap-3">
                  <div className="flex-1">
                    <FormInput
                      label="Add Skills"
                      name="currentSkill"
                      placeholder="e.g. React, Node.js"
                      value={formData.currentSkill}
                      onChange={handleInputChange}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={addSkill}
                    className="mt-7 px-6 py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all h-[46px] shadow-md active:scale-95"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {formData.skills.map(skill => (
                    <span 
                      key={skill}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-white text-blue-700 rounded-xl text-sm font-medium border border-blue-100 group hover:bg-red-50 hover:text-red-700 hover:border-red-100 transition-all cursor-pointer shadow-sm"
                      onClick={() => removeSkill(skill)}
                    >
                      {skill}
                      <X className="w-4 h-4 opacity-70 group-hover:opacity-100" />
                    </span>
                  ))}
                  {formData.skills.length === 0 && (
                    <p className="text-slate-400 text-sm italic py-2">Add some skills to showcase your talent</p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div 
            key="step4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="bg-white/50 backdrop-blur-sm p-10 rounded-2xl border border-blue-100 shadow-sm text-center space-y-8">
              <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mx-auto ring-8 ring-blue-50/50 transform rotate-3">
                <Upload className="w-10 h-10" />
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-bold text-blue-900">Upload Your Resume</h3>
                <p className="text-slate-500 max-w-sm mx-auto">Get noticed by top recruiters by uploading your professional resume in PDF format.</p>
              </div>
              
              <div className="relative group max-w-md mx-auto">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setFormData(prev => ({ ...prev, resume: e.target.files[0] }))}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className={`p-10 border-2 border-dashed rounded-2xl transition-all duration-300 ${
                  formData.resume || savedData?.resumeFile ? 'border-green-400 bg-green-50/30' : 'border-blue-200 group-hover:border-blue-400 group-hover:bg-blue-50/30'
                }`}>
                  {formData.resume || savedData?.resumeFile ? (
                    <div className="flex flex-col items-center gap-3 text-green-700 font-bold">
                      <CheckCircle2 className="w-8 h-8" />
                      <span className="truncate max-w-[250px]">
                        {formData.resume instanceof File ? formData.resume.name : savedData?.resumeFile?.fileName || 'Resume Uploaded'}
                      </span>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="text-blue-600 font-bold text-lg">Choose File</div>
                      <div className="text-slate-400 text-sm font-medium">or drag & drop PDF here</div>
                    </div>
                  )}
                </div>
              </div>

              {formData.resume && (
                <div className="pt-6 border-t border-blue-50 animate-in fade-in zoom-in duration-500 max-w-md mx-auto">
                  <div className="flex items-center justify-between p-5 bg-white rounded-2xl border border-blue-100 shadow-sm">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-red-50 text-red-600 rounded-xl shadow-sm">
                        <FileText className="w-6 h-6" />
                      </div>
                      <div className="text-left">
                        <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter">Ready for submission</p>
                        <p className="text-sm font-bold text-slate-700 truncate max-w-[180px]">{formData.resume.name}</p>
                      </div>
                    </div>
                    <button 
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, resume: null }))}
                      className="p-2.5 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-xl transition-all active:scale-90"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  const isGlobalLoading = profileStatus === 'loading' || localLoading;

  if (profileStatus === 'loading' && !savedData?.address) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium animate-pulse">Loading your profile status...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col overflow-hidden">
      <div className="w-full px-6 py-6 flex-1 overflow-y-auto custom-scrollbar">
        <div className="max-w-4xl mx-auto pb-4">
          {/* Progress Header */}
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#1a3c8f] to-blue-500 bg-clip-text text-transparent mb-1">
            Finish Your Profile
          </h1>
          <p className="text-slate-500">Helping us find the perfect match for your career</p>
          
          <div className="mt-6 flex items-center justify-center gap-4">
            {steps.map((stepItem, idx) => {
              const StepIcon = stepItem.icon;
              const isCompleted = reduxStep > idx + 1;
              const isActive = reduxStep === idx + 1;
              
              return (
                <div key={idx} className="flex items-center">
                  <button 
                    onClick={() => idx + 1 < reduxStep && navigate(`/candidate/complete-profile/${idx + 1}`)}
                    disabled={idx + 1 >= reduxStep}
                    className={`flex flex-col items-center gap-2 group transition-all ${
                      idx + 1 < reduxStep ? 'cursor-pointer hover:scale-105' : 'cursor-default'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                      isCompleted ? 'bg-green-500 text-white' : 
                      isActive ? 'bg-[#1a3c8f] text-white shadow-lg shadow-blue-200 scale-110' : 
                      'bg-slate-100 text-slate-400'
                    }`}>
                      {isCompleted ? <CheckCircle2 className="w-6 h-6" /> : <StepIcon className="w-6 h-6" />}
                    </div>
                    <span className={`text-xs font-semibold uppercase tracking-wider transition-colors ${
                      isActive ? 'text-[#1a3c8f]' : 'text-slate-400'
                    }`}>
                      {stepItem.title.split(' ')[0]}
                    </span>
                  </button>
                  {idx < steps.length - 1 && (
                    <div className={`w-16 h-0.5 mx-4 transition-colors duration-500 ${
                      reduxStep > idx + 1 ? 'bg-green-500' : 'bg-slate-200'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Form Content */}
        <div className="min-h-[300px]">
          {showPayment ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-10"
            >
              <PaymentProcess 
                amount={1} 
                userType="CANDIDATE"
                onSuccess={handlePaymentSuccess}
              />
            </motion.div>
          ) : (
            <AnimatePresence mode="wait">
              {renderStep()}
            </AnimatePresence>
          )}
        </div>

        {/* Action Buttons */}
        {!showPayment && (
          <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-6">
            <button
              type="button"
              onClick={prevStep}
              disabled={reduxStep === 1 || isGlobalLoading}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium transition-all ${
                reduxStep === 1 
                  ? 'text-slate-300 cursor-not-allowed' 
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <ChevronLeft className="w-5 h-5" /> Previous
            </button>

            {reduxStep < 4 ? (
              <button
                type="button"
                onClick={nextStep}
                disabled={isGlobalLoading}
                className="flex items-center gap-2 px-8 py-2.5 bg-[#1a3c8f] text-white rounded-xl font-medium hover:bg-[#162f72] transition-all shadow-md active:scale-95 disabled:opacity-50"
              >
                {isGlobalLoading ? 'Saving...' : <>Next Step <ChevronRight className="w-5 h-5" /></>}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isGlobalLoading}
                className="flex items-center gap-2 px-8 py-2.5 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-all shadow-md active:scale-95 disabled:opacity-50"
              >
                {isGlobalLoading ? 'Completing...' : <>Complete Profile <CheckCircle2 className="w-5 h-5" /></>}
              </button>
            )}
          </div>
        )}
        </div>
      </div>
    </div>
  );
};

export default CandidateInfoDetails;
