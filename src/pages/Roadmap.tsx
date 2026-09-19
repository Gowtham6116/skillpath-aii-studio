import React, { useState } from 'react';
import {
  Milestone,
  Sparkles,
  RefreshCw,
  Award,
  CheckCircle2,
  Calendar,
  AlertCircle,
  FolderGit2,
  ArrowRight,
  Download,
  Share2,
} from 'lucide-react';
import { GeneratedRoadmap, SkillAnalysisResult, StudentProfile } from '../types';
import { RoadmapTimeline } from '../components/RoadmapTimeline';

interface RoadmapProps {
  roadmap: GeneratedRoadmap;
  analysis: SkillAnalysisResult;
  profile: StudentProfile;
  isGeneratingAI: boolean;
  onRegenerateRoadmap: () => void;
  onToggleTask: (weekIndex: number, taskId: string) => void;
  onMarkSkillCompleted: (skillName: string) => void;
  onNavigateToProjects: () => void;
  recentUpdateAlert: string | null;
}

export const Roadmap: React.FC<RoadmapProps> = ({
  roadmap,
  analysis,
  profile,
  isGeneratingAI,
  onRegenerateRoadmap,
  onToggleTask,
  onMarkSkillCompleted,
  onNavigateToProjects,
  recentUpdateAlert,
}) => {
  const { targetCareer, careerReadinessScore, skillGaps } = analysis;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Top Header Card */}
      <div className="p-6 bg-white rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                <Milestone className="w-4 h-4" />
              </span>
              <h2 className="text-xl font-bold text-slate-900">
                Personalized Career Roadmap
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500">
              Tailored specifically for <strong>{profile.fullName}</strong> to achieve the <strong>{targetCareer.name}</strong> role.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onRegenerateRoadmap}
              disabled={isGeneratingAI}
              id="roadmap-regenerate-btn"
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isGeneratingAI ? 'animate-spin' : ''}`} />
              <span>{isGeneratingAI ? 'Synthesizing with Gemini...' : 'Regenerate Roadmap'}</span>
            </button>
          </div>
        </div>

        {/* Dynamic Update Toast / Banner */}
        {recentUpdateAlert && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-xs animate-in fade-in slide-in-from-top-2 duration-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="flex-1">{recentUpdateAlert}</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-200/80 text-emerald-800 font-bold">
              Dynamic Recalculation Active
            </span>
          </div>
        )}

        {/* Executive Strategy Summary */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Learning Strategy & Priority Sequencing:</span>
            {roadmap.isAI && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 font-semibold lowercase">
                gemini-3.8-flash
              </span>
            )}
          </div>
          <p>{roadmap.summary}</p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
          <div className="p-3 rounded-xl bg-white border border-slate-200">
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Total Duration</span>
            <strong className="text-slate-900 text-sm">{roadmap.weeks.length} Weeks</strong>
          </div>
          <div className="p-3 rounded-xl bg-white border border-slate-200">
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Missing Gaps</span>
            <strong className="text-amber-600 text-sm">{skillGaps.length} Skills Remaining</strong>
          </div>
          <div className="p-3 rounded-xl bg-white border border-slate-200">
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Career Readiness</span>
            <strong className="text-indigo-600 text-sm">{careerReadinessScore}% Estimate</strong>
          </div>
          <div className="p-3 rounded-xl bg-white border border-slate-200">
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Target Projects</span>
            <strong className="text-emerald-600 text-sm">{roadmap.recommendedProjects.length} Milestones</strong>
          </div>
        </div>
      </div>

      {/* Dynamic Roadmap Feature Explanation Tip */}
      <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100/80 text-xs text-indigo-950 flex items-start gap-3">
        <AlertCircle className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Dynamic Roadmap Recalculation Engine:</span>
          <p className="text-slate-600 mt-0.5 leading-relaxed">
            Clicking <strong>"Mark [Skill] Completed"</strong> on any week below automatically promotes the skill to your verified profile, updates your Career Readiness score, and dynamically shifts your roadmap sequence!
          </p>
        </div>
      </div>

      {/* The Timeline */}
      <section className="space-y-4">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-indigo-600" />
          Weekly Action Plan & Milestones
        </h3>

        <RoadmapTimeline
          weeks={roadmap.weeks}
          onToggleTask={onToggleTask}
          onMarkSkillCompleted={onMarkSkillCompleted}
          onSelectProject={() => onNavigateToProjects()}
        />
      </section>

      {/* Recommended Capstone Projects Callout */}
      <section className="p-6 bg-white rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FolderGit2 className="w-4 h-4 text-indigo-600" />
              Integrated Capstone Projects
            </h3>
            <p className="text-xs text-slate-500">
              Real-world portfolio projects configured to demonstrate your verified competencies
            </p>
          </div>

          <button
            onClick={onNavigateToProjects}
            className="text-xs font-semibold text-indigo-600 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>View All Projects</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {roadmap.recommendedProjects.slice(0, 2).map((proj) => (
            <div
              key={proj.id}
              className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-bold text-xs sm:text-sm text-slate-900">{proj.title}</h4>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-200 font-semibold text-slate-700">
                    {proj.difficulty}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1 line-clamp-2">{proj.description}</p>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-500">
                  Target skills: <strong>{proj.skills.join(', ')}</strong>
                </span>
                <span className="text-[11px] font-bold text-indigo-600">~{proj.estimatedHours} hrs</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
