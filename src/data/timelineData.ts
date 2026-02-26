export interface TimelineItem {
  type: "education" | "work";
  title: string;
  subtitle: string;
  startYear: string;
  endYear: string;
  description: string | string[];
}

export const timelineData: TimelineItem[] = [
  {
    type: "education",
    title: "Master of Computer Science",
    subtitle: "University of Pennsylvania",
    startYear: "2021",
    endYear: "2024",
    description: [
      "Combined mathematical foundations and engineering principles to design high-quality software systems",
      "Developed applications using Python, Java, and C programming languages",
      "Implemented advanced techniques natural language processing, and distributed computing",
      "Applied algorithmic thinking through data structures, graph theory, and computational analysis",
    ],
  },
  {
    type: "education",
    title: "Bachelor of Science in Finance",
    subtitle: "Bentley University",
    startYear: "2009",
    endYear: "2013",
    description: [
      "Studied financial markets and valuation techniques while developing analytical skills",
      "Practiced portfolio management strategies with real-time market data",
      "Explored how digital solutions and economic analysis can optimize business decisions",
      "Learned approaches to drive organizational performance through financial analysis",
    ],
  },
  {
    type: "work",
    title: "Director of Data Science",
    subtitle: "Corvus (Acquired by Travelers)",
    startYear: "2021",
    endYear: "2025",
    description: [
      "Led cross-functional data science teams building enterprise ML systems that delivered measurable business impact",
      "Established scalable infrastructure that accelerated feature deployment for ML solutions",
      "Implemented A/B testing platforms, risk assessment models, and customer retention solutions",
      "Created robust data validation frameworks and clear business-aligned metrics for stakeholders",
    ],
  },
  {
    type: "work",
    title: "Senior Data Scientist",
    subtitle: "Gauntlet",
    startYear: "2025",
    endYear: "Present",
    description: [
      "Client facing data scientist helping to build the future of finance.",
      "Lead engagements focused on using data science to solve problems related to incentive optimizaiton, tokenomics, and risk management.",
      "Architecting, implementing, and stewarding end-to-end data infrastructure using Dagster and GCP",
      "Make business recommendations to the executive and cross-functional teams (e.g. cost-benefit, forecasting, experiment analysis) effectively through findings from quantitative information",
    ],
  },
  {
    type: "work",
    title: "Data Scientist",
    subtitle: "John Hancock",
    startYear: "2015",
    endYear: "2021",
    description: [
      "Developed real-time prediction systems and NLP pipelines analyzing user behavior patterns",
      "Engineered comprehensive model monitoring infrastructure with automated validation frameworks",
      "Spearheaded agile transformation that significantly reduced feature delivery cycles",
      "Established metrics visualization dashboards that improved product development decisions",
    ],
  },
];
