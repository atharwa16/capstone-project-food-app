import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, CreditCard, Smartphone, Banknote, Wallet, ChevronDown, ChevronUp, Lock, ShieldCheck } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useOrders } from '@/contexts/OrdersContext';
import { useToast } from '@/contexts/ToastContext';
import { Button } from '@/components/ui/Button';
import type { Address } from '@/types';

const PAYMENT_METHODS = [
  { id: 'UPI', label: 'UPI Instant Pay', icon: Smartphone, description: 'Google Pay, PhonePe, Paytm, BHIM' },
  { id: 'Card', label: 'Credit / Debit Card', icon: CreditCard, description: 'Visa, Mastercard, RuPay, Amex' },
  { id: 'COD', label: 'Cash / Pay on Delivery', icon: Banknote, description: 'Pay cash or scan QR at doorstep' },
  { id: 'Wallet', label: 'Digital Wallet', icon: Wallet, description: 'Paytm Wallet, Mobikwik, Amazon Pay' },
];

export function CheckoutPage() {
  const { items, subtotal, deliveryFee, tax, discount, total, clearCart, restaurantId, restaurantName } = useCart();
  const { user } = useAuth();
  const { placeOrder } = useOrders();
  const toast = useToast();
  const navigate = useNavigate();

  const [selectedAddress, setSelectedAddress] = useState<Address | null>(user?.addresses[0] ?? null);
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [isPlacing, setIsPlacing] = useState(false);
  const [showAddAddress, setShowAddAddress] = useState(false);

  const deliveryAddress: Address = selectedAddress ?? {
    id: 'guest',
    label: 'Home',
    street: '12 MG Road, Koregaon Park',
    city: 'Pune',
    state: 'Maharashtra',
    pincode: '411001',
  };

  const handlePlaceOrder = async () => {
    if (!restaurantId || items.length === 0) {
      toast.error('Your cart is empty!');
      return;
    }
    setIsPlacing(true);
    await new Promise(res => setTimeout(res, 1200));

    const estimatedDelivery = new Date(Date.now() + (30 + Math.random() * 20) * 60 * 1000).toISOString();

    const order = await placeOrder({
      userId: user?.id ?? 'GUEST',
      restaurantId,
      restaurantName: restaurantName!,
      items: items.map(ci => ({
        menuItemId: ci.menuItem.id,
        name: ci.menuItem.name,
        price: ci.menuItem.price,
        quantity: ci.quantity,
        image: ci.menuItem.image,
      })),
      subtotal,
      deliveryFee,
      tax,
      discount,
      total,
      address: deliveryAddress,
      paymentMethod,
      status: 'PLACED',
      estimatedDelivery,
    });

    clearCart();
    toast.success('Order placed successfully! 🎉');
    navigate(`/order-confirmation/${order.id}`, { replace: true });
  };

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <p className="text-slate-500 font-medium">Your cart is empty.</p>
        <a href="/" className="text-red-600 font-extrabold hover:underline inline-block">Return to Storefront</a>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Complete Your Order</h1>
        <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-1">Delivering from <span className="text-red-600 font-bold">{restaurantName}</span></p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Address & Payment Selection */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Step 1: Delivery Address */}
          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-red-600 text-white font-black text-sm flex items-center justify-center shadow-xs">1</div>
              <h2 className="font-extrabold text-slate-900 text-lg">Delivery Address</h2>
            </div>

            {user?.addresses.length ? (
              <div className="space-y-3">
                {user.addresses.map(addr => (
                  <label
                    key={addr.id}
                    className={`flex items-start gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all ${selectedAddress?.id === addr.id ? 'border-red-600 bg-red-50/40 shadow-xs' : 'border-gray-100 hover:border-gray-200 bg-gray-50/50'}`}
                  >
                    <input
                      type="radio"
                      name="address"
                      checked={selectedAddress?.id === addr.id}
                      onChange={() => setSelectedAddress(addr)}
                      className="mt-1 text-red-600"
                    />
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <MapPin size={14} className="text-red-600" />
                        <span className="text-sm font-extrabold text-slate-900">{addr.label}</span>
                        {addr.isDefault && <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">Default</span>}
                      </div>
                      <p className="text-xs font-semibold text-slate-600">{addr.street}, {addr.city} - {addr.pincode}</p>
                    </div>
                  </label>
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 text-xs font-semibold text-slate-700">
                <p>Delivering to: <strong>12 MG Road, Koregaon Park, Pune - 411001</strong></p>
              </div>
            )}

            <button
              onClick={() => setShowAddAddress(v => !v)}
              className="flex items-center gap-1.5 text-xs text-red-600 font-extrabold hover:underline pt-1"
            >
              + Add new delivery address
              {showAddAddress ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>

            {showAddAddress && (
              <div className="pt-2 grid grid-cols-2 gap-3">
                <input placeholder="Flat / House / Street address" className="col-span-2 px-3.5 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-red-500 font-medium" />
                <input placeholder="City" className="px-3.5 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-red-500 font-medium" />
                <input placeholder="Pincode" className="px-3.5 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-red-500 font-medium" />
              </div>
            )}
          </div>

          {/* Step 2: Payment Options */}
          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-red-600 text-white font-black text-sm flex items-center justify-center shadow-xs">2</div>
              <h2 className="font-extrabold text-slate-900 text-lg">Select Payment Method</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {PAYMENT_METHODS.map(pm => {
                const Icon = pm.icon;
                return (
                  <label
                    key={pm.id}
                    className={`flex items-center gap-3.5 p-4 rounded-2xl border-2 cursor-pointer transition-all ${paymentMethod === pm.id ? 'border-red-600 bg-red-50/40 shadow-xs' : 'border-gray-100 hover:border-gray-200 bg-gray-50/50'}`}
                  >
                    <input type="radio" name="payment" value={pm.id} checked={paymentMethod === pm.id} onChange={() => setPaymentMethod(pm.id)} className="text-red-600" />
                    <Icon size={20} className="text-slate-600 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-black text-slate-900">{pm.label}</p>
                      <p className="text-[10px] font-semibold text-slate-400">{pm.description}</p>
                    </div>
                  </label>
                );
              })}
            </div>

            {paymentMethod === 'Card' && (
              <div className="pt-2 space-y-3 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <input placeholder="16-digit card number" className="w-full px-3.5 py-2 text-xs border border-gray-200 rounded-xl font-medium focus:outline-none focus:border-red-500" />
                <div className="grid grid-cols-2 gap-3">
                  <input placeholder="MM / YY" className="px-3.5 py-2 text-xs border border-gray-200 rounded-xl font-medium focus:outline-none focus:border-red-500" />
                  <input placeholder="CVV" className="px-3.5 py-2 text-xs border border-gray-200 rounded-xl font-medium focus:outline-none focus:border-red-500" />
                </div>
              </div>
            )}

            {paymentMethod === 'UPI' && (
              <div className="pt-2 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <input placeholder="Enter VPA ID (e.g. mobile@upi)" className="w-full px-3.5 py-2 text-xs border border-gray-200 rounded-xl font-medium focus:outline-none focus:border-red-500" />
              </div>
            )}
          </div>

          <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200/80 text-xs font-semibold text-amber-800 flex items-center gap-2">
            <ShieldCheck size={18} className="text-amber-600 flex-shrink-0" />
            <span>Demonstration Mode: Simulated checkout experience. No real money will be charged.</span>
          </div>
        </div>

        {/* Right Column: Final Order Summary & Pay Button */}
        <div>
          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm sticky top-24 space-y-5">
            <h2 className="font-black text-slate-900 text-lg">Final Bill Details</h2>
            
            <div className="space-y-2 text-xs font-semibold text-slate-600 mb-4 max-h-48 overflow-y-auto">
              {items.map(ci => (
                <div key={ci.menuItem.id} className="flex justify-between">
                  <span className="flex-1 line-clamp-1">{ci.menuItem.name} × {ci.quantity}</span>
                  <span className="font-bold text-slate-900 ml-2">₹{ci.menuItem.price * ci.quantity}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-100 pt-3 space-y-2 text-xs font-semibold text-slate-600">
              <div className="flex justify-between"><span>Subtotal</span><span>₹{subtotal}</span></div>
              <div className="flex justify-between"><span>Delivery Charge</span><span>{deliveryFee === 0 ? <span className="text-emerald-700 font-bold">FREE</span> : `₹${deliveryFee}`}</span></div>
              <div className="flex justify-between"><span>Taxes & GST</span><span>₹{tax}</span></div>
              {discount > 0 && <div className="flex justify-between text-emerald-700"><span>Discount</span><span>-₹{discount}</span></div>}
              
              <div className="border-t border-gray-200 pt-3 flex justify-between font-black text-slate-900 text-lg">
                <span>To Pay</span>
                <span className="text-red-600">₹{total}</span>
              </div>
            </div>

            <Button
              fullWidth
              size="lg"
              isLoading={isPlacing}
              onClick={handlePlaceOrder}
              id="place-order-btn"
              className="mt-4 rounded-2xl font-black bg-gradient-to-r from-red-600 to-rose-600 shadow-md text-base py-3.5"
            >
              {isPlacing ? 'Confirming Order...' : `Pay ₹${total} & Place Order`}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
