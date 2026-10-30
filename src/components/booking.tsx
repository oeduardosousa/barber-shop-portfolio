"use client";

import { ArrowLeft, CalendarCheck, Check, UserPlus, UserRound, X } from "lucide-react";
import Image from "next/image";
import { useFormatter, useLocale, useTranslations } from "next-intl";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "@/i18n/navigation";
import { SERVICES } from "@/lib/checkout/catalog";
import { dayKey, fromKey, openDays, slotsFor } from "@/lib/schedule";
import { PORTRAITS } from "@/lib/team";
import { store, useDemoData } from "@/lib/store";

type Preset = { service?: number; barber?: number };
type View = "book" | "mine" | "account";
type Ctx = { open: (preset?: Preset) => void; openMine: () => void; openAccount: () => void };

const BookingCtx = createContext<Ctx>({ open: () => {}, openMine: () => {}, openAccount: () => {} });

type Service = { name: string; desc: string; minutes: number; price: number };
type Member = { name: string; specialty: string };
type Step = 0 | 1 | 2 | 3 | 4;

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [mounted, setMounted] = useState(false);
  const [preset, setPreset] = useState<Preset>({});
  const [view, setView] = useState<View>("book");
  const [session, setSession] = useState(0);

  const show = useCallback((v: View, p: Preset = {}) => {
    setPreset(p);
    setView(v);
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
  const value = useMemo(
    () => ({ open: (p?: Preset) => show("book", p), openMine: () => show("mine"), openAccount: () => show("account") }),
    [show],
  );

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
          {view === "book" ? (
            <BookingFlow key={session} preset={preset} onClose={close} onMine={() => setView("mine")} />
          ) : view === "mine" ? (
            <MyBookings key={session} onClose={close} onBook={() => show("book")} />
          ) : (
            <AccountPanel key={session} onClose={close} onMine={() => setView("mine")} />
          )}
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

export function MineButton({ className, onClick, compact }: { className?: string; onClick?: () => void; compact?: boolean }) {
  const t = useTranslations("account");
  const { openMine } = useContext(BookingCtx);
  const { bookings } = useDemoData();
  return (
    <button
      type="button"
      className={className}
      aria-label={t("mine")}
      onClick={() => {
        onClick?.();
        openMine();
      }}
    >
      <CalendarCheck size={20} aria-hidden />
      <span className={compact ? "hidden whitespace-nowrap xl:inline" : undefined}>{t("mine")}</span>
      {bookings.length > 0 && (
        <span className="ml-1 rounded-full bg-gold px-2 py-0.5 text-xs font-black text-coal">{bookings.length}</span>
      )}
    </button>
  );
}

/** Header button: "Create account" while signed out, the client's first name once signed in. */
export function AccountButton({ className, onClick }: { className?: string; onClick?: () => void }) {
  const t = useTranslations("account");
  const { openAccount } = useContext(BookingCtx);
  const { account } = useDemoData();
  const user = account?.signedIn ? account : null;
  const Icon = user ? UserRound : UserPlus;
  return (
    <button
      type="button"
      className={className}
      onClick={() => {
        onClick?.();
        openAccount();
      }}
    >
      <Icon size={20} aria-hidden />
      <span className="whitespace-nowrap">{user ? user.name.split(" ")[0] : t("createButton")}</span>
    </button>
  );
}

function Shell({
  eyebrow,
  title,
  onBack,
  onClose,
  footer,
  children,
}: {
  eyebrow: string;
  title: string;
  onBack?: () => void;
  onClose: () => void;
  footer?: React.ReactNode;
  children: React.ReactNode;
}) {
  const t = useTranslations("booking");
  const headRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    headRef.current?.focus();
  }, [title]);
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 border-b border-line p-4 sm:px-6">
        {onBack && (
          <button type="button" className="btn btn-secondary !min-h-12 !w-12 !p-0" aria-label={t("back")} onClick={onBack}>
            <ArrowLeft size={22} aria-hidden />
          </button>
        )}
        <div className="min-w-0 flex-1">
          <p className="label text-cream-muted">{eyebrow}</p>
          <h2 id="book-title" ref={headRef} tabIndex={-1} className="font-display text-2xl font-black leading-tight outline-none">
            {title}
          </h2>
        </div>
        <button type="button" className="btn btn-secondary !min-h-12 !w-12 !p-0" aria-label={t("close")} onClick={onClose}>
          <X size={22} aria-hidden />
        </button>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6">{children}</div>
      {footer && <div className="border-t border-line p-4 sm:px-6">{footer}</div>}
    </div>
  );
}

