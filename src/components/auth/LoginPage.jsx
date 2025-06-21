
// import React, { useState, useContext } from 'react';
// import NavigationContext from '../../context/NavigationContext';
// import Navbar from '../Navbar';
// import { toast } from 'react-toastify';
// import logo from '../../assets/hamro2.png';
// import { useLoginUser } from '../../hooks/useLoginUser'; 

// import { AuthContext } from '../../auth/AuthContext';

// const LoginPage = () => {
//   const { navigate } = useContext(NavigationContext);
//   const [formData, setFormData] = useState({ email: '', password: '' });
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const { mutate: loginUser } = useLoginUser();
//   const { login } = useContext(AuthContext);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (!formData.email || !formData.password) {
//       toast.error('Please enter both email and password.');
//       return;
//     }

//     setIsSubmitting(true);

//     loginUser(formData, {
//       onSuccess: (res) => {
//         // toast.success(res?.message || 'Login successful!');
//         login({ email: formData.email, password: formData.password });
//         navigate('home'); // or dashboard, adjust as needed
//         setIsSubmitting(false);
//       },
//       onError: (err) => {
//         // toast.error(err?.message || 'Login failed. Please try again.');
//         setIsSubmitting(false);
//       },
//     });
//   };

//   return (
//     <>
//       <Navbar />
//       <style jsx>{`
//         header {
//           background: rgba(255, 255, 255, 0.95) !important;
//           box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1) !important;
//           backdrop-filter: blur(4px) !important;
//         }
//         header nav a {
//           color: #1a1a1a !important;
//         }
//         header nav a:hover {
//           color: #15803d !important;
//         }
//         header nav button svg {
//           stroke: #1a1a1a !important;
//         }
//         header nav div button.bg-green-600 {
//           display: none !important;
//         }
//       `}</style>

//       <div className="pt-24 min-h-screen flex items-center justify-center bg-gray-50">
//         <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg m-4">
//           <div className="text-center mb-8">
//             <a href="#" onClick={() => navigate('home')}>
//               <img src={logo}
//                 alt="Logo"
//                 className="h-12 w-auto mx-auto"/>
//             </a>
//             <p className="text-gray-500 mt-2">Welcome back! Please enter your details.</p>
//           </div>

//           <form className="space-y-6" onSubmit={handleSubmit}>
//             <div>
//               <label className="text-sm font-medium text-gray-700 block mb-2">Email Address</label>
//               <input
//                 type="email"
//                 name="email"
//                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
//                 placeholder="you@example.com"
//                 value={formData.email}
//                 onChange={handleChange}
//                 disabled={isSubmitting}
//               />
//             </div>
//             <div>
//               <label className="text-sm font-medium text-gray-700 block mb-2">Password</label>
//               <input
//                 type="password"
//                 name="password"
//                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
//                 placeholder="••••••••"
//                 value={formData.password}
//                 onChange={handleChange}
//                 disabled={isSubmitting}
//               />
//             </div>
//             <div className="flex items-center justify-between">
//               <a href="#" onClick={(e) => e.preventDefault()} className="text-sm text-green-600 hover:underline">
//                 Forgot Password?
//               </a>
//             </div>
//             <div>
//               <button
//                 type="submit"
//                 disabled={isSubmitting}
//                 className={`w-full ${
//                   isSubmitting ? 'bg-green-400' : 'bg-green-600 hover:bg-green-700'
//                 } text-white font-bold py-3 px-4 rounded-lg transition duration-300 transform hover:scale-105 disabled:opacity-60`}
//               >
//                 {isSubmitting ? 'Signing in...' : 'Login'}
//               </button>
//             </div>
//           </form>

//           <p className="text-center text-sm text-gray-500 mt-8">
//             Don't have an account?{' '}
//             <a href="#" onClick={() => navigate('signup')} className="font-semibold text-green-600 hover:underline">
//               Sign up
//             </a>
//           </p>
//         </div>
//       </div>
//     </>
//   );
// };

// export default LoginPage;
// export { NavigationContext, LoginPage };




// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { toast } from 'react-toastify';
// import logo from '../../assets/hamro2.png';
// import { useLoginUser } from '../../hooks/useLoginUser';
// import Navbar from '../Navbar';

// const LoginPage = () => {
//     const navigate = useNavigate();
//     const [formData, setFormData] = useState({ email: '', password: '' });

//     // FIX 1: Correctly destructure { login, isLoading } from the hook.
//     // We can rename 'login' to 'loginUser' for use in this component.
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

//         // FIX 2: Simply call the mutation function. The success/error logic
//         // is already handled inside the useLoginUser hook.
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
//                             {/* FIX 3: Use the 'isLoading' state from the hook instead of manual state. */}
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


import { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import logo from '../../assets/hamro2.png';
import { useLoginUser } from '../../hooks/useLoginUser';
import Navbar from '../Navbar';

const LoginPage = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });

    // FIX 1: Correctly destructure the 'login' function and 'isLoading' state from the hook.
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

        // FIX 2: Simply call the mutation function with the form data.
        // The success, error, and navigation logic is already handled inside the useLoginUser hook.
        loginUser(formData);
    };

    return (
        <>
            <Navbar />
            <div className="pt-24 min-h-screen flex items-center justify-center bg-gray-50">
                <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg m-4">
                    <div className="text-center mb-8">
                        <Link to="/">
                            <img
                                src={logo}
                                alt="Logo"
                                className="h-12 w-auto mx-auto"
                            />
                        </Link>
                        <h1 className="text-3xl font-bold text-gray-800 mt-4">Welcome Back!</h1>
                        <p className="text-gray-500 mt-2">Please enter your details to sign in.</p>
                    </div>

                    <form className="space-y-6" onSubmit={handleSubmit}>
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
                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg transition duration-300 flex items-center justify-center disabled:opacity-60"
                            >
                                {isLoading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Signing in...
                                    </>
                                ) : (
                                    'Login'
                                )}
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
