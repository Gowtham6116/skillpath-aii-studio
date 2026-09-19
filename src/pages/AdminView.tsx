import React, { useState, useEffect } from 'react';
import {
  School,
  TrendingUp,
  AlertTriangle,
  Award,
  Users,
  Sparkles,
  Download,
  Calendar,
  CheckCircle2,
  Building2,
  Briefcase,
  FileText,
  BarChart3,
  PieChart,
  Layers,
  ArrowUpRight,
} from 'lucide-react';
import { COLLEGE_ADMIN_DATA, CAMPUS_RECRUITER_BENCHMARKS } from '../data/demoData';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  Legend,
} from 'recharts';

export type CampusSubView =
  | 'dashboard'
  | 'students'
  | 'skills'
  | 'courses'
  | 'careers'
  | 'training'
  | 'departments'
  | 'reports';

interface AdminViewProps {
  activeView?: CampusSubView;
}

export const AdminView: React.FC<AdminViewProps> = ({ activeView = 'dashboard' }) => {
  const {
    collegeName,
    suggestedWorkshops: initialWorkshops,
  } = COLLEGE_ADMIN_DATA;

  const [activeTab, setActiveTab] = useState<CampusSubView>(activeView);
  const [downloadSuccessToast, setDownloadSuccessToast] = useState(false);

  useEffect(() => {
    if (activeView) {
      setActiveTab(activeView);
    }
  }, [activeView]);

  const [workshops, setWorkshops] = useState(
    initialWorkshops.map((ws, i) => ({
      ...ws,
      id: `ws-${i}`,
      status: i === 0 ? 'In Progress' : 'Scheduled',
      registeredCount: i === 0 ? 142 : i === 1 ? 96 : 78,
    }))
  );

  // Toggle workshop status
  const handleToggleStatus = (id: string) => {
    setWorkshops((prev) =>
      prev.map((w) =>
        w.id === id
          ? {
              ...w,
              status:
                w.status === 'Scheduled'
                  ? 'In Progress'
                  : w.status === 'In Progress'
                  ? 'Completed'
                  : 'Scheduled',
            }
          : w
      )
    );
  };

  // Section 6 Data Points
  const totalStudents = 1240;
  const campusAverageReadiness = 71;
  const industryPlacementReady = 62;
  const topSkillShortage = 'Cloud & AI';

  // Section 6: Department Readiness Comparison
  const departmentReadiness = [
    { department: 'CSE', readiness: 74, target: 80, students: 480 },
    { department: 'IT', readiness: 72, target: 80, students: 260 },
    { department: 'ECE', readiness: 69, target: 75, students: 240 },
    { department: 'MECH', readiness: 58, target: 70, students: 140 },
    { department: 'CIVIL', readiness: 54, target: 70, students: 120 },
  ];

  // Section 6: Industry Demand vs Student Readiness
  const marketDemandVsSupply = [
    { skill: 'Cloud & DevOps', marketDemand: 88, studentSupply: 46 },
    { skill: 'AI & Data Science', marketDemand: 85, studentSupply: 52 },
    { skill: 'Full Stack Development', marketDemand: 82, studentSupply: 71 },
    { skill: 'SQL & Database Design', marketDemand: 79, studentSupply: 58 },
    { skill: 'Cybersecurity', marketDemand: 76, studentSupply: 39 },
    { skill: 'Data Visualization (Power BI)', marketDemand: 70, studentSupply: 44 },
  ];

  // Export Audit Report
  const handleExportAuditReport = () => {
    const reportData = {
      platform: 'SKILLGAP COMPASS',
      institution: collegeName,
      generatedAt: new Date().toISOString(),
      keyMetrics: {
        totalStudents,
        campusAverageReadiness: `${campusAverageReadiness}%`,
        industryPlacementReady: `${industryPlacementReady}%`,
        topSkillShortage,
      },
      departmentReadiness,
      marketDemandVsSupply,
      recruiterBenchmarks: CAMPUS_RECRUITER_BENCHMARKS,
      trainingPlanner: workshops,
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `SkillGap_Compass_Campus_Audit_${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);

    setDownloadSuccessToast(true);
    setTimeout(() => setDownloadSuccessToast(false), 4000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-16">
      {/* Top Section (Section 6 Directive) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold mb-1.5">
            <School className="w-3.5 h-3.5 text-amber-600" />
            <span>Institutional Executive Leadership</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            CAMPUS SKILL INTELLIGENCE & PLACEMENT ANALYTICS
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 font-medium">
            {collegeName} • Macro Strategic Intelligence & Industry Placement Engine
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportAuditReport}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition cursor-pointer"
          >
            <Download className="w-4 h-4 text-slate-300" />
            <span>Export Readiness Summary</span>
          </button>
        </div>
      </div>

      {downloadSuccessToast && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-2xl text-xs font-semibold flex items-center gap-2 shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Institutional skill intelligence audit exported successfully.</span>
        </div>
      )}

      {/* 4 Section 6 Key Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-medium text-slate-500 block">Total Students</span>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
            {totalStudents.toLocaleString()}
          </div>
          <span className="text-[11px] font-semibold text-slate-500 block mt-0.5">
            Enrolled 2023–2027
          </span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-emerald-200 bg-emerald-50/20 shadow-xs">
          <span className="text-xs font-medium text-emerald-700 block">Campus Average Readiness</span>
          <div className="text-2xl sm:text-3xl font-black text-emerald-900 mt-1">
            {campusAverageReadiness}%
          </div>
          <span className="text-[11px] font-semibold text-emerald-600 block mt-0.5">
            +4.2% this quarter
          </span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-indigo-200 bg-indigo-50/20 shadow-xs">
          <span className="text-xs font-medium text-indigo-700 block">Industry Placement Ready</span>
          <div className="text-2xl sm:text-3xl font-black text-indigo-900 mt-1">
            {industryPlacementReady}%
          </div>
          <span className="text-[11px] font-semibold text-indigo-600 block mt-0.5">
            768 students job-ready
          </span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-rose-200 bg-rose-50/20 shadow-xs">
          <span className="text-xs font-medium text-rose-700 block">Top Skill Shortage</span>
          <div className="text-xl sm:text-2xl font-black text-rose-900 mt-1 truncate">
            {topSkillShortage}
          </div>
          <span className="text-[11px] font-semibold text-rose-600 block mt-0.5">
            Highest deficit vs market
          </span>
        </div>
      </div>

      {/* Campus Navigation Tabs */}
      <div className="flex items-center gap-1.5 border-b border-slate-200 pb-2 overflow-x-auto text-xs font-semibold">
        {[
          { id: 'dashboard', label: 'Dashboard', icon: School },
          { id: 'departments', label: 'Departments', icon: Building2 },
          { id: 'skills', label: 'Skill Intelligence', icon: BarChart3 },
          { id: 'courses', label: 'Course Intelligence', icon: Award },
          { id: 'careers', label: 'Career Demand', icon: PieChart },
          { id: 'training', label: 'Training Planner', icon: Layers },
          { id: 'reports', label: 'Reports', icon: FileText },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as CampusSubView)}
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

      {/* Main Section 1: Department Readiness Comparison (Section 6) */}
      {(activeTab === 'dashboard' || activeTab === 'departments') && (
        <div className="p-5 sm:p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-amber-600" />
                Department Readiness Comparison
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Benchmark placement preparation rates across academic branches
              </p>
            </div>
            <span className="text-xs font-bold text-slate-500">
              5 Departments Evaluated
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 pt-2">
            {departmentReadiness.map((dept) => (
              <div
                key={dept.department}
                className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-sm text-slate-900">{dept.department}</span>
                  <span className="text-xs font-bold text-slate-500">{dept.students} std</span>
                </div>

                <div className="text-2xl font-black text-slate-900">
                  {dept.readiness}%
                </div>

                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      dept.readiness >= 70
                        ? 'bg-emerald-500'
                        : dept.readiness >= 60
                        ? 'bg-amber-500'
                        : 'bg-rose-500'
                    }`}
                    style={{ width: `${dept.readiness}%` }}
                  />
                </div>

                <div className="text-[11px] text-slate-500 flex justify-between">
                  <span>Target: {dept.target}%</span>
                  <span className={dept.readiness >= dept.target - 5 ? 'text-emerald-600 font-bold' : 'text-rose-600 font-bold'}>
                    {dept.readiness >= dept.target ? 'Achieved' : 'Gap'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Section 2: Industry Demand vs Student Readiness (Section 6) */}
      {(activeTab === 'dashboard' || activeTab === 'skills' || activeTab === 'careers') && (
        <div className="p-5 sm:p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-indigo-600" />
                Industry Demand vs Student Readiness
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Market required competencies vs actual campus student skill supply
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-indigo-600" />
                <span className="text-slate-600 font-semibold">Corporate Demand</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-emerald-500" />
                <span className="text-slate-600 font-semibold">Student Supply</span>
              </div>
            </div>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={marketDemandVsSupply}
                margin={{ top: 10, right: 10, left: -20, bottom: 25 }}
              >
                <XAxis
                  dataKey="skill"
                  tickLine={false}
                  axisLine={false}
                  fontSize={11}
                  stroke="#64748b"
                  angle={-15}
                  textAnchor="end"
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  fontSize={11}
                  stroke="#64748b"
                  unit="%"
                />
                <Tooltip
                  formatter={(val: any, name: any) => [`${val}%`, name === 'marketDemand' ? 'Market Demand' : 'Student Supply']}
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
                <Bar dataKey="marketDemand" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                <Bar dataKey="studentSupply" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Main Section 3: Curriculum / Training Planner (Section 6) */}
      {(activeTab === 'dashboard' || activeTab === 'training') && (
        <div className="p-5 sm:p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-600" />
                Curriculum / Training Planner
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Targeted institutional training modules suggested to close industry gaps
              </p>
            </div>
            <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg">
              {workshops.length} Interventions Active
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {workshops.map((ws) => (
              <div
                key={ws.id}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 font-bold uppercase tracking-wider">
                      {ws.targetAudience}
                    </span>
                    <button
                      onClick={() => handleToggleStatus(ws.id)}
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold transition cursor-pointer ${
                        ws.status === 'Completed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : ws.status === 'In Progress'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {ws.status} (Click)
                    </button>
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 mb-1">{ws.workshopTitle}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{ws.rationale}</p>
                </div>

                <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px]">
                  <span className="text-emerald-700 font-semibold">{ws.projectedImpact}</span>
                  <span className="text-slate-500">{ws.registeredCount} enrolled</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Section: Institutional Course Intelligence */}
      {(activeTab === 'dashboard' || activeTab === 'courses') && (
        <div className="p-5 sm:p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-600" />
                Institutional Course Completion & Credit Intelligence
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Macro tracking of accredited skill development courses, certificate issuances, and earned student credits
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
              1,245 Verified Course Completions
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Top Domain Enrollment</span>
              <p className="text-xl font-bold text-indigo-900 mt-1">Data & Analytics</p>
              <p className="text-xs text-slate-500 mt-0.5">38% of all course enrollments across 5 departments</p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Accredited Skill Credits</span>
              <p className="text-xl font-bold text-amber-600 mt-1">98,450 Credits</p>
              <p className="text-xs text-slate-500 mt-0.5">Recognized for elective curriculum fulfillment</p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Certification Pass Rate</span>
              <p className="text-xl font-bold text-emerald-600 mt-1">84.2%</p>
              <p className="text-xs text-slate-500 mt-0.5">Assessed by automated hands-on laboratory benchmarks</p>
            </div>
          </div>
        </div>
      )}

      {/* Main Section 4: Institutional Reports (Section 6) */}
      {(activeTab === 'dashboard' || activeTab === 'reports') && (
        <div className="p-5 sm:p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-600" />
                Institutional Reports & Placement Audits
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Download verified placement metrics and accreditation compliance summaries
              </p>
            </div>
            <button
              onClick={handleExportAuditReport}
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Readiness Summary</span>
            </button>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
            <div className="font-bold text-slate-900">
              Campus Accreditation & Placement Benchmark Dossier
            </div>
            <p className="text-slate-600 leading-relaxed">
              Includes comprehensive department audits (CSE: 74%, ECE: 69%, IT: 72%, MECH: 58%, CIVIL: 54%),
              market demand vs student supply graphs, and corporate benchmark match rates (Google, TCS, Deloitte, Amazon).
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
