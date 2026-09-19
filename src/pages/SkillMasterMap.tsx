import React, { useState } from 'react';
import {
  Network,
  CheckCircle2,
  Clock,
  Circle,
  Sparkles,
  Layers,
  Filter,
  Share2,
  LayoutGrid,
  Info,
} from 'lucide-react';
import { MASTER_SKILLS_LIST, SKILL_CATEGORIES } from '../data/skills';
import { CareerRequirement, SkillStatus, StudentProfile, StudentSkill } from '../types';
import { SkillForceGraph } from '../components/SkillForceGraph';

interface SkillMasterMapProps {
  profile: StudentProfile;
  career: CareerRequirement;
  onToggleSkillStatus: (skillName: string, newStatus: SkillStatus) => void;
  onSelectCareer?: (careerId: string) => void;
}

export const SkillMasterMap: React.FC<SkillMasterMapProps> = ({
  profile,
  career,
  onToggleSkillStatus,
  onSelectCareer,
}) => {
  const [activeView, setActiveView] = useState<'graph' | 'matrix'>('graph');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Build status map from student profile
  const studentSkillMap = new Map<string, StudentSkill>();
  profile.skills.forEach((s) => {
    studentSkillMap.set(s.name.toLowerCase().trim(), s);
  });

  // Target career required skill names set
  const requiredSkillNames = new Set(
    career.requiredSkills.map((r) => r.name.toLowerCase().trim())
  );

  const filteredCategories =
    selectedCategory === 'All'
      ? SKILL_CATEGORIES
      : SKILL_CATEGORIES.filter((c) => c === selectedCategory);

  // Skill statistics
  const completedCount = profile.skills.filter((s) => s.status === 'Completed').length;
  const learningCount = profile.skills.filter((s) => s.status === 'Learning').length;
  const targetRequiredCount = career.requiredSkills.length;
  const targetCompletedCount = career.requiredSkills.filter(
    (req) => studentSkillMap.get(req.name.toLowerCase().trim())?.status === 'Completed'
  ).length;

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Top Banner */}
      <div className="p-6 bg-white rounded-3xl border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <Network className="w-4 h-4" />
            </span>
            <h2 className="text-xl font-bold text-slate-900">Visual Skill Master Map</h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500">
            Interactive D3 dependency network and career pathways. Drag nodes, inspect prerequisites, and track competency readiness for <strong>{career.name}</strong>.
          </p>
        </div>

        {/* View Switcher: Force Graph vs Grid Matrix */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <div className="p-1 bg-slate-100 rounded-2xl border border-slate-200 flex items-center gap-1">
            <button
              onClick={() => setActiveView('graph')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeView === 'graph'
                  ? 'bg-white text-indigo-600 shadow-xs border border-slate-200/70'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>D3 Force Network</span>
            </button>
            <button
              onClick={() => setActiveView('matrix')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeView === 'matrix'
                  ? 'bg-white text-indigo-600 shadow-xs border border-slate-200/70'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Domain Matrix</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Summary Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-400 block uppercase tracking-wider">
            Target Role Match
          </span>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <strong className="text-xl font-bold text-indigo-600">
              {Math.round((targetCompletedCount / targetRequiredCount) * 100)}%
            </strong>
            <span className="text-xs text-slate-500">
              ({targetCompletedCount}/{targetRequiredCount} skills)
            </span>
          </div>
        </div>

        <div className="p-3.5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-400 block uppercase tracking-wider">
            Verified Competencies
          </span>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <strong className="text-xl font-bold text-emerald-600">{completedCount}</strong>
            <span className="text-xs text-slate-500">skills mastered</span>
          </div>
        </div>

        <div className="p-3.5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-400 block uppercase tracking-wider">
            Learning in Progress
          </span>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <strong className="text-xl font-bold text-amber-600">{learningCount}</strong>
            <span className="text-xs text-slate-500">active modules</span>
          </div>
        </div>

        <div className="p-3.5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-400 block uppercase tracking-wider">
            Standard Library
          </span>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <strong className="text-xl font-bold text-slate-800">{MASTER_SKILLS_LIST.length}</strong>
            <span className="text-xs text-slate-500">benchmark skills</span>
          </div>
        </div>
      </div>

      {/* VIEW 1: D3 FORCE-DIRECTED GRAPH */}
      {activeView === 'graph' && (
        <SkillForceGraph
          profile={profile}
          activeCareer={career}
          onToggleSkillStatus={onToggleSkillStatus}
          onSelectCareer={onSelectCareer}
        />
      )}

      {/* VIEW 2: DOMAIN GRID MATRIX */}
      {activeView === 'matrix' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Category Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <button
              onClick={() => setSelectedCategory('All')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                selectedCategory === 'All'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              All Domains
            </button>
            {SKILL_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Grid of Categories */}
          <div className="space-y-6">
            {filteredCategories.map((category) => {
              const skillsInCat = MASTER_SKILLS_LIST.filter((s) => s.category === category);

              return (
                <div
                  key={category}
                  className="p-6 bg-white rounded-2xl border border-slate-200/90 shadow-xs space-y-3"
                >
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                      <Layers className="w-4 h-4 text-indigo-600" />
                      {category}
                    </h3>
                    <span className="text-xs text-slate-400">
                      {skillsInCat.length} standard competencies
                    </span>
                  </div>

                  {/* Badges / Nodes Grid */}
                  <div className="flex flex-wrap gap-2.5 pt-1">
                    {skillsInCat.map((skill) => {
                      const studentRecord = studentSkillMap.get(skill.name.toLowerCase().trim());
                      const status: SkillStatus = studentRecord ? studentRecord.status : 'Not Started';
                      const isRequiredForCareer = requiredSkillNames.has(skill.name.toLowerCase().trim());

                      // Cycle status on click: Not Started -> Learning -> Completed -> Not Started
                      const nextStatus: SkillStatus =
                        status === 'Not Started'
                          ? 'Learning'
                          : status === 'Learning'
                          ? 'Completed'
                          : 'Not Started';

                      let badgeColor =
                        'bg-slate-100 text-slate-700 border-slate-200 hover:border-slate-300';
                      if (status === 'Completed') {
                        badgeColor =
                          'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100';
                      } else if (status === 'Learning') {
                        badgeColor =
                          'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100';
                      }

                      return (
                        <button
                          key={skill.name}
                          onClick={() => onToggleSkillStatus(skill.name, nextStatus)}
                          id={`skill-map-node-${skill.name.toLowerCase().replace(/\s+/g, '-')}`}
                          title={`Click to cycle status (Current: ${status})`}
                          className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-semibold transition cursor-pointer ${badgeColor}`}
                        >
                          {status === 'Completed' ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          ) : status === 'Learning' ? (
                            <Clock className="w-3.5 h-3.5 text-amber-600" />
                          ) : (
                            <Circle className="w-3.5 h-3.5 text-slate-400" />
                          )}

                          <span>{skill.name}</span>

                          {isRequiredForCareer && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded-sm bg-indigo-100 text-indigo-800 font-bold uppercase">
                              Target
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
