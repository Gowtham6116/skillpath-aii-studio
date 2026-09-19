import React from 'react';
import {
  X,
  Target,
  UserCheck,
  Compass,
  GitCompare,
  Milestone,
  RefreshCw,
  Trophy,
  ArrowRight,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { NavPage } from './Sidebar';

interface HackathonStoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (page: NavPage) => void;
  onLoadDemo: () => void;
}

export const HackathonStoryModal: React.FC<HackathonStoryModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onLoadDemo,
}) => {
  if (!isOpen) return null;

  const steps = [
    {
      step: 1,
      title: 'The Real Problem',
      icon: Target,
      tag: 'Pain Point',
      color: 'bg-rose-100 text-rose-700',
      description:
        'Students often know their target career (e.g. Data Analyst), but they do not know what exact skills they are missing compared with market standards. They waste hundreds of hours taking random, unprioritized tutorials without closing critical skill gaps.',
      actionText: 'View Landing Overview',
      actionPage: 'landing' as NavPage,
    },
    {
      step: 2,
      title: 'Student Profile & Assessment',
      icon: UserCheck,
      tag: 'Profile Input',
      color: 'bg-blue-100 text-blue-700',
      description:
        'The student catalogs their verified competencies, programming languages, academic metrics, and tools. Ajay starts with Python (Advanced), SQL, and Excel, but has beginner/unverified knowledge in Statistics and Power BI.',
      actionText: 'Inspect Ajay’s Profile',
      actionPage: 'profile' as NavPage,
    },
    {
      step: 3,
      title: 'Target Career Requirements',
      icon: Compass,
      tag: 'Market Benchmarks',
      color: 'bg-indigo-100 text-indigo-700',
      description:
        'Structured career definitions with weighted skills and minimum standards—ensuring deterministic, rigorous benchmarks rather than unpredictable AI halluncinations.',
      actionText: 'Explore 5 Career Tracks',
      actionPage: 'careers' as NavPage,
    },
    {
      step: 4,
      title: 'Transparent Skill Gap Analysis',
      icon: GitCompare,
      tag: 'Core Innovation',
      color: 'bg-purple-100 text-purple-700',
      description:
        'SKILLGAP COMPASS separates matched skills from gaps and calculates a Career Readiness Estimate using a transparent weighted formula: (earned weights / total required weights) * 100.',
      actionText: 'View Skill Gap Breakdown',
      actionPage: 'analysis' as NavPage,
    },
    {
      step: 5,
      title: 'Personalized AI & Curriculum Roadmap',
      icon: Milestone,
      tag: 'Actionable Guidance',
      color: 'bg-emerald-100 text-emerald-700',
      description:
        'Synthesizes an intelligent week-by-week sequence starting with highest-priority gaps (Statistics -> Power BI -> Capstone), with concrete tasks and project recommendations.',
      actionText: 'Open Active Roadmap',
      actionPage: 'roadmap' as NavPage,
    },
    {
      step: 6,
      title: 'Dynamic Roadmap Recalculation',
      icon: RefreshCw,
      tag: 'Game Changer',
      color: 'bg-amber-100 text-amber-700',
      description:
        'When the student clicks "Mark Statistics Completed", the engine dynamically recalculates the score in real time, removes Statistics from the gap list, moves Power BI up, and adjusts the roadmap.',
      actionText: 'Test Dynamic Update in Roadmap',
      actionPage: 'roadmap' as NavPage,
    },
    {
      step: 7,
      title: 'Institutional & Student Impact',
      icon: Trophy,
      tag: 'Scalable Value',
      color: 'bg-teal-100 text-teal-700',
      description:
        'Students become job-ready faster with measurable progress. Colleges and placement cells gain an institutional dashboard to identify collective skill deficits and tailor campus training.',
      actionText: 'See College Admin View',
      actionPage: 'admin' as NavPage,
    },
  ];

  const handleStepClick = (page: NavPage) => {
    onNavigate(page);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-start justify-between">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
              Hackathon Presentation Guide
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
              SKILLGAP COMPASS — The Presentation Story
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              "SKILLGAP COMPASS compares a student's current skills with the requirements of their target career, identifies the most important skill gaps, creates a personalized learning and project roadmap, and dynamically updates that roadmap as the student progresses."
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Demo Fast-Track Banner */}
        <div className="px-6 py-3 bg-amber-50 border-b border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-amber-900">
          <div className="flex items-center gap-2 font-medium">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              <strong>Quick Judge Walkthrough:</strong> Load Ajay’s demo profile (Data Analyst) and mark Statistics completed to witness dynamic recalculation.
            </span>
          </div>
          <button
            onClick={() => {
              onLoadDemo();
              onNavigate('roadmap');
              onClose();
            }}
            className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold self-start sm:self-auto cursor-pointer"
          >
            Load Demo & Open Roadmap
          </button>
        </div>

        {/* Steps Grid */}
        <div className="p-6 max-h-[65vh] overflow-y-auto space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {steps.map((s) => {
              const Icon = s.icon;
              return (
                <div
                  key={s.step}
                  className="p-4 rounded-xl border border-slate-200 hover:border-indigo-300 hover:shadow-xs transition bg-slate-50/50 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${s.color}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                          Step {s.step}
                        </span>
                      </div>
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-200/70 text-slate-700 font-medium">
                        {s.tag}
                      </span>
                    </div>
                    <h3 className="font-bold text-sm text-slate-900 mb-1">{s.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">{s.description}</p>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-200/60">
                    <button
                      onClick={() => handleStepClick(s.actionPage)}
                      className="text-xs text-indigo-600 font-semibold hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
                    >
                      <span>{s.actionText}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Production-Ready Hackathon MVP with deterministic & Gemini AI modes
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 text-white font-medium hover:bg-slate-800 transition cursor-pointer"
          >
            Close Story
          </button>
        </div>
      </div>
    </div>
  );
};
