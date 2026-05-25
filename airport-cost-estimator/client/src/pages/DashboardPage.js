import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api, { formatCurrency, calcProjectTotal, STATUS_COLORS } from '../utils/api';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';

const AIRPORT_TYPES = ['international','domestic','regional','private','cargo','military','heliport'];
const CURRENCIES   = ['USD','EUR','GBP','INR','AED','SAR','JPY','CNY','CAD','AUD'];

const CreateProjectModal = ({ onClose, onCreated }) => {
  const [form, setForm] = useState({ name: '', description: '', location: '', country: '', airportType: 'international', currency: 'USD', runwayCount: 1, expectedPassengersPerYear: 0, globalContingency: 10 });
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) { toast.error('Project name is required'); return; }
    setLoading(true);
    try {
      const res = await api.post('/api/projects', form);
      toast.success('Project created!');
      onCreated(res.data.project);
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to create project'); }
    finally { setLoading(false); }
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal modal-lg">
        <div className="modal-header" style={{ borderBottom: '1px solid #F1F5F9', paddingBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: '#0B1628', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span className="mi-outlined mi-sm" style={{ color: '#F5A623' }}>add_circle</span>
            </div>
            <div>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: '#0B1628', fontFamily: 'Syne, sans-serif' }}>New Airport Project</h2>
              <p style={{ fontSize: 12, color: '#94A3B8', fontFamily: 'IBM Plex Sans, sans-serif', marginTop: 1 }}>Fill in the details to create your project block</p>
            </div>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={onClose}><span className="mi-outlined">close</span></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div className="input-group" style={{ gridColumn: '1 / -1' }}>
                <label className="input-label">Project Name *</label>
                <input className="input" placeholder="e.g., New International Airport Terminal 2" value={form.name} onChange={e => setForm({...form, name: e.target.value})} autoFocus />
              </div>
              <div className="input-group" style={{ gridColumn: '1 / -1' }}>
                <label className="input-label">Description</label>
                <textarea className="input" rows={2} placeholder="Brief description of the airport project..." value={form.description} onChange={e => setForm({...form, description: e.target.value})} style={{ resize: 'vertical' }} />
              </div>
              <div className="input-group">
                <label className="input-label">City / Location</label>
                <input className="input" placeholder="e.g., Mumbai" value={form.location} onChange={e => setForm({...form, location: e.target.value})} />
              </div>
              <div className="input-group">
                <label className="input-label">Country</label>
                <input className="input" placeholder="e.g., India" value={form.country} onChange={e => setForm({...form, country: e.target.value})} />
              </div>
              <div className="input-group">
                <label className="input-label">Airport Type</label>
                <select className="input" value={form.airportType} onChange={e => setForm({...form, airportType: e.target.value})}>
                  {AIRPORT_TYPES.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                </select>
              </div>
              <div className="input-group">
                <label className="input-label">Currency</label>
                <select className="input" value={form.currency} onChange={e => setForm({...form, currency: e.target.value})}>
                  {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="input-group">
                <label className="input-label">Runways</label>
                <input className="input" type="number" min="1" max="10" value={form.runwayCount} onChange={e => setForm({...form, runwayCount: parseInt(e.target.value)||1})} />
              </div>
              <div className="input-group">
                <label className="input-label">Expected Pax / Year</label>
                <input className="input" type="number" min="0" placeholder="e.g., 5000000" value={form.expectedPassengersPerYear} onChange={e => setForm({...form, expectedPassengersPerYear: parseInt(e.target.value)||0})} />
              </div>
              <div className="input-group">
                <label className="input-label">Global Contingency %</label>
                <input className="input" type="number" min="0" max="50" value={form.globalContingency} onChange={e => setForm({...form, globalContingency: parseFloat(e.target.value)||0})} />
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                <div style={{ padding: '8px 12px', background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 8, fontSize: 12, color: '#92400E', display: 'flex', alignItems: 'flex-start', gap: 6, lineHeight: 1.5 }}>
                  <span className="mi-outlined mi-sm" style={{ marginTop: 1, flexShrink: 0, color: '#D97706' }}>info</span>
                  You'll add departments and cost items after creation.
                </div>
              </div>
            </div>
          </div>
          <div className="modal-footer" style={{ borderTop: '1px solid #F1F5F9', paddingTop: 16 }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}><span className="mi-outlined mi-sm">close</span> Cancel</button>
            <button type="submit" disabled={loading} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 20px', background: '#0B1628', color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 700, fontFamily: 'Syne, sans-serif', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}>
              {loading ? <><div className="spinner spinner-sm spinner-white" />Creating...</> : <><span className="mi-outlined mi-sm" style={{ color: '#F5A623' }}>flight_takeoff</span>Create Project</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ProjectCard = ({ project, onDelete }) => {
  const total = calcProjectTotal(project);
  const deptCount = project.departments?.length || 0;
  const itemCount = project.departments?.reduce((s, d) => s + (d.subItems?.length || 0), 0) || 0;

  return (
    <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 14, overflow: 'hidden', transition: 'all 0.2s', display: 'flex', flexDirection: 'column' }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = '#0B1628'; e.currentTarget.style.boxShadow = '0 8px 24px rgb(11 22 40 / 0.1)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = '#E2E8F0'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}>
      {/* Amber top stripe */}
      <div style={{ height: 3, background: 'repeating-linear-gradient(90deg, #F5A623 0, #F5A623 16px, transparent 16px, transparent 24px)' }} />
      <Link to={`/projects/${project._id}`} style={{ textDecoration: 'none', padding: '16px 18px', flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 10, color: '#94A3B8', fontFamily: 'IBM Plex Mono, monospace', marginBottom: 4, letterSpacing: '0.04em' }}>{project.projectCode}</div>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0B1628', marginBottom: 4, lineHeight: 1.25, fontFamily: 'Syne, sans-serif' }} className="truncate">{project.name}</h3>
            {(project.location || project.country) && (
              <div style={{ fontSize: 12, color: '#94A3B8', display: 'flex', alignItems: 'center', gap: 4, fontFamily: 'IBM Plex Sans, sans-serif' }}>
                <span className="mi-outlined" style={{ fontSize: 13 }}>location_on</span>
                {[project.location, project.country].filter(Boolean).join(', ')}
              </div>
            )}
          </div>
          <span className={`badge ${STATUS_COLORS[project.status] || 'badge-gray'}`} style={{ marginLeft: 10, flexShrink: 0 }}>{project.status}</span>
        </div>

        {/* Cost highlight */}
        <div style={{ background: '#0B1628', borderRadius: 10, padding: '12px 14px', marginBottom: 12 }}>
          <div style={{ fontSize: 10, color: 'rgb(255 255 255 / 0.4)', fontFamily: 'Syne, sans-serif', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 3 }}>Total Estimate</div>
          <div style={{ fontSize: 22, fontFamily: 'IBM Plex Mono, monospace', fontWeight: 500, color: '#F5A623', letterSpacing: '-0.01em' }}>{formatCurrency(total, project.currency)}</div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
          {[
            { icon: 'table_chart', val: deptCount, label: 'departments' },
            { icon: 'list_alt',    val: itemCount, label: 'cost items' },
          ].map((s, i) => (
            <div key={i} style={{ background: '#F8FAFC', borderRadius: 8, padding: '8px 10px', display: 'flex', alignItems: 'center', gap: 6 }}>
              <span className="mi-outlined mi-sm" style={{ color: '#94A3B8' }}>{s.icon}</span>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#0B1628', fontFamily: 'Syne, sans-serif' }}>{s.val}</div>
                <div style={{ fontSize: 10, color: '#CBD5E1', fontFamily: 'IBM Plex Sans, sans-serif' }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
          <span className="badge badge-navy" style={{ fontSize: 10 }}><span className="mi-outlined" style={{ fontSize: 11 }}>flight</span>{project.airportType}</span>
          <span className="badge badge-gray" style={{ fontSize: 10 }}><span className="mi-outlined" style={{ fontSize: 11 }}>airline_stops</span>{project.runwayCount} rwy</span>
          {project.currency !== 'USD' && <span className="badge badge-amber" style={{ fontSize: 10 }}>{project.currency}</span>}
        </div>
      </Link>
      <div style={{ borderTop: '1px solid #F1F5F9', padding: '10px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#FAFBFC' }}>
        <span style={{ fontSize: 11, color: '#CBD5E1', display: 'flex', alignItems: 'center', gap: 4, fontFamily: 'IBM Plex Mono, monospace' }}>
          <span className="mi-outlined" style={{ fontSize: 12 }}>schedule</span>
          {new Date(project.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </span>
        <div style={{ display: 'flex', gap: 6 }}>
          <Link to={`/projects/${project._id}`} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 5, padding: '5px 12px', background: '#0B1628', color: '#fff', borderRadius: 7, fontSize: 12, fontWeight: 700, fontFamily: 'Syne, sans-serif' }}>
            <span className="mi-outlined" style={{ fontSize: 14, color: '#F5A623' }}>open_in_new</span>Open
          </Link>
          <button onClick={e => { e.preventDefault(); onDelete(project._id); }} style={{ display: 'flex', alignItems: 'center', padding: '5px 8px', background: '#FFF1F2', border: '1px solid #FECACA', color: '#DC2626', borderRadius: 7, cursor: 'pointer', fontSize: 12 }}>
            <span className="mi-outlined" style={{ fontSize: 15 }}>delete</span>
          </button>
        </div>
      </div>
    </div>
  );
};

const DashboardPage = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [search, setSearch] = useState('');
  const { user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => { fetchProjects(); }, []);

  const fetchProjects = async () => {
    try {
      const res = await api.get('/api/projects');
      setProjects(res.data.projects);
    } catch { toast.error('Failed to load projects'); }
    finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this project permanently?')) return;
    try {
      await api.delete(`/api/projects/${id}`);
      setProjects(prev => prev.filter(p => p._id !== id));
      toast.success('Project deleted');
    } catch { toast.error('Failed to delete project'); }
  };

  const handleCreated = (project) => {
    setProjects(prev => [project, ...prev]);
    setShowCreate(false);
    navigate(`/projects/${project._id}`);
  };

  const totalValue = projects.reduce((sum, p) => sum + calcProjectTotal(p), 0);
  const filtered = projects.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.projectCode?.toLowerCase().includes(search.toLowerCase()) ||
    p.location?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return (
    <div className="page-loading">
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#0B1628', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', animation: 'spin 1.2s linear infinite' }}>
          <span className="mi-round mi-lg" style={{ color: '#F5A623' }}>flight</span>
        </div>
        <div style={{ color: '#94A3B8', fontSize: 13, fontFamily: 'IBM Plex Mono, monospace', letterSpacing: '0.04em' }}>LOADING PROJECTS...</div>
      </div>
    </div>
  );

  return (
    <div style={{ background: '#F8FAFC', minHeight: 'calc(100vh - 58px)' }}>
      {/* Header bar */}
      <div style={{ background: '#0B1628', borderBottom: '1px solid rgb(255 255 255 / 0.06)', padding: '0 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', height: 52, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontSize: 18, fontWeight: 800, color: '#fff', fontFamily: 'Syne, sans-serif', letterSpacing: '-0.01em' }}>
              {user?.name?.split(' ')[0]}'s Projects
            </span>
            <span style={{ fontSize: 11, color: 'rgb(255 255 255 / 0.3)', marginLeft: 12, fontFamily: 'IBM Plex Mono, monospace', letterSpacing: '0.04em' }}>
              {projects.length} PROJECT{projects.length !== 1 ? 'S' : ''} · {user?.organization || 'AIRCOST'}
            </span>
          </div>
          <button onClick={() => setShowCreate(true)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 18px', background: '#F5A623', color: '#0B1628', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 800, fontFamily: 'Syne, sans-serif', cursor: 'pointer', boxShadow: '0 2px 8px rgb(245 166 35 / 0.35)', transition: 'all 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.background = '#FBBF24'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#F5A623'; e.currentTarget.style.transform = 'translateY(0)'; }}>
            <span className="mi-outlined mi-sm">add</span>New Project
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '28px 24px' }}>
        {/* Stats */}
        {projects.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
            {[
              { label: 'Total Projects',    value: projects.length,   mono: false, icon: 'folder',           sub: 'airport projects' },
              { label: 'Combined Estimate', value: `$${(totalValue/1e9).toFixed(1)}B`, mono: true, icon: 'account_balance', sub: 'total value' },
              { label: 'Active',            value: projects.filter(p => ['planning','design','construction'].includes(p.status)).length, mono: false, icon: 'pending_actions', sub: 'in progress' },
              { label: 'Cost Items',        value: projects.reduce((s, p) => s + p.departments?.reduce((d, dept) => d + (dept.subItems?.length||0), 0), 0), mono: false, icon: 'list_alt', sub: 'total entries' },
            ].map((s, i) => (
              <div key={i} style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12, padding: '14px 16px', borderLeft: '3px solid #F5A623' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                  <span className="mi-outlined mi-sm" style={{ color: '#94A3B8' }}>{s.icon}</span>
                  <span style={{ fontSize: 10, color: '#94A3B8', fontFamily: 'Syne, sans-serif', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{s.label}</span>
                </div>
                <div style={{ fontSize: 22, fontWeight: 800, color: '#0B1628', fontFamily: s.mono ? 'IBM Plex Mono, monospace' : 'Syne, sans-serif', letterSpacing: '-0.02em' }}>{s.value}</div>
                <div style={{ fontSize: 10, color: '#CBD5E1', marginTop: 2, fontFamily: 'IBM Plex Sans, sans-serif' }}>{s.sub}</div>
              </div>
            ))}
          </div>
        )}

        {/* Search */}
        {projects.length > 0 && (
          <div style={{ marginBottom: 20, position: 'relative', maxWidth: 380 }}>
            <span className="mi-outlined" style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: '#94A3B8', fontSize: 18, pointerEvents: 'none' }}>search</span>
            <input className="input" placeholder="Search by name, code or location..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 36, background: '#fff' }} />
          </div>
        )}

        {/* Project grid */}
        {projects.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 24px', background: '#fff', borderRadius: 16, border: '2px dashed #E2E8F0' }}>
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#0B1628', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', boxShadow: '0 8px 24px rgb(11 22 40 / 0.2)' }}>
              <span className="mi-round mi-2xl" style={{ color: '#F5A623' }}>flight_takeoff</span>
            </div>
            <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: 22, fontWeight: 800, color: '#0B1628', marginBottom: 8 }}>No projects yet</h2>
            <p style={{ color: '#94A3B8', fontSize: 14, marginBottom: 28, maxWidth: 360, margin: '0 auto 28px', fontFamily: 'IBM Plex Sans, sans-serif', lineHeight: 1.7 }}>
              Create your first airport project to start estimating construction costs from runway to routers.
            </p>
            <button onClick={() => setShowCreate(true)} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 24px', background: '#F5A623', color: '#0B1628', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 800, fontFamily: 'Syne, sans-serif', cursor: 'pointer', boxShadow: '0 4px 16px rgb(245 166 35 / 0.35)' }}>
              <span className="mi-outlined">add_circle</span>Create First Project
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 24px', color: '#94A3B8' }}>
            <span className="mi-outlined mi-2xl" style={{ color: '#E2E8F0', display: 'block', marginBottom: 12 }}>search_off</span>
            <p style={{ fontFamily: 'IBM Plex Sans, sans-serif' }}>No projects match "{search}"</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
            {filtered.map(p => <ProjectCard key={p._id} project={p} onDelete={handleDelete} />)}
          </div>
        )}
      </div>

      {showCreate && <CreateProjectModal onClose={() => setShowCreate(false)} onCreated={handleCreated} />}
    </div>
  );
};

export default DashboardPage;
