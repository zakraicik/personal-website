// Project data for Portfolio section

export interface Project {
  title: string;
  description: string;
  tags: string[];
  link: string;
  details: string[];
}

export const projects: Project[] = [
  {
    title: "Launchpad",
    description:
      "Decentralized crowd funding platform that uses yield generation to offset platform fees.",
    tags: ["Solidity", "Next.js", "Alchemy", "Firebase"],
    link: "https://www.getlaunched.xyz",
    details: [
      "Designed and implemented a full-stack DeFi crowdfunding platform on Base with a system of smart contracts that manage campaign funding, yield generation via Aave integration, and token-based transactions.",
      "Engineered a comprehensive event system and data pipeline using Google Cloud Functions and Alchemy webhooks to index on-chain activity, enabling real-time analytics for campaign performance metrics.",
      "Built an intuitive Next.js front-end with Firebase wallet authentication that visualizes campaign progress and yield statistics, deployed with reliable performance on Base network.",
    ],
  },
  {
    title: "Special Train",
    description: "Ethereum price forecasting model",
    tags: ["Python", "AWS", "Github Actions"],
    link: "https://github.com/zakraicik/special-train",
    details: [
      "Developed an automated data pipeline that retrieves Ethereum price data at 5-minute intervals, stores it in AWS S3, and preprocesses it into LSTM-ready formats with scaled training/validation/test sets orchestrated through weekly GitHub Actions.",
      "Engineered an LSTM neural network using Keras Tuner for hyperparameter optimization to minimize validation MAE loss, with AWS SageMaker integration for scalable cloud training and automatic model persistence to S3 for production inference.",
      "Built a comprehensive evaluation framework that generates performance visualizations comparing actual vs. predicted Ethereum prices on unseen test data, providing clear accuracy metrics and prediction insights for time-series forecasting",
    ],
  },
  {
    title: "0xGuard",
    description:
      "An AI-powered Web3 security auditor through a standardized MCP interface.",
    tags: ["TypeScript", "Blockchain", "Security"],
    link: "https://github.com/zakraicik/0xguard",
    details: [
      "Developed a real-time blockchain security monitoring system that analyzes smart contracts for vulnerabilities using static analysis tools, integrates with multiple threat intelligence APIs, and provides automated risk scoring for contracts and wallet addresses.",
      "Engineered a comprehensive fraud detection engine using machine learning models to identify suspicious wallet behavior patterns, with real-time alerting capabilities and cross-chain monitoring across Ethereum, Polygon, and BSC networks.",
      "Built an AI-friendly MCP interface that standardizes complex security analysis into natural language queries, enabling seamless integration with Claude and other AI agents for automated security auditing and threat detection workflows.",
    ],
  },
];
