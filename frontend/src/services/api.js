const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export async function apiRequest(path, options = {}) {
  const token = path.startsWith('/admin')
    ? localStorage.getItem('fooddash_admin_token')
    : path.startsWith('/restaurant-owner')
      ? localStorage.getItem('fooddash_restaurant_token')
      : localStorage.getItem('fooddash_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers
  });
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const details = Array.isArray(data.details) ? `: ${data.details.join(', ')}` : '';
    throw new Error(`${data.message || 'Request failed'}${details}`);
  }

  return data;
}
