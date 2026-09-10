import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { Refund, RefundStatus, RefundReason } from '@/types';
import { sampleRefunds } from '@/data/orders';
import { fetchApi } from '@/services/apiClient';

interface RefundsContextValue {
  refunds: Refund[];
  getUserRefunds: (userId: string) => Refund[];
  getRefund: (refundId: string) => Refund | undefined;
  getOrderRefund: (orderId: string) => Refund | undefined;
  createRefund: (orderId: string, userId: string, restaurantId: string, amount: number, reason: RefundReason, description: string, image?: string) => Promise<Refund>;
  updateRefundStatus: (refundId: string, status: RefundStatus, note?: string) => Promise<void>;
  allRefunds: Refund[];
  reloadRefunds: () => Promise<void>;
}

const RefundsContext = createContext<RefundsContextValue | null>(null);
let localRefundCounter = sampleRefunds.length + 1;

export function RefundsProvider({ children }: { children: ReactNode }) {
  const [refunds, setRefunds] = useState<Refund[]>(sampleRefunds);

  const reloadRefunds = useCallback(async () => {
    try {
      const fetched = await fetchApi<Refund[]>('/refunds');
      if (Array.isArray(fetched) && fetched.length > 0) {
        setRefunds(fetched);
      }
    } catch {
      // Backend offline, fallback to local state
    }
  }, []);

  useEffect(() => {
    reloadRefunds();
  }, [reloadRefunds]);

  const getUserRefunds = useCallback((userId: string) =>
    refunds.filter(r => r.userId === userId).sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ), [refunds]);

  const getRefund = useCallback((refundId: string) =>
    refunds.find(r => r.id === refundId), [refunds]);

  const getOrderRefund = useCallback((orderId: string) =>
    refunds.find(r => r.orderId === orderId), [refunds]);

  const createRefund = useCallback(async (orderId: string, userId: string, restaurantId: string, amount: number, reason: RefundReason, description: string, image?: string): Promise<Refund> => {
    try {
      const created = await fetchApi<Refund>('/refunds', {
        method: 'POST',
        body: JSON.stringify({ orderId, userId, restaurantId, amount, reason, description, image }),
      });
      setRefunds(prev => [created, ...prev]);
      return created;
    } catch {
      const now = new Date().toISOString();
      const localRefund: Refund = {
        id: `RF${String(localRefundCounter++).padStart(3, '0')}`,
        orderId, userId, restaurantId, amount, reason, description, image,
        status: 'PENDING',
        timeline: [{ status: 'PENDING', date: now, note: 'Refund request submitted' }],
        createdAt: now,
        updatedAt: now,
      };
      setRefunds(prev => [localRefund, ...prev]);
      return localRefund;
    }
  }, []);

  const updateRefundStatus = useCallback(async (refundId: string, status: RefundStatus, note?: string) => {
    const now = new Date().toISOString();
    setRefunds(prev => prev.map(r => {
      if (r.id !== refundId) return r;
      return {
        ...r,
        status,
        updatedAt: now,
        resolvedAt: status === 'COMPLETED' ? now : r.resolvedAt,
        timeline: [...r.timeline, { status, date: now, note }],
      };
    }));

    try {
      await fetchApi<Refund>(`/refunds/${refundId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status, note }),
      });
    } catch {
      // Offline fallback state updated
    }
  }, []);

  return (
    <RefundsContext.Provider value={{ refunds, getUserRefunds, getRefund, getOrderRefund, createRefund, updateRefundStatus, allRefunds: refunds, reloadRefunds }}>
      {children}
    </RefundsContext.Provider>
  );
}

export function useRefunds() {
  const ctx = useContext(RefundsContext);
  if (!ctx) throw new Error('useRefunds must be used within RefundsProvider');
  return ctx;
}
