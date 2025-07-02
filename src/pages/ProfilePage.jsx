// // import React, { useContext, useState, useEffect, useCallback } from 'react';
// import { AuthContext } from '../auth/AuthContext.jsx';
// import { useMutation, useQueryClient } from '@tanstack/react-query';
// import { toast } from 'react-toastify';
// import { Avatar } from '../components/Avatar';
// import { Loader2, Edit, X, Save, Edit2, User, Mail, ShoppingCart, Wallet, MapPin, Gift } from 'lucide-react';
// import axios from 'axios';
// import { MyOrdersPage } from './MyOrderPage.jsx';
// import { PaymentHistoryPage } from './PaymentHistory.jsx';
// import { useCallback, useContext, useState,useEffect } from 'react';

// const SERVER_BASE_URL = "http://localhost:8081";

// // API Functions
// const updateUserProfile = async (userData) => {
//     const token = localStorage.getItem('token');
//     const { data } = await axios.put(`${SERVER_BASE_URL}/api/auth/profile`, userData, { headers: { Authorization: `Bearer ${token}` } });
//     return data;
// };

// const updateUserProfilePicture = async (formData) => {
//     const token = localStorage.getItem('token');
//     const { data } = await axios.put(`${SERVER_BASE_URL}/api/auth/profile/picture`, formData, { headers: { Authorization: `Bearer ${token}` } });
//     return data;
// };

// // Reusable UI Components
// const ProfileInputField = ({ name, value, onChange, label, type = "text" }) => (
//     <div>
//        <label htmlFor={name} className="text-sm font-medium text-gray-700">{label}</label>
//        <input id={name} name={name} type={type} value={value} onChange={onChange} className="mt-1 w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-green-500 transition"/>
//    </div>
// );

// const ProfileInfoField = ({ icon: Icon, label, value, isPlaceholder = false }) => (
//    <div>
//        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{label}</label>
//        <div className="flex items-center gap-3 mt-1">
//            <Icon className="text-gray-400" size={20} />
//            <p className={`text-base ${isPlaceholder ? 'text-gray-400 italic' : 'text-gray-800'}`}>{value || 'Not set'}</p>
//        </div>
//    </div>
// );

// // Main Component
// const ProfilePage = () => {
//     const { user, updateUser } = useContext(AuthContext);
//     const queryClient = useQueryClient();
    
//     const [activeTab, setActiveTab] = useState('profile');
//     const [isEditMode, setIsEditMode] = useState(false);
//     const [formData, setFormData] = useState({ fullName: '', email: '', location: '' });

//     const points = user?.groceryPoints || 0;
//     const progressPercentage = Math.min((points / 150) * 100, 100);

//     const resetFormData = useCallback(() => {
//         if (user) setFormData({ fullName: user.fullName || '', email: user.email || '', location: user.location || '' });
//     }, [user]);

//     useEffect(() => { resetFormData(); }, [user, resetFormData]);

//     const profileUpdateMutation = useMutation({
//         mutationFn: updateUserProfile,
//         onSuccess: (data) => {
//             updateUser(data.data);
//             toast.success('Profile updated successfully!');
//             setIsEditMode(false);
//         },
//         onError: (error) => toast.error(error.response?.data?.message || 'Failed to update profile.')
//     });
    
//     const pictureUpdateMutation = useMutation({
//         mutationFn: updateUserProfilePicture,
//         onSuccess: (data) => {
//             updateUser(data.data);
//             toast.success('Profile picture updated successfully!');
//         },
//         onError: (error) => toast.error(error.response?.data?.message || 'Failed to update picture.')
//     });

//     const handleInputChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
//     const handleFormSubmit = (e) => { e.preventDefault(); profileUpdateMutation.mutate(formData); };
//     const handleImageChange = (e) => {
//         const file = e.target.files[0];
//         if (!file) return;
//         const pictureFormData = new FormData();
//         pictureFormData.append('profilePicture', file);
//         pictureUpdateMutation.mutate(pictureFormData);
//     };

//     const TabButton = ({ tabName, icon: Icon, label }) => (
//         <button onClick={() => setActiveTab(tabName)} className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-lg transition-all ${activeTab === tabName ? 'bg-green-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}>
//             <Icon size={18} /> {label}
//         </button>
//     );

