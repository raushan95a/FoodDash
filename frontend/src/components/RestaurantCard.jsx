import { Clock, MapPin, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatCurrency } from '../utils/formatters.js';

const cuisineImages = {
  Indian: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=900&q=80',
  Chinese: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=900&q=80',
  Healthy: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=80'
};

export default function RestaurantCard({ restaurant }) {
  const image = cuisineImages[restaurant.cuisine_type] || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=80';

  return (
    <article className="restaurant-card">
      <Link to={`/restaurants/${restaurant.restaurant_id}`} className="card-media">
        <img src={image} alt={`${restaurant.name} ${restaurant.cuisine_type} food`} />
        <span className="delivery-badge">{formatCurrency(restaurant.delivery_fee)} delivery</span>
      </Link>
      <div className="card-body">
        <div>
          <p className="eyebrow">{restaurant.cuisine_type}</p>
          <h3>{restaurant.name}</h3>
        </div>
        <p>{restaurant.description}</p>
        <div className="meta-row">
          <span><Star size={16} /> {Number(restaurant.avg_rating).toFixed(1)}</span>
          <span><Clock size={16} /> 35-45 min</span>
          <span><MapPin size={16} /> {restaurant.city}</span>
        </div>
        <div className="card-actions">
          <span>{restaurant.is_open ? 'Open now' : 'Closed'}</span>
          <Link to={`/restaurants/${restaurant.restaurant_id}`} className="button primary">View Menu</Link>
        </div>
      </div>
    </article>
  );
}
