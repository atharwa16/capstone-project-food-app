import { Link, useParams } from 'react-router-dom';
import { RotateCcw, ChevronRight, CheckCircle, Clock, XCircle } from 'lucide-react';
import { useRefunds } from '@/contexts/RefundsContext';
import { useAuth } from '@/contexts/AuthContext';
import { useOrders } from '@/contexts/OrdersContext';
import { EmptyState, Badge } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import type { RefundStatus } from '@/types';

const REFUND_REASON_LABELS: Record<string, string> = {
  ORDER_NEVER_ARRIVED: 'Order never arrived',
  WRONG_ITEM: 'Wrong item received',
  MISSING_ITEM: 'Item missing from order',
  FOOD_QUALITY: 'Food quality issue',
  FOOD_DAMAGED: 'Food was damaged',
  RESTAURANT_CANCELLED: 'Restaurant cancelled',
  DUPLICATE_PAYMENT: 'Duplicate payment',
  OTHER: 'Other',
};

const STATUS_CONFIG: Record<RefundStatus, { label: string; variant: 'success' | 'warning' | 'error' | 'info' | 'default' }> = {
  PENDING: { label: 'Pending', variant: 'default' },
  UNDER_REVIEW: { label: 'Under Review', variant: 'info' },
  APPROVED: { label: 'Approved', variant: 'success' },
  REJECTED: { label: 'Rejected', variant: 'error' },
  PROCESSING: { label: 'Processing', variant: 'warning' },
  COMPLETED: { label: 'Completed', variant: 'success' },
  CANCELLED: { label: 'Cancelled', variant: 'error' },
};