//     if (!user) return <div className="flex justify-center items-center h-full"><Loader2 className="animate-spin text-green-600" size={48}/></div>;

//     return (
//         <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
//             <div className="p-6 md:p-8 border-b">
//                 <div className="flex flex-col sm:flex-row items-center gap-6">
//                     <div className="relative group w-24 h-24 flex-shrink-0">
//                         <Avatar user={user} size={96} className="rounded-full border-4 border-white shadow-md" />
//                         <label className="absolute inset-0 flex items-center justify-center bg-black/50 text-white rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
//                             <Edit2 size={20} />
//                             <input type="file" onChange={handleImageChange} className="hidden" accept="image/*" disabled={pictureUpdateMutation.isLoading} />
//                         </label>
//                     </div>
//                     <div className="text-center sm:text-left">
//                         <h2 className="text-2xl font-bold text-gray-900">{user.fullName}</h2>
//                         <p className="text-gray-500">{user.email}</p>
//                     </div>
//                 </div>
//             </div>
            
//             <div className="p-6 md:p-8 border-b">
//                 <div className="flex items-center gap-4">
//                     <Gift className="text-green-500" size={32} />
//                     <div>
//                         <h3 className="text-lg font-bold text-gray-800">Grocery Points</h3>
//                         <p className="text-3xl font-bold text-green-600">{points}</p>
//                     </div>
//                 </div>
//                 <div className="mt-4">
//                     <div className="w-full bg-gray-200 rounded-full h-2.5">
//                         <div className="bg-green-500 h-2.5 rounded-full transition-all duration-500" style={{ width: `${progressPercentage}%` }}></div>
//                     </div>
//                     <p className="text-xs text-gray-500 mt-2 text-right">
//                         {points < 150 ? `${150 - points} points until your next 25% discount!` : "You have a 25% discount available!"}
//                     </p>
//                 </div>
//             </div>

//             <div className="p-4 sm:p-6 border-b bg-gray-50">
//                 <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto">
//                     <TabButton tabName="profile" icon={User} label="Profile" />
//                     <TabButton tabName="orders" icon={ShoppingCart} label="Orders" />
//                     <TabButton tabName="payments" icon={Wallet} label="Payments" />
//                 </div>
//             </div>

//             <div className="p-6 md:p-8">
//                 {activeTab === 'profile' && (
//                     <div>
//                         <div className="flex justify-between items-center mb-6">
//                             <h3 className="text-xl font-bold text-gray-800">Personal Information</h3>
//                             {!isEditMode && (<button onClick={() => setIsEditMode(true)} className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"><Edit size={14} /> Edit</button>)}
//                         </div>
//                         <form onSubmit={handleFormSubmit} className="space-y-6">
//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                                 {isEditMode ? (
//                                     <>
//                                         <ProfileInputField name="fullName" label="Full Name" value={formData.fullName} onChange={handleInputChange} />
//                                         <ProfileInputField name="email" label="Email Address" type="email" value={formData.email} onChange={handleInputChange} />
//                                     </>
//                                 ) : (
//                                     <>
//                                         <ProfileInfoField icon={User} label="Full Name" value={user.fullName} />
//                                         <ProfileInfoField icon={Mail} label="Email Address" value={user.email} />
//                                     </>
//                                 )}
//                             </div>
//                             {isEditMode && (
//                                 <div className="flex justify-end gap-4 pt-4 border-t mt-6">
//                                     <button type="button" onClick={() => setIsEditMode(false)} className="px-5 py-2.5 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition">Cancel</button>
//                                     <button type="submit" disabled={profileUpdateMutation.isLoading} className="flex items-center justify-center gap-2 px-5 py-2.5 bg-green-600 text-white font-semibold rounded-lg shadow-sm hover:bg-green-700 transition disabled:opacity-50">
//                                         {profileUpdateMutation.isLoading ? <Loader2 className="animate-spin" /> : <><Save size={16} /> Save Changes</>}
//                                     </button>
//                                 </div>
//                             )}
//                         </form>
//                     </div>
//                 )}
//                 {activeTab === 'orders' && <MyOrdersPage />}
//                 {activeTab === 'payments' && <PaymentHistoryPage />}
//             </div>
//         </div>
//     );
// };

