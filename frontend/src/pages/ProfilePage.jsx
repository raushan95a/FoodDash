import { Home, Mail, MapPin, Phone, ShoppingBag, UserRound } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import {
  createAddress,
  deleteAddress,
  getAddresses,
  updateAddress,
  updateMe
} from '../services/authService.js';
import { getMyOrders } from '../services/orderService.js';
import { formatCurrency, formatDate } from '../utils/formatters.js';

const emptyAddress = {
  label: 'Home',
  address: '',
  city: 'Vijayawada',
  pincode: '',
  is_default: false
};

export default function ProfilePage() {
  const { user, saveUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [profileForm, setProfileForm] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: user?.city || 'Vijayawada',
    pincode: user?.pincode || ''
  });
  const [addressForm, setAddressForm] = useState(emptyAddress);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    getMyOrders()
      .then((response) => setOrders(response.data))
      .catch((err) => setError(err.message));

    getAddresses()
      .then((response) => setAddresses(response.data))
      .catch((err) => setError(err.message));
  }, []);

  function updateProfileField(field, value) {
    setProfileForm({ ...profileForm, [field]: value });
  }

  function updateAddressField(field, value) {
    setAddressForm({ ...addressForm, [field]: value });
  }

  async function submitProfile(event) {
    event.preventDefault();
    setError('');
    setSuccess('');
    try {
      const response = await updateMe(profileForm);
      saveUser(response.data);
      setSuccess('Profile updated successfully.');
    } catch (err) {
      setError(err.message);
    }
  }

  function editAddress(address) {
    setEditingAddressId(address.address_id);
    setAddressForm({
      label: address.label || 'Home',
      address: address.address || '',
      city: address.city || 'Vijayawada',
      pincode: address.pincode || '',
      is_default: Boolean(address.is_default)
    });
  }

  async function loadAddresses() {
    const response = await getAddresses();
    setAddresses(response.data);
  }

  async function submitAddress(event) {
    event.preventDefault();
    setError('');
    setSuccess('');
    try {
      if (editingAddressId) await updateAddress(editingAddressId, addressForm);
      else await createAddress(addressForm);
      await loadAddresses();
      if (addressForm.is_default) {
        const response = await updateMe({
          address: addressForm.address,
          city: addressForm.city,
          pincode: addressForm.pincode
        });
        saveUser(response.data);
      }
      setAddressForm(emptyAddress);
      setEditingAddressId(null);
      setSuccess('Address saved successfully.');
    } catch (err) {
      setError(err.message);
    }
  }

  async function removeAddress(addressId) {
    if (!window.confirm('Delete this saved address?')) return;
    setError('');
    setSuccess('');
    try {
      await deleteAddress(addressId);
      await loadAddresses();
      setSuccess('Address deleted.');
    } catch (err) {
      setError(err.message);
    }
  }

  const fullName = `${user?.first_name || ''} ${user?.last_name || ''}`.trim() || 'FoodDash customer';

  return (
    <section className="section page-section profile-layout">
      <aside className="profile-card">
        <div className="profile-avatar">
          <UserRound size={42} />
        </div>
        <p className="eyebrow">Customer profile</p>
        <h1>{fullName}</h1>
        <p className="muted">Manage account details, delivery addresses, and recent FoodDash orders.</p>

        <div className="profile-meta">
          <span><Mail size={18} /> {user?.email}</span>
          <span><Phone size={18} /> {user?.phone || 'Phone not added'}</span>
          <span><MapPin size={18} /> {user?.address || 'No default address yet'}</span>
        </div>

        <div className="profile-stat-grid">
          <div>
            <strong>{orders.length}</strong>
            <span>Orders</span>
          </div>
          <div>
            <strong>{addresses.length}</strong>
            <span>Addresses</span>
          </div>
        </div>
      </aside>

      <div className="profile-stack">
        {error && <p className="alert error">{error}</p>}
        {success && <p className="alert success">{success}</p>}

        <form className="checkout-form profile-form-card" onSubmit={submitProfile}>
          <div className="section-heading compact">
            <div>
              <p className="eyebrow">Account details</p>
              <h2>Edit profile</h2>
            </div>
          </div>
          <div className="two-column">
            <label>
              First name
              <input required value={profileForm.first_name} onChange={(event) => updateProfileField('first_name', event.target.value)} />
            </label>
            <label>
              Last name
              <input value={profileForm.last_name || ''} onChange={(event) => updateProfileField('last_name', event.target.value)} />
            </label>
          </div>
          <label>
            Phone
            <input required value={profileForm.phone} onChange={(event) => updateProfileField('phone', event.target.value)} />
          </label>
          <label>
            Default address
            <textarea value={profileForm.address || ''} onChange={(event) => updateProfileField('address', event.target.value)} />
          </label>
          <div className="two-column">
            <label>
              City
              <input value={profileForm.city || ''} onChange={(event) => updateProfileField('city', event.target.value)} />
            </label>
            <label>
              Pincode
              <input value={profileForm.pincode || ''} onChange={(event) => updateProfileField('pincode', event.target.value)} />
            </label>
          </div>
          <button type="submit" className="button primary">Save profile</button>
        </form>

        <form className="checkout-form profile-form-card" onSubmit={submitAddress}>
          <div className="section-heading compact">
            <div>
              <p className="eyebrow">Saved addresses</p>
              <h2>{editingAddressId ? 'Edit address' : 'Add address'}</h2>
            </div>
          </div>
          <div className="two-column">
            <label>
              Label
              <input required value={addressForm.label} onChange={(event) => updateAddressField('label', event.target.value)} />
            </label>
            <label>
              Pincode
              <input value={addressForm.pincode || ''} onChange={(event) => updateAddressField('pincode', event.target.value)} />
            </label>
          </div>
          <label>
            Address
            <textarea required value={addressForm.address} onChange={(event) => updateAddressField('address', event.target.value)} />
          </label>
          <label>
            City
            <input value={addressForm.city || ''} onChange={(event) => updateAddressField('city', event.target.value)} />
          </label>
          <label className="inline-check">
            <input type="checkbox" checked={addressForm.is_default} onChange={(event) => updateAddressField('is_default', event.target.checked)} />
            Use as default checkout address
          </label>
          <button type="submit" className="button primary">{editingAddressId ? 'Update address' : 'Save address'}</button>
          {editingAddressId && (
            <button type="button" className="button" onClick={() => { setEditingAddressId(null); setAddressForm(emptyAddress); }}>
              Cancel edit
            </button>
          )}
        </form>

        <section className="profile-card-section profile-span">
          <div className="profile-card-title">
            <div>
              <p className="eyebrow">Address book</p>
              <h2>Saved delivery addresses</h2>
            </div>
            <Home size={24} />
          </div>
          <div className="order-list">
            {addresses.map((address) => (
              <div className="order-row profile-address-row" key={address.address_id}>
                <div>
                  <strong>{address.label} {address.is_default ? '(Default)' : ''}</strong>
                  <p>{address.address}</p>
                  <p>{address.city || '-'} {address.pincode || ''}</p>
                </div>
                <div className="table-actions">
                  <button type="button" className="button" onClick={() => editAddress(address)}>Edit</button>
                  <button type="button" className="button danger" onClick={() => removeAddress(address.address_id)}>Delete</button>
                </div>
              </div>
            ))}
            {!addresses.length && <p className="muted">No saved addresses yet.</p>}
          </div>
        </section>

        <section className="profile-card-section profile-span">
          <div className="profile-card-title">
            <div>
              <p className="eyebrow">Order history</p>
              <h2>Your recent orders</h2>
            </div>
            <ShoppingBag size={24} />
          </div>
          <div className="order-list">
            {orders.map((order) => (
              <Link to={`/orders/${order.order_id}`} className="order-row" key={order.order_id}>
                <div>
                  <strong>#{order.order_id} - {order.restaurant_name}</strong>
                  <p>{formatDate(order.order_time)}</p>
                </div>
                <span className={`status-pill ${order.status}`}>{order.status.replace('_', ' ')}</span>
                <strong>{formatCurrency(order.total_amount)}</strong>
              </Link>
            ))}
            {!orders.length && <p className="muted">No orders yet.</p>}
          </div>
        </section>
      </div>
    </section>
  );
}
