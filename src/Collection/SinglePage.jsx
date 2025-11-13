import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { BsArrowLeft, BsCart3 } from 'react-icons/bs';
import { AuthContext } from '../Provider/ContextProvider';
import { toast } from 'react-toastify';
import ProductImageSlider from './ProductImageSlider';
import { parseProductImages } from './imageUtils';

const SinglePage = () => {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [selectedSize, setSelectedSize] = useState('M');
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);
    const [addingToCart, setAddingToCart] = useState(false);

    // Scroll to top when component mounts
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/api/products`)
            .then((response) => response.json())
            .then((data) => {
                console.log('API Response for products:', data); // Debug log

                // Handle the response structure from your API
                let products = [];
                if (data.success && Array.isArray(data.data)) {
                    products = data.data;
                } else if (Array.isArray(data)) {
                    products = data;
                } else {
                    console.error('Unexpected data format:', data);
                    setProduct(null);
                    setLoading(false);
                    return;
                }

                const foundProduct = products.find((item) => item.id === id);
                console.log('Looking for product with id:', id);
                console.log('Found product:', foundProduct);
                setProduct(foundProduct);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching product:', error);
                setProduct(null);
                setLoading(false);
            });
    }, [id]);

    // Function to get user information for cart
    const getUserInfo = () => {
        if (user && user.email) {
            return {
                userId: user.email,
                userEmail: user.email,
                userName: user.displayName || user.email.split('@')[0]
            };
        }

        // This should not be reached since we now require login for cart operations
        return null;
    };

    // Handle Add to Cart functionality
    const handleAddToCart = async () => {
        if (!product) return;

        // Check if user is logged in
        if (!user) {
            toast.error('Please login to add items to cart', {
                position: "top-right",
                autoClose: 3000,
            });
            navigate('/login');
            return;
        }

        setAddingToCart(true);

        try {
            const userInfo = getUserInfo();

            const cartItem = {
                productId: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                size: selectedSize,
                quantity: quantity,
                userId: userInfo.userId,
                userEmail: userInfo.userEmail,
                userName: userInfo.userName
            };

            console.log('Adding to cart for user:', userInfo.userEmail, cartItem);

            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/cart/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(cartItem)
            });

            const result = await response.json();
            console.log('Add to cart response:', result);

            if (result.success) {
                toast.success(`${product.name} (Size: ${selectedSize}) added to ${userInfo.userEmail}'s cart!`, {
                    position: "top-right",
                    autoClose: 3000,
                });
                // Reset quantity after successful add
                setQuantity(1);
            } else {
                toast.error(`Error adding to cart: ${result.message}`, {
                    position: "top-right",
                    autoClose: 4000,
                });
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
            toast.error('Error adding item to cart. Please try again.', {
                position: "top-right",
                autoClose: 4000,
            });
        } finally {
            setAddingToCart(false);
        }
    };

    // Handle Order Now functionality - No login required
    const handleOrderNow = () => {
        if (!product) return;

        // Store the pre-order item in sessionStorage for checkout
        const preOrderItem = {
            productId: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            size: selectedSize,
            quantity: quantity
        };

        sessionStorage.setItem('preOrderItem', JSON.stringify(preOrderItem));
        
        toast.success(`Redirecting to checkout...`, {
            position: "top-right",
            autoClose: 1500,
        });

        setTimeout(() => {
            navigate('/checkout');
        }, 1000);
    };

    const sizes = ['M', 'L', 'XL', 'XXL'];

    if (loading) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <div className="text-xl" style={{ fontFamily: "'Poppins', sans-serif" }}>Loading...</div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <div className="text-center">
                    <div className="text-xl mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
                        Product not found
                    </div>
                    <div className="text-gray-400 mb-6" style={{ fontFamily: "'Poppins', sans-serif" }}>
                        The product with ID "{id}" could not be found.
                    </div>
                    <Link
                        to="/products"
                        className="inline-flex items-center bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg transition-colors"
                        style={{ fontFamily: "'Poppins', sans-serif" }}
                    >
                        <BsArrowLeft className="mr-2" />
                        Back to Products
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white relative">
            {/* Background Image */}
            <div
                className="fixed inset-0 z-0"
                style={{
                    backgroundImage: 'url("https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundAttachment: 'fixed'
                }}
            ></div>

            {/* Dark Overlay */}
            <div className="fixed inset-0 bg-black opacity-70 z-10"></div>

            <div className="relative z-10 px-6 py-8">
                {/* Back Buttons */}
                <div className="max-w-7xl mx-auto mb-8 flex gap-4 flex-wrap">
                    <Link
                        to="/"
                        className="inline-flex items-center bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors backdrop-blur-sm border border-white/20"
                        style={{ fontFamily: "'Poppins', sans-serif" }}
                    >
                        <BsArrowLeft className="mr-2" />
                        Back to Home
                    </Link>
                    <Link
                        to="/products"
                        className="inline-flex items-center bg-blue-600/20 hover:bg-blue-600/30 px-4 py-2 rounded-lg transition-colors backdrop-blur-sm border border-blue-400/20"
                        style={{ fontFamily: "'Poppins', sans-serif" }}
                    >
                        <BsArrowLeft className="mr-2" />
                        Back to Products
                    </Link>
                </div>

                {/* Product Content */}
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
                        {/* Product Image Slider */}
                        <div className="flex justify-center lg:justify-start">
                            <div 
                                className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-2xl max-w-lg w-full hover:border-white/40 transition-all duration-300"
                            >
                                <div className="relative h-[400px] sm:h-[500px] rounded-xl overflow-hidden bg-gray-900">
                                    <ProductImageSlider
                                        images={parseProductImages(product)}
                                        productName={product.name}
                                        isHovered={true}
                                        autoSlideInterval={2000}
                                        showArrows={true}
                                        arrowSize="small"
                                    />
                                </div>
                                {/* Image Counter below slider */}
                                {parseProductImages(product).length > 1 && (
                                    <div className="mt-4 text-center">
                                        <p className="text-sm text-gray-300" style={{ fontFamily: "'Poppins', sans-serif" }}>
                                            {parseProductImages(product).length} images available
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Product Details */}
                        <div className="space-y-6">
                            <div>
                                <h1
                                    className="text-3xl md:text-4xl font-bold mb-4"
                                    style={{ fontFamily: "'Poppins', sans-serif" }}
                                >
                                    {product.name}
                                </h1>
                                <p
                                    className="text-2xl md:text-3xl font-bold text-blue-300 mb-6"
                                    style={{ fontFamily: "'Poppins', sans-serif" }}
                                >
                                    ৳{product.price}
                                </p>
                                <p
                                    className="text-gray-300 text-base md:text-lg leading-relaxed mb-8"
                                    style={{ fontFamily: "'Poppins', sans-serif" }}
                                >
                                    {product.description} Perfect for both formal and casual occasions.
                                </p>
                            </div>

                            {/* Size Selection */}
                            <div>
                                <h3
                                    className="text-lg font-medium mb-3"
                                    style={{ fontFamily: "'Poppins', sans-serif" }}
                                >
                                    Size
                                </h3>
                                <select
                                    value={selectedSize}
                                    onChange={(e) => setSelectedSize(e.target.value)}
                                    className="w-full bg-black/50 border border-white/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-400 transition-colors"
                                    style={{ fontFamily: "'Poppins', sans-serif" }}
                                >
                                    {sizes.map((size) => (
                                        <option key={size} value={size} className="bg-black">
                                            {size}
                                        </option>
                                    ))}
                                </select>
                                <p
                                    className="text-sm text-blue-300 mt-2"
                                    style={{ fontFamily: "'Poppins', sans-serif" }}
                                >
                                    All sizes are in Asian Standard
                                </p>
                            </div>

                            {/* Quantity Selection */}
                            <div>
                                <h3
                                    className="text-lg font-medium mb-3"
                                    style={{ fontFamily: "'Poppins', sans-serif" }}
                                >
                                    Quantity
                                </h3>
                                <input
                                    type="number"
                                    min="1"
                                    max="10"
                                    value={quantity}
                                    onChange={(e) => setQuantity(parseInt(e.target.value))}
                                    className="w-full bg-black/50 border border-white/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-400 transition-colors"
                                    style={{ fontFamily: "'Poppins', sans-serif" }}
                                />
                            </div>

                            {/* Action Buttons */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                                <button
                                    onClick={handleAddToCart}
                                    disabled={addingToCart}
                                    className={`${addingToCart
                                        ? 'bg-gray-600 cursor-not-allowed'
                                        : 'bg-white/10 hover:bg-white/20'
                                        } border border-white/30 text-white px-6 py-3 rounded-lg transition-colors flex items-center justify-center backdrop-blur-sm`}
                                    style={{ fontFamily: "'Poppins', sans-serif" }}
                                >
                                    <BsCart3 className="mr-2" />
                                    {addingToCart ? 'Adding...' : 'Add to Cart'}
                                </button>
                                <button
                                    onClick={handleOrderNow}
                                    disabled={addingToCart}
                                    className={`${addingToCart
                                        ? 'bg-gray-600 cursor-not-allowed'
                                        : 'bg-blue-600 hover:bg-blue-700'
                                        } text-white px-6 py-3 rounded-lg transition-colors font-medium`}
                                    style={{ fontFamily: "'Poppins', sans-serif" }}
                                >
                                    {addingToCart ? 'Processing...' : 'Pre-Order Now'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SinglePage;