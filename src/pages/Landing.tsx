import React from 'react';
import {
  Sparkles,
  ArrowRight,
  GitCompare,
  Milestone,
  Award,
  TrendingUp,
  Compass,
  CheckCircle2,
  RefreshCw,
  Presentation,
  ShieldCheck,
} from 'lucide-react';
import { NavPage } from '../components/Sidebar';
import { CAREERS_DATA } from '../data/careers';
import { SkillgapCompassLogo, SkillgapCompassEmblem } from '../components/SkillgapCompassLogo';

interface LandingProps {
  onNavigate: (page: NavPage) => void;
  onLoadDemo: () => void;
  onOpenStory: () => void;
}

export const Landing: React.FC<LandingProps> = ({
  onNavigate,
  onLoadDemo,
  onOpenStory,
}) => {
  const featureCards = [
    {
      title: 'AI Skill Gap Analysis',
      icon: GitCompare,
      color: 'text-indigo-600 bg-indigo-50 border-indigo-100',
      description:
        'Audits your current skills against industry standard career competencies to identify critical blind spots.',
    },
    {
      title: 'Personalized Roadmap',
      icon: Milestone,
      color: 'text-blue-600 bg-blue-50 border-blue-100',
      description:
        'Generates weekly learning sequences and structured milestones tailored directly to your highest priority gaps.',
    },
    {
      title: 'Career Readiness Score',
      icon: Award,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-100',
      description:
        'A transparent weighted mathematical calculation measuring your readiness for your chosen role—no arbitrary guesses.',
    },
    {
      title: 'Dynamic Progress Tracking',
      icon: TrendingUp,
      color: 'text-purple-600 bg-purple-50 border-purple-100',
      description:
        'As you mark skills completed, your roadmap automatically updates, priorities reshuffle, and your score rises in real-time.',
    },
  ];

  const processSteps = [
    { num: '01', title: 'Your Profile', desc: 'Log skills, courses & projects' },
    { num: '02', title: 'Target Career', desc: 'Select from 5 industry tracks' },
    { num: '03', title: 'Skill Gap', desc: 'Isolate missing competencies' },
    { num: '04', title: 'Personalized Roadmap', desc: 'Week-by-week action plan' },
    { num: '05', title: 'Career Ready', desc: 'Track verified progress' },
  ];

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-12 sm:pt-12 sm:pb-16 px-4 rounded-3xl bg-gradient-to-b from-indigo-50/70 via-white to-white border border-indigo-100/60 text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Official Emblem & Branding */}
          <div className="flex justify-center mb-2">
            <SkillgapCompassLogo variant="full" size="xl" showTagline={true} />
          </div>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Compares your verified academic & project competencies with industry expectations,
            pinpoints critical gaps, and guides your trajectory with dynamic, actionable milestones.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => onNavigate('login')}
              id="landing-login-portals-btn"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-md shadow-indigo-100 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Sign In / Select Portal</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('dashboard')}
              id="landing-build-roadmap-btn"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm shadow-md shadow-slate-200 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Student Dashboard</span>
            </button>

            <button
              onClick={onLoadDemo}
              id="landing-try-demo-btn"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 font-semibold text-sm border border-amber-300 shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4 text-amber-600" />
              <span>Try Demo (Ajay)</span>
            </button>
          </div>

          <div className="pt-2">
            <button
              onClick={onOpenStory}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition cursor-pointer"
            >
              <Presentation className="w-3.5 h-3.5 text-indigo-500" />
              <span>View Hackathon Demo Story & Presentation Slides</span>
            </button>
          </div>
        </div>
      </section>

      {/* Role-Specific Institutional Sectors Showcase */}
      <section className="space-y-4">
        <div className="text-center max-w-xl mx-auto">
          <span className="text-xs uppercase font-bold tracking-wider text-indigo-600">
            Dedicated Sectors & User Personas
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
            Built for Students, Faculty Mentors & Campus Leaders
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Every persona gets custom requirements, specialized tooling, and automated intelligence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Student Sector Card */}
          <div
            onClick={() => onNavigate('dashboard')}
            className="p-6 bg-white rounded-3xl border border-slate-200/90 shadow-xs hover:border-indigo-400 hover:shadow-sm transition cursor-pointer flex flex-col justify-between space-y-4 group"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 px-2 py-0.5 rounded-full bg-indigo-50 border border-indigo-100 inline-block mb-1">
                  Student Sector
                </span>
                <h3 className="font-bold text-lg text-slate-900 group-hover:text-indigo-600 transition">
                  Career Readiness & AI Roadmaps
                </h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Empowers candidates to audit skill gaps against real roles, explore D3 dependency graphs, and receive step-by-step milestone tasklists.
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-indigo-600">
              <span>Launch Student Portal</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Staff Sector Card */}
          <div
            onClick={() => onNavigate('staff')}
            className="p-6 bg-white rounded-3xl border border-slate-200/90 shadow-xs hover:border-emerald-400 hover:shadow-sm transition cursor-pointer flex flex-col justify-between space-y-4 group"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-100 inline-block mb-1">
                  Staff / Faculty Sector
                </span>
                <h3 className="font-bold text-lg text-slate-900 group-hover:text-emerald-600 transition">
                  Cohort Mentorship & Endorsements
                </h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Allows professors and placement coordinators to monitor student caseloads, endorse verified student projects, and dispatch remedial bridge tasks.
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-emerald-700">
              <span>Launch Staff Sector</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Campus Sector Card */}
          <div
            onClick={() => onNavigate('admin')}
            className="p-6 bg-white rounded-3xl border border-slate-200/90 shadow-xs hover:border-amber-400 hover:shadow-sm transition cursor-pointer flex flex-col justify-between space-y-4 group"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 px-2 py-0.5 rounded-full bg-amber-50 border border-amber-100 inline-block mb-1">
                  Campus Leadership Sector
                </span>
                <h3 className="font-bold text-lg text-slate-900 group-hover:text-amber-700 transition">
                  Institutional Placement Audits
                </h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Campus-wide macro index, recruiter hiring benchmark alignment (Amazon, TCS, Deloitte), and 1-click accreditation audit reports.
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-amber-700">
              <span>Launch Campus Sector</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards Section */}
      <section className="space-y-6">
        <div className="text-center max-w-xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Precision Career Intelligence
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Eliminate guesswork. Learn exactly what your target employer requires.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {featureCards.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                id={`feature-card-${idx + 1}`}
                className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:border-indigo-200 transition"
              >
                <div className={`w-10 h-10 rounded-xl ${feat.color} border flex items-center justify-center mb-4`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base text-slate-900 mb-2">
                  {feat.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {feat.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Simple Process Section */}
      <section className="p-6 sm:p-8 bg-slate-900 text-white rounded-3xl space-y-6">
        <div className="text-center max-w-xl mx-auto">
          <span className="text-xs uppercase font-bold tracking-wider text-indigo-400">
            How It Works
          </span>
          <h2 className="text-xl sm:text-2xl font-bold mt-1">
            Five Steps to Career Readiness
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 relative">
          {processSteps.map((step, sIdx) => (
            <div
              key={sIdx}
              className="p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col justify-between"
            >
              <div>
                <span className="text-xs font-extrabold text-indigo-400 block mb-1">
                  {step.num}
                </span>
                <h4 className="font-bold text-sm text-white mb-1">{step.title}</h4>
                <p className="text-xs text-slate-400">{step.desc}</p>
              </div>
              {sIdx < processSteps.length - 1 && (
                <div className="hidden sm:block mt-3 text-indigo-400/50 text-right">
                  →
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="pt-2 text-center">
          <button
            onClick={() => onNavigate('dashboard')}
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-xs transition cursor-pointer"
          >
            Launch Active Dashboard
          </button>
        </div>
      </section>

      {/* Career Preview Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              Supported Career Tracks
            </h2>
            <p className="text-xs text-slate-500">
              Curated market competencies with weighted skill trees
            </p>
          </div>
          <button
            onClick={() => onNavigate('careers')}
            className="text-xs font-semibold text-indigo-600 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>View All Requirements</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {CAREERS_DATA.map((c) => (
            <div
              key={c.id}
              onClick={() => onNavigate('careers')}
              className="p-4 bg-white rounded-xl border border-slate-200 hover:border-indigo-400 hover:shadow-xs transition cursor-pointer"
            >
              <span className="text-[11px] font-semibold text-indigo-600 block mb-1">
                {c.category}
              </span>
              <h4 className="font-bold text-sm text-slate-900">{c.name}</h4>
              <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                {c.shortDescription}
              </p>
              <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-medium">
                <span>{c.requiredSkills.length} Core Skills</span>
                <span className="text-emerald-600 font-bold">{c.jobDemand}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Ethical & Privacy Footer Disclaimer */}
      <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
        <span className="flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          SKILLGAP COMPASS provides an educational <strong>Career Readiness Estimate</strong> based on verified competencies.
        </span>
        <span className="text-slate-400 text-[11px]">
          Student privacy protected • Hackathon MVP Edition
        </span>
      </div>
    </div>
  );
};
