import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const features = [
  { icon: 'construction',      title: 'Project Blocks',       desc: 'Create airport projects with structured department blocks — from apron to admin buildings.' },
  { icon: 'account_tree',      title: 'Nested Cost Items',    desc: 'Add unlimited sub-items per department. Every unit cost, quantity, and total auto-calculated.' },
  { icon: 'payments',          title: 'Live Cost Totals',     desc: 'Grand totals update instantly as you edit. Per-dept and global contingency baked in.' },
  { icon: 'donut_large',       title: 'Visual Summary',       desc: 'Pie and bar charts give instant visibility into cost distribution across departments.' },
  { icon: 'folder_special',    title: '10 Templates',         desc: 'Pre-built templates for runways, terminals, ATC, IT, fuel systems and more.' },
  { icon: 'currency_exchange', title: 'Multi-Currency',       desc: 'USD, EUR, INR, AED and more — estimate in the currency of the project country.' },
];

const departmentPreviews = [
  { icon: 'airline_stops',    name: 'Runway & Taxiway',          cost: '$147M',  pct: 19, color: '#1D7FE8' },
  { icon: 'business',         name: 'Terminal Building',         cost: '$382M',  pct: 49, color: '#0B1628' },
  { icon: 'electrical_services', name: 'Utilities & MEP',        cost: '$96M',   pct: 12, color: '#16A34A' },
  { icon: 'devices',          name: 'IT & Technology Systems',   cost: '$63M',   pct: 8,  color: '#7C3AED' },
  { icon: 'eco',              name: 'Environmental & Safety',    cost: '$42M',   pct: 5,  color: '#059669' },
];

// Animated runway dots
const RunwayDots = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
    {[...Array(8)].map((_, i) => (
      <div key={i} style={{
        width: 20, height: 4, borderRadius: 2,
        background: i % 2 === 0 ? '#F5A623' : 'rgb(245 166 35 / 0.2)',
      }} />
    ))}
  </div>
);

