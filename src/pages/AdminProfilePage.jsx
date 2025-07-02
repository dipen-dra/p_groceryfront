import React, { useContext, useState, useEffect, useCallback } from 'react';
import { AuthContext } from '../auth/AuthContext';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { Avatar } from '../components/Avatar';
import { Loader2, Calendar, MapPin, Edit, X, Save, Edit2 } from 'lucide-react';
import dayjs from 'dayjs';
import axios from 'axios';

const SERVER_BASE_URL = "http://localhost:8081";

// API function to update the user's profile
const updateUserProfile = async (userData) => {
    const token = localStorage.getItem('token');
    const { data } = await axios.put(`${SERVER_BASE_URL}/api/auth/profile`, userData, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return data;
};

// API function to update the profile picture
const updateUserProfilePicture = async (formData) => {
    const token = localStorage.getItem('token');
    const { data } = await axios.put(`${SERVER_BASE_URL}/api/auth/profile/picture`, formData, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return data;
};

// **CORRECTED FUNCTION**
// API function for reverse geocoding using Nominatim (OpenStreetMap)
const getAddressFromCoords = async (lat, lon) => {
    try {
        const { data } = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
        if (data && data.display_name) {
            return data.display_name;
        }
        // Fallback to coordinates if the API doesn't return a display_name
        return `${lat.toFixed(6)}, ${lon.toFixed(6)}`;
    } catch (error) {
        console.error("Reverse geocoding error:", error);
        toast.error("Could not fetch address. Please try again.");
        // Fallback to coordinates on API error
        return `${lat.toFixed(6)}, ${lon.toFixed(6)}`;
    }
};


const AdminProfilePage = () => {
    const { user, updateUser } = useContext(AuthContext);
    const queryClient = useQueryClient();
    
    const [isEditMode, setIsEditMode] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        location: ''
    });
    const [isFetchingLocation, setIsFetchingLocation] = useState(false);

    const resetFormData = useCallback(() => {
        if (user) {
            setFormData({
                fullName: user.fullName || '',
                email: user.email || '',
                location: user.location || ''
            });
        }
    }, [user]);

    useEffect(() => {
        resetFormData();
    }, [user, resetFormData]);

    const profileUpdateMutation = useMutation({
        mutationFn: updateUserProfile,
        onSuccess: (data) => {
            updateUser(data.data);
            queryClient.invalidateQueries({ queryKey: ['userProfile'] });
            toast.success('Profile updated successfully!');
            setIsEditMode(false);
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to update profile.');
        }
    });
    
    const pictureUpdateMutation = useMutation({
        mutationFn: updateUserProfilePicture,
        onSuccess: (data) => {
            updateUser(data.data);
            queryClient.invalidateQueries({ queryKey: ['userProfile'] });
            toast.success('Profile picture updated successfully!');
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to update profile picture.');
        }
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
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
        if (navigator.geolocation) {
            setIsFetchingLocation(true);
            toast.info("Fetching your location...");
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    const address = await getAddressFromCoords(latitude, longitude);
                    setFormData(prev => ({ ...prev, location: address }));
                    setIsFetchingLocation(false);
                    if (address.includes(',')) { // A simple check to see if we got an address or just coordinates
                        toast.success('Location fetched successfully!');
                    }
                },
                (error) => {
                    toast.error('Unable to retrieve your location.');
                    setIsFetchingLocation(false);
                }
            );
        } else {
            toast.error('Geolocation is not supported by your browser.');
        }
    };
    
    const handleCancelEdit = () => {
        setIsEditMode(false);
        resetFormData();
    };

    if (!user) {
        return <div className="flex justify-center items-center h-full"><Loader2 className="animate-spin text-green-600" size={48}/></div>;
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-800">Admin Profile</h1>
                {!isEditMode && (
                    <button onClick={() => setIsEditMode(true)} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-blue-700 transition">
                        <Edit size={16} /> Edit Profile
                    </button>
                )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-1">
                    <div className="bg-white p-6 rounded-2xl shadow-md text-center">
                        <div className="relative group w-32 h-32 mx-auto">
                            <Avatar user={user} size={128} className="rounded-full border-4 border-green-200 shadow" />
                            <label className={`absolute bottom-0 right-0 bg-green-600 text-white p-2 rounded-full shadow transition duration-200 ${isEditMode ? 'cursor-pointer hover:bg-green-700' : 'cursor-not-allowed opacity-50'}`}>
                                <Edit2 size={16} />
                                <input
                                    type="file"
                                    onChange={handleImageChange}
                                    className="hidden"
                                    accept="image/*"
                                    disabled={!isEditMode || pictureUpdateMutation.isLoading}
                                />
                            </label>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mt-4">{user.fullName}</h2>
                        <div className="text-sm text-gray-500 mt-4 space-y-2">
                            <div className="flex items-center justify-center gap-2">
                                <Calendar className="text-gray-400" size={16} />
                                Joined on {dayjs(user.createdAt).format('MMMM D, YYYY')}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="md:col-span-2">
                    <form onSubmit={handleFormSubmit} className="bg-white p-6 rounded-2xl shadow-md space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">Full Name</label>
                            {isEditMode ? (
                                <input name="fullName" type="text" value={formData.fullName} onChange={handleInputChange} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500" />
                            ) : (
                                <p className="text-lg text-gray-800 p-3 bg-gray-50 rounded-lg">{user.fullName}</p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">Email Address</label>
                             {isEditMode ? (
                                <input name="email" type="email" value={formData.email} onChange={handleInputChange} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500" />
                            ) : (
                                <p className="text-lg text-gray-800 p-3 bg-gray-50 rounded-lg">{user.email}</p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">Location</label>
                            <div className="flex gap-2">
                                {isEditMode ? (
                                    <input name="location" type="text" value={formData.location} onChange={handleInputChange} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500" placeholder="Click the pin to fetch location" />
                                ) : (
                                     <p className="w-full text-lg text-gray-800 p-3 bg-gray-50 rounded-lg">{user.location || 'Not set'}</p>
                                )}
                                <button
                                    type="button"
                                    onClick={handleFetchLocation}
                                    disabled={!isEditMode || isFetchingLocation}
                                    className="p-3 bg-green-600 text-white rounded-lg hover:bg-blue-600 flex items-center justify-center transition disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isFetchingLocation ? <Loader2 className="animate-spin" /> : <MapPin />}
                                </button>
                            </div>
                        </div>

                        {isEditMode && (
                            <div className="flex justify-end gap-4 pt-4">
                                <button type="button" onClick={handleCancelEdit} className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition">
                                    <X size={16} /> Cancel
                                </button>
                                <button type="submit" disabled={profileUpdateMutation.isLoading} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition disabled:opacity-50">
                                    {profileUpdateMutation.isLoading ? <Loader2 className="animate-spin" /> : <><Save size={16} /> Save Changes</>}
                                </button>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminProfilePage;