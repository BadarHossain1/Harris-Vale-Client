import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BsArrowLeft, BsHouse, BsArrowRight } from 'react-icons/bs';

const CategoryCollection = () => {
    const [hoveredCard, setHoveredCard] = useState(null);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch categories from database
    useEffect(() => {
        const fetchCategories = async () => {
            setLoading(true);
            try {
                console.log('🔍 Fetching categories from database...');
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/categories`);

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                console.log('📦 Categories data received:', data);

                if (data.success && Array.isArray(data.data)) {
                    setCategories(data.data);
                    console.log('✅ Categories loaded successfully:', data.data.length, 'categories');
                } else {
                    console.error('❌ Unexpected data format:', data);
                    setCategories([]);
                }
            } catch (error) {
                console.error('❌ Error fetching categories:', error);
                setCategories([]);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    return (
        <div className="w-full bg-black text-white py-16">
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
                    <h1
                        className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6"
                        style={{ fontFamily: "'Poppins', sans-serif" }}
                    >
                        Shop by Category
                    </h1>
                    <p
                        className="text-xl md:text-2xl max-w-4xl mx-auto text-gray-200 leading-relaxed"
                        style={{ fontFamily: "'Poppins', sans-serif" }}
                    >
                        Discover our diverse collection of fashion categories, each carefully curated to meet your style needs
                    </p>
                </div>

                {/* Categories Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {loading ? (
                        // Loading skeleton
                        [...Array(6)].map((_, index) => (
                            <div key={index} className="group relative block rounded-2xl overflow-hidden shadow-lg bg-gradient-to-br from-zinc-900 to-zinc-800">
                                <div className="animate-pulse">
                                    {/* Banner skeleton - 16:9 aspect ratio */}
                                    <div className="aspect-video bg-gray-700"></div>
                                    {/* Content skeleton */}
                                    <div className="p-6">
                                        <div className="h-4 bg-gray-600 rounded mb-3 w-20"></div>
                                        <div className="h-6 bg-gray-600 rounded mb-2 w-3/4"></div>
                                        <div className="h-4 bg-gray-600 rounded w-full mb-4"></div>
                                        <div className="h-10 bg-gray-600 rounded-full w-40"></div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : categories.length > 0 ? (
                        categories.map((category) => (
                            <Link
                                key={category.id}
                                to={`/category/${category.id}`}
                                className="group relative block rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 hover:scale-105 bg-gradient-to-br from-zinc-900 to-zinc-800"
                                onMouseEnter={() => setHoveredCard(category.id)}
                                onMouseLeave={() => setHoveredCard(null)}
                                onTouchStart={() => setHoveredCard(category.id)}
                                onTouchEnd={() => setHoveredCard(null)}
                            >
                                {/* Category Banner Image Section */}
                                <div className="relative aspect-video overflow-hidden">
                                    {/* Banner image with proper fit */}
                                    <img
                                        src={category.image}
                                        alt={category.name}
                                        className="w-full h-full object-cover transition-all duration-700 transform group-hover:scale-110 group-hover:saturate-125 group-hover:brightness-110"
                                        onError={(e) => {
                                            e.target.src = 'https://via.placeholder.com/1920x1080/1f2937/ffffff?text=Category+Banner';
                                        }}
                                    />

                                    {/* Premium badge */}
                                    <div className="absolute top-4 left-4">
                                        <div className="bg-black/50 backdrop-blur-md border border-white/20 rounded-full px-3 py-1">
                                            <span className="text-xs font-medium text-white/90" style={{ fontFamily: "'Poppins', sans-serif" }}>
                                                Premium
                                            </span>
                                        </div>
                                    </div>

                                    {/* Shine effect */}
                                    <div
                                        className={`absolute inset-0 bg-gradient-to-tr from-transparent via-white/15 to-transparent opacity-0 transition-opacity duration-700 ${hoveredCard === category.id ? 'animate-shine' : ''}`}
                                    ></div>
                                </div>

                                {/* Category Info Section - Below Image */}
                                <div className="relative p-6 z-10">
                                    <h3
                                        className="text-xl sm:text-2xl font-bold mb-3 text-white transform transition-all duration-300 group-hover:translate-x-2"
                                        style={{ fontFamily: "'Poppins', sans-serif" }}
                                    >
                                        {category.name}
                                    </h3>

                                    {/* Category Description */}
                                    {category.description && (
                                        <p 
                                            className="text-gray-300 text-sm mb-4 opacity-90 line-clamp-2"
                                            style={{ fontFamily: "'Poppins', sans-serif" }}
                                        >
                                            {category.description.length > 100 ? 
                                                category.description.substring(0, 100) + '...' : 
                                                category.description
                                            }
                                        </p>
                                    )}

                                    {/* Explore Button */}
                                    <div className="inline-flex items-center bg-gradient-to-r from-white/15 to-white/25 hover:from-white/25 hover:to-white/35 text-white px-6 py-3 font-semibold rounded-full border border-white/40 hover:border-white/60 transition-all duration-300 backdrop-blur-md group-hover:scale-105 transform shadow-lg hover:shadow-xl">
                                        <span style={{ fontFamily: "'Poppins', sans-serif" }}>
                                            Explore Collection
                                        </span>
                                        <BsArrowRight className="ml-2 transform transition-transform duration-300 group-hover:translate-x-1" size={16} />
                                    </div>

                                    {/* Color indicator bar */}
                                    <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r opacity-60 group-hover:opacity-100 transition-opacity duration-300"
                                        style={{ background: `linear-gradient(to right, var(--tw-gradient-from), var(--tw-gradient-to))` }}
                                    ></div>
                                </div>

                                {/* Decorative Elements */}
                                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-white/10 to-transparent transform rotate-0 group-hover:rotate-12 transition-transform duration-500"></div>
                                <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-white/5 to-transparent transform rotate-0 group-hover:-rotate-12 transition-transform duration-500"></div>
                            </Link>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-16">
                            <div className="text-gray-400 mb-4">
                                <div className="text-6xl mb-4">📂</div>
                                <h3 className="text-2xl font-bold mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                                    No Categories Found
                                </h3>
                                <p className="text-gray-500" style={{ fontFamily: "'Poppins', sans-serif" }}>
                                    Categories will appear here once they are added by administrators.
                                </p>
                            </div>
                        </div>
                    )}
                </div>                {/* Bottom CTA Section */}
                <div className="text-center mt-16">
                    <div className="max-w-3xl mx-auto">
                        <h3
                            className="text-3xl md:text-4xl font-bold mb-4"
                            style={{ fontFamily: "'Poppins', sans-serif" }}
                        >
                            Can't Find What You're Looking For?
                        </h3>
                        <p
                            className="text-gray-300 mb-8"
                            style={{ fontFamily: "'Poppins', sans-serif" }}
                        >
                            Browse our complete product collection or get in touch with us for personalized recommendations
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                to="/products"
                                className="inline-flex items-center bg-white text-black px-8 py-4 font-bold rounded-full hover:bg-gray-100 transition-all duration-300 transform hover:scale-105"
                                style={{ fontFamily: "'Poppins', sans-serif" }}
                            >
                                View All Products
                                <BsArrowRight className="ml-2" size={18} />
                            </Link>
                            <Link
                                to="/contact"
                                className="inline-flex items-center bg-transparent border-2 border-white text-white px-8 py-4 font-bold rounded-full hover:bg-white hover:text-black transition-all duration-300 transform hover:scale-105"
                                style={{ fontFamily: "'Poppins', sans-serif" }}
                            >
                                Contact Us
                            </Link>
                        </div>
                    </div>
                </div>
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

export default CategoryCollection;
