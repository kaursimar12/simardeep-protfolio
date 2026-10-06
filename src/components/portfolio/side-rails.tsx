import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { Box, Check, Database, FileText, MessagesSquare, type LucideIcon } from "lucide-react";
import { delay, useActiveSection } from "./motion";

/** Rails only show when each side margin has room for a panel (see the breakpoint below). */
const WIDE = "(min-width: 1480px)";
// Centre a 11rem rail in the gutter left by the 64rem (max-w-5xl) content column.
const GUTTER_OFFSET = "calc((100vw - 64rem) / 4 - 5.5rem)";
// On short windows each rail drops its middle card so the column still fits.
const TALL_ONLY = "[@media(max-height:760px)]:hidden";

const vars = (v: Record<string, string | number>) => v as CSSProperties;

type Card = { id: string; Component: () => ReactNode; tallOnly?: boolean };
type CardSet = { left: Card[]; right: Card[] };

/**
 * Decorative "live system" cards in the empty side margins of wide screens. The set follows
 * the section being read: how the products are built (hero, projects, about, contact), the
 * measured impact (experience), and the stack underneath (skills). Hidden from assistive tech
 * and pointer events; reduced-motion visitors see still frames.
 */
export function SideRails() {
  const section = useActiveSection(true);
  const setId = section === "experience" ? "impact" : section === "skills" ? "stack" : "build";
  const set = SETS[setId];
  return (
    <div aria-hidden>
      <Rail side="left" setId={setId} cards={set.left} />
      <Rail side="right" setId={setId} cards={set.right} />
    </div>
  );
}

function Rail({ side, setId, cards }: { side: "left" | "right"; setId: string; cards: Card[] }) {
  return (
    <div
      className="pointer-events-none fixed top-24 bottom-8 z-10 hidden w-44 flex-col justify-center gap-5 min-[1480px]:flex"
      style={{ [side]: GUTTER_OFFSET }}
    >
      {cards.map(({ id, Component, tallOnly }, i) => (
        // Keyed by set, so switching sections remounts the cards and replays their entrance.
        <div
          key={`${setId}-${id}`}
          className={`enter ${tallOnly ? TALL_ONLY : ""}`}
          style={delay(i * 90 + (side === "right" ? 45 : 0))}
        >
          <Component />
        </div>
      ))}
    </div>
  );
}

/**
 * Steps 0..length-1 on an interval while the rails are visible; otherwise (server render,
 * narrow screens, reduced motion) stays at `idle`.
 */
function useLoop(length: number, ms: number, idle: number) {
  const [step, setStep] = useState(idle);
  useEffect(() => {
    // Re-evaluated when the window crosses the breakpoint or the motion preference changes, so
    // rails that appear after a resize start moving and hidden ones stop re-rendering.
    const wide = window.matchMedia(WIDE);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    let id: number | undefined;
    const sync = () => {
      window.clearInterval(id);
      if (!wide.matches || reduce.matches) {
        setStep(idle);
        return;
      }
      setStep(0);
      id = window.setInterval(() => setStep((s) => (s + 1) % length), ms);
    };
    sync();
    wide.addEventListener("change", sync);
    reduce.addEventListener("change", sync);
    return () => {
      window.clearInterval(id);
      wide.removeEventListener("change", sync);
      reduce.removeEventListener("change", sync);
    };
  }, [length, ms, idle]);
  return step;
}

function Panel({ label, meta, children }: { label: string; meta: string; children: ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-card/70 p-3 shadow-sm backdrop-blur-md">
      <div className="mb-2.5 flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
        <span>{label}</span>
        <span className="relative flex h-1.5 w-1.5">
          <span className="soft-ping absolute inset-0 rounded-full bg-primary" />
          <span className="relative h-1.5 w-1.5 rounded-full bg-primary" />
        </span>
      </div>
      {children}
      <p className="mt-2.5 border-t border-border pt-2 font-mono text-[10px] text-muted-foreground">
        {meta}
      </p>
    </div>
  );
}

