import React, { useState } from 'react';
import {
  X,
  Printer,
  Share2,
  CheckCircle2,
  ShieldCheck,
  Award,
  Sparkles,
  Download,
} from 'lucide-react';
import { CourseCertificate } from '../types';
import { SkillgapCompassLogo } from './SkillgapCompassLogo';

interface CertificateModalProps {
  certificate: CourseCertificate | null;
  isOpen: boolean;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  certificate,
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !certificate) return null;

  const handleCopyLink = () => {
    const url = `${window.location.origin}/verify/${certificate.certificateId}`;
    navigator.clipboard?.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      id="certificate-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        id="certificate-modal-container"
        className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 my-8 print:border-none print:shadow-none print:my-0"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Actions Header (Hidden in Print) */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80 print:hidden">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-emerald-800 bg-emerald-100 rounded-full">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Verified & Issued
            </span>
            <span className="text-xs font-mono text-slate-500">ID: {certificate.certificateId}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="copy-certificate-link-btn"
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
              {copied ? 'Link Copied!' : 'Share / Copy Link'}
            </button>
            <button
              id="print-certificate-btn"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              Print / Save PDF
            </button>
            <button
              id="close-certificate-modal-btn"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Academic Print Canvas */}
        <div className="p-8 sm:p-12 bg-white relative">
          {/* Subtle Guilloché / Corner Accents */}
          <div className="border-[6px] border-double border-slate-800 p-8 sm:p-10 rounded-xl relative bg-gradient-to-b from-amber-50/20 via-white to-slate-50/30">
            {/* Corner Decorative Ornaments */}
            <div className="absolute top-2 left-2 w-8 h-8 border-t-2 border-l-2 border-amber-600"></div>
            <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-amber-600"></div>
            <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-amber-600"></div>
            <div className="absolute bottom-2 right-2 w-8 h-8 border-b-2 border-r-2 border-amber-600"></div>

            {/* Header: Logo & Institution */}
            <div className="text-center mb-6">
              <div className="flex items-center justify-center gap-3 mb-2">
                <SkillgapCompassLogo variant="horizontal" size="lg" />
              </div>
              <p className="text-xs tracking-[0.2em] font-bold text-slate-500 uppercase">
                College Skill Development & Career Intelligence Platform
              </p>
            </div>

            {/* Title */}
            <div className="text-center my-6">
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 tracking-wide">
                Certificate of Course Completion
              </h2>
              <div className="w-24 h-1 bg-amber-600 mx-auto mt-2.5 rounded-full"></div>
              <p className="text-xs text-slate-500 mt-2 font-medium tracking-wider uppercase">
                Technical Mastery & Hands-on Assessment
              </p>
            </div>

            {/* Body */}
            <div className="text-center my-6 max-w-xl mx-auto space-y-4">
              <p className="text-sm text-slate-600 font-serif italic">
                This credential is proudly awarded to
              </p>
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 border-b-2 border-slate-300 pb-2 inline-block px-8">
                {certificate.studentName}
              </h3>
              {certificate.studentRollNo && (
                <p className="text-xs text-slate-600 font-mono tracking-wider">
                  Roll No: <span className="font-semibold text-slate-900">{certificate.studentRollNo}</span>
                  {certificate.department && ` | Department: ${certificate.department}`}
                </p>
              )}

              <p className="text-sm text-slate-600 font-serif pt-2 leading-relaxed">
                for successfully completing the coursework, hands-on laboratory requirements, and
                final technical examination with distinction in
              </p>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl my-3">
                <h4 className="text-lg sm:text-xl font-bold text-slate-900">
                  {certificate.courseName}
                </h4>
                <div className="flex items-center justify-center gap-3 mt-2 text-xs text-slate-600">
                  <span className="font-medium text-slate-700">Track: {certificate.category}</span>
                  <span>•</span>
                  <span className="inline-flex items-center gap-1 font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded">
                    <Award className="w-3.5 h-3.5" />
                    {certificate.credits} Skill Credits Earned
                  </span>
                </div>
              </div>
            </div>

            {/* Footer / Signatures & Seal */}
            <div className="mt-10 pt-6 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-3 items-center gap-6 text-center">
              {/* Left Signee */}
              <div>
                <div className="font-serif italic text-base text-slate-800 font-bold border-b border-slate-300 pb-1 max-w-[160px] mx-auto">
                  Dr. Rajesh Raman
                </div>
                <p className="text-[11px] font-semibold text-slate-700 uppercase tracking-wider mt-1">
                  Director of Academic Affairs
                </p>
                <p className="text-[10px] text-slate-400">SkillGap Compass Board</p>
              </div>

              {/* Center Seal */}
              <div className="flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-full border-4 border-amber-600/70 bg-gradient-to-tr from-amber-600 via-amber-500 to-amber-700 flex items-center justify-center text-white shadow-md">
                  <ShieldCheck className="w-8 h-8" />
                </div>
                <span className="text-[10px] font-bold text-amber-800 uppercase tracking-widest mt-1.5">
                  Verified Credential
                </span>
                <span className="text-[9px] font-mono text-slate-400">{certificate.verificationCode}</span>
              </div>

              {/* Right Signee */}
              <div>
                <div className="font-serif italic text-base text-slate-800 font-bold border-b border-slate-300 pb-1 max-w-[160px] mx-auto">
                  {certificate.completionDate}
                </div>
                <p className="text-[11px] font-semibold text-slate-700 uppercase tracking-wider mt-1">
                  Date of Certification
                </p>
                <p className="text-[10px] text-slate-400">Credential ID: {certificate.certificateId}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex flex-wrap items-center justify-between text-[11px] text-slate-500 print:hidden">
          <span>
            Verified by SKILLGAP COMPASS Skill Ledger. Recognized for academic credit transfers.
          </span>
          <span className="font-mono text-slate-600">ID: {certificate.certificateId}</span>
        </div>
      </div>
    </div>
  );
};
