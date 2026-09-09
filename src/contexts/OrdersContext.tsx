import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { Order, OrderStatus } from '@/types';
import { sampleOrders } from '@/data/orders';
import { useAuth } from './AuthContext';
import { fetchApi } from '@/services/apiClient';

interface OrdersContextValue {
  orders: Order[];
  getUserOrders: (userId: string) => Order[];
  getOrder: (orderId: string) => Order | undefined;
  placeOrder: (order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Order>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  allOrders: Order[];
  reloadOrders: () => Promise<void>;
}

const OrdersContext = createContext<OrdersContextValue | null>(null);
let localOrderCounter = sampleOrders.length + 1;

export function OrdersProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>(sampleOrders);
  const { user } = useAuth();

  const reloadOrders = useCallback(async () => {
    try {
      const fetched = await fetchApi<Order[]>('/orders');
      if (Array.isArray(fetched) && fetched.length > 0) {
        setOrders(fetched);
      }
    } catch {
      // Backend offline, fallback to sampleOrders state
    }
  }, []);

  useEffect(() => {
    reloadOrders();
  }, [reloadOrders]);

  const getUserOrders = useCallback((userId: string) =>
    orders.filter(o => o.userId === userId).sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ), [orders]);

  const getOrder = useCallback((orderId: string) =>
    orders.find(o => o.id === orderId), [orders]);

  const placeOrder = useCallback(async (orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Promise<Order> => {
    try {
      const created = await fetchApi<Order>('/orders', {
        method: 'POST',
        body: JSON.stringify(orderData),
      });
      setOrders(prev => [created, ...prev]);
      return created;
    } catch {
      const now = new Date().toISOString();
      const localOrder: Order = {
        ...orderData,
        id: `ORD${String(localOrderCounter++).padStart(3, '0')}`,
        createdAt: now,
        updatedAt: now,
      };
      setOrders(prev => [localOrder, ...prev]);
      return localOrder;
    }
  }, []);

  const updateOrderStatus = useCallback(async (orderId: string, status: OrderStatus) => {
    setOrders(prev => prev.map(o =>
      o.id === orderId ? { ...o, status, updatedAt: new Date().toISOString() } : o
    ));

    try {
      await fetchApi<Order>(`/orders/${orderId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
    } catch {
      // Offline fallback state already updated
    }
  }, []);

  const myOrders = user ? getUserOrders(user.id) : [];

  return (
    <OrdersContext.Provider value={{ orders: myOrders, getUserOrders, getOrder, placeOrder, updateOrderStatus, allOrders: orders, reloadOrders }}>
      {children}
    </OrdersContext.Provider>
  );
}

export function useOrders() {
  const ctx = useContext(OrdersContext);
  if (!ctx) throw new Error('useOrders must be used within OrdersProvider');
  return ctx;
}
