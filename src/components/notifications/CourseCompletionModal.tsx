import React, { useEffect } from 'react';
import { Award, CheckCircle2, Trophy, X, ArrowRight, BookOpen, ShieldCheck } from 'lucide-react';
import { CourseCompletionModalConfig } from '../../types/notifications';

interface CourseCompletionModalProps {
  config: CourseCompletionModalConfig | null;
  onClose: () => void;
}

export const CourseCompletionModal: React.FC<CourseCompletionModalProps> = ({
  config,
  onClose,
}) => {
  useEffect(() => {
    if (config) {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [config, onClose]);

  if (!config) return null;

  const {
    courseTitle,
    credits,
    certId,
    onViewCertificate,
    onContinueLearning,
  } = config;

  const handleViewCert = () => {
    onViewCertificate();
    onClose();
  };

  const handleContinue = () => {
    onContinueLearning?.();
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="course-completed-title"
      className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Celebration Header */}
        <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-6 sm:p-7 text-white text-center relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute -top-12 -right-12 w-36 h-36 bg-amber-500/20 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 w-36 h-36 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none" />

          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="absolute top-4 right-4 text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Icon Emblem */}
          <div className="relative mx-auto w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center mb-3.5 shadow-inner">
            <Trophy className="w-8 h-8 text-amber-400 animate-pulse" />
          </div>

          <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-amber-300 bg-amber-500/20 px-3 py-1 rounded-full mb-2 border border-amber-400/30">
            Official Course Mastery Verified
          </span>

          <h2
            id="course-completed-title"
            className="text-2xl sm:text-3xl font-black text-white tracking-tight"
          >
            🎉 Course Completed!
          </h2>

          <p className="text-sm font-semibold text-indigo-200 mt-1 max-w-md mx-auto line-clamp-1">
            {courseTitle}
          </p>

          <p className="text-xs text-slate-300 mt-1">
            You successfully completed the course.
          </p>
        </div>

        {/* Modal Body & Badges */}
        <div className="p-6 sm:p-7 space-y-5">
          <div className="grid grid-cols-2 gap-3.5">
            {/* Credits Card */}
            <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                  Academic Credits
                </span>
                <p className="text-base font-extrabold text-emerald-950">
                  +{credits} Credits
                </p>
              </div>
            </div>

            {/* Certificate Card */}
            <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 shadow-xs">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800">
                  Accreditation
                </span>
                <p className="text-xs font-bold text-amber-950 truncate">
                  Certificate Generated
                </p>
                <p className="text-[10px] font-mono text-amber-700 truncate">
                  {certId}
                </p>
              </div>
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-600 leading-relaxed">
            <span className="font-bold text-slate-900 block mb-0.5">
              Profile & Roadmap Updated:
            </span>
            Course competencies have been marked as verified in your skill profile, recalculating your target career readiness score and updating your personalized learning roadmap.
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handleContinue}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <BookOpen className="w-4 h-4 text-slate-500" />
              <span>Continue Learning</span>
            </button>

            <button
              type="button"
              onClick={handleViewCert}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>View Certificate</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
