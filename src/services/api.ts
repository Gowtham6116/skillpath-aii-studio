import { CAREERS_DATA } from '../data/careers';
import { MASTER_SKILLS_LIST } from '../data/skills';
import { DEMO_STUDENT, COLLEGE_ADMIN_DATA } from '../data/demoData';
import {
  CareerRequirement,
  GeneratedRoadmap,
  SkillAnalysisResult,
  StudentProfile,
} from '../types';
import { analyzeSkills } from './skillAnalysis';
import { generateDeterministicRoadmap } from './roadmapGenerator';

/**
 * Client-Side API Service with seamless local fallbacks
 */

export async function fetchCareers(): Promise<CareerRequirement[]> {
  try {
    const res = await fetch('/api/careers');
    if (res.ok) return await res.json();
  } catch {
    // Network or server starting up
  }
  return CAREERS_DATA;
}

export async function fetchSkillsList() {
  try {
    const res = await fetch('/api/skills');
    if (res.ok) return await res.json();
  } catch {
    // Fallback
  }
  return MASTER_SKILLS_LIST;
}

export async function fetchDemoProfile(): Promise<StudentProfile> {
  try {
    const res = await fetch('/api/demo-profile');
    if (res.ok) return await res.json();
  } catch {
    // Fallback
  }
  return DEMO_STUDENT;
}

export async function fetchAdminMetrics() {
  try {
    const res = await fetch('/api/admin/metrics');
    if (res.ok) return await res.json();
  } catch {
    // Fallback
  }
  return COLLEGE_ADMIN_DATA;
}

export async function checkBackendHealth(): Promise<{ status: string; geminiConfigured: boolean }> {
  try {
    const res = await fetch('/api/health');
    if (res.ok) return await res.json();
  } catch {
    // Fallback
  }
  return { status: 'client-fallback', geminiConfigured: false };
}

export async function requestSkillAnalysis(profile: StudentProfile): Promise<SkillAnalysisResult> {
  try {
    const res = await fetch('/api/analyze-skills', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profile }),
    });
    if (res.ok) return await res.json();
  } catch {
    // Fallback
  }
  return analyzeSkills(profile);
}

export async function requestRoadmapGeneration(profile: StudentProfile): Promise<GeneratedRoadmap> {
  try {
    const res = await fetch('/api/generate-roadmap', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profile }),
    });
    if (res.ok) return await res.json();
  } catch {
    // Fallback
  }
  const analysis = analyzeSkills(profile);
  return generateDeterministicRoadmap(profile, analysis);
}

export async function sendAIChatMessage(
  message: string,
  profile: StudentProfile
): Promise<{ reply: string; isAI: boolean }> {
  try {
    const res = await fetch('/api/ai-assistant', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, profile }),
    });
    if (res.ok) return await res.json();
  } catch {
    // Fallback
  }

  // Pure client fallback if network fails
  const analysis = analyzeSkills(profile);
  const topGap = analysis.skillGaps[0]?.skill || 'Key Skills';
  return {
    reply: `Based on your target of **${analysis.targetCareer.name}** and current **${analysis.careerReadinessScore}%** readiness score, your most immediate focus should be **${topGap}**. Check out the Career Roadmap tab to track your weekly milestones!`,
    isAI: false,
  };
}
