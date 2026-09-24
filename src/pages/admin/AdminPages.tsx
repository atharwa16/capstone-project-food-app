import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchApi } from '@/services/apiClient';
import {
  Users,
  UtensilsCrossed,
  Package,
  DollarSign,
  RotateCcw,
  AlertCircle,
  ArrowUpRight,
  TrendingUp,
  CheckCircle,
  XCircle,
  ChevronRight,
  Search,
  Filter,
  CreditCard,
  QrCode,
  Wallet,
  Coins,
  ArrowDownRight,
  Clock,
  Building2,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  ExternalLink,
  Power
} from 'lucide-react';
import { users } from '@/data/users';
import { restaurants as initialRestaurants } from '@/data/restaurants';
import { sampleOrders, sampleRefunds } from '@/data/orders';
import { Badge } from '@/components/ui';
import { useRefunds } from '@/contexts/RefundsContext';
import { useOrders } from '@/contexts/OrdersContext';
import { useToast } from '@/contexts/ToastContext';
import type { OrderStatus, RefundStatus } from '@/types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const CHART_DATA = [
  { month: 'Apr', orders: 45, revenue: 18200 },
  { month: 'May', orders: 62, revenue: 25400 },
  { month: 'Jun', orders: 58, revenue: 22100 },
  { month: 'Jul', orders: 74, revenue: 31500 },
  { month: 'Aug', orders: 88, revenue: 38200 },
  { month: 'Sep', orders: 25, revenue: 11800 },
];

