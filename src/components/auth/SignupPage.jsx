

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Navbar from '../Navbar';
import logo from '../../assets/hamro2.png';
import { useRegisterUser } from '../../hooks/useRegisterUser';

const SignupPage = () => {
  // Use the useNavigate hook from React Router
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
  });

  const { mutate: registerUser, isLoading: isSubmitting } = useRegisterUser();

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { fullName, email, password } = formData;

    if (!fullName || !email || !password) {
      toast.error('Please fill in all fields.');
      return;
    }

    registerUser(formData, {
      onSuccess: () => {
        toast.success('Registration successful! Please log in.');
        // Use the navigate function to go to the login page on success
        navigate('/login');
      },
      onError: (error) => {
        const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
        toast.error(errorMessage);
      },
    });
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
            <h1 className="text-3xl font-bold text-gray-800 mt-4">Create an Account</h1>
            <p className="text-gray-500 mt-2">Start your fresh journey with us today.</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Full Name Input */}
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">Full Name</label>
              <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="John Doe" disabled={isSubmitting} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" />
            </div>
            {/* Email Input */}
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">Email Address</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="you@example.com" disabled={isSubmitting} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" />
            </div>
            {/* Password Input */}
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">Password</label>
              <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="••••••••" disabled={isSubmitting} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" />
            </div>
            {/* Submit Button */}
            <div>
              <button type="submit" disabled={isSubmitting} className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg transition duration-300 flex items-center justify-center disabled:opacity-60">
                {isSubmitting ? 'Creating Account...' : 'Create Account'}
              </button>
            </div>
          </form>

          <p className="text-center text-sm text-gray-500 mt-8">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-green-600 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default SignupPage;
export { SignupPage };
export { NavigationContext } from '../../context/NavigationContext'; // Ensure this is the correct path to your NavigationContext