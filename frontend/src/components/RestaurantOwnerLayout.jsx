import { BarChart3, ClipboardList, LogOut, Store, Utensils } from 'lucide-react';
import { NavLink, Outlet } from 'react-router-dom';
import { useRestaurantOwnerAuth } from '../context/RestaurantOwnerAuthContext.jsx';

export default function RestaurantOwnerLayout() {
  const { restaurant, logout } = useRestaurantOwnerAuth();

  return (
    <div className="admin-shell restaurant-owner-shell">
      <aside className="admin-sidebar restaurant-owner-sidebar">
        <NavLink to="/restaurant" className="admin-brand">
          <span className="brand-mark"><Utensils size={22} /></span>
          <span>Restaurant Studio</span>
        </NavLink>
        <nav className="admin-nav">
          <NavLink to="/restaurant" end><BarChart3 size={18} /> Dashboard</NavLink>
          <NavLink to="/restaurant/menu"><Utensils size={18} /> Menu</NavLink>
          <NavLink to="/restaurant/orders"><ClipboardList size={18} /> Orders</NavLink>
          <NavLink to="/restaurant/profile"><Store size={18} /> Profile</NavLink>
        </nav>
        <div className="admin-profile">
          <strong>{restaurant?.name || 'Restaurant'}</strong>
          <span>{restaurant?.email}</span>
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
