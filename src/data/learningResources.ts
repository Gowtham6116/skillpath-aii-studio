export interface LearningResource {
  id: string;
  type: 'youtube' | 'practice';
  title: string;
  url: string;
  channel?: string;
  duration?: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  isSearchFallback?: boolean;
}

export interface SkillLearningPackage {
  skill: string;
  category: string;
  quickDescription: string;
  resources: LearningResource[];
  practiceTask: {
    title: string;
    description: string;
    actionLabel: string;
  };
}

export const SKILL_LEARNING_RESOURCES: Record<string, SkillLearningPackage> = {
  'Power BI': {
    skill: 'Power BI',
    category: 'Data',
    quickDescription: 'Business intelligence and interactive dashboard design for reporting and data analytics.',
    resources: [
      {
        id: 'pbi-1',
        type: 'youtube',
        title: 'Power BI Full Course for Beginners',
        channel: 'freeCodeCamp.org',
        duration: '3 hrs 45 mins',
        level: 'Beginner',
        url: 'https://www.youtube.com/results?search_query=freecodecamp+power+bi+full+course+for+beginners',
      },
      {
        id: 'pbi-2',
        type: 'youtube',
        title: 'Power BI Dashboard Tutorial — End to End',
        channel: 'Kevin Stratvert',
        duration: '32 mins',
        level: 'Intermediate',
        url: 'https://www.youtube.com/results?search_query=kevin+stratvert+power+bi+dashboard+tutorial',
      },
      {
        id: 'pbi-3',
        type: 'youtube',
        title: 'Power BI Data Modeling and DAX Essentials',
        channel: 'Avi Singh - PowerBIPro',
        duration: '45 mins',
        level: 'Intermediate',
        url: 'https://www.youtube.com/results?search_query=power+bi+data+modeling+dax+tutorial',
      },
    ],
    practiceTask: {
      title: 'Build Sales & Revenue KPI Dashboard',
      description: 'Import retail CSV data, configure calendar relationships, create DAX measures, and publish an interactive report.',
      actionLabel: 'Start Practice Project',
    },
  },

  'SQL': {
    skill: 'SQL',
    category: 'Data',
    quickDescription: 'Relational database querying, joins, aggregations, window functions, and indexing.',
    resources: [
      {
        id: 'sql-1',
        type: 'youtube',
        title: 'SQL Tutorial — Full Database Course for Beginners',
        channel: 'freeCodeCamp.org',
        duration: '4 hrs 20 mins',
        level: 'Beginner',
        url: 'https://www.youtube.com/results?search_query=freecodecamp+sql+tutorial+full+course+beginners',
      },
      {
        id: 'sql-2',
        type: 'youtube',
        title: 'SQL Joins & Group By Mastery',
        channel: 'Alex The Analyst',
        duration: '28 mins',
        level: 'Intermediate',
        url: 'https://www.youtube.com/results?search_query=alex+the+analyst+sql+joins+group+by',
      },
      {
        id: 'sql-3',
        type: 'youtube',
        title: 'SQL Window Functions Explained',
        channel: 'Luke Barousse',
        duration: '22 mins',
        level: 'Advanced',
        url: 'https://www.youtube.com/results?search_query=luke+barousse+sql+window+functions',
      },
    ],
    practiceTask: {
      title: 'E-Commerce Cohort Retention Analysis',
      description: 'Write complex multi-table queries with CTEs and window functions to compute customer lifetime value.',
      actionLabel: 'Open SQL Sandbox',
    },
  },

  'Python': {
    skill: 'Python',
    category: 'Programming',
    quickDescription: 'Core scripting, object-oriented programming, data structures, and automation.',
    resources: [
      {
        id: 'py-1',
        type: 'youtube',
        title: 'Python for Beginners — Full Course [Programming Tutorial]',
        channel: 'Programming with Mosh',
        duration: '6 hrs 14 mins',
        level: 'Beginner',
        url: 'https://www.youtube.com/results?search_query=programming+with+mosh+python+for+beginners',
      },
      {
        id: 'py-2',
        type: 'youtube',
        title: 'Python Pandas & NumPy Crash Course for Data Science',
        channel: 'Keith Galli',
        duration: '1 hr 15 mins',
        level: 'Intermediate',
        url: 'https://www.youtube.com/results?search_query=keith+galli+pandas+numpy+crash+course',
      },
      {
        id: 'py-3',
        type: 'youtube',
        title: 'Intermediate Python Programming Course',
        channel: 'freeCodeCamp.org',
        duration: '5 hrs 55 mins',
        level: 'Intermediate',
        url: 'https://www.youtube.com/results?search_query=freecodecamp+intermediate+python+programming+course',
      },
    ],
    practiceTask: {
      title: 'Automated Data Extraction & Cleaning Pipeline',
      description: 'Write a Python script that ingests raw JSON/CSV feeds, applies data validation, and outputs structured parquet.',
      actionLabel: 'Start Python Script',
    },
  },

  'Excel': {
    skill: 'Excel',
    category: 'Data',
    quickDescription: 'Spreadsheet modeling, VLOOKUP/XLOOKUP, PivotTables, conditional formulas, and data hygiene.',
    resources: [
      {
        id: 'xls-1',
        type: 'youtube',
        title: 'Excel for Beginners — Complete Step-by-Step Tutorial',
        channel: 'Kevin Stratvert',
        duration: '38 mins',
        level: 'Beginner',
        url: 'https://www.youtube.com/results?search_query=kevin+stratvert+excel+for+beginners+tutorial',
      },
      {
        id: 'xls-2',
        type: 'youtube',
        title: 'Advanced Pivot Tables and XLOOKUP Masterclass',
        channel: 'Leila Gharani',
        duration: '24 mins',
        level: 'Intermediate',
        url: 'https://www.youtube.com/results?search_query=leila+gharani+excel+pivot+table+xlookup',
      },
    ],
    practiceTask: {
      title: 'Executive Financial Summary Model',
      description: 'Build an automated monthly variance tracker using PivotTables and slicers.',
      actionLabel: 'Download Practice Template',
    },
  },

  'Statistics': {
    skill: 'Statistics',
    category: 'Data',
    quickDescription: 'Descriptive and inferential statistics, probability distributions, hypothesis testing, and confidence intervals.',
    resources: [
      {
        id: 'stat-1',
        type: 'youtube',
        title: 'Statistics — A Full University Course on Data Science Basics',
        channel: 'freeCodeCamp.org',
        duration: '8 hrs 15 mins',
        level: 'Beginner',
        url: 'https://www.youtube.com/results?search_query=freecodecamp+statistics+full+university+course',
      },
      {
        id: 'stat-2',
        type: 'youtube',
        title: 'StatQuest: Hypothesis Testing and P-Values Made Simple',
        channel: 'StatQuest with Josh Starmer',
        duration: '16 mins',
        level: 'Intermediate',
        url: 'https://www.youtube.com/results?search_query=statquest+hypothesis+testing+p+values',
      },
      {
        id: 'stat-3',
        type: 'youtube',
        title: 'A/B Testing Fundamentals for Analysts',
        channel: 'Luke Barousse',
        duration: '19 mins',
        level: 'Intermediate',
        url: 'https://www.youtube.com/results?search_query=luke+barousse+ab+testing+fundamentals',
      },
    ],
    practiceTask: {
      title: 'Product Conversion A/B Test Case Study',
      description: 'Run two-sample t-tests and chi-squared tests on a simulated marketing dataset to confirm statistical significance.',
      actionLabel: 'Launch Stats Case Study',
    },
  },

  'Data Visualization': {
    skill: 'Data Visualization',
    category: 'Data',
    quickDescription: 'Visual communication, perceptual principles, Matplotlib, Seaborn, Tableau, and interactive storytelling.',
    resources: [
      {
        id: 'vis-1',
        type: 'youtube',
        title: 'Data Visualization Principles for Clear Communication',
        channel: 'Tableau',
        duration: '28 mins',
        level: 'Beginner',
        url: 'https://www.youtube.com/results?search_query=data+visualization+principles+tableau+best+practices',
      },
      {
        id: 'vis-2',
        type: 'youtube',
        title: 'Python Seaborn & Matplotlib Visualization Masterclass',
        channel: 'Derek Banas',
        duration: '42 mins',
        level: 'Intermediate',
        url: 'https://www.youtube.com/results?search_query=seaborn+matplotlib+data+visualization+tutorial',
      },
    ],
    practiceTask: {
      title: 'Public Health Trend Visualization',
      description: 'Craft multi-faceted choropleths and time-series heatmaps adhering to color accessibility standards.',
      actionLabel: 'Create Chart Gallery',
    },
  },

  'Machine Learning': {
    skill: 'Machine Learning',
    category: 'AI/ML',
    quickDescription: 'Supervised and unsupervised modeling, regression, classification, clustering, Scikit-Learn, and model validation.',
    resources: [
      {
        id: 'ml-1',
        type: 'youtube',
        title: 'Machine Learning Course for Beginners',
        channel: 'freeCodeCamp.org',
        duration: '9 hrs 52 mins',
        level: 'Beginner',
        url: 'https://www.youtube.com/results?search_query=freecodecamp+machine+learning+course+beginners',
      },
      {
        id: 'ml-2',
        type: 'youtube',
        title: 'Scikit-Learn Crash Course — Hands-On Modeling',
        channel: 'Daniel Bourke',
        duration: '1 hr 12 mins',
        level: 'Intermediate',
        url: 'https://www.youtube.com/results?search_query=daniel+bourke+scikit+learn+crash+course',
      },
    ],
    practiceTask: {
      title: 'Customer Churn Predictor',
      description: 'Train Random Forest and XGBoost classifiers, evaluate ROC-AUC, and explain feature importances using SHAP.',
      actionLabel: 'Start Kaggle Notebook',
    },
  },

  'Deep Learning': {
    skill: 'Deep Learning',
    category: 'AI/ML',
    quickDescription: 'Neural networks, backpropagation, PyTorch/TensorFlow, CNNs, Transformers, and optimization.',
    resources: [
      {
        id: 'dl-1',
        type: 'youtube',
        title: 'PyTorch for Deep Learning Bootcamp — Full Course',
        channel: 'freeCodeCamp.org',
        duration: '25 hrs',
        level: 'Intermediate',
        url: 'https://www.youtube.com/results?search_query=freecodecamp+pytorch+for+deep+learning+bootcamp',
      },
      {
        id: 'dl-2',
        type: 'youtube',
        title: 'Neural Networks from Scratch',
        channel: '3Blue1Brown',
        duration: '19 mins',
        level: 'Beginner',
        url: 'https://www.youtube.com/results?search_query=3blue1brown+but+what+is+a+neural+network',
      },
    ],
    practiceTask: {
      title: 'Image Classification with Transfer Learning',
      description: 'Fine-tune a pretrained ResNet on custom image batches with validation loss tracking.',
      actionLabel: 'Launch GPU Session',
    },
  },

  'Data Structures': {
    skill: 'Data Structures',
    category: 'Programming',
    quickDescription: 'Arrays, linked lists, stacks, queues, trees, graphs, heaps, and hash maps with complexity analysis.',
    resources: [
      {
        id: 'ds-1',
        type: 'youtube',
        title: 'Data Structures and Algorithms in Python / Java — Full Course',
        channel: 'freeCodeCamp.org',
        duration: '5 hrs 20 mins',
        level: 'Beginner',
        url: 'https://www.youtube.com/results?search_query=freecodecamp+data+structures+and+algorithms+full+course',
      },
      {
        id: 'ds-2',
        type: 'youtube',
        title: 'Trees and Graphs Deep Dive',
        channel: 'NeetCode',
        duration: '45 mins',
        level: 'Intermediate',
        url: 'https://www.youtube.com/results?search_query=neetcode+trees+and+graphs+data+structures',
      },
    ],
    practiceTask: {
      title: 'Custom Memory-Bounded Cache System',
      description: 'Implement an LRU (Least Recently Used) cache using a doubly linked list and hash map with O(1) operations.',
      actionLabel: 'Solve LeetCode Pattern',
    },
  },

  'Algorithms': {
    skill: 'Algorithms',
    category: 'Programming',
    quickDescription: 'Sorting, searching, binary search, two pointers, recursion, dynamic programming, and greedy algorithms.',
    resources: [
      {
        id: 'algo-1',
        type: 'youtube',
        title: 'Dynamic Programming — Learn to Solve Algorithmic Problems',
        channel: 'freeCodeCamp.org',
        duration: '5 hrs 10 mins',
        level: 'Intermediate',
        url: 'https://www.youtube.com/results?search_query=freecodecamp+dynamic+programming+algorithmic+problems',
      },
      {
        id: 'algo-2',
        type: 'youtube',
        title: 'Graph Traversal (BFS & DFS) Visual Guide',
        channel: 'WilliamFiset',
        duration: '31 mins',
        level: 'Intermediate',
        url: 'https://www.youtube.com/results?search_query=williamfiset+graph+traversal+bfs+dfs',
      },
    ],
    practiceTask: {
      title: 'Shortest Route Optimization Engine',
      description: 'Implement Dijkstra and A* pathfinding on a weighted university campus graph.',
      actionLabel: 'Build Graph Engine',
    },
  },

  'Git': {
    skill: 'Git',
    category: 'Tools',
    quickDescription: 'Distributed version control, branching workflows, merging, rebasing, and merge conflict resolution.',
    resources: [
      {
        id: 'git-1',
        type: 'youtube',
        title: 'Git and GitHub for Beginners — Crash Course',
        channel: 'freeCodeCamp.org',
        duration: '1 hr 10 mins',
        level: 'Beginner',
        url: 'https://www.youtube.com/results?search_query=freecodecamp+git+and+github+for+beginners+crash+course',
      },
      {
        id: 'git-2',
        type: 'youtube',
        title: 'Git Branching & Pull Request Workflows',
        channel: 'Traversy Media',
        duration: '25 mins',
        level: 'Intermediate',
        url: 'https://www.youtube.com/results?search_query=traversy+media+git+branching+pull+requests',
      },
    ],
    practiceTask: {
      title: 'Feature Branch Workflow Exercise',
      description: 'Create a local repository, simulate simultaneous contributor merges, and resolve three-way merge conflicts.',
      actionLabel: 'Clone Practice Repo',
    },
  },

  'GitHub': {
    skill: 'GitHub',
    category: 'Tools',
    quickDescription: 'Remote repository hosting, issue tracking, GitHub Actions CI/CD, and portfolio presentation.',
    resources: [
      {
        id: 'gh-1',
        type: 'youtube',
        title: 'GitHub Actions Tutorial — Complete CI/CD Pipeline',
        channel: 'TechWorld with Nana',
        duration: '42 mins',
        level: 'Intermediate',
        url: 'https://www.youtube.com/results?search_query=techworld+with+nana+github+actions+tutorial',
      },
    ],
    practiceTask: {
      title: 'Automated Test & Build CI/CD Workflow',
      description: 'Configure a `.github/workflows/main.yml` file to run automated linter and test suites on pull requests.',
      actionLabel: 'Set Up CI/CD Workflow',
    },
  },

  'AWS': {
    skill: 'AWS',
    category: 'Cloud',
    quickDescription: 'Amazon Web Services core services: EC2, S3, RDS, IAM, Lambda, and VPC architecture.',
    resources: [
      {
        id: 'aws-1',
        type: 'youtube',
        title: 'AWS Certified Cloud Practitioner Training 2026 — Full Course',
        channel: 'freeCodeCamp.org',
        duration: '13 hrs',
        level: 'Beginner',
        url: 'https://www.youtube.com/results?search_query=freecodecamp+aws+certified+cloud+practitioner+full+course',
      },
      {
        id: 'aws-2',
        type: 'youtube',
        title: 'AWS S3 & EC2 Complete Hands-On Tutorial',
        channel: 'Be A White Hat Hackers',
        duration: '35 mins',
        level: 'Intermediate',
        url: 'https://www.youtube.com/results?search_query=aws+s3+ec2+complete+hands+on+tutorial',
      },
    ],
    practiceTask: {
      title: 'Deploy Static Web App with S3 & CloudFront',
      description: 'Provision an S3 bucket with least-privilege IAM policies, CDN caching, and custom domain routing.',
      actionLabel: 'Open AWS Console Guide',
    },
  },

  'Azure': {
    skill: 'Azure',
    category: 'Cloud',
    quickDescription: 'Microsoft cloud services, Azure App Services, Blob Storage, Virtual Machines, and Entra ID.',
    resources: [
      {
        id: 'az-1',
        type: 'youtube',
        title: 'Microsoft Azure Fundamentals Certification Course (AZ-900)',
        channel: 'freeCodeCamp.org',
        duration: '8 hrs 30 mins',
        level: 'Beginner',
        url: 'https://www.youtube.com/results?search_query=freecodecamp+az+900+azure+fundamentals+course',
      },
    ],
    practiceTask: {
      title: 'Containerized Web App on Azure App Service',
      description: 'Deploy a container image to Azure App Service with SSL certificates and autoscaling thresholds.',
      actionLabel: 'Launch Azure Sandbox',
    },
  },

  'Docker': {
    skill: 'Docker',
    category: 'Cloud',
    quickDescription: 'Containerization, Dockerfile creation, image optimization, volumes, and multi-container Docker Compose.',
    resources: [
      {
        id: 'doc-1',
        type: 'youtube',
        title: 'Docker Tutorial for Beginners — Full Course in 3 Hours',
        channel: 'TechWorld with Nana',
        duration: '2 hrs 48 mins',
        level: 'Beginner',
        url: 'https://www.youtube.com/results?search_query=techworld+with+nana+docker+tutorial+for+beginners',
      },
      {
        id: 'doc-2',
        type: 'youtube',
        title: 'Docker Compose Explained with Examples',
        channel: 'NetworkChuck',
        duration: '22 mins',
        level: 'Intermediate',
        url: 'https://www.youtube.com/results?search_query=networkchuck+docker+compose+tutorial',
      },
    ],
    practiceTask: {
      title: 'Multi-Tier Web & Database Container Stack',
      description: 'Write a multi-stage Dockerfile and a `docker-compose.yml` linking a React frontend, Node backend, and Postgres db.',
      actionLabel: 'Compose Containers',
    },
  },

  'Kubernetes': {
    skill: 'Kubernetes',
    category: 'Cloud',
    quickDescription: 'Container orchestration, Pods, Deployments, Services, ConfigMaps, Ingress, and cluster scaling.',
    resources: [
      {
        id: 'k8s-1',
        type: 'youtube',
        title: 'Kubernetes Tutorial for Beginners — Complete Course',
        channel: 'TechWorld with Nana',
        duration: '4 hrs',
        level: 'Beginner',
        url: 'https://www.youtube.com/results?search_query=techworld+with+nana+kubernetes+tutorial+beginners',
      },
    ],
    practiceTask: {
      title: 'Zero-Downtime Rolling Update Deployment',
      description: 'Deploy a replicated application on local Minikube with readiness probes and an ingress reverse proxy.',
      actionLabel: 'Apply K8s Manifests',
    },
  },

  'Networking': {
    skill: 'Networking',
    category: 'Tools',
    quickDescription: 'TCP/IP model, DNS resolution, HTTP/HTTPS protocols, subnets, routing tables, and firewalls.',
    resources: [
      {
        id: 'net-1',
        type: 'youtube',
        title: 'Computer Networking Course — Network Fundamentals',
        channel: 'freeCodeCamp.org',
        duration: '9 hrs 30 mins',
        level: 'Beginner',
        url: 'https://www.youtube.com/results?search_query=freecodecamp+computer+networking+course+network+fundamentals',
      },
      {
        id: 'net-2',
        type: 'youtube',
        title: 'How the Internet Works & TCP/IP Explained',
        channel: 'PowerCert Animated Videos',
        duration: '18 mins',
        level: 'Beginner',
        url: 'https://www.youtube.com/results?search_query=powercert+tcp+ip+network+model+explained',
      },
    ],
    practiceTask: {
      title: 'Packet Analysis with Wireshark',
      description: 'Capture and inspect TCP handshakes, TLS handshakes, and DNS requests to identify network latency bottlenecks.',
      actionLabel: 'Inspect Packet Capture',
    },
  },

  'Cybersecurity': {
    skill: 'Cybersecurity',
    category: 'Tools',
    quickDescription: 'Threat modeling, OWASP Top 10 web vulnerabilities, authentication security, cryptography, and penetration testing.',
    resources: [
      {
        id: 'sec-1',
        type: 'youtube',
        title: 'Cybersecurity for Beginners — Full Course',
        channel: 'freeCodeCamp.org',
        duration: '7 hrs 45 mins',
        level: 'Beginner',
        url: 'https://www.youtube.com/results?search_query=freecodecamp+cybersecurity+for+beginners+full+course',
      },
      {
        id: 'sec-2',
        type: 'youtube',
        title: 'OWASP Top 10 Web Vulnerabilities Explained',
        channel: 'Fireship',
        duration: '12 mins',
        level: 'Intermediate',
        url: 'https://www.youtube.com/results?search_query=fireship+owasp+top+10+vulnerabilities',
      },
    ],
    practiceTask: {
      title: 'Secure Authentication & SQL Injection Audit',
      description: 'Harden an Express app against SQL injection, implement parameterized queries, and configure Argon2 password hashing.',
      actionLabel: 'Audit Security Labs',
    },
  },

  'Communication': {
    skill: 'Communication',
    category: 'Soft Skills',
    quickDescription: 'Technical presentation, cross-functional collaboration, writing design docs, and executive storytelling.',
    resources: [
      {
        id: 'comm-1',
        type: 'youtube',
        title: 'How to Speak so That People Want to Listen',
        channel: 'TED / Julian Treasure',
        duration: '10 mins',
        level: 'Beginner',
        url: 'https://www.youtube.com/results?search_query=julian+treasure+how+to+speak+so+that+people+want+to+listen',
      },
      {
        id: 'comm-2',
        type: 'youtube',
        title: 'Technical Presentation Skills for Engineers & Analysts',
        channel: 'MIT OpenCourseWare',
        duration: '48 mins',
        level: 'Intermediate',
        url: 'https://www.youtube.com/results?search_query=mit+opencourseware+technical+presentation+skills',
      },
    ],
    practiceTask: {
      title: '5-Minute Data Story Presentation',
      description: 'Prepare and deliver a 5-slide deck presenting data insights and strategic recommendations to stakeholders.',
      actionLabel: 'Prepare Presentation',
    },
  },
};

