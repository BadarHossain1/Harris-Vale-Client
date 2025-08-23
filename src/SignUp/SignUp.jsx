import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BsEye, BsEyeSlash, BsGoogle, BsArrowLeft, BsCloudUpload, BsX, BsImage } from 'react-icons/bs';
import { AuthContext } from '../Provider/ContextProvider';
import { toast } from 'react-toastify';

const SignUp = () => {
    const { registerUser, updateUserProfile, GoogleSignIn, loading, setLoading } = useContext(AuthContext);
    const navigate = useNavigate();

    // ImgBB API configuration
    const IMGBB_API_KEY = '749194be549fa89d8fae32a3ac4ee723';

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        imageLink: '',
        password: '',
        confirmPassword: ''
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // New states for image upload
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [isUploadingImage, setIsUploadingImage] = useState(false);
    const [dragActive, setDragActive] = useState(false);

    // Function to upload image to ImgBB
    const uploadImageToImgBB = async (file) => {
        const formData = new FormData();
        formData.append('image', file);

        try {
            setIsUploadingImage(true);
            const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (result.success) {
                return result.data.url;
            } else {
                throw new Error('Failed to upload image');
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            toast.error('Failed to upload image. Please try again.');
            throw error;
        } finally {
            setIsUploadingImage(false);
        }
    };

    // Handle file selection
    const handleFileSelect = async (file) => {
        if (!file) return;

        // Validate file type
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            toast.error('Please select a valid image file (JPEG, PNG, GIF, WebP)');
            return;
        }

        // Validate file size (max 10MB)
        const maxSize = 10 * 1024 * 1024; // 10MB
        if (file.size > maxSize) {
            toast.error('Image size should be less than 10MB');
            return;
        }

        setImageFile(file);

        // Create preview
        const reader = new FileReader();
        reader.onload = (e) => {
            setImagePreview(e.target.result);
        };
        reader.readAsDataURL(file);

        try {
            // Upload to ImgBB
            const imageUrl = await uploadImageToImgBB(file);

            // Update form data with the ImgBB URL
            setFormData(prev => ({
                ...prev,
                imageLink: imageUrl
            }));

            toast.success('Image uploaded successfully!');
        } catch (error) {
            // Reset on error
            console.error('Image upload failed:', error);
            setImageFile(null);
            setImagePreview('');
            setFormData(prev => ({
                ...prev,
                imageLink: ''
            }));
        }
    };

    // Handle drag events
    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    // Handle drop event
    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileSelect(e.dataTransfer.files[0]);
        }
    };

    // Handle file input change
    const handleFileInputChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            handleFileSelect(e.target.files[0]);
        }
    };

    // Remove selected image
    const removeImage = () => {
        setImageFile(null);
        setImagePreview('');
        setFormData(prev => ({
            ...prev,
            imageLink: ''
        }));
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) newErrors.name = 'Name is required';
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }
        if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }
        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        setLoading(true);

        try {
            // Create user with Firebase Auth
            const result = await registerUser(formData.email, formData.password);
            console.log('User created:', result.user);

            // Update user profile with name and image
            await updateUserProfile(formData.name, formData.imageLink || '');

            // Store additional user info in MongoDB
            const userInfo = {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                imageUrl: formData.imageLink || '',
                role: 'user'
            };

            console.log('User info to be saved:', userInfo);

            // Save to MongoDB database
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/newUser`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(userInfo)
                });

                const result = await response.json();
                console.log('Database save result:', result);

                if (result.success) {
                    console.log('✅ User successfully saved to database');
                } else {
                    console.log('⚠️ Database save issue:', result.message);
                }
            } catch (dbError) {
                console.error('❌ Database save error:', dbError);
            }

            // Reset form on success
            setFormData({
                name: '',
                email: '',
                phone: '',
                imageLink: '',
                password: '',
                confirmPassword: ''
            });

            // Reset image states
            setImageFile(null);
            setImagePreview('');
            setIsUploadingImage(false);


            // Navigate to home page or dashboard
            navigate('/');

        } catch (error) {
            console.error('Sign up error:', error);
            let errorMessage = 'Failed to create account. Please try again.';

            // Handle specific Firebase errors
            if (error.code === 'auth/email-already-in-use') {
                errorMessage = 'This email is already registered. Please use a different email or try logging in.';
            } else if (error.code === 'auth/weak-password') {
                errorMessage = 'Password is too weak. Please choose a stronger password.';
            } else if (error.code === 'auth/invalid-email') {
                errorMessage = 'Invalid email address. Please enter a valid email.';
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

    const handleGoogleSignUp = async () => {
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

            toast.success('Google sign up successful! Welcome to Harris Valle!', {
                position: "top-right",
                autoClose: 4000,
            });

            // Navigate to home page or dashboard
            navigate('/');

        } catch (error) {
            console.error('Google sign up error:', error);
            let errorMessage = 'Failed to sign up with Google. Please try again.';

            if (error.code === 'auth/popup-closed-by-user') {
                errorMessage = 'Sign up was cancelled. Please try again.';
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
        <div className="min-h-screen bg-black flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-800 opacity-50"></div>

            <div className="relative max-w-md w-full space-y-8">
                {/* Header */}
                <div className="text-center">
                    <h2 className="text-4xl font-bold text-white mb-2">
                        Join Harris Valle
                    </h2>
                    <p className="text-gray-400">
                        Create your account and start your style journey
                    </p>
                </div>

                {/* Sign Up Form */}
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        {/* Name Field */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                                Full Name
                            </label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                className={`w-full px-4 py-3 bg-white/10 border ${errors.name ? 'border-red-500' : 'border-gray-600'
                                    } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white transition-all duration-200 backdrop-blur-sm`}
                                placeholder="John Doe"
                            />
                            {errors.name && (
                                <p className="mt-1 text-sm text-red-400">{errors.name}</p>
                            )}
                        </div>

                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                                Email Address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                className={`w-full px-4 py-3 bg-white/10 border ${errors.email ? 'border-red-500' : 'border-gray-600'
                                    } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white transition-all duration-200 backdrop-blur-sm`}
                                placeholder="john@example.com"
                            />
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-400">{errors.email}</p>
                            )}
                        </div>

                        {/* Phone */}
                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-1">
                                Phone Number
                            </label>
                            <input
                                id="phone"
                                name="phone"
                                type="tel"
                                required
                                value={formData.phone}
                                onChange={handleChange}
                                className={`w-full px-4 py-3 bg-white/10 border ${errors.phone ? 'border-red-500' : 'border-gray-600'
                                    } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white transition-all duration-200 backdrop-blur-sm`}
                                placeholder="+1 (555) 123-4567"
                            />
                            {errors.phone && (
                                <p className="mt-1 text-sm text-red-400">{errors.phone}</p>
                            )}
                        </div>

                        {/* Profile Image Upload */}
                        <div>
                            <label htmlFor="imageUpload" className="block text-sm font-medium text-gray-300 mb-2">
                                Profile Image (Optional)
                            </label>

                            {!imagePreview ? (
                                <div
                                    className={`w-full px-4 py-8 bg-white/10 border-2 border-dashed ${dragActive ? 'border-white' : 'border-gray-600'
                                        } rounded-lg text-center cursor-pointer hover:bg-white/15 transition-all duration-200 backdrop-blur-sm`}
                                    onDragEnter={handleDrag}
                                    onDragLeave={handleDrag}
                                    onDragOver={handleDrag}
                                    onDrop={handleDrop}
                                    onClick={() => document.getElementById('imageInput').click()}
                                >
                                    <input
                                        id="imageInput"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileInputChange}
                                        className="hidden"
                                    />
                                    <div className="flex flex-col items-center space-y-2">
                                        <BsCloudUpload className="text-4xl text-gray-400" />
                                        <p className="text-gray-300 font-medium">
                                            {isUploadingImage ? 'Uploading...' : 'Upload your profile image'}
                                        </p>
                                        <p className="text-gray-500 text-sm">
                                            Drag & drop or click to browse
                                        </p>
                                        <p className="text-gray-600 text-xs">
                                            PNG, JPG, GIF up to 10MB
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="relative">
                                    <div className="w-full h-48 bg-white/10 border border-gray-600 rounded-lg overflow-hidden backdrop-blur-sm">
                                        <img
                                            src={imagePreview}
                                            alt="Profile preview"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={removeImage}
                                        className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 transition-colors duration-200"
                                    >
                                        <BsX size={16} />
                                    </button>
                                    <div className="mt-2 flex items-center justify-between">
                                        <div className="flex items-center text-green-400 text-sm">
                                            <BsImage className="mr-1" />
                                            Image uploaded successfully
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => document.getElementById('imageInput').click()}
                                            className="text-white hover:text-gray-300 text-sm underline"
                                        >
                                            Change image
                                        </button>
                                    </div>
                                    <input
                                        id="imageInput"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileInputChange}
                                        className="hidden"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Password */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    autoComplete="new-password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 pr-12 bg-white/10 border ${errors.password ? 'border-red-500' : 'border-gray-600'
                                        } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white transition-all duration-200 backdrop-blur-sm`}
                                    placeholder="Enter your password"
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white transition-colors duration-200"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <BsEyeSlash size={20} /> : <BsEye size={20} />}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="mt-1 text-sm text-red-400">{errors.password}</p>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-1">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    autoComplete="new-password"
                                    required
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 pr-12 bg-white/10 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-600'
                                        } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white transition-all duration-200 backdrop-blur-sm`}
                                    placeholder="Confirm your password"
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white transition-colors duration-200"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ? <BsEyeSlash size={20} /> : <BsEye size={20} />}
                                </button>
                            </div>
                            {errors.confirmPassword && (
                                <p className="mt-1 text-sm text-red-400">{errors.confirmPassword}</p>
                            )}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading || isSubmitting || isUploadingImage}
                        className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-black bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
                    >
                        {isUploadingImage ? 'Uploading Image...' : loading || isSubmitting ? 'Creating Account...' : 'Create Account'}
                    </button>

                    {/* Divider */}
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-600" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-black text-gray-400">Or continue with</span>
                        </div>
                    </div>

                    {/* Google Sign Up Button */}
                    <button
                        type="button"
                        onClick={handleGoogleSignUp}
                        disabled={loading || isSubmitting}
                        className="group relative w-full flex justify-center items-center py-3 px-4 border border-gray-600 text-sm font-medium rounded-lg text-white bg-white/10 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 backdrop-blur-sm"
                    >
                        <BsGoogle className="mr-2" size={18} />
                        {loading || isSubmitting ? 'Connecting...' : 'Sign up with Google'}
                    </button>
                </form>

                {/* Sign In Link */}
                <div className="text-center space-y-3">
                    <p className="text-gray-400 text-sm">
                        Already part of the Harris Valle community? Welcome back! Access your account to continue your premium shopping experience.
                    </p>
                    <Link
                        to="/login"
                        className="inline-flex items-center justify-center w-full py-3 px-4 bg-transparent border border-white/20 rounded-lg font-medium text-white hover:bg-white/5 hover:border-white/30 transition-all duration-200 transform hover:scale-[1.02] backdrop-blur-sm"
                    >
                        Sign In to Your Account
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default SignUp;