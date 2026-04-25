import { Minus, Plus, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import EmptyState from '../components/EmptyState.jsx';
import { useCart } from '../context/CartContext.jsx';
import { formatCurrency } from '../utils/formatters.js';

export default function CartPage() {
  const { items, subtotal, deliveryFee, tax, total, updateQuantity, removeItem } = useCart();

  if (!items.length) {
    return (
      <EmptyState
        title="Your cart is empty"
        message="Add a few menu items from a restaurant before checkout."
        action={<Link to="/restaurants" className="button primary">Browse restaurants</Link>}
      />
    );
  }

  return (
    <section className="section page-section cart-layout">
      <div>
        <p className="eyebrow">Cart</p>
        <h1>Review your order</h1>
        <div className="cart-list">
          {items.map((item) => (
            <article className="cart-item" key={item.item_id}>
              <div>
                <h3>{item.item_name}</h3>
                <p>{item.restaurant_name}</p>
                <strong>{formatCurrency(item.price)}</strong>
              </div>
              <div className="quantity-controls">
                <button type="button" onClick={() => updateQuantity(item.item_id, item.quantity - 1)} aria-label="Decrease quantity">
                  <Minus size={16} />
                </button>
                <span>{item.quantity}</span>
                <button type="button" onClick={() => updateQuantity(item.item_id, item.quantity + 1)} aria-label="Increase quantity">
                  <Plus size={16} />
                </button>
                <button type="button" onClick={() => removeItem(item.item_id)} aria-label="Remove item">
                  <Trash2 size={16} />
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>

      <aside className="summary-panel">
        <h2>Price details</h2>
        <dl>
          <div><dt>Subtotal</dt><dd>{formatCurrency(subtotal)}</dd></div>
          <div><dt>Delivery fee</dt><dd>{formatCurrency(deliveryFee)}</dd></div>
          <div><dt>Tax</dt><dd>{formatCurrency(tax)}</dd></div>
          <div className="total-row"><dt>Total</dt><dd>{formatCurrency(total)}</dd></div>
        </dl>
        <Link to="/checkout" className="button primary full-width">Checkout</Link>
      </aside>
    </section>
  );
}
