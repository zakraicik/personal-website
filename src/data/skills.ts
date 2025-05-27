export interface Skill {
  name: string;
  level: "Beginner" | "Intermediate" | "Advanced" | "Expert";
  category: string;
}

export const skills: Skill[] = [
  { name: "Python", level: "Expert", category: "Programming Languages" },
  { name: "SQL", level: "Expert", category: "Programming Languages" },
  { name: "JavaScript", level: "Advanced", category: "Programming Languages" },
  { name: "TypeScript", level: "Advanced", category: "Programming Languages" },
  { name: "R", level: "Intermediate", category: "Programming Languages" },
  { name: "Java", level: "Intermediate", category: "Programming Languages" },
  { name: "C++", level: "Intermediate", category: "Programming Languages" },
  { name: "Solidity", level: "Advanced", category: "Programming Languages" },

  { name: "Scikit-learn", level: "Expert", category: "Data Science & ML" },
  { name: "PyTorch", level: "Advanced", category: "Data Science & ML" },
  { name: "TensorFlow", level: "Advanced", category: "Data Science & ML" },
  { name: "MLflow", level: "Intermediate", category: "Data Science & ML" },
  { name: "XGBoost", level: "Advanced", category: "Data Science & ML" },
  { name: "LightGBM", level: "Advanced", category: "Data Science & ML" },
  { name: "Pandas", level: "Expert", category: "Data Science & ML" },
  { name: "NumPy", level: "Expert", category: "Data Science & ML" },
  { name: "NLTK", level: "Advanced", category: "Data Science & ML" },
  { name: "Spacy", level: "Intermediate", category: "Data Science & ML" },
  { name: "StatsModels", level: "Advanced", category: "Data Science & ML" },
  { name: "PyMC", level: "Intermediate", category: "Data Science & ML" },
  { name: "Hugging Face", level: "Advanced", category: "Data Science & ML" },
  { name: "A/B Testing", level: "Expert", category: "Data Science & ML" },
  {
    name: "Jupyter Notebooks",
    level: "Expert",
    category: "Data Science & ML",
  },

  { name: "Looker", level: "Advanced", category: "Data Visualization & BI" },
  { name: "Tableau", level: "Advanced", category: "Data Visualization & BI" },
  { name: "Matplotlib", level: "Expert", category: "Data Visualization & BI" },
  { name: "Seaborn", level: "Expert", category: "Data Visualization & BI" },

  { name: "AWS", level: "Advanced", category: "DevOps & Infrastructure" },
  { name: "GCP", level: "Intermediate", category: "DevOps & Infrastructure" },
  { name: "Azure", level: "Intermediate", category: "DevOps & Infrastructure" },
  { name: "Vercel", level: "Advanced", category: "DevOps & Infrastructure" },
  { name: "Docker", level: "Advanced", category: "DevOps & Infrastructure" },
  {
    name: "GitHub Actions",
    level: "Advanced",
    category: "DevOps & Infrastructure",
  },
  { name: "Git/Github", level: "Expert", category: "DevOps & Infrastructure" },
  {
    name: "CI/CD workflows",
    level: "Advanced",
    category: "DevOps & Infrastructure",
  },
  { name: "DBT", level: "Intermediate", category: "DevOps & Infrastructure" },
  {
    name: "Airflow",
    level: "Intermediate",
    category: "DevOps & Infrastructure",
  },

  { name: "PostgreSQL", level: "Expert", category: "Databases" },
  { name: "MySQL", level: "Advanced", category: "Databases" },
  { name: "Redshift", level: "Advanced", category: "Databases" },
  { name: "SQLite", level: "Advanced", category: "Databases" },
  { name: "Neo4j", level: "Intermediate", category: "Databases" },
  { name: "Firebase", level: "Advanced", category: "Databases" },
  { name: "MongoDB", level: "Advanced", category: "Databases" },

  { name: "React", level: "Expert", category: "Frontend" },
  { name: "Next.js", level: "Expert", category: "Frontend" },
  { name: "Tailwind CSS", level: "Advanced", category: "Frontend" },
  { name: "Node.js", level: "Advanced", category: "Frontend" },

  { name: "ethers.js", level: "Advanced", category: "Blockchain" },
  { name: "Web3.js", level: "Advanced", category: "Blockchain" },
  { name: "Hardhat", level: "Intermediate", category: "Blockchain" },
  { name: "Truffle", level: "Intermediate", category: "Blockchain" },
  { name: "Alchemy", level: "Intermediate", category: "Blockchain" },
  { name: "Dune", level: "Intermediate", category: "Blockchain" },
  { name: "MetaMask", level: "Advanced", category: "Blockchain" },

  { name: "Spark", level: "Intermediate", category: "Data Engineering" },
  { name: "DVC", level: "Advanced", category: "Data Engineering" },

  { name: "Arize AI", level: "Advanced", category: "MLOps" },
  { name: "Weights & Biases", level: "Advanced", category: "MLOps" },
  { name: "AWS SageMaker", level: "Advanced", category: "MLOps" },

  { name: "OpenAI API", level: "Advanced", category: "LLM Technologies" },
  { name: "Anthropic API", level: "Advanced", category: "LLM Technologies" },
  { name: "LangChain", level: "Advanced", category: "LLM Technologies" },
  {
    name: "Hugging Face Transformers",
    level: "Advanced",
    category: "LLM Technologies",
  },
  {
    name: "PyTorch LLM Fine-tuning",
    level: "Advanced",
    category: "LLM Technologies",
  },

  {
    name: "Cross-functional leadership",
    level: "Expert",
    category: "Leadership & Strategy",
  },
  {
    name: "Executive communication",
    level: "Expert",
    category: "Leadership & Strategy",
  },
  {
    name: "Data strategy",
    level: "Expert",
    category: "Leadership & Strategy",
  },
  {
    name: "Team management",
    level: "Advanced",
    category: "Leadership & Strategy",
  },
  {
    name: "Technical mentorship",
    level: "Expert",
    category: "Leadership & Strategy",
  },
  {
    name: "Product strategy",
    level: "Advanced",
    category: "Leadership & Strategy",
  },

  {
    name: "Metrics design",
    level: "Expert",
    category: "Experimentation & Research",
  },
  {
    name: "Product analytics",
    level: "Expert",
    category: "Experimentation & Research",
  },
  {
    name: "Statistical analysis",
    level: "Expert",
    category: "Experimentation & Research",
  },
  {
    name: "Research design",
    level: "Advanced",
    category: "Experimentation & Research",
  },
  {
    name: "Hypothesis framework",
    level: "Expert",
    category: "Experimentation & Research",
  },
];

export const CATEGORY_COLORS = [
  "#00BFFF",
  "#8A2BE2",
  "#FF1493",
  "#38BDF8",
  "#A78BFA",
  "#F472B6",
  "#2563EB",
  "#4ADE80",
  "#FB923C",
  "#F97316",
  "#7C3AED",
  "#EC4899",
];
