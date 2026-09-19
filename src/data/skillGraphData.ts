import { CAREERS_DATA } from './careers';
import { MASTER_SKILLS_LIST } from './skills';

export interface GraphNodeData {
  id: string;
  name: string;
  type: 'career' | 'skill';
  category?: string;
  description?: string;
  salary?: string;
  demand?: string;
  weight?: number;
  careerId?: string;
}

export interface GraphLinkData {
  source: string;
  target: string;
  type: 'prerequisite' | 'career-pathway';
  label?: string;
}

// Prerequisite & progression relationships between skills
export const SKILL_DEPENDENCIES: Array<{ prerequisite: string; unlocks: string; reason?: string }> = [
  // Programming & CS
  { prerequisite: 'Programming', unlocks: 'Python', reason: 'Basic programming concepts' },
  { prerequisite: 'Programming', unlocks: 'JavaScript', reason: 'Syntax fundamentals' },
  { prerequisite: 'Programming', unlocks: 'Java', reason: 'Procedural foundations' },
  { prerequisite: 'Programming', unlocks: 'Data Structures', reason: 'Core computing logic' },
  { prerequisite: 'Data Structures', unlocks: 'Algorithms', reason: 'Algorithmic efficiency' },
  { prerequisite: 'Data Structures', unlocks: 'Object-Oriented Programming', reason: 'Software architecture' },
  { prerequisite: 'Object-Oriented Programming', unlocks: 'Java', reason: 'Class-based systems' },
  { prerequisite: 'Object-Oriented Programming', unlocks: 'C++', reason: 'Memory and polymorphism' },

  // Web & Full Stack
  { prerequisite: 'HTML', unlocks: 'CSS', reason: 'Layout styling' },
  { prerequisite: 'CSS', unlocks: 'JavaScript', reason: 'Interactive DOM behavior' },
  { prerequisite: 'JavaScript', unlocks: 'TypeScript', reason: 'Type system extensions' },
  { prerequisite: 'JavaScript', unlocks: 'React', reason: 'Component architecture' },
  { prerequisite: 'JavaScript', unlocks: 'Node.js', reason: 'Backend server runtimes' },
  { prerequisite: 'Node.js', unlocks: 'REST APIs', reason: 'HTTP API routing' },

  // Data & Analytics
  { prerequisite: 'Python', unlocks: 'Data Cleaning', reason: 'Pandas & NumPy wrangling' },
  { prerequisite: 'SQL', unlocks: 'Data Analysis', reason: 'Relational data querying' },
  { prerequisite: 'Data Cleaning', unlocks: 'Data Analysis', reason: 'Structured insights' },
  { prerequisite: 'Statistics', unlocks: 'Data Analysis', reason: 'Statistical hypothesis testing' },
  { prerequisite: 'Data Analysis', unlocks: 'Data Visualization', reason: 'Visual charts & plots' },
  { prerequisite: 'Data Visualization', unlocks: 'Power BI', reason: 'Executive business dashboards' },
  { prerequisite: 'Data Visualization', unlocks: 'Tableau', reason: 'Visual analytics' },
  { prerequisite: 'Excel', unlocks: 'Data Analysis', reason: 'Spreadsheet computations' },

  // AI & Machine Learning
  { prerequisite: 'Python', unlocks: 'Machine Learning', reason: 'Scikit-learn modeling' },
  { prerequisite: 'Statistics', unlocks: 'Machine Learning', reason: 'Probability & distributions' },
  { prerequisite: 'Algorithms', unlocks: 'Machine Learning', reason: 'Optimization & loss functions' },
  { prerequisite: 'Machine Learning', unlocks: 'Deep Learning', reason: 'Neural network architectures' },
  { prerequisite: 'Machine Learning', unlocks: 'Model Evaluation', reason: 'Accuracy & metrics' },
  { prerequisite: 'Deep Learning', unlocks: 'TensorFlow/PyTorch', reason: 'Tensor computation frameworks' },

  // Cloud & DevOps
  { prerequisite: 'Linux', unlocks: 'Docker', reason: 'Containerization namespaces' },
  { prerequisite: 'Docker', unlocks: 'Kubernetes', reason: 'Cluster orchestration' },
  { prerequisite: 'Docker', unlocks: 'Cloud Computing', reason: 'Cloud-native runtime' },
  { prerequisite: 'Cloud Computing', unlocks: 'AWS/Azure', reason: 'Hyperscale providers' },
  { prerequisite: 'Git', unlocks: 'GitHub', reason: 'Collaborative repos' },
  { prerequisite: 'GitHub', unlocks: 'CI/CD', reason: 'Automated deployment actions' },

  // Cybersecurity
  { prerequisite: 'Linux', unlocks: 'Networking', reason: 'Socket & network operations' },
  { prerequisite: 'Networking', unlocks: 'Cybersecurity Fundamentals', reason: 'TCP/IP attack surfaces' },
  { prerequisite: 'Cybersecurity Fundamentals', unlocks: 'Security Tools', reason: 'Packet & vulnerability tools' },
  { prerequisite: 'Security Tools', unlocks: 'Threat Detection', reason: 'Anomaly analysis' },
  { prerequisite: 'Threat Detection', unlocks: 'SIEM', reason: 'Security log correlation' },
  { prerequisite: 'SIEM', unlocks: 'Incident Response', reason: 'Containment & forensic triage' },
  { prerequisite: 'Networking', unlocks: 'Cryptography', reason: 'Ciphers & secure TLS' },
];

// Helper to generate all nodes and links for the D3 graph
export function buildGraphElements() {
  const nodes: GraphNodeData[] = [];
  const links: GraphLinkData[] = [];
  const nodeSet = new Set<string>();

  // 1. Add Career Nodes
  CAREERS_DATA.forEach((career) => {
    const careerNodeId = `career-${career.id}`;
    nodes.push({
      id: careerNodeId,
      name: career.name,
      type: 'career',
      category: career.category,
      description: career.shortDescription,
      salary: career.averageSalaryRange,
      demand: career.jobDemand,
      careerId: career.id,
    });
    nodeSet.add(careerNodeId);
  });

  // 2. Add Skill Nodes from MASTER_SKILLS_LIST
  MASTER_SKILLS_LIST.forEach((skill) => {
    const skillNodeId = skill.name.toLowerCase().trim();
    if (!nodeSet.has(skillNodeId)) {
      nodes.push({
        id: skillNodeId,
        name: skill.name,
        type: 'skill',
        category: skill.category,
        description: skill.description,
      });
      nodeSet.add(skillNodeId);
    }
  });

  // 3. Add Prerequisite Links between skills
  SKILL_DEPENDENCIES.forEach((dep) => {
    const prereqId = dep.prerequisite.toLowerCase().trim();
    const unlockId = dep.unlocks.toLowerCase().trim();

    if (nodeSet.has(prereqId) && nodeSet.has(unlockId)) {
      links.push({
        source: prereqId,
        target: unlockId,
        type: 'prerequisite',
        label: dep.reason,
      });
    }
  });

  // 4. Add Career-Pathway Links (connecting skills to careers)
  CAREERS_DATA.forEach((career) => {
    const careerNodeId = `career-${career.id}`;
    career.requiredSkills.forEach((req) => {
      const skillNodeId = req.name.toLowerCase().trim();
      if (nodeSet.has(skillNodeId)) {
        links.push({
          source: skillNodeId,
          target: careerNodeId,
          type: 'career-pathway',
          label: `${req.minRecommendedLevel} Required`,
        });
      }
    });
  });

  return { nodes, links };
}
