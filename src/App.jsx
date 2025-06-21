


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
