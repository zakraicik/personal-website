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
    title: "Near Marketplace Agent",
    description: "Autonomous marketplace agent for NEAR Protocol",
    tags: ["TypeScript", "Node.js", "AWS"],
    link: "https://github.com/zakraicik/near-marketplace-agent",
    details: [
      "Built a configurable candidate‑selection engine in TypeScript that blends tag and content signals with weighted scoring, minimum thresholds, and guardrail filters to avoid zero‑candidate runs in noisy marketplaces.",
      "Implemented a fallback selection pass that relaxes strict filters when no candidates are found, ensuring resilience without sacrificing safety constraints around budget, keyword exclusions, and text length.",
      "Delivered the feature with full CLI‑driven configuration, updated documentation, and expanded unit tests/lint checks to keep the selection logic deterministic and production‑ready",
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
