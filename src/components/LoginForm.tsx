import React, { useState } from 'react';
import {
  KeyRound,
  IdCard,
  Eye,
  EyeOff,
  LogIn,
  Sparkles,
  HelpCircle,
  AlertCircle,
  CheckCircle2,
  X,
  Loader2,
} from 'lucide-react';
import { RoleSelector } from './RoleSelector';
import { AuthRole, AuthSession } from '../auth/authTypes';
import { AuthService } from '../auth/authService';
import { COMMON_DEMO_PASSWORD } from '../auth/demoAccounts';
import { useNotification } from '../context/NotificationContext';

interface LoginFormProps {
  onLoginSuccess: (session: AuthSession) => void;
  selectedAccountPreset?: { registerNumber: string; role: AuthRole } | null;
  onAuthStart?: (
    type: 'signin' | 'demo',
    registerNumber: string,
    password: string,
    role: AuthRole
  ) => void;
  isAuthenticating?: boolean;
  externalError?: string | null;
  onClearExternalError?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onLoginSuccess,
  selectedAccountPreset,
  onAuthStart,
  isAuthenticating = false,
  externalError = null,
  onClearExternalError,
}) => {
  const notify = useNotification();
  const [registerNumber, setRegisterNumber] = useState(
    selectedAccountPreset?.registerNumber || '23CSE001'
  );
  const [password, setPassword] = useState(COMMON_DEMO_PASSWORD);
  const [role, setRole] = useState<AuthRole>(selectedAccountPreset?.role || 'student');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);

  const effectiveLoading = isLoading || isAuthenticating;
  const activeError = errorMessage || externalError;

  // Sync if parent passes selected preset
  React.useEffect(() => {
    if (selectedAccountPreset) {
      setRegisterNumber(selectedAccountPreset.registerNumber);
      setRole(selectedAccountPreset.role);
      setPassword(COMMON_DEMO_PASSWORD);
      setErrorMessage(null);
      onClearExternalError?.();
    }
  }, [selectedAccountPreset, onClearExternalError]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    onClearExternalError?.();

    if (!registerNumber.trim()) {
      notify.warning('Register ID Required', 'Please enter your Register ID.');
      setErrorMessage('Register ID is required');
      return;
    }
    if (!password) {
      notify.warning('Password Required', 'Please enter your password.');
      setErrorMessage('Password is required');
      return;
    }
    if (!role) {
      notify.warning('Role Required', 'Please select your role.');
      setErrorMessage('Please select a role');
      return;
    }

    if (onAuthStart) {
      onAuthStart('signin', registerNumber, password, role);
      return;
    }

    setIsLoading(true);

    // Give subtle feedback for realism
    setTimeout(() => {
      const result = AuthService.login(registerNumber, password, role);
      setIsLoading(false);

      if (result.success && result.session) {
        notify.success('Login Successful', `Welcome back, ${result.session.name}.`);
        onLoginSuccess(result.session);
      } else {
        notify.error('Login Failed', 'Invalid Register ID, password or role.');
        setErrorMessage(result.error || 'Invalid login details. Please check your Register ID, password and role.');
      }
    }, 400);
  };

  const handleUseDemoAccount = () => {
    setRegisterNumber('23CSE001');
    setPassword(COMMON_DEMO_PASSWORD);
    setRole('student');
    setErrorMessage(null);
    onClearExternalError?.();
  };

  return (
    <div className="space-y-5">
      {/* Error Notice */}
      {activeError && (
        <div
          role="alert"
          className="p-3.5 bg-rose-50 border border-rose-300 rounded-xl text-rose-900 text-xs font-semibold flex items-start gap-2.5 animate-in fade-in"
        >
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span>{activeError}</span>
          </div>
          <button
            type="button"
            onClick={() => {
              setErrorMessage(null);
              onClearExternalError?.();
            }}
            className="text-rose-500 hover:text-rose-800 p-0.5 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Role Selector */}
        <RoleSelector
          selectedRole={role}
          onChangeRole={(newRole) => {
            setRole(newRole);
            setErrorMessage(null);
            onClearExternalError?.();
          }}
          disabled={effectiveLoading}
        />

        {/* Register ID Input */}
        <div className="space-y-1.5">
          <label
            htmlFor="college-reg-number"
            className="text-xs font-bold text-slate-700 flex items-center justify-between"
          >
            <span>Register ID</span>
            <span className="text-[11px] font-normal text-slate-400">
              e.g. 23CSE001, STAFF001, ADMIN001
            </span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <IdCard className="w-4 h-4" />
            </div>
            <input
              id="college-reg-number"
              type="text"
              disabled={effectiveLoading}
              value={registerNumber}
              onChange={(e) => {
                setRegisterNumber(e.target.value.toUpperCase());
                setErrorMessage(null);
                onClearExternalError?.();
              }}
              placeholder="Enter your Register ID (e.g. 23CSE001)"
              className="w-full pl-9 pr-3 py-2.5 bg-white rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 font-mono transition disabled:bg-slate-50 disabled:text-slate-500"
            />
          </div>
        </div>

        {/* Password Input */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label
              htmlFor="college-password"
              className="text-xs font-bold text-slate-700"
            >
              Password
            </label>
            <button
              type="button"
              disabled={effectiveLoading}
              onClick={() => setShowForgotPasswordModal(true)}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold cursor-pointer disabled:opacity-50"
            >
              Forgot Password?
            </button>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <KeyRound className="w-4 h-4" />
            </div>
            <input
              id="college-password"
              type={showPassword ? 'text' : 'password'}
              disabled={effectiveLoading}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setErrorMessage(null);
                onClearExternalError?.();
              }}
              placeholder="Enter your Password"
              className="w-full pl-9 pr-10 py-2.5 bg-white rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 transition disabled:bg-slate-50 disabled:text-slate-500"
            />
            <button
              type="button"
              disabled={effectiveLoading}
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer disabled:opacity-50"
              title={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Buttons */}
        <div className="pt-2 space-y-2">
          <button
            type="submit"
            disabled={effectiveLoading}
            id="college-signin-submit"
            className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold text-sm shadow-sm hover:shadow flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {effectiveLoading ? (
              <Loader2 className="w-4 h-4 animate-spin text-white" />
            ) : (
              <LogIn className="w-4 h-4" />
            )}
            <span>{effectiveLoading ? 'Authenticating...' : 'Login'}</span>
          </button>

          {/* Optional secondary action: Use Demo Account */}
          <button
            type="button"
            onClick={handleUseDemoAccount}
            disabled={effectiveLoading}
            id="college-try-demo-btn"
            className="w-full py-2.5 px-4 rounded-xl bg-slate-50 hover:bg-slate-100 active:bg-slate-200 text-slate-700 font-semibold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer border border-slate-200 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Use Demo Account</span>
          </button>
        </div>
      </form>

      {/* Forgot Password Modal */}
      {showForgotPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
              <HelpCircle className="w-6 h-6" />
            </div>
            <div className="text-center space-y-2">
              <h4 className="text-base font-bold text-slate-900">
                Password Reset Assistance
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Please contact your college administrator to reset your password.
              </p>
              <div className="p-3 bg-slate-50 rounded-xl text-left text-[11px] text-slate-500 border border-slate-200">
                <strong>Institution IT Helpdesk:</strong> it-support@college.edu
                <br />
                <strong>For Demo Accounts:</strong> Use the common password{' '}
                <span className="font-mono font-bold text-slate-800">{COMMON_DEMO_PASSWORD}</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowForgotPasswordModal(false)}
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition cursor-pointer"
            >
              Got it, close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
