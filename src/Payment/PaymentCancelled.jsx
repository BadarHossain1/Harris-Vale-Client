import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';

const PaymentCancelled = () => {
    const [searchParams] = useSearchParams();
    const transactionId = searchParams.get('tran_id');

    return (
        <div className="min-h-screen flex items-center justify-center bg-yellow-50 px-4">
            <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md w-full">
                <div className="text-yellow-500 text-6xl mb-4">⚠️</div>
                <h1 className="text-2xl font-bold text-yellow-600 mb-4">Payment Cancelled</h1>
                <p className="text-gray-600 mb-4">
                    You have cancelled the payment process. Your order has not been placed.
                </p>

                {transactionId && (
                    <p className="text-sm text-gray-500 mb-6">
                        Transaction ID: {transactionId}
                    </p>
                )}

                <div className="space-y-3">
                    <Link
                        to="/checkout"
                        className="block w-full bg-yellow-600 text-white px-6 py-3 rounded-md hover:bg-yellow-700 transition-colors"
                    >
                        Complete Payment
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

                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-600">
                        Your cart items are still saved. You can complete the payment anytime.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PaymentCancelled;
