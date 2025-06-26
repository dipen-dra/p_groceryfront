import React, { useContext, useState } from 'react';
import { AuthContext } from '../auth/AuthContext';
import { updateUserProfilePicture } from '../services/userServices';
import { toast } from 'react-toastify';
import { Avatar } from '../components/Avatar';
import { Loader2, Mail, Calendar } from 'lucide-react';
import dayjs from 'dayjs';


const ProfilePage = () => {
    const { user, updateUser } = useContext(AuthContext);
    const [uploading, setUploading] = useState(false);

    const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('profilePicture', file);

    try {
        setUploading(true);
        const response = await updateUserProfilePicture(formData);
        if (response.success) {
            // Merge new data with existing user to preserve fields like createdAt
            updateUser({
                ...user,             // preserve existing fields
                ...response.data     // overwrite with new profilePicture and other updated fields
            });
            toast.success('Profile picture updated');
        } else {
            toast.error(response.message || 'Failed to update profile');
        }
    } catch (error) {
        console.error(error);
        toast.error('Something went wrong');
    } finally {
        setUploading(false);
    }
};


    return (
        <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
            <h1 className="text-3xl font-bold text-gray-800">Account Settings</h1>

            <div className="bg-white p-6 rounded-2xl shadow-md">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                    <div className="relative group">
                        <Avatar user={user} size={120} className="rounded-full border-4 border-green-200 shadow" />
                        <label className="absolute bottom-0 right-0 bg-green-600 text-white p-2 rounded-full shadow cursor-pointer hover:bg-green-700 transition duration-200">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828L18 9.828V7h-2.828z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7h2a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V9a2 2 0 012-2h2" />
                            </svg>
                            <input
                                type="file"
                                onChange={handleImageChange}
                                className="hidden"
                                accept="image/*"
                                disabled={uploading}
                            />
                        </label>
                    </div>

                    <div className="flex-1 space-y-2 text-center md:text-left">
                        <h2 className="text-2xl font-bold text-gray-800">{user.fullName}</h2>
                        <p className="text-gray-500">Welcome back!</p>
                    </div>
                </div>

                <div className="mt-8 border-t pt-6 grid grid-cols-1 sm:grid-cols-2 gap-6 text-gray-700">
                    <div className="flex items-center gap-4">
                        <Mail className="text-gray-400" size={20} />
                        <div>
                            <p className="text-sm text-gray-500">Email</p>
                            <p className="font-medium">{user.email}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <Calendar className="text-gray-400" size={20} />
                        <div>
                            <p className="text-sm text-gray-500">Joined On</p>
                            <p className="font-medium">
                                {dayjs(user.createdAt).format('MMMM D, YYYY')} 
                                {/* <span className="ml-2 text-sm text-gray-500">({dayjs(user.createdAt).fromNow()})</span> */}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
