import { createContext, useCallback, useContext, useMemo, useState } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    const raw = localStorage.getItem('fooddash_cart');
    return raw ? JSON.parse(raw) : [];
  });

  const persist = useCallback((nextItems) => {
    setItems(nextItems);
    localStorage.setItem('fooddash_cart', JSON.stringify(nextItems));
  }, []);

  const addItem = useCallback((restaurant, item) => {
    const restaurantId = restaurant.restaurant_id;
    const existingRestaurantId = items[0]?.restaurant_id;

    if (existingRestaurantId && existingRestaurantId !== restaurantId) {
      return {
        success: false,
        message: `Your cart already has items from ${items[0].restaurant_name}. Clear the cart before ordering from ${restaurant.name}.`
      };
    }

    const deliveryFee = Number(restaurant.delivery_fee || 0);
    const nextItems = items.some((cartItem) => cartItem.item_id === item.item_id)
      ? items.map((cartItem) => (
        cartItem.item_id === item.item_id
          ? { ...cartItem, quantity: cartItem.quantity + 1, delivery_fee: deliveryFee }
          : cartItem
      ))
      : [
        ...items,
        {
          ...item,
          quantity: 1,
          restaurant_id: restaurantId,
          restaurant_name: restaurant.name,
          delivery_fee: deliveryFee
        }
      ];
    persist(nextItems);
    return { success: true, message: `${item.item_name} added to cart` };
  }, [items, persist]);

  const updateQuantity = useCallback((itemId, quantity) => {
    const nextItems = items
      .map((item) => (item.item_id === itemId ? { ...item, quantity } : item))
      .filter((item) => item.quantity > 0);
    persist(nextItems);
  }, [items, persist]);

  const removeItem = useCallback((itemId) => {
    persist(items.filter((item) => item.item_id !== itemId));
  }, [items, persist]);

  const clearCart = useCallback(() => {
    persist([]);
  }, [persist]);

  const subtotal = items.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);
  const deliveryFee = items.length ? Number(items[0].delivery_fee || 0) : 0;
  const tax = subtotal * 0.05;
  const total = subtotal + deliveryFee + tax;

  const value = useMemo(() => ({
    items,
    subtotal,
    deliveryFee,
    tax,
    total,
    addItem,
    updateQuantity,
    removeItem,
    clearCart
  }), [
    items,
    subtotal,
    deliveryFee,
    tax,
    total,
    addItem,
    updateQuantity,
    removeItem,
    clearCart
  ]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  return useContext(CartContext);
}
