import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const Banner = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isScrolling, setIsScrolling] = useState(false);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const bannerRef = useRef(null);
    const lastScrollTime = useRef(0);
    const scrollTimeout = useRef(null);

    // Fetch categories from database
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                console.log('Fetching categories from API...');
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/categories`);
                const result = await response.json();

                console.log('Categories API response:', result);

                if (result.success && result.data && result.data.length > 0) {
                    setCategories(result.data);
                    console.log('Categories loaded successfully:', result.data.length);
                } else {
                    console.warn('No active categories found or API error');
                    // Fallback to empty array
                    setCategories([]);
                }
            } catch (error) {
                console.error('Error fetching categories:', error);
                // Fallback to empty array on error
                setCategories([]);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    // Helper function to slice description
    const getSlicedDescription = (description, maxLength = 100) => {
        if (!description) return 'Discover our premium collection';
        if (description.length <= maxLength) return description;
        return description.substring(0, maxLength) + '...';
    };

    // Auto-slide functionality (disabled when scroll is active)
    useEffect(() => {
        if (categories.length === 0) return; // Don't start auto-slide if no categories

        const interval = setInterval(() => {
            if (!isScrolling) {
                setCurrentSlide((prev) => (prev + 1) % categories.length);
            }
        }, 5000); // Change slide every 5 seconds

        return () => clearInterval(interval);
    }, [categories.length, isScrolling]);

    // Scroll-based navigation
    useEffect(() => {
        if (categories.length === 0) return; // Don't enable scroll if no categories

        const handleWheel = (e) => {
            const now = Date.now();

            // Prevent rapid scrolling
            if (now - lastScrollTime.current < 100) {
                e.preventDefault();
                return;
            }

            lastScrollTime.current = now;
            setIsScrolling(true);

            // Clear existing timeout
            if (scrollTimeout.current) {
                clearTimeout(scrollTimeout.current);
            }

            // Determine scroll direction
            const deltaY = e.deltaY;

            if (deltaY > 0) { // Scrolling down
                if (currentSlide < categories.length - 1) {
                    e.preventDefault();
                    setCurrentSlide((prev) => prev + 1);
                } else {
                    // Allow natural scroll to next section
                    return;
                }
            } else if (deltaY < 0) { // Scrolling up
                if (currentSlide > 0) {
                    e.preventDefault();
                    setCurrentSlide((prev) => prev - 1);
                } else {
                    // At first slide, allow scroll to previous section
                    return;
                }
            }

            // Reset scrolling state after delay
            scrollTimeout.current = setTimeout(() => {
                setIsScrolling(false);
            }, 1000);
        };

        const bannerElement = bannerRef.current;
        if (bannerElement) {
            bannerElement.addEventListener('wheel', handleWheel, { passive: false });

            return () => {
                bannerElement.removeEventListener('wheel', handleWheel);
                if (scrollTimeout.current) {
                    clearTimeout(scrollTimeout.current);
                }
            };
        }
    }, [currentSlide, categories.length]);

    const goToSlide = (index) => {
        setCurrentSlide(index);
        setIsScrolling(true);

        // Reset scrolling state
        if (scrollTimeout.current) {
            clearTimeout(scrollTimeout.current);
        }
        scrollTimeout.current = setTimeout(() => {
            setIsScrolling(false);
        }, 1000);
    };

    // Show loading state with placeholder
    if (loading) {
        return (
            <div className="relative w-full h-screen overflow-hidden">
                {/* Placeholder Background with Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black"></div>

                {/* Animated Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div
                        className="absolute inset-0 animate-pulse"
                        style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                            backgroundSize: '60px 60px'
                        }}
                    ></div>
                </div>

                {/* Content Skeleton */}
                <div className="relative z-20 flex flex-col justify-center h-full text-white px-8 md:px-16 max-w-2xl">
                    {/* Category Skeleton */}
                    <div className="mb-4 animate-pulse">
                        <div className="h-4 bg-white/20 rounded w-64 mb-2"></div>
                        <div className="h-3 bg-white/15 rounded w-32"></div>
                    </div>

                    {/* Title Skeleton */}
                    <div className="mb-6 animate-pulse">
                        <div className="h-16 md:h-20 bg-white/25 rounded-lg mb-2"></div>
                        <div className="h-16 md:h-20 bg-white/20 rounded-lg w-3/4"></div>
                    </div>

                    {/* Description Skeleton */}
                    <div className="mb-8 animate-pulse">
                        <div className="h-5 bg-white/20 rounded mb-2"></div>
                        <div className="h-5 bg-white/15 rounded w-5/6 mb-2"></div>
                        <div className="h-5 bg-white/15 rounded w-2/3"></div>
                    </div>

                    {/* Button Skeleton */}
                    <div className="animate-pulse">
                        <div className="h-12 bg-white/30 rounded-full w-60"></div>
                    </div>
                </div>

                {/* Navigation Dots Skeleton */}
                <div className="absolute right-8 top-1/2 transform -translate-y-1/2 z-30 flex flex-col space-y-3">
                    {[1, 2, 3, 4].map((_, index) => (
                        <div
                            key={index}
                            className={`w-3 h-3 rounded-full bg-white/30 animate-pulse ${index === 0 ? 'scale-125' : ''}`}
                        ></div>
                    ))}
                </div>

                {/* Slide Counter Skeleton */}
                <div className="absolute bottom-8 left-8 z-30 bg-black/30 backdrop-blur-sm rounded-full px-4 py-2 animate-pulse">
                    <div className="h-4 bg-white/30 rounded w-12"></div>
                </div>

                {/* Loading Text */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-40">
                    <div className="text-center">
                        <div className="inline-flex items-center text-white/70 text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>
                            <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white/70" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Loading premium collections...
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Show message if no categories
    if (categories.length === 0) {
        return (
            <div className="relative w-full h-screen overflow-hidden bg-black flex items-center justify-center">
                <div className="text-center text-white">
                    <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
                        No Collections Available
                    </h2>
                    <p className="text-gray-400" style={{ fontFamily: "'Poppins', sans-serif" }}>
                        Collections are being updated. Please check back soon.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div
            ref={bannerRef}
            id="banner"
            className="relative w-full h-screen overflow-hidden"
        >
            {/* Slides Container */}
            <div
                className="flex flex-col transition-transform duration-700 ease-in-out h-full"
                style={{
                    transform: `translateY(-${currentSlide * 100}vh)`,
                    height: `${categories.length * 100}vh`
                }}
            >
                {categories.map((category) => (
                    <div key={category._id} className="relative w-full h-screen flex-shrink-0">
                        {/* Background Image */}
                        <div
                            className="absolute inset-0 z-0 transition-opacity duration-700"
                            style={{
                                backgroundImage: `url("${category.image}")`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                            }}
                        ></div>

                        {/* Dark Overlay */}
                        <div className="absolute inset-0 bg-black/40 z-10"></div>

                        {/* Content Container */}
                        <div className="relative z-20 flex flex-col justify-center h-full text-white px-8 md:px-16 max-w-2xl">
                            {/* Category */}
                            <div className="mb-4">
                                <p className="text-sm md:text-base font-medium tracking-wider opacity-90 mb-1 uppercase">
                                    Premium Quality Collection
                                </p>
                                <p className="text-xs md:text-sm font-light tracking-widest opacity-70">
                                    HARRIS VALE
                                </p>
                            </div>

                            {/* Main Title */}
                            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight uppercase">
                                {category.name}
                            </h1>

                            {/* Description */}
                            <p className="text-lg md:text-xl font-light opacity-90 max-w-lg mb-8">
                                {getSlicedDescription(category.description, 120)}
                            </p>

                            {/* Browse Button */}
                            <Link
                                to={`/category/${category.id}`}
                                className="inline-flex items-center bg-white hover:bg-white/20 backdrop-blur-sm border border-white/30 text-black hover:text-white px-6 py-3 rounded-full font-medium transition-all duration-300 hover:scale-105 hover:border-white/50 group max-w-fit"
                            >
                                Browse the Collection
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5 ml-2 transition-transform duration-300 group-hover:translate-x-1"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </Link>
                        </div>
                    </div>
                ))}
            </div>

            {/* Navigation Dots */}
            <div className="absolute right-8 top-1/2 transform -translate-y-1/2 z-30 flex flex-col space-y-3">
                {categories.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${currentSlide === index
                            ? 'bg-white scale-125'
                            : 'bg-white/50 hover:bg-white/70'
                            }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>

            {/* Slide Counter */}
            <div className="absolute bottom-8 left-8 z-30 bg-black/30 backdrop-blur-sm rounded-full px-4 py-2">
                <span className="text-white text-sm font-medium" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    {String(currentSlide + 1).padStart(2, '0')} / {String(categories.length).padStart(2, '0')}
                </span>
            </div>
        </div>
    );
};

export default Banner;