import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, ChevronRight, RotateCcw } from 'lucide-react';
import { useOrders } from '@/contexts/OrdersContext';
import { useAuth } from '@/contexts/AuthContext';
import { useRefunds } from '@/contexts/RefundsContext';
import { Button } from '@/components/ui/Button';
import { EmptyState, Badge } from '@/components/ui';
import { RefundRequestModal } from '@/components/refund/RefundRequestModal';
import type { Order, OrderStatus } from '@/types';

const STATUS_CONFIG: Record<OrderStatus, { label: string; variant: 'success' | 'warning' | 'error' | 'info' | 'default' }> = {
  PLACED: { label: 'Placed', variant: 'info' },
  CONFIRMED: { label: 'Confirmed', variant: 'info' },
  PREPARING: { label: 'Preparing', variant: 'warning' },
  OUT_FOR_DELIVERY: { label: 'Out for Delivery', variant: 'warning' },
  DELIVERED: { label: 'Delivered', variant: 'success' },
  CANCELLED: { label: 'Cancelled', variant: 'error' },
};

export function OrdersPage() {
  const { user } = useAuth();
  const { orders } = useOrders();
  const { getOrderRefund } = useRefunds();
  const [refundOrderId, setRefundOrderId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<OrderStatus | 'ALL'>('ALL');

  const filteredOrders = orders.filter(o => filterStatus === 'ALL' || o.status === filterStatus);

  if (!user) return null;

  const refundOrder = refundOrderId ? orders.find(o => o.id === refundOrderId) : null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">My Orders</h1>
          <p className="text-sm font-medium text-gray-500 mt-1">Track active deliveries and review your past food orders.</p>
        </div>
      </div>

      {/* Status filter */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
        {(['ALL', 'PLACED', 'PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'] as const).map(status => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`flex-shrink-0 px-4 py-2 text-xs font-bold rounded-full border transition-all ${filterStatus === status ? 'bg-red-500 text-white border-red-500 shadow-xs' : 'border-gray-200 text-gray-600 hover:border-gray-300 bg-white'}`}
          >
            {status === 'ALL' ? 'All Orders' : STATUS_CONFIG[status]?.label ?? status}
          </button>
        ))}
      </div>

      {filteredOrders.length === 0 ? (
        <EmptyState
          icon={<Package size={48} className="text-gray-300" />}
          title={filterStatus === 'ALL' ? 'No orders yet' : `No ${STATUS_CONFIG[filterStatus as OrderStatus]?.label} orders`}
          description="Explore our top restaurants and order delicious food today."
          action={<Link to="/restaurants"><Button variant="primary" rightIcon={<ChevronRight size={16} />}>Browse Restaurants</Button></Link>}
        />
      ) : (
        <div className="space-y-4">
          {filteredOrders.map(order => <OrderCard key={order.id} order={order} getOrderRefund={getOrderRefund} onRequestRefund={setRefundOrderId} />)}
        </div>
      )}

      {refundOrder && (
        <RefundRequestModal
          order={refundOrder}
          isOpen={!!refundOrderId}
          onClose={() => setRefundOrderId(null)}
        />
      )}
    </div>
  );
}

function OrderCard({ order, getOrderRefund, onRequestRefund }: {
  order: Order;
  getOrderRefund: (orderId: string) => ReturnType<ReturnType<typeof useRefunds>['getOrderRefund']>;
  onRequestRefund: (orderId: string) => void;
}) {
  const existingRefund = getOrderRefund(order.id);
  const cfg = STATUS_CONFIG[order.status];
  const canRefund = (order.status === 'DELIVERED' || order.status === 'CANCELLED') && !existingRefund;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden p-5 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-gray-100 gap-2">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <h3 className="font-extrabold text-gray-900 text-base">{order.restaurantName}</h3>
            <Badge variant={cfg.variant} size="sm">{cfg.label}</Badge>
          </div>
          <p className="text-xs font-semibold text-gray-400">Order #{order.id} · {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
        </div>
        <p className="font-extrabold text-gray-900 text-lg sm:text-right">₹{order.total}</p>
      </div>

      {/* Items preview */}
      <div className="bg-gray-50/70 p-3.5 rounded-xl border border-gray-100/80">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{order.items.length} Item{order.items.length > 1 ? 's' : ''}</p>
        <p className="text-sm font-semibold text-gray-800 line-clamp-2 leading-relaxed">
          {order.items.map(i => `${i.name} × ${i.quantity}`).join(', ')}
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between gap-3 pt-1 flex-wrap">
        <div>
          {order.status !== 'DELIVERED' && order.status !== 'CANCELLED' ? (
            <Link
              to={`/order-tracking/${order.id}`}
              className="inline-flex items-center gap-1.5 bg-red-50 text-red-600 hover:bg-red-100 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors"
            >
              <span>Track Live Order</span>
              <ChevronRight size={14} />
            </Link>
          ) : (
            <span className="text-xs font-medium text-gray-400">Delivered to {order.address.street}</span>
          )}
        </div>

        <div className="flex items-center gap-2.5">
          {existingRefund && (
            <Link to={`/refunds/${existingRefund.id}`} className="flex items-center gap-1 text-xs text-amber-600 font-bold hover:underline">
              <RotateCcw size={13} />
              <span>Refund {existingRefund.status.replace('_', ' ').toLowerCase()}</span>
            </Link>
          )}
          {canRefund && (
            <button
              onClick={() => onRequestRefund(order.id)}
              className="flex items-center gap-1 text-xs text-gray-500 hover:text-red-500 font-bold transition-colors"
            >
              <RotateCcw size={13} />
              <span>Request Refund</span>
            </button>
          )}
          <Link to={`/restaurant/${order.restaurantId}`}>
            <Button variant="outline" size="sm" className="rounded-xl font-bold border-gray-200">
              Reorder
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
