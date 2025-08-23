import React, { useState, useEffect, useContext } from 'react';
import { BsCart3, BsX, BsTrash } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import { AuthContext } from '../Provider/ContextProvider';
import { toast } from 'react-toastify';

const Cart = ({ closeCart }) => {
    const { user } = useContext(AuthContext);
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    // Function to get user information for cart
    const getUserInfo = () => {
        if (user && user.email) {
            return {
                userId: user.email,
                userEmail: user.email,
                userName: user.displayName || user.email.split('@')[0]
            };
        }

        // For guest users, get the stored guest ID
        let guestId = localStorage.getItem('guestUserId');
        if (!guestId) {
            guestId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            localStorage.setItem('guestUserId', guestId);
        }

        return {
            userId: guestId,
            userEmail: null,
            userName: null
        };
    };

    // Fetch cart items from backend
    useEffect(() => {
        fetchCartItems();
    }, [user]); // Re-fetch when user changes

    const fetchCartItems = async () => {
        try {
            setLoading(true);
            const userInfo = getUserInfo();

            // Build query parameters
            const params = new URLSearchParams({
                userId: userInfo.userId
            });

            if (userInfo.userEmail) {
                params.append('userEmail', userInfo.userEmail);
            }

            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/cart?${params}`);
            const result = await response.json();

            console.log('Cart fetch response for user:', userInfo.userEmail || userInfo.userId, result);

            if (result.success) {
                setCartItems(result.data || []);
            } else {
                console.error('Error fetching cart:', result.message);
                setCartItems([]);
            }
        } catch (error) {
            console.error('Error fetching cart items:', error);
            setCartItems([]);
        } finally {
            setLoading(false);
        }
    };

    const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
    const totalPrice = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

    const handleQuantityChange = async (itemId, change) => {
        const item = cartItems.find(i => i._id === itemId);
        if (!item) return;

        const newQuantity = item.quantity + change;

        if (newQuantity < 1) {
            handleRemoveItem(itemId);
            return;
        }

        setUpdating(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/cart/${itemId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ quantity: newQuantity })
            });

            const result = await response.json();
            console.log('Update quantity response:', result);

            if (result.success) {
                // Update local state
                setCartItems(prevItems =>
                    prevItems.map(item =>
                        item._id === itemId
                            ? { ...item, quantity: newQuantity }
                            : item
                    )
                );
            } else {
                toast.error(`Error updating quantity: ${result.message}`, {
                    position: "top-right",
                    autoClose: 4000,
                });
            }
        } catch (error) {
            console.error('Error updating quantity:', error);
            toast.error('Error updating quantity. Please try again.', {
                position: "top-right",
                autoClose: 4000,
            });
        } finally {
            setUpdating(false);
        }
    };

    const handleRemoveItem = async (itemId) => {
        if (!confirm('Are you sure you want to remove this item from your cart?')) {
            return;
        }

        setUpdating(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/cart/${itemId}`, {
                method: 'DELETE'
            });

            const result = await response.json();
            console.log('Remove item response:', result);

            if (result.success) {
                // Remove item from local state
                setCartItems(prevItems => prevItems.filter(item => item._id !== itemId));
                toast.success('Item removed from cart', {
                    position: "top-right",
                    autoClose: 3000,
                });
            } else {
                toast.error(`Error removing item: ${result.message}`, {
                    position: "top-right",
                    autoClose: 4000,
                });
            }
        } catch (error) {
            console.error('Error removing item:', error);
            toast.error('Error removing item. Please try again.', {
                position: "top-right",
                autoClose: 4000,
            });
        } finally {
            setUpdating(false);
        }
    };

    const handleClearCart = async () => {
        if (!confirm('Are you sure you want to clear your entire cart?')) {
            return;
        }

        setUpdating(true);
        try {
            const userInfo = getUserInfo();

            // Build query parameters
            const params = new URLSearchParams({
                userId: userInfo.userId
            });

            if (userInfo.userEmail) {
                params.append('userEmail', userInfo.userEmail);
            }

            const response = await fetch(`http://localhost:5000/api/cart/clear?${params}`, {
                method: 'DELETE'
            });

            const result = await response.json();
            console.log('Clear cart response:', result);

            if (result.success) {
                setCartItems([]);
                const message = userInfo.userEmail
                    ? `Cart cleared for ${userInfo.userEmail}`
                    : 'Cart cleared successfully';
                toast.success(message, {
                    position: "top-right",
                    autoClose: 3000,
                });
            } else {
                toast.error(`Error clearing cart: ${result.message}`, {
                    position: "top-right",
                    autoClose: 4000,
                });
            }
        } catch (error) {
            console.error('Error clearing cart:', error);
            toast.error('Error clearing cart. Please try again.', {
                position: "top-right",
                autoClose: 4000,
            });
        } finally {
            setUpdating(false);
        }
    };
    return (
        <>
            {/* Cart Modal */}
            <div className="fixed top-4 right-4 w-96 max-w-[calc(100vw-2rem)] bg-gradient-to-b from-gray-900 to-black rounded-2xl shadow-2xl z-50 h-[calc(100vh-2rem)] max-h-[600px] flex flex-col border border-gray-700">
                <div className="flex flex-col h-full" style={{ fontFamily: "'Poppins', 'Segoe UI', sans-serif" }}>
                    {/* Cart Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-700 bg-gradient-to-r from-gray-800 to-gray-900 rounded-t-2xl">
                        <div className="flex items-center space-x-3">
                            <div className="bg-white/10 p-2 rounded-lg">
                                <BsCart3 className="text-white" size={20} />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white">
                                    Cart {totalItems > 0 && <span className="text-sm font-normal text-gray-300">({totalItems} items)</span>}
                                </h2>
                                {user?.email && (
                                    <p className="text-xs text-blue-300 mt-1">
                                        {user.email}
                                    </p>
                                )}
                            </div>
                        </div>
                        <button
                            onClick={closeCart}
                            className="flex items-center justify-center h-10 w-10 text-gray-300 hover:text-white hover:bg-white/10 rounded-full transition-all duration-300"
                        >
                            <BsX size={24} />
                        </button>
                    </div>

                    {/* Cart Content */}
                    <div className="flex-1 overflow-hidden flex flex-col min-h-0">
                        {loading ? (
                            /* Loading State */
                            <div className="flex flex-col items-center justify-center py-12 px-4 flex-1">
                                <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mb-6 backdrop-blur-sm animate-pulse">
                                    <BsCart3 className="text-gray-300" size={32} />
                                </div>
                                <h3 className="text-white font-bold text-lg mb-3">Loading cart...</h3>
                            </div>
                        ) : cartItems.length === 0 ? (
                            /* Empty Cart State */
                            <div className="flex flex-col items-center justify-center py-12 px-4 flex-1">
                                <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mb-6 backdrop-blur-sm">
                                    <BsCart3 className="text-gray-300" size={32} />
                                </div>
                                <h3 className="text-white font-bold text-lg mb-3">Your cart is empty.</h3>
                                <p className="text-gray-300 text-sm text-center mb-8 leading-relaxed">
                                    Add some premium items to get started!
                                </p>
                                <Link
                                    to="/products"
                                    onClick={closeCart}
                                    className="bg-gradient-to-r from-white to-gray-200 text-black px-8 py-3 rounded-xl transition-all duration-300 font-bold hover:from-gray-200 hover:to-white transform hover:scale-105 shadow-lg inline-block"
                                >
                                    Continue Shopping
                                </Link>
                            </div>
                        ) : (
                            /* Cart Items - Scrollable */
                            <div className="flex-1 overflow-y-auto p-6 space-y-4 min-h-0">
                                {cartItems.map((item) => (
                                    <div key={`${item.productId}-${item.size}-${item._id}`} className="flex items-center space-x-4 p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all duration-300 backdrop-blur-sm">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-20 h-20 object-cover rounded-xl flex-shrink-0 border border-white/20 shadow-md"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-bold text-base text-white truncate mb-1">{item.name}</h4>
                                            <p className="text-gray-300 text-sm mb-2">Size: {item.size}</p>
                                            <p className="text-white font-bold text-lg">${item.price}</p>
                                        </div>
                                        <div className="flex flex-col items-end space-y-3 flex-shrink-0">
                                            <div className="flex items-center space-x-3 bg-white/10 rounded-xl p-2">
                                                <button
                                                    onClick={() => handleQuantityChange(item._id, -1)}
                                                    disabled={updating}
                                                    className={`w-8 h-8 flex items-center justify-center rounded-lg text-white font-bold transition-colors ${updating ? 'bg-gray-600 cursor-not-allowed' : 'bg-white/20 hover:bg-white/30'
                                                        }`}
                                                >
                                                    -
                                                </button>
                                                <span className="text-sm font-bold min-w-[24px] text-center text-white">{item.quantity}</span>
                                                <button
                                                    onClick={() => handleQuantityChange(item._id, 1)}
                                                    disabled={updating}
                                                    className={`w-8 h-8 flex items-center justify-center rounded-lg text-white font-bold transition-colors ${updating ? 'bg-gray-600 cursor-not-allowed' : 'bg-white/20 hover:bg-white/30'
                                                        }`}
                                                >
                                                    +
                                                </button>
                                            </div>
                                            <button
                                                onClick={() => handleRemoveItem(item._id)}
                                                disabled={updating}
                                                className={`transition-colors p-2 rounded-lg ${updating
                                                    ? 'text-gray-500 bg-gray-600/10 cursor-not-allowed'
                                                    : 'text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20'
                                                    }`}
                                                title="Remove item"
                                            >
                                                <BsTrash size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Cart Footer (when items exist) - Always visible at bottom */}
                    {!loading && cartItems.length > 0 && (
                        <div className="flex-shrink-0 border-t border-gray-700 p-6 space-y-5 bg-gradient-to-t from-black to-gray-900 rounded-b-2xl">
                            <div className="flex justify-between items-center">
                                <span className="font-bold text-white text-lg">Total:</span>
                                <span className="font-bold text-2xl bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">${totalPrice.toFixed(2)}</span>
                            </div>
                            <div className="space-y-3">
                                <Link
                                    to="/checkout"
                                    onClick={closeCart}
                                    className={`w-full py-4 rounded-xl transition-all duration-300 font-bold transform shadow-lg inline-block text-center ${updating
                                        ? 'bg-gray-600 text-gray-300 cursor-not-allowed pointer-events-none'
                                        : 'bg-gradient-to-r from-white to-gray-200 text-black hover:from-gray-200 hover:to-white hover:scale-105'
                                        }`}
                                >
                                    {updating ? 'Updating...' : 'Checkout'}
                                </Link>
                                <div className="flex space-x-2">
                                    <Link
                                        to="/products"
                                        onClick={closeCart}
                                        className="flex-1 bg-white/10 hover:bg-white/20 text-white py-3 rounded-xl transition-all duration-300 font-medium border border-white/20 hover:border-white/30 backdrop-blur-sm inline-block text-center"
                                    >
                                        Continue Shopping
                                    </Link>
                                    <button
                                        onClick={handleClearCart}
                                        disabled={updating}
                                        className={`px-4 py-3 rounded-xl transition-all duration-300 font-medium border ${updating
                                            ? 'bg-gray-600 text-gray-300 border-gray-600 cursor-not-allowed'
                                            : 'bg-red-500/10 hover:bg-red-500/20 text-red-400 border-red-500/20 hover:border-red-500/30'
                                            }`}
                                        title="Clear Cart"
                                    >
                                        <BsTrash size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

        </>
    );
};

export default Cart;