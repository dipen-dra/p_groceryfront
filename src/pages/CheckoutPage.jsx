import React, { useState, useEffect, useContext } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate, useLocation } from 'react-router-dom';
import { CartContext } from '../context/CartContext.jsx';
import { AuthContext } from '../auth/AuthContext.jsx'; 
import { placeOrder } from '../services/userServices.js';
import { toast } from 'react-toastify';
import { Loader2, MapPin } from 'lucide-react';
import axios from 'axios';

const initiateEsewa = async (payload) => {
    const token = localStorage.getItem('token');
    const { data } = await axios.post('http://localhost:8081/api/payment/initiate-esewa', payload, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return data;
};

const CheckoutPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { cartItems, clearCart } = useContext(CartContext);
    const { loading: isLoadingAuth } = useContext(AuthContext);

    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [locationPlaceholder, setLocationPlaceholder] = useState('Enter your full delivery address...');
    const [isFetchingLocation, setIsFetchingLocation] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('cod');

    // This effect now only handles payment *failures* that are sent back here.
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        if (params.get('payment') === 'failure') {
            const message = decodeURIComponent(params.get('message') || 'Payment failed or was cancelled.');
            toast.error(message);
            // Important: remove the query params from the URL to prevent the toast on refresh
            navigate('/checkout', { replace: true });
        }
    }, [location.search, navigate]);

    const fetchAddressFromCoords = async (lat, lon) => {
        setIsFetchingLocation(true);
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
            const data = await response.json();
            if (data && data.display_name) {
                setAddress(data.display_name);
                setLocationPlaceholder("We've filled in your address based on your location.");
            } else {
                setLocationPlaceholder("Could not find address. Please enter it manually.");
            }
        } catch (error) {
            console.error("Error fetching address:", error);
            setLocationPlaceholder("Could not fetch address. Please enter it manually.");
        } finally {
            setIsFetchingLocation(false);
        }
    };

    const handleFetchLocation = () => {
        if (navigator.geolocation) {
            setIsFetchingLocation(true);
            navigator.geolocation.getCurrentPosition(
                (position) => { fetchAddressFromCoords(position.coords.latitude, position.coords.longitude); },
                (error) => {
                    toast.error("Geolocation failed.");
                    console.error("Geolocation error:", error);
                    setIsFetchingLocation(false);
                }
            );
        } else {
            toast.error("Geolocation is not supported by your browser.");
        }
    };

    const codOrderMutation = useMutation({
        mutationFn: placeOrder,
        onSuccess: () => {
            toast.success("Order placed successfully!");
            clearCart();
            navigate('/dashboard/orders');
        },
        onError: (error) => { toast.error(error.response?.data?.message || "Failed to place order."); }
    });

    const esewaMutation = useMutation({
        mutationFn: initiateEsewa,
        onSuccess: (data) => {
            const esewaForm = document.createElement('form');
            esewaForm.setAttribute('method', 'POST');
            esewaForm.setAttribute('action', data.esewaUrl);
            const { esewaUrl, ...params } = data;
            for (const key in params) {
                const hiddenField = document.createElement('input');
                hiddenField.setAttribute('type', 'hidden');
                hiddenField.setAttribute('name', key);
                hiddenField.setAttribute('value', params[key]);
                esewaForm.appendChild(hiddenField);
            }
            document.body.appendChild(esewaForm);
            esewaForm.submit();
        },
        onError: (error) => { toast.error(error.response?.data?.message || "Failed to initiate eSewa payment."); }
    });

    const handleConfirmOrder = (e) => {
        e.preventDefault();
        if (!address.trim()) { toast.error("Please enter your delivery address."); return; }
        if (!phone.trim()) { toast.error("Please enter your contact number."); return; }
        if (paymentMethod === 'cod') {
            const orderData = {
                items: cartItems.map(item => ({ productId: item._id, quantity: item.quantity })),
                address, phone, paymentMethod: 'COD'
            };
            codOrderMutation.mutate(orderData);
        } else if (paymentMethod === 'esewa') {
            const payload = { cartItems, address, phone };
            esewaMutation.mutate(payload);
        }
    };

    if (isLoadingAuth) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <Loader2 className="animate-spin text-green-500 h-12 w-12" />
            </div>
        );
    }

    if (cartItems.length === 0) {
        return (
            <div className="text-center p-12 bg-white rounded-lg shadow-sm">
                <h2 className="text-2xl font-semibold text-gray-800">Your cart is empty.</h2>
                <p className="text-gray-500 mt-2">Add items to your cart to proceed with checkout.</p>
            </div>
        );
    }

    const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const deliveryFee = 50;
    const finalAmount = totalAmount + deliveryFee;

    return (
        <div className="max-w-4xl mx-auto p-4">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Checkout</h1>
            <form onSubmit={handleConfirmOrder} className="flex flex-col lg:flex-row gap-8">
                <div className="flex-grow bg-white p-6 rounded-2xl shadow-lg space-y-4">
                    <h2 className="text-xl font-semibold border-b pb-3 mb-4">Delivery Information</h2>
                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
                        <input id="phone" type="tel" placeholder="e.g., 98xxxxxxxx" value={phone} onChange={(e) => setPhone(e.target.value)} required className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500" />
                    </div>
                    <div>
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Delivery Address</label>
                        <textarea id="address" placeholder={locationPlaceholder} value={address} onChange={(e) => setAddress(e.target.value)} required className="w-full p-3 border rounded-lg min-h-[120px] focus:ring-2 focus:ring-green-500" />
                        <button type="button" onClick={handleFetchLocation} disabled={isFetchingLocation || esewaMutation.isLoading} className="mt-2 flex items-center justify-center gap-2 text-sm text-green-600 font-semibold hover:text-green-800 disabled:opacity-50">
                            {isFetchingLocation ? <Loader2 size={16} className="animate-spin" /> : <MapPin size={16} />}
                            {isFetchingLocation ? 'Fetching...' : 'Use My Current Location'}
                        </button>
                    </div>
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
                            <h3 className="font-semibold text-center mb-3">Payment Method</h3>
                            <div className="space-y-3">
                                <div onClick={() => setPaymentMethod('cod')} className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all ${paymentMethod === 'cod' ? 'ring-2 ring-green-500 bg-green-50' : 'hover:bg-gray-50'}`}>
                                    <input type="radio" id="cod" name="paymentMethod" value="cod" checked={paymentMethod === 'cod'} readOnly className="h-4 w-4 text-green-600" />
                                    <label htmlFor="cod" className="ml-3 text-sm font-medium text-gray-700">Cash on Delivery</label>
                                </div>
                                <div onClick={() => setPaymentMethod('esewa')} className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-all ${paymentMethod === 'esewa' ? 'ring-2 ring-green-500 bg-green-50' : 'hover:bg-gray-50'}`}>
                                    <div className="flex items-center">
                                        <input type="radio" id="esewa" name="paymentMethod" value="esewa" checked={paymentMethod === 'esewa'} readOnly className="h-4 w-4 text-green-600" />
                                        <label htmlFor="esewa" className="ml-3 text-sm font-medium text-gray-700">Pay with eSewa</label>
                                    </div>
                                    <img src="/esewalogo.png" alt="eSewa" className="h-6" />
                                </div>
                            </div>
                        </div>

                        <button type="submit" disabled={codOrderMutation.isLoading || esewaMutation.isLoading} className="mt-6 w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition flex items-center justify-center disabled:bg-gray-400">
                            {(codOrderMutation.isLoading || esewaMutation.isLoading)
                                ? <Loader2 className="animate-spin" />
                                : 'Confirm Order'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default CheckoutPage;