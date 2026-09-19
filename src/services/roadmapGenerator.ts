import {
  GeneratedRoadmap,
  RecommendedProject,
  RoadmapWeek,
  SkillAnalysisResult,
  StudentProfile,
} from '../types';

/**
 * Creates high-fidelity, deterministic personalized roadmap based on active skill gaps
 */
export function generateDeterministicRoadmap(
  profile: StudentProfile,
  analysis: SkillAnalysisResult
): GeneratedRoadmap {
  const targetCareerName = analysis.targetCareer.name;
  const missingGaps = analysis.skillGaps;

  const weeks: RoadmapWeek[] = [];
  const recommendedProjects: RecommendedProject[] = [];

  // Project recommendations from target career
  analysis.targetCareer.typicalProjects.forEach((proj, idx) => {
    recommendedProjects.push({
      id: `proj-${idx + 1}`,
      title: proj.title,
      description: proj.description,
      skills: proj.skills,
      difficulty: proj.difficulty,
      estimatedHours: proj.estimatedHours,
      addedToRoadmap: idx === 0, // First project pre-linked
      whyRecommended: `Directly bridges your priority gaps: ${proj.skills.slice(0, 2).join(' & ')}`,
    });
  });

  // If there are specific gaps, create weeks targeted at them
  if (missingGaps.length === 0) {
    // Student already mastered all required skills!
    weeks.push({
      weekNumber: 1,
      title: 'Advanced Capstone & Industry Architecture',
      focusSkill: 'Production Systems',
      objective: 'Synthesize your mastered skill set into a production-grade enterprise capstone.',
      isCompleted: false,
      milestone: 'Publish capstone with Docker containerization and CI/CD pipeline.',
      tasks: [
        { id: 't-1', title: 'Architect end-to-end multi-tier pipeline', completed: false },
        { id: 't-2', title: 'Implement automated integration test suites', completed: false },
        { id: 't-3', title: 'Write comprehensive technical case study in README', completed: false },
      ],
      resources: [
        { title: 'System Design Primer', type: 'Documentation', url: 'https://github.com/donnemartin/system-design-primer' },
        { title: 'Industry Best Practices', type: 'Cheatsheet' },
      ],
      associatedProjectTitle: recommendedProjects[0]?.title,
    });
    weeks.push({
      weekNumber: 2,
      title: 'Mock Technical Interviews & System Walkthroughs',
      focusSkill: 'Technical Communication',
      objective: 'Polish live algorithmic problem solving and architectural interview answers.',
      isCompleted: false,
      milestone: 'Complete 5 recorded behavioral and technical mock interviews.',
      tasks: [
        { id: 't-4', title: 'Practice live coding and time complexity analysis', completed: false },
        { id: 't-5', title: 'Prepare STAR method case responses for past internship challenges', completed: false },
      ],
      resources: [
        { title: 'Tech Interview Handbook', type: 'Cheatsheet' },
      ],
    });
  } else {
    // Generate sequential weeks based on priority gaps
    missingGaps.forEach((gap, index) => {
      const weekNum = index + 1;
      const tasks = getCuratedTasksForSkill(gap.skill, targetCareerName);
      const resources = getCuratedResourcesForSkill(gap.skill);
      const matchedProj = recommendedProjects.find((p) =>
        p.skills.some((s) => s.toLowerCase() === gap.skill.toLowerCase())
      );

      weeks.push({
        weekNumber: weekNum,
        title: `${gap.skill} Mastery & Applied Practice`,
        focusSkill: gap.skill,
        objective: `Master ${gap.skill} syntax, core principles, and enterprise applications for ${targetCareerName}.`,
        isCompleted: gap.currentStatus === 'Completed',
        milestone: `Complete hands-on ${gap.skill} assessment lab and practical exercises.`,
        tasks,
        resources,
        associatedProjectTitle: matchedProj?.title,
      });
    });

    // Add portfolio & interview readiness week
    const finalWeekNum = weeks.length + 1;
    weeks.push({
      weekNumber: finalWeekNum,
      title: 'Portfolio Polish, Resume Alignment & Interview Prep',
      focusSkill: 'Career Readiness',
      objective: `Package completed ${targetCareerName} projects into a verifiable GitHub / live portfolio and prepare for recruiter screens.`,
      isCompleted: false,
      milestone: 'Deploy portfolio website and conduct 3 technical mock screenings.',
      tasks: [
        { id: `t-final-1`, title: `Tailor resume bullet points with quantified metrics for ${targetCareerName}`, completed: false },
        { id: `t-final-2`, title: 'Publish project repositories with interactive live demos and architecture diagrams', completed: false },
        { id: `t-final-3`, title: 'Review common technical interview conceptual questions', completed: false },
      ],
      resources: [
        { title: `${targetCareerName} Interview Questions Guide`, type: 'Cheatsheet' },
        { title: 'STAR Technique Storytelling Framework', type: 'Documentation' },
      ],
    });
  }

  const topGap = missingGaps[0]?.skill || 'Core Technical Foundations';
  const summary = `Based on your target of becoming a ${targetCareerName} and your current profile (${profile.skills.filter((s) => s.status === 'Completed').length} verified skills), your highest leverage priority is to focus on ${topGap}. This personalized ${weeks.length}-week structured path sequences your missing requirements systematically.`;

  return {
    summary,
    weeks,
    recommendedProjects,
    generatedAt: new Date().toISOString(),
    isAI: false,
  };
}

