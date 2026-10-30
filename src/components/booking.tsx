"use client";

import { ArrowLeft, Check, X } from "lucide-react";
import { useFormatter, useLocale, useTranslations } from "next-intl";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

type Preset = { service?: number; barber?: number };
type Ctx = { open: (preset?: Preset) => void };

const BookingCtx = createContext<Ctx>({ open: () => {} });

type Service = { name: string; desc: string; minutes: number; price: number };
type Member = { name: string; specialty: string };
type Step = 0 | 1 | 2 | 3 | 4;

/** Mon=1 ... Sun=0. The shop is closed Sunday and Monday. */
const closeHour = (d: Date) => (d.getDay() === 6 ? 17 : d.getDay() >= 2 && d.getDay() <= 5 ? 19 : 0);

/** Deterministic fake "already booked" so a day looks lived-in but never changes between renders. */
function taken(day: string, barber: number, slot: string) {
  let h = 2166136261;
  for (const ch of `${day}|${barber}|${slot}`) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  return (h >>> 0) % 100 < 32;
}

const pad = (n: number) => String(n).padStart(2, "0");
const dayKey = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

function openDays(count: number) {
  const out: Date[] = [];
  const now = new Date();
  const d = new Date(now);
  d.setHours(0, 0, 0, 0);
  for (let i = 0; out.length < count && i < 30; i++) {
    // Skip today once the shop is (nearly) closed.
    const lateToday = i === 0 && now.getHours() * 60 + now.getMinutes() > closeHour(d) * 60 - 90;
    if (closeHour(d) > 0 && !lateToday) out.push(new Date(d));
    d.setDate(d.getDate() + 1);
  }
  return out;
}

function slotsFor(day: Date, barber: number, minutes: number) {
  const close = closeHour(day) * 60;
  const now = new Date();
  const isToday = dayKey(day) === dayKey(now);
  const nowMin = now.getHours() * 60 + now.getMinutes();
  const out: { label: string; free: boolean }[] = [];
  for (let m = 9 * 60; m + minutes <= close; m += 30) {
    const label = `${pad(Math.floor(m / 60))}:${pad(m % 60)}`;
    out.push({ label, free: !(isToday && m <= nowMin) && !taken(dayKey(day), barber, label) });
  }
  return out;
}

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [mounted, setMounted] = useState(false);
  const [preset, setPreset] = useState<Preset>({});
  const [session, setSession] = useState(0);

  const open = useCallback((p: Preset = {}) => {
    setPreset(p);
    setSession((s) => s + 1);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !dialogRef.current?.open) {
      dialogRef.current?.showModal();
      document.body.style.overflow = "hidden";
    }
  }, [mounted, session]);

  const close = useCallback(() => dialogRef.current?.close(), []);

  const value = useMemo(() => ({ open }), [open]);

  return (
    <BookingCtx.Provider value={value}>
      {children}
      {mounted && (
        <dialog
          ref={dialogRef}
          className="book-dialog"
          aria-labelledby="book-title"
          onClose={() => {
            document.body.style.overflow = "";
            setMounted(false);
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) close();
          }}
        >
          <BookingFlow key={session} preset={preset} onClose={close} />
        </dialog>
      )}
    </BookingCtx.Provider>
  );
}

