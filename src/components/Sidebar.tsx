import React from 'react';
import {
  LayoutDashboard,
  User,
  Compass,
  GitCompare,
  Milestone,
  FolderGit2,
  TrendingUp,
  Network,
  Settings,
  Sparkles,
  ChevronRight,
  LogOut,
  GraduationCap,
  Briefcase,
  School,
  Users,
  BarChart3,
  BookOpen,
  CalendarCheck,
  FileText,
  Building2,
  PieChart,
  Layers,
  Award,
} from 'lucide-react';
import { UserAccount, UserRole } from '../types';
import { SkillgapCompassLogo } from './SkillgapCompassLogo';

export type NavPage =
  | 'landing'
  | 'login'
  | 'dashboard'
  | 'profile'
  | 'careers'
  | 'assessment'
  | 'analysis'
  | 'courses'
  | 'roadmap'
  | 'projects'
  | 'progress'
  | 'certificates'
  | 'skillmap'
  | 'staff'
  | 'admin'
  | 'settings'
  | 'story';

interface SidebarProps {
  currentPage: NavPage;
  onNavigate: (page: NavPage, subview?: string) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  careerReadinessScore: number;
  targetCareerName: string;
  isDemoMode: boolean;
  onOpenAssistant: () => void;
  currentUser?: UserAccount | null;
  onOpenLogin?: () => void;
  onSwitchRole?: (role: UserRole) => void;
  onLogout?: () => void;
  activeStaffTab?: string;
  activeAdminTab?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onNavigate,
  isOpenMobile,
  onCloseMobile,
  careerReadinessScore,
  onOpenAssistant,
  currentUser,
  onLogout,
  activeStaffTab = 'dashboard',
  activeAdminTab = 'dashboard',
}) => {
  const activeRole: UserRole = currentUser?.role || 'student';

  const handleNav = (page: NavPage, subview?: string) => {
    onNavigate(page, subview);
    onCloseMobile();
  };

  // 1. STUDENT NAVIGATION
  const studentNavItems = [
    { id: 'dashboard' as NavPage, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'profile' as NavPage, label: 'My Profile', icon: User },
    { id: 'careers' as NavPage, label: 'Career', icon: Compass },
    { id: 'analysis' as NavPage, label: 'Skill Gap', icon: GitCompare },
    { id: 'courses' as NavPage, label: 'Courses', icon: BookOpen },
    { id: 'roadmap' as NavPage, label: 'Roadmap', icon: Milestone },
    { id: 'projects' as NavPage, label: 'Projects', icon: FolderGit2 },
    { id: 'skillmap' as NavPage, label: 'Skill Map', icon: Network },
    { id: 'progress' as NavPage, label: 'Progress', icon: TrendingUp },
    { id: 'certificates' as NavPage, label: 'Certificates', icon: Award },
  ];

  // 2. STAFF NAVIGATION
  const staffNavItems = [
    { subview: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { subview: 'students', label: 'My Students', icon: Users },
    { subview: 'analytics', label: 'Skill Analytics', icon: BarChart3 },
    { subview: 'course-performance', label: 'Course Performance', icon: Award },
    { subview: 'mentoring', label: 'Mentoring', icon: BookOpen },
    { subview: 'interventions', label: 'Interventions', icon: CalendarCheck },
    { subview: 'reports', label: 'Reports', icon: FileText },
  ];

  // 3. CAMPUS NAVIGATION
  const campusNavItems = [
    { subview: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { subview: 'students', label: 'Student Analytics', icon: Users },
    { subview: 'skills', label: 'Skill Intelligence', icon: BarChart3 },
    { subview: 'courses', label: 'Course Intelligence', icon: Award },
    { subview: 'careers', label: 'Career Demand', icon: PieChart },
    { subview: 'training', label: 'Training Planner', icon: Layers },
    { subview: 'departments', label: 'Departments', icon: Building2 },
    { subview: 'reports', label: 'Reports', icon: FileText },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden backdrop-blur-xs transition-opacity"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white border-r border-slate-200 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Section 10: SIDEBAR BRANDING */}
        <div className="p-4 border-b border-slate-100">
          <button
            onClick={() => {
              if (activeRole === 'student') handleNav('dashboard');
              else if (activeRole === 'staff') handleNav('staff');
              else handleNav('admin');
            }}
            className="flex items-center text-left w-full cursor-pointer group hover:opacity-90 transition"
          >
            <SkillgapCompassLogo variant="horizontal" size="md" showTagline={true} />
          </button>
        </div>

        {/* Active Role Badge & User Info */}
        <div className="px-3.5 pt-3 pb-2">
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <div className="flex items-center gap-2.5">
              <span
                className={`w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-bold shrink-0 ${
                  activeRole === 'student'
                    ? 'bg-indigo-600'
                    : activeRole === 'staff'
                    ? 'bg-emerald-600'
                    : 'bg-amber-600'
                }`}
              >
                {activeRole === 'student' ? (
                  <GraduationCap className="w-4 h-4" />
                ) : activeRole === 'staff' ? (
                  <Briefcase className="w-4 h-4" />
                ) : (
                  <School className="w-4 h-4" />
                )}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded tracking-wide ${
                      activeRole === 'student'
                        ? 'bg-indigo-100 text-indigo-800'
                        : activeRole === 'staff'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {activeRole.toUpperCase()}
                  </span>
                </div>
                <h4 className="font-bold text-xs text-slate-900 truncate mt-0.5">
                  {currentUser?.name || 'Ajay Kumar'}
                </h4>
                <p className="text-[10px] text-slate-500 truncate">
                  {currentUser?.department || currentUser?.id || 'Computer Science'}
                </p>
              </div>
            </div>

            {/* If Student: compact readiness indicator */}
            {activeRole === 'student' && (
              <div className="pt-2 border-t border-slate-200 text-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] text-slate-500">Readiness</span>
                  <span className="font-bold text-indigo-700">{careerReadinessScore}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                    style={{ width: `${careerReadinessScore}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Links — STRICT ROLE-BASED VISIBILITY */}
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          {/* STUDENT ROLE: Shows ONLY student items */}
          {activeRole === 'student' && (
            <>
              {studentNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;
                return (
                  <button
                    key={item.id}
                    id={`nav-item-${item.id}`}
                    onClick={() => handleNav(item.id)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                      isActive
                        ? 'bg-indigo-50 text-indigo-700 font-bold shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <Icon
                      className={`w-4 h-4 shrink-0 ${
                        isActive ? 'text-indigo-600' : 'text-slate-400'
                      }`}
                    />
                    <span className="flex-1 text-left truncate">{item.label}</span>
                    {isActive && <ChevronRight className="w-3.5 h-3.5 text-indigo-600" />}
                  </button>
                );
              })}

              {/* AI Assistant in Student Navigation */}
              <button
                onClick={onOpenAssistant}
                id="nav-item-ai-assistant"
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-600 hover:text-indigo-700 hover:bg-indigo-50/60 transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-indigo-500 shrink-0" />
                <span className="flex-1 text-left truncate">AI Assistant</span>
              </button>
            </>
          )}

          {/* STAFF ROLE: Shows ONLY staff items */}
          {activeRole === 'staff' && (
            <>
              {staffNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === 'staff' && activeStaffTab === item.subview;
                return (
                  <button
                    key={item.subview}
                    id={`nav-staff-${item.subview}`}
                    onClick={() => handleNav('staff', item.subview)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                      isActive
                        ? 'bg-emerald-50 text-emerald-800 font-bold shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <Icon
                      className={`w-4 h-4 shrink-0 ${
                        isActive ? 'text-emerald-600' : 'text-slate-400'
                      }`}
                    />
                    <span className="flex-1 text-left truncate">{item.label}</span>
                    {isActive && <ChevronRight className="w-3.5 h-3.5 text-emerald-600" />}
                  </button>
                );
              })}
            </>
          )}

          {/* CAMPUS ROLE: Shows ONLY campus items */}
          {activeRole === 'campus' && (
            <>
              {campusNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === 'admin' && activeAdminTab === item.subview;
                return (
                  <button
                    key={item.subview}
                    id={`nav-campus-${item.subview}`}
                    onClick={() => handleNav('admin', item.subview)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                      isActive
                        ? 'bg-amber-50 text-amber-800 font-bold shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <Icon
                      className={`w-4 h-4 shrink-0 ${
                        isActive ? 'text-amber-600' : 'text-slate-400'
                      }`}
                    />
                    <span className="flex-1 text-left truncate">{item.label}</span>
                    {isActive && <ChevronRight className="w-3.5 h-3.5 text-amber-600" />}
                  </button>
                );
              })}
            </>
          )}
        </nav>

        {/* Bottom Section: Settings & Logout */}
        <div className="p-3 border-t border-slate-100 space-y-1">
          {/* Settings */}
          <button
            onClick={() => handleNav('settings')}
            id="nav-item-settings"
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition cursor-pointer ${
              currentPage === 'settings'
                ? 'bg-slate-100 text-slate-900 font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Settings className="w-4 h-4 text-slate-400" />
            <span className="flex-1 text-left">Settings</span>
          </button>

          {/* Logout */}
          {onLogout && (
            <button
              onClick={onLogout}
              id="nav-item-logout"
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-rose-600 hover:bg-rose-50 transition cursor-pointer"
            >
              <LogOut className="w-4 h-4 text-rose-500" />
              <span className="flex-1 text-left">Logout</span>
            </button>
          )}
        </div>
      </aside>
    </>
  );
};
