export interface SkillDefinition {
  name: string;
  category: 'Programming' | 'Data' | 'AI/ML' | 'Cloud' | 'Tools' | 'Soft Skills';
  description: string;
  commonIn: string[];
}

export const MASTER_SKILLS_LIST: SkillDefinition[] = [
  // Programming
  { name: 'Python', category: 'Programming', description: 'High-level interpreted language for general computing, data science, and AI', commonIn: ['Data Analyst', 'AI/ML Engineer', 'Cybersecurity Analyst', 'Software Developer'] },
  { name: 'Java', category: 'Programming', description: 'Object-oriented enterprise language with JVM ecosystem', commonIn: ['Software Developer'] },
  { name: 'C', category: 'Programming', description: 'Low-level procedural language for systems and memory foundations', commonIn: ['Software Developer'] },
  { name: 'C++', category: 'Programming', description: 'High-performance object-oriented systems and game engine language', commonIn: ['Software Developer', 'AI/ML Engineer'] },
  { name: 'JavaScript', category: 'Programming', description: 'Dynamic client & server language powering modern web applications', commonIn: ['Software Developer'] },
  { name: 'TypeScript', category: 'Programming', description: 'Typed superset of JavaScript bringing compile-time safety to web apps', commonIn: ['Software Developer'] },
  { name: 'HTML', category: 'Programming', description: 'Standard markup language for structuring web pages', commonIn: ['Software Developer', 'Data Analyst'] },
  { name: 'CSS', category: 'Programming', description: 'Style sheet language for responsive presentation and layout', commonIn: ['Software Developer'] },
  { name: 'React', category: 'Programming', description: 'Declarative component-based UI library for single-page applications', commonIn: ['Software Developer'] },
  { name: 'Node.js', category: 'Programming', description: 'JavaScript runtime built on Chrome V8 engine for backend services', commonIn: ['Software Developer'] },
  { name: 'Programming', category: 'Programming', description: 'Core programming fundamentals and modular code craftsmanship', commonIn: ['Software Developer'] },
  { name: 'Data Structures', category: 'Programming', description: 'Efficient organization of data: lists, trees, hash maps, queues, graphs', commonIn: ['Software Developer', 'AI/ML Engineer'] },
  { name: 'Algorithms', category: 'Programming', description: 'Systematic computational procedures: sorting, searching, recursion, DP', commonIn: ['Software Developer', 'AI/ML Engineer'] },
  { name: 'Object-Oriented Programming', category: 'Programming', description: 'Encapsulation, inheritance, polymorphism, and abstraction design', commonIn: ['Software Developer'] },
  { name: 'REST APIs', category: 'Programming', description: 'Stateless HTTP client-server communication standards and JSON contracts', commonIn: ['Software Developer'] },

  // Data
  { name: 'SQL', category: 'Data', description: 'Declarative language for relational database querying and schema manipulation', commonIn: ['Data Analyst', 'AI/ML Engineer', 'Software Developer'] },
  { name: 'Statistics', category: 'Data', description: 'Probability, hypothesis testing, distributions, variance, and regression', commonIn: ['Data Analyst', 'AI/ML Engineer'] },
  { name: 'Data Analysis', category: 'Data', description: 'Inspecting, cleansing, transforming, and modeling data for decision-making', commonIn: ['Data Analyst'] },
  { name: 'Data Cleaning', category: 'Data', description: 'Handling nulls, duplicates, outliers, type conversions, and standardization', commonIn: ['Data Analyst'] },
  { name: 'Data Visualization', category: 'Data', description: 'Communicating quantitative relationships with charts and plots', commonIn: ['Data Analyst'] },
  { name: 'Database', category: 'Data', description: 'Relational & NoSQL database concepts, indexing, ACID transactions', commonIn: ['Software Developer'] },

  // AI / ML
  { name: 'Machine Learning', category: 'AI/ML', description: 'Supervised and unsupervised statistical learning algorithms', commonIn: ['AI/ML Engineer'] },
  { name: 'Deep Learning', category: 'AI/ML', description: 'Multi-layer artificial neural networks, backpropagation, and activations', commonIn: ['AI/ML Engineer'] },
  { name: 'TensorFlow/PyTorch', category: 'AI/ML', description: 'High-performance tensor computation and neural model frameworks', commonIn: ['AI/ML Engineer'] },
  { name: 'TensorFlow', category: 'AI/ML', description: 'Google open-source end-to-end platform for machine learning', commonIn: ['AI/ML Engineer'] },
  { name: 'PyTorch', category: 'AI/ML', description: 'Dynamic eager-mode deep learning framework favored in AI research', commonIn: ['AI/ML Engineer'] },
  { name: 'Model Evaluation', category: 'AI/ML', description: 'Precision, recall, F1, ROC-AUC curves, validation splits, drift tracking', commonIn: ['AI/ML Engineer'] },

  // Cloud
  { name: 'Cloud Computing', category: 'Cloud', description: 'On-demand compute, managed storage, networking, and serverless infrastructure', commonIn: ['Cloud Engineer'] },
  { name: 'AWS/Azure', category: 'Cloud', description: 'Major public cloud provider platforms and managed services', commonIn: ['Cloud Engineer'] },
  { name: 'AWS', category: 'Cloud', description: 'Amazon Web Services cloud infrastructure and managed APIs', commonIn: ['Cloud Engineer'] },
  { name: 'Azure', category: 'Cloud', description: 'Microsoft Azure cloud enterprise ecosystem and Active Directory integrations', commonIn: ['Cloud Engineer'] },
  { name: 'Docker', category: 'Cloud', description: 'Lightweight container virtualization for reproducible application runtimes', commonIn: ['Cloud Engineer', 'Software Developer'] },
  { name: 'Kubernetes', category: 'Cloud', description: 'Automated container cluster deployment, scaling, and operational management', commonIn: ['Cloud Engineer'] },

  // Tools & Security
  { name: 'Linux', category: 'Tools', description: 'Open-source Unix operating system, shell scripting, and server admin', commonIn: ['Cloud Engineer', 'Cybersecurity Analyst'] },
  { name: 'Networking', category: 'Tools', description: 'TCP/IP stack, DNS, subnets, routing, packet inspection, and firewalls', commonIn: ['Cloud Engineer', 'Cybersecurity Analyst'] },
  { name: 'Git', category: 'Tools', description: 'Distributed version control system tracking source code modifications', commonIn: ['Software Developer', 'Cloud Engineer'] },
  { name: 'GitHub', category: 'Tools', description: 'Cloud repository hosting, issue tracking, and collaborative code reviews', commonIn: ['Software Developer'] },
  { name: 'Excel', category: 'Tools', description: 'Spreadsheet software for numerical calculation, pivot tables, and VLOOKUPs', commonIn: ['Data Analyst'] },
  { name: 'Power BI', category: 'Tools', description: 'Microsoft business analytics service for interactive dashboards and DAX', commonIn: ['Data Analyst'] },
  { name: 'Tableau', category: 'Tools', description: 'Visual analytics platform for exploratory interactive business charts', commonIn: ['Data Analyst'] },
  { name: 'CI/CD', category: 'Tools', description: 'Continuous integration and continuous deployment automation pipelines', commonIn: ['Cloud Engineer'] },
  { name: 'Testing', category: 'Tools', description: 'Automated unit, integration, and end-to-end software quality assurance', commonIn: ['Software Developer'] },
  { name: 'Security Basics', category: 'Tools', description: 'Principle of least privilege, authentication, secrets management', commonIn: ['Cloud Engineer'] },
  { name: 'Cybersecurity Fundamentals', category: 'Tools', description: 'CIA triad, threat vectors, risk governance, and defensive tactics', commonIn: ['Cybersecurity Analyst'] },
  { name: 'Security Tools', category: 'Tools', description: 'Wireshark, Nmap, Burp Suite, vulnerability scanners', commonIn: ['Cybersecurity Analyst'] },
  { name: 'Threat Detection', category: 'Tools', description: 'Detecting anomalous behaviors, IOCs, and malicious traffic patterns', commonIn: ['Cybersecurity Analyst'] },
  { name: 'SIEM', category: 'Tools', description: 'Security Information & Event Management log ingestion and alerts', commonIn: ['Cybersecurity Analyst'] },
  { name: 'Incident Response', category: 'Tools', description: 'Triage, containment, forensic evidence collection, and recovery steps', commonIn: ['Cybersecurity Analyst'] },
  { name: 'Cryptography', category: 'Tools', description: 'Ciphers, asymmetric keys, hashing functions, and TLS communication', commonIn: ['Cybersecurity Analyst'] },
  { name: 'Projects', category: 'Tools', description: 'Hands-on applied portfolio deliverables demonstrating real capability', commonIn: ['Data Analyst', 'AI/ML Engineer', 'Software Developer', 'Cloud Engineer', 'Cybersecurity Analyst'] },

  // Soft Skills
  { name: 'Communication', category: 'Soft Skills', description: 'Articulating technical concepts clearly to peers and stakeholders', commonIn: ['Data Analyst', 'Software Developer', 'Cloud Engineer'] },
  { name: 'Problem Solving', category: 'Soft Skills', description: 'Breaking complex ambiguous challenges into solvable algorithmic steps', commonIn: ['Software Developer', 'AI/ML Engineer', 'Data Analyst'] },
];

export const SKILL_CATEGORIES = [
  'Programming',
  'Data',
  'AI/ML',
  'Cloud',
  'Tools',
  'Soft Skills',
] as const;
