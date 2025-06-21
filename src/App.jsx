



// import React, { useContext } from 'react';
// import { Route, Routes, Navigate, useLocation } from 'react-router-dom';

// import { AuthPage } from './pages/authPage';
// import { AuthContext } from './auth/AuthContext';
// import ProtectedRoute from './routers/ProtectedRoutes';
// import HomePage from './pages/HomePage';
// import AdminDashboard from './pages/AdminDashboard';
// import NavBar from './components/Navbar';
// import Footer from './components/Footer';

// function App() {
//   const { user } = useContext(AuthContext);
//   const location = useLocation();

//    console.log("User object in App:", user);

//   return (
//     <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
//       {!user && <NavBar />}

//       <main className="flex-grow w-full">
//         <Routes>
//           <Route
//             path="/"
//             element={!user ? <HomePage /> : <Navigate to="/dashboard" replace />}
//           />
//           <Route
//             path="/login"
//             element={!user ? <AuthPage /> : <Navigate to="/dashboard" replace />}
//           />
//           <Route
//             path="/register"
//             element={!user ? <AuthPage /> : <Navigate to="/dashboard" replace />}
//           />
//           <Route
//             path="/dashboard"
//             element={
//               <ProtectedRoute>
//                 {user?.role === 'admin' ? (
//                   <AdminDashboard />
//                 ) : (
//                   <p>I am at user dashboard</p>
//                 )}
//               </ProtectedRoute>
//             }
//           />
//           <Route path="*" element={<Navigate to="/" replace />} />
//         </Routes>
//       </main>

//       {!user && <Footer />}
//     </div>
//   );
// }


import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './auth/AuthContext.jsx';
import ProtectedRoute from './routers/ProtectedRoutes.jsx';
import HomePage from './pages/HomePage.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import UserDashboard from './pages/UserDashboard.jsx';
import AuthPage from './pages/authPage.jsx';
import MainLayout from './layouts/MainLayout.jsx';

export default function App() {
  const { user } = useContext(AuthContext);

  return (
    <Routes>
      <Route path="/" element={<MainLayout><HomePage /></MainLayout>} />
      <Route path="/login" element={!user ? <AuthPage /> : <Navigate to="/dashboard" replace />} />
      <Route path="/register" element={!user ? <AuthPage /> : <Navigate to="/dashboard" replace />} />
      
      <Route
        path="/dashboard/*"
        element={
          <ProtectedRoute>
            {user?.role === 'admin' ? <AdminDashboard /> : <UserDashboard />}
          </ProtectedRoute>
        }
      />
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
