import type { Booking } from "./store";

export const pad = (n: number) => String(n).padStart(2, "0");
export const dayKey = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
export const fromKey = (k: string) => {
  const [y, m, d] = k.split("-").map(Number);
  return new Date(y, m - 1, d);
};
export const toMin = (t: string) => Number(t.slice(0, 2)) * 60 + Number(t.slice(3));
export const toLabel = (m: number) => `${pad(Math.floor(m / 60))}:${pad(m % 60)}`;

/** Sunday and Monday are closed; Saturday closes at 17:00. */
export const closeHour = (d: Date) => (d.getDay() === 6 ? 17 : d.getDay() >= 2 && d.getDay() <= 5 ? 19 : 0);

function hash(s: string) {
  let h = 2166136261;
  for (const ch of s) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  return h >>> 0;
}

/** Deterministic fake "already booked" so a day looks lived-in but never changes between renders. */
export const taken = (day: string, barber: number, slot: string) => hash(`${day}|${barber}|${slot}`) % 100 < 32;

export function openDays(count: number) {
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

/** Minutes covered by real (user-made) bookings for one barber on one day. */
function busyByReal(day: string, barber: number, bookings: Booking[], durations: number[]) {
  const busy = new Set<number>();
  for (const b of bookings) {
    if (b.day !== day || b.barber !== barber) continue;
    for (let m = toMin(b.time); m < toMin(b.time) + durations[b.service]; m += 30) busy.add(m);
  }
  return busy;
}

export function slotsFor(day: Date, barber: number, minutes: number, bookings: Booking[], durations: number[]) {
  const key = dayKey(day);
  const close = closeHour(day) * 60;
  const now = new Date();
  const nowMin = dayKey(now) === key ? now.getHours() * 60 + now.getMinutes() : -1;
  const real = busyByReal(key, barber, bookings, durations);
  const out: { label: string; free: boolean }[] = [];
  for (let m = 9 * 60; m + minutes <= close; m += 30) {
    let free = m > nowMin && !taken(key, barber, toLabel(m));
    for (let x = m; x < m + minutes; x += 30) if (real.has(x)) free = false;
    out.push({ label: toLabel(m), free });
  }
  return out;
}

/** Simulated walk-in clients: roughly half have a plan (index into the plans list), the rest none. */
export const simPlan = (client: string, planCount: number): number | null => {
  const h = hash(`${client}|plan`);
  return h % 100 < 55 ? (h >>> 8) % planCount : null;
};

const CLIENTS = ["Lucas M.", "Pedro A.", "Marcos V.", "Diego R.", "Felipe S.", "André L.", "Gustavo P.", "Caio T.", "Henrique B.", "Vitor C."];

export type Appt = { time: string; client: string; service: number; real: boolean; id?: string };

/** The barber's day: simulated walk-ins plus anything booked through the client side. */
export function dayAppointments(day: Date, barber: number, bookings: Booking[], serviceCount: number): Appt[] {
  const key = dayKey(day);
  const close = closeHour(day) * 60;
  const out: Appt[] = [];
  const real = bookings.filter((b) => b.day === key && b.barber === barber);
  for (const b of real) out.push({ time: b.time, client: b.name, service: b.service, real: true, id: b.id });
  for (let m = 9 * 60; m < close; m += 30) {
    const label = toLabel(m);
    if (!taken(key, barber, label)) continue;
    if (out.some((a) => Math.abs(toMin(a.time) - m) < 30)) continue;
    const h = hash(`${key}|${barber}|${label}|who`);
    out.push({ time: label, client: CLIENTS[h % CLIENTS.length], service: (h >>> 8) % serviceCount, real: false });
  }
  return out.sort((a, b) => a.time.localeCompare(b.time));
}
