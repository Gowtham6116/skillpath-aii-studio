import React, { useState } from 'react';
import {
  CheckCircle2,
  Sliders,
  ArrowRight,
  Sparkles,
  HelpCircle,
  Save,
} from 'lucide-react';
import { CareerRequirement, SkillLevel, SkillStatus, StudentProfile, StudentSkill } from '../types';

interface SkillAssessmentProps {
  profile: StudentProfile;
  career: CareerRequirement;
  onUpdateSkills: (updatedSkills: StudentSkill[]) => void;
  onProceedToAnalysis: () => void;
}

export const SkillAssessment: React.FC<SkillAssessmentProps> = ({
  profile,
  career,
  onUpdateSkills,
  onProceedToAnalysis,
}) => {
  // Initialize state with all required skills from target career merged with student skills
  const [assessmentSkills, setAssessmentSkills] = useState<StudentSkill[]>(() => {
    const studentMap = new Map<string, StudentSkill>();
    profile.skills.forEach((s) => studentMap.set(s.name.toLowerCase().trim(), s));

    return career.requiredSkills.map((req) => {
      const existing = studentMap.get(req.name.toLowerCase().trim());
      if (existing) {
        return { ...existing };
      }
      return {
        name: req.name,
        category: req.category,
        level: 'Beginner' as SkillLevel,
        status: 'Not Started' as SkillStatus,
      };
    });
  });

  const [hasSaved, setHasSaved] = useState(false);

  const completedCount = assessmentSkills.filter((s) => s.status === 'Completed').length;
  const inProgressCount = assessmentSkills.filter((s) => s.status === 'Learning').length;
  const totalCount = assessmentSkills.length;
  const completionPercentage = Math.round(((completedCount + inProgressCount * 0.5) / totalCount) * 100);

  const handleLevelChange = (skillName: string, level: SkillLevel) => {
    setAssessmentSkills((prev) =>
      prev.map((s) => (s.name === skillName ? { ...s, level } : s))
    );
  };

  const handleStatusChange = (skillName: string, status: SkillStatus) => {
    setAssessmentSkills((prev) =>
      prev.map((s) => (s.name === skillName ? { ...s, status } : s))
    );
  };

  const handleSaveAndProceed = () => {
    onUpdateSkills(assessmentSkills);
    setHasSaved(true);
    onProceedToAnalysis();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Top Banner */}
      <div className="p-6 bg-white rounded-2xl border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <Sliders className="w-4 h-4" />
            </span>
            <h2 className="text-xl font-bold text-slate-900">Skill Competency Assessment</h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500">
            Rate your proficiency across the {career.requiredSkills.length} required competencies for <strong>{career.name}</strong>.
          </p>
        </div>

        <button
          onClick={handleSaveAndProceed}
          id="assessment-save-proceed-btn"
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs flex items-center gap-2 transition cursor-pointer self-start sm:self-auto"
        >
          <span>Calculate Skill Gap</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Progress Indicator Card */}
      <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-700">
            Assessment Status: {completedCount} verified • {inProgressCount} in learning • {totalCount - completedCount - inProgressCount} unstarted
          </span>
          <span className="font-bold text-indigo-600">{completionPercentage}% Covered</span>
        </div>
        <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-300"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
      </div>

      {/* Skills Evaluation List */}
      <div className="space-y-3">
        {assessmentSkills.map((skill) => {
          const reqMatch = career.requiredSkills.find(
            (rs) => rs.name.toLowerCase() === skill.name.toLowerCase()
          );

          return (
            <div
              key={skill.name}
              id={`assessment-row-${skill.name.toLowerCase().replace(/\s+/g, '-')}`}
              className="p-4 sm:p-5 bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:border-slate-300 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              {/* Skill info */}
              <div className="max-w-md">
                <div className="flex items-center gap-2">
                  <h4 className="text-base font-bold text-slate-900">{skill.name}</h4>
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium">
                    {skill.category}
                  </span>
                  {reqMatch && (
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-bold">
                      Weight: {reqMatch.weight}/5
                    </span>
                  )}
                </div>
                {reqMatch && (
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    {reqMatch.priorityReason}
                  </p>
                )}
              </div>

              {/* Controls */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0">
                {/* Status selector */}
                <div className="space-y-1">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                    Status
                  </span>
                  <div className="inline-flex rounded-xl p-1 bg-slate-100 border border-slate-200">
                    {(['Not Started', 'Learning', 'Completed'] as SkillStatus[]).map((status) => (
                      <button
                        key={status}
                        type="button"
                        onClick={() => handleStatusChange(skill.name, status)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                          skill.status === status
                            ? status === 'Completed'
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : status === 'Learning'
                              ? 'bg-amber-600 text-white shadow-xs'
                              : 'bg-slate-700 text-white shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Level selector */}
                <div className="space-y-1">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                    Proficiency Level
                  </span>
                  <div className="inline-flex rounded-xl p-1 bg-slate-100 border border-slate-200">
                    {(['Beginner', 'Intermediate', 'Advanced'] as SkillLevel[]).map((lvl) => (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => handleLevelChange(skill.name, lvl)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                          skill.level === lvl
                            ? 'bg-indigo-600 text-white shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Save & Proceed */}
      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
        <span className="text-xs text-slate-600">
          Ready to inspect matched skills vs priority gaps?
        </span>
        <button
          onClick={handleSaveAndProceed}
          className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>Save & View Skill Gap Analysis</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
