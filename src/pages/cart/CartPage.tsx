import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Minus, Plus, Trash2, Tag, ArrowRight, ShieldCheck, Heart, MapPin } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/contexts/ToastContext';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui';

export function CartPage() {
  const { items, subtotal, deliveryFee, tax, discount, total, updateQuantity, removeItem, restaurantName, clearCart } = useCart();
  const toast = useToast();
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [tip, setTip] = useState<number>(0);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    if (couponCode.toUpperCase() === 'WELCOME50' || couponCode.toUpperCase() === 'FREEDEL') {
      setAppliedCoupon(couponCode.toUpperCase());
      toast.success(`Coupon ${couponCode.toUpperCase()} applied successfully! 🎉`);
    } else {
      toast.error('Invalid coupon code. Try WELCOME50 or FREEDEL.');
    }
  };

  const finalTotal = Math.max(0, total + tip - (appliedCoupon === 'WELCOME50' ? 50 : 0));

  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <EmptyState
          icon={<ShoppingCart size={64} className="text-gray-300 mx-auto" />}
          title="Your cart is completely empty"
          description="Good food is just a few taps away. Explore top Pune kitchens and order your favorite meal."
          action={
            <Link to="/restaurants">
              <Button variant="primary" size="lg" className="rounded-2xl font-black bg-gradient-to-r from-red-600 to-rose-600 shadow-md" rightIcon={<ArrowRight size={18} />}>
                Explore Top Restaurants
              </Button>
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Order Checkout Cart</h1>
          <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-0.5">Ordering from <span className="text-red-600 font-extrabold">{restaurantName}</span></p>
        </div>
        <button onClick={clearCart} className="text-xs font-bold text-red-600 hover:underline">
          Clear Entire Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Dish List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">Selected Items ({items.length})</h3>

            <div className="divide-y divide-gray-100">
              {items.map(ci => (
                <div key={ci.menuItem.id} className="py-4 flex items-center justify-between gap-4 first:pt-0 last:pb-0">
                  <div className="flex items-center gap-3.5 flex-1 min-w-0">
                    {ci.menuItem.image && (
                      <img src={ci.menuItem.image} alt={ci.menuItem.name} className="w-14 h-14 rounded-2xl object-cover flex-shrink-0 border border-gray-100 shadow-xs" />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="font-extrabold text-slate-900 text-sm line-clamp-1">{ci.menuItem.name}</p>
                      <p className="text-xs font-bold text-slate-500 mt-0.5">₹{ci.menuItem.price} per item</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 flex-shrink-0">
                    <div className="flex items-center gap-2 bg-emerald-700 text-white rounded-xl shadow-xs p-1 font-black text-xs">
                      <button onClick={() => updateQuantity(ci.menuItem.id, ci.quantity - 1)} className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-emerald-800">
                        <Minus size={12} />
                      </button>
                      <span className="w-4 text-center">{ci.quantity}</span>
                      <button onClick={() => updateQuantity(ci.menuItem.id, ci.quantity + 1)} className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-emerald-800">
                        <Plus size={12} />
                      </button>
                    </div>

                    <span className="font-black text-slate-900 text-sm w-16 text-right">₹{ci.menuItem.price * ci.quantity}</span>

                    <button
                      onClick={() => removeItem(ci.menuItem.id)}
                      className="text-gray-300 hover:text-red-600 transition-colors p-1"
                      aria-label={`Remove ${ci.menuItem.name}`}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery Partner Tip Card */}
          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-slate-900 font-extrabold text-sm">
              <Heart size={16} className="text-red-500 fill-red-500" />
              <span>Tip your delivery partner</span>
            </div>
            <p className="text-xs text-slate-500 font-semibold">100% of your tip goes directly to your delivery executive.</p>
            <div className="flex gap-2 pt-1">
              {[0, 20, 30, 50].map(amt => (
                <button
                  key={amt}
                  onClick={() => setTip(amt)}
                  className={`flex-1 py-2 rounded-xl text-xs font-black border transition-all ${tip === amt ? 'bg-slate-900 text-white border-slate-900 shadow-xs' : 'border-gray-200 text-slate-700 bg-white hover:border-gray-300'}`}
                >
                  {amt === 0 ? 'No Tip' : `₹${amt}`}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Bill Summary */}
        <div className="space-y-4">
          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm sticky top-24 space-y-5">
            {/* Promo Coupon Box */}
            <form onSubmit={handleApplyCoupon} className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block">Apply Promo Coupon</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Try WELCOME50"
                  value={couponCode}
                  onChange={e => setCouponCode(e.target.value)}
                  className="flex-1 px-3.5 py-2 text-xs font-bold uppercase tracking-wider border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:border-red-500"
                />
                <Button type="submit" size="sm" className="rounded-xl font-bold bg-slate-900">Apply</Button>
              </div>
              {appliedCoupon && (
                <p className="text-xs font-extrabold text-emerald-600 flex items-center gap-1">
                  <Tag size={12} /> Coupon {appliedCoupon} active (-₹50)
                </p>
              )}
            </form>

            <div className="border-t border-gray-100 pt-4 space-y-2.5 text-xs font-semibold text-slate-600">
              <div className="flex justify-between"><span>Item Total</span><span>₹{subtotal}</span></div>
              <div className="flex justify-between"><span>Delivery Charge</span><span>{deliveryFee === 0 ? <span className="text-emerald-600 font-bold">FREE</span> : `₹${deliveryFee}`}</span></div>
              <div className="flex justify-between"><span>Taxes & GST (5%)</span><span>₹{tax}</span></div>
              {tip > 0 && <div className="flex justify-between text-amber-600"><span>Delivery Tip</span><span>₹{tip}</span></div>}
              {appliedCoupon === 'WELCOME50' && <div className="flex justify-between text-emerald-600"><span>Welcome Discount</span><span>-₹50</span></div>}
              
              <div className="border-t border-gray-200 pt-3 flex justify-between font-black text-slate-900 text-base">
                <span>Grand Total</span>
                <span>₹{finalTotal}</span>
              </div>
            </div>

            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center gap-2 text-xs font-bold text-emerald-800">
              <ShieldCheck size={16} className="text-emerald-600 flex-shrink-0" />
              <span>Encrypted 256-bit safe checkout</span>
            </div>

            <Link to="/checkout" className="block pt-1">
              <Button fullWidth size="lg" className="rounded-2xl font-black bg-gradient-to-r from-red-600 to-rose-600 shadow-md text-base py-3.5">
                Proceed to Pay ₹{finalTotal}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
