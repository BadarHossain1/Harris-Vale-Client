import React, { useEffect, useState } from 'react';
import { useSearchParams, Link, useLocation } from 'react-router-dom';

const PaymentSuccess = () => {
    const [searchParams] = useSearchParams();
    const location = useLocation();
    const transactionId = searchParams.get('tran_id');
    const orderId = searchParams.get('order_id');
    const [loading, setLoading] = useState(true);
    
    // Check if this is a direct order (pre-order) or payment
    const isDirectOrder = location.state?.isDirectOrder || false;
    const orderData = location.state?.orderData;
    const customMessage = location.state?.message;

    useEffect(() => {
      // ghen ghen ghen
        const timer = setTimeout(() => {
            setLoading(false);
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-green-50">
                <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Processing your payment...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-green-50 px-4">
            <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md w-full">
                <div className="text-green-500 text-6xl mb-4">✅</div>
                <h1 className="text-2xl font-bold text-green-600 mb-4">
                    Order Placed Successfully!
                </h1>
                <p className="text-gray-600 mb-4">
                    {customMessage || 'Thank you for your order! Your order has been placed successfully and is being processed.'}
                </p>

                {(orderId || orderData?.orderId) && (
                    <div className="bg-green-50 p-4 rounded-lg mb-4">
                        <p className="text-sm text-green-700 font-semibold">Order ID:</p>
                        <p className="text-lg font-mono text-green-800">{orderId || orderData?.orderId}</p>
                    </div>
                )}

                {transactionId && (
                    <p className="text-sm text-gray-500 mb-6">
                        Transaction ID: {transactionId}
                    </p>
                )}
                
                {orderData && (
                    <div className="bg-blue-50 p-4 rounded-lg mb-4 text-left">
                        <p className="text-sm text-blue-700 font-semibold mb-2">Order Details:</p>
                        <p className="text-sm text-blue-600">Total Amount: BDT {orderData?.totalAmount?.toFixed(2)}</p>
                        <p className="text-sm text-blue-600">Payment Status: {orderData?.paymentStatus || 'Pending'}</p>
                        <p className="text-sm text-blue-600 mt-2">We'll contact you shortly to confirm your order.</p>
                    </div>
                )}

                <div className="space-y-3">
                    <Link
                        to="/user-profile"
                        className="block w-full bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition-colors"
                    >
                        View Order History
                    </Link>
                    <Link
                        to="/products"
                        className="block w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-md hover:bg-gray-200 transition-colors"
                    >
                        Continue Shopping
                    </Link>
                    <Link
                        to="/"
                        className="block w-full text-gray-500 hover:text-gray-700 transition-colors"
                    >
                        Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default PaymentSuccess;
