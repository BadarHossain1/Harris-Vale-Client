import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';

const PaymentFailed = () => {
    const [searchParams] = useSearchParams();
    const transactionId = searchParams.get('tran_id');
    const error = searchParams.get('error');

    const getErrorMessage = (errorCode) => {
        switch (errorCode) {
            case 'payment_failed':
                return 'Your payment could not be processed. Please try again.';
            case 'validation_failed':
                return 'Payment validation failed. Please contact support.';
            case 'order_creation_failed':
                return 'Payment successful but order creation failed. Please contact support.';
            case 'payment_data_not_found':
                return 'Payment data not found. Please try again.';
            case 'server_error':
                return 'Server error occurred. Please try again later.';
            default:
                return 'Payment failed. Please try again.';
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-red-50 px-4">
            <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md w-full">
                <div className="text-red-500 text-6xl mb-4">❌</div>
                <h1 className="text-2xl font-bold text-red-600 mb-4">Payment Failed!</h1>
                <p className="text-gray-600 mb-4">
                    {getErrorMessage(error)}
                </p>

                {transactionId && (
                    <p className="text-sm text-gray-500 mb-6">
                        Transaction ID: {transactionId}
                    </p>
                )}

                <div className="space-y-3">
                    <Link
                        to="/checkout"
                        className="block w-full bg-red-600 text-white px-6 py-3 rounded-md hover:bg-red-700 transition-colors"
                    >
                        Try Again
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
                        If you continue to experience issues, please contact our support team.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PaymentFailed;
