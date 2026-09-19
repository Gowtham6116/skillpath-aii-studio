import React, { useState } from 'react';
import {
  User,
  Plus,
  X,
  Search,
  Check,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Award,
  BookOpen,
  Briefcase,
  Layers,
} from 'lucide-react';
import { StudentProfile, StudentSkill } from '../types';
import { MASTER_SKILLS_LIST, SKILL_CATEGORIES } from '../data/skills';
import { CAREERS_DATA } from '../data/careers';

interface ProfileProps {
  profile: StudentProfile;
  onSaveProfile: (updated: StudentProfile) => void;
  onLoadDemo: () => void;
  onProceedToAssessment: () => void;
}

export const Profile: React.FC<ProfileProps> = ({
  profile,
  onSaveProfile,
  onLoadDemo,
  onProceedToAssessment,
}) => {
  const [formData, setFormData] = useState<StudentProfile>(profile);
  const [skillSearch, setSkillSearch] = useState('');
  const [customSkillName, setCustomSkillName] = useState('');
  const [customSkillCategory, setCustomSkillCategory] = useState<StudentSkill['category']>('Programming');
  const [newProject, setNewProject] = useState('');
  const [newCert, setNewCert] = useState('');
  const [newLang, setNewLang] = useState('');
  const [newTool, setNewTool] = useState('');
  const [savedAlert, setSavedAlert] = useState(false);

  // Search filter for available skills
  const availableSkills = MASTER_SKILLS_LIST.filter(
    (s) =>
      s.name.toLowerCase().includes(skillSearch.toLowerCase()) &&
      !formData.skills.some((existing) => existing.name.toLowerCase() === s.name.toLowerCase())
  );

  const handleAddSkill = (skillDef: { name: string; category: StudentSkill['category'] }) => {
    const newSkill: StudentSkill = {
      name: skillDef.name,
      category: skillDef.category,
      level: 'Intermediate',
      status: 'Completed',
    };
    setFormData((prev) => ({
      ...prev,
      skills: [...prev.skills, newSkill],
    }));
  };

  const handleRemoveSkill = (skillName: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s.name !== skillName),
    }));
  };

  const handleAddCustomSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customSkillName.trim()) return;
    if (formData.skills.some((s) => s.name.toLowerCase() === customSkillName.trim().toLowerCase())) {
      return;
    }
    const newSkill: StudentSkill = {
      name: customSkillName.trim(),
      category: customSkillCategory,
      level: 'Beginner',
      status: 'Completed',
    };
    setFormData((prev) => ({
      ...prev,
      skills: [...prev.skills, newSkill],
    }));
    setCustomSkillName('');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile(formData);
    setSavedAlert(true);
    setTimeout(() => setSavedAlert(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Top Banner */}
      <div className="p-6 bg-white rounded-2xl border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <User className="w-4 h-4" />
            </span>
            <h2 className="text-xl font-bold text-slate-900">Student Profile</h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500">
            Keep your skills, coursework, and projects current for precise gap analysis.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onLoadDemo}
            className="px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 text-amber-600" />
            <span>Load Demo (Ajay)</span>
          </button>
        </div>
      </div>

      {savedAlert && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          Profile updated successfully! Skill-gap calculations have been refreshed.
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Academic Details Card */}
        <div className="p-6 bg-white rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-indigo-600 flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            1. Academic & Personal Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                required
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-1 focus:ring-indigo-600 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-1 focus:ring-indigo-600 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                College / University
              </label>
              <input
                type="text"
                value={formData.college}
                onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                required
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-1 focus:ring-indigo-600 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Department / Major
              </label>
              <input
                type="text"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                required
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-1 focus:ring-indigo-600 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Academic Year
              </label>
              <select
                value={formData.academicYear}
                onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-1 focus:ring-indigo-600 focus:outline-hidden bg-white"
              >
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year (Final Year)</option>
                <option value="Graduate">Postgraduate / Master's</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Cumulative CGPA (out of 10.0)
              </label>
              <input
                type="number"
                step="0.1"
                min="1.0"
                max="10.0"
                value={formData.cgpa}
                onChange={(e) => setFormData({ ...formData, cgpa: parseFloat(e.target.value) || 0 })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-1 focus:ring-indigo-600 focus:outline-hidden"
              />
            </div>
          </div>
        </div>

        {/* Target Career Card */}
        <div className="p-6 bg-white rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-indigo-600 flex items-center gap-2">
            <Briefcase className="w-4 h-4" />
            2. Selected Target Career Goal
          </h3>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Choose your target career path to analyze requirements against:
            </label>
            <select
              value={formData.targetCareerId}
              onChange={(e) => setFormData({ ...formData, targetCareerId: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-semibold focus:ring-1 focus:ring-indigo-600 focus:outline-hidden bg-white"
            >
              {CAREERS_DATA.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.category}) — {c.requiredSkills.length} Core Requirements
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Current Skills Selector Card */}
        <div className="p-6 bg-white rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-indigo-600 flex items-center gap-2">
              <Layers className="w-4 h-4" />
              3. Current Verified Skills ({formData.skills.length})
            </h3>
            <span className="text-xs text-slate-500">
              Select or add all competencies you currently possess
            </span>
          </div>

          {/* Current selected skill chips */}
          <div className="flex flex-wrap gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200/80 min-h-[52px]">
            {formData.skills.length === 0 ? (
              <span className="text-xs text-slate-400 italic">
                No skills added yet. Search and click below to add skills.
              </span>
            ) : (
              formData.skills.map((skill) => (
                <span
                  key={skill.name}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-white border border-slate-300 text-slate-800 shadow-2xs"
                >
                  <span className="text-indigo-600">{skill.name}</span>
                  <span className="text-[10px] text-slate-400">({skill.level})</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill.name)}
                    className="p-0.5 text-slate-400 hover:text-rose-600 transition cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))
            )}
          </div>

          {/* Search & add from master list */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Search & Add from Standard Competencies:
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={skillSearch}
                onChange={(e) => setSkillSearch(e.target.value)}
                placeholder="Type skill name (e.g. Python, SQL, Docker, Power BI, Statistics)..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-1 focus:ring-indigo-600 focus:outline-hidden"
              />
            </div>

            {/* Suggestions Chips */}
            <div className="mt-2.5 flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-1">
              {availableSkills.slice(0, 18).map((skillDef) => (
                <button
                  key={skillDef.name}
                  type="button"
                  onClick={() => handleAddSkill(skillDef)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 border border-slate-200 transition cursor-pointer"
                >
                  <Plus className="w-3 h-3 text-slate-400" />
                  <span>{skillDef.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Add custom skill */}
          <div className="pt-3 border-t border-slate-100">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Add Custom Skill:
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={customSkillName}
                onChange={(e) => setCustomSkillName(e.target.value)}
                placeholder="e.g. Snowflake, PySpark, FastAPI..."
                className="flex-1 px-3.5 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-1 focus:ring-indigo-600 focus:outline-hidden"
              />
              <select
                value={customSkillCategory}
                onChange={(e) => setCustomSkillCategory(e.target.value as any)}
                className="px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
              >
                {SKILL_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={handleAddCustomSkill}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition cursor-pointer"
              >
                Add Skill
              </button>
            </div>
          </div>
        </div>

        {/* Projects, Certifications & Internships Card */}
        <div className="p-6 bg-white rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-indigo-600 flex items-center gap-2">
            <Award className="w-4 h-4" />
            4. Projects, Certifications & Experience
          </h3>

          <div className="space-y-3">
            {/* Projects list */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Completed Projects ({formData.projects.length})
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.projects.map((proj, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs bg-slate-100 text-slate-800 border border-slate-200"
                  >
                    <span>{proj}</span>
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          projects: formData.projects.filter((_, i) => i !== idx),
                        })
                      }
                      className="text-slate-400 hover:text-rose-600 cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newProject}
                  onChange={(e) => setNewProject(e.target.value)}
                  placeholder="e.g. Sales KPI Dashboard, CNN Image Classifier"
                  className="flex-1 px-3.5 py-1.5 text-xs rounded-xl border border-slate-300"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (newProject.trim()) {
                      setFormData({ ...formData, projects: [...formData.projects, newProject.trim()] });
                      setNewProject('');
                    }
                  }}
                  className="px-3 py-1.5 rounded-xl bg-slate-200 text-slate-700 text-xs font-medium hover:bg-slate-300 cursor-pointer"
                >
                  Add Project
                </button>
              </div>
            </div>

            {/* Certifications */}
            <div className="pt-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Certifications ({formData.certifications.length})
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.certifications.map((cert, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs bg-slate-100 text-slate-800 border border-slate-200"
                  >
                    <span>{cert}</span>
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          certifications: formData.certifications.filter((_, i) => i !== idx),
                        })
                      }
                      className="text-slate-400 hover:text-rose-600 cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newCert}
                  onChange={(e) => setNewCert(e.target.value)}
                  placeholder="e.g. AWS Certified Cloud Practitioner, Microsoft Power BI Data Analyst"
                  className="flex-1 px-3.5 py-1.5 text-xs rounded-xl border border-slate-300"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (newCert.trim()) {
                      setFormData({ ...formData, certifications: [...formData.certifications, newCert.trim()] });
                      setNewCert('');
                    }
                  }}
                  className="px-3 py-1.5 rounded-xl bg-slate-200 text-slate-700 text-xs font-medium hover:bg-slate-300 cursor-pointer"
                >
                  Add Cert
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <button
            type="submit"
            id="profile-save-btn"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>Save Profile Changes</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onSaveProfile(formData);
              onProceedToAssessment();
            }}
            id="profile-proceed-assessment-btn"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Proceed to Skill Assessment</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};
