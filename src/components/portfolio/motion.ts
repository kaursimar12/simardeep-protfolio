import { useEffect, useState, type CSSProperties } from "react";
import { nav } from "./data";

/** Inline style that staggers an `.enter` / `[data-reveal]` animation. */
export const delay = (ms: number) => ({ "--delay": `${ms}ms` }) as CSSProperties;

/**
 * Fades `[data-reveal]` elements up as they scroll into view, once each. Elements already on
 * screen are shown as-is, and nothing is hidden until this runs, so content never depends on JS.
 */
export function useScrollReveal() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const els = [...document.querySelectorAll<HTMLElement>("[data-reveal]")];
    for (const el of els)
      if (el.getBoundingClientRect().top < window.innerHeight) el.dataset["revealed"] = "";
    document.documentElement.classList.add("reveal-ready");
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          (e.target as HTMLElement).dataset["revealed"] = "";
          observer.unobserve(e.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.1 },
    );
    for (const el of els) if (!("revealed" in el.dataset)) observer.observe(el);
    return () => {
      observer.disconnect();
      document.documentElement.classList.remove("reveal-ready");
    };
  }, []);
}

/** The nav section currently in the middle of the viewport, or null over the hero. */
export function useActiveSection(enabled: boolean) {
  const [active, setActive] = useState<string | null>(null);
  useEffect(() => {
    if (!enabled) return;
    const ids = ["home", ...nav.map((n) => n.id)];
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries)
          if (e.isIntersecting) setActive(e.target.id === "home" ? null : e.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    for (const id of ids) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [enabled]);
  return active;
}