/** Rounded node with a centred label, sized in SVG units. */
function GraphNode({
  cx,
  cy,
  w,
  h = 16,
  label,
  className,
}: {
  cx: number;
  cy: number;
  w: number;
  h?: number;
  label: string;
  className: string;
}) {
  return (
    <>
      <rect
        x={cx - w / 2}
        y={cy - h / 2}
        width={w}
        height={h}
        rx={h / 2}
        strokeWidth={1}
        className={className}
      />
      <text
        x={cx}
        y={cy}
        textAnchor="middle"
        dominantBaseline="central"
        className="fill-foreground text-[8px] font-medium"
      >
        {label}
      </text>
    </>
  );
}

/** Small label + bar used by several cards. */
function Legend({ items }: { items: { label: string; className: string }[] }) {
  return (
    <div className="mt-2 flex flex-wrap gap-x-2.5 gap-y-1 text-[10px] text-muted-foreground">
      {items.map((it) => (
        <span key={it.label} className="inline-flex items-center gap-1">
          <span className={`h-1.5 w-1.5 rounded-full ${it.className}`} />
          {it.label}
        </span>
      ))}
    </div>
  );
}

/** Lines of mono text that appear one after another, then clear (7s cycle). */
function TypedLines({
  lines,
  tone = "card",
}: {
  lines: { text: string; className?: string }[];
  tone?: "card" | "terminal";
}) {
  return (
    <div
      className={`rounded-lg px-2 py-1.5 font-mono text-[10px] leading-[1.6] ${tone === "terminal" ? "bg-[oklch(0.2_0.005_260)] text-[oklch(0.86_0_0)]" : "bg-secondary/70"}`}
    >
      {lines.map((l, i) => (
        <span
          key={i}
          className={`rail-token block whitespace-pre ${l.className ?? ""}`}
          style={delay(300 + i * 550)}
        >
          {l.text}
        </span>
      ))}
    </div>
  );
}

// ============================================================================================
// Set ①: how it's built — LangGraph agent → memory → streamed answer | RAG, voice, deploy.
// ============================================================================================

const LG_NODES = {
  start: { cx: 76, cy: 9, w: 40, h: 14, label: "START" },
  agent: { cx: 76, cy: 44, w: 52, h: 18, label: "agent" },
  retrieve: { cx: 28, cy: 76, w: 48, h: 18, label: "retrieve" },
  tools: { cx: 124, cy: 76, w: 44, h: 18, label: "tools" },
  end: { cx: 76, cy: 104, w: 36, h: 14, label: "END" },
};
type LgNode = keyof typeof LG_NODES;

const LG_EDGES = {
  "start-agent": "M76 16 L76 35",
  "agent-retrieve": "M62 53 L38 67",
  "agent-tools": "M90 53 L114 67",
  "agent-end": "M76 53 L76 97",
};
type LgEdge = keyof typeof LG_EDGES;

const LG_PATH: { node: LgNode; edge?: LgEdge }[] = [
  { node: "start" },
  { node: "agent", edge: "start-agent" },
  { node: "retrieve", edge: "agent-retrieve" },
  { node: "agent", edge: "agent-retrieve" },
  { node: "tools", edge: "agent-tools" },
  { node: "agent", edge: "agent-tools" },
  { node: "end", edge: "agent-end" },
];
const LG_HOLD = 2;

function LangGraphPanel() {
  // Past the last step it holds on END for LG_HOLD beats before looping.
  const step = useLoop(LG_PATH.length + LG_HOLD, 900, -1);
  const current = step >= 0 ? LG_PATH[Math.min(step, LG_PATH.length - 1)] : undefined;
  const visited = new Set(LG_PATH.slice(0, Math.max(step, 0)).map((p) => p.node));

  return (
    <Panel label="LangGraph · agent" meta="state → nodes → edges">
      <svg viewBox="0 0 152 112" className="block h-auto w-full">
        {(Object.keys(LG_EDGES) as LgEdge[]).map((key) => (
          <path
            key={key}
            d={LG_EDGES[key]}
            strokeWidth={current?.edge === key ? 1.6 : 1}
            className={`transition-colors duration-300 ${current?.edge === key ? "stroke-primary" : "stroke-border-strong"}`}
          />
        ))}
        {(Object.keys(LG_NODES) as LgNode[]).map((key) => (
          <GraphNode
            key={key}
            {...LG_NODES[key]}
            className={`transition-colors duration-300 ${
              current?.node === key
                ? "fill-primary/15 stroke-primary"
                : visited.has(key)
                  ? "fill-card stroke-primary/50"
                  : "fill-card stroke-border-strong"
            }`}
          />
        ))}
      </svg>
    </Panel>
  );
}

