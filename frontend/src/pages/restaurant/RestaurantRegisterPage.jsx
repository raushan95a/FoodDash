import { Link } from 'react-router-dom';
import { useState } from 'react';
import { registerRestaurant } from '../../services/restaurantService.js';

const emptyForm = {
  name: '',
  owner_name: '',
  email: '',
  owner_password: '',
  phone: '',
  address: '',
  city: 'Vijayawada',
  pincode: '',
  cuisine_type: '',
  description: '',
  delivery_fee: 0
};

export default function RestaurantRegisterPage() {
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  function updateField(field, value) {
    setForm({ ...form, [field]: value });
  }

  async function submit(event) {
    event.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await registerRestaurant(form);
      setForm(emptyForm);
      setSuccess('Restaurant submitted for admin approval. You can log in after approval.');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="auth-page restaurant-register-page">
      <form className="auth-form restaurant-register-card" onSubmit={submit}>
        <p className="eyebrow">Partner onboarding</p>
        <h1>Register your restaurant</h1>
        <p className="muted">Create a restaurant profile for FoodDash. New listings stay pending until the admin approves them.</p>
        {error && <p className="alert error">{error}</p>}
        {success && <p className="alert success">{success}</p>}

        <label>
          Restaurant name
          <input required value={form.name} onChange={(event) => updateField('name', event.target.value)} />
        </label>
        <div className="two-column">
          <label>
            Owner name
            <input required value={form.owner_name} onChange={(event) => updateField('owner_name', event.target.value)} />
          </label>
          <label>
            Phone
            <input required value={form.phone} onChange={(event) => updateField('phone', event.target.value)} />
          </label>
        </div>
        <div className="two-column">
          <label>
            Email
            <input type="email" required value={form.email} onChange={(event) => updateField('email', event.target.value)} />
          </label>
          <label>
            Dashboard password
            <input type="password" required minLength="8" value={form.owner_password} onChange={(event) => updateField('owner_password', event.target.value)} />
          </label>
        </div>
        <label>
          Address
          <textarea required value={form.address} onChange={(event) => updateField('address', event.target.value)} />
        </label>
        <div className="two-column">
          <label>
            City
            <input required value={form.city} onChange={(event) => updateField('city', event.target.value)} />
          </label>
          <label>
            Pincode
            <input required value={form.pincode} onChange={(event) => updateField('pincode', event.target.value)} />
          </label>
        </div>
        <div className="two-column">
          <label>
            Cuisine type
            <input required placeholder="South Indian, Chinese, Healthy..." value={form.cuisine_type} onChange={(event) => updateField('cuisine_type', event.target.value)} />
          </label>
          <label>
            Delivery fee
            <input type="number" min="0" value={form.delivery_fee} onChange={(event) => updateField('delivery_fee', Number(event.target.value))} />
          </label>
        </div>
        <label>
          Description
          <textarea value={form.description} onChange={(event) => updateField('description', event.target.value)} />
        </label>
        <button type="submit" className="button primary full-width" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit for approval'}
        </button>
        <Link className="text-button" to="/restaurant/login">Already approved? Login to dashboard</Link>
      </form>
    </section>
  );
}