// export default ProfilePage;




// // All necessary imports
// import React, { useContext, useState, useCallback, useEffect } from 'react';
// import { AuthContext } from '../auth/AuthContext.jsx';
// import { useMutation, useQueryClient } from '@tanstack/react-query';
// import { toast } from 'react-toastify';
// import { Avatar } from '../components/Avatar';
// import { Loader2, Edit, Save, Edit2, User, Mail, ShoppingCart, Wallet, MapPin, Gift } from 'lucide-react';
// import axios from 'axios';
// import { MyOrdersPage } from './MyOrderPage.jsx';
// import { PaymentHistoryPage } from './PaymentHistory.jsx';

// const SERVER_BASE_URL = "http://localhost:8081";

// // API functions
// const updateUserProfile = async (userData) => {
//     const token = localStorage.getItem('token');
//     const { data } = await axios.put(`${SERVER_BASE_URL}/api/auth/profile`, userData, {
//         headers: { Authorization: `Bearer ${token}` }
//     });
//     return data;
// };

// const updateUserProfilePicture = async (formData) => {
//     const token = localStorage.getItem('token');
//     const { data } = await axios.put(`${SERVER_BASE_URL}/api/auth/profile/picture`, formData, {
//         headers: { Authorization: `Bearer ${token}` }
//     });
//     return data;
// };

// const getAddressFromCoords = async (lat, lon) => {
//     try {
//         const { data } = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
//         return data?.display_name || `${lat.toFixed(6)}, ${lon.toFixed(6)}`;
//     } catch (error) {
//         console.error("Reverse geocoding error:", error);
//         toast.error("Could not fetch address. Using coordinates instead.");
//         return `${lat.toFixed(6)}, ${lon.toFixed(6)}`;
//     }
// };

// // Reusable components
// const ProfileInputField = ({ name, value, onChange, label, type = "text" }) => (
//     <div>
//         <label htmlFor={name} className="text-sm font-medium text-gray-700">{label}</label>
//         <input id={name} name={name} type={type} value={value} onChange={onChange}
//             className="mt-1 w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition" />
//     </div>
// );

// const ProfileInfoField = ({ icon: Icon, label, value, isPlaceholder = false }) => (
//     <div>
//         <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{label}</label>
//         <div className="flex items-center gap-3 mt-1">
//             <Icon className="text-gray-400" size={20} />
//             <p className={`text-base ${isPlaceholder ? 'text-gray-400 italic' : 'text-gray-800'}`}>{value || 'Not set'}</p>
//         </div>
//     </div>
// );

// // Main component
// const ProfilePage = () => {
//     const { user, updateUser } = useContext(AuthContext);
//     const queryClient = useQueryClient();

//     const [activeTab, setActiveTab] = useState('profile');
//     const [isEditMode, setIsEditMode] = useState(false);
//     const [formData, setFormData] = useState({ fullName: '', email: '', location: '' });
//     const [isFetchingLocation, setIsFetchingLocation] = useState(false);

//     const points = user?.groceryPoints || 0;
//     const progressPercentage = Math.min((points / 150) * 100, 100);

//     const resetFormData = useCallback(() => {
//         if (user) {
//             setFormData({
//                 fullName: user.fullName || '',
//                 email: user.email || '',
//                 location: user.location || ''
//             });
//         }
//     }, [user]);

//     useEffect(() => {
//         resetFormData();
//     }, [user, resetFormData]);

//     const profileUpdateMutation = useMutation({
//         mutationFn: updateUserProfile,
//         onSuccess: (data) => {
//             updateUser(data.data);
//             queryClient.invalidateQueries({ queryKey: ['userProfile'] });
//             toast.success('Profile updated successfully!');
//             setIsEditMode(false);
//         },
//         onError: (error) => toast.error(error.response?.data?.message || 'Failed to update profile.')
//     });

