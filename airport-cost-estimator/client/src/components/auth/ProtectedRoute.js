import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return (
    <div className="page-loading">
      <div style={{ textAlign: 'center' }}>
        <div className="spinner" style={{ margin: '0 auto 12px' }} />
        <div style={{ color: '#9ca3af', fontSize: 14 }}>Loading...</div>
      </div>
    </div>
  );

  return user ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
