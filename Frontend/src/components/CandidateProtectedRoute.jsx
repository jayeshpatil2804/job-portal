import React, { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProfileStatus } from '../redux/actions/profileActions';

const CandidateProtectedRoute = ({ onlyAuth = false }) => {
    const dispatch = useDispatch();
    const { 
        isProfileCompleted, 
        isPaid,
        status: profileStatus,
        error 
    } = useSelector(state => state.profile);

    useEffect(() => {
        if (profileStatus === 'idle') {
            dispatch(fetchProfileStatus());
        }
    }, [dispatch, profileStatus]);

    if (profileStatus === 'loading' || profileStatus === 'idle') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-slate-500 font-medium animate-pulse">Verifying access...</p>
                </div>
            </div>
        );
    }

    // If fetch failed with 401, they are not authenticated (or the interceptor already redirected)
    if (profileStatus === 'failed' && (error === '401' || error?.includes('401'))) {
        return <Navigate to="/candidate/login" replace />;
    }

    // If we only care about auth, return the outlet
    if (onlyAuth) {
        return <Outlet />;
    }

    // If profile is not completed, they must complete it
    if (!isProfileCompleted) {
        return <Navigate to="/candidate/complete-profile" replace />;
    }

    // If profile is completed, allow access (ActivationDialog will handle payment state on dashboard)
    return <Outlet />;
};

export default CandidateProtectedRoute;
