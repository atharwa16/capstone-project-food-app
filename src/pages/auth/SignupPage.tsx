import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, Phone } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui';

export function SignupPage() {
  const { signup } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = 'Full name is required';
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Please enter a valid email';
    if (!form.phone.trim()) errs.phone = 'Phone number is required';
    else if (!/^\+?[\d\s-]{8,}$/.test(form.phone)) errs.phone = 'Please enter a valid phone number';
    if (!form.password) errs.password = 'Password is required';
    else if (form.password.length < 6) errs.password = 'Password must be at least 6 characters';
    if (!form.confirmPassword) errs.confirmPassword = 'Please confirm your password';
    else if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setIsLoading(true);
    setErrors({});
    try {
      await signup(form);
      toast.success('Account created successfully! Welcome to BiteAI 🎉');
      navigate('/', { replace: true });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Signup failed. Please try again.';
      setErrors({ general: msg });
    } finally {
      setIsLoading(false);
    }
  };

  const update = (field: string, value: string) => {
    setForm(f => ({ ...f, [field]: value }));
    setErrors(p => ({ ...p, [field]: '' }));
  };

  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-2xl shadow-elevated border border-gray-100 p-8">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Create an account</h1>
          <p className="text-sm text-gray-500 mt-1">Join BiteAI and start your food journey.</p>
        </div>

        {errors.general && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600" role="alert">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <Input
            label="Full name"
            type="text"
            id="signup-name"
            placeholder="Your full name"
            value={form.name}
            onChange={e => update('name', e.target.value)}
            error={errors.name}
            leftIcon={<User size={16} />}
            required
            autoComplete="name"
          />
          <Input
            label="Email address"
            type="email"
            id="signup-email"
            placeholder="you@example.com"
            value={form.email}
            onChange={e => update('email', e.target.value)}
            error={errors.email}
            leftIcon={<Mail size={16} />}
            required
            autoComplete="email"
          />
          <Input
            label="Phone number"
            type="tel"
            id="signup-phone"
            placeholder="+91 98765 43210"
            value={form.phone}
            onChange={e => update('phone', e.target.value)}
            error={errors.phone}
            leftIcon={<Phone size={16} />}
            required
            autoComplete="tel"
          />
          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            id="signup-password"
            placeholder="Min. 6 characters"
            value={form.password}
            onChange={e => update('password', e.target.value)}
            error={errors.password}
            leftIcon={<Lock size={16} />}
            rightElement={
              <button type="button" onClick={() => setShowPassword(v => !v)} className="text-gray-400 hover:text-gray-600" aria-label={showPassword ? 'Hide' : 'Show'}>
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            }
            required
            autoComplete="new-password"
          />
          <Input
            label="Confirm password"
            type={showConfirm ? 'text' : 'password'}
            id="signup-confirm-password"
            placeholder="Re-enter your password"
            value={form.confirmPassword}
            onChange={e => update('confirmPassword', e.target.value)}
            error={errors.confirmPassword}
            leftIcon={<Lock size={16} />}
            rightElement={
              <button type="button" onClick={() => setShowConfirm(v => !v)} className="text-gray-400 hover:text-gray-600" aria-label={showConfirm ? 'Hide' : 'Show'}>
                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            }
            required
            autoComplete="new-password"
          />

          <Button type="submit" fullWidth isLoading={isLoading} size="lg" id="signup-submit-btn">
            Create Account
          </Button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-primary font-semibold hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
