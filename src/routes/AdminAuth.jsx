// src/components/AdminAuth.jsx
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AdminAuth = ({ children }) => {
  const { user, isAdmin, loading } = useAuth();
  const location = useLocation();

  // Optionally show loading spinner
  if (loading) return <div>Loading...</div>;

  // Only allow if admin
  if (user && isAdmin) return children;

  // If not admin or not logged in, redirect (change destination as you wish)
  return <Navigate to="/login" state={{ from: location }} replace />;
};

export default AdminAuth;
