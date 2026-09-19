import { AuthRole, AuthSession, LoginResult, DemoAccountDefinition } from './authTypes';
import {
  ALL_DEMO_ACCOUNTS,
  COMMON_DEMO_PASSWORD,
  DEMO_STUDENT_ACCOUNTS,
} from './demoAccounts';

const STORAGE_KEY = 'skillgap_session';

export class AuthService {
  /**
   * Normalizes the college register number:
   * - Trims leading/trailing whitespace
   * - Converts to uppercase
   */
  public static normalizeRegisterNumber(input: string): string {
    if (!input) return '';
    return input.trim().toUpperCase();
  }

  /**
   * Validates and authenticates college register number and password against role
   */
  public static login(
    registerNumber: string,
    password: string,
    role: AuthRole
  ): LoginResult {
    const regNo = this.normalizeRegisterNumber(registerNumber);

    if (!regNo) {
      return { success: false, error: 'Register ID is required' };
    }

    if (!password) {
      return { success: false, error: 'Password is required' };
    }

    if (!role) {
      return { success: false, error: 'Please select a role' };
    }

    // Lookup demo account
    const account = ALL_DEMO_ACCOUNTS.find(
      (a) => a.registerNumber.toUpperCase() === regNo
    );

    // Password check (must match the universal demo password)
    if (!account || password !== COMMON_DEMO_PASSWORD) {
      return {
        success: false,
        error: 'Invalid login details. Please check your Register ID, password and role.',
      };
    }

    // Role check: role must strictly match the account type
    if (account.role !== role) {
      return {
        success: false,
        error: 'Invalid login details. Please check your Register ID, password and role.',
      };
    }

    // Successful login - store safe session state (never store raw password)
    const session: AuthSession = {
      registerNumber: account.registerNumber,
      role: account.role,
      authenticated: true,
      name: account.name,
      department: account.department,
      year: account.year,
      studentProfileId: account.registerNumber,
      loginAt: new Date().toISOString(),
    };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    } catch (err) {
      console.error('Failed to persist auth session to localStorage', err);
    }

    return { success: true, session };
  }

  /**
   * Quick 1-click Demo Login for hackathon testing (defaults to 23CSE001 - Ajay)
   */
  public static loginAsDemo(registerNumber = '23CSE001'): LoginResult {
    const target = ALL_DEMO_ACCOUNTS.find(
      (a) => a.registerNumber.toUpperCase() === registerNumber.toUpperCase()
    ) || DEMO_STUDENT_ACCOUNTS[0];

    return this.login(target.registerNumber, COMMON_DEMO_PASSWORD, target.role);
  }

  /**
   * Clears the current session and logs out
   */
  public static logout(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (err) {
      console.error('Failed to clear session from localStorage', err);
    }
  }

  /**
   * Retrieves the current authenticated session
   */
  public static getCurrentSession(): AuthSession | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const parsed: AuthSession = JSON.parse(raw);
      if (parsed && parsed.authenticated && parsed.registerNumber) {
        return parsed;
      }
    } catch {
      return null;
    }
    return null;
  }

  /**
   * Checks if a user is currently authenticated
   */
  public static isAuthenticated(): boolean {
    const session = this.getCurrentSession();
    return Boolean(session && session.authenticated);
  }

  /**
   * Checks if current user has the specified role
   */
  public static hasRole(role: AuthRole): boolean {
    const session = this.getCurrentSession();
    return Boolean(session && session.authenticated && session.role === role);
  }

  /**
   * Finds the account definition for the given session or register number
   */
  public static getAccount(registerNumber: string): DemoAccountDefinition | undefined {
    const regNo = this.normalizeRegisterNumber(registerNumber);
    return ALL_DEMO_ACCOUNTS.find((a) => a.registerNumber.toUpperCase() === regNo);
  }
}
