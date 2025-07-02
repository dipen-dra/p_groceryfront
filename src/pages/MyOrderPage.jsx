import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Loader2, AlertTriangle, Package, Truck, CreditCard } from 'lucide-react';
import { SERVER_BASE_URL } from '../api/api.js';

const userApi = axios.create({ baseURL: `${SERVER_BASE_URL}/api` });
userApi.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

const fetchMyOrders = async () => {
    const { data } = await userApi.get('/orders/myorders');
    return data.orders;
};

export const MyOrdersPage = () => {
    const { data: orders, isLoading, isError, error } = useQuery({ 
        queryKey: ['myOrders'], 
        queryFn: fetchMyOrders 
    });

    const getStatusColor = (status) => {
        switch (status) {
            case 'Delivered': return 'bg-green-100 text-green-800';
            case 'Shipped': return 'bg-yellow-100 text-yellow-800';
            case 'Pending': return 'bg-blue-100 text-blue-800';
            case 'Cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    if (isLoading) {
        return <div className="flex justify-center items-center py-12"><Loader2 className="animate-spin text-green-600" size={32} /></div>;
    }
    if (isError) {
        return <div className="flex flex-col items-center justify-center py-12 text-red-600 bg-red-50 rounded-lg">
            <AlertTriangle size={32} />
            <p className="mt-2 font-semibold">Error: {error.message}</p>
        </div>;
    }

    return (
        <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-800">My Orders</h3>
            {orders && orders.length > 0 ? (
                <div className="space-y-6">
                    {orders.map(order => (
                        <div key={order._id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                            <div className="p-4 bg-gray-50 border-b flex flex-wrap justify-between items-center gap-x-6 gap-y-4">
                                <div>
                                    <p className="text-sm text-gray-500">Order ID</p>
                                    <p className="font-mono font-semibold text-gray-800">#{order._id.slice(-8)}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Date Placed</p>
                                    <p className="font-semibold text-gray-800">{new Date(order.createdAt).toLocaleDateString()}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Total</p>
                                    <p className="font-semibold text-gray-800">₹{order.amount.toFixed(2)}</p>
                                </div>
                                <div className={`px-3 py-1.5 text-sm font-semibold rounded-full flex items-center gap-2 ${getStatusColor(order.status)}`}>
                                    <Truck size={16} />
                                    {order.status}
                                </div>
                            </div>
                            <div className="p-5">
                                <h4 className="text-md font-semibold text-gray-700 mb-3">Items:</h4>
                                <div className="space-y-3">
                                    {order.items.map((item, index) => (
                                        <div key={item.product || index} className="flex items-center gap-4">
                                            <img src={item.imageUrl} alt={item.name} className="w-16 h-16 object-cover rounded-md flex-shrink-0 bg-gray-100" />
                                            <div className="flex-grow">
                                                <p className="font-semibold text-gray-800">{item.name}</p>
                                                <p className="text-sm text-gray-500">Qty: {item.quantity} × ₹{item.price.toFixed(2)}</p>
                                            </div>
                                            <p className="font-medium text-gray-700">₹{(item.price * item.quantity).toFixed(2)}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center p-10 border-2 border-dashed border-gray-300 rounded-lg">
                    <Package size={48} className="mx-auto text-gray-400" />
                    <h3 className="mt-4 text-xl font-semibold text-gray-800">No Orders Yet</h3>
                    <p className="mt-2 text-gray-500">You haven't placed any orders. Start shopping to see them here!</p>
                    <Link to="/dashboard/shop" className="mt-6 inline-block bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">
                        Go to Shop
                    </Link>
                </div>
            )}
        </div>
    );
};