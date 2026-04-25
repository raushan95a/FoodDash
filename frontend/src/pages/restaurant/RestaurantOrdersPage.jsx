import { useCallback, useEffect, useState } from 'react';
import { getRestaurantOrders, updateRestaurantOrderStatus } from '../../services/restaurantOwnerService.js';
import { formatCurrency, formatDate } from '../../utils/formatters.js';

const statuses = ['pending', 'confirmed', 'preparing', 'ready', 'picked_up', 'delivered', 'cancelled'];
const ownerStatuses = ['confirmed', 'preparing', 'ready', 'cancelled'];

export default function RestaurantOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [filters, setFilters] = useState({ status: '' });
  const [error, setError] = useState('');

  const loadOrders = useCallback(() => {
    getRestaurantOrders(filters)
      .then((response) => {
        setOrders(response.data);
        setError('');
      })
      .catch((err) => setError(err.message));
  }, [filters]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  async function changeStatus(orderId, status) {
    await updateRestaurantOrderStatus(orderId, status);
    loadOrders();
  }

  return (
    <section className="admin-page">
      <div className="admin-heading">
        <div>
          <p className="eyebrow">Incoming orders</p>
          <h1>Order queue</h1>
        </div>
      </div>

      <form className="admin-toolbar" onSubmit={(event) => { event.preventDefault(); loadOrders(); }}>
        <select value={filters.status} onChange={(event) => setFilters({ ...filters, status: event.target.value })}>
          <option value="">All statuses</option>
          {statuses.map((status) => <option value={status} key={status}>{status.replace('_', ' ')}</option>)}
        </select>
        <button className="button primary" type="submit">Apply</button>
      </form>

      {error && <p className="alert error">{error}</p>}
      <div className="admin-table">
        <table>
          <thead><tr><th>Order</th><th>Customer</th><th>Address</th><th>Total</th><th>Status</th><th>Update</th></tr></thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.order_id}>
                <td><strong>#{order.order_id}</strong><span>{formatDate(order.order_time)}</span></td>
                <td>{order.first_name} {order.last_name}<span>{order.customer_email}</span></td>
                <td>{order.delivery_address}</td>
                <td>{formatCurrency(order.total_amount)}</td>
                <td><span className={`status-pill ${order.status}`}>{order.status.replace('_', ' ')}</span></td>
                <td>
                  <select
                    value={ownerStatuses.includes(order.status) ? order.status : ''}
                    onChange={(event) => changeStatus(order.order_id, event.target.value)}
                    disabled={order.status === 'delivered' || order.status === 'picked_up'}
                  >
                    <option value="" disabled>Choose status</option>
                    {ownerStatuses.map((status) => <option value={status} key={status}>{status.replace('_', ' ')}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
