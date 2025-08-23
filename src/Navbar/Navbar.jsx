import React, { useState, useContext } from 'react';
import { BsCart3, BsList, BsX, BsPerson, BsBoxArrowRight, BsSpeedometer2, BsHouse, BsGrid, BsInfoCircle, BsShop, BsBag, BsSuitHeart, BsPatchCheck } from 'react-icons/bs';
import { Link, useLocation } from 'react-router-dom';
import Cart from '../Cart/Cart';
import { AuthContext } from '../Provider/ContextProvider';


const Navbar = () => {
    const { user, Logout } = useContext(AuthContext);
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    const toggleCart = () => {
        setIsCartOpen(!isCartOpen);
    };

    const closeCart = () => {
        setIsCartOpen(false);
    };

    const toggleProfileDropdown = () => {
        setIsProfileDropdownOpen(!isProfileDropdownOpen);
    };

    const closeProfileDropdown = () => {
        setIsProfileDropdownOpen(false);
    };

    const handleLogout = async () => {
        try {
            await Logout();
            closeProfileDropdown();
            // Optional: Show success message or redirect
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return (
        <>
            <nav id='navbar' className="bg-white shadow-sm py-2 px-6 w-full sticky top-0 z-50" style={{ fontFamily: "'Poppins', 'Segoe UI', sans-serif" }}>
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    {/* Logo */}
                    <Link
                        to="/"
                        className="font-bold text-2xl text-gray-800 tracking-wide hover:text-gray-600 transition-colors cursor-pointer"
                    >
                        HARRIS VALE
                    </Link>                    {/* Desktop Navigation Links and Cart */}
                    <div className="flex items-center">
                        <div className="hidden md:flex space-x-8 mr-8">
                            <Link to='/' className={`flex items-center space-x-2 transition-colors font-medium cursor-pointer ${location.pathname === '/' ? 'text-gray-900 border-b-2 border-gray-900 pb-1' : 'text-gray-800 hover:text-gray-600'}`}>
                                <BsHouse size={16} />
                                <span>Home</span>
                            </Link>
                            <Link to="/products" className={`flex items-center space-x-2 transition-colors font-medium cursor-pointer ${location.pathname === '/products' ? 'text-gray-900 border-b-2 border-gray-900 pb-1' : 'text-gray-800 hover:text-gray-600'}`}>
                                <BsGrid size={16} />
                                <span>Products</span>
                            </Link>
                            <Link to="/about" className={`flex items-center space-x-2 transition-colors font-medium cursor-pointer ${location.pathname === '/about' ? 'text-gray-900 border-b-2 border-gray-900 pb-1' : 'text-gray-800 hover:text-gray-600'}`}>
                                <BsInfoCircle size={16} />
                                <span>About</span>
                            </Link>
                        </div>

                        {/* Cart Icon */}
                        <div
                            onClick={toggleCart}
                            className="flex items-center justify-center h-10 w-10 bg-gray-100 rounded-full text-gray-800 cursor-pointer hover:bg-gray-200 transition-colors mr-4 relative shadow-sm"
                        >
                            <BsCart3 size={20} />
                            {/* Cart Badge (optional - shows item count) */}
                            {/* <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">0</span> */}
                        </div>

                        {/* User Profile or Login Button */}
                        {user ? (
                            <div className="relative">
                                {/* User Profile Image */}
                                <div
                                    onClick={toggleProfileDropdown}
                                    className="flex items-center justify-center h-10 w-10 rounded-full cursor-pointer hover:ring-2 hover:ring-gray-800 hover:ring-offset-2 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl mr-4 relative group"
                                >
                                    {user?.photoURL ? (
                                        <img
                                            src={user.photoURL}
                                            alt={user.displayName || 'User'}
                                            className="h-10 w-10 rounded-full object-cover border-2 border-gray-300 group-hover:border-gray-800 transition-colors"
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                                e.target.nextSibling.style.display = 'flex';
                                            }}
                                        />
                                    ) : null}
                                    <div
                                        className={`h-10 w-10 rounded-full bg-gradient-to-r from-gray-900 via-black to-gray-800 flex items-center justify-center border-2 border-gray-300 group-hover:border-gray-800 transition-colors shadow-inner ${user?.photoURL ? 'hidden' : 'flex'}`}
                                        style={{ display: user?.photoURL ? 'none' : 'flex' }}
                                    >
                                        <BsPerson className="text-white" size={20} />
                                    </div>
                                </div>

                                {/* Dropdown Menu */}
                                {isProfileDropdownOpen && (
                                    <>
                                        {/* Backdrop */}
                                        <div
                                            className="fixed inset-0 z-30"
                                            onClick={closeProfileDropdown}
                                        ></div>

                                        {/* Dropdown Content */}
                                        <div className="absolute right-0 top-12 w-64 bg-white rounded-2xl shadow-2xl border border-gray-200 py-3 z-40 transform transition-all duration-200 ease-out opacity-100 scale-100"
                                            style={{
                                                background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                                                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.05)'
                                            }}
                                        >
                                            {/* User Info Header */}
                                            <div className="px-5 py-4 border-b border-gray-100">
                                                <div className="flex items-center space-x-4">
                                                    {user?.photoURL ? (
                                                        <img
                                                            src={user.photoURL}
                                                            alt={user.displayName || 'User'}
                                                            className="h-12 w-12 rounded-full object-cover border-2 border-gray-800 shadow-md"
                                                            onError={(e) => {
                                                                e.target.style.display = 'none';
                                                                e.target.nextSibling.style.display = 'flex';
                                                            }}
                                                        />
                                                    ) : null}
                                                    <div
                                                        className={`h-12 w-12 rounded-full bg-gradient-to-r from-gray-900 via-black to-gray-800 flex items-center justify-center border-2 border-gray-800 shadow-md ${user?.photoURL ? 'hidden' : 'flex'}`}
                                                        style={{ display: user?.photoURL ? 'none' : 'flex' }}
                                                    >
                                                        <BsPerson className="text-white" size={24} />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-lg font-bold text-gray-900 truncate" style={{ fontFamily: "'Poppins', sans-serif" }}>
                                                            {user?.displayName || 'User'}
                                                        </p>
                                                        <p className="text-sm text-gray-600 truncate" style={{ fontFamily: "'Poppins', sans-serif" }}>
                                                            {user?.email}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Menu Items */}
                                            <div className="py-2 px-2">
                                                <Link
                                                    to="/user-profile"
                                                    onClick={closeProfileDropdown}
                                                    className="flex items-center px-4 py-3 text-base font-medium text-gray-800 hover:bg-gray-900 hover:text-white transition-all duration-300 rounded-xl group w-full"
                                                    style={{ fontFamily: "'Poppins', sans-serif" }}
                                                >
                                                    <BsPerson className="mr-3 group-hover:scale-110 transition-transform duration-300" size={18} />
                                                    View Profile
                                                </Link>

                                                <button
                                                    onClick={handleLogout}
                                                    className="w-full flex items-center px-4 py-3 text-base font-medium text-gray-800 hover:bg-red-600 hover:text-white transition-all duration-300 rounded-xl group mt-1"
                                                    style={{ fontFamily: "'Poppins', sans-serif" }}
                                                >
                                                    <BsBoxArrowRight className="mr-3 group-hover:scale-110 transition-transform duration-300" size={18} />
                                                    Logout
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        ) : (
                            /* Login Button for non-authenticated users */
                            <Link
                                to="/login"
                                className="hidden md:flex items-center justify-center px-6 py-2.5 bg-gradient-to-r from-gray-900 via-black to-gray-800 text-white font-medium text-sm rounded-full hover:from-black hover:via-gray-900 hover:to-black transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl border border-gray-700 hover:border-gray-600 backdrop-blur-sm mr-4"
                                style={{
                                    fontFamily: "'Poppins', 'Segoe UI', sans-serif",
                                    background: 'linear-gradient(135deg, #1a1a1a 0%, #000000 50%, #2a2a2a 100%)',
                                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                                }}
                            >
                                <span className="bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent font-semibold">
                                    Login
                                </span>
                            </Link>
                        )}

                        {/* Mobile Menu Button */}
                        <button
                            onClick={toggleMobileMenu}
                            className="md:hidden flex items-center justify-center h-10 w-10 text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            {isMobileMenuOpen ? <BsX size={24} /> : <BsList size={24} />}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Secondary Navigation - Category Bar */}
            <div className="bg-white border-t border-gray-100 py-2 px-6 w-full sticky top-12 z-40 shadow-sm" style={{ fontFamily: "'Poppins', 'Segoe UI', sans-serif" }}>
                <div className="max-w-7xl mx-auto">
                    {/* Desktop Category Navigation */}
                    <div className="hidden md:flex items-center justify-center space-x-8 overflow-x-auto">
                        <Link
                            to="/category/shirts"
                            className="text-gray-700 hover:text-gray-900 transition-colors font-medium text-sm uppercase tracking-wide whitespace-nowrap py-2 px-1 border-b-2 border-transparent hover:border-gray-900"
                        >
                            <span>SHIRTS</span>
                        </Link>
                        <Link
                            to="/category/pants"
                            className="text-gray-700 hover:text-gray-900 transition-colors font-medium text-sm uppercase tracking-wide whitespace-nowrap py-2 px-1 border-b-2 border-transparent hover:border-gray-900"
                        >
                            <span>PANTS</span>
                        </Link>
                        <Link
                            to="/category/jackets"
                            className="text-gray-700 hover:text-gray-900 transition-colors font-medium text-sm uppercase tracking-wide whitespace-nowrap py-2 px-1 border-b-2 border-transparent hover:border-gray-900"
                        >
                            <span>JACKETS</span>
                        </Link>
                        <Link
                            to="/category/casual-wear"
                            className="text-gray-700 hover:text-gray-900 transition-colors font-medium text-sm uppercase tracking-wide whitespace-nowrap py-2 px-1 border-b-2 border-transparent hover:border-gray-900"
                        >
                            <span>CASUAL WEAR</span>
                        </Link>
                    </div>

                    {/* Mobile Category Navigation - Horizontal Scroll */}
                    <div className="md:hidden flex items-center space-x-6 overflow-x-auto scrollbar-hide">
                        <Link
                            to="/category/shirts"
                            className="text-gray-700 hover:text-gray-900 transition-colors font-medium text-xs uppercase tracking-wide whitespace-nowrap py-2 px-1"
                        >
                            <span>SHIRTS</span>
                        </Link>
                        <Link
                            to="/category/pants"
                            className="text-gray-700 hover:text-gray-900 transition-colors font-medium text-xs uppercase tracking-wide whitespace-nowrap py-2 px-1"
                        >
                            <span>PANTS</span>
                        </Link>
                        <Link
                            to="/category/jackets"
                            className="text-gray-700 hover:text-gray-900 transition-colors font-medium text-xs uppercase tracking-wide whitespace-nowrap py-2 px-1"
                        >
                            <span>JACKETS</span>
                        </Link>
                        <Link
                            to="/category/casual-wear"
                            className="text-gray-700 hover:text-gray-900 transition-colors font-medium text-xs uppercase tracking-wide whitespace-nowrap py-2 px-1"
                        >
                            <span>CASUAL WEAR</span>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Cart Modal */}
            {isCartOpen && (
                <Cart closeCart={closeCart} />
            )}

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" onClick={closeMobileMenu}></div>
            )}

            {/* Mobile Menu */}
            <div className={`fixed top-0 right-0 h-full w-80 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 md:hidden ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="flex flex-col h-full" style={{ fontFamily: "'Poppins', 'Segoe UI', sans-serif" }}>

                    {/* User Profile Section at Top - Fixed */}
                    {user ? (
                        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100 flex-shrink-0">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center space-x-4">
                                    {user?.photoURL ? (
                                        <img
                                            src={user.photoURL}
                                            alt={user.displayName || 'User'}
                                            className="h-16 w-16 rounded-full object-cover border-3 border-gray-800 shadow-lg"
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                                e.target.nextSibling.style.display = 'flex';
                                            }}
                                        />
                                    ) : null}
                                    <div
                                        className={`h-16 w-16 rounded-full bg-gradient-to-r from-gray-900 via-black to-gray-800 flex items-center justify-center border-3 border-gray-800 shadow-lg ${user?.photoURL ? 'hidden' : 'flex'}`}
                                        style={{ display: user?.photoURL ? 'none' : 'flex' }}
                                    >
                                        <BsPerson className="text-white" size={32} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xl font-bold text-gray-900 truncate">
                                            {user?.displayName || 'User'}
                                        </p>
                                        <p className="text-sm text-gray-600 truncate">
                                            {user?.email}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={closeMobileMenu}
                                    className="flex items-center justify-center h-10 w-10 text-gray-800 hover:bg-gray-200 rounded-lg transition-colors"
                                >
                                    <BsX size={24} />
                                </button>
                            </div>
                            {/* User Actions */}
                            <div className="flex space-x-2">
                                <Link
                                    to="/user-profile"
                                    onClick={closeMobileMenu}
                                    className="flex-1 flex items-center justify-center space-x-2 bg-gray-900 hover:bg-black text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300"
                                >
                                    <BsPerson size={16} />
                                    <span>Profile</span>
                                </Link>
                                <button
                                    onClick={() => {
                                        handleLogout();
                                        closeMobileMenu();
                                    }}
                                    className="flex-1 flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300"
                                >
                                    <BsBoxArrowRight size={16} />
                                    <span>Logout</span>
                                </button>
                            </div>
                        </div>
                    ) : (
                        /* Login/Signup Section for non-authenticated users - Fixed */
                        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100 flex-shrink-0">
                            <div className="flex justify-between items-center mb-4">
                                <div className="flex items-center space-x-3">
                                    <div className="h-12 w-12 rounded-full bg-gradient-to-r from-gray-900 via-black to-gray-800 flex items-center justify-center shadow-lg">
                                        <BsPerson className="text-white" size={24} />
                                    </div>
                                    <div>
                                        <p className="text-lg font-bold text-gray-900">Welcome!</p>
                                        <p className="text-sm text-gray-600">Sign in to your account</p>
                                    </div>
                                </div>
                                <button
                                    onClick={closeMobileMenu}
                                    className="flex items-center justify-center h-10 w-10 text-gray-800 hover:bg-gray-200 rounded-lg transition-colors"
                                >
                                    <BsX size={24} />
                                </button>
                            </div>
                            <div className="flex space-x-2">
                                <Link
                                    to="/login"
                                    onClick={closeMobileMenu}
                                    className="flex-1 bg-gradient-to-r from-gray-900 via-black to-gray-800 text-white font-semibold text-center py-3 px-4 rounded-lg hover:from-black hover:via-gray-900 hover:to-black transition-all duration-300"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/signup"
                                    onClick={closeMobileMenu}
                                    className="flex-1 bg-white border-2 border-gray-900 text-gray-900 font-semibold text-center py-3 px-4 rounded-lg hover:bg-gray-900 hover:text-white transition-all duration-300"
                                >
                                    Sign Up
                                </Link>
                            </div>
                        </div>
                    )}

                    {/* Scrollable Navigation Content */}
                    <div className="flex-1 overflow-y-auto">
                        <div className="py-6 px-6 space-y-6">
                            {/* Navigation Links */}
                            <div>
                                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Navigation</h3>
                                <div className="space-y-1">
                                    <Link
                                        to="/"
                                        onClick={closeMobileMenu}
                                        className={`flex items-center space-x-3 transition-colors font-medium text-lg py-3 px-4 rounded-lg cursor-pointer ${location.pathname === '/' ? 'text-gray-900 bg-gray-100' : 'text-gray-800 hover:text-blue-600 hover:bg-blue-50'}`}
                                    >
                                        <BsHouse size={18} />
                                        <span>Home</span>
                                    </Link>
                                    <Link
                                        to="/products"
                                        onClick={closeMobileMenu}
                                        className={`flex items-center space-x-3 transition-colors font-medium text-lg py-3 px-4 rounded-lg cursor-pointer ${location.pathname === '/products' ? 'text-gray-900 bg-gray-100' : 'text-gray-800 hover:text-blue-600 hover:bg-blue-50'}`}
                                    >
                                        <BsGrid size={18} />
                                        <span>Products</span>
                                    </Link>
                                    <Link
                                        to="/about"
                                        onClick={closeMobileMenu}
                                        className={`flex items-center space-x-3 transition-colors font-medium text-lg py-3 px-4 rounded-lg cursor-pointer ${location.pathname === '/about' ? 'text-gray-900 bg-gray-100' : 'text-gray-800 hover:text-blue-600 hover:bg-blue-50'}`}
                                    >
                                        <BsInfoCircle size={18} />
                                        <span>About</span>
                                    </Link>
                                </div>
                            </div>

                            {/* Categories Section */}
                            <div>
                                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Categories</h3>
                                <div className="space-y-1">
                                    <Link
                                        to="/category/shirts"
                                        onClick={closeMobileMenu}
                                        className="flex items-center space-x-3 text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors font-medium py-2 px-4 rounded-lg"
                                    >
                                        <BsShop size={16} />
                                        <span>Shirts</span>
                                    </Link>
                                    <Link
                                        to="/category/pants"
                                        onClick={closeMobileMenu}
                                        className="flex items-center space-x-3 text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors font-medium py-2 px-4 rounded-lg"
                                    >
                                        <BsBag size={16} />
                                        <span>Pants</span>
                                    </Link>
                                    <Link
                                        to="/category/jackets"
                                        onClick={closeMobileMenu}
                                        className="flex items-center space-x-3 text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors font-medium py-2 px-4 rounded-lg"
                                    >
                                        <BsSuitHeart size={16} />
                                        <span>Jackets</span>
                                    </Link>
                                    <Link
                                        to="/category/casual-wear"
                                        onClick={closeMobileMenu}
                                        className="flex items-center space-x-3 text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors font-medium py-2 px-4 rounded-lg"
                                    >
                                        <BsPatchCheck size={16} />
                                        <span>Casual Wear</span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Mobile Menu Footer - Fixed at Bottom */}
                    <div className="border-t border-gray-200 p-6 flex-shrink-0">
                        <div className="text-center text-gray-500 text-sm">
                            © 2025 Harris Vale
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Navbar;