export function BookButton({
  preset,
  className,
  children,
  onClick,
}: {
  preset?: Preset;
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  const { open } = useContext(BookingCtx);
  return (
    <button
      type="button"
      className={className}
      onClick={() => {
        onClick?.();
        open(preset);
      }}
    >
      {children}
    </button>
  );
}

function BookingFlow({ preset, onClose }: { preset: Preset; onClose: () => void }) {
  const t = useTranslations("booking");
  const common = useTranslations("common");
  const services = useTranslations("services").raw("items") as Service[];
  const team = useTranslations("team").raw("members") as Member[];
  const f = useFormatter();
  const locale = useLocale();

  const [service, setService] = useState<number | null>(preset.service ?? null);
  const [barber, setBarber] = useState<number | null>(preset.barber ?? null);
  const [day, setDay] = useState<Date | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [touched, setTouched] = useState(false);
  const [code, setCode] = useState("");
  const headRef = useRef<HTMLHeadingElement>(null);

  const initial: Step = service === null ? 0 : barber === null ? 1 : 2;
  const [step, setStep] = useState<Step>(initial);
  const days = useMemo(() => openDays(8), []);

  useEffect(() => {
    headRef.current?.focus();
  }, [step]);

  const money = (n: number) => f.number(n, { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
  const dayLabel = (d: Date, opts: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat(locale, opts).format(d);

  const svc = service === null ? null : services[service];
  const emailOk = /^\S+@\S+\.\S+$/.test(email);
  const nameOk = name.trim().length > 1;

  function confirm() {
    setTouched(true);
    if (!nameOk || !emailOk) return;
    setCode(`NB-${Math.floor(1000 + Math.random() * 9000)}`);
    setStep(4);
  }

  const titles = [t("stepService"), t("stepBarber"), t("stepTime"), t("stepDetails"), t("doneTitle")];

  return (
    <div className="flex max-h-[100dvh] flex-col sm:max-h-[90dvh]">
      <div className="flex items-center gap-3 border-b border-line p-4 sm:px-6">
        {step > 0 && step < 4 ? (
          <button
            type="button"
            className="btn btn-secondary !min-h-12 !w-12 !p-0"
            aria-label={t("back")}
            onClick={() => setStep((s) => (s - 1) as Step)}
          >
            <ArrowLeft size={22} aria-hidden />
          </button>
        ) : null}
        <div className="min-w-0 flex-1">
          <p className="label text-cream-muted">
            {step < 4 ? t("progress", { n: step + 1, total: 4 }) : common("sample")}
          </p>
          <h2 id="book-title" ref={headRef} tabIndex={-1} className="font-display text-2xl font-black leading-tight outline-none">
            {titles[step]}
          </h2>
        </div>
        <button type="button" className="btn btn-secondary !min-h-12 !w-12 !p-0" aria-label={t("close")} onClick={onClose}>
          <X size={22} aria-hidden />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        {step === 0 && (
          <ul className="grid gap-3">
            {services.map((s, i) => (
              <li key={s.name}>
                <button
                  type="button"
                  className="book-option"
                  onClick={() => {
                    setService(i);
                    setStep(barber === null ? 1 : 2);
                  }}
                >
                  <span className="flex-1">
                    <span className="block font-display text-xl font-bold">{s.name}</span>
                    <span className="block text-sm text-cream-muted">{common("min", { n: s.minutes })}</span>
                  </span>
                  <span className="price text-gold">{money(s.price)}</span>
                </button>
              </li>
            ))}
          </ul>
        )}

        {step === 1 && (
          <ul className="grid gap-3 sm:grid-cols-2">
            {team.map((m, i) => (
              <li key={m.name}>
                <button
                  type="button"
                  className="book-option h-full"
                  onClick={() => {
                    setBarber(i);
                    setDay(null);
                    setTime(null);
                    setStep(2);
                  }}
                >
                  <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-gold font-display text-2xl font-black text-coal" aria-hidden>
                    {m.name[0]}
                  </span>
                  <span className="flex-1">
                    <span className="block font-display text-xl font-bold">{m.name}</span>
                    <span className="block text-sm text-cream-muted">{m.specialty}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}

        {step === 2 && svc && barber !== null && (
          <div className="grid gap-6">
            <div role="radiogroup" aria-label={t("pickDay")} className="flex gap-2 overflow-x-auto pb-2">
              {days.map((d) => {
                const on = day && dayKey(day) === dayKey(d);
                return (
                  <button
                    key={dayKey(d)}
                    type="button"
                    role="radio"
                    aria-checked={!!on}
                    className="book-chip min-w-[68px] flex-col"
                    onClick={() => {
                      setDay(d);
                      setTime(null);
                    }}
                  >
                    <span className="label">{dayLabel(d, { weekday: "short" })}</span>
                    <span className="font-display text-2xl font-black leading-none">{d.getDate()}</span>
                    <span className="text-xs">{dayLabel(d, { month: "short" })}</span>
                  </button>
                );
              })}
            </div>
            {day ? (
              <div>
                <p className="label mb-3 text-cream-muted">{t("pickTime")}</p>
                <div role="radiogroup" aria-label={t("pickTime")} className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                  {slotsFor(day, barber, svc.minutes).map((s) => (
                    <button
                      key={s.label}
                      type="button"
                      role="radio"
                      aria-checked={time === s.label}
                      disabled={!s.free}
                      className="book-chip"
                      onClick={() => setTime(s.label)}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
                <p className="mt-3 text-sm text-cream-muted">{t("takenNote")}</p>
              </div>
            ) : (
              <p className="text-cream-muted">{t("pickDayHint")}</p>
            )}
          </div>
        )}

        {step === 3 && svc && barber !== null && day && time && (
          <div className="grid gap-6">
            <dl className="rounded-lg border-2 border-cream bg-coal-raised p-4">
              {[
                [t("sumService"), `${svc.name} · ${money(svc.price)}`],
                [t("sumBarber"), team[barber].name],
                [t("sumWhen"), `${dayLabel(day, { weekday: "long", day: "numeric", month: "long" })} · ${time}`],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4 py-1.5">
                  <dt className="text-cream-muted">{k}</dt>
                  <dd className="text-right font-bold">{v}</dd>
                </div>
              ))}
            </dl>
            <form
              className="grid gap-4"
              noValidate
              onSubmit={(e) => {
                e.preventDefault();
                confirm();
              }}
            >
              <label className="grid gap-1.5">
                <span className="font-bold">{t("name")}</span>
                <input
                  className="book-input"
                  autoComplete="off"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  aria-invalid={touched && !nameOk}
                />
                {touched && !nameOk && <span className="text-sm text-gold">{t("nameError")}</span>}
              </label>
              <label className="grid gap-1.5">
                <span className="font-bold">{t("email")}</span>
                <input
                  className="book-input"
                  type="email"
                  autoComplete="off"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  aria-invalid={touched && !emailOk}
                />
                {touched && !emailOk && <span className="text-sm text-gold">{t("emailError")}</span>}
              </label>
              <p className="text-sm text-cream-muted">{t("demoNote")}</p>
              <button type="submit" className="btn btn-primary">
                {t("confirm")}
              </button>
            </form>
          </div>
        )}

        {step === 4 && svc && barber !== null && day && time && (
          <div className="grid gap-5" role="status">
            <span className="flex size-14 items-center justify-center rounded-full bg-gold text-coal">
              <Check size={32} aria-hidden />
            </span>
            <p className="text-lg">{t("doneBody", { name: name.trim().split(" ")[0], barber: team[barber].name })}</p>
            <dl className="rounded-lg border-2 border-cream bg-coal-raised p-4">
              {[
                [t("code"), code],
                [t("sumService"), svc.name],
                [t("sumBarber"), team[barber].name],
                [t("sumWhen"), `${dayLabel(day, { weekday: "long", day: "numeric", month: "long" })} · ${time}`],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4 py-1.5">
                  <dt className="text-cream-muted">{k}</dt>
                  <dd className="text-right font-bold">{v}</dd>
                </div>
              ))}
            </dl>
            <p className="text-sm text-cream-muted">{t("demoNote")}</p>
            <button type="button" className="btn btn-primary" onClick={onClose}>
              {t("done")}
            </button>
          </div>
        )}
      </div>

      {step === 2 && (
        <div className="border-t border-line p-4 sm:px-6">
          <button type="button" className="btn btn-primary w-full" disabled={!time} onClick={() => setStep(3)}>
            {t("next")}
          </button>
        </div>
      )}
    </div>
  );
}
