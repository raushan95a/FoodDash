import { Plus } from 'lucide-react';
import { formatCurrency } from '../utils/formatters.js';

export default function MenuItemCard({ item, onAdd }) {
  return (
    <article className="menu-item-card">
      <div>
        <div className="item-title-row">
          <h3>{item.item_name}</h3>
          <span className={item.is_veg ? 'veg-dot' : 'nonveg-dot'} />
        </div>
        <p>{item.description || 'Freshly prepared by the restaurant.'}</p>
        <strong>{formatCurrency(item.price)}</strong>
      </div>
      <button
        type="button"
        className="button add-button"
        disabled={!item.is_available}
        onClick={() => onAdd(item)}
      >
        <Plus size={18} />
        <span>{item.is_available ? 'Add' : 'Unavailable'}</span>
      </button>
    </article>
  );
}