const MEM_CENTER = { cx: 76, cy: 52 };
const MEM_FACTS = [
  { cx: 34, cy: 14, w: 50, label: "Child · 4y", recall: true },
  { cx: 120, cy: 14, w: 46, label: "Gurugram", recall: true },
  { cx: 32, cy: 90, w: 46, label: "Loves art", recall: true },
  { cx: 120, cy: 90, w: 48, label: "Veg meals", recall: false },
];

function MemoryPanel() {
  return (
    <Panel label="Memory · graph" meta="write → recall → context">
      <svg viewBox="0 0 152 104" className="block h-auto w-full">
        {MEM_FACTS.map((f, i) => (
          <path
            key={`e-${f.label}`}
            d={`M${MEM_CENTER.cx} ${MEM_CENTER.cy} L${f.cx} ${f.cy}`}
            pathLength={1}
            strokeWidth={1}
            className={`rail-mem-edge ${f.recall ? "rail-mem-recall-edge" : "stroke-border-strong"}`}
            style={delay(300 + i * 450)}
          />
        ))}
        <GraphNode
          {...MEM_CENTER}
          w={46}
          h={18}
          label="Parent"
          className="fill-primary/15 stroke-primary"
        />
        {MEM_FACTS.map((f, i) => (
          <g key={f.label} className="rail-mem-node" style={delay(300 + i * 450)}>
            <GraphNode
              cx={f.cx}
              cy={f.cy}
              w={f.w}
              label={f.label}
              className={f.recall ? "rail-mem-recall" : "fill-card stroke-border-strong"}
            />
          </g>
        ))}
      </svg>
    </Panel>
  );
}

const TOKENS = [
  "For",
  " a",
  " 4-year-old",
  " who",
  " loves",
  " art:",
  " finger",
  " painting,",
  " a",
  " paper-plate",
  " craft,",
  " or",
  " blanket-fort",
  " stories.",
];

function LlmPanel() {
  return (
    <Panel label="LLM · streaming" meta="memory + prompt → tokens">
      <p className="text-[11px] text-muted-foreground">› Rainy day — ideas indoors?</p>
      <p className="mt-1.5 min-h-[6.5em] text-xs leading-relaxed">
        {TOKENS.map((t, i) => (
          <span key={i} className="rail-token" style={delay(300 + i * 240)}>
            {t}
          </span>
        ))}
        <span className="rail-caret" />
      </p>
    </Panel>
  );
}

const QUERY = { x: 82, y: 50 };
const NEIGHBOURS = [
  { x: 66, y: 36 },
  { x: 101, y: 40 },
  { x: 92, y: 69 },
];
const OTHERS = [
  [12, 18],
  [30, 70],
  [22, 44],
  [46, 18],
  [40, 84],
  [120, 16],
  [136, 40],
  [128, 78],
  [104, 90],
  [70, 10],
  [146, 62],
  [14, 86],
  [44, 60],
  [124, 58],
];

function RagPanel() {
  return (
    <Panel label="RAG · retrieval" meta="top-k = 3 · cosine">
      <svg viewBox="0 0 152 96" className="block h-auto w-full">
        {OTHERS.map(([x, y]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r={2.2} className="fill-muted-foreground/40" />
        ))}
        <circle
          cx={QUERY.x}
          cy={QUERY.y}
          r={34}
          className="rail-ring fill-primary/10 stroke-primary/40"
          strokeWidth={1}
        />
        {NEIGHBOURS.map((n, i) => (
          <path
            key={`l${i}`}
            d={`M${QUERY.x} ${QUERY.y} L${n.x} ${n.y}`}
            pathLength={1}
            className="rail-link stroke-violet"
            strokeWidth={1.2}
            style={delay(i * 140)}
          />
        ))}
        {NEIGHBOURS.map((n, i) => (
          <circle
            key={`n${i}`}
            cx={n.x}
            cy={n.y}
            r={3}
            className="rail-hit"
            style={delay(i * 140)}
          />
        ))}
        <circle cx={QUERY.x} cy={QUERY.y} r={4} className="fill-primary" />
      </svg>
    </Panel>
  );
}