const LandingPage = () => {
  const { user } = useAuth();

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC' }}>

      {/* ===== HERO ===== */}
      <section className="sky-bg" style={{ padding: '72px 24px 80px', position: 'relative', overflow: 'hidden' }}>
        {/* Background grid pattern */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgb(255 255 255 / 0.03) 1px, transparent 1px), linear-gradient(90deg, rgb(255 255 255 / 0.03) 1px, transparent 1px)', backgroundSize: '48px 48px', pointerEvents: 'none' }} />
        {/* Glowing orb */}
        <div style={{ position: 'absolute', top: -120, right: -80, width: 480, height: 480, borderRadius: '50%', background: 'radial-gradient(circle, rgb(245 166 35 / 0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center', position: 'relative' }}>
          {/* Left */}
          <div className="fade-up">
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '5px 14px', background: 'rgb(245 166 35 / 0.12)', border: '1px solid rgb(245 166 35 / 0.25)', borderRadius: 999, marginBottom: 24 }}>
              <span className="mi-round" style={{ fontSize: 13, color: '#F5A623' }}>flight_takeoff</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#F5A623', fontFamily: 'Syne, sans-serif', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Airport Cost Estimation Platform</span>
            </div>

            <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: 52, fontWeight: 800, color: '#fff', lineHeight: 1.05, marginBottom: 20, letterSpacing: '-0.03em' }}>
              Plan every dollar of your{' '}
              <span style={{ color: '#F5A623', display: 'inline-block' }}>airport project</span>
            </h1>
            <p style={{ fontSize: 17, color: 'rgb(255 255 255 / 0.6)', lineHeight: 1.7, marginBottom: 36, maxWidth: 460, fontFamily: 'IBM Plex Sans, sans-serif', fontWeight: 300 }}>
              A structured platform for aviation planners, governments, and investors to build comprehensive cost models — from regional airstrips to international hubs.
            </p>

            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 40 }}>
              {user ? (
                <Link to="/dashboard" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8, padding: '12px 24px', background: '#F5A623', color: '#0B1628', borderRadius: 10, fontSize: 15, fontWeight: 800, fontFamily: 'Syne, sans-serif', boxShadow: '0 4px 16px rgb(245 166 35 / 0.4)', transition: 'all 0.15s' }}>
                  <span className="mi-outlined" style={{ color: '#0B1628' }}>grid_view</span>
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link to="/register" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8, padding: '12px 24px', background: '#F5A623', color: '#0B1628', borderRadius: 10, fontSize: 15, fontWeight: 800, fontFamily: 'Syne, sans-serif', boxShadow: '0 4px 16px rgb(245 166 35 / 0.4)', transition: 'all 0.15s' }}>
                    Start free
                    <span className="mi-outlined" style={{ color: '#0B1628', fontSize: 18 }}>arrow_forward</span>
                  </Link>
                  <Link to="/login" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8, padding: '12px 24px', background: 'rgb(255 255 255 / 0.07)', color: 'rgb(255 255 255 / 0.8)', borderRadius: 10, fontSize: 15, fontWeight: 600, fontFamily: 'IBM Plex Sans, sans-serif', border: '1px solid rgb(255 255 255 / 0.12)', transition: 'all 0.15s' }}>
                    Sign in
                  </Link>
                </>
              )}
            </div>

            <RunwayDots />
            <p style={{ fontSize: 11, color: 'rgb(255 255 255 / 0.3)', marginTop: 10, fontFamily: 'IBM Plex Mono, monospace', letterSpacing: '0.04em' }}>RUNWAY-01 · CLEARED FOR TAKEOFF</p>
          </div>

          {/* Right — mock project card */}
          <div className="fade-up-2">
            <div style={{ background: 'rgb(255 255 255 / 0.04)', border: '1px solid rgb(255 255 255 / 0.1)', borderRadius: 20, padding: 24, backdropFilter: 'blur(16px)' }}>
              {/* Card header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                <div>
                  <div style={{ fontSize: 10, color: 'rgb(255 255 255 / 0.3)', fontFamily: 'IBM Plex Mono, monospace', marginBottom: 4, letterSpacing: '0.08em' }}>ARP-0042 · INTL EXPANSION</div>
                  <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, color: '#fff', fontSize: 16, lineHeight: 1.2 }}>Dubai South Airport<br/>Terminal 3</div>
                </div>
                <span style={{ background: 'rgb(245 166 35 / 0.15)', color: '#F5A623', border: '1px solid rgb(245 166 35 / 0.25)', padding: '3px 10px', borderRadius: 999, fontSize: 11, fontWeight: 700, fontFamily: 'Syne, sans-serif', letterSpacing: '0.04em' }}>CONSTRUCTION</span>
              </div>

              {/* Departments */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {departmentPreviews.map((d, i) => (
                  <div key={i}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 5, alignItems: 'center' }}>
                      <span style={{ color: 'rgb(255 255 255 / 0.7)', display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'IBM Plex Sans, sans-serif' }}>
                        <span className="mi-outlined" style={{ fontSize: 14, color: 'rgb(255 255 255 / 0.35)' }}>{d.icon}</span>
                        {d.name}
                      </span>
                      <span style={{ fontFamily: 'IBM Plex Mono, monospace', color: '#fff', fontWeight: 500, fontSize: 13 }}>{d.cost}</span>
                    </div>
                    <div style={{ height: 5, background: 'rgb(255 255 255 / 0.06)', borderRadius: 999, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${d.pct}%`, background: `linear-gradient(90deg, ${d.color}, ${d.color}cc)`, borderRadius: 999, transition: 'width 0.8s ease' }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 20, paddingTop: 16, borderTop: '1px solid rgb(255 255 255 / 0.08)' }}>
                <div style={{ background: 'rgb(255 255 255 / 0.04)', border: '1px solid rgb(255 255 255 / 0.07)', borderRadius: 10, padding: '12px 14px' }}>
                  <div style={{ fontSize: 10, color: 'rgb(255 255 255 / 0.35)', fontFamily: 'Syne, sans-serif', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 4 }}>Total Estimate</div>
                  <div style={{ fontSize: 22, fontFamily: 'IBM Plex Mono, monospace', fontWeight: 500, color: '#fff' }}>$730M</div>
                </div>
                <div style={{ background: 'rgb(245 166 35 / 0.08)', border: '1px solid rgb(245 166 35 / 0.15)', borderRadius: 10, padding: '12px 14px' }}>
                  <div style={{ fontSize: 10, color: 'rgb(245 166 35 / 0.6)', fontFamily: 'Syne, sans-serif', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 4 }}>Departments</div>
                  <div style={{ fontSize: 22, fontFamily: 'IBM Plex Mono, monospace', fontWeight: 500, color: '#F5A623' }}>8 blocks</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Runway divider */}
      <div style={{ background: '#0B1628', padding: '12px 0' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ flex: 1, height: 2, background: 'repeating-linear-gradient(90deg, #F5A623 0, #F5A623 20px, transparent 20px, transparent 36px)' }} />
          <span style={{ color: 'rgb(255 255 255 / 0.3)', fontSize: 10, fontFamily: 'IBM Plex Mono, monospace', letterSpacing: '0.12em', whiteSpace: 'nowrap' }}>TWY-A · TAXIWAY ALPHA</span>
          <div style={{ flex: 1, height: 2, background: 'repeating-linear-gradient(90deg, #F5A623 0, #F5A623 20px, transparent 20px, transparent 36px)' }} />
        </div>
      </div>

      {/* ===== STATS ===== */}
      <section style={{ background: '#fff', padding: '40px 24px', borderBottom: '1px solid #E2E8F0' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0 }}>
          {[
            { value: '10+',  label: 'Department Templates', icon: 'category' },
            { value: '100+', label: 'Default Cost Items',   icon: 'list_alt' },
            { value: '10',   label: 'Currencies Supported', icon: 'currency_exchange' },
            { value: '∞',    label: 'Custom Departments',   icon: 'all_inclusive' },
          ].map((s, i) => (
            <div key={i} style={{ textAlign: 'center', padding: '20px 24px', borderRight: i < 3 ? '1px solid #F1F5F9' : 'none' }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: '#F8FAFC', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                <span className="mi-outlined" style={{ color: '#0B1628', fontSize: 20 }}>{s.icon}</span>
              </div>
              <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 32, fontWeight: 800, color: '#0B1628', letterSpacing: '-0.03em', lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: 12, color: '#94A3B8', marginTop: 6, fontFamily: 'IBM Plex Sans, sans-serif' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 999, marginBottom: 16 }}>
              <span className="mi-outlined" style={{ fontSize: 13, color: '#64748B' }}>widgets</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#64748B', fontFamily: 'Syne, sans-serif', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Platform Features</span>
            </div>
            <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: 38, fontWeight: 800, color: '#0B1628', letterSpacing: '-0.03em', marginBottom: 12 }}>
              Everything from runway to routers
            </h2>
            <p style={{ color: '#64748B', fontSize: 16, fontFamily: 'IBM Plex Sans, sans-serif', fontWeight: 300 }}>
              Model every cost category with professional-grade tools
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {features.map((f, i) => (
              <div key={i} style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 14, padding: '24px', transition: 'all 0.2s', cursor: 'default' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#F5A623'; e.currentTarget.style.boxShadow = '0 8px 24px rgb(245 166 35 / 0.12)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#E2E8F0'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: '#0B1628', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16, boxShadow: '0 4px 12px rgb(11 22 40 / 0.2)' }}>
                  <span className="mi-outlined mi-lg" style={{ color: '#F5A623' }}>{f.icon}</span>
                </div>
                <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: 15, fontWeight: 700, color: '#0B1628', marginBottom: 8 }}>{f.title}</h3>
                <p style={{ fontSize: 13, color: '#64748B', lineHeight: 1.65, fontFamily: 'IBM Plex Sans, sans-serif', fontWeight: 300 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="sky-bg" style={{ padding: '80px 24px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', bottom: -60, left: -60, width: 320, height: 320, borderRadius: '50%', background: 'radial-gradient(circle, rgb(245 166 35 / 0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center', position: 'relative' }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgb(245 166 35 / 0.1)', border: '1px solid rgb(245 166 35 / 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
            <span className="mi-round mi-xl" style={{ color: '#F5A623' }}>flight_takeoff</span>
          </div>
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: 42, fontWeight: 800, color: '#fff', letterSpacing: '-0.03em', marginBottom: 16 }}>
            Ready for takeoff?
          </h2>
          <p style={{ color: 'rgb(255 255 255 / 0.55)', fontSize: 16, marginBottom: 36, fontFamily: 'IBM Plex Sans, sans-serif', fontWeight: 300, lineHeight: 1.7 }}>
            Create your first airport project in minutes. Add departments, enter cost items, and get a complete cost summary instantly.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            {user ? (
              <Link to="/dashboard" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8, padding: '13px 28px', background: '#F5A623', color: '#0B1628', borderRadius: 10, fontSize: 15, fontWeight: 800, fontFamily: 'Syne, sans-serif', boxShadow: '0 4px 20px rgb(245 166 35 / 0.4)' }}>
                <span className="mi-outlined">grid_view</span> Go to Dashboard
              </Link>
            ) : (
              <>
                <Link to="/register" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8, padding: '13px 28px', background: '#F5A623', color: '#0B1628', borderRadius: 10, fontSize: 15, fontWeight: 800, fontFamily: 'Syne, sans-serif', boxShadow: '0 4px 20px rgb(245 166 35 / 0.4)' }}>
                  Create free account <span className="mi-outlined" style={{ fontSize: 18 }}>arrow_forward</span>
                </Link>
                <Link to="/login" style={{ textDecoration: 'none', padding: '13px 24px', background: 'rgb(255 255 255 / 0.07)', color: 'rgb(255 255 255 / 0.8)', borderRadius: 10, fontSize: 15, fontWeight: 500, fontFamily: 'IBM Plex Sans, sans-serif', border: '1px solid rgb(255 255 255 / 0.12)' }}>Sign in</Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: '#060D1A', padding: '20px 24px', borderTop: '1px solid rgb(255 255 255 / 0.05)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 24, height: 24, borderRadius: 6, background: '#F5A623', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span className="mi-round" style={{ fontSize: 13, color: '#0B1628' }}>flight</span>
            </div>
            <span style={{ fontFamily: 'Syne, sans-serif', fontSize: 14, fontWeight: 700, color: 'rgb(255 255 255 / 0.4)' }}>AirCost</span>
          </div>
          <span style={{ fontSize: 11, color: 'rgb(255 255 255 / 0.2)', fontFamily: 'IBM Plex Mono, monospace', letterSpacing: '0.04em' }}>AIRPORT COST ESTIMATION PLATFORM</span>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
