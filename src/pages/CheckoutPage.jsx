import React, { useState, useContext } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext.jsx';
import { placeOrder } from '../services/userServices.js';
import { toast } from 'react-toastify';
import { Loader2 } from 'lucide-react';

const CheckoutPage = () => {
    const navigate = useNavigate();
    const { cartItems, clearCart } = useContext(CartContext);
    const [location, setLocation] = useState('');

    const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const deliveryFee = 50;
    const finalAmount = totalAmount + deliveryFee;

    const orderMutation = useMutation({
        mutationFn: placeOrder,
        onSuccess: () => {
            toast.success("Order placed successfully!");
            clearCart();
            navigate('/dashboard/orders');
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Failed to place order.");
        }
    });

    const handleConfirmOrder = (e) => {
        e.preventDefault();
        if (!location.trim()) {
            toast.error("Please enter your delivery location.");
            return;
        }

        const orderData = {
            items: cartItems.map(item => ({
                productId: item._id,
                quantity: item.quantity
            })),
            address: location
        };
        orderMutation.mutate(orderData);
    };

    if (cartItems.length === 0) {
        return (
             <div className="text-center p-12 bg-white rounded-lg shadow-sm">
                <h2 className="text-2xl font-semibold text-gray-800">Your cart is empty. Nothing to checkout.</h2>
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Checkout</h1>
            <form onSubmit={handleConfirmOrder} className="flex flex-col lg:flex-row gap-8">
                <div className="flex-grow bg-white p-6 rounded-2xl shadow-lg space-y-4">
                    <h2 className="text-xl font-semibold border-b pb-3 mb-4">Delivery Information</h2>
                    <p className="text-sm text-gray-500">Enter your area and a contact number for delivery (e.g., Besisahar, Lamjung, 98xxxxxxxx).</p>
                    <textarea
                        name="location"
                        placeholder="Enter your full delivery location and contact number here..."
                        onChange={(e) => setLocation(e.target.value)}
                        required
                        className="w-full p-3 border rounded-lg min-h-[120px] focus:ring-2 focus:ring-green-500"
                    />
                </div>
                <div className="w-full lg:w-80 flex-shrink-0">
                    <div className="bg-white p-6 rounded-2xl shadow-lg">
                        <h2 className="text-xl font-semibold border-b pb-3 mb-4">Final Confirmation</h2>
                        <div className="space-y-2">
                            <div className="flex justify-between"><span>Items Total</span><span>₹{totalAmount.toFixed(2)}</span></div>
                            <div className="flex justify-between"><span>Delivery Fee</span><span>₹{deliveryFee.toFixed(2)}</span></div>
                            <div className="flex justify-between font-bold text-lg border-t pt-4 mt-2"><span>Grand Total</span><span>₹{finalAmount.toFixed(2)}</span></div>
                        </div>
                         <div className="mt-6 border-t pt-4">
                             <h3 className="font-semibold text-center">Payment Method</h3>
                             <p className="text-center text-gray-500 text-sm mt-1 bg-gray-100 p-2 rounded-lg">Cash on Delivery (COD)</p>
                         </div>
                        <button
                            type="submit"
                            disabled={orderMutation.isLoading}
                            className="mt-4 w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition flex items-center justify-center disabled:bg-gray-400"
                        >
                            {orderMutation.isLoading ? <Loader2 className="animate-spin" /> : 'Confirm Order'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default CheckoutPage;