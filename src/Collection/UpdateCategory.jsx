import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { BsArrowLeft, BsImage, BsPalette, BsTextareaResize, BsCloudUpload, BsTrash } from 'react-icons/bs';

const UpdateCategory = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [imageUploading, setImageUploading] = useState(false);
    const [categoryData, setCategoryData] = useState({
        name: '',
        description: '',
        image: '',
        color: 'from-blue-500 to-blue-600'
    });

    const colorOptions = [
        { name: 'Blue', value: 'from-blue-500 to-blue-600', preview: 'bg-gradient-to-r from-blue-500 to-blue-600' },
        { name: 'Green', value: 'from-green-500 to-green-600', preview: 'bg-gradient-to-r from-green-500 to-green-600' },
        { name: 'Red', value: 'from-red-500 to-red-600', preview: 'bg-gradient-to-r from-red-500 to-red-600' },
        { name: 'Purple', value: 'from-purple-500 to-purple-600', preview: 'bg-gradient-to-r from-purple-500 to-purple-600' },
        { name: 'Yellow', value: 'from-yellow-500 to-yellow-600', preview: 'bg-gradient-to-r from-yellow-500 to-yellow-600' },
        { name: 'Pink', value: 'from-pink-500 to-pink-600', preview: 'bg-gradient-to-r from-pink-500 to-pink-600' },
        { name: 'Indigo', value: 'from-indigo-500 to-indigo-600', preview: 'bg-gradient-to-r from-indigo-500 to-indigo-600' },
        { name: 'Teal', value: 'from-teal-500 to-teal-600', preview: 'bg-gradient-to-r from-teal-500 to-teal-600' },
        { name: 'Orange', value: 'from-orange-500 to-orange-600', preview: 'bg-gradient-to-r from-orange-500 to-orange-600' },
        { name: 'Cyan', value: 'from-cyan-500 to-cyan-600', preview: 'bg-gradient-to-r from-cyan-500 to-cyan-600' }
    ];

    // Fetch existing category data
    useEffect(() => {
        const fetchCategory = async () => {
            try {
                setFetching(true);
                const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/categories/${id}`);

                if (!response.ok) {
                    throw new Error('Failed to fetch category');
                }

                const data = await response.json();

                if (data.success) {
                    setCategoryData({
                        name: data.data.name,
                        description: data.data.description,
                        image: data.data.image,
                        color: data.data.color
                    });
                } else {
                    throw new Error(data.message || 'Failed to fetch category');
                }
            } catch (error) {
                console.error('Error fetching category:', error);
                toast.error('Failed to fetch category details');
                navigate('/dashboard');
            } finally {
                setFetching(false);
            }
        };

        if (id) {
            fetchCategory();
        }
    }, [id, navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCategoryData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleColorChange = (colorValue) => {
        setCategoryData(prev => ({
            ...prev,
            color: colorValue
        }));
    };

    // ImgBB API key from environment variables
    const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY;

    const uploadImageToImgBB = async (file) => {
        try {
            setImageUploading(true);

            // Validate file
            if (!file) {
                throw new Error('No file selected');
            }

            // Validate file type
            if (!file.type.startsWith('image/')) {
                throw new Error('Please select an image file');
            }

            // Validate file size (max 10MB)
            if (file.size > 10 * 1024 * 1024) {
                throw new Error('File size must be less than 10MB');
            }

            const formData = new FormData();
            formData.append('image', file);

            const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (data.success) {
                const imageUrl = data.data.url;
                setCategoryData(prev => ({
                    ...prev,
                    image: imageUrl
                }));
                toast.success('Image uploaded successfully!');
                return imageUrl;
            } else {
                throw new Error(data.error?.message || 'Failed to upload image');
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            toast.error(error.message || 'Failed to upload image');
        } finally {
            setImageUploading(false);
        }
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            uploadImageToImgBB(file);
        }
    };

    const removeImage = () => {
        setCategoryData(prev => ({
            ...prev,
            image: ''
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (!categoryData.name.trim()) {
            toast.error('Category name is required');
            return;
        }

        if (!categoryData.description.trim() || categoryData.description.length < 10) {
            toast.error('Description must be at least 10 characters long');
            return;
        }

        if (!categoryData.image.trim()) {
            toast.error('Please upload an image or provide an image URL');
            return;
        }

        try {
            setLoading(true);

            const updateData = {
                name: categoryData.name.trim(),
                description: categoryData.description.trim(),
                image: categoryData.image.trim(),
                color: categoryData.color
            };

            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/categories/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updateData),
            });

            const data = await response.json();

            if (data.success) {
                toast.success('Category updated successfully!');
                navigate('/dashboard');
            } else {
                throw new Error(data.message || 'Failed to update category');
            }
        } catch (error) {
            console.error('Error updating category:', error);
            toast.error(error.message || 'Failed to update category');
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-gray-300">Loading category details...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 py-8 px-4">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="flex items-center text-gray-400 hover:text-white mb-4 transition-colors"
                    >
                        <BsArrowLeft className="mr-2" />
                        Back to Dashboard
                    </button>
                    <h1 className="text-3xl font-bold text-white mb-2">Update Category</h1>
                    <p className="text-gray-400">Modify the category information below</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="bg-gray-800 rounded-2xl p-8 shadow-2xl border border-gray-700">
                    {/* Category Name */}
                    <div className="mb-6">
                        <label className="block text-gray-300 text-sm font-medium mb-2">
                            Category Name *
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={categoryData.name}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter category name"
                            required
                        />
                    </div>

                    {/* Description */}
                    <div className="mb-6">
                        <label className="block text-gray-300 text-sm font-medium mb-2">
                            <BsTextareaResize className="inline mr-2" />
                            Description *
                        </label>
                        <textarea
                            name="description"
                            value={categoryData.description}
                            onChange={handleInputChange}
                            rows="4"
                            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
                            placeholder="Enter category description (minimum 10 characters)"
                            required
                        />
                        <p className="text-gray-500 text-sm mt-1">
                            {categoryData.description.length}/10 characters minimum
                        </p>
                    </div>

                    {/* Image Upload */}
                    <div className="mb-6">
                        <label className="block text-gray-300 text-sm font-medium mb-3">
                            <BsImage className="inline mr-2" />
                            Category Image *
                        </label>

                        {/* Image Upload Area */}
                        <div className="space-y-4">
                            {/* Upload Button */}
                            <div className="relative">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                    id="image-upload"
                                    disabled={imageUploading}
                                />
                                <label
                                    htmlFor="image-upload"
                                    className={`flex items-center justify-center w-full px-6 py-4 border-2 border-dashed border-gray-600 rounded-lg hover:border-blue-500 transition-colors cursor-pointer ${imageUploading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-700/50'}`}
                                >
                                    <div className="text-center">
                                        {imageUploading ? (
                                            <>
                                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
                                                <p className="text-blue-400 font-medium">Uploading...</p>
                                            </>
                                        ) : (
                                            <>
                                                <BsCloudUpload className="text-4xl text-gray-400 mx-auto mb-2" />
                                                <p className="text-gray-300 font-medium">Click to upload image</p>
                                                <p className="text-gray-500 text-sm mt-1">PNG, JPG, JPEG up to 10MB</p>
                                            </>
                                        )}
                                    </div>
                                </label>
                            </div>

                            {/* OR Divider */}
                            <div className="flex items-center">
                                <div className="flex-1 border-t border-gray-600"></div>
                                <span className="px-3 text-gray-500 text-sm">OR</span>
                                <div className="flex-1 border-t border-gray-600"></div>
                            </div>

                            {/* Manual URL Input */}
                            <div>
                                <label className="block text-gray-400 text-sm mb-2">Enter Image URL</label>
                                <input
                                    type="url"
                                    name="image"
                                    value={categoryData.image}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="https://example.com/image.jpg"
                                    disabled={imageUploading}
                                />
                            </div>
                        </div>

                        {/* Image Preview */}
                        {categoryData.image && (
                            <div className="mt-4">
                                <div className="relative inline-block">
                                    <img
                                        src={categoryData.image}
                                        alt="Category preview"
                                        className="w-32 h-32 object-cover rounded-lg border border-gray-600"
                                        onError={(e) => {
                                            e.target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Found';
                                        }}
                                    />
                                    <button
                                        type="button"
                                        onClick={removeImage}
                                        className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 transition-colors"
                                        title="Remove image"
                                    >
                                        <BsTrash className="text-xs" />
                                    </button>
                                </div>
                                <p className="text-gray-500 text-sm mt-2">Click the trash icon to remove image</p>
                            </div>
                        )}
                    </div>

                    {/* Color Selection */}
                    <div className="mb-8">
                        <label className="block text-gray-300 text-sm font-medium mb-4">
                            <BsPalette className="inline mr-2" />
                            Category Color
                        </label>
                        <div className="grid grid-cols-5 gap-3">
                            {colorOptions.map((option) => (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => handleColorChange(option.value)}
                                    className={`h-12 rounded-lg ${option.preview} transition-all duration-300 transform hover:scale-105 ${categoryData.color === option.value
                                        ? 'ring-4 ring-white ring-opacity-60 scale-110'
                                        : 'hover:ring-2 hover:ring-white hover:ring-opacity-40'
                                        }`}
                                    title={option.name}
                                />
                            ))}
                        </div>
                        <p className="text-gray-500 text-sm mt-2">Selected: {colorOptions.find(c => c.value === categoryData.color)?.name}</p>
                    </div>

                    {/* Preview Card */}
                    <div className="mb-8">
                        <label className="block text-gray-300 text-sm font-medium mb-3">Preview</label>
                        <div className="bg-gray-700/50 rounded-xl border border-gray-600/50 p-4 hover:bg-gray-700/70 transition-all duration-300">
                            <div className="mb-4">
                                <img
                                    src={categoryData.image || 'https://via.placeholder.com/300x200?text=Preview'}
                                    alt={categoryData.name || 'Preview'}
                                    className="w-full h-32 object-cover rounded-lg"
                                    onError={(e) => {
                                        e.target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Found';
                                    }}
                                />
                            </div>
                            <div className="space-y-3">
                                <h3 className="text-lg font-semibold text-white">
                                    {categoryData.name || 'Category Name'}
                                </h3>
                                <p className="text-gray-400 text-sm">
                                    {categoryData.description || 'Category description will appear here...'}
                                </p>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-500">Items: 0</span>
                                    <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${categoryData.color}`}></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Submit Buttons */}
                    <div className="flex gap-4">
                        <button
                            type="button"
                            onClick={() => navigate('/dashboard')}
                            className="flex-1 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            {loading ? 'Updating...' : 'Update Category'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdateCategory;
