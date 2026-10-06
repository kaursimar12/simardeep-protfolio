import type { FlowSpec } from "./flow-diagram";
import { lmsFlow, parentingFlow, ragFlow, wellnessFlow } from "./flows";

export type CaseStudySection = {
  heading: string;
  body?: string;
  items?: { label?: string; text: string }[];
};

export type CaseStudy = {
  slug: string;
  title: string;
  summary: string;
  stack: string[];
  results: { value: string; label: string }[];
  overview: string;
  problem: string;
  solution: string;
  /** One or two sentences introducing this project's flow diagram. */
  flowIntro: string;
  flow: FlowSpec;
  sections: CaseStudySection[];
  outcome?: string;
  /** Shown under the title when set. */
  builtAt?: string;
  role?: string;
  links?: { label: string; href: string }[];
  /** Product screenshot, served from /public. */
  image?: { src: string; alt: string };
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "ai-parenting-assistant",
    title: "AI Parenting Assistant",
    summary:
      "An agentic RAG assistant that gives personalized, context-aware parenting guidance instead of generic chatbot answers.",
    stack: [
      "LangGraph",
      "LangChain",
      "RAG",
      "Qdrant",
      "Embeddings",
      "Tool Calling",
      "LLMs",
      "Google Maps",
      "Geolocation",
      "Weather APIs",
    ],
    results: [
      { value: "300+", label: "Users" },
      { value: "900+", label: "Daily conversations" },
      { value: "10K", label: "Documents in knowledge base" },
    ],
    overview:
      "An AI-powered parenting assistant designed to provide personalized, context-aware parenting guidance rather than generic chatbot responses. The system combines agentic workflows, RAG, semantic retrieval, profile-aware context, and external tools to understand a user's situation and generate tailored recommendations.",
    problem:
      "Traditional AI assistants often answer parenting questions using only the current conversation. This leads to generic responses, limited personalization, and recommendations that don't account for real-world context such as preferences, location, or weather.",
    solution:
      "An agentic RAG architecture orchestrated with LangGraph. The workflow combines user profile information, retrieval from a knowledge base, external tools, and LLM reasoning before producing a personalized response.",
    builtAt: "Wartin Labs Technologies",
    flowIntro:
      "Follow a parent's question through intent detection and the LangGraph agent — which pulls in their profile, location, weather, and Qdrant search results — to a personalized answer. The knowledge base is embedded offline, alongside.",
    flow: parentingFlow,
    sections: [
      {
        heading: "Profile-aware personalization",
        body: "The system incorporates user-specific information such as preferences, hobbies, child age, and location, so recommendations are based on more than the immediate question.",
      },
      {
        heading: "RAG layer",
        items: [
          { text: "Document embeddings" },
          { text: "Semantic retrieval over a Qdrant vector database" },
          { text: "Retrieved context passed to the LLM for generation" },
        ],
      },
      {
        heading: "External tools",
        items: [
          { label: "Google Maps", text: "location-aware activity recommendations." },
          { label: "Geolocation", text: "understanding the user's contextual location." },
          { label: "Weather APIs", text: "factoring environmental conditions into suggestions." },
        ],
      },
      {
        heading: "Engineering focus",
        body: "The central challenge was coordinating multiple information sources — user profile context, conversation context, retrieved knowledge, and external APIs. LangGraph provides the orchestration layer for this agentic workflow.",
      },
    ],
    outcome:
      "The project moves beyond a basic LLM chatbot to a contextual agentic system that combines retrieval, user context, tool calling, and reasoning.",
  },
  {
    slug: "multilingual-voice-lms-assistant",
    title: "Multilingual Voice LMS Assistant",
    summary:
      "A multilingual voice assistant for learning Q&A, exercise retrieval, and homework help, grounded in course content.",
    stack: ["Vapi", "Voice AI", "RAG", "Embeddings", "LLMs", "Semantic Retrieval", "HubSpot CRM"],
    results: [
      { value: "3", label: "Languages" },
      { value: "10+", label: "Turns of conversational context" },
      { value: "40%", label: "Less manual tutor triage" },
    ],
    overview:
      "A multilingual conversational voice assistant for learning and education. Users interact by voice for learning Q&A, exercise retrieval, and homework assistance.",
    problem:
      "Traditional LMS experiences rely heavily on users navigating courses, lessons, exercises, and assignments. A voice interface reduces that friction by letting users ask questions and request learning content conversationally.",
    solution:
      "A Vapi-powered voice layer in front of a retrieval pipeline: spoken questions are transcribed, matched against embedded learning content, and answered by an LLM grounded in that content, then spoken back to the user.",
    builtAt: "Wartin Labs Technologies",
    flowIntro:
      "Follow a spoken question from the student through Vapi and speech recognition, into embedding search over pre-indexed course content, and back as a grounded spoken answer — with the conversation synced to HubSpot.",
    flow: lmsFlow,
    sections: [
      {
        heading: "RAG architecture",
        body: "Learning content is represented as embeddings so the system can perform semantic retrieval. The user's query is embedded, relevant learning content is selected, and that context is given to the LLM for a grounded response.",
      },
      {
        heading: "Conversational context",
        body: "The assistant maintains conversational context so users can ask follow-up questions without restating the whole discussion.",
      },
      {
        heading: "Core use cases",
        items: [
          { label: "Learning Q&A", text: "answer questions about educational material." },
          { label: "Exercise retrieval", text: "find relevant exercises on request." },
          { label: "Homework assistance", text: "help users understand homework questions." },
        ],
      },
      {
        heading: "CRM integration",
        body: "Conversation data is synced to HubSpot CRM, connecting the voice layer to the broader application and business workflow.",
      },
      {
        heading: "Engineering focus",
        body: "The main challenge was combining voice interaction, conversational context, semantic retrieval, and LLM generation into one coherent learning experience.",
      },
    ],
  },
  {
    slug: "real-time-wellness-voice-assistant",
    title: "Real-Time Wellness Voice Assistant",
    summary:
      "A real-time voice assistant that guides users through yoga, breathing exercises, and wellness routines — no screen required.",
    stack: ["LiveKit", "WebRTC", "Voice AI", "Conversational AI"],
    results: [
      { value: "50", label: "Concurrent sessions" },
      { value: "500–600ms", label: "p50 response latency" },
      { value: "800ms–1s", label: "p99 response latency" },
    ],
    overview:
      "A real-time conversational voice assistant for wellness interactions, including yoga, breathing exercises, wellness routines, and stress-management conversations.",
    problem:
      "Wellness apps often depend on visual interfaces. During yoga or breathing exercises, users would rather talk to an assistant than keep looking at a screen.",
    solution:
      "LiveKit and WebRTC provide a real-time communication layer, with a speech-to-text → LLM → text-to-speech pipeline optimized for low-latency live conversation.",
    builtAt: "Wartin Labs Technologies",
    flowIntro:
      "Follow one spoken turn round-trip: audio travels over WebRTC into a LiveKit room, through speech-to-text, the LLM, and text-to-speech, then streams back to the user as voice.",
    flow: wellnessFlow,
    sections: [
      {
        heading: "Conversational workflow",
        body: "The assistant is built around continuous conversation rather than isolated question-and-answer exchanges, so it can guide users through structured activities while responding to them along the way. Three guided conversation flows were built.",
      },
      {
        heading: "Wellness workflows",
        items: [
          { text: "Interactive yoga guidance" },
          { text: "Breathing exercises" },
          { text: "Wellness routines" },
          { text: "Stress-management conversations" },
        ],
      },
      {
        heading: "Real-time engineering",
        body: "Unlike a request-and-response chatbot, a voice assistant needs continuous, low-latency communication. LiveKit and WebRTC provide that real-time foundation.",
      },
    ],
    outcome:
      "A production real-time voice system on LiveKit and WebRTC, delivering interactive wellness experiences at conversational latency.",
  },
  {
    slug: "enterprise-rag-hybrid-search",
    title: "Enterprise RAG & Hybrid Search Pipeline",
    summary:
      "An enterprise retrieval pipeline combining dense vector search with BM25 keyword scoring to ground LLM responses.",
    stack: [
      "OpenAI Embeddings",
      "Pinecone",
      "FAISS",
      "Vector Search",
      "Semantic Search",
      "Hybrid Search",
      "RAG Evaluation",
    ],
    results: [
      { value: "25K", label: "Documents indexed" },
      { value: "71% → 88%", label: "Recall@10" },
    ],
    overview:
      "An enterprise-oriented RAG and semantic search pipeline designed to improve the relevance and grounding of LLM-generated responses.",
    problem:
      "LLMs can generate plausible answers even when the required information isn't in their context. Enterprise applications need a retrieval layer that supplies relevant domain-specific information before generation.",
    solution:
      "An embedding pipeline feeding vector search, combined with keyword scoring for hybrid retrieval, with an evaluation workflow to measure retrieval and response quality.",
    flowIntro:
      "Follow a question through query processing, dense and BM25 keyword search, hybrid ranking, and context construction to a grounded LLM answer — on top of an offline indexing pipeline, with RAG evaluation measuring the result.",
    flow: ragFlow,
    sections: [
      {
        heading: "Embedding pipeline",
        body: "Documents are converted to vectors with OpenAI embeddings. At query time, the user's query is embedded in the same space and used to find relevant documents.",
      },
      {
        heading: "Vector search",
        body: "Pinecone and FAISS were benchmarked against each other across latency, recall, and cost.",
        items: [
          { label: "Pinecone", text: "managed vector search." },
          { label: "FAISS", text: "high-performance local similarity search." },
        ],
      },
      {
        heading: "Hybrid search",
        body: "Retrieval combines dense vector similarity with BM25 keyword scoring. Keyword signals help when exact terms, identifiers, names, or domain-specific terminology matter.",
      },
      {
        heading: "RAG evaluation",
        body: "An evaluation workflow measures retrieval and response quality by asking:",
        items: [
          { text: "Does retrieval find the correct information?" },
          { text: "Is the retrieved context relevant?" },
          { text: "Does the model actually use the retrieved context?" },
          { text: "Is the final response grounded?" },
        ],
      },
    ],
    outcome:
      "Hands-on experience across embedding pipelines, Pinecone, FAISS, semantic and hybrid retrieval, and RAG evaluation.",
  },
];

export function getCaseStudy(slug: string) {
  return caseStudies.find((c) => c.slug === slug);
}
