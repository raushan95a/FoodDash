import { CreditCard, MapPin } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import EmptyState from '../components/EmptyState.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { createOrder } from '../services/orderService.js';
import { formatCurrency } from '../utils/formatters.js';

export default function CheckoutPage() {
  const { user } = useAuth();
  const { items, subtotal, deliveryFee, tax, total, clearCart } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    delivery_address: user?.address || '',
    payment_method: 'upi',
    special_instructions: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!items.length) {
    return (
      <EmptyState
        title="Nothing to checkout"
        message="Your cart needs at least one item before placing an order."
        action={<Link to="/restaurants" className="button primary">Browse restaurants</Link>}
      />
    );
  }

  async function submitOrder(event) {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await createOrder({
        restaurant_id: items[0].restaurant_id,
        delivery_address: form.delivery_address,
        payment_method: form.payment_method,
        special_instructions: form.special_instructions,
        items: items.map((item) => ({
          item_id: item.item_id,
          quantity: item.quantity
        }))
      });
      clearCart();
      navigate(`/orders/${response.data.order_id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="section page-section checkout-layout">
      <form className="checkout-form" onSubmit={submitOrder}>
        <p className="eyebrow">Checkout</p>
        <h1>Confirm delivery</h1>
        {error && <p className="alert error">{error}</p>}

        <label>
          <span><MapPin size={18} /> Delivery address</span>
          <textarea
            required
            value={form.delivery_address}
            onChange={(event) => setForm({ ...form, delivery_address: event.target.value })}
            rows="4"
          />
        </label>

        <label>
          <span><CreditCard size={18} /> Payment method</span>
          <select
            value={form.payment_method}
            onChange={(event) => setForm({ ...form, payment_method: event.target.value })}
          >
            <option value="upi">UPI</option>
            <option value="card">Card</option>
            <option value="cash">Cash on delivery</option>
          </select>
        </label>

        <label>
          <span>Special instructions</span>
          <textarea
            value={form.special_instructions}
            onChange={(event) => setForm({ ...form, special_instructions: event.target.value })}
            rows="3"
            placeholder="Less spicy, contactless delivery, landmark..."
          />
        </label>

        <button className="button primary full-width" type="submit" disabled={loading}>
          {loading ? 'Placing order...' : `Place order ${formatCurrency(total)}`}
        </button>
      </form>

      <aside className="summary-panel">
        <h2>Order summary</h2>
        {items.map((item) => (
          <div className="summary-item" key={item.item_id}>
            <span>{item.quantity}x {item.item_name}</span>
            <strong>{formatCurrency(Number(item.price) * item.quantity)}</strong>
          </div>
        ))}
        <dl>
          <div><dt>Subtotal</dt><dd>{formatCurrency(subtotal)}</dd></div>
          <div><dt>Delivery fee</dt><dd>{formatCurrency(deliveryFee)}</dd></div>
          <div><dt>Tax</dt><dd>{formatCurrency(tax)}</dd></div>
          <div className="total-row"><dt>Total</dt><dd>{formatCurrency(total)}</dd></div>
        </dl>
      </aside>
    </section>
  );
}
