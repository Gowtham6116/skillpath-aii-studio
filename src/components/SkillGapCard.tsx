import React, { useState } from 'react';
import {
  CheckCircle,
  Clock,
  Play,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Youtube,
  GraduationCap,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { PriorityLevel, SkillGapItem, SkillLevel } from '../types';
import { getSkillLearningResources } from '../data/learningResources';

interface SkillGapCardProps {
  gap: SkillGapItem;
  onMarkCompleted: (skillName: string) => void;
  onViewResources?: (skillName: string) => void;
  isInitialExpanded?: boolean;
}

export const SkillGapCard: React.FC<SkillGapCardProps> = ({
  gap,
  onMarkCompleted,
  onViewResources,
  isInitialExpanded = false,
}) => {
  const [showResources, setShowResources] = useState(isInitialExpanded);
  const learningPackage = getSkillLearningResources(gap.skill);

  const getPriorityBadge = (priority: PriorityLevel) => {
    switch (priority) {
      case 'HIGH':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
            HIGH
          </span>
        );
      case 'MEDIUM':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            MEDIUM
          </span>
        );
      case 'LOW':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
            LOW
          </span>
        );
    }
  };

  // Level progression calculation
  const levelOrder: Record<string, number> = {
    'Not Started': 0,
    Beginner: 1,
    Intermediate: 2,
    Advanced: 3,
  };

  const currentLvl = gap.currentLevel || (gap.currentStatus === 'Learning' ? 'Beginner' : 'Not Started');
  const requiredLvl = gap.requiredLevel || 'Intermediate';

  const curIndex = levelOrder[currentLvl] ?? 0;
  const reqIndex = levelOrder[requiredLvl] ?? 2;
  const levelDiff = Math.max(1, reqIndex - curIndex);
  const gapText = `${levelDiff} ${levelDiff === 1 ? 'level' : 'levels'}`;

  return (
    <div
      id={`skill-gap-card-${gap.skill.toLowerCase().replace(/\s+/g, '-')}`}
      className={`p-4 sm:p-5 bg-white rounded-2xl border transition-all ${
        showResources
          ? 'border-indigo-400 shadow-md ring-2 ring-indigo-500/10'
          : 'border-slate-200 shadow-xs hover:border-slate-300'
      }`}
    >
      {/* Top Header */}
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2.5">
          <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 text-xs font-bold flex items-center justify-center border border-slate-200 shrink-0">
            {gap.recommendedOrder}
          </span>
          <div>
            <h4 className="text-base font-bold text-slate-900 leading-tight">{gap.skill}</h4>
            <span className="text-[11px] text-slate-500">{gap.category}</span>
          </div>
        </div>
        {getPriorityBadge(gap.priority)}
      </div>

      {/* Structured Competency Metrics Grid */}
      <div className="grid grid-cols-3 gap-2 p-2.5 bg-slate-50 rounded-xl border border-slate-100 my-3 text-center">
        <div>
          <span className="text-[10px] text-slate-400 font-semibold block uppercase">Current</span>
          <strong className="text-xs text-slate-800 font-bold block truncate">{currentLvl}</strong>
        </div>
        <div>
          <span className="text-[10px] text-slate-400 font-semibold block uppercase">Required</span>
          <strong className="text-xs text-indigo-700 font-bold block truncate">{requiredLvl}</strong>
        </div>
        <div>
          <span className="text-[10px] text-slate-400 font-semibold block uppercase">Gap</span>
          <strong className="text-xs text-rose-600 font-bold block truncate">{gapText}</strong>
        </div>
      </div>

      {/* Why it matters */}
      <div className="mb-3.5">
        <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider mb-0.5">
          Why it matters
        </p>
        <p className="text-xs text-slate-700 leading-relaxed">{gap.reason}</p>
      </div>

      {/* Action Buttons */}
      <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
        {/* Learn Button (Toggles YouTube Learning Resources) */}
        <button
          type="button"
          onClick={() => setShowResources(!showResources)}
          id={`learn-btn-${gap.skill.toLowerCase().replace(/\s+/g, '-')}`}
          className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
            showResources
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200'
          }`}
        >
          <Youtube className={`w-4 h-4 ${showResources ? 'text-white' : 'text-red-600'}`} />
          <span>{showResources ? 'Hide Resources' : 'Learn'}</span>
          {showResources ? (
            <ChevronUp className="w-3.5 h-3.5 ml-0.5" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 ml-0.5" />
          )}
        </button>

        {/* Mark Completed Button */}
        <button
          type="button"
          onClick={() => onMarkCompleted(gap.skill)}
          id={`mark-complete-btn-${gap.skill.toLowerCase().replace(/\s+/g, '-')}`}
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold border border-emerald-200 transition cursor-pointer"
          title="Mark skill as completed to update readiness score and dynamic roadmap"
        >
          <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
          <span>Mark Completed</span>
        </button>
      </div>

      {/* Compact YouTube Learning Resources Panel */}
      {showResources && (
        <div className="mt-4 pt-4 border-t border-indigo-100 space-y-3 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <Youtube className="w-4 h-4 text-red-600" />
              LEARN {gap.skill.toUpperCase()}
            </span>
            <span className="text-[10px] text-slate-500 font-medium">
              Verified Learning References
            </span>
          </div>

          {/* YouTube Video List */}
          <div className="space-y-2">
            {learningPackage.resources.map((res) => (
              <div
                key={res.id}
                className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-3 hover:bg-white hover:border-indigo-300 transition"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="text-[9px] px-1.5 py-0.2 rounded font-bold uppercase bg-indigo-50 text-indigo-700 border border-indigo-200">
                      {res.level}
                    </span>
                    {res.channel && (
                      <span className="text-[10px] text-slate-500 truncate">{res.channel}</span>
                    )}
                    {res.duration && (
                      <span className="text-[10px] text-slate-400">• {res.duration}</span>
                    )}
                  </div>
                  <h5 className="text-xs font-semibold text-slate-900 truncate" title={res.title}>
                    {res.title}
                  </h5>
                </div>

                <a
                  href={res.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center gap-1 shrink-0 shadow-2xs transition"
                  title="Opens YouTube in a new tab"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>{res.isSearchFallback ? 'Search' : 'Watch'}</span>
                  <ExternalLink className="w-3 h-3 text-red-200" />
                </a>
              </div>
            ))}
          </div>

          {/* Hands-on Practice / Project Milestone */}
          <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold text-indigo-900 uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-indigo-600" />
                Practice Milestone
              </span>
            </div>
            <p className="text-xs font-semibold text-slate-900 mb-0.5">
              {learningPackage.practiceTask.title}
            </p>
            <p className="text-[11px] text-slate-600 leading-snug">
              {learningPackage.practiceTask.description}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
