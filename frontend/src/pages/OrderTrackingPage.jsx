import { Bike, Clock, MapPin } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import StatusTimeline from '../components/StatusTimeline.jsx';
import { getOrder } from '../services/orderService.js';
import { createReview } from '../services/reviewService.js';
import { formatCurrency, formatDate } from '../utils/formatters.js';

export default function OrderTrackingPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loadError, setLoadError] = useState('');
  const [actionError, setActionError] = useState('');
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [reviewMessage, setReviewMessage] = useState('');

  useEffect(() => {
    getOrder(id)
      .then((response) => setOrder(response.data))
      .catch((err) => setLoadError(err.message));
  }, [id]);

  if (loadError) return <section className="section page-section"><p className="alert error">{loadError}</p></section>;
  if (!order) return <section className="section page-section"><p className="muted">Loading order...</p></section>;

  async function submitReview(event) {
    event.preventDefault();
    setActionError('');
    setReviewMessage('');
    try {
      await createReview({
        restaurant_id: order.restaurant_id,
        order_id: order.order_id,
        rating: Number(reviewForm.rating),
        comment: reviewForm.comment
      });
      setReviewMessage('Thanks for reviewing your order.');
      setReviewForm({ rating: 5, comment: '' });
    } catch (err) {
      setActionError(err.message);
    }
  }

  return (
    <section className="section page-section order-detail">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Order tracking</p>
          <h1>Order #{order.order_id}</h1>
        </div>
        <span className={`status-pill ${order.status}`}>{order.status.replace('_', ' ')}</span>
      </div>

      <StatusTimeline status={order.status} />

      <div className="content-columns">
        <div className="side-panel">
          <h2>{order.restaurant_name}</h2>
          <p><MapPin size={17} /> {order.delivery_address}</p>
          <p><Clock size={17} /> Estimated {formatDate(order.estimated_delivery_time)}</p>
          <p><Bike size={17} /> {order.delivery_agent_name || 'Delivery agent pending'}</p>
        </div>

        <div className="summary-panel">
          <h2>Items</h2>
          {order.items.map((item) => (
            <div className="summary-item" key={item.order_item_id}>
              <span>{item.quantity}x {item.item_name}</span>
              <strong>{formatCurrency(item.subtotal)}</strong>
            </div>
          ))}
          <div className="total-row standalone">
            <span>Total paid</span>
            <strong>{formatCurrency(order.total_amount)}</strong>
          </div>
          <p className="muted">Payment: {order.payment_method} - {order.payment_status}</p>
        </div>
      </div>

      {order.status === 'delivered' && (
        <form className="checkout-form review-form" onSubmit={submitReview}>
          <div className="section-heading compact">
            <div>
              <p className="eyebrow">Review</p>
              <h2>Rate {order.restaurant_name}</h2>
            </div>
          </div>
          {reviewMessage && <p className="alert success">{reviewMessage}</p>}
          {actionError && <p className="alert error">{actionError}</p>}
          <label>
            Rating
            <select value={reviewForm.rating} onChange={(event) => setReviewForm({ ...reviewForm, rating: event.target.value })}>
              <option value="5">5 - Excellent</option>
              <option value="4">4 - Good</option>
              <option value="3">3 - Okay</option>
              <option value="2">2 - Poor</option>
              <option value="1">1 - Bad</option>
            </select>
          </label>
          <label>
            Comment
            <textarea
              placeholder="Share what went well or what could improve"
              value={reviewForm.comment}
              onChange={(event) => setReviewForm({ ...reviewForm, comment: event.target.value })}
            />
          </label>
          <button type="submit" className="button primary">Submit review</button>
        </form>
      )}

      <Link to="/profile" className="button">Back to profile</Link>
    </section>
  );
}
