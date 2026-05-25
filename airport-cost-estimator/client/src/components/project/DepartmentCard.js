import React, { useState } from 'react';
import api, { formatCurrency, formatNumber, STATUS_COLORS } from '../../utils/api';
import { useToast } from '../../context/ToastContext';

const ITEM_UNITS = ['unit','sq meter','sq ft','km','meter','lump sum','set','MVA','ton','kg','liter','piece','door','camera','vehicle','space','floor','wing','gate'];
const ITEM_STATUSES = ['pending','in-progress','completed','on-hold'];
const DEPT_STATUSES = ['planning','design','procurement','construction','completed','on-hold'];

const SubItemRow = ({ item, onUpdate, onDelete, currency }) => {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: item.name, description: item.description||'', unit: item.unit||'unit', quantity: item.quantity, unitCost: item.unitCost, notes: item.notes||'', status: item.status });
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const total = (form.quantity||0) * (form.unitCost||0);

  const handleSave = async () => {
    if (!form.name.trim()) { toast.error('Item name is required'); return; }
    setLoading(true);
    try { await onUpdate(item._id, { ...form, totalCost: total }); setEditing(false); toast.success('Item updated'); }
    catch { toast.error('Failed to update item'); }
    finally { setLoading(false); }
  };

  if (editing) return (
    <tr style={{ background: '#FFFBEB' }}>
      <td colSpan={6} style={{ padding: '14px 16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', gap: 8, alignItems: 'end' }}>
          {[
            { label: 'Name', el: <input className="input" value={form.name} onChange={e => setForm({...form, name: e.target.value})} /> },
            { label: 'Unit', el: <select className="input" value={form.unit} onChange={e => setForm({...form, unit: e.target.value})}>{ITEM_UNITS.map(u => <option key={u} value={u}>{u}</option>)}</select> },
            { label: 'Quantity', el: <input className="input" type="number" min="0" step="any" value={form.quantity} onChange={e => setForm({...form, quantity: parseFloat(e.target.value)||0})} /> },
            { label: `Unit Cost (${currency})`, el: <input className="input" type="number" min="0" step="any" value={form.unitCost} onChange={e => setForm({...form, unitCost: parseFloat(e.target.value)||0})} /> },
            { label: 'Status', el: <select className="input" value={form.status} onChange={e => setForm({...form, status: e.target.value})}>{ITEM_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}</select> },
          ].map(({ label, el }) => (
            <div className="input-group" key={label}><label className="input-label">{label}</label>{el}</div>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
          <div style={{ fontSize: 13, fontFamily: 'IBM Plex Mono, monospace', fontWeight: 500, color: '#D97706', display: 'flex', alignItems: 'center', gap: 6 }}>
            <span className="mi-outlined mi-sm" style={{ color: '#D97706' }}>calculate</span>
            Total: {formatCurrency(total, currency)}
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <button className="btn btn-secondary btn-sm" onClick={() => setEditing(false)}><span className="mi-outlined mi-sm">close</span>Cancel</button>
            <button disabled={loading} onClick={handleSave} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 14px', background: '#0B1628', color: '#fff', border: 'none', borderRadius: 7, fontSize: 12, fontWeight: 700, fontFamily: 'Syne, sans-serif', cursor: loading ? 'not-allowed' : 'pointer' }}>
              <span className="mi-outlined mi-sm" style={{ color: '#F5A623' }}>check</span>{loading ? 'Saving…' : 'Save'}
            </button>
          </div>
        </div>
      </td>
    </tr>
  );

  return (
    <tr>
      <td style={{ paddingLeft: 18 }}>
        <div style={{ fontWeight: 500, color: '#0F172A', fontSize: 13, fontFamily: 'IBM Plex Sans, sans-serif' }}>{item.name}</div>
        {item.notes && <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 1 }}>{item.notes}</div>}
      </td>
      <td style={{ color: '#94A3B8', fontSize: 12, fontFamily: 'IBM Plex Sans, sans-serif' }}>{item.unit}</td>
      <td style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 12 }}>{formatNumber(item.quantity)}</td>
      <td style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 12 }}>{formatCurrency(item.unitCost, currency)}</td>
      <td style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 13, fontWeight: 600, color: '#0B1628' }}>{formatCurrency(item.quantity * item.unitCost, currency)}</td>
      <td>
        <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end', alignItems: 'center' }}>
          <span className={`badge ${STATUS_COLORS[item.status] || 'badge-gray'}`}>{item.status}</span>
          <button onClick={() => setEditing(true)} style={{ padding: '4px 6px', background: 'transparent', border: 'none', cursor: 'pointer', borderRadius: 6, color: '#94A3B8', transition: 'all 0.1s' }} title="Edit"
            onMouseEnter={e => { e.currentTarget.style.background = '#F1F5F9'; e.currentTarget.style.color = '#0B1628'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#94A3B8'; }}>
            <span className="mi-outlined mi-sm">edit</span>
          </button>
          <button onClick={() => onDelete(item._id)} style={{ padding: '4px 6px', background: 'transparent', border: 'none', cursor: 'pointer', borderRadius: 6, color: '#94A3B8', transition: 'all 0.1s' }} title="Delete"
            onMouseEnter={e => { e.currentTarget.style.background = '#FFF1F2'; e.currentTarget.style.color = '#DC2626'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#94A3B8'; }}>
            <span className="mi-outlined mi-sm">delete</span>
          </button>
        </div>
      </td>
    </tr>
  );
};

const AddItemForm = ({ onAdd, currency }) => {
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({ name: '', unit: 'unit', quantity: 1, unitCost: 0, notes: '', status: 'pending' });
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleAdd = async () => {
    if (!form.name.trim()) { toast.error('Item name is required'); return; }
    setLoading(true);
    try { await onAdd({ ...form, totalCost: form.quantity * form.unitCost }); setForm({ name: '', unit: 'unit', quantity: 1, unitCost: 0, notes: '', status: 'pending' }); toast.success('Item added'); }
    catch { toast.error('Failed to add item'); }
    finally { setLoading(false); }
  };

  if (!show) return (
    <tr>
      <td colSpan={6} style={{ padding: '8px 18px', borderTop: '1px dashed #E2E8F0' }}>
        <button onClick={() => setShow(true)} style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'none', border: 'none', color: '#64748B', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'IBM Plex Sans, sans-serif', padding: '2px 0', transition: 'color 0.15s' }}
          onMouseEnter={e => e.currentTarget.style.color = '#0B1628'}
          onMouseLeave={e => e.currentTarget.style.color = '#64748B'}>
          <span className="mi-outlined mi-sm">add</span>Add cost item
        </button>
      </td>
    </tr>
  );

  return (
    <tr style={{ background: '#F0FDF4' }}>
      <td colSpan={6} style={{ padding: '14px 16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 8, alignItems: 'end' }}>
          {[
            { label: 'Item Name *', el: <input className="input" placeholder="e.g., Runway Concrete Works" value={form.name} onChange={e => setForm({...form, name: e.target.value})} autoFocus /> },
            { label: 'Unit', el: <select className="input" value={form.unit} onChange={e => setForm({...form, unit: e.target.value})}>{ITEM_UNITS.map(u => <option key={u} value={u}>{u}</option>)}</select> },
            { label: 'Quantity', el: <input className="input" type="number" min="0" step="any" value={form.quantity} onChange={e => setForm({...form, quantity: parseFloat(e.target.value)||0})} /> },
            { label: `Unit Cost (${currency})`, el: <input className="input" type="number" min="0" step="any" value={form.unitCost} onChange={e => setForm({...form, unitCost: parseFloat(e.target.value)||0})} /> },
          ].map(({ label, el }) => (
            <div className="input-group" key={label}><label className="input-label">{label}</label>{el}</div>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
          <div style={{ fontSize: 13, fontFamily: 'IBM Plex Mono, monospace', fontWeight: 500, color: '#16A34A', display: 'flex', alignItems: 'center', gap: 6 }}>
            <span className="mi-outlined mi-sm" style={{ color: '#16A34A' }}>calculate</span>
            Total: {formatCurrency(form.quantity * form.unitCost, currency)}
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <button className="btn btn-secondary btn-sm" onClick={() => setShow(false)}><span className="mi-outlined mi-sm">close</span>Cancel</button>
            <button disabled={loading} onClick={handleAdd} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 14px', background: '#0B1628', color: '#fff', border: 'none', borderRadius: 7, fontSize: 12, fontWeight: 700, fontFamily: 'Syne, sans-serif', cursor: loading ? 'not-allowed' : 'pointer' }}>
              <span className="mi-outlined mi-sm" style={{ color: '#F5A623' }}>add</span>{loading ? 'Adding…' : 'Add Item'}
            </button>
          </div>
        </div>
      </td>
    </tr>
  );
};

const DepartmentCard = ({ dept, projectId, currency, onProjectUpdate, onDelete }) => {
  const [expanded, setExpanded] = useState(true);
  const [editingDept, setEditingDept] = useState(false);
  const [deptForm, setDeptForm] = useState({ name: dept.name, description: dept.description||'', contingencyPercent: dept.contingencyPercent, status: dept.status, notes: dept.notes||'' });
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const baseCost = (dept.subItems||[]).reduce((sum, i) => sum + (i.quantity * i.unitCost), 0);
  const contingencyAmt = baseCost * (dept.contingencyPercent / 100);
  const totalCost = baseCost + contingencyAmt;

  const handleUpdateDept = async () => {
    setLoading(true);
    try { const res = await api.put(`/api/projects/${projectId}/departments/${dept._id}`, deptForm); onProjectUpdate(res.data.project); setEditingDept(false); toast.success('Department updated'); }
    catch { toast.error('Failed to update department'); }
    finally { setLoading(false); }
  };

  const handleAddItem = async (d) => { const res = await api.post(`/api/projects/${projectId}/departments/${dept._id}/items`, d); onProjectUpdate(res.data.project); };
  const handleUpdateItem = async (itemId, d) => { const res = await api.put(`/api/projects/${projectId}/departments/${dept._id}/items/${itemId}`, d); onProjectUpdate(res.data.project); };
  const handleDeleteItem = async (itemId) => {
    if (!window.confirm('Delete this cost item?')) return;
    try { const res = await api.delete(`/api/projects/${projectId}/departments/${dept._id}/items/${itemId}`); onProjectUpdate(res.data.project); toast.success('Item removed'); }
    catch { toast.error('Failed to delete item'); }
  };

  return (
    <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12, overflow: 'hidden', transition: 'border-color 0.15s' }}
      onMouseEnter={e => e.currentTarget.style.borderColor = '#CBD5E1'}
      onMouseLeave={e => e.currentTarget.style.borderColor = '#E2E8F0'}>
      {/* Header */}
      <div style={{ padding: '12px 16px', borderBottom: expanded ? '1px solid #F1F5F9' : 'none', display: 'flex', alignItems: 'center', gap: 10, background: expanded ? '#fff' : '#FAFBFC' }}>
        <button onClick={() => setExpanded(!expanded)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', flexShrink: 0 }}>
          <span className="mi-outlined mi-sm" style={{ color: '#94A3B8', transition: 'transform 0.2s', transform: expanded ? 'rotate(0deg)' : 'rotate(-90deg)' }}>expand_more</span>
        </button>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: '#0B1628', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <span className="mi-outlined" style={{ fontSize: 17, color: '#F5A623' }}>{dept.icon || 'construction'}</span>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          {editingDept ? (
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
              <input className="input" value={deptForm.name} onChange={e => setDeptForm({...deptForm, name: e.target.value})} style={{ width: 200 }} />
              <input className="input" type="number" min="0" max="50" value={deptForm.contingencyPercent} onChange={e => setDeptForm({...deptForm, contingencyPercent: parseFloat(e.target.value)||0})} style={{ width: 100 }} placeholder="Contingency %" />
              <select className="input" value={deptForm.status} onChange={e => setDeptForm({...deptForm, status: e.target.value})} style={{ width: 140 }}>
                {DEPT_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <button className="btn btn-secondary btn-sm" onClick={() => setEditingDept(false)}><span className="mi-outlined mi-sm">close</span></button>
              <button disabled={loading} onClick={handleUpdateDept} style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '6px 12px', background: '#0B1628', color: '#fff', border: 'none', borderRadius: 7, fontSize: 12, fontWeight: 700, fontFamily: 'Syne, sans-serif', cursor: 'pointer' }}>
                <span className="mi-outlined mi-sm" style={{ color: '#F5A623' }}>check</span>{loading ? '…' : 'Save'}
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <span style={{ fontWeight: 700, color: '#0B1628', fontSize: 14, fontFamily: 'Syne, sans-serif' }}>{dept.name}</span>
              <span className={`badge ${STATUS_COLORS[dept.status] || 'badge-gray'}`}>{dept.status}</span>
              {dept.contingencyPercent > 0 && (
                <span className="badge badge-amber" style={{ fontSize: 10 }}>+{dept.contingencyPercent}% contingency</span>
              )}
            </div>
          )}
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontWeight: 600, fontSize: 15, color: '#0B1628' }}>{formatCurrency(totalCost, currency)}</div>
          {contingencyAmt > 0 && <div style={{ fontSize: 11, color: '#94A3B8' }}>Base: {formatCurrency(baseCost, currency)}</div>}
        </div>
        <div style={{ display: 'flex', gap: 3, flexShrink: 0, marginLeft: 4 }}>
          <button onClick={() => setEditingDept(!editingDept)} style={{ padding: '5px 7px', background: 'none', border: 'none', cursor: 'pointer', borderRadius: 7, color: '#94A3B8', transition: 'all 0.1s' }} title="Edit department"
            onMouseEnter={e => { e.currentTarget.style.background = '#F1F5F9'; e.currentTarget.style.color = '#0B1628'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#94A3B8'; }}>
            <span className="mi-outlined mi-sm">edit</span>
          </button>
          <button onClick={() => onDelete(dept._id)} style={{ padding: '5px 7px', background: 'none', border: 'none', cursor: 'pointer', borderRadius: 7, color: '#94A3B8', transition: 'all 0.1s' }} title="Delete department"
            onMouseEnter={e => { e.currentTarget.style.background = '#FFF1F2'; e.currentTarget.style.color = '#DC2626'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#94A3B8'; }}>
            <span className="mi-outlined mi-sm">delete</span>
          </button>
        </div>
      </div>

      {/* Table */}
      {expanded && (
        <div style={{ overflowX: 'auto' }}>
          <table className="table" style={{ tableLayout: 'fixed' }}>
            <colgroup>
              <col style={{ width: '32%' }} /><col style={{ width: '10%' }} />
              <col style={{ width: '11%' }} /><col style={{ width: '14%' }} />
              <col style={{ width: '14%' }} /><col style={{ width: '19%' }} />
            </colgroup>
            <thead><tr>
              <th style={{ paddingLeft: 18 }}>Item Name</th>
              <th>Unit</th><th>Qty</th><th>Unit Cost</th><th>Total</th>
              <th style={{ textAlign: 'right', paddingRight: 14 }}>Actions</th>
            </tr></thead>
            <tbody>
              {(dept.subItems||[]).length === 0 && (
                <tr><td colSpan={6} style={{ padding: '20px', textAlign: 'center', color: '#94A3B8', fontSize: 13 }}>
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontFamily: 'IBM Plex Sans, sans-serif' }}>
                    <span className="mi-outlined mi-sm">playlist_add</span>No items yet
                  </span>
                </td></tr>
              )}
              {(dept.subItems||[]).map(item => (
                <SubItemRow key={item._id} item={item} currency={currency} onUpdate={handleUpdateItem} onDelete={handleDeleteItem} />
              ))}
              <AddItemForm onAdd={handleAddItem} currency={currency} />
            </tbody>
          </table>
          {(dept.subItems||[]).length > 0 && (
            <div style={{ padding: '10px 18px', background: '#0B1628', display: 'flex', justifyContent: 'flex-end', gap: 20, fontSize: 12, alignItems: 'center' }}>
              <span style={{ color: 'rgb(255 255 255 / 0.4)', display: 'flex', alignItems: 'center', gap: 4, fontFamily: 'IBM Plex Mono, monospace' }}>
                Base: <span style={{ color: '#fff' }}>{formatCurrency(baseCost, currency)}</span>
              </span>
              {contingencyAmt > 0 && <span style={{ color: 'rgb(255 255 255 / 0.4)', fontFamily: 'IBM Plex Mono, monospace' }}>
                +{dept.contingencyPercent}%: <span style={{ color: '#fff' }}>{formatCurrency(contingencyAmt, currency)}</span>
              </span>}
              <span style={{ fontWeight: 600, color: '#F5A623', fontFamily: 'IBM Plex Mono, monospace', fontSize: 13 }}>
                Total: {formatCurrency(totalCost, currency)}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DepartmentCard;
export { DEPT_STATUSES };
