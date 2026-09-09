import { useState, type ReactNode } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingSpinner } from '@/components/ui';
import { ShieldAlert } from 'lucide-react';

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <LoadingSpinner className="min-h-screen" />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export function AdminRoute({ children }: { children: ReactNode }) {
  const { user, isLoading, login } = useAuth();
  const [switching, setSwitching] = useState(false);

  if (isLoading) return <LoadingSpinner className="min-h-screen" />;

  if (!user || user.role !== 'ADMIN') {
    const handleSwitchToAdmin = async () => {
      setSwitching(true);
      try {
        await login({ email: 'admin@example.com', password: 'Admin@123', rememberMe: true });
      } catch (err) {
        console.error(err);
      } finally {
        setSwitching(false);
      }
    };

    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-800 rounded-3xl border border-slate-700 p-8 text-center shadow-2xl space-y-6 animate-fade-in">
          <div className="w-16 h-16 bg-gradient-to-tr from-amber-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
            <ShieldAlert size={32} className="text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-white">Admin Console Gateway</h2>
            <p className="text-sm text-slate-400 mt-2">
              {user
                ? `You are currently logged in as ${user.name} (Role: ${user.role}). Accessing platform management, live orders, payments, and refunds requires Admin privileges.`
                : 'Administrator authorization is required to access system telemetry, order dispatches, payment gateways, and refunds.'}
            </p>
          </div>

          <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-700/80 text-left text-xs space-y-1.5">
            <p className="text-amber-400 font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              Demo Quick Admin Access
            </p>
            <p className="text-slate-300">Click below to instantly authenticate as <strong>Admin User (admin@example.com)</strong> and view all operational dashboards.</p>
          </div>

          <button
            onClick={handleSwitchToAdmin}
            disabled={switching}
            className="w-full bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white font-extrabold py-3.5 px-6 rounded-2xl transition-all shadow-lg hover:shadow-red-500/25 flex items-center justify-center gap-2 text-sm disabled:opacity-50"
          >
            {switching ? 'Authenticating Admin Account...' : '⚡ Switch to Admin Account & Open Dashboard'}
          </button>

          <Link to="/" className="inline-block text-xs font-semibold text-slate-400 hover:text-white transition-colors">
            ← Return to Customer Storefront
          </Link>
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

