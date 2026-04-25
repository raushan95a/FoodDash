import { apiRequest } from './api.js';

function query(params = {}) {
  const search = new URLSearchParams(
    Object.entries(params).filter(([, value]) => value !== '' && value != null)
  );
  return search.toString() ? `?${search}` : '';
}

export function adminLogin(credentials) {
  return apiRequest('/admin/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials)
  });
}

export function getAdminMe() {
  return apiRequest('/admin/me');
}

export function getDashboard() {
  return apiRequest('/admin/dashboard');
}

export function getAnalytics() {
  return apiRequest('/admin/analytics');
}

export function getUsers(params) {
  return apiRequest(`/admin/users${query(params)}`);
}

export function getUser(id) {
  return apiRequest(`/admin/users/${id}`);
}

export function setUserStatus(id, isActive) {
  return apiRequest(`/admin/users/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ is_active: isActive })
  });
}

export function deleteUser(id) {
  return apiRequest(`/admin/users/${id}`, { method: 'DELETE' });
}

export function getAdminRestaurants(params) {
  return apiRequest(`/admin/restaurants${query(params)}`);
}

export function createRestaurant(payload) {
  return apiRequest('/admin/restaurants', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export function updateRestaurant(id, payload) {
  return apiRequest(`/admin/restaurants/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload)
  });
}

export function setRestaurantApproval(id, isApproved) {
  return apiRequest(`/admin/restaurants/${id}/approval`, {
    method: 'PATCH',
    body: JSON.stringify({ is_approved: isApproved })
  });
}

export function deleteRestaurant(id) {
  return apiRequest(`/admin/restaurants/${id}`, { method: 'DELETE' });
}

export function getAdminOrders(params) {
  return apiRequest(`/admin/orders${query(params)}`);
}

export function getAdminOrder(id) {
  return apiRequest(`/admin/orders/${id}`);
}

export function updateOrderStatus(id, status, deliveryAgentId) {
  return apiRequest(`/admin/orders/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({
      status,
      ...(deliveryAgentId !== undefined ? { delivery_agent_id: deliveryAgentId || null } : {})
    })
  });
}

export function getAdminDeliveryAgents(params) {
  return apiRequest(`/admin/delivery-agents${query(params)}`);
}

export function createDeliveryAgent(payload) {
  return apiRequest('/admin/delivery-agents', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export function updateDeliveryAgent(id, payload) {
  return apiRequest(`/admin/delivery-agents/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload)
  });
}

export function deleteDeliveryAgent(id) {
  return apiRequest(`/admin/delivery-agents/${id}`, { method: 'DELETE' });
}