/**
 * Curated task helper for realistic roadmap assignments
 */
function getCuratedTasksForSkill(skill: string, career: string) {
  const s = skill.toLowerCase();
  if (s.includes('statistics')) {
    return [
      { id: 'st-1', title: 'Review descriptive metrics: Mean, Median, Variance, Standard Deviation', completed: false },
      { id: 'st-2', title: 'Master probability distributions: Normal, Binomial, and Poisson', completed: false },
      { id: 'st-3', title: 'Perform hypothesis testing (t-tests, p-values, ANOVA, Chi-Square)', completed: false },
      { id: 'st-4', title: 'Complete 20 practice questions on A/B testing and confidence intervals', completed: false },
    ];
  }
  if (s.includes('power bi')) {
    return [
      { id: 'pb-1', title: 'Install Power BI Desktop and configure dataset connectors', completed: false },
      { id: 'pb-2', title: 'Build relational data models: Star Schemas and cardinality relationships', completed: false },
      { id: 'pb-3', title: 'Write core DAX expressions: CALCULATE, RELATED, SUMX, and Time Intelligence', completed: false },
      { id: 'pb-4', title: 'Publish interactive multi-page dashboard with slicers and drill-throughs', completed: false },
    ];
  }
  if (s.includes('visualization')) {
    return [
      { id: 'dv-1', title: 'Study chart taxonomy: when to use bar, line, scatter, heatmaps, or treemaps', completed: false },
      { id: 'dv-2', title: 'Eliminate chart junk and apply pre-attentive visual attributes', completed: false },
      { id: 'dv-3', title: 'Build clean, high-contrast exploratory plots in Python (Seaborn & Matplotlib)', completed: false },
    ];
  }
  if (s.includes('machine learning')) {
    return [
      { id: 'ml-1', title: 'Feature engineering: Imputation, scaling, one-hot encoding, and PCA', completed: false },
      { id: 'ml-2', title: 'Train supervised models: Logistic Regression, Random Forest, XGBoost', completed: false },
      { id: 'ml-3', title: 'Perform hyperparameter tuning with GridSearch and Cross-Validation', completed: false },
      { id: 'ml-4', title: 'Benchmark model ROC-AUC curves and generate confusion matrix report', completed: false },
    ];
  }
  if (s.includes('deep learning') || s.includes('pytorch') || s.includes('tensorflow')) {
    return [
      { id: 'dl-1', title: 'Understand forward pass, backpropagation, and loss functions', completed: false },
      { id: 'dl-2', title: 'Construct PyTorch neural network modules and DataLoader batches', completed: false },
      { id: 'dl-3', title: 'Train a multi-class classification model with early stopping', completed: false },
    ];
  }
  if (s.includes('docker') || s.includes('kubernetes')) {
    return [
      { id: 'dk-1', title: 'Write production multi-stage Dockerfiles for minimal image size', completed: false },
      { id: 'dk-2', title: 'Configure docker-compose with multi-container database services', completed: false },
      { id: 'dk-3', title: 'Deploy local Kubernetes manifests with Deployments and Services', completed: false },
    ];
  }
  if (s.includes('cloud') || s.includes('aws') || s.includes('azure')) {
    return [
      { id: 'cl-1', title: 'Configure IAM roles, policies, and least-privilege service credentials', completed: false },
      { id: 'cl-2', title: 'Deploy containerized web service to cloud container compute', completed: false },
      { id: 'cl-3', title: 'Set up managed cloud relational database and object storage buckets', completed: false },
    ];
  }
  if (s.includes('cybersecurity') || s.includes('security') || s.includes('siem')) {
    return [
      { id: 'sec-1', title: 'Examine packet captures with Wireshark to isolate anomalous TCP traffic', completed: false },
      { id: 'sec-2', title: 'Configure SIEM event log ingestion rules for authentication failures', completed: false },
      { id: 'sec-3', title: 'Perform vulnerability scanning with Nmap and document risk matrix', completed: false },
    ];
  }
  if (s.includes('data structures') || s.includes('algorithms')) {
    return [
      { id: 'dsa-1', title: 'Implement arrays, linked lists, hash tables, and binary search trees', completed: false },
      { id: 'dsa-2', title: 'Solve 15 two-pointer and sliding window algorithmic challenges', completed: false },
      { id: 'dsa-3', title: 'Analyze Big-O time and space complexity for all implementations', completed: false },
    ];
  }
  // Generic fallback
  return [
    { id: `gen-1`, title: `Study ${skill} core documentation and foundational syntax`, completed: false },
    { id: `gen-2`, title: `Build guided practice labs tailored to ${career} use-cases`, completed: false },
    { id: `gen-3`, title: `Complete mini-project demonstrating practical fluency in ${skill}`, completed: false },
  ];
}

