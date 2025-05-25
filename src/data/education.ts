export interface Education {
  degree: string;
  school: string;
  period: string;
  description: string[];
}

export const education: Education[] = [
  {
    degree: "Master of Computer Science",
    school: "University of Pennsylvania",
    period: "2021 - 2024",
    description: [
      "Combined mathematical foundations and engineering principles to design high-quality software systems using Python, Java, and C, implementing advanced techniques including blockchain, NLP, and distributed computing while applying algorithmic thinking through data structures, graph theory, and computational analysis",
    ],
  },
  {
    degree: "Bachelor of Science in Finance",
    school: "Bentley University",
    period: "2009 - 2013",
    description: [
      "Studied financial markets and valuation techniques while developing analytical skills, practicing portfolio management strategies with real-time market data, and exploring how digital solutions and economic analysis can optimize business decisions and drive organizational performance",
    ],
  },
];
