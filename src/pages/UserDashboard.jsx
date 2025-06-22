
// import React, { useState, useContext, useRef, useEffect } from 'react';
// import { Routes, Route, Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
// import { Home, ShoppingCart, Package, User, LogOut, Menu, X, ChevronDown } from 'lucide-react';
// import { useQuery } from '@tanstack/react-query';

// // FIX: Added the missing import statements below
// import { AuthContext } from '../auth/AuthContext.jsx';
// import { CartContext } from '../context/CartContext.jsx';
// import { fetchCategories } from '../services/userServices.js';

// // Import all the dashboard pages
// import ProductsPage from './ProductsPage.jsx';
// import OrdersPage from './OrderPage.jsx';
// import ProfilePage from './ProfilePage.jsx';
// import CartPage from './CartPage.jsx';
// import CheckoutPage from './CheckoutPage.jsx';

// const UserDashboard = () => {
//     const { user, logout } = useContext(AuthContext);
//     const navigate = useNavigate();
//     const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//     const [isProfileOpen, setIsProfileOpen] = useState(false);
//     const [selectedCategory, setSelectedCategory] = useState('all');
//     const profileRef = useRef(null);
//     const location = useLocation();
//     const isShopPage = location.pathname.endsWith('/shop');

//     useEffect(() => {
//         const handleClickOutside = (event) => {
//             if (profileRef.current && !profileRef.current.contains(event.target)) {
//                 setIsProfileOpen(false);
//             }
//         };
//         document.addEventListener('mousedown', handleClickOutside);
//         return () => document.removeEventListener('mousedown', handleClickOutside);
//     }, []);

//     const NavLink = ({ to, icon: Icon, children }) => (
//         <Link to={to} onClick={() => setIsSidebarOpen(false)} className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-colors duration-200 ${location.pathname.startsWith(to) ? 'bg-green-600 text-white font-semibold' : 'text-gray-600 hover:bg-green-50'}`}>
//             <Icon size={22} />
//             <span>{children}</span>
//         </Link>
//     );

//     const SidebarContent = () => (
//         <div className="flex flex-col h-full bg-white">
//             <div className="p-4 flex items-center justify-between border-b">
//                 <Link to="/dashboard/shop" className="flex items-center gap-2">
//                     <img src="/hamro.png" alt="Hamro Grocery" className="h-19 w-auto" />
//                     <span className="font-bold text-xl text-gray-800"></span>
//                 </Link>
//                 <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-gray-500"><X size={24} /></button>
//             </div>
//             <nav className="flex-1 px-4 py-6 space-y-2">
//                 <NavLink to="/dashboard/shop" icon={Home}>Shop</NavLink>
//                 <NavLink to="/dashboard/orders" icon={Package}>My Orders</NavLink>
//                 <NavLink to="/dashboard/profile" icon={User}>My Profile</NavLink>
//             </nav>
//             <div className="p-4 border-t">
//                  <button onClick={() => logout()} className="w-full flex items-center gap-4 px-4 py-3 rounded-lg text-gray-700 hover:bg-red-100">
//                     <LogOut size={22} /><span>Logout</span>
//                 </button>
//             </div>
//         </div>
//     );

//     return (
//         <div className="flex h-screen bg-gray-100">
//             {/* Sidebar */}
//             <aside className="w-64 shadow-md hidden lg:flex flex-col"><SidebarContent /></aside>
//             <div className={`fixed inset-0 z-40 flex lg:hidden transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
//                 <div className="w-72 shadow-lg"><SidebarContent /></div>
//                 <div className="flex-1 bg-black bg-opacity-50" onClick={() => setIsSidebarOpen(false)}></div>
//             </div>

