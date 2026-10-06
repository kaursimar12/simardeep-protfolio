import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, ArrowUpRight, Building2, Mail, UserRound } from "lucide-react";
import type { ReactNode } from "react";
import {
  caseStudies,
  getCaseStudy,
  type CaseStudySection,
} from "@/components/portfolio/case-studies";
import { FlowDiagram } from "@/components/portfolio/flow-diagram";
import {
  EmailLink,
  Footer,
  SiteHeader,
  StatGrid,
  TagList,
  btnOutline,
  btnPrimary,
  container,
} from "@/components/portfolio/ui";

export const Route = createFileRoute("/projects/$slug")({
  loader: ({ params }) => {
    const study = getCaseStudy(params.slug);
    if (!study) throw notFound();
    return study;
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {};
    const title = `${loaderData.title} — Simardeep Kaur`;
    return {
      meta: [
        { title },
        { name: "description", content: loaderData.summary },
        { property: "og:title", content: title },
        { property: "og:description", content: loaderData.summary },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary" },
      ],
    };
  },
  component: CaseStudyPage,
});

function CaseStudyPage() {
  const study = Route.useLoaderData();
  const index = caseStudies.findIndex((c) => c.slug === study.slug);
  const next = caseStudies[(index + 1) % caseStudies.length] ?? study;

  return (
    <>
      <SiteHeader />
      <main className={container}>
        <article>
          <header className="pb-12 pt-10 md:pt-14">
            <Link
              to="/"
              hash="projects"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" /> All projects
            </Link>
            <p className="mt-8 text-sm font-medium text-primary">Case study</p>
            <h1 className="mt-2 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
              {study.title}
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              {study.summary}
            </p>
            {(study.builtAt || study.role) && (
              <dl className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm">
                {study.builtAt && (
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-primary" />
                    <dt className="text-muted-foreground">Built at</dt>
                    <dd className="font-medium">{study.builtAt}</dd>
                  </div>
                )}
                {study.role && (
                  <div className="flex items-center gap-2">
                    <UserRound className="h-4 w-4 text-primary" />
                    <dt className="text-muted-foreground">Role</dt>
                    <dd className="font-medium">{study.role}</dd>
                  </div>
                )}
              </dl>
            )}
            <div className="mt-6">
              <TagList items={study.stack} />
            </div>
            {study.links && study.links.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-3">
                {study.links.map((l) => (
                  <a
                    key={l.href}
                    href={l.href}
                    target="_blank"
                    rel="noreferrer"
                    className={btnOutline}
                  >
                    {l.label} <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground" />
                  </a>
                ))}
              </div>
            )}
            <StatGrid items={study.results} className="mt-10" />
            {study.image && (
              <img
                src={study.image.src}
                alt={study.image.alt}
                className="mt-10 w-full rounded-xl border border-border shadow-sm"
              />
            )}
          </header>

          <Part title="Overview">
            <Prose>
              <p>{study.overview}</p>
              <h3 className="pt-2 font-semibold text-foreground">The problem</h3>
              <p>{study.problem}</p>
              <h3 className="pt-2 font-semibold text-foreground">The solution</h3>
              <p>{study.solution}</p>
            </Prose>
          </Part>

          <Part title="How it works">
            <Prose>
              <p>{study.flowIntro} Select any step to jump to it.</p>
            </Prose>
            <div className="mt-8">
              <FlowDiagram key={study.slug} spec={study.flow} />
            </div>
            <div className="mt-12 grid gap-x-10 gap-y-10 md:grid-cols-2">
              {study.sections.map((s) => (
                <div key={s.heading}>
                  <h3 className="font-semibold">{s.heading}</h3>
                  <Prose className="mt-2">
                    <SectionBody section={s} />
                  </Prose>
                </div>
              ))}
            </div>
          </Part>

          {study.outcome && (
            <Part title="Outcome">
              <Prose>
                <p>{study.outcome}</p>
              </Prose>
            </Part>
          )}
        </article>

        <nav
          aria-label="More projects"
          className="flex flex-col gap-6 border-t border-border py-12 sm:flex-row sm:items-center sm:justify-between"
        >
          <Link
            to="/projects/$slug"
            params={{ slug: next.slug }}
            className="group flex flex-col gap-1"
          >
            <span className="text-sm text-muted-foreground">Next project</span>
            <span className="inline-flex items-center gap-2 text-lg font-semibold group-hover:text-primary">
              {next.title}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>
          <EmailLink className={btnPrimary}>
            <Mail className="h-4 w-4" /> Get in touch
          </EmailLink>
        </nav>
      </main>
      <Footer />
    </>
  );
}

function Part({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border-t border-border py-12 md:py-16">
      <h2 className="mb-6 text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h2>
      {children}
    </section>
  );
}

function Prose({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`max-w-3xl space-y-4 leading-relaxed text-muted-foreground ${className}`}>
      {children}
    </div>
  );
}

function SectionBody({ section }: { section: CaseStudySection }) {
  return (
    <>
      {section.body && <p>{section.body}</p>}
      {section.items && (
        <ul className="space-y-2">
          {section.items.map((item) => (
            <li key={item.text} className="flex gap-3">
              <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/60" />
              <span>
                {item.label && <span className="font-medium text-foreground">{item.label}: </span>}
                {item.text}
              </span>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
