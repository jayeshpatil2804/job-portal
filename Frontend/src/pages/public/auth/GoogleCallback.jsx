import React, { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { supabase } from '../../../utils/supabase'
import api from '../../../utils/api'
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import { setUser } from '../../../redux/slices/authSlice'

const GoogleCallback = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();
    const role = searchParams.get('role');
    const hasCalledSync = React.useRef(false);

    useEffect(() => {
        const handleCallback = async () => {
            if (hasCalledSync.current) return;
            hasCalledSync.current = true;
            
            try {
                // The supabase client will automatically exchange the code for a session
                const { data: { session }, error } = await supabase.auth.getSession();
                
                if (error) throw error;
                if (!session) {
                    throw new Error('No session found after Google login');
                }

                // Sync user data with our database
                const syncResponse = await api.post('/users/sync-google', {
                    email: session.user.email,
                    fullName: session.user.user_metadata?.full_name || session.user.user_metadata?.name || 'Google User',
                    role: role || 'CANDIDATE' // Default to CANDIDATE if role is missing
                });

                if (syncResponse.data.status === 'success') {
                    const authenticatedUser = syncResponse.data.user;
                    // Update Redux state
                    dispatch(setUser(authenticatedUser));

                    if (syncResponse.data.needsCompletion) {
                        navigate('/auth/complete-profile', { 
                            state: { 
                                user: authenticatedUser,
                                role: authenticatedUser.role 
                            },
                            replace: true
                        });
                    } else {
                        toast.success(`Successfully signed in as ${authenticatedUser.role === 'RECRUITER' ? 'Recruiter' : 'Candidate'}!`);
                        
                        // Role-specific redirection
                        if (authenticatedUser.role === 'RECRUITER') {
                            if (authenticatedUser.isProfileCompleted) {
                                navigate('/recruiter/dashboard', { replace: true });
                            } else {
                                navigate('/recruiter/complete-profile', { replace: true });
                            }
                        } else {
                            if (authenticatedUser.isProfileCompleted) {
                                navigate('/dashboard', { replace: true });
                            } else {
                                navigate('/candidate/complete-profile', { replace: true });
                            }
                        }
                    }
                }
            } catch (error) {
                console.error('Google Auth Error:', error);
                toast.error(error.message || 'Authentication failed');
                navigate('/login');
            }
        };

        handleCallback();
    }, [navigate, role]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 font-inter">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1a3c8f] mx-auto mb-4"></div>
                <h2 className="text-xl font-semibold text-gray-700">Verifying session...</h2>
                <p className="text-gray-500 mt-2">Please wait while we complete your sign-in.</p>
            </div>
        </div>
    )
}

export default GoogleCallback