/**
 * Returns structured learning package for any skill.
 * If skill is not directly matched in the dictionary, generates a safe, verified YouTube
 * search query so that random/fake video IDs are never invented.
 */
export function getSkillLearningResources(skillName: string): SkillLearningPackage {
  const normalized = skillName.trim();

  // Check exact or case-insensitive match
  const foundKey = Object.keys(SKILL_LEARNING_RESOURCES).find(
    (k) => k.toLowerCase() === normalized.toLowerCase()
  );

  if (foundKey) {
    return SKILL_LEARNING_RESOURCES[foundKey];
  }

  // Safe YouTube search fallback (Rule #15: do NOT invent fake IDs)
  const searchQuery = encodeURIComponent(`${normalized} beginner tutorial`);
  const projectQuery = encodeURIComponent(`${normalized} project tutorial`);

  return {
    skill: normalized,
    category: 'Competency',
    quickDescription: `Core concepts and practical industry implementation of ${normalized}.`,
    resources: [
      {
        id: `search-${normalized}-1`,
        type: 'youtube',
        title: `${normalized} — Beginner Tutorial & Fundamentals`,
        channel: 'Search YouTube',
        duration: 'Video Guides',
        level: 'Beginner',
        url: `https://www.youtube.com/results?search_query=${searchQuery}`,
        isSearchFallback: true,
      },
      {
        id: `search-${normalized}-2`,
        type: 'youtube',
        title: `${normalized} — Hands-On Practice & Implementation`,
        channel: 'Search YouTube',
        duration: 'Video Guides',
        level: 'Intermediate',
        url: `https://www.youtube.com/results?search_query=${projectQuery}`,
        isSearchFallback: true,
      },
    ],
    practiceTask: {
      title: `Hands-on ${normalized} Practice Project`,
      description: `Build a functional prototype demonstrating proficiency in ${normalized} to add to your career portfolio.`,
      actionLabel: 'Launch Learning Workspace',
    },
  };
}
