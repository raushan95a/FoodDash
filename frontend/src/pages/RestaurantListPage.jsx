import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import RestaurantCard from '../components/RestaurantCard.jsx';
import { getRestaurants } from '../services/restaurantService.js';

export default function RestaurantListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    cuisine_type: '',
    city: ''
  });

  useEffect(() => {
    setLoading(true);
    getRestaurants(filters)
      .then((response) => {
        setRestaurants(response.data);
        setError('');
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [filters]);

  function submitFilters(event) {
    event.preventDefault();
    setSearchParams(filters.search ? { search: filters.search } : {});
    setFilters({ ...filters });
  }

  return (
    <section className="section page-section">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Restaurant discovery</p>
          <h1>Browse restaurants</h1>
        </div>
      </div>

      <form className="filter-bar" onSubmit={submitFilters}>
        <label>
          <Search size={18} />
          <input
            value={filters.search}
            onChange={(event) => setFilters({ ...filters, search: event.target.value })}
            placeholder="Search name or cuisine"
          />
        </label>
        <select
          value={filters.cuisine_type}
          onChange={(event) => setFilters({ ...filters, cuisine_type: event.target.value })}
        >
          <option value="">All cuisines</option>
          <option value="Indian">Indian</option>
          <option value="Chinese">Chinese</option>
          <option value="Healthy">Healthy</option>
        </select>
        <input
          value={filters.city}
          onChange={(event) => setFilters({ ...filters, city: event.target.value })}
          placeholder="City"
        />
        <button type="submit" className="button primary">Apply</button>
      </form>

      {loading && <p className="muted">Loading restaurants...</p>}
      {error && <p className="alert error">{error}</p>}
      <div className="restaurant-grid">
        {restaurants.map((restaurant) => (
          <RestaurantCard restaurant={restaurant} key={restaurant.restaurant_id} />
        ))}
      </div>
    </section>
  );
}
