import type { Visual } from "./data";

export function ProjectVisual({ type }: { type: Visual }) {
  return (
    <div aria-hidden className="relative h-full w-full overflow-hidden rounded-xl border border-border bg-secondary/40">
      <div className="absolute inset-0 bg-grid opacity-60" />
      <div className="absolute -inset-10 bg-glow animate-drift transition-transform duration-700 group-hover:scale-110" />
      <div className="absolute inset-0 flex items-center justify-center">
        {type === "graph" && <Graph />}
        {type === "wave" && <Wave />}
        {type === "signal" && <Signal />}
        {type === "search" && <Search />}
      </div>
    </div>
  );
}

function Graph() {
  const nodes: [number, number][] = [[50, 50], [20, 25], [80, 22], [15, 72], [85, 75], [50, 15], [50, 88], [32, 48], [68, 52]];
  return (
    <svg viewBox="0 0 100 100" className="h-4/5 w-4/5 transition-transform duration-700 group-hover:rotate-6">
      {nodes.slice(1).map(([x, y], i) => <line key={i} x1={50} y1={50} x2={x} y2={y} className="stroke-primary/50" strokeWidth={0.4} />)}
      <line x1={20} y1={25} x2={32} y2={48} className="stroke-border-strong" strokeWidth={0.3} />
      <line x1={80} y1={22} x2={68} y2={52} className="stroke-border-strong" strokeWidth={0.3} />
      {nodes.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={i === 0 ? 4 : 2} className={i === 0 ? "fill-primary" : "fill-foreground/80"} />)}
      {([[20, 25], [80, 22], [85, 75]] as [number, number][]).map(([x, y], i) => <rect key={i} x={x - 5} y={y + 4} width={10} height={6} rx={1} className="fill-none stroke-muted-foreground" strokeWidth={0.3} />)}
    </svg>
  );
}

function Wave() {
  return (
    <div className="flex h-1/2 items-center gap-1.5">
      {Array.from({ length: 28 }).map((_, i) => (
        <span key={i} className="block w-1 rounded-full bg-accent-gradient animate-wave" style={{ height: `${30 + Math.abs(Math.sin(i * 0.7)) * 70}%`, animationDelay: `${i * 60}ms` }} />
      ))}
    </div>
  );
}

function Signal() {
  return (
    <svg viewBox="0 0 200 100" className="w-5/6">
      {[0, 1, 2].map((k) => (
        <path key={k} d={`M0 50 ${Array.from({ length: 20 }, (_, i) => `Q ${i * 10 + 5} ${50 + (i % 2 ? -1 : 1) * (10 + k * 10) * Math.sin(i / 3)} ${i * 10 + 10} 50`).join(" ")}`}
          className={k === 0 ? "stroke-primary" : "stroke-muted-foreground/40"} strokeWidth={k === 0 ? 1.4 : 0.6} fill="none" />
      ))}
      <circle cx="20" cy="50" r="4" className="fill-primary animate-pulse-dot" />
      <circle cx="180" cy="50" r="4" className="fill-primary-glow animate-pulse-dot" />
    </svg>
  );
}

function Search() {
  return (
    <div className="grid w-4/5 grid-cols-2 gap-4 font-mono text-[10px] text-muted-foreground">
      <div className="space-y-1.5">
        <p className="eyebrow mb-2">dense</p>
        {[0.92, 0.81, 0.74, 0.6].map((v) => (
          <div key={v} className="flex items-center gap-2"><span className="h-1.5 rounded-full bg-primary transition-all duration-700 group-hover:opacity-100" style={{ width: `${v * 100}%` }} /><span>{v}</span></div>
        ))}
      </div>
      <div className="space-y-1.5">
        <p className="eyebrow mb-2">bm25</p>
        {[0.7, 0.88, 0.52, 0.45].map((v) => (
          <div key={v} className="flex items-center gap-2"><span className="h-1.5 rounded-full bg-foreground/60" style={{ width: `${v * 100}%` }} /><span>{v}</span></div>
        ))}
      </div>
    </div>
  );
}
