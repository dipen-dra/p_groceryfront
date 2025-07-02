// import React, { useContext } from 'react';
// import { Routes, Route, Navigate } from 'react-router-dom';
// import { AuthContext } from './auth/AuthContext.jsx'; 
// import ProtectedRoute from './routers/ProtectedRoutes.jsx'; 
// import MainLayout from './layouts/MainLayout.jsx'; 

// // --- Import all your page components ---
// import HomePage from './pages/HomePage.jsx';
// import AdminDashboard from './pages/AdminDashboard.jsx';
// import UserDashboard from './pages/UserDashboard.jsx';
// import LoginPage from './components/auth/LoginPage.jsx';
// import SignupPage from './components/auth/SignupPage.jsx';
// import CheckoutPage from './pages/CheckoutPage.jsx';
// import EsewaVerifyPage from './pages/EsewaVerifyPage.jsx';


// export default function App() {
//   const { user } = useContext(AuthContext);

//   return (
//     <Routes>
//       {/* --- PUBLIC ROUTES --- */}
//       <Route path="/" element={<MainLayout><HomePage /></MainLayout>} />
      
//       {/* --- AUTH ROUTES --- */}
//       <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/dashboard" replace />} />
//       <Route path="/register" element={!user ? <SignupPage /> : <Navigate to="/dashboard" replace />} />
      
//       {/* --- PROTECTED ROUTES --- */}

//       <Route
//         path="/checkout"
//         element={
//           <ProtectedRoute>
//             <MainLayout>
//               <CheckoutPage />
//             </MainLayout>
//           </ProtectedRoute>
//         }
//       />

//       {/* 🟢 THE DEFINITIVE FIX IS HERE 🟢 */}
//       {/* We remove <MainLayout> to prevent any other component from interfering. */}
//       {/* This page is now completely isolated. */}
//       <Route
//         path="/payment/verify"
//         element={
//           <ProtectedRoute>
//             <EsewaVerifyPage />
//           </ProtectedRoute>
//         }
//       />

//       {/* DASHBOARD ROUTE */}
//       <Route
//         path="/dashboard/*"
//         element={
//           <ProtectedRoute>
//             {user?.role === 'admin' ? <AdminDashboard /> : <UserDashboard />}
//           </ProtectedRoute>
//         }
//       />
      
//       {/* CATCH-ALL ROUTE */}
//       <Route path="*" element={<Navigate to="/" replace />} />
//     </Routes>
//   );
// }

import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './auth/AuthContext.jsx'; 
import PrivateRoute from './auth/PrivateRoute.jsx'; // Using your PrivateRoute component
import MainLayout from './layouts/MainLayout.jsx'; 

// --- Import all your page components ---
import HomePage from './pages/HomePage.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import UserDashboard from './pages/UserDashboard.jsx';
import LoginPage from './components/auth/LoginPage.jsx';
import SignupPage from './components/auth/SignupPage.jsx';
import CheckoutPage from './pages/CheckoutPage.jsx';

// --- NEW/MODIFIED IMPORTS ---
// 1. Import the new PaymentSuccessPage
import { PaymentSuccessPage } from './pages/PaymentSuccessPage.jsx'; 
// 2. The old EsewaVerifyPage is no longer needed.


export default function App() {
  const { user } = useContext(AuthContext);

  return (
    <Routes>
      {/* --- PUBLIC ROUTES --- */}
      <Route path="/" element={<MainLayout><HomePage /></MainLayout>} />
      
      {/* --- AUTH ROUTES --- */}
      {/* These routes correctly prevent logged-in users from seeing login/register pages */}
      <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/dashboard" replace />} />
      <Route path="/register" element={!user ? <SignupPage /> : <Navigate to="/dashboard" replace />} />
      
      {/* --- PROTECTED ROUTES --- */}

      <Route
        path="/checkout"
        element={
          <PrivateRoute>
            <MainLayout>
              <CheckoutPage />
            </MainLayout>
          </PrivateRoute>
        }
      />

      {/* --- NEW/MODIFIED ROUTE --- */}
      {/* 3. This is the new route for handling successful eSewa payments. */}
      {/* It uses the correct path '/payment-success' and the correct component 'PaymentSuccessPage'. */}
      {/* It is correctly wrapped in a PrivateRoute. We intentionally omit MainLayout for a clean loading screen. */}
      <Route
        path="/payment-success"
        element={
          <PrivateRoute>
            <PaymentSuccessPage />
          </PrivateRoute>
        }
      />

      {/* DASHBOARD ROUTE */}
      {/* This logic correctly directs users to their respective dashboards. */}
      <Route
        path="/dashboard/*"
        element={
          <PrivateRoute>
            {user?.role === 'admin' ? <AdminDashboard /> : <UserDashboard />}
          </PrivateRoute>
        }
      />
      
      {/* CATCH-ALL ROUTE */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}