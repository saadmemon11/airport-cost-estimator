import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const RegisterPage = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', organization: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { register } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.name || !form.email || !form.password) { setError('Name, email and password are required'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      await register(form);
      toast.success('Account created! Welcome to AirCost.');
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 58px)', display: 'flex', background: '#F8FAFC' }}>
      {/* Left panel */}
      <div className="sky-bg" style={{ width: 380, flexShrink: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '48px 40px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -60, left: -60, width: 260, height: 260, borderRadius: '50%', background: 'radial-gradient(circle, rgb(245 166 35 / 0.08) 0%, transparent 70%)' }} />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'repeating-linear-gradient(90deg, #F5A623 0, #F5A623 16px, transparent 16px, transparent 28px)' }} />
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontSize: 10, color: 'rgb(245 166 35 / 0.6)', fontFamily: 'IBM Plex Mono, monospace', letterSpacing: '0.1em', marginBottom: 20 }}>GATE A1 · BOARDING NOW</div>
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: 26, fontWeight: 800, color: '#fff', marginBottom: 10, letterSpacing: '-0.02em', lineHeight: 1.15 }}>
            Join aviation teams planning billion-dollar projects
          </h2>
          <p style={{ fontSize: 13, color: 'rgb(255 255 255 / 0.45)', lineHeight: 1.7, fontFamily: 'IBM Plex Sans, sans-serif', fontWeight: 300 }}>
            From government bodies to private developers — AirCost helps you estimate every dollar before you break ground.
          </p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {[
            { icon: 'timer',            label: 'Setup in under 2 minutes' },
            { icon: 'folder_special',   label: '10 ready-to-use templates' },
            { icon: 'lock',             label: 'Your data stays private' },
            { icon: 'currency_exchange',label: 'Multi-currency support' },
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 30, height: 30, borderRadius: 8, background: 'rgb(245 166 35 / 0.1)', border: '1px solid rgb(245 166 35 / 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span className="mi-outlined" style={{ fontSize: 16, color: '#F5A623' }}>{item.icon}</span>
              </div>
              <span style={{ fontSize: 13, color: 'rgb(255 255 255 / 0.6)', fontFamily: 'IBM Plex Sans, sans-serif' }}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right — form */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 24px' }}>
        <div style={{ width: '100%', maxWidth: 420 }}>
          <div style={{ marginBottom: 32 }}>
            <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: 28, fontWeight: 800, color: '#0B1628', letterSpacing: '-0.02em', marginBottom: 6 }}>Create your account</h1>
            <p style={{ color: '#94A3B8', fontSize: 14, fontFamily: 'IBM Plex Sans, sans-serif' }}>Free forever · No credit card needed</p>
          </div>

          {error && (
            <div style={{ padding: '12px 14px', background: '#FFF1F2', border: '1px solid #FECACA', borderRadius: 10, color: '#DC2626', fontSize: 13, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className="mi-outlined mi-sm">error_outline</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div className="input-group" style={{ gridColumn: '1 / -1' }}>
                <label className="input-label">Full Name *</label>
                <div style={{ position: 'relative' }}>
                  <span className="mi-outlined" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#CBD5E1', fontSize: 18, pointerEvents: 'none' }}>person</span>
                  <input className="input" type="text" placeholder="Alex Johnson" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={{ paddingLeft: 36 }} />
                </div>
              </div>
              <div className="input-group" style={{ gridColumn: '1 / -1' }}>
                <label className="input-label">Email Address *</label>
                <div style={{ position: 'relative' }}>
                  <span className="mi-outlined" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#CBD5E1', fontSize: 18, pointerEvents: 'none' }}>email</span>
                  <input className="input" type="email" placeholder="you@organization.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} style={{ paddingLeft: 36 }} />
                </div>
              </div>
              <div className="input-group" style={{ gridColumn: '1 / -1' }}>
                <label className="input-label">Organization <span style={{ color: '#CBD5E1', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(optional)</span></label>
                <div style={{ position: 'relative' }}>
                  <span className="mi-outlined" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#CBD5E1', fontSize: 18, pointerEvents: 'none' }}>business</span>
                  <input className="input" type="text" placeholder="Ministry of Aviation / ACME Aviation Ltd" value={form.organization} onChange={e => setForm({ ...form, organization: e.target.value })} style={{ paddingLeft: 36 }} />
                </div>
              </div>
              <div className="input-group" style={{ gridColumn: '1 / -1' }}>
                <label className="input-label">Password *</label>
                <div style={{ position: 'relative' }}>
                  <span className="mi-outlined" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#CBD5E1', fontSize: 18, pointerEvents: 'none' }}>lock</span>
                  <input className="input" type="password" placeholder="Min. 6 characters" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} style={{ paddingLeft: 36 }} />
                </div>
              </div>
            </div>
            <button type="submit" disabled={loading} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '12px 20px', background: '#F5A623', color: '#0B1628', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 800, fontFamily: 'Syne, sans-serif', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, transition: 'all 0.15s', boxShadow: '0 4px 16px rgb(245 166 35 / 0.35)', marginTop: 4 }}>
              {loading
                ? <><div className="spinner spinner-sm" style={{ borderTopColor: '#0B1628', borderColor: 'rgb(11 22 40 / 0.2)' }} />Creating account...</>
                : <><span className="mi-outlined mi-sm">person_add</span>Create account</>
              }
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: 12, color: '#CBD5E1', marginTop: 16, fontFamily: 'IBM Plex Sans, sans-serif' }}>
            By creating an account you agree to our Terms of Service.
          </p>
          <p style={{ textAlign: 'center', fontSize: 13, color: '#94A3B8', marginTop: 16, fontFamily: 'IBM Plex Sans, sans-serif' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#0B1628', fontWeight: 700, textDecoration: 'none', fontFamily: 'Syne, sans-serif' }}>Sign in →</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