//     const pictureUpdateMutation = useMutation({
//         mutationFn: updateUserProfilePicture,
//         onSuccess: (data) => {
//             updateUser(data.data);
//             queryClient.invalidateQueries({ queryKey: ['userProfile'] });
//             toast.success('Profile picture updated successfully!');
//         },
//         onError: (error) => toast.error(error.response?.data?.message || 'Failed to update picture.')
//     });

//     const handleInputChange = (e) => {
//         setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
//     };

//     const handleFormSubmit = (e) => {
//         e.preventDefault();
//         profileUpdateMutation.mutate(formData);
//     };

//     const handleImageChange = (e) => {
//         const file = e.target.files[0];
//         if (!file) return;
//         const pictureFormData = new FormData();
//         pictureFormData.append('profilePicture', file);
//         pictureUpdateMutation.mutate(pictureFormData);
//     };

//     const handleFetchLocation = () => {
//         if (!isEditMode) return;
//         setIsFetchingLocation(true);
//         toast.info("Fetching your location...");
//         navigator.geolocation.getCurrentPosition(
//             async ({ coords }) => {
//                 const address = await getAddressFromCoords(coords.latitude, coords.longitude);
//                 setFormData(prev => ({ ...prev, location: address }));
//                 setIsFetchingLocation(false);
//                 if (address.includes(',')) toast.success('Location fetched!');
//             },
//             () => {
//                 toast.error('Unable to retrieve your location.');
//                 setIsFetchingLocation(false);
//             }
//         );
//     };

//     const TabButton = ({ tabName, icon: Icon, label }) => (
//         <button
//             onClick={() => setActiveTab(tabName)}
//             className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-lg transition-all ${
//                 activeTab === tabName ? 'bg-green-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'
//             }`}
//         >
//             <Icon size={18} />
//             {label}
//         </button>
//     );

//     if (!user) {
//         return <div className="flex justify-center items-center h-full"><Loader2 className="animate-spin text-green-600" size={48}/></div>;
//     }

//     return (
//         <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
//             {/* Header */}
//             <div className="p-6 md:p-8 border-b">
//                 <div className="flex flex-col sm:flex-row items-center gap-6">
//                     <div className="relative group w-24 h-24 flex-shrink-0">
//                         <Avatar user={user} size={96} className="rounded-full border-4 border-white shadow-md" />
//                         <label className="absolute inset-0 flex items-center justify-center bg-black/50 text-white rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
//                             <Edit2 size={20} />
//                             <input type="file" onChange={handleImageChange} className="hidden" accept="image/*" disabled={pictureUpdateMutation.isLoading} />
//                         </label>
//                     </div>
//                     <div className="text-center sm:text-left">
//                         <h2 className="text-2xl font-bold text-gray-900">{user.fullName}</h2>
//                         <p className="text-gray-500">{user.email}</p>
//                     </div>
//                 </div>
//             </div>

//             {/* Grocery Points */}
//             <div className="p-6 md:p-8 border-b">
//                 <div className="flex items-center gap-4">
//                     <Gift className="text-green-500" size={32} />
//                     <div>
//                         <h3 className="text-lg font-bold text-gray-800">Grocery Points</h3>
//                         <p className="text-3xl font-bold text-green-600">{points}</p>
//                     </div>
//                 </div>
//                 <div className="mt-4">
//                     <div className="w-full bg-gray-200 rounded-full h-2.5">
//                         <div className="bg-green-500 h-2.5 rounded-full transition-all duration-500" style={{ width: `${progressPercentage}%` }}></div>
//                     </div>
//                     <p className="text-xs text-gray-500 mt-2 text-right">
//                         {points < 150 ? `${150 - points} points until your next 25% discount!` : "You have a 25% discount available!"}
//                     </p>
//                 </div>
//             </div>

//             {/* Tabs */}
//             <div className="p-4 sm:p-6 border-b bg-gray-50">
//                 <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto">
//                     <TabButton tabName="profile" icon={User} label="Profile" />
//                     <TabButton tabName="orders" icon={ShoppingCart} label="Orders" />
//                     <TabButton tabName="payments" icon={Wallet} label="Payments" />
//                 </div>
//             </div>

