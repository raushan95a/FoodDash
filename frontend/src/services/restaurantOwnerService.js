import { apiRequest } from './api.js';

function query(params = {}) {
  const search = new URLSearchParams(
    Object.entries(params).filter(([, value]) => value !== '' && value != null)
  );
  return search.toString() ? `?${search}` : '';
}

export function restaurantLogin(credentials) {
  return apiRequest('/restaurant-owner/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials)
  });
}

export function getRestaurantMe() {
  return apiRequest('/restaurant-owner/me');
}

export function getRestaurantDashboard() {
  return apiRequest('/restaurant-owner/dashboard');
}

export function updateRestaurantProfile(payload) {
  return apiRequest('/restaurant-owner/profile', {
    method: 'PUT',
    body: JSON.stringify(payload)
  });
}

export function getRestaurantMenu() {
  return apiRequest('/restaurant-owner/menu');
}

export function createRestaurantMenuItem(payload) {
  return apiRequest('/restaurant-owner/menu', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export function updateRestaurantMenuItem(itemId, payload) {
  return apiRequest(`/restaurant-owner/menu/${itemId}`, {
    method: 'PUT',
    body: JSON.stringify(payload)
  });
}

export function deleteRestaurantMenuItem(itemId) {
  return apiRequest(`/restaurant-owner/menu/${itemId}`, { method: 'DELETE' });
}

export function getRestaurantOrders(params) {
  return apiRequest(`/restaurant-owner/orders${query(params)}`);
}

export function updateRestaurantOrderStatus(orderId, status) {
  return apiRequest(`/restaurant-owner/orders/${orderId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status })
  });
}
