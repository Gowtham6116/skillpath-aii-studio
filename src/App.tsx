import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Sidebar, NavPage } from './components/Sidebar';
import { Header } from './components/Header';
import { AIChat } from './components/AIChat';
import { HackathonStoryModal } from './components/HackathonStoryModal';

// Pages
import { Landing } from './pages/Landing';
import { Dashboard } from './pages/Dashboard';
import { Profile } from './pages/Profile';
import { Careers } from './pages/Careers';
import { SkillAssessment } from './pages/SkillAssessment';
import { SkillAnalysis } from './pages/SkillAnalysis';
import { Roadmap } from './pages/Roadmap';
import { Projects } from './pages/Projects';
import { Progress } from './pages/Progress';
import { SkillMasterMap } from './pages/SkillMasterMap';
import { AdminView, CampusSubView } from './pages/AdminView';
import { Settings } from './pages/Settings';
import { Login } from './pages/Login';
import { StaffPortal, StaffSubView } from './pages/StaffPortal';
import { CourseLibrary } from './pages/CourseLibrary';
import { CertificatesPage } from './pages/Certificates';

// Data & Services
import { DEMO_STUDENT, DEMO_ACCOUNTS } from './data/demoData';
import { CAREERS_DATA } from './data/careers';
import { analyzeSkills } from './services/skillAnalysis';
import { generateDeterministicRoadmap } from './services/roadmapGenerator';
import { requestRoadmapGeneration, checkBackendHealth } from './services/api';
import {
  GeneratedRoadmap,
  SkillStatus,
  StudentProfile,
  StudentSkill,
  UserAccount,
  UserRole,
} from './types';
import { AuthSession } from './auth/authTypes';
import { AuthService } from './auth/authService';
import { ALL_DEMO_ACCOUNTS, COMMON_DEMO_PASSWORD } from './auth/demoAccounts';
import {
  resolveRoute,
  pageToPath,
  isPathAuthorizedForRole,
  getRoleDefaultPath,
} from './router/routeGuard';

