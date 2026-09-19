import {
  StudentCourseProgress,
  CourseCertificate,
  StudentCreditSummary,
} from '../types';
import { getCourseById } from '../data/coursesData';

const PROGRESS_STORAGE_KEY = 'sgc_student_course_progress';
const CERTIFICATES_STORAGE_KEY = 'sgc_student_certificates';

// Initial state for Ajay Kumar (demo student)
const INITIAL_PROGRESS: StudentCourseProgress[] = [
  {
    studentId: 'demo-student',
    courseId: 'da-01',
    completedModules: [
      'da-01-m1',
      'da-01-m2',
      'da-01-m3',
      'da-01-m4',
      'da-01-m5',
      'da-01-m6',
      'da-01-m7',
      'da-01-m8',
    ],
    assessmentCompleted: true,
    progress: 100,
    status: 'Completed',
    creditsEarned: 100,
    startedAt: '2026-08-10',
    completedAt: '2026-09-02',
    certificateId: 'SGC-DA-0001',
  },
  {
    studentId: 'demo-student',
    courseId: 'da-03',
    completedModules: ['da-03-m1', 'da-03-m2', 'da-03-m3'],
    assessmentCompleted: true,
    progress: 100,
    status: 'Completed',
    creditsEarned: 100,
    startedAt: '2026-08-15',
    completedAt: '2026-09-08',
    certificateId: 'SGC-DA-0002',
  },
  {
    studentId: 'demo-student',
    courseId: 'da-04',
    completedModules: ['da-04-m1', 'da-04-m2', 'da-04-m3'],
    assessmentCompleted: true,
    progress: 100,
    status: 'Completed',
    creditsEarned: 100,
    startedAt: '2026-08-20',
    completedAt: '2026-09-12',
    certificateId: 'SGC-DA-0003',
  },
  {
    studentId: 'demo-student',
    courseId: 'da-07',
    completedModules: ['da-07-m1'],
    assessmentCompleted: false,
    progress: 65,
    status: 'In Progress',
    creditsEarned: 0, // Incomplete course has 0 credits earned!
    startedAt: '2026-09-14',
  },
];

const INITIAL_CERTIFICATES: CourseCertificate[] = [
  {
    id: 'cert-01',
    studentId: 'demo-student',
    studentName: 'Ajay Kumar',
    studentRollNo: '21CS042',
    courseId: 'da-01',
    courseName: 'Data Analytics Fundamentals',
    category: 'Data & Analytics',
    credits: 100,
    completionDate: 'September 2, 2026',
    certificateId: 'SGC-DA-0001',
    verificationCode: 'VRF-9821-4412-SGC',
    department: 'CSE',
  },
  {
    id: 'cert-02',
    studentId: 'demo-student',
    studentName: 'Ajay Kumar',
    studentRollNo: '21CS042',
    courseId: 'da-03',
    courseName: 'Python for Data Analysis',
    category: 'Data & Analytics',
    credits: 100,
    completionDate: 'September 8, 2026',
    certificateId: 'SGC-DA-0002',
    verificationCode: 'VRF-7743-1289-SGC',
    department: 'CSE',
  },
  {
    id: 'cert-03',
    studentId: 'demo-student',
    studentName: 'Ajay Kumar',
    studentRollNo: '21CS042',
    courseId: 'da-04',
    courseName: 'SQL for Data Analytics',
    category: 'Data & Analytics',
    credits: 100,
    completionDate: 'September 12, 2026',
    certificateId: 'SGC-DA-0003',
    verificationCode: 'VRF-6549-3011-SGC',
    department: 'CSE',
  },
];

export function getStoredProgress(): StudentCourseProgress[] {
  try {
    const raw = localStorage.getItem(PROGRESS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(INITIAL_PROGRESS));
      return INITIAL_PROGRESS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to read course progress from localStorage:', e);
    return INITIAL_PROGRESS;
  }
}

export function saveProgress(items: StudentCourseProgress[]) {
  try {
    localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(items));
  } catch (e) {
    console.error('Failed to save course progress to localStorage:', e);
  }
}

