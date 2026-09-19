import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  BookOpen,
  Award,
  Clock,
  CheckCircle2,
  PlayCircle,
  ExternalLink,
  ChevronRight,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Check,
  X,
  FileText,
  Flame,
  Layers,
  BarChart2,
} from 'lucide-react';
import { Course, CourseCategory, CourseLevel, StudentProfile } from '../types';
import { COURSES_CATALOG } from '../data/coursesData';
import {
  getStoredProgress,
  getCourseProgress,
  enrollInCourse,
  toggleModuleCompletion,
  completeCourseAssessmentAndAward,
  getCreditSummary,
} from '../services/courseStorage';
import { CertificateModal } from '../components/CertificateModal';
import { useNotification } from '../context/NotificationContext';

interface CourseLibraryProps {
  profile: StudentProfile;
  onUpdateProfileSkills?: (updatedSkills: StudentProfile['skills']) => void;
  onNavigateToCertificates?: () => void;
  onNavigateToRoadmap?: () => void;
}

export const CourseLibrary: React.FC<CourseLibraryProps> = ({
  profile,
  onUpdateProfileSkills,
  onNavigateToCertificates,
  onNavigateToRoadmap,
}) => {
  const notify = useNotification();

  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedLevel, setSelectedLevel] = useState<string>('All');
  const [selectedDuration, setSelectedDuration] = useState<string>('All');
  const [selectedCreditFilter, setSelectedCreditFilter] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');

  // Active detail modal
  const [activeCourse, setActiveCourse] = useState<Course | null>(null);

  // Active certificate modal
  const [viewingCertificate, setViewingCertificate] = useState<any>(null);

  // Completion toast notification
  const [completionToast, setCompletionToast] = useState<{
    courseTitle: string;
    credits: number;
    certId: string;
  } | null>(null);

  // Force re-render on progress changes
  const [storageVersion, setStorageVersion] = useState(0);

  const progressList = useMemo(() => {
    return getStoredProgress();
  }, [storageVersion]);

  const creditSummary = useMemo(() => {
    return getCreditSummary();
  }, [storageVersion]);

  // Categories list
  const categories: CourseCategory[] = [
    'Data & Analytics',
    'Full Stack Development',
    'AI & Machine Learning',
    'Cloud Computing',
    'Cybersecurity',
    'Software Development',
    'UI/UX & Design',
    'Database & Backend',
    'Career & Professional Skills',
  ];

  // Filter logic
  const filteredCourses = useMemo(() => {
    return COURSES_CATALOG.filter((course) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = course.title.toLowerCase().includes(q);
        const matchesDesc = course.description.toLowerCase().includes(q);
        const matchesSkills = course.skills.some((s) => s.toLowerCase().includes(q));
        if (!matchesTitle && !matchesDesc && !matchesSkills) return false;
      }

      // Category
      if (selectedCategory !== 'All' && course.category !== selectedCategory) {
        return false;
      }

      // Level
      if (selectedLevel !== 'All' && course.level !== selectedLevel) {
        return false;
      }

      // Duration
      if (selectedDuration !== 'All') {
        const weeks = parseInt(course.duration.split(' ')[0], 10) || 4;
        if (selectedDuration === '2-4 Weeks' && weeks > 4) return false;
        if (selectedDuration === '5-8 Weeks' && (weeks < 5 || weeks > 8)) return false;
        if (selectedDuration === '9+ Weeks' && weeks < 9) return false;
      }

      // Credits
      if (selectedCreditFilter !== 'All') {
        if (selectedCreditFilter === '50-75' && (course.credits < 50 || course.credits > 75)) return false;
        if (selectedCreditFilter === '100-125' && (course.credits < 100 || course.credits > 125)) return false;
        if (selectedCreditFilter === '150-200' && course.credits < 150) return false;
      }

      // Status
      if (selectedStatus !== 'All') {
        const prog = progressList.find((p) => p.courseId === course.id);
        const status = prog ? prog.status : 'Not Started';
        if (selectedStatus !== status) return false;
      }

      return true;
    });
  }, [
    searchQuery,
    selectedCategory,
    selectedLevel,
    selectedDuration,
    selectedCreditFilter,
    selectedStatus,
    progressList,
  ]);

  const handleStartCourse = (course: Course) => {
    enrollInCourse(course.id, profile.id || 'demo-student');
    setStorageVersion((v) => v + 1);
    setActiveCourse(course);
  };

  const handleToggleModule = (moduleId: string) => {
    if (!activeCourse) return;
    toggleModuleCompletion(activeCourse.id, moduleId, profile.id || 'demo-student');
    setStorageVersion((v) => v + 1);
  };

  const handleCompleteAssessment = () => {
    if (!activeCourse) return;
    const { progress, certificate } = completeCourseAssessmentAndAward(
      activeCourse.id,
      profile.fullName || 'Ajay Kumar',
      '21CS042',
      profile.department || 'CSE',
      profile.id || 'demo-student'
    );

    // Sync skills with student profile
    if (onUpdateProfileSkills) {
      const currentSkills = profile?.skills || [];
      const updatedSkills = currentSkills.map((skill) => {
        const isCovered = activeCourse.skills.some(
          (cs) => cs.toLowerCase() === skill.name.toLowerCase()
        );
        if (isCovered) {
          return {
            ...skill,
            status: 'Completed' as const,
            level: skill.level === 'Beginner' ? ('Intermediate' as const) : skill.level,
          };
        }
        return skill;
      });
      onUpdateProfileSkills(updatedSkills);
    }

    setStorageVersion((v) => v + 1);
    setCompletionToast({
      courseTitle: activeCourse.title,
      credits: activeCourse.credits,
      certId: certificate.certificateId,
    });
    notify?.achievement(
      'Course Completed & Credited!',
      `Earned +${activeCourse.credits} Credits for ${activeCourse.title}. Certificate ${certificate.certificateId} has been issued!`
    );
    setActiveCourse(null);
  };

  return (
    <div className="space-y-6 pb-16 max-w-7xl mx-auto">
      {/* Toast Notification */}
      {completionToast && (
        <div
          id="course-completion-toast"
          className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white p-4 rounded-xl shadow-2xl border border-amber-500/40 flex items-start gap-3 max-w-md animate-fade-in"
        >
          <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg shrink-0 mt-0.5">
            <Award className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-amber-400">
              Course Completed & Credited!
            </p>
            <p className="text-sm font-bold text-white mt-0.5">{completionToast.courseTitle}</p>
            <p className="text-xs text-slate-300 mt-1">
              Earned <span className="text-emerald-400 font-bold">+{completionToast.credits} Credits</span>.
              Certificate <span className="font-mono text-amber-300">{completionToast.certId}</span> is ready.
            </p>
            <div className="flex items-center gap-3 mt-3">
              {onNavigateToCertificates && (
                <button
                  id="view-certificates-toast-btn"
                  onClick={() => {
                    setCompletionToast(null);
                    onNavigateToCertificates();
                  }}
                  className="px-3 py-1 text-xs font-semibold bg-amber-500 text-slate-950 rounded-lg hover:bg-amber-400 transition-colors"
                >
                  View Certificates
                </button>
              )}
              <button
                onClick={() => setCompletionToast(null)}
                className="text-xs text-slate-400 hover:text-white"
              >
                Dismiss
              </button>
            </div>
          </div>
          <button
            onClick={() => setCompletionToast(null)}
            className="text-slate-400 hover:text-white p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 rounded-2xl p-6 sm:p-8 text-white shadow-xl border border-slate-700/50 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold tracking-wide uppercase mb-3">
              <BookOpen className="w-3.5 h-3.5" />
              Accredited Curriculum Catalog
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Course Library
            </h1>
            <p className="text-slate-300 text-sm mt-1.5 max-w-2xl">
              Build job-ready skills through structured courses. Complete modules, verify technical
              learning, earn credit points, and receive course certificates.
            </p>
          </div>

          {/* Quick Stats Pill */}
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-3.5 rounded-xl border border-white/10 shrink-0">
            <div className="text-center px-3 border-r border-white/10">
              <p className="text-xl font-bold text-amber-400">{creditSummary.totalCredits}</p>
              <p className="text-[11px] text-slate-300 uppercase tracking-wider">Credits Earned</p>
            </div>
            <div className="text-center px-3 border-r border-white/10">
              <p className="text-xl font-bold text-emerald-400">{creditSummary.completedCoursesCount}</p>
              <p className="text-[11px] text-slate-300 uppercase tracking-wider">Completed</p>
            </div>
            <div className="text-center px-3">
              <p className="text-xl font-bold text-indigo-300">{creditSummary.certificatesCount}</p>
              <p className="text-[11px] text-slate-300 uppercase tracking-wider">Certificates</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Multi-Filter Control Panel */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-sm space-y-4">
        {/* Top Search Bar */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              id="course-search-input"
              type="text"
              placeholder="Search courses by title, skills (e.g., Python, SQL, React), or topic..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all text-slate-800 placeholder-slate-400"
            />
          </div>

          {(searchQuery ||
            selectedCategory !== 'All' ||
            selectedLevel !== 'All' ||
            selectedDuration !== 'All' ||
            selectedCreditFilter !== 'All' ||
            selectedStatus !== 'All') && (
            <button
              id="reset-all-course-filters-btn"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setSelectedLevel('All');
                setSelectedDuration('All');
                setSelectedCreditFilter('All');
                setSelectedStatus('All');
              }}
              className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-3 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shrink-0"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Dropdown Filters Row */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 pt-2 border-t border-slate-100">
          {/* Category */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Category
            </label>
            <select
              id="filter-course-category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900"
            >
              <option value="All">All Categories ({COURSES_CATALOG.length})</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Difficulty */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Difficulty
            </label>
            <select
              id="filter-course-level"
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900"
            >
              <option value="All">All Levels</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>

          {/* Duration */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Duration
            </label>
            <select
              id="filter-course-duration"
              value={selectedDuration}
              onChange={(e) => setSelectedDuration(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900"
            >
              <option value="All">All Durations</option>
              <option value="2-4 Weeks">2-4 Weeks</option>
              <option value="5-8 Weeks">5-8 Weeks</option>
              <option value="9+ Weeks">9+ Weeks</option>
            </select>
          </div>

          {/* Credits */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Credits
            </label>
            <select
              id="filter-course-credits"
              value={selectedCreditFilter}
              onChange={(e) => setSelectedCreditFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900"
            >
              <option value="All">All Credits</option>
              <option value="50-75">50 - 75 Credits</option>
              <option value="100-125">100 - 125 Credits</option>
              <option value="150-200">150 - 200 Credits</option>
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Status
            </label>
            <select
              id="filter-course-status"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900"
            >
              <option value="All">All Statuses</option>
              <option value="Not Started">Not Started</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>

        {/* Quick Category Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 no-scrollbar text-xs">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-3 py-1 rounded-full whitespace-nowrap font-medium transition-colors ${
              selectedCategory === 'All'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full whitespace-nowrap font-medium transition-colors ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between px-1">
        <p className="text-xs font-semibold text-slate-500">
          Showing <span className="text-slate-900 font-bold">{filteredCourses.length}</span> of{' '}
          {COURSES_CATALOG.length} Courses
        </p>
        <span className="text-xs text-slate-400">
          Credits are strictly awarded only upon full course completion.
        </span>
      </div>

      {/* Courses Cards Grid */}
      {filteredCourses.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-xl border border-slate-200">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No courses match your criteria</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Try adjusting your search keyword or clearing the selected category and duration filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCourses.map((course) => {
            const prog = progressList.find((p) => p.courseId === course.id);
            const status = prog ? prog.status : 'Not Started';
            const progressPct = prog ? prog.progress : 0;

            return (
              <div
                key={course.id}
                id={`course-card-${course.id}`}
                className="bg-white rounded-xl border border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
              >
                <div className="p-5">
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-md border border-indigo-100">
                      {course.category}
                    </span>

                    {/* Status Badge */}
                    {status === 'Completed' ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                        <CheckCircle2 className="w-3 h-3" />
                        Completed
                      </span>
                    ) : status === 'In Progress' ? (
                      <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                        In Progress ({progressPct}%)
                      </span>
                    ) : (
                      <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                        Not Started
                      </span>
                    )}
                  </div>

                  {/* Course Title */}
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                    {course.title}
                  </h3>

                  {/* Meta Specs */}
                  <div className="flex items-center gap-3 text-xs text-slate-500 mt-2">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {course.duration}
                    </span>
                    <span>•</span>
                    <span className="font-medium text-slate-700">{course.level}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1 font-bold text-amber-700">
                      <Award className="w-3.5 h-3.5 text-amber-500" />
                      {course.credits} Credits
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-600 mt-2.5 line-clamp-2 leading-relaxed">
                    {course.description}
                  </p>

                  {/* Skills tags */}
                  <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-slate-100">
                    {course.skills.slice(0, 4).map((skill) => (
                      <span
                        key={skill}
                        className="text-[10px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded"
                      >
                        {skill}
                      </span>
                    ))}
                    {course.skills.length > 4 && (
                      <span className="text-[10px] font-medium text-slate-400 px-1 py-0.5">
                        +{course.skills.length - 4} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Footer with Progress & Button */}
                <div className="px-5 py-3.5 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between gap-3">
                  {status !== 'Not Started' ? (
                    <div className="flex-1 mr-2">
                      <div className="flex justify-between text-[11px] font-semibold text-slate-600 mb-1">
                        <span>Progress</span>
                        <span>{progressPct}%</span>
                      </div>
                      <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            status === 'Completed' ? 'bg-emerald-600' : 'bg-indigo-600'
                          }`}
                          style={{ width: `${progressPct}%` }}
                        ></div>
                      </div>
                    </div>
                  ) : (
                    <span className="text-xs text-slate-500 font-medium">
                      {course.modules.length} Modules included
                    </span>
                  )}

                  <button
                    id={`btn-course-action-${course.id}`}
                    onClick={() => handleStartCourse(course)}
                    className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg shrink-0 flex items-center gap-1 transition-all ${
                      status === 'Completed'
                        ? 'bg-slate-900 text-white hover:bg-slate-800'
                        : status === 'In Progress'
                        ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm'
                        : 'bg-white text-slate-800 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {status === 'Completed'
                      ? 'View / Review'
                      : status === 'In Progress'
                      ? 'Continue'
                      : 'Start Course'}
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Course Detail Modal */}
      {activeCourse && (
        <div
          id="course-detail-modal-backdrop"
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4 overflow-y-auto"
          onClick={() => setActiveCourse(null)}
        >
          <div
            id="course-detail-modal-container"
            className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 my-8 flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-6 py-5 bg-gradient-to-r from-slate-900 to-indigo-950 text-white flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">
                    {activeCourse.category}
                  </span>
                  <span className="text-slate-400">•</span>
                  <span className="text-xs text-slate-300">{activeCourse.level}</span>
                </div>
                <h2 className="text-xl font-bold text-white">{activeCourse.title}</h2>
                <div className="flex items-center gap-4 text-xs text-slate-300 mt-2">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {activeCourse.duration}
                  </span>
                  <span className="flex items-center gap-1 text-amber-400 font-bold">
                    <Award className="w-3.5 h-3.5" />
                    {activeCourse.credits} Skill Credits
                  </span>
                  <span>{activeCourse.modules.length} Modules</span>
                </div>
              </div>
              <button
                id="close-course-modal-btn"
                onClick={() => setActiveCourse(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-6 overflow-y-auto space-y-6">
              {/* Overview & Learning Outcomes */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Course Overview
                </h4>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {activeCourse.description}
                </p>

                <div className="mt-4 bg-slate-50 border border-slate-200 rounded-xl p-4">
                  <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                    Key Learning Outcomes
                  </h5>
                  <ul className="space-y-1.5">
                    {activeCourse.learningOutcomes.map((outcome, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-slate-600">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{outcome}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Interactive Modules Checklist */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Course Modules & Curriculum ({activeCourse.modules.length})
                  </h4>
                  {(() => {
                    const prog = getCourseProgress(activeCourse.id);
                    return (
                      <span className="text-xs font-bold text-slate-700">
                        {prog?.completedModules.length || 0} / {activeCourse.modules.length} Completed
                      </span>
                    );
                  })()}
                </div>

                <div className="space-y-3">
                  {activeCourse.modules.map((mod) => {
                    const prog = getCourseProgress(activeCourse.id);
                    const isCompleted = prog?.completedModules.includes(mod.id) || false;

                    return (
                      <div
                        key={mod.id}
                        className={`p-4 rounded-xl border transition-all ${
                          isCompleted
                            ? 'bg-emerald-50/40 border-emerald-200'
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3">
                            <button
                              id={`toggle-module-${mod.id}`}
                              onClick={() => handleToggleModule(mod.id)}
                              className={`w-5 h-5 rounded flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                                isCompleted
                                  ? 'bg-emerald-600 text-white'
                                  : 'border-2 border-slate-300 hover:border-slate-400'
                              }`}
                            >
                              {isCompleted && <Check className="w-3.5 h-3.5" />}
                            </button>
                            <div>
                              <p className="text-xs font-bold text-slate-900">
                                Module {mod.order}: {mod.title}
                              </p>
                              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                                {mod.description}
                              </p>

                              {/* Resources */}
                              {mod.resources && mod.resources.length > 0 && (
                                <div className="flex flex-wrap items-center gap-2 mt-2.5">
                                  {mod.resources.map((res) => (
                                    <span
                                      key={res.id}
                                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-100 text-slate-700 text-[11px] font-medium"
                                    >
                                      {res.type === 'Video' ? (
                                        <PlayCircle className="w-3 h-3 text-red-600" />
                                      ) : (
                                        <FileText className="w-3 h-3 text-indigo-600" />
                                      )}
                                      {res.title}
                                      {res.duration && (
                                        <span className="text-slate-400 text-[10px]">
                                          ({res.duration})
                                        </span>
                                      )}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>

                          <span className="text-[11px] font-medium text-slate-400 shrink-0">
                            {mod.estimatedMinutes} mins
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Final Assessment & Certification Section */}
              <div className="bg-amber-50/60 border border-amber-200 rounded-xl p-5">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-amber-500/20 text-amber-800 rounded-lg shrink-0">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h5 className="text-sm font-bold text-slate-900">
                      {activeCourse.finalAssessment.title}
                    </h5>
                    <p className="text-xs text-slate-600 mt-1">
                      {activeCourse.finalAssessment.description}
                    </p>
                    {activeCourse.finalAssessment.projectPrompt && (
                      <div className="mt-2.5 p-3 bg-white border border-amber-200/80 rounded-lg text-xs text-slate-700">
                        <span className="font-bold text-slate-900">Project Prompt: </span>
                        {activeCourse.finalAssessment.projectPrompt}
                      </div>
                    )}

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                      <span className="text-xs font-semibold text-emerald-800">
                        Award on Completion: +{activeCourse.credits} Credits + Accredited Certificate
                      </span>

                      {(() => {
                        const prog = getCourseProgress(activeCourse.id);
                        const isCompleted = prog?.status === 'Completed';
                        if (isCompleted) {
                          return (
                            <div className="flex items-center gap-2">
                              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1.5 rounded-lg border border-emerald-200">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                Completed & Credited (+{activeCourse.credits} pts)
                              </span>
                              {onNavigateToCertificates && (
                                <button
                                  id="modal-view-certificate-btn"
                                  onClick={() => {
                                    setActiveCourse(null);
                                    onNavigateToCertificates();
                                  }}
                                  className="px-3.5 py-1.5 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
                                >
                                  <Award className="w-3.5 h-3.5" />
                                  View Certificate
                                </button>
                              )}
                            </div>
                          );
                        }
                        return (
                          <button
                            id="submit-course-assessment-btn"
                            onClick={handleCompleteAssessment}
                            className="px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
                          >
                            <Award className="w-4 h-4 text-amber-400" />
                            Complete Course & Claim Certificate
                          </button>
                        );
                      })()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Certificate Viewer Modal */}
      <CertificateModal
        certificate={viewingCertificate}
        isOpen={!!viewingCertificate}
        onClose={() => setViewingCertificate(null)}
      />
    </div>
  );
};
