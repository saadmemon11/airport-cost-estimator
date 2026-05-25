import axios from 'axios';

const api = axios.create({ baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000' });

api.interceptors.request.use(config => {
  const token = localStorage.getItem('aircost_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  res => res,
  err => { if (err.response?.status === 401) { localStorage.removeItem('aircost_token'); window.location.href = '/login'; } return Promise.reject(err); }
);

export const formatCurrency = (amount, currency = 'USD') => {
  if (!amount && amount !== 0) return '—';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency, notation: amount >= 1e9 ? 'compact' : 'standard', maximumFractionDigits: amount >= 1e9 ? 2 : 0 }).format(amount);
};

export const formatNumber = (n) => new Intl.NumberFormat('en-US').format(n || 0);

export const calcDeptTotal = (dept) => {
  const base = (dept.subItems || []).reduce((sum, item) => sum + ((item.quantity || 0) * (item.unitCost || 0)), 0);
  return base + base * ((dept.contingencyPercent || 0) / 100);
};

export const calcProjectTotal = (project) => {
  if (!project?.departments) return 0;
  const base = project.departments.reduce((sum, d) => sum + (d.subItems || []).reduce((s, i) => s + ((i.quantity || 0) * (i.unitCost || 0)), 0), 0);
  return base + base * ((project.globalContingency || 0) / 100);
};

export const STATUS_COLORS = {
  draft: 'badge-gray', planning: 'badge-blue', design: 'badge-blue',
  approval: 'badge-amber', construction: 'badge-amber', completed: 'badge-green',
  cancelled: 'badge-red', 'in-progress': 'badge-amber', pending: 'badge-gray',
  'on-hold': 'badge-amber', procurement: 'badge-blue'
};

export default api;
