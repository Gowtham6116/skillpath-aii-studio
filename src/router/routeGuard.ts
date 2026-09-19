import { NavPage } from '../components/Sidebar';
import { AuthRole } from '../auth/authTypes';
import { UserRole } from '../types';

export interface RouteResolution {
  page: NavPage;
  subview?: string;
  openAssistant?: boolean;
  canonicalPath: string;
}

/**
 * Returns the default authorized landing dashboard path for each role.
 */
export function getRoleDefaultPath(role: AuthRole | UserRole): string {
  switch (role) {
    case 'staff':
      return '/staff/dashboard';
    case 'campus':
      return '/campus/dashboard';
    case 'student':
    default:
      return '/dashboard';
  }
}

/**
 * Converts NavPage and subview to canonical URL pathname
 */
export function pageToPath(page: NavPage, subview?: string, role?: AuthRole | UserRole): string {
  switch (page) {
    case 'login':
      return '/login';
    case 'dashboard':
      return '/dashboard';
    case 'profile':
      return '/profile';
    case 'careers':
      return '/careers';
    case 'assessment':
      return '/assessment';
    case 'analysis':
      return '/skill-gap';
    case 'courses':
      return '/courses';
    case 'roadmap':
      return '/roadmap';
    case 'projects':
      return '/projects';
    case 'progress':
      return '/progress';
    case 'certificates':
      return '/certificates';
    case 'skillmap':
      return '/skill-map';
    case 'settings':
      if (role === 'staff') return '/staff/settings';
      if (role === 'campus') return '/campus/settings';
      return '/settings';
    case 'staff':
      return subview && subview !== 'dashboard' ? `/staff/${subview}` : '/staff/dashboard';
    case 'admin':
      return subview && subview !== 'dashboard' ? `/campus/${subview}` : '/campus/dashboard';
    default:
      return '/login';
  }
}

/**
 * Validates whether a given URL path is authorized for the given role.
 * Strict route protection: unauthorized paths return false.
 */
export function isPathAuthorizedForRole(pathname: string, role: AuthRole | UserRole): boolean {
  const cleanPath = pathname.toLowerCase().trim();

  // Public / universally accessible pages
  if (cleanPath === '/login') {
    return true;
  }

  // Student routes
  const studentAllowed = [
    '/dashboard',
    '/profile',
    '/career',
    '/careers',
    '/skill-gap',
    '/analysis',
    '/courses',
    '/roadmap',
    '/projects',
    '/skill-map',
    '/skillmap',
    '/progress',
    '/certificates',
    '/assessment',
    '/assistant',
    '/settings',
  ];

  // Staff routes
  const staffAllowed = [
    '/staff/dashboard',
    '/staff/students',
    '/staff/analytics',
    '/staff/courses',
    '/staff/course-performance',
    '/staff/courseperformance',
    '/staff/mentoring',
    '/staff/interventions',
    '/staff/reports',
    '/staff/settings',
    '/settings',
  ];

  // Campus routes
  const campusAllowed = [
    '/campus/dashboard',
    '/campus/students',
    '/campus/skills',
    '/campus/courses',
    '/campus/careers',
    '/campus/training',
    '/campus/departments',
    '/campus/reports',
    '/campus/settings',
    '/settings',
  ];

  if (role === 'student') {
    // Explicitly forbidden to access staff or campus routes
    if (cleanPath.startsWith('/staff') || cleanPath.startsWith('/campus')) {
      return false;
    }
    return studentAllowed.includes(cleanPath);
  }

  if (role === 'staff') {
    // Explicitly forbidden to access student routes or campus routes
    if (cleanPath.startsWith('/campus')) {
      return false;
    }
    // Any student-specific primary view is unauthorized for staff
    if (
      cleanPath === '/dashboard' ||
      cleanPath === '/profile' ||
      cleanPath === '/courses' ||
      cleanPath === '/roadmap' ||
      cleanPath === '/skill-gap' ||
      cleanPath === '/projects' ||
      cleanPath === '/progress' ||
      cleanPath === '/certificates' ||
      cleanPath === '/skill-map'
    ) {
      return false;
    }
    return staffAllowed.includes(cleanPath);
  }

  if (role === 'campus') {
    // Explicitly forbidden to access student routes or staff routes
    if (cleanPath.startsWith('/staff')) {
      return false;
    }
    if (
      cleanPath === '/dashboard' ||
      cleanPath === '/profile' ||
      cleanPath === '/courses' ||
      cleanPath === '/roadmap' ||
      cleanPath === '/skill-gap' ||
      cleanPath === '/projects' ||
      cleanPath === '/progress' ||
      cleanPath === '/certificates' ||
      cleanPath === '/skill-map'
    ) {
      return false;
    }
    return campusAllowed.includes(cleanPath);
  }

  return false;
}

