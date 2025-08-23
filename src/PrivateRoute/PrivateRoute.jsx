import React, { useContext, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../Provider/ContextProvider';

const PrivateRoute = ({ children }) => {
    const { user, loading: authLoading } = useContext(AuthContext);
    const [userRole, setUserRole] = useState(null);
    const [roleLoading, setRoleLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch user role from MongoDB HVUser collection
    useEffect(() => {
        const fetchUserRole = async () => {
            // Reset states
            setRoleLoading(true);
            setError(null);
            setUserRole(null);

            // If no user from Firebase, stop loading
            if (!user?.email) {
                console.log('🚫 No authenticated user found');
                setRoleLoading(false);
                return;
            }

            try {
                console.log('🔍 Fetching user role for email:', user.email);
                const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

                // Fetch user data from MongoDB HVUser collection
                const response = await fetch(`${API_BASE_URL}/api/user/${encodeURIComponent(user.email)}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const userData = await response.json();
                console.log('👤 User data received from HVUser collection:', userData);

                if (userData.success && userData.data) {
                    const role = userData.data.role;
                    setUserRole(role);
                    console.log('🔑 User role from MongoDB:', role);

                    if (role === 'admin') {
                        console.log('✅ Admin access granted');
                    } else {
                        console.log('🚫 Access denied - user role is:', role);
                    }
                } else {
                    console.log('❌ User not found in HVUser collection');
                    setError('User not found in database');
                    setUserRole(null);
                }
            } catch (error) {
                console.error('❌ Error fetching user role from HVUser collection:', error);
                setError(`Failed to verify user permissions: ${error.message}`);
                setUserRole(null);
            } finally {
                setRoleLoading(false);
            }
        };

        // Only fetch role if user is authenticated
        if (user && user.email) {
            fetchUserRole();
        } else if (!authLoading) {
            // If not loading and no user, stop role loading
            setRoleLoading(false);
        }
    }, [user, authLoading]);

    // Show loading spinner while Firebase auth or role verification is in progress
    if (authLoading || roleLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-800">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-white text-lg font-medium" style={{ fontFamily: "'Poppins', sans-serif" }}>
                        {authLoading ? 'Authenticating...' : 'Verifying admin permissions...'}
                    </p>
                    <p className="text-gray-400 text-sm mt-2">
                        {authLoading ? 'Checking Firebase authentication' : 'Checking user role from database'}
                    </p>
                </div>
            </div>
        );
    }

    // Check if user is authenticated with Firebase
    if (!user || !user.email) {
        console.log('🚫 No authenticated user, redirecting to login');
        return <Navigate to="/login" replace />;
    }

    // Check for errors during role verification
    if (error) {
        console.log('❌ Error occurred during role verification:', error);
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-800">
                <div className="text-center p-8">
                    <div className="text-red-500 text-6xl mb-4">⚠️</div>
                    <h2 className="text-white text-2xl font-bold mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
                        Access Verification Failed
                    </h2>
                    <p className="text-gray-300 mb-6" style={{ fontFamily: "'Poppins', sans-serif" }}>
                        {error}
                    </p>
                    <button
                        onClick={() => window.location.href = '/'}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                        style={{ fontFamily: "'Poppins', sans-serif" }}
                    >
                        Return to Home
                    </button>
                </div>
            </div>
        );
    }

    // Check if user has admin role in HVUser collection
    if (userRole !== 'admin') {
        console.log('🚫 Access denied - User role:', userRole, '| Required: admin');
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-800">
                <div className="text-center p-8">
                    <div className="text-red-500 text-6xl mb-4">🚫</div>
                    <h2 className="text-white text-2xl font-bold mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
                        Access Denied
                    </h2>
                    <p className="text-gray-300 mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                        You don't have admin privileges to access this page.
                    </p>
                    <p className="text-gray-400 text-sm mb-6" style={{ fontFamily: "'Poppins', sans-serif" }}>
                        Current role: {userRole || 'No role assigned'}
                    </p>
                    <button
                        onClick={() => window.location.href = '/'}
                        className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                        style={{ fontFamily: "'Poppins', sans-serif" }}
                    >
                        Return to Home
                    </button>
                </div>
            </div>
        );
    }

    // All checks passed - user is authenticated and has admin role
    console.log('✅ All security checks passed - granting admin access');
    console.log('👤 Authenticated user:', user.email);
    console.log('🔑 Verified admin role from HVUser collection');

    return children;
};

export default PrivateRoute;