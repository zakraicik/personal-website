export interface SkillTraceStep {
  id: string;
  call: string;
  title: string;
  description: string;
  output: string;
  categories: string[];
}

export const skillTrace: SkillTraceStep[] = [
  {
    id: "frame", call: "understand_problem", title: "Frame the right problem",
    description: "Ask questions, define success, and connect the technical work to a useful decision.",
    output: "A question worth answering.",
    categories: ["Leadership & Strategy", "Experimentation & Research"],
  },
  {
    id: "data", call: "inspect_data", title: "Find the signal",
    description: "Explore the data, build reliable pipelines, and make the important patterns visible.",
    output: "Data you can reason with.",
    categories: ["Data Engineering", "Databases", "Data Visualization & BI"],
  },
  {
    id: "model", call: "fit_and_evaluate", title: "Choose and test the model",
    description: "Work across statistical models, machine learning, and language-model fine-tuning. Let the problem lead.",
    output: "A model tested against the problem.",
    categories: ["Data Science & ML", "LLM Technologies"],
  },
  {
    id: "build", call: "build_the_system", title: "Make it work end to end",
    description: "Connect the model to software people can use, from APIs and interfaces to financial systems.",
    output: "A working system.",
    categories: ["Programming Languages", "Frontend", "Blockchain"],
  },
  {
    id: "ship", call: "deploy_and_improve", title: "Ship, monitor, repeat",
    description: "Own deployment, watch behavior in production, and use feedback to improve the next iteration.",
    output: "A system that keeps learning.",
    categories: ["DevOps & Infrastructure", "MLOps"],
  },
];
