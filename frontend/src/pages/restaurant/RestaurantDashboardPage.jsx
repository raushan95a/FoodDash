import { Clock, ListChecks, ShoppingBag, Utensils, WalletCards } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getRestaurantDashboard } from '../../services/restaurantOwnerService.js';
import { formatCurrency, formatDate } from '../../utils/formatters.js';

export default function RestaurantDashboardPage() {
  const [dashboard, setDashboard] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    getRestaurantDashboard()
      .then((response) => setDashboard(response.data))
      .catch((err) => setError(err.message));
  }, []);

  if (error) return <p className="alert error">{error}</p>;
  if (!dashboard) return <p className="muted">Loading restaurant dashboard...</p>;

  const cards = [
    { label: 'Total orders', value: dashboard.totals.orders, icon: ShoppingBag },
    { label: 'Revenue', value: formatCurrency(dashboard.totals.revenue), icon: WalletCards },
    { label: 'Pending orders', value: dashboard.totals.pending_orders, icon: Clock },
    { label: 'Menu items', value: `${dashboard.totals.available_items}/${dashboard.totals.menu_items}`, icon: Utensils }
  ];

  return (
    <section className="admin-page">
      <div className="admin-heading">
        <div>
          <p className="eyebrow">Restaurant overview</p>
          <h1>Owner dashboard</h1>
        </div>
      </div>

      <div className="stat-grid">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <article className="stat-card" key={card.label}>
              <Icon size={24} />
              <span>{card.label}</span>
              <strong>{card.value}</strong>
            </article>
          );
        })}
      </div>

      <div className="admin-two-column">
        <section className="admin-panel">
          <h2>Recent orders</h2>
          {dashboard.recentOrders.map((order) => (
            <div className="admin-list-row" key={order.order_id}>
              <div>
                <strong>Order #{order.order_id}</strong>
                <p>{order.first_name} {order.last_name} - {formatDate(order.order_time)}</p>
              </div>
              <span className={`status-pill ${order.status}`}>{order.status.replace('_', ' ')}</span>
            </div>
          ))}
          {!dashboard.recentOrders.length && <p className="muted">No orders yet.</p>}
        </section>
        <section className="admin-panel">
          <h2>Top menu items</h2>
          {dashboard.topItems.map((item) => (
            <div className="admin-list-row" key={item.item_id}>
              <div>
                <strong>{item.item_name}</strong>
                <p><ListChecks size={14} /> {Number(item.quantity_sold)} sold</p>
              </div>
              <strong>{formatCurrency(item.revenue)}</strong>
            </div>
          ))}
          {!dashboard.topItems.length && <p className="muted">No menu sales yet.</p>}
        </section>
      </div>
    </section>
  );
}
