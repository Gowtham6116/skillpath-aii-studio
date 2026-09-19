export type SkillLevel = 'Beginner' | 'Intermediate' | 'Advanced';
export type SkillStatus = 'Not Started' | 'Learning' | 'Completed';
export type PriorityLevel = 'HIGH' | 'MEDIUM' | 'LOW';

export interface StudentSkill {
  name: string;
  category: 'Programming' | 'Data' | 'AI/ML' | 'Cloud' | 'Tools' | 'Soft Skills';
  level: SkillLevel;
  status: SkillStatus;
}

export interface StudentProfile {
  id: string;
  fullName: string;
  email: string;
  college: string;
  department: string;
  academicYear: string;
  cgpa: number;
  skills: StudentSkill[];
  programmingLanguages: string[];
  tools: string[];
  certifications: string[];
  internships: string[];
  projects: string[];
  interests: string[];
  targetCareerId: string;
}

export interface CareerRequirement {
  id: string;
  name: string;
  shortDescription: string;
  detailedDescription: string;
  category: string;
  averageSalaryRange: string;
  jobDemand: 'Very High' | 'High' | 'Steady';
  requiredSkills: {
    name: string;
    category: 'Programming' | 'Data' | 'AI/ML' | 'Cloud' | 'Tools' | 'Soft Skills';
    weight: number; // 1-5 scale for weighted readiness calculation
    minRecommendedLevel: SkillLevel;
    priorityIfMissing: PriorityLevel;
    priorityReason: string;
  }[];
  typicalProjects: {
    title: string;
    description: string;
    skills: string[];
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
    estimatedHours: number;
  }[];
}

export interface SkillGapItem {
  skill: string;
  category: 'Programming' | 'Data' | 'AI/ML' | 'Cloud' | 'Tools' | 'Soft Skills';
  priority: PriorityLevel;
  reason: string;
  weight: number;
  currentStatus: SkillStatus;
  currentLevel?: SkillLevel;
  requiredLevel?: SkillLevel;
  recommendedOrder: number;
}

export interface SkillAnalysisResult {
  targetCareer: CareerRequirement;
  careerReadinessScore: number; // 0 to 100
  statusTier: 'Needs Work' | 'On Track' | 'Job Ready';
  summary: string;
  skillCoverage: {
    completed: number;
    total: number;
  };
  matchedSkills: StudentSkill[];
  skillGaps: SkillGapItem[];
  strongSkills: StudentSkill[];
  inProgressSkills: StudentSkill[];
  priorityGaps: SkillGapItem[];
}

export interface RoadmapTask {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
}

export interface RoadmapWeek {
  weekNumber: number;
  title: string;
  focusSkill: string;
  objective: string;
  tasks: RoadmapTask[];
  milestone: string;
  resources: {
    title: string;
    type: 'Documentation' | 'Video' | 'Practice' | 'Cheatsheet';
    url?: string;
  }[];
  associatedProjectTitle?: string;
  isCompleted: boolean;
}

export interface RecommendedProject {
  id: string;
  title: string;
  description: string;
  skills: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedHours: number;
  addedToRoadmap: boolean;
  whyRecommended: string;
}

export interface GeneratedRoadmap {
  summary: string;
  weeks: RoadmapWeek[];
  recommendedProjects: RecommendedProject[];
  generatedAt: string;
  isAI: boolean;
}

export interface AIChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  suggestedActions?: string[];
}

export type UserRole = 'student' | 'staff' | 'campus';

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  designation: string;
  organization: string;
  department?: string;
  avatarInitials: string;
  avatarColor: string;
}

export interface StaffStudentItem {
  id: string;
  name: string;
  rollNo: string;
  department: string;
  year: string;
  cgpa: number;
  targetCareerId: string;
  targetCareerName: string;
  readinessScore: number;
  roadmapProgress?: number;
  riskStatus: 'Critical Gap' | 'Developing' | 'Job Ready';
  topGaps: string[];
  verifiedSkillsCount: number;
  lastActive: string;
  email: string;
  notes?: string;
}

