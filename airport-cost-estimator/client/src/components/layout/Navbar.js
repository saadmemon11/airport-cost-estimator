import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    setMenuOpen(false);
    logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  const isActive = (path) => location.pathname.startsWith(path);
  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';

  return (
    <nav style={{
      background: '#0B1628',
      borderBottom: '1px solid rgb(255 255 255 / 0.08)',
      position: 'sticky', top: 0, zIndex: 100,
      boxShadow: '0 2px 20px rgb(0 0 0 / 0.3)'
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', height: 58, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

        {/* Logo */}
        <Link to={user ? '/dashboard' : '/'} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: '#F5A623', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgb(245 166 35 / 0.4)' }}>
            <span className="mi-round mi-sm" style={{ color: '#0B1628', fontWeight: 900 }}>flight</span>
          </div>
          <div>
            <span style={{ fontFamily: 'Syne, sans-serif', fontSize: 17, fontWeight: 800, color: '#fff', letterSpacing: '-0.01em' }}>Air</span>
            <span style={{ fontFamily: 'Syne, sans-serif', fontSize: 17, fontWeight: 800, color: '#F5A623', letterSpacing: '-0.01em' }}>Cost</span>
          </div>
        </Link>

        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Link
              to="/dashboard"
              style={{
                textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6,
                padding: '6px 12px', borderRadius: 8, fontSize: 13, fontWeight: 500,
                color: isActive('/dashboard') || isActive('/projects') ? '#F5A623' : 'rgb(255 255 255 / 0.65)',
                background: isActive('/dashboard') || isActive('/projects') ? 'rgb(245 166 35 / 0.1)' : 'transparent',
                transition: 'all 0.15s',
                fontFamily: 'IBM Plex Sans, sans-serif',
              }}
            >
              <span className="mi-outlined mi-sm">grid_view</span>
              Projects
            </Link>

            <div style={{ position: 'relative', marginLeft: 4 }}>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '5px 10px 5px 8px', borderRadius: 8,
                  border: '1px solid rgb(255 255 255 / 0.12)',
                  background: menuOpen ? 'rgb(255 255 255 / 0.08)' : 'rgb(255 255 255 / 0.04)',
                  cursor: 'pointer', fontFamily: 'IBM Plex Sans, sans-serif', fontSize: 13,
                  color: '#fff', transition: 'all 0.15s',
                }}
              >
                <div style={{ width: 26, height: 26, borderRadius: '50%', background: '#F5A623', color: '#0B1628', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, letterSpacing: '-0.02em' }}>
                  {initials}
                </div>
                <span style={{ maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', opacity: 0.85 }}>{user.name}</span>
                <span className="mi-outlined" style={{ fontSize: 16, color: 'rgb(255 255 255 / 0.5)', transition: 'transform 0.15s', transform: menuOpen ? 'rotate(180deg)' : 'rotate(0)' }}>expand_more</span>
              </button>

              {menuOpen && (
                <>
                  <div onClick={() => setMenuOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 199 }} />
                  <div style={{ position: 'absolute', right: 0, top: 'calc(100% + 8px)', background: '#fff', border: '1px solid #E2E8F0', borderRadius: 14, boxShadow: '0 20px 60px rgb(11 22 40 / 0.18)', padding: '6px', minWidth: 228, zIndex: 200 }}>
                    {/* User card */}
                    <div style={{ padding: '12px 14px 10px', borderBottom: '1px solid #F1F5F9', marginBottom: 4 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 38, height: 38, borderRadius: '50%', background: '#0B1628', color: '#F5A623', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, fontFamily: 'Syne, sans-serif', flexShrink: 0 }}>
                          {initials}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 13, fontWeight: 700, color: '#0F172A', fontFamily: 'Syne, sans-serif', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.name}</div>
                          <div style={{ fontSize: 11, color: '#94A3B8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: 1 }}>{user.email}</div>
                        </div>
                      </div>
                      {user.organization && (
                        <div style={{ fontSize: 11, color: '#64748B', marginTop: 8, display: 'flex', alignItems: 'center', gap: 4, background: '#F8FAFC', padding: '4px 8px', borderRadius: 6 }}>
                          <span className="mi-outlined" style={{ fontSize: 13, color: '#94A3B8' }}>business</span>
                          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.organization}</span>
                        </div>
                      )}
                    </div>

                    {/* Links */}
                    {[
                      { to: '/dashboard', icon: 'grid_view', label: 'My Projects' },
                      { to: '/profile',   icon: 'manage_accounts', label: 'Account Settings' },
                    ].map(item => (
                      <Link key={item.to} to={item.to} onClick={() => setMenuOpen(false)} style={{ textDecoration: 'none' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', borderRadius: 8, cursor: 'pointer', color: '#334155', fontSize: 13, fontWeight: 500, transition: 'all 0.1s', fontFamily: 'IBM Plex Sans, sans-serif' }}
                          onMouseEnter={e => { e.currentTarget.style.background = '#F8FAFC'; e.currentTarget.style.color = '#0B1628'; }}
                          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#334155'; }}>
                          <span className="mi-outlined mi-sm" style={{ color: '#94A3B8' }}>{item.icon}</span>
                          {item.label}
                        </div>
                      </Link>
                    ))}

                    <div style={{ height: 1, background: '#F1F5F9', margin: '4px 0' }} />
                    <div onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', borderRadius: 8, cursor: 'pointer', color: '#DC2626', fontSize: 13, fontWeight: 500, transition: 'all 0.1s', fontFamily: 'IBM Plex Sans, sans-serif' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#FFF1F2'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      <span className="mi-outlined mi-sm" style={{ color: '#DC2626' }}>logout</span>
                      Sign Out
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Link to="/login" style={{ textDecoration: 'none', padding: '6px 14px', borderRadius: 8, fontSize: 13, fontWeight: 500, color: 'rgb(255 255 255 / 0.7)', fontFamily: 'IBM Plex Sans, sans-serif', transition: 'color 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.color = '#fff'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgb(255 255 255 / 0.7)'}>
              Sign in
            </Link>
            <Link to="/register" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6, padding: '7px 16px', background: '#F5A623', color: '#0B1628', borderRadius: 8, fontSize: 13, fontWeight: 700, fontFamily: 'Syne, sans-serif', transition: 'all 0.15s', boxShadow: '0 2px 8px rgb(245 166 35 / 0.35)' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#FBBF24'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#F5A623'; e.currentTarget.style.transform = 'translateY(0)'; }}>
              Get started
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
