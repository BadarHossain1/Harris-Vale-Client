import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    BsArrowLeft,
    BsCloudUpload,
    BsImage,
    BsX,
    BsCheck,
    BsExclamationTriangle,
    BsPlus,
    BsTag,
    BsCurrencyDollar,
    BsFileText,
    BsGrid,
    BsStar,
    BsEye,
    BsToggleOff,
    BsToggleOn,
    BsShop
} from 'react-icons/bs';

const AddProducts = () => {
    const navigate = useNavigate();

    // ImgBB API configuration from environment variables
    const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY;

    const [formData, setFormData] = useState({
        id: '',
        name: '',
        price: '',
        description: '',
        image: '',
        category: '',
        inStock: true,
        featured: false
    });

    const [imagePreview, setImagePreview] = useState('');
    const [isUploadingImage, setIsUploadingImage] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [categories, setCategories] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(true);

    // Fetch categories from database
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setLoadingCategories(true);
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/categories`);
                const data = await response.json();

                if (data.success && Array.isArray(data.data)) {
                    // Transform categories to match the expected format
                    const transformedCategories = data.data.map(category => ({
                        value: category.id,
                        label: category.name
                    }));
                    setCategories(transformedCategories);
                } else {
                    console.error('Failed to fetch categories:', data);
                    // Fallback to default categories if API fails
                    setCategories([
                        { value: 'general', label: 'General' }
                    ]);
                }
            } catch (error) {
                console.error('Error fetching categories:', error);
                // Fallback to default categories if API fails
                setCategories([
                    { value: 'general', label: 'General' }
                ]);
            } finally {
                setLoadingCategories(false);
            }
        };

        fetchCategories();
    }, []);

    // Function to upload image to ImgBB
    const uploadImageToImgBB = async (file) => {
        const formDataImg = new FormData();
        formDataImg.append('image', file);

        try {
            const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
                method: 'POST',
                body: formDataImg
            });

            if (!response.ok) {
                throw new Error('Failed to upload image');
            }

            const data = await response.json();
            if (data.success) {
                return data.data.url;
            } else {
                throw new Error('Image upload failed');
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            throw error;
        }
    };

    // Handle file selection
    const handleFileSelect = async (file) => {
        if (!file) return;

        // Validate file type
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            setErrors(prev => ({ ...prev, image: 'Please select a valid image file (JPG, PNG, GIF, WEBP)' }));
            return;
        }

        // Validate file size (max 10MB)
        const maxSize = 10 * 1024 * 1024; // 10MB
        if (file.size > maxSize) {
            setErrors(prev => ({ ...prev, image: 'Image size must be less than 10MB' }));
            return;
        }

        setErrors(prev => ({ ...prev, image: '' }));

        // Create preview
        const reader = new FileReader();
        reader.onload = (e) => {
            setImagePreview(e.target.result);
        };
        reader.readAsDataURL(file);

        try {
            setIsUploadingImage(true);
            const imageUrl = await uploadImageToImgBB(file);
            setFormData(prev => ({ ...prev, image: imageUrl }));
        } catch (uploadError) {
            console.error('Upload error:', uploadError);
            setErrors(prev => ({ ...prev, image: 'Failed to upload image. Please try again.' }));
            setImagePreview('');
        } finally {
            setIsUploadingImage(false);
        }
    };

    // Handle drag events
    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
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
        setFormData(prev => ({ ...prev, image: '' }));
        setErrors(prev => ({ ...prev, image: '' }));
    };

    // Generate unique product ID
    const generateProductId = () => {
        const timestamp = Date.now();
        const random = Math.floor(Math.random() * 1000);
        return `PROD_${timestamp}_${random}`;
    };

    // Handle form input changes
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

    // Validate form
    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Product name is required';
        }

        if (!formData.price || formData.price <= 0) {
            newErrors.price = 'Please enter a valid price';
        }

        if (!formData.description.trim()) {
            newErrors.description = 'Product description is required';
        }

        if (!formData.image) {
            newErrors.image = 'Product image is required';
        }

        if (!formData.category) {
            newErrors.category = 'Please select a category';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            // Generate unique ID if not provided
            const productData = {
                ...formData,
                id: formData.id || generateProductId(),
                price: parseFloat(formData.price)
            };

            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/addProduct`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(productData)
            });

            if (!response.ok) {
                throw new Error('Failed to add product');
            }

            const result = await response.json();
            console.log('Product added successfully:', result);

            setSubmitSuccess(true);

            // Reset form after successful submission
            setTimeout(() => {
                setFormData({
                    id: '',
                    name: '',
                    price: '',
                    description: '',
                    image: '',
                    category: '',
                    inStock: true,
                    featured: false
                });
                setImagePreview('');
                setSubmitSuccess(false);
                navigate('/dashboard'); // Navigate back to dashboard
            }, 2000);

        } catch (error) {
            console.error('Error adding product:', error);
            setErrors(prev => ({
                ...prev,
                submit: 'Failed to add product. Please try again.'
            }));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
            {/* Header */}
            <div className="bg-black/50 backdrop-blur-sm border-b border-gray-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center space-x-4">
                            <Link
                                to="/dashboard"
                                className="inline-flex items-center text-white hover:text-gray-300 transition-colors duration-200"
                            >
                                <BsArrowLeft className="mr-2" size={20} />
                                Back to Dashboard
                            </Link>
                            <div className="h-6 w-px bg-gray-600"></div>
                            <div className="flex items-center space-x-3">
                                <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-2 rounded-lg">
                                    <BsShop className="text-white" size={20} />
                                </div>
                                <h1 className="text-xl font-bold text-white">Add New Product</h1>
                            </div>
                        </div>

                        {submitSuccess && (
                            <div className="flex items-center space-x-2 bg-green-500/20 text-green-400 px-4 py-2 rounded-lg border border-green-500/30">
                                <BsCheck size={20} />
                                <span>Product added successfully!</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Basic Information Card */}
                    <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl border border-gray-700 p-6 backdrop-blur-sm shadow-2xl">
                        <div className="flex items-center space-x-3 mb-6">
                            <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-2 rounded-lg">
                                <BsGrid className="text-white" size={20} />
                            </div>
                            <h2 className="text-xl font-bold text-white">Basic Information</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Product Name */}
                            <div className="md:col-span-2">
                                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                                    Product Name *
                                </label>
                                <div className="relative">
                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-3 pl-12 bg-gray-900/50 border ${errors.name ? 'border-red-500' : 'border-gray-600'
                                            } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200`}
                                        placeholder="Enter product name"
                                    />
                                    <BsTag className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                                </div>
                                {errors.name && (
                                    <p className="mt-1 text-sm text-red-400 flex items-center">
                                        <BsExclamationTriangle className="mr-1" size={14} />
                                        {errors.name}
                                    </p>
                                )}
                            </div>

                            {/* Product ID (Optional) */}
                            <div>
                                <label htmlFor="id" className="block text-sm font-medium text-gray-300 mb-2">
                                    Product ID (Optional)
                                </label>
                                <input
                                    id="id"
                                    name="id"
                                    type="text"
                                    value={formData.id}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200"
                                    placeholder="Auto-generated if empty"
                                />
                                <p className="mt-1 text-xs text-gray-500">Leave empty to auto-generate</p>
                            </div>

                            {/* Price */}
                            <div>
                                <label htmlFor="price" className="block text-sm font-medium text-gray-300 mb-2">
                                    Price (৳) *
                                </label>
                                <div className="relative">
                                    <input
                                        id="price"
                                        name="price"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        required
                                        value={formData.price}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-3 pl-12 bg-gray-900/50 border ${errors.price ? 'border-red-500' : 'border-gray-600'
                                            } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200`}
                                        placeholder="0.00"
                                    />
                                    <BsCurrencyDollar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                                </div>
                                {errors.price && (
                                    <p className="mt-1 text-sm text-red-400 flex items-center">
                                        <BsExclamationTriangle className="mr-1" size={14} />
                                        {errors.price}
                                    </p>
                                )}
                            </div>

                            {/* Category */}
                            <div>
                                <label htmlFor="category" className="flex items-center text-sm font-medium text-gray-300 mb-2">
                                    <BsGrid className="mr-2" size={16} />
                                    Category *
                                    {loadingCategories && (
                                        <div className="ml-2 animate-spin">
                                            <BsGrid size={12} />
                                        </div>
                                    )}
                                </label>
                                <select
                                    id="category"
                                    name="category"
                                    required
                                    value={formData.category}
                                    onChange={handleChange}
                                    disabled={loadingCategories}
                                    className={`w-full px-4 py-3 bg-gray-900/50 border ${errors.category ? 'border-red-500' : 'border-gray-600'
                                        } rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200 ${loadingCategories ? 'cursor-not-allowed opacity-50' : ''}`}
                                >
                                    <option value="" className="bg-gray-900 text-white">
                                        {loadingCategories ? 'Loading categories...' :
                                            categories.length === 0 ? 'No categories available' : 'Select a category'}
                                    </option>
                                    {!loadingCategories && categories.length > 0 && categories.map((category) => (
                                        <option key={category.value} value={category.value} className="bg-gray-900 text-white">
                                            {category.label}
                                        </option>
                                    ))}
                                    {!loadingCategories && categories.length === 0 && (
                                        <option value="" disabled className="bg-gray-900 text-gray-500">
                                            Please create categories first
                                        </option>
                                    )}
                                </select>
                                {errors.category && (
                                    <p className="mt-1 text-sm text-red-400 flex items-center">
                                        <BsExclamationTriangle className="mr-1" size={14} />
                                        {errors.category}
                                    </p>
                                )}
                                {!loadingCategories && categories.length === 0 && (
                                    <p className="mt-1 text-sm text-yellow-400 flex items-center">
                                        <BsExclamationTriangle className="mr-1" size={14} />
                                        No categories found. Please create categories first in the dashboard.
                                    </p>
                                )}
                            </div>

                            {/* Product Status */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Product Status
                                </label>
                                <div className="space-y-3">
                                    {/* In Stock Toggle */}
                                    <div className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg border border-gray-600">
                                        <div className="flex items-center space-x-3">
                                            <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-1.5 rounded-lg">
                                                <BsEye className="text-white" size={14} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-white">In Stock</p>
                                                <p className="text-xs text-gray-400">Product available for purchase</p>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setFormData(prev => ({ ...prev, inStock: !prev.inStock }))}
                                            className="focus:outline-none"
                                        >
                                            {formData.inStock ? (
                                                <BsToggleOn className="text-green-500 hover:text-green-400 transition-colors" size={24} />
                                            ) : (
                                                <BsToggleOff className="text-gray-500 hover:text-gray-400 transition-colors" size={24} />
                                            )}
                                        </button>
                                    </div>

                                    {/* Featured Toggle */}
                                    <div className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg border border-gray-600">
                                        <div className="flex items-center space-x-3">
                                            <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-1.5 rounded-lg">
                                                <BsStar className="text-white" size={14} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-white">Featured Product</p>
                                                <p className="text-xs text-gray-400">Highlight on homepage</p>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setFormData(prev => ({ ...prev, featured: !prev.featured }))}
                                            className="focus:outline-none"
                                        >
                                            {formData.featured ? (
                                                <BsToggleOn className="text-yellow-500 hover:text-yellow-400 transition-colors" size={24} />
                                            ) : (
                                                <BsToggleOff className="text-gray-500 hover:text-gray-400 transition-colors" size={24} />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="md:col-span-2">
                                <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
                                    Product Description *
                                </label>
                                <div className="relative">
                                    <textarea
                                        id="description"
                                        name="description"
                                        rows={4}
                                        required
                                        value={formData.description}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-3 pl-12 bg-gray-900/50 border ${errors.description ? 'border-red-500' : 'border-gray-600'
                                            } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200 resize-none`}
                                        placeholder="Enter detailed product description..."
                                    />
                                    <BsFileText className="absolute left-4 top-4 text-gray-400" size={16} />
                                </div>
                                {errors.description && (
                                    <p className="mt-1 text-sm text-red-400 flex items-center">
                                        <BsExclamationTriangle className="mr-1" size={14} />
                                        {errors.description}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Image Upload Card */}
                    <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl border border-gray-700 p-6 backdrop-blur-sm shadow-2xl">
                        <div className="flex items-center space-x-3 mb-6">
                            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-lg">
                                <BsImage className="text-white" size={20} />
                            </div>
                            <h2 className="text-xl font-bold text-white">Product Image</h2>
                        </div>

                        {!imagePreview ? (
                            <div
                                className={`w-full px-4 py-12 bg-gray-900/30 border-2 border-dashed ${dragActive ? 'border-blue-500 bg-blue-500/10' : 'border-gray-600'
                                    } rounded-xl text-center cursor-pointer hover:bg-gray-900/50 transition-all duration-200`}
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
                                <div className="flex flex-col items-center space-y-4">
                                    <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-4 rounded-full">
                                        <BsCloudUpload className="text-white" size={32} />
                                    </div>
                                    <div>
                                        <p className="text-xl font-medium text-white mb-2">
                                            {isUploadingImage ? 'Uploading...' : 'Upload Product Image'}
                                        </p>
                                        <p className="text-gray-400 mb-1">
                                            Drag & drop your image here, or click to browse
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            Supports: PNG, JPG, GIF, WEBP (Max 10MB)
                                        </p>
                                    </div>
                                    {isUploadingImage && (
                                        <div className="flex items-center space-x-2 text-blue-400">
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400"></div>
                                            <span className="text-sm">Processing...</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="relative">
                                <div className="w-full h-80 bg-gray-900/30 border border-gray-600 rounded-xl overflow-hidden">
                                    <img
                                        src={imagePreview}
                                        alt="Product preview"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={removeImage}
                                    className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 transition-colors duration-200 shadow-lg"
                                >
                                    <BsX size={20} />
                                </button>
                                <div className="mt-4 flex items-center justify-between">
                                    <div className="flex items-center text-green-400 text-sm">
                                        <BsCheck className="mr-2" />
                                        Image uploaded successfully
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => document.getElementById('imageInput').click()}
                                        className="text-blue-400 hover:text-blue-300 text-sm underline transition-colors"
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

                        {errors.image && (
                            <p className="mt-4 text-sm text-red-400 flex items-center">
                                <BsExclamationTriangle className="mr-1" size={14} />
                                {errors.image}
                            </p>
                        )}
                    </div>

                    {/* Submit Section */}
                    <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl border border-gray-700 p-6 backdrop-blur-sm shadow-2xl">
                        {errors.submit && (
                            <div className="mb-4 p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
                                <p className="text-red-400 flex items-center">
                                    <BsExclamationTriangle className="mr-2" size={16} />
                                    {errors.submit}
                                </p>
                            </div>
                        )}

                        <div className="flex flex-col sm:flex-row gap-4">
                            <button
                                type="button"
                                onClick={() => navigate('/dashboard')}
                                className="flex-1 py-3 px-6 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500/50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting || isUploadingImage}
                                className="flex-1 py-3 px-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                        <span>Adding Product...</span>
                                    </>
                                ) : (
                                    <>
                                        <BsPlus size={20} />
                                        <span>Add Product</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddProducts;