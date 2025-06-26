import React, { useState, useContext, useRef, useEffect } from 'react';
import { Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import { Home, ShoppingCart, Package, User, LogOut, Menu, X, ChevronDown, AlertTriangle, CreditCard, Truck, Wallet, CheckCircle, XCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { AuthContext } from '../auth/AuthContext.jsx';
import { CartContext } from '../context/CartContext.jsx';
import { fetchCategories } from '../services/userServices.js';
import { SERVER_BASE_URL } from '../api/api.js';
import axios from 'axios';

// Import other pages
import ProductsPage from './ProductsPage.jsx';
// Assuming OrdersPage is now in its own file as well, for consistency
// import OrdersPage from './OrdersPage.jsx';
import ProfilePage from './ProfilePage.jsx';
import CartPage from './CartPage.jsx';
import CheckoutPage from './CheckoutPage.jsx';
import { Avatar } from '../components/Avatar';
import ShoppingList from '../components/ShoopingList.jsx'; 

// --- API Setup for User ---
const userApi = axios.create({
    baseURL: `${SERVER_BASE_URL}/api`,
    headers: { 'Content-Type': 'application/json' }
});

userApi.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

const fetchMyOrders = async () => {
    const { data } = await userApi.get('/orders/myorders');
    return data.orders;
};

const fetchPaymentHistory = async () => {
    const { data } = await userApi.get('/orders/payment-history');
    return data.history;
};

// --- OrdersPage Component ---
const OrdersPage = () => {
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
        return <div className="text-center p-12 text-gray-500">Loading your orders...</div>;
    }
    if (isError) {
        return <div className="text-center p-12 text-red-600 bg-red-50 rounded-lg">Error: {error.message}</div>;
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800">My Orders</h1>
            {orders && orders.length > 0 ? (
                <div className="space-y-6">
                    {orders.map(order => (
                        <div key={order._id} className="bg-white rounded-xl shadow-md overflow-hidden transition-shadow hover:shadow-lg">
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
                                <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                                    <CreditCard size={16} />
                                    <span>Payment Method: <span className="font-semibold">{order.paymentMethod}</span></span>
                                </div>
                                <h4 className="text-md font-semibold text-gray-700 mb-3">Items in this order:</h4>
                                <div className="space-y-3">
                                    {order.items.map((item, index) => (
                                        <div key={item.product || index} className="flex items-center gap-4">
                                            <img 
                                                src={item.imageUrl} 
                                                alt={item.name} 
                                                className="w-16 h-16 object-cover rounded-md flex-shrink-0 bg-gray-100"
                                                onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/100x100/CCCCCC/FFFFFF?text=Img'; }}
                                            />
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
                <div className="text-center p-10 bg-white rounded-lg shadow-md">
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

// --- New PaymentsPage Component ---
const PaymentsPage = () => {
    const { data: history, isLoading, isError, error } = useQuery({
        queryKey: ['paymentHistory'],
        queryFn: fetchPaymentHistory,
    });

    const PaymentStatusBadge = ({ status }) => {
        const isSuccess = status !== 'Pending Payment';
        const bgColor = isSuccess ? 'bg-green-100' : 'bg-orange-100';
        const textColor = isSuccess ? 'text-green-800' : 'text-orange-800';
        const Icon = isSuccess ? CheckCircle : XCircle;
        const text = isSuccess ? 'Successful' : 'Incomplete';

        return (
            <div className={`px-3 py-1.5 text-sm font-semibold rounded-full flex items-center justify-center gap-2 ${bgColor} ${textColor}`}>
                <Icon size={16} />
                <span>{text}</span>
            </div>
        );
    };

    if (isLoading) return <div className="text-center p-12 text-gray-500">Loading payment history...</div>;
    if (isError) return <div className="text-center p-12 text-red-600 bg-red-50 rounded-lg">Error: {error.message}</div>;

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800">My Payments</h1>
            {history && history.length > 0 ? (
                 <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="text-sm text-gray-500 uppercase bg-gray-50">
                                <tr>
                                    <th className="p-4">Date</th>
                                    <th className="p-4">Transaction / Order ID</th>
                                    <th className="p-4">Payment Method</th>
                                    <th className="p-4 text-right">Amount</th>
                                    <th className="p-4 text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {history.map(item => (
                                    <tr key={item._id} className="border-b border-gray-200">
                                        <td className="p-4 text-gray-600">{new Date(item.createdAt).toLocaleDateString()}</td>
                                        <td className="p-4 font-mono text-gray-800">#{item._id.slice(-8)}</td>
                                        <td className="p-4 text-gray-600">{item.paymentMethod}</td>
                                        <td className="p-4 text-right font-semibold">₹{item.amount.toFixed(2)}</td>
                                        <td className="p-4">
                                            <div className="flex justify-center">
                                                <PaymentStatusBadge status={item.status} />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="text-center p-10 bg-white rounded-lg shadow-md">
                    <Wallet size={48} className="mx-auto text-gray-400" />
                    <h3 className="mt-4 text-xl font-semibold text-gray-800">No Payment History</h3>
                    <p className="mt-2 text-gray-500">All your transactions, both complete and incomplete, will appear here.</p>
                </div>
            )}
        </div>
    );
};


// --- Reusable Components ---
const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-md m-4">{children}</div>
    </div>
  );
};

const Button = ({ children, onClick, className = '', variant = 'primary', disabled = false }) => {
  const base = "px-4 py-2 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2";
  const variants = {
    primary: "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-500",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500"
  };
  return (
    <button onClick={onClick} className={`${base} ${variants[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`} disabled={disabled}>
      {children}
    </button>
  );
};

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="text-center p-6">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
          <AlertTriangle className="h-6 w-6 text-red-600" />
        </div>
        <h3 className="mt-5 text-lg font-medium text-gray-900">{title}</h3>
        <div className="mt-2 px-7 py-3">
          <p className="text-sm text-gray-500">{message}</p>
        </div>
        <div className="flex justify-center gap-3 mt-4">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button variant="danger" onClick={onConfirm}>Logout</Button>
        </div>
      </div>
    </Modal>
  );
};

// --- Main UserDashboard Component ---
const UserDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLogoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const profileRef = useRef(null);
  const location = useLocation();
  const isShopPage = location.pathname.endsWith('/dashboard/shop') || location.pathname.endsWith('/dashboard');

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    setLogoutConfirmOpen(false);
    logout();
  };

  const NavLink = ({ to, icon: Icon, children }) => (
    <Link
      to={to}
      onClick={() => setIsSidebarOpen(false)}
      className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-colors duration-200 ${location.pathname.startsWith(to) ? 'bg-green-600 text-white font-semibold' : 'text-gray-600 hover:bg-green-50'}`}
    >
      <Icon size={22} />
      <span>{children}</span>
    </Link>
  );

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white">
      <div className="p-4 flex items-center justify-between border-b">
        <Link to="/dashboard/shop" className="flex items-center gap-2">
          <img src="/hamro.png" alt="Hamro Grocery" className="h-19 w-auto" />
        </Link>
        <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-gray-500">
          <X size={24} />
        </button>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2">
        <NavLink to="/dashboard/shop" icon={Home}>Shop</NavLink>
        <NavLink to="/dashboard/orders" icon={Package}>My Orders</NavLink>
        <NavLink to="/dashboard/payments" icon={Wallet}>My Payments</NavLink>
        <NavLink to="/dashboard/profile" icon={User}>My Profile</NavLink>
      </nav>
      <div className="p-4 border-t">
        <button onClick={() => setLogoutConfirmOpen(true)} className="w-full flex items-center gap-4 px-4 py-3 rounded-lg text-gray-700 hover:bg-red-100">
          <LogOut size={22} /> <span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 shadow-md hidden lg:flex flex-col">
        <SidebarContent />
      </aside>
      <div className={`fixed inset-0 z-40 flex lg:hidden transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="w-72 shadow-lg">
          <SidebarContent />
        </div>
        <div className="flex-1 bg-black bg-opacity-50" onClick={() => setIsSidebarOpen(false)} />
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white p-4 flex justify-between items-center z-20 border-b-2 border-green-200">
          <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden text-gray-600">
            <Menu size={28} />
          </button>
          <div />
          <div className="flex items-center gap-4 sm:gap-6">
            <Link to="/dashboard/cart" className="relative p-2 rounded-full hover:bg-gray-100">
              <ShoppingCart size={24} className="text-gray-700" />
              <CartIndicator />
            </Link>
            <div className="relative" ref={profileRef}>
              <button onClick={() => setIsProfileOpen(o => !o)} className="flex items-center gap-2">
                <Avatar user={user} size={36} />
                <span className="hidden md:block font-medium">{user?.fullName}</span>
                <ChevronDown size={20} className={`transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
              </button>
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20">
                  <Link to="/dashboard/profile" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <User size={16} /> My Profile
                  </Link>
                  <button onClick={() => setLogoutConfirmOpen(true)} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {isShopPage && <CategoryNavbar selectedCategory={selectedCategory} onCategoryChange={setSelectedCategory} />}

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4 sm:p-6 md:p-8">
          <Routes>
            <Route path="shop" element={<ProductsPage selectedCategory={selectedCategory} />} />
            <Route path="orders" element={<OrdersPage />} />
            <Route path="payments" element={<PaymentsPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="cart" element={<CartPage />} />
            <Route path="checkout" element={<CheckoutPage />} />
            <Route path="*" element={<Navigate to="shop" replace />} />
          </Routes>
        </main>
        
        {isShopPage && <ShoppingList />}

      </div>
      <ConfirmationModal
        isOpen={isLogoutConfirmOpen}
        onClose={() => setLogoutConfirmOpen(false)}
        onConfirm={handleLogout}
        title="Confirm Logout"
        message="Are you sure you want to log out of your account?"
      />
    </div>
  );
};

const CartIndicator = () => {
  const { cartItems } = useContext(CartContext);
  const itemCount = cartItems ? cartItems.reduce((sum, item) => sum + item.quantity, 0) : 0;
  if (itemCount === 0) return null;
  return <span className="absolute -top-1 -right-1 flex items-center justify-center h-5 w-5 rounded-full bg-green-600 text-white text-xs font-bold">{itemCount}</span>;
};

const CategoryNavbar = ({ selectedCategory, onCategoryChange }) => {
  const { data: categories, isLoading } = useQuery({ queryKey: ['categories'], queryFn: fetchCategories });
  const CategoryButton = ({ id, name }) => (
    <button
      onClick={() => onCategoryChange(id)}
      className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors whitespace-nowrap mx-1.5 flex-shrink-0 ${selectedCategory === id ? 'bg-green-600 text-white shadow' : 'bg-white text-gray-700 hover:bg-gray-200'}`}
    >
      {name}
    </button>
  );

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-10 border-b-2 border-green-200">
      <div className="flex items-center justify-center px-2 sm:px-4 md:px-6 py-3 overflow-x-auto">
        {isLoading ? (
          <p className="text-sm text-gray-500 px-4">Loading categories...</p>
        ) : (
          <>
            <CategoryButton id="all" name="All" />
            {categories?.map((cat) => <CategoryButton key={cat._id} id={cat._id} name={cat.name} />)}
          </>
        )}
      </div>
    </nav>
  );
};

export default UserDashboard;