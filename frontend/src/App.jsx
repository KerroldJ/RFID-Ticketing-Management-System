import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from "./auth/Login";
import Layout from "./admin/components/Layout";
import AdminDashboard from "./admin/AdminDashboard";
import ManageCards from "./admin/ManageCards";
import History from "./admin/History";
import Settings from "./admin/Settings";
import StaffLayout from "./staff/components/StaffLayout";
import StaffDashboard from "./staff/StaffDashboard";
import ScanCards from "./staff/ScanCards";
import StaffHistory from "./staff/StaffHistory";

const getUserRole = () => {
  return localStorage.getItem('userRole');
};
const isAuthenticated = () => {
  return !!getUserRole();
};
const ProtectedRoute = ({ children, requiredRole }) => {
  const userRole = getUserRole();
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  const userRole = getUserRole();

  return (
    <Router>
      <Routes>
        {/* AUTHENTICATION: Handle login redirects */}
        <Route
          path="/"
          element={
            userRole
              ? (userRole === 'admin' ? <Navigate to="/admin" /> : <Navigate to="/staff" />)
              : <Navigate to="/login" />
          }
        />

        {/* Login Route */}
        <Route path="/login" element={<Login />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<Layout />}>
          <Route index element={<ProtectedRoute requiredRole="admin"><AdminDashboard /></ProtectedRoute>} />
          <Route path="manage-card" element={<ProtectedRoute requiredRole="admin"><ManageCards /></ProtectedRoute>} />
          <Route path="history" element={<ProtectedRoute requiredRole="admin"><History /></ProtectedRoute>} />
          <Route path="settings" element={<ProtectedRoute requiredRole="admin"><Settings /></ProtectedRoute>}/>
        </Route>

        {/* Staff Routes */}
        <Route path="/staff" element={<StaffLayout />} >
          <Route index element={<ProtectedRoute requiredRole="staff"><StaffDashboard/></ProtectedRoute>}/>
          <Route path="scan-card" element={<ProtectedRoute requiredRole="staff"><ScanCards /></ProtectedRoute>}/>
          <Route path="history" element={<ProtectedRoute requiredRole="staff"><StaffHistory /></ProtectedRoute>} />
        </Route>

        {/* Catch-all route */}
        <Route path="/*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
