import React from 'react';
import {
  GitCompare,
  Award,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Sparkles,
  Target,
  Clock,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { SkillAnalysisResult, StudentProfile } from '../types';
import { SkillGapCard } from '../components/SkillGapCard';

interface SkillAnalysisProps {
  analysis: SkillAnalysisResult;
  profile: StudentProfile;
  onMarkSkillCompleted: (skillName: string) => void;
  onGenerateRoadmap: () => void;
  onNavigateToRoadmap: () => void;
}

export const SkillAnalysis: React.FC<SkillAnalysisProps> = ({
  analysis,
  profile,
  onMarkSkillCompleted,
  onGenerateRoadmap,
  onNavigateToRoadmap,
}) => {
  const {
    targetCareer,
    matchedSkills,
    strongSkills,
    skillGaps,
    priorityGaps,
    careerReadinessScore,
    statusTier,
  } = analysis;

  // Developing skills (in progress or Beginner level)
  const developingSkills = matchedSkills.filter(
    (s) => s.level === 'Beginner' || s.status === 'Learning'
  );

  // Strong skills (Intermediate or Advanced)
  const verifiedStrongSkills = strongSkills.length > 0
    ? strongSkills
    : matchedSkills.filter((s) => s.level === 'Intermediate' || s.level === 'Advanced');

  // Next Action calculation
  const topPriorityGap = priorityGaps[0] || skillGaps[0];

  const getTierBadge = (tier: SkillAnalysisResult['statusTier']) => {
    switch (tier) {
      case 'Job Ready':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-600" />
            Job Ready (&gt;75%)
          </span>
        );
      case 'On Track':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-300 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-600" />
            On Track (50–75%)
          </span>
        );
      case 'Needs Work':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-600" />
            Needs Work (&lt;50%)
          </span>
        );
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* 1. Target Career & Career Readiness Summary */}
      <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                <GitCompare className="w-4 h-4" />
              </span>
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                Skill-Gap Analysis
              </span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900">
              {profile.fullName} • {targetCareer.name}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Target Career: <strong className="text-slate-800">{targetCareer.name}</strong>. Evaluated across {targetCareer.requiredSkills.length} industry competency benchmarks.
            </p>
          </div>

          {/* Large Readiness Score Circle Card */}
          <div className="flex items-center gap-5 p-5 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl shadow-md shrink-0">
            <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-800"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-indigo-400 transition-all duration-700 ease-out"
                  strokeDasharray={`${careerReadinessScore}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute text-center">
                <span className="text-2xl font-black">{careerReadinessScore}%</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold text-slate-300 block uppercase tracking-wider">
                Career Readiness
              </span>
              <div>{getTierBadge(statusTier)}</div>
              <p className="text-[10px] text-slate-400 mt-1">
                Deterministic mathematical benchmark
              </p>
            </div>
          </div>
        </div>

        {/* Quick Nav to Roadmap */}
        <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>
              {matchedSkills.length} competencies verified • {skillGaps.length} priority gaps
            </span>
          </div>

          <button
            onClick={() => {
              onGenerateRoadmap();
              onNavigateToRoadmap();
            }}
            id="analysis-view-roadmap-btn"
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-indigo-200" />
            <span>Open Personalized Roadmap</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Next Action Card */}
      {topPriorityGap && (
        <div className="p-4 sm:p-5 bg-gradient-to-r from-indigo-50 via-white to-indigo-50/50 rounded-2xl border border-indigo-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-indigo-700 uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-indigo-600" />
              Recommended Next Action
            </span>
            <h4 className="text-base font-bold text-slate-900">
              Close High-Priority Gap: {topPriorityGap.skill}
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              {topPriorityGap.reason} Completing this skill will directly increase your readiness score.
            </p>
          </div>

          <button
            onClick={() => onMarkSkillCompleted(topPriorityGap.skill)}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shrink-0 flex items-center justify-center gap-2 shadow-xs transition cursor-pointer"
          >
            <span>Mark {topPriorityGap.skill} Completed</span>
            <CheckCircle2 className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 3. Priority Gaps & YouTube Learning References */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              Priority Gaps ({skillGaps.length})
            </h3>
            <p className="text-xs text-slate-500">
              Review missing competencies, access verified YouTube courses, and verify completion.
            </p>
          </div>
        </div>

        {skillGaps.length === 0 ? (
          <div className="p-8 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
            <h4 className="font-bold text-slate-900">All Core Competencies Verified!</h4>
            <p className="text-xs text-slate-600">
              You have closed all core gaps for {targetCareer.name}.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {skillGaps.map((gap, idx) => (
              <SkillGapCard
                key={gap.skill}
                gap={gap}
                onMarkCompleted={onMarkSkillCompleted}
                onViewResources={() => onNavigateToRoadmap()}
                isInitialExpanded={idx === 0}
              />
            ))}
          </div>
        )}
      </section>

      {/* 4. Strong Skills & 5. Developing Skills */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strong Skills */}
        <section className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </span>
            <div>
              <h4 className="text-sm font-bold text-slate-900">
                Strong Skills ({verifiedStrongSkills.length})
              </h4>
              <p className="text-[11px] text-slate-500">Advanced / Intermediate verified</p>
            </div>
          </div>

          <div className="space-y-2">
            {verifiedStrongSkills.length === 0 ? (
              <p className="text-xs text-slate-400 italic py-2">No advanced skills logged yet.</p>
            ) : (
              verifiedStrongSkills.map((s) => (
                <div
                  key={s.name}
                  className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs"
                >
                  <span className="font-semibold text-slate-800">{s.name}</span>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                    {s.level}
                  </span>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Developing Skills */}
        <section className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </span>
            <div>
              <h4 className="text-sm font-bold text-slate-900">
                Developing Skills ({developingSkills.length})
              </h4>
              <p className="text-[11px] text-slate-500">Beginner / In Progress</p>
            </div>
          </div>

          <div className="space-y-2">
            {developingSkills.length === 0 ? (
              <p className="text-xs text-slate-400 italic py-2">No developing skills currently tracked.</p>
            ) : (
              developingSkills.map((s) => (
                <div
                  key={s.name}
                  className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs"
                >
                  <span className="font-semibold text-slate-800">{s.name}</span>
                  <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 font-bold text-[10px]">
                    {s.level}
                  </span>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
};
