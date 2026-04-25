import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function AuthPage() {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState('login');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: '',
    password: '',
    phone: '',
    first_name: '',
    last_name: '',
    address: '',
    city: '',
    pincode: ''
  });

  async function submit(event) {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (mode === 'login') {
        await login({ email: form.email, password: form.password });
      } else {
        await register(form);
      }
      navigate('/restaurants');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function updateField(field, value) {
    setForm({ ...form, [field]: value });
  }

  return (
    <section className="auth-page">
      <form className="auth-form" onSubmit={submit}>
        <p className="eyebrow">Customer account</p>
        <h1>{mode === 'login' ? 'Login' : 'Create account'}</h1>
        {error && <p className="alert error">{error}</p>}

        <label>
          Email
          <input type="email" required value={form.email} onChange={(event) => updateField('email', event.target.value)} />
        </label>
        <label>
          Password
          <input type="password" required minLength="8" value={form.password} onChange={(event) => updateField('password', event.target.value)} />
        </label>

        {mode === 'register' && (
          <>
            <div className="two-column">
              <label>
                First name
                <input required value={form.first_name} onChange={(event) => updateField('first_name', event.target.value)} />
              </label>
              <label>
                Last name
                <input value={form.last_name} onChange={(event) => updateField('last_name', event.target.value)} />
              </label>
            </div>
            <label>
              Phone
              <input required value={form.phone} onChange={(event) => updateField('phone', event.target.value)} />
            </label>
            <label>
              Address
              <textarea value={form.address} onChange={(event) => updateField('address', event.target.value)} />
            </label>
            <div className="two-column">
              <label>
                City
                <input value={form.city} onChange={(event) => updateField('city', event.target.value)} />
              </label>
              <label>
                Pincode
                <input value={form.pincode} onChange={(event) => updateField('pincode', event.target.value)} />
              </label>
            </div>
          </>
        )}

        <button type="submit" className="button primary full-width" disabled={loading}>
          {loading ? 'Please wait...' : mode === 'login' ? 'Login' : 'Register'}
        </button>
        <button
          type="button"
          className="text-button"
          onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
        >
          {mode === 'login' ? 'Need an account? Register' : 'Already have an account? Login'}
        </button>
      </form>
    </section>
  );
}
