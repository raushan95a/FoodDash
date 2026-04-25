import { apiRequest } from './api.js';

export function login(credentials) {
  return apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials)
  });
}

export function register(payload) {
  return apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export function getMe() {
  return apiRequest('/customers/me');
}

export function updateMe(payload) {
  return apiRequest('/customers/me', {
    method: 'PUT',
    body: JSON.stringify(payload)
  });
}

export function getAddresses() {
  return apiRequest('/customers/addresses');
}

export function createAddress(payload) {
  return apiRequest('/customers/addresses', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export function updateAddress(id, payload) {
  return apiRequest(`/customers/addresses/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload)
  });
}

export function deleteAddress(id) {
  return apiRequest(`/customers/addresses/${id}`, { method: 'DELETE' });
}
