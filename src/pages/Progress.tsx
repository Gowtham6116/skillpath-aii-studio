import React from 'react';
import {
  TrendingUp,
  Award,
  CheckCircle2,
  Calendar,
  Flame,
  Milestone,
  FolderGit2,
  Sparkles,
  Lock,
  ArrowRight,
} from 'lucide-react';
import { GeneratedRoadmap, SkillAnalysisResult, StudentProfile } from '../types';
import { NavPage } from '../components/Sidebar';

interface ProgressProps {
  profile: StudentProfile;
  analysis: SkillAnalysisResult;
  roadmap: GeneratedRoadmap;
  onNavigate: (page: NavPage) => void;
}

export const Progress: React.FC<ProgressProps> = ({
  profile,
  analysis,
  roadmap,
  onNavigate,
}) => {
  const { targetCareer, careerReadinessScore, matchedSkills, skillGaps } = analysis;

  const completedWeeksCount = roadmap.weeks.filter((w) => w.isCompleted).length;
  const totalWeeks = roadmap.weeks.length;
  const streakDays = 5;

  // Milestone badges logic
  const badges = [
    {
      id: 'b-1',
      title: 'SQL Novice',
      desc: 'Demonstrated relational database querying and schema manipulation.',
      unlocked: matchedSkills.some((s) => s.name.toLowerCase().includes('sql')),
      level: 'Foundation',
    },
    {
      id: 'b-2',
      title: 'Data Explorer',
      desc: 'Mastered Python or R data wrangling with Pandas and exploratory analysis.',
      unlocked: matchedSkills.some((s) => s.name.toLowerCase().includes('python')),
      level: 'Intermediate',
    },
    {
      id: 'b-3',
      title: 'Dashboard Builder',
      desc: 'Engineered executive business intelligence dashboards (Power BI / Tableau).',
      unlocked: matchedSkills.some((s) => s.name.toLowerCase().includes('power bi') || s.name.toLowerCase().includes('tableau')),
      level: 'Advanced',
    },
    {
      id: 'b-4',
      title: 'Job Ready Candidate',
      desc: 'Achieved >75% estimated career readiness across target requirements.',
      unlocked: careerReadinessScore >= 75,
      level: 'Milestone',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Top Banner */}
      <div className="p-6 bg-white rounded-2xl border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <TrendingUp className="w-4 h-4" />
            </span>
            <h2 className="text-xl font-bold text-slate-900">
              Progress & Milestone Tracker
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500">
            Real-time verification metrics and milestone unlocks for {profile.fullName}.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold">
          <Flame className="w-4 h-4 text-amber-600 animate-pulse" />
          <span>{streakDays}-Day Learning Streak!</span>
        </div>
      </div>

      {/* Progress Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
            Career Readiness
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">{careerReadinessScore}%</span>
            <span className="text-xs font-semibold text-indigo-600">{analysis.statusTier}</span>
          </div>
          <div className="w-full h-1.5 bg-slate-100 rounded-full mt-3 overflow-hidden">
            <div
              className="h-full bg-indigo-600 rounded-full transition-all duration-500"
              style={{ width: `${careerReadinessScore}%` }}
            />
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
            Skills Status
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">{matchedSkills.length}</span>
            <span className="text-xs text-slate-500">of {targetCareer.requiredSkills.length} completed</span>
          </div>
          <p className="text-xs text-amber-600 mt-2 font-medium">
            {skillGaps.length} gaps to resolve
          </p>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
            Roadmap Weeks
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">{completedWeeksCount}</span>
            <span className="text-xs text-slate-500">of {totalWeeks} weeks done</span>
          </div>
          <p className="text-xs text-slate-500 mt-2 font-medium">
            Week {completedWeeksCount + 1} in progress
          </p>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
            Projects Built
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">{profile.projects.length}</span>
            <span className="text-xs text-slate-500">portfolio items</span>
          </div>
          <p className="text-xs text-emerald-600 mt-2 font-medium">
            Verified proof of work
          </p>
        </div>
      </div>

      {/* Milestone Badges Section */}
      <div className="p-6 bg-white rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Award className="w-5 h-5 text-indigo-600" />
            Competency Milestone Badges
          </h3>
          <p className="text-xs text-slate-500">
            Earn accredited milestone badges as you verify skills and build capstone projects.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className={`p-5 rounded-2xl border flex flex-col justify-between transition-all ${
                badge.unlocked
                  ? 'bg-gradient-to-b from-indigo-50/50 to-white border-indigo-200 shadow-xs'
                  : 'bg-slate-50 border-slate-200 opacity-60'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
                      badge.unlocked
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-slate-200 text-slate-400'
                    }`}
                  >
                    {badge.unlocked ? <Sparkles className="w-5 h-5" /> : <Lock className="w-4 h-4" />}
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-semibold">
                    {badge.level}
                  </span>
                </div>

                <h4 className="font-bold text-sm text-slate-900 mb-1">{badge.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{badge.desc}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100">
                <span
                  className={`text-xs font-bold block ${
                    badge.unlocked ? 'text-emerald-600' : 'text-slate-400'
                  }`}
                >
                  {badge.unlocked ? '✓ Unlocked' : 'Locked (Complete requirement)'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Action Link to Roadmap */}
      <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100 flex items-center justify-between">
        <span className="text-xs text-indigo-900 font-medium">
          Ready to unlock the next milestone? Complete remaining practice exercises.
        </span>
        <button
          onClick={() => onNavigate('roadmap')}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 cursor-pointer"
        >
          <span>Open Roadmap</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
