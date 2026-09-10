import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useOrders } from '@/contexts/OrdersContext';
import { useRefunds } from '@/contexts/RefundsContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { Button } from '@/components/ui/Button';
import type { RefundReason } from '@/types';
import {
  ShieldAlert,
  Upload,
  X,
  ArrowLeft,
  Package,
  AlertTriangle,
  UtensilsCrossed,
  Clock,
  HelpCircle,
  FileText
} from 'lucide-react';

const REASON_OPTIONS: { id: RefundReason; label: string; description: string; icon: any }[] = [
  { id: 'WRONG_ITEM', label: 'Wrong Item Received', description: 'Item received does not match order', icon: UtensilsCrossed },
  { id: 'MISSING_ITEM', label: 'Missing Item from Order', description: 'One or more items were left out', icon: Package },
  { id: 'FOOD_QUALITY', label: 'Food Quality Issue', description: 'Spoiled, cold, or stale food', icon: AlertTriangle },
  { id: 'FOOD_DAMAGED', label: 'Damaged Packaging', description: 'Spilled container or torn package', icon: ShieldAlert },
  { id: 'ORDER_NEVER_ARRIVED', label: 'Late or Undelivered', description: 'Severe delivery delay or missing order', icon: Clock },
  { id: 'OTHER', label: 'Other Reason', description: 'Describe issue in details below', icon: HelpCircle },
];

