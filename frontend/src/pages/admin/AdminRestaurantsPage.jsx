import { Plus, Search } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import {
  createRestaurant,
  deleteRestaurant,
  getAdminRestaurants,
  setRestaurantApproval,
  updateRestaurant
} from '../../services/adminService.js';
import { formatCurrency } from '../../utils/formatters.js';

const emptyForm = {
  name: '',
  owner_name: '',
  email: '',
  phone: '',
  address: '',
  city: 'Vijayawada',
  pincode: '',
  cuisine_type: '',
  owner_password: '',
  description: '',
  delivery_fee: 0,
  is_open: true,
  is_approved: true
};

export default function AdminRestaurantsPage() {
  const [restaurants, setRestaurants] = useState([]);
  const [filters, setFilters] = useState({ search: '', status: '' });
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  const loadRestaurants = useCallback(() => {
    getAdminRestaurants(filters)
      .then((response) => {
        setRestaurants(response.data);
        setError('');
      })
      .catch((err) => setError(err.message));
  }, [filters]);

  useEffect(() => {
    loadRestaurants();
  }, [loadRestaurants]);

  function editRestaurant(restaurant) {
    setEditingId(restaurant.restaurant_id);
    setForm({
      name: restaurant.name,
      owner_name: restaurant.owner_name,
      email: restaurant.email,
      phone: restaurant.phone,
      address: restaurant.address,
      city: restaurant.city,
      pincode: restaurant.pincode,
      cuisine_type: restaurant.cuisine_type,
      owner_password: '',
      description: restaurant.description || '',
      delivery_fee: restaurant.delivery_fee,
      is_open: Boolean(restaurant.is_open),
      is_approved: Boolean(restaurant.is_approved)
    });
  }

  async function submitRestaurant(event) {
    event.preventDefault();
    if (editingId) await updateRestaurant(editingId, form);
    else await createRestaurant(form);
    setForm(emptyForm);
    setEditingId(null);
    loadRestaurants();
  }

  async function removeRestaurant(restaurant) {
    if (!window.confirm(`Delete ${restaurant.name}?`)) return;
    await deleteRestaurant(restaurant.restaurant_id);
    loadRestaurants();
  }

  return (
    <section className="admin-page">
      <div className="admin-heading">
        <div>
          <p className="eyebrow">Listings</p>
          <h1>Restaurant management</h1>
        </div>
      </div>
      <form className="admin-form" onSubmit={submitRestaurant}>
        <h2>{editingId ? 'Edit restaurant' : 'Add restaurant'}</h2>
        <input required placeholder="Restaurant name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
        <input required placeholder="Owner name" value={form.owner_name} onChange={(event) => setForm({ ...form, owner_name: event.target.value })} />
        <input required type="email" placeholder="Email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
        <input required placeholder="Phone" value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} />
        <input required placeholder="Address" value={form.address} onChange={(event) => setForm({ ...form, address: event.target.value })} />
        <input required placeholder="City" value={form.city} onChange={(event) => setForm({ ...form, city: event.target.value })} />
        <input required placeholder="Pincode" value={form.pincode} onChange={(event) => setForm({ ...form, pincode: event.target.value })} />
        <input required placeholder="Cuisine" value={form.cuisine_type} onChange={(event) => setForm({ ...form, cuisine_type: event.target.value })} />
        {!editingId && (
          <input
            type="password"
            minLength="8"
            placeholder="Owner dashboard password"
            value={form.owner_password}
            onChange={(event) => setForm({ ...form, owner_password: event.target.value })}
          />
        )}
        <input type="number" min="0" placeholder="Delivery fee" value={form.delivery_fee} onChange={(event) => setForm({ ...form, delivery_fee: Number(event.target.value) })} />
        <textarea placeholder="Description" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} />
        <button className="button primary" type="submit"><Plus size={18} /> {editingId ? 'Save changes' : 'Add restaurant'}</button>
      </form>

      <form className="admin-toolbar" onSubmit={(event) => { event.preventDefault(); loadRestaurants(); }}>
        <label><Search size={18} /><input value={filters.search} onChange={(event) => setFilters({ ...filters, search: event.target.value })} placeholder="Search restaurants" /></label>
        <select value={filters.status} onChange={(event) => setFilters({ ...filters, status: event.target.value })}>
          <option value="">All</option>
          <option value="approved">Approved</option>
          <option value="pending">Pending</option>
        </select>
        <button className="button primary" type="submit">Apply</button>
      </form>
      {error && <p className="alert error">{error}</p>}
      <div className="admin-table">
        <table>
          <thead><tr><th>Restaurant</th><th>City</th><th>Fee</th><th>Approval</th><th>Actions</th></tr></thead>
          <tbody>
            {restaurants.map((restaurant) => (
              <tr key={restaurant.restaurant_id}>
                <td><strong>{restaurant.name}</strong><span>{restaurant.cuisine_type}</span></td>
                <td>{restaurant.city}</td>
                <td>{formatCurrency(restaurant.delivery_fee)}</td>
                <td><span className={`status-pill ${restaurant.is_approved ? 'delivered' : 'cancelled'}`}>{restaurant.is_approved ? 'approved' : 'pending'}</span></td>
                <td className="table-actions">
                  <button type="button" className="button" onClick={() => editRestaurant(restaurant)}>Edit</button>
                  <button type="button" className="button" onClick={() => setRestaurantApproval(restaurant.restaurant_id, !restaurant.is_approved).then(loadRestaurants)}>{restaurant.is_approved ? 'Reject' : 'Approve'}</button>
                  <button type="button" className="button danger" onClick={() => removeRestaurant(restaurant)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
