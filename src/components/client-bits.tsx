"use client";

import { Pause, Play } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { rollTo } from "./Header";

/** Adds data-in to [data-reveal] / [data-wipe] elements the first time they scroll into view. */
export function RevealObserver() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>("[data-reveal], [data-wipe]");
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            (e.target as HTMLElement).dataset.in = "";
            io.unobserve(e.target);
          }
        }
      },
      { threshold: 0.15 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return null;
}

/** Pause/play for all looping motion (marquee, stripes, scissors). */
export function MotionToggle({ iconOnly, className = "" }: { iconOnly?: boolean; className?: string }) {
  const t = useTranslations("marquee");
  const [paused, setPaused] = useState(false);

  function toggle() {
    const next = !paused;
    setPaused(next);
    if (next) document.documentElement.dataset.motion = "paused";
    else delete document.documentElement.dataset.motion;
  }

  return (
    <button type="button" onClick={toggle} aria-pressed={paused} aria-label={paused ? t("play") : t("pause")} title={paused ? t("play") : t("pause")} className={`btn btn-secondary !min-h-12 gap-2 !px-3 !text-sm ${iconOnly ? "" : "sm:!px-4"} ${className}`}>
      {paused ? <Play size={20} aria-hidden /> : <Pause size={20} aria-hidden />}
      {!iconOnly && <span className="hidden sm:inline">{paused ? t("play") : t("pause")}</span>}
    </button>
  );
}

/** Final value is in the DOM for assistive tech; the visible number counts up once. */
export function PriceCount({ value }: { value: number }) {
  const locale = useLocale();
  const ref = useRef<HTMLSpanElement>(null);
  const fmt = new Intl.NumberFormat(locale, { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
  const final = fmt.format(value);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const p = Math.min((now - start) / 700, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          el.textContent = fmt.format(Math.round(value * eased));
          if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, locale]);

  return (
    <>
      <span className="sr-only">{final}</span>
      <span ref={ref} aria-hidden suppressHydrationWarning>
        {final}
      </span>
    </>
  );
}

/** In-page link that glides to its section, like the header nav. */
export function RollLink({ id, className, children }: { id: string; className?: string; children: React.ReactNode }) {
  return (
    <a href={`#${id}`} className={className} onClick={(e) => rollTo(e, id)}>
      {children}
    </a>
  );
}
