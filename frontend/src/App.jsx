import { Navigate, Route, Routes } from 'react-router-dom';
import AdminLayout from './components/AdminLayout.jsx';
import Layout from './components/Layout.jsx';
import RestaurantOwnerLayout from './components/RestaurantOwnerLayout.jsx';
import AuthPage from './pages/AuthPage.jsx';
import CartPage from './pages/CartPage.jsx';
import CheckoutPage from './pages/CheckoutPage.jsx';
import HomePage from './pages/HomePage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import OrderTrackingPage from './pages/OrderTrackingPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import RestaurantDetailPage from './pages/RestaurantDetailPage.jsx';
import RestaurantListPage from './pages/RestaurantListPage.jsx';
import AdminDeliveryAgentsPage from './pages/admin/AdminDeliveryAgentsPage.jsx';
import AdminDashboardPage from './pages/admin/AdminDashboardPage.jsx';
import AdminLoginPage from './pages/admin/AdminLoginPage.jsx';
import AdminOrdersPage from './pages/admin/AdminOrdersPage.jsx';
import AdminRestaurantsPage from './pages/admin/AdminRestaurantsPage.jsx';
import AdminUsersPage from './pages/admin/AdminUsersPage.jsx';
import RestaurantDashboardPage from './pages/restaurant/RestaurantDashboardPage.jsx';
import RestaurantLoginPage from './pages/restaurant/RestaurantLoginPage.jsx';
import RestaurantMenuPage from './pages/restaurant/RestaurantMenuPage.jsx';
import RestaurantOrdersPage from './pages/restaurant/RestaurantOrdersPage.jsx';
import RestaurantProfilePage from './pages/restaurant/RestaurantProfilePage.jsx';
import RestaurantRegisterPage from './pages/restaurant/RestaurantRegisterPage.jsx';
import { useAdminAuth } from './context/AdminAuthContext.jsx';
import { useAuth } from './context/AuthContext.jsx';
import { useRestaurantOwnerAuth } from './context/RestaurantOwnerAuthContext.jsx';

function ProtectedRoute({ children }) {
  const { token } = useAuth();
  return token ? children : <Navigate to="/auth" replace />;
}

function AdminProtectedRoute({ children }) {
  const { adminToken, checkingAdminSession } = useAdminAuth();
  if (checkingAdminSession) return <div className="empty-state"><p>Checking admin session...</p></div>;
  return adminToken ? children : <Navigate to="/admin/login" replace />;
}

function RestaurantProtectedRoute({ children }) {
  const { restaurantToken, checkingRestaurantSession } = useRestaurantOwnerAuth();
  if (checkingRestaurantSession) return <div className="empty-state"><p>Checking restaurant session...</p></div>;
  return restaurantToken ? children : <Navigate to="/restaurant/login" replace />;
}

function CustomerLayout({ children }) {
  return <Layout>{children}</Layout>;
}

export default function App() {
  return (
    <Routes>
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route path="/restaurant/login" element={<RestaurantLoginPage />} />
      <Route path="/restaurant/register" element={<CustomerLayout><RestaurantRegisterPage /></CustomerLayout>} />
      <Route
        path="/admin"
        element={(
          <AdminProtectedRoute>
            <AdminLayout />
          </AdminProtectedRoute>
        )}
      >
        <Route index element={<AdminDashboardPage />} />
        <Route path="users" element={<AdminUsersPage />} />
        <Route path="restaurants" element={<AdminRestaurantsPage />} />
        <Route path="orders" element={<AdminOrdersPage />} />
        <Route path="delivery-agents" element={<AdminDeliveryAgentsPage />} />
      </Route>
      <Route
        path="/restaurant"
        element={(
          <RestaurantProtectedRoute>
            <RestaurantOwnerLayout />
          </RestaurantProtectedRoute>
        )}
      >
        <Route index element={<RestaurantDashboardPage />} />
        <Route path="menu" element={<RestaurantMenuPage />} />
        <Route path="orders" element={<RestaurantOrdersPage />} />
        <Route path="profile" element={<RestaurantProfilePage />} />
      </Route>

      <Route path="/" element={<CustomerLayout><HomePage /></CustomerLayout>} />
      <Route path="/restaurants" element={<CustomerLayout><RestaurantListPage /></CustomerLayout>} />
      <Route path="/restaurants/:id" element={<CustomerLayout><RestaurantDetailPage /></CustomerLayout>} />
      <Route path="/cart" element={<CustomerLayout><CartPage /></CustomerLayout>} />
        <Route
          path="/checkout"
          element={(
            <CustomerLayout>
              <ProtectedRoute>
                <CheckoutPage />
              </ProtectedRoute>
            </CustomerLayout>
          )}
        />
      <Route path="/auth" element={<CustomerLayout><AuthPage /></CustomerLayout>} />
        <Route
          path="/profile"
          element={(
            <CustomerLayout>
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            </CustomerLayout>
          )}
        />
        <Route
          path="/orders/:id"
          element={(
            <CustomerLayout>
              <ProtectedRoute>
                <OrderTrackingPage />
              </ProtectedRoute>
            </CustomerLayout>
          )}
        />
      <Route path="*" element={<CustomerLayout><NotFoundPage /></CustomerLayout>} />
    </Routes>
  );
}
