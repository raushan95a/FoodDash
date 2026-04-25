import { Plus } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import {
  createRestaurantMenuItem,
  deleteRestaurantMenuItem,
  getRestaurantMenu,
  updateRestaurantMenuItem
} from '../../services/restaurantOwnerService.js';
import { formatCurrency } from '../../utils/formatters.js';

const emptyForm = {
  item_name: '',
  description: '',
  price: 0,
  category: 'veg',
  image_url: '',
  is_veg: true,
  is_available: true
};

export default function RestaurantMenuPage() {
  const [menu, setMenu] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  const loadMenu = useCallback(() => {
    getRestaurantMenu()
      .then((response) => {
        setMenu(response.data);
        setError('');
      })
      .catch((err) => setError(err.message));
  }, []);

  useEffect(() => {
    loadMenu();
  }, [loadMenu]);

  function editItem(item) {
    setEditingId(item.item_id);
    setForm({
      item_name: item.item_name,
      description: item.description || '',
      price: Number(item.price),
      category: item.category,
      image_url: item.image_url || '',
      is_veg: Boolean(item.is_veg),
      is_available: Boolean(item.is_available)
    });
  }

  async function submitItem(event) {
    event.preventDefault();
    if (editingId) await updateRestaurantMenuItem(editingId, form);
    else await createRestaurantMenuItem(form);
    setForm(emptyForm);
    setEditingId(null);
    loadMenu();
  }

  async function removeItem(item) {
    if (!window.confirm(`Delete ${item.item_name}?`)) return;
    await deleteRestaurantMenuItem(item.item_id);
    loadMenu();
  }

  return (
    <section className="admin-page">
      <div className="admin-heading">
        <div>
          <p className="eyebrow">Menu control</p>
          <h1>Restaurant menu</h1>
        </div>
      </div>

      <form className="admin-form" onSubmit={submitItem}>
        <h2>{editingId ? 'Edit menu item' : 'Add menu item'}</h2>
        <input required placeholder="Item name" value={form.item_name} onChange={(event) => setForm({ ...form, item_name: event.target.value })} />
        <input required type="number" min="0" placeholder="Price" value={form.price} onChange={(event) => setForm({ ...form, price: Number(event.target.value) })} />
        <select value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })}>
          <option value="veg">Veg</option>
          <option value="non-veg">Non-veg</option>
          <option value="sides">Sides</option>
          <option value="dessert">Dessert</option>
          <option value="beverage">Beverage</option>
        </select>
        <input placeholder="Image URL" value={form.image_url} onChange={(event) => setForm({ ...form, image_url: event.target.value })} />
        <select value={form.is_veg ? 'true' : 'false'} onChange={(event) => setForm({ ...form, is_veg: event.target.value === 'true' })}>
          <option value="true">Vegetarian</option>
          <option value="false">Non-vegetarian</option>
        </select>
        <select value={form.is_available ? 'true' : 'false'} onChange={(event) => setForm({ ...form, is_available: event.target.value === 'true' })}>
          <option value="true">Available</option>
          <option value="false">Unavailable</option>
        </select>
        <textarea placeholder="Description" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} />
        <button className="button primary" type="submit"><Plus size={18} /> {editingId ? 'Save item' : 'Add item'}</button>
      </form>

      {error && <p className="alert error">{error}</p>}
      <div className="admin-table">
        <table>
          <thead><tr><th>Item</th><th>Category</th><th>Price</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {menu.map((item) => (
              <tr key={item.item_id}>
                <td><strong>{item.item_name}</strong><span>{item.description || 'No description'}</span></td>
                <td>{item.category}</td>
                <td>{formatCurrency(item.price)}</td>
                <td><span className={`status-pill ${item.is_available ? 'delivered' : 'cancelled'}`}>{item.is_available ? 'available' : 'hidden'}</span></td>
                <td className="table-actions">
                  <button type="button" className="button" onClick={() => editItem(item)}>Edit</button>
                  <button type="button" className="button danger" onClick={() => removeItem(item)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
