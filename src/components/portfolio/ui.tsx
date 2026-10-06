import { Link, useLocation } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { Check, Copy, FileText, Mail, Menu, Moon, Sun, X, type LucideIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { links, nav } from "./data";
import { useActiveSection } from "./motion";

export const container = "mx-auto max-w-5xl px-5 md:px-8";

export const btnPrimary =
  "inline-flex h-11 items-center gap-2 rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90";
export const btnOutline =
  "inline-flex h-11 items-center gap-2 rounded-lg border border-border-strong bg-card px-5 text-sm font-medium transition-colors hover:bg-secondary";
export const btnIcon =
  "inline-flex h-11 w-11 items-center justify-center rounded-lg border border-border-strong bg-card text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground";
export const card = "rounded-xl border border-border bg-card shadow-sm";

export function IconTile({ icon: Icon }: { icon: LucideIcon }) {
  return (
    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/20">
      <Icon className="h-5 w-5" />
    </span>
  );
}

export function TagList({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-wrap gap-1.5">
      {items.map((t) => (
        <li
          key={t}
          className="rounded-md border border-border bg-secondary/60 px-2 py-0.5 text-xs text-secondary-foreground"
        >
          {t}
        </li>
      ))}
    </ul>
  );
}

const statCols: Record<number, string> = {
  2: "grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-3",
  4: "grid-cols-2 lg:grid-cols-4",
};

export function StatGrid({
  items,
  className = "",
}: {
  items: { value: string; label: string }[];
  className?: string;
}) {
  return (
    <dl
      className={`${card} grid overflow-hidden ${statCols[items.length] ?? "grid-cols-2 sm:grid-cols-3"} ${className}`}
    >
      {items.map((s) => (
        <div
          key={s.label}
          className="-mb-px -mr-px flex flex-col-reverse justify-end border-b border-r border-border p-5"
        >
          <dt className="mt-1 text-sm text-muted-foreground">{s.label}</dt>
          <dd className="whitespace-nowrap text-xl font-semibold tracking-tight sm:text-3xl">
            {s.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

export function ResumeLink({ className }: { className: string }) {
  if (!links.resume) return null;
  return (
    <a href={links.resume} target="_blank" rel="noreferrer" className={className}>
      <FileText className="h-4 w-4" /> Résumé
    </a>
  );
}

/**
 * Email link that opens a chooser instead of a bare mailto:. A mailto: does nothing on machines
 * with no default mail app (common on Windows), so visitors can pick webmail or copy the address.
 */
export function EmailLink({ className, children }: { className: string; children: ReactNode }) {
  const [copied, setCopied] = useState(false);
  const to = encodeURIComponent(links.email);
  const options = [
    { label: "Gmail", href: `https://mail.google.com/mail/?view=cm&fs=1&to=${to}` },
    { label: "Outlook", href: `https://outlook.live.com/mail/0/deeplink/compose?to=${to}` },
    { label: "Default mail app", href: `mailto:${links.email}` },
  ];

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(links.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard can be blocked (insecure context, permissions); the other options still work.
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={className}>{children}</DropdownMenuTrigger>
      <DropdownMenuContent align="center" className="min-w-52">
        {options.map((o) => (
          <DropdownMenuItem key={o.label} asChild className="cursor-pointer">
            <a
              href={o.href}
              {...(o.href.startsWith("http") && { target: "_blank", rel: "noreferrer" })}
            >
              <Mail /> {o.label}
            </a>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer"
          onSelect={(e) => {
            e.preventDefault();
            void copy();
          }}
        >
          {copied ? <Check /> : <Copy />} {copied ? "Copied!" : "Copy email address"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/** localStorage key for the visitor's theme choice; also read by the pre-paint script in __root. */
export const THEME_KEY = "theme";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const [dark, setDark] = useState(true);
  // The <head> script may already have applied a saved choice; sync with it after hydration.
  useEffect(() => setDark(document.documentElement.classList.contains("dark")), []);

  const toggle = () => {
    const next = !dark;
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem(THEME_KEY, next ? "dark" : "light");
    } catch {
      // Storage can be blocked (private mode); the toggle still works for this visit.
    }
    setDark(next);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
      title={dark ? "Light theme" : "Dark theme"}
      className={`flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground ${className}`}
    >
      {dark ? <Sun className="h-[18px] w-[18px]" /> : <Moon className="h-[18px] w-[18px]" />}
    </button>
  );
}

/**
 * Link to a homepage section. On the homepage it's a plain anchor: a router <Link> to "/" would
 * count as active there and get aria-current="page" on every section link.
 */
function SectionLink({
  id,
  onHome,
  className,
  onClick,
  current,
  children,
}: {
  id: string;
  onHome: boolean;
  className: string;
  onClick?: () => void;
  current?: boolean;
  children: ReactNode;
}) {
  const props = { className, onClick, "aria-current": current ? ("location" as const) : undefined };
  return onHome ? (
    <a href={`#${id}`} {...props}>
      {children}
    </a>
  ) : (
    <Link to="/" hash={id} {...props}>
      {children}
    </Link>
  );
}

export function SiteHeader() {
  const pathname = useLocation({ select: (l) => l.pathname });
  const onHome = pathname === "/";
  const sectionInView = useActiveSection(onHome);
  const active = onHome ? sectionInView : pathname.startsWith("/projects") ? "projects" : null;
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="sticky top-0 z-50 pt-3">
      <div className={container}>
        <div
          className={`relative flex h-14 items-center justify-between gap-3 rounded-2xl border bg-background/80 pl-2 pr-2 backdrop-blur-xl transition-[box-shadow,border-color] duration-300 ${scrolled || open ? "border-border shadow-lg shadow-black/5" : "border-border/60 shadow-none"}`}
        >
          <SectionLink
            id="home"
            onHome={onHome}
            className="flex items-center gap-2.5 rounded-xl py-1 pl-1 pr-2"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-primary to-violet text-xs font-bold tracking-wide text-primary-foreground shadow-sm">
              SK
            </span>
            <span className="leading-tight">
              <span className="block text-sm font-semibold">Simardeep Kaur</span>
              <span className="block text-xs text-muted-foreground">AI Full-Stack Engineer</span>
            </span>
          </SectionLink>

          <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
            {nav.map((n) => (
              <SectionLink
                key={n.id}
                id={n.id}
                onHome={onHome}
                current={active === n.id}
                className={`rounded-lg px-3 py-1.5 text-sm transition-colors ${active === n.id ? "bg-secondary font-medium text-foreground" : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"}`}
              >
                {n.label}
              </SectionLink>
            ))}
          </nav>

          <div className="flex items-center gap-1.5">
            <ThemeToggle />
            <ResumeLink className="hidden h-9 items-center gap-1.5 rounded-lg bg-foreground px-3.5 text-sm font-medium text-background shadow-sm transition-opacity hover:opacity-90 sm:inline-flex" />
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-controls="mobile-nav"
              aria-label={open ? "Close menu" : "Open menu"}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-secondary md:hidden"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

          {open && (
            <nav
              id="mobile-nav"
              aria-label="Mobile"
              className="absolute inset-x-0 top-full mt-2 rounded-2xl border border-border bg-background p-2 shadow-lg shadow-black/5 md:hidden"
            >
              <ul>
                {nav.map((n) => (
                  <li key={n.id}>
                    <SectionLink
                      id={n.id}
                      onHome={onHome}
                      onClick={() => setOpen(false)}
                      current={active === n.id}
                      className={`flex items-center justify-between rounded-xl px-3 py-3 text-base transition-colors ${active === n.id ? "bg-secondary font-medium" : "hover:bg-secondary/60"}`}
                    >
                      {n.label}
                      {active === n.id && <span className="h-1.5 w-1.5 rounded-full bg-primary" />}
                    </SectionLink>
                  </li>
                ))}
              </ul>
              <ResumeLink className="mt-2 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-foreground text-sm font-medium text-background sm:hidden" />
            </nav>
          )}
        </div>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div
        className={`${container} flex flex-col gap-4 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between`}
      >
        <p>© 2026 Simardeep Kaur</p>
        <div className="flex gap-5">
          <a href={links.github} target="_blank" rel="noreferrer" className="hover:text-foreground">
            GitHub
          </a>
          <a
            href={links.linkedin}
            target="_blank"
            rel="noreferrer"
            className="hover:text-foreground"
          >
            LinkedIn
          </a>
          <EmailLink className="hover:text-foreground">Email</EmailLink>
        </div>
      </div>
    </footer>
  );
}
