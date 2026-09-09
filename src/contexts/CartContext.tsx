import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { CartItem, MenuItem } from '@/types';

interface CartContextValue {
  restaurantId: string | null;
  restaurantName: string | null;
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  deliveryFee: number;
  tax: number;
  discount: number;
  total: number;
  addItem: (item: MenuItem, restaurantId: string, restaurantName: string) => 'added' | 'conflict';
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  applyDiscount: (amount: number) => void;
  isInCart: (itemId: string) => boolean;
  getQuantity: (itemId: string) => number;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [restaurantId, setRestaurantId] = useState<string | null>(null);
  const [restaurantName, setRestaurantName] = useState<string | null>(null);
  const [items, setItems] = useState<CartItem[]>([]);
  const [discount, setDiscount] = useState(0);

  const subtotal = items.reduce((sum, ci) => sum + ci.menuItem.price * ci.quantity, 0);
  const deliveryFee = items.length === 0 ? 0 : subtotal > 399 ? 0 : 35;
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + deliveryFee + tax - discount;
  const itemCount = items.reduce((sum, ci) => sum + ci.quantity, 0);

  const addItem = useCallback((item: MenuItem, restId: string, restName: string): 'added' | 'conflict' => {
    if (restaurantId && restaurantId !== restId) {
      return 'conflict';
    }
    setRestaurantId(restId);
    setRestaurantName(restName);
    setItems(prev => {
      const existing = prev.find(ci => ci.menuItem.id === item.id);
      if (existing) {
        return prev.map(ci => ci.menuItem.id === item.id ? { ...ci, quantity: ci.quantity + 1 } : ci);
      }
      return [...prev, { menuItem: item, quantity: 1 }];
    });
    return 'added';
  }, [restaurantId]);

  const removeItem = useCallback((itemId: string) => {
    setItems(prev => {
      const next = prev.filter(ci => ci.menuItem.id !== itemId);
      if (next.length === 0) {
        setRestaurantId(null);
        setRestaurantName(null);
        setDiscount(0);
      }
      return next;
    });
  }, []);

  const updateQuantity = useCallback((itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId);
      return;
    }
    setItems(prev => prev.map(ci => ci.menuItem.id === itemId ? { ...ci, quantity } : ci));
  }, [removeItem]);

  const clearCart = useCallback(() => {
    setItems([]);
    setRestaurantId(null);
    setRestaurantName(null);
    setDiscount(0);
  }, []);

  const applyDiscount = useCallback((amount: number) => {
    setDiscount(amount);
  }, []);

  const isInCart = useCallback((itemId: string) => items.some(ci => ci.menuItem.id === itemId), [items]);
  const getQuantity = useCallback((itemId: string) => items.find(ci => ci.menuItem.id === itemId)?.quantity ?? 0, [items]);

  return (
    <CartContext.Provider value={{
      restaurantId, restaurantName, items, itemCount,
      subtotal, deliveryFee, tax, discount, total,
      addItem, removeItem, updateQuantity, clearCart, applyDiscount, isInCart, getQuantity,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
