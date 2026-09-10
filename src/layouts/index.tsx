import type { ReactNode } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Header, MobileBottomNav } from '@/components/layout/Header';
import { LayoutDashboard, Users, UtensilsCrossed, Package, RotateCcw, LogOut, ArrowLeft, ShieldAlert, Activity } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import clsx from 'clsx';

export function MainLayout() {
  const { user } = useAuth();

  return (
    <div className="flex flex-col min-h-screen bg-[#faf9f7]">
      <Header />
      <main className="flex-1 pb-16 md:pb-0">
        <Outlet />
      </main>
      <footer className="hidden md:block bg-white border-t border-gray-100 mt-auto">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-xs">
                <UtensilsCrossed size={16} className="text-white" />
              </div>
              <span className="font-extrabold text-gray-900 text-lg">Bite<span className="text-red-500">Hub</span></span>
            </div>
            <p className="text-xs font-medium text-gray-400">© 2026 BiteHub · Food Delivery Platform. Fictional data for demonstration.</p>
            <div className="flex items-center gap-6 text-xs font-semibold text-gray-600">
              <Link to="/restaurants" className="hover:text-red-500 transition-colors">Restaurants</Link>
              <Link to="/orders" className="hover:text-red-500 transition-colors">My Orders</Link>
              <Link to="/favorites" className="hover:text-red-500 transition-colors">Favorites</Link>
              {user?.role === 'ADMIN' && (
                <Link to="/admin" className="text-amber-600 hover:text-amber-700 transition-colors flex items-center gap-1">
                  <ShieldAlert size={12} /> Admin Panel
                </Link>
              )}
            </div>
          </div>
        </div>
      </footer>
      <MobileBottomNav />
    </div>
  );
}

export function AuthLayout({ children }: { children?: ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-rose-950 flex flex-col justify-between p-4">
      <div className="flex flex-col items-center justify-center flex-1 px-4 py-8">
        <Link to="/" className="flex items-center gap-2.5 mb-8 group">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
            <UtensilsCrossed size={22} className="text-white" />
          </div>
          <span className="font-extrabold text-white text-3xl tracking-tight">Bite<span className="text-red-500">Hub</span></span>
        </Link>
        <Outlet />
        {children}
      </div>
      <p className="text-center text-xs font-medium text-slate-400 pb-2">
        © 2026 BiteHub · Food Delivery App · Built with React & TypeScript
      </p>
    </div>
  );
}

const adminNavItems = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', exact: true },
  { to: '/admin/system-monitor', icon: Activity, label: 'Visual Backend' },
  { to: '/admin/users', icon: Users, label: 'Users' },
  { to: '/admin/restaurants', icon: UtensilsCrossed, label: 'Restaurants' },
  { to: '/admin/orders', icon: Package, label: 'Orders' },
  { to: '/admin/refunds', icon: RotateCcw, label: 'Refunds' },
];

export function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-slate-900 text-white flex-shrink-0 flex flex-col border-r border-slate-800">
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-sm">
              <UtensilsCrossed size={16} className="text-white" />
            </div>
            <span className="font-extrabold text-white text-lg tracking-tight">
              Bite<span className="text-red-500">Hub</span> <span className="text-[10px] uppercase tracking-wider bg-red-500/20 text-red-400 font-bold px-2 py-0.5 rounded-full ml-1 border border-red-500/30">Admin</span>
            </span>
          </Link>
        </div>

        {/* User Card */}
        <div className="p-4 mx-3 my-3 bg-slate-800/60 rounded-xl border border-slate-700/50 flex items-center gap-3">
          <img src={user?.avatar} alt={user?.name} className="w-9 h-9 rounded-full object-cover border border-slate-600" />
          <div className="overflow-hidden">
            <p className="text-xs font-bold text-white truncate">{user?.name}</p>
            <p className="text-[10px] text-amber-400 font-semibold uppercase tracking-wider">Super Administrator</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-2 space-y-1">
          {adminNavItems.map(item => {
            const Icon = item.icon;
            const isActive = item.exact
              ? location.pathname === item.to
              : location.pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={clsx(
                  'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-150',
                  isActive
                    ? 'bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-md'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white',
                )}
              >
                <Icon size={18} aria-hidden="true" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer Actions */}
        <div className="p-3 border-t border-slate-800/80 space-y-1">
          <Link
            to="/"
            className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Back to Storefront</span>
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-red-400 hover:bg-red-500/10 transition-colors w-full text-left"
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-auto p-4 sm:p-6 md:p-8">
        <Outlet />
      </main>
    </div>
  );
}
