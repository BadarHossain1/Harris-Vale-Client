import React, { useContext, useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BsArrowLeft, BsPerson, BsEnvelope, BsShield, BsHeart, BsCart3, BsClock, BsChevronDown, BsChevronUp, BsBox, BsPencilSquare } from 'react-icons/bs';
import { AuthContext } from '../Provider/ContextProvider';
import { toast } from 'react-toastify';

const UserProfile = () => {
    const { user } = useContext(AuthContext);
    const location = useLocation();

    // State for real data
    const [userStats, setUserStats] = useState({
        ordersCount: 0,
        wishlistCount: 0,
        memberSince: user?.metadata?.creationTime ? new Date(user.metadata.creationTime).getFullYear() : 2024,
        totalSpent: 0
    });
    const [recentOrders, setRecentOrders] = useState([]);
    const [expandedOrders, setExpandedOrders] = useState(new Set());
    const [loading, setLoading] = useState(true);

    // Check if user came from successful order placement
    useEffect(() => {
        if (location.state?.orderPlaced && location.state?.orderId) {
            toast.success(`🎉 Order placed successfully! Order ID: ${location.state.orderId}`, {
                position: "top-center",
                autoClose: 6000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });

            // Clear the state so the message doesn't show again on refresh
            window.history.replaceState({}, document.title);
        }
    }, [location.state]);

    // Function to get user information
    const getUserInfo = useCallback(() => {
        if (user && user.email) {
            return {
                userId: user.uid,
                userEmail: user.email,
                userName: user.displayName || user.email.split('@')[0]
            };
        }
        return null;
    }, [user]);

    // Function to toggle order expansion
    const toggleOrderExpansion = (orderId) => {
        setExpandedOrders(prev => {
            const newExpanded = new Set(prev);
            if (newExpanded.has(orderId)) {
                newExpanded.delete(orderId);
            } else {
                newExpanded.add(orderId);
            }
            return newExpanded;
        });
    };

    // Fetch all data on component mount
    useEffect(() => {
        const fetchUserOrders = async () => {
            try {
                const userInfo = getUserInfo();
                if (!userInfo) return;

                const queryParams = new URLSearchParams();
                queryParams.append('userEmail', userInfo.userEmail);

                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/orders/user?${queryParams}`);
                const data = await response.json();

                if (data.success && data.data) {
                    const orders = data.data;

                    // Calculate stats
                    const totalSpent = orders.reduce((total, order) => total + order.totalAmount, 0);
                    const ordersCount = orders.length;

                    setUserStats(prev => ({
                        ...prev,
                        ordersCount,
                        totalSpent
                    }));

                    // Get recent orders (last 5)
                    const sortedOrders = orders
                        .sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate))
                        .slice(0, 5)
                        .map((order, index) => ({
                            id: order.orderId,
                            orderNumber: index + 1,
                            title: `Order #${index + 1}`,
                            date: new Date(order.orderDate).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                            }),
                            amount: `৳${order.totalAmount}`,
                            status: order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1),
                            items: order.items,
                            deliveryAddress: order.deliveryAddress,
                            paymentMethod: order.paymentMethod || 'Cash on Delivery'
                        }));

                    setRecentOrders(sortedOrders);
                } else {
                    console.log('No orders found for user');
                }
            } catch (error) {
                console.error('Error fetching user orders:', error);
                toast.error('Error loading order history');
            }
        };

        const fetchCartItems = async () => {
            try {
                const userInfo = getUserInfo();
                if (!userInfo) return;

                const queryParams = new URLSearchParams();
                queryParams.append('userEmail', userInfo.userEmail);

                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/cart?${queryParams}`);
                const data = await response.json();

                if (data.success && data.data) {
                    setUserStats(prev => ({
                        ...prev,
                        wishlistCount: data.data.length
                    }));
                }
            } catch (error) {
                console.error('Error fetching cart items:', error);
            }
        };

        const fetchData = async () => {
            if (user) {
                setLoading(true);
                await Promise.all([
                    fetchUserOrders(),
                    fetchCartItems()
                ]);
                setLoading(false);
            } else {
                setLoading(false);
            }
        };

        fetchData();
    }, [user, getUserInfo]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100" style={{ fontFamily: "'Poppins', sans-serif" }}>
            {/* Header */}
            <div className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
                    <div className="flex items-center justify-center">
                        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                    {/* Profile Card */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden">
                            {/* Profile Header */}
                            <div className="relative">
                                <div className="h-32 bg-gradient-to-r from-gray-900 via-black to-gray-800"></div>
                                <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
                                    <div className="relative">
                                        {user?.photoURL ? (
                                            <img
                                                src={user.photoURL}
                                                alt={user.displayName || 'User'}
                                                className="h-32 w-32 rounded-full object-cover border-4 border-white shadow-2xl"
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                    e.target.nextSibling.style.display = 'flex';
                                                }}
                                            />
                                        ) : null}
                                        <div
                                            className={`h-32 w-32 rounded-full bg-gradient-to-r from-gray-900 via-black to-gray-800 flex items-center justify-center border-4 border-white shadow-2xl ${user?.photoURL ? 'hidden' : 'flex'}`}
                                            style={{ display: user?.photoURL ? 'none' : 'flex' }}
                                        >
                                            <BsPerson className="text-white" size={48} />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Profile Info */}
                            <div className="pt-20 pb-6 px-6 sm:pb-8 sm:px-8 text-center">
                                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                                    {user?.displayName || 'Harris Valle Customer'}
                                </h2>
                                <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base break-all">{user?.email || 'customer@harrisvale.com'}</p>

                                <div className="space-y-3 sm:space-y-4 text-left">
                                    <div className="flex items-center space-x-3 text-gray-700">
                                        <BsEnvelope className="text-gray-500 flex-shrink-0" size={16} />
                                        <span className="text-xs sm:text-sm break-all">{user?.email || 'Not provided'}</span>
                                    </div>

                                    <div className="flex items-center space-x-3 text-gray-700">
                                        <BsShield className="text-gray-500 flex-shrink-0" size={16} />
                                        <span className="text-xs sm:text-sm">Verified Account</span>
                                    </div>
                                </div>

                                {/* Update Profile Button */}
                                <div className="mt-4 sm:mt-6">
                                    <Link
                                        to="/update-profile"
                                        className="w-full inline-flex items-center justify-center bg-gradient-to-r from-gray-900 via-black to-gray-800 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl hover:from-gray-800 hover:via-gray-900 hover:to-gray-700 transition-all duration-300 transform hover:scale-105 group text-sm sm:text-base"
                                    >
                                        <BsPencilSquare className="mr-2 transform transition-transform duration-300 group-hover:rotate-12" size={16} />
                                        Update Profile
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stats & Activity */}
                    <div className="lg:col-span-2 space-y-6 sm:space-y-8">
                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4 sm:p-6 hover:shadow-xl transition-shadow duration-300">
                                <div className="flex items-center space-x-3 sm:space-x-4">
                                    <div className="bg-blue-100 p-2 sm:p-3 rounded-xl flex-shrink-0">
                                        <BsCart3 className="text-blue-600" size={20} />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-xl sm:text-2xl font-bold text-gray-900 truncate">
                                            {loading ? (
                                                <span className="animate-pulse bg-gray-200 h-6 sm:h-8 w-12 sm:w-16 rounded block"></span>
                                            ) : (
                                                userStats.ordersCount
                                            )}
                                        </p>
                                        <p className="text-gray-600 text-xs sm:text-sm">Total Orders</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4 sm:p-6 hover:shadow-xl transition-shadow duration-300">
                                <div className="flex items-center space-x-3 sm:space-x-4">
                                    <div className="bg-red-100 p-2 sm:p-3 rounded-xl flex-shrink-0">
                                        <BsCart3 className="text-red-600" size={20} />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-xl sm:text-2xl font-bold text-gray-900 truncate">
                                            {loading ? (
                                                <span className="animate-pulse bg-gray-200 h-6 sm:h-8 w-12 sm:w-16 rounded block"></span>
                                            ) : (
                                                userStats.wishlistCount
                                            )}
                                        </p>
                                        <p className="text-gray-600 text-xs sm:text-sm">Cart Items</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4 sm:p-6 hover:shadow-xl transition-shadow duration-300 sm:col-span-2 md:col-span-1">
                                <div className="flex items-center space-x-3 sm:space-x-4">
                                    <div className="bg-green-100 p-2 sm:p-3 rounded-xl flex-shrink-0">
                                        <BsShield className="text-green-600" size={20} />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-xl sm:text-2xl font-bold text-gray-900 truncate">
                                            {loading ? (
                                                <span className="animate-pulse bg-gray-200 h-6 sm:h-8 w-16 sm:w-20 rounded block"></span>
                                            ) : (
                                                `৳${userStats.totalSpent}`
                                            )}
                                        </p>
                                        <p className="text-gray-600 text-xs sm:text-sm">Total Spent</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Recent Orders */}
                        <div className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden">
                            <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 border-b border-gray-200">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                    <div>
                                        <h3 className="text-lg sm:text-xl font-bold text-gray-900">Recent Orders</h3>
                                        <p className="text-xs sm:text-sm text-gray-500 mt-1">Click on any order to view details</p>
                                    </div>
                                    <Link
                                        to="/orders"
                                        className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors self-start sm:self-center"
                                    >
                                        View All
                                    </Link>
                                </div>
                            </div>
                            <div className="p-4 sm:p-6 lg:p-8">
                                <div className="space-y-4">
                                    {loading ? (
                                        // Loading skeleton
                                        [...Array(3)].map((_, index) => (
                                            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                                <div className="flex items-center space-x-4">
                                                    <div className="bg-white p-3 rounded-xl shadow-sm">
                                                        <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
                                                    </div>
                                                    <div>
                                                        <div className="w-24 h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                                                        <div className="w-16 h-3 bg-gray-200 rounded animate-pulse"></div>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="w-16 h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                                                    <div className="w-20 h-6 bg-gray-200 rounded-full animate-pulse"></div>
                                                </div>
                                            </div>
                                        ))
                                    ) : recentOrders.length > 0 ? (
                                        recentOrders.map((order, index) => (
                                            <div key={index} className="bg-gray-50 rounded-xl overflow-hidden hover:bg-gray-100 transition-colors">
                                                {/* Order Header - Clickable */}
                                                <div
                                                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 cursor-pointer"
                                                    onClick={() => toggleOrderExpansion(order.id)}
                                                >
                                                    <div className="flex items-center space-x-3 sm:space-x-4 min-w-0 flex-1">
                                                        <div className="bg-white p-2 sm:p-3 rounded-xl shadow-sm flex-shrink-0">
                                                            <BsBox className="text-gray-600" size={16} />
                                                        </div>
                                                        <div className="min-w-0 flex-1">
                                                            <p className="font-semibold text-gray-900 text-sm sm:text-base truncate">{order.title}</p>
                                                            <p className="text-xs sm:text-sm text-gray-600">{order.date}</p>
                                                            <p className="text-xs text-gray-500">
                                                                {order.items?.length} item{order.items?.length !== 1 ? 's' : ''}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center justify-between sm:justify-end space-x-3 sm:space-x-4 flex-shrink-0">
                                                        <div className="text-left sm:text-right">
                                                            <p className="font-bold text-gray-900 text-sm sm:text-base">{order.amount}</p>
                                                            <span className={`text-xs px-2 sm:px-3 py-1 rounded-full font-medium ${order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                                                                order.status === 'Confirmed' ? 'bg-blue-100 text-blue-800' :
                                                                    order.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                                                                        order.status === 'Shipped' ? 'bg-purple-100 text-purple-800' :
                                                                            order.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                                                                                'bg-gray-100 text-gray-800'
                                                                }`}>
                                                                {order.status}
                                                            </span>
                                                        </div>
                                                        {expandedOrders.has(order.id) ? (
                                                            <BsChevronUp className="text-gray-400" size={18} />
                                                        ) : (
                                                            <BsChevronDown className="text-gray-400" size={18} />
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Order Details - Expandable */}
                                                {expandedOrders.has(order.id) && (
                                                    <div className="px-4 pb-4 border-t border-gray-200 bg-white">
                                                        <div className="pt-4 space-y-4">
                                                            {/* Order Items */}
                                                            <div>
                                                                <h4 className="text-sm font-medium text-gray-900 mb-3">Order Items:</h4>
                                                                <div className="space-y-2">
                                                                    {order.items?.map((item, itemIndex) => (
                                                                        <div key={itemIndex} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 bg-gray-50 rounded-lg">
                                                                            <div className="flex items-center space-x-3 min-w-0 flex-1">
                                                                                <div className="flex-shrink-0">
                                                                                    {item.image ? (
                                                                                        <img
                                                                                            src={item.image}
                                                                                            alt={item.name}
                                                                                            className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded-lg border border-gray-200"
                                                                                            onError={(e) => {
                                                                                                e.target.style.display = 'none';
                                                                                                e.target.nextSibling.style.display = 'flex';
                                                                                            }}
                                                                                        />
                                                                                    ) : null}
                                                                                    <div
                                                                                        className={`w-10 h-10 sm:w-12 sm:h-12 bg-gray-200 rounded-lg flex items-center justify-center ${item.image ? 'hidden' : 'flex'}`}
                                                                                    >
                                                                                        <BsBox className="text-gray-400" size={16} />
                                                                                    </div>
                                                                                </div>
                                                                                <div className="min-w-0 flex-1">
                                                                                    <p className="font-medium text-gray-900 truncate text-sm">{item.name}</p>
                                                                                    <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-gray-600 mt-1">
                                                                                        <span>Qty: {item.quantity}</span>
                                                                                        <span>•</span>
                                                                                        <span>৳{item.price}</span>
                                                                                        {item.size && (
                                                                                            <>
                                                                                                <span>•</span>
                                                                                                <span>Size: {item.size}</span>
                                                                                            </>
                                                                                        )}
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <div className="text-right flex-shrink-0">
                                                                                <p className="font-medium text-gray-900 text-sm">
                                                                                    ৳{(item.quantity * item.price).toFixed(2)}
                                                                                </p>
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>

                                                            {/* Order Details */}
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                                                                
                                                                <div>
                                                                    <h5 className="text-sm font-medium text-gray-900 mb-2">Payment Method:</h5>
                                                                    <div className="p-3 bg-gray-50 rounded-lg">
                                                                        <p className="text-sm text-gray-600 capitalize">{order.paymentMethod || 'Cash on Delivery'}</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-12">
                                            <BsCart3 className="mx-auto text-gray-400 mb-4" size={48} />
                                            <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
                                            <p className="text-gray-600 mb-6">You haven't placed any orders yet. Start shopping to see your order history here.</p>
                                            <Link
                                                to="/products"
                                                className="inline-flex items-center bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
                                            >
                                                Start Shopping
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;