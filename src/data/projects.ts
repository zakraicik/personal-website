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
    title: "Project 2",
    description: "A brief description of the project and its key features.",
    tags: ["Next.js", "TypeScript", "Tailwind"],
    link: "#",
    details: [
      "Server-side rendering for SEO optimization",
      "Integrated authentication with OAuth",
      "Custom theming with Tailwind CSS",
    ],
  },
  {
    title: "Project 3",
    description: "A brief description of the project and its key features.",
    tags: ["React", "GraphQL", "AWS"],
    link: "#",
    details: [
      "GraphQL API for flexible data queries",
      "Cloud storage integration for user uploads",
      "Unit and integration tests with Jest",
    ],
  },
];
