import { ShoppingBag, Store, Users, WalletCards } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getAnalytics, getDashboard } from '../../services/adminService.js';
import { formatCurrency, formatDate } from '../../utils/formatters.js';

export default function AdminDashboardPage() {
  const [dashboard, setDashboard] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([getDashboard(), getAnalytics()])
      .then(([dashboardResponse, analyticsResponse]) => {
        setDashboard(dashboardResponse.data);
        setAnalytics(analyticsResponse.data);
      })
      .catch((err) => setError(err.message));
  }, []);

  if (error) return <p className="alert error">{error}</p>;
  if (!dashboard) return <p className="muted">Loading dashboard...</p>;

  const cards = [
    { label: 'Total users', value: dashboard.totals.users, icon: Users },
    { label: 'Total restaurants', value: dashboard.totals.restaurants, icon: Store },
    { label: 'Total orders', value: dashboard.totals.orders, icon: ShoppingBag },
    { label: 'Total revenue', value: formatCurrency(dashboard.totals.revenue), icon: WalletCards }
  ];

  return (
    <section className="admin-page">
      <div className="admin-heading">
        <div>
          <p className="eyebrow">Overview</p>
          <h1>Admin dashboard</h1>
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
          <h2>Recent activity</h2>
          {dashboard.recentOrders.map((order) => (
            <div className="admin-list-row" key={order.order_id}>
              <div>
                <strong>Order #{order.order_id}</strong>
                <p>{order.first_name} {order.last_name} ordered from {order.restaurant_name}</p>
              </div>
              <span className={`status-pill ${order.status}`}>{order.status.replace('_', ' ')}</span>
            </div>
          ))}
        </section>
        <section className="admin-panel">
          <h2>Daily revenue</h2>
          {analytics?.daily.map((item) => (
            <div className="admin-list-row" key={item.day}>
              <div>
                <strong>{formatDate(item.day).split(',')[0]}</strong>
                <p>{item.orders} orders</p>
              </div>
              <strong>{formatCurrency(item.revenue)}</strong>
            </div>
          ))}
        </section>
      </div>
    </section>
  );
}
