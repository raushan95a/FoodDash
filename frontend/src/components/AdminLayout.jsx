import { BarChart3, LogOut, ShoppingBag, Store, Truck, Users, Utensils } from 'lucide-react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext.jsx';

export default function AdminLayout() {
  const { admin, logout } = useAdminAuth();

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <NavLink to="/admin" className="admin-brand">
          <span className="brand-mark"><Utensils size={22} /></span>
          <span>FoodDash Admin</span>
        </NavLink>
        <nav className="admin-nav">
          <NavLink to="/admin" end><BarChart3 size={18} /> Dashboard</NavLink>
          <NavLink to="/admin/users"><Users size={18} /> Users</NavLink>
          <NavLink to="/admin/restaurants"><Store size={18} /> Restaurants</NavLink>
          <NavLink to="/admin/orders"><ShoppingBag size={18} /> Orders</NavLink>
          <NavLink to="/admin/delivery-agents"><Truck size={18} /> Delivery Agents</NavLink>
        </nav>
        <div className="admin-profile">
          <strong>{admin?.full_name || 'Admin'}</strong>
          <span>{admin?.email}</span>
          <button type="button" className="button full-width" onClick={logout}>
            <LogOut size={17} /> Logout
          </button>
        </div>
      </aside>
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}
