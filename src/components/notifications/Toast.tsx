import React, { useEffect, useState } from 'react';
import {
  CheckCircle2,
  Info,
  AlertTriangle,
  AlertCircle,
  Trophy,
  X,
  ArrowRight,
} from 'lucide-react';
import { ToastItem } from '../../types/notifications';

interface ToastProps {
  toast: ToastItem;
  onDismiss: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onDismiss }) => {
  const { id, type, title, message, action, duration = 3500 } = toast;
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (duration <= 0) return;

    const interval = 50;
    const step = (interval / duration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev <= step) {
          clearInterval(timer);
          return 0;
        }
        return prev - step;
      });
    }, interval);

    const dismissTimeout = setTimeout(() => {
      onDismiss(id);
    }, duration);

    return () => {
      clearInterval(timer);
      clearTimeout(dismissTimeout);
    };
  }, [id, duration, onDismiss]);

  // Style configurations
  const config = {
    success: {
      border: 'border-emerald-200 bg-white shadow-lg shadow-emerald-950/5',
      accentBg: 'bg-emerald-50 text-emerald-600',
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-600" />,
      progressBar: 'bg-emerald-500',
      role: 'status' as const,
      ariaLive: 'polite' as const,
    },
    info: {
      border: 'border-indigo-200 bg-white shadow-lg shadow-indigo-950/5',
      accentBg: 'bg-indigo-50 text-indigo-600',
      icon: <Info className="w-4 h-4 text-indigo-600" />,
      progressBar: 'bg-indigo-500',
      role: 'status' as const,
      ariaLive: 'polite' as const,
    },
    warning: {
      border: 'border-amber-200 bg-white shadow-lg shadow-amber-950/5',
      accentBg: 'bg-amber-50 text-amber-600',
      icon: <AlertTriangle className="w-4 h-4 text-amber-600" />,
      progressBar: 'bg-amber-500',
      role: 'alert' as const,
      ariaLive: 'assertive' as const,
    },
    error: {
      border: 'border-rose-200 bg-white shadow-lg shadow-rose-950/5',
      accentBg: 'bg-rose-50 text-rose-600',
      icon: <AlertCircle className="w-4 h-4 text-rose-600" />,
      progressBar: 'bg-rose-500',
      role: 'alert' as const,
      ariaLive: 'assertive' as const,
    },
    achievement: {
      border: 'border-amber-300 bg-gradient-to-r from-amber-50/60 via-white to-orange-50/30 shadow-xl shadow-amber-900/10',
      accentBg: 'bg-amber-100 text-amber-700',
      icon: <Trophy className="w-4 h-4 text-amber-600" />,
      progressBar: 'bg-gradient-to-r from-amber-500 to-orange-500',
      role: 'status' as const,
      ariaLive: 'polite' as const,
    },
  }[type];

  return (
    <div
      role={config.role}
      aria-live={config.ariaLive}
      className={`relative overflow-hidden w-full max-w-sm sm:max-w-md rounded-2xl border p-4 transition-all duration-200 animate-in fade-in slide-in-from-top-3 ${config.border}`}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div
          className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center ${config.accentBg}`}
        >
          {config.icon}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 pr-1">
          <div className="flex items-center justify-between gap-2">
            <h4 className="text-xs font-bold text-slate-900 tracking-tight leading-snug truncate">
              {title}
            </h4>
          </div>

          <p className="text-xs text-slate-600 mt-1 leading-relaxed break-words">
            {message}
          </p>

          {/* Action button if provided */}
          {action && (
            <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  action.onClick();
                  onDismiss(id);
                }}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  action.primary || type === 'achievement'
                    ? 'bg-slate-900 hover:bg-slate-800 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                }`}
              >
                <span>{action.label}</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>

        {/* Close Button */}
        <button
          type="button"
          onClick={() => onDismiss(id)}
          aria-label="Dismiss notification"
          className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors shrink-0 -mr-1 -mt-1 cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Countdown Progress Bar */}
      {duration > 0 && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-100">
          <div
            className={`h-full transition-all linear duration-75 ${config.progressBar}`}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
};