export function AdminDashboard() {
  const { allOrders } = useOrders();
  const { refunds } = useRefunds();

  const totalDeliveredOrders = allOrders.filter(o => o.status === 'DELIVERED');
  const grossRevenue = totalDeliveredOrders.reduce((sum, o) => sum + o.total, 0);
  const platformCommission = Math.round(grossRevenue * 0.18); // 18% take rate
  const netRestaurantPayout = grossRevenue - platformCommission;
  const totalRefundedAmount = refunds
    .filter(r => r.status === 'APPROVED' || r.status === 'COMPLETED')
    .reduce((sum, r) => sum + r.amount, 0);

  const pendingRefundsCount = refunds.filter(r => r.status === 'PENDING' || r.status === 'UNDER_REVIEW').length;

  // Payment method breakdown
  const upiOrders = allOrders.filter(o => o.paymentMethod === 'UPI');
  const cardOrders = allOrders.filter(o => o.paymentMethod === 'Card');
  const codOrders = allOrders.filter(o => o.paymentMethod === 'COD');
  const walletOrders = allOrders.filter(o => o.paymentMethod === 'Wallet');

  const upiTotal = upiOrders.reduce((s, o) => s + o.total, 0);
  const cardTotal = cardOrders.reduce((s, o) => s + o.total, 0);
  const codTotal = codOrders.reduce((s, o) => s + o.total, 0);
  const walletTotal = walletOrders.reduce((s, o) => s + o.total, 0);

  const totalOrderCount = allOrders.length || 1;

  const paymentStats = [
    { method: 'UPI (GPay/PhonePe)', count: upiOrders.length, amount: upiTotal, percent: Math.round((upiOrders.length / totalOrderCount) * 100), icon: QrCode, color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200' },
    { method: 'Credit / Debit Cards', count: cardOrders.length, amount: cardTotal, percent: Math.round((cardOrders.length / totalOrderCount) * 100), icon: CreditCard, color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200' },
    { method: 'Cash on Delivery (COD)', count: codOrders.length, amount: codTotal, percent: Math.round((codOrders.length / totalOrderCount) * 100), icon: Coins, color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200' },
    { method: 'BitePay Wallet', count: walletOrders.length, amount: walletTotal, percent: Math.round((walletOrders.length / totalOrderCount) * 100), icon: Wallet, color: 'text-purple-600', bg: 'bg-purple-50 border-purple-200' },
  ];

  const metrics = [
    { label: 'Total Registered Users', value: users.length, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50 border-blue-100', to: '/admin/users', growth: '+14% this month' },
    { label: 'Active Restaurants', value: initialRestaurants.length, icon: UtensilsCrossed, color: 'text-amber-600', bg: 'bg-amber-50 border-amber-100', to: '/admin/restaurants', growth: '100% operational' },
    { label: 'Total Platform Orders', value: allOrders.length, icon: Package, color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-100', to: '/admin/orders', growth: '+28% vs last week' },
    { label: 'Gross Revenue (GMV)', value: `₹${grossRevenue.toLocaleString()}`, icon: DollarSign, color: 'text-indigo-600', bg: 'bg-indigo-50 border-indigo-100', to: '/admin/orders', growth: '+18.5% YoY' },
    { label: 'Platform Commission (18%)', value: `₹${platformCommission.toLocaleString()}`, icon: Building2, color: 'text-violet-600', bg: 'bg-violet-50 border-violet-100', to: '/admin/orders', growth: 'Net BiteHub revenue' },
    { label: 'Pending Refund Tickets', value: pendingRefundsCount, icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-50 border-red-100', to: '/admin/refunds', growth: 'Requires review' },
  ];

  const recentOrders = [...allOrders]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const pendingRefundList = refunds
    .filter(r => r.status === 'PENDING' || r.status === 'UNDER_REVIEW')
    .slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-6 sm:p-8 rounded-3xl text-white shadow-lg border border-slate-700">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <span className="bg-red-500/20 text-red-400 font-extrabold text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-red-500/30 flex items-center gap-1">
              <ShieldAlert size={12} /> Super Admin Operational Hub
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">System Telemetry & Financial Overview</h1>
          <p className="text-xs sm:text-sm text-slate-300 font-medium mt-1">Live order dispatches, payment gateway transactions, restaurant payouts & refund management.</p>
        </div>
        <div className="inline-flex items-center gap-2 bg-slate-800/90 border border-slate-700 text-amber-400 px-4 py-2 rounded-2xl font-bold text-xs shadow-inner">
          <TrendingUp size={16} className="text-amber-400" />
          <span>Real-time Operational Mode</span>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {metrics.map(m => {
          const Icon = m.icon;
          return (
            <Link key={m.label} to={m.to} className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all group">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl ${m.bg} border flex items-center justify-center`}>
                  <Icon size={20} className={m.color} />
                </div>
                <ArrowUpRight size={16} className="text-gray-300 group-hover:text-red-500 transition-colors" />
              </div>
              <p className="text-2xl font-extrabold text-gray-900 tracking-tight">{m.value}</p>
              <p className="text-xs font-bold text-gray-700 mt-1 line-clamp-1">{m.label}</p>
              <p className="text-[10px] font-semibold text-gray-400 mt-1">{m.growth}</p>
            </Link>
          );
        })}
      </div>

      {/* ─── DEDICATED PAYMENTS & REVENUE TELEMETRY SECTION ─── */}
      <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-4">
          <div>
            <h2 className="text-xl font-extrabold text-gray-900 flex items-center gap-2">
              <CreditCard className="text-red-500" size={22} />
              Payment Methods & Revenue Telemetry
            </h2>
            <p className="text-xs text-gray-500 font-medium mt-0.5">Comprehensive breakdown of customer payment channels, gross sales, and payouts.</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
              Gross Volume: <strong className="text-gray-900">₹{grossRevenue.toLocaleString()}</strong>
            </span>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Net Commission: <strong className="text-emerald-900">₹{platformCommission.toLocaleString()}</strong>
            </span>
          </div>
        </div>

        {/* Payment Methods Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {paymentStats.map(p => {
            const Icon = p.icon;
            return (
              <div key={p.method} className={`p-5 rounded-2xl border ${p.bg} transition-all space-y-3`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon size={20} className={p.color} />
                    <span className="font-extrabold text-gray-900 text-xs sm:text-sm">{p.method}</span>
                  </div>
                  <span className="text-xs font-extrabold text-gray-500">{p.percent}%</span>
                </div>

                <div>
                  <p className="text-2xl font-extrabold text-gray-900">₹{p.amount.toLocaleString()}</p>
                  <p className="text-xs font-semibold text-gray-600 mt-0.5">{p.count} successful transactions</p>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-gray-200/80 rounded-full h-1.5 overflow-hidden">
                  <div className={`h-full rounded-full bg-current ${p.color}`} style={{ width: `${p.percent}%` }} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Financial Summary Strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Gross Platform Sales</p>
              <p className="text-2xl font-extrabold text-white mt-1">₹{grossRevenue.toLocaleString()}</p>
              <p className="text-[11px] text-slate-400 mt-1">Total value of completed customer orders</p>
            </div>
            <TrendingUp size={32} className="text-emerald-400 opacity-80" />
          </div>

          <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Net Restaurant Payouts</p>
              <p className="text-2xl font-extrabold text-amber-400 mt-1">₹{netRestaurantPayout.toLocaleString()}</p>
              <p className="text-[11px] text-slate-400 mt-1">Disbursed to food partners after 18% fee</p>
            </div>
            <Building2 size={32} className="text-amber-400 opacity-80" />
          </div>

          <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Customer Refunds</p>
              <p className="text-2xl font-extrabold text-rose-400 mt-1">₹{totalRefundedAmount.toLocaleString()}</p>
              <p className="text-[11px] text-slate-400 mt-1">Approved & credited refund claims</p>
            </div>
            <RotateCcw size={32} className="text-rose-400 opacity-80" />
          </div>
        </div>

        {/* Live Payment Gateway Transactions Table */}
        <div className="border border-gray-100 rounded-2xl overflow-hidden mt-4">
          <div className="bg-gray-50/90 px-6 py-3.5 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-extrabold text-gray-900 text-xs uppercase tracking-wider flex items-center gap-2">
              <Clock size={14} className="text-gray-400" />
              Live Payment Gateway Transaction Logs
            </h3>
            <span className="text-[11px] font-bold text-gray-500">{allOrders.length} Recorded Transactions</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white border-b border-gray-100 text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">
                  <th className="px-6 py-3">Transaction ID</th>
                  <th className="px-6 py-3">Order Ref</th>
                  <th className="px-6 py-3">Customer</th>
                  <th className="px-6 py-3">Payment Method</th>
                  <th className="px-6 py-3">Amount</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-xs">
                {allOrders.slice(0, 7).map(order => {
                  const txnId = `TXN_${order.id.replace('ORD', '')}98402`;
                  return (
                    <tr key={order.id} className="hover:bg-gray-50/60 transition-colors">
                      <td className="px-6 py-3.5 font-extrabold text-gray-800">{txnId}</td>
                      <td className="px-6 py-3.5 font-extrabold text-red-500">#{order.id}</td>
                      <td className="px-6 py-3.5 font-medium text-gray-700">
                        {users.find(u => u.id === order.userId)?.name || 'Customer'}
                      </td>
                      <td className="px-6 py-3.5">
                        <span className={`inline-flex items-center gap-1 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase ${
                          order.paymentMethod === 'UPI' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                          order.paymentMethod === 'Card' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                          order.paymentMethod === 'Wallet' ? 'bg-purple-50 text-purple-700 border border-purple-200' :
                          'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>
                          {order.paymentMethod}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 font-extrabold text-gray-900">₹{order.total}</td>
                      <td className="px-6 py-3.5">
                        <span className={`inline-flex items-center gap-1 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                          order.status === 'CANCELLED' ? 'bg-rose-100 text-rose-800' :
                          order.paymentMethod === 'COD' ? 'bg-amber-100 text-amber-800' :
                          'bg-emerald-100 text-emerald-800'
                        }`}>
                          <CheckCircle size={10} />
                          {order.status === 'CANCELLED' ? 'REFUNDED / VOID' : order.paymentMethod === 'COD' ? 'COD PENDING' : 'SUCCESS / PAID'}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 text-right font-medium text-gray-500">
                        {new Date(order.createdAt).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-extrabold text-gray-900 text-base">Monthly Order Telemetry</h3>
            <span className="text-xs text-gray-400 font-medium">Last 6 Months</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={CHART_DATA}>
              <XAxis dataKey="month" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }} />
              <Bar dataKey="orders" fill="#ef4444" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-extrabold text-gray-900 text-base">Gross Revenue Trend (₹)</h3>
            <span className="text-xs text-gray-400 font-medium">Last 6 Months</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={CHART_DATA}>
              <XAxis dataKey="month" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }} />
              <Line type="monotone" dataKey="revenue" stroke="#f59e0b" strokeWidth={3} dot={{ fill: '#f59e0b', r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tables Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h3 className="font-extrabold text-gray-900 text-sm">Recent Activity Stream</h3>
            <Link to="/admin/orders" className="text-xs font-bold text-red-500 hover:underline flex items-center gap-1">
              <span>View All Orders ({allOrders.length})</span>
              <ChevronRight size={12} />
            </Link>
          </div>
          <div className="divide-y divide-gray-50 flex-1">
            {recentOrders.map(order => (
              <div key={order.id} className="px-6 py-3.5 flex items-center justify-between hover:bg-gray-50/60 transition-colors">
                <div>
                  <p className="text-xs font-extrabold text-gray-900">#{order.id}</p>
                  <p className="text-xs text-gray-500 font-medium">{order.restaurantName} · {order.items.length} items</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-extrabold text-gray-900">₹{order.total}</p>
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 inline-block mt-0.5">
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Pending Refunds */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h3 className="font-extrabold text-gray-900 text-sm">Action Pending Refund Requests</h3>
            <Link to="/admin/refunds" className="text-xs font-bold text-red-500 hover:underline flex items-center gap-1">
              <span>Manage Claims ({pendingRefundsCount})</span>
              <ChevronRight size={12} />
            </Link>
          </div>
          <div className="divide-y divide-gray-50 flex-1">
            {pendingRefundList.map(ref => (
              <div key={ref.id} className="px-6 py-3.5 flex items-center justify-between hover:bg-gray-50/60 transition-colors">
                <div>
                  <p className="text-xs font-extrabold text-gray-900">Ticket #{ref.id}</p>
                  <p className="text-xs text-gray-500 font-medium">{ref.reason} · Order #{ref.orderId}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-extrabold text-red-600">₹{ref.amount}</p>
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 inline-block mt-0.5">
                    {ref.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function AdminUsers() {
  const [search, setSearch] = useState('');

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.phone.includes(search)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">User Management Directory</h1>
          <p className="text-sm text-gray-500 font-medium mt-0.5">System user accounts, roles, addresses & order history stats.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 text-xs border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20"
            />
          </div>
          <Badge variant="info" size="md">{filteredUsers.length} Registered Accounts</Badge>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-100 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-3.5">User Profile</th>
                <th className="px-6 py-3.5">Email Contact</th>
                <th className="px-6 py-3.5">Role Access</th>
                <th className="px-6 py-3.5">Order Count</th>
                <th className="px-6 py-3.5">Default Location</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {filteredUsers.map(u => {
                const userOrdersCount = sampleOrders.filter(o => o.userId === u.id).length;
                return (
                  <tr key={u.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img src={u.avatar} alt={u.name} className="w-9 h-9 rounded-full object-cover border border-gray-200" />
                        <div>
                          <p className="font-bold text-gray-900 text-sm">{u.name}</p>
                          <p className="text-xs text-gray-500">{u.phone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600 font-medium text-xs">{u.email}</td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider ${u.role === 'ADMIN' ? 'bg-amber-100 text-amber-800 border border-amber-200' : 'bg-gray-100 text-gray-700'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs font-bold text-gray-800">{userOrdersCount} orders</td>
                    <td className="px-6 py-4 text-xs font-semibold text-gray-700">{u.addresses[0]?.city || 'Pune'}</td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-xs font-bold text-red-500 hover:underline">
                        View Details
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export function AdminRestaurants() {
  const [restaurantList, setRestaurantList] = useState(initialRestaurants);
  const [search, setSearch] = useState('');
  const toast = useToast();

  const toggleRestaurantOpen = (id: string) => {
    setRestaurantList(prev => prev.map(r => {
      if (r.id === id) {
        const nextState = !r.isOpen;
        toast.info(`${r.name} status updated to ${nextState ? 'OPEN' : 'CLOSED'}`);
        return { ...r, isOpen: nextState };
      }
      return r;
    }));
  };

  const filtered = restaurantList.filter(r =>
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    r.cuisines.some(c => c.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Food Partners Catalog</h1>
          <p className="text-sm text-gray-500 font-medium mt-0.5">Manage onboarded restaurants, live availability & platform commission rates.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search partner or cuisine..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 text-xs border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20"
            />
          </div>
          <Badge variant="success" size="md">{filtered.length} Active Partners</Badge>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-100 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-3.5">Restaurant</th>
                <th className="px-6 py-3.5">Cuisines</th>
                <th className="px-6 py-3.5">Rating</th>
                <th className="px-6 py-3.5">Avg Delivery</th>
                <th className="px-6 py-3.5">Commission Rate</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {filtered.map(r => (
                <tr key={r.id} className="hover:bg-gray-50/60 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={r.logo} alt={r.name} className="w-10 h-10 rounded-xl object-cover border border-gray-200" />
                      <div>
                        <p className="font-extrabold text-gray-900 text-sm">{r.name}</p>
                        <p className="text-xs text-gray-500">{r.address}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs font-medium text-gray-600">{r.cuisines.join(', ')}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-extrabold px-2 py-0.5 rounded-md">
                      ★ {r.rating}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs font-semibold text-gray-700">{r.deliveryTime} mins</td>
                  <td className="px-6 py-4 text-xs font-extrabold text-slate-700">18.0% Standard</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => toggleRestaurantOpen(r.id)}
                      className={`inline-flex items-center gap-1.5 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase cursor-pointer transition-all ${
                        r.isOpen ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200' : 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                      }`}
                    >
                      <Power size={11} />
                      {r.isOpen ? 'OPEN' : 'CLOSED'}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link to={`/restaurant/${r.id}`} className="text-xs font-bold text-red-500 hover:underline flex items-center justify-end gap-1">
                      <span>View Store</span>
                      <ExternalLink size={12} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export function AdminOrders() {
  const { allOrders, updateOrderStatus } = useOrders();
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [search, setSearch] = useState('');
  const toast = useToast();

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    updateOrderStatus(orderId, newStatus);
    toast.success(`Order #${orderId} status updated to ${newStatus}!`);
  };

  const filteredOrders = allOrders.filter(o => {
    const matchesStatus = statusFilter === 'ALL' || o.status === statusFilter;
    const matchesSearch =
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.restaurantName.toLowerCase().includes(search.toLowerCase()) ||
      o.items.some(i => i.name.toLowerCase().includes(search.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  const STATUS_OPTIONS: OrderStatus[] = [
    'PLACED',
    'CONFIRMED',
    'PREPARING',
    'OUT_FOR_DELIVERY',
    'DELIVERED',
    'CANCELLED',
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Platform Orders Dispatch Central</h1>
          <p className="text-sm text-gray-500 font-medium mt-0.5">Live order dispatches, status tracking, item contents & payment details.</p>
        </div>
        <Badge variant="primary" size="md">{allOrders.length} Total Executed Orders</Badge>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {['ALL', 'CONFIRMED', 'PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'].map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-full text-xs font-extrabold transition-all whitespace-nowrap ${
                statusFilter === st
                  ? 'bg-red-500 text-white shadow-xs'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {st.replace(/_/g, ' ')}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search order ID, restaurant, item..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full md:w-64 pl-9 pr-4 py-2 text-xs border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-100 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-3.5">Order Ref</th>
                <th className="px-6 py-3.5">Restaurant</th>
                <th className="px-6 py-3.5">Order Items</th>
                <th className="px-6 py-3.5">Total Amount</th>
                <th className="px-6 py-3.5">Payment Method</th>
                <th className="px-6 py-3.5">Live Status Update</th>
                <th className="px-6 py-3.5 text-right">Track</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {filteredOrders.map(o => (
                <tr key={o.id} className="hover:bg-gray-50/60 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-extrabold text-gray-900 text-xs">#{o.id}</p>
                    <p className="text-[10px] text-gray-400 font-semibold mt-0.5">
                      {new Date(o.createdAt).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-gray-900 text-xs">{o.restaurantName}</p>
                    <p className="text-[10px] text-gray-500 truncate max-w-[140px]">{o.address?.street}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-xs font-semibold text-gray-800 line-clamp-1">
                      {o.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                    </p>
                    <p className="text-[10px] text-gray-400">{o.items.length} dishes</p>
                  </td>
                  <td className="px-6 py-4 font-extrabold text-gray-900 text-xs">₹{o.total}</td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase ${
                      o.paymentMethod === 'UPI' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                      o.paymentMethod === 'Card' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                      o.paymentMethod === 'Wallet' ? 'bg-purple-50 text-purple-700 border border-purple-200' :
                      'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      {o.paymentMethod}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={o.status}
                      onChange={e => handleStatusChange(o.id, e.target.value as OrderStatus)}
                      className={`text-xs font-extrabold rounded-xl border px-3 py-1.5 cursor-pointer focus:outline-none focus:ring-2 ${
                        o.status === 'DELIVERED' ? 'bg-emerald-50 text-emerald-800 border-emerald-200 focus:ring-emerald-500/20' :
                        o.status === 'CANCELLED' ? 'bg-red-50 text-red-800 border-red-200 focus:ring-red-500/20' :
                        'bg-amber-50 text-amber-800 border-amber-200 focus:ring-amber-500/20'
                      }`}
                    >
                      {STATUS_OPTIONS.map(st => (
                        <option key={st} value={st}>
                          {st.replace(/_/g, ' ')}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link to={`/order-tracking/${o.id}`} className="text-xs font-bold text-red-500 hover:underline">
                      Live Map
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export function AdminRefunds() {
  const { refunds, updateRefundStatus } = useRefunds();
  const [filter, setFilter] = useState<string>('ALL');
  const toast = useToast();

  const handleApprove = (id: string) => {
    updateRefundStatus(id, 'APPROVED', 'Approved by administrator after verifying transaction.');
    toast.success(`Refund ticket #${id} approved successfully!`);
  };

  const handleReject = (id: string) => {
    updateRefundStatus(id, 'REJECTED', 'Rejected by administrator after review.');
    toast.error(`Refund ticket #${id} rejected.`);
  };

  const filteredRefunds = refunds.filter(r => {
    if (filter === 'ALL') return true;
    if (filter === 'PENDING') return r.status === 'PENDING' || r.status === 'UNDER_REVIEW';
    return r.status === filter;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Refund Claims & Resolution Desk</h1>
          <p className="text-sm text-gray-500 font-medium mt-0.5">Review, verify and resolve customer refund requests with one click.</p>
        </div>
        <Badge variant="warning" size="md">{refunds.length} Total Claims</Badge>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 bg-white p-3 rounded-2xl border border-gray-100 shadow-sm overflow-x-auto">
        {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
              filter === f
                ? 'bg-red-500 text-white shadow-xs'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {f === 'PENDING' ? 'Action Required' : f}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredRefunds.map(ref => (
          <div key={ref.id} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="space-y-3 flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-extrabold text-gray-900 text-base">Ticket #{ref.id}</span>
                <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2.5 py-0.5 rounded-md">Order #{ref.orderId}</span>
                <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase ${
                  ref.status === 'APPROVED' || ref.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800' :
                  ref.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                  'bg-amber-100 text-amber-800 border border-amber-200'
                }`}>
                  {ref.status}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                {ref.image && (
                  <div className="flex-shrink-0">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Customer Evidence Photo</p>
                    <a href={ref.image} target="_blank" rel="noreferrer" title="Click to open full photo">
                      <img src={ref.image} alt="Customer Evidence" className="w-28 h-28 object-cover rounded-xl border border-gray-200 shadow-2xs hover:opacity-90 transition-opacity" />
                    </a>
                  </div>
                )}

                <div className="space-y-1.5 flex-1">
                  <p className="text-xs font-extrabold text-red-600">Claimed Refund Amount: ₹{ref.amount}</p>
                  <p className="text-xs font-bold text-gray-800">Reason: {ref.reason.replace(/_/g, ' ')}</p>
                  <p className="text-xs text-gray-600 bg-gray-50 p-3 rounded-xl border border-gray-100 max-w-xl">"{ref.description}"</p>
                </div>
              </div>

              {/* AI FoodForensics Image Verification Box */}
              {ref.image && (
                <div className={`mt-3 p-3.5 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                  ref.mlVerdict === 'REAL' 
                    ? 'bg-emerald-50/80 border-emerald-200/80 text-emerald-950'
                    : ref.mlVerdict === 'AI_GENERATED' || ref.mlVerdict === 'MANIPULATED'
                    ? 'bg-rose-50/80 border-rose-200/80 text-rose-950'
                    : 'bg-amber-50/80 border-amber-200/80 text-amber-950'
                }`}>
                  <div className="flex items-start gap-2.5">
                    <div className={`mt-0.5 p-1.5 rounded-lg flex-shrink-0 ${
                      ref.mlVerdict === 'REAL' 
                        ? 'bg-emerald-600 text-white' 
                        : ref.mlVerdict === 'AI_GENERATED' || ref.mlVerdict === 'MANIPULATED'
                        ? 'bg-rose-600 text-white' 
                        : 'bg-amber-600 text-white'
                    }`}>
                      {ref.mlVerdict === 'REAL' ? (
                        <ShieldCheck size={16} />
                      ) : ref.mlVerdict === 'AI_GENERATED' || ref.mlVerdict === 'MANIPULATED' ? (
                        <ShieldAlert size={16} />
                      ) : (
                        <AlertCircle size={16} />
                      )}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-black uppercase tracking-wider">
                          AI Model Verdict: {ref.mlVerdict === 'REAL' ? 'Authentic Photo (Real Food)' : ref.mlVerdict === 'AI_GENERATED' || ref.mlVerdict === 'MANIPULATED' ? 'Flagged / Tampered Media' : 'Uncertain (Audit Needed)'}
                        </span>
                        {ref.mlManipulationProb ? (
                          <span className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-md ${
                            ref.mlVerdict === 'REAL' 
                              ? 'bg-emerald-200/80 text-emerald-950 border border-emerald-300/80' 
                              : ref.mlVerdict === 'AI_GENERATED' || ref.mlVerdict === 'MANIPULATED'
                              ? 'bg-rose-200/80 text-rose-950 border border-rose-300/80' 
                              : 'bg-amber-200/80 text-amber-950 border border-amber-300/80'
                          }`}>
                            AI Manipulation Risk: {ref.mlManipulationProb}
                          </span>
                        ) : ref.mlConfidence != null ? (
                          <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-md bg-gray-100 text-gray-800">
                            Confidence: {(ref.mlConfidence * 100).toFixed(1)}%
                          </span>
                        ) : null}
                      </div>
                      <p className="text-[11px] font-medium text-gray-600 mt-1 line-clamp-2">
                        {ref.mlReason || 'EfficientNetV2-S ONNX model processed this evidence against synthetic artifacts and photo tamper signatures.'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center flex-shrink-0">
                    <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-md border ${
                      ref.mlVerdict === 'REAL'
                        ? 'bg-emerald-100 border-emerald-300 text-emerald-800'
                        : ref.mlVerdict === 'AI_GENERATED' || ref.mlVerdict === 'MANIPULATED'
                        ? 'bg-rose-100 border-rose-300 text-rose-800'
                        : 'bg-amber-100 border-amber-300 text-amber-800'
                    }`}>
                      {ref.mlVerdict === 'REAL' ? 'AI Suggestion: Safe to Approve' : ref.mlVerdict === 'AI_GENERATED' || ref.mlVerdict === 'MANIPULATED' ? 'AI Suggestion: Reject Fraud' : 'AI Suggestion: Manual Audit'}
                    </span>
                    <a
                      href="http://localhost:8000/dashboard"
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 underline hover:no-underline"
                      title="Open full Media Audit Console"
                    >
                      Audit Console <ExternalLink size={11} />
                    </a>
                  </div>
                </div>
              )}
            </div>

            {(ref.status === 'PENDING' || ref.status === 'UNDER_REVIEW') && (
              <div className="flex items-center gap-2 flex-shrink-0 self-center md:self-start">
                <button
                  onClick={() => handleApprove(ref.id)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle size={14} /> Approve Refund
                </button>
                <button
                  onClick={() => handleReject(ref.id)}
                  className="bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
                >
                  <XCircle size={14} /> Reject Claim
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export function AdminSystemMonitor() {
  const [telemetry, setTelemetry] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'logs' | 'db_orders' | 'db_users' | 'db_refunds' | 'db_restaurants'>('logs');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const toast = useToast();
  const { reloadOrders } = useOrders();
  const { reloadRefunds } = useRefunds();

  const fetchStatus = async () => {
    try {
      const data = await fetchApi<any>('/admin/system-status');
      setTelemetry(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    if (!autoRefresh) return;
    const interval = setInterval(fetchStatus, 2000);
    return () => clearInterval(interval);
  }, [autoRefresh]);

  const handleClearLogs = async () => {
    try {
      await fetchApi('/admin/clear-logs', { method: 'POST' });
      toast.success('Live API request logs cleared');
      fetchStatus();
    } catch {
      toast.error('Failed to clear logs');
    }
  };

  const handleTriggerTestOrder = async () => {
    try {
      await fetchApi('/orders', {
        method: 'POST',
        body: JSON.stringify({
          userId: 'USR001',
          restaurantId: 'R001',
          restaurantName: 'Spice Route',
          items: [{ menuItemId: 'M004', name: 'Butter Chicken', price: 319, quantity: 2, image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&q=80' }],
          subtotal: 638,
          deliveryFee: 30,
          tax: 32,
          discount: 0,
          total: 700,
          address: { id: 'A001', label: 'Home', street: '12 Senapati Bapat Road', city: 'Pune', state: 'Maharashtra', pincode: '411016' },
          paymentMethod: 'UPI',
          notes: 'Visual Test Order Generated Live',
        }),
      });
      toast.success('⚡ Test order dispatched to backend database!');
      await reloadOrders();
      fetchStatus();
    } catch (err: any) {
      toast.error('Failed to trigger test order');
    }
  };

  const handleTriggerTestRefund = async () => {
    try {
      await fetchApi('/refunds', {
        method: 'POST',
        body: JSON.stringify({
          orderId: 'ORD001',
          userId: 'USR001',
          restaurantId: 'R001',
          amount: 700,
          reason: 'FOOD_QUALITY',
          description: 'Live test refund claim generated via Visual Backend Console.',
        }),
      });
      toast.success('⚡ Test refund claim written to database!');
      await reloadRefunds();
      fetchStatus();
    } catch (err: any) {
      toast.error('Failed to trigger test refund');
    }
  };

  const server = telemetry?.server;
  const stats = telemetry?.stats;
  const logs = telemetry?.recentLogs || [];
  const tables = telemetry?.tables || {};

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 p-6 sm:p-8 rounded-3xl text-white shadow-xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-400 font-extrabold text-[10px] uppercase tracking-wider px-3 py-1 rounded-full border border-emerald-500/30">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              Real-time Backend Node Engine & Database Monitor
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Visual Backend Operational Console</h1>
          <p className="text-xs sm:text-sm text-slate-300 font-medium mt-1">Live HTTP request log stream, SQLite database browser, server memory telemetry & event simulator.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setAutoRefresh(v => !v)}
            className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all border flex items-center gap-1.5 cursor-pointer ${
              autoRefresh ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${autoRefresh ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
            {autoRefresh ? 'Polling Live (2s)' : 'Polling Paused'}
          </button>

          <button
            onClick={fetchStatus}
            className="bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl border border-slate-700 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            Refresh Now
          </button>
        </div>
      </div>

      {/* Telemetry Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-1">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Server Status</p>
          <div className="flex items-center justify-between">
            <p className="text-xl font-extrabold text-emerald-600 flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
              {server?.status || 'ONLINE'}
            </p>
            <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md">Port {server?.port || 5001}</span>
          </div>
          <p className="text-[11px] text-gray-500 font-medium">Listening on http://localhost:{server?.port || 5001}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-1">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Server Memory Heap</p>
          <p className="text-xl font-extrabold text-indigo-600">{server?.memoryUsageMb || '42.5'} MB</p>
          <p className="text-[11px] text-gray-500 font-medium">Allocated V8 Heap Memory</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-1">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Active Database Engine</p>
          <p className="text-sm font-extrabold text-slate-800 truncate">{server?.dbEngine || 'SQLite 3 (bitehub.db)'}</p>
          <p className="text-[11px] font-medium text-emerald-600">Persistent Disk Storage Enabled</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-1">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Server Uptime</p>
          <p className="text-xl font-extrabold text-amber-600">{server?.uptimeSeconds || 0} seconds</p>
          <p className="text-[11px] text-gray-500 font-medium">Continuous operational runtime</p>
        </div>
      </div>

      {/* Action Simulators Strip */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-sm uppercase tracking-wider text-amber-400 flex items-center gap-2">
            ⚡ Visual Live Event Generator & Test Simulator
          </h3>
          <span className="text-xs text-slate-400">Click to dispatch live events directly into SQLite DB & log stream</span>
        </div>
        <div className="flex flex-wrap items-center gap-3 pt-1">
          <button
            onClick={handleTriggerTestOrder}
            className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl transition-all shadow-md cursor-pointer flex items-center gap-2"
          >
            <span>⚡ Dispatch Test Order to API</span>
          </button>
          <button
            onClick={handleTriggerTestRefund}
            className="bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl transition-all shadow-md cursor-pointer flex items-center gap-2"
          >
            <span>⚡ Create Test Refund Claim in DB</span>
          </button>
          <button
            onClick={handleClearLogs}
            className="bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold text-xs px-4 py-2.5 rounded-xl border border-slate-700 transition-all cursor-pointer"
          >
            Clear Terminal Logs
          </button>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex items-center gap-2 bg-white p-2 rounded-2xl border border-gray-100 shadow-sm overflow-x-auto">
        <button
          onClick={() => setActiveTab('logs')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'logs' ? 'bg-slate-900 text-white shadow-xs' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          ⚡ Live HTTP Log Stream ({logs.length})
        </button>
        <button
          onClick={() => setActiveTab('db_orders')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'db_orders' ? 'bg-slate-900 text-white shadow-xs' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          🗄️ Database: `orders` Table
        </button>
        <button
          onClick={() => setActiveTab('db_users')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'db_users' ? 'bg-slate-900 text-white shadow-xs' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          🗄️ Database: `users` Table
        </button>
        <button
          onClick={() => setActiveTab('db_refunds')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'db_refunds' ? 'bg-slate-900 text-white shadow-xs' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          🗄️ Database: `refunds` Table
        </button>
        <button
          onClick={() => setActiveTab('db_restaurants')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'db_restaurants' ? 'bg-slate-900 text-white shadow-xs' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          🗄️ Database: `restaurants` Table
        </button>
      </div>

      {/* Tab Content 1: Live Terminal Log Stream */}
      {activeTab === 'logs' && (
        <div className="bg-slate-950 rounded-3xl border border-slate-800 p-6 shadow-2xl space-y-4 font-mono">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-xs font-bold text-slate-400 ml-2">bitehub-express-server.log — Terminal Stream</span>
            </div>
            <span className="text-[11px] text-slate-500">{logs.length} Log Entries</span>
          </div>

          <div className="max-h-[420px] overflow-y-auto space-y-2 text-xs pr-2">
            {logs.length === 0 ? (
              <p className="text-slate-500 italic py-8 text-center font-sans">No API requests recorded yet. Make a request or click "Dispatch Test Order" above!</p>
            ) : (
              logs.map((log: any) => (
                <div key={log.id} className="flex flex-col sm:flex-row sm:items-center justify-between py-1.5 px-3 rounded-lg bg-slate-900/60 border border-slate-850 hover:bg-slate-900 transition-colors gap-2">
                  <div className="flex items-center gap-3">
                    <span className="text-slate-500 text-[10px]">{new Date(log.timestamp).toLocaleTimeString()}</span>
                    <span className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                      log.method === 'POST' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                      log.method === 'PATCH' || log.method === 'PUT' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                      log.method === 'DELETE' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                      'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    }`}>
                      {log.method}
                    </span>
                    <span className="text-slate-200 font-semibold">{log.url}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      log.statusCode < 300 ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                      log.statusCode < 400 ? 'bg-blue-950 text-blue-400 border border-blue-800' :
                      'bg-rose-950 text-rose-400 border border-rose-800'
                    }`}>
                      {log.statusCode} OK
                    </span>
                    <span className="text-slate-400 text-[10px]">{log.durationMs} ms</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Tab Content 2: Visual Database Inspector */}
      {activeTab !== 'logs' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden space-y-4">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-extrabold text-gray-900 text-sm">
              Visual Table Data: <code className="text-red-500 bg-red-50 px-2 py-0.5 rounded">{activeTab.replace('db_', '')}</code>
            </h3>
            <span className="text-xs font-bold text-gray-500">Live query result from SQLite database</span>
          </div>

          <div className="overflow-x-auto p-4">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-100 border-b border-gray-200 text-[10px] font-bold text-gray-600 uppercase">
                  {tables[activeTab.replace('db_', '')] && tables[activeTab.replace('db_', '')][0] ? (
                    Object.keys(tables[activeTab.replace('db_', '')][0]).map(key => (
                      <th key={key} className="px-4 py-2.5">{key}</th>
                    ))
                  ) : (
                    <th className="px-4 py-2.5">Records</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs">
                {tables[activeTab.replace('db_', '')] && tables[activeTab.replace('db_', '')].length > 0 ? (
                  tables[activeTab.replace('db_', '')].map((row: any, idx: number) => (
                    <tr key={idx} className="hover:bg-gray-50/80 transition-colors">
                      {Object.values(row).map((val: any, vIdx: number) => (
                        <td key={vIdx} className="px-4 py-3 max-w-xs truncate font-mono text-[11px] text-gray-800">
                          {typeof val === 'object' ? JSON.stringify(val) : String(val)}
                        </td>
                      ))}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="px-4 py-8 text-center text-gray-400 italic font-sans" colSpan={10}>
                      No records found in this table.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