export function RequestRefundPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { getOrder } = useOrders();
  const { createRefund, getOrderRefund } = useRefunds();
  const { user } = useAuth();
  const toast = useToast();

  const order = getOrder(orderId || '');
  const existingRefund = getOrderRefund(orderId || '');

  const [reason, setReason] = useState<RefundReason>('FOOD_QUALITY');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState<number>(order?.total || 0);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Synchronize initial amount if order loads late
  if (order && amount === 0 && order.total > 0) {
    setAmount(order.total);
  }

  if (!order) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h1 className="text-2xl font-bold text-gray-900">Order Not Found</h1>
        <p className="text-sm text-gray-500">We couldn't find an order matching #{orderId}.</p>
        <Link to="/orders" className="text-red-500 font-bold hover:underline inline-block">
          ← Back to My Orders
        </Link>
      </div>
    );
  }

  if (existingRefund) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-14 h-14 bg-amber-100 rounded-full flex items-center justify-center mx-auto text-amber-600 font-bold">
          !
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Refund Claim Already Submitted</h1>
        <p className="text-sm text-gray-500">
          A refund ticket (<strong>#{existingRefund.id}</strong>) is already active for Order #{order.id}.
        </p>
        <div className="pt-2 flex justify-center gap-3">
          <Link to={`/refunds/${existingRefund.id}`}>
            <Button size="md" className="rounded-xl font-bold bg-gradient-to-r from-red-500 to-rose-600">
              View Refund Ticket Timeline
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      toast.error('Please provide a detailed explanation of the issue.');
      return;
    }
    if (amount <= 0 || amount > order.total) {
      toast.error(`Refund amount must be between ₹1 and ₹${order.total}.`);
      return;
    }

    setIsSubmitting(true);
    try {
      const refund = await createRefund(
        order.id,
        user?.id || order.userId,
        order.restaurantId,
        amount,
        reason,
        description,
        imagePreview || undefined
      );

      toast.success('Refund request submitted successfully!');
      navigate(`/refunds/${refund.id}`, { replace: true });
    } catch {
      toast.error('Failed to submit refund claim. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-8 animate-fade-in">
      {/* Top Header */}
      <div>
        <Link to="/orders" className="inline-flex items-center gap-1 text-xs font-bold text-gray-500 hover:text-red-500 transition-colors mb-3">
          <ArrowLeft size={14} /> Back to My Orders
        </Link>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
          Request Refund for Order <span className="text-red-500">#{order.id}</span>
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Submit your complaint with photos and reasons. Our support and admin team will review your claim.
        </p>
      </div>

      {/* Order Summary Banner */}
      <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Target Order Details</p>
          <p className="font-extrabold text-gray-900 text-base">{order.restaurantName}</p>
          <p className="text-xs text-gray-600 font-medium">
            {order.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}
          </p>
        </div>
        <div className="text-right sm:text-right space-y-0.5">
          <p className="text-xs font-bold text-gray-400 uppercase">Paid Amount</p>
          <p className="text-2xl font-black text-red-500">₹{order.total}</p>
        </div>
      </div>

      {/* Refund Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Step 1: Reason Selector */}
        <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-xs space-y-4">
          <h2 className="text-lg font-extrabold text-gray-900 flex items-center gap-2">
            <span className="w-7 h-7 rounded-xl bg-red-500 text-white text-xs font-black flex items-center justify-center">1</span>
            Select Reason for Refund
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {REASON_OPTIONS.map(opt => {
              const Icon = opt.icon;
              const isSelected = reason === opt.id;
              return (
                <label
                  key={opt.id}
                  className={`flex items-start gap-3.5 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    isSelected
                      ? 'border-red-500 bg-red-50/30 shadow-2xs'
                      : 'border-gray-100 hover:border-gray-200 bg-gray-50/50'
                  }`}
                >
                  <input
                    type="radio"
                    name="refundReason"
                    value={opt.id}
                    checked={isSelected}
                    onChange={() => setReason(opt.id)}
                    className="mt-1 text-red-500 focus:ring-red-500"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <Icon size={16} className={isSelected ? 'text-red-500' : 'text-gray-400'} />
                      <p className="text-xs font-extrabold text-gray-900">{opt.label}</p>
                    </div>
                    <p className="text-[11px] text-gray-500 font-medium mt-0.5">{opt.description}</p>
                  </div>
                </label>
              );
            })}
          </div>
        </div>

        {/* Step 2: Evidence Photo Upload */}
        <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-xs space-y-4">
          <h2 className="text-lg font-extrabold text-gray-900 flex items-center gap-2">
            <span className="w-7 h-7 rounded-xl bg-red-500 text-white text-xs font-black flex items-center justify-center">2</span>
            Upload Photo Evidence
          </h2>
          <p className="text-xs text-gray-500 font-medium">
            Upload a clear picture of the item, food quality issue, or damaged packaging.
          </p>

          {imagePreview ? (
            <div className="relative max-w-sm rounded-2xl overflow-hidden border border-gray-200 shadow-md">
              <img src={imagePreview} alt="Evidence preview" className="w-full h-48 object-cover" />
              <button
                type="button"
                onClick={() => setImagePreview(null)}
                className="absolute top-3 right-3 p-1.5 bg-slate-900/80 hover:bg-slate-900 text-white rounded-full transition-colors shadow-lg"
                title="Remove photo"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-dashed border-gray-200 hover:border-red-400 bg-gray-50/50 hover:bg-red-50/20 cursor-pointer transition-colors text-center group">
              <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <Upload size={22} />
              </div>
              <p className="text-xs font-extrabold text-gray-900">Click to upload photo evidence</p>
              <p className="text-[11px] text-gray-400 font-medium mt-0.5">PNG, JPG or WebP up to 5MB</p>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          )}
        </div>

        {/* Step 3: Detailed Description & Amount */}
        <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-xs space-y-4">
          <h2 className="text-lg font-extrabold text-gray-900 flex items-center gap-2">
            <span className="w-7 h-7 rounded-xl bg-red-500 text-white text-xs font-black flex items-center justify-center">3</span>
            Explanation & Claim Amount
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-extrabold text-gray-700 mb-1.5 flex items-center gap-1.5">
                <FileText size={14} className="text-gray-400" />
                Detailed Explanation <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Explain what was wrong with your order (e.g. food arrived cold, missing garlic naan, broken sauce container)..."
                className="w-full p-3.5 text-xs border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 font-medium"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold text-gray-700 mb-1.5">
                Claimed Refund Amount (₹)
              </label>
              <input
                type="number"
                min={1}
                max={order.total}
                value={amount}
                onChange={e => setAmount(Number(e.target.value))}
                className="w-full max-w-xs px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl font-bold focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
              />
              <p className="text-[11px] text-gray-400 mt-1 font-medium">Maximum refundable amount for this order is ₹{order.total}.</p>
            </div>
          </div>
        </div>

        {/* Submit Action */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link to="/orders" className="text-xs font-bold text-gray-500 hover:text-gray-800">
            Cancel & Return to Orders
          </Link>
          <Button
            type="submit"
            size="lg"
            isLoading={isSubmitting}
            className="w-full sm:w-auto px-8 rounded-2xl font-black bg-gradient-to-r from-red-500 to-rose-600 shadow-lg shadow-red-500/20"
          >
            Submit Refund Request
          </Button>
        </div>
      </form>
    </div>
  );
}
