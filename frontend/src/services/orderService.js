import { apiRequest } from './api.js';

export function createOrder(payload) {
  return apiRequest('/orders', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export function getMyOrders() {
  return apiRequest('/orders/my-orders');
}

export function getOrder(id) {
  return apiRequest(`/orders/${id}`);
}
