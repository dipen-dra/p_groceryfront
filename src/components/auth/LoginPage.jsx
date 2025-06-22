

import { useState } from 'react';
import { Link } from 'react-router-dom'; // Correctly uses Link from React Router
import { toast } from 'react-toastify';
import logo from '../../assets/hamro2.png';
import { useLoginUser } from '../../hooks/useLoginUser';
import Navbar from '../Navbar';

const LoginPage = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const { login: loginUser, isLoading } = useLoginUser();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.email || !formData.password) {
            toast.error('Please enter both email and password.');
            return;
        }
        loginUser(formData);
    };

    return (
        <>
            <Navbar />
            <div className="pt-24 min-h-screen flex items-center justify-center bg-gray-50">
                <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg m-4">
                    <div className="text-center mb-8">
                        <Link to="/">
                            <img src={logo} alt="Logo" className="h-12 w-auto mx-auto" />
                        </Link>
                        <h1 className="text-3xl font-bold text-gray-800 mt-4">Welcome Back!</h1>
                        <p className="text-gray-500 mt-2">Please enter your details to sign in.</p>
                    </div>

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {/* Email Input */}
                        <div>
                            <label className="text-sm font-medium text-gray-700 block mb-2">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                placeholder="you@example.com"
                                value={formData.email}
                                onChange={handleChange}
                                disabled={isLoading}
                            />
                        </div>
                        {/* Password Input */}
                        <div>
                            <label className="text-sm font-medium text-gray-700 block mb-2">Password</label>
                            <input
                                type="password"
                                name="password"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={handleChange}
                                disabled={isLoading}
                            />
                        </div>
                        <div className="flex items-center justify-end">
                            <a href="#" onClick={(e) => e.preventDefault()} className="text-sm text-green-600 hover:underline">
                                Forgot Password?
                            </a>
                        </div>
                        {/* Submit Button */}
                        <div>
                            <button type="submit" disabled={isLoading} className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg transition duration-300 flex items-center justify-center disabled:opacity-60">
                                {isLoading ? 'Signing in...' : 'Login'}
                            </button>
                        </div>
                    </form>

                    <p className="text-center text-sm text-gray-500 mt-8">
                        Don't have an account?{' '}
                        <Link to="/register" className="font-semibold text-green-600 hover:underline">
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </>
    );
};

export default LoginPage;
export { LoginPage };
export { NavigationContext } from '../../context/NavigationContext'; // Ensure this is exported correctly