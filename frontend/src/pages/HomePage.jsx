import { ArrowRight, Bike, Search, ShieldCheck, Timer, Truck } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import RestaurantCard from '../components/RestaurantCard.jsx';
import { getRestaurants } from '../services/restaurantService.js';

export default function HomePage() {
  const [restaurants, setRestaurants] = useState([]);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    getRestaurants({ limit: 3 })
      .then((response) => setRestaurants(response.data))
      .catch((err) => setError(err.message));
  }, []);

  function submitSearch(event) {
    event.preventDefault();
    navigate(`/restaurants?search=${encodeURIComponent(search)}`);
  }

  return (
    <>
      <section className="hero">
        <div className="hero-content">
          <p className="eyebrow">food delivery platform</p>
          <h1>Food that finds you fast.</h1>
          <p>
            Discover restaurants near you, compare menus quickly, and place a tracked
            delivery order in a few clicks.
          </p>
          <form className="search-panel" onSubmit={submitSearch}>
            <Search size={20} />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search restaurants or cuisine"
            />
            <button type="submit" className="button primary">Search</button>
          </form>
          <div className="quick-cuisines" aria-label="Popular searches">
            {['Indian', 'Chinese', 'Healthy', 'Biryani'].map((item) => (
              <button type="button" key={item} onClick={() => navigate(`/restaurants?search=${item}`)}>
                {item}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="feature-strip">
        <div><Timer size={22} /><span>Quick checkout</span></div>
        <div><Bike size={22} /><span>Live-style status</span></div>
        <div><Truck size={22} /><span>Local restaurants</span></div>
        <div><ShieldCheck size={22} /><span>Secure login</span></div>
      </section>

      <section className="section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Featured restaurants</p>
            <h2>Popular near you</h2>
          </div>
          <Link to="/restaurants" className="text-link">
            View all <ArrowRight size={18} />
          </Link>
        </div>
        {error && <p className="alert error">{error}</p>}
        <div className="restaurant-grid">
          {restaurants.map((restaurant) => (
            <RestaurantCard restaurant={restaurant} key={restaurant.restaurant_id} />
          ))}
        </div>
      </section>
    </>
  );
}
