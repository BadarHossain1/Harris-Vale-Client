import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BsEye, BsEyeSlash, BsArrowLeft, BsPerson, BsLock, BsGoogle } from 'react-icons/bs';
import { AuthContext } from '../Provider/ContextProvider';
import { toast } from 'react-toastify';

const Login = () => {
    const { Login: loginUser, GoogleSignIn, loading, setLoading } = useContext(AuthContext);
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear errors when user starts typing
        if (errors.general) {
            setErrors(prev => ({ ...prev, general: '' }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Clear any previous errors
        setErrors({});
        setIsSubmitting(true);
        setLoading(true);

        try {
            // Login user with Firebase Auth
            const result = await loginUser(formData.email, formData.password);
            console.log('Login successful:', result.user);

            // Clear form
            setFormData({
                email: '',
                password: ''
            });

            // Navigate to home page
            navigate('/');

        } catch (error) {
            console.error('Login error:', error);
            let errorMessage = 'Failed to login. Please try again.';

            // Handle specific Firebase errors
            if (error.code === 'auth/user-not-found') {
                errorMessage = 'No account found with this email. Please check your email or sign up.';
            } else if (error.code === 'auth/wrong-password') {
                errorMessage = 'Incorrect password. Please try again.';
            } else if (error.code === 'auth/invalid-email') {
                errorMessage = 'Invalid email address. Please enter a valid email.';
            } else if (error.code === 'auth/too-many-requests') {
                errorMessage = 'Too many failed attempts. Please try again later.';
            } else if (error.code === 'auth/invalid-credential') {
                errorMessage = 'Invalid email or password. Please check your credentials.';
            }

            setErrors({ general: errorMessage });
        } finally {
            setIsSubmitting(false);
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setIsSubmitting(true);
        setLoading(true);

        try {
            // Sign up with Google using Firebase Auth
            const result = await GoogleSignIn();
            console.log('Google sign up successful:', result.user);

            // Get user info from Google
            const googleUser = result.user;
            const userInfo = {
                name: googleUser.displayName || 'Google User',
                email: googleUser.email,
                phone: '', // Google doesn't provide phone by default
                imageUrl: googleUser.photoURL || '',
                role: 'user'
            };

            console.log('Google user info:', userInfo);

            // Save Google user to MongoDB database
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/newUser`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(userInfo)
                });

                const result = await response.json();
                console.log('Google user database save result:', result);

                if (result.success) {
                    console.log('✅ Google user successfully saved to database');
                }
            } catch (dbError) {
                console.error('❌ Google user database save error:', dbError);
            }

            toast.success('Google sign in successful! Welcome to Harris Valle!', {
                position: "top-right",
                autoClose: 4000,
            });

            // Navigate to home page or dashboard
            navigate('/');

        } catch (error) {
            console.error('Google sign up error:', error);
            let errorMessage = 'Failed to sign in with Google. Please try again.';

            if (error.code === 'auth/popup-closed-by-user') {
                errorMessage = 'Sign in was cancelled. Please try again.';
            } else if (error.code === 'auth/popup-blocked') {
                errorMessage = 'Popup was blocked. Please allow popups and try again.';
            }

            toast.error(errorMessage, {
                position: "top-right",
                autoClose: 5000,
            });
        } finally {
            setIsSubmitting(false);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    backgroundSize: '60px 60px'
                }}></div>
            </div>

            {/* Main Content */}
            <div className="flex items-center justify-center min-h-screen px-4 py-12">
                <div className="w-full max-w-md">
                    {/* Brand Logo */}
                    <div className="text-center mb-8">
                        <h1
                            className="text-4xl font-bold mb-2 tracking-wide"
                            style={{ fontFamily: "'Poppins', sans-serif" }}
                        >
                            HARRIS VALE
                        </h1>
                        <p
                            className="text-gray-400 text-sm"
                            style={{ fontFamily: "'Poppins', sans-serif" }}
                        >
                            Welcome back to premium menswear
                        </p>
                    </div>

                    {/* Login Form */}
                    <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 shadow-2xl">
                        <h2
                            className="text-2xl font-semibold mb-6 text-center"
                            style={{ fontFamily: "'Poppins', sans-serif" }}
                        >
                            Sign In
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* General Error Message */}
                            {errors.general && (
                                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 backdrop-blur-sm">
                                    <p className="text-red-400 text-sm font-medium" style={{ fontFamily: "'Poppins', sans-serif" }}>
                                        {errors.general}
                                    </p>
                                </div>
                            )}

                            {/* Email Field */}
                            <div className="space-y-2">
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-medium text-gray-300"
                                    style={{ fontFamily: "'Poppins', sans-serif" }}
                                >
                                    Email Address
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <BsPerson className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full pl-10 pr-4 py-3 bg-black/30 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-white/40 focus:bg-black/40 transition-all duration-300"
                                        style={{ fontFamily: "'Poppins', sans-serif" }}
                                        placeholder="Enter your email"
                                    />
                                </div>
                            </div>

                            {/* Password Field */}
                            <div className="space-y-2">
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-medium text-gray-300"
                                    style={{ fontFamily: "'Poppins', sans-serif" }}
                                >
                                    Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <BsLock className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        id="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full pl-10 pr-12 py-3 bg-black/30 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-white/40 focus:bg-black/40 transition-all duration-300"
                                        style={{ fontFamily: "'Poppins', sans-serif" }}
                                        placeholder="Enter your password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-white transition-colors"
                                    >
                                        {showPassword ?
                                            <BsEyeSlash className="h-5 w-5 text-gray-400" /> :
                                            <BsEye className="h-5 w-5 text-gray-400" />
                                        }
                                    </button>
                                </div>
                            </div>

                            {/* Remember Me & Forgot Password */}
                            <div className="flex items-center justify-between">
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        className="h-4 w-4 rounded border-white/20 bg-black/30 text-white focus:ring-white/20 focus:ring-offset-0"
                                    />
                                    <span
                                        className="ml-2 text-sm text-gray-300"
                                        style={{ fontFamily: "'Poppins', sans-serif" }}
                                    >
                                        Remember me
                                    </span>
                                </label>
                                <Link
                                    to="/forgot-password"
                                    className="text-sm text-white hover:text-gray-300 transition-colors"
                                    style={{ fontFamily: "'Poppins', sans-serif" }}
                                >
                                    Forgot password?
                                </Link>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading || isSubmitting}
                                className={`w-full py-3 px-4 rounded-xl font-medium transition-all duration-300 ${loading || isSubmitting
                                    ? 'bg-gray-600 cursor-not-allowed'
                                    : 'bg-white text-black hover:bg-gray-100 transform hover:scale-[1.02]'
                                    } shadow-lg`}
                                style={{ fontFamily: "'Poppins', sans-serif" }}
                            >
                                {loading || isSubmitting ? 'Signing In...' : 'Sign In'}
                            </button>
                        </form>

                        {/* Divider */}
                        <div className="mt-6 mb-6">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-white/20"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span
                                        className="px-2 bg-transparent text-gray-400"
                                        style={{ fontFamily: "'Poppins', sans-serif" }}
                                    >
                                        Or continue with
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Google Login Button */}
                        {/* Google Error Message */}
                        {errors.google && (
                            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 backdrop-blur-sm mb-4">
                                <p className="text-red-400 text-sm font-medium" style={{ fontFamily: "'Poppins', sans-serif" }}>
                                    {errors.google}
                                </p>
                            </div>
                        )}

                        <button
                            type="button"
                            onClick={handleGoogleLogin}
                            disabled={loading || isSubmitting}
                            className="w-full py-3 px-4 bg-white/10 border border-white/20 rounded-xl font-medium text-white hover:bg-white/20 hover:border-white/30 transition-all duration-300 transform hover:scale-[1.02] backdrop-blur-sm shadow-lg flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed"
                            style={{ fontFamily: "'Poppins', sans-serif" }}
                        >
                            <BsGoogle className="text-white" size={20} />
                            <span>{loading || isSubmitting ? 'Connecting...' : 'Sign in with Google'}</span>
                        </button>

                        {/* Divider */}
                        <div className="mt-6 mb-6">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-white/20"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span
                                        className="px-2 bg-transparent text-gray-400"
                                        style={{ fontFamily: "'Poppins', sans-serif" }}
                                    >
                                        Or
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Sign Up Section */}
                        <div className="text-center space-y-3">
                            <p
                                className="text-gray-400 text-sm"
                                style={{ fontFamily: "'Poppins', sans-serif" }}
                            >
                                New to Harris Valle? Join our exclusive community and discover premium menswear collections.
                            </p>
                            <Link
                                to="/signup"
                                className="inline-flex items-center justify-center w-full py-3 px-4 bg-transparent border border-white/20 rounded-xl font-medium text-white hover:bg-white/5 hover:border-white/30 transition-all duration-300 transform hover:scale-[1.02]"
                                style={{ fontFamily: "'Poppins', sans-serif" }}
                            >
                                Create Your Account
                            </Link>
                        </div>
                    </div>

                    {/* Footer Text */}
                    <div className="text-center mt-8">
                        <p
                            className="text-gray-500 text-xs"
                            style={{ fontFamily: "'Poppins', sans-serif" }}
                        >
                            © 2025 Harris Vale. All rights reserved.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;