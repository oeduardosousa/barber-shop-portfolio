"use client";

import { useFormatter, useLocale, useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import { SHOP_NAME } from "@/lib/brand";
import { closeHour, dayAppointments, dayKey, openDays, type Appt } from "@/lib/schedule";
import { useDemoData } from "@/lib/store";
import { UtilityBar } from "./Header";
import { setRole, ViewEnter } from "./role-gate";

type Service = { name: string; minutes: number; price: number };
type Member = { name: string; specialty: string };
type Tab = "agenda" | "revenue";

export function BarberApp() {
  const t = useTranslations("barber");
  const common = useTranslations("common");
  const services = useTranslations("services").raw("items") as Service[];
  const team = useTranslations("team").raw("members") as Member[];
  const f = useFormatter();
  const locale = useLocale();
  const { bookings } = useDemoData();
  const [tab, setTab] = useState<Tab>("agenda");
  const [barber, setBarber] = useState(0);
  const days = useMemo(() => openDays(8), []);
  const [dayIdx, setDayIdx] = useState(0);
  const day = days[dayIdx];

  useEffect(() => setRole("barber"), []);

  const money = (n: number) => f.number(n, { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
  const fmt = (d: Date, o: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat(locale, o).format(d);
  const earned = (list: Appt[]) => list.reduce((sum, a) => sum + services[a.service].price, 0);
  const dayOf = (d: Date, b: number) => dayAppointments(d, b, bookings, services.length);

  const appts = dayOf(day, barber);
  const revenue = earned(appts);

  // Shop-wide numbers: every barber, for the chosen day and across all listed days.
  const perBarber = team.map((_, b) => {
    const list = dayOf(day, b);
    return { count: list.length, revenue: earned(list) };
  });
  const perDay = days.map((d) => team.reduce((sum, _, b) => sum + earned(dayOf(d, b)), 0));
  const shopDay = perBarber.reduce((s, x) => s + x.revenue, 0);
  const shopCount = perBarber.reduce((s, x) => s + x.count, 0);
  const shopRange = perDay.reduce((s, x) => s + x, 0);
  const maxBarber = Math.max(1, ...perBarber.map((x) => x.revenue));
  const maxDay = Math.max(1, ...perDay);

  // Every half hour of the day, with the appointment (if any) that starts there.
  const rows: { time: string; appt?: Appt }[] = [];
  for (let m = 9 * 60; m < closeHour(day) * 60; m += 30) {
    const time = `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
    rows.push({ time, appt: appts.find((a) => a.time === time) });
  }

  return (
    <>
      <div className="stripe" aria-hidden />
      <UtilityBar current="barber" always />
      <header className="sticky top-0 z-40 border-b border-line bg-coal">
        <div className="flex h-[76px] items-center gap-6 px-4 sm:px-6 xl:h-[92px] xl:px-10 2xl:px-14">
          <span className="font-display text-xl font-black tracking-tight sm:text-2xl xl:text-[1.75rem]">{SHOP_NAME}</span>
          <span className="label hidden text-cream-muted sm:inline">{t("tag")}</span>
        </div>
      </header>

      <main className="wrap py-8 lg:py-12">
        <ViewEnter />
        <p className="label mb-2 text-cream-muted">{common("sample")}</p>
        <h1 className="text-headline">{t("title")}</h1>
        <p className="mt-2 max-w-[60ch] text-cream-muted">{t("note")}</p>

        <div role="group" aria-label={t("viewLabel")} className="lang lang-wide mt-8">
          <span aria-hidden className="lang-thumb" style={{ transform: tab === "revenue" ? "translateX(100%)" : "none" }} />
          {(["agenda", "revenue"] as const).map((k) => (
            <button key={k} type="button" aria-pressed={tab === k} onClick={() => setTab(k)}>
              {k === "agenda" ? t("tabAgenda") : t("tabRevenue")}
            </button>
          ))}
        </div>

        {tab === "agenda" && (
          <div role="radiogroup" aria-label={t("barberLabel")} className="mt-6 flex flex-wrap gap-2">
            {team.map((m, i) => (
              <button key={m.name} type="button" role="radio" aria-checked={barber === i} className="book-chip !px-5" onClick={() => setBarber(i)}>
                {m.name}
              </button>
            ))}
          </div>
        )}

        {tab === "agenda" && (
          <div role="radiogroup" aria-label={t("dayLabel")} className="mt-4 flex gap-2 overflow-x-auto pb-2">
            {days.map((d, i) => (
              <button key={dayKey(d)} type="button" role="radio" aria-checked={dayIdx === i} className="book-chip min-w-[68px] flex-col" onClick={() => setDayIdx(i)}>
                <span className="label">{fmt(d, { weekday: "short" })}</span>
                <span className="font-display text-2xl font-black leading-none">{d.getDate()}</span>
                <span className="text-xs">{fmt(d, { month: "short" })}</span>
              </button>
            ))}
          </div>
        )}

        {tab === "agenda" ? (
          <div key="agenda" className="panel-in">
            <dl className="mt-6 grid grid-cols-2 gap-3">
              {[
                [t("statAppts"), String(appts.length)],
                [t("statRevenue"), money(revenue)],
              ].map(([k, v]) => (
                <div key={k} className="rounded-lg border-2 border-line bg-coal-raised p-4">
                  <dt className="label text-cream-muted">{k}</dt>
                  <dd className="mt-2 font-display text-3xl font-black text-gold">{v}</dd>
                </div>
              ))}
            </dl>

            <h2 className="mt-10 font-display text-2xl font-black">
              {team[barber].name} · {fmt(day, { weekday: "long", day: "numeric", month: "long" })}
            </h2>
            <ul className="mt-4 border-t-2 border-cream">
              {rows.map(({ time, appt }) => (
                <li key={time} className="flex items-center gap-4 border-b border-line py-3">
                  <span className="w-14 shrink-0 font-display text-lg font-bold">{time}</span>
                  {appt ? (
                    <div className="flex flex-1 flex-wrap items-center justify-between gap-x-4 gap-y-1 rounded-lg border-2 border-cream bg-coal-raised px-4 py-2">
                      <div>
                        <p className="font-bold">{appt.client}</p>
                        <p className="text-sm text-cream-muted">
                          {services[appt.service].name} · {common("min", { n: services[appt.service].minutes })}
                        </p>
                      </div>
                      <span className="price !text-xl text-gold">{money(services[appt.service].price)}</span>
                    </div>
                  ) : (
                    <span className="flex-1 px-4 text-cream-muted">{t("free")}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div key="revenue" className="panel-in">
            <dl className="mt-6 grid gap-3 sm:grid-cols-3">
              {[
                [t("revDay"), money(shopDay)],
                [t("revRange"), money(shopRange)],
                [t("revAppts"), String(shopCount)],
              ].map(([k, v]) => (
                <div key={k} className="rounded-lg border-2 border-line bg-coal-raised p-4">
                  <dt className="label text-cream-muted">{k}</dt>
                  <dd className="mt-2 font-display text-3xl font-black text-gold">{v}</dd>
                </div>
              ))}
            </dl>

            <h2 className="mt-10 font-display text-2xl font-black">{t("revByDay")}</h2>
            <div role="group" aria-label={t("revByDay")} className="mt-4 grid grid-cols-8 gap-1.5 sm:gap-3">
              {days.map((d, i) => (
                <button
                  key={dayKey(d)}
                  type="button"
                  aria-pressed={dayIdx === i}
                  aria-label={`${fmt(d, { weekday: "long", day: "numeric", month: "long" })}: ${money(perDay[i])}`}
                  className="bar-col"
                  onClick={() => setDayIdx(i)}
                >
                  <span className="bar-track">
                    <span className="bar-fill-v" style={{ transform: `scaleY(${perDay[i] / maxDay})` }} />
                  </span>
                  <span className="label">{fmt(d, { weekday: "short" })}</span>
                  <span className="font-display text-lg font-black leading-none">{d.getDate()}</span>
                </button>
              ))}
            </div>

            <h2 className="mt-10 font-display text-2xl font-black">
              {t("revByBarber")} · {fmt(day, { weekday: "long", day: "numeric", month: "long" })}
            </h2>
            <ul className="mt-4 border-t-2 border-cream">
              {team.map((m, i) => (
                <li key={m.name} className="border-b border-line py-4">
                  <div className="flex items-baseline justify-between gap-4">
                    <p className="font-bold">{m.name}</p>
                    <p className="text-sm text-cream-muted">
                      {perBarber[i].count} · <span className="price !text-xl text-gold">{money(perBarber[i].revenue)}</span>
                    </p>
                  </div>
                  <div className="mt-2 h-3 overflow-hidden rounded-full bg-coal-raised">
                    <div className="bar-fill-h" style={{ transform: `scaleX(${perBarber[i].revenue / maxBarber})` }} />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </main>
    </>
  );
}
