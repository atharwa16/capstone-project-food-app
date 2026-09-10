import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, ChevronDown } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui';
import { demoCredentials } from '@/data/users';

export function LoginPage() {
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string })?.from ?? '/';

  const [form, setForm] = useState({ email: '', password: '', rememberMe: false });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showDemoCredentials, setShowDemoCredentials] = useState(false);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Please enter a valid email';
    if (!form.password) errs.password = 'Password is required';
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setIsLoading(true);
    setErrors({});
    try {
      const loggedUser = await login({ ...form });
      toast.success(`Welcome back, ${loggedUser.name}! 🎉`);
      
      const destination = from && from !== '/' && from !== '/login'
        ? from
        : (loggedUser.role === 'ADMIN' ? '/admin' : '/');

      navigate(destination, { replace: true });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Login failed. Please try again.';
      setErrors({ general: msg });
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemo = (email: string, password: string) => {
    setForm(f => ({ ...f, email, password }));
    setShowDemoCredentials(false);
  };

  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 animate-fade-in">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-extrabold text-gray-900">Sign In to BiteHub</h1>
          <p className="text-sm text-gray-500 mt-1">Order food from top restaurants or access administrative controls.</p>
        </div>

        {errors.general && (
          <div className="mb-4 p-3.5 rounded-2xl bg-red-50 border border-red-200 text-sm text-red-600 font-medium text-center" role="alert">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <Input
            label="Email Address"
            type="email"
            id="login-email"
            placeholder="name@example.com"
            value={form.email}
            onChange={e => { setForm(f => ({ ...f, email: e.target.value })); setErrors(p => ({ ...p, email: '' })); }}
            error={errors.email}
            leftIcon={<Mail size={16} className="text-gray-400" />}
            required
            autoComplete="email"
          />

          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            id="login-password"
            placeholder="Enter password"
            value={form.password}
            onChange={e => { setForm(f => ({ ...f, password: e.target.value })); setErrors(p => ({ ...p, password: '' })); }}
            error={errors.password}
            leftIcon={<Lock size={16} className="text-gray-400" />}
            rightElement={
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            }
            required
            autoComplete="current-password"
          />

          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                id="remember-me"
                checked={form.rememberMe}
                onChange={e => setForm(f => ({ ...f, rememberMe: e.target.checked }))}
                className="w-4 h-4 rounded border-gray-300 text-red-500 focus:ring-red-500/30"
              />
              <span className="text-xs text-gray-600 font-medium">Remember me</span>
            </label>
            <button type="button" className="text-xs text-red-500 hover:underline font-semibold">
              Forgot password?
            </button>
          </div>

          <Button type="submit" fullWidth isLoading={isLoading} size="lg" id="login-submit-btn" className="rounded-2xl bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white font-extrabold shadow-lg shadow-red-500/20">
            Sign In
          </Button>
        </form>

        {/* Quick Demo Login Credentials Dropdown */}
        <div className="mt-5">
          <button
            type="button"
            onClick={() => setShowDemoCredentials(v => !v)}
            className="w-full flex items-center justify-between p-3.5 rounded-2xl border border-dashed border-amber-300 bg-amber-50/70 text-xs font-bold text-amber-800 hover:bg-amber-100/60 transition-colors"
            aria-expanded={showDemoCredentials}
          >
            <span className="flex items-center gap-2">
              <span className="text-sm">🔑</span>
              <span>Click for Demo Login Credentials</span>
            </span>
            <ChevronDown size={16} className={`transition-transform text-amber-600 ${showDemoCredentials ? 'rotate-180' : ''}`} />
          </button>

          {showDemoCredentials && (
            <div className="mt-2 border border-amber-200/80 rounded-2xl overflow-hidden max-h-64 overflow-y-auto bg-amber-50/30 divide-y divide-amber-100">
              {demoCredentials.map(cred => (
                <button
                  key={cred.email}
                  type="button"
                  onClick={() => fillDemo(cred.email, cred.password)}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 hover:bg-amber-100/50 transition-colors text-left"
                >
                  <div className="overflow-hidden pr-2">
                    <p className="text-xs font-bold text-gray-900 truncate">{cred.name}</p>
                    <p className="text-[11px] text-gray-500 truncate">{cred.email}</p>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider flex-shrink-0 ${
                    cred.role === 'ADMIN'
                      ? 'bg-amber-500 text-white shadow-2xs'
                      : 'bg-gray-200 text-gray-700'
                  }`}>
                    {cred.role}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        <p className="text-center text-xs text-gray-500 mt-6 font-medium">
          Don't have an account?{' '}
          <Link to="/signup" className="text-red-500 font-bold hover:underline">Create an account</Link>
        </p>
      </div>
    </div>
  );
}
