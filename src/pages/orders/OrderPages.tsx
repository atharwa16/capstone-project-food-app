import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, Package, Clock, MapPin, ArrowRight, PhoneCall, ShieldCheck, ChevronLeft, Navigation, UserCheck } from 'lucide-react';
import { useOrders } from '@/contexts/OrdersContext';
import { Button } from '@/components/ui/Button';
import { io } from 'socket.io-client';

export function OrderConfirmationPage() {
  const { id } = useParams<{ id: string }>();
  const { getOrder } = useOrders();
  const order = getOrder(id!);

  if (!order) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-500">Order not found.</p>
        <Link to="/" className="text-red-600 hover:underline mt-2 inline-block font-bold">Go Home</Link>
      </div>
    );
  }

  const estimatedTime = new Date(order.estimatedDelivery);
  const now = new Date();
  const minutesLeft = Math.max(0, Math.round((estimatedTime.getTime() - now.getTime()) / 60000));

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12 space-y-8">
      {/* Success Hero Header */}
      <div className="text-center space-y-3">
        <div className="w-20 h-20 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center mx-auto shadow-md">
          <CheckCircle size={44} className="text-emerald-600 animate-pulse" />
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Order Placed Successfully! 🎉</h1>
        <p className="text-sm font-semibold text-slate-500 max-w-sm mx-auto">The restaurant has received your order and started preparation.</p>
        <div className="inline-flex items-center gap-2 bg-slate-900 text-white rounded-full px-4 py-1 text-xs font-mono font-bold shadow-sm">
          <span>TICKET #{order.id}</span>
        </div>
      </div>

      {/* Delivery Estimate Box */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-red-600 to-rose-600 text-white p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-xs">
            <Clock size={24} className="text-white" />
          </div>
          <div>
            <p className="text-xs font-bold text-white/80 uppercase tracking-wider">Estimated Delivery Time</p>
            <p className="text-xl font-black text-white">
              {minutesLeft > 0 ? `~${minutesLeft} Minutes` : 'Arriving any moment'}
            </p>
          </div>
        </div>

        <div className="p-6 space-y-4 text-xs font-semibold text-slate-700">
          <div className="flex items-center gap-3">
            <Package size={18} className="text-slate-400" />
            <span className="text-sm text-slate-900">From <strong className="font-extrabold">{order.restaurantName}</strong></span>
          </div>
          <div className="flex items-start gap-3">
            <MapPin size={18} className="text-slate-400 mt-0.5" />
            <span className="text-sm text-slate-900">{order.address.street}, {order.address.city}</span>
          </div>

          <div className="border-t border-gray-100 pt-4 space-y-2">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Items Ordered</p>
            {order.items.map(item => (
              <div key={item.menuItemId} className="flex justify-between text-slate-800 text-xs font-bold">
                <span>{item.name} × {item.quantity}</span>
                <span className="font-black">₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-100 pt-3 space-y-1 text-slate-500 font-semibold">
            <div className="flex justify-between"><span>Subtotal</span><span>₹{order.subtotal}</span></div>
            <div className="flex justify-between"><span>Delivery</span><span>{order.deliveryFee === 0 ? 'FREE' : `₹${order.deliveryFee}`}</span></div>
            <div className="flex justify-between"><span>Taxes & GST</span><span>₹{order.tax}</span></div>
            <div className="flex justify-between font-black text-slate-900 text-base pt-2 border-t border-gray-100">
              <span>Total Paid</span>
              <span className="text-red-600">₹{order.total}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Link to={`/order-tracking/${order.id}`} className="flex-1">
          <Button fullWidth size="lg" className="rounded-2xl font-black bg-gradient-to-r from-red-600 to-rose-600 shadow-md" rightIcon={<ArrowRight size={18} />}>
            Track Order Status
          </Button>
        </Link>
        <Link to="/orders" className="flex-1">
          <Button fullWidth variant="outline" size="lg" className="rounded-2xl font-extrabold border-gray-200">
            View All Orders
          </Button>
        </Link>
      </div>
    </div>
  );
}

const ORDER_STEPS = [
  { status: 'PLACED', label: 'Order Confirmed', description: 'Restaurant accepted your order' },
  { status: 'CONFIRMED', label: 'Chef Assigning', description: 'Kitchen queue active' },
  { status: 'PREPARING', label: 'Cooking & Preparing', description: 'Food being freshly prepared' },
  { status: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', description: 'Delivery partner picked up your food' },
  { status: 'DELIVERED', label: 'Order Delivered', description: 'Enjoy your meal!' },
];

const STATUS_ORDER = ['PLACED', 'CONFIRMED', 'PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED'];

export function OrderTrackingPage() {
  const { id } = useParams<{ id: string }>();
  const { getOrder, updateOrderStatus } = useOrders();
  const order = getOrder(id!);

  const [driverGps, setDriverGps] = useState<any>(null);
  const [wsConnected, setWsConnected] = useState(false);

  useEffect(() => {
    if (!order) return;

    // Connect to WebSockets server
    const socket = io('http://localhost:5000', { transports: ['websocket', 'polling'] });

    socket.on('connect', () => {
      setWsConnected(true);
      socket.emit('join_order_room', { orderId: order.id });
    });

    socket.on('driver_location_update', (gpsData: any) => {
      setDriverGps(gpsData);
    });

    socket.on('order_status_update', ({ status }: { status: string }) => {
      updateOrderStatus(order.id, status as any);
    });

    return () => {
      socket.disconnect();
    };
  }, [order?.id]);

  if (!order) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-500">Order not found.</p>
        <Link to="/orders" className="text-red-600 hover:underline mt-2 inline-block font-bold">View Orders</Link>
      </div>
    );
  }

  const currentStatusIndex = STATUS_ORDER.indexOf(order.status);
  const isCancelled = order.status === 'CANCELLED';

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/orders" className="text-xs font-bold text-slate-500 hover:text-slate-900 flex items-center gap-1">
            <ChevronLeft size={14} />
            <span>My Orders</span>
          </Link>
          <span className="text-slate-300">/</span>
          <span className="text-xs font-black text-slate-900">#Order {order.id}</span>
        </div>

        {wsConnected && (
          <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full text-[10px] font-extrabold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            Live WebSockets Connected
          </span>
        )}
      </div>

      {/* ─── LIVE GPS DRIVER TRACKER CARD ─── */}
      {driverGps && (
        <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl border border-slate-800 space-y-4 animate-fade-in">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-red-500/20 text-red-400 border border-red-500/30 flex items-center justify-center">
                <Navigation size={20} className="animate-spin" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Live Delivery GPS Tracker</p>
                <p className="text-base font-extrabold text-white">{driverGps.driverName}</p>
              </div>
            </div>
            <a href={`tel:${driverGps.driverPhone}`} className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 shadow-sm">
              <PhoneCall size={14} /> Call Driver
            </a>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
            <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700/60">
              <p className="text-[10px] font-bold text-slate-400 uppercase">GPS Latitude</p>
              <p className="text-sm font-mono font-extrabold text-emerald-400">{driverGps.lat.toFixed(5)}° N</p>
            </div>
            <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700/60">
              <p className="text-[10px] font-bold text-slate-400 uppercase">GPS Longitude</p>
              <p className="text-sm font-mono font-extrabold text-emerald-400">{driverGps.lng.toFixed(5)}° E</p>
            </div>
            <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700/60 col-span-2 sm:col-span-1">
              <p className="text-[10px] font-bold text-slate-400 uppercase">Live Doorstep ETA</p>
              <p className="text-sm font-extrabold text-amber-400">~{driverGps.estimatedMinutes} Minutes</p>
            </div>
          </div>
        </div>
      )}

      {/* Tracker Timeline Card */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">Live Order Tracking</h1>
            <p className="text-xs font-semibold text-slate-500 mt-1">
              {isCancelled
                ? 'Order was cancelled.'
                : order.status === 'DELIVERED'
                ? 'Delivered to your doorstep!'
                : `Est. arrival: ${new Date(order.estimatedDelivery).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`
              }
            </p>
          </div>
          <div className="flex items-center gap-2">
            {!isCancelled && order.status !== 'DELIVERED' && (
              <button
                onClick={async () => {
                  if (window.confirm(`Are you sure you want to cancel Order #${order.id}?`)) {
                    await updateOrderStatus(order.id, 'CANCELLED');
                  }
                }}
                className="bg-rose-50 hover:bg-rose-100 text-rose-600 font-extrabold text-xs px-3.5 py-1.5 rounded-full border border-rose-200 transition-colors"
              >
                Cancel Order
              </button>
            )}

            {order.status === 'DELIVERED' && (
              <Link
                to={`/request-refund/${order.id}`}
                className="bg-red-50 hover:bg-red-100 text-red-600 font-extrabold text-xs px-3.5 py-1.5 rounded-full border border-red-200 transition-colors"
              >
                Request Refund
              </Link>
            )}

            <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-extrabold px-3.5 py-1.5 rounded-full">
              <PhoneCall size={14} className="text-emerald-600" />
              <span>Delivery Partner Assigned</span>
            </div>
          </div>
        </div>

        {isCancelled ? (
          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-5 text-center">
            <p className="text-rose-700 font-extrabold">Order Cancelled</p>
            <p className="text-xs text-rose-600 mt-1">Any paid amount will be automatically refunded to your account.</p>
          </div>
        ) : (
          <div className="py-2">
            {ORDER_STEPS.map((step, index) => {
              const isCompleted = index < currentStatusIndex;
              const isCurrent = index === currentStatusIndex;
              const isPending = index > currentStatusIndex;
              return (
                <div key={step.status} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center flex-shrink-0 z-10 transition-all ${
                      isCompleted ? 'border-emerald-600 bg-emerald-600 text-white shadow-xs' :
                      isCurrent ? 'border-red-600 bg-red-600 text-white shadow-md animate-pulse' :
                      'border-gray-200 bg-white text-gray-300'
                    }`}>
                      {isCompleted ? (
                        <CheckCircle size={20} />
                      ) : isCurrent ? (
                        <div className="w-3 h-3 rounded-full bg-white" />
                      ) : (
                        <div className="w-3 h-3 rounded-full bg-gray-200" />
                      )}
                    </div>
                    {index < ORDER_STEPS.length - 1 && (
                      <div className={`w-1 h-14 ${isCompleted ? 'bg-emerald-500' : 'bg-gray-200'}`} />
                    )}
                  </div>
                  <div className="pb-10 pt-2">
                    <p className={`text-sm font-extrabold ${isCompleted ? 'text-emerald-700' : isCurrent ? 'text-red-600 font-black' : 'text-slate-400'}`}>
                      {step.label}
                    </p>
                    <p className={`text-xs font-semibold mt-0.5 ${isPending ? 'text-slate-300' : 'text-slate-500'}`}>{step.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Order details summary */}
      <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm space-y-4">
        <h2 className="font-extrabold text-slate-900 text-base">Order Details</h2>
        <div className="space-y-2 text-xs font-semibold text-slate-700">
          <div className="flex justify-between">
            <span className="text-slate-400">Kitchen</span>
            <span className="font-extrabold text-slate-900">{order.restaurantName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Address</span>
            <span>{order.address.street}, {order.address.city}</span>
          </div>
          <div className="pt-2 border-t border-gray-100 space-y-1">
            {order.items.map(item => (
              <div key={item.menuItemId} className="flex justify-between">
                <span>{item.name} × {item.quantity}</span>
                <span className="font-bold text-slate-900">₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>
          <div className="pt-2 border-t border-gray-100 flex justify-between font-black text-slate-900 text-sm">
            <span>Total Paid</span>
            <span className="text-red-600">₹{order.total}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

