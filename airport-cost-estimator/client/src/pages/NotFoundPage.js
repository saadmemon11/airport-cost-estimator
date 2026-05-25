import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NotFoundPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: 'calc(100vh - 56px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ textAlign: 'center', maxWidth: 480 }}>
        <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#f3f4f6', border: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
          <span className="mi-outlined mi-2xl" style={{ color: '#d1d5db' }}>flight_off</span>
        </div>
        <div className="font-mono" style={{ fontSize: 64, fontWeight: 500, color: '#e5e7eb', lineHeight: 1, marginBottom: 16 }}>404</div>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#111827', marginBottom: 8 }}>Page not found</h1>
        <p style={{ color: '#9ca3af', fontSize: 15, lineHeight: 1.6, marginBottom: 32 }}>
          This runway doesn't exist. The page you're looking for may have been moved, deleted, or never existed.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <button className="btn btn-secondary" onClick={() => navigate(-1)}>
            <span className="mi-outlined mi-sm">arrow_back</span>
            Go Back
          </button>
          <Link to={user ? '/dashboard' : '/'} className="btn btn-primary">
            <span className="mi-outlined mi-sm" style={{ color: '#fff' }}>home</span>
            {user ? 'Go to Dashboard' : 'Go Home'}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
