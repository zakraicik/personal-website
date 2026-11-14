export interface TimelineItem {
  type: "education" | "work";
  title: string;
  subtitle: string;
  startYear: string;
  endYear: string;
  startMonth?: string;
  endMonth?: string;
  link?: string;
  summary: string;
  flow: [string, string, string];
  tools: string[];
  loop?: string;
  description: string[];
}

export const timelineData: TimelineItem[] = [
  {
    type: "work", title: "Head of Machine Learning", subtitle: "Evoke Security",
    startYear: "2026", startMonth: "Apr", endYear: "Present",
    link: "https://www.evokesecurity.com/",
    summary: "Combine ML signals into useful detections of dangerous agent behavior.",
    flow: ["Agent telemetry", "ML signals", "Detections"],
    loop: "Feedback into retraining",
    tools: ["Classification", "Anomaly detection", "LM fine-tuning", "Agent evaluation"],
    description: [
      "Build classifiers, anomaly detection, and fine-tuned language models.",
      "Own telemetry, deployment, monitoring, and feedback-led retraining.",
      "Maintain a semi-autonomous detection catalog; use and evaluate agents.",
    ],
  },
  {
    type: "work", title: "Senior Data Scientist", subtitle: "Gauntlet",
    startYear: "2025", endYear: "2026", endMonth: "Mar",
    summary: "Client-facing data science for DeFi incentives, tokenomics, and risk.",
    flow: ["On-chain data", "Dagster + dbt", "BigQuery + Hex"],
    loop: "Research into client decisions",
    tools: ["Python", "scikit-learn", "Dagster", "dbt", "BigQuery", "Hex"],
    description: [
      "Led client engagements across tokenomics, governance, and network risk.",
      "Built on-chain pipelines with Dagster, dbt, BigQuery, and Hex.",
      "Developed Python/scikit-learn models for incentive optimization.",
    ],
  },
  {
    type: "work", title: "Director of Data Science", subtitle: "Corvus (Acquired by Travelers)",
    startYear: "2021", endYear: "2025",
    summary: "Led a cross-functional team building enterprise ML products.",
    flow: ["Experiment", "Train + serve", "Measure impact"],
    loop: "Customer outcomes into model updates",
    tools: ["AWS", "Feature stores", "A/B testing", "MLOps", "Team leadership"],
    description: [
      "Led data scientists and MLOps engineers, staying close to delivery.",
      "Shipped risk, targeting, retention, and A/B testing systems.",
      "Built feature stores, automated AWS training, and model deployments.",
    ],
  },
  {
    type: "work", title: "Data Scientist", subtitle: "John Hancock",
    startYear: "2015", endYear: "2021",
    summary: "Real-time prediction, NLP, and production model ownership.",
    flow: ["Financial text", "NLP + prediction", "Live monitoring"],
    loop: "Real-world behavior into model evaluation",
    tools: ["NLP", "Real-time inference", "AWS", "GitHub Actions"],
    description: [
      "Turned lengthy evaluations into real-time predictions and NLP insights.",
      "Built model monitoring with AWS endpoints and GitHub Actions.",
      "Improved delivery through agile planning and data-led prioritization.",
    ],
  },
  {
    type: "education", title: "Master of Computer Science", subtitle: "University of Pennsylvania",
    startYear: "2021", endYear: "2024",
    summary: "Foundations in computer science and software engineering.",
    flow: ["Foundations", "Software systems", "Applied CS"],
    tools: ["Algorithms", "Python", "Java", "C", "Distributed systems"],
    description: [
      "Algorithms, data structures, and graph theory.",
      "Software systems in Python, Java, and C.",
      "Natural language processing and distributed computing.",
    ],
  },
  {
    type: "education", title: "Bachelor of Science in Finance", subtitle: "Bentley University",
    startYear: "2009", endYear: "2013",
    summary: "Financial analysis, markets, and quantitative decision-making.",
    flow: ["Markets", "Valuation", "Decisions"],
    tools: ["Financial analysis", "Portfolio management", "Quantitative research"],
    description: [
      "Financial markets, valuation, and portfolio management.",
      "Quantitative analysis for business and investment decisions.",
    ],
  },
];
