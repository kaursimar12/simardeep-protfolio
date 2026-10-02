export const links = {
  email: "simararora1002@gmail.com",
  linkedin: "https://linkedin.com/in/simardeep-k",
  github: "https://github.com/simardeep-wartin",
  location: "Gurugram, Haryana, India",
};

export const nav = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "contact", label: "Contact" },
];

export const metrics = [
  { prefix: "", value: 3, suffix: "+", label: "Years Experience" },
  { prefix: "", value: 10, suffix: "K+", label: "Documents Processed" },
  { prefix: "<", value: 600, suffix: "ms", label: "RAG Retrieval p95" },
  { prefix: "", value: 50, suffix: "", label: "Concurrent Voice Sessions" },
  { prefix: "", value: 25, suffix: "K", label: "Docs in Hybrid Search" },
];

export const experience = [
  {
    company: "Wartin Labs Technologies",
    role: "Software Engineer",
    period: "Apr 2025 – Present",
    location: "Noida, India",
    points: [
      "Architected an agentic RAG parenting assistant using LangGraph and Qdrant, serving 300+ users and 900+ daily conversations across a 10K-document knowledge base.",
      "Designed profile-aware workflows using preferences, hobbies, child age, and location, integrating Google Maps, geolocation, and weather APIs for context-aware recommendations.",
      "Launched a multilingual Vapi voice assistant for LMS course questions and homework support, syncing conversation data to HubSpot CRM and reducing manual tutor triage by 40%.",
      "Engineered a LiveKit and WebRTC wellness voice assistant supporting 50 concurrent sessions, achieving 500–600ms p50 and 800ms–1s p99 response latency.",
      "Established an evaluation pipeline over 500 labeled queries, improving retrieval precision from 68% to 86% through chunking and hybrid-search tuning.",
    ],
    tags: ["LangGraph", "Qdrant", "RAG", "Vapi", "LiveKit", "WebRTC", "HubSpot", "AWS"],
  },
  {
    company: "Shades Of Web",
    role: "Software Engineer",
    period: "Mar 2024 – Apr 2025",
    location: "India",
    points: [
      "Delivered production-grade interfaces using React.js, Next.js, TypeScript, and Tailwind CSS, shipping a reusable component library of 40 components across 6 client projects.",
      "Re-engineered the Petbae frontend with memoized components and route-level code splitting, reducing page-load time by approximately 300ms and bundle size by 25%.",
      "Owned backend services and RESTful APIs using Python, Django, and FastAPI with PostgreSQL, MongoDB, and Firebase, serving 50,000 requests per day.",
      "Deployed Dockerized applications on AWS using ECS, EC2, Lambda, S3, CloudFront, and ALB with Nginx and CI/CD pipelines, reducing release time from 45 to 10 minutes.",
      "Resolved 120 critical and major SonarCloud issues across a legacy codebase, improving the maintainability rating from C to A.",
    ],
    tags: ["React", "Next.js", "TypeScript", "Python", "Django", "FastAPI", "PostgreSQL", "MongoDB", "AWS", "Docker", "Nginx", "CI/CD"],
  },
];

export type Visual = "graph" | "wave" | "signal" | "search";

export const projects: {
  title: string; visual: Visual; tags: string[]; description: string; details: string; metric: string; metricLabel: string;
}[] = [
  {
    title: "AI Parenting Assistant",
    visual: "graph",
    tags: ["LangGraph", "LangChain", "RAG", "Qdrant", "Embeddings", "Tool Calling"],
    description: "An agentic RAG system designed to deliver personalized parenting guidance by combining profile-aware retrieval, vector search, tool calling, and LLM reasoning.",
    details: "Orchestrated retrieval across 10K documents and integrated external tools such as Google Maps and weather services to generate context-aware recommendations.",
    metric: "10K+", metricLabel: "documents",
  },
  {
    title: "Multilingual Voice LMS Assistant",
    visual: "wave",
    tags: ["Vapi", "Voice AI", "RAG", "Embeddings", "LLMs"],
    description: "A multilingual voice assistant that provides grounded answers to LMS course questions and homework queries.",
    details: "Uses embedding-based retrieval to ground spoken answers in relevant learning content while maintaining conversational context across 10+ turns.",
    metric: "3", metricLabel: "languages",
  },
  {
    title: "Real-Time Wellness Voice Assistant",
    visual: "signal",
    tags: ["LiveKit", "Voice AI", "Conversational AI", "WebRTC"],
    description: "A real-time conversational wellness assistant supporting guided yoga, breathing, and wellness routines.",
    details: "Built three guided conversation flows and optimized the speech-to-text → LLM → text-to-speech pipeline for low-latency live conversations.",
    metric: "50", metricLabel: "concurrent sessions",
  },
  {
    title: "Enterprise RAG & Hybrid Search Pipeline",
    visual: "search",
    tags: ["OpenAI Embeddings", "Pinecone", "FAISS", "Hybrid Search", "RAG Evaluation"],
    description: "An enterprise retrieval pipeline combining dense vector search with BM25 keyword scoring.",
    details: "Built and evaluated retrieval across 25,000 documents, benchmarking Pinecone and FAISS across latency, recall, and cost.",
    metric: "71% → 88%", metricLabel: "Recall@10",
  },
];

export const skills: { category: string; items: string[] }[] = [
  { category: "AI / Machine Learning", items: ["ML", "LLMs", "Generative AI", "Agentic AI", "LangChain", "LangGraph", "RAG", "RAG Evaluation", "Prompt Engineering", "Tool Calling", "AI Agents", "NLP", "Conversational AI", "Voice AI", "OpenAI Embeddings", "Semantic Search", "Hybrid Search"] },
  { category: "Retrieval / Vector Search", items: ["Qdrant", "Pinecone", "FAISS", "Vector Databases", "Embedding Pipelines", "Vector Search", "Semantic Retrieval", "Hybrid Retrieval"] },
  { category: "Voice / Real-Time AI", items: ["Vapi", "LiveKit", "WebRTC", "Real-Time Voice AI", "Conversational Voice Assistants", "Multilingual Voice AI", "Speech AI"] },
  { category: "Full-Stack", items: ["React.js", "Next.js", "TypeScript", "JavaScript", "Python", "FastAPI", "Django", "Node.js", "Express.js", "REST APIs", "PostgreSQL", "MongoDB", "Firebase", "SQL", "Tailwind CSS", "Zustand", "React Query", "SSR", "Responsive Web Design"] },
  { category: "Cloud / DevOps", items: ["AWS", "EC2", "ECS", "Lambda", "S3", "CloudFront", "ALB", "Docker", "Nginx", "CI/CD", "Vercel", "DigitalOcean", "SonarCloud"] },
  { category: "Tools / Integrations", items: ["HubSpot CRM", "Google Maps API", "Git", "GitHub", "Jira", "Agile", "Postman", "Figma", "ESLint", "Prettier"] },
];

export const approach = [
  { title: "Understand", text: "Understand the product problem, users, and desired outcome." },
  { title: "Architect", text: "Design the AI workflow, APIs, retrieval strategy, data layer, and system architecture." },
  { title: "Build", text: "Develop the frontend, backend, AI pipelines, integrations, and infrastructure." },
  { title: "Optimize", text: "Measure latency, retrieval quality, scalability, reliability, and maintainability." },
];
