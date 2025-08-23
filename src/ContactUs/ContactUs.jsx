import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    BsArrowLeft,
    BsHouse,
    BsEnvelope,
    BsPhone,
    BsGeoAlt,
    BsClock,
    BsFacebook,
    BsTwitter,
    BsInstagram,
    BsLinkedin,
    BsSend,
    BsPerson,
    BsChatDots
} from 'react-icons/bs';

const ContactUs = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Simulate form submission
            await new Promise(resolve => setTimeout(resolve, 1500));
            setSubmitSuccess(true);
            setFormData({ name: '', email: '', subject: '', message: '' });

            setTimeout(() => {
                setSubmitSuccess(false);
            }, 3000);
        } catch (error) {
            console.error('Error submitting form:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

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

                {/* Page Header */}
                <div className="text-center mb-16">
                    <h1
                        className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6"
                        style={{ fontFamily: "'Poppins', sans-serif" }}
                    >
                        Contact Us
                    </h1>
                    <p
                        className="text-xl md:text-2xl max-w-4xl mx-auto text-gray-200 leading-relaxed"
                        style={{ fontFamily: "'Poppins', sans-serif" }}
                    >
                        We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-16">
                    {/* Contact Form */}
                    <div className="bg-gray-900/50 rounded-2xl border border-gray-700/50 p-8 backdrop-blur-sm">
                        <h2
                            className="text-3xl font-bold mb-6 flex items-center"
                            style={{ fontFamily: "'Poppins', sans-serif" }}
                        >
                            <BsChatDots className="mr-3 text-blue-400" size={32} />
                            Send us a Message
                        </h2>

                        {submitSuccess && (
                            <div className="mb-6 p-4 bg-green-500/20 border border-green-500/30 rounded-lg">
                                <p className="text-green-400 font-medium" style={{ fontFamily: "'Poppins', sans-serif" }}>
                                    ✅ Message sent successfully! We'll get back to you soon.
                                </p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Name Field */}
                            <div>
                                <label
                                    htmlFor="name"
                                    className="flex items-center text-sm font-medium text-gray-300 mb-2"
                                    style={{ fontFamily: "'Poppins', sans-serif" }}
                                >
                                    <BsPerson className="mr-2" size={16} />
                                    Full Name *
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200"
                                    style={{ fontFamily: "'Poppins', sans-serif" }}
                                    placeholder="Enter your full name"
                                />
                            </div>

                            {/* Email Field */}
                            <div>
                                <label
                                    htmlFor="email"
                                    className="flex items-center text-sm font-medium text-gray-300 mb-2"
                                    style={{ fontFamily: "'Poppins', sans-serif" }}
                                >
                                    <BsEnvelope className="mr-2" size={16} />
                                    Email Address *
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200"
                                    style={{ fontFamily: "'Poppins', sans-serif" }}
                                    placeholder="Enter your email address"
                                />
                            </div>

                            {/* Subject Field */}
                            <div>
                                <label
                                    htmlFor="subject"
                                    className="flex items-center text-sm font-medium text-gray-300 mb-2"
                                    style={{ fontFamily: "'Poppins', sans-serif" }}
                                >
                                    <BsChatDots className="mr-2" size={16} />
                                    Subject *
                                </label>
                                <input
                                    type="text"
                                    id="subject"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200"
                                    style={{ fontFamily: "'Poppins', sans-serif" }}
                                    placeholder="What's this about?"
                                />
                            </div>

                            {/* Message Field */}
                            <div>
                                <label
                                    htmlFor="message"
                                    className="flex items-center text-sm font-medium text-gray-300 mb-2"
                                    style={{ fontFamily: "'Poppins', sans-serif" }}
                                >
                                    <BsChatDots className="mr-2" size={16} />
                                    Message *
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                    rows={6}
                                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200 resize-vertical"
                                    style={{ fontFamily: "'Poppins', sans-serif" }}
                                    placeholder="Tell us how we can help you..."
                                />
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold px-8 py-4 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                                style={{ fontFamily: "'Poppins', sans-serif" }}
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        <BsSend className="mr-3" size={18} />
                                        Send Message
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Contact Information */}
                    <div className="space-y-8">
                        <div className="bg-gray-900/50 rounded-2xl border border-gray-700/50 p-8 backdrop-blur-sm">
                            <h2
                                className="text-3xl font-bold mb-6"
                                style={{ fontFamily: "'Poppins', sans-serif" }}
                            >
                                Get in Touch
                            </h2>

                            <div className="space-y-6">
                                {/* Phone */}
                                <div className="flex items-start">
                                    <div className="bg-blue-500/20 p-3 rounded-lg mr-4">
                                        <BsPhone className="text-blue-400" size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-white mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>
                                            Phone
                                        </h3>
                                        <p className="text-gray-400" style={{ fontFamily: "'Poppins', sans-serif" }}>
                                            +880 1234 567 890
                                        </p>
                                    </div>
                                </div>

                                {/* Email */}
                                <div className="flex items-start">
                                    <div className="bg-green-500/20 p-3 rounded-lg mr-4">
                                        <BsEnvelope className="text-green-400" size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-white mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>
                                            Email
                                        </h3>
                                        <p className="text-gray-400" style={{ fontFamily: "'Poppins', sans-serif" }}>
                                            info@harrisvalle.com
                                        </p>
                                    </div>
                                </div>

                                {/* Address */}
                                <div className="flex items-start">
                                    <div className="bg-purple-500/20 p-3 rounded-lg mr-4">
                                        <BsGeoAlt className="text-purple-400" size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-white mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>
                                            Address
                                        </h3>
                                        <p className="text-gray-400" style={{ fontFamily: "'Poppins', sans-serif" }}>
                                            123 Fashion Street<br />
                                            Dhaka 1000, Bangladesh
                                        </p>
                                    </div>
                                </div>

                                {/* Business Hours */}
                                <div className="flex items-start">
                                    <div className="bg-orange-500/20 p-3 rounded-lg mr-4">
                                        <BsClock className="text-orange-400" size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-white mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>
                                            Business Hours
                                        </h3>
                                        <p className="text-gray-400" style={{ fontFamily: "'Poppins', sans-serif" }}>
                                            Monday - Saturday: 9:00 AM - 10:00 PM<br />
                                            Sunday: 10:00 AM - 8:00 PM
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Social Media */}
                        <div className="bg-gray-900/50 rounded-2xl border border-gray-700/50 p-8 backdrop-blur-sm">
                            <h3
                                className="text-2xl font-bold mb-6"
                                style={{ fontFamily: "'Poppins', sans-serif" }}
                            >
                                Follow Us
                            </h3>
                            <div className="flex space-x-4">
                                <a
                                    href="#"
                                    className="bg-blue-600/20 hover:bg-blue-600/30 p-3 rounded-lg transition-colors duration-300"
                                    aria-label="Facebook"
                                >
                                    <BsFacebook className="text-blue-400" size={24} />
                                </a>
                                <a
                                    href="#"
                                    className="bg-blue-400/20 hover:bg-blue-400/30 p-3 rounded-lg transition-colors duration-300"
                                    aria-label="Twitter"
                                >
                                    <BsTwitter className="text-blue-300" size={24} />
                                </a>
                                <a
                                    href="#"
                                    className="bg-pink-600/20 hover:bg-pink-600/30 p-3 rounded-lg transition-colors duration-300"
                                    aria-label="Instagram"
                                >
                                    <BsInstagram className="text-pink-400" size={24} />
                                </a>
                                <a
                                    href="#"
                                    className="bg-blue-700/20 hover:bg-blue-700/30 p-3 rounded-lg transition-colors duration-300"
                                    aria-label="LinkedIn"
                                >
                                    <BsLinkedin className="text-blue-300" size={24} />
                                </a>
                            </div>
                        </div>

                        {/* Quick Help */}
                        <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl border border-blue-500/20 p-8">
                            <h3
                                className="text-2xl font-bold mb-4"
                                style={{ fontFamily: "'Poppins', sans-serif" }}
                            >
                                Need Quick Help?
                            </h3>
                            <p
                                className="text-gray-300 mb-4"
                                style={{ fontFamily: "'Poppins', sans-serif" }}
                            >
                                Check out our FAQ section for instant answers to common questions.
                            </p>
                            <Link
                                to="/faq"
                                className="inline-flex items-center bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 px-6 py-3 rounded-lg font-medium transition-all duration-300"
                                style={{ fontFamily: "'Poppins', sans-serif" }}
                            >
                                View FAQ
                                <BsArrowLeft className="ml-2 rotate-180" size={16} />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactUs;
