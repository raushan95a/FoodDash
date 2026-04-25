import { Search } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { deleteUser, getUsers, setUserStatus } from '../../services/adminService.js';
import { formatDate } from '../../utils/formatters.js';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({ search: '', status: '' });
  const [error, setError] = useState('');

  const loadUsers = useCallback(() => {
    getUsers(filters)
      .then((response) => {
        setUsers(response.data);
        setError('');
      })
      .catch((err) => setError(err.message));
  }, [filters]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  async function toggleStatus(user) {
    await setUserStatus(user.customer_id, !user.is_active);
    loadUsers();
  }

  async function removeUser(user) {
    if (!window.confirm(`Delete ${user.email}?`)) return;
    await deleteUser(user.customer_id);
    loadUsers();
  }

  return (
    <section className="admin-page">
      <div className="admin-heading">
        <div>
          <p className="eyebrow">Full control</p>
          <h1>User management</h1>
        </div>
      </div>
      <form className="admin-toolbar" onSubmit={(event) => { event.preventDefault(); loadUsers(); }}>
        <label><Search size={18} /><input value={filters.search} onChange={(event) => setFilters({ ...filters, search: event.target.value })} placeholder="Search users" /></label>
        <select value={filters.status} onChange={(event) => setFilters({ ...filters, status: event.target.value })}>
          <option value="">All users</option>
          <option value="active">Active</option>
          <option value="blocked">Blocked</option>
        </select>
        <button className="button primary" type="submit">Apply</button>
      </form>
      {error && <p className="alert error">{error}</p>}
      <div className="admin-table">
        <table>
          <thead>
            <tr><th>User</th><th>Phone</th><th>City</th><th>Status</th><th>Joined</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.customer_id}>
                <td><strong>{user.first_name} {user.last_name}</strong><span>{user.email}</span></td>
                <td>{user.phone}</td>
                <td>{user.city || '-'}</td>
                <td><span className={`status-pill ${user.is_active ? 'delivered' : 'cancelled'}`}>{user.is_active ? 'active' : 'blocked'}</span></td>
                <td>{formatDate(user.created_at)}</td>
                <td className="table-actions">
                  <button type="button" className="button" onClick={() => toggleStatus(user)}>{user.is_active ? 'Block' : 'Unblock'}</button>
                  <button type="button" className="button danger" onClick={() => removeUser(user)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
