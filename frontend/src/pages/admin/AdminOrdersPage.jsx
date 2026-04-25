import { Search } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { getAdminDeliveryAgents, getAdminOrders, updateOrderStatus } from '../../services/adminService.js';
import { formatCurrency, formatDate } from '../../utils/formatters.js';

const statuses = ['pending', 'confirmed', 'preparing', 'ready', 'picked_up', 'delivered', 'cancelled'];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [agents, setAgents] = useState([]);
  const [filters, setFilters] = useState({ search: '', status: '' });
  const [error, setError] = useState('');

  const loadOrders = useCallback(() => {
    getAdminOrders(filters)
      .then((response) => {
        setOrders(response.data);
        setError('');
      })
      .catch((err) => setError(err.message));
  }, [filters]);

  const loadAgents = useCallback(() => {
    getAdminDeliveryAgents({ status: 'available' })
      .then((response) => setAgents(response.data))
      .catch((err) => setError(err.message));
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  useEffect(() => {
    loadAgents();
  }, [loadAgents]);

  async function changeStatus(orderId, status) {
    await updateOrderStatus(orderId, status);
    loadOrders();
    loadAgents();
  }

  async function assignAgent(order, deliveryAgentId) {
    await updateOrderStatus(order.order_id, order.status, deliveryAgentId);
    loadOrders();
    loadAgents();
  }

  return (
    <section className="admin-page">
      <div className="admin-heading">
        <div>
          <p className="eyebrow">Operations</p>
          <h1>Order management</h1>
        </div>
      </div>
      <form className="admin-toolbar" onSubmit={(event) => { event.preventDefault(); loadOrders(); }}>
        <label><Search size={18} /><input value={filters.search} onChange={(event) => setFilters({ ...filters, search: event.target.value })} placeholder="Search order, customer, restaurant" /></label>
        <select value={filters.status} onChange={(event) => setFilters({ ...filters, status: event.target.value })}>
          <option value="">All statuses</option>
          {statuses.map((status) => <option value={status} key={status}>{status.replace('_', ' ')}</option>)}
        </select>
        <button className="button primary" type="submit">Apply</button>
      </form>
      {error && <p className="alert error">{error}</p>}
      <div className="admin-table">
        <table>
          <thead><tr><th>Order</th><th>Customer</th><th>Restaurant</th><th>Total</th><th>Status</th><th>Agent</th><th>Update</th></tr></thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.order_id}>
                <td><strong>#{order.order_id}</strong><span>{formatDate(order.order_time)}</span></td>
                <td>{order.first_name} {order.last_name}<span>{order.customer_email}</span></td>
                <td>{order.restaurant_name}</td>
                <td>{formatCurrency(order.total_amount)}</td>
                <td><span className={`status-pill ${order.status}`}>{order.status.replace('_', ' ')}</span></td>
                <td>
                  <select
                    value={order.delivery_agent_id || ''}
                    onChange={(event) => assignAgent(order, event.target.value)}
                    disabled={['delivered', 'cancelled'].includes(order.status)}
                  >
                    <option value="">Unassigned</option>
                    {order.delivery_agent_id && !agents.some((agent) => agent.agent_id === order.delivery_agent_id) && (
                      <option value={order.delivery_agent_id}>{order.delivery_agent_name || 'Assigned agent'}</option>
                    )}
                    {agents.map((agent) => <option value={agent.agent_id} key={agent.agent_id}>{agent.name}</option>)}
                  </select>
                </td>
                <td>
                  <select value={order.status} onChange={(event) => changeStatus(order.order_id, event.target.value)}>
                    {statuses.map((status) => <option value={status} key={status}>{status.replace('_', ' ')}</option>)}
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
