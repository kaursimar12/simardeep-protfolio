import { Link, createFileRoute } from "@tanstack/react-router";
import type { ReactNode } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Github,
  GraduationCap,
  Linkedin,
  Mail,
  MapPin,
} from "lucide-react";
import {
  education,
  experience,
  links,
  metrics,
  projects,
  skills,
} from "@/components/portfolio/data";
import {
  EmailLink,
  Footer,
  IconTile,
  ResumeLink,
  SiteHeader,
  StatGrid,
  TagList,
  btnIcon,
  btnOutline,
  btnPrimary,
  card,
  container,
} from "@/components/portfolio/ui";
import { delay, useScrollReveal } from "@/components/portfolio/motion";
import { SideRails } from "@/components/portfolio/side-rails";

const TITLE = "Simardeep Kaur — AI Full-Stack Engineer";
const DESC =
  "Portfolio of Simardeep Kaur, an AI Full-Stack Engineer building agentic RAG systems, voice AI assistants, real-time applications, and scalable full-stack products.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: "Simardeep Kaur — AI Full-Stack Engineer" },
      {
        property: "og:description",
        content:
          "Building intelligent, real-time products with AI and modern full-stack technologies.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Index,
});

function Index() {
  useScrollReveal();
  return (
    <>
      {/* Page-top glow, behind the header too so there's no seam where the hero starts. */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[56rem]">
        <div className="absolute inset-0 bg-hero" />
        <div className="absolute inset-0 bg-dots" />
      </div>
      <SiteHeader />
      <SideRails />
      <main>
        <Hero />
        <div className={container}>
          <Projects />
          <Experience />
          <Skills />
          <About />
          <Contact />
        </div>
      </main>
      <Footer />
    </>
  );
}

function Section({
  id,
  eyebrow,
  title,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-20 border-t border-border py-14 md:py-20">
      <div data-reveal className="mb-8">
        <p className="text-sm font-medium text-primary">{eyebrow}</p>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function Hero() {
  return (
    <section id="home" className="relative scroll-mt-20 overflow-hidden">
      <div className={`${container} relative pb-14 pt-14 md:pb-20 md:pt-24`}>
        <p className="enter inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-3 py-1 text-sm text-muted-foreground backdrop-blur">
          <MapPin className="h-3.5 w-3.5 text-primary" /> {links.location}
        </p>
        <h1
          style={delay(80)}
          className="enter mt-6 text-5xl font-semibold tracking-tight sm:text-6xl md:text-7xl"
        >
          Simardeep Kaur
        </h1>
        <p style={delay(160)} className="enter mt-4 text-xl font-medium sm:text-2xl">
          <span className="text-gradient">AI Full-Stack Engineer</span>
        </p>
        <p
          style={delay(240)}
          className="enter mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground"
        >
          I build <span className="text-foreground">agentic RAG systems</span>,{" "}
          <span className="text-foreground">real-time voice assistants</span>, and the full-stack
          products around them — from the retrieval pipeline to the UI to the cloud.
        </p>
        <div style={delay(320)} className="enter mt-8 flex flex-wrap gap-3">
          <a href="#projects" className={btnPrimary}>
            View my work <ArrowRight className="h-4 w-4" />
          </a>
          <ResumeLink className={btnOutline} />
          <EmailLink className={btnOutline}>
            <Mail className="h-4 w-4" /> Get in touch
          </EmailLink>
          <a
            href={links.github}
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
            className={`${btnIcon} max-sm:hidden`}
          >
            <Github className="h-4 w-4" />
          </a>
          <a
            href={links.linkedin}
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn"
            className={`${btnIcon} max-sm:hidden`}
          >
            <Linkedin className="h-4 w-4" />
          </a>
        </div>
        <div style={delay(420)} className="enter mt-12">
          <StatGrid items={metrics} className="bg-card/80 backdrop-blur" />
        </div>
      </div>
    </section>
  );
}

function Projects() {
  return (
    <Section id="projects" eyebrow="Projects" title="Selected work">
      <div className="grid gap-5 md:grid-cols-2">
        {projects.map((p, i) => (
          <div key={p.slug} data-reveal style={delay((i % 2) * 100)} className="grid">
            <article
              className={`${card} group relative flex flex-col p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg has-[a:focus-visible]:ring-2 has-[a:focus-visible]:ring-ring md:p-7`}
            >
              <p className="text-3xl font-semibold tracking-tight text-primary">{p.metric}</p>
              <p className="mt-1 text-sm text-muted-foreground">{p.metricLabel}</p>
              <h3 className="mt-5 text-lg font-semibold">
                <Link
                  to="/projects/$slug"
                  params={{ slug: p.slug }}
                  className="after:absolute after:inset-0 after:rounded-xl focus-visible:outline-none"
                >
                  {p.title}
                </Link>
              </h3>
              <p className="mt-2 leading-relaxed text-muted-foreground">{p.description}</p>
              <div className="mt-auto pt-6">
                <TagList items={p.tags} />
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                  Case study
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </article>
          </div>
        ))}
      </div>
    </Section>
  );
}

// Figures such as 300+, 10K, 500–600ms, 800ms–1s, 68%, 50,000 — but not the digits in p50 or
// S3. Group 1 stands in for a lookbehind, which older Safari can't parse.
const FIGURE = /(^|[^A-Za-z@\d])(\d[\d,.]*(?:ms|s|K|%)?(?:–\d[\d,.]*(?:ms|s|K|%)?)?\+?)/g;

function emphasizeFigures(text: string) {
  const parts: ReactNode[] = [];
  let last = 0;
  for (const m of text.matchAll(FIGURE)) {
    const start = m.index + (m[1]?.length ?? 0);
    const figure = m[2] ?? "";
    parts.push(
      text.slice(last, start),
      <strong key={start} className="font-semibold text-foreground">
        {figure}
      </strong>,
    );
    last = start + figure.length;
  }
  parts.push(text.slice(last));
  return parts;
}

function Experience() {
  return (
    <Section id="experience" eyebrow="Experience" title="Where I've worked">
      <ol className="relative space-y-6 border-l border-border pl-6 md:pl-10">
        {experience.map((job, i) => (
          <li key={job.company} data-reveal className="relative">
            <span className="absolute -left-[31px] top-7 h-3 w-3 md:-left-[47px]">
              {i === 0 && <span className="soft-ping absolute inset-0 rounded-full bg-primary" />}
              <span
                className={`relative block h-3 w-3 rounded-full ring-4 ring-background ${i === 0 ? "bg-primary" : "bg-border-strong"}`}
              />
            </span>
            <article className={`${card} p-6 md:p-8`}>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 className="text-xl font-semibold">{job.company}</h3>
                  <p className="mt-1 text-muted-foreground">
                    {job.role} · {job.location}
                  </p>
                </div>
                <span className="self-start whitespace-nowrap rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                  {job.period}
                </span>
              </div>
              <ul className="mt-6 space-y-3 text-muted-foreground">
                {job.points.map((p) => (
                  <li key={p} className="flex gap-3 leading-relaxed">
                    <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/60" />
                    <span>{emphasizeFigures(p)}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 border-t border-border pt-5">
                <TagList items={job.tags} />
              </div>
            </article>
          </li>
        ))}
      </ol>
    </Section>
  );
}

function Skills() {
  return (
    <Section id="skills" eyebrow="Skills" title="What I work with">
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {skills.map((s, i) => (
          <div key={s.category} data-reveal style={delay((i % 3) * 90)} className={`${card} p-6`}>
            <h3 className="font-semibold">{s.category}</h3>
            <ul className="mt-4 flex flex-wrap gap-2">
              {s.core.map((t) => (
                <li
                  key={t}
                  className="rounded-md bg-secondary px-2.5 py-1 text-sm font-medium text-foreground"
                >
                  {t}
                </li>
              ))}
            </ul>
            {s.also.length > 0 && (
              <p className="mt-4 text-sm text-muted-foreground">Also: {s.also.join(", ")}</p>
            )}
          </div>
        ))}
      </div>
    </Section>
  );
}

function About() {
  return (
    <Section id="about" eyebrow="About" title="A bit about me">
      <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-start">
        <div data-reveal className="space-y-5 text-lg leading-relaxed text-muted-foreground">
          <p>
            Most of my recent work sits where LLMs meet production: agentic RAG and real-time voice
            assistants at Wartin Labs, where evaluation and latency matter as much as the model.
          </p>
          <p>
            Before that I spent a year at Shades Of Web shipping React and Next.js frontends, Python
            backends, and AWS deployments — so I build the whole product, not just the AI layer.
          </p>
        </div>
        <div data-reveal style={delay(120)} className={`${card} flex gap-4 p-6`}>
          <IconTile icon={GraduationCap} />
          <div>
            <h3 className="font-semibold">{education.degree}</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {education.school} · {education.grade}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">{education.period}</p>
          </div>
        </div>
      </div>
    </Section>
  );
}

function Contact() {
  return (
    <section id="contact" className="scroll-mt-20 pb-16 md:pb-24">
      <div
        data-reveal
        className="relative overflow-hidden rounded-2xl border border-primary/20 bg-card px-6 py-14 text-center shadow-sm md:px-12 md:py-16"
      >
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-hero" />
        <div className="relative">
          <p className="text-sm font-medium text-primary">Contact</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-5xl">Let's talk</h2>
          <p className="mx-auto mt-5 max-w-xl text-lg text-muted-foreground">
            Whether it's a role, a project, or a question about something on this page, email is the
            best way to reach me.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <EmailLink className={btnPrimary}>
              <Mail className="h-4 w-4" /> Email me
            </EmailLink>
            <ResumeLink className={btnOutline} />
            <a href={links.linkedin} target="_blank" rel="noreferrer" className={btnOutline}>
              <Linkedin className="h-4 w-4" /> LinkedIn
              <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground" />
            </a>
            <a href={links.github} target="_blank" rel="noreferrer" className={btnOutline}>
              <Github className="h-4 w-4" /> GitHub
              <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground" />
            </a>
          </div>
          <EmailLink className="mt-6 inline-block break-all text-sm text-muted-foreground hover:text-foreground">
            {links.email}
          </EmailLink>
        </div>
      </div>
    </section>
  );
}