//             <div className="flex-1 flex flex-col overflow-hidden">
//                 {/* Top Navbar */}
//                 <header className="bg-white p-4 flex justify-between items-center z-20 border-b-2 border-green-200">
//                     <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden text-gray-600"><Menu size={28} /></button>
//                     <div/>
//                     <div className="flex items-center gap-4 sm:gap-6">
//                         <Link to="/dashboard/cart" className="relative p-2 rounded-full hover:bg-gray-100">
//                             <ShoppingCart size={24} className="text-gray-700" />
//                             <CartIndicator />
//                         </Link>
//                         <div className="relative" ref={profileRef}>
//                             <button onClick={() => setIsProfileOpen(o => !o)} className="flex items-center gap-2">
//                                 <img src={`https://ui-avatars.com/api/?name=${user?.fullName || 'U'}&background=0D8ABC&color=fff`} alt="avatar" className="w-9 h-9 rounded-full" />
//                                 <span className="hidden md:block font-medium">{user?.fullName}</span>
//                                 <ChevronDown size={20} className={`transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
//                             </button>
//                             {isProfileOpen && (
//                                 <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20">
//                                     <Link to="/dashboard/profile" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"><User size={16} /> My Profile</Link>
//                                     <button onClick={() => logout()} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"><LogOut size={16} /> Logout</button>
//                                 </div>
//                             )}
//                         </div>
//                     </div>
//                 </header>

//                 {isShopPage && <CategoryNavbar selectedCategory={selectedCategory} onCategoryChange={setSelectedCategory} />}

//                 <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4 sm:p-6 md:p-8">
//                     <Routes>
//                         <Route path="shop" element={<ProductsPage selectedCategory={selectedCategory} />} />
//                         <Route path="orders" element={<OrdersPage />} />
//                         <Route path="profile" element={<ProfilePage />} />
//                         <Route path="cart" element={<CartPage />} />
//                         <Route path="checkout" element={<CheckoutPage />} />
//                         <Route path="*" element={<Navigate to="shop" replace />} />
//                     </Routes>
//                 </main>
//             </div>
//         </div>
//     );
// };

// const CartIndicator = () => {
//     const { cartItems } = useContext(CartContext);
//     const itemCount = cartItems ? cartItems.reduce((sum, item) => sum + item.quantity, 0) : 0;
//     if (itemCount === 0) return null;
//     return <span className="absolute -top-1 -right-1 flex items-center justify-center h-5 w-5 rounded-full bg-green-600 text-white text-xs font-bold">{itemCount}</span>;
// };

// const CategoryNavbar = ({ selectedCategory, onCategoryChange }) => {
//     const { data: categories, isLoading } = useQuery({ queryKey: ['categories'], queryFn: fetchCategories });
//     const CategoryButton = ({ id, name }) => (
//         <button onClick={() => onCategoryChange(id)} className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors whitespace-nowrap mx-1.5 flex-shrink-0 ${selectedCategory === id ? 'bg-green-600 text-white shadow' : 'bg-white text-gray-700 hover:bg-gray-200'}`}>
//             {name}
//         </button>
//     );

//     return (
//         <nav className="bg-white shadow-sm sticky top-0 z-10 border-b-2 border-green-200">
//             <div className="flex items-center justify-center px-2 sm:px-4 md:px-6 py-3 overflow-x-auto">
//                 {isLoading ? <p className="text-sm text-gray-500 px-4">Loading categories...</p> : <>
//                     <CategoryButton id="all" name="All" />
//                     {categories?.map(cat => <CategoryButton key={cat._id} id={cat._id} name={cat.name} />)}
//                 </>}
//             </div>
//         </nav>
//     );
// };

// export default UserDashboard;



import React, { useState, useContext, useRef, useEffect } from 'react';
import { Routes, Route, Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Home, ShoppingCart, Package, User, LogOut, Menu, X, ChevronDown, AlertTriangle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

// FIX: Added the missing import statements below
import { AuthContext } from '../auth/AuthContext.jsx';
import { CartContext } from '../context/CartContext.jsx';
import { fetchCategories } from '../services/userServices.js';

// Import all the dashboard pages
import ProductsPage from './ProductsPage.jsx';
import OrdersPage from './OrderPage.jsx';
import ProfilePage from './ProfilePage.jsx';
import CartPage from './CartPage.jsx';
import CheckoutPage from './CheckoutPage.jsx';

// --- Reusable Modal Components ---

const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-md m-4">
                {children}
            </div>
        </div>
    );
};

