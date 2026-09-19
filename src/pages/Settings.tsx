import React from 'react';
import {
  Settings as SettingsIcon,
  ShieldCheck,
  RefreshCw,
  Sparkles,
  Info,
  CheckCircle2,
  Trash2,
} from 'lucide-react';
import { StudentProfile } from '../types';

interface SettingsProps {
  profile: StudentProfile;
  isDemoMode: boolean;
  onLoadDemo: () => void;
  onResetToFresh: () => void;
  hasGeminiKey: boolean;
}

export const Settings: React.FC<SettingsProps> = ({
  profile,
  isDemoMode,
  onLoadDemo,
  onResetToFresh,
  hasGeminiKey,
}) => {
  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Top Banner */}
      <div className="p-6 bg-white rounded-2xl border border-slate-200/90 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <SettingsIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">System & Engine Settings</h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Manage hackathon presentation mode, intelligence engine, and privacy settings.
            </p>
          </div>
        </div>
      </div>

      {/* Engine Status Card */}
      <div className="p-6 bg-white rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
        <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider text-indigo-600 flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          1. AI Intelligence Engine Status
        </h3>

        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/70 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700">Gemini 3.8 Flash Integration:</span>
            <span
              className={`text-xs px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1.5 ${
                hasGeminiKey
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${hasGeminiKey ? 'bg-emerald-600' : 'bg-amber-600'}`} />
              {hasGeminiKey ? 'Live AI Mode Active' : 'Deterministic Demo Mode Active'}
            </span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            {hasGeminiKey
              ? 'Gemini 3.8 Flash is configured server-side. Roadmaps and Career Assistant chats are generated dynamically using strict JSON schemas and contextual student grounding.'
              : 'Deterministic Rules Engine is active. Roadmaps and answers are generated instantaneously from verified market skill matrices and career requirements, requiring zero external API keys or cloud quotas.'}
          </p>
        </div>
      </div>

      {/* Hackathon Demo Controls Card */}
      <div className="p-6 bg-white rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
        <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider text-indigo-600 flex items-center gap-2">
          <RefreshCw className="w-4 h-4" />
          2. Hackathon Demo Controls
        </h3>

        <p className="text-xs text-slate-600 leading-relaxed">
          Quickly switch between Ajay’s demo profile (Data Analyst goal, 72% initial readiness) or reset to an empty state for custom live testing.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 pt-1">
          <button
            onClick={onLoadDemo}
            className="px-4 py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <RefreshCw className="w-4 h-4 text-amber-600" />
            <span>Load Demo Student Profile (Ajay - Data Analyst)</span>
          </button>

          <button
            onClick={onResetToFresh}
            className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <Trash2 className="w-4 h-4 text-slate-500" />
            <span>Reset to Fresh Blank Profile</span>
          </button>
        </div>
      </div>

      {/* Privacy, Ethics & Disclaimers Card */}
      <div className="p-6 bg-white rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
        <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider text-indigo-600 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4" />
          3. Ethical Disclaimers & Privacy Notice
        </h3>

        <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <strong className="text-slate-800 block mb-1">Career Readiness Estimate:</strong>
            SKILLGAP COMPASS calculates an educational <strong>Career Readiness Estimate</strong> based on verified competencies, coursework, and industry benchmark weights. It represents skill alignment and does not constitute a legal or contractual guarantee of employment.
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <strong className="text-slate-800 block mb-1">Student Privacy & Data Protection:</strong>
            Student personal data, academic records, and skills assessments are processed securely within your active session and are never sold, rented, or distributed to third parties.
          </div>
        </div>
      </div>
    </div>
  );
};
