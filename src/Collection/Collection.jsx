import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';


const Collection = () => {
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
        <div id="products" className="w-full bg-black text-white py-16 md:py-24">
            <div className="max-w-7xl mx-auto px-6">
                {/* Section Heading */}
                <div className="text-center mb-16">
                    <h2
                        className="text-5xl md:text-6xl lg:text-6xl font-bold mb-6"
                        style={{ fontFamily: "'Poppins', sans-serif" }}
                    >
                        Featured Collection
                    </h2>

                    {/* Section Description */}
                    <p
                        className="text-sm md:text-2xl max-w-4xl mx-auto text-gray-200 leading-relaxed mb-8"
                        style={{ fontFamily: "'Poppins', sans-serif" }}
                    >
                        Discover our handpicked featured products, showcasing the finest in premium menswear,
                        carefully selected for the discerning gentleman who values quality and style.
                    </p>

                    {/* View All Button */}
                    <Link
                        to="/new-arrivals"
                        className="inline-flex items-center bg-gradient-to-r from-white/10 to-white/20 hover:from-white/20 hover:to-white/30 text-white px-8 py-3 font-semibold rounded-full border border-white/30 hover:border-white/50 transition-all duration-300 backdrop-blur-sm group transform hover:scale-105"
                        style={{ fontFamily: "'Poppins', sans-serif" }}
                    >
                        View All Featured Items
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 transform transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </Link>
                </div>

                {/* Product Grid */}
                {loading ? (
                    <div className="flex justify-center items-center py-16">
                        <div className="text-xl" style={{ fontFamily: "'Poppins', sans-serif" }}>
                            Loading featured products...
                        </div>
                    </div>
                ) : products && Array.isArray(products) && products.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {products.slice(0, 3).map((product) => (
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
                                                ${product.price}
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

                        {/* Shop By Category Banner */}
                        <div className="mt-16 -mx-6">
                            <div
                                className="relative h-[200px] md:h-[250px] flex items-center justify-center overflow-hidden"
                                style={{
                                    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.4)), url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    backgroundAttachment: 'fixed'
                                }}
                            >
                                {/* Background blur overlay */}
                                <div className="absolute inset-0 backdrop-blur-[2px] bg-black/20"></div>

                                {/* Animated gradient overlay */}
                                <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/50 animate-pulse"></div>

                                {/* Content */}
                                <div className="relative z-10 text-center px-6">
                                    <h3
                                        className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-4 drop-shadow-2xl"
                                        style={{ fontFamily: "'Poppins', sans-serif" }}
                                    >
                                        Explore Our Categories
                                    </h3>
                                    <p
                                        className="text-sm md:text-lg text-gray-200 mb-8 max-w-2xl mx-auto drop-shadow-lg"
                                        style={{ fontFamily: "'Poppins', sans-serif" }}
                                    >
                                        From casual wear to formal attire, discover the perfect style for every occasion
                                    </p>
                                    <Link
                                        to="/categories"
                                        className="inline-flex items-center bg-gradient-to-r from-white via-gray-100 to-white text-black px-6 py-2 font-semibold text-sm rounded-full hover:from-gray-100 hover:via-white hover:to-gray-100 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl group border border-white/20 hover:border-white/40"
                                        style={{
                                            fontFamily: "'Poppins', sans-serif",
                                            boxShadow: '0 5px 20px rgba(255, 255, 255, 0.2)'
                                        }}
                                    >
                                        Shop By Category
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2 transform transition-transform duration-300 group-hover:translate-x-1 group-hover:scale-110" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </Link>
                                </div>

                                {/* Decorative elements */}
                                <div className="absolute top-4 left-4 w-16 h-16 border-2 border-white/20 rounded-full animate-spin opacity-50"></div>
                                <div className="absolute bottom-4 right-4 w-12 h-12 border-2 border-white/30 rounded-full animate-bounce opacity-60"></div>
                                <div className="absolute top-1/2 left-8 w-2 h-2 bg-white/40 rounded-full animate-pulse"></div>
                                <div className="absolute top-1/3 right-12 w-3 h-3 bg-white/30 rounded-full animate-ping"></div>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex justify-center items-center py-16">
                        <div className="text-xl text-gray-400" style={{ fontFamily: "'Poppins', sans-serif" }}>
                            No featured products found. Please mark some products as featured in the dashboard.
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

export default Collection;