import { Check, MapPin, Clock } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { PLANS } from "@/lib/checkout/catalog";
import { SHOP_NAME } from "@/lib/brand";
import { BookButton } from "./booking";
import { SwitchViewButton } from "./role-gate";
import { MotionToggle, PriceCount } from "./client-bits";

const stagger = (i: number) => ({ "--i": Math.min(i, 5) }) as React.CSSProperties;

function Sample({ children }: { children?: React.ReactNode }) {
  const t = useTranslations("common");
  return <span className="chip-sample">{children ?? t("sample")}</span>;
}

function Heading({ eyebrow, title, note, id }: { eyebrow: string; title: string; note?: string; id: string }) {
  return (
    <div data-reveal>
      <p className="label mb-3 opacity-90">{eyebrow}</p>
      <h2 id={id} className="text-headline">
        {title}
      </h2>
      {note && <p className="mt-3 max-w-[68ch] text-[0.9375rem] opacity-85">{note}</p>}
    </div>
  );
}

function Scissors() {
  const half = (cls: string, color: string) => (
    <g className={`scissors-half ${cls}`}>
      <path d="M94 104 L100 6 L107 104 Z" fill={color} />
      <rect x="96" y="100" width="8" height="50" rx="4" fill={color} />
      <circle cx="100" cy="171" r="20" fill="none" stroke={color} strokeWidth="9" />
    </g>
  );
  return (
    <svg viewBox="0 0 200 200" className="h-[88%] max-h-[420px] w-auto" aria-hidden focusable="false">
      <g transform="rotate(-32 100 100)">
        {half("scissors-a", "var(--color-gold)")}
        {half("scissors-b", "var(--color-cream)")}
        <circle cx="100" cy="100" r="7" fill="var(--color-coal)" stroke="var(--color-gold-hi)" strokeWidth="3" />
      </g>
    </svg>
  );
}

export function Hero() {
  const t = useTranslations("hero");
  const nav = useTranslations("nav");
  const lines = t.raw("lines") as string[];
  return (
    <section id="top" aria-labelledby="hero-title" className="bg-coal">
      <div className="wrap grid items-center gap-10 py-10 lg:grid-cols-12 lg:gap-8 lg:py-20">
        <div className="lg:col-span-8">
          <p className="label mb-5 flex flex-wrap items-center gap-3 text-cream-muted">
            <Sample />
            {t("eyebrow")}
          </p>
          <h1 id="hero-title" className="text-display">
            {lines.map((l, i) => (
              <span key={l} className="hero-line" style={stagger(i)}>
                {i === lines.length - 1 ? <span className="text-gold">{l}</span> : l}
              </span>
            ))}
          </h1>
          <p className="hero-fade mt-6 max-w-[52ch] text-lg text-cream-muted">{t("sub")}</p>
          <div className="hero-fade mt-8 flex flex-col gap-3 sm:flex-row">
            <BookButton className="btn btn-primary">{nav("book")}</BookButton>
            <a href="#services" className="btn btn-secondary">
              {t("seeServices")}
            </a>
          </div>
        </div>

        <div className="hero-art lg:col-span-4" role="img" aria-label={t("scissorsLabel")}>
          <div className="sign relative flex aspect-[16/10] items-center justify-center overflow-hidden rounded-lg border-2 border-cream bg-coal-raised lg:aspect-[3/4]">
            <Scissors />
          </div>
        </div>
      </div>
    </section>
  );
}

export function Marquee() {
  const t = useTranslations("marquee");
  const items = t.raw("items") as string[];
  const row = (hidden: boolean) => (
    <ul className="flex items-center" aria-hidden={hidden || undefined}>
      {[...items, ...items].map((w, i) => (
        <li key={i} className="flex items-center font-display text-3xl font-black uppercase tracking-tight text-coal">
          <span className="px-5">{w}</span>
          <span className="text-coal" aria-hidden>
            ✦
          </span>
        </li>
      ))}
    </ul>
  );
  return (
    <section className="bg-gold" aria-label={items.join(", ")}>
      <div className="wrap flex items-center gap-4 py-3">
        <div className="marquee min-w-0 flex-1 overflow-hidden">
          <div className="marquee-track">
            {row(false)}
            {row(true)}
          </div>
        </div>
        <MotionToggle />
      </div>
    </section>
  );
}

