import { useState } from 'react';
import { useRestaurantOwnerAuth } from '../../context/RestaurantOwnerAuthContext.jsx';
import { updateRestaurantProfile } from '../../services/restaurantOwnerService.js';

export default function RestaurantProfilePage() {
  const { restaurant, setRestaurant } = useRestaurantOwnerAuth();
  const [form, setForm] = useState({
    name: restaurant?.name || '',
    owner_name: restaurant?.owner_name || '',
    phone: restaurant?.phone || '',
    address: restaurant?.address || '',
    city: restaurant?.city || '',
    pincode: restaurant?.pincode || '',
    cuisine_type: restaurant?.cuisine_type || '',
    description: restaurant?.description || '',
    delivery_fee: restaurant?.delivery_fee || 0,
    is_open: Boolean(restaurant?.is_open)
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  async function submit(event) {
    event.preventDefault();
    setMessage('');
    setError('');
    try {
      const response = await updateRestaurantProfile(form);
      setRestaurant(response.data);
      localStorage.setItem('fooddash_restaurant', JSON.stringify(response.data));
      setMessage('Restaurant profile updated.');
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <section className="admin-page">
      <div className="admin-heading">
        <div>
          <p className="eyebrow">Restaurant profile</p>
          <h1>Business settings</h1>
        </div>
      </div>

      {message && <p className="alert success">{message}</p>}
      {error && <p className="alert error">{error}</p>}
      <form className="admin-form" onSubmit={submit}>
        <h2>Update restaurant details</h2>
        <input required placeholder="Restaurant name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
        <input required placeholder="Owner name" value={form.owner_name} onChange={(event) => setForm({ ...form, owner_name: event.target.value })} />
        <input required placeholder="Phone" value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} />
        <input required placeholder="Address" value={form.address} onChange={(event) => setForm({ ...form, address: event.target.value })} />
        <input required placeholder="City" value={form.city} onChange={(event) => setForm({ ...form, city: event.target.value })} />
        <input required placeholder="Pincode" value={form.pincode} onChange={(event) => setForm({ ...form, pincode: event.target.value })} />
        <input required placeholder="Cuisine" value={form.cuisine_type} onChange={(event) => setForm({ ...form, cuisine_type: event.target.value })} />
        <input type="number" min="0" placeholder="Delivery fee" value={form.delivery_fee} onChange={(event) => setForm({ ...form, delivery_fee: Number(event.target.value) })} />
        <select value={form.is_open ? 'true' : 'false'} onChange={(event) => setForm({ ...form, is_open: event.target.value === 'true' })}>
          <option value="true">Open for orders</option>
          <option value="false">Temporarily closed</option>
        </select>
        <textarea placeholder="Description" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} />
        <button className="button primary" type="submit">Save profile</button>
      </form>
    </section>
  );
}
