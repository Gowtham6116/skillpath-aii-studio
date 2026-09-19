import { CAREERS_DATA } from '../data/careers';
import {
  CareerRequirement,
  PriorityLevel,
  SkillAnalysisResult,
  SkillGapItem,
  StudentProfile,
  StudentSkill,
} from '../types';

/**
 * Deterministic Skill Gap Analysis and Career Readiness Score Engine
 */
export function analyzeSkills(
  profile: StudentProfile,
  customCareer?: CareerRequirement
): SkillAnalysisResult {
  const career =
    customCareer ||
    CAREERS_DATA.find((c) => c.id === profile.targetCareerId) ||
    CAREERS_DATA[0];

  const studentSkillsMap = new Map<string, StudentSkill>();
  profile.skills.forEach((s) => {
    studentSkillsMap.set(s.name.toLowerCase().trim(), s);
  });

  const matchedSkills: StudentSkill[] = [];
  const strongSkills: StudentSkill[] = [];
  const inProgressSkills: StudentSkill[] = [];
  const skillGaps: SkillGapItem[] = [];

  let totalWeightedPoints = 0;
  let earnedWeightedPoints = 0;
  let completedRequiredCount = 0;

  career.requiredSkills.forEach((reqSkill) => {
    const skillNameLower = reqSkill.name.toLowerCase().trim();
    const studentSkill = studentSkillsMap.get(skillNameLower);
    totalWeightedPoints += reqSkill.weight;

    const isCompleted = studentSkill && studentSkill.status === 'Completed';
    const isLearning = studentSkill && studentSkill.status === 'Learning';

    if (isCompleted) {
      completedRequiredCount += 1;
      earnedWeightedPoints += reqSkill.weight * 1.0;
      matchedSkills.push(studentSkill);

      if (studentSkill.level === 'Advanced' || studentSkill.level === 'Intermediate') {
        strongSkills.push(studentSkill);
      }
    } else if (isLearning) {
      // Partial credit for skills currently being learned (40%)
      earnedWeightedPoints += reqSkill.weight * 0.4;
      inProgressSkills.push(studentSkill);

      // Still counts as a gap that needs completion
      skillGaps.push({
        skill: reqSkill.name,
        category: reqSkill.category,
        priority: reqSkill.priorityIfMissing,
        reason: reqSkill.priorityReason,
        weight: reqSkill.weight,
        currentStatus: 'Learning',
        currentLevel: studentSkill.level,
        requiredLevel: reqSkill.minRecommendedLevel,
        recommendedOrder: 0,
      });
    } else {
      // Missing entirely
      skillGaps.push({
        skill: reqSkill.name,
        category: reqSkill.category,
        priority: reqSkill.priorityIfMissing,
        reason: reqSkill.priorityReason,
        weight: reqSkill.weight,
        currentStatus: studentSkill ? studentSkill.status : 'Not Started',
        currentLevel: studentSkill ? studentSkill.level : undefined,
        requiredLevel: reqSkill.minRecommendedLevel,
        recommendedOrder: 0,
      });
    }
  });

  // Calculate percentage: (earnedWeightedPoints / totalWeightedPoints) * 100
  const rawScore =
    totalWeightedPoints > 0
      ? (earnedWeightedPoints / totalWeightedPoints) * 100
      : 0;
  const careerReadinessScore = Math.min(100, Math.round(rawScore));

  // Sort Skill Gaps by Priority (HIGH -> MEDIUM -> LOW), then by Weight descending
  const priorityRank: Record<PriorityLevel, number> = {
    HIGH: 3,
    MEDIUM: 2,
    LOW: 1,
  };

  skillGaps.sort((a, b) => {
    const pDiff = priorityRank[b.priority] - priorityRank[a.priority];
    if (pDiff !== 0) return pDiff;
    return b.weight - a.weight;
  });

  // Assign recommended learning order numbers
  skillGaps.forEach((gap, index) => {
    gap.recommendedOrder = index + 1;
  });

  const priorityGaps = skillGaps.filter((g) => g.priority === 'HIGH');

  let statusTier: 'Needs Work' | 'On Track' | 'Job Ready' = 'Needs Work';
  if (careerReadinessScore >= 75) {
    statusTier = 'Job Ready';
  } else if (careerReadinessScore >= 50) {
    statusTier = 'On Track';
  }

  const topGapSkill = priorityGaps[0]?.skill || skillGaps[0]?.skill;
  const summary = topGapSkill
    ? `${profile.fullName} matches ${matchedSkills.length} of ${career.requiredSkills.length} core competencies for ${career.name} with a ${careerReadinessScore}% career readiness score. Focus on high-priority gap: ${topGapSkill}.`
    : `${profile.fullName} matches all core competencies for ${career.name} with a ${careerReadinessScore}% career readiness score. Ready for portfolio project deployment.`;

  return {
    targetCareer: career,
    careerReadinessScore,
    statusTier,
    summary,
    skillCoverage: {
      completed: completedRequiredCount,
      total: career.requiredSkills.length,
    },
    matchedSkills,
    skillGaps,
    strongSkills,
    inProgressSkills,
    priorityGaps,
  };
}

/**
 * Recalculates state when a specific skill is marked completed
 */
export function markSkillCompletedInProfile(
  profile: StudentProfile,
  skillName: string
): { updatedProfile: StudentProfile; nextSkillToLearn: string | null } {
  const normalized = skillName.toLowerCase().trim();
  const existingSkillIndex = profile.skills.findIndex(
    (s) => s.name.toLowerCase().trim() === normalized
  );

  let newSkills: StudentSkill[];
  if (existingSkillIndex >= 0) {
    newSkills = profile.skills.map((s, idx) =>
      idx === existingSkillIndex
        ? { ...s, status: 'Completed' as const, level: (s.level === 'Beginner' ? 'Intermediate' : s.level) }
        : s
    );
  } else {
    // Determine category from CAREERS_DATA or default to Tools
    let category: StudentSkill['category'] = 'Tools';
    for (const c of CAREERS_DATA) {
      const match = c.requiredSkills.find(
        (rs) => rs.name.toLowerCase().trim() === normalized
      );
      if (match) {
        category = match.category;
        break;
      }
    }
    newSkills = [
      ...profile.skills,
      {
        name: skillName,
        category,
        level: 'Intermediate',
        status: 'Completed',
      },
    ];
  }

  const updatedProfile: StudentProfile = {
    ...profile,
    skills: newSkills,
  };

  const analysis = analyzeSkills(updatedProfile);
  const nextSkillToLearn = analysis.skillGaps.length > 0 ? analysis.skillGaps[0].skill : null;

  return {
    updatedProfile,
    nextSkillToLearn,
  };
}
