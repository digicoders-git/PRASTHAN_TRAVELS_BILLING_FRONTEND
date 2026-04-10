import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Import All Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import BillList from './pages/BillList';
import AddBill from './pages/AddBill';
import ViewBill from './pages/ViewBill';
import Customers from './pages/Customers';
import Reports from './pages/Reports';
import Settings from './pages/Settings';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-[#fcfbf9]">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-[#581c44] border-t-transparent"></div>
    </div>
  );
  return user ? children : <Navigate to="/login" />;
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Auth Route */}
          <Route path="/login" element={<Login />} />
          
          {/* Protected Routes */}
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/bills" element={<ProtectedRoute><BillList /></ProtectedRoute>} />
          <Route path="/add-gst-bill" element={<ProtectedRoute><AddBill isGst={true} /></ProtectedRoute>} />
          <Route path="/add-nongst-bill" element={<ProtectedRoute><AddBill isGst={false} /></ProtectedRoute>} />
          <Route path="/add-bill" element={<ProtectedRoute><AddBill /></ProtectedRoute>} />
          <Route path="/view-bill/:id" element={<ProtectedRoute><ViewBill /></ProtectedRoute>} />
          <Route path="/customers" element={<ProtectedRoute><Customers /></ProtectedRoute>} />
          <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          
          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        <ToastContainer 
            position="top-right" 
            autoClose={3000} 
            hideProgressBar={false}
            newestOnTop={true}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
        />
      </Router>
    </AuthProvider>
  );
};

export default App;
