import React from 'react';
import { formatCurrency } from '../../utils/api';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const CHART_COLORS = ['#0B1628','#1D7FE8','#F5A623','#16A34A','#7C3AED','#DC2626','#0F766E','#D97706','#1E40AF','#059669'];
const DEPT_ICON_MAP = { 'Runway & Taxiway':'airline_stops','Terminal Building':'business','Air Traffic Control Tower':'cell_tower','Baggage Handling System':'luggage','Utilities & MEP':'electrical_services','Road & Ground Access':'road','IT & Technology Systems':'devices','Fuel Farm & Storage':'local_gas_station','Administration Buildings':'account_balance','Environmental & Safety':'eco' };

const CostSummary = ({ project }) => {
  if (!project) return null;
  const currency = project.currency || 'USD';
  const depts = project.departments || [];
  const deptTotals = depts.map(dept => {
    const base = (dept.subItems || []).reduce((s, i) => s + (i.quantity * i.unitCost), 0);
    const contingency = base * (dept.contingencyPercent / 100);
    return { name: dept.name, icon: dept.icon || DEPT_ICON_MAP[dept.name] || 'construction', base, contingency, total: base + contingency, itemCount: dept.subItems?.length || 0, status: dept.status };
  });
  const totalBase = deptTotals.reduce((s, d) => s + d.base, 0);
  const totalContingency = deptTotals.reduce((s, d) => s + d.contingency, 0);
  const globalContingencyAmt = totalBase * (project.globalContingency / 100);
  const grandTotal = totalBase + globalContingencyAmt;
  const pieData = deptTotals.filter(d => d.total > 0).map(d => ({ name: d.name, value: d.total }));
  const barData = deptTotals.filter(d => d.total > 0).map(d => ({ name: d.name.length > 14 ? d.name.slice(0, 12) + '…' : d.name, value: d.total }));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Grand total — dark hero */}
      <div className="sky-bg" style={{ borderRadius: 16, padding: '28px 32px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgb(245 166 35 / 0.1) 0%, transparent 70%)' }} />
        <div style={{ fontSize: 10, color: 'rgb(255 255 255 / 0.4)', fontFamily: 'Syne, sans-serif', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
          <span className="mi-outlined mi-sm" style={{ color: 'rgb(245 166 35 / 0.6)' }}>account_balance</span>
          Grand Total Estimate · {project.projectCode}
        </div>
        <div style={{ fontSize: 48, fontFamily: 'IBM Plex Mono, monospace', fontWeight: 500, color: '#F5A623', letterSpacing: '-0.02em', marginBottom: 20 }}>
          {formatCurrency(grandTotal, currency)}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0, borderTop: '1px solid rgb(255 255 255 / 0.08)', paddingTop: 20 }}>
          {[
            { label: 'Base Cost',       value: formatCurrency(totalBase, currency),              icon: 'receipt' },
            { label: 'Dept Contingency',value: formatCurrency(totalContingency, currency),        icon: 'add_circle' },
            { label: `Global +${project.globalContingency}%`, value: formatCurrency(globalContingencyAmt, currency), icon: 'percent' },
          ].map((item, i) => (
            <div key={i} style={{ paddingLeft: i > 0 ? 24 : 0, borderLeft: i > 0 ? '1px solid rgb(255 255 255 / 0.08)' : 'none', marginLeft: i > 0 ? 24 : 0 }}>
              <div style={{ fontSize: 10, color: 'rgb(255 255 255 / 0.35)', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 4, fontFamily: 'Syne, sans-serif', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                <span className="mi-outlined" style={{ fontSize: 12 }}>{item.icon}</span>{item.label}
              </div>
              <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontWeight: 500, fontSize: 17, color: '#fff' }}>{item.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Charts */}
      {deptTotals.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: 16 }}>
          <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 14, padding: 20 }}>
            <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: 13, fontWeight: 700, color: '#0B1628', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 6 }}>
              <span className="mi-outlined mi-sm" style={{ color: '#94A3B8' }}>donut_large</span>Cost Distribution
            </h3>
            <ResponsiveContainer width="100%" height={190}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={52} outerRadius={80} paddingAngle={2} dataKey="value">
                  {pieData.map((_, idx) => <Cell key={idx} fill={CHART_COLORS[idx % CHART_COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={v => formatCurrency(v, currency)} contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E2E8F0' }} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginTop: 8 }}>
              {pieData.slice(0, 5).map((d, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 11 }}>
                  <div style={{ width: 9, height: 9, borderRadius: 3, background: CHART_COLORS[i % CHART_COLORS.length], flexShrink: 0 }} />
                  <span style={{ color: '#64748B', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: 'IBM Plex Sans, sans-serif' }}>{d.name}</span>
                  <span style={{ fontFamily: 'IBM Plex Mono, monospace', color: '#0B1628', fontWeight: 500 }}>{grandTotal > 0 ? Math.round(d.value / grandTotal * 100) : 0}%</span>
                </div>
              ))}
              {pieData.length > 5 && <div style={{ fontSize: 11, color: '#CBD5E1', fontFamily: 'IBM Plex Sans, sans-serif' }}>+{pieData.length - 5} more</div>}
            </div>
          </div>
          <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 14, padding: 20 }}>
            <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: 13, fontWeight: 700, color: '#0B1628', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 6 }}>
              <span className="mi-outlined mi-sm" style={{ color: '#94A3B8' }}>bar_chart</span>Cost by Department
            </h3>
            <ResponsiveContainer width="100%" height={230}>
              <BarChart data={barData} margin={{ top: 0, right: 0, left: 8, bottom: 42 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#94A3B8', fontFamily: 'IBM Plex Mono' }} angle={-35} textAnchor="end" interval={0} />
                <YAxis tickFormatter={v => v >= 1e9 ? `$${(v/1e9).toFixed(1)}B` : v >= 1e6 ? `$${(v/1e6).toFixed(0)}M` : `$${v}`} tick={{ fontSize: 10, fill: '#94A3B8' }} />
                <Tooltip formatter={v => formatCurrency(v, currency)} contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E2E8F0' }} cursor={{ fill: '#F8FAFC' }} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {barData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Breakdown table */}
      <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 14, overflow: 'hidden' }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', gap: 8, background: '#0B1628' }}>
          <span className="mi-outlined mi-sm" style={{ color: '#F5A623' }}>table_view</span>
          <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: 13, fontWeight: 700, color: '#fff' }}>Department Breakdown</h3>
        </div>
        {deptTotals.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#94A3B8' }}>
            <span className="mi-outlined mi-xl" style={{ color: '#E2E8F0', display: 'block', marginBottom: 8 }}>table_chart</span>
            <p style={{ fontFamily: 'IBM Plex Sans, sans-serif' }}>No departments added yet.</p>
          </div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th style={{ paddingLeft: 20 }}>Department</th>
                <th>Items</th>
                <th>Base Cost</th>
                <th>Contingency</th>
                <th>Total</th>
                <th>Share</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {deptTotals.map((d, i) => (
                <tr key={i}>
                  <td style={{ paddingLeft: 20 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 28, height: 28, borderRadius: 7, background: CHART_COLORS[i % CHART_COLORS.length], display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <span className="mi-outlined" style={{ fontSize: 15, color: '#fff' }}>{d.icon}</span>
                      </div>
                      <span style={{ fontWeight: 600, color: '#0B1628', fontFamily: 'IBM Plex Sans, sans-serif' }}>{d.name}</span>
                    </div>
                  </td>
                  <td style={{ color: '#94A3B8', fontFamily: 'IBM Plex Mono, monospace' }}>{d.itemCount}</td>
                  <td style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 12 }}>{formatCurrency(d.base, currency)}</td>
                  <td style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 12, color: '#94A3B8' }}>{formatCurrency(d.contingency, currency)}</td>
                  <td style={{ fontFamily: 'IBM Plex Mono, monospace', fontWeight: 600, color: '#0B1628' }}>{formatCurrency(d.total, currency)}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                      <div style={{ flex: 1, height: 5, background: '#F1F5F9', borderRadius: 999, maxWidth: 72, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${grandTotal > 0 ? Math.min(100, d.total/grandTotal*100) : 0}%`, background: CHART_COLORS[i % CHART_COLORS.length], borderRadius: 999 }} />
                      </div>
                      <span style={{ fontSize: 11, color: '#64748B', fontFamily: 'IBM Plex Mono, monospace', minWidth: 34 }}>{grandTotal > 0 ? (d.total/grandTotal*100).toFixed(1) : 0}%</span>
                    </div>
                  </td>
                  <td><span className="badge badge-gray">{d.status}</span></td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr style={{ background: '#0B1628' }}>
                <td style={{ paddingLeft: 20, fontWeight: 700, color: '#fff', fontFamily: 'Syne, sans-serif' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span className="mi-outlined mi-sm" style={{ color: '#F5A623' }}>calculate</span>Grand Total
                  </div>
                </td>
                <td style={{ color: 'rgb(255 255 255 / 0.4)', fontFamily: 'IBM Plex Mono, monospace' }}>{deptTotals.reduce((s, d) => s + d.itemCount, 0)}</td>
                <td style={{ fontFamily: 'IBM Plex Mono, monospace', fontWeight: 600, color: '#fff' }}>{formatCurrency(totalBase, currency)}</td>
                <td style={{ fontFamily: 'IBM Plex Mono, monospace', color: 'rgb(255 255 255 / 0.5)' }}>{formatCurrency(totalContingency + globalContingencyAmt, currency)}</td>
                <td colSpan={3} style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 18, fontWeight: 500, color: '#F5A623' }}>{formatCurrency(grandTotal, currency)}</td>
              </tr>
            </tfoot>
          </table>
        )}
      </div>

      {/* Project details */}
      <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 14, overflow: 'hidden' }}>
        <div style={{ padding: '12px 20px', borderBottom: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="mi-outlined mi-sm" style={{ color: '#94A3B8' }}>info</span>
          <span style={{ fontFamily: 'Syne, sans-serif', fontSize: 12, fontWeight: 700, color: '#64748B', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Project Details</span>
        </div>
        <div style={{ padding: '16px 20px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          {[
            { label: 'Project Code',      val: project.projectCode,       icon: 'tag',               mono: true },
            { label: 'Airport Type',      val: project.airportType,       icon: 'flight' },
            { label: 'Runways',           val: project.runwayCount,       icon: 'airline_stops' },
            { label: 'Passengers / yr',   val: project.expectedPassengersPerYear ? (project.expectedPassengersPerYear/1e6).toFixed(1)+'M' : '—', icon: 'groups' },
            { label: 'Location',          val: [project.location, project.country].filter(Boolean).join(', ')||'—', icon: 'location_on' },
            { label: 'Currency',          val: project.currency,          icon: 'payments' },
            { label: 'Global Contingency',val: `${project.globalContingency}%`, icon: 'percent' },
            { label: 'Status',            val: project.status,            icon: 'info' },
          ].map(({ label, val, icon, mono }) => (
            <div key={label}>
              <div style={{ fontSize: 10, color: '#94A3B8', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 4, fontFamily: 'Syne, sans-serif', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                <span className="mi-outlined" style={{ fontSize: 13 }}>{icon}</span>{label}
              </div>
              <div style={{ fontWeight: 600, color: '#0B1628', fontFamily: mono ? 'IBM Plex Mono, monospace' : 'IBM Plex Sans, sans-serif', textTransform: 'capitalize', fontSize: 14 }}>{val||'—'}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CostSummary;
