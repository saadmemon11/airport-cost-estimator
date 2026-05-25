import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api, { formatCurrency, calcProjectTotal, STATUS_COLORS } from '../utils/api';
import { useToast } from '../context/ToastContext';
import DepartmentCard from '../components/project/DepartmentCard';
import AddDepartmentModal from '../components/project/AddDepartmentModal';
import CostSummary from '../components/project/CostSummary';

const PROJECT_STATUSES = ['draft','planning','design','approval','construction','completed','cancelled'];

const ProjectPage = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('departments');
  const [showAddDept, setShowAddDept] = useState(false);
  const [editingProject, setEditingProject] = useState(false);
  const [projectForm, setProjectForm] = useState({});
  const [savingProject, setSavingProject] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => { fetchProject(); }, [id]);

  const fetchProject = async () => {
    try {
      const res = await api.get(`/api/projects/${id}`);
      setProject(res.data.project);
      setProjectForm(res.data.project);
    } catch { toast.error('Failed to load project'); navigate('/dashboard'); }
    finally { setLoading(false); }
  };

  const handleSaveProject = async () => {
    setSavingProject(true);
    try {
      const res = await api.put(`/api/projects/${id}`, projectForm);
      setProject(res.data.project); setProjectForm(res.data.project);
      setEditingProject(false); toast.success('Project saved');
    } catch { toast.error('Failed to save project'); }
    finally { setSavingProject(false); }
  };

  const handleDeleteDept = async (deptId) => {
    if (!window.confirm('Delete this department and all its cost items?')) return;
    try {
      const res = await api.delete(`/api/projects/${id}/departments/${deptId}`);
      setProject(res.data.project); toast.success('Department removed');
    } catch { toast.error('Failed to delete department'); }
  };

  const handleProjectUpdate = (p) => { setProject(p); setProjectForm(p); };

  if (loading) return (
    <div className="page-loading">
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#0B1628', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', animation: 'spin 1.2s linear infinite' }}>
          <span className="mi-round mi-lg" style={{ color: '#F5A623' }}>flight</span>
        </div>
        <div style={{ color: '#94A3B8', fontSize: 13, fontFamily: 'IBM Plex Mono, monospace', letterSpacing: '0.04em' }}>LOADING PROJECT...</div>
      </div>
    </div>
  );
  if (!project) return null;

  const grandTotal = calcProjectTotal(project);

  return (
    <div style={{ background: '#F8FAFC', minHeight: 'calc(100vh - 58px)' }}>
      {/* Project top bar */}
      <div style={{ background: '#0B1628', borderBottom: '1px solid rgb(255 255 255 / 0.06)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          {/* Breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, paddingTop: 14, paddingBottom: 6, fontSize: 12 }}>
            <Link to="/dashboard" style={{ color: 'rgb(255 255 255 / 0.4)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4, fontFamily: 'IBM Plex Sans, sans-serif', transition: 'color 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.color = '#F5A623'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgb(255 255 255 / 0.4)'}>
              <span className="mi-outlined mi-sm">grid_view</span>Dashboard
            </Link>
            <span className="mi-outlined mi-sm" style={{ color: 'rgb(255 255 255 / 0.2)' }}>chevron_right</span>
            <span style={{ color: 'rgb(255 255 255 / 0.7)', fontFamily: 'IBM Plex Sans, sans-serif' }}>{project.name}</span>
          </div>

          {/* Project info row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingBottom: 0 }}>
            <div style={{ paddingBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 10, fontFamily: 'IBM Plex Mono, monospace', color: 'rgb(245 166 35 / 0.7)', background: 'rgb(245 166 35 / 0.1)', border: '1px solid rgb(245 166 35 / 0.2)', padding: '2px 8px', borderRadius: 4, letterSpacing: '0.06em' }}>{project.projectCode}</span>
                <span className={`badge ${STATUS_COLORS[project.status] || 'badge-gray'}`}>{project.status}</span>
                <span style={{ fontSize: 10, color: 'rgb(255 255 255 / 0.3)', fontFamily: 'Syne, sans-serif', display: 'flex', alignItems: 'center', gap: 3 }}>
                  <span className="mi-outlined" style={{ fontSize: 12 }}>flight</span>{project.airportType}
                </span>
              </div>
              <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: 22, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', marginBottom: 4 }}>{project.name}</h1>
              {(project.location || project.country) && (
                <div style={{ fontSize: 12, color: 'rgb(255 255 255 / 0.4)', display: 'flex', alignItems: 'center', gap: 4, fontFamily: 'IBM Plex Sans, sans-serif' }}>
                  <span className="mi-outlined" style={{ fontSize: 14 }}>location_on</span>
                  {[project.location, project.country].filter(Boolean).join(', ')}
                </div>
              )}
            </div>
            <div style={{ textAlign: 'right', paddingBottom: 16, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
              <div>
                <div style={{ fontSize: 10, color: 'rgb(255 255 255 / 0.3)', fontFamily: 'Syne, sans-serif', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 2 }}>Total Estimate</div>
                <div style={{ fontSize: 28, fontFamily: 'IBM Plex Mono, monospace', fontWeight: 500, color: '#F5A623', letterSpacing: '-0.02em' }}>{formatCurrency(grandTotal, project.currency)}</div>
              </div>
              <button onClick={() => setEditingProject(true)} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 14px', background: 'rgb(255 255 255 / 0.07)', border: '1px solid rgb(255 255 255 / 0.12)', color: 'rgb(255 255 255 / 0.7)', borderRadius: 7, cursor: 'pointer', fontSize: 12, fontFamily: 'IBM Plex Sans, sans-serif', transition: 'all 0.15s' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgb(255 255 255 / 0.12)'; e.currentTarget.style.color = '#fff'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgb(255 255 255 / 0.07)'; e.currentTarget.style.color = 'rgb(255 255 255 / 0.7)'; }}>
                <span className="mi-outlined mi-sm">edit</span>Edit
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: 0, borderTop: '1px solid rgb(255 255 255 / 0.06)' }}>
            {[['departments','Departments','table_chart'],['summary','Cost Summary','summarize']].map(([tab, label, icon]) => (
              <button key={tab} onClick={() => setActiveTab(tab)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '12px 18px', border: 'none', background: 'none', cursor: 'pointer', fontFamily: 'Syne, sans-serif', fontSize: 13, fontWeight: 700, color: activeTab === tab ? '#F5A623' : 'rgb(255 255 255 / 0.4)', borderBottom: `2px solid ${activeTab === tab ? '#F5A623' : 'transparent'}`, marginBottom: -1, transition: 'all 0.15s', letterSpacing: '0.01em' }}>
                <span className="mi-outlined mi-sm">{icon}</span>
                {label}
                {tab === 'departments' && project.departments?.length > 0 && (
                  <span style={{ fontSize: 10, background: 'rgb(245 166 35 / 0.15)', color: '#F5A623', padding: '1px 7px', borderRadius: 999, fontWeight: 700 }}>{project.departments.length}</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Edit project modal */}
      {editingProject && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setEditingProject(false)}>
          <div className="modal modal-lg">
            <div className="modal-header" style={{ borderBottom: '1px solid #F1F5F9', paddingBottom: 16 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, fontFamily: 'Syne, sans-serif', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className="mi-outlined mi-sm" style={{ color: '#0B1628' }}>edit</span>Edit Project
              </h2>
              <button className="btn btn-ghost btn-sm" onClick={() => setEditingProject(false)}><span className="mi-outlined">close</span></button>
            </div>
            <div className="modal-body">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
                {[
                  { col: '1 / -1', label: 'Project Name', field: 'name', type: 'text' },
                  { col: '1 / -1', label: 'Description', field: 'description', type: 'textarea' },
                  { col: '1 / 2', label: 'Location', field: 'location', type: 'text' },
                  { col: '2 / 3', label: 'Country', field: 'country', type: 'text' },
                  { col: '3 / 4', label: 'Status', field: 'status', type: 'select', options: PROJECT_STATUSES },
                  { col: '1 / 2', label: 'Global Contingency %', field: 'globalContingency', type: 'number' },
                  { col: '2 / 3', label: 'Runway Count', field: 'runwayCount', type: 'number' },
                ].map(({ col, label, field, type, options }) => (
                  <div key={field} className="input-group" style={{ gridColumn: col }}>
                    <label className="input-label">{label}</label>
                    {type === 'textarea' ? (
                      <textarea className="input" rows={2} value={projectForm[field] || ''} onChange={e => setProjectForm({...projectForm, [field]: e.target.value})} style={{ resize: 'vertical' }} />
                    ) : type === 'select' ? (
                      <select className="input" value={projectForm[field] || ''} onChange={e => setProjectForm({...projectForm, [field]: e.target.value})}>
                        {options.map(o => <option key={o} value={o}>{o.charAt(0).toUpperCase() + o.slice(1)}</option>)}
                      </select>
                    ) : (
                      <input className="input" type={type} value={projectForm[field] || ''} onChange={e => setProjectForm({...projectForm, [field]: type === 'number' ? (parseFloat(e.target.value)||0) : e.target.value})} />
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className="modal-footer" style={{ borderTop: '1px solid #F1F5F9', paddingTop: 16 }}>
              <button className="btn btn-secondary" onClick={() => { setEditingProject(false); setProjectForm(project); }}><span className="mi-outlined mi-sm">close</span>Cancel</button>
              <button disabled={savingProject} onClick={handleSaveProject} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 20px', background: '#0B1628', color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 700, fontFamily: 'Syne, sans-serif', cursor: savingProject ? 'not-allowed' : 'pointer', opacity: savingProject ? 0.7 : 1 }}>
                {savingProject ? <><div className="spinner spinner-sm spinner-white" />Saving...</> : <><span className="mi-outlined mi-sm" style={{ color: '#F5A623' }}>save</span>Save Changes</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 24px 48px' }}>
        {/* Departments tab */}
        {activeTab === 'departments' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: 16, fontWeight: 700, color: '#0B1628' }}>Department Blocks</h2>
                <p style={{ fontSize: 13, color: '#94A3B8', marginTop: 2, fontFamily: 'IBM Plex Sans, sans-serif' }}>Add departments and cost items. Each block tracks its own contingency.</p>
              </div>
              <button onClick={() => setShowAddDept(true)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 18px', background: '#0B1628', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 700, fontFamily: 'Syne, sans-serif', cursor: 'pointer', boxShadow: '0 2px 8px rgb(11 22 40 / 0.2)' }}>
                <span className="mi-outlined mi-sm" style={{ color: '#F5A623' }}>add_box</span>Add Department
              </button>
            </div>

            {project.departments?.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '64px 24px', background: '#fff', border: '2px dashed #E2E8F0', borderRadius: 16 }}>
                <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#0B1628', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', boxShadow: '0 8px 24px rgb(11 22 40 / 0.2)' }}>
                  <span className="mi-outlined mi-2xl" style={{ color: '#F5A623' }}>table_chart</span>
                </div>
                <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: 18, fontWeight: 800, color: '#0B1628', marginBottom: 8 }}>No departments yet</h3>
                <p style={{ color: '#94A3B8', fontSize: 14, marginBottom: 24, maxWidth: 400, margin: '0 auto 24px', fontFamily: 'IBM Plex Sans, sans-serif', lineHeight: 1.7 }}>
                  Add department blocks like Terminal, Runway, ATC Tower, IT Systems. Use templates for a quick start with pre-filled cost items.
                </p>
                <button onClick={() => setShowAddDept(true)} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 24px', background: '#F5A623', color: '#0B1628', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 800, fontFamily: 'Syne, sans-serif', cursor: 'pointer', boxShadow: '0 4px 16px rgb(245 166 35 / 0.35)' }}>
                  <span className="mi-outlined">add_box</span>Add First Department
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {project.departments.map(dept => (
                  <DepartmentCard key={dept._id} dept={dept} projectId={id} currency={project.currency} onProjectUpdate={handleProjectUpdate} onDelete={handleDeleteDept} />
                ))}
                <button onClick={() => setShowAddDept(true)} style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: '#fff', border: '1px dashed #CBD5E1', color: '#64748B', borderRadius: 8, fontSize: 13, fontWeight: 600, fontFamily: 'IBM Plex Sans, sans-serif', cursor: 'pointer', marginTop: 4, transition: 'all 0.15s' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#0B1628'; e.currentTarget.style.color = '#0B1628'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#CBD5E1'; e.currentTarget.style.color = '#64748B'; }}>
                  <span className="mi-outlined mi-sm">add_box</span>Add Another Department
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'summary' && <CostSummary project={project} />}
      </div>

      {showAddDept && (
        <AddDepartmentModal projectId={id} onClose={() => setShowAddDept(false)} onProjectUpdate={(p) => { handleProjectUpdate(p); setShowAddDept(false); toast.success('Department added'); }} />
      )}
    </div>
  );
};

export default ProjectPage;
