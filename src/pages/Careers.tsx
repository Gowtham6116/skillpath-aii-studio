import React, { useState } from 'react';
import {
  Compass,
  CheckCircle2,
  FolderGit2,
  Briefcase,
  TrendingUp,
  ArrowRight,
  Sparkles,
  Info,
} from 'lucide-react';
import { CAREERS_DATA } from '../data/careers';
import { CareerRequirement } from '../types';

interface CareersProps {
  currentTargetId: string;
  onSelectCareer: (careerId: string) => void;
  onProceedToAnalysis: () => void;
}

export const Careers: React.FC<CareersProps> = ({
  currentTargetId,
  onSelectCareer,
  onProceedToAnalysis,
}) => {
  const [selectedInspectCareer, setSelectedInspectCareer] = useState<CareerRequirement | null>(null);

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Top Banner */}
      <div className="p-6 bg-white rounded-2xl border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <Compass className="w-4 h-4" />
            </span>
            <h2 className="text-xl font-bold text-slate-900">Career Tracks & Market Standards</h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500">
            Select your goal. SKILLGAP COMPASS benchmarks your profile against verified industry competencies.
          </p>
        </div>

        <button
          onClick={onProceedToAnalysis}
          id="careers-view-analysis-btn"
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs flex items-center gap-2 transition cursor-pointer self-start sm:self-auto"
        >
          <span>View Skill Gap for Selected</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Career Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {CAREERS_DATA.map((career) => {
          const isSelected = career.id === currentTargetId;

          return (
            <div
              key={career.id}
              id={`career-card-${career.id}`}
              className={`p-6 rounded-2xl border transition-all flex flex-col justify-between ${
                isSelected
                  ? 'bg-indigo-50/40 border-indigo-500 ring-2 ring-indigo-500/20 shadow-md'
                  : 'bg-white border-slate-200/90 shadow-xs hover:border-slate-300'
              }`}
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider">
                      {career.category}
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                      {career.name}
                    </h3>
                  </div>

                  {isSelected ? (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-indigo-600 text-white shadow-xs">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Active Goal
                    </span>
                  ) : (
                    <span className="text-xs font-medium px-2.5 py-1 rounded-md bg-slate-100 text-slate-600">
                      {career.requiredSkills.length} Core Skills
                    </span>
                  )}
                </div>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                  {career.shortDescription}
                </p>

                {/* Salary & Demand stats */}
                <div className="grid grid-cols-2 gap-2 p-3 bg-white rounded-xl border border-slate-200/70 mb-4 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                      Salary Range
                    </span>
                    <strong className="text-slate-800">{career.averageSalaryRange}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                      Market Demand
                    </span>
                    <strong className="text-emerald-600 font-bold">{career.jobDemand}</strong>
                  </div>
                </div>

                {/* Core Required Skills Badges */}
                <div className="mb-4">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">
                    Required Competencies:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {career.requiredSkills.map((req, rIdx) => (
                      <span
                        key={rIdx}
                        className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-medium border border-slate-200/60"
                      >
                        {req.name}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Typical Project Types */}
                <div className="mb-4">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1.5 flex items-center gap-1">
                    <FolderGit2 className="w-3.5 h-3.5 text-indigo-500" />
                    Recommended Capstone Type:
                  </span>
                  <p className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    <strong className="text-slate-900">{career.typicalProjects[0]?.title}:</strong>{' '}
                    {career.typicalProjects[0]?.description}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between gap-3">
                <button
                  onClick={() => setSelectedInspectCareer(career)}
                  className="text-xs font-semibold text-slate-500 hover:text-indigo-600 flex items-center gap-1 cursor-pointer"
                >
                  <Info className="w-3.5 h-3.5" />
                  <span>Inspect Weights</span>
                </button>

                <button
                  onClick={() => onSelectCareer(career.id)}
                  id={`select-career-btn-${career.id}`}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      : 'bg-slate-900 hover:bg-indigo-600 text-white shadow-xs'
                  }`}
                >
                  {isSelected ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Selected as Target</span>
                    </>
                  ) : (
                    <>
                      <span>Select Target Role</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Inspect Career Modal */}
      {selectedInspectCareer && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold text-indigo-600 uppercase">
                  {selectedInspectCareer.category}
                </span>
                <h3 className="text-xl font-bold text-slate-900">
                  {selectedInspectCareer.name} Curriculum Specification
                </h3>
              </div>
              <button
                onClick={() => setSelectedInspectCareer(null)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                ✕
              </button>
            </div>

            <p className="text-xs sm:text-sm text-slate-600">
              {selectedInspectCareer.detailedDescription}
            </p>

            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Skill Weight & Justification Table:
              </h4>
              {selectedInspectCareer.requiredSkills.map((rs, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-xs space-y-1"
                >
                  <div className="flex items-center justify-between font-semibold">
                    <span className="text-slate-900 font-bold">{rs.name}</span>
                    <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 text-[10px]">
                      Weight: {rs.weight}/5 • Min: {rs.minRecommendedLevel}
                    </span>
                  </div>
                  <p className="text-slate-600 text-[11px]">{rs.priorityReason}</p>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
              <button
                onClick={() => {
                  onSelectCareer(selectedInspectCareer.id);
                  setSelectedInspectCareer(null);
                }}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold cursor-pointer"
              >
                Set as Active Target Career
              </button>
              <button
                onClick={() => setSelectedInspectCareer(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
