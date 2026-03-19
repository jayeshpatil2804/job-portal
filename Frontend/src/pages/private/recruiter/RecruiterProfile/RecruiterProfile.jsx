import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import RecruiterLayout from '../../../../components/RecruiterLayout';
import { 
    Building2, MapPin, Globe, CreditCard, 
    FileCheck, CheckCircle2, AlertCircle, 
    Save, User, Mail, Phone
} from 'lucide-react';
import { 
    fetchRecruiterProfileStatus, 
    updateRecruiterProfile 
} from '../../../../redux/actions/recruiterProfileActions';
import FormInput from '../../../../components/FormInput';
import toast from 'react-hot-toast';

const RecruiterProfile = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { 
        data: profile, 
        loading: profileLoading, 
        status: profileStatus 
    } = useSelector((state) => state.recruiterProfile);

    const [activeTab, setActiveTab] = useState('company');
    const [localLoading, setLocalLoading] = useState(false);
    const [formData, setFormData] = useState({
        companyName: '',
        industry: '',
        website: '',
        address: '',
        city: '',
        state: '',
        gstNumber: ''
    });

    useEffect(() => {
        if (profileStatus === 'idle') {
            dispatch(fetchRecruiterProfileStatus());
        }
    }, [dispatch, profileStatus]);

    useEffect(() => {
        if (profile) {
            setFormData({
                companyName: profile.companyName || '',
                industry: profile.industry || '',
                website: profile.website || '',
                address: profile.address || '',
                city: profile.city || '',
                state: profile.state || '',
                gstNumber: profile.gstNumber || ''
            });
        }
    }, [profile]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLocalLoading(true);
        try {
            await dispatch(updateRecruiterProfile({
                ...formData
            })).unwrap();
            toast.success('Profile updated successfully');
        } catch (error) {
            toast.error(error || 'Failed to update profile');
        } finally {
            setLocalLoading(false);
        }
    };

    const tabs = [
        { id: 'company', label: 'Company Info', icon: Building2 },
        { id: 'address', label: 'Address', icon: MapPin },
        { id: 'verification', label: 'Verification', icon: FileCheck },
    ];

    if (profileLoading && !profile) {
        return (
            <RecruiterLayout>
                <div className="flex items-center justify-center h-64">
                    <div className="w-8 h-8 border-4 border-[#1a3c8f] border-t-transparent rounded-full animate-spin"></div>
                </div>
            </RecruiterLayout>
        );
    }

    return (
        <RecruiterLayout>
            <div className="max-w-5xl mx-auto space-y-8 pb-12">
                {/* Header Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="h-32 bg-gradient-to-r from-[#1a3c8f] to-blue-600"></div>
                    <div className="px-8 pb-8 -mt-12">
                        <div className="flex flex-col md:flex-row md:items-end gap-6">
                            <div className="relative">
                                <div className="w-32 h-32 rounded-2xl bg-white p-2 shadow-lg">
                                    <div className="w-full h-full rounded-xl bg-blue-50 flex items-center justify-center text-[#1a3c8f]">
                                        <Building2 size={48} />
                                    </div>
                                </div>
                            </div>
                            <div className="flex-1 min-w-0">
                                <h1 className="text-3xl font-extrabold text-gray-900 truncate">
                                    {profile?.companyName || 'Set Company Name'}
                                </h1>
                                <p className="text-gray-500 font-medium flex items-center gap-2 mt-1">
                                    <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs">RECRUITER</span>
                                    {profile?.industry || 'Industry not set'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Contact Details */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <User size={20} className="text-[#1a3c8f]" /> Personal Details
                            </h2>
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center shrink-0">
                                        <User size={18} className="text-gray-400" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Full Name</p>
                                        <p className="text-sm font-semibold text-gray-700">{user?.fullName || 'N/A'}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center shrink-0">
                                        <Mail size={18} className="text-gray-400" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Email Address</p>
                                        <p className="text-sm font-semibold text-gray-700 truncate">{user?.email || 'N/A'}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center shrink-0">
                                        <Phone size={18} className="text-gray-400" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Mobile</p>
                                        <p className="text-sm font-semibold text-gray-700">{user?.mobile || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                         <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <AlertCircle size={20} className="text-[#f97316]" /> Verification Status
                            </h2>
                            <div className={`p-4 rounded-xl border flex items-center gap-3 ${profile?.isProfileCompleted ? 'bg-green-50 border-green-100' : 'bg-orange-50 border-orange-100'}`}>
                                {profile?.isProfileCompleted ? (
                                    <CheckCircle2 className="text-green-500 shrink-0" size={24} />
                                ) : (
                                    <AlertCircle className="text-orange-500 shrink-0" size={24} />
                                )}
                                <div>
                                    <p className={`text-sm font-bold ${profile?.isProfileCompleted ? 'text-green-700' : 'text-orange-700'}`}>
                                        {profile?.isProfileCompleted ? 'Business Verified' : 'Under Review'}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-0.5">
                                        {profile?.isProfileCompleted ? 'Your business is allowed to post jobs.' : 'Complete all steps to start hiring.'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Main Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            {/* Tabs */}
                            <div className="flex border-b border-gray-100 overflow-x-auto">
                                {tabs.map((tab) => {
                                    const Icon = tab.icon;
                                    const isActive = activeTab === tab.id;
                                    return (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`flex-1 flex items-center justify-center gap-2 py-4 px-6 text-sm font-bold transition-all border-b-2 whitespace-nowrap ${
                                                isActive 
                                                ? 'border-[#1a3c8f] text-[#1a3c8f] bg-blue-50/30' 
                                                : 'border-transparent text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                                            }`}
                                        >
                                            <Icon size={18} /> {tab.label}
                                        </button>
                                    );
                                })}
                            </div>

                            <div className="p-8">
                                <form onSubmit={handleSubmit} className="space-y-8">
                                    {activeTab === 'company' && (
                                        <div className="space-y-6">
                                            <FormInput
                                                label="Company Legal Name"
                                                name="companyName"
                                                value={formData.companyName}
                                                onChange={handleInputChange}
                                                placeholder="Enter company name"
                                                icon={Building2}
                                            />
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <FormInput
                                                    label="Industry Type"
                                                    name="industry"
                                                    value={formData.industry}
                                                    onChange={handleInputChange}
                                                    placeholder="e.g. Textiles, IT"
                                                    icon={Building2}
                                                />
                                                <FormInput
                                                    label="Website URL"
                                                    name="website"
                                                    value={formData.website}
                                                    onChange={handleInputChange}
                                                    placeholder="https://example.com"
                                                    icon={Globe}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === 'address' && (
                                        <div className="space-y-6">
                                            <FormInput
                                                label="Business Address"
                                                name="address"
                                                value={formData.address}
                                                onChange={handleInputChange}
                                                placeholder="Street, Building, etc."
                                                icon={MapPin}
                                            />
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <FormInput
                                                    label="City"
                                                    name="city"
                                                    value={formData.city}
                                                    onChange={handleInputChange}
                                                    placeholder="Enter city"
                                                />
                                                <FormInput
                                                    label="State"
                                                    name="state"
                                                    value={formData.state}
                                                    onChange={handleInputChange}
                                                    placeholder="Enter state"
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === 'verification' && (
                                        <div className="space-y-6">
                                            <FormInput
                                                label="GST Number"
                                                name="gstNumber"
                                                value={formData.gstNumber}
                                                onChange={handleInputChange}
                                                placeholder="Enter GST number"
                                                icon={CreditCard}
                                            />
                                            <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-100">
                                                <p className="text-xs text-blue-800 font-medium leading-relaxed">
                                                    Your documents (GST Certificate, MSME, etc.) are already uploaded during onboarding. To update documents, please contact support.
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex justify-end border-t border-gray-100 pt-8">
                                        <button
                                            type="submit"
                                            disabled={localLoading}
                                            className="flex items-center gap-2 px-8 py-3 bg-[#1a3c8f] text-white rounded-xl font-bold hover:bg-blue-800 transition-all shadow-lg shadow-blue-200 active:scale-95 disabled:opacity-50"
                                        >
                                            <Save size={20} />
                                            {localLoading ? 'Updating...' : 'Save Changes'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </RecruiterLayout>
    );
};

export default RecruiterProfile;