function AccountForm({ onDone }: { onDone: () => void }) {
  const t = useTranslations("account");
  const { account } = useDemoData();
  const [mode, setMode] = useState<"create" | "login">(account ? "login" : "create");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [touched, setTouched] = useState(false);
  const [wrong, setWrong] = useState(false);

  const nameOk = name.trim().length > 1;
  const passOk = password.length >= 4;

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setTouched(true);
    if (!nameOk || !passOk) return;
    if (mode === "create") {
      store.createAccount(name.trim(), password);
      onDone();
    } else if (store.signIn(name, password)) onDone();
    else setWrong(true);
  }

  return (
    <form className="grid gap-4" noValidate onSubmit={submit}>
      <p className="font-display text-xl font-bold">{mode === "create" ? t("createTitle") : t("loginTitle")}</p>
      <label className="grid gap-1.5">
        <span className="font-bold">{t("name")}</span>
        <input className="book-input" autoComplete="off" value={name} onChange={(e) => setName(e.target.value)} aria-invalid={touched && !nameOk} />
        {touched && !nameOk && <span className="text-sm text-gold">{t("nameError")}</span>}
      </label>
      <label className="grid gap-1.5">
        <span className="font-bold">{t("password")}</span>
        <input
          className="book-input"
          type="password"
          autoComplete="off"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setWrong(false);
          }}
          aria-invalid={(touched && !passOk) || wrong}
        />
        {touched && !passOk && <span className="text-sm text-gold">{t("passwordError")}</span>}
        {wrong && <span className="text-sm text-gold">{t("wrong")}</span>}
      </label>
      <p className="text-sm text-cream-muted">{t("demoNote")}</p>
      <button type="submit" className="btn btn-primary">
        {mode === "create" ? t("create") : t("signIn")}
      </button>
      {account && (
        <button
          type="button"
          className="link justify-center"
          onClick={() => {
            setMode(mode === "create" ? "login" : "create");
            setWrong(false);
          }}
        >
          {mode === "create" ? t("haveAccount") : t("newAccount")}
        </button>
      )}
    </form>
  );
}

function AccountPanel({ onClose, onMine }: { onClose: () => void; onMine: () => void }) {
  const t = useTranslations("account");
  const common = useTranslations("common");
  const plans = useTranslations("plans").raw("items") as { name: string }[];
  const { account, plan } = useDemoData();
  const user = account?.signedIn ? account : null;

  return (
    <Shell eyebrow={common("sample")} title={user ? t("panelTitle") : account ? t("loginTitle") : t("createTitle")} onClose={onClose}>
      {!user ? (
        <AccountForm onDone={() => {}} />
      ) : (
        <div className="grid gap-5">
          <p className="text-cream-muted">{t("signedAs", { name: user.name })}</p>
          <div className="rounded-lg border-2 border-cream bg-coal-raised p-4">
            <p className="label text-cream-muted">{t("planLabel")}</p>
            <p className="mt-1 font-display text-2xl font-black text-gold">{plan === null ? t("noPlan") : plans[plan].name}</p>
            {plan === null && (
              <Link href="/#plans" className="link mt-2" onClick={onClose}>
                {t("seePlans")}
              </Link>
            )}
          </div>
          <button type="button" className="btn btn-primary gap-2" onClick={onMine}>
            <CalendarCheck size={20} aria-hidden />
            {t("mine")}
          </button>
          <button type="button" className="link justify-self-start" onClick={store.signOut}>
            {t("signOut")}
          </button>
        </div>
      )}
    </Shell>
  );
}

