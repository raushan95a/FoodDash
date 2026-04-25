import { LogOut, MapPin, ShoppingBag, UserRound, Utensils } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const { items } = useCart();
  const cartCount = items.reduce((count, item) => count + item.quantity, 0);

  return (
    <div className="app-shell">
      <header className="topbar">
        <NavLink to="/" className="brand" aria-label="FoodDash home">
          <span className="brand-mark"><Utensils size={22} /></span>
          <span>FoodDash</span>
        </NavLink>

        <div className="location-pill" aria-label="Current delivery location">
          <MapPin size={17} />
          <span>Vijayawada</span>
        </div>

        <nav className="nav-links" aria-label="Primary navigation">
          <NavLink to="/restaurants">Restaurants</NavLink>
          <NavLink to="/cart" className="cart-link">
            <ShoppingBag size={18} />
            <span>Cart</span>
            {cartCount > 0 && <strong>{cartCount}</strong>}
          </NavLink>
          {user ? (
            <>
              <NavLink to="/profile">
                <UserRound size={18} />
                <span>{user.first_name}</span>
              </NavLink>
              <button type="button" className="icon-text-button" onClick={logout}>
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <NavLink to="/auth">Login</NavLink>
          )}
        </nav>
      </header>
      <main>{children}</main>
    </div>
  );
}
