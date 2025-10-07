import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BsArrowLeft, BsUpload, BsX, BsCheck, BsPalette, BsTag, BsFileText, BsImage } from 'react-icons/bs';

const AddCategory = () => {
    const navigate = useNavigate();

    // ImgBB API configuration from environment variables
    const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY;

    const [formData, setFormData] = useState({
        id: '',
        name: '',
        description: '',
        image: '',
        color: 'from-blue-500 to-blue-600'
    });

    const [imagePreview, setImagePreview] = useState('');
    const [isUploadingImage, setIsUploadingImage] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    // Predefined color options for categories
    const colorOptions = [
        { value: 'from-blue-500 to-blue-600', label: 'Blue', preview: 'bg-gradient-to-r from-blue-500 to-blue-600' },
        { value: 'from-green-500 to-green-600', label: 'Green', preview: 'bg-gradient-to-r from-green-500 to-green-600' },
        { value: 'from-purple-500 to-purple-600', label: 'Purple', preview: 'bg-gradient-to-r from-purple-500 to-purple-600' },
        { value: 'from-orange-500 to-orange-600', label: 'Orange', preview: 'bg-gradient-to-r from-orange-500 to-orange-600' },
        { value: 'from-red-500 to-red-600', label: 'Red', preview: 'bg-gradient-to-r from-red-500 to-red-600' },
        { value: 'from-pink-500 to-pink-600', label: 'Pink', preview: 'bg-gradient-to-r from-pink-500 to-pink-600' },
        { value: 'from-indigo-500 to-indigo-600', label: 'Indigo', preview: 'bg-gradient-to-r from-indigo-500 to-indigo-600' },
        { value: 'from-yellow-500 to-yellow-600', label: 'Yellow', preview: 'bg-gradient-to-r from-yellow-500 to-yellow-600' },
    ];

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
                throw new Error(`HTTP error! here status: ${response.status}`);
            }

            const data = await response.json();
            if (data.success) {
                return data.data.url;
            } else {
                throw new Error('Failed to upload image to ImgBB');
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
            console.log('✅ Image uploaded successfully:', imageUrl);
        } catch (uploadError) {
            console.error('❌ Image upload failed:', uploadError);
            setErrors(prev => ({ ...prev, image: `Image upload failed: ${uploadError.message}` }));
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

    // Generate category ID from name
    const generateCategoryId = (name) => {
        return name
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces and dashes
            .replace(/\s+/g, '-') // Replace spaces with dashes
            .replace(/-+/g, '-') // Replace multiple dashes with single dash
            .replace(/^-+|-+$/g, ''); // Remove leading/trailing dashes
    };

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'name') {
            const categoryId = generateCategoryId(value);
            setFormData(prev => ({
                ...prev,
                [name]: value,
                id: categoryId
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }

        // Clear field-specific errors
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    // Validate form
    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Category name is required';
        }

        if (!formData.description.trim()) {
            newErrors.description = 'Category description is required';
        } else if (formData.description.length < 10) {
            newErrors.description = 'Description must be at least 10 characters long';
        }

        if (!formData.image) {
            newErrors.image = 'Category image is required';
        }

        if (!formData.color) {
            newErrors.color = 'Please select a color scheme';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            console.log('❌ Form validation failed');
            return;
        }

        setIsSubmitting(true);

        try {
            console.log('📤 Submitting category data:', formData);

            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/categories`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (response.ok && result.success) {
                console.log('✅ Category added successfully:', result);
                setSubmitSuccess(true);

                // Reset form after successful submission
                setTimeout(() => {
                    setFormData({
                        id: '',
                        name: '',
                        description: '',
                        image: '',
                        color: 'from-blue-500 to-blue-600'
                    });
                    setImagePreview('');
                    setSubmitSuccess(false);
                }, 2000);
            } else {
                throw new Error(result.message || 'Failed to add category');
            }
        } catch (error) {
            console.error('❌ Error adding category:', error);
            setErrors({ submit: error.message || 'Failed to add category. Please try again.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 py-12">
            <div className="max-w-4xl mx-auto px-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <Link
                        to="/dashboard"
                        className="inline-flex items-center text-white hover:text-gray-300 transition-colors duration-200 group"
                    >
                        <BsArrowLeft className="mr-3 transform transition-transform duration-300 group-hover:-translate-x-1" size={20} />
                        <span className="font-medium" style={{ fontFamily: "'Poppins', sans-serif" }}>
                            Back to Dashboard
                        </span>
                    </Link>
                </div>

                {/* Page Title */}
                <div className="text-center mb-12">
                    <h1
                        className="text-4xl md:text-5xl font-bold text-white mb-4"
                        style={{ fontFamily: "'Poppins', sans-serif" }}
                    >
                        Add New Category
                    </h1>
                    <p
                        className="text-xl text-gray-300 max-w-2xl mx-auto"
                        style={{ fontFamily: "'Poppins', sans-serif" }}
                    >
                        Create a new product category with image, description and color scheme
                    </p>
                </div>

                {/* Success Message */}
                {submitSuccess && (
                    <div className="mb-8 p-4 bg-green-900/50 border border-green-500 rounded-xl flex items-center">
                        <BsCheck className="text-green-400 mr-3" size={24} />
                        <span className="text-green-400 font-medium">
                            Category added successfully!
                        </span>
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 shadow-2xl">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Left Column */}
                        <div className="space-y-6">
                            {/* Category Name */}
                            <div>
                                <label
                                    htmlFor="name"
                                    className="flex items-center text-white font-medium mb-3"
                                    style={{ fontFamily: "'Poppins', sans-serif" }}
                                >
                                    <BsTag className="mr-2" size={18} />
                                    Category Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                                    placeholder="Enter category name (e.g., Men's Shirts)"
                                    style={{ fontFamily: "'Poppins', sans-serif" }}
                                />
                                {formData.name && (
                                    <p className="mt-2 text-sm text-gray-400">
                                        Category ID: <span className="text-blue-400">{formData.id}</span>
                                    </p>
                                )}
                                {errors.name && (
                                    <p className="mt-2 text-red-400 text-sm">{errors.name}</p>
                                )}
                            </div>

                            {/* Description */}
                            <div>
                                <label
                                    htmlFor="description"
                                    className="flex items-center text-white font-medium mb-3"
                                    style={{ fontFamily: "'Poppins', sans-serif" }}
                                >
                                    <BsFileText className="mr-2" size={18} />
                                    Description
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows={4}
                                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 resize-none"
                                    placeholder="Describe this category (minimum 10 characters)"
                                    style={{ fontFamily: "'Poppins', sans-serif" }}
                                />
                                <div className="flex justify-between items-center mt-2">
                                    <span className="text-sm text-gray-400">
                                        {formData.description.length} characters
                                    </span>
                                    {errors.description && (
                                        <p className="text-red-400 text-sm">{errors.description}</p>
                                    )}
                                </div>
                            </div>

                            {/* Color Scheme */}
                            <div>
                                <label
                                    className="flex items-center text-white font-medium mb-3"
                                    style={{ fontFamily: "'Poppins', sans-serif" }}
                                >
                                    <BsPalette className="mr-2" size={18} />
                                    Color Scheme
                                </label>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                    {colorOptions.map((color) => (
                                        <div
                                            key={color.value}
                                            onClick={() => setFormData(prev => ({ ...prev, color: color.value }))}
                                            className={`relative cursor-pointer rounded-xl overflow-hidden transition-all duration-300 transform hover:scale-105 ${formData.color === color.value ? 'ring-2 ring-white ring-offset-2 ring-offset-transparent' : ''
                                                }`}
                                        >
                                            <div className={`${color.preview} h-12 w-full`} />
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                {formData.color === color.value && (
                                                    <BsCheck className="text-white drop-shadow-lg" size={20} />
                                                )}
                                            </div>
                                            <p className="text-xs text-center text-white mt-1 font-medium">
                                                {color.label}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                                {errors.color && (
                                    <p className="mt-2 text-red-400 text-sm">{errors.color}</p>
                                )}
                            </div>
                        </div>

                        {/* Right Column */}
                        <div>
                            {/* Image Upload */}
                            <div>
                                <label
                                    className="flex items-center text-white font-medium mb-3"
                                    style={{ fontFamily: "'Poppins', sans-serif" }}
                                >
                                    <BsImage className="mr-2" size={18} />
                                    Category Image
                                </label>

                                {imagePreview ? (
                                    <div className="relative">
                                        <img
                                            src={imagePreview}
                                            alt="Category preview"
                                            className="w-full h-64 object-cover rounded-xl border border-white/20"
                                        />
                                        <button
                                            type="button"
                                            onClick={removeImage}
                                            className="absolute top-3 right-3 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 transition-colors duration-200"
                                        >
                                            <BsX size={20} />
                                        </button>
                                        {isUploadingImage && (
                                            <div className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center">
                                                <div className="text-white text-center">
                                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                                                    <p>Uploading...</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div
                                        className={`border-2 border-dashed border-white/30 rounded-xl p-8 text-center cursor-pointer transition-all duration-300 hover:border-white/50 hover:bg-white/5 ${dragActive ? 'border-blue-500 bg-blue-500/10' : ''
                                            }`}
                                        onDragEnter={handleDrag}
                                        onDragLeave={handleDrag}
                                        onDragOver={handleDrag}
                                        onDrop={handleDrop}
                                        onClick={() => document.getElementById('imageInput').click()}
                                    >
                                        <BsUpload className="mx-auto mb-4 text-white/60" size={48} />
                                        <p className="text-white/80 mb-2 font-medium" style={{ fontFamily: "'Poppins', sans-serif" }}>
                                            Drop an image here or click to browse
                                        </p>
                                        <p className="text-white/60 text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>
                                            JPG, PNG, GIF, WEBP up to 10MB
                                        </p>
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
                                    <p className="mt-2 text-red-400 text-sm">{errors.image}</p>
                                )}
                            </div>

                            {/* Preview */}
                            {formData.name && formData.color && (
                                <div className="mt-8">
                                    <h4 className="text-white font-medium mb-3" style={{ fontFamily: "'Poppins', sans-serif" }}>
                                        Category Preview
                                    </h4>
                                    <div className="relative rounded-xl overflow-hidden">
                                        <div
                                            className="h-32 bg-cover bg-center"
                                            style={{
                                                backgroundImage: imagePreview ? `url(${imagePreview})` : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                                            }}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
                                        <div className="absolute bottom-0 left-0 right-0 p-4">
                                            <div className={`inline-flex items-center px-2 py-1 rounded-full bg-gradient-to-r ${formData.color} text-white text-xs font-medium mb-2`}>
                                                Preview
                                            </div>
                                            <h3 className="text-white font-bold text-lg" style={{ fontFamily: "'Poppins', sans-serif" }}>
                                                {formData.name || 'Category Name'}
                                            </h3>
                                            <p className="text-gray-300 text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>
                                                {formData.description || 'Category description will appear here'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Submit Error */}
                    {errors.submit && (
                        <div className="mt-6 p-4 bg-red-900/50 border border-red-500 rounded-xl">
                            <p className="text-red-400">{errors.submit}</p>
                        </div>
                    )}

                    {/* Submit Button */}
                    <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-end">
                        <button
                            type="button"
                            onClick={() => navigate('/dashboard')}
                            className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-medium rounded-xl transition-all duration-300 border border-white/20"
                            style={{ fontFamily: "'Poppins', sans-serif" }}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting || isUploadingImage}
                            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-600 text-white font-medium rounded-xl transition-all duration-300 transform hover:scale-105 disabled:hover:scale-100 flex items-center justify-center"
                            style={{ fontFamily: "'Poppins', sans-serif" }}
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                    Adding Category...
                                </>
                            ) : (
                                <>
                                    <BsCheck className="mr-2" size={20} />
                                    Add Category
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddCategory;