export function getStoredCertificates(): CourseCertificate[] {
  try {
    const raw = localStorage.getItem(CERTIFICATES_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(CERTIFICATES_STORAGE_KEY, JSON.stringify(INITIAL_CERTIFICATES));
      return INITIAL_CERTIFICATES;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to read certificates from localStorage:', e);
    return INITIAL_CERTIFICATES;
  }
}

export function saveCertificates(items: CourseCertificate[]) {
  try {
    localStorage.setItem(CERTIFICATES_STORAGE_KEY, JSON.stringify(items));
  } catch (e) {
    console.error('Failed to save certificates to localStorage:', e);
  }
}

export function getCourseProgress(courseId: string): StudentCourseProgress | undefined {
  const all = getStoredProgress();
  return all.find((p) => p.courseId === courseId);
}

export function enrollInCourse(courseId: string, studentId: string = 'demo-student'): StudentCourseProgress {
  const all = getStoredProgress();
  const existing = all.find((p) => p.courseId === courseId);
  if (existing) return existing;

  const newProgress: StudentCourseProgress = {
    studentId,
    courseId,
    completedModules: [],
    assessmentCompleted: false,
    progress: 0,
    status: 'In Progress',
    creditsEarned: 0,
    startedAt: new Date().toISOString().split('T')[0],
  };

  all.push(newProgress);
  saveProgress(all);
  return newProgress;
}

export function toggleModuleCompletion(
  courseId: string,
  moduleId: string,
  studentId: string = 'demo-student'
): StudentCourseProgress {
  const all = getStoredProgress();
  let item = all.find((p) => p.courseId === courseId);

  if (!item) {
    item = {
      studentId,
      courseId,
      completedModules: [],
      assessmentCompleted: false,
      progress: 0,
      status: 'In Progress',
      creditsEarned: 0,
      startedAt: new Date().toISOString().split('T')[0],
    };
    all.push(item);
  }

  const course = getCourseById(courseId);
  const totalModules = course?.modules.length || 1;

  if (item.completedModules.includes(moduleId)) {
    item.completedModules = item.completedModules.filter((id) => id !== moduleId);
    // If it was completed before, reopening a module revokes full completion
    if (item.status === 'Completed') {
      item.status = 'In Progress';
      item.creditsEarned = 0; // strictly 0 if incomplete
    }
  } else {
    item.completedModules.push(moduleId);
  }

  // Calculate progress percentage: modules count for 80%, assessment for 20%
  const modulePercentage = (item.completedModules.length / totalModules) * 80;
  const assessmentPercentage = item.assessmentCompleted ? 20 : 0;
  item.progress = Math.round(modulePercentage + assessmentPercentage);

  if (item.progress > 0 && item.status === 'Not Started') {
    item.status = 'In Progress';
  }

  saveProgress(all);
  return item;
}

export function completeCourseAssessmentAndAward(
  courseId: string,
  studentName: string = 'Ajay Kumar',
  studentRollNo: string = '21CS042',
  department: string = 'CSE',
  studentId: string = 'demo-student'
): { progress: StudentCourseProgress; certificate: CourseCertificate } {
  const all = getStoredProgress();
  let item = all.find((p) => p.courseId === courseId);
  const course = getCourseById(courseId);

  if (!item) {
    item = {
      studentId,
      courseId,
      completedModules: course?.modules.map((m) => m.id) || [],
      assessmentCompleted: true,
      progress: 100,
      status: 'Completed',
      creditsEarned: course?.credits || 100,
      startedAt: new Date().toISOString().split('T')[0],
    };
    all.push(item);
  } else {
    // Mark all modules completed as well
    if (course) {
      item.completedModules = course.modules.map((m) => m.id);
    }
    item.assessmentCompleted = true;
    item.progress = 100;
    item.status = 'Completed';
    item.creditsEarned = course?.credits || 100;
    item.completedAt = new Date().toISOString().split('T')[0];
  }

  // Generate certificate
  const certIdCode = `SGC-${(course?.category || 'SKILL')
    .slice(0, 2)
    .toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

  const verificationCode = `VRF-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(
    1000 + Math.random() * 9000
  )}-SGC`;

  item.certificateId = certIdCode;
  saveProgress(all);

  const certificates = getStoredCertificates();
  // Check if certificate already exists
  let cert = certificates.find((c) => c.courseId === courseId);
  if (!cert) {
    const today = new Date().toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });

    cert = {
      id: `cert-${Date.now()}`,
      studentId,
      studentName,
      studentRollNo,
      courseId,
      courseName: course?.title || 'Certified Course',
      category: course?.category || 'Data & Analytics',
      credits: course?.credits || 100,
      completionDate: today,
      certificateId: certIdCode,
      verificationCode,
      department,
    };
    certificates.push(cert);
    saveCertificates(certificates);
  }

  return { progress: item, certificate: cert };
}

export function getCreditSummary(): StudentCreditSummary {
  const allProgress = getStoredProgress();
  const certs = getStoredCertificates();

  // Strictly sum credits for completed courses only
  const completed = allProgress.filter((p) => p.status === 'Completed');
  const inProgress = allProgress.filter((p) => p.status === 'In Progress');

  const totalCredits = completed.reduce((acc, curr) => acc + curr.creditsEarned, 0);

  let levelBadge: StudentCreditSummary['levelBadge'] = 'Starter';
  let nextLevelCredits = 100;
  let levelProgress = 0;

  if (totalCredits >= 750) {
    levelBadge = 'Career Ready';
    nextLevelCredits = 1000;
    levelProgress = 100;
  } else if (totalCredits >= 500) {
    levelBadge = 'Advanced';
    nextLevelCredits = 750;
    levelProgress = Math.round(((totalCredits - 500) / 250) * 100);
  } else if (totalCredits >= 250) {
    levelBadge = 'Builder';
    nextLevelCredits = 500;
    levelProgress = Math.round(((totalCredits - 250) / 250) * 100);
  } else if (totalCredits >= 100) {
    levelBadge = 'Explorer';
    nextLevelCredits = 250;
    levelProgress = Math.round(((totalCredits - 100) / 150) * 100);
  } else {
    levelBadge = 'Starter';
    nextLevelCredits = 100;
    levelProgress = Math.round((totalCredits / 100) * 100);
  }

  return {
    totalCredits,
    completedCoursesCount: completed.length,
    inProgressCoursesCount: inProgress.length,
    certificatesCount: certs.length,
    levelBadge,
    nextLevelCredits,
    levelProgress,
  };
}

export function resetCourseData() {
  localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(INITIAL_PROGRESS));
  localStorage.setItem(CERTIFICATES_STORAGE_KEY, JSON.stringify(INITIAL_CERTIFICATES));
}
