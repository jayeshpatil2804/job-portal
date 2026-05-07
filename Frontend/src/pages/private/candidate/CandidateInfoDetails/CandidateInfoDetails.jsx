import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, MapPin, GraduationCap, Briefcase, 
  Wrench, FileText, ChevronRight, ChevronLeft, 
  Upload, X, CheckCircle2, Star, Sparkles, Building2, ShieldCheck
} from 'lucide-react';
import FormInput from '../../../../components/FormInput';
import toast from 'react-hot-toast';
import { 
  fetchProfileStatus, 
  updateProfile 
} from '../../../../redux/actions/profileActions';

import { setStep } from '../../../../redux/slices/profileSlice';

const CandidateInfoDetails = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { step } = useParams();
  
  const [localLoading, setLocalLoading] = useState(false);
  
  const { 
    data: savedData, 
    currentStep: reduxStep, 
    isProfileCompleted, 
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
    department: '',
    yearsOfExp: '',
    // Skills
    skills: [],
    currentSkill: '',
    // Resume
    resume: null
  });

  const steps = [
    { title: 'Personal', icon: User, desc: 'Contact Info' },
    { title: 'Education', icon: GraduationCap, desc: 'Academic History' },
    { title: 'Experience', icon: Briefcase, desc: 'Work & Skills' }
  ];

  // Sync saved data to local form when fetch succeeds
  useEffect(() => {
    if (profileStatus === 'succeeded' && savedData) {
      if (isProfileCompleted) {
        navigate('/profile', { replace: true });
        return;
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
      if (!urlStep || urlStep < 1 || urlStep > 3) {
        navigate(`/candidate/complete-profile/${reduxStep || 1}`, { replace: true });
      }
    }
  }, [profileStatus, savedData, isProfileCompleted, navigate, reduxStep, step]);

  // Update step in Redux when URL step changes
  useEffect(() => {
    const urlStep = parseInt(step);
    if (urlStep >= 1 && urlStep <= 3) {
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
        if (formData.isExperienced && (!formData.companyName || !formData.department || !formData.yearsOfExp)) {
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
      const nextS = Math.min(reduxStep + 1, 3);
      
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
    setLocalLoading(true);
    try {
      const { currentSkill, resume, ...submitData } = formData;
      
      await dispatch(updateProfile({
        ...submitData,
        isProfileCompleted: true,
        onboardingStep: 3
      })).unwrap();
      
      toast.success('Profile saved! Redirecting to dashboard...');
      navigate('/profile', { replace: true });
    } catch (error) {
      toast.error(error || 'Failed to update profile');
    } finally {
      setLocalLoading(false);
    }
  };

  const cardStyles = "bg-white p-10 rounded-[3rem] shadow-xl shadow-blue-900/5 border border-gray-50 relative overflow-hidden"

  const renderStep = () => {
    switch (reduxStep) {
      case 1:
        return (
          <motion.div 
            key="step1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            <div className={cardStyles}>
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full -mr-32 -mt-32 opacity-40 blur-3xl" />
              <div className="relative space-y-8">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-[#1a3c8f] text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-900/20">
                    <MapPin size={28} />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-2xl font-black text-gray-900 tracking-tight">Personal Details</h3>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Where are you located?</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-8">
                  <FormInput
                    label="Permanent Address"
                    name="address"
                    placeholder="Street name, Area, House No..."
                    value={formData.address}
                    onChange={handleInputChange}
                    icon={MapPin}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div 
            key="step2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            <div className={cardStyles}>
              <div className="absolute top-0 right-0 w-64 h-64 bg-purple-50 rounded-full -mr-32 -mt-32 opacity-40 blur-3xl" />
              <div className="relative space-y-8">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-purple-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-purple-900/20">
                    <GraduationCap size={28} />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-2xl font-black text-gray-900 tracking-tight">Academic Info</h3>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Tell us about your education</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-8">
                  <FormInput
                    label="Highest Qualification"
                    name="qualification"
                    placeholder="e.g. B.Tech in Computer Science"
                    value={formData.qualification}
                    onChange={handleInputChange}
                    icon={GraduationCap}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div 
            key="step3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            <div className={cardStyles}>
              <div className="absolute top-0 right-0 w-64 h-64 bg-orange-50 rounded-full -mr-32 -mt-32 opacity-40 blur-3xl" />
              <div className="relative space-y-8">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-orange-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-orange-900/20">
                    <Briefcase size={28} />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-2xl font-black text-gray-900 tracking-tight">Work Experience</h3>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Share your professional journey</p>
                  </div>
                </div>

                <div className="flex p-1.5 bg-gray-50 rounded-2xl border border-gray-100 max-w-md">
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, isExperienced: false }))}
                    className={`flex-1 py-3 px-6 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                      !formData.isExperienced ? 'bg-white text-[#1a3c8f] shadow-lg' : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    Fresher
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, isExperienced: true }))}
                    className={`flex-1 py-3 px-6 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                      formData.isExperienced ? 'bg-white text-[#1a3c8f] shadow-lg' : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    Experienced
                  </button>
                </div>

                <AnimatePresence mode="wait">
                  {formData.isExperienced && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-8 overflow-hidden"
                    >
                      <FormInput
                        label="Company Name"
                        name="companyName"
                        placeholder="Current or previous company"
                        value={formData.companyName}
                        onChange={handleInputChange}
                        icon={Building2}
                      />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <FormInput
                          label="Department"
                          name="department"
                          placeholder="e.g. IT or Production"
                          value={formData.department}
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
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className={cardStyles}>
              <div className="relative space-y-8">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-900/20">
                    <Wrench size={28} />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-2xl font-black text-gray-900 tracking-tight">Skills & Talent</h3>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">What are you good at?</p>
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="flex gap-4 items-end">
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
                      className="h-[52px] px-8 bg-gray-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-black transition-all shadow-xl active:scale-95"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {formData.skills.map(skill => (
                      <motion.span 
                        layout
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        key={skill}
                        className="inline-flex items-center gap-3 px-6 py-3 bg-white text-gray-900 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-gray-100 group hover:border-red-100 hover:text-red-600 transition-all cursor-pointer shadow-sm"
                        onClick={() => removeSkill(skill)}
                      >
                        {skill}
                        <X size={14} className="opacity-40 group-hover:opacity-100 transition-opacity" />
                      </motion.span>
                    ))}
                    {formData.skills.length === 0 && (
                      <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest italic py-2 opacity-50">Add some skills to unlock opportunities</p>
                    )}
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

  if (profileStatus === 'loading' && !savedData?.address) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white space-y-6">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-blue-50 rounded-full" />
          <div className="w-20 h-20 border-4 border-[#1a3c8f] border-t-transparent rounded-full animate-spin absolute top-0" />
        </div>
        <div className="text-center space-y-2">
          <p className="text-gray-900 font-black uppercase tracking-[0.3em] text-xs">Initializing Session</p>
          <p className="text-gray-400 font-bold text-[10px] animate-pulse">Synchronizing cloud data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col overflow-hidden">
      <div className="w-full px-6 py-12 flex-1 overflow-y-auto custom-scrollbar">
        <div className="max-w-[1100px] mx-auto pb-10">
          
          {/* Header & Steps */}
          <div className="mb-16 grid grid-cols-1 lg:grid-cols-2 gap-10 items-end">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 text-[#1a3c8f] rounded-full text-[10px] font-black uppercase tracking-widest">
                <Sparkles size={12} />
                Profile Setup
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight leading-tight">
                Unlock Your <br/> <span className="text-[#1a3c8f]">Career Potential.</span>
              </h1>
              <p className="text-gray-400 font-bold text-sm max-w-[400px]">Complete your profile to access elite opportunities across the textile ecosystem.</p>
            </div>

            <div className="flex items-center justify-between bg-gray-50 p-6 rounded-[2.5rem] border border-gray-100">
              {steps.map((stepItem, idx) => {
                const StepIcon = stepItem.icon;
                const isCompleted = reduxStep > idx + 1;
                const isActive = reduxStep === idx + 1;
                
                return (
                  <React.Fragment key={idx}>
                    <div className="flex flex-col items-center gap-3 relative px-2">
                       <motion.button 
                        whileHover={idx + 1 < reduxStep ? { scale: 1.1 } : {}}
                        whileTap={idx + 1 < reduxStep ? { scale: 0.9 } : {}}
                        onClick={() => idx + 1 < reduxStep && navigate(`/candidate/complete-profile/${idx + 1}`)}
                        disabled={idx + 1 >= reduxStep}
                        className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 relative ${
                          isCompleted ? 'bg-green-500 text-white shadow-lg shadow-green-500/20' : 
                          isActive ? 'bg-[#1a3c8f] text-white shadow-2xl shadow-blue-900/30' : 
                          'bg-white text-gray-300 border border-gray-100'
                        }`}
                      >
                        {isCompleted ? <CheckCircle2 size={24} /> : <StepIcon size={24} />}
                        {isActive && (
                           <motion.div 
                              layoutId="activeGlow"
                              className="absolute -inset-2 bg-blue-400/10 rounded-3xl -z-10 blur-xl"
                           />
                        )}
                      </motion.button>
                      <div className="text-center">
                        <p className={`text-[9px] font-black uppercase tracking-widest ${isActive ? 'text-[#1a3c8f]' : 'text-gray-400'}`}>
                          {stepItem.title}
                        </p>
                      </div>
                    </div>
                    {idx < steps.length - 1 && (
                      <div className="flex-1 h-[2px] bg-gray-100 mx-2 relative overflow-hidden">
                        <motion.div 
                          className="absolute inset-0 bg-green-500 origin-left"
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: reduxStep > idx + 1 ? 1 : 0 }}
                          transition={{ duration: 0.8 }}
                        />
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          </div>

          {/* Step Form Content */}
          <AnimatePresence mode="wait">
            {renderStep()}
          </AnimatePresence>

          {/* Action Buttons */}
          <div className="mt-12 flex items-center justify-between max-w-4xl border-t border-gray-100 pt-10">
              <button
                type="button"
                onClick={prevStep}
                disabled={reduxStep === 1 || isGlobalLoading}
                className={`flex items-center gap-4 px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all ${
                  reduxStep === 1 
                    ? 'text-gray-200 cursor-not-allowed' 
                    : 'text-gray-400 hover:text-[#1a3c8f] hover:bg-blue-50'
                }`}
              >
                <ChevronLeft size={20} /> Back
              </button>

              {reduxStep < 3 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={isGlobalLoading}
                  className="flex items-center gap-4 px-10 py-5 bg-[#1a3c8f] text-white rounded-[2rem] font-black text-[11px] uppercase tracking-[0.2em] shadow-2xl shadow-blue-900/30 hover:bg-blue-800 transition-all active:scale-95 disabled:opacity-50"
                >
                  {isGlobalLoading ? 'Processing...' : <>Continue Journey <ChevronRight size={20} /></>}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isGlobalLoading}
                  className="flex items-center gap-4 px-10 py-5 bg-green-600 text-white rounded-[2rem] font-black text-[11px] uppercase tracking-[0.2em] shadow-2xl shadow-green-900/30 hover:bg-green-700 transition-all active:scale-95 disabled:opacity-50"
                >
                  {isGlobalLoading ? 'Submitting...' : <>Finalize Profile <Sparkles size={20} /></>}
                </button>
              )}
            </div>

          <div className="mt-20 flex flex-wrap items-center justify-center gap-12 opacity-50 grayscale contrast-125">
             <div className="flex items-center gap-3">
                <ShieldCheck size={20} className="text-blue-900" />
                <span className="text-[10px] font-black uppercase tracking-widest text-[#1a3c8f]">Secure Encryption</span>
             </div>
             <div className="flex items-center gap-3">
                <Star size={20} className="text-blue-900" />
                <span className="text-[10px] font-black uppercase tracking-widest text-[#1a3c8f]">Elite Networking</span>
             </div>
             <div className="flex items-center gap-3">
                <Briefcase size={20} className="text-blue-900" />
                <span className="text-[10px] font-black uppercase tracking-widest text-[#1a3c8f]">Career Growth</span>
             </div>
          </div>
      </div>
    </div>
  );
};

export default CandidateInfoDetails;
