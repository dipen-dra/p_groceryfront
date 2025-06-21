import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchUserProfile } from '../services/userServices.js';
import { Loader2, User, Mail, Calendar } from 'lucide-react';

const ProfilePage = () => {
    const { data: userData, isLoading, isError } = useQuery({ queryKey: ['userProfile'], queryFn: fetchUserProfile });
    const user = userData?.data;

    if (isLoading) return <div className="flex justify-center p-12"><Loader2 size={48} className="animate-spin text-green-600" /></div>;
    if (isError || !user) return <div className="text-center text-red-500 p-8 bg-white rounded-lg">Failed to load profile data.</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <h1 className="text-3xl font-bold text-gray-800">Account Settings</h1>
            <div className="bg-white p-6 rounded-2xl shadow-lg">
                <div className="flex items-center gap-6">
                    <img src={`https://ui-avatars.com/api/?name=${user.fullName}&background=0D8ABC&color=fff&size=96`} alt="Avatar" className="w-24 h-24 rounded-full border-4 border-green-200" />
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">{user.fullName}</h2>
                        <p className="text-gray-500">Welcome back!</p>
                    </div>
                </div>
                <div className="mt-6 border-t pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center gap-4">
                        <Mail className="text-gray-400" size={20} />
                        <div>
                            <p className="text-sm text-gray-500">Email</p>
                            <p className="font-medium text-gray-700">{user.email}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <Calendar className="text-gray-400" size={20} />
                        <div>
                            <p className="text-sm text-gray-500">Joined On</p>
                            <p className="font-medium text-gray-700">{new Date(user.createdAt).toLocaleDateString()}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;