export function RefundsPage() {
  const { user } = useAuth();
  const { getUserRefunds } = useRefunds();
  if (!user) return null;
  const refunds = getUserRefunds(user.id);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Refunds</h1>
      {refunds.length === 0 ? (
        <EmptyState
          icon={<RotateCcw size={52} />}
          title="No refund requests"
          description="Your refund requests will appear here."
          action={<Link to="/orders"><Button variant="outline">View Orders</Button></Link>}
        />
      ) : (
        <div className="space-y-3">
          {refunds.map(refund => {
            const cfg = STATUS_CONFIG[refund.status];
            return (
              <Link key={refund.id} to={`/refunds/${refund.id}`} className="block">
                <div className="bg-white rounded-xl border border-gray-100 shadow-card p-4 hover:shadow-elevated transition-shadow">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="font-semibold text-gray-900 text-sm">#{refund.id}</p>
                        <Badge variant={cfg.variant} size="sm">{cfg.label}</Badge>
                      </div>
                      <p className="text-xs text-gray-500">Order #{refund.orderId} · {new Date(refund.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                      <p className="text-xs text-gray-600 mt-1">{REFUND_REASON_LABELS[refund.reason] ?? refund.reason}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-bold text-gray-900">₹{refund.amount}</p>
                      <ChevronRight size={16} className="text-gray-400 ml-auto mt-1" />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

const REFUND_TIMELINE_STEPS: RefundStatus[] = ['PENDING', 'UNDER_REVIEW', 'APPROVED', 'PROCESSING', 'COMPLETED'];

export function RefundDetailPage() {
  const { refundId } = useParams<{ refundId: string }>();
  const { getRefund } = useRefunds();
  const { getOrder } = useOrders();
  const refund = getRefund(refundId!);

  if (!refund) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-500">Refund not found.</p>
        <Link to="/refunds" className="text-primary hover:underline mt-2 inline-block">View Refunds</Link>
      </div>
    );
  }

  const order = getOrder(refund.orderId);
  const cfg = STATUS_CONFIG[refund.status];
  const isRejected = refund.status === 'REJECTED' || refund.status === 'CANCELLED';
  const currentStepIndex = REFUND_TIMELINE_STEPS.indexOf(isRejected ? 'PENDING' : refund.status);

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center gap-2 mb-5 text-sm text-gray-500">
        <Link to="/refunds" className="hover:text-gray-700">Refunds</Link>
        <ChevronRight size={14} />
        <span className="text-gray-900 font-medium">#{refund.id}</span>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6 mb-4">
        <div className="flex items-start justify-between gap-2 mb-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Refund #{refund.id}</h1>
            <p className="text-sm text-gray-500 mt-0.5">Order #{refund.orderId}</p>
          </div>
          <Badge variant={cfg.variant}>{cfg.label}</Badge>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm mb-5">
          <div>
            <p className="text-xs text-gray-400 uppercase font-semibold">Amount</p>
            <p className="text-xl font-bold text-gray-900 mt-0.5">₹{refund.amount}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase font-semibold">Reason</p>
            <p className="text-gray-800 mt-0.5">{REFUND_REASON_LABELS[refund.reason]}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase font-semibold">Requested On</p>
            <p className="text-gray-800 mt-0.5">{new Date(refund.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase font-semibold">Last Updated</p>
            <p className="text-gray-800 mt-0.5">{new Date(refund.updatedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
          </div>
        </div>

        {refund.description && (
          <div className="bg-gray-50 rounded-lg p-3 mb-5">
            <p className="text-xs text-gray-500 mb-1">Description</p>
            <p className="text-sm text-gray-700">{refund.description}</p>
          </div>
        )}

        {refund.adminNote && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-5">
            <p className="text-xs font-semibold text-amber-700 mb-1">Admin Note</p>
            <p className="text-sm text-amber-800">{refund.adminNote}</p>
          </div>
        )}

        {/* Timeline */}
        {isRejected ? (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
            <XCircle size={32} className="text-red-500 mx-auto mb-2" />
            <p className="font-semibold text-red-700">Refund {refund.status === 'REJECTED' ? 'Rejected' : 'Cancelled'}</p>
            {refund.adminNote && <p className="text-sm text-red-600 mt-1">{refund.adminNote}</p>}
          </div>
        ) : (
          <div>
            <h3 className="font-bold text-gray-900 mb-4">Timeline</h3>
            <div className="space-y-0">
              {REFUND_TIMELINE_STEPS.map((step, index) => {
                const timelineEntry = refund.timeline.find(t => t.status === step);
                const isCompleted = index < currentStepIndex || (refund.status === step && refund.status === 'COMPLETED');
                const isCurrent = step === refund.status && !isCompleted;
                const isPending = index > currentStepIndex;
                const stepLabels: Record<RefundStatus, string> = {
                  PENDING: 'Request Submitted',
                  UNDER_REVIEW: 'Under Review',
                  APPROVED: 'Approved',
                  PROCESSING: 'Processing Refund',
                  COMPLETED: 'Refund Completed',
                  REJECTED: 'Rejected',
                  CANCELLED: 'Cancelled',
                };
                return (
                  <div key={step} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center flex-shrink-0 z-10 ${isCompleted ? 'border-green-500 bg-green-500' : isCurrent ? 'border-primary bg-primary' : 'border-gray-200 bg-white'}`}>
                        {isCompleted ? <CheckCircle size={16} className="text-white" /> : isCurrent ? <Clock size={14} className="text-white" /> : <div className="w-2.5 h-2.5 rounded-full bg-gray-200" />}
                      </div>
                      {index < REFUND_TIMELINE_STEPS.length - 1 && <div className={`w-0.5 h-10 mt-1 ${isCompleted ? 'bg-green-400' : 'bg-gray-200'}`} />}
                    </div>
                    <div className="pb-10 pt-1">
                      <p className={`text-sm font-semibold ${isCompleted ? 'text-green-700' : isCurrent ? 'text-primary' : 'text-gray-400'}`}>{stepLabels[step]}</p>
                      {timelineEntry && <p className="text-xs text-gray-500 mt-0.5">{new Date(timelineEntry.date).toLocaleString('en-IN')}</p>}
                      {timelineEntry?.note && <p className="text-xs text-gray-500 mt-0.5 italic">{timelineEntry.note}</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {order && (
        <div className="bg-white rounded-xl border border-gray-100 p-4 mb-4">
          <h3 className="font-bold text-gray-900 mb-3 text-sm">Related Order</h3>
          <p className="text-sm text-gray-600">{order.restaurantName}</p>
          <p className="text-xs text-gray-500">{order.items.map(i => `${i.name} × ${i.quantity}`).join(', ')}</p>
          <p className="font-semibold text-gray-900 mt-1">₹{order.total}</p>
        </div>
      )}

      <Link to="/refunds">
        <Button variant="outline" fullWidth>← Back to Refunds</Button>
      </Link>
    </div>
  );
}
