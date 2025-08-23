import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BsArrowLeft, BsHouse } from 'react-icons/bs';

const NewArrivals = () => {
    const [hoveredCard, setHoveredCard] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/api/products`)
            .then((response) => response.json())
            .then((data) => {
                console.log('API Response:', data); // Debug log
                // Handle the response structure from your API
                let allProducts = [];
                if (data.success && Array.isArray(data.data)) {
                    allProducts = data.data;
                } else if (Array.isArray(data)) {
                    allProducts = data;
                } else {
                    console.error('Unexpected data format:', data);
                    setProducts([]);
                    setLoading(false);
                    return;
                }

                // Filter only featured products
                const featuredProducts = allProducts.filter(product => product.featured === true);
                console.log('Featured products found:', featuredProducts.length);
                setProducts(featuredProducts);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching products:', error);
                setProducts([]);
                setLoading(false);
            });
    }, []);




    return (
        <div id="new-arrivals" className="w-full bg-black text-white py-16">
            <div className="max-w-7xl mx-auto px-6">
                {/* Back to Home Button */}
                <div className="mb-8">
                    <Link
                        to="/"
                        className="inline-flex items-center bg-white/10 hover:bg-white/20 px-6 py-3 rounded-xl transition-all duration-300 backdrop-blur-sm border border-white/20 group hover:border-white/40"
                        style={{ fontFamily: "'Poppins', sans-serif" }}
                    >
                        <BsArrowLeft className="mr-3 transform transition-transform duration-300 group-hover:-translate-x-1" size={18} />
                        <BsHouse className="mr-2" size={16} />
                        <span className="font-medium">Back to Home</span>
                    </Link>
                </div>

                {/* Section Heading */}
                <div className="text-center mb-16">
                    <h2
                        className="text-5xl md:text-6xl lg:text-6xl font-bold mb-6"
                        style={{ fontFamily: "'Poppins', sans-serif" }}
                    >
                        Featured Products
                    </h2>

                    {/* Section Description */}
                    <p
                        className="text-xl md:text-2xl max-w-4xl mx-auto text-gray-200 leading-relaxed"
                        style={{ fontFamily: "'Poppins', sans-serif" }}
                    >
                        Explore our specially curated featured collection, showcasing our most popular and trending pieces,
                        handpicked for the modern fashion enthusiast.
                    </p>
                </div>

                {/* Product Grid */}
                {loading ? (
                    <div className="flex justify-center items-center py-16">
                        <div className="text-xl" style={{ fontFamily: "'Poppins', sans-serif" }}>
                            Loading featured products...
                        </div>
                    </div>
                ) : products && products.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {products.map((product) => (
                            <Link
                                to={`/products/${product.id}`}
                                key={product.id}
                                className="group relative block rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform md:hover:-translate-y-2"
                                onMouseEnter={() => setHoveredCard(product.id)}
                                onMouseLeave={() => setHoveredCard(null)}
                                onTouchStart={() => setHoveredCard(product.id)}
                                onTouchEnd={() => setHoveredCard(null)}
                            >
                                {/* Card Background - Changes color on hover */}
                                <div className="absolute inset-0 bg-zinc-900 transition-colors duration-500 group-hover:bg-zinc-800"></div>

                                {/* Product Image with Advanced Effects */}
                                <div className="relative h-[300px] sm:h-[350px] md:h-[400px] overflow-hidden">
                                    {/* Image with zoom and filter effect */}
                                    <div
                                        className="w-full h-full bg-cover bg-center transition-all duration-700 
                                        transform group-hover:scale-105 md:group-hover:scale-110 group-hover:saturate-125 group-hover:brightness-110"
                                        style={{
                                            backgroundImage: `url(${product.image})`,
                                            fontFamily: "'Poppins', sans-serif"
                                        }}
                                    ></div>

                                    {/* Overlay gradient that fades on hover */}
                                    <div
                                        className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-70 transition-opacity duration-500 group-hover:opacity-40"
                                    ></div>

                                    {/* Subtle shine effect on hover */}
                                    <div
                                        className={`absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 transition-opacity duration-700 ${hoveredCard === product.id ? 'animate-shine' : ''}`}
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
                                        {product.description && product.description.length > 50
                                            ? product.description.substring(0, 50) + '...'
                                            : product.description || 'Premium quality product'}
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
                                    <div
                                        className="md:absolute bottom-0 left-0 right-0 p-4 md:p-6 md:transform md:translate-y-full md:opacity-0 opacity-100 transition-all duration-300 ease-in-out group-hover:translate-y-0 group-hover:opacity-100 mt-4 md:mt-0"
                                    >
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
                        ))}
                    </div>
                ) : (
                    <div className="flex justify-center items-center py-16">
                        <div className="text-xl text-gray-400" style={{ fontFamily: "'Poppins', sans-serif" }}>
                            No featured products found. Check back soon for the latest featured items!
                        </div>
                    </div>
                )}
            </div>

            {/* Add keyframe animations */}
            <style jsx>{`
                @keyframes shine {
                    0% { transform: translateX(-100%) rotate(25deg); }
                    100% { transform: translateX(100%) rotate(25deg); }
                }
                .animate-shine {
                    animation: shine 1.5s ease-in-out;
                }
            `}</style>
        </div>
    );
};

export default NewArrivals;
