import React, { useState, useEffect, useMemo } from 'react';
import {
  Briefcase,
  Users,
  Award,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  ArrowRight,
  ExternalLink,
  MessageSquare,
  Sparkles,
  CalendarCheck,
  BookOpen,
  Calendar,
  X,
  FileCheck2,
  TrendingUp,
  BarChart3,
  FileText,
  HelpCircle,
  ChevronRight,
  GraduationCap,
  Plus,
  Send,
  RotateCcw,
  ArrowUpDown,
  AlertCircle,
} from 'lucide-react';
import {
  STAFF_COHORT_STUDENTS,
  STAFF_PENDING_ENDORSEMENTS,
  STAFF_INTERVENTIONS,
} from '../data/demoData';
import { FACULTY_STUDENT_COURSE_RECORDS } from '../data/facultyCourseData';
import {
  StaffStudentItem,
  SkillEndorsementRequest,
  InterventionTask,
  UserAccount,
  FacultyStudentCourseRecord,
} from '../types';

export type StaffSubView =
  | 'dashboard'
  | 'students'
  | 'analytics'
  | 'course-performance'
  | 'CoursePerformance'
  | 'mentoring'
  | 'interventions'
  | 'reports';

export interface CoursePerformanceProps {
  onTriggerIntervention?: (studentName: string, courseName: string) => void;
}