const BAR_DELAYS = [
  0, 420, 180, 760, 300, 940, 120, 560, 840, 240, 660, 60, 480, 900, 360, 720, 150, 600, 1000, 270,
];

function VoicePanel() {
  return (
    <Panel label="Voice · live" meta="p50 500–600ms">
      <div className="flex h-10 items-center justify-between">
        {BAR_DELAYS.map((ms, i) => (
          <span
            key={i}
            className="rail-bar h-full w-[3px] rounded-full bg-linear-to-t from-primary to-violet"
            style={delay(ms)}
          />
        ))}
      </div>
      <div className="mt-3 flex justify-between text-[10px] font-medium text-muted-foreground">
        <span>STT</span>
        <span>LLM</span>
        <span>TTS</span>
      </div>
      <div className="relative mx-2 mt-1.5 h-px bg-border-strong">
        <span className="rail-travel absolute inset-y-0 left-0 w-full">
          <span className="absolute -left-1 -top-[3px] h-[7px] w-[7px] rounded-full bg-primary shadow-[0_0_0_3px] shadow-primary/20" />
        </span>
      </div>
    </Panel>
  );
}

const STAGES = ["Build", "Test", "Deploy", "Health check"];
const LIVE_HOLD = 3;

function DeployPanel() {
  // Idle (server render, reduced motion) shows the finished pipeline.
  const step = useLoop(STAGES.length + LIVE_HOLD, 1100, STAGES.length);
  const live = step >= STAGES.length;

  return (
    <Panel label="Deploy · pipeline" meta="Docker · ECS · CI/CD">
      <ol className="space-y-1.5 text-xs">
        {STAGES.map((stage, i) => {
          const status = i < step ? "done" : i === step ? "running" : "pending";
          return (
            <li key={stage} className="flex items-center gap-2">
              {status === "done" ? (
                <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Check className="h-2.5 w-2.5" strokeWidth={3} />
                </span>
              ) : status === "running" ? (
                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-primary border-t-transparent motion-reduce:animate-none" />
              ) : (
                <span className="h-3.5 w-3.5 rounded-full border border-border-strong" />
              )}
              <span className={status === "pending" ? "text-muted-foreground" : ""}>{stage}</span>
            </li>
          );
        })}
      </ol>
      <div
        className={`mt-2.5 inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-semibold transition-all duration-300 ${live ? "bg-cyan/15 text-foreground opacity-100" : "opacity-0"}`}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-cyan" /> Live
      </div>
    </Panel>
  );
}

// ============================================================================================
// Set ②: measured impact — every figure here comes from the experience bullets.
// ============================================================================================

function EvalPanel() {
  // Climbs from the 68% baseline to 86% over six beats, then holds.
  const step = useLoop(11, 380, 6);
  const value = Math.round(68 + (18 * Math.min(step, 6)) / 6);
  return (
    <Panel label="RAG · evaluation" meta="500 labeled queries">
      <div className="flex items-baseline justify-between">
        <span className="text-2xl font-semibold tabular-nums tracking-tight">{value}%</span>
        <span className="text-[10px] text-muted-foreground">retrieval precision</span>
      </div>
      <div className="relative mt-2 h-2 rounded-full bg-secondary">
        <div
          className="h-full rounded-full bg-linear-to-r from-primary to-violet transition-[width] duration-300 ease-out"
          style={{ width: `${value}%` }}
        />
        {/* Baseline marker */}
        <span
          className="absolute -top-1 bottom-[-4px] w-px bg-foreground/50"
          style={{ left: "68%" }}
        />
      </div>
      <div className="mt-1.5 flex justify-between text-[10px] text-muted-foreground">
        <span>after tuning</span>
        <span>68% baseline</span>
      </div>
    </Panel>
  );
}

function ToolCallPanel() {
  return (
    <Panel label="Agent · tool call" meta="agent → tool → result">
      <TypedLines
        lines={[
          { text: "→ weather({", className: "text-primary" },
          { text: '    city: "Gurugram"' },
          { text: "  })" },
          { text: "← { rain: true }", className: "text-violet" },
          { text: "→ suggest indoor play" },
        ]}
      />
    </Panel>
  );
}