/**
 * Resolves a URL pathname into NavPage, subview, and flags.
 */
export function resolveRoute(
  pathname: string,
  currentRole: AuthRole | UserRole | null
): RouteResolution {
  const path = pathname.toLowerCase().trim();

  // 1. If not authenticated or on login
  if (!currentRole || path === '/login') {
    return {
      page: 'login',
      canonicalPath: '/login',
    };
  }

  // 2. Route Check & Auto-Redirect if Unauthorized
  if (!isPathAuthorizedForRole(path, currentRole)) {
    const fallbackPath = getRoleDefaultPath(currentRole);
    return resolveRoute(fallbackPath, currentRole);
  }

  // 3. Staff Routes
  if (path.startsWith('/staff')) {
    if (path === '/staff/settings') {
      return { page: 'settings', canonicalPath: '/staff/settings' };
    }
    const sub = path.replace('/staff/', '').replace('/staff', '');
    const validSubs = [
      'dashboard',
      'students',
      'analytics',
      'courses',
      'course-performance',
      'courseperformance',
      'mentoring',
      'interventions',
      'reports',
    ];
    let chosenSub = validSubs.includes(sub) ? sub : 'dashboard';
    if (chosenSub === 'courses' || chosenSub === 'courseperformance') chosenSub = 'course-performance';
    return {
      page: 'staff',
      subview: chosenSub,
      canonicalPath: `/staff/${chosenSub}`,
    };
  }

  // 4. Campus Routes
  if (path.startsWith('/campus')) {
    if (path === '/campus/settings') {
      return { page: 'settings', canonicalPath: '/campus/settings' };
    }
    const sub = path.replace('/campus/', '').replace('/campus', '');
    const validSubs = [
      'dashboard',
      'students',
      'skills',
      'courses',
      'careers',
      'training',
      'departments',
      'reports',
    ];
    const chosenSub = validSubs.includes(sub) ? sub : 'dashboard';
    return {
      page: 'admin',
      subview: chosenSub,
      canonicalPath: `/campus/${chosenSub}`,
    };
  }

  // 5. Student Routes
  switch (path) {
    case '/profile':
      return { page: 'profile', canonicalPath: '/profile' };
    case '/career':
    case '/careers':
      return { page: 'careers', canonicalPath: '/careers' };
    case '/assessment':
      return { page: 'assessment', canonicalPath: '/assessment' };
    case '/skill-gap':
    case '/analysis':
      return { page: 'analysis', canonicalPath: '/skill-gap' };
    case '/courses':
      return { page: 'courses', canonicalPath: '/courses' };
    case '/roadmap':
      return { page: 'roadmap', canonicalPath: '/roadmap' };
    case '/projects':
      return { page: 'projects', canonicalPath: '/projects' };
    case '/progress':
      return { page: 'progress', canonicalPath: '/progress' };
    case '/certificates':
      return { page: 'certificates', canonicalPath: '/certificates' };
    case '/skill-map':
    case '/skillmap':
      return { page: 'skillmap', canonicalPath: '/skill-map' };
    case '/assistant':
      return { page: 'dashboard', openAssistant: true, canonicalPath: '/assistant' };
    case '/settings':
      return { page: 'settings', canonicalPath: '/settings' };
    case '/dashboard':
    default:
      return { page: 'dashboard', canonicalPath: '/dashboard' };
  }
}
