import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowDown, ArrowUpRight, Github, Linkedin, Mail, MapPin, Menu, Phone, Plus, X } from "lucide-react";
import { approach, experience, links, metrics, nav, projects, skills } from "@/components/portfolio/data";
import { CountUp, CustomCursor, Magnetic, NodeField, Reveal, useReveal } from "@/components/portfolio/effects";
import { ProjectVisual } from "@/components/portfolio/visuals";

const TITLE = "Simardeep Kaur — AI Full-Stack Engineer";
const DESC = "Portfolio of Simardeep Kaur, an AI Full-Stack Engineer building agentic RAG systems, voice AI assistants, real-time applications, and scalable full-stack products.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: "Simardeep Kaur — AI Full-Stack Engineer" },
      { property: "og:description", content: "Building intelligent, real-time products with AI and modern full-stack technologies." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  useReveal();
  return (
    <>
      <CustomCursor />
      <Navbar />
      <main>
        <Hero />
        <About />
        <Experience />
        <Projects />
        <TechStack />
        <Approach />
        <Education />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

function SectionHead({ index, eyebrow, title }: { index: string; eyebrow: string; title: string }) {
  return (
    <Reveal className="mb-14 md:mb-20">
      <p className="eyebrow mb-5"><span className="text-primary">{index}</span> / {eyebrow}</p>
      <h2 className="max-w-4xl font-display text-4xl font-bold leading-[1.02] tracking-tight sm:text-5xl md:text-7xl">{title}</h2>
    </Reveal>
  );
}

const btnPrimary = "inline-flex min-h-12 items-center gap-2 rounded-full bg-foreground px-6 text-sm font-semibold text-background transition-all hover:shadow-glow hover:bg-primary hover:text-primary-foreground";
const btnGhost = "inline-flex min-h-12 items-center gap-2 rounded-full border border-border-strong px-6 text-sm font-semibold text-foreground transition-colors hover:border-primary hover:text-primary";

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("home");
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll(); window.addEventListener("scroll", onScroll, { passive: true });
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && setActive(e.target.id)), { rootMargin: "-45% 0px -50% 0px" });
    nav.forEach((n) => { const el = document.getElementById(n.id); if (el) io.observe(el); });
    return () => { window.removeEventListener("scroll", onScroll); io.disconnect(); };
  }, []);
  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${scrolled || open ? "border-b border-border bg-background/75 backdrop-blur-xl" : "border-b border-transparent"}`}>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:h-20 md:px-8">
        <a href="#home" className="font-display text-lg font-bold tracking-[0.18em]">SIMARDEEP<span className="text-primary">.</span></a>
        <nav aria-label="Primary" className="hidden items-center gap-1 rounded-full border border-border bg-secondary/40 p-1 lg:flex">
          {nav.map((n) => (
            <a key={n.id} href={`#${n.id}`} aria-current={active === n.id ? "true" : undefined}
              className={`rounded-full px-4 py-2 text-sm transition-colors ${active === n.id ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"}`}>{n.label}</a>
          ))}
        </nav>
        <div className="hidden lg:block"><Magnetic><a href="#contact" className={btnPrimary}>Let's Talk <ArrowUpRight className="h-4 w-4" /></a></Magnetic></div>
        <button className="flex h-11 w-11 items-center justify-center rounded-full border border-border lg:hidden" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} onClick={() => setOpen(!open)}>
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      <div className={`grid overflow-hidden transition-all duration-500 lg:hidden ${open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
        <nav aria-label="Mobile" className="min-h-0">
          <div className="flex flex-col gap-1 px-5 pb-6">
            {nav.map((n, i) => (
              <a key={n.id} href={`#${n.id}`} onClick={() => setOpen(false)} tabIndex={open ? 0 : -1}
                className="flex items-center justify-between border-b border-border py-4 font-display text-2xl font-semibold transition-all"
                style={{ transitionDelay: `${i * 40}ms`, transform: open ? "none" : "translateY(-8px)" }}>
                {n.label}<span className="font-mono text-xs text-muted-foreground">0{i + 1}</span>
              </a>
            ))}
          </div>
        </nav>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section id="home" className="relative flex min-h-[100svh] flex-col overflow-hidden pt-28 md:pt-32">
      <div className="absolute inset-0 bg-grid" />
      <div className="absolute right-[-20%] top-[-10%] h-[70vh] w-[70vh] rounded-full bg-glow" />
      <div className="relative mx-auto grid w-full max-w-7xl flex-1 items-center gap-10 px-5 md:px-8 lg:grid-cols-[1.2fr_1fr]">
        <div className="relative z-10">
          <Reveal>
            <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-4 py-1.5 font-mono text-xs text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse-dot" /> AI • Full-Stack • Voice AI
            </p>
          </Reveal>
          <Reveal delay={80}><p className="mb-4 text-lg text-muted-foreground md:text-xl">Hi, I'm <span className="text-foreground">Simardeep Kaur</span>.</p></Reveal>
          <Reveal delay={160}>
            <h1 className="font-display text-[clamp(3rem,9vw,7.5rem)] font-extrabold leading-[0.92] tracking-tight">
              AI Full-Stack<br /><span className="text-gradient">Engineer</span>
            </h1>
          </Reveal>
          <Reveal delay={260}>
            <p className="mt-8 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
              Building intelligent, real-time products with AI, modern web technologies, and scalable cloud infrastructure.
            </p>
          </Reveal>
          <Reveal delay={340} className="mt-10 flex flex-wrap items-center gap-3">
            <Magnetic><a href="#projects" className={btnPrimary}>View My Work <ArrowDown className="h-4 w-4" /></a></Magnetic>
            <Magnetic><a href="#contact" className={btnGhost}>Let's Connect</a></Magnetic>
            <div className="ml-1 flex gap-2">
              <a href={links.github} target="_blank" rel="noreferrer" aria-label="GitHub" className="flex h-12 w-12 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary hover:text-foreground"><Github className="h-4 w-4" /></a>
              <a href={links.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="flex h-12 w-12 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary hover:text-foreground"><Linkedin className="h-4 w-4" /></a>
            </div>
          </Reveal>
        </div>
        <div className="relative hidden aspect-square w-full lg:block">
          <div className="absolute inset-0 rounded-full border border-border" />
          <div className="absolute inset-[14%] rounded-full border border-border" />
          <div className="absolute inset-[30%] rounded-full border border-primary/30" />
          <NodeField density={70} className="rounded-full" />
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-border-strong bg-background/80 px-4 py-2 font-mono text-xs backdrop-blur">query → retrieve → reason</div>
        </div>
      </div>
      <div className="relative border-t border-border bg-background/60 backdrop-blur">
        <dl className="mx-auto grid max-w-7xl grid-cols-2 px-5 sm:grid-cols-3 md:px-8 lg:grid-cols-5">
          {metrics.map((m, i) => (
            <Reveal key={m.label} delay={i * 80} className={`flex flex-col-reverse py-6 md:py-8 ${i ? "lg:border-l lg:pl-6" : ""} border-border`}>
              <dt className="mt-1 text-xs text-muted-foreground md:text-sm">{m.label}</dt>
              <dd className="font-display text-3xl font-bold md:text-4xl"><CountUp value={m.value} prefix={m.prefix} suffix={m.suffix} /></dd>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}

const constellation = ["Generative AI", "Agentic AI", "RAG", "Voice AI", "React", "Next.js", "Python", "FastAPI", "AWS"];

function About() {
  return (
    <section id="about" className="relative mx-auto max-w-7xl px-5 py-28 md:px-8 md:py-40">
      <SectionHead index="01" eyebrow="About" title="Engineering intelligence into real products." />
      <div className="grid gap-14 lg:grid-cols-[1.1fr_1fr]">
        <div className="space-y-6 text-lg leading-relaxed text-muted-foreground md:text-xl">
          <Reveal><p><span className="text-foreground">AI Full-Stack Engineer with 3 years of experience</span> building production LLM applications, agentic RAG systems, real-time voice assistants, and scalable full-stack applications.</p></Reveal>
          <Reveal delay={100}><p>Experienced across React, Next.js, TypeScript, Python, FastAPI, and AWS, with hands-on experience designing retrieval pipelines, AI agents, voice interfaces, APIs, cloud infrastructure, and production systems.</p></Reveal>
        </div>
        <Reveal delay={150} className="relative min-h-[320px] overflow-hidden rounded-2xl border border-border bg-card">
          <div className="absolute inset-0 bg-grid" />
          <div className="relative flex h-full flex-wrap content-center justify-center gap-3 p-8">
            {constellation.map((t, i) => (
              <span key={t} className="rounded-full border border-border-strong bg-background/70 px-4 py-2 font-mono text-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary hover:text-primary hover:shadow-glow"
                style={{ transform: `translateY(${(i % 3) * 8 - 8}px)` }}>{t}</span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Experience() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="experience" className="border-y border-border bg-card/40">
      <div className="mx-auto max-w-7xl px-5 py-28 md:px-8 md:py-40">
        <SectionHead index="02" eyebrow="Career" title="Experience" />
        <ol className="relative border-l border-border md:ml-4">
          {experience.map((job, i) => {
            const isOpen = open === i;
            return (
              <Reveal as="li" key={job.company} delay={i * 120} className="relative pb-14 pl-8 last:pb-0 md:pl-14">
                <span className={`absolute -left-[7px] top-2 h-3.5 w-3.5 rounded-full border-2 border-background transition-colors ${isOpen ? "bg-primary" : "bg-muted-foreground"}`} />
                <button onClick={() => setOpen(isOpen ? null : i)} aria-expanded={isOpen} className="group flex w-full flex-col gap-3 text-left md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="font-mono text-xs text-primary">{job.period}</p>
                    <h3 className="mt-2 font-display text-2xl font-bold md:text-4xl">{job.company}</h3>
                    <p className="mt-1 text-muted-foreground">{job.role} · {job.location}</p>
                  </div>
                  <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border transition-all group-hover:border-primary ${isOpen ? "rotate-45 bg-foreground text-background" : ""}`}><Plus className="h-4 w-4" /></span>
                </button>
                <div className={`grid transition-all duration-500 ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                  <div className="min-h-0 overflow-hidden">
                    <ul className="mt-8 space-y-4">
                      {job.points.map((p, k) => (
                        <li key={k} className="flex gap-4 text-muted-foreground"><span className="mt-1 font-mono text-xs text-primary">0{k + 1}</span><span className="leading-relaxed">{p}</span></li>
                      ))}
                    </ul>
                    <div className="mt-6 flex flex-wrap gap-2">{job.tags.map((t) => <Tag key={t}>{t}</Tag>)}</div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

function Tag({ children }: { children: string }) {
  return <span className="rounded-full border border-border px-3 py-1 font-mono text-xs text-muted-foreground transition-colors group-hover:border-border-strong group-hover:text-foreground">{children}</span>;
}

function Projects() {
  const [detail, setDetail] = useState<number | null>(null);
  return (
    <section id="projects" className="mx-auto max-w-7xl px-5 py-28 md:px-8 md:py-40">
      <SectionHead index="03" eyebrow="Projects" title="Selected Work" />
      <div className="space-y-6">
        {projects.map((p, i) => (
          <Reveal key={p.title} delay={60}>
            <article data-cursor="card" className="group grid gap-8 rounded-2xl border border-border bg-card p-6 transition-all duration-500 hover:border-border-strong hover:shadow-glow md:p-10 lg:grid-cols-[1.2fr_1fr]">
              <div className="flex flex-col">
                <div className="flex items-center justify-between font-mono text-xs text-muted-foreground">
                  <span>PROJECT {String(i + 1).padStart(2, "0")}</span>
                  <span className="text-right"><span className="font-display text-2xl font-bold text-foreground md:text-3xl">{p.metric}</span> <span className="block">{p.metricLabel}</span></span>
                </div>
                <h3 className="mt-6 font-display text-3xl font-bold leading-tight md:text-5xl">{p.title}</h3>
                <p className="mt-4 leading-relaxed text-muted-foreground">{p.description}</p>
                <div className={`grid transition-all duration-500 ${detail === i ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                  <p className="min-h-0 overflow-hidden leading-relaxed text-foreground/90"><span className="mt-4 block border-l-2 border-primary pl-4">{p.details}</span></p>
                </div>
                <div className="mt-6 flex flex-wrap gap-2">{p.tags.map((t) => <Tag key={t}>{t}</Tag>)}</div>
                <button onClick={() => setDetail(detail === i ? null : i)} aria-expanded={detail === i} className="mt-8 inline-flex items-center gap-2 self-start text-sm font-semibold">
                  {detail === i ? "Hide Details" : "View Details"}
                  <ArrowUpRight className={`h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 ${detail === i ? "rotate-90" : ""}`} />
                </button>
              </div>
              <div className="aspect-[4/3] lg:aspect-auto lg:min-h-[320px]"><ProjectVisual type={p.visual} /></div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function TechStack() {
  const [hover, setHover] = useState<string | null>(null);
  return (
    <section id="skills" className="border-y border-border bg-card/40">
      <div className="mx-auto max-w-7xl px-5 py-28 md:px-8 md:py-40">
        <SectionHead index="04" eyebrow="Stack" title="Tools I Build With" />
        <div className="grid gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-2">
          {skills.map((s, i) => (
            <Reveal key={s.category} delay={(i % 2) * 80} className="bg-background p-6 md:p-8">
              <div onMouseLeave={() => setHover(null)}>
                <h3 className={`mb-5 font-mono text-xs uppercase tracking-[0.2em] transition-colors ${hover === s.category ? "text-primary" : "text-muted-foreground"}`}>
                  {String(i + 1).padStart(2, "0")} — {s.category}
                </h3>
                <ul className="flex flex-wrap gap-2">
                  {s.items.map((t) => (
                    <li key={t} onMouseEnter={() => setHover(s.category)}
                      className="cursor-default rounded-lg border border-border px-3 py-1.5 text-sm transition-all duration-200 hover:scale-105 hover:border-primary hover:bg-accent hover:text-foreground hover:shadow-glow">{t}</li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Approach() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-28 md:px-8 md:py-40">
      <SectionHead index="05" eyebrow="Approach" title="From idea to production." />
      <ol className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {approach.map((a, i) => (
          <Reveal as="li" key={a.title} delay={i * 120} className="group relative border-t border-border pt-8">
            <span className="absolute left-0 top-[-1px] h-px w-0 bg-accent-gradient transition-all duration-700 group-hover:w-full" />
            <p className="font-mono text-sm text-primary">0{i + 1}</p>
            <h3 className="mt-4 font-display text-2xl font-bold">{a.title}</h3>
            <p className="mt-3 leading-relaxed text-muted-foreground">{a.text}</p>
          </Reveal>
        ))}
      </ol>
    </section>
  );
}

function Education() {
  return (
    <section className="mx-auto max-w-7xl px-5 pb-28 md:px-8 md:pb-40">
      <Reveal className="grid gap-6 rounded-2xl border border-border p-8 md:grid-cols-[auto_1fr_auto] md:items-center md:p-10">
        <p className="eyebrow">Education</p>
        <div>
          <h3 className="font-display text-2xl font-bold md:text-3xl">B.Tech. in Computer Science and Engineering</h3>
          <p className="mt-2 text-muted-foreground">Assam University · India</p>
        </div>
        <div className="font-mono text-sm text-muted-foreground md:text-right">
          <p>Nov 2020 – Aug 2024</p>
          <p className="mt-1 text-foreground">CGPA 7.86</p>
        </div>
      </Reveal>
    </section>
  );
}

function Contact() {
  return (
    <section id="contact" className="relative overflow-hidden border-t border-border">
      <NodeField density={50} className="opacity-50" />
      <div className="absolute inset-0 bg-glow" />
      <div className="relative mx-auto max-w-7xl px-5 py-28 text-center md:px-8 md:py-44">
        <Reveal><p className="eyebrow mb-6"><span className="text-primary">06</span> / Contact</p></Reveal>
        <Reveal delay={80}><h2 className="mx-auto max-w-5xl font-display text-[clamp(2.6rem,8vw,7rem)] font-extrabold leading-[0.95] tracking-tight">Let's build something <span className="text-gradient">intelligent.</span></h2></Reveal>
        <Reveal delay={160}><p className="mx-auto mt-8 max-w-xl text-lg text-muted-foreground">Have an AI product, full-stack application, or voice experience in mind? Let's talk.</p></Reveal>
        <Reveal delay={240} className="mt-12 flex flex-wrap justify-center gap-3">
          <Magnetic><a href={`mailto:${links.email}`} className={btnPrimary}><Mail className="h-4 w-4" /> Email Me</a></Magnetic>
          <Magnetic><a href={links.linkedin} target="_blank" rel="noreferrer" className={btnGhost}><Linkedin className="h-4 w-4" /> LinkedIn</a></Magnetic>
          <Magnetic><a href={links.github} target="_blank" rel="noreferrer" className={btnGhost}><Github className="h-4 w-4" /> GitHub</a></Magnetic>
        </Reveal>
        <Reveal delay={320} className="mt-14 flex flex-col items-center justify-center gap-4 font-mono text-sm text-muted-foreground sm:flex-row sm:gap-8">
          <a href={`mailto:${links.email}`} className="break-all hover:text-foreground">{links.email}</a>
          <a href={`tel:${links.phone.replace(/\s/g, "")}`} className="inline-flex items-center gap-2 hover:text-foreground"><Phone className="h-3.5 w-3.5" />{links.phone}</a>
          <span className="inline-flex items-center gap-2"><MapPin className="h-3.5 w-3.5" />{links.location}</span>
        </Reveal>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-5 py-12 md:flex-row md:items-center md:justify-between md:px-8">
        <div>
          <p className="font-display text-lg font-bold">Simardeep Kaur</p>
          <p className="text-sm text-muted-foreground">AI Full-Stack Engineer</p>
        </div>
        <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
          {nav.map((n) => <a key={n.id} href={`#${n.id}`} className="hover:text-foreground">{n.label}</a>)}
        </nav>
        <div className="flex gap-4 text-sm text-muted-foreground">
          <a href={links.linkedin} target="_blank" rel="noreferrer" className="hover:text-foreground">LinkedIn</a>
          <a href={links.github} target="_blank" rel="noreferrer" className="hover:text-foreground">GitHub</a>
        </div>
      </div>
      <p className="border-t border-border py-6 text-center font-mono text-xs text-muted-foreground">© 2026 Simardeep Kaur. All rights reserved.</p>
    </footer>
  );
}
