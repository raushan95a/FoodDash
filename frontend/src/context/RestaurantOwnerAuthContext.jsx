import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import * as restaurantOwnerService from '../services/restaurantOwnerService.js';

const RestaurantOwnerAuthContext = createContext(null);

function readStoredRestaurant() {
  const raw = localStorage.getItem('fooddash_restaurant');
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    localStorage.removeItem('fooddash_restaurant');
    return null;
  }
}

export function RestaurantOwnerAuthProvider({ children }) {
  const [restaurant, setRestaurant] = useState(readStoredRestaurant);
  const [restaurantToken, setRestaurantToken] = useState(() => localStorage.getItem('fooddash_restaurant_token'));
  const [checkingRestaurantSession, setCheckingRestaurantSession] = useState(Boolean(restaurantToken));

  const clearRestaurantSession = useCallback(() => {
    localStorage.removeItem('fooddash_restaurant_token');
    localStorage.removeItem('fooddash_restaurant');
    setRestaurantToken(null);
    setRestaurant(null);
  }, []);

  useEffect(() => {
    if (!restaurantToken) {
      setCheckingRestaurantSession(false);
      return undefined;
    }

    let cancelled = false;

    async function verifyStoredSession() {
      setCheckingRestaurantSession(true);
      try {
        const response = await restaurantOwnerService.getRestaurantMe();
        if (cancelled) return;

        localStorage.setItem('fooddash_restaurant', JSON.stringify(response.data));
        setRestaurant(response.data);
      } catch {
        if (!cancelled) clearRestaurantSession();
      } finally {
        if (!cancelled) setCheckingRestaurantSession(false);
      }
    }

    verifyStoredSession();

    return () => {
      cancelled = true;
    };
  }, [restaurantToken, clearRestaurantSession]);

  const login = useCallback(async (credentials) => {
    const response = await restaurantOwnerService.restaurantLogin(credentials);
    localStorage.setItem('fooddash_restaurant_token', response.data.token);
    localStorage.setItem('fooddash_restaurant', JSON.stringify(response.data.restaurant));
    setRestaurantToken(response.data.token);
    setRestaurant(response.data.restaurant);
    return response.data.restaurant;
  }, []);

  const logout = useCallback(() => {
    clearRestaurantSession();
  }, [clearRestaurantSession]);

  const value = useMemo(
    () => ({ restaurant, restaurantToken, checkingRestaurantSession, login, logout, setRestaurant }),
    [restaurant, restaurantToken, checkingRestaurantSession, login, logout]
  );

  return (
    <RestaurantOwnerAuthContext.Provider value={value}>
      {children}
    </RestaurantOwnerAuthContext.Provider>
  );
}

export function useRestaurantOwnerAuth() {
  return useContext(RestaurantOwnerAuthContext);
}
