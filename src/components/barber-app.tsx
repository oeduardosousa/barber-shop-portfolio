"use client";

import { useFormatter, useLocale, useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import { Link } from "@/i18n/navigation";
import { SHOP_NAME } from "@/lib/brand";
import { closeHour, dayAppointments, dayKey, openDays } from "@/lib/schedule";
import { useDemoData } from "@/lib/store";
import { LangSwitch } from "./Header";
import { setRole } from "./role-gate";

type Service = { name: string; minutes: number; price: number };
type Member = { name: string; specialty: string };

export function BarberApp() {
  const t = useTranslations("barber");
  const common = useTranslations("common");
  const services = useTranslations("services").raw("items") as Service[];
  const team = useTranslations("team").raw("members") as Member[];
  const f = useFormatter();
  const locale = useLocale();
  const { bookings } = useDemoData();
  const [barber, setBarber] = useState(0);
  const days = useMemo(() => openDays(8), []);
  const [dayIdx, setDayIdx] = useState(0);
  const day = days[dayIdx];

  useEffect(() => setRole("barber"), []);

  const appts = dayAppointments(day, barber, bookings, services.length);
  const revenue = appts.reduce((sum, a) => sum + services[a.service].price, 0);
  const fresh = appts.filter((a) => a.real).length;
  const money = (n: number) => f.number(n, { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
  const fmt = (d: Date, o: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat(locale, o).format(d);

  // Every half hour of the day, with the appointment (if any) that starts there.
  const rows: { time: string; appt?: (typeof appts)[number] }[] = [];
  for (let m = 9 * 60; m < closeHour(day) * 60; m += 30) {
    const time = `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
    rows.push({ time, appt: appts.find((a) => a.time === time) });
  }

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-line bg-coal">
        <div className="stripe" aria-hidden />
        <div className="wrap flex h-[64px] items-center justify-between gap-3">
          <span className="font-display text-xl font-black tracking-tight sm:text-2xl">{SHOP_NAME}</span>
          <div className="flex items-center gap-2 sm:gap-3">
            <LangSwitch />
            <Link href="/" className="btn btn-secondary !px-4 !text-sm" onClick={() => setRole("client")}>
              {t("clientView")}
            </Link>
          </div>
        </div>
      </header>

      <main className="wrap py-8 lg:py-12">
        <p className="label mb-2 text-cream-muted">{common("sample")}</p>
        <h1 className="text-headline">{t("title")}</h1>
        <p className="mt-2 max-w-[60ch] text-cream-muted">{t("note")}</p>

        <div role="radiogroup" aria-label={t("barberLabel")} className="mt-8 flex flex-wrap gap-2">
          {team.map((m, i) => (
            <button key={m.name} type="button" role="radio" aria-checked={barber === i} className="book-chip !px-5" onClick={() => setBarber(i)}>
              {m.name}
            </button>
          ))}
        </div>

        <div role="radiogroup" aria-label={t("dayLabel")} className="mt-4 flex gap-2 overflow-x-auto pb-2">
          {days.map((d, i) => (
            <button key={dayKey(d)} type="button" role="radio" aria-checked={dayIdx === i} className="book-chip min-w-[68px] flex-col" onClick={() => setDayIdx(i)}>
              <span className="label">{fmt(d, { weekday: "short" })}</span>
              <span className="font-display text-2xl font-black leading-none">{d.getDate()}</span>
              <span className="text-xs">{fmt(d, { month: "short" })}</span>
            </button>
          ))}
        </div>

        <dl className="mt-6 grid grid-cols-3 gap-3">
          {[
            [t("statAppts"), String(appts.length)],
            [t("statRevenue"), money(revenue)],
            [t("statNew"), String(fresh)],
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
                  <div className="flex items-center gap-3">
                    {appt.real && <span className="chip-sample">{t("viaSite")}</span>}
                    <span className="price !text-xl text-gold">{money(services[appt.service].price)}</span>
                  </div>
                </div>
              ) : (
                <span className="flex-1 px-4 text-cream-muted">{t("free")}</span>
              )}
            </li>
          ))}
        </ul>
      </main>
    </>
  );
}
