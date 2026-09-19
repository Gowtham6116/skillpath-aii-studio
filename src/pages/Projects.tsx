import React from 'react';
import {
  FolderGit2,
  CheckCircle2,
  Clock,
  Sparkles,
  Plus,
  ArrowRight,
  HelpCircle,
  Code,
} from 'lucide-react';
import { RecommendedProject, SkillAnalysisResult, StudentProfile } from '../types';

interface ProjectsProps {
  projects: RecommendedProject[];
  profile: StudentProfile;
  analysis: SkillAnalysisResult;
  onToggleAddToRoadmap: (projectId: string) => void;
  onMarkProjectCompleted: (projectTitle: string) => void;
  onNavigateToRoadmap: () => void;
}

export const Projects: React.FC<ProjectsProps> = ({
  projects,
  profile,
  analysis,
  onToggleAddToRoadmap,
  onMarkProjectCompleted,
  onNavigateToRoadmap,
}) => {
  const completedProjectsSet = new Set(profile.projects.map((p) => p.toLowerCase().trim()));

  const getDifficultyBadge = (diff: RecommendedProject['difficulty']) => {
    switch (diff) {
      case 'Advanced':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
            Advanced
          </span>
        );
      case 'Intermediate':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
            Intermediate
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">
            Beginner
          </span>
        );
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Top Banner */}
      <div className="p-6 bg-white rounded-2xl border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <FolderGit2 className="w-4 h-4" />
            </span>
            <h2 className="text-xl font-bold text-slate-900">
              Recommended Applied Projects
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500">
            Recruiters hire on verified portfolio proof. Build these projects to prove your mastery of <strong>{analysis.targetCareer.name}</strong>.
          </p>
        </div>

        <button
          onClick={onNavigateToRoadmap}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition cursor-pointer self-start sm:self-auto"
        >
          <span>View Weekly Roadmap</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Projects List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {projects.map((project) => {
          const isDone = completedProjectsSet.has(project.title.toLowerCase().trim());

          return (
            <div
              key={project.id}
              id={`project-card-${project.id}`}
              className={`p-6 rounded-2xl border flex flex-col justify-between transition-all ${
                isDone
                  ? 'bg-emerald-50/40 border-emerald-300'
                  : 'bg-white border-slate-200/90 shadow-xs hover:border-slate-300'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="text-base font-bold text-slate-900">{project.title}</h3>
                  {getDifficultyBadge(project.difficulty)}
                </div>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-3">
                  {project.description}
                </p>

                {/* Skills tags */}
                <div className="mb-3">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                    Skills Developed & Proven:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {project.skills.map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className="text-[11px] px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-semibold border border-indigo-100"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Why this project helps */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 mb-4 text-xs">
                  <span className="font-semibold text-slate-700 block mb-0.5 flex items-center gap-1 text-[11px]">
                    <Sparkles className="w-3 h-3 text-indigo-500" />
                    Why this project helps your career:
                  </span>
                  <p className="text-slate-600">{project.whyRecommended}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <div className="text-xs text-slate-500 flex items-center gap-1 font-medium">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>~{project.estimatedHours} hours</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onToggleAddToRoadmap(project.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                      project.addedToRoadmap
                        ? 'bg-slate-200 text-slate-700'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                    }`}
                  >
                    {project.addedToRoadmap ? 'In Roadmap' : '+ Add to Roadmap'}
                  </button>

                  <button
                    onClick={() => onMarkProjectCompleted(project.title)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1 cursor-pointer ${
                      isDone
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-900 hover:bg-indigo-600 text-white shadow-xs'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{isDone ? 'Completed' : 'Mark Completed'}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
