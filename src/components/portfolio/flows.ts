import type { FlowSpec } from "./flow-diagram";

// Hand-placed diagram layouts (viewBox units). Node widths are derived from
// their text; `cx`/`cy` are centres. Steps run in order and define the edges.

export const parentingFlow: FlowSpec = {
  width: 900,
  height: 580,
  groups: [
    { label: "Offline ingestion", x: 716, y: 92, w: 176, h: 286 },
    { label: "LangGraph agent workflow", x: 8, y: 188, w: 684, h: 286 },
  ],
  nodes: [
    { id: "parent", label: "Parent", sub: "Asks a question", icon: "user", cx: 350, cy: 50 },
    {
      id: "intent",
      label: "Intent understanding",
      sub: "Conversation context",
      icon: "chat",
      cx: 350,
      cy: 146,
    },
    {
      id: "agent",
      label: "Agent workflow",
      sub: "LangGraph orchestration",
      icon: "agent",
      cx: 350,
      cy: 242,
    },
    {
      id: "profile",
      label: "User profile",
      sub: "Prefs · child age",
      icon: "user",
      cx: 99,
      cy: 338,
    },
    { id: "location", label: "Location", sub: "Geo + Google Maps", icon: "map", cx: 267, cy: 338 },
    {
      id: "weather",
      label: "Weather API",
      sub: "Local conditions",
      icon: "weather",
      cx: 433,
      cy: 338,
    },
    { id: "search", label: "Semantic search", sub: "Qdrant", icon: "search", cx: 600, cy: 338 },
    {
      id: "llm",
      label: "LLM reasoning",
      sub: "Grounded in all context",
      icon: "ai",
      cx: 350,
      cy: 434,
    },
    {
      id: "response",
      label: "Personalized response",
      sub: "Delivered to the parent",
      icon: "chat",
      cx: 350,
      cy: 530,
    },
    { id: "kb", label: "Knowledge base", sub: "10K documents", icon: "doc", cx: 804, cy: 146 },
    { id: "embed", label: "Embeddings", sub: "Document vectors", icon: "vector", cx: 804, cy: 242 },
    { id: "qdrant", label: "Qdrant", sub: "Vector collection", icon: "db", cx: 804, cy: 338 },
  ],
  steps: [
    {
      caption:
        "Offline, the 10K-document parenting knowledge base is embedded and indexed in Qdrant.",
      edges: [
        { from: "kb", to: "embed" },
        { from: "embed", to: "qdrant" },
      ],
    },
    { caption: "A parent asks a question.", edges: [{ from: "parent", to: "intent" }] },
    {
      caption:
        "Intent is understood using the conversation so far, then handed to the LangGraph workflow.",
      edges: [{ from: "intent", to: "agent" }],
    },
    {
      caption:
        "The agent loads the parent's profile and calls tools for location, weather, and semantic search.",
      edges: [
        { from: "agent", to: "profile", out: "l" },
        { from: "agent", to: "location", outAt: 0.35 },
        { from: "agent", to: "weather", outAt: 0.65 },
        { from: "agent", to: "search", out: "r" },
      ],
    },
    {
      caption: "Qdrant returns the most relevant knowledge-base passages.",
      edges: [{ from: "qdrant", to: "search" }],
    },
    {
      caption: "Profile, tool results, and retrieved knowledge are combined into one context.",
      edges: [
        { from: "profile", to: "llm", in: "l" },
        { from: "location", to: "llm", inAt: 0.35 },
        { from: "weather", to: "llm", inAt: 0.65 },
        { from: "search", to: "llm", in: "r" },
      ],
    },
    {
      caption: "The LLM reasons over that context and replies with personalized guidance.",
      edges: [{ from: "llm", to: "response" }],
    },
  ],
};

