export interface Experience {
  title: string;
  company: string;
  period: string;
  description: string[];
}

export const experiences: Experience[] = [
  {
    title: "Senior Developer",
    company: "Tech Company",
    period: "2021 - Present",
    description: [
      "Led development of key features for enterprise applications",
      "Mentored junior developers and conducted code reviews",
      "Implemented CI/CD pipelines and improved deployment processes",
    ],
  },
  {
    title: "Full Stack Developer",
    company: "Startup Inc",
    period: "2019 - 2021",
    description: [
      "Developed and maintained multiple web applications",
      "Collaborated with design team to implement UI/UX improvements",
      "Optimized application performance and reduced load times",
    ],
  },
  {
    title: "Junior Developer",
    company: "Digital Agency",
    period: "2018 - 2019",
    description: [
      "Built responsive websites for various clients",
      "Worked with modern frontend frameworks and libraries",
      "Participated in agile development processes",
    ],
  },
];
