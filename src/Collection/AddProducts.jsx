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
        images: [], // Changed from 'image' to 'images' array
        category: '',
        inStock: true,
        featured: false
    });

    const [imagePreviews, setImagePreviews] = useState([]); // Changed to array
    const [isUploadingImage, setIsUploadingImage] = useState(false);
    const [uploadingIndex, setUploadingIndex] = useState(-1);
    const [dragActive, setDragActive] = useState(false);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [categories, setCategories] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(true);


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
                console.error('Error fetching categories here:', error);
                
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

    // Handle multiple file selection
    const handleFileSelect = async (files) => {
        if (!files || files.length === 0) return;

        // Check if adding these files would exceed the limit (max 5 images)
        const maxImages = 5;
        const currentImageCount = formData.images.length;
        const newFilesCount = files.length;

        if (currentImageCount + newFilesCount > maxImages) {
            setErrors(prev => ({
                ...prev,
                images: `Maximum ${maxImages} images allowed. You can add ${maxImages - currentImageCount} more.`
            }));
            return;
        }

        setErrors(prev => ({ ...prev, images: '' }));

        // Process each file
        for (let i = 0; i < files.length; i++) {
            const file = files[i];

            // Validate file type
            const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
            if (!validTypes.includes(file.type)) {
                setErrors(prev => ({ ...prev, images: 'Please select valid image files (JPG, PNG, GIF, WEBP)' }));
                continue;
            }

            // Validate file size (max 10MB)
            const maxSize = 10 * 1024 * 1024; // 10MB
            if (file.size > maxSize) {
                setErrors(prev => ({ ...prev, images: 'Each image must be less than 10MB' }));
                continue;
            }

            // Create preview
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreviews(prev => [...prev, e.target.result]);
            };
            reader.readAsDataURL(file);

            try {
                setIsUploadingImage(true);
                setUploadingIndex(currentImageCount + i);
                const imageUrl = await uploadImageToImgBB(file);
                setFormData(prev => ({
                    ...prev,
                    images: [...prev.images, imageUrl]
                }));
            } catch (uploadError) {
                console.error('Upload error:', uploadError);
                setErrors(prev => ({ ...prev, images: 'Failed to upload one or more images. Please try again.' }));
                // Remove the failed preview
                setImagePreviews(prev => prev.slice(0, -1));
            }
        }

        setIsUploadingImage(false);
        setUploadingIndex(-1);
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

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFileSelect(Array.from(e.dataTransfer.files));
        }
    };

    // Handle file input change
    const handleFileInputChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            handleFileSelect(Array.from(e.target.files));
        }
    };

    // Remove specific image
    const removeImage = (index) => {
        setImagePreviews(prev => prev.filter((_, i) => i !== index));
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
        setErrors(prev => ({ ...prev, images: '' }));
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

        if (!formData.images || formData.images.length === 0) {
            newErrors.images = 'At least one product image is required';
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
            // Double-check we have all required data
            if (!formData.name.trim()) {
                throw new Error('Product name is required');
            }
            if (!formData.price || formData.price <= 0) {
                throw new Error('Valid price is required');
            }
            if (!formData.description.trim()) {
                throw new Error('Product description is required');
            }
            if (!formData.category) {
                throw new Error('Category selection is required');
            }
            if (!formData.images || formData.images.length === 0) {
                throw new Error('At least one product image is required');
            }

            const productData = {
                id: formData.id || generateProductId(),
                name: formData.name.trim(),
                price: parseFloat(formData.price),
                description: formData.description.trim(),
                category: formData.category,
                inStock: Boolean(formData.inStock),
                featured: Boolean(formData.featured),
                image: formData.images[0], // First image for backward compatibility
                images: formData.images    // Array of all images
            };

            console.log('📤 Sending product data to backend:', productData);
            console.log('📊 Data validation passed:', {
                name: productData.name,
                price: productData.price,
                category: productData.category,
                mainImage: productData.image ? 'Present' : 'Missing',
                imagesArray: productData.images,
                imageCount: productData.images.length
            });

            const apiUrl = `${import.meta.env.VITE_API_URL}/api/addProduct`;
            console.log('🌐 API URL:', apiUrl);

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(productData)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
                console.error('❌ Backend error response:', errorData);
                console.error('❌ Response status:', response.status);
                console.error('❌ Response headers:', Object.fromEntries(response.headers.entries()));
                throw new Error(errorData.message || `HTTP ${response.status}: Failed to add product`);
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
                    images: [],
                    category: '',
                    inStock: true,
                    featured: false
                });
                setImagePreviews([]);
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
                                        step="any"
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

                    {/* Multiple Images Upload Card */}
                    <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl border border-gray-700 p-6 backdrop-blur-sm shadow-2xl">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center space-x-3">
                                <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-lg">
                                    <BsImage className="text-white" size={20} />
                                </div>
                                <h2 className="text-xl font-bold text-white">Product Images</h2>
                            </div>
                            <div className="text-sm text-gray-400">
                                {formData.images.length}/5 images
                            </div>
                        </div>

                        {/* Upload Area */}
                        {formData.images.length < 5 && (
                            <div
                                className={`w-full px-4 py-8 bg-gray-900/30 border-2 border-dashed ${dragActive ? 'border-blue-500 bg-blue-500/10' : 'border-gray-600'
                                    } rounded-xl text-center cursor-pointer hover:bg-gray-900/50 transition-all duration-200 mb-6`}
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
                                    multiple
                                    onChange={handleFileInputChange}
                                    className="hidden"
                                />
                                <div className="flex flex-col items-center space-y-3">
                                    <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-full">
                                        <BsCloudUpload className="text-white" size={24} />
                                    </div>
                                    <div>
                                        <p className="text-lg font-medium text-white mb-1">
                                            {isUploadingImage ? 'Uploading...' : 'Upload Product Images'}
                                        </p>
                                        <p className="text-gray-400 mb-1">
                                            Drag & drop multiple images here, or click to browse
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            Minimum 1, Maximum 5 images • PNG, JPG, GIF, WEBP (Max 10MB each)
                                        </p>
                                    </div>
                                    {isUploadingImage && (
                                        <div className="flex items-center space-x-2 text-blue-400">
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400"></div>
                                            <span className="text-sm">Processing image {uploadingIndex + 1}...</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Image Previews Grid */}
                        {imagePreviews.length > 0 && (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                                {imagePreviews.map((preview, index) => (
                                    <div key={index} className="relative group">
                                        <div className="aspect-square bg-gray-900/30 border border-gray-600 rounded-lg overflow-hidden">
                                            <img
                                                src={preview}
                                                alt={`Product preview ${index + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeImage(index)}
                                            className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 transition-colors duration-200 shadow-lg opacity-0 group-hover:opacity-100"
                                        >
                                            <BsX size={16} />
                                        </button>
                                        <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                                            {index + 1}
                                        </div>
                                        {uploadingIndex === index && (
                                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Add More Images Button */}
                        {imagePreviews.length > 0 && formData.images.length < 5 && (
                            <button
                                type="button"
                                onClick={() => document.getElementById('imageInput').click()}
                                className="w-full py-3 border-2 border-dashed border-gray-600 hover:border-blue-500 text-gray-400 hover:text-blue-400 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
                            >
                                <BsPlus size={20} />
                                <span>Add More Images ({5 - formData.images.length} remaining)</span>
                            </button>
                        )}

                        {/* Success Message */}
                        {formData.images.length > 0 && (
                            <div className="mt-4 flex items-center text-green-400 text-sm">
                                <BsCheck className="mr-2" />
                                {formData.images.length} image{formData.images.length > 1 ? 's' : ''} uploaded successfully
                            </div>
                        )}

                        {errors.images && (
                            <p className="mt-4 text-sm text-red-400 flex items-center">
                                <BsExclamationTriangle className="mr-1" size={14} />
                                {errors.images}
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