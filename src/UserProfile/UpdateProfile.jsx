import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BsArrowLeft, BsCloudUpload, BsX, BsImage, BsSave, BsGoogle } from 'react-icons/bs';
import { AuthContext } from '../Provider/ContextProvider';
import { toast } from 'react-toastify';

const UpdateProfile = () => {
    const { user, updateUserProfile } = useContext(AuthContext);
    const navigate = useNavigate();

    // ImgBB API configuration
    const IMGBB_API_KEY = '749194be549fa89d8fae32a3ac4ee723';

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        imageUrl: ''
    });

    const [originalData, setOriginalData] = useState({});
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);

    // Image upload states
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
                imageUrl: imageUrl
            }));

            toast.success('Image uploaded successfully!');
        } catch (uploadError) {
            // Reset on error
            console.error('Image upload failed:', uploadError);
            setImagePreview('');
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
        setImagePreview('');
        setFormData(prev => ({
            ...prev,
            imageUrl: originalData.imageUrl || ''
        }));
    };

    // Fetch user data from MongoDB
    useEffect(() => {
        const fetchUserData = async () => {
            if (!user || !user.email) {
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/${user.email}`);
                const result = await response.json();

                if (result.success && result.data) {
                    const userData = result.data;
                    const userFormData = {
                        name: userData.name || user.displayName || '',
                        email: userData.email || user.email || '',
                        phone: userData.phone || '',
                        imageUrl: userData.imageUrl || user.photoURL || ''
                    };

                    setFormData(userFormData);
                    setOriginalData(userFormData);
                    setImagePreview(userFormData.imageUrl);
                } else {
                    // User not found in MongoDB, create from Firebase data
                    const userFormData = {
                        name: user.displayName || '',
                        email: user.email || '',
                        phone: '',
                        imageUrl: user.photoURL || ''
                    };

                    setFormData(userFormData);
                    setOriginalData(userFormData);
                    setImagePreview(userFormData.imageUrl);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
                // Fallback to Firebase user data
                const userFormData = {
                    name: user.displayName || '',
                    email: user.email || '',
                    phone: '',
                    imageUrl: user.photoURL || ''
                };

                setFormData(userFormData);
                setOriginalData(userFormData);
                setImagePreview(userFormData.imageUrl);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
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
        // Phone is optional but validate format if provided
        if (formData.phone && !/^[+]?[1-9][\d]{0,15}$/.test(formData.phone.replace(/\s/g, ''))) {
            newErrors.phone = 'Please enter a valid phone number';
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

        try {
            // Update user profile in MongoDB
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/${user.email}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (result.success) {
                // Update Firebase Auth profile if name or image changed
                if (formData.name !== originalData.name || formData.imageUrl !== originalData.imageUrl) {
                    try {
                        await updateUserProfile(formData.name, formData.imageUrl);
                        console.log('✅ Firebase Auth profile updated successfully');
                    } catch (firebaseError) {
                        console.error('⚠️ Firebase Auth update failed:', firebaseError);
                        // Don't fail the entire operation if Firebase update fails
                        toast.warning('Profile updated in database but Firebase sync failed. Please refresh the page.');
                    }
                }

                setOriginalData(formData);
                toast.success('Profile updated successfully!', {
                    position: "top-right",
                    autoClose: 4000,
                });

                // Navigate back to profile after a short delay
                setTimeout(() => {
                    navigate('/user-profile');
                }, 1500);
            } else {
                throw new Error(result.message || 'Failed to update profile');
            }
        } catch (error) {
            console.error('Profile update error:', error);
            toast.error('Failed to update profile. Please try again.', {
                position: "top-right",
                autoClose: 5000,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    // Check if data has changed
    const hasChanges = () => {
        return JSON.stringify(formData) !== JSON.stringify(originalData);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-white text-xl">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-800 opacity-50"></div>

            {/* Back to Profile */}
            <div className="absolute top-6 left-6 z-10">
                <Link
                    to="/profile"
                    className="inline-flex items-center bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl transition-all duration-300 backdrop-blur-sm border border-white/20 group text-white"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                    <BsArrowLeft className="mr-2 transform transition-transform duration-300 group-hover:-translate-x-1" size={16} />
                    Back to Profile
                </Link>
            </div>

            <div className="relative max-w-md w-full space-y-8">
                {/* Header */}
                <div className="text-center">
                    <h2 className="text-4xl font-bold text-white mb-2">
                        Update Profile
                    </h2>
                    <p className="text-gray-400">
                        Keep your information up to date
                    </p>
                    {user?.providerData?.[0]?.providerId === 'google.com' && (
                        <div className="mt-2 flex items-center justify-center text-sm text-blue-400">
                            <BsGoogle className="mr-1" size={14} />
                            Google Account
                        </div>
                    )}
                </div>

                {/* Update Form */}
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

                        {/* Email (Read-only) */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                                Email Address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                readOnly
                                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-gray-400 cursor-not-allowed backdrop-blur-sm"
                                placeholder="john@example.com"
                            />
                            <p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>
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
                                value={formData.phone}
                                onChange={handleChange}
                                className={`w-full px-4 py-3 bg-white/10 border ${errors.phone ? 'border-red-500' : 'border-gray-600'
                                    } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white transition-all duration-200 backdrop-blur-sm`}
                                placeholder="+1 (555) 123-4567"
                            />
                            {errors.phone && (
                                <p className="mt-1 text-sm text-red-400">{errors.phone}</p>
                            )}
                            {user?.providerData?.[0]?.providerId === 'google.com' && !originalData.phone && (
                                <p className="mt-1 text-xs text-blue-400">
                                    Google doesn't provide phone numbers. Please add yours here.
                                </p>
                            )}
                        </div>

                        {/* Profile Image Upload */}
                        <div>
                            <label htmlFor="imageUpload" className="block text-sm font-medium text-gray-300 mb-2">
                                Profile Image
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
                                            Profile image ready
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
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-4">
                        {/* Update Button */}
                        <button
                            type="submit"
                            disabled={isSubmitting || isUploadingImage || !hasChanges()}
                            className="group relative w-full flex justify-center items-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-black bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
                        >
                            <BsSave className="mr-2" size={16} />
                            {isUploadingImage ? 'Uploading Image...' : isSubmitting ? 'Updating Profile...' : 'Update Profile'}
                        </button>

                        {/* Cancel Button */}
                        <Link
                            to="/profile"
                            className="group relative w-full flex justify-center items-center py-3 px-4 border border-gray-600 text-sm font-medium rounded-lg text-white bg-white/10 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white/20 transition-all duration-200 backdrop-blur-sm"
                        >
                            Cancel
                        </Link>
                    </div>

                    {/* Changes Indicator */}
                    {hasChanges() && (
                        <div className="text-center">
                            <p className="text-orange-400 text-sm">
                                You have unsaved changes
                            </p>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default UpdateProfile;