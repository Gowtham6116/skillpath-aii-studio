import React from 'react';
import { GraduationCap, Briefcase, School, ChevronDown } from 'lucide-react';
import { AuthRole } from '../auth/authTypes';

interface RoleSelectorProps {
  selectedRole: AuthRole;
  onChangeRole: (role: AuthRole) => void;
  disabled?: boolean;
}

export const RoleSelector: React.FC<RoleSelectorProps> = ({
  selectedRole,
  onChangeRole,
  disabled = false,
}) => {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label
          htmlFor="college-role-select"
          className="text-xs font-bold text-slate-700"
        >
          Role
        </label>
        <span className="text-[11px] font-normal text-slate-400">
          Select your portal role
        </span>
      </div>

      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
          {selectedRole === 'student' && (
            <GraduationCap className="w-4 h-4 text-indigo-600 transition-colors" />
          )}
          {selectedRole === 'staff' && (
            <Briefcase className="w-4 h-4 text-emerald-600 transition-colors" />
          )}
          {selectedRole === 'campus' && (
            <School className="w-4 h-4 text-amber-600 transition-colors" />
          )}
        </div>

        <select
          id="college-role-select"
          value={selectedRole}
          disabled={disabled}
          onChange={(e) => onChangeRole(e.target.value as AuthRole)}
          className="w-full pl-9 pr-10 py-2.5 bg-white rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-xs sm:text-sm text-slate-900 font-medium transition appearance-none cursor-pointer disabled:bg-slate-50 disabled:text-slate-500"
        >
          <option value="student">Student</option>
          <option value="staff">Staff / Faculty</option>
          <option value="campus">Campus / Admin</option>
        </select>

        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>

      {/* Access Scope Indicator matching the SKILLGAP COMPASS design system */}
      <div className="flex items-center gap-1.5 text-[11px] text-slate-500 px-0.5">
        <span className="font-semibold text-slate-600">Access Scope:</span>
        {selectedRole === 'student' && (
          <span className="inline-flex items-center gap-1 text-indigo-700 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
            Personal Skill Assessment, Gap Analysis & Verified Roadmap
          </span>
        )}
        {selectedRole === 'staff' && (
          <span className="inline-flex items-center gap-1 text-emerald-700 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
            Student Cohort Mentoring, Skill Endorsements & Interventions
          </span>
        )}
        {selectedRole === 'campus' && (
          <span className="inline-flex items-center gap-1 text-amber-700 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
            Campus Macro Placement Analytics, Department Audits & Curricula
          </span>
        )}
      </div>
    </div>
  );
};

