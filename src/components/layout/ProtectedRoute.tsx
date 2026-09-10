import { type ReactNode } from 'react';
import { Navigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingSpinner } from '@/components/ui';
import { ShieldAlert, ArrowLeft, LogOut } from 'lucide-react';

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) return <LoadingSpinner className="min-h-screen" />;
  if (!isAuthenticated) return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  return <>{children}</>;
}

export function AdminRoute({ children }: { children: ReactNode }) {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const location = useLocation();

  if (isLoading) return <LoadingSpinner className="min-h-screen" />;

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (user?.role !== 'ADMIN') {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-800 rounded-3xl border border-slate-700 p-8 text-center shadow-2xl space-y-6 animate-fade-in">
          <div className="w-16 h-16 bg-red-500/20 border border-red-500/30 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
            <ShieldAlert size={32} className="text-red-400" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-white">Access Restricted</h2>
            <p className="text-sm text-slate-400 mt-2">
              Administrator privileges are required to view the BiteHub Admin Console and System Monitor.
            </p>
          </div>

          <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-700 text-left text-xs space-y-1">
            <p className="text-slate-400">Current Account:</p>
            <p className="text-white font-bold truncate">{user?.name} ({user?.email})</p>
            <p className="text-amber-400 font-semibold mt-1">Role: {user?.role || 'USER'} (Non-Administrator)</p>
          </div>

          <div className="space-y-3 pt-2">
            <Link
              to="/"
              className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-4 rounded-2xl transition-all shadow-md flex items-center justify-center gap-2 text-sm"
            >
              <ArrowLeft size={16} />
              Return to Storefront
            </Link>

            <button
              onClick={() => logout()}
              className="w-full bg-slate-700 hover:bg-slate-600 text-slate-200 font-semibold py-2.5 px-4 rounded-2xl transition-all flex items-center justify-center gap-2 text-xs"
            >
              <LogOut size={14} />
              Sign Out & Switch Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

export function GuestRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <LoadingSpinner className="min-h-screen" />;
  if (isAuthenticated) return <Navigate to="/" replace />;
  return <>{children}</>;
}


