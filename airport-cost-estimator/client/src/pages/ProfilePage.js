import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../utils/api';

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const toast = useToast();
  const [form, setForm] = useState({ name: user?.name || '', organization: user?.organization || '' });
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [saving, setSaving] = useState(false);
  const [savingPw, setSavingPw] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) { toast.error('Name is required'); return; }
    setSaving(true);
    try {
      await api.put('/api/auth/profile', form);
      toast.success('Profile updated successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally { setSaving(false); }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!pwForm.currentPassword || !pwForm.newPassword) { toast.error('All password fields are required'); return; }
    if (pwForm.newPassword.length < 6) { toast.error('New password must be at least 6 characters'); return; }
    if (pwForm.newPassword !== pwForm.confirmPassword) { toast.error('Passwords do not match'); return; }
    setSavingPw(true);
    try {
      await api.put('/api/auth/password', pwForm);
      toast.success('Password changed successfully');
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    } finally { setSavingPw(false); }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: 'person' },
    { id: 'security', label: 'Security', icon: 'lock' },
  ];

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '32px 24px 64px' }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#111827', marginBottom: 4 }}>Account Settings</h1>
        <p style={{ color: '#9ca3af', fontSize: 14 }}>Manage your profile and account preferences</p>
      </div>

      {/* Avatar + info */}
      <div className="card" style={{ padding: '24px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 20 }}>
        <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#111827', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 700, flexShrink: 0, letterSpacing: '-0.02em' }}>
          {initials}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: '#111827' }}>{user?.name}</div>
          <div style={{ fontSize: 14, color: '#9ca3af', marginTop: 2, display: 'flex', alignItems: 'center', gap: 4 }}>
            <span className="mi-outlined mi-sm">email</span>
            {user?.email}
          </div>
          {user?.organization && (
            <div style={{ fontSize: 13, color: '#9ca3af', marginTop: 3, display: 'flex', alignItems: 'center', gap: 4 }}>
              <span className="mi-outlined mi-sm">business</span>
              {user.organization}
            </div>
          )}
        </div>
        <div>
          <span className="badge badge-blue" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span className="mi-outlined" style={{ fontSize: 11 }}>verified</span>
            {user?.role || 'user'}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid #e5e7eb', marginBottom: 20 }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} style={{ padding: '10px 18px', border: 'none', background: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 14, fontWeight: 500, color: activeTab === t.id ? '#111827' : '#9ca3af', borderBottom: `2px solid ${activeTab === t.id ? '#111827' : 'transparent'}`, marginBottom: -1, display: 'flex', alignItems: 'center', gap: 6, transition: 'all 0.15s' }}>
            <span className="mi-outlined mi-sm">{t.icon}</span>
            {t.label}
          </button>
        ))}
      </div>

      {/* Profile tab */}
      {activeTab === 'profile' && (
        <div className="card" style={{ padding: 28 }}>
          <h2 style={{ fontSize: 15, fontWeight: 600, color: '#111827', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className="mi-outlined mi-sm">person</span>
            Personal Information
          </h2>
          <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="input-group" style={{ gridColumn: '1 / -1' }}>
                <label className="input-label">
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span className="mi-outlined mi-sm" style={{ color: '#9ca3af' }}>badge</span>
                    Full Name *
                  </span>
                </label>
                <input className="input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Your full name" />
              </div>
              <div className="input-group" style={{ gridColumn: '1 / -1' }}>
                <label className="input-label">
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span className="mi-outlined mi-sm" style={{ color: '#9ca3af' }}>email</span>
                    Email Address
                  </span>
                </label>
                <input className="input" value={user?.email || ''} disabled style={{ background: '#f9fafb', color: '#9ca3af', cursor: 'not-allowed' }} />
                <span style={{ fontSize: 11, color: '#9ca3af', marginTop: 2 }}>Email cannot be changed</span>
              </div>
              <div className="input-group" style={{ gridColumn: '1 / -1' }}>
                <label className="input-label">
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span className="mi-outlined mi-sm" style={{ color: '#9ca3af' }}>business</span>
                    Organization
                  </span>
                </label>
                <input className="input" value={form.organization} onChange={e => setForm({ ...form, organization: e.target.value })} placeholder="Ministry / Company / Agency" />
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: 4 }}>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving
                  ? <><div className="spinner spinner-sm" style={{ borderTopColor: '#fff' }} />Saving...</>
                  : <><span className="mi-outlined mi-sm" style={{ color: '#fff' }}>save</span>Save Changes</>
                }
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Security tab */}
      {activeTab === 'security' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card" style={{ padding: 28 }}>
            <h2 style={{ fontSize: 15, fontWeight: 600, color: '#111827', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className="mi-outlined mi-sm">lock_reset</span>
              Change Password
            </h2>
            <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="input-group">
                <label className="input-label">
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span className="mi-outlined mi-sm" style={{ color: '#9ca3af' }}>lock</span>
                    Current Password
                  </span>
                </label>
                <input className="input" type="password" placeholder="Enter current password" value={pwForm.currentPassword} onChange={e => setPwForm({ ...pwForm, currentPassword: e.target.value })} />
              </div>
              <div className="input-group">
                <label className="input-label">
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span className="mi-outlined mi-sm" style={{ color: '#9ca3af' }}>lock_open</span>
                    New Password
                  </span>
                </label>
                <input className="input" type="password" placeholder="Min. 6 characters" value={pwForm.newPassword} onChange={e => setPwForm({ ...pwForm, newPassword: e.target.value })} />
              </div>
              <div className="input-group">
                <label className="input-label">
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span className="mi-outlined mi-sm" style={{ color: '#9ca3af' }}>check_circle</span>
                    Confirm New Password
                  </span>
                </label>
                <input className="input" type="password" placeholder="Repeat new password" value={pwForm.confirmPassword} onChange={e => setPwForm({ ...pwForm, confirmPassword: e.target.value })} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button type="submit" className="btn btn-primary" disabled={savingPw}>
                  {savingPw
                    ? <><div className="spinner spinner-sm" style={{ borderTopColor: '#fff' }} />Updating...</>
                    : <><span className="mi-outlined mi-sm" style={{ color: '#fff' }}>lock_reset</span>Update Password</>
                  }
                </button>
              </div>
            </form>
          </div>

          <div className="card" style={{ padding: 24, border: '1px solid #fecaca', background: '#fff5f5' }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: '#dc2626', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
              <span className="mi-outlined mi-sm">logout</span>
              Sign Out
            </h3>
            <p style={{ fontSize: 13, color: '#9ca3af', marginBottom: 14 }}>
              Sign out of your AirCost account on this device.
            </p>
            <button className="btn btn-danger" onClick={() => { logout(); window.location.href = '/'; }}>
              <span className="mi-outlined mi-sm">logout</span>
              Sign Out Now
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
