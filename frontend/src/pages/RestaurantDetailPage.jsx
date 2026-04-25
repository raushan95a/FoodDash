import { MapPin, Phone, Star } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import MenuItemCard from '../components/MenuItemCard.jsx';
import { useCart } from '../context/CartContext.jsx';
import { getMenu, getRestaurant, getReviews } from '../services/restaurantService.js';
import { formatCurrency } from '../utils/formatters.js';

export default function RestaurantDetailPage() {
  const { id } = useParams();
  const { addItem } = useCart();
  const [restaurant, setRestaurant] = useState(null);
  const [menu, setMenu] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([getRestaurant(id), getMenu(id), getReviews(id)])
      .then(([restaurantResponse, menuResponse, reviewsResponse]) => {
        setRestaurant(restaurantResponse.data);
        setMenu(menuResponse.data);
        setReviews(reviewsResponse.data);
      })
      .catch((err) => setError(err.message));
  }, [id]);

  function handleAdd(item) {
    const result = addItem(restaurant, item);
    setMessageType(result.success ? 'success' : 'error');
    setMessage(result.message);
    window.setTimeout(() => setMessage(''), 1800);
  }

  if (error) return <section className="section page-section"><p className="alert error">{error}</p></section>;
  if (!restaurant) return <section className="section page-section"><p className="muted">Loading menu...</p></section>;

  return (
    <section className="section page-section detail-layout">
      <div className="restaurant-hero">
        <div>
          <p className="eyebrow">{restaurant.cuisine_type}</p>
          <h1>{restaurant.name}</h1>
          <p>{restaurant.description}</p>
          <div className="meta-row">
            <span><Star size={17} /> {Number(restaurant.avg_rating).toFixed(1)}</span>
            <span><MapPin size={17} /> {restaurant.address}</span>
            <span><Phone size={17} /> {restaurant.phone}</span>
          </div>
        </div>
        <strong>{formatCurrency(restaurant.delivery_fee)} delivery</strong>
      </div>

      {message && <p className={`alert ${messageType}`}>{message}</p>}

      <div className="content-columns">
        <div>
          <div className="section-heading compact">
            <div>
              <p className="eyebrow">Menu</p>
              <h2>Choose your meal</h2>
            </div>
          </div>
          <div className="menu-list">
            {menu.map((item) => (
              <MenuItemCard item={item} key={item.item_id} onAdd={handleAdd} />
            ))}
          </div>
        </div>

        <aside className="side-panel">
          <h2>Reviews</h2>
          {reviews.length === 0 && <p className="muted">No reviews yet.</p>}
          {reviews.map((review) => (
            <div className="review" key={review.review_id}>
              <strong>{review.rating}/5 stars</strong>
              <p>{review.comment}</p>
              <span>{review.first_name} {review.last_name}</span>
            </div>
          ))}
        </aside>
      </div>
    </section>
  );
}