export const lmsFlow: FlowSpec = {
  width: 900,
  height: 500,
  groups: [{ label: "Content ingestion", x: 693, y: 12, w: 196, h: 284 }],
  nodes: [
    { id: "student", label: "Student", sub: "Asks by voice", icon: "user", cx: 110, cy: 64 },
    {
      id: "vapi",
      label: "Vapi voice interface",
      sub: "Multilingual · 3 languages",
      icon: "mic",
      cx: 330,
      cy: 64,
    },
    { id: "stt", label: "Speech recognition", sub: "Speech → text", icon: "wave", cx: 560, cy: 64 },
    {
      id: "conv",
      label: "Conversational workflow",
      sub: "Multi-turn context",
      icon: "chat",
      cx: 560,
      cy: 160,
    },
    { id: "crm", label: "HubSpot CRM", sub: "Conversation sync", icon: "crm", cx: 330, cy: 160 },
    {
      id: "search",
      label: "Embedding search",
      sub: "Semantic retrieval",
      icon: "search",
      cx: 560,
      cy: 256,
    },
    {
      id: "content",
      label: "Relevant content",
      sub: "Lessons · exercises",
      icon: "doc",
      cx: 560,
      cy: 352,
    },
    { id: "llm", label: "LLM response", sub: "Grounded in content", icon: "ai", cx: 560, cy: 448 },
    {
      id: "tts",
      label: "Voice generation",
      sub: "Text → speech",
      icon: "speaker",
      cx: 330,
      cy: 448,
    },
    { id: "student2", label: "Student", sub: "Hears the answer", icon: "user", cx: 110, cy: 448 },
    {
      id: "source",
      label: "Learning content",
      sub: "Courses · exercises",
      icon: "doc",
      cx: 791,
      cy: 64,
    },
    { id: "embed", label: "Embeddings", sub: "Content vectors", icon: "vector", cx: 791, cy: 160 },
    { id: "index", label: "Vector index", sub: "Embedded content", icon: "db", cx: 791, cy: 256 },
  ],
  steps: [
    {
      caption: "Learning content is embedded ahead of time so it can be searched by meaning.",
      edges: [
        { from: "source", to: "embed" },
        { from: "embed", to: "index" },
      ],
    },
    {
      caption: "A student asks a question out loud, in one of three supported languages.",
      edges: [{ from: "student", to: "vapi" }],
    },
    {
      caption: "Vapi streams the audio to speech recognition, which turns it into text.",
      edges: [{ from: "vapi", to: "stt" }],
    },
    {
      caption:
        "The conversational workflow adds context from earlier turns, so follow-ups just work.",
      edges: [{ from: "stt", to: "conv" }],
    },
    {
      caption: "The query is embedded and matched against the learning-content index.",
      edges: [
        { from: "conv", to: "search" },
        { from: "index", to: "search" },
      ],
    },
    {
      caption: "The most relevant lessons and exercises are pulled in as context.",
      edges: [{ from: "search", to: "content" }],
    },
    {
      caption: "The LLM writes an answer grounded in that content.",
      edges: [{ from: "content", to: "llm" }],
    },
    {
      caption: "Voice generation turns the answer back into speech…",
      edges: [{ from: "llm", to: "tts" }],
    },
    {
      caption: "…and the student hears it, free to ask a follow-up.",
      edges: [{ from: "tts", to: "student2" }],
    },
    {
      caption: "Conversation data syncs to HubSpot CRM, cutting manual tutor triage by 40%.",
      edges: [{ from: "conv", to: "crm" }],
    },
  ],
};

// Tall transport nodes span both the uplink (top) and downlink (bottom) rows.
const UP = 0.107;
const DOWN = 0.893;

export const wellnessFlow: FlowSpec = {
  width: 900,
  height: 320,
  groups: [{ label: "Voice AI pipeline", x: 620, y: 18, w: 240, h: 286 }],
  nodes: [
    {
      id: "user",
      label: "User",
      sub: "Mic + speaker",
      icon: "user",
      cx: 90,
      cy: 166,
      w: 140,
      h: 244,
    },
    {
      id: "webrtc",
      label: "WebRTC",
      sub: "Audio transport",
      icon: "network",
      cx: 290,
      cy: 166,
      w: 150,
      h: 244,
    },
    {
      id: "livekit",
      label: "LiveKit",
      sub: "Real-time room",
      icon: "wave",
      cx: 490,
      cy: 166,
      w: 150,
      h: 244,
    },
    {
      id: "stt",
      label: "Speech-to-text",
      sub: "Live transcription",
      icon: "scan",
      cx: 740,
      cy: 70,
      w: 200,
    },
    { id: "llm", label: "LLM", sub: "Guided wellness flows", icon: "ai", cx: 740, cy: 166, w: 200 },
    {
      id: "tts",
      label: "Text-to-speech",
      sub: "Natural voice reply",
      icon: "speaker",
      cx: 740,
      cy: 262,
      w: 200,
    },
  ],
  steps: [
    {
      caption:
        "The user speaks — hands-free, mid-pose or mid-breath — and audio streams over WebRTC.",
      edges: [{ from: "user", to: "webrtc", outAt: UP, inAt: UP, label: "audio in" }],
    },
    {
      caption: "LiveKit receives the stream in a real-time session (up to 50 run concurrently).",
      edges: [{ from: "webrtc", to: "livekit", outAt: UP, inAt: UP, label: "audio in" }],
    },
    {
      caption: "Speech-to-text transcribes the user as they talk.",
      edges: [{ from: "livekit", to: "stt", outAt: UP }],
    },
    {
      caption:
        "The LLM picks the next step of the guided flow: yoga, breathing, a routine, or stress support.",
      edges: [{ from: "stt", to: "llm" }],
    },
    {
      caption: "Text-to-speech turns the reply into natural audio.",
      edges: [{ from: "llm", to: "tts" }],
    },
    {
      caption: "The audio streams back through LiveKit…",
      edges: [{ from: "tts", to: "livekit", inAt: DOWN }],
    },
    {
      caption: "…and over WebRTC to the user.",
      edges: [{ from: "livekit", to: "webrtc", outAt: DOWN, inAt: DOWN, label: "audio out" }],
    },
    {
      caption:
        "The user hears the guidance within 500–600ms (p50), and the conversation keeps going.",
      edges: [{ from: "webrtc", to: "user", outAt: DOWN, inAt: DOWN, label: "audio out" }],
    },
  ],
};

