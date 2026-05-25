import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const LoginPage = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.email || !form.password) { setError('Please fill all fields'); return; }
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 58px)', display: 'flex', background: '#F8FAFC' }}>
      {/* Left panel — dark brand */}
      <div className="sky-bg" style={{ width: 380, flexShrink: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '48px 40px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', bottom: -80, right: -80, width: 280, height: 280, borderRadius: '50%', background: 'radial-gradient(circle, rgb(245 166 35 / 0.1) 0%, transparent 70%)' }} />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'repeating-linear-gradient(90deg, #F5A623 0, #F5A623 16px, transparent 16px, transparent 28px)' }} />
        <div style={{ marginBottom: 40 }}>
          <div style={{ width: 52, height: 52, borderRadius: 14, background: '#F5A623', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24, boxShadow: '0 4px 16px rgb(245 166 35 / 0.35)' }}>
            <span className="mi-round mi-xl" style={{ color: '#0B1628' }}>flight</span>
          </div>
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: 28, fontWeight: 800, color: '#fff', marginBottom: 10, letterSpacing: '-0.02em', lineHeight: 1.1 }}>
            Your command center for airport costs
          </h2>
          <p style={{ fontSize: 13, color: 'rgb(255 255 255 / 0.5)', lineHeight: 1.7, fontFamily: 'IBM Plex Sans, sans-serif', fontWeight: 300 }}>
            Model every department, every cost item, from runway to routers — all in one structured platform.
          </p>
        </div>
        {[
          { icon: 'check_circle', text: '10 pre-built department templates' },
          { icon: 'check_circle', text: 'Real-time cost summaries & charts' },
          { icon: 'check_circle', text: 'Multi-currency project support' },
        ].map((item, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <span className="mi-round mi-sm" style={{ color: '#F5A623', flexShrink: 0 }}>{item.icon}</span>
            <span style={{ fontSize: 13, color: 'rgb(255 255 255 / 0.65)', fontFamily: 'IBM Plex Sans, sans-serif' }}>{item.text}</span>
          </div>
        ))}
        <div style={{ marginTop: 40 }}>
          <div style={{ display: 'flex', gap: 3 }}>
            {[...Array(6)].map((_, i) => (
              <div key={i} style={{ height: 3, flex: 1, borderRadius: 999, background: i < 2 ? '#F5A623' : 'rgb(255 255 255 / 0.1)' }} />
            ))}
          </div>
          <div style={{ fontSize: 10, color: 'rgb(255 255 255 / 0.25)', marginTop: 6, fontFamily: 'IBM Plex Mono, monospace', letterSpacing: '0.06em' }}>RWY-01L · CLEARED TO LAND</div>
        </div>
      </div>

      {/* Right — form */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 24px' }}>
        <div style={{ width: '100%', maxWidth: 400 }}>
          <div style={{ marginBottom: 36 }}>
            <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: 28, fontWeight: 800, color: '#0B1628', letterSpacing: '-0.02em', marginBottom: 6 }}>Sign in</h1>
            <p style={{ color: '#94A3B8', fontSize: 14, fontFamily: 'IBM Plex Sans, sans-serif' }}>Welcome back to AirCost</p>
          </div>

          {error && (
            <div style={{ padding: '12px 14px', background: '#FFF1F2', border: '1px solid #FECACA', borderRadius: 10, color: '#DC2626', fontSize: 13, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'IBM Plex Sans, sans-serif' }}>
              <span className="mi-outlined mi-sm">error_outline</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div className="input-group">
              <label className="input-label">Email Address</label>
              <div style={{ position: 'relative' }}>
                <span className="mi-outlined" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#CBD5E1', fontSize: 18, pointerEvents: 'none' }}>email</span>
                <input className="input" type="email" placeholder="you@organization.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} style={{ paddingLeft: 36 }} autoComplete="email" />
              </div>
            </div>
            <div className="input-group">
              <label className="input-label">Password</label>
              <div style={{ position: 'relative' }}>
                <span className="mi-outlined" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#CBD5E1', fontSize: 18, pointerEvents: 'none' }}>lock</span>
                <input className="input" type="password" placeholder="••••••••" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} style={{ paddingLeft: 36 }} autoComplete="current-password" />
              </div>
            </div>

            <button type="submit" disabled={loading} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '12px 20px', background: '#0B1628', color: '#fff', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 700, fontFamily: 'Syne, sans-serif', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, transition: 'all 0.15s', boxShadow: '0 4px 12px rgb(11 22 40 / 0.2)', marginTop: 4 }}>
              {loading ? (
                <><div className="spinner spinner-sm spinner-white" />Signing in...</>
              ) : (
                <><span className="mi-outlined mi-sm" style={{ color: '#fff' }}>login</span>Sign in</>
              )}
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: 13, color: '#94A3B8', marginTop: 24, fontFamily: 'IBM Plex Sans, sans-serif' }}>
            No account?{' '}
            <Link to="/register" style={{ color: '#0B1628', fontWeight: 700, textDecoration: 'none', fontFamily: 'Syne, sans-serif' }}>Create one free →</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
