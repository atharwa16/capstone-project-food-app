import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

interface ToastContextValue {
  toasts: Toast[];
  toast: {
    success: (msg: string, duration?: number) => void;
    error: (msg: string, duration?: number) => void;
    warning: (msg: string, duration?: number) => void;
    info: (msg: string, duration?: number) => void;
  };
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

let toastIdCounter = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const addToast = useCallback((type: ToastType, message: string, duration = 4000) => {
    const id = `toast-${++toastIdCounter}`;
    setToasts(prev => [...prev, { id, type, message, duration }]);
    setTimeout(() => dismiss(id), duration);
  }, [dismiss]);

  const toast = {
    success: (msg: string, dur?: number) => addToast('success', msg, dur),
    error: (msg: string, dur?: number) => addToast('error', msg, dur),
    warning: (msg: string, dur?: number) => addToast('warning', msg, dur),
    info: (msg: string, dur?: number) => addToast('info', msg, dur),
  };

  return (
    <ToastContext.Provider value={{ toasts, toast, dismiss }}>
      {children}
      <ToastContainer toasts={toasts} dismiss={dismiss} />
    </ToastContext.Provider>
  );
}

function ToastContainer({ toasts, dismiss }: { toasts: Toast[]; dismiss: (id: string) => void }) {
  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 max-w-sm w-full"
      role="region"
      aria-label="Notifications"
      aria-live="polite"
    >
      {toasts.map(t => (
        <ToastItem key={t.id} toast={t} onDismiss={() => dismiss(t.id)} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: () => void }) {
  const configs = {
    success: { icon: CheckCircle, bg: 'bg-white border-l-4 border-green-500', iconCls: 'text-green-500' },
    error: { icon: XCircle, bg: 'bg-white border-l-4 border-red-500', iconCls: 'text-red-500' },
    warning: { icon: AlertCircle, bg: 'bg-white border-l-4 border-amber-500', iconCls: 'text-amber-500' },
    info: { icon: Info, bg: 'bg-white border-l-4 border-blue-500', iconCls: 'text-blue-500' },
  };
  const { icon: Icon, bg, iconCls } = configs[toast.type];

  return (
    <div className={`${bg} rounded-lg shadow-elevated p-4 flex items-start gap-3 animate-slide-in-right`}>
      <Icon size={20} className={`${iconCls} flex-shrink-0 mt-0.5`} aria-hidden="true" />
      <p className="text-sm text-gray-800 flex-1 font-medium">{toast.message}</p>
      <button onClick={onDismiss} className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0" aria-label="Dismiss notification">
        <X size={16} />
      </button>
    </div>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx.toast;
}
