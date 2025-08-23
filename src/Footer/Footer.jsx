import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-black text-white pt-12 pb-6">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-8 px-4  ">
                    {/* Brand Column */}
                    <div>
                        <h2
                            className="text-xl md:text-2xl font-bold mb-4"
                            style={{ fontFamily: "'Poppins', sans-serif" }}
                        >
                            HARRIS VALE
                        </h2>
                        <p
                            className="text-gray-400 text-sm md:text-base max-w-xs"
                            style={{ fontFamily: "'Poppins', sans-serif" }}
                        >
                            Redefining men's fashion with timeless elegance and
                            modern sophistication. Where every piece tells a story of
                            craftsmanship and distinction.
                        </p>
                    </div>

                    {/* Quick Links Column */}
                    <div>
                        <h3
                            className="text-md md:text-lg font-medium mb-4"
                            style={{ fontFamily: "'Poppins', sans-serif" }}
                        >
                            Quick Links
                        </h3>
                        <ul
                            className="space-y-2 text-sm md:text-base"
                            style={{ fontFamily: "'Poppins', sans-serif" }}
                        >
                            <li>
                                <Link
                                    to="/"
                                    className="text-gray-400 hover:text-white transition-colors"
                                >
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/products"
                                    className="text-gray-400 hover:text-white transition-colors"
                                >
                                    Products
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/about"
                                    className="text-gray-400 hover:text-white transition-colors"
                                >
                                    About
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Column */}
                    <div>
                        <h3
                            className="text-md md:text-lg font-medium mb-4"
                            style={{ fontFamily: "'Poppins', sans-serif" }}
                        >
                            Contact
                        </h3>
                        <a
                            href="mailto:harrisvalebd@gmail.com"
                            className="text-gray-400 hover:text-white transition-colors text-sm md:text-base"
                            style={{ fontFamily: "'Poppins', sans-serif" }}
                        >
                            harrisvalebd@gmail.com
                        </a>
                    </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-gray-800 w-full my-6"></div>

                {/* Copyright */}
                <div
                    className="text-center text-gray-500 text-lg md:text-lg"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                    &copy; {currentYear} Harris Vale. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;