function getCuratedResourcesForSkill(skill: string) {
  const s = skill.toLowerCase();
  if (s.includes('statistics')) {
    return [
      { title: 'StatQuest: Fundamentals of Statistics', type: 'Video' as const, url: 'https://statquest.org' },
      { title: 'OpenIntro Statistics Textbook', type: 'Documentation' as const, url: 'https://www.openintro.org' },
      { title: 'Hypothesis Testing Quick Reference', type: 'Cheatsheet' as const },
    ];
  }
  if (s.includes('power bi')) {
    return [
      { title: 'Microsoft Power BI Guided Learning', type: 'Documentation' as const, url: 'https://learn.microsoft.com' },
      { title: 'SQLBI: DAX Guide & Patterns', type: 'Cheatsheet' as const, url: 'https://dax.guide' },
      { title: 'Dashboard Design Best Practices', type: 'Practice' as const },
    ];
  }
  if (s.includes('visualization')) {
    return [
      { title: 'Storytelling with Data', type: 'Documentation' as const },
      { title: 'Python Seaborn Gallery & API', type: 'Documentation' as const },
    ];
  }
  return [
    { title: `${skill} Official Documentation & Tutorials`, type: 'Documentation' as const },
    { title: `${skill} Hands-On Interactive Labs`, type: 'Practice' as const },
    { title: `${skill} Essential Syntax Cheatsheet`, type: 'Cheatsheet' as const },
  ];
}