export const CoursePerformance: React.FC<CoursePerformanceProps> = ({
  onTriggerIntervention,
}) => {
  // Master records
  const [records] = useState<FacultyStudentCourseRecord[]>(FACULTY_STUDENT_COURSE_RECORDS);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Completed' | 'In Progress' | 'Not Started'>('All');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [needsAttentionOnly, setNeedsAttentionOnly] = useState<boolean>(false);

  // Sorting
  const [sortBy, setSortBy] = useState<'progress' | 'credits' | 'name'>('progress');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Interventions state
  const [nudgedStudents, setNudgedStudents] = useState<string[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Inspected student for detail modal
  const [inspectedRecord, setInspectedRecord] = useState<FacultyStudentCourseRecord | null>(null);

  // Unique categories list
  const categories = useMemo(() => {
    const set = new Set<string>();
    records.forEach((r) => set.add(r.category));
    return Array.from(set).sort();
  }, [records]);

  // Aggregate KPI metrics
  const metrics = useMemo(() => {
    const total = records.length;
    const completed = records.filter((r) => r.status === 'Completed').length;
    const inProgress = records.filter((r) => r.status === 'In Progress').length;
    const notStarted = records.filter((r) => r.status === 'Not Started').length;
    const totalCreditsEarned = records.reduce((acc, r) => acc + r.creditsEarned, 0);
    // Needs attention: students with progress below 40%
    const needsAttentionCount = records.filter((r) => r.progress < 40).length;
    const avgProgress = total > 0 ? Math.round(records.reduce((acc, r) => acc + r.progress, 0) / total) : 0;

    return {
      total,
      completed,
      inProgress,
      notStarted,
      totalCreditsEarned,
      needsAttentionCount,
      avgProgress,
    };
  }, [records]);

  // Filtered & Sorted student list
  const filteredRecords = useMemo(() => {
    return records
      .filter((rec) => {
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = rec.studentName.toLowerCase().includes(q);
          const matchRoll = rec.rollNo.toLowerCase().includes(q);
          const matchCourse = rec.courseName.toLowerCase().includes(q);
          const matchDept = rec.department.toLowerCase().includes(q);
          if (!matchName && !matchRoll && !matchCourse && !matchDept) {
            return false;
          }
        }

        // Status filter
        if (statusFilter !== 'All' && rec.status !== statusFilter) {
          return false;
        }

        // Category filter
        if (categoryFilter !== 'All' && rec.category !== categoryFilter) {
          return false;
        }

        // Needs Attention flag filter: progress strictly below 40%
        if (needsAttentionOnly && rec.progress >= 40) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        let diff = 0;
        if (sortBy === 'progress') {
          diff = a.progress - b.progress;
        } else if (sortBy === 'credits') {
          diff = a.creditsEarned - b.creditsEarned;
        } else if (sortBy === 'name') {
          return sortOrder === 'asc'
            ? a.studentName.localeCompare(b.studentName)
            : b.studentName.localeCompare(a.studentName);
        }
        return sortOrder === 'asc' ? diff : -diff;
      });
  }, [records, searchQuery, statusFilter, categoryFilter, needsAttentionOnly, sortBy, sortOrder]);

  const handleSendNudge = (rec: FacultyStudentCourseRecord) => {
    setNudgedStudents((prev) => [...prev, rec.id]);
    const msg = `Dispatched course mentoring nudge to ${rec.studentName} for course "${rec.courseName}".`;
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);

    if (onTriggerIntervention) {
      onTriggerIntervention(rec.studentName, rec.courseName);
    }
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilter('All');
    setCategoryFilter('All');
    setNeedsAttentionOnly(false);
  };

  const hasActiveFilters =
    searchQuery !== '' || statusFilter !== 'All' || categoryFilter !== 'All' || needsAttentionOnly;

  return (
    <div className="space-y-6">
      {/* Feedback Toast */}
      {toastMessage && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-2xl text-xs font-semibold flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="text-emerald-700 hover:text-emerald-900 p-1 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Top Banner */}
      <div className="p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl border border-slate-700 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold tracking-wide uppercase mb-2">
              <Award className="w-3.5 h-3.5 text-indigo-400" />
              Faculty Course Intelligence
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Course Performance & Student Tracking
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm mt-1">
              Monitor student completion progress, academic credits earned, and track students needing attention with progress below 40%.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setNeedsAttentionOnly(!needsAttentionOnly)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-xs ${
                needsAttentionOnly
                  ? 'bg-rose-600 text-white ring-2 ring-rose-300'
                  : 'bg-white/10 hover:bg-white/20 text-rose-300 border border-rose-400/40'
              }`}
            >
              <AlertTriangle className="w-4 h-4" />
              <span>
                {needsAttentionOnly ? 'Showing Needs Attention (< 40%)' : 'Filter Needs Attention (< 40%)'}
              </span>
              <span className="px-1.5 py-0.5 rounded bg-rose-500/40 text-[10px]">
                {metrics.needsAttentionCount}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Performance KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Total Monitored Students */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-semibold">Total Students</span>
            <Users className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900">{metrics.total}</p>
          <div className="mt-1 text-[11px] text-slate-500">
            Avg Progress: <strong className="text-slate-800">{metrics.avgProgress}%</strong>
          </div>
        </div>

        {/* Metric 2: Completed Courses */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-semibold">Courses Completed</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-emerald-600">{metrics.completed}</p>
          <div className="mt-1 text-[11px] font-semibold text-emerald-700">
            {Math.round((metrics.completed / (metrics.total || 1)) * 100)}% Completion Rate
          </div>
        </div>

        {/* Metric 3: Total Credits Earned */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-semibold">Course Credits Earned</span>
            <Award className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-amber-600">{metrics.totalCreditsEarned}</p>
          <div className="mt-1 text-[11px] text-slate-500 font-medium">
            Accredited skill credits awarded
          </div>
        </div>

        {/* Metric 4: Needs Attention (< 40% Progress) */}
        <div
          onClick={() => setNeedsAttentionOnly(!needsAttentionOnly)}
          className={`p-5 rounded-2xl border transition cursor-pointer shadow-xs ${
            needsAttentionOnly
              ? 'bg-rose-50 border-rose-300 ring-2 ring-rose-400'
              : 'bg-white border-slate-200 hover:border-rose-200'
          }`}
        >
          <div className="flex items-center justify-between text-rose-600 mb-1">
            <span className="text-xs font-bold flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" />
              Needs Attention (&lt; 40%)
            </span>
            <span className="text-[10px] uppercase font-bold bg-rose-100 text-rose-800 px-1.5 py-0.5 rounded">
              {needsAttentionOnly ? 'Filtered' : 'Click to filter'}
            </span>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-rose-600">{metrics.needsAttentionCount}</p>
          <div className="mt-1 text-[11px] font-semibold text-rose-700">
            Students with progress below 40%
          </div>
        </div>
      </div>

      {/* Filter Control Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Search input */}
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by student name, roll number, course, or department..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-slate-900"
            />
          </div>

          {/* Sort Controls */}
          <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-between sm:justify-end">
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:outline-none"
              >
                <option value="progress">Sort: Progress %</option>
                <option value="credits">Sort: Credits Earned</option>
                <option value="name">Sort: Student Name</option>
              </select>
            </div>

            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="px-3 py-2 text-xs font-bold uppercase border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-700 transition cursor-pointer"
              title={`Toggle sort order: currently ${sortOrder.toUpperCase()}`}
            >
              {sortOrder}
            </button>

            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="flex items-center gap-1 px-3 py-2 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl transition cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Filter Dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-100">
          {/* Status Filter */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Filter by Course Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900"
            >
              <option value="All">All Statuses ({records.length})</option>
              <option value="Completed">Completed ({metrics.completed})</option>
              <option value="In Progress">In Progress ({metrics.inProgress})</option>
              <option value="Not Started">Not Started ({metrics.notStarted})</option>
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Filter by Course Category
            </label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900"
            >
              <option value="All">All Categories ({categories.length})</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Needs Attention Toggle */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Attention Alert Filter
            </label>
            <button
              onClick={() => setNeedsAttentionOnly(!needsAttentionOnly)}
              className={`w-full px-3 py-2 text-xs rounded-xl font-bold transition flex items-center justify-between cursor-pointer border ${
                needsAttentionOnly
                  ? 'bg-rose-50 border-rose-300 text-rose-800'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <AlertTriangle className={`w-3.5 h-3.5 ${needsAttentionOnly ? 'text-rose-600' : 'text-slate-400'}`} />
                <span>Needs Attention (&lt; 40%)</span>
              </span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                needsAttentionOnly ? 'bg-rose-200 text-rose-900' : 'bg-slate-200 text-slate-600'
              }`}>
                {metrics.needsAttentionCount}
              </span>
            </button>
          </div>
        </div>

        {/* Quick Active Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          <span className="text-[11px] font-semibold text-slate-400">Quick Filters:</span>

          <button
            onClick={() => setNeedsAttentionOnly(!needsAttentionOnly)}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1 ${
              needsAttentionOnly
                ? 'bg-rose-600 text-white'
                : 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200'
            }`}
          >
            <AlertTriangle className="w-3 h-3" />
            <span>Progress &lt; 40% ({metrics.needsAttentionCount})</span>
          </button>

          <button
            onClick={() => setStatusFilter(statusFilter === 'Completed' ? 'All' : 'Completed')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1 ${
              statusFilter === 'Completed'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <CheckCircle2 className="w-3 h-3" />
            <span>Completed</span>
          </button>

          <button
            onClick={() => setStatusFilter(statusFilter === 'In Progress' ? 'All' : 'In Progress')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1 ${
              statusFilter === 'In Progress'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <Clock className="w-3 h-3" />
            <span>In Progress</span>
          </button>

          <div className="ml-auto text-xs text-slate-500">
            Showing <strong className="text-slate-900">{filteredRecords.length}</strong> of {records.length} records
          </div>
        </div>
      </div>

      {/* Performance Metrics Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span>Student Performance Table</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold">
                {filteredRecords.length} Students
              </span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Track course status, completion percentage, credit points earned, and student progress flags
            </p>
          </div>

          <div className="text-[11px] text-slate-400">
            Sorted by: <strong className="text-slate-700 uppercase">{sortBy}</strong> ({sortOrder.toUpperCase()})
          </div>
        </div>

        {filteredRecords.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <AlertCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700">No student records match the selected filters</p>
            <p className="text-xs text-slate-400 mt-1">Try resetting the status, category, or progress filters.</p>
            <button
              onClick={handleResetFilters}
              className="mt-3 px-3.5 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Student Name</th>
                  <th className="px-3 py-3">Dept</th>
                  <th className="px-4 py-3">Course Name</th>
                  <th className="px-3 py-3">Category</th>
                  <th className="px-3 py-3">Course Status</th>
                  <th className="px-4 py-3">Progress Percentage</th>
                  <th className="px-3 py-3 text-center">Credit Points Earned</th>
                  <th className="px-3 py-3">Attention Flag</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRecords.map((rec) => {
                  const hasLowProgress = rec.progress < 40;
                  const isNudged = nudgedStudents.includes(rec.id);

                  return (
                    <tr
                      key={rec.id}
                      className={`transition-colors ${
                        hasLowProgress
                          ? 'bg-rose-50/40 hover:bg-rose-50/70'
                          : 'hover:bg-slate-50/80'
                      }`}
                    >
                      {/* Student Name */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                              hasLowProgress
                                ? 'bg-rose-100 text-rose-700 border border-rose-200'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {rec.studentName
                              .split(' ')
                              .map((n) => n[0])
                              .join('')
                              .slice(0, 2)}
                          </div>
                          <div>
                            <button
                              onClick={() => setInspectedRecord(rec)}
                              className="font-bold text-slate-900 hover:text-indigo-600 transition text-left cursor-pointer"
                            >
                              {rec.studentName}
                            </button>
                            <p className="text-[11px] text-slate-400 font-mono">
                              {rec.rollNo}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Department */}
                      <td className="px-3 py-3.5">
                        <span className="font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                          {rec.department}
                        </span>
                      </td>

                      {/* Course Name */}
                      <td className="px-4 py-3.5 font-medium text-slate-900">
                        <span className="line-clamp-1">{rec.courseName}</span>
                      </td>

                      {/* Course Category */}
                      <td className="px-3 py-3.5">
                        <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-md whitespace-nowrap">
                          {rec.category}
                        </span>
                      </td>

                      {/* Course Status */}
                      <td className="px-3 py-3.5 whitespace-nowrap">
                        {rec.status === 'Completed' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            <CheckCircle2 className="w-3 h-3" />
                            Completed
                          </span>
                        ) : rec.status === 'In Progress' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800">
                            <Clock className="w-3 h-3" />
                            In Progress
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-600">
                            Not Started
                          </span>
                        )}
                      </td>

                      {/* Progress Percentage */}
                      <td className="px-4 py-3.5">
                        <div className="w-32 sm:w-36">
                          <div className="flex justify-between items-center text-[11px] font-bold mb-1">
                            <span
                              className={
                                rec.progress < 40
                                  ? 'text-rose-600 font-bold'
                                  : rec.progress >= 80
                                  ? 'text-emerald-600 font-bold'
                                  : 'text-amber-600 font-bold'
                              }
                            >
                              {rec.progress}%
                            </span>
                            <span className="text-slate-400 text-[10px]">
                              {rec.progress === 100 ? 'Completed' : `${rec.progress}% done`}
                            </span>
                          </div>
                          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-300 ${
                                rec.progress < 40
                                  ? 'bg-rose-500'
                                  : rec.progress >= 80
                                  ? 'bg-emerald-500'
                                  : 'bg-amber-500'
                              }`}
                              style={{ width: `${rec.progress}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Credit Points Earned */}
                      <td className="px-3 py-3.5 text-center whitespace-nowrap">
                        <span
                          className={`font-black text-xs ${
                            rec.creditsEarned > 0 ? 'text-emerald-600' : 'text-slate-400'
                          }`}
                        >
                          {rec.creditsEarned > 0 ? `+${rec.creditsEarned} pts` : '0 pts'}
                        </span>
                        <span className="text-[10px] text-slate-400 block">
                          Total: {rec.totalStudentCredits}
                        </span>
                      </td>

                      {/* Attention Flag (< 40% Progress) */}
                      <td className="px-3 py-3.5 whitespace-nowrap">
                        {hasLowProgress ? (
                          <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-rose-100 border border-rose-300 text-rose-800 text-[11px] font-bold shadow-xs">
                            <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                            <span>Needs Attention</span>
                          </div>
                        ) : rec.progress >= 80 ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-semibold">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            On Track
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-slate-100 text-slate-600 text-[11px] font-medium">
                            Steady
                          </span>
                        )}
                      </td>

                      {/* Action */}
                      <td className="px-4 py-3.5 text-right whitespace-nowrap">
                        {hasLowProgress ? (
                          isNudged ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] text-emerald-700 font-semibold bg-emerald-50 rounded-lg border border-emerald-200">
                              <CheckCircle2 className="w-3 h-3" />
                              Nudge Sent
                            </span>
                          ) : (
                            <button
                              onClick={() => handleSendNudge(rec)}
                              className="px-2.5 py-1 text-[11px] font-bold text-rose-700 bg-rose-100 hover:bg-rose-200 border border-rose-300 rounded-lg transition cursor-pointer inline-flex items-center gap-1 shadow-xs"
                            >
                              <Send className="w-3 h-3" />
                              <span>Mentoring Nudge</span>
                            </button>
                          )
                        ) : (
                          <button
                            onClick={() => setInspectedRecord(rec)}
                            className="px-2.5 py-1 text-[11px] font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition cursor-pointer"
                          >
                            View Details
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Student Detail Inspection Modal */}
      {inspectedRecord && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-xl border border-slate-200">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900">
                    {inspectedRecord.studentName}
                  </h3>
                  {inspectedRecord.progress < 40 && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-300 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3 text-rose-600" />
                      Needs Attention (&lt; 40%)
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Roll No: {inspectedRecord.rollNo} • Dept: {inspectedRecord.department}
                </p>
              </div>
              <button
                onClick={() => setInspectedRecord(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Progress</span>
                  <p className="text-lg font-bold text-slate-900 mt-0.5">{inspectedRecord.progress}%</p>
                  <p className="text-[10px] text-slate-500">{inspectedRecord.status}</p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Course Credits</span>
                  <p className="text-lg font-bold text-emerald-600 mt-0.5">+{inspectedRecord.creditsEarned}</p>
                  <p className="text-[10px] text-slate-500">Total: {inspectedRecord.totalStudentCredits}</p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Readiness</span>
                  <p className="text-lg font-bold text-indigo-600 mt-0.5">{inspectedRecord.readinessScore}%</p>
                  <p className="text-[10px] text-slate-500">CGPA: {inspectedRecord.cgpa}</p>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-sm">{inspectedRecord.courseName}</span>
                  <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                    {inspectedRecord.category}
                  </span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      inspectedRecord.progress < 40 ? 'bg-rose-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${inspectedRecord.progress}%` }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-slate-500 pt-1">
                  <span>Target Career: <strong>{inspectedRecord.targetCareer}</strong></span>
                  <span>Last active: <strong>{inspectedRecord.lastActive}</strong></span>
                </div>
              </div>

              {inspectedRecord.mentorNotes && (
                <div className="p-3.5 bg-amber-50/60 border border-amber-200 rounded-xl">
                  <span className="font-bold text-amber-900 block mb-1 text-[11px]">
                    Academic Counseling Notes:
                  </span>
                  <p className="text-slate-700 leading-relaxed">{inspectedRecord.mentorNotes}</p>
                </div>
              )}

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  onClick={() => setInspectedRecord(null)}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold cursor-pointer"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    handleSendNudge(inspectedRecord);
                    setInspectedRecord(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Mentoring Nudge</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

interface StaffPortalProps {
  currentUser: UserAccount;
  activeView?: StaffSubView;
  onSelectStudent?: (studentId: string) => void;
}

export const StaffPortal: React.FC<StaffPortalProps> = ({
  currentUser,
  activeView = 'dashboard',
}) => {
  // State
  const [students, setStudents] = useState<StaffStudentItem[]>(STAFF_COHORT_STUDENTS);
  const [endorsements, setEndorsements] = useState<SkillEndorsementRequest[]>(STAFF_PENDING_ENDORSEMENTS);
  const [interventions, setInterventions] = useState<InterventionTask[]>(STAFF_INTERVENTIONS);

  const [activeTab, setActiveTab] = useState<StaffSubView>(activeView);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRiskFilter, setSelectedRiskFilter] = useState<string>('all');
  const [selectedCareerFilter, setSelectedCareerFilter] = useState<string>('all');

  // Sync with prop
  useEffect(() => {
    if (activeView) {
      setActiveTab(activeView);
    }
  }, [activeView]);

  // Selected student for inspection modal
  const [inspectedStudent, setInspectedStudent] = useState<StaffStudentItem | null>(null);

  // New intervention modal state
  const [showNewInterventionModal, setShowNewInterventionModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newSkillFocus, setNewSkillFocus] = useState('Power BI');
  const [newAudience, setNewAudience] = useState('Critical Gap Students in CSE');
  const [newDescription, setNewDescription] = useState('');
  const [newDeadline, setNewDeadline] = useState('2026-10-15');

  // 1-on-1 review modal state
  const [showReviewModal, setShowReviewModal] = useState<StaffStudentItem | null>(null);
  const [reviewNote, setReviewNote] = useState('');
  const [reviewDate, setReviewDate] = useState('Tomorrow, 3:00 PM');

  // Toast alert
  const [bannerAlert, setBannerAlert] = useState<string | null>(null);

  const showAlert = (msg: string) => {
    setBannerAlert(msg);
    setTimeout(() => setBannerAlert(null), 5000);
  };

  // Filter students
  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.rollNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.topGaps.some((g) => g.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesRisk =
      selectedRiskFilter === 'all' || s.riskStatus.toLowerCase() === selectedRiskFilter.toLowerCase();

    const matchesCareer =
      selectedCareerFilter === 'all' || s.targetCareerId === selectedCareerFilter;

    return matchesSearch && matchesRisk && matchesCareer;
  });

  // Endorsement actions
  const handleApproveEndorsement = (id: string) => {
    setEndorsements((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status: 'Approved' } : e))
    );
    const targetReq = endorsements.find((e) => e.id === id);
    if (targetReq) {
      setStudents((prev) =>
        prev.map((st) =>
          st.id === targetReq.studentId
            ? {
                ...st,
                verifiedSkillsCount: st.verifiedSkillsCount + 1,
                readinessScore: Math.min(100, st.readinessScore + 5),
              }
            : st
        )
      );
      showAlert(`Verified ${targetReq.skillName} for ${targetReq.studentName}! (+5 readiness awarded)`);
    }
  };

  // Quick Mentoring Actions
  const handleRecommendBridgeCourse = (student: StaffStudentItem, skillName: string) => {
    showAlert(`Recommended bridge course "${skillName} Foundation" to ${student.name}.`);
  };

  const handleAssignProject = (student: StaffStudentItem) => {
    showAlert(`Assigned Capstone Project milestone to ${student.name}.`);
  };

  const handleScheduleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showReviewModal) return;
    showAlert(`Scheduled 1-on-1 review with ${showReviewModal.name} for ${reviewDate}.`);
    setShowReviewModal(null);
    setReviewNote('');
  };

  // Create intervention
  const handleCreateIntervention = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newTask: InterventionTask = {
      id: `int-${Date.now()}`,
      title: newTitle.trim(),
      targetAudience: newAudience,
      assignedStudentCount: 14,
      deadline: newDeadline,
      priority: 'HIGH',
      skillFocus: newSkillFocus,
      description: newDescription || 'Recommended bridge module to bridge market gap.',
      assignedBy: currentUser.name,
      status: 'Active',
    };

    setInterventions([newTask, ...interventions]);
    setShowNewInterventionModal(false);
    setNewTitle('');
    setNewDescription('');
    showAlert(`Dispatched "${newTask.title}" to assigned student cohort.`);
  };

  // Metrics (Section 5 Key Cards: Assigned Students: 42, High Risk: 8, Average Readiness: 68%, Pending Interventions: 5)
  const assignedStudentsCount = 42;
  const highRiskCount = 8;
  const averageReadinessScore = 68;
  const pendingInterventionsCount = interventions.length || 5;

  // Skill Gap Frequency (Section 5: Power BI — 64%, Cloud Computing — 52%, etc.)
  const skillGapFrequencies = [
    { skill: 'Power BI', missingPercentage: 64, affectedCount: 27, level: 'Critical Gap' },
    { skill: 'Cloud Computing', missingPercentage: 52, affectedCount: 22, level: 'High Deficit' },
    { skill: 'SQL & Database Design', missingPercentage: 48, affectedCount: 20, level: 'High Deficit' },
    { skill: 'Data Structures & Algorithms', missingPercentage: 41, affectedCount: 17, level: 'Moderate' },
    { skill: 'System Design Basics', missingPercentage: 38, affectedCount: 16, level: 'Moderate' },
    { skill: 'Technical Communication', missingPercentage: 33, affectedCount: 14, level: 'Foundational' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-16">
      {/* Top Section (Section 5 Directive) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold mb-1.5">
            <Briefcase className="w-3.5 h-3.5 text-emerald-600" />
            <span>Faculty Mentorship & Intervention Sector</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            STAFF PORTAL — STUDENT MENTORING & SKILL INTELLIGENCE
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 font-medium">
            {currentUser.name} • {currentUser.department} • Cohort Monitoring & Mentoring
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowNewInterventionModal(true)}
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Intervention</span>
          </button>
        </div>
      </div>

      {/* Alert Banner */}
      {bannerAlert && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-2xl text-xs font-semibold flex items-center justify-between shadow-xs">
          <span>{bannerAlert}</span>
          <button onClick={() => setBannerAlert(null)} className="font-bold text-emerald-700 p-1 cursor-pointer">
            ✕
          </button>
        </div>
      )}

      {/* 4 Section 5 Key Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-medium text-slate-500 block">Assigned Students</span>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
            {assignedStudentsCount}
          </div>
          <span className="text-[11px] font-semibold text-slate-500 block mt-0.5">
            CSE & IT Cohort
          </span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-rose-200 bg-rose-50/20 shadow-xs">
          <span className="text-xs font-medium text-rose-700 block">High Risk (Low Readiness)</span>
          <div className="text-2xl sm:text-3xl font-black text-rose-900 mt-1">
            {highRiskCount}
          </div>
          <span className="text-[11px] font-semibold text-rose-600 block mt-0.5">
            Below 60% Readiness
          </span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-emerald-200 bg-emerald-50/20 shadow-xs">
          <span className="text-xs font-medium text-emerald-700 block">Average Readiness</span>
          <div className="text-2xl sm:text-3xl font-black text-emerald-900 mt-1">
            {averageReadinessScore}%
          </div>
          <span className="text-[11px] font-semibold text-emerald-600 block mt-0.5">
            Target benchmark: 75%
          </span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-medium text-slate-500 block">Pending Interventions</span>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
            {pendingInterventionsCount}
          </div>
          <span className="text-[11px] font-semibold text-indigo-600 block mt-0.5">
            Active Campaigns
          </span>
        </div>
      </div>

      {/* Staff Tab Bar */}
      <div className="flex items-center gap-1.5 border-b border-slate-200 pb-2 overflow-x-auto text-xs font-semibold">
        {[
          { id: 'dashboard', label: 'Dashboard', icon: Briefcase },
          { id: 'students', label: 'My Students', icon: Users },
          { id: 'analytics', label: 'Skill Analytics', icon: BarChart3 },
          { id: 'course-performance', label: 'Course Performance', icon: Award },
          { id: 'mentoring', label: 'Mentoring', icon: BookOpen },
          { id: 'interventions', label: 'Interventions', icon: CalendarCheck },
          { id: 'reports', label: 'Reports', icon: FileText },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as StaffSubView)}
              className={`px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-slate-900 text-white font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* VIEW: DASHBOARD (Combines Performance Table, Skill Frequency & Mentoring Actions) */}
      {(activeTab === 'dashboard' || activeTab === 'students') && (
        <div className="space-y-6">
          {/* Main Section 1: Student Performance Table */}
          <div className="p-5 sm:p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Users className="w-4 h-4 text-emerald-600" />
                  Student Performance Table
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Assigned undergraduate mentee cohort and career preparation metrics
                </p>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search student / roll no..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 w-44 focus:w-56 transition-all"
                  />
                </div>

                <select
                  value={selectedRiskFilter}
                  onChange={(e) => setSelectedRiskFilter(e.target.value)}
                  className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700"
                >
                  <option value="all">All Risk Levels</option>
                  <option value="critical gap">Critical Gap (&lt;60%)</option>
                  <option value="developing">Developing (60-79%)</option>
                  <option value="job ready">Job Ready (80%+)</option>
                </select>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-3">Student Name</th>
                    <th className="py-3 px-3">Reg No</th>
                    <th className="py-3 px-3">Career Goal</th>
                    <th className="py-3 px-3">Readiness</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredStudents.map((st) => (
                    <tr key={st.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3 px-3 font-bold text-slate-900">
                        {st.name}
                      </td>
                      <td className="py-3 px-3 font-mono text-slate-500">
                        {st.rollNo}
                      </td>
                      <td className="py-3 px-3 text-slate-700 font-medium">
                        {st.targetCareerName}
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 w-8">
                            {st.readinessScore}%
                          </span>
                          <div className="w-16 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                st.readinessScore >= 80
                                  ? 'bg-emerald-500'
                                  : st.readinessScore >= 60
                                  ? 'bg-amber-500'
                                  : 'bg-rose-500'
                              }`}
                              style={{ width: `${st.readinessScore}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            st.riskStatus === 'Job Ready'
                              ? 'bg-emerald-100 text-emerald-800'
                              : st.riskStatus === 'Developing'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {st.riskStatus}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setShowReviewModal(st)}
                            className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold transition cursor-pointer"
                          >
                            Review
                          </button>
                          <button
                            onClick={() => setInspectedStudent(st)}
                            className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition cursor-pointer"
                          >
                            Details
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Main Section 2: Skill Gap Frequency */}
      {(activeTab === 'dashboard' || activeTab === 'analytics') && (
        <div className="p-5 sm:p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-indigo-600" />
                Skill Gap Frequency
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Which competencies are most commonly missing across students in your mentee cohort?
              </p>
            </div>
            <span className="text-xs font-bold text-slate-500">
              Sample size: {assignedStudentsCount} students
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {skillGapFrequencies.map((item) => (
              <div
                key={item.skill}
                className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="font-bold text-xs text-slate-900">{item.skill}</div>
                  <span className="text-xs font-black text-rose-600">
                    {item.missingPercentage}% students missing
                  </span>
                </div>

                {/* Bar */}
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-rose-500 rounded-full"
                    style={{ width: `${item.missingPercentage}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>{item.affectedCount} students affected</span>
                  <span className="font-semibold text-slate-700">{item.level}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Section 3: Mentoring Actions */}
      {(activeTab === 'dashboard' || activeTab === 'mentoring') && (
        <div className="p-5 sm:p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-600" />
              Mentoring Actions
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Direct interventions to resolve student gaps before recruitment cycles
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 1. Recommend bridge course */}
            <div className="p-4 rounded-xl border border-indigo-200 bg-indigo-50/40 space-y-3 flex flex-col justify-between">
              <div>
                <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold mb-2">
                  <BookOpen className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-sm text-slate-900">
                  Recommend Bridge Course
                </h4>
                <p className="text-xs text-slate-600 mt-1">
                  Assign curated self-paced courses for critical missing skills (e.g. Power BI, SQL).
                </p>
              </div>
              <button
                onClick={() => handleRecommendBridgeCourse(students[0], 'Power BI & DAX Essentials')}
                className="w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition cursor-pointer"
              >
                Recommend Bridge Course
              </button>
            </div>

            {/* 2. Assign project */}
            <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40 space-y-3 flex flex-col justify-between">
              <div>
                <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold mb-2">
                  <CalendarCheck className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-sm text-slate-900">
                  Assign Capstone Project
                </h4>
                <p className="text-xs text-slate-600 mt-1">
                  Prompt at-risk mentees to implement practical portfolio repos for GitHub review.
                </p>
              </div>
              <button
                onClick={() => handleAssignProject(students[0])}
                className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition cursor-pointer"
              >
                Assign Project
              </button>
            </div>

            {/* 3. Schedule 1-on-1 review */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3 flex flex-col justify-between">
              <div>
                <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold mb-2">
                  <Calendar className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-sm text-slate-900">
                  Schedule 1-on-1 Review
                </h4>
                <p className="text-xs text-slate-600 mt-1">
                  Host personal roadmap alignment session to diagnose root learning impediments.
                </p>
              </div>
              <button
                onClick={() => setShowReviewModal(students[0])}
                className="w-full py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition cursor-pointer"
              >
                Schedule 1-on-1 Review
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW: COURSE PERFORMANCE */}
      {(activeTab === 'course-performance' || activeTab === 'CoursePerformance') && (
        <CoursePerformance
          onTriggerIntervention={(studentName, courseName) => {
            showAlert(`Dispatched course mentoring nudge to ${studentName} for ${courseName}.`);
          }}
        />
      )}

      {/* VIEW: INTERVENTIONS */}
      {activeTab === 'interventions' && (
        <div className="p-5 sm:p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <CalendarCheck className="w-4 h-4 text-emerald-600" />
                Active Cohort Interventions
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Targeted skill-building campaigns dispatched to students
              </p>
            </div>
            <button
              onClick={() => setShowNewInterventionModal(true)}
              className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-semibold cursor-pointer"
            >
              + Create Campaign
            </button>
          </div>

          <div className="space-y-3">
            {interventions.map((task) => (
              <div
                key={task.id}
                className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900">{task.title}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-sm bg-rose-100 text-rose-800">
                      {task.priority}
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-sm bg-indigo-100 text-indigo-800">
                      Focus: {task.skillFocus}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">{task.description}</p>
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    Target: {task.targetAudience} • Deadline: {task.deadline}
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-100/70 px-2.5 py-1 rounded-lg">
                    {task.assignedStudentCount} Students Active
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW: REPORTS */}
      {activeTab === 'reports' && (
        <div className="p-5 sm:p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-600" />
              Cohort Mentorship & Readiness Reports
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Export comprehensive performance reviews and skill audits for department meetings
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-xs text-slate-900">
                  Faculty Cohort Skill Gap Audit (JSON / CSV Export)
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Contains all 42 mentee readiness scores, top missing competencies, and verification logs.
                </p>
              </div>
              <button
                onClick={() => {
                  showAlert('Downloaded Faculty Cohort Skill Gap Audit report.');
                }}
                className="px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-semibold cursor-pointer"
              >
                Export Report
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Student Inspection */}
      {inspectedStudent && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full rounded-2xl border border-slate-200 shadow-xl p-6 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-base text-slate-900">{inspectedStudent.name}</h3>
                <span className="text-xs text-slate-500">{inspectedStudent.rollNo} • {inspectedStudent.targetCareerName}</span>
              </div>
              <button
                onClick={() => setInspectedStudent(null)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span>Readiness Score:</span>
                <strong className="text-indigo-700 text-sm font-bold">{inspectedStudent.readinessScore}%</strong>
              </div>

              <div>
                <span className="font-bold text-slate-700 block mb-1">Top Missing Competencies:</span>
                <div className="flex flex-wrap gap-1.5">
                  {inspectedStudent.topGaps.map((gap) => (
                    <span key={gap} className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-800 border border-rose-200 text-xs font-semibold">
                      {gap}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="font-bold text-slate-700 block mb-1">Recommended Mentor Actions:</span>
                <p className="text-slate-600 bg-indigo-50/50 p-2.5 rounded-xl border border-indigo-100">
                  Assign 2-week bridge module on {inspectedStudent.topGaps[0] || 'Core Technical Foundations'} and review capstone implementation.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setInspectedStudent(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Schedule 1-on-1 Review */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleScheduleReviewSubmit}
            className="bg-white max-w-md w-full rounded-2xl border border-slate-200 shadow-xl p-6 space-y-4 animate-in zoom-in-95"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900">
                Schedule 1-on-1 Review
              </h3>
              <button
                type="button"
                onClick={() => setShowReviewModal(null)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-slate-600">
                Scheduling mentoring session for <strong>{showReviewModal.name}</strong> ({showReviewModal.rollNo}).
              </p>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Session Date & Time:
                </label>
                <input
                  type="text"
                  value={reviewDate}
                  onChange={(e) => setReviewDate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Focus / Agenda Note:
                </label>
                <textarea
                  rows={3}
                  value={reviewNote}
                  onChange={(e) => setReviewNote(e.target.value)}
                  placeholder={`e.g. Review ${showReviewModal.topGaps[0] || 'skill gaps'} and roadmap progress`}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowReviewModal(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold cursor-pointer"
              >
                Confirm Review
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal: New Intervention */}
      {showNewInterventionModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateIntervention}
            className="bg-white max-w-md w-full rounded-2xl border border-slate-200 shadow-xl p-6 space-y-4 animate-in zoom-in-95"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900">
                Create Skill Intervention
              </h3>
              <button
                type="button"
                onClick={() => setShowNewInterventionModal(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Intervention Title:
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 7-Day Power BI Bootcamp"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Skill Focus:
                </label>
                <select
                  value={newSkillFocus}
                  onChange={(e) => setNewSkillFocus(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
                >
                  <option value="Power BI">Power BI</option>
                  <option value="Cloud Computing">Cloud Computing</option>
                  <option value="SQL">SQL</option>
                  <option value="Data Structures">Data Structures</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Target Cohort:
                </label>
                <input
                  type="text"
                  value={newAudience}
                  onChange={(e) => setNewAudience(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Instructions / Description:
                </label>
                <textarea
                  rows={3}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Provide mentor guidelines or recommended practice..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowNewInterventionModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-semibold cursor-pointer"
              >
                Dispatch to Cohort
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