//             {/* Tab Content */}
//             <div className="p-6 md:p-8">
//                 {activeTab === 'profile' && (
//                     <div>
//                         <div className="flex justify-between items-center mb-6">
//                             <h3 className="text-xl font-bold text-gray-800">Personal Information</h3>
//                             {!isEditMode && (
//                                 <button onClick={() => setIsEditMode(true)} className="flex items-center gap-2 px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
//                                     <Edit size={14} /> Edit
//                                 </button>
//                             )}
//                         </div>
//                         <form onSubmit={handleFormSubmit} className="space-y-6">
//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                                 {isEditMode ? (
//                                     <>
//                                         <ProfileInputField name="fullName" label="Full Name" value={formData.fullName} onChange={handleInputChange} />
//                                         <ProfileInputField name="email" label="Email Address" type="email" value={formData.email} onChange={handleInputChange} />
//                                         <div>
//                                             <label htmlFor="location" className="text-sm font-medium text-gray-700">Location</label>
//                                             <div className="mt-1 flex gap-2">
//                                                 <input id="location" name="location" type="text" value={formData.location} onChange={handleInputChange} placeholder="Click pin to fetch location"
//                                                     className="flex-grow p-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition" />
//                                                 <button type="button" onClick={handleFetchLocation} disabled={isFetchingLocation}
//                                                     className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center transition disabled:opacity-50 disabled:cursor-not-allowed">
//                                                     {isFetchingLocation ? <Loader2 className="animate-spin" /> : <MapPin />}
//                                                 </button>
//                                             </div>
//                                         </div>
//                                     </>
//                                 ) : (
//                                     <>
//                                         <ProfileInfoField icon={User} label="Full Name" value={user.fullName} />
//                                         <ProfileInfoField icon={Mail} label="Email Address" value={user.email} />
//                                         <ProfileInfoField icon={MapPin} label="Location" value={user.location} isPlaceholder={!user.location} />
//                                     </>
//                                 )}
//                             </div>
//                             {isEditMode && (
//                                 <div className="flex justify-end gap-4 pt-4 border-t mt-6">
//                                     <button type="button" onClick={() => setIsEditMode(false)} className="px-5 py-2.5 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition">Cancel</button>
//                                     <button type="submit" disabled={profileUpdateMutation.isLoading}
//                                         className="flex items-center justify-center gap-2 px-5 py-2.5 bg-green-600 text-white font-semibold rounded-lg shadow-sm hover:bg-green-700 transition disabled:opacity-50">
//                                         {profileUpdateMutation.isLoading ? <Loader2 className="animate-spin" /> : <><Save size={16} /> Save Changes</>}
//                                     </button>
//                                 </div>
//                             )}
//                         </form>
//                     </div>
//                 )}
//                 {activeTab === 'orders' && <MyOrdersPage />}
//                 {activeTab === 'payments' && <PaymentHistoryPage />}
//             </div>
//         </div>
//     );
// };

// export default ProfilePage;








import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../auth/AuthContext.jsx';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { Avatar } from '../components/Avatar';
import { Loader2, Edit, Save, Edit2, User, Mail, ShoppingCart, Wallet, MapPin, Gift } from 'lucide-react';
import axios from 'axios';
import { MyOrdersPage } from './MyOrderPage.jsx';
import { PaymentHistoryPage } from './PaymentHistory.jsx';
import { fetchUserProfile } from '../services/userServices.js';

const SERVER_BASE_URL = "http://localhost:8081";

