


// import { useState } from 'react';
// import { Link } from 'react-router-dom';
// import { toast } from 'react-toastify';
// import logo from '../../assets/hamro2.png';
// import { useLoginUser } from '../../hooks/useLoginUser';
// import Navbar from '../Navbar';

// const LoginPage = () => {
//     const [formData, setFormData] = useState({ email: '', password: '' });

//     // FIX 1: Correctly destructure the 'login' function and 'isLoading' state from the hook.
//     const { login: loginUser, isLoading } = useLoginUser();

//     const handleChange = (e) => {
//         setFormData({ ...formData, [e.target.name]: e.target.value });
//     };

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         if (!formData.email || !formData.password) {
//             toast.error('Please enter both email and password.');
//             return;
//         }

//         // FIX 2: Simply call the mutation function with the form data.
//         // The success, error, and navigation logic is already handled inside the useLoginUser hook.
//         loginUser(formData);
//     };

//     return (
//         <>
//             <Navbar />
//             <div className="pt-24 min-h-screen flex items-center justify-center bg-gray-50">
//                 <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg m-4">
//                     <div className="text-center mb-8">
//                         <Link to="/">
//                             <img
//                                 src={logo}
//                                 alt="Logo"
//                                 className="h-12 w-auto mx-auto"
//                             />
//                         </Link>
//                         <h1 className="text-3xl font-bold text-gray-800 mt-4">Welcome Back!</h1>
//                         <p className="text-gray-500 mt-2">Please enter your details to sign in.</p>
//                     </div>

//                     <form className="space-y-6" onSubmit={handleSubmit}>
//                         <div>
//                             <label className="text-sm font-medium text-gray-700 block mb-2">Email Address</label>
//                             <input
//                                 type="email"
//                                 name="email"
//                                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
//                                 placeholder="you@example.com"
//                                 value={formData.email}
//                                 onChange={handleChange}
//                                 disabled={isLoading}
//                             />
//                         </div>
//                         <div>
//                             <label className="text-sm font-medium text-gray-700 block mb-2">Password</label>
//                             <input
//                                 type="password"
//                                 name="password"
//                                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
//                                 placeholder="••••••••"
//                                 value={formData.password}
//                                 onChange={handleChange}
//                                 disabled={isLoading}
//                             />
//                         </div>
//                         <div className="flex items-center justify-end">
//                             <a href="#" onClick={(e) => e.preventDefault()} className="text-sm text-green-600 hover:underline">
//                                 Forgot Password?
//                             </a>
//                         </div>
//                         <div>
//                             <button
//                                 type="submit"
//                                 disabled={isLoading}
//                                 className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg transition duration-300 flex items-center justify-center disabled:opacity-60"
//                             >
//                                 {isLoading ? (
//                                     <>
//                                         <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                                             <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                                             <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                                         </svg>
//                                         Signing in...
//                                     </>
//                                 ) : (
//                                     'Login'
//                                 )}
//                             </button>
//                         </div>
//                     </form>

//                     <p className="text-center text-sm text-gray-500 mt-8">
//                         Don't have an account?{' '}
//                         <Link to="/register" className="font-semibold text-green-600 hover:underline">
//                             Sign up
//                         </Link>
//                     </p>
//                 </div>
//             </div>
//         </>
//     );
// };

// export default LoginPage;
// export { LoginPage };
// export { NavigationContext } from '../../context/NavigationContext'; // Ensure this is exported correctly


// Filename: src/components/auth/LoginPage.jsx

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