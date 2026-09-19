import React, { useState } from 'react';
import {
  Sparkles,
  KeyRound,
  GraduationCap,
  Briefcase,
  School,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Copy,
} from 'lucide-react';
import {
  COMMON_DEMO_PASSWORD,
  DEMO_STUDENT_ACCOUNTS,
  DEMO_STAFF_ACCOUNTS,
  DEMO_CAMPUS_ACCOUNTS,
} from '../auth/demoAccounts';
import { AuthRole } from '../auth/authTypes';

interface DemoAccountsProps {
  onSelectAccount: (registerNumber: string, role: AuthRole) => void;
}

export const DemoAccounts: React.FC<DemoAccountsProps> = ({ onSelectAccount }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  return (
    <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4 space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
            <Sparkles className="w-3.5 h-3.5" />
          </span>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
            Demo Accounts (Hackathon Sandbox)
          </span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-200 text-amber-900">
            Demo Mode
          </span>
        </div>

        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
        >
          <span>{isExpanded ? 'Hide All 15 Demo Logins' : 'View All Demo Logins'}</span>
          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      <p className="text-xs text-slate-600 leading-relaxed">
        Common Password for all demo accounts:{' '}
        <code
          onClick={() => handleCopy(COMMON_DEMO_PASSWORD, 'pwd')}
          title="Click to copy password"
          className="font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-300 cursor-pointer hover:bg-amber-50 transition"
        >
          {COMMON_DEMO_PASSWORD}
        </code>{' '}
        {copiedKey === 'pwd' && (
          <span className="text-[11px] font-bold text-emerald-600 ml-1">Copied!</span>
        )}
      </p>

      {/* Quick Select Buttons for the 3 Primary Personas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        <button
          type="button"
          onClick={() => onSelectAccount('23CSE001', 'student')}
          className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200 hover:border-indigo-500 hover:bg-indigo-50/20 text-left transition shadow-2xs group cursor-pointer"
        >
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
              <GraduationCap className="w-4 h-4 text-indigo-600" />
              <span>Student Demo</span>
            </div>
            <span className="text-[11px] text-slate-500 block font-mono mt-0.5">23CSE001</span>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 group-hover:bg-indigo-600 group-hover:text-white transition">
            Select
          </span>
        </button>

        <button
          type="button"
          onClick={() => onSelectAccount('STAFF001', 'staff')}
          className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/20 text-left transition shadow-2xs group cursor-pointer"
        >
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
              <Briefcase className="w-4 h-4 text-emerald-600" />
              <span>Staff Demo</span>
            </div>
            <span className="text-[11px] text-slate-500 block font-mono mt-0.5">STAFF001</span>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white transition">
            Select
          </span>
        </button>

        <button
          type="button"
          onClick={() => onSelectAccount('ADMIN001', 'campus')}
          className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200 hover:border-amber-500 hover:bg-amber-50/20 text-left transition shadow-2xs group cursor-pointer"
        >
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
              <School className="w-4 h-4 text-amber-600" />
              <span>Campus Demo</span>
            </div>
            <span className="text-[11px] text-slate-500 block font-mono mt-0.5">ADMIN001</span>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-700 group-hover:bg-amber-600 group-hover:text-white transition">
            Select
          </span>
        </button>
      </div>

      {/* Expanded directory with all 10 students, staff, and admin */}
      {isExpanded && (
        <div className="pt-2 border-t border-slate-200/80 space-y-3 animate-in fade-in">
          <div>
            <span className="text-[11px] font-bold text-indigo-700 uppercase tracking-wider block mb-1.5">
              10 Demo Student Accounts (Click any to autofill):
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-56 overflow-y-auto pr-1">
              {DEMO_STUDENT_ACCOUNTS.map((st) => (
                <button
                  key={st.registerNumber}
                  type="button"
                  onClick={() => onSelectAccount(st.registerNumber, 'student')}
                  className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200 hover:border-indigo-300 text-left text-xs transition cursor-pointer"
                >
                  <div className="min-w-0 pr-2">
                    <strong className="text-slate-900">{st.registerNumber}</strong>{' '}
                    <span className="text-slate-600">• {st.name} ({st.department})</span>
                    <span className="text-[10px] text-slate-400 block truncate">
                      Goal: {st.targetCareer} • Readiness: {st.readinessScore}%
                    </span>
                  </div>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-bold shrink-0">
                    Autofill
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div>
              <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider block mb-1.5">
                Staff / Faculty Accounts:
              </span>
              <div className="space-y-1">
                {DEMO_STAFF_ACCOUNTS.map((st) => (
                  <button
                    key={st.registerNumber}
                    type="button"
                    onClick={() => onSelectAccount(st.registerNumber, 'staff')}
                    className="w-full flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200 hover:border-emerald-300 text-left text-xs transition cursor-pointer"
                  >
                    <div>
                      <strong className="text-slate-900">{st.registerNumber}</strong>{' '}
                      <span className="text-slate-600">• {st.name}</span>
                    </div>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold">
                      Autofill
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider block mb-1.5">
                Campus / Leadership Accounts:
              </span>
              <div className="space-y-1">
                {DEMO_CAMPUS_ACCOUNTS.map((ad) => (
                  <button
                    key={ad.registerNumber}
                    type="button"
                    onClick={() => onSelectAccount(ad.registerNumber, 'campus')}
                    className="w-full flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200 hover:border-amber-300 text-left text-xs transition cursor-pointer"
                  >
                    <div>
                      <strong className="text-slate-900">{ad.registerNumber}</strong>{' '}
                      <span className="text-slate-600">• {ad.name}</span>
                    </div>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 font-bold">
                      Autofill
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
