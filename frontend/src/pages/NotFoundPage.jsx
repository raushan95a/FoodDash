import { Link } from 'react-router-dom';
import EmptyState from '../components/EmptyState.jsx';

export default function NotFoundPage() {
  return (
    <EmptyState
      title="Page not found"
      message="The page you opened is not part of the FoodDash flow."
      action={<Link to="/" className="button primary">Go home</Link>}
    />
  );
}
