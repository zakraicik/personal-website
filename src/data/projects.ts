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
    description: "A brief description of the project and its key features.",
    tags: ["React", "Node.js", "MongoDB"],
    link: "#",
    details: [
      "Implemented a real-time chat feature using WebSockets",
      "Deployed on AWS with CI/CD integration",
      "Responsive design for mobile and desktop",
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
