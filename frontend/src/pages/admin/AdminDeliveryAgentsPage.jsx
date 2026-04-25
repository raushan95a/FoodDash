import { Plus, Search } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import {
  createDeliveryAgent,
  deleteDeliveryAgent,
  getAdminDeliveryAgents,
  updateDeliveryAgent
} from '../../services/adminService.js';
import { formatDate } from '../../utils/formatters.js';

const emptyForm = {
  name: '',
  email: '',
  phone: '',
  vehicle_type: 'bike',
  license_number: '',
  is_available: true,
  current_location: 'Vijayawada'
};

export default function AdminDeliveryAgentsPage() {
  const [agents, setAgents] = useState([]);
  const [filters, setFilters] = useState({ search: '', status: '' });
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  const loadAgents = useCallback(() => {
    getAdminDeliveryAgents(filters)
      .then((response) => {
        setAgents(response.data);
        setError('');
      })
      .catch((err) => setError(err.message));
  }, [filters]);

  useEffect(() => {
    loadAgents();
  }, [loadAgents]);

  function updateField(field, value) {
    setForm({ ...form, [field]: value });
  }

  function editAgent(agent) {
    setEditingId(agent.agent_id);
    setForm({
      name: agent.name,
      email: agent.email,
      phone: agent.phone,
      vehicle_type: agent.vehicle_type,
      license_number: agent.license_number,
      is_available: Boolean(agent.is_available),
      current_location: agent.current_location || ''
    });
  }

  async function submitAgent(event) {
    event.preventDefault();
    setError('');
    try {
      if (editingId) await updateDeliveryAgent(editingId, form);
      else await createDeliveryAgent(form);
      setForm(emptyForm);
      setEditingId(null);
      loadAgents();
    } catch (err) {
      setError(err.message);
    }
  }

  async function removeAgent(agent) {
    if (!window.confirm(`Delete ${agent.name}?`)) return;
    setError('');
    try {
      await deleteDeliveryAgent(agent.agent_id);
      loadAgents();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <section className="admin-page">
      <div className="admin-heading">
        <div>
          <p className="eyebrow">Fleet operations</p>
          <h1>Delivery agent management</h1>
        </div>
      </div>

      <form className="admin-form" onSubmit={submitAgent}>
        <h2>{editingId ? 'Edit delivery agent' : 'Add delivery agent'}</h2>
        <input required placeholder="Agent name" value={form.name} onChange={(event) => updateField('name', event.target.value)} />
        <input required type="email" placeholder="Email" value={form.email} onChange={(event) => updateField('email', event.target.value)} />
        <input required placeholder="Phone" value={form.phone} onChange={(event) => updateField('phone', event.target.value)} />
        <select value={form.vehicle_type} onChange={(event) => updateField('vehicle_type', event.target.value)}>
          <option value="bike">Bike</option>
          <option value="scooter">Scooter</option>
          <option value="cycle">Cycle</option>
          <option value="car">Car</option>
        </select>
        <input required placeholder="License number" value={form.license_number} onChange={(event) => updateField('license_number', event.target.value)} />
        <input placeholder="Current location" value={form.current_location || ''} onChange={(event) => updateField('current_location', event.target.value)} />
        <label className="inline-check">
          <input type="checkbox" checked={form.is_available} onChange={(event) => updateField('is_available', event.target.checked)} />
          Available for assignment
        </label>
        <button className="button primary" type="submit"><Plus size={18} /> {editingId ? 'Save changes' : 'Add agent'}</button>
        {editingId && <button className="button" type="button" onClick={() => { setEditingId(null); setForm(emptyForm); }}>Cancel edit</button>}
      </form>

      <form className="admin-toolbar" onSubmit={(event) => { event.preventDefault(); loadAgents(); }}>
        <label><Search size={18} /><input value={filters.search} onChange={(event) => setFilters({ ...filters, search: event.target.value })} placeholder="Search agents" /></label>
        <select value={filters.status} onChange={(event) => setFilters({ ...filters, status: event.target.value })}>
          <option value="">All agents</option>
          <option value="available">Available</option>
          <option value="offline">Offline</option>
        </select>
        <button className="button primary" type="submit">Apply</button>
      </form>

      {error && <p className="alert error">{error}</p>}
      <div className="admin-table">
        <table>
          <thead><tr><th>Agent</th><th>Vehicle</th><th>Location</th><th>Deliveries</th><th>Status</th><th>Joined</th><th>Actions</th></tr></thead>
          <tbody>
            {agents.map((agent) => (
              <tr key={agent.agent_id}>
                <td><strong>{agent.name}</strong><span>{agent.email} / {agent.phone}</span></td>
                <td>{agent.vehicle_type}<span>{agent.license_number}</span></td>
                <td>{agent.current_location || '-'}</td>
                <td>{agent.total_deliveries}</td>
                <td><span className={`status-pill ${agent.is_available ? 'delivered' : 'cancelled'}`}>{agent.is_available ? 'available' : 'offline'}</span></td>
                <td>{formatDate(agent.created_at)}</td>
                <td className="table-actions">
                  <button type="button" className="button" onClick={() => editAgent(agent)}>Edit</button>
                  <button type="button" className="button" onClick={() => updateDeliveryAgent(agent.agent_id, { is_available: !agent.is_available }).then(loadAgents)}>{agent.is_available ? 'Set offline' : 'Set available'}</button>
                  <button type="button" className="button danger" onClick={() => removeAgent(agent)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