export default function App() {
  // Session determination: website MUST open on login page unless a valid session exists
  const [authSession, setAuthSession] = useState<AuthSession | null>(() => {
    return AuthService.getCurrentSession();
  });

  const [currentPage, setCurrentPage] = useState<NavPage>(() => {
    const session = AuthService.getCurrentSession();
    if (!session) return 'login';
    const resolution = resolveRoute(window.location.pathname, session.role);
    return resolution.page;
  });

  const [activeStaffTab, setActiveStaffTab] = useState<StaffSubView>(() => {
    const session = AuthService.getCurrentSession();
    if (session && session.role === 'staff') {
      const resolution = resolveRoute(window.location.pathname, session.role);
      return (resolution.subview as StaffSubView) || 'dashboard';
    }
    return 'dashboard';
  });

  const [activeAdminTab, setActiveAdminTab] = useState<CampusSubView>(() => {
    const session = AuthService.getCurrentSession();
    if (session && session.role === 'campus') {
      const resolution = resolveRoute(window.location.pathname, session.role);
      return (resolution.subview as CampusSubView) || 'dashboard';
    }
    return 'dashboard';
  });

  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [isStoryOpen, setIsStoryOpen] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(true);
  const [hasGeminiKey, setHasGeminiKey] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [recentUpdateAlert, setRecentUpdateAlert] = useState<string | null>(null);

  // Authenticated user state across Student, Staff, and Campus roles
  const [currentUser, setCurrentUser] = useState<UserAccount>(() => {
    const session = AuthService.getCurrentSession();
    if (session) {
      const found = ALL_DEMO_ACCOUNTS.find(
        (acc) => acc.registerNumber.toUpperCase() === session.registerNumber.toUpperCase()
      );
      if (found?.userAccount) return found.userAccount;
      const uRole: UserRole = session.role === 'campus' ? 'campus' : session.role === 'staff' ? 'staff' : 'student';
      return {
        id: session.registerNumber,
        name: session.name,
        email: `${session.registerNumber.toLowerCase()}@college.edu`,
        role: uRole,
        designation: session.role === 'student' ? 'Undergraduate Scholar' : session.role === 'staff' ? 'Faculty Mentor' : 'Campus Placement Director',
        organization: 'National Institute of Engineering & Technology',
        department: session.department || 'Computer Science Engineering',
        avatarInitials: session.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() || 'ST',
        avatarColor: 'bg-indigo-600',
      };
    }
    return DEMO_ACCOUNTS.student.user;
  });

  useEffect(() => {
    try {
      localStorage.setItem('skillpath_current_user', JSON.stringify(currentUser));
    } catch {}
  }, [currentUser]);

  // Profile state initialized with DEMO_STUDENT or active session's profile
  const [profile, setProfile] = useState<StudentProfile>(() => {
    try {
      const saved = localStorage.getItem('skillpath_student_profile');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEMO_STUDENT;
  });

  // Persist profile
  useEffect(() => {
    try {
      localStorage.setItem('skillpath_student_profile', JSON.stringify(profile));
    } catch {}
  }, [profile]);

  // Check health and Gemini key
  useEffect(() => {
    checkBackendHealth().then((res) => {
      setHasGeminiKey(res.geminiConfigured);
    });
  }, []);

  // Initial routing check: ensure unauthorized paths or fresh visitor redirects appropriately
  useEffect(() => {
    const session = AuthService.getCurrentSession();
    if (!session) {
      if (window.location.pathname !== '/login') {
        window.history.replaceState(null, '', '/login');
      }
      if (currentPage !== 'login') {
        setCurrentPage('login');
      }
    } else {
      setAuthSession(session);
      const res = resolveRoute(window.location.pathname, session.role);
      if (window.location.pathname !== res.canonicalPath) {
        window.history.replaceState(null, '', res.canonicalPath);
      }
      if (res.openAssistant) {
        setIsAIChatOpen(true);
      }
    }
  }, []);

  // Popstate listener for back/forward navigation
  useEffect(() => {
    const handlePopState = () => {
      const session = AuthService.getCurrentSession();
      if (!session) {
        setAuthSession(null);
        setCurrentPage('login');
        window.history.replaceState(null, '', '/login');
        return;
      }

      setAuthSession(session);
      const res = resolveRoute(window.location.pathname, session.role);
      setCurrentPage(res.page);
      if (res.subview) {
        if (res.page === 'staff') setActiveStaffTab(res.subview as StaffSubView);
        if (res.page === 'admin') setActiveAdminTab(res.subview as CampusSubView);
      }
      if (res.openAssistant) {
        setIsAIChatOpen(true);
      }
      if (window.location.pathname !== res.canonicalPath) {
        window.history.replaceState(null, '', res.canonicalPath);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Compute Skill-Gap Analysis reactively
  const analysis = useMemo(() => {
    return analyzeSkills(profile);
  }, [profile]);

  // Roadmap state initialized deterministically
  const [roadmap, setRoadmap] = useState<GeneratedRoadmap>(() => {
    return generateDeterministicRoadmap(profile, analysis);
  });

  // Dynamically update roadmap when profile or analysis changes
  useEffect(() => {
    setRoadmap((prev) => {
      const updated = generateDeterministicRoadmap(profile, analysis);
      const completedTaskIds = new Set<string>();
      prev.weeks.forEach((w) => {
        w.tasks.forEach((t) => {
          if (t.completed) completedTaskIds.add(t.id);
        });
      });

      return {
        ...updated,
        weeks: updated.weeks.map((w) => ({
          ...w,
          tasks: w.tasks.map((t) => ({
            ...t,
            completed: completedTaskIds.has(t.id) || t.completed,
          })),
        })),
      };
    });
  }, [profile, analysis.careerReadinessScore, profile.targetCareerId]);

  // Role dashboard fallback
  const getRoleDashboard = useCallback((role: UserRole): NavPage => {
    if (role === 'staff') return 'staff';
    if (role === 'campus') return 'admin';
    return 'dashboard';
  }, []);

  // Route protection effect: unauthorized access redirects immediately
  useEffect(() => {
    const session = AuthService.getCurrentSession();
    if (!session) {
      if (currentPage !== 'login') {
        setCurrentPage('login');
        window.history.replaceState(null, '', '/login');
      }
      return;
    }

    const currentRole = session.role;
    const currentSub = currentPage === 'staff' ? activeStaffTab : currentPage === 'admin' ? activeAdminTab : undefined;
    const currentCanonical = pageToPath(currentPage, currentSub, currentRole);

    if (!isPathAuthorizedForRole(currentCanonical, currentRole)) {
      const fallbackPath = getRoleDefaultPath(currentRole);
      const res = resolveRoute(fallbackPath, currentRole);
      setCurrentPage(res.page);
      if (res.subview) {
        if (res.page === 'staff') setActiveStaffTab(res.subview as StaffSubView);
        if (res.page === 'admin') setActiveAdminTab(res.subview as CampusSubView);
      }
      window.history.replaceState(null, '', res.canonicalPath);
      setRecentUpdateAlert(
        `Access restricted: Unauthorized route redirected to your ${currentRole.toUpperCase()} sector.`
      );
      setTimeout(() => setRecentUpdateAlert(null), 4000);
    }
  }, [currentPage, activeStaffTab, activeAdminTab]);

  // Handle navigation from Sidebar, Header, or child pages
  const handleNavigate = (page: NavPage, subview?: string) => {
    if (page === 'story') {
      setIsStoryOpen(true);
      return;
    }

    const session = AuthService.getCurrentSession();
    if (!session && page !== 'login') {
      setCurrentPage('login');
      window.history.replaceState(null, '', '/login');
      return;
    }

    if (page === 'login') {
      setCurrentPage('login');
      window.history.pushState(null, '', '/login');
      return;
    }

    const role = session ? session.role : currentUser.role;
    const targetPath = pageToPath(page, subview, role);

    if (session && !isPathAuthorizedForRole(targetPath, role)) {
      const fallbackPath = getRoleDefaultPath(role);
      const res = resolveRoute(fallbackPath, role);
      setCurrentPage(res.page);
      if (res.subview) {
        if (res.page === 'staff') setActiveStaffTab(res.subview as StaffSubView);
        if (res.page === 'admin') setActiveAdminTab(res.subview as CampusSubView);
      }
      window.history.replaceState(null, '', res.canonicalPath);
      setRecentUpdateAlert(
        `Access restricted: Unauthorized route redirected to ${role.toUpperCase()} sector.`
      );
      setTimeout(() => setRecentUpdateAlert(null), 4000);
      return;
    }

    if (page === 'staff' && subview) {
      setActiveStaffTab(subview as StaffSubView);
    }
    if (page === 'admin' && subview) {
      setActiveAdminTab(subview as CampusSubView);
    }

    setCurrentPage(page);
    try {
      window.history.pushState(null, '', targetPath);
    } catch {}
  };

  // Load Demo Student Profile (Ajay - Data Analyst)
  const handleLoadDemo = () => {
    setProfile(DEMO_STUDENT);
    setCurrentUser(DEMO_ACCOUNTS.student.user);
    setIsDemoMode(true);
    setCurrentPage('dashboard');
    try {
      window.history.pushState(null, '', '/dashboard');
    } catch {}
    setRecentUpdateAlert('Loaded Ajay Kumar’s demo profile (Data Analyst goal, 72% initial readiness).');
    setTimeout(() => setRecentUpdateAlert(null), 5000);
  };

  // SECTION 8: ROLE SWITCHING (Demo Feature)
  const handleSwitchRole = (role: UserRole) => {
    const targetAccount = DEMO_ACCOUNTS[role];
    setCurrentUser(targetAccount.user);

    // Sync session so route guards match
    const demoDef = ALL_DEMO_ACCOUNTS.find((a) => a.role === role);
    if (demoDef) {
      const res = AuthService.login(demoDef.registerNumber, COMMON_DEMO_PASSWORD, role);
      if (res.session) {
        setAuthSession(res.session);
      }
    }

    let targetPath = '/dashboard';
    if (role === 'student') {
      setCurrentPage('dashboard');
      targetPath = '/dashboard';
      setRecentUpdateAlert(`Switched to Student Sector: logged in as ${targetAccount.user.name}.`);
    } else if (role === 'staff') {
      setCurrentPage('staff');
      setActiveStaffTab('dashboard');
      targetPath = '/staff/dashboard';
      setRecentUpdateAlert(`Switched to Staff Sector: logged in as ${targetAccount.user.name} (${targetAccount.user.designation}).`);
    } else if (role === 'campus') {
      setCurrentPage('admin');
      setActiveAdminTab('dashboard');
      targetPath = '/campus/dashboard';
      setRecentUpdateAlert(`Switched to Campus Leadership: logged in as ${targetAccount.user.name} (${targetAccount.user.designation}).`);
    }

    try {
      window.history.pushState(null, '', targetPath);
    } catch {}
    setTimeout(() => setRecentUpdateAlert(null), 5000);
  };

  // Handle successful login from Login page
  const handleLoginSuccess = (session: AuthSession) => {
    setAuthSession(session);

    const found = ALL_DEMO_ACCOUNTS.find(
      (acc) => acc.registerNumber.toUpperCase() === session.registerNumber.toUpperCase()
    );

    const userRole: UserRole = session.role === 'campus' ? 'campus' : session.role === 'staff' ? 'staff' : 'student';

    const userAccount: UserAccount = found?.userAccount || {
      id: session.registerNumber,
      name: session.name,
      email: `${session.registerNumber.toLowerCase()}@college.edu`,
      role: userRole,
      designation: session.role === 'student' ? 'Undergraduate Scholar' : session.role === 'staff' ? 'Faculty Mentor' : 'Campus Placement Director',
      organization: 'National Institute of Engineering & Technology',
      department: session.department || 'Computer Science Engineering',
      avatarInitials: session.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() || 'ST',
      avatarColor: 'bg-indigo-600',
    };

    setCurrentUser(userAccount);

    let targetPath = '/dashboard';
    if (session.role === 'student') {
      if (found?.profileData) {
        setProfile((prev) => ({
          ...prev,
          ...found.profileData,
          fullName: session.name,
        }));
      } else {
        setProfile((prev) => ({
          ...prev,
          fullName: session.name,
          department: session.department || prev.department,
        }));
      }
      setCurrentPage('dashboard');
      targetPath = '/dashboard';
    } else if (session.role === 'staff') {
      setActiveStaffTab('dashboard');
      setCurrentPage('staff');
      targetPath = '/staff/dashboard';
    } else {
      setActiveAdminTab('dashboard');
      setCurrentPage('admin');
      targetPath = '/campus/dashboard';
    }

    try {
      window.history.replaceState(null, '', targetPath);
    } catch {}

    setRecentUpdateAlert(`Welcome, ${session.name}! Authenticated to ${session.role.toUpperCase()} sector.`);
    setTimeout(() => setRecentUpdateAlert(null), 5000);
  };

  // Sign out and return to Login
  const handleLogout = () => {
    AuthService.logout();
    setAuthSession(null);
    setCurrentPage('login');
    try {
      window.history.replaceState(null, '', '/login');
    } catch {}
    setRecentUpdateAlert('You have signed out of your institutional account session.');
    setTimeout(() => setRecentUpdateAlert(null), 4000);
  };

  // Reset to fresh blank profile
  const handleResetToFresh = () => {
    const freshProfile: StudentProfile = {
      id: 'student-new',
      fullName: 'New Student',
      email: 'student@university.edu',
      college: 'National Institute of Technology',
      department: 'Computer Science and Engineering',
      academicYear: '3rd Year',
      cgpa: 7.8,
      skills: [
        { name: 'Python', category: 'Programming', level: 'Intermediate', status: 'Completed' },
        { name: 'HTML', category: 'Programming', level: 'Beginner', status: 'Completed' },
      ],
      programmingLanguages: ['Python'],
      tools: ['VS Code'],
      certifications: [],
      internships: [],
      projects: ['Basic Portfolio Website'],
      interests: ['Software Development', 'Data Science'],
      targetCareerId: 'data-analyst',
    };
    setProfile(freshProfile);
    setIsDemoMode(false);
    setRecentUpdateAlert('Reset profile to blank student template.');
    setTimeout(() => setRecentUpdateAlert(null), 4000);
  };

  // Handle Mark Skill Completed - THE DYNAMIC RECALCULATION ENGINE
  const handleMarkSkillCompleted = (skillName: string) => {
    const trimmedName = skillName.trim();
    const existingIndex = profile.skills.findIndex(
      (s) => s.name.toLowerCase() === trimmedName.toLowerCase()
    );

    let updatedSkills: StudentSkill[];
    if (existingIndex >= 0) {
      updatedSkills = [...profile.skills];
      updatedSkills[existingIndex] = {
        ...updatedSkills[existingIndex],
        status: 'Completed',
        level: updatedSkills[existingIndex].level === 'Beginner' ? 'Intermediate' : updatedSkills[existingIndex].level,
      };
    } else {
      updatedSkills = [
        ...profile.skills,
        {
          name: trimmedName,
          category: 'Data',
          level: 'Intermediate',
          status: 'Completed',
        },
      ];
    }

    const updatedProfile = {
      ...profile,
      skills: updatedSkills,
    };

    const newAnalysis = analyzeSkills(updatedProfile);
    const scoreDiff = newAnalysis.careerReadinessScore - analysis.careerReadinessScore;

    setProfile(updatedProfile);

    const diffMessage =
      scoreDiff > 0
        ? `Readiness score increased by +${scoreDiff}% to ${newAnalysis.careerReadinessScore}%!`
        : `Skill marked as verified in your profile.`;

    setRecentUpdateAlert(`🎉 ${trimmedName} completed! ${diffMessage} Roadmap updated dynamically.`);
    setTimeout(() => setRecentUpdateAlert(null), 6000);
  };

  // Toggle individual task in roadmap
  const handleToggleTask = (weekIndex: number, taskId: string) => {
    setRoadmap((prev) => {
      const newWeeks = [...prev.weeks];
      const targetWeek = { ...newWeeks[weekIndex] };
      targetWeek.tasks = targetWeek.tasks.map((t) =>
        t.id === taskId ? { ...t, completed: !t.completed } : t
      );
      const allDone = targetWeek.tasks.every((t) => t.completed);
      targetWeek.isCompleted = allDone;
      newWeeks[weekIndex] = targetWeek;
      return { ...prev, weeks: newWeeks };
    });
  };

  // Regenerate roadmap
  const handleRegenerateRoadmap = async () => {
    setIsGeneratingAI(true);
    try {
      const newRoadmap = await requestRoadmapGeneration(profile);
      setRoadmap(newRoadmap);
      setRecentUpdateAlert(
        newRoadmap.isAI
          ? 'Personalized Roadmap synthesized by Gemini 3.8 Flash!'
          : 'Roadmap recalculated using deterministic career rules engine.'
      );
      setTimeout(() => setRecentUpdateAlert(null), 5000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  // Toggle Skill Status in Visual Map
  const handleToggleSkillStatus = (skillName: string, newStatus: SkillStatus) => {
    const existingIndex = profile.skills.findIndex(
      (s) => s.name.toLowerCase() === skillName.toLowerCase()
    );

    let updatedSkills: StudentSkill[];
    if (existingIndex >= 0) {
      updatedSkills = [...profile.skills];
      updatedSkills[existingIndex] = {
        ...updatedSkills[existingIndex],
        status: newStatus,
      };
    } else {
      updatedSkills = [
        ...profile.skills,
        {
          name: skillName,
          category: 'Programming',
          level: 'Beginner',
          status: newStatus,
        },
      ];
    }

    setProfile({ ...profile, skills: updatedSkills });
  };

  // Change Target Career
  const handleSelectCareer = (careerId: string) => {
    setProfile((prev) => ({ ...prev, targetCareerId: careerId }));
    const target = CAREERS_DATA.find((c) => c.id === careerId);
    setRecentUpdateAlert(`Target career updated to ${target?.name || careerId}. Competency weights recalculated.`);
    setTimeout(() => setRecentUpdateAlert(null), 4000);
  };

  // Mark project completed
  const handleMarkProjectCompleted = (projectTitle: string) => {
    if (!profile.projects.includes(projectTitle)) {
      setProfile((prev) => ({
        ...prev,
        projects: [...prev.projects, projectTitle],
      }));
      setRecentUpdateAlert(`Project "${projectTitle}" added to verified portfolio!`);
      setTimeout(() => setRecentUpdateAlert(null), 4000);
    }
  };

  // Toggle Add Project to Roadmap
  const handleToggleAddToRoadmap = (projectId: string) => {
    setRoadmap((prev) => ({
      ...prev,
      recommendedProjects: prev.recommendedProjects.map((p) =>
        p.id === projectId ? { ...p, addedToRoadmap: !p.addedToRoadmap } : p
      ),
    }));
  };

  const topGapSkill = analysis.skillGaps[0]?.skill || 'Statistical Analysis';

  // Dedicated full-screen login view when not authenticated or explicitly on /login
  if (currentPage === 'login') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center py-8 px-4 sm:px-6">
        {recentUpdateAlert && (
          <div className="mb-4 max-w-xl w-full p-3 bg-indigo-50 border border-indigo-200 text-indigo-900 rounded-xl text-xs font-semibold flex items-center justify-between">
            <span>{recentUpdateAlert}</span>
            <button
              onClick={() => setRecentUpdateAlert(null)}
              className="text-indigo-700 hover:text-indigo-900 p-1 font-bold cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}
        <Login
          onLoginSuccess={handleLoginSuccess}
          initialRole={currentUser?.role || 'student'}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans antialiased">
      {/* Persistent Sidebar Navigation with Strict Role Visibility */}
      <Sidebar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        careerReadinessScore={analysis.careerReadinessScore}
        targetCareerName={analysis.targetCareer.name}
        isDemoMode={isDemoMode}
        onOpenAssistant={() => setIsAIChatOpen(true)}
        currentUser={currentUser}
        onOpenLogin={() => setCurrentPage('login')}
        onSwitchRole={handleSwitchRole}
        onLogout={handleLogout}
        activeStaffTab={activeStaffTab}
        activeAdminTab={activeAdminTab}
      />

      {/* Main Content Area */}
      <div className="lg:pl-64 flex-1 flex flex-col min-h-screen">
        {/* App Header */}
        <Header
          currentPage={currentPage}
          onNavigate={handleNavigate}
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          careerReadinessScore={analysis.careerReadinessScore}
          targetCareerName={analysis.targetCareer.name}
          studentName={profile.fullName}
          isDemoMode={isDemoMode}
          onLoadDemo={handleLoadDemo}
          onOpenAssistant={() => setIsAIChatOpen(true)}
          hasGeminiKey={hasGeminiKey}
          currentUser={currentUser}
          onSwitchRole={handleSwitchRole}
          onOpenLogin={() => setCurrentPage('login')}
          onLogout={handleLogout}
        />

        {/* Dynamic Recalculation Alert Banner (Global) */}
        {recentUpdateAlert && (
          <div className="mx-4 lg:mx-8 mt-4 p-3.5 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-2xl text-xs font-semibold flex items-center justify-between shadow-xs animate-in fade-in slide-in-from-top-2 duration-300">
            <span>{recentUpdateAlert}</span>
            <button
              onClick={() => setRecentUpdateAlert(null)}
              className="text-emerald-700 hover:text-emerald-900 p-1 font-bold cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}

        {/* View Switcher with Role Guarding */}
        <main className="flex-1 p-4 lg:p-8 max-w-7xl w-full mx-auto">
          {currentPage === 'landing' && (
            <Landing
              onNavigate={handleNavigate}
              onLoadDemo={handleLoadDemo}
              onOpenStory={() => setIsStoryOpen(true)}
            />
          )}

          {/* STAFF SECTOR */}
          {currentPage === 'staff' && (
            <StaffPortal
              currentUser={currentUser}
              activeView={activeStaffTab}
            />
          )}

          {/* CAMPUS SECTOR */}
          {currentPage === 'admin' && (
            <AdminView
              activeView={activeAdminTab}
            />
          )}

          {/* STUDENT SECTOR */}
          {currentPage === 'dashboard' && (
            <Dashboard
              profile={profile}
              analysis={analysis}
              roadmap={roadmap}
              onNavigate={handleNavigate}
              onMarkSkillCompleted={handleMarkSkillCompleted}
              onToggleTask={handleToggleTask}
            />
          )}

          {currentPage === 'profile' && (
            <Profile
              profile={profile}
              onSaveProfile={(updated) => setProfile(updated)}
              onLoadDemo={handleLoadDemo}
              onProceedToAssessment={() => handleNavigate('assessment')}
            />
          )}

          {currentPage === 'careers' && (
            <Careers
              currentTargetId={profile.targetCareerId}
              onSelectCareer={handleSelectCareer}
              onProceedToAnalysis={() => handleNavigate('analysis')}
            />
          )}

          {currentPage === 'assessment' && (
            <SkillAssessment
              profile={profile}
              career={analysis.targetCareer}
              onUpdateSkills={(updatedSkills) => {
                setProfile((prev) => ({ ...prev, skills: updatedSkills }));
              }}
              onProceedToAnalysis={() => handleNavigate('analysis')}
            />
          )}

          {currentPage === 'analysis' && (
            <SkillAnalysis
              analysis={analysis}
              profile={profile}
              onMarkSkillCompleted={handleMarkSkillCompleted}
              onGenerateRoadmap={handleRegenerateRoadmap}
              onNavigateToRoadmap={() => handleNavigate('roadmap')}
            />
          )}

          {currentPage === 'courses' && (
            <CourseLibrary
              profile={profile}
              onUpdateProfileSkills={(updatedSkills) => {
                setProfile((prev) => ({ ...prev, skills: updatedSkills }));
              }}
              onNavigateToCertificates={() => handleNavigate('certificates')}
            />
          )}

          {currentPage === 'roadmap' && (
            <Roadmap
              roadmap={roadmap}
              analysis={analysis}
              profile={profile}
              isGeneratingAI={isGeneratingAI}
              onRegenerateRoadmap={handleRegenerateRoadmap}
              onToggleTask={handleToggleTask}
              onMarkSkillCompleted={handleMarkSkillCompleted}
              onNavigateToProjects={() => handleNavigate('projects')}
              recentUpdateAlert={recentUpdateAlert}
            />
          )}

          {currentPage === 'projects' && (
            <Projects
              projects={roadmap.recommendedProjects}
              profile={profile}
              analysis={analysis}
              onToggleAddToRoadmap={handleToggleAddToRoadmap}
              onMarkProjectCompleted={handleMarkProjectCompleted}
              onNavigateToRoadmap={() => handleNavigate('roadmap')}
            />
          )}

          {currentPage === 'certificates' && (
            <CertificatesPage
              profile={profile}
              onNavigateToCourses={() => handleNavigate('courses')}
            />
          )}

          {currentPage === 'progress' && (
            <Progress
              profile={profile}
              analysis={analysis}
              roadmap={roadmap}
              onNavigate={handleNavigate}
            />
          )}

          {currentPage === 'skillmap' && (
            <SkillMasterMap
              profile={profile}
              career={analysis.targetCareer}
              onToggleSkillStatus={handleToggleSkillStatus}
              onSelectCareer={handleSelectCareer}
            />
          )}

          {currentPage === 'settings' && (
            <Settings
              profile={profile}
              isDemoMode={isDemoMode}
              onLoadDemo={handleLoadDemo}
              onResetToFresh={handleResetToFresh}
              hasGeminiKey={hasGeminiKey}
            />
          )}
        </main>
      </div>

      {/* AI Career Assistant Floating Drawer */}
      <AIChat
        isOpen={isAIChatOpen}
        onClose={() => setIsAIChatOpen(false)}
        profile={profile}
        targetCareerName={analysis.targetCareer.name}
        readinessScore={analysis.careerReadinessScore}
        topGapSkill={topGapSkill}
        onNavigateTo={handleNavigate}
      />

      {/* Hackathon Demo Story Modal */}
      <HackathonStoryModal
        isOpen={isStoryOpen}
        onClose={() => setIsStoryOpen(false)}
        onNavigate={handleNavigate}
        onLoadDemo={handleLoadDemo}
      />
    </div>
  );
}
