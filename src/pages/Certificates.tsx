import React, { useState, useMemo } from 'react';
import {
  Award,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ExternalLink,
  Printer,
  Calendar,
  Sparkles,
  ArrowRight,
  Download,
  BookOpen,
  Share2,
} from 'lucide-react';
import { CourseCertificate, StudentProfile } from '../types';
import {
  getStoredCertificates,
  getCreditSummary,
  getStoredProgress,
} from '../services/courseStorage';
import { COURSES_CATALOG, getCourseById } from '../data/coursesData';
import { CertificateModal } from '../components/CertificateModal';

interface CertificatesPageProps {
  profile: StudentProfile;
  onNavigateToCourses?: () => void;
}

export const CertificatesPage: React.FC<CertificatesPageProps> = ({
  profile,
  onNavigateToCourses,
}) => {
  const [selectedCert, setSelectedCert] = useState<CourseCertificate | null>(null);

  const certificates = useMemo(() => {
    return getStoredCertificates();
  }, []);

  const creditSummary = useMemo(() => {
    return getCreditSummary();
  }, []);

  const progressList = useMemo(() => {
    return getStoredProgress();
  }, []);

  // In-progress courses that will unlock certificates on completion
  const lockedCourses = useMemo(() => {
    const inProgressIds = progressList
      .filter((p) => p.status === 'In Progress')
      .map((p) => p.courseId);

    return inProgressIds
      .map((id) => getCourseById(id))
      .filter((c): c is NonNullable<typeof c> => !!c);
  }, [progressList]);

  return (
    <div className="space-y-6 pb-16 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-amber-950 rounded-2xl p-6 sm:p-8 text-white shadow-xl border border-slate-700/50">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-semibold tracking-wide uppercase mb-3">
              <Award className="w-3.5 h-3.5" />
              Accredited Student Credentials
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Course Certificates & Credit Ledger
            </h1>
            <p className="text-slate-300 text-sm mt-1.5 max-w-2xl">
              Official certificates awarded upon passing comprehensive course curriculum, laboratory
              benchmarks, and technical assessments on SKILLGAP COMPASS.
            </p>
          </div>

          {onNavigateToCourses && (
            <button
              id="browse-more-courses-btn"
              onClick={onNavigateToCourses}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl transition-colors shrink-0 shadow-sm"
            >
              <BookOpen className="w-4 h-4" />
              Browse Course Catalog
            </button>
          )}
        </div>
      </div>

      {/* Credit & Level Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Certificates */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Certificates Issued</span>
            <Award className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900">{creditSummary.certificatesCount}</p>
          <p className="text-xs text-emerald-600 font-medium mt-1">Verified & Digitally Sealed</p>
        </div>

        {/* Total Credits */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Credits Earned</span>
            <Sparkles className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-bold text-amber-600">{creditSummary.totalCredits}</p>
          <p className="text-xs text-slate-500 mt-1">
            Awarded only on 100% course completion
          </p>
        </div>

        {/* Credit Level Badge */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Credit Level</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-xl font-bold text-slate-900">{creditSummary.levelBadge}</p>
          <div className="mt-2">
            <div className="flex justify-between text-[11px] text-slate-500 mb-1">
              <span>Tier Progress</span>
              <span>{creditSummary.levelProgress}%</span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-emerald-600 h-full rounded-full transition-all"
                style={{ width: `${creditSummary.levelProgress}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Next Tier Requirement */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Next Target Tier</span>
            <Lock className="w-4 h-4 text-slate-400" />
          </div>
          <p className="text-xl font-bold text-slate-900">
            {creditSummary.nextLevelCredits} Credits
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Need {Math.max(0, creditSummary.nextLevelCredits - creditSummary.totalCredits)} more
            credits
          </p>
        </div>
      </div>

      {/* Earned Certificates Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">
            Earned Certificates ({certificates.length})
          </h2>
          <span className="text-xs text-slate-500">
            Click any certificate to inspect, print, or share.
          </span>
        </div>

        {certificates.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-xl border border-slate-200">
            <Award className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">No Certificates Earned Yet</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Enroll in a course from the Course Library, complete all modules and the final assessment
              to receive your accredited certificate.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {certificates.map((cert) => (
              <div
                key={cert.id}
                id={`certificate-card-${cert.id}`}
                className="bg-white rounded-xl border border-slate-200 hover:border-amber-300 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group relative overflow-hidden"
              >
                {/* Subtle Amber Edge Accent */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600"></div>

                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      {cert.category}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400 font-medium">
                      {cert.certificateId}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 group-hover:text-amber-700 transition-colors line-clamp-2">
                    {cert.courseName}
                  </h3>

                  <div className="flex items-center gap-2 mt-3 text-xs text-slate-500">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>Completed {cert.completionDate}</span>
                  </div>

                  <div className="mt-3 p-2.5 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-600 font-medium">Credit Award</span>
                    <span className="font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                      +{cert.credits} Credits
                    </span>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Verified
                  </div>

                  <button
                    id={`view-cert-btn-${cert.id}`}
                    onClick={() => setSelectedCert(cert)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                  >
                    <span>View Certificate</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Locked Certificates (Courses in Progress) */}
      {lockedCourses.length > 0 && (
        <div className="space-y-4 pt-4 border-t border-slate-200">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">
              Certificates In Progress ({lockedCourses.length})
            </h2>
            <span className="text-xs text-slate-500">
              Locked until final assessment completion.
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {lockedCourses.map((course) => {
              const prog = progressList.find((p) => p.courseId === course.id);
              const progressPct = prog?.progress || 0;

              return (
                <div
                  key={course.id}
                  className="bg-slate-50/70 rounded-xl border border-dashed border-slate-300 p-5 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[10px] font-medium text-slate-500 bg-slate-200/80 px-2 py-0.5 rounded">
                        {course.category}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500">
                        <Lock className="w-3 h-3" /> Locked
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-800 line-clamp-1">
                      {course.title}
                    </h3>

                    <div className="mt-3">
                      <div className="flex justify-between text-[11px] font-semibold text-slate-600 mb-1">
                        <span>Course Completion</span>
                        <span>{progressPct}%</span>
                      </div>
                      <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-indigo-600 h-full rounded-full"
                          style={{ width: `${progressPct}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
                    <span>Unlocks: +{course.credits} Credits</span>
                    {onNavigateToCourses && (
                      <button
                        onClick={onNavigateToCourses}
                        className="text-indigo-600 hover:text-indigo-800 font-semibold"
                      >
                        Continue &rarr;
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Certificate Viewer Modal */}
      <CertificateModal
        certificate={selectedCert}
        isOpen={!!selectedCert}
        onClose={() => setSelectedCert(null)}
      />
    </div>
  );
};
