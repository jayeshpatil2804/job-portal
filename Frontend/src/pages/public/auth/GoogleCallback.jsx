import React, { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "../../../utils/supabase";
import api from "../../../utils/api";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setUser } from "../../../redux/slices/authSlice";

const GoogleCallback = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();
    const role = searchParams.get("role");

    const hasRun = useRef(false);

    useEffect(() => {
        const handleCallback = async () => {
            if (hasRun.current) return;
            hasRun.current = true;

            try {
                let session = null;

                // Try multiple times to get session (Supabase sometimes delays)
                for (let i = 0; i < 5; i++) {
                    const { data, error } = await supabase.auth.getSession();

                    if (error) throw error;

                    if (data?.session) {
                        session = data.session;
                        break;
                    }

                    await new Promise((resolve) => setTimeout(resolve, 500));
                }

                if (!session) {
                    throw new Error("Session not found after Google login");
                }

                // Sync user with backend
                const syncResponse = await api.post("/users/sync-google", {
                    email: session.user.email,
                    fullName:
                        session.user.user_metadata?.full_name ||
                        session.user.user_metadata?.name ||
                        "Google User",
                    role: role || "CANDIDATE",
                });

                if (syncResponse.data.status !== "success") {
                    throw new Error("User sync failed");
                }

                const authenticatedUser = syncResponse.data.user;

                dispatch(setUser(authenticatedUser));

                const needsCompletion = syncResponse.data.needsCompletion;

                if (needsCompletion) {
                    navigate("/auth/complete-profile", {
                        state: {
                            user: authenticatedUser,
                            role: authenticatedUser.role,
                        },
                        replace: true,
                    });
                    return;
                }

                toast.success(
                    `Signed in as ${authenticatedUser.role === "RECRUITER" ? "Recruiter" : "Candidate"
                    }`
                );

                // Role based redirect
                if (authenticatedUser.role === "RECRUITER") {
                    if (authenticatedUser.isProfileCompleted) {
                        navigate("/recruiter/dashboard", { replace: true });
                    } else {
                        navigate("/recruiter/complete-profile", { replace: true });
                    }
                } else {
                    if (authenticatedUser.isProfileCompleted) {
                        navigate("/dashboard", { replace: true });
                    } else {
                        navigate("/candidate/complete-profile", { replace: true });
                    }
                }
            } catch (err) {
                console.error("Google Auth Error:", err);
                toast.error("Google authentication failed");
                navigate("/login", { replace: true });
            }
        };

        handleCallback();
    }, [navigate, role, dispatch]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 font-inter">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1a3c8f] mx-auto mb-4"></div>
                <h2 className="text-xl font-semibold text-gray-700">
                    Completing Google Sign-In...
                </h2>
                <p className="text-gray-500 mt-2">
                    Please wait while we verify your account.
                </p>
            </div>
        </div>
    );
};

export default GoogleCallback;