export const links = {
  email: "simararora1002@gmail.com",
  linkedin: "https://linkedin.com/in/simardeep-k",
  github: "https://github.com/simardeep-wartin",
  location: "Gurugram, Haryana, India",
  // Opens in a new tab. The "Résumé" buttons are hidden if this is empty.
  resume: "https://drive.google.com/file/d/1_U049QkPEiK3EzbBuBpUqCgiX-XszOW1/view",
};

export const nav = [
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Experience" },
  { id: "skills", label: "Skills" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
];

// Every figure here is backed by an experience bullet below.
export const metrics = [
  { value: "3+", label: "Years experience" },
  { value: "900+", label: "Daily AI conversations" },
  { value: "68% → 86%", label: "Retrieval precision after tuning" },
  { value: "50", label: "Concurrent real-time voice sessions" },
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
    tags: [
      "React",
      "Next.js",
      "TypeScript",
      "Python",
      "Django",
      "FastAPI",
      "PostgreSQL",
      "MongoDB",
      "AWS",
      "Docker",
      "Nginx",
      "CI/CD",
    ],
  },
];

export const projects: {
  slug: string;
  title: string;
  tags: string[];
  description: string;
  metric: string;
  metricLabel: string;
}[] = [
  {
    slug: "ai-parenting-assistant",
    title: "AI Parenting Assistant",
    tags: ["LangGraph", "RAG", "Qdrant", "Tool Calling"],
    description:
      "Agentic RAG assistant that gives personalized, context-aware parenting guidance instead of generic chatbot answers.",
    metric: "900+",
    metricLabel: "daily conversations",
  },
  {
    slug: "multilingual-voice-lms-assistant",
    title: "Multilingual Voice LMS Assistant",
    tags: ["Vapi", "Voice AI", "RAG", "HubSpot CRM"],
    description:
      "Voice assistant for course Q&A, exercise retrieval, and homework help in three languages, grounded in course content.",
    metric: "40%",
    metricLabel: "less manual tutor triage",
  },
  {
    slug: "real-time-wellness-voice-assistant",
    title: "Real-Time Wellness Voice Assistant",
    tags: ["LiveKit", "WebRTC", "Voice AI", "Conversational AI"],
    description:
      "Real-time voice assistant that guides yoga, breathing, and wellness routines — no screen required.",
    metric: "500–600ms",
    metricLabel: "p50 response latency",
  },
  {
    slug: "enterprise-rag-hybrid-search",
    title: "Enterprise RAG & Hybrid Search Pipeline",
    tags: ["Pinecone", "FAISS", "Hybrid Search", "RAG Evaluation"],
    description:
      "Retrieval pipeline combining dense vector search with BM25 keyword scoring to ground LLM answers across 25K documents.",
    metric: "71% → 88%",
    metricLabel: "Recall@10",
  },
];

export const skills: { category: string; core: string[]; also: string[] }[] = [
  {
    category: "AI & LLMs",
    core: ["LangGraph", "LangChain", "RAG", "RAG evaluation", "Tool calling", "Prompt engineering"],
    also: ["OpenAI embeddings", "NLP"],
  },
  {
    category: "Retrieval",
    core: ["Qdrant", "Pinecone", "FAISS", "Hybrid search (dense + BM25)"],
    also: ["Embedding pipelines"],
  },
  {
    category: "Voice & real-time",
    core: ["LiveKit", "WebRTC", "Vapi"],
    also: ["Multilingual voice"],
  },
  {
    category: "Frontend",
    core: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
    also: ["React Query", "Zustand"],
  },
  {
    category: "Backend",
    core: ["Python", "FastAPI", "Django", "PostgreSQL"],
    also: ["Node.js", "Express", "MongoDB", "Firebase"],
  },
  {
    category: "Cloud & DevOps",
    core: ["AWS", "Docker", "CI/CD"],
    also: ["ECS", "Lambda", "S3", "CloudFront", "Nginx", "Vercel", "SonarCloud"],
  },
];

export const education = {
  degree: "B.Tech. in Computer Science and Engineering",
  school: "Assam University",
  grade: "CGPA 7.86",
  period: "2020 – 2024",
};
