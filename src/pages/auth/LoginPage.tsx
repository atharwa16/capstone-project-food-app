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
      await login({ ...form });
      toast.success('Welcome back! 🎉');
      navigate(from, { replace: true });
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
      <div className="bg-white rounded-2xl shadow-elevated border border-gray-100 p-8">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
          <p className="text-sm text-gray-500 mt-1">Sign in to continue your food journey.</p>
        </div>

        {errors.general && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600" role="alert">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <Input
            label="Email address"
            type="email"
            id="login-email"
            placeholder="you@example.com"
            value={form.email}
            onChange={e => { setForm(f => ({ ...f, email: e.target.value })); setErrors(p => ({ ...p, email: '' })); }}
            error={errors.email}
            leftIcon={<Mail size={16} />}
            required
            autoComplete="email"
          />

          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            id="login-password"
            placeholder="Enter your password"
            value={form.password}
            onChange={e => { setForm(f => ({ ...f, password: e.target.value })); setErrors(p => ({ ...p, password: '' })); }}
            error={errors.password}
            leftIcon={<Lock size={16} />}
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

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                id="remember-me"
                checked={form.rememberMe}
                onChange={e => setForm(f => ({ ...f, rememberMe: e.target.checked }))}
                className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary/30"
              />
              <span className="text-sm text-gray-600">Remember me</span>
            </label>
            <button type="button" className="text-sm text-primary hover:underline font-medium">
              Forgot password?
            </button>
          </div>

          <Button type="submit" fullWidth isLoading={isLoading} size="lg" id="login-submit-btn">
            Sign In
          </Button>
        </form>

        {/* Demo Credentials */}
        <div className="mt-4">
          <button
            type="button"
            onClick={() => setShowDemoCredentials(v => !v)}
            className="w-full flex items-center justify-between p-3 rounded-lg border border-dashed border-amber-300 bg-amber-50/50 text-sm text-amber-700 hover:bg-amber-50 transition-colors"
            aria-expanded={showDemoCredentials}
          >
            <span className="font-medium">📋 Demo Credentials</span>
            <ChevronDown size={16} className={`transition-transform ${showDemoCredentials ? 'rotate-180' : ''}`} />
          </button>
          {showDemoCredentials && (
            <div className="mt-2 border border-amber-200 rounded-lg overflow-hidden max-h-60 overflow-y-auto">
              {demoCredentials.map(cred => (
                <button
                  key={cred.email}
                  type="button"
                  onClick={() => fillDemo(cred.email, cred.password)}
                  className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-amber-50 transition-colors text-left border-b border-amber-100 last:border-0"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-800">{cred.name}</p>
                    <p className="text-xs text-gray-500">{cred.email}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${cred.role === 'ADMIN' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600'}`}>
                    {cred.role}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        <p className="text-center text-sm text-gray-600 mt-4">
          Don't have an account?{' '}
          <Link to="/signup" className="text-primary font-semibold hover:underline">Create one</Link>
        </p>
      </div>
    </div>
  );
}