export interface SkillEndorsementRequest {
  id: string;
  studentId: string;
  studentName: string;
  rollNo: string;
  skillName: string;
  category: string;
  claimedLevel: SkillLevel;
  proofType: 'Course Certificate' | 'GitHub Repository' | 'Hackathon Project' | 'Lab Assessment';
  proofUrlOrDetail: string;
  submittedAt: string;
  status: 'Pending' | 'Approved' | 'Revision Requested';
  mentorFeedback?: string;
}

export interface InterventionTask {
  id: string;
  title: string;
  targetAudience: string;
  assignedStudentCount: number;
  deadline: string;
  priority: PriorityLevel;
  skillFocus: string;
  description: string;
  assignedBy: string;
  status: 'Active' | 'Completed';
}

// ==========================================
// COURSE & CREDIT & CERTIFICATE SYSTEM TYPES
// ==========================================

export type CourseLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export type CourseCategory =
  | 'Data & Analytics'
  | 'Full Stack Development'
  | 'AI & Machine Learning'
  | 'Cloud Computing'
  | 'Cybersecurity'
  | 'Software Development'
  | 'UI/UX & Design'
  | 'Database & Backend'
  | 'Career & Professional Skills';

export interface CourseModuleResource {
  id: string;
  title: string;
  type: 'Video' | 'Documentation' | 'Hands-on Lab' | 'Cheatsheet';
  url?: string;
  youtubeId?: string;
  duration?: string;
}

export interface CourseModule {
  id: string;
  courseId: string;
  order: number;
  title: string;
  description: string;
  estimatedMinutes: number;
  learningPoints: string[];
  resources: CourseModuleResource[];
}

export interface CourseFinalAssessment {
  title: string;
  description: string;
  projectPrompt?: string;
  questionsCount?: number;
  passingScore: number;
}

export interface Course {
  id: string;
  title: string;
  category: CourseCategory;
  level: CourseLevel;
  duration: string; // e.g. "8 Weeks", "6 Weeks"
  credits: number; // e.g. 50, 100, 150, 200
  skills: string[];
  description: string;
  learningOutcomes: string[];
  prerequisites: string[];
  modules: CourseModule[];
  finalAssessment: CourseFinalAssessment;
}

export interface StudentCourseProgress {
  studentId: string;
  courseId: string;
  completedModules: string[]; // module IDs
  assessmentCompleted: boolean;
  progress: number; // 0 to 100%
  status: 'Not Started' | 'In Progress' | 'Completed';
  creditsEarned: number; // Strictly 0 until status === 'Completed'
  startedAt?: string;
  completedAt?: string;
  certificateId?: string;
}

export interface CourseCertificate {
  id: string;
  studentId: string;
  studentName: string;
  studentRollNo?: string;
  courseId: string;
  courseName: string;
  category: CourseCategory;
  credits: number;
  completionDate: string;
  certificateId: string; // e.g. "SGC-DA-0001"
  verificationCode: string;
  department?: string;
}

export interface StudentCreditSummary {
  totalCredits: number;
  completedCoursesCount: number;
  inProgressCoursesCount: number;
  certificatesCount: number;
  levelBadge: 'Starter' | 'Explorer' | 'Builder' | 'Advanced' | 'Career Ready';
  nextLevelCredits: number;
  levelProgress: number; // 0 to 100
}

export interface FacultyStudentCourseRecord {
  id: string;
  studentId: string;
  studentName: string;
  rollNo: string;
  department: string;
  targetCareer: string;
  targetCareerId: string;
  courseId: string;
  courseName: string;
  category: CourseCategory;
  progress: number;
  creditsEarned: number;
  totalStudentCredits: number;
  certificatesCount: number;
  learningPerformance: 'High' | 'Medium' | 'Needs Attention';
  status: 'Not Started' | 'In Progress' | 'Completed';
  lastActive: string;
  readinessScore: number;
  cgpa: number;
  mentorNotes?: string;
}

