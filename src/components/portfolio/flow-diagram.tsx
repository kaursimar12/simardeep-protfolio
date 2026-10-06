import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import {
  AudioLines,
  Binary,
  Brain,
  ChartColumn,
  CloudSun,
  Contact,
  Cpu,
  Database,
  FileText,
  MapPin,
  Merge,
  MessagesSquare,
  Mic,
  Pause,
  Play,
  Radio,
  RotateCcw,
  ScanText,
  Search,
  Sparkles,
  User,
  Volume2,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

const ICONS = {
  user: User,
  doc: FileText,
  db: Database,
  vector: Binary,
  agent: Workflow,
  ai: Sparkles,
  brain: Brain,
  map: MapPin,
  weather: CloudSun,
  mic: Mic,
  speaker: Volume2,
  wave: AudioLines,
  network: Radio,
  crm: Contact,
  search: Search,
  merge: Merge,
  chart: ChartColumn,
  chat: MessagesSquare,
  scan: ScanText,
  cpu: Cpu,
} satisfies Record<string, LucideIcon>;

type Side = "t" | "r" | "b" | "l";

export type FlowNode = {
  id: string;
  label: string;
  sub?: string;
  icon: keyof typeof ICONS;
  /** Centre of the node in viewBox units. */
  cx: number;
  cy: number;
  w?: number;
  h?: number;
};

export type FlowGroup = { label: string; x: number; y: number; w: number; h: number };

export type FlowEdge = {
  from: string;
  to: string;
  /** Override which side the edge leaves / enters, and where along it (0–1). */
  out?: Side;
  in?: Side;
  outAt?: number;
  inAt?: number;
  /** Short caption drawn above the edge's midpoint. */
  label?: string;
};

export type FlowStep = { caption: string; edges: FlowEdge[] };

export type FlowSpec = {
  width: number;
  height: number;
  groups?: FlowGroup[];
  nodes: FlowNode[];
  steps: FlowStep[];
};

const NODE_H = 52;
const TRAVEL_MS = 900;
const STEP_MS = 1700;
const HOLD_MS = 2400;
const REVEAL_STAGGER_MS = 70;

type Box = { x: number; y: number; w: number; h: number };
type Point = { x: number; y: number };
type Curve = [Point, Point, Point, Point];

function nodeBox(n: FlowNode): Box {
  // Inter at 13px / 11px averages ~7px / ~6px per character; 48px covers icon + padding.
  const w = n.w ?? Math.round(Math.max(n.label.length * 7, (n.sub?.length ?? 0) * 6) + 52);
  const h = n.h ?? NODE_H;
  return { x: n.cx - w / 2, y: n.cy - h / 2, w, h };
}

function autoSides(a: Box, b: Box): [Side, Side] {
  if (b.y >= a.y + a.h + 4) return ["b", "t"];
  if (b.y + b.h <= a.y - 4) return ["t", "b"];
  return b.x > a.x ? ["r", "l"] : ["l", "r"];
}

function port(b: Box, side: Side, at = 0.5): [Point, Point] {
  switch (side) {
    case "t":
      return [
        { x: b.x + b.w * at, y: b.y },
        { x: 0, y: -1 },
      ];
    case "b":
      return [
        { x: b.x + b.w * at, y: b.y + b.h },
        { x: 0, y: 1 },
      ];
    case "l":
      return [
        { x: b.x, y: b.y + b.h * at },
        { x: -1, y: 0 },
      ];
    case "r":
      return [
        { x: b.x + b.w, y: b.y + b.h * at },
        { x: 1, y: 0 },
      ];
  }
}

function edgeCurve(e: FlowEdge, boxes: Map<string, Box>): Curve {
  const a = boxes.get(e.from);
  const b = boxes.get(e.to);
  if (!a || !b) throw new Error(`Flow edge references unknown node: ${e.from} → ${e.to}`);
  const [autoOut, autoIn] = autoSides(a, b);
  const [p0, n0] = port(a, e.out ?? autoOut, e.outAt);
  const [p3, n3] = port(b, e.in ?? autoIn, e.inAt);
  const k = Math.min(90, Math.max(18, Math.hypot(p3.x - p0.x, p3.y - p0.y) * 0.42));
  return [
    p0,
    { x: p0.x + n0.x * k, y: p0.y + n0.y * k },
    { x: p3.x + n3.x * k, y: p3.y + n3.y * k },
    p3,
  ];
}

function pointOn([p0, p1, p2, p3]: Curve, t: number): Point {
  const u = 1 - t;
  const a = u * u * u;
  const b = 3 * u * u * t;
  const c = 3 * u * t * t;
  const d = t * t * t;
  return {
    x: a * p0.x + b * p1.x + c * p2.x + d * p3.x,
    y: a * p0.y + b * p1.y + c * p2.y + d * p3.y,
  };
}

const f = (n: number) => Math.round(n * 10) / 10;
const curvePath = ([p0, p1, p2, p3]: Curve) =>
  `M${f(p0.x)},${f(p0.y)} C${f(p1.x)},${f(p1.y)} ${f(p2.x)},${f(p2.y)} ${f(p3.x)},${f(p3.y)}`;
const edgeKey = (e: FlowEdge) => `${e.from}>${e.to}`;
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

type Status = "idle" | "visited" | "active";

/** "A → B → C · D → E, F": the hops a step makes, grouped by source and chained where they connect. */
function stepRoute(step: FlowStep, labels: Map<string, string>) {
  const bySource = new Map<string, string[]>();
  for (const e of step.edges) bySource.set(e.from, [...(bySource.get(e.from) ?? []), e.to]);
  const chains: string[][][] = [];
  for (const [from, targets] of bySource) {
    const chain = chains.at(-1);
    const tail = chain?.at(-1);
    if (chain && tail?.length === 1 && tail[0] === from) chain.push(targets);
    else chains.push([[from], targets]);
  }
  const name = (id: string) => labels.get(id) ?? id;
  return chains
    .map((chain) => chain.map((ids) => ids.map(name).join(", ")).join(" → "))
    .join(" · ");
}

/**
 * Animated architecture diagram. Once scrolled into view the nodes and edges
 * draw in, then each step sends packets along its edges and lights the nodes
 * they reach, end to end, on a loop. Server-rendered as a complete static
 * diagram; reduced-motion visitors get no motion and step through manually.
 */
export function FlowDiagram({ spec }: { spec: FlowSpec }) {
  const ref = useRef<HTMLDivElement>(null);
  const packetRefs = useRef<(SVGGElement | null)[]>([]);
  const [revealed, setRevealed] = useState(false);
  const [inView, setInView] = useState(false);
  const [playing, setPlaying] = useState(true);
  const [motion, setMotion] = useState(true);
  // -1 = not started, 0..n-1 = step, n = complete (everything lit).
  const [active, setActive] = useState(-1);
  const total = spec.steps.length;
  const markerId = `flow-arrow-${spec.nodes[0]?.id ?? "x"}`;

  const geometry = useMemo(() => {
    const boxes = new Map(spec.nodes.map((n) => [n.id, nodeBox(n)]));
    const edges = new Map<string, { edge: FlowEdge; curve: Curve; firstStep: number }>();
    const nodeFirstStep = new Map<string, number>();
    spec.steps.forEach((step, i) => {
      for (const e of step.edges) {
        if (!edges.has(edgeKey(e)))
          edges.set(edgeKey(e), { edge: e, curve: edgeCurve(e, boxes), firstStep: i });
        for (const id of [e.from, e.to]) if (!nodeFirstStep.has(id)) nodeFirstStep.set(id, i);
      }
    });
    return { boxes, edges, nodeFirstStep };
  }, [spec]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setMotion(false);
      setPlaying(false);
      // No observer here, so treat it as in view; otherwise Play/Replay could never advance.
      setInView(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        setInView(entry.isIntersecting);
        if (entry.isIntersecting) setRevealed(true);
      },
      { threshold: 0.35 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Advance through the steps while playing and visible.
  useEffect(() => {
    if (!playing || !inView) return;
    const delay =
      active === -1 ? total * REVEAL_STAGGER_MS + 700 : active >= total ? HOLD_MS : STEP_MS;
    const id = window.setTimeout(() => setActive((a) => (a >= total ? 0 : a + 1)), delay);
    return () => window.clearTimeout(id);
  }, [playing, inView, active, total]);

  const step = active >= 0 && active < total ? spec.steps[active] : undefined;
  const labels = useMemo(() => new Map(spec.nodes.map((n) => [n.id, n.label])), [spec]);

  // Move this step's packets along their edges.
  useEffect(() => {
    if (!step || !motion) return;
    const curves = step.edges.map((e) => geometry.edges.get(edgeKey(e))?.curve);
    const start = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / TRAVEL_MS);
      curves.forEach((curve, i) => {
        const g = packetRefs.current[i];
        if (!g || !curve) return;
        const p = pointOn(curve, ease(t));
        g.setAttribute("transform", `translate(${f(p.x)} ${f(p.y)})`);
        g.style.opacity = t >= 1 ? "0" : "1";
      });
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [step, motion, geometry]);

  const { edgeStatus, nodeStatus, arriving } = useMemo(() => {
    const edgeStatus = new Map<string, Status>();
    const nodeStatus = new Map<string, Status>();
    const arriving = new Set<string>();
    const upTo = Math.min(active, total);
    for (let i = 0; i < upTo; i++) {
      for (const e of spec.steps[i]?.edges ?? []) {
        edgeStatus.set(edgeKey(e), "visited");
        nodeStatus.set(e.from, "visited");
        nodeStatus.set(e.to, "visited");
      }
    }
    for (const e of step?.edges ?? []) {
      edgeStatus.set(edgeKey(e), "active");
      nodeStatus.set(e.from, "active");
      if (nodeStatus.get(e.to) !== "active") arriving.add(e.to);
      nodeStatus.set(e.to, "active");
    }
    return { edgeStatus, nodeStatus, arriving };
  }, [active, step, spec, total]);

  const reveal = (order: number, extra = 0): CSSProperties | undefined =>
    revealed ? { animationDelay: `${order * REVEAL_STAGGER_MS + extra}ms` } : undefined;

  const goTo = (i: number) => {
    setPlaying(false);
    setActive(i);
  };

  return (
    <div ref={ref}>
      {/* Too dense to read at phone width; there the step list below carries the flow. */}
      <div className="-mx-1 hidden overflow-x-auto px-1 pb-2 sm:block">
        <svg
          viewBox={`0 0 ${spec.width} ${spec.height}`}
          role="img"
          aria-label="End-to-end system flow diagram. Steps are listed below."
          className="block h-auto w-full min-w-[680px] select-none"
        >
          <defs>
            {(["idle", "visited", "active"] as const).map((s) => (
              <marker
                key={s}
                id={`${markerId}-${s}`}
                viewBox="0 0 10 10"
                refX="9"
                refY="5"
                markerWidth="7"
                markerHeight="7"
                orient="auto-start-reverse"
              >
                <path
                  d="M1,1.5 L9,5 L1,8.5 Z"
                  className={cn(
                    "transition-colors duration-300",
                    s === "idle"
                      ? "fill-muted-foreground/50"
                      : s === "visited"
                        ? "fill-primary/50"
                        : "fill-primary",
                  )}
                />
              </marker>
            ))}
          </defs>

          {spec.groups?.map((g) => (
            <g key={g.label} className={cn(revealed && "flow-fade-in")}>
              <rect
                x={g.x}
                y={g.y}
                width={g.w}
                height={g.h}
                rx={12}
                className="fill-secondary/40 stroke-border-strong"
                strokeDasharray="4 4"
              />
              <text
                x={g.x + 14}
                y={g.y + 18}
                className="fill-muted-foreground text-[10.5px] font-semibold uppercase tracking-[0.08em]"
              >
                {g.label}
              </text>
            </g>
          ))}

          {[...geometry.edges.entries()].map(([key, { curve, firstStep }]) => {
            const s = edgeStatus.get(key) ?? "idle";
            return (
              <path
                key={key}
                d={curvePath(curve)}
                pathLength={1}
                fill="none"
                markerEnd={`url(#${markerId}-${s})`}
                strokeWidth={s === "active" ? 2 : 1.4}
                className={cn(
                  "transition-[stroke,stroke-width] duration-300",
                  s === "idle"
                    ? "stroke-muted-foreground/40"
                    : s === "visited"
                      ? "stroke-primary/45"
                      : "stroke-primary",
                  revealed && "flow-draw",
                )}
                style={reveal(firstStep, 150)}
              />
            );
          })}

          {[...geometry.edges.entries()].map(([key, { edge, curve, firstStep }]) => {
            if (!edge.label) return null;
            const mid = pointOn(curve, 0.5);
            return (
              <text
                key={`${key}-label`}
                x={f(mid.x)}
                y={f(mid.y - 8)}
                textAnchor="middle"
                className={cn("fill-muted-foreground text-[10.5px]", revealed && "flow-fade-in")}
                style={reveal(firstStep, 300)}
              >
                {edge.label}
              </text>
            );
          })}

          {motion &&
            step?.edges.map((e, i) => {
              const curve = geometry.edges.get(edgeKey(e))?.curve;
              if (!curve) return null;
              return (
                <g
                  key={`${active}-${edgeKey(e)}`}
                  ref={(el) => {
                    packetRefs.current[i] = el;
                  }}
                  transform={`translate(${f(curve[0].x)} ${f(curve[0].y)})`}
                  className="pointer-events-none"
                >
                  <circle r={9} className="fill-primary/20" />
                  <circle r={4.5} className="fill-primary" />
                </g>
              );
            })}

          {spec.nodes.map((n) => {
            const b = geometry.boxes.get(n.id)!;
            const s = nodeStatus.get(n.id) ?? "idle";
            const Icon = ICONS[n.icon];
            const midY = b.y + b.h / 2;
            const delay =
              arriving.has(n.id) && motion
                ? { transitionDelay: `${TRAVEL_MS * 0.85}ms` }
                : undefined;
            return (
              <g
                key={n.id}
                className={cn(revealed && "flow-pop-in")}
                style={{
                  ...reveal(geometry.nodeFirstStep.get(n.id) ?? 0),
                  transformOrigin: `${n.cx}px ${n.cy}px`,
                  transformBox: "view-box",
                }}
              >
                <rect
                  x={b.x - 4}
                  y={b.y - 4}
                  width={b.w + 8}
                  height={b.h + 8}
                  rx={14}
                  className={cn(
                    "fill-none stroke-primary/25 transition-opacity duration-300",
                    s === "active" ? "opacity-100" : "opacity-0",
                  )}
                  strokeWidth={4}
                  style={delay}
                />
                <rect x={b.x} y={b.y} width={b.w} height={b.h} rx={10} className="fill-card" />
                <rect
                  x={b.x}
                  y={b.y}
                  width={b.w}
                  height={b.h}
                  rx={10}
                  strokeWidth={s === "active" ? 1.6 : 1.2}
                  className={cn(
                    "transition-[fill,stroke] duration-300",
                    s === "active"
                      ? "fill-primary/10 stroke-primary"
                      : s === "visited"
                        ? "fill-primary/[0.04] stroke-primary/50"
                        : "fill-transparent stroke-border-strong",
                  )}
                  style={delay}
                />
                <Icon
                  x={b.x + 14}
                  y={midY - 8}
                  width={16}
                  height={16}
                  strokeWidth={1.8}
                  className={cn(
                    "transition-colors duration-300",
                    s === "idle" ? "text-muted-foreground" : "text-primary",
                  )}
                  style={delay}
                />
                <text
                  x={b.x + 40}
                  y={n.sub ? midY - 3 : midY + 4.5}
                  className="fill-foreground text-[13px] font-medium"
                >
                  {n.label}
                </text>
                {n.sub && (
                  <text x={b.x + 40} y={midY + 13} className="fill-muted-foreground text-[11px]">
                    {n.sub}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>
      <div className="flex items-center gap-2 sm:mt-6">
        <button
          type="button"
          onClick={() => {
            if (!playing && active >= total) setActive(0);
            setPlaying((p) => !p);
          }}
          className="inline-flex h-8 items-center gap-1.5 rounded-md border border-border-strong px-3 text-xs font-medium transition-colors hover:bg-secondary"
        >
          {playing ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
          {playing ? "Pause" : "Play"}
        </button>
        <button
          type="button"
          onClick={() => {
            setActive(-1);
            setPlaying(true);
          }}
          className="inline-flex h-8 items-center gap-1.5 rounded-md px-3 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <RotateCcw className="h-3.5 w-3.5" /> Replay
        </button>
        <span className="ml-auto text-xs tabular-nums text-muted-foreground" aria-live="off">
          {step ? `Step ${active + 1} of ${total}` : active >= total ? "Complete" : ""}
        </span>
      </div>

      <ol className="mt-4 space-y-1">
        {spec.steps.map((s, i) => {
          const isActive = i === active;
          const done = i < active;
          return (
            <li key={s.caption}>
              <button
                type="button"
                onClick={() => goTo(i)}
                aria-current={isActive ? "step" : undefined}
                className={cn(
                  "flex w-full gap-3 rounded-md px-3 py-2 text-left text-sm leading-relaxed transition-colors",
                  isActive
                    ? "bg-primary/10 text-foreground"
                    : "text-muted-foreground hover:bg-secondary",
                )}
              >
                <span
                  className={cn(
                    "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[11px] font-semibold tabular-nums transition-colors",
                    isActive
                      ? "border-primary bg-primary text-primary-foreground"
                      : done
                        ? "border-primary/50 text-primary"
                        : "border-border-strong",
                  )}
                >
                  {i + 1}
                </span>
                <span>
                  {s.caption}
                  <span className="mt-1 block text-xs text-muted-foreground sm:hidden">
                    {stepRoute(s, labels)}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