const Button = ({ children, onClick, className = '', variant = 'primary', disabled = false }) => {
    const baseClasses = "px-4 py-2 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2";
    const variants = {
        primary: "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500",
        secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-500",
        danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500"
    };
    return <button onClick={onClick} className={`${baseClasses} ${variants[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`} disabled={disabled}>{children}</button>;
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


// --- Main Dashboard Component ---

const UserDashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isLogoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const profileRef = useRef(null);
    const location = useLocation();
    const isShopPage = location.pathname.endsWith('/shop');

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
        <Link to={to} onClick={() => setIsSidebarOpen(false)} className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-colors duration-200 ${location.pathname.startsWith(to) ? 'bg-green-600 text-white font-semibold' : 'text-gray-600 hover:bg-green-50'}`}>
            <Icon size={22} />
            <span>{children}</span>
        </Link>
    );

    const SidebarContent = () => (
        <div className="flex flex-col h-full bg-white">
            <div className="p-4 flex items-center justify-between border-b">
                <Link to="/dashboard/shop" className="flex items-center gap-2">
                    <img src="/hamro.png" alt="Hamro Grocery" className="h-19 w-auto" />
                    <span className="font-bold text-xl text-gray-800"></span>
                </Link>
                <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-gray-500"><X size={24} /></button>
            </div>
            <nav className="flex-1 px-4 py-6 space-y-2">
                <NavLink to="/dashboard/shop" icon={Home}>Shop</NavLink>
                <NavLink to="/dashboard/orders" icon={Package}>My Orders</NavLink>
                <NavLink to="/dashboard/profile" icon={User}>My Profile</NavLink>
            </nav>
            <div className="p-4 border-t">
                 <button onClick={() => setLogoutConfirmOpen(true)} className="w-full flex items-center gap-4 px-4 py-3 rounded-lg text-gray-700 hover:bg-red-100">
                    <LogOut size={22} /><span>Logout</span>
                </button>
            </div>
        </div>
    );

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 shadow-md hidden lg:flex flex-col"><SidebarContent /></aside>
            <div className={`fixed inset-0 z-40 flex lg:hidden transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="w-72 shadow-lg"><SidebarContent /></div>
                <div className="flex-1 bg-black bg-opacity-50" onClick={() => setIsSidebarOpen(false)}></div>
            </div>

            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top Navbar */}
                <header className="bg-white p-4 flex justify-between items-center z-20 border-b-2 border-green-200">
                    <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden text-gray-600"><Menu size={28} /></button>
                    <div/>
                    <div className="flex items-center gap-4 sm:gap-6">
                        <Link to="/dashboard/cart" className="relative p-2 rounded-full hover:bg-gray-100">
                            <ShoppingCart size={24} className="text-gray-700" />
                            <CartIndicator />
                        </Link>
                        <div className="relative" ref={profileRef}>
                            <button onClick={() => setIsProfileOpen(o => !o)} className="flex items-center gap-2">
                                <img src={`https://ui-avatars.com/api/?name=${user?.fullName || 'U'}&background=0D8ABC&color=fff`} alt="avatar" className="w-9 h-9 rounded-full" />
                                <span className="hidden md:block font-medium">{user?.fullName}</span>
                                <ChevronDown size={20} className={`transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                            </button>
                            {isProfileOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20">
                                    <Link to="/dashboard/profile" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"><User size={16} /> My Profile</Link>
                                    <button onClick={() => setLogoutConfirmOpen(true)} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"><LogOut size={16} /> Logout</button>
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
                        <Route path="profile" element={<ProfilePage />} />
                        <Route path="cart" element={<CartPage />} />
                        <Route path="checkout" element={<CheckoutPage />} />
                        <Route path="*" element={<Navigate to="shop" replace />} />
                    </Routes>
                </main>
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
        <button onClick={() => onCategoryChange(id)} className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors whitespace-nowrap mx-1.5 flex-shrink-0 ${selectedCategory === id ? 'bg-green-600 text-white shadow' : 'bg-white text-gray-700 hover:bg-gray-200'}`}>
            {name}
        </button>
    );

    return (
        <nav className="bg-white shadow-sm sticky top-0 z-10 border-b-2 border-green-200">
            <div className="flex items-center justify-center px-2 sm:px-4 md:px-6 py-3 overflow-x-auto">
                {isLoading ? <p className="text-sm text-gray-500 px-4">Loading categories...</p> : <>
                    <CategoryButton id="all" name="All" />
                    {categories?.map(cat => <CategoryButton key={cat._id} id={cat._id} name={cat.name} />)}
                </>}
            </div>
        </nav>
    );
};

export default UserDashboard;