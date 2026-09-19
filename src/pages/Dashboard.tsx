import React from 'react';
import {
  Award,
  Compass,
  AlertTriangle,
  FolderGit2,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  Calendar,
  Layers,
  Sparkles,
  Youtube,
  Zap,
  BookOpen,
} from 'lucide-react';
import { GeneratedRoadmap, SkillAnalysisResult, StudentProfile } from '../types';
import { NavPage } from '../components/Sidebar';
import { getCreditSummary, getStoredProgress } from '../services/courseStorage';

interface DashboardProps {
  profile: StudentProfile;
  analysis: SkillAnalysisResult;
  roadmap: GeneratedRoadmap;
  onNavigate: (page: NavPage) => void;
  onMarkSkillCompleted: (skillName: string) => void;
  onToggleTask: (weekIdx: number, taskId: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  profile,
  analysis,
  roadmap,
  onNavigate,
  onMarkSkillCompleted,
  onToggleTask,
}) => {
  const { targetCareer, careerReadinessScore, skillGaps, priorityGaps, matchedSkills, statusTier } = analysis;

  // Active or first incomplete week
  const activeWeek = roadmap.weeks.find((w) => !w.isCompleted) || roadmap.weeks[0];
  const activeWeekIdx = roadmap.weeks.findIndex((w) => w.weekNumber === activeWeek?.weekNumber);

  // Next action calculation: "Where am I? What am I missing? What should I do next?"
  const topGap = priorityGaps[0] || skillGaps[0];
  const nextActionSkill = topGap?.skill || activeWeek?.focusSkill || 'Capstone Portfolio';
  const nextActionReason = topGap?.reason || 'Complete hands-on practice in active roadmap.';

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Top Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold mb-2">
            <Compass className="w-3.5 h-3.5 text-indigo-600" />
            <span>Target: {targetCareer.name}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            SKILLGAP COMPASS
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            Welcome back, {profile.fullName} • Career Intelligence Platform
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('analysis')}
            className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:border-indigo-300 text-slate-700 text-xs font-semibold shadow-xs transition cursor-pointer"
          >
            Skill-Gap Analysis
          </button>
          <button
            onClick={() => onNavigate('roadmap')}
            className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition cursor-pointer flex items-center gap-1.5"
          >
            <span>Active Roadmap</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 4 Clean Metric Cards (Compact labels, no large paragraphs) */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Career Readiness */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">Career Readiness</span>
            <Award className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">
            {careerReadinessScore}%
          </div>
          <div className="mt-1 text-[11px] font-semibold text-indigo-600">
            {statusTier}
          </div>
        </div>

        {/* Card 2: Skill Gaps */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">Skill Gaps</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">
            {skillGaps.length}
          </div>
          <div className="mt-1 text-[11px] font-semibold text-rose-600">
            {priorityGaps.length} High Priority
          </div>
        </div>

        {/* Card 3: Roadmap */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">Roadmap</span>
            <Compass className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">
            Week {activeWeek?.weekNumber || 1} / {roadmap.weeks.length}
          </div>
          <div className="mt-1 text-[11px] font-semibold text-slate-500 truncate">
            Focus: {activeWeek?.focusSkill}
          </div>
        </div>

        {/* Card 4: Projects */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">Projects</span>
            <Layers className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">
            {profile.projects.length}
          </div>
          <div className="mt-1 text-[11px] font-semibold text-emerald-600">
            Verified Portfolios
          </div>
        </div>
      </div>

      {/* 1. Career Progress */}
      <section className="p-5 sm:p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-indigo-600" />
            <h3 className="text-base font-bold text-slate-900">Career Progress</h3>
          </div>
          <span className="text-xs font-bold text-slate-700">
            {matchedSkills.length} of {targetCareer.requiredSkills.length} competencies verified ({careerReadinessScore}%)
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 transition-all duration-500 rounded-full"
            style={{ width: `${careerReadinessScore}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>Current Target: <strong>{targetCareer.name}</strong></span>
          <button
            onClick={() => onNavigate('progress')}
            className="text-indigo-600 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>View detailed career breakdown</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </section>

      {/* 2. Skill Gaps & 3. Current Roadmap in 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 2. Skill Gaps */}
        <section className="p-5 sm:p-6 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <h3 className="text-base font-bold text-slate-900">Skill Gaps</h3>
              </div>
              <button
                onClick={() => onNavigate('analysis')}
                className="text-xs font-semibold text-indigo-600 hover:underline cursor-pointer"
              >
                View all ({skillGaps.length})
              </button>
            </div>

            <div className="space-y-2.5">
              {skillGaps.slice(0, 3).map((gap) => (
                <div
                  key={gap.skill}
                  className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-slate-900 truncate">{gap.skill}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded-sm bg-rose-100 text-rose-800 font-bold">
                        {gap.priority}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5 truncate">{gap.reason}</p>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => onNavigate('analysis')}
                      className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold border border-indigo-200 cursor-pointer flex items-center gap-1"
                    >
                      <Youtube className="w-3 h-3 text-red-600" />
                      <span>Learn</span>
                    </button>
                    <button
                      onClick={() => onMarkSkillCompleted(gap.skill)}
                      className="px-2.5 py-1 rounded-lg bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 text-xs font-semibold border border-slate-300 hover:border-emerald-300 cursor-pointer"
                    >
                      Done
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-100">
            <button
              onClick={() => onNavigate('analysis')}
              className="w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition text-center cursor-pointer"
            >
              Open Full Skill Gap Analysis
            </button>
          </div>
        </section>

        {/* 3. Current Roadmap */}
        <section className="p-5 sm:p-6 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-indigo-600" />
                <h3 className="text-base font-bold text-slate-900">
                  Current Roadmap • Week {activeWeek?.weekNumber}
                </h3>
              </div>
              <span className="text-xs font-bold text-indigo-600 px-2.5 py-0.5 rounded-md bg-indigo-50">
                {activeWeek?.focusSkill}
              </span>
            </div>

            <h4 className="text-xs font-bold text-slate-800 mb-1">{activeWeek?.title}</h4>
            <p className="text-xs text-slate-600 mb-3">{activeWeek?.objective}</p>

            {/* Checklist */}
            <div className="space-y-2 mb-3">
              {activeWeek?.tasks.slice(0, 3).map((task) => (
                <label
                  key={task.id}
                  className={`flex items-start gap-2.5 p-2 rounded-xl border text-xs transition cursor-pointer ${
                    task.completed
                      ? 'bg-slate-50 border-slate-200 text-slate-400 line-through'
                      : 'bg-white border-slate-200 hover:border-indigo-300 text-slate-700'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => {
                      if (activeWeekIdx >= 0) {
                        onToggleTask(activeWeekIdx, task.id);
                      }
                    }}
                    className="mt-0.5 rounded-sm text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="truncate">{task.title}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={() => onMarkSkillCompleted(activeWeek?.focusSkill || '')}
              className="text-xs text-indigo-600 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Mark {activeWeek?.focusSkill} Completed</span>
            </button>

            <button
              onClick={() => onNavigate('roadmap')}
              className="text-xs font-semibold text-slate-600 hover:text-indigo-600 flex items-center gap-1 cursor-pointer"
            >
              <span>Full Roadmap</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </section>
      </div>

      {/* Course Learning & Accredited Credits Banner */}
      {(() => {
        const creditSummary = getCreditSummary();
        return (
          <section className="p-5 sm:p-6 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3.5">
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-700 shrink-0">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm sm:text-base font-bold text-slate-900">
                    Course Learning & Academic Skill Credits
                  </h3>
                  <span className="text-[11px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                    Tier: {creditSummary.levelBadge}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  You have earned <strong className="text-slate-900">{creditSummary.totalCredits} Credits</strong> across{' '}
                  <strong className="text-slate-900">{creditSummary.completedCoursesCount} completed courses</strong> with{' '}
                  <strong className="text-slate-900">{creditSummary.certificatesCount} certified credentials</strong>.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                id="dashboard-view-certificates-btn"
                onClick={() => onNavigate('certificates')}
                className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition cursor-pointer"
              >
                Certificates ({creditSummary.certificatesCount})
              </button>
              <button
                id="dashboard-explore-courses-btn"
                onClick={() => onNavigate('courses')}
                className="px-3.5 py-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-xs transition cursor-pointer flex items-center gap-1.5"
              >
                <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                <span>Explore Courses</span>
              </button>
            </div>
          </section>
        );
      })()}

      {/* 4. Next Action: Where am I? What am I missing? What should I do next? */}
      <section className="p-5 sm:p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl shadow-md">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="w-4 h-4 text-indigo-400" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-300">
            Next Action Guide
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {/* Where am I? */}
          <div className="p-3.5 rounded-xl bg-white/10 border border-white/10">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
              1. Where Am I?
            </span>
            <p className="font-bold text-sm text-white">{targetCareer.name}</p>
            <p className="text-slate-300 mt-1">
              Readiness: <strong>{careerReadinessScore}%</strong> ({statusTier}) with {matchedSkills.length} competencies verified.
            </p>
          </div>

          {/* What am I missing? */}
          <div className="p-3.5 rounded-xl bg-white/10 border border-white/10">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
              2. What Am I Missing?
            </span>
            <p className="font-bold text-sm text-rose-300">{topGap?.skill || 'None'}</p>
            <p className="text-slate-300 mt-1 line-clamp-2">
              {nextActionReason}
            </p>
          </div>

          {/* What should I do next? */}
          <div className="p-3.5 rounded-xl bg-white/10 border border-white/10 flex flex-col justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                3. What Should I Do Next?
              </span>
              <p className="font-bold text-sm text-emerald-300">
                Master {nextActionSkill}
              </p>
              <p className="text-slate-300 mt-1">
                Watch recommended YouTube tutorials and mark practice complete.
              </p>
            </div>

            <button
              onClick={() => onNavigate('analysis')}
              className="mt-3 w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
            >
              <span>Address Gap Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
