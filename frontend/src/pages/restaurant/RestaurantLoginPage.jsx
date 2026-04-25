import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useRestaurantOwnerAuth } from '../../context/RestaurantOwnerAuthContext.jsx';

export default function RestaurantLoginPage() {
  const { restaurantToken, checkingRestaurantSession, login, logout } = useRestaurantOwnerAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (checkingRestaurantSession) {
    return (
      <section className="admin-login-page restaurant-login-page">
        <div className="auth-form admin-login-card">
          <p className="eyebrow">Restaurant access</p>
          <h1>Checking restaurant session</h1>
          <p className="muted">Verifying your saved restaurant login.</p>
        </div>
      </section>
    );
  }

  if (restaurantToken) return <Navigate to="/restaurant" replace />;

  async function submit(event) {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(form);
      navigate('/restaurant');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="admin-login-page restaurant-login-page">
      <form className="auth-form admin-login-card" onSubmit={submit}>
        <p className="eyebrow">Partner access</p>
        <h1>Restaurant login</h1>
        {error && <p className="alert error">{error}</p>}
        <label>
          Restaurant email
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
          {loading ? 'Checking...' : 'Enter Restaurant Dashboard'}
        </button>
        <button type="button" className="text-button" onClick={logout}>
          Clear saved restaurant session
        </button>
        <Link className="text-button" to="/restaurant/register">
          New partner? Register your restaurant
        </Link>
      </form>
    </section>
  );
}