export function Services() {
  const t = useTranslations("services");
  const c = useTranslations("common");
  const f = useFormatter();
  const items = t.raw("items") as { name: string; desc: string; minutes: number; price: number }[];
  return (
    <section id="services" aria-labelledby="services-title" className="section bg-coal">
      <div className="wrap grid gap-10 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <Heading id="services-title" eyebrow={t("eyebrow")} title={t("title")} note={t("note")} />
            <p className="mt-4" data-reveal style={stagger(1)}>
              <Sample>{c("samplePrice")}</Sample>
            </p>
          </div>
        </div>
        <ul className="lg:col-span-8">
          {items.map((s, i) => (
            <li key={s.name} data-reveal style={stagger(i)} className="service-row border-t-2 border-cream py-5 last:border-b-2">
              <div className="flex items-end gap-3">
                <h3 className="text-title">{s.name}</h3>
                <span className="leader" aria-hidden />
                <span className="price text-gold">
                  {f.number(s.price, { style: "currency", currency: "BRL", maximumFractionDigits: 0 })}
                </span>
              </div>
              <div className="mt-1 flex flex-wrap items-center justify-between gap-x-6">
                <p className="max-w-[52ch] text-[0.9375rem] text-cream-muted">
                  {s.desc} <span className="label ml-1 whitespace-nowrap text-cream">{c("min", { n: s.minutes })}</span>
                </p>
                <BookButton preset={{ service: i }} className="link text-[0.9375rem]">
                  {t("book")}
                </BookButton>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

const BACKINGS = ["bg-gold", "bg-cream", "bg-coal-raised", "bg-coal-deep"];

export function Team() {
  const t = useTranslations("team");
  const c = useTranslations("common");
  const members = t.raw("members") as { name: string; specialty: string; bio: string }[];
  return (
    <section id="team" aria-labelledby="team-title" className="section bg-coal-raised text-cream">
      <div className="wrap">
        <Heading id="team-title" eyebrow={t("eyebrow")} title={t("title")} note={t("note")} />
        <ul className="mt-10 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {members.map((m, i) => (
            <li key={m.name} data-reveal style={stagger(i)} className={i % 2 ? "lg:mt-12" : ""}>
              <article className="sign flex h-full flex-col overflow-hidden rounded-lg border-2 border-cream bg-coal text-cream">
                <div
                  className={`relative flex aspect-[3/4] items-center justify-center ${BACKINGS[i % BACKINGS.length]}`}
                  role="img"
                  aria-label={`${c("sample")}: ${m.name}`}
                >
                  <span className={`font-display text-[7rem] font-black leading-none ${i % BACKINGS.length < 2 ? "text-coal" : "text-cream"}`} aria-hidden>
                    {m.name[0]}
                  </span>
                  <span className="absolute left-2 top-2">
                    <Sample />
                  </span>
                </div>
                <div className="flex flex-1 flex-col gap-1 p-4 sm:p-5">
                  <h3 className="text-title">{m.name}</h3>
                  <p className="label text-gold">{m.specialty}</p>
                  <p className="mt-1 flex-1 text-[0.9375rem] text-cream-muted">{m.bio}</p>
                  <BookButton preset={{ barber: i }} className="link mt-2 text-[0.9375rem]">
                    {t("bookWith", { name: m.name })}
                  </BookButton>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function Plans() {
  const t = useTranslations("plans");
  const c = useTranslations("common");
  const items = t.raw("items") as { name: string; price: number; perks: string[] }[];
  return (
    <section id="plans" aria-labelledby="plans-title" className="section bg-coal-deep text-cream">
      <div className="wrap">
        <Heading id="plans-title" eyebrow={t("eyebrow")} title={t("title")} note={t("note")} />
        <ul className="mt-12 grid gap-8 lg:grid-cols-3 lg:items-start lg:gap-6">
          {items.map((p, i) => {
            const featured = i === 2;
            return (
              <li key={p.name} data-reveal style={stagger(i)} className={featured ? "lg:order-none" : ""}>
                <article
                  className={`plan relative flex h-full flex-col gap-5 rounded-lg bg-coal-raised p-6 text-cream ${
                    featured ? "sign border-2 border-cream lg:-mt-4" : "border-2 border-line"
                  }`}
                >
                  {featured && (
                    <span className="chip-sample absolute -top-3 left-6">{t("popular")}</span>
                  )}
                  <h3 className="text-title">{p.name}</h3>
                  <p className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                    <span className="font-display text-5xl font-black leading-none text-gold">
                      <PriceCount value={p.price} />
                    </span>
                    <span className="text-sm text-cream-muted">{t("perMonth")}</span>
                  </p>
                  <p className="flex flex-wrap gap-2">
                    <Sample>{c("samplePrice")}</Sample>
                  </p>
                  <ul className="flex flex-1 flex-col gap-2">
                    {p.perks.map((k) => (
                      <li key={k} className="flex gap-2 text-[0.9375rem]">
                        <Check size={20} className="mt-0.5 shrink-0 text-gold" aria-hidden />
                        {k}
                      </li>
                    ))}
                  </ul>
                  <div>
                    <Link href={{ pathname: "/checkout", query: { plan: PLANS[i].id } }} className="btn btn-primary w-full" aria-describedby={`plan-note-${i}`}>
                      {t("cta")}
                    </Link>
                    <p id={`plan-note-${i}`} className="mt-3 text-sm text-cream-muted">
                      {t("testMode")}.
                    </p>
                  </div>
                </article>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

const TILES = [
  { c: "bg-gold text-coal", span: "col-span-2 row-span-2" },
  { c: "bg-coal-raised text-cream border border-line", span: "" },
  { c: "bg-cream text-coal", span: "" },
  { c: "bg-coal-deep text-cream border border-line", span: "" },
  { c: "bg-gold-deep text-coal", span: "" },
  { c: "bg-coal-raised text-cream border border-line", span: "lg:col-span-2" },
];

export function Gallery() {
  const t = useTranslations("gallery");
  return (
    <section id="gallery" aria-labelledby="gallery-title" className="section bg-coal">
      <div className="wrap">
        <Heading id="gallery-title" eyebrow={t("eyebrow")} title={t("title")} note={t("note")} />
        <ul className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {TILES.map((tile, i) => (
            <li key={i} data-wipe style={stagger(i)} className={`tile ${tile.span}`}>
              <div
                className={`tile-inner flex h-full min-h-[200px] items-end p-4 ${tile.c} ${tile.span.includes("row-span-2") ? "" : "aspect-[3/4]"}`}
              >
                <span className="label">{t("tile", { n: i + 1 })}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function Reviews() {
  const t = useTranslations("reviews");
  const items = t.raw("items") as string[];
  return (
    <section aria-labelledby="reviews-title" className="section border-t border-line bg-coal-raised">
      <div className="wrap grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Heading id="reviews-title" eyebrow={t("eyebrow")} title={t("title")} />
        </div>
        <ul className="grid gap-8 lg:col-span-8 lg:gap-10">
          {items.map((q, i) => (
            <li key={q} data-reveal style={stagger(i)} className={`${i % 2 ? "lg:ml-12" : ""} border-t-2 border-cream pt-5`}>
              <blockquote className="font-display text-2xl font-bold leading-snug sm:text-3xl">{q}</blockquote>
              <p className="mt-3 flex flex-wrap items-center gap-3 text-sm text-cream-muted">
                <Sample>{t("label")}</Sample>
                {t("author")}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function Contact() {
  const t = useTranslations("contact");
  const nav = useTranslations("nav");
  const hours = t.raw("hours") as { days: string; time: string }[];
  return (
    <section id="contact" aria-labelledby="contact-title" className="section border-t border-line bg-coal">
      <div className="wrap grid gap-10 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <Heading id="contact-title" eyebrow={t("eyebrow")} title={t("title")} />
          <dl className="mt-8 grid gap-8" data-reveal style={stagger(1)}>
            <div>
              <dt className="label mb-2 flex items-center gap-2 text-cream-muted">
                <MapPin size={20} aria-hidden /> {t("addressLabel")} <Sample />
              </dt>
              <dd className="text-lg">{t("address")}</dd>
            </div>
            <div>
              <dt className="label mb-2 flex items-center gap-2 text-cream-muted">
                <Clock size={20} aria-hidden /> {t("hoursLabel")} <Sample />
              </dt>
              <dd>
                <ul className="divide-y divide-line">
                  {hours.map((h) => (
                    <li key={h.days} className="flex justify-between gap-6 py-2">
                      <span>{h.days}</span>
                      <span className="font-display font-bold">{h.time}</span>
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          </dl>
          <div className="mt-8" data-reveal style={stagger(2)}>
            <BookButton className="btn btn-primary">{nav("book")}</BookButton>
          </div>
        </div>
        <div className="lg:col-span-7" data-reveal style={stagger(1)}>
          <div
            className="sign relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-lg border-2 border-cream bg-gold sm:aspect-[16/10]"
            role="img"
            aria-label={t("mapLabel")}
          >
            <div
              className="absolute inset-0 opacity-30"
              aria-hidden
              style={{
                backgroundImage:
                  "linear-gradient(var(--color-paper) 2px, transparent 2px), linear-gradient(90deg, var(--color-paper) 2px, transparent 2px)",
                backgroundSize: "56px 56px",
              }}
            />
            <div className="relative flex flex-col items-center gap-3 text-coal">
              <MapPin size={56} aria-hidden />
              <span className="font-display text-2xl font-black">{t("map")}</span>
              <Sample />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  const t = useTranslations("footer");
  const nav = useTranslations("nav");
  return (
    <footer className="on-dark bg-coal-deep text-cream">
      <div className="stripe" aria-hidden />
      <div className="wrap flex flex-col gap-8 py-12 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="font-display text-4xl font-black">{SHOP_NAME}</p>
          <p className="mt-3 max-w-[52ch] text-[0.9375rem] opacity-85">{t("demo")}</p>
        </div>
        <div className="flex flex-wrap items-center gap-4 self-start">
          <SwitchViewButton className="link" />
          <BookButton className="btn btn-gold">{nav("book")}</BookButton>
        </div>
      </div>
    </footer>
  );
}
