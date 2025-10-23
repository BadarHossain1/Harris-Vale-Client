import React, { useState, useEffect, useContext, useCallback, useMemo } from 'react';
import { AuthContext } from '../Provider/ContextProvider';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    // Cart and pricing states
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // Pricing states
    const [subtotal, setSubtotal] = useState(0);
    const [deliveryCharge, setDeliveryCharge] = useState(60);
    const [voucherDiscount, setVoucherDiscount] = useState(0);
    const [totalAmount, setTotalAmount] = useState(0);

    // Delivery options
    const [deliveryOption, setDeliveryOption] = useState('standard');
    const [estimatedDelivery, setEstimatedDelivery] = useState('');

    // Voucher states
    const [voucherCode, setVoucherCode] = useState('');
    const [voucherApplied, setVoucherApplied] = useState(false);

    // Address form states
    const [addressForm, setAddressForm] = useState({
        recipientName: user?.displayName || '',
        recipientPhone: '',
        region: '',
        city: '',
        district: '',
        address: '',
        landmark: '',
        addressCategory: 'home'
    });

    // Delivery options configuration
    const deliveryOptions = useMemo(() => ({
        standard: {
            name: 'Standard Delivery',
            charge: 60,
            description: '3-7 business days',
            estimatedDays: '3-7'
        },
        express: {
            name: 'Express Delivery',
            charge: 120,
            description: '1-2 business days',
            estimatedDays: '1-2'
        },
        premium: {
            name: 'Premium Delivery',
            charge: 200,
            description: 'Same day or next day',
            estimatedDays: '0-1'
        }
    }), []);

    // Predefined voucher codes (in real app, this would come from backend)
    const vouchers = {
        'WELCOME10': { discount: 10, type: 'percentage', minOrder: 500 },
        'SAVE50': { discount: 50, type: 'fixed', minOrder: 300 },
        'NEWUSER': { discount: 15, type: 'percentage', minOrder: 1000 }
    };

    // Function to get user information for cart
    const getUserInfo = useCallback(() => {
        if (user && user.email) {
            return {
                userId: user.uid,
                userEmail: user.email,
                userName: user.displayName || user.email.split('@')[0]
            };
        }
        return {
            userId: 'guest',
            userEmail: null,
            userName: null
        };
    }, [user]);

    // Calculate subtotal
    const calculateSubtotal = useCallback((items) => {
        const sub = items.reduce((total, item) => total + (item.price * item.quantity), 0);
        setSubtotal(sub);
    }, []);

    // Calculate estimated delivery date
    const calculateEstimatedDelivery = useCallback((option) => {
        const optionConfig = deliveryOptions[option];
        const days = optionConfig.estimatedDays.split('-');
        const startDay = parseInt(days[0]);
        const endDay = parseInt(days[1] || days[0]);

        const now = new Date();
        const startDate = new Date(now);
        startDate.setDate(startDate.getDate() + startDay);

        const endDate = new Date(now);
        endDate.setDate(endDate.getDate() + endDay);

        if (startDay === endDay) {
            if (startDay === 0) {
                setEstimatedDelivery('Today');
            } else if (startDay === 1) {
                setEstimatedDelivery('Tomorrow');
            } else {
                setEstimatedDelivery(startDate.toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric'
                }));
            }
        } else {
            setEstimatedDelivery(
                `${startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - 
                 ${endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
            );
        }
    }, [deliveryOptions]);

    // Fetch cart items from backend
    useEffect(() => {
        const fetchCartItems = async () => {
            try {
                setLoading(true);
                const userInfo = getUserInfo();

                const queryParams = new URLSearchParams();
                if (userInfo.userEmail) {
                    queryParams.append('userEmail', userInfo.userEmail);
                } else {
                    queryParams.append('userId', userInfo.userId);
                }

                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/cart?${queryParams}`);
                const data = await response.json();

                if (data.success && data.data) {
                    setCartItems(data.data);
                    calculateSubtotal(data.data);
                } else {
                    setCartItems([]);
                    toast.error('Failed to load cart items');
                }
            } catch (error) {
                console.error('Error fetching cart items:', error);
                toast.error('Error loading cart items');
                setCartItems([]);
            } finally {
                setLoading(false);
            }
        };

        fetchCartItems();
    }, [getUserInfo, calculateSubtotal]);

    // Calculate total amount whenever dependencies change
    useEffect(() => {
        const total = subtotal + deliveryCharge - voucherDiscount;
        setTotalAmount(total);
    }, [subtotal, deliveryCharge, voucherDiscount]);

    // Update delivery charge when option changes
    useEffect(() => {
        setDeliveryCharge(deliveryOptions[deliveryOption].charge);
        calculateEstimatedDelivery(deliveryOption);
    }, [deliveryOption, deliveryOptions, calculateEstimatedDelivery]);

    // Handle voucher application
    const handleApplyVoucher = () => {
        if (!voucherCode.trim()) {
            toast.error('Please enter a voucher code');
            return;
        }

        const voucher = vouchers[voucherCode.toUpperCase()];
        if (!voucher) {
            toast.error('Invalid voucher code');
            return;
        }

        if (subtotal < voucher.minOrder) {
            toast.error(`Minimum order amount of ৳${voucher.minOrder} required for this voucher`);
            return;
        }

        let discount = 0;
        if (voucher.type === 'percentage') {
            discount = (subtotal * voucher.discount) / 100;
        } else {
            discount = voucher.discount;
        }

        setVoucherDiscount(discount);
        setVoucherApplied(true);
        toast.success(`Voucher applied! You saved ৳${discount}`);
    };

    // Remove voucher
    const handleRemoveVoucher = () => {
        setVoucherDiscount(0);
        setVoucherApplied(false);
        setVoucherCode('');
        toast.info('Voucher removed');
    };

    // Handle address form changes
    const handleAddressChange = (e) => {
        const { name, value } = e.target;
        setAddressForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Validate form
    const validateForm = () => {
        const required = ['recipientName', 'recipientPhone', 'region', 'city', 'district', 'address', 'addressCategory'];

        for (let field of required) {
            if (!addressForm[field].trim()) {
                toast.error(`${field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} is required`);
                return false;
            }
        }

        // Validate phone number (basic validation)
        const phoneRegex = /^[0-9]{11}$/;
        if (!phoneRegex.test(addressForm.recipientPhone)) {
            toast.error('Please enter a valid 11-digit phone number');
            return false;
        }

        return true;
    };

    // Handle direct order confirmation (SSLCommerz disabled)
    const handlePlaceOrder = async () => {
        if (!user) {
            toast.error('Please login to place an order');
            navigate('/login');
            return;
        }

        if (cartItems.length === 0) {
            toast.error('Your cart is empty');
            return;
        }

        if (!validateForm()) {
            return;
        }

        try {
            setSubmitting(true);
            const userInfo = getUserInfo();

            // Prepare order data (direct order without payment gateway)
            const orderData = {
                userId: userInfo.userId,
                userEmail: user.email,
                userName: user.displayName || addressForm.recipientName,
                items: cartItems.map(item => ({
                    productId: item.productId,
                    name: item.name,
                    price: item.price,
                    image: item.image,
                    size: item.size,
                    quantity: item.quantity,
                    itemTotal: item.price * item.quantity
                })),
                subtotal,
                deliveryCharge,
                voucherDiscount,
                voucherCode: voucherApplied ? voucherCode : null,
                totalAmount,
                deliveryOption,
                recipientName: addressForm.recipientName,
                recipientPhone: addressForm.recipientPhone,
                region: addressForm.region,
                city: addressForm.city,
                district: addressForm.district,
                address: addressForm.address,
                landmark: addressForm.landmark,
                addressCategory: addressForm.addressCategory
            };

            console.log('Creating direct order with data:', orderData);

            const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            const response = await fetch(`${API_BASE_URL}/api/orders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData)
            });

            const result = await response.json();

            if (result.success) {
                console.log('✅ Order created successfully:', result.data);
                toast.success('Order placed successfully!');

                // Navigate to order confirmation page
                navigate('/payment/success', {
                    state: {
                        orderData: result.data,
                        message: 'Your order has been placed successfully!',
                        isDirectOrder: true
                    }
                });
            } else {
                console.error('❌ Order creation failed:', result);
                toast.error(result.message || 'Failed to place order');
            }
        } catch (error) {
            console.error('❌ Error placing order:', error);
            toast.error('Error placing order. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    /* SSLCommerz Payment Integration - DISABLED FOR NOW
    const handlePlaceOrderWithSSL = async () => {
        if (!user) {
            toast.error('Please login to place an order');
            navigate('/login');
            return;
        }

        if (cartItems.length === 0) {
            toast.error('Your cart is empty');
            return;
        }

        if (!validateForm()) {
            return;
        }

        try {
            setSubmitting(true);
            const userInfo = getUserInfo();

            // Prepare SSLCommerz payment data
            const paymentData = {
                totalAmount,
                currency: 'BDT',
                customerName: addressForm.recipientName,
                customerEmail: user.email,
                customerPhone: addressForm.recipientPhone,
                cartItems: cartItems.map(item => ({
                    productId: item.productId,
                    name: item.name,
                    price: item.price,
                    image: item.image,
                    size: item.size,
                    quantity: item.quantity,
                    itemTotal: item.price * item.quantity
                })),
                deliveryOption,
                addressForm,
                userId: userInfo.userId,
                subtotal,
                deliveryCharge,
                voucherDiscount,
                voucherCode: voucherApplied ? voucherCode : null
            };

            console.log('Initiating SSLCommerz payment with data:', paymentData);

            const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            const response = await fetch(`${API_BASE_URL}/api/payment/init`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(paymentData)
            });

            const result = await response.json();

            if (result.success && result.gatewayPageURL) {
                console.log('✅ Payment initialized successfully');
                toast.success('Redirecting to payment gateway...');

                // Redirect to SSLCommerz payment gateway
                window.location.replace(result.gatewayPageURL);
            } else {
                console.error('❌ Payment initialization failed:', result);
                toast.error(result.message || 'Payment initialization failed');
            }
        } catch (error) {
            console.error('❌ Error initiating payment:', error);
            toast.error('Error initiating payment. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };
    */

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-xl">Loading checkout...</div>
            </div>
        );
    }

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center">
                <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
                <p className="text-gray-600 mb-6">Add some products to your cart before checking out</p>
                <button
                    onClick={() => navigate('/products')}
                    className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition"
                >
                    Continue Shopping
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-center mb-8">Checkout</h1>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Side - Order Summary & Delivery */}
                    <div className="space-y-6">
                        {/* Order Items */}
                        <div className="bg-white rounded-lg p-6 shadow-sm">
                            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                            <div className="space-y-4">
                                {cartItems.map((item) => (
                                    <div key={`${item.productId}-${item.size}`} className="flex items-center space-x-4 border-b pb-4">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-16 h-16 object-cover rounded-lg"
                                        />
                                        <div className="flex-1">
                                            <h3 className="font-medium">{item.name}</h3>
                                            <p className="text-sm text-gray-600">Size: {item.size}</p>
                                            <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-medium">৳{item.price * item.quantity}</p>
                                            <p className="text-sm text-gray-600">৳{item.price} each</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Delivery Options */}
                        {/* <div className="bg-white rounded-lg p-6 shadow-sm">
                            <h2 className="text-xl font-semibold mb-4">Delivery Options</h2>
                            <div className="space-y-3">
                                {Object.entries(deliveryOptions).map(([key, option]) => (
                                    <label key={key} className="flex items-center space-x-3 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="delivery"
                                            value={key}
                                            checked={deliveryOption === key}
                                            onChange={(e) => setDeliveryOption(e.target.value)}
                                            className="text-black focus:ring-black"
                                        />
                                        <div className="flex-1">
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <p className="font-medium">{option.name}</p>
                                                    <p className="text-sm text-gray-600">{option.description}</p>
                                                </div>
                                                <p className="font-medium">৳{option.charge}</p>
                                            </div>
                                        </div>
                                    </label>
                                ))}
                            </div>
                            <div className="mt-4 p-3 bg-gray-50 rounded">
                                <p className="text-sm"><strong>Estimated Delivery:</strong> {estimatedDelivery}</p>
                            </div>
                        </div> */}

                        {/* Voucher Section */}
                        {/* <div className="bg-white rounded-lg p-6 shadow-sm">
                            <h2 className="text-xl font-semibold mb-4">Apply Voucher</h2>
                            {!voucherApplied ? (
                                <div className="flex space-x-2">
                                    <input
                                        type="text"
                                        placeholder="Enter voucher code"
                                        value={voucherCode}
                                        onChange={(e) => setVoucherCode(e.target.value)}
                                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                                    />
                                    <button
                                        onClick={handleApplyVoucher}
                                        className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition"
                                    >
                                        Apply
                                    </button>
                                </div>
                            ) : (
                                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                                    <div>
                                        <p className="font-medium text-green-800">Voucher Applied: {voucherCode}</p>
                                        <p className="text-sm text-green-600">You saved ৳{voucherDiscount}</p>
                                    </div>
                                    <button
                                        onClick={handleRemoveVoucher}
                                        className="text-red-600 hover:text-red-800 text-sm"
                                    >
                                        Remove
                                    </button>
                                </div>
                            )}
                            <div className="mt-4 text-xs text-gray-500">
                                <p>Available vouchers: WELCOME10, SAVE50, NEWUSER</p>
                            </div>
                        </div> */}
                    </div>

                    {/* Right Side - Shipping Address & Payment */}
                    <div className="space-y-6">
                        {/* Shipping Address */}
                        <div className="bg-white rounded-lg p-6 shadow-sm">
                            <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Recipient Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="recipientName"
                                        value={addressForm.recipientName}
                                        onChange={handleAddressChange}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Phone Number *
                                    </label>
                                    <input
                                        type="tel"
                                        name="recipientPhone"
                                        value={addressForm.recipientPhone}
                                        onChange={handleAddressChange}
                                        placeholder="01XXXXXXXXX"
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Region *
                                        </label>
                                        <select
                                            name="region"
                                            value={addressForm.region}
                                            onChange={handleAddressChange}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                                            required
                                        >
                                            <option value="">Select Region</option>
                                            <option value="Dhaka">Dhaka</option>
                                            <option value="Chittagong">Chittagong</option>
                                            <option value="Sylhet">Sylhet</option>
                                            <option value="Rajshahi">Rajshahi</option>
                                            <option value="Khulna">Khulna</option>
                                            <option value="Barisal">Barisal</option>
                                            <option value="Rangpur">Rangpur</option>
                                            <option value="Mymensingh">Mymensingh</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            City *
                                        </label>
                                        <input
                                            type="text"
                                            name="city"
                                            value={addressForm.city}
                                            onChange={handleAddressChange}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            District *
                                        </label>
                                        <input
                                            type="text"
                                            name="district"
                                            value={addressForm.district}
                                            onChange={handleAddressChange}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Full Address *
                                    </label>
                                    <textarea
                                        name="address"
                                        value={addressForm.address}
                                        onChange={handleAddressChange}
                                        rows="3"
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                                        placeholder="House/Building number, Street, Area"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Landmark (Optional)
                                    </label>
                                    <input
                                        type="text"
                                        name="landmark"
                                        value={addressForm.landmark}
                                        onChange={handleAddressChange}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                                        placeholder="Near mosque, school, market etc."
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Address Category *
                                    </label>
                                    <select
                                        name="addressCategory"
                                        value={addressForm.addressCategory}
                                        onChange={handleAddressChange}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                                        required
                                    >
                                        <option value="home">Home</option>
                                        <option value="office">Office</option>
                                        <option value="others">Others</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Price Breakdown */}
                        <div className="bg-white rounded-lg p-6 shadow-sm">
                            <h2 className="text-xl font-semibold mb-4">Price Details</h2>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span>Subtotal ({cartItems.length} items)</span>
                                    <span>৳{subtotal}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Delivery Charge</span>
                                    <span>৳{deliveryCharge}</span>
                                </div>
                                {voucherDiscount > 0 && (
                                    <div className="flex justify-between text-green-600">
                                        <span>Voucher Discount</span>
                                        <span>-৳{voucherDiscount}</span>
                                    </div>
                                )}
                                <hr />
                                <div className="flex justify-between text-lg font-semibold">
                                    <span>Total Amount</span>
                                    <span>৳{totalAmount}</span>
                                </div>
                            </div>
                        </div>

                        {/* Place Order Button */}
                        <button
                            onClick={handlePlaceOrder}
                            disabled={submitting}
                            className={`w-full py-4 rounded-lg text-white font-semibold text-lg transition ${submitting
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-black hover:bg-gray-800'
                                }`}
                        >
                            {submitting ? 'Redirecting to Payment...' : `Pay Now - ৳${totalAmount}`}
                        </button>

                        <p className="text-sm text-gray-500 text-center">
                            By placing this order, you agree to our terms and conditions
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;