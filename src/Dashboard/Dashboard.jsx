import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import {
    BsArrowLeft,
    BsSpeedometer2,
    BsGrid,
    BsGraphUp,
    BsPerson,
    BsBox,
    BsCart3,
    BsCurrencyDollar,
    BsThreeDotsVertical,
    BsCalendar3,
    BsArrowUp,
    BsShield,
    BsPeople,
    BsStar,
    BsPlus,
    BsFilter,
    BsHeart,
    BsGear,
    BsBarChart,
    BsPieChart,
    BsActivity,
    BsCheckCircle,
    BsXCircle,
    BsClock,
    BsArrowDown,
    BsLightning,
    BsGlobe,
    BsAward,
    BsArrowUpRight,
    BsExclamationTriangle,
    BsPencil,
    BsTrash,
    BsFileText,
    BsEnvelope,
    BsCalendarCheck,
    BsPersonCheck,
    BsDownload,
    BsBell,
    BsTag
} from 'react-icons/bs';
import { AuthContext } from '../Provider/ContextProvider';

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const [activeTab, setActiveTab] = useState('overview');
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const [currentTime, setCurrentTime] = useState(new Date());
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);
    const [users, setUsers] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [expandedOrders, setExpandedOrders] = useState(new Set());
    const [reportLoading, setReportLoading] = useState(false);
    const [emailAddress, setEmailAddress] = useState('');
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [orderStats, setOrderStats] = useState({
        totalOrders: 0,
        totalRevenue: 0,
        statusBreakdown: []
    });

    // Delivery Management States
    const [deliveryStats, setDeliveryStats] = useState({});
    const [deliveryOrders, setDeliveryOrders] = useState([]);
    const [selectedOrderForDelivery, setSelectedOrderForDelivery] = useState(null);
    const [deliveryForm, setDeliveryForm] = useState({
        deliveryPersonName: '',
        deliveryNotes: '',
        orderStatus: '',
        deliveryStatus: ''
    });
    const [deliveryActionLoading, setDeliveryActionLoading] = useState(false);

    // Update clock every second
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    // Fetch orders and stats when component mounts
    useEffect(() => {
        if (activeTab === 'orders' || activeTab === 'overview') {
            fetchOrders();
            fetchOrderStats();
        }
        if (activeTab === 'products' || activeTab === 'overview') {
            fetchProducts();
        }
        if (activeTab === 'customers' || activeTab === 'overview') {
            fetchUsers();
        }
        if (activeTab === 'categories' || activeTab === 'overview') {
            fetchCategories();
        }
        if (activeTab === 'delivery' || activeTab === 'overview') {
            fetchDeliveryStats();
            fetchOrders(); // Reuse existing orders fetch instead of separate pending orders
        }
    }, [activeTab]);

    // API call to fetch products
    const fetchProducts = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/products`);

            if (!response.ok) {
                throw new Error('Failed to fetch products');
            }

            const data = await response.json();

            if (data.success) {
                setProducts(data.data);
            } else {
                throw new Error(data.message || 'Failed to fetch products');
            }
        } catch (error) {
            console.error('Error fetching products:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    // API call to fetch users
    const fetchUsers = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/Users`);

            if (!response.ok) {
                throw new Error('Failed to fetch users');
            }

            const data = await response.json();

            if (data.success) {
                setUsers(data.data);
            } else {
                throw new Error(data.message || 'Failed to fetch users');
            }
        } catch (error) {
            console.error('Error fetching users:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    // API call to fetch categories
    const fetchCategories = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/categories`);

            if (!response.ok) {
                throw new Error('Failed to fetch categories');
            }

            const data = await response.json();

            if (data.success) {
                setCategories(data.data);
            } else {
                throw new Error(data.message || 'Failed to fetch categories');
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    // API call to fetch orders
    const fetchOrders = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/orders`);

            if (!response.ok) {
                throw new Error('Failed to fetch orders');
            }

            const data = await response.json();

            if (data.success) {
                setOrders(data.data);
            } else {
                throw new Error(data.message || 'Failed to fetch orders');
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    // API call to fetch order statistics
    const fetchOrderStats = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/orders/stats/summary`);

            if (!response.ok) {
                throw new Error('Failed to fetch order stats');
            }

            const data = await response.json();

            if (data.success) {
                setOrderStats(data.data);
            }
        } catch (error) {
            console.error('Error fetching order stats:', error);
        }
    };

    // API call to fetch delivery statistics
    const fetchDeliveryStats = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/delivery/stats`);

            if (!response.ok) {
                throw new Error('Failed to fetch delivery stats');
            }

            const data = await response.json();

            if (data.success) {
                setDeliveryStats(data.data);
            }
        } catch (error) {
            console.error('Error fetching delivery stats:', error);
        }
    };

    // API call to fetch orders by delivery status
    const fetchOrdersByDeliveryStatus = async (status) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/delivery/orders/${status}`);

            if (!response.ok) {
                throw new Error(`Failed to fetch ${status} orders`);
            }

            const data = await response.json();

            if (data.success) {
                setDeliveryOrders(data.data);
            }
        } catch (error) {
            console.error(`Error fetching ${status} orders:`, error);
        }
    };

    // Function to assign delivery person
    const assignDeliveryPerson = async (orderId, deliveryPersonName, deliveryNotes = '') => {
        return await updateDeliveryStatusSmoothly(orderId, 'assign', {
            deliveryPersonName,
            deliveryNotes
        });
    };

    // Function to mark order as shipped
    const markOrderShipped = async (orderId, trackingInfo = '') => {
        return await updateDeliveryStatusSmoothly(orderId, 'ship', {
            trackingInfo
        });
    };

    // Function to mark order as delivered
    const markOrderDelivered = async (orderId, deliveryNotes = 'Order delivered successfully') => {
        return await updateDeliveryStatusSmoothly(orderId, 'deliver', {
            deliveryNotes
        });
    };

    // Function to update order and delivery status
    const updateOrderAndDeliveryStatus = async (orderId, orderStatus, deliveryStatus, deliveryNotes = '', deliveryAssignedTo = '') => {
        return await updateDeliveryStatusSmoothly(orderId, 'custom_status', {
            orderStatus,
            deliveryStatus,
            deliveryNotes,
            deliveryAssignedTo
        });
    };

    // Unified function to handle delivery status updates with real-time UI sync
    const updateDeliveryStatusSmoothly = async (orderId, action, actionData = {}) => {
        try {
            setDeliveryActionLoading(true);

            let endpoint, method = 'PUT', successMessage;
            let optimisticUpdate = {};

            // Determine endpoint and optimistic update based on action
            switch (action) {
                case 'assign':
                    endpoint = `/api/delivery/assign/${orderId}`;
                    optimisticUpdate = {
                        deliveryAssignedTo: actionData.deliveryPersonName,
                        deliveryStatus: 'assigned',
                        orderStatus: 'processing',
                        deliveryNotes: actionData.deliveryNotes || null
                    };
                    successMessage = `Delivery assigned to ${actionData.deliveryPersonName}`;
                    break;

                case 'ship':
                    endpoint = `/api/delivery/ship/${orderId}`;
                    optimisticUpdate = {
                        orderStatus: 'shipped',
                        deliveryStatus: 'in_transit',
                        deliveryNotes: actionData.trackingInfo || 'Order shipped'
                    };
                    successMessage = 'Order marked as shipped';
                    break;

                case 'out_for_delivery':
                    endpoint = `/api/delivery/status/${orderId}`;
                    optimisticUpdate = {
                        deliveryStatus: 'out_for_delivery',
                        orderStatus: 'shipped'
                    };
                    successMessage = 'Order is now out for delivery';
                    break;

                case 'deliver':
                    endpoint = `/api/delivery/deliver/${orderId}`;
                    optimisticUpdate = {
                        orderStatus: 'delivered',
                        deliveryStatus: 'delivered',
                        deliveredAt: new Date().toISOString(),
                        deliveryNotes: actionData.deliveryNotes || 'Order delivered successfully'
                    };
                    successMessage = 'Order marked as delivered';
                    break;

                case 'custom_status':
                    endpoint = `/api/delivery/status/${orderId}`;
                    optimisticUpdate = {
                        orderStatus: actionData.orderStatus,
                        deliveryStatus: actionData.deliveryStatus,
                        deliveryNotes: actionData.deliveryNotes || null,
                        deliveryAssignedTo: actionData.deliveryAssignedTo || null
                    };
                    successMessage = 'Order status updated successfully';
                    break;

                default:
                    throw new Error('Invalid action specified');
            }

            console.log(`🚚 ${action.toUpperCase()}: Updating order ${orderId}`);

            // Make API call
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${endpoint}`, {
                method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(actionData)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data.success) {
                // Real-time UI update - Update orders state immediately
                setOrders(prevOrders =>
                    prevOrders.map(order =>
                        order._id === orderId
                            ? { ...order, ...optimisticUpdate, updatedAt: new Date().toISOString() }
                            : order
                    )
                );

                // Update delivery orders if viewing specific status
                setDeliveryOrders(prevDeliveryOrders =>
                    prevDeliveryOrders.map(order =>
                        order._id === orderId
                            ? { ...order, ...optimisticUpdate, updatedAt: new Date().toISOString() }
                            : order
                    )
                );

                // Refresh delivery stats in background for accuracy
                setTimeout(() => {
                    fetchDeliveryStats();
                }, 500);

                // Show success notification
                Swal.fire({
                    title: 'Success!',
                    text: successMessage,
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false,
                    toast: true,
                    position: 'top-end'
                });

                // Close any open modals and reset forms
                if (setSelectedOrderForDelivery) {
                    setSelectedOrderForDelivery(null);
                }
                setDeliveryForm({
                    deliveryPersonName: '',
                    deliveryNotes: '',
                    orderStatus: '',
                    deliveryStatus: ''
                });

                return data.data; // Return updated order data
            } else {
                throw new Error(data.message || 'Failed to update order');
            }
        } catch (error) {
            console.error(`❌ Error in ${action}:`, error);

            // Show error notification
            Swal.fire({
                title: 'Error!',
                text: `Failed to ${action.replace('_', ' ')} order: ${error.message}`,
                icon: 'error',
                confirmButtonText: 'OK',
                confirmButtonColor: '#EF4444'
            });

            throw error;
        } finally {
            setDeliveryActionLoading(false);
        }
    };

    // Convenience functions for common delivery actions
    const markOrderOutForDelivery = async (orderId) => {
        return await updateDeliveryStatusSmoothly(orderId, 'out_for_delivery');
    };

    const markOrderInTransit = async (orderId) => {
        return await updateDeliveryStatusSmoothly(orderId, 'ship');
    };

    const quickAssignDelivery = async (orderId, deliveryPerson) => {
        return await updateDeliveryStatusSmoothly(orderId, 'assign', {
            deliveryPersonName: deliveryPerson
        });
    };

    const quickMarkDelivered = async (orderId) => {
        return await updateDeliveryStatusSmoothly(orderId, 'deliver');
    };

    // Function to delete order (admin only)
    const handleDeleteOrder = async (orderId, orderNumber) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: `You are about to permanently delete order ${orderNumber}. This action cannot be undone!`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#EF4444',
            cancelButtonColor: '#6B7280',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel'
        });

        if (!result.isConfirmed) {
            return;
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/orders/${orderId}/delete`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Failed to delete order');

            }

            const data = await response.json();

            if (data.success) {
                // Optimistic update - immediately remove from local state
                setOrders(prevOrders =>
                    prevOrders.filter(order => order._id !== orderId)
                );

                // Remove from delivery orders if exists
                setDeliveryOrders(prevDeliveryOrders =>
                    prevDeliveryOrders.filter(order => order._id !== orderId)
                );

                // Update order stats optimistically
                setOrderStats(prevStats => ({
                    ...prevStats,
                    totalOrders: Math.max(0, (prevStats.totalOrders || 0) - 1)
                }));

                Swal.fire({
                    title: 'Deleted!',
                    text: `Order ${orderNumber} has been deleted successfully!`,
                    icon: 'success',
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#10B981'
                });
            } else {
                throw new Error(data.message || 'Failed to delete order');
            }
        } catch (error) {
            console.error('Error deleting order:', error);
            Swal.fire({
                title: 'Error!',
                text: 'Failed to delete order: ' + error.message,
                icon: 'error',
                confirmButtonText: 'OK',
                confirmButtonColor: '#EF4444'
            });
        }
    };

    // Function to delete product
    const handleDeleteProduct = async (productId, productName) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: `You are about to delete "${productName}". This action cannot be undone!`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#EF4444',
            cancelButtonColor: '#6B7280',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel'
        });

        if (!result.isConfirmed) {
            return;
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/products/${productId}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Failed to delete product');
            }

            const data = await response.json();

            if (data.success) {
                // Optimistic update - immediately remove from local state
                setProducts(prevProducts =>
                    prevProducts.filter(product => product._id !== productId)
                );

                Swal.fire({
                    title: 'Deleted!',
                    text: `Product "${productName}" has been deleted successfully!`,
                    icon: 'success',
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#10B981'
                });
            } else {
                throw new Error(data.message || 'Failed to delete product');
            }
        } catch (error) {
            console.error('Error deleting product:', error);
            Swal.fire({
                title: 'Error!',
                text: 'Failed to delete product: ' + error.message,
                icon: 'error',
                confirmButtonText: 'OK',
                confirmButtonColor: '#EF4444'
            });
        }
    };

    // Function to delete user
    const handleDeleteUser = async (userEmail, userName) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: `You are about to delete user "${userName}" (${userEmail}). This action cannot be undone!`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#EF4444',
            cancelButtonColor: '#6B7280',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel'
        });

        if (!result.isConfirmed) {
            return;
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/user/${userEmail}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Failed to delete user');
            }

            const data = await response.json();

            if (data.success) {
                // Optimistic update - immediately remove from local state
                setUsers(prevUsers =>
                    prevUsers.filter(user => user.email !== userEmail)
                );

                Swal.fire({
                    title: 'Deleted!',
                    text: `User "${userName}" has been deleted successfully!`,
                    icon: 'success',
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#10B981'
                });
            } else {
                throw new Error(data.message || 'Failed to delete user');
            }
        } catch (error) {
            console.error('Error deleting user:', error);
            Swal.fire({
                title: 'Error!',
                text: 'Failed to delete user: ' + error.message,
                icon: 'error',
                confirmButtonText: 'OK',
                confirmButtonColor: '#EF4444'
            });
        }
    };

    // Function to delete category
    const handleDeleteCategory = async (categoryId, categoryName) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: `Do you really want to delete the category "${categoryName}"? This action cannot be undone and will affect any products in this category.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#EF4444',
            cancelButtonColor: '#6B7280',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel'
        });

        if (!result.isConfirmed) {
            return;
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/categories/${categoryId}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Failed to delete category');
            }

            const data = await response.json();

            if (data.success) {
                // Optimistic update - immediately remove from local state
                setCategories(prevCategories =>
                    prevCategories.filter(category => category.id !== categoryId)
                );

                Swal.fire({
                    title: 'Deleted!',
                    text: `Category "${categoryName}" has been deleted successfully!`,
                    icon: 'success',
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#10B981'
                });
            } else {
                throw new Error(data.message || 'Failed to delete category');
            }
        } catch (error) {
            console.error('Error deleting category:', error);
            Swal.fire({
                title: 'Error!',
                text: 'Failed to delete category: ' + error.message,
                icon: 'error',
                confirmButtonText: 'OK',
                confirmButtonColor: '#EF4444'
            });
        }
    };

    // Function to toggle category active status
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

    // Calculate today's orders
    const getTodaysOrders = () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return orders.filter(order => {
            const orderDate = new Date(order.createdAt);
            orderDate.setHours(0, 0, 0, 0);
            return orderDate.getTime() === today.getTime();
        }).length;
    };

    // Calculate customers who have placed orders
    const getCustomersWithOrders = () => {
        const customerEmails = new Set(orders.map(order => order.userEmail));
        return customerEmails.size;
    };

    // Calculate pending delivery orders
    const getPendingDeliveryOrders = () => {
        return orders.filter(order =>
            (order.orderStatus === 'confirmed' || order.orderStatus === 'processing') &&
            (order.deliveryStatus === 'pending' || !order.deliveryAssignedTo) &&
            order.paymentStatus === 'paid'
        );
    };

    const sidebarItems = [
        { id: 'overview', label: 'Overview', icon: BsSpeedometer2, active: true },
        { id: 'orders', label: 'Orders', icon: BsBox, count: orders.length },
        { id: 'delivery', label: 'Delivery', icon: BsClock, count: getPendingDeliveryOrders().length },
        { id: 'products', label: 'Products', icon: BsGrid },
        { id: 'categories', label: 'Categories', icon: BsTag, count: categories.length },
        { id: 'customers', label: 'Customers', icon: BsPeople },
        { id: 'reports', label: 'Reports', icon: BsPieChart },
    ];



    // Function to get order status badge styling
    const getOrderStatusBadge = (status) => {
        switch (status?.toLowerCase()) {
            case 'confirmed':
                return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
            case 'processing':
                return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
            case 'shipped':
                return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
            case 'delivered':
                return 'bg-green-500/20 text-green-400 border-green-500/30';
            case 'cancelled':
                return 'bg-red-500/20 text-red-400 border-red-500/30';
            default:
                return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
        }
    };

    // Function to format date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Function to get delivery status badge
    const getDeliveryStatusBadge = (status) => {
        const badges = {
            'pending': 'bg-yellow-100 text-yellow-800',
            'assigned': 'bg-blue-100 text-blue-800',
            'picked_up': 'bg-indigo-100 text-indigo-800',
            'in_transit': 'bg-purple-100 text-purple-800',
            'out_for_delivery': 'bg-orange-100 text-orange-800',
            'delivered': 'bg-green-100 text-green-800',
            'failed_delivery': 'bg-red-100 text-red-800',
            'returned': 'bg-gray-100 text-gray-800'
        };
        return badges[status] || 'bg-gray-100 text-gray-800';
    };

    // Function to get payment status badge
    const getPaymentStatusBadge = (status) => {
        const badges = {
            'pending': 'bg-yellow-100 text-yellow-800',
            'paid': 'bg-green-100 text-green-800',
            'failed': 'bg-red-100 text-red-800',
            'cancelled': 'bg-gray-100 text-gray-800',
            'refunded': 'bg-purple-100 text-purple-800'
        };
        return badges[status] || 'bg-gray-100 text-gray-800';
    };

    // Function to render different dashboard sections
    const renderDashboardContent = () => {
        switch (activeTab) {
            case 'overview':
                return renderOverviewSection();
            case 'orders':
                return renderOrdersSection();
            case 'products':
                return renderProductsSection();
            case 'categories':
                return renderCategoriesSection();
            case 'customers':
                return renderCustomersSection();
            case 'reports':
                return renderReportsSection();
            case 'delivery':
                return renderDeliverySection();
            default:
                return renderOverviewSection();
        }
    };

    // Overview section component
    const renderOverviewSection = () => (
        <div className="space-y-8">
            {/* Essential Stats Cards - Made Bigger */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Total Orders All Time */}
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl shadow-2xl border border-gray-700 p-8 hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-4 rounded-2xl shadow-lg">
                            <BsBox className="text-white" size={32} />
                        </div>
                        <div className="text-right">
                            <p className="text-lg font-medium text-gray-400 mb-2">Total Orders</p>
                            <p className="text-4xl font-bold text-white">{orderStats.totalOrders || 0}</p>
                            <p className="text-sm text-gray-500 mt-1">All Time</p>
                        </div>
                    </div>
                    <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-xl p-3">
                        <p className="text-sm text-blue-400 font-medium">📊 Complete order history</p>
                    </div>
                </div>

                {/* Total Orders Today */}
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl shadow-2xl border border-gray-700 p-8 hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-4 rounded-2xl shadow-lg">
                            <BsCalendarCheck className="text-white" size={32} />
                        </div>
                        <div className="text-right">
                            <p className="text-lg font-medium text-gray-400 mb-2">Orders Today</p>
                            <p className="text-4xl font-bold text-white">{getTodaysOrders()}</p>
                            <p className="text-sm text-gray-500 mt-1">{new Date().toLocaleDateString()}</p>
                        </div>
                    </div>
                    <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl p-3">
                        <p className="text-sm text-green-400 font-medium">📅 Today's activity</p>
                    </div>
                </div>

                {/* Total Users */}
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl shadow-2xl border border-gray-700 p-8 hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4 rounded-2xl shadow-lg">
                            <BsPeople className="text-white" size={32} />
                        </div>
                        <div className="text-right">
                            <p className="text-lg font-medium text-gray-400 mb-2">Total Users</p>
                            <p className="text-4xl font-bold text-white">{users.length || 0}</p>
                            <p className="text-sm text-gray-500 mt-1">Registered</p>
                        </div>
                    </div>
                    <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl p-3">
                        <p className="text-sm text-purple-400 font-medium">👥 User base</p>
                    </div>
                </div>

                {/* Active Customers */}
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl shadow-2xl border border-gray-700 p-8 hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-4 rounded-2xl shadow-lg">
                            <BsPersonCheck className="text-white" size={32} />
                        </div>
                        <div className="text-right">
                            <p className="text-lg font-medium text-gray-400 mb-2">Active Customers</p>
                            <p className="text-4xl font-bold text-white">{getCustomersWithOrders()}</p>
                            <p className="text-sm text-gray-500 mt-1">With Orders</p>
                        </div>
                    </div>
                    <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-xl p-3">
                        <p className="text-sm text-indigo-400 font-medium">🛍️ Active buyers</p>
                    </div>
                </div>

                {/* Total Products */}
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl shadow-2xl border border-gray-700 p-8 hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-gradient-to-r from-orange-500 to-yellow-500 p-4 rounded-2xl shadow-lg">
                            <BsGrid className="text-white" size={32} />
                        </div>
                        <div className="text-right">
                            <p className="text-lg font-medium text-gray-400 mb-2">Total Products</p>
                            <p className="text-4xl font-bold text-white">{products.length || 0}</p>
                            <p className="text-sm text-gray-500 mt-1">In Catalog</p>
                        </div>
                    </div>
                    <div className="bg-gradient-to-r from-orange-500/10 to-yellow-500/10 rounded-xl p-3">
                        <p className="text-sm text-orange-400 font-medium">📦 Product range</p>
                    </div>
                </div>

                {/* Total Revenue */}
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl shadow-2xl border border-gray-700 p-8 hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-gradient-to-r from-red-500 to-pink-500 p-4 rounded-2xl shadow-lg">
                            <BsCurrencyDollar className="text-white" size={32} />
                        </div>
                        <div className="text-right">
                            <p className="text-lg font-medium text-gray-400 mb-2">Total Revenue</p>
                            <p className="text-4xl font-bold text-white">BDT {(orderStats.totalRevenue || 0).toLocaleString()}</p>
                            <p className="text-sm text-gray-500 mt-1">All Time</p>
                        </div>
                    </div>
                    <div className="bg-gradient-to-r from-red-500/10 to-pink-500/10 rounded-xl p-3">
                        <p className="text-sm text-red-400 font-medium">💰 Total earnings</p>
                    </div>
                </div>
            </div>
        </div>
    );

    // Orders section component
    const renderOrdersSection = () => (
        <div className="space-y-6">
            {/* Orders Header */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl border border-gray-700 p-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-white">Order Management</h2>
                        <p className="text-gray-400">Manage and track all customer orders</p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={() => fetchOrders()}
                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2"
                        >
                            <BsDownload size={16} />
                            <span>Refresh</span>
                        </button>
                    </div>
                </div>

                {/* Order Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {orderStats.statusBreakdown.map((status, index) => (
                        <div key={index} className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-gray-400 font-medium capitalize">{status._id || 'Unknown'}</p>
                                    <p className="text-lg font-bold text-white">{status.count}</p>
                                </div>
                                <span className={`px-2 py-1 rounded-lg text-xs font-medium border ${getOrderStatusBadge(status._id)}`}>
                                    {status._id || 'N/A'}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Orders Table */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl border border-gray-700 p-6">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-white">Recent Orders</h3>
                    <div className="flex items-center space-x-2">
                        {loading && <BsActivity className="text-blue-400 animate-spin" size={16} />}
                        <span className="text-sm text-gray-400">
                            {orders.length} orders found
                        </span>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-500/20 border border-red-500/30 text-red-400 p-4 rounded-xl mb-6">
                        <p className="font-medium">Error loading orders:</p>
                        <p className="text-sm">{error}</p>
                    </div>
                )}

                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="text-center">
                            <BsActivity className="mx-auto text-blue-400 animate-spin mb-4" size={32} />
                            <p className="text-gray-300">Loading orders...</p>
                        </div>
                    </div>
                ) : orders.length === 0 ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="text-center">
                            <BsBox className="mx-auto text-gray-500 mb-4" size={48} />
                            <p className="text-gray-300 font-medium">No orders found</p>
                            <p className="text-gray-500 text-sm">Orders will appear here when customers place them</p>
                        </div>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-700">
                                    <th className="text-left text-gray-400 font-medium py-3 px-4">Order ID</th>
                                    <th className="text-left text-gray-400 font-medium py-3 px-4">Customer</th>
                                    <th className="text-left text-gray-400 font-medium py-3 px-4">Items</th>
                                    <th className="text-left text-gray-400 font-medium py-3 px-4">Total</th>
                                    <th className="text-left text-gray-400 font-medium py-3 px-4">Status</th>
                                    <th className="text-left text-gray-400 font-medium py-3 px-4">Date</th>
                                    <th className="text-left text-gray-400 font-medium py-3 px-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order) => (
                                    <React.Fragment key={order._id}>
                                        {/* Main Order Row */}
                                        <tr className="border-b border-gray-800 hover:bg-gray-800/30 transition-colors">
                                            <td className="py-4 px-4">
                                                <div className="flex items-center space-x-2">
                                                    <button
                                                        onClick={() => toggleOrderExpansion(order._id)}
                                                        className="p-1 text-gray-400 hover:text-white transition-colors"
                                                        title="Expand order details"
                                                    >
                                                        {expandedOrders.has(order._id) ? (
                                                            <BsArrowDown size={16} />
                                                        ) : (
                                                            <BsArrowDown size={16} className="transform -rotate-90" />
                                                        )}
                                                    </button>
                                                    <div>
                                                        <span className="text-white font-medium">{order.orderId}</span>
                                                        <p className="text-gray-400 text-xs">Click to view items</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-4">
                                                <div>
                                                    <p className="text-white font-medium">{order.userName}</p>
                                                    <p className="text-gray-400 text-sm">{order.userEmail}</p>
                                                </div>
                                            </td>
                                            <td className="py-4 px-4">
                                                <span className="text-gray-300">{order.items?.length || 0} items</span>
                                            </td>
                                            <td className="py-4 px-4">
                                                <span className="text-white font-medium">৳{order.totalAmount?.toLocaleString()}</span>
                                            </td>
                                            <td className="py-4 px-4">
                                                <span className={`px-3 py-1 rounded-lg text-xs font-medium border ${getOrderStatusBadge(order.orderStatus)}`}>
                                                    {order.orderStatus}
                                                </span>
                                            </td>
                                            <td className="py-4 px-4">
                                                <span className="text-gray-400 text-sm">{formatDate(order.orderDate || order.createdAt)}</span>
                                            </td>
                                            <td className="py-4 px-4">
                                                <div className="flex items-center space-x-2">
                                                    <button
                                                        onClick={() => handleDeleteOrder(order._id, order.orderId)}
                                                        className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded transition-colors"
                                                        title="Delete Order"
                                                    >
                                                        Delete
                                                    </button>
                                                    <span className={`px-2 py-1 rounded text-xs font-medium ${getOrderStatusBadge(order.orderStatus)}`}>
                                                        {order.orderStatus}
                                                    </span>
                                                </div>
                                            </td>
                                        </tr>

                                        {/* Expanded Order Items Row */}
                                        {expandedOrders.has(order._id) && (
                                            <tr className="bg-gray-800/20">
                                                <td colSpan="7" className="py-4 px-4">
                                                    <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
                                                        <h4 className="text-white font-medium mb-3 flex items-center">
                                                            <BsBox className="mr-2" size={16} />
                                                            Order Items
                                                        </h4>
                                                        {order.items && order.items.length > 0 ? (
                                                            <div className="space-y-3">
                                                                {order.items.map((item, index) => (
                                                                    <div key={index} className="flex items-center justify-between bg-gray-800/30 rounded-lg p-3 border border-gray-700/50">
                                                                        <div className="flex items-center space-x-3">
                                                                            {item.image && (
                                                                                <img
                                                                                    src={item.image}
                                                                                    alt={item.name}
                                                                                    className="w-12 h-12 rounded-lg object-cover bg-gray-700"
                                                                                    onError={(e) => {
                                                                                        e.target.style.display = 'none';
                                                                                        e.target.nextSibling.style.display = 'flex';
                                                                                    }}
                                                                                />
                                                                            )}
                                                                            <div className="w-12 h-12 rounded-lg bg-gray-700 items-center justify-center hidden">
                                                                                <BsGrid className="text-gray-500" size={20} />
                                                                            </div>
                                                                            <div>
                                                                                <p className="text-white font-medium">{item.name || 'Unknown Item'}</p>
                                                                                <p className="text-gray-400 text-sm">
                                                                                    Quantity: {item.quantity || 1} × ৳{item.price?.toLocaleString() || '0'}
                                                                                </p>
                                                                                {item.size && (
                                                                                    <p className="text-gray-500 text-xs">Size: {item.size}</p>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                        <div className="text-right">
                                                                            <p className="text-white font-medium">
                                                                                ৳{((item.price || 0) * (item.quantity || 1)).toLocaleString()}
                                                                            </p>
                                                                            <p className="text-gray-400 text-sm">Subtotal</p>
                                                                        </div>
                                                                    </div>
                                                                ))}

                                                                {/* Order Summary */}
                                                                <div className="border-t border-gray-700 pt-3 mt-4">
                                                                    <div className="flex justify-between items-center">
                                                                        <span className="text-gray-300 font-medium">Total Amount:</span>
                                                                        <span className="text-white font-bold text-lg">৳{order.totalAmount?.toLocaleString()}</span>
                                                                    </div>
                                                                    {order.shippingAddress && (
                                                                        <div className="mt-3 text-sm">
                                                                            <p className="text-gray-400">Shipping Address:</p>
                                                                            <p className="text-gray-300">{order.shippingAddress}</p>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <div className="text-center py-4">
                                                                <BsBox className="mx-auto text-gray-500 mb-2" size={24} />
                                                                <p className="text-gray-400">No items found for this order</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );

    // Products section component
    const renderProductsSection = () => (
        <div className="space-y-6">
            {/* Header with Add Product Button */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-2">Product Management</h2>
                    <p className="text-gray-400">Manage your product inventory and listings</p>
                </div>
                <Link
                    to="/add-products"
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                    <BsPlus className="mr-2" size={20} />
                    Add New Product
                </Link>
            </div>

            {/* Products Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border border-gray-700 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-400">Total Products</p>
                            <p className="text-2xl font-bold text-white">{products.length}</p>
                        </div>
                        <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-3 rounded-xl">
                            <BsGrid className="text-white" size={24} />
                        </div>
                    </div>
                </div>
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border border-gray-700 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-400">In Stock</p>
                            <p className="text-2xl font-bold text-white">{products.filter(p => p.inStock).length}</p>
                        </div>
                        <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-3 rounded-xl">
                            <BsCheckCircle className="text-white" size={24} />
                        </div>
                    </div>
                </div>
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border border-gray-700 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-400">Featured</p>
                            <p className="text-2xl font-bold text-white">{products.filter(p => p.featured).length}</p>
                        </div>
                        <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-3 rounded-xl">
                            <BsStar className="text-white" size={24} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Products Table */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700 shadow-2xl">
                <div className="p-6 border-b border-gray-700">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <h3 className="text-lg font-bold text-white">All Products</h3>
                            <p className="text-sm text-gray-400">Manage your product catalog</p>
                        </div>
                        <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-400">
                                {products.length} {products.length === 1 ? 'product' : 'products'} total
                            </span>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="p-12 text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                        <p className="text-gray-400">Loading products...</p>
                    </div>
                ) : error ? (
                    <div className="p-12 text-center">
                        <BsExclamationTriangle className="text-red-400 mx-auto mb-4" size={48} />
                        <p className="text-red-400 font-medium mb-2">Error loading products</p>
                        <p className="text-gray-400 text-sm">{error}</p>
                        <button
                            onClick={fetchProducts}
                            className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                        >
                            Retry
                        </button>
                    </div>
                ) : products.length === 0 ? (
                    <div className="p-12 text-center">
                        <BsGrid className="text-gray-500 mx-auto mb-4" size={48} />
                        <p className="text-gray-300 font-medium mb-2">No products found</p>
                        <p className="text-gray-500 text-sm mb-4">Start by adding your first product</p>
                        <Link
                            to="/add-products"
                            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                        >
                            <BsPlus className="mr-2" size={16} />
                            Add Product
                        </Link>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-700">
                                    <th className="text-left text-gray-400 font-medium py-3 px-4">Product</th>
                                    <th className="text-left text-gray-400 font-medium py-3 px-4">Category</th>
                                    <th className="text-left text-gray-400 font-medium py-3 px-4">Price</th>
                                    <th className="text-left text-gray-400 font-medium py-3 px-4">Stock</th>
                                    <th className="text-left text-gray-400 font-medium py-3 px-4">Featured</th>
                                    <th className="text-left text-gray-400 font-medium py-3 px-4">Added</th>
                                    <th className="text-left text-gray-400 font-medium py-3 px-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((product) => (
                                    <tr key={product._id} className="border-b border-gray-800 hover:bg-gray-800/30 transition-colors">
                                        <td className="py-4 px-4">
                                            <div className="flex items-center space-x-3">
                                                <img
                                                    src={product.image}
                                                    alt={product.name}
                                                    className="w-12 h-12 rounded-lg object-cover bg-gray-700"
                                                    onError={(e) => {
                                                        e.target.style.display = 'none';
                                                        e.target.nextSibling.style.display = 'flex';
                                                    }}
                                                />
                                                <div className="w-12 h-12 rounded-lg bg-gray-700 items-center justify-center hidden">
                                                    <BsGrid className="text-gray-500" size={20} />
                                                </div>
                                                <div>
                                                    <p className="text-white font-medium">{product.name}</p>
                                                    <p className="text-gray-400 text-sm">{product.id}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-700 text-gray-300 capitalize">
                                                {product.category}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className="text-white font-medium">৳{product.price.toLocaleString()}</span>
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${product.inStock
                                                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                                : 'bg-red-500/20 text-red-400 border border-red-500/30'
                                                }`}>
                                                {product.inStock ? (
                                                    <>
                                                        <BsCheckCircle className="mr-1" size={12} />
                                                        In Stock
                                                    </>
                                                ) : (
                                                    <>
                                                        <BsXCircle className="mr-1" size={12} />
                                                        Out of Stock
                                                    </>
                                                )}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4">
                                            {product.featured ? (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                                                    <BsStar className="mr-1" size={12} />
                                                    Featured
                                                </span>
                                            ) : (
                                                <span className="text-gray-500 text-sm">-</span>
                                            )}
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className="text-gray-400 text-sm">
                                                {new Date(product.createdAt).toLocaleDateString()}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="flex items-center space-x-2">
                                                <Link
                                                    to={`/update-products/${product.id}`}
                                                    className="p-2 text-gray-400 hover:text-green-400 hover:bg-green-500/10 rounded-lg transition-colors"
                                                    title="Edit Product"
                                                >
                                                    <BsPencil size={14} />
                                                </Link>
                                                <button
                                                    onClick={() => handleDeleteProduct(product.id, product.name)}
                                                    className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                                    title="Delete Product"
                                                >
                                                    <BsTrash size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );

    // Categories section component
    const renderCategoriesSection = () => (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-2">Category Management</h2>
                    <p className="text-gray-400">Manage product categories</p>
                </div>
                <Link
                    to="/add-category"
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-blue-500/25"
                >
                    <BsPlus className="mr-2 text-lg" />
                    Add Category
                </Link>
            </div>

            {/* Categories Grid */}
            <div className="bg-gray-800/50 rounded-2xl border border-gray-700/50 p-6">
                {loading ? (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center py-12 text-red-400">
                        <BsExclamationTriangle className="text-4xl mb-4" />
                        <p>Error: {error}</p>
                        <button
                            onClick={fetchCategories}
                            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                            Retry
                        </button>
                    </div>
                ) : categories.length === 0 ? (
                    <div className="flex flex-col items-center py-12 text-gray-400">
                        <BsTag className="text-4xl mb-4" />
                        <p className="text-lg font-medium mb-2">No Categories Yet</p>
                        <p className="text-sm">Start by creating your first category</p>
                        <Link
                            to="/add-category"
                            className="mt-4 inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300"
                        >
                            <BsPlus className="mr-2" />
                            Create Category
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {categories.map((category) => (
                            <div
                                key={category.id}
                                className="bg-gray-700/50 rounded-xl border border-gray-600/50 p-4 hover:bg-gray-700/70 transition-all duration-300 hover:border-gray-500/50 hover:shadow-lg"
                            >
                                {/* Category Image */}
                                <div className="mb-4">
                                    <img
                                        src={category.image}
                                        alt={category.name}
                                        className="w-full h-32 object-cover rounded-lg"
                                        onError={(e) => {
                                            e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
                                        }}
                                    />
                                </div>

                                {/* Category Info */}
                                <div className="space-y-3">
                                    <div>
                                        <h3 className="text-lg font-semibold text-white truncate">{category.name}</h3>
                                    </div>

                                    <p className="text-gray-400 text-sm line-clamp-2">{category.description}</p>

                                    {/* Category Stats */}
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-500">Items: {category.itemCount || 0}</span>
                                        <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${category.color}`}></div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex justify-center gap-2 pt-2">
                                        <Link
                                            to={`/update-category/${category.id}`}
                                            className="px-3 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors text-sm font-medium flex items-center gap-2"
                                            title="Update Category"
                                        >
                                            <BsPencil />
                                            Update
                                        </Link>
                                        <button
                                            onClick={() => handleDeleteCategory(category.id, category.name)}
                                            className="px-3 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors text-sm font-medium flex items-center gap-2"
                                            title="Delete Category"
                                        >
                                            <BsTrash />
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Categories Summary */}
                {categories.length > 0 && (
                    <div className="mt-6 pt-6 border-t border-gray-700/50">
                        <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                            <span>Total Categories: <span className="text-white font-medium">{categories.length}</span></span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );

    // Customers section component
    const renderCustomersSection = () => (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-2">Customer Management</h2>
                    <p className="text-gray-400">Manage your customer base and user accounts</p>
                </div>
                <button
                    onClick={fetchUsers}
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                    <BsDownload className="mr-2" size={20} />
                    Refresh Users
                </button>
            </div>

            {/* Customer Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border border-gray-700 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-400">Total Users</p>
                            <p className="text-2xl font-bold text-white">{users.length}</p>
                        </div>
                        <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-3 rounded-xl">
                            <BsPeople className="text-white" size={24} />
                        </div>
                    </div>
                </div>
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border border-gray-700 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-400">Active Users</p>
                            <p className="text-2xl font-bold text-white">{users.filter(u => u.isActive).length}</p>
                        </div>
                        <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-3 rounded-xl">
                            <BsCheckCircle className="text-white" size={24} />
                        </div>
                    </div>
                </div>
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border border-gray-700 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-400">Admins</p>
                            <p className="text-2xl font-bold text-white">{users.filter(u => u.role === 'admin').length}</p>
                        </div>
                        <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-xl">
                            <BsShield className="text-white" size={24} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Customers Table */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700 shadow-2xl">
                <div className="p-6 border-b border-gray-700">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <h3 className="text-lg font-bold text-white">All Customers</h3>
                            <p className="text-sm text-gray-400">Manage your customer database</p>
                        </div>
                        <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-400">
                                {users.length} {users.length === 1 ? 'user' : 'users'} total
                            </span>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="p-12 text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                        <p className="text-gray-400">Loading customers...</p>
                    </div>
                ) : error ? (
                    <div className="p-12 text-center">
                        <BsExclamationTriangle className="text-red-400 mx-auto mb-4" size={48} />
                        <p className="text-red-400 font-medium mb-2">Error loading customers</p>
                        <p className="text-gray-400 text-sm">{error}</p>
                        <button
                            onClick={fetchUsers}
                            className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                        >
                            Retry
                        </button>
                    </div>
                ) : users.length === 0 ? (
                    <div className="p-12 text-center">
                        <BsPeople className="text-gray-500 mx-auto mb-4" size={48} />
                        <p className="text-gray-300 font-medium mb-2">No customers found</p>
                        <p className="text-gray-500 text-sm">Customer data will appear here when users register</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-700">
                                    <th className="text-left text-gray-400 font-medium py-3 px-4">Customer</th>
                                    <th className="text-left text-gray-400 font-medium py-3 px-4">Email</th>
                                    <th className="text-left text-gray-400 font-medium py-3 px-4">Phone</th>
                                    <th className="text-left text-gray-400 font-medium py-3 px-4">Role</th>
                                    <th className="text-left text-gray-400 font-medium py-3 px-4">Status</th>
                                    <th className="text-left text-gray-400 font-medium py-3 px-4">Joined</th>
                                    <th className="text-left text-gray-400 font-medium py-3 px-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
                                    <tr key={user._id} className="border-b border-gray-800 hover:bg-gray-800/30 transition-colors">
                                        <td className="py-4 px-4">
                                            <div className="flex items-center space-x-3">
                                                {user.imageUrl ? (
                                                    <img
                                                        src={user.imageUrl}
                                                        alt={user.name}
                                                        className="w-10 h-10 rounded-full object-cover bg-gray-700"
                                                        onError={(e) => {
                                                            e.target.style.display = 'none';
                                                            e.target.nextSibling.style.display = 'flex';
                                                        }}
                                                    />
                                                ) : null}
                                                <div className={`w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center ${user.imageUrl ? 'hidden' : 'flex'}`}>
                                                    <span className="text-white font-medium text-sm">
                                                        {user.name?.charAt(0)?.toUpperCase() || 'U'}
                                                    </span>
                                                </div>
                                                <div>
                                                    <p className="text-white font-medium">{user.name || 'Unknown'}</p>
                                                    <p className="text-gray-400 text-sm">ID: {user._id.slice(-8)}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className="text-gray-300">{user.email}</span>
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className="text-gray-300">{user.phone || '-'}</span>
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.role === 'admin'
                                                ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                                                : 'bg-gray-700 text-gray-300'
                                                }`}>
                                                {user.role === 'admin' ? (
                                                    <>
                                                        <BsShield className="mr-1" size={12} />
                                                        Admin
                                                    </>
                                                ) : (
                                                    <>
                                                        <BsPerson className="mr-1" size={12} />
                                                        User
                                                    </>
                                                )}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.isActive
                                                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                                : 'bg-red-500/20 text-red-400 border border-red-500/30'
                                                }`}>
                                                {user.isActive ? (
                                                    <>
                                                        <BsCheckCircle className="mr-1" size={12} />
                                                        Active
                                                    </>
                                                ) : (
                                                    <>
                                                        <BsXCircle className="mr-1" size={12} />
                                                        Inactive
                                                    </>
                                                )}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className="text-gray-400 text-sm">
                                                {new Date(user.createdAt).toLocaleDateString()}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4">
                                            <button
                                                onClick={() => handleDeleteUser(user.email, user.name)}
                                                className="bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-red-400 hover:text-red-300 px-3 py-1.5 rounded-lg transition-all duration-300 text-sm font-medium hover:scale-105"
                                                title="Delete User"
                                            >
                                                🗑️ Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );

    // Reports section component
    const renderReportsSection = () => {
        const generateReport = async (type) => {
            try {
                setReportLoading(true);

                // Create a download link for the report
                const downloadUrl = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/reports/download-${type}?date=${selectedDate}`;

                // Create a temporary anchor element to trigger download
                const link = document.createElement('a');
                link.href = downloadUrl;
                link.download = `daily-orders-report-${selectedDate}.${type}`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                toast.success(`${type.toUpperCase()} report download started!`);
            } catch (error) {
                toast.error(`Failed to download ${type} report: ` + error.message);
            } finally {
                setReportLoading(false);
            }
        };

        const emailReport = async (type) => {
            if (!emailAddress) {
                toast.error('Please enter an email address');
                return;
            }

            try {
                setReportLoading(true);
                const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/reports/email-report`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: emailAddress,
                        reportType: type,
                        date: selectedDate
                    }),
                });

                const data = await response.json();

                if (data.success) {
                    toast.success(`Report emailed successfully to ${emailAddress}!`);
                    setEmailAddress('');
                } else {
                    throw new Error(data.message);
                }
            } catch (error) {
                toast.error('Failed to email report: ' + error.message);
            } finally {
                setReportLoading(false);
            }
        };

        const sendDemoReport = async () => {
            try {
                setReportLoading(true);
                const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/reports/demo`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });

                const data = await response.json();

                if (data.success) {
                    toast.success('Demo reports sent to badar12041@gmail.com!');
                } else {
                    throw new Error(data.message);
                }
            } catch (error) {
                toast.error('Failed to send demo report: ' + error.message);
            } finally {
                setReportLoading(false);
            }
        };

        return (
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-2">Reports & Analytics</h2>
                        <p className="text-gray-400">Generate and email daily order reports</p>
                    </div>
                    <button
                        onClick={sendDemoReport}
                        disabled={reportLoading}
                        className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
                    >
                        <BsEnvelope className="mr-2" size={20} />
                        Send Demo Report
                    </button>
                </div>

                {/* Main Reports Panel */}
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl border border-gray-700 p-6">
                    <div className="flex items-center mb-6">
                        <BsPieChart className="text-blue-400 mr-3" size={24} />
                        <h3 className="text-xl font-bold text-white">Daily Orders Report</h3>
                    </div>

                    {/* Date Selection */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                            <BsCalendarCheck className="inline mr-2" size={16} />
                            Select Report Date
                        </label>
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                    </div>

                    {/* Report Generation */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50 hover:border-green-500/30 transition-all duration-300">
                            <div className="flex items-center mb-4">
                                <div className="bg-green-500/20 p-3 rounded-xl mr-4">
                                    <BsFileText className="text-green-400" size={24} />
                                </div>
                                <div>
                                    <h4 className="text-white font-semibold">CSV Report</h4>
                                    <p className="text-gray-400 text-sm">Spreadsheet format for data analysis</p>
                                </div>
                            </div>
                            <button
                                onClick={() => generateReport('csv')}
                                disabled={reportLoading}
                                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-4 py-3 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 font-medium"
                            >
                                <BsDownload size={18} />
                                <span>Generate CSV</span>
                            </button>
                        </div>

                        <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50 hover:border-red-500/30 transition-all duration-300">
                            <div className="flex items-center mb-4">
                                <div className="bg-red-500/20 p-3 rounded-xl mr-4">
                                    <BsFileText className="text-red-400" size={24} />
                                </div>
                                <div>
                                    <h4 className="text-white font-semibold">PDF Report</h4>
                                    <p className="text-gray-400 text-sm">Professional formatted document</p>
                                </div>
                            </div>
                            <button
                                onClick={() => generateReport('pdf')}
                                disabled={reportLoading}
                                className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white px-4 py-3 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 font-medium"
                            >
                                <BsFileText size={18} />
                                <span>Generate PDF</span>
                            </button>
                        </div>
                    </div>

                    {/* Email Section */}
                    <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-xl p-6 border border-blue-500/30">
                        <div className="flex items-center mb-4">
                            <BsEnvelope className="text-blue-400 mr-3" size={20} />
                            <h4 className="text-white font-semibold">Email Report</h4>
                        </div>
                        <p className="text-gray-300 text-sm mb-4">Send generated reports directly to any email address</p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <input
                                type="email"
                                placeholder="Enter email address (e.g., badar12041@gmail.com)"
                                value={emailAddress}
                                onChange={(e) => setEmailAddress(e.target.value)}
                                className="flex-1 bg-gray-700/50 border border-gray-600 text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-400"
                            />
                            <div className="flex gap-3">
                                <button
                                    onClick={() => emailReport('csv')}
                                    disabled={reportLoading || !emailAddress}
                                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-6 py-3 rounded-lg transition-all duration-200 font-medium flex items-center space-x-2"
                                >
                                    <BsEnvelope size={16} />
                                    <span>Email CSV</span>
                                </button>
                                <button
                                    onClick={() => emailReport('pdf')}
                                    disabled={reportLoading || !emailAddress}
                                    className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white px-6 py-3 rounded-lg transition-all duration-200 font-medium flex items-center space-x-2"
                                >
                                    <BsEnvelope size={16} />
                                    <span>Email PDF</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Loading State */}
                    {reportLoading && (
                        <div className="mt-6 bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                            <div className="flex items-center">
                                <BsActivity className="text-blue-400 animate-spin mr-3" size={20} />
                                <span className="text-blue-300 font-medium">Processing report...</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Enhanced Information Panel */}
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl border border-gray-700 p-6">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                        <BsBell className="mr-2 text-yellow-400" size={20} />
                        Enhanced Business Reports System
                    </h3>

                    {/* New Features Highlight */}
                    <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/30 rounded-xl p-4 mb-6">
                        <h4 className="text-green-400 font-semibold mb-3 flex items-center">
                            <BsCheckCircle className="mr-2" size={18} />
                            ✨ Latest Enhancements
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div className="space-y-2">
                                <p className="text-white font-medium">📊 Enhanced PDF Reports:</p>
                                <ul className="text-gray-300 space-y-1 ml-4">
                                    <li>• Clear English text formatting</li>
                                    <li>• Professional BDT currency display</li>
                                    <li>• Detailed item breakdown with quantities</li>
                                    <li>• Individual item prices and totals</li>
                                    <li>• Business analytics & insights</li>
                                    <li>• Order status breakdown</li>
                                    <li>• Customer information display</li>
                                </ul>
                            </div>
                            <div className="space-y-2">
                                <p className="text-white font-medium">📈 Executive Analytics:</p>
                                <ul className="text-gray-300 space-y-1 ml-4">
                                    <li>• Revenue summaries & trends</li>
                                    <li>• Average order value calculations</li>
                                    <li>• Item-wise sales performance</li>
                                    <li>• Professional business formatting</li>
                                    <li>• Enhanced CSV with item details</li>
                                    <li>• CEO-ready comprehensive data</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                            <h4 className="text-yellow-400 font-semibold mb-2">📧 Email Configuration</h4>
                            <p className="text-gray-300 text-sm mb-2">
                                Automated reports sent from: <code className="bg-gray-700 px-2 py-1 rounded text-yellow-300">Harrisvalebd@gmail.com</code>
                            </p>
                            <p className="text-gray-300 text-sm mb-2">
                                Daily automation target: <code className="bg-gray-700 px-2 py-1 rounded text-yellow-300">badar12041@gmail.com</code>
                            </p>
                            <p className="text-gray-400 text-xs">
                                Schedule: Every day at 8:00 AM with previous day's orders
                            </p>
                        </div>
                        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                            <h4 className="text-blue-400 font-semibold mb-2">📋 Report Contents</h4>
                            <ul className="text-gray-300 text-sm space-y-1">
                                <li>• <strong>Order Management:</strong> Complete order tracking</li>
                                <li>• <strong>Customer Data:</strong> Contact & shipping details</li>
                                <li>• <strong>Financial Analysis:</strong> Revenue & pricing breakdowns</li>
                                <li>• <strong>Inventory Insights:</strong> Product performance metrics</li>
                                <li>• <strong>Business Intelligence:</strong> Decision-making data</li>
                                <li>• <strong>Export Options:</strong> PDF, CSV, Email delivery</li>
                            </ul>
                        </div>
                    </div>

                    {/* System Status */}
                    <div className="mt-6 bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                        <div className="flex items-center">
                            <BsCheckCircle className="text-green-400 mr-3" size={20} />
                            <div>
                                <p className="text-green-400 font-semibold">System Status: ✅ Fully Operational</p>
                                <p className="text-gray-400 text-sm">Email authentication configured • Reports generating successfully • All features active</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // Delivery Management section component
    const renderDeliverySection = () => (
        <div className="space-y-8">
            {/* Delivery Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-2xl p-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-bold text-white mb-2">Delivery Management</h2>
                        <p className="text-blue-100">Track and manage order deliveries</p>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
                        <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2v0a2 2 0 01-2-2v-2a2 2 0 00-2-2H8z" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Delivery Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700 hover:border-yellow-500/50 transition-all">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-yellow-500/20 p-3 rounded-xl">
                            <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <span className="text-2xl font-bold text-white">{deliveryStats?.pending?.count || 0}</span>
                    </div>
                    <h3 className="text-yellow-400 font-semibold mb-1">Pending Orders</h3>
                    <p className="text-gray-400 text-sm">Orders awaiting delivery assignment</p>
                </div>

                <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700 hover:border-blue-500/50 transition-all">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-blue-500/20 p-3 rounded-xl">
                            <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                        <span className="text-2xl font-bold text-white">{deliveryStats?.assigned?.count || 0}</span>
                    </div>
                    <h3 className="text-blue-400 font-semibold mb-1">Assigned Orders</h3>
                    <p className="text-gray-400 text-sm">Orders assigned to delivery personnel</p>
                </div>

                <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700 hover:border-purple-500/50 transition-all">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-purple-500/20 p-3 rounded-xl">
                            <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0h6m0 0v6m-6-6v6m6 0a2 2 0 01-2 2h-4a2 2 0 01-2-2V7" />
                            </svg>
                        </div>
                        <span className="text-2xl font-bold text-white">{deliveryStats?.in_transit?.count || 0}</span>
                    </div>
                    <h3 className="text-purple-400 font-semibold mb-1">In Transit</h3>
                    <p className="text-gray-400 text-sm">Orders currently being shipped</p>
                </div>

                <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700 hover:border-green-500/50 transition-all">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-green-500/20 p-3 rounded-xl">
                            <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <span className="text-2xl font-bold text-white">{deliveryStats?.delivered?.count || 0}</span>
                    </div>
                    <h3 className="text-green-400 font-semibold mb-1">Delivered Orders</h3>
                    <p className="text-gray-400 text-sm">Successfully completed deliveries</p>
                </div>
            </div>

            {/* Pending Orders Table */}
            <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-700/50 flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-white">Pending Orders</h3>
                    <button
                        onClick={fetchOrders}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                    >
                        Refresh
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-700/50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Order ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Customer</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Total</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Payment Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Delivery Person</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions & Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700/50">
                            {orders.map((order) => (
                                <tr key={order._id} className="hover:bg-gray-700/30 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                                        #{order.orderId || order._id.slice(-8).toUpperCase()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                        <div>
                                            <div className="font-medium">{order.userName || order.recipientName || 'N/A'}</div>
                                            <div className="text-gray-400">{order.userEmail || 'N/A'}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                        BDT {order.totalAmount?.toFixed(2) || '0.00'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPaymentStatusBadge(order.paymentStatus)}`}>
                                            {order.paymentStatus}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                        {order.deliveryAssignedTo ? (
                                            <div>
                                                <div className="font-medium text-blue-400">{order.deliveryAssignedTo}</div>
                                                <div className="text-xs text-gray-500">Assigned</div>
                                            </div>
                                        ) : (
                                            <span className="text-gray-500 italic">Not assigned</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                        {formatDate(order.createdAt)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <div className="flex space-x-2">
                                            {!order.deliveryAssignedTo ? (
                                                <button
                                                    onClick={() => setSelectedOrderForDelivery(order)}
                                                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors text-xs"
                                                    disabled={deliveryActionLoading}
                                                >
                                                    Assign Delivery
                                                </button>
                                            ) : order.deliveryStatus === 'assigned' || order.deliveryStatus === 'pending' ? (
                                                <button
                                                    onClick={() => markOrderShipped(order._id)}
                                                    className="px-3 py-1 bg-orange-600 hover:bg-orange-700 text-white rounded transition-colors text-xs"
                                                    disabled={deliveryActionLoading}
                                                >
                                                    Mark Shipped
                                                </button>
                                            ) : order.deliveryStatus === 'in_transit' ? (
                                                <button
                                                    onClick={() => updateDeliveryStatusSmoothly(order._id, 'out_for_delivery')}
                                                    className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded transition-colors text-xs"
                                                    disabled={deliveryActionLoading}
                                                >
                                                    Out for Delivery
                                                </button>
                                            ) : order.deliveryStatus === 'out_for_delivery' ? (
                                                <button
                                                    onClick={() => markOrderDelivered(order._id)}
                                                    className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded transition-colors text-xs"
                                                    disabled={deliveryActionLoading}
                                                >
                                                    Mark Delivered
                                                </button>
                                            ) : (
                                                <span className="text-green-400 text-xs font-medium">
                                                    Completed
                                                </span>
                                            )}

                                            {/* Status indicator badge */}
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDeliveryStatusBadge(order.deliveryStatus)}`}>
                                                {order.deliveryStatus?.replace('_', ' ') || 'Pending'}
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {orders.length === 0 && (
                        <div className="text-center py-12 text-gray-400">
                            <div className="mb-4">
                                <svg className="w-16 h-16 mx-auto text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                </svg>
                            </div>
                            <h4 className="text-lg font-medium text-gray-300 mb-2">No Pending Delivery Orders</h4>
                            <p className="text-gray-400 mb-4">
                                Orders that are confirmed/processing, paid, and not assigned to delivery will appear here.
                            </p>
                            <button
                                onClick={fetchOrders}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                            >
                                Check Again
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Delivery Orders Management */}
            <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-700/50">
                    <h3 className="text-xl font-semibold text-white">Delivery Status Management</h3>
                </div>
                <div className="p-6">
                    {/* Status Filter Tabs */}
                    <div className="flex flex-wrap gap-2 mb-6">
                        {['assigned', 'in_transit', 'out_for_delivery', 'delivered'].map((status) => (
                            <button
                                key={status}
                                onClick={() => fetchOrdersByDeliveryStatus(status)}
                                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors capitalize"
                            >
                                {status.replace('_', ' ')}
                            </button>
                        ))}
                    </div>

                    {/* Delivery Orders Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-700/50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Order ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Customer</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Delivery Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Assigned To</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700/50">
                                {deliveryOrders.map((order) => (
                                    <tr key={order._id} className="hover:bg-gray-700/30 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                                            #{order._id.slice(-8).toUpperCase()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                            <div>
                                                <div className="font-medium">{order?.userName || 'N/A'}</div>
                                                <div className="text-gray-400">{order?.userEmail || 'N/A'}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getDeliveryStatusBadge(order.deliveryStatus)}`}>
                                                {order.deliveryStatus}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                            {order.deliveryAssignedTo || 'Not assigned'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                                            {order.deliveryStatus === 'assigned' && (
                                                <button
                                                    onClick={() => markOrderShipped(order._id)}
                                                    disabled={deliveryActionLoading}
                                                    className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded transition-colors disabled:opacity-50"
                                                >
                                                    Mark Shipped
                                                </button>
                                            )}
                                            {order.deliveryStatus === 'in_transit' && (
                                                <button
                                                    onClick={() => updateOrderAndDeliveryStatus(order._id, 'shipped', 'out_for_delivery')}
                                                    disabled={deliveryActionLoading}
                                                    className="px-3 py-1 bg-orange-600 hover:bg-orange-700 text-white rounded transition-colors disabled:opacity-50"
                                                >
                                                    Out for Delivery
                                                </button>
                                            )}
                                            {order.deliveryStatus === 'out_for_delivery' && (
                                                <button
                                                    onClick={() => markOrderDelivered(order._id)}
                                                    disabled={deliveryActionLoading}
                                                    className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded transition-colors disabled:opacity-50"
                                                >
                                                    Mark Delivered
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {deliveryOrders.length === 0 && (
                            <div className="text-center py-8 text-gray-400">
                                No delivery orders found for the selected status
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Delivery Assignment Modal */}
            {selectedOrderForDelivery && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md mx-4">
                        <h3 className="text-xl font-semibold text-white mb-4">Assign Delivery Person</h3>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            assignDeliveryPerson(selectedOrderForDelivery._id, deliveryForm.deliveryPersonName, deliveryForm.deliveryNotes);
                        }}>
                            <div className="mb-4">
                                <label className="block text-gray-300 text-sm font-medium mb-2">
                                    Delivery Person Name
                                </label>
                                <input
                                    type="text"
                                    value={deliveryForm.deliveryPersonName}
                                    onChange={(e) => setDeliveryForm({ ...deliveryForm, deliveryPersonName: e.target.value })}
                                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                            </div>
                            <div className="mb-6">
                                <label className="block text-gray-300 text-sm font-medium mb-2">
                                    Delivery Notes (Optional)
                                </label>
                                <textarea
                                    value={deliveryForm.deliveryNotes}
                                    onChange={(e) => setDeliveryForm({ ...deliveryForm, deliveryNotes: e.target.value })}
                                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    rows="3"
                                />
                            </div>
                            <div className="flex space-x-3">
                                <button
                                    type="submit"
                                    disabled={deliveryActionLoading}
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
                                >
                                    {deliveryActionLoading ? 'Assigning...' : 'Assign Delivery'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSelectedOrderForDelivery(null);
                                        setDeliveryForm({
                                            deliveryPersonName: '',
                                            deliveryNotes: '',
                                            orderStatus: '',
                                            deliveryStatus: ''
                                        });
                                    }}
                                    className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800" style={{ fontFamily: "'Poppins', sans-serif" }}>
            {/* Header */}
            <header className="bg-black/90 backdrop-blur-sm shadow-2xl border-b border-gray-700 sticky top-0 z-40">
                <div className="px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Left side */}
                        <div className="flex items-center space-x-4">
                            <Link
                                to="/"
                                className="inline-flex items-center text-gray-300 hover:text-white transition-colors duration-200 group"
                            >
                                <BsArrowLeft className="mr-2 transform transition-transform duration-300 group-hover:-translate-x-1" size={18} />
                                <span className="hidden sm:block">Back to Home</span>
                            </Link>

                            <div className="hidden lg:block h-6 w-px bg-gray-600"></div>

                            <div className="flex items-center space-x-3">
                                <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-2 rounded-xl">
                                    <BsSpeedometer2 className="text-white" size={20} />
                                </div>
                                <div>
                                    <h1 className="text-xl font-bold text-white">Admin Dashboard</h1>
                                    <p className="text-sm text-gray-400 hidden sm:block">Welcome back, {user?.displayName || 'Administrator'} • {user?.email}</p>
                                </div>
                            </div>

                            {/* Real-time clock */}
                            <div className="hidden lg:flex items-center space-x-2 bg-gray-800/50 rounded-lg px-3 py-2">
                                <BsClock className="text-gray-400" size={16} />
                                <span className="text-sm text-gray-300 font-medium">
                                    {currentTime.toLocaleTimeString()} | {currentTime.toLocaleDateString()}
                                </span>
                            </div>
                        </div>

                        {/* Right side */}
                        <div className="flex items-center space-x-4">
                            {/* Profile */}
                            <div className="flex items-center space-x-3">
                                {user?.photoURL ? (
                                    <img
                                        src={user.photoURL}
                                        alt={user.displayName || 'User'}
                                        className="h-8 w-8 rounded-full object-cover border-2 border-gray-600 hover:border-blue-500 transition-colors"
                                    />
                                ) : (
                                    <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                                        <BsPerson className="text-white" size={16} />
                                    </div>
                                )}
                                <div className="hidden lg:block">
                                    <p className="text-sm font-medium text-white">{user?.displayName || 'Administrator'}</p>
                                    <p className="text-xs text-gray-400">System Admin • {user?.email}</p>
                                </div>
                            </div>

                            {/* Mobile menu button */}
                            <button
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                                className="lg:hidden p-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-all duration-200"
                            >
                                <BsThreeDotsVertical size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="flex">
                {/* Sidebar */}
                <aside className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 w-64 bg-black/95 backdrop-blur-sm shadow-lg border-r border-gray-700 transition-transform duration-300 ease-in-out lg:transition-none`}>
                    <div className="flex flex-col h-full">
                        {/* Sidebar Header */}
                        <div className="p-6 border-b border-gray-700">
                            <div className="font-bold text-xl text-white tracking-wide">
                                HARRIS VALLE
                            </div>
                            <p className="text-sm text-gray-400 mt-1">Admin Dashboard</p>
                        </div>

                        {/* Navigation */}
                        <nav className="flex-1 px-4 py-6 space-y-2">
                            {sidebarItems.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <button
                                        key={item.id}
                                        onClick={() => {
                                            setActiveTab(item.id);
                                            setSidebarOpen(false);
                                        }}
                                        className={`w-full flex items-center px-4 py-3 text-left rounded-xl transition-all duration-200 group ${activeTab === item.id
                                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                                            : 'text-gray-300 hover:bg-gray-800/80 hover:text-white'
                                            }`}
                                    >
                                        <Icon
                                            className={`mr-3 transition-transform duration-200 ${activeTab === item.id ? 'text-white' : 'text-gray-400 group-hover:text-white'
                                                } group-hover:scale-110`}
                                            size={18}
                                        />
                                        <span className="font-medium">{item.label}</span>
                                    </button>
                                );
                            })}
                        </nav>
                    </div>
                </aside>

                {/* Mobile overlay */}
                {sidebarOpen && (
                    <div
                        className="lg:hidden fixed inset-0 bg-black bg-opacity-75 z-40"
                        onClick={() => setSidebarOpen(false)}
                    ></div>
                )}

                {/* Main Content */}
                <main className="flex-1 min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
                    <div className="p-4 sm:p-6 lg:p-8">
                        {renderDashboardContent()}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Dashboard;