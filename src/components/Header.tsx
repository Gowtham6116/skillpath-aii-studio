import React from 'react';
import {
  Menu,
  Sparkles,
  RefreshCw,
  Award,
  ArrowRight,
  Compass,
  GraduationCap,
  Briefcase,
  School,
  LogIn,
  LogOut,
  UserCheck,
} from 'lucide-react';
import { NavPage } from './Sidebar';
import { UserAccount, UserRole } from '../types';
import { SkillgapCompassEmblem } from './SkillgapCompassLogo';

interface HeaderProps {
  currentPage: NavPage;
  onNavigate: (page: NavPage) => void;
  onOpenMobileSidebar: () => void;
  careerReadinessScore: number;
  targetCareerName: string;
  studentName: string;
  isDemoMode: boolean;
  onLoadDemo: () => void;
  onOpenAssistant: () => void;
  hasGeminiKey: boolean;
  currentUser?: UserAccount | null;
  onSwitchRole?: (role: UserRole) => void;
  onOpenLogin?: () => void;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentPage,
  onNavigate,
  onOpenMobileSidebar,
  careerReadinessScore,
  targetCareerName,
  studentName,
  isDemoMode,
  onLoadDemo,
  onOpenAssistant,
  hasGeminiKey,
  currentUser,
  onSwitchRole,
  onOpenLogin,
  onLogout,
}) => {
  const getPageTitle = (page: NavPage) => {
    switch (page) {
      case 'login':
        return 'Multi-Role Institutional Portal';
      case 'staff':
        return 'Staff & Faculty Mentorship Sector';
      case 'admin':
        return 'Campus Leadership & Placement Intelligence';
      case 'dashboard':
        return 'Career Readiness Dashboard';
      case 'profile':
        return 'Student Profile';
      case 'careers':
        return 'Select Target Career';
      case 'assessment':
        return 'Skill Assessment Matrix';
      case 'analysis':
        return 'Skill Gap Analysis & Priority';
      case 'roadmap':
        return 'Personalized Learning Roadmap';
      case 'projects':
        return 'Recommended Capstone Projects';
      case 'progress':
        return 'Progress & Milestones';
      case 'skillmap':
        return 'Visual Skill Master Map';
      case 'settings':
        return 'System & Profile Settings';
      case 'story':
        return 'Hackathon Presentation & Demo Story';
      default:
        return 'SKILLGAP COMPASS';
    }
  };

  const activeRole: UserRole = currentUser?.role || 'student';

  return (
    <header className="sticky top-0 z-30 min-h-16 bg-white/90 backdrop-blur-md border-b border-slate-200 px-4 lg:px-8 py-2.5 flex flex-wrap items-center justify-between gap-3">
      {/* Left section: Hamburger, Logo & Title */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        <button
          onClick={onOpenMobileSidebar}
          id="mobile-sidebar-toggle-btn"
          aria-label="Open navigation menu"
          className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="lg:hidden flex items-center">
          <SkillgapCompassEmblem className="w-7 h-7 shrink-0" />
        </div>

        <div>
          <h1 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
            {getPageTitle(currentPage)}
          </h1>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            {activeRole === 'student' ? (
              <>
                <span>
                  Student: <strong className="text-slate-700">{currentUser?.name || studentName}</strong>
                </span>
                <span>•</span>
                <button
                  onClick={() => onNavigate('careers')}
                  className="hover:text-indigo-600 hover:underline flex items-center gap-1 font-medium text-slate-600 cursor-pointer"
                >
                  <Compass className="w-3 h-3 text-indigo-500" />
                  <span>Target: {targetCareerName}</span>
                </button>
              </>
            ) : activeRole === 'staff' ? (
              <>
                <span>
                  Mentor: <strong className="text-slate-700">{currentUser?.name}</strong>
                </span>
                <span>•</span>
                <span className="text-emerald-700 font-semibold">Faculty Placement Cell</span>
              </>
            ) : (
              <>
                <span>
                  Leadership: <strong className="text-slate-700">{currentUser?.name}</strong>
                </span>
                <span>•</span>
                <span className="text-amber-700 font-semibold">Campus Administration</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Right Section: Role Quick Switcher & Actions */}
      <div className="flex items-center flex-wrap gap-2 sm:gap-2.5">
        {/* Quick Role Switcher Pills (Ultra-convenient for testing & review) */}
        {onSwitchRole && (
          <div className="hidden md:flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs">
            <button
              onClick={() => onSwitchRole('student')}
              title="Switch to Student Sector"
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                activeRole === 'student'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5 text-indigo-600" />
              <span>Student</span>
            </button>

            <button
              onClick={() => onSwitchRole('staff')}
              title="Switch to Staff / Faculty Sector"
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                activeRole === 'staff'
                  ? 'bg-white text-emerald-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5 text-emerald-600" />
              <span>Staff</span>
            </button>

            <button
              onClick={() => onSwitchRole('campus')}
              title="Switch to Campus Admin Sector"
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                activeRole === 'campus'
                  ? 'bg-white text-amber-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <School className="w-3.5 h-3.5 text-amber-600" />
              <span>Campus</span>
            </button>
          </div>
        )}

        {/* Role / Login / Logout Buttons */}
        {onOpenLogin && (
          <button
            onClick={onOpenLogin}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:border-indigo-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition cursor-pointer"
            title="Switch Account / Open Login Hub"
          >
            <LogIn className="w-3.5 h-3.5 text-indigo-600" />
            <span className="hidden sm:inline">Portals / Login</span>
            <span className="sm:hidden">Login</span>
          </button>
        )}

        {currentUser && onLogout && (
          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-rose-200 hover:bg-rose-50 text-rose-700 text-xs font-semibold transition cursor-pointer"
            title="Sign out of current institutional account"
          >
            <LogOut className="w-3.5 h-3.5 text-rose-600" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        )}

        {/* Career Readiness Badge for Student role */}
        {activeRole === 'student' && (
          <div
            onClick={() => onNavigate('analysis')}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer hover:border-indigo-300 transition"
            title="Click to view full Skill Gap breakdown"
          >
            <Award className="w-4 h-4 text-indigo-600" />
            <div className="text-xs">
              <span className="text-slate-500">Readiness: </span>
              <span className="font-bold text-slate-900">{careerReadinessScore}%</span>
            </div>
          </div>
        )}

        {/* AI Assistant Button */}
        <button
          onClick={onOpenAssistant}
          id="header-open-assistant-btn"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-200" />
          <span className="hidden sm:inline">Ask AI</span>
          <span className="sm:hidden">AI</span>
        </button>
      </div>
    </header>
  );
};
