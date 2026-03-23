import React, { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRecruiterProfileStatus } from '../redux/actions/recruiterProfileActions';

const RecruiterProtectedRoute = ({ onlyAuth = false }) => {
    const dispatch = useDispatch();
    const { 
        isProfileCompleted, 
        isPaid,
        status: profileStatus,
        error 
    } = useSelector(state => state.recruiterProfile);
    const { user } = useSelector(state => state.auth);

    useEffect(() => {
        if (profileStatus === 'idle' && user?.role === 'RECRUITER') {
            dispatch(fetchRecruiterProfileStatus());
        }
    }, [dispatch, profileStatus, user]);

    // Handle authentication check (Recruiter specific)
    if (!user || user.role !== 'RECRUITER') {
        return <Navigate to="/recruiter/login" replace />; 
    }

    if (profileStatus === 'loading' || profileStatus === 'idle') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-blue-900 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-slate-500 font-medium animate-pulse">Verifying business access...</p>
                </div>
            </div>
        );
    }

    if (profileStatus === 'failed' && (error === '401' || error?.includes('401'))) {
        return <Navigate to="/recruiter/login" replace />;
    }

    if (onlyAuth) {
        return <Outlet />;
    }

    if (!isProfileCompleted) {
        return <Navigate to="/recruiter/complete-profile" replace />;
    }

    // If profile is completed but NOT paid, redirect to payment step (onboarding step 4)
    if (!isPaid) {
        return <Navigate to="/recruiter/complete-profile/4" replace />;
    }

    return <Outlet />;
};

export default RecruiterProtectedRoute;
