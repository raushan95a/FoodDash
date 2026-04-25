import { Navigate, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAdminAuth } from '../../context/AdminAuthContext.jsx';

export default function AdminLoginPage() {
  const { adminToken, checkingAdminSession, login, logout } = useAdminAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (checkingAdminSession) {
    return (
      <section className="admin-login-page">
        <div className="auth-form admin-login-card">
          <p className="eyebrow">Restricted access</p>
          <h1>Checking admin session</h1>
          <p className="muted">Hang tight while we verify your saved admin login.</p>
        </div>
      </section>
    );
  }

  if (adminToken) return <Navigate to="/admin" replace />;

  async function submit(event) {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(form);
      navigate('/admin');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="admin-login-page">
      <form className="auth-form admin-login-card" onSubmit={submit}>
        <p className="eyebrow">Restricted access</p>
        <h1>Admin login</h1>
        {error && <p className="alert error">{error}</p>}
        <label>
          Admin email
          <input
            type="email"
            required
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
          />
        </label>
        <label>
          Password
          <input
            type="password"
            required
            value={form.password}
            onChange={(event) => setForm({ ...form, password: event.target.value })}
          />
        </label>
        <button type="submit" className="button primary full-width" disabled={loading}>
          {loading ? 'Checking...' : 'Enter Admin Panel'}
        </button>
        <button type="button" className="text-button" onClick={logout}>
          Clear saved admin session
        </button>
      </form>
    </section>
  );
}
