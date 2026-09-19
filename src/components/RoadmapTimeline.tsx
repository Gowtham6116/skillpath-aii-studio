import React from 'react';
import {
  CheckCircle2,
  Circle,
  Calendar,
  Target,
  ExternalLink,
  BookOpen,
  FolderGit2,
  Sparkles,
  ArrowRight,
  Youtube,
} from 'lucide-react';
import { RoadmapWeek } from '../types';
import { getSkillLearningResources } from '../data/learningResources';

interface RoadmapTimelineProps {
  weeks: RoadmapWeek[];
  onToggleTask: (weekIndex: number, taskId: string) => void;
  onMarkSkillCompleted: (skillName: string) => void;
  onSelectProject?: (projectTitle: string) => void;
}

export const RoadmapTimeline: React.FC<RoadmapTimelineProps> = ({
  weeks,
  onToggleTask,
  onMarkSkillCompleted,
  onSelectProject,
}) => {
  return (
    <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
      {weeks.map((week, weekIdx) => {
        const completedTasksCount = week.tasks.filter((t) => t.completed).length;
        const totalTasksCount = week.tasks.length;
        const isAllTasksDone = totalTasksCount > 0 && completedTasksCount === totalTasksCount;
        const isSkillCompleted = week.isCompleted || isAllTasksDone;

        return (
          <div
            key={`week-${week.weekNumber}-${week.focusSkill}`}
            id={`roadmap-week-${week.weekNumber}`}
            className="relative group"
          >
            {/* Timeline node icon */}
            <div
              className={`absolute -left-6 sm:-left-8 top-1.5 w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 flex items-center justify-center transition-colors ${
                isSkillCompleted
                  ? 'bg-emerald-600 border-emerald-600 text-white'
                  : 'bg-white border-indigo-600 text-indigo-600 shadow-xs'
              }`}
            >
              {isSkillCompleted ? (
                <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
              ) : (
                <span className="text-[11px] sm:text-xs font-bold">{week.weekNumber}</span>
              )}
            </div>

            {/* Week Card */}
            <div
              className={`p-5 sm:p-6 rounded-2xl border transition-all ${
                isSkillCompleted
                  ? 'bg-emerald-50/30 border-emerald-200/80'
                  : 'bg-white border-slate-200/90 shadow-xs hover:border-slate-300'
              }`}
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 text-xs font-bold tracking-wide uppercase">
                    Week {week.weekNumber}
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900">
                    {week.title}
                  </h3>
                  {isSkillCompleted && (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Completed
                    </span>
                  )}
                </div>

                {/* Mark Skill Completed button */}
                <button
                  onClick={() => onMarkSkillCompleted(week.focusSkill)}
                  id={`complete-week-skill-${week.weekNumber}`}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer self-start sm:self-auto ${
                    isSkillCompleted
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-slate-900 hover:bg-indigo-600 text-white shadow-xs'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>
                    {isSkillCompleted ? 'Skill Verified' : `Mark ${week.focusSkill} Completed`}
                  </span>
                </button>
              </div>

              {/* Objective */}
              <p className="text-xs sm:text-sm text-slate-600 mb-4 leading-relaxed">
                {week.objective}
              </p>

              {/* Action Tasks */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  <span>Weekly Practice Tasks</span>
                  <span className="text-slate-400">
                    {completedTasksCount} / {totalTasksCount} completed
                  </span>
                </div>
                <div className="space-y-2">
                  {week.tasks.map((task) => (
                    <label
                      key={task.id}
                      className={`flex items-start gap-3 p-2.5 rounded-xl border transition cursor-pointer ${
                        task.completed
                          ? 'bg-slate-50/80 border-slate-200 text-slate-400 line-through'
                          : 'bg-white border-slate-200/70 hover:border-indigo-200 text-slate-800'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => onToggleTask(weekIdx, task.id)}
                        className="mt-0.5 w-4 h-4 text-indigo-600 rounded-sm border-slate-300 focus:ring-indigo-500"
                      />
                      <span className="text-xs sm:text-sm leading-snug">{task.title}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Milestone & Project Banner */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-slate-100 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="font-semibold text-slate-500 block uppercase tracking-wider text-[10px] mb-1 flex items-center gap-1">
                    <Target className="w-3 h-3 text-indigo-600" />
                    Target Milestone:
                  </span>
                  <p className="text-slate-700 font-medium">{week.milestone}</p>
                </div>

                {week.associatedProjectTitle && (
                  <div className="p-3 rounded-xl bg-indigo-50/60 border border-indigo-100 flex flex-col justify-between">
                    <div>
                      <span className="font-semibold text-indigo-600 block uppercase tracking-wider text-[10px] mb-1 flex items-center gap-1">
                        <FolderGit2 className="w-3 h-3" />
                        Associated Project:
                      </span>
                      <p className="text-indigo-950 font-bold">{week.associatedProjectTitle}</p>
                    </div>
                    {onSelectProject && (
                      <button
                        onClick={() => onSelectProject(week.associatedProjectTitle!)}
                        className="text-[11px] text-indigo-700 font-semibold hover:underline flex items-center gap-1 mt-2 cursor-pointer"
                      >
                        <span>View Project Spec</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Learning Resources & YouTube Integration */}
              {(() => {
                const learningPackage = getSkillLearningResources(week.focusSkill);
                const topVideo = learningPackage.resources[0];
                return (
                  <div className="mt-3.5 pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 bg-slate-50/80 p-3 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="p-1.5 rounded-lg bg-red-100 text-red-600 shrink-0">
                        <Youtube className="w-4 h-4" />
                      </span>
                      <div className="min-w-0">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                          Curated Learning Video
                        </span>
                        <p className="text-xs font-semibold text-slate-800 truncate" title={topVideo?.title}>
                          {topVideo?.title || `${week.focusSkill} Tutorial`}
                        </p>
                      </div>
                    </div>

                    {topVideo && (
                      <a
                        href={topVideo.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center gap-1.5 shrink-0 shadow-2xs transition cursor-pointer self-start sm:self-auto"
                        title="Watch on YouTube (opens in new tab)"
                      >
                        <Youtube className="w-3.5 h-3.5" />
                        <span>Watch</span>
                        <ExternalLink className="w-3 h-3 text-red-200" />
                      </a>
                    )}
                  </div>
                );
              })()}
            </div>
          </div>
        );
      })}
    </div>
  );
};
