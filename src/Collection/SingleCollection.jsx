import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { BsArrowLeft, BsHouse, BsArrowRight, BsGrid } from 'react-icons/bs';
import ProductImageSlider from './ProductImageSlider';
import { parseProductImages, cleanProductDescription } from './imageUtils';

const SingleCollection = () => {
    const { categoryId } = useParams();
    const [hoveredCard, setHoveredCard] = useState(null);
    const [products, setProducts] = useState([]);
    const [category, setCategory] = useState(null);
    const [loading, setLoading] = useState(true);

    // Fetch category and its products
    useEffect(() => {
        const fetchCategoryAndProducts = async () => {
            try {
                setLoading(true);

                // Fetch category details
                const categoryResponse = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/categories/${categoryId}`);
                const categoryData = await categoryResponse.json();

                if (categoryData.success) {
                    setCategory(categoryData.data);
                }

                // Fetch all products and filter by category
                const productsResponse = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/products`);
                const productsData = await productsResponse.json();

                if (productsData.success && Array.isArray(productsData.data)) {
                    // Filter products by category - match product.category with category.id
                    const filteredProducts = productsData.data.filter(product =>
                        product.category === categoryId
                    );
                    setProducts(filteredProducts);
                    console.log(`Filtered ${filteredProducts.length} products for category: ${categoryId}`);
                } else if (Array.isArray(productsData)) {
                    // Filter products if data is direct array
                    const filteredProducts = productsData.filter(product =>
                        product.category === categoryId
                    );
                    setProducts(filteredProducts);
                } else {
                    console.error('Unexpected data format:', productsData);
                    setProducts([]);
                }

            } catch (error) {
                console.error('Error fetching category/products:', error);
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchCategoryAndProducts();
    }, [categoryId]);

    return (
        <div className="w-full bg-black text-white py-16">
            <div className="max-w-7xl mx-auto px-6">
                {/* Back Navigation */}
                <div className="mb-8 flex flex-wrap gap-4">
                    <Link
                        to="/"
                        className="inline-flex items-center bg-white/10 hover:bg-white/20 px-6 py-3 rounded-xl transition-all duration-300 backdrop-blur-sm border border-white/20 group hover:border-white/40"
                        style={{ fontFamily: "'Poppins', sans-serif" }}
                    >
                        <BsArrowLeft className="mr-3 transform transition-transform duration-300 group-hover:-translate-x-1" size={18} />
                        <BsHouse className="mr-2" size={16} />
                        <span className="font-medium">Back to Home</span>
                    </Link>
                    <Link
                        to="/categories"
                        className="inline-flex items-center bg-blue-600/20 hover:bg-blue-600/30 px-6 py-3 rounded-xl transition-all duration-300 backdrop-blur-sm border border-blue-400/20 group hover:border-blue-400/40"
                        style={{ fontFamily: "'Poppins', sans-serif" }}
                    >
                        <BsArrowLeft className="mr-3 transform transition-transform duration-300 group-hover:-translate-x-1" size={18} />
                        <span className="font-medium">Back to Categories</span>
                    </Link>
                </div>

                {/* Category Header */}
                <div className="text-center mb-16">
                    {category ? (
                        <>
                            {/* Category Name */}
                            <h1
                                className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6"
                                style={{ fontFamily: "'Poppins', sans-serif" }}
                            >
                                {category.name}
                            </h1>

                            {/* Category Description */}
                            <p
                                className="text-xl md:text-2xl max-w-4xl mx-auto text-gray-200 leading-relaxed mb-8"
                                style={{ fontFamily: "'Poppins', sans-serif" }}
                            >
                                {category.description}
                            </p>

                            {/* Category Stats - Only show if products exist */}
                            {!loading && products.length > 0 && (
                                <div className="flex justify-center items-center mb-8">
                                    <div className="text-center">
                                        <div className="text-3xl font-bold text-blue-400" style={{ fontFamily: "'Poppins', sans-serif" }}>
                                            {products.length}
                                        </div>
                                        <div className="text-gray-400 text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>
                                            Products Available
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <>
                            <h1
                                className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6"
                                style={{ fontFamily: "'Poppins', sans-serif" }}
                            >
                                Category Collection
                            </h1>
                            <p
                                className="text-xl md:text-2xl max-w-4xl mx-auto text-gray-200 leading-relaxed"
                                style={{ fontFamily: "'Poppins', sans-serif" }}
                            >
                                Explore our curated collection of premium products
                            </p>
                        </>
                    )}
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {loading ? (
                        // Loading skeleton
                        [...Array(6)].map((_, index) => (
                            <div key={index} className="group relative block rounded-xl overflow-hidden shadow-lg">
                                <div className="animate-pulse">
                                    <div className="h-[300px] sm:h-[350px] md:h-[400px] bg-gray-700 rounded-xl"></div>
                                    <div className="absolute bottom-0 left-0 right-0 p-6">
                                        <div className="h-4 bg-gray-600 rounded mb-3 w-20"></div>
                                        <div className="h-6 bg-gray-600 rounded mb-2 w-3/4"></div>
                                        <div className="h-4 bg-gray-600 rounded w-1/2"></div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : products.length > 0 ? (
                        products.map((product) => (
                            <Link
                                key={product.id}
                                to={`/products/${product.id}`}
                                className="group relative block rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
                                onMouseEnter={() => setHoveredCard(product.id)}
                                onMouseLeave={() => setHoveredCard(null)}
                                onTouchStart={() => setHoveredCard(product.id)}
                                onTouchEnd={() => setHoveredCard(null)}
                            >
                                {/* Card Background */}
                                <div className="absolute inset-0 bg-zinc-900 transition-colors duration-500 group-hover:bg-zinc-800"></div>

                                {/* Product Image Slider with Advanced Effects */}
                                <div className="relative h-[300px] sm:h-[350px] md:h-[400px] overflow-hidden">
                                    {/* Image Slider Component */}
                                    <ProductImageSlider
                                        images={parseProductImages(product)}
                                        productName={product.name}
                                        isHovered={hoveredCard === product.id}
                                    />

                                    {/* Overlay gradient that fades on hover - Lower z-index so controls show above */}
                                    <div
                                        className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-70 transition-opacity duration-500 group-hover:opacity-40 z-10 pointer-events-none"
                                    ></div>

                                    {/* Subtle shine effect on hover - Lower z-index */}
                                    <div
                                        className={`absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 transition-opacity duration-700 z-10 pointer-events-none ${hoveredCard === product.id ? 'animate-shine' : ''}`}
                                    ></div>
                                </div>

                                {/* Product Info with animated reveal */}
                                <div className="relative p-6 z-10">
                                    <h3
                                        className="text-lg sm:text-xl md:text-2xl font-semibold mb-2 transform transition-transform duration-300 md:group-hover:translate-x-3 lg:group-hover:translate-x-5"
                                        style={{ fontFamily: "'Poppins', sans-serif" }}
                                    >
                                        {product.name}
                                    </h3>

                                    <p
                                        className="text-gray-400 mb-4 text-xs sm:text-sm overflow-hidden line-clamp-1 transition-colors duration-300 group-hover:text-gray-300"
                                        style={{ fontFamily: "'Poppins', sans-serif" }}
                                    >
                                        {cleanProductDescription(product.description, 50)}
                                    </p>

                                    {/* Price with animated status indicator */}
                                    <div className="flex justify-between items-center">
                                        <span
                                            className="text-xl sm:text-2xl font-bold transform transition-all duration-300 group-hover:text-white group-hover:scale-105"
                                            style={{ fontFamily: "'Poppins', sans-serif" }}
                                        >
                                            ৳{product.price}
                                        </span>
                                        <div className="relative">
                                            <span className="h-2 w-2 rounded-full bg-green-500 group-hover:animate-pulse"></span>
                                            <span className="absolute inset-0 h-2 w-2 rounded-full bg-green-400/50 group-hover:animate-ping"></span>
                                        </div>
                                    </div>

                                    {/* View Details button - Always visible on mobile, animated on desktop */}
                                    <div className="md:absolute bottom-0 left-0 right-0 p-4 md:p-6 md:transform md:translate-y-full md:opacity-0 opacity-100 transition-all duration-300 ease-in-out group-hover:translate-y-0 group-hover:opacity-100 mt-4 md:mt-0">
                                        <div className="flex justify-center w-full border-t border-white/20 pt-3 md:pt-4 mt-1 md:mt-2">
                                            <span
                                                className="text-xs sm:text-sm font-medium flex items-center text-white/90 group-hover:text-white"
                                                style={{ fontFamily: "'Poppins', sans-serif" }}
                                            >
                                                View Details
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4 ml-2 transform transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                                </svg>
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Corner accent */}
                                <div className="absolute top-0 right-0 w-12 h-12 bg-gradient-to-bl from-white/5 to-transparent transform rotate-0 group-hover:rotate-45 transition-transform duration-500"></div>
                            </Link>
                        ))
                    ) : (
                        /* Coming Soon Section - Full Featured */
                        <div className="col-span-full">
                            <div className="relative min-h-[600px] flex items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-br from-black via-gray-900 to-black border border-white/10">
                                {/* Animated Background Patterns */}
                                <div className="absolute inset-0 opacity-10">
                                    <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl animate-pulse"></div>
                                    <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-500 rounded-full blur-3xl animate-pulse delay-1000"></div>
                                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-500 rounded-full blur-3xl animate-pulse delay-500"></div>
                                </div>

                                {/* Floating Geometric Shapes */}
                                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                                    <div className="absolute top-20 left-20 w-16 h-16 border-2 border-white/20 rounded-lg animate-float"></div>
                                    <div className="absolute top-40 right-32 w-12 h-12 border-2 border-white/20 rounded-full animate-float-delayed"></div>
                                    <div className="absolute bottom-32 left-40 w-20 h-20 border-2 border-white/20 rotate-45 animate-float"></div>
                                    <div className="absolute bottom-20 right-20 w-14 h-14 border-2 border-white/20 rounded-lg animate-float-delayed"></div>
                                </div>

                                {/* Main Content */}
                                <div className="relative z-10 text-center px-6 py-16 max-w-4xl mx-auto">
                                    {/* Icon with Pulse Animation */}
                                    <div className="mb-8 flex justify-center">
                                        <div className="relative">
                                            {/* Pulsing Rings */}
                                            <div className="absolute inset-0 rounded-full bg-white/20 animate-ping"></div>
                                            <div className="absolute inset-0 rounded-full bg-white/10 animate-pulse"></div>
                                            
                                            {/* Main Icon Container */}
                                            <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl p-8 rounded-full border border-white/20 shadow-2xl">
                                                <div className="text-8xl animate-bounce-slow">
                                                    �
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Coming Soon Badge */}
                                    <div className="inline-block mb-6">
                                        <div className="flex items-center space-x-2 bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-xl px-6 py-2 rounded-full border border-white/20 shadow-lg">
                                            <span className="relative flex h-3 w-3">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                                            </span>
                                            <span className="text-white font-semibold text-sm uppercase tracking-wider" style={{ fontFamily: "'Poppins', sans-serif" }}>
                                                Coming Soon
                                            </span>
                                        </div>
                                    </div>

                                    {/* Main Heading with Gradient */}
                                    <h2 
                                        className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-gray-200 to-white bg-clip-text text-transparent animate-gradient"
                                        style={{ fontFamily: "'Poppins', sans-serif" }}
                                    >
                                        Exciting Products
                                        <br />
                                        On The Way
                                    </h2>

                                    {/* Description */}
                                    <p 
                                        className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed max-w-2xl mx-auto"
                                        style={{ fontFamily: "'Poppins', sans-serif" }}
                                    >
                                        We're carefully curating an amazing collection of products for this category. 
                                        Stay tuned for something spectacular!
                                    </p>

                                    {/* Features Grid */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-3xl mx-auto">
                                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 transform hover:-translate-y-2">
                                            <div className="text-4xl mb-3">✨</div>
                                            <h3 className="text-white font-bold mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                                                Premium Quality
                                            </h3>
                                            <p className="text-gray-400 text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>
                                                Hand-picked selections
                                            </p>
                                        </div>
                                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 transform hover:-translate-y-2">
                                            <div className="text-4xl mb-3">🎯</div>
                                            <h3 className="text-white font-bold mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                                                Exclusive Deals
                                            </h3>
                                            <p className="text-gray-400 text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>
                                                Special launch offers
                                            </p>
                                        </div>
                                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 transform hover:-translate-y-2">
                                            <div className="text-4xl mb-3">⚡</div>
                                            <h3 className="text-white font-bold mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                                                Fast Delivery
                                            </h3>
                                            <p className="text-gray-400 text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>
                                                Quick & reliable shipping
                                            </p>
                                        </div>
                                    </div>

                                    
                                </div>

                                {/* Decorative Bottom Wave */}
                                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/50 to-transparent pointer-events-none"></div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Bottom CTA Section */}
                <div className="text-center mt-16">
                    <div className="max-w-3xl mx-auto">
                        <h3
                            className="text-3xl md:text-4xl font-bold mb-4"
                            style={{ fontFamily: "'Poppins', sans-serif" }}
                        >
                            Explore More Collections
                        </h3>
                        <p
                            className="text-gray-300 mb-8"
                            style={{ fontFamily: "'Poppins', sans-serif" }}
                        >
                            Discover other amazing categories or browse our complete product collection
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                to="/categories"
                                className="inline-flex items-center bg-white text-black px-8 py-4 font-bold rounded-full hover:bg-gray-100 transition-all duration-300 transform hover:scale-105"
                                style={{ fontFamily: "'Poppins', sans-serif" }}
                            >
                                View All Categories
                                <BsArrowRight className="ml-2" size={18} />
                            </Link>
                            <Link
                                to="/products"
                                className="inline-flex items-center bg-transparent border-2 border-white text-white px-8 py-4 font-bold rounded-full hover:bg-white hover:text-black transition-all duration-300 transform hover:scale-105"
                                style={{ fontFamily: "'Poppins', sans-serif" }}
                            >
                                All Products
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Custom Animation Styles */}
            <style jsx>{`
                @keyframes shine {
                    0% { transform: translateX(-100%) rotate(25deg); }
                    100% { transform: translateX(100%) rotate(25deg); }
                }
                .animate-shine {
                    animation: shine 1.5s ease-in-out;
                }
                
                @keyframes float {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-20px) rotate(10deg); }
                }
                .animate-float {
                    animation: float 6s ease-in-out infinite;
                }
                
                @keyframes float-delayed {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-15px) rotate(-10deg); }
                }
                .animate-float-delayed {
                    animation: float-delayed 8s ease-in-out infinite;
                    animation-delay: 1s;
                }
                
                @keyframes bounce-slow {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }
                .animate-bounce-slow {
                    animation: bounce-slow 3s ease-in-out infinite;
                }
                
                @keyframes gradient {
                    0%, 100% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                }
                .animate-gradient {
                    background-size: 200% auto;
                    animation: gradient 3s ease infinite;
                }
                
                .delay-500 {
                    animation-delay: 0.5s;
                }
                .delay-1000 {
                    animation-delay: 1s;
                }
            `}</style>
        </div>
    );
};

export default SingleCollection;