function BookingFlow({ preset, onClose, onMine }: { preset: Preset; onClose: () => void; onMine: () => void }) {
  const t = useTranslations("booking");
  const common = useTranslations("common");
  const acc = useTranslations("account");
  const services = useTranslations("services").raw("items") as Service[];
  const team = useTranslations("team").raw("members") as Member[];
  const f = useFormatter();
  const locale = useLocale();
  const { account, bookings } = useDemoData();
  const user = account?.signedIn ? account : null;

  const [service, setService] = useState<number | null>(preset.service ?? null);
  const [barber, setBarber] = useState<number | null>(preset.barber ?? null);
  const [day, setDay] = useState<Date | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [step, setStep] = useState<Step>(preset.service === undefined ? 0 : preset.barber === undefined ? 1 : 2);
  const days = useMemo(() => openDays(8), []);
  const durations = useMemo(() => services.map((s) => s.minutes), [services]);

  const money = (n: number) => f.number(n, { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
  const dayLabel = (d: Date, opts: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat(locale, opts).format(d);
  const svc = service === null ? null : services[service];

  function confirm() {
    if (!user || service === null || barber === null || !day || !time) return;
    setCode(store.addBooking({ service, barber, day: dayKey(day), time, name: user.name }).code);
    setStep(4);
  }

  const titles = [t("stepService"), t("stepBarber"), t("stepTime"), user ? t("stepConfirm") : t("stepAccount"), t("doneTitle")];
  const when = day && time ? `${dayLabel(day, { weekday: "long", day: "numeric", month: "long" })} · ${time}` : "";
  const rows = (extra: string[][]) => (
    <dl className="rounded-lg border-2 border-cream bg-coal-raised p-4">
      {extra.map(([k, v]) => (
        <div key={k} className="flex justify-between gap-4 py-1.5">
          <dt className="text-cream-muted">{k}</dt>
          <dd className="text-right font-bold">{v}</dd>
        </div>
      ))}
    </dl>
  );

  return (
    <Shell
      eyebrow={step < 4 ? t("progress", { n: step + 1, total: 4 }) : common("sample")}
      title={titles[step]}
      onBack={step > 0 && step < 4 ? () => setStep((s) => (s - 1) as Step) : undefined}
      onClose={onClose}
      footer={
        step === 2 ? (
          <button type="button" className="btn btn-primary w-full" disabled={!time} onClick={() => setStep(3)}>
            {t("next")}
          </button>
        ) : undefined
      }
    >
      {step === 0 && (
        <ul className="grid gap-3">
          {services.map((s, i) => (
            <li key={s.name}>
              <button
                type="button"
                className="book-option"
                onClick={() => {
                  setService(i);
                  setTime(null);
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
                <Image
                  src={PORTRAITS[i % PORTRAITS.length]}
                  alt=""
                  width={72}
                  height={72}
                  className="size-[72px] shrink-0 rounded-full border-2 border-gold object-cover object-[50%_20%]"
                />
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
                {slotsFor(day, barber, svc.minutes, bookings, durations).map((s) => (
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
          {rows([
            [t("sumService"), `${svc.name} · ${money(svc.price)}`],
            [t("sumBarber"), team[barber].name],
            [t("sumWhen"), when],
          ])}
          {user ? (
            <div className="grid gap-4">
              <p className="text-cream-muted">{acc("signedAs", { name: user.name })}</p>
              <button type="button" className="btn btn-primary" onClick={confirm}>
                {t("confirm")}
              </button>
              <p className="text-sm text-cream-muted">{t("demoNote")}</p>
            </div>
          ) : (
            <AccountForm onDone={() => {}} />
          )}
        </div>
      )}

      {step === 4 && svc && barber !== null && day && time && (
        <div className="grid gap-5" role="status">
          <span className="flex size-14 items-center justify-center rounded-full bg-gold text-coal">
            <Check size={32} aria-hidden />
          </span>
          <p className="text-lg">{t("doneBody", { name: (user?.name ?? "").split(" ")[0], barber: team[barber].name })}</p>
          {rows([
            [t("code"), code],
            [t("sumService"), svc.name],
            [t("sumBarber"), team[barber].name],
            [t("sumWhen"), when],
          ])}
          <p className="text-sm text-cream-muted">{t("demoNote")}</p>
          <Link href={{ pathname: "/checkout", query: { service: SERVICES[service!].id } }} className="btn btn-primary">
            {t("payDeposit")}
          </Link>
          <div className="grid gap-3 sm:grid-cols-2">
            <button type="button" className="btn btn-secondary" onClick={onMine}>
              {acc("mine")}
            </button>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              {t("done")}
            </button>
          </div>
        </div>
      )}
    </Shell>
  );
}

function MyBookings({ onClose, onBook }: { onClose: () => void; onBook: () => void }) {
  const t = useTranslations("account");
  const common = useTranslations("common");
  const services = useTranslations("services").raw("items") as Service[];
  const team = useTranslations("team").raw("members") as Member[];
  const f = useFormatter();
  const locale = useLocale();
  const { account, bookings } = useDemoData();
  const user = account?.signedIn ? account : null;
  const mine = user
    ? bookings.filter((b) => b.name === user.name).sort((a, b) => (a.day + a.time).localeCompare(b.day + b.time))
    : [];

  return (
    <Shell eyebrow={common("sample")} title={user ? t("mine") : t("loginTitle")} onClose={onClose}>
      {!user ? (
        <AccountForm onDone={() => {}} />
      ) : (
        <div className="grid gap-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-cream-muted">{t("signedAs", { name: user.name })}</p>
            <button type="button" className="link" onClick={store.signOut}>
              {t("signOut")}
            </button>
          </div>
          {mine.length === 0 ? (
            <p className="rounded-lg border-2 border-line p-4 text-cream-muted">{t("mineEmpty")}</p>
          ) : (
            <ul className="grid gap-3">
              {mine.map((b) => (
                <li key={b.id} className="rounded-lg border-2 border-cream bg-coal-raised p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-display text-xl font-bold">{services[b.service].name}</p>
                      <p className="text-cream-muted">
                        {new Intl.DateTimeFormat(locale, { weekday: "long", day: "numeric", month: "long" }).format(fromKey(b.day))} · {b.time}
                      </p>
                      <p className="text-cream-muted">
                        {team[b.barber].name} · {f.number(services[b.service].price, { style: "currency", currency: "BRL", maximumFractionDigits: 0 })}
                      </p>
                    </div>
                    <span className="label shrink-0 text-gold">{b.code}</span>
                  </div>
                  <button type="button" className="link mt-1" onClick={() => store.cancel(b.id)}>
                    {t("cancel")}
                  </button>
                </li>
              ))}
            </ul>
          )}
          <button type="button" className="btn btn-primary" onClick={onBook}>
            {t("bookAnother")}
          </button>
        </div>
      )}
    </Shell>
  );
}
