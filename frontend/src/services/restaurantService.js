import { apiRequest } from './api.js';

export function getRestaurants(params = {}) {
  const query = new URLSearchParams(
    Object.entries(params).filter(([, value]) => value !== '' && value != null)
  );
  return apiRequest(`/restaurants${query.toString() ? `?${query}` : ''}`);
}

export function getRestaurant(id) {
  return apiRequest(`/restaurants/${id}`);
}

export function getMenu(id) {
  return apiRequest(`/restaurants/${id}/menu`);
}

export function getReviews(id) {
  return apiRequest(`/restaurants/${id}/reviews`);
}

export function registerRestaurant(payload) {
  return apiRequest('/restaurants', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}