const LATENCY = [
  { label: "STT", width: "28%", className: "bg-primary" },
  { label: "LLM", width: "46%", className: "bg-violet" },
  { label: "TTS", width: "26%", className: "bg-cyan" },
];

function LatencyPanel() {
  return (
    <Panel label="Voice · latency" meta="p50 500–600ms">
      <p className="text-[10px] text-muted-foreground">one spoken turn</p>
      <div className="mt-1.5 flex h-3 gap-0.5 overflow-hidden rounded-full">
        {LATENCY.map((s, i) => (
          <span key={s.label} className="h-full" style={{ width: s.width }}>
            <span
              className={`rail-grow block h-full ${s.className}`}
              style={delay(300 + i * 450)}
            />
          </span>
        ))}
      </div>
      <Legend items={LATENCY.map((s) => ({ label: s.label, className: s.className }))} />
    </Panel>
  );
}

// 50 sessions, lit in a scattered order.
const SESSION_DELAYS = Array.from({ length: 50 }, (_, i) => ((i * 37) % 50) * 55);

function ConcurrencyPanel() {
  return (
    <Panel label="Realtime · sessions" meta="50 concurrent sessions">
      <div className="grid grid-cols-10 gap-1.5">
        {SESSION_DELAYS.map((ms, i) => (
          <span key={i} className="rail-dot aspect-square rounded-full" style={delay(ms)} />
        ))}
      </div>
      <p className="mt-2 text-[10px] text-muted-foreground">LiveKit · WebRTC rooms</p>
    </Panel>
  );
}

function Chip({ icon: Icon, label }: { icon: LucideIcon; label: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-md border border-border bg-card px-1.5 py-1 text-[10px] font-medium">
      <Icon className="h-3 w-3 text-primary" />
      {label}
    </span>
  );
}

