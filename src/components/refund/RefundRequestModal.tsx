import { useState } from 'react';
import { useToast } from '@/contexts/ToastContext';
import { useRefunds } from '@/contexts/RefundsContext';
import { useAuth } from '@/contexts/AuthContext';
import { Modal } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import type { Order, RefundReason } from '@/types';

const REFUND_REASONS: { value: RefundReason; label: string }[] = [
  { value: 'ORDER_NEVER_ARRIVED', label: 'Order never arrived' },
  { value: 'WRONG_ITEM', label: 'Wrong item received' },
  { value: 'MISSING_ITEM', label: 'Item missing from order' },
  { value: 'FOOD_QUALITY', label: 'Food quality issue' },
  { value: 'FOOD_DAMAGED', label: 'Food was damaged' },
  { value: 'RESTAURANT_CANCELLED', label: 'Restaurant cancelled' },
  { value: 'DUPLICATE_PAYMENT', label: 'Duplicate payment charged' },
  { value: 'OTHER', label: 'Other reason' },
];

interface RefundRequestModalProps {
  order: Order;
  isOpen: boolean;
  onClose: () => void;
}

export function RefundRequestModal({ order, isOpen, onClose }: RefundRequestModalProps) {
  const { user } = useAuth();
  const { createRefund, getOrderRefund } = useRefunds();
  const toast = useToast();
  const [reason, setReason] = useState<RefundReason>('ORDER_NEVER_ARRIVED');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const existingRefund = getOrderRefund(order.id);
  const canRefund = (order.status === 'DELIVERED' || order.status === 'CANCELLED') && !existingRefund;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSubmitting(true);
    await new Promise(res => setTimeout(res, 800));
    await createRefund(order.id, user.id, order.restaurantId, order.total, reason, description || 'No additional description provided.');
    toast.success('Refund request submitted! We\'ll review it within 24-48 hours.');
    setIsSubmitting(false);
    onClose();
    setDescription('');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Request a Refund" size="md">
      <div className="p-5">
        {!canRefund ? (
          <div className="text-center py-4">
            {existingRefund ? (
              <p className="text-sm text-gray-600">A refund request already exists for this order (Status: <strong>{existingRefund.status}</strong>).</p>
            ) : (
              <p className="text-sm text-gray-600">This order is not eligible for a refund.</p>
            )}
            <Button variant="outline" className="mt-4" onClick={onClose}>Close</Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Order Info */}
            <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
              <p className="text-xs text-gray-500">Order #{order.id}</p>
              <p className="text-sm font-semibold text-gray-900">{order.restaurantName}</p>
              <p className="text-sm text-gray-600">{order.items.map(i => `${i.name} × ${i.quantity}`).join(', ')}</p>
            </div>

            {/* Reason */}
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-2">Reason for refund <span className="text-red-500">*</span></label>
              <div className="space-y-2">
                {REFUND_REASONS.map(r => (
                  <label key={r.value} className={`flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer transition-colors ${reason === r.value ? 'border-primary bg-primary/5' : 'border-gray-100 hover:border-gray-200'}`}>
                    <input type="radio" name="reason" value={r.value} checked={reason === r.value} onChange={() => setReason(r.value)} className="text-primary" />
                    <span className="text-sm text-gray-800">{r.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-1.5">Tell us what happened</label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Please describe the issue in detail..."
                rows={3}
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none"
              />
            </div>

            {/* Amount */}
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 flex items-center justify-between">
              <span className="text-sm text-gray-700 font-medium">Refund amount</span>
              <span className="text-lg font-bold text-primary">₹{order.total}</span>
            </div>

            <div className="flex gap-3 pt-1">
              <Button type="button" variant="outline" fullWidth onClick={onClose}>Cancel</Button>
              <Button type="submit" fullWidth isLoading={isSubmitting}>Submit Refund Request</Button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
}
