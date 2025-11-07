import React, { useState, useEffect, useRef } from 'react';
import { BsChevronLeft, BsChevronRight, BsZoomIn } from 'react-icons/bs';

const ProductImageSlider = ({ 
    images, 
    productName, 
    isHovered, 
    autoSlideInterval = 2500,
    showArrows = false,
    arrowSize = 'normal'
}) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [imageLoading, setImageLoading] = useState(true);
    const [slideDirection, setSlideDirection] = useState('next');
    const intervalRef = useRef(null);
    const timeoutRef = useRef(null);

    // Debug logging
    useEffect(() => {
        if (images && images.length > 1) {
            console.log(`🖼️ ProductImageSlider for "${productName}":`, {
                imageCount: images.length,
                isHovered,
                currentIndex,
                images: images.slice(0, 2) // Show first 2 image URLs for debugging
            });
        }
    }, [images, productName, isHovered, currentIndex]);

    // Auto-slide functionality - only when hovered
    useEffect(() => {
        if (isHovered && images && images.length > 1) {
            // Start auto-slide after a short delay
            timeoutRef.current = setTimeout(() => {
                intervalRef.current = setInterval(() => {
                    setSlideDirection('next');
                    setCurrentIndex((prevIndex) => 
                        prevIndex === images.length - 1 ? 0 : prevIndex + 1
                    );
                }, autoSlideInterval); // Use prop for interval
            }, 800); // Wait 800ms before starting auto-slide
        } else {
            // Clear intervals when not hovered
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
                timeoutRef.current = null;
            }
            // Reset to first image when not hovered
            if (!isHovered) {
                setCurrentIndex(0);
            }
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [isHovered, images]);

    // Handle manual navigation
    const goToPrevious = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setSlideDirection('prev');
        setCurrentIndex((prevIndex) => 
            prevIndex === 0 ? images.length - 1 : prevIndex - 1
        );
        // Restart auto-slide timer
        if (isHovered && intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = setInterval(() => {
                setSlideDirection('next');
                setCurrentIndex((prev) => prev === images.length - 1 ? 0 : prev + 1);
            }, autoSlideInterval);
        }
    };

    const goToNext = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setSlideDirection('next');
        setCurrentIndex((prevIndex) => 
            prevIndex === images.length - 1 ? 0 : prevIndex + 1
        );
        // Restart auto-slide timer
        if (isHovered && intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = setInterval(() => {
                setSlideDirection('next');
                setCurrentIndex((prev) => prev === images.length - 1 ? 0 : prev + 1);
            }, autoSlideInterval);
        }
    };

    // Handle dot navigation
    const goToSlide = (index, e) => {
        e.preventDefault();
        e.stopPropagation();
        setSlideDirection(index > currentIndex ? 'next' : 'prev');
        setCurrentIndex(index);
        // Restart auto-slide timer
        if (isHovered && intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = setInterval(() => {
                setSlideDirection('next');
                setCurrentIndex((prev) => prev === images.length - 1 ? 0 : prev + 1);
            }, autoSlideInterval);
        }
    };

    // If no images or only one image, show single image
    if (!images || images.length === 0) {
        return (
            <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                <div className="text-gray-500 text-sm">No Image</div>
            </div>
        );
    }

    if (images.length === 1) {
        return (
            <div className="relative w-full h-full group">
                <img
                    src={images[0]}
                    alt={productName}
                    className="w-full h-full object-contain bg-gray-900 transition-all duration-700 transform group-hover:scale-110 group-hover:saturate-125 group-hover:brightness-110"
                    onLoad={() => setImageLoading(false)}
                    onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/400x400?text=Image+Not+Found';
                        setImageLoading(false);
                    }}
                />
                {imageLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                    </div>
                )}
                {/* Zoom indicator on hover */}
                {isHovered && !imageLoading && (
                    <div className="absolute top-4 left-4 bg-black/60 text-white text-xs px-3 py-1.5 rounded-full animate-fadeIn backdrop-blur-sm flex items-center gap-2">
                        <BsZoomIn size={14} />
                        <span>Zoomed</span>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="relative w-full h-full overflow-hidden group">
            {/* Image Container with Enhanced Slide Effect */}
            <div className="relative w-full h-full">
                {/* All Images - Enhanced transitions */}
                {images.map((image, index) => {
                    const isActive = index === currentIndex;
                    const isPrev = slideDirection === 'next' 
                        ? index < currentIndex 
                        : index > currentIndex;
                    
                    return (
                        <div
                            key={index}
                            className={`absolute inset-0 transition-all duration-700 ease-out ${
                                isActive 
                                    ? 'opacity-100 transform translate-x-0 scale-100 z-10' 
                                    : isPrev
                                        ? 'opacity-0 transform -translate-x-full scale-95 z-0' 
                                        : 'opacity-0 transform translate-x-full scale-95 z-0'
                            }`}
                        >
                            <img
                                src={image}
                                alt={`${productName} - Image ${index + 1}`}
                                className={`w-full h-full object-contain bg-gray-900 transition-all duration-700 ${
                                    isActive && isHovered ? 'transform scale-110 saturate-125 brightness-110' : ''
                                }`}
                                onLoad={() => index === 0 && setImageLoading(false)}
                                onError={(e) => {
                                    e.target.src = 'https://via.placeholder.com/400x400?text=Image+Not+Found';
                                }}
                            />
                        </div>
                    );
                })}
                
                {/* Loading spinner for first image */}
                {imageLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                    </div>
                )}
            </div>

            {/* Navigation Arrows - Enhanced with better animations */}
            {(showArrows || isHovered) && images.length > 1 && (
                <>
                    <button
                        onClick={goToPrevious}
                        className={`absolute left-3 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-black/70 to-black/50 hover:from-black/90 hover:to-black/70 text-white rounded-full transition-all duration-300 ${showArrows ? '' : 'animate-slideInLeft'} z-50 shadow-2xl hover:scale-110 hover:shadow-white/20 backdrop-blur-sm border border-white/20 ${arrowSize === 'small' ? 'p-2' : 'p-3'}`}
                        aria-label="Previous image"
                    >
                        <BsChevronLeft size={arrowSize === 'small' ? 14 : 20} className="drop-shadow-lg" />
                    </button>
                    <button
                        onClick={goToNext}
                        className={`absolute right-3 top-1/2 transform -translate-y-1/2 bg-gradient-to-l from-black/70 to-black/50 hover:from-black/90 hover:to-black/70 text-white rounded-full transition-all duration-300 ${showArrows ? '' : 'animate-slideInRight'} z-50 shadow-2xl hover:scale-110 hover:shadow-white/20 backdrop-blur-sm border border-white/20 ${arrowSize === 'small' ? 'p-2' : 'p-3'}`}
                        aria-label="Next image"
                    >
                        <BsChevronRight size={arrowSize === 'small' ? 14 : 20} className="drop-shadow-lg" />
                    </button>
                </>
            )}

            {/* Dots Indicator - Enhanced with animation and centered */}
            {isHovered && images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex ml-12 justify-center items-center space-x-2.5 animate-fadeIn z-50 bg-black/40 px-4 py-2 rounded-full backdrop-blur-md border border-white/10 ">
                    {images.map((_, index) => (
                        <button
                            key={index}
                            onClick={(e) => goToSlide(index, e)}
                            className={`transition-all duration-300 rounded-full shadow-lg ${
                                index === currentIndex 
                                    ? 'w-8 h-2.5 bg-white scale-110 shadow-white/50' 
                                    : 'w-2.5 h-2.5 bg-white/50 hover:bg-white/80 hover:scale-110'
                            }`}
                            aria-label={`Go to image ${index + 1}`}
                        />
                    ))}
                </div>
            )}

            {/* Image Counter - Enhanced with gradient */}
            {isHovered && images.length > 1 && (
                <div className="absolute top-4 right-4 bg-gradient-to-r from-black/70 to-black/50 text-white text-sm px-4 py-2 rounded-full animate-slideInDown z-50 shadow-2xl backdrop-blur-md border border-white/20 font-medium">
                    <span className="text-white drop-shadow-lg">{currentIndex + 1}</span>
                    <span className="text-white/60 mx-1.5">/</span>
                    <span className="text-white/90">{images.length}</span>
                </div>
            )}
        </div>
    );
};

export default ProductImageSlider;

// Enhanced custom CSS animations for smooth effects
const styles = `
@keyframes slideInLeft {
    from {
        opacity: 0;
        transform: translateX(-30px) translateY(-50%);
    }
    to {
        opacity: 1;
        transform: translateX(0) translateY(-50%);
    }
}

@keyframes slideInRight {
    from {
        opacity: 0;
        transform: translateX(30px) translateY(-50%);
    }
    to {
        opacity: 1;
        transform: translateX(0) translateY(-50%);
    }
}

@keyframes slideInDown {
    from {
        opacity: 0;
        transform: translateY(-20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateX(-50%) translateY(15px);
    }
    to {
        opacity: 1;
        transform: translateX(-50%) translateY(0);
    }
}

@keyframes pulse {
    0%, 100% {
        opacity: 1;
    }
    50% {
        opacity: 0.6;
    }
}

.animate-slideInLeft {
    animation: slideInLeft 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

.animate-slideInRight {
    animation: slideInRight 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

.animate-slideInDown {
    animation: slideInDown 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

.animate-fadeIn {
    animation: fadeIn 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

.animate-pulse-slow {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
`;

// Inject styles
if (typeof document !== 'undefined') {
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);
}