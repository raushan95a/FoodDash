import { apiRequest } from './api.js';

export function createReview(payload) {
  return apiRequest('/reviews', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}
