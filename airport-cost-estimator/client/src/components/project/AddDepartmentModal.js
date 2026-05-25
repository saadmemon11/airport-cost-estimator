import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { useToast } from '../../context/ToastContext';

const CATEGORIES = ['infrastructure','terminal','airside','landside','utilities','technology','safety','commercial','administration','other'];

// Maps department names to Material Icons
const DEPT_ICON_MAP = {
  'Runway & Taxiway': 'airline_stops',
  'Terminal Building': 'business',
  'Air Traffic Control Tower': 'cell_tower',
  'Baggage Handling System': 'luggage',
  'Utilities & MEP': 'electrical_services',
  'Road & Ground Access': 'road',
  'IT & Technology Systems': 'devices',
  'Fuel Farm & Storage': 'local_gas_station',
  'Administration Buildings': 'account_balance',
  'Environmental & Safety': 'eco',
};

const ICON_OPTIONS = [
  { icon: 'construction', label: 'Construction' },
  { icon: 'airline_stops', label: 'Runway' },
  { icon: 'business', label: 'Terminal' },
  { icon: 'cell_tower', label: 'Tower' },
  { icon: 'luggage', label: 'Baggage' },
  { icon: 'electrical_services', label: 'Utilities' },
  { icon: 'road', label: 'Roads' },
  { icon: 'devices', label: 'IT' },
  { icon: 'local_gas_station', label: 'Fuel' },
  { icon: 'account_balance', label: 'Admin' },
  { icon: 'eco', label: 'Environment' },
  { icon: 'local_fire_department', label: 'Fire' },
  { icon: 'security', label: 'Security' },
  { icon: 'shopping_bag', label: 'Commercial' },
  { icon: 'local_parking', label: 'Parking' },
  { icon: 'train', label: 'Transit' },
  { icon: 'water_drop', label: 'Water' },
  { icon: 'bolt', label: 'Power' },
  { icon: 'inventory_2', label: 'Cargo' },
  { icon: 'handyman', label: 'Maintenance' },
];