// API functions for mutations
const updateUserProfile = async (userData) => {
    const token = localStorage.getItem('token');
    const { data } = await axios.put(`${SERVER_BASE_URL}/api/auth/profile`, userData, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return data;
};

const updateUserProfilePicture = async (formData) => {
    const token = localStorage.getItem('token');
    const { data } = await axios.put(`${SERVER_BASE_URL}/api/auth/profile/picture`, formData, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return data;
};

const getAddressFromCoords = async (lat, lon) => {
    try {
        const { data } = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
        return data?.display_name || `${lat.toFixed(6)}, ${lon.toFixed(6)}`;
    } catch (error) {
        toast.error("Could not fetch address. Using coordinates instead.");
        return `${lat.toFixed(6)}, ${lon.toFixed(6)}`;
    }
};

// Reusable components
const ProfileInputField = ({ name, value, onChange, label, type = "text" }) => (
    <div>
        <label htmlFor={name} className="text-sm font-medium text-gray-700">{label}</label>
        <input id={name} name={name} type={type} value={value} onChange={onChange}
            className="mt-1 w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition" />
    </div>
);

const ProfileInfoField = ({ icon: Icon, label, value, isPlaceholder = false }) => (
    <div>
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{label}</label>
        <div className="flex items-center gap-3 mt-1">
            <Icon className="text-gray-400" size={20} />
            <p className={`text-base ${isPlaceholder ? 'text-gray-400 italic' : 'text-gray-800'}`}>{value || 'Not set'}</p>
        </div>
    </div>
);

// Main component
const ProfilePage = () => {
    const { user: initialUser, updateUser } = useContext(AuthContext);
    const queryClient = useQueryClient();

    const { data: user, isLoading: isUserLoading, error: userError } = useQuery({
        queryKey: ['userProfile'],
        queryFn: fetchUserProfile,
        initialData: { data: initialUser },
        refetchOnWindowFocus: true,
        staleTime: 1000 * 60,
        select: (data) => data.data,
    });

    const [activeTab, setActiveTab] = useState('profile');
    const [isEditMode, setIsEditMode] = useState(false);
    const [formData, setFormData] = useState({ fullName: '', email: '', location: '' });
    const [isFetchingLocation, setIsFetchingLocation] = useState(false);

    useEffect(() => {
        if (user) {
            updateUser(user);
            setFormData({
                fullName: user.fullName || '',
                email: user.email || '',
                location: user.location || ''
            });
        }
    }, [user, updateUser]);

    const profileUpdateMutation = useMutation({
        mutationFn: updateUserProfile,
        onSuccess: () => {
            toast.success('Profile updated successfully!');
            queryClient.invalidateQueries({ queryKey: ['userProfile'] });
            setIsEditMode(false);
        },
        onError: (error) => toast.error(error.response?.data?.message || 'Failed to update profile.')
    });

    const pictureUpdateMutation = useMutation({
        mutationFn: updateUserProfilePicture,
        onSuccess: () => {
            toast.success('Profile picture updated successfully!');
            queryClient.invalidateQueries({ queryKey: ['userProfile'] });
        },
        onError: (error) => toast.error(error.response?.data?.message || 'Failed to update picture.')
    });

    const handleInputChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        profileUpdateMutation.mutate(formData);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const pictureFormData = new FormData();
        pictureFormData.append('profilePicture', file);
        pictureUpdateMutation.mutate(pictureFormData);
    };

    const handleFetchLocation = () => {
        if (!isEditMode) return;
        setIsFetchingLocation(true);
        toast.info("Fetching your location...");
        navigator.geolocation.getCurrentPosition(
            async ({ coords }) => {
                const address = await getAddressFromCoords(coords.latitude, coords.longitude);
                setFormData(prev => ({ ...prev, location: address }));
                setIsFetchingLocation(false);
                if (address.includes(',')) toast.success('Location fetched!');
            },
            () => {
                toast.error('Unable to retrieve your location.');
                setIsFetchingLocation(false);
            }
        );
    };

    const TabButton = ({ tabName, icon: Icon, label }) => (
        <button
            onClick={() => setActiveTab(tabName)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-lg transition-all ${
                activeTab === tabName ? 'bg-green-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'
            }`}
        >
            <Icon size={18} />
            {label}
        </button>
    );

    if (isUserLoading && !initialUser) {
        return <div className="flex justify-center items-center h-screen"><Loader2 className="animate-spin text-green-600" size={48}/></div>;
    }
    
    if (userError) {
        return <div className="text-center p-8 text-red-500">Error fetching profile: {userError.message}</div>;
    }

    if (!user) {
         return <div className="text-center p-8">Could not load user profile.</div>;
    }

    const points = user.groceryPoints || 0;
    const progressPercentage = Math.min((points / 150) * 100, 100);

    return (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden max-w-5xl mx-auto my-8">
            <div className="p-6 md:p-8 border-b">
                <div className="flex flex-col sm:flex-row items-center gap-6">
                    <div className="relative group w-24 h-24 flex-shrink-0">
                        <Avatar user={user} size={96} className="rounded-full border-4 border-white shadow-md" />
                        <label className="absolute inset-0 flex items-center justify-center bg-black/50 text-white rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                            <Edit2 size={20} />
                            <input type="file" onChange={handleImageChange} className="hidden" accept="image/*" disabled={pictureUpdateMutation.isLoading} />
                        </label>
                    </div>
                    <div className="text-center sm:text-left">
                        <h2 className="text-2xl font-bold text-gray-900">{user.fullName}</h2>
                        <p className="text-gray-500">{user.email}</p>
                    </div>
                </div>
            </div>

            <div className="p-6 md:p-8 border-b bg-green-50/50">
                <div className="flex items-center gap-4">
                    <Gift className="text-green-500" size={32} />
                    <div>
                        <h3 className="text-lg font-bold text-gray-800">Grocery Points</h3>
                        <p className="text-3xl font-bold text-green-600">{points}</p>
                    </div>
                </div>
                <div className="mt-4">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-green-500 h-2.5 rounded-full transition-all duration-500" style={{ width: `${progressPercentage}%` }}></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2 text-right">
                        {points < 150 ? `${150 - points} points until your next 25% discount!` : "Congratulations! You have a 25% discount available!"}
                    </p>
                </div>
            </div>

            <div className="p-4 sm:p-6 border-b bg-gray-50">
                <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto">
                    <TabButton tabName="profile" icon={User} label="Profile" />
                    <TabButton tabName="orders" icon={ShoppingCart} label="Orders" />
                    <TabButton tabName="payments" icon={Wallet} label="Payments" />
                </div>
            </div>

            <div className="p-6 md:p-8">
                {activeTab === 'profile' && (
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-gray-800">Personal Information</h3>
                            {!isEditMode && (
                                <button onClick={() => setIsEditMode(true)} className="flex items-center gap-2 px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
                                    <Edit size={14} /> Edit
                                </button>
                            )}
                        </div>
                        <form onSubmit={handleFormSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {isEditMode ? (
                                    <>
                                        <ProfileInputField name="fullName" label="Full Name" value={formData.fullName} onChange={handleInputChange} />
                                        <ProfileInputField name="email" label="Email Address" type="email" value={formData.email} onChange={handleInputChange} />
                                        <div>
                                            <label htmlFor="location" className="text-sm font-medium text-gray-700">Location</label>
                                            <div className="mt-1 flex gap-2">
                                                <input id="location" name="location" type="text" value={formData.location} onChange={handleInputChange} placeholder="Click pin to fetch location"
                                                    className="flex-grow p-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition" />
                                                <button type="button" onClick={handleFetchLocation} disabled={isFetchingLocation}
                                                    className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center transition disabled:opacity-50 disabled:cursor-not-allowed">
                                                    {isFetchingLocation ? <Loader2 className="animate-spin" /> : <MapPin />}
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <ProfileInfoField icon={User} label="Full Name" value={user.fullName} />
                                        <ProfileInfoField icon={Mail} label="Email Address" value={user.email} />
                                        <ProfileInfoField icon={MapPin} label="Location" value={user.location} isPlaceholder={!user.location} />
                                    </>
                                )}
                            </div>
                            {isEditMode && (
                                <div className="flex justify-end gap-4 pt-4 border-t mt-6">
                                    <button type="button" onClick={() => setIsEditMode(false)} className="px-5 py-2.5 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition">Cancel</button>
                                    <button type="submit" disabled={profileUpdateMutation.isLoading}
                                        className="flex items-center justify-center gap-2 px-5 py-2.5 bg-green-600 text-white font-semibold rounded-lg shadow-sm hover:bg-green-700 transition disabled:opacity-50">
                                        {profileUpdateMutation.isLoading ? <Loader2 className="animate-spin" /> : <><Save size={16} /> Save Changes</>}
                                    </button>
                                </div>
                            )}
                        </form>
                    </div>
                )}
                {activeTab === 'orders' && <MyOrdersPage />}
                {activeTab === 'payments' && <PaymentHistoryPage />}
            </div>
        </div>
    );
};

export default ProfilePage;