function CrmSyncPanel() {
  return (
    <Panel label="CRM · sync" meta="−40% manual tutor triage">
      <div className="flex items-center gap-1.5">
        <Chip icon={MessagesSquare} label="Call" />
        <div className="relative h-px flex-1 bg-border-strong">
          <span className="rail-travel absolute inset-y-0 left-0 w-full">
            <span className="absolute -left-1 -top-[3px] h-[7px] w-[7px] rounded-full bg-primary" />
          </span>
        </div>
        <Chip icon={Database} label="HubSpot" />
      </div>
      <div className="mt-2.5 space-y-1.5 rounded-lg bg-secondary/70 p-2">
        {[
          { label: "intent", width: "70%" },
          { label: "course", width: "55%" },
          { label: "follow-up", width: "80%" },
        ].map((f, i) => (
          <div key={f.label} className="flex items-center gap-2 text-[10px] text-muted-foreground">
            <span className="w-12 shrink-0">{f.label}</span>
            <span className="h-1.5 flex-1">
              <span
                className="rail-grow block h-full rounded-full bg-primary/50"
                style={{ ...delay(900 + i * 350), width: f.width }}
              />
            </span>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function ReleaseTimePanel() {
  return (
    <Panel label="Release · time" meta="Docker · AWS · CI/CD">
      <div className="space-y-2 text-[10px]">
        <div>
          <div className="mb-1 flex justify-between text-muted-foreground">
            <span>before</span>
            <span>45 min</span>
          </div>
          <div className="h-2 rounded-full bg-border-strong" />
        </div>
        <div>
          <div className="mb-1 flex justify-between">
            <span className="text-muted-foreground">after</span>
            <span className="font-semibold">10 min</span>
          </div>
          <div className="h-2 rounded-full bg-secondary">
            <div
              className="rail-shrink h-full rounded-full bg-linear-to-r from-primary to-violet"
              style={vars({ "--to": 10 / 45 })}
            />
          </div>
        </div>
      </div>
    </Panel>
  );
}

// ============================================================================================
// Set ③: the stack underneath — ingestion, search, context, tracing, CI, scaling.
// ============================================================================================

function ChunkingPanel() {
  return (
    <Panel label="Ingest · chunking" meta="document → chunks → vectors">
      <div className="flex items-center gap-2">
        <div className="w-12 shrink-0 space-y-1 rounded-md border border-border bg-card p-1.5">
          <FileText className="mb-1 h-3 w-3 text-muted-foreground" />
          {[90, 70, 85, 60, 80, 50].map((w, i) => (
            <span
              key={i}
              className={`block h-1 rounded-full ${i % 2 ? "bg-border-strong" : "bg-primary/40"}`}
              style={{ width: `${w}%` }}
            />
          ))}
        </div>
        <div className="relative h-10 flex-1">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="rail-chunk absolute left-0 h-2.5 w-5 rounded-sm bg-primary/60"
              style={{ ...vars({ "--dist": "56px" }), ...delay(i * 1200), top: `${8 + i * 9}px` }}
            />
          ))}
        </div>
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/20">
          <Database className="h-4 w-4" />
        </div>
      </div>
    </Panel>
  );
}

const RANKINGS = {
  dense: [
    { id: "doc-12", score: 0.82 },
    { id: "doc-07", score: 0.79 },
    { id: "doc-44", score: 0.61 },
  ],
  hybrid: [
    { id: "doc-07", score: 0.91 },
    { id: "doc-12", score: 0.84 },
    { id: "doc-44", score: 0.58 },
  ],
};

function HybridSearchPanel() {
  const step = useLoop(2, 2200, 1);
  const mode = step === 0 ? "dense" : "hybrid";
  const order = RANKINGS[mode];
  return (
    <Panel label="Search · hybrid" meta="dense + BM25 → rerank">
      <div className="mb-2 flex gap-1 text-[10px] font-medium">
        <span
          className={`rounded px-1.5 py-0.5 transition-colors ${mode === "dense" ? "bg-primary/15 text-primary" : "text-muted-foreground"}`}
        >
          dense
        </span>
        <span
          className={`rounded px-1.5 py-0.5 transition-colors ${mode === "hybrid" ? "bg-primary/15 text-primary" : "text-muted-foreground"}`}
        >
          dense + BM25
        </span>
      </div>
      <div className="relative h-[60px]">
        {RANKINGS.dense.map(({ id }) => {
          const rank = order.findIndex((r) => r.id === id);
          const score = order[rank]?.score ?? 0;
          return (
            <div
              key={id}
              className="absolute inset-x-0 flex items-center gap-2 font-mono text-[10px] transition-[top] duration-500 ease-out"
              style={{ top: rank * 20 }}
            >
              <span className="w-3 text-muted-foreground">{rank + 1}</span>
              <span className="w-11">{id}</span>
              <span className="h-1.5 flex-1 rounded-full bg-secondary">
                <span
                  className="block h-full rounded-full bg-primary/70 transition-[width] duration-500"
                  style={{ width: `${score * 100}%` }}
                />
              </span>
            </div>
          );
        })}
      </div>
    </Panel>
  );
}

const CONTEXT = [
  { label: "system", width: "12%", className: "bg-muted-foreground/50" },
  { label: "memory", width: "18%", className: "bg-violet" },
  { label: "docs", width: "42%", className: "bg-primary" },
  { label: "question", width: "9%", className: "bg-cyan" },
];

function ContextWindowPanel() {
  return (
    <Panel label="LLM · context" meta="token budget">
      <div className="flex h-3 gap-0.5 overflow-hidden rounded-full bg-secondary">
        {CONTEXT.map((s, i) => (
          <span key={s.label} className="h-full" style={{ width: s.width }}>
            <span
              className={`rail-grow block h-full ${s.className}`}
              style={delay(300 + i * 400)}
            />
          </span>
        ))}
      </div>
      <Legend
        items={[
          ...CONTEXT.map((s) => ({ label: s.label, className: s.className })),
          { label: "free", className: "bg-secondary ring-1 ring-border-strong" },
        ]}
      />
    </Panel>
  );
}

const SPANS = [
  { label: "agent.run", left: 0, width: 100, depth: 0 },
  { label: "retrieve", left: 6, width: 26, depth: 1 },
  { label: "tool.weather", left: 34, width: 18, depth: 1 },
  { label: "llm.generate", left: 54, width: 44, depth: 1 },
];

function TracePanel() {
  return (
    <Panel label="Agent · trace" meta="spans · timings">
      <div className="space-y-1.5">
        {SPANS.map((s, i) => (
          <div key={s.label} className="flex items-center gap-1.5 font-mono text-[9.5px]">
            <span className="w-[4.5rem] shrink-0 truncate" style={{ paddingLeft: s.depth * 6 }}>
              {s.label}
            </span>
            <span className="relative h-2 flex-1 rounded-sm bg-secondary">
              <span
                className="absolute inset-y-0"
                style={{ left: `${s.left}%`, width: `${s.width}%` }}
              >
                <span
                  className={`rail-grow block h-full rounded-sm ${i === 0 ? "bg-primary/40" : i === 3 ? "bg-violet" : "bg-primary"}`}
                  style={delay(200 + i * 450)}
                />
              </span>
            </span>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function CiLogPanel() {
  return (
    <Panel label="CI · log" meta="build → push → deploy">
      <TypedLines
        tone="terminal"
        lines={[
          { text: "$ docker build -t app ." },
          { text: "✓ image built", className: "text-[oklch(0.8_0.12_215)]" },
          { text: "$ docker push app:latest" },
          { text: "$ aws ecs update-service" },
          { text: "✓ service stable", className: "text-[oklch(0.8_0.12_215)]" },
        ]}
      />
    </Panel>
  );
}

const LOAD = [20, 35, 60, 82, 90, 72, 45, 25];

function AutoscalePanel() {
  const step = useLoop(LOAD.length, 1000, 4);
  const load = LOAD[step] ?? 20;
  const tasks = load > 75 ? 3 : load > 50 ? 2 : 1;
  return (
    <Panel label="ECS · autoscaling" meta="tasks follow load">
      <div className="flex items-center justify-between text-[10px] text-muted-foreground">
        <span>load</span>
        <span className="tabular-nums">{load}%</span>
      </div>
      <div className="mt-1 h-1.5 rounded-full bg-secondary">
        <div
          className={`h-full rounded-full transition-[width,background-color] duration-700 ${load > 75 ? "bg-violet" : "bg-primary"}`}
          style={{ width: `${load}%` }}
        />
      </div>
      <div className="mt-2.5 flex items-center gap-1.5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className={`flex h-7 w-7 items-center justify-center rounded-md border transition-all duration-500 ${i < tasks ? "scale-100 border-primary/40 bg-primary/10 text-primary opacity-100" : "scale-90 border-dashed border-border-strong text-muted-foreground opacity-50"}`}
          >
            <Box className="h-3.5 w-3.5" />
          </span>
        ))}
        <span className="ml-auto text-[10px] text-muted-foreground">
          {tasks} task{tasks > 1 ? "s" : ""}
        </span>
      </div>
    </Panel>
  );
}

const SETS: Record<"build" | "impact" | "stack", CardSet> = {
  build: {
    left: [
      { id: "langgraph", Component: LangGraphPanel },
      { id: "memory", Component: MemoryPanel, tallOnly: true },
      { id: "llm", Component: LlmPanel },
    ],
    right: [
      { id: "rag", Component: RagPanel },
      { id: "voice", Component: VoicePanel, tallOnly: true },
      { id: "deploy", Component: DeployPanel },
    ],
  },
  impact: {
    left: [
      { id: "eval", Component: EvalPanel },
      { id: "tool", Component: ToolCallPanel, tallOnly: true },
      { id: "latency", Component: LatencyPanel },
    ],
    right: [
      { id: "sessions", Component: ConcurrencyPanel },
      { id: "crm", Component: CrmSyncPanel, tallOnly: true },
      { id: "release", Component: ReleaseTimePanel },
    ],
  },
  stack: {
    left: [
      { id: "chunking", Component: ChunkingPanel },
      { id: "hybrid", Component: HybridSearchPanel, tallOnly: true },
      { id: "context", Component: ContextWindowPanel },
    ],
    right: [
      { id: "trace", Component: TracePanel },
      { id: "ci", Component: CiLogPanel, tallOnly: true },
      { id: "autoscale", Component: AutoscalePanel },
    ],
  },
};
