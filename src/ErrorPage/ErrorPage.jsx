import React from 'react';
import { Link } from 'react-router-dom';
import { BsHouse, BsArrowLeft, BsExclamationTriangle } from 'react-icons/bs';

const ErrorPage = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center px-4 py-8" style={{ fontFamily: "'Poppins', 'Segoe UI', sans-serif" }}>
            <div className="max-w-2xl w-full text-center">
                {/* Error Icon */}
                <div className="mb-8 flex justify-center">
                    <div className="relative">
                        <div className="h-32 w-32 bg-gradient-to-br from-gray-900 via-black to-gray-800 rounded-full flex items-center justify-center shadow-2xl">
                            <BsExclamationTriangle className="text-white" size={48} />
                        </div>
                        <div className="absolute -top-2 -right-2 h-8 w-8 bg-red-500 rounded-full animate-pulse"></div>
                    </div>
                </div>

                {/* Error Code */}
                <div className="mb-6">
                    <h1 className="text-8xl md:text-9xl font-bold text-transparent bg-gradient-to-r from-gray-900 via-black to-gray-800 bg-clip-text mb-4">
                        404
                    </h1>
                    <div className="h-1 w-24 bg-gradient-to-r from-gray-900 via-black to-gray-800 mx-auto rounded-full"></div>
                </div>

                {/* Error Message */}
                <div className="mb-8">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Oops! Page Not Found
                    </h2>
                    <p className="text-lg text-gray-600 max-w-md mx-auto leading-relaxed">
                        The page you're looking for doesn't exist or has been moved.
                        Let's get you back on track.
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
                    <Link
                        to="/"
                        className="flex items-center justify-center px-8 py-4 bg-gradient-to-r from-gray-900 via-black to-gray-800 text-white font-semibold text-lg rounded-full hover:from-black hover:via-gray-900 hover:to-black transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl border border-gray-700 hover:border-gray-600 min-w-[200px] group"
                        style={{
                            background: 'linear-gradient(135deg, #1a1a1a 0%, #000000 50%, #2a2a2a 100%)',
                            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                        }}
                    >
                        <BsHouse className="mr-3 group-hover:scale-110 transition-transform duration-300" size={20} />
                        <span className="bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
                            Go Home
                        </span>
                    </Link>

                    <button
                        onClick={() => window.history.back()}
                        className="flex items-center justify-center px-8 py-4 bg-white text-gray-900 font-semibold text-lg rounded-full border-2 border-gray-900 hover:bg-gray-900 hover:text-white transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl min-w-[200px] group"
                    >
                        <BsArrowLeft className="mr-3 group-hover:scale-110 transition-transform duration-300" size={20} />
                        Go Back
                    </button>
                </div>

                {/* Additional Links */}
                <div className="text-center">
                    <p className="text-gray-500 mb-4">
                        Or explore these popular pages:
                    </p>
                    <div className="flex flex-wrap justify-center gap-6 text-sm">
                        <Link
                            to="/products"
                            className="text-gray-700 hover:text-black transition-colors font-medium hover:underline"
                        >
                            Products
                        </Link>
                        <Link
                            to="/about"
                            className="text-gray-700 hover:text-black transition-colors font-medium hover:underline"
                        >
                            About Us
                        </Link>
                        <Link
                            to="/login"
                            className="text-gray-700 hover:text-black transition-colors font-medium hover:underline"
                        >
                            Login
                        </Link>
                    </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-10 left-10 w-20 h-20 bg-gray-200 rounded-full opacity-30 animate-pulse"></div>
                <div className="absolute bottom-10 right-10 w-16 h-16 bg-gray-300 rounded-full opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
                <div className="absolute top-1/3 right-20 w-12 h-12 bg-gray-400 rounded-full opacity-10 animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>
        </div>
    );
};

export default ErrorPage;