const AddDepartmentModal = ({ projectId, onClose, onProjectUpdate }) => {
  const [mode, setMode] = useState('template');
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [customForm, setCustomForm] = useState({ name: '', description: '', category: 'other', icon: 'construction', contingencyPercent: 10 });
  const [loading, setLoading] = useState(false);
  const [templatesLoading, setTemplatesLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    api.get('/api/departments/templates')
      .then(res => setTemplates(res.data.templates))
      .catch(() => toast.error('Failed to load templates'))
      .finally(() => setTemplatesLoading(false));
  }, []);

  const handleAddTemplate = async () => {
    if (!selectedTemplate) { toast.error('Please select a template'); return; }
    setLoading(true);
    try {
      const t = selectedTemplate;
      const deptData = {
        name: t.name,
        description: t.description,
        category: t.category,
        icon: DEPT_ICON_MAP[t.name] || 'construction',
        color: t.color,
        contingencyPercent: 10,
        subItems: (t.defaultItems || []).map(item => ({
          name: item.name, unit: item.unit, quantity: item.quantity,
          unitCost: item.unitCost, totalCost: item.quantity * item.unitCost, status: 'pending'
        }))
      };
      const res = await api.post(`/api/projects/${projectId}/departments`, deptData);
      onProjectUpdate(res.data.project);
      toast.success(`${t.name} added with ${t.defaultItems?.length || 0} items`);
      onClose();
    } catch { toast.error('Failed to add department'); }
    finally { setLoading(false); }
  };

  const handleAddCustom = async () => {
    if (!customForm.name.trim()) { toast.error('Department name is required'); return; }
    setLoading(true);
    try {
      const res = await api.post(`/api/projects/${projectId}/departments`, customForm);
      onProjectUpdate(res.data.project);
      toast.success('Department added');
      onClose();
    } catch { toast.error('Failed to add department'); }
    finally { setLoading(false); }
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal modal-lg">
        <div className="modal-header">
          <h2 style={{ fontSize: 18, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className="mi-outlined" style={{ color: '#374151' }}>add_box</span>
            Add Department Block
          </h2>
          <button className="btn btn-ghost btn-sm" onClick={onClose}>
            <span className="mi-outlined">close</span>
          </button>
        </div>
        <div className="modal-body">
          {/* Mode tabs */}
          <div style={{ display: 'flex', gap: 0, background: '#f3f4f6', borderRadius: 8, padding: 3, marginBottom: 20 }}>
            {[['template','Use Template'],['custom','Custom Department']].map(([m, label]) => (
              <button key={m} onClick={() => setMode(m)} style={{ flex: 1, padding: '7px 12px', borderRadius: 6, border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 500, fontSize: 13, transition: 'all 0.15s', background: mode === m ? '#fff' : 'transparent', color: mode === m ? '#111827' : '#6b7280', boxShadow: mode === m ? '0 1px 3px rgb(0 0 0 / 0.1)' : 'none' }}>
                <span className="mi-outlined mi-sm" style={{ marginRight: 5, verticalAlign: 'middle' }}>{m === 'template' ? 'folder_special' : 'edit_note'}</span>
                {label}
              </button>
            ))}
          </div>

          {mode === 'template' ? (
            <div>
              <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 14 }}>Select a pre-built template with standard cost items you can edit after adding.</p>
              {templatesLoading ? (
                <div style={{ textAlign: 'center', padding: 32 }}><div className="spinner" style={{ margin: '0 auto' }} /></div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, maxHeight: 380, overflowY: 'auto' }}>
                  {templates.map((t, i) => (
                    <div key={i} onClick={() => setSelectedTemplate(t)} style={{ padding: '12px 14px', borderRadius: 10, border: `2px solid ${selectedTemplate?.name === t.name ? '#111827' : '#e5e7eb'}`, cursor: 'pointer', background: selectedTemplate?.name === t.name ? '#f9fafb' : '#fff', transition: 'all 0.1s' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <span className="mi-outlined mi-lg" style={{ color: selectedTemplate?.name === t.name ? '#111827' : '#6b7280' }}>
                          {DEPT_ICON_MAP[t.name] || 'construction'}
                        </span>
                        <span style={{ fontWeight: 600, fontSize: 13, color: '#111827' }}>{t.name}</span>
                      </div>
                      <p style={{ fontSize: 12, color: '#9ca3af', lineHeight: 1.4, marginBottom: 6 }}>{t.description}</p>
                      <span style={{ fontSize: 11, color: '#6b7280', background: '#f3f4f6', padding: '2px 8px', borderRadius: 999, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                        <span className="mi-outlined" style={{ fontSize: 11 }}>list_alt</span>
                        {t.defaultItems?.length} items included
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div className="input-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="input-label">Department Name *</label>
                  <input className="input" placeholder="e.g., Cargo Terminal, VIP Lounge, Ground Handling" value={customForm.name} onChange={e => setCustomForm({...customForm, name: e.target.value})} autoFocus />
                </div>
                <div className="input-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="input-label">Description</label>
                  <input className="input" placeholder="Brief description..." value={customForm.description} onChange={e => setCustomForm({...customForm, description: e.target.value})} />
                </div>
                <div className="input-group">
                  <label className="input-label">Category</label>
                  <select className="input" value={customForm.category} onChange={e => setCustomForm({...customForm, category: e.target.value})}>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                  </select>
                </div>
                <div className="input-group">
                  <label className="input-label">Contingency (%)</label>
                  <input className="input" type="number" min="0" max="50" value={customForm.contingencyPercent} onChange={e => setCustomForm({...customForm, contingencyPercent: parseFloat(e.target.value)||0})} />
                </div>
                <div className="input-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="input-label">Icon</label>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 4 }}>
                    {ICON_OPTIONS.map(({ icon, label }) => (
                      <button key={icon} onClick={() => setCustomForm({...customForm, icon})} title={label} style={{ width: 40, height: 40, borderRadius: 8, border: `2px solid ${customForm.icon === icon ? '#111827' : '#e5e7eb'}`, background: customForm.icon === icon ? '#f3f4f6' : '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.1s' }}>
                        <span className="mi-outlined" style={{ fontSize: 20, color: customForm.icon === icon ? '#111827' : '#9ca3af' }}>{icon}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            <span className="mi-outlined mi-sm">close</span> Cancel
          </button>
          <button className="btn btn-primary" onClick={mode === 'template' ? handleAddTemplate : handleAddCustom} disabled={loading || (mode === 'template' && !selectedTemplate)}>
            {loading
              ? <><div className="spinner spinner-sm" style={{ borderTopColor: '#fff' }} />Adding...</>
              : <><span className="mi-outlined mi-sm" style={{ color: '#fff' }}>add_box</span>Add Department</>
            }
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddDepartmentModal;
