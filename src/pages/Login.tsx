import React, { useState, useEffect, useRef } from 'react';
import {
  Compass,
  GraduationCap,
  Briefcase,
  School,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Loader2,
  Sparkles,
} from 'lucide-react';
import { LoginForm } from '../components/LoginForm';
import { DemoAccounts } from '../components/DemoAccounts';
import { AuthRole, AuthSession } from '../auth/authTypes';
import { AuthService } from '../auth/authService';
import { SkillgapCompassLogo, SkillgapCompassEmblem } from '../components/SkillgapCompassLogo';
import { useNotification } from '../context/NotificationContext';

interface LoginProps {
  onLoginSuccess: (session: AuthSession) => void;
  initialRole?: AuthRole;
  onCancel?: () => void;
}

export const Login: React.FC<LoginProps> = ({
  onLoginSuccess,
  initialRole = 'student',
  onCancel,
}) => {
  const notify = useNotification();
  const [selectedPreset, setSelectedPreset] = useState<{
    registerNumber: string;
    role: AuthRole;
  } | null>({
    registerNumber: '23CSE001',
    role: initialRole,
  });

  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authType, setAuthType] = useState<'signin' | 'demo'>('signin');
  const [loadingMessage, setLoadingMessage] = useState('Verifying credentials...');
  const [authSuccess, setAuthSuccess] = useState(false);
  const [externalError, setExternalError] = useState<string | null>(null);

  const timerRefs = useRef<NodeJS.Timeout[]>([]);

  const clearAllTimers = () => {
    timerRefs.current.forEach((t) => clearTimeout(t));
    timerRefs.current = [];
  };

  useEffect(() => {
    return () => clearAllTimers();
  }, []);

  const handleAccountPick = (registerNumber: string, role: AuthRole) => {
    setSelectedPreset({ registerNumber, role });
    setExternalError(null);
  };

  const handleAuthStart = (
    type: 'signin' | 'demo',
    registerNumber: string,
    password: string,
    role: AuthRole
  ) => {
    clearAllTimers();
    setIsAuthenticating(true);
    setAuthType(type);
    setAuthSuccess(false);
    setExternalError(null);

    // Initial message
    if (type === 'demo') {
      setLoadingMessage('Initializing 1-Click Demo student sandbox...');
    } else {
      setLoadingMessage(`Connecting to Institutional Directory for ${registerNumber}...`);
    }

    // Step 1: Simulated verification step for realistic perceived performance
    const t1 = setTimeout(() => {
      if (type === 'demo') {
        setLoadingMessage('Loading profile credentials for Ajay (23CSE001)...');
      } else {
        setLoadingMessage(`Verifying ${registerNumber} credentials with college directory...`);
      }
    }, 320);

    // Step 2: Preparing competency profile & roadmap
    const t2 = setTimeout(() => {
      setLoadingMessage('Compiling verified competencies and active career roadmap...');
    }, 650);

    // Step 3: Execute authentication verification
    const t3 = setTimeout(() => {
      let result;
      if (type === 'demo') {
        result = AuthService.loginAsDemo('23CSE001');
      } else {
        result = AuthService.login(registerNumber, password, role);
      }

      if (result.success && result.session) {
        setAuthSuccess(true);
        setLoadingMessage(`Welcome, ${result.session.name}! Opening ${role.toUpperCase()} workspace...`);
        notify.success('Login Successful', `Welcome back, ${result.session.name}.`);

        // Step 4: Smooth transition to the app
        const t4 = setTimeout(() => {
          setIsAuthenticating(false);
          onLoginSuccess(result.session!);
        }, 400);
        timerRefs.current.push(t4);
      } else {
        setIsAuthenticating(false);
        setAuthSuccess(false);
        notify.error('Login Failed', 'Invalid Register ID, password or role.');
        setExternalError(result.error || 'Authentication failed. Please check your credentials.');
      }
    }, 950);

    timerRefs.current.push(t1, t2, t3);
  };

  return (
    <div className="min-h-[85vh] flex flex-col justify-center py-6 px-3 sm:px-6 animate-fadeIn">
      {/* Optional Cancel/Back Button */}
      {onCancel && (
        <div className="max-w-xl mx-auto w-full mb-3 flex justify-start">
          <button
            onClick={onCancel}
            disabled={isAuthenticating}
            className="text-xs text-slate-500 hover:text-slate-800 font-medium flex items-center gap-1.5 px-2 py-1 rounded-lg hover:bg-slate-100 transition cursor-pointer disabled:opacity-40"
          >
            <span>← Back to Overview</span>
          </button>
        </div>
      )}

      {/* Top Branding Section with Official Logo */}
      <div className="text-center max-w-xl mx-auto mb-6">
        <SkillgapCompassLogo variant="full" size="xl" showTagline={true} />
        <p className="text-xs font-semibold text-slate-500 mt-2">
          Institutional Skill-Gap Intelligence & Placement Platform
        </p>
      </div>

      {/* Main Login Card with Loading Overlay */}
      <div className="relative max-w-xl w-full mx-auto bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6 overflow-hidden">
        {/* Smooth Authentication Loading Overlay */}
        {isAuthenticating && (
          <div
            id="login-loading-overlay"
            role="status"
            aria-live="polite"
            className="absolute inset-0 z-30 bg-white/95 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center animate-fadeIn"
          >
            <div className="max-w-xs w-full space-y-4">
              <div className="relative w-14 h-14 mx-auto flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-3 border-orange-100 border-t-[#F97316] animate-spin" />
                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center shadow-xs">
                  {authSuccess ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  ) : (
                    <SkillgapCompassEmblem className="w-7 h-7" />
                  )}
                </div>
              </div>

              <div className="space-y-1">
                <h3 className="text-sm font-bold text-slate-900">
                  {authSuccess ? 'Authentication Successful' : 'Authenticating...'}
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  {loadingMessage}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* The Auth Form */}
        <LoginForm
          onLoginSuccess={onLoginSuccess}
          selectedAccountPreset={selectedPreset}
          onAuthStart={handleAuthStart}
          isAuthenticating={isAuthenticating}
          externalError={externalError}
          onClearExternalError={() => setExternalError(null)}
        />

        {/* Demo Accounts Panel */}
        <DemoAccounts onSelectAccount={handleAccountPick} />
      </div>

      {/* Institutional Security Footer */}
      <div className="text-center mt-6 text-xs text-slate-400 max-w-md mx-auto flex items-center justify-center gap-2">
        <ShieldCheck className="w-4 h-4 text-slate-400" />
        <span>Enterprise Academic Single-Sign-On • Protected by College Directory</span>
      </div>
    </div>
  );
};