export const ragFlow: FlowSpec = {
  width: 900,
  height: 520,
  groups: [{ label: "Indexing pipeline · offline", x: 12, y: 12, w: 876, h: 92 }],
  nodes: [
    {
      id: "docs",
      label: "Enterprise documents",
      sub: "25K documents",
      icon: "doc",
      cx: 120,
      cy: 64,
    },
    {
      id: "proc",
      label: "Document processing",
      sub: "Parse & prepare",
      icon: "cpu",
      cx: 340,
      cy: 64,
    },
    {
      id: "embed",
      label: "OpenAI embeddings",
      sub: "Dense vectors",
      icon: "vector",
      cx: 560,
      cy: 64,
    },
    { id: "index", label: "Vector index", sub: "Pinecone · FAISS", icon: "db", cx: 780, cy: 64 },
    { id: "query", label: "User query", sub: "Natural language", icon: "user", cx: 120, cy: 170 },
    {
      id: "qproc",
      label: "Query processing",
      sub: "Prepares the query",
      icon: "cpu",
      cx: 340,
      cy: 170,
    },
    {
      id: "qembed",
      label: "Query embedding",
      sub: "Same vector space",
      icon: "vector",
      cx: 560,
      cy: 170,
    },
    {
      id: "dense",
      label: "Dense search",
      sub: "Pinecone / FAISS",
      icon: "search",
      cx: 780,
      cy: 170,
    },
    {
      id: "bm25",
      label: "BM25 keyword search",
      sub: "Exact terms · IDs",
      icon: "search",
      cx: 560,
      cy: 266,
    },
    {
      id: "hybrid",
      label: "Hybrid ranking",
      sub: "Dense + keyword",
      icon: "merge",
      cx: 780,
      cy: 266,
    },
    {
      id: "context",
      label: "Context construction",
      sub: "Top passages",
      icon: "doc",
      cx: 780,
      cy: 362,
    },
    { id: "llm", label: "LLM", sub: "Answers from context", icon: "ai", cx: 560, cy: 362 },
    {
      id: "response",
      label: "Response",
      sub: "Grounded in context",
      icon: "chat",
      cx: 340,
      cy: 362,
    },
    { id: "user", label: "User", sub: "Gets the answer", icon: "user", cx: 120, cy: 362 },
    {
      id: "eval",
      label: "RAG evaluation",
      sub: "Recall@10 · context relevance · groundedness",
      icon: "chart",
      cx: 450,
      cy: 470,
    },
  ],
  steps: [
    {
      caption:
        "Offline, 25K enterprise documents are processed, embedded with OpenAI, and indexed in Pinecone and FAISS.",
      edges: [
        { from: "docs", to: "proc" },
        { from: "proc", to: "embed" },
        { from: "embed", to: "index" },
      ],
    },
    { caption: "A user asks a question.", edges: [{ from: "query", to: "qproc" }] },
    {
      caption:
        "The query is embedded into the same vector space and also scored by BM25 keyword search.",
      edges: [
        { from: "qproc", to: "qembed" },
        { from: "qproc", to: "bm25", out: "b", in: "l" },
      ],
    },
    {
      caption: "Dense vector search finds semantically similar passages.",
      edges: [
        { from: "qembed", to: "dense" },
        { from: "index", to: "dense" },
      ],
    },
    {
      caption: "Dense and keyword results are merged into a single hybrid ranking.",
      edges: [
        { from: "dense", to: "hybrid" },
        { from: "bm25", to: "hybrid" },
      ],
    },
    {
      caption: "The top passages are assembled into the LLM's context.",
      edges: [{ from: "hybrid", to: "context" }],
    },
    {
      caption: "The LLM generates an answer using that context…",
      edges: [{ from: "context", to: "llm" }],
    },
    { caption: "…producing a grounded response…", edges: [{ from: "llm", to: "response" }] },
    { caption: "…that goes back to the user.", edges: [{ from: "response", to: "user" }] },
    {
      caption:
        "Evaluation checks retrieval recall, context relevance, and groundedness — Recall@10 rose from 71% to 88%.",
      edges: [
        { from: "response", to: "eval", in: "t", inAt: 0.15 },
        { from: "context", to: "eval", out: "b", in: "r" },
      ],
    },
  ],
};
