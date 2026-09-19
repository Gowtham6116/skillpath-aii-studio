import { StudentProfile, UserRole, UserAccount } from '../types';

export type AuthRole = 'student' | 'staff' | 'campus';

export interface AuthSession {
  registerNumber: string;
  role: AuthRole;
  authenticated: boolean;
  name: string;
  department?: string;
  year?: string;
  studentProfileId?: string;
  token?: string;
  loginAt: string;
}

export interface DemoAccountDefinition {
  registerNumber: string;
  name: string;
  role: AuthRole;
  department: string;
  year?: string;
  designation?: string;
  cgpa?: number;
  targetCareer?: string;
  readinessScore?: number;
  roadmapProgress?: number;
  topGaps?: string[];
  status?: 'Job Ready' | 'Developing' | 'Critical Gap' | 'Active';
  profileData?: Partial<StudentProfile>;
  userAccount: UserAccount;
}

export interface LoginResult {
  success: boolean;
  session?: AuthSession;
  error?: string;
}
