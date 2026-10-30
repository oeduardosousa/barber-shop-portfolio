"use client";

import { useSyncExternalStore } from "react";

// Demo-only persistence: everything stays in this browser's localStorage.
export type Booking = { id: string; code: string; service: number; barber: number; day: string; time: string; name: string };
export type Account = { name: string; password: string; signedIn: boolean };

const KEY = "nb-demo";
const EVT = "nb-store";
type Data = { account: Account | null; bookings: Booking[] };
const EMPTY: Data = { account: null, bookings: [] };

let cache: Data = EMPTY;
let raw: string | null = null;

function read(): Data {
  try {
    const now = localStorage.getItem(KEY);
    if (now !== raw) {
      raw = now;
      cache = now ? { ...EMPTY, ...JSON.parse(now) } : EMPTY;
    }
  } catch {
    /* storage blocked: behave as empty */
  }
  return cache;
}

function write(next: Data) {
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    cache = next;
  }
  window.dispatchEvent(new Event(EVT));
}

function subscribe(cb: () => void) {
  window.addEventListener(EVT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(EVT, cb);
    window.removeEventListener("storage", cb);
  };
}

export function useDemoData(): Data {
  return useSyncExternalStore(subscribe, read, () => EMPTY);
}

export const store = {
  createAccount(name: string, password: string) {
    write({ ...read(), account: { name, password, signedIn: true } });
  },
  signIn(name: string, password: string) {
    const a = read().account;
    if (!a || a.name.toLowerCase() !== name.trim().toLowerCase() || a.password !== password) return false;
    write({ ...read(), account: { ...a, signedIn: true } });
    return true;
  },
  signOut() {
    const a = read().account;
    if (a) write({ ...read(), account: { ...a, signedIn: false } });
  },
  addBooking(b: Omit<Booking, "id" | "code">) {
    const id = `${Date.now()}`;
    const booking: Booking = { ...b, id, code: `NB-${Math.floor(1000 + Math.random() * 9000)}` };
    write({ ...read(), bookings: [...read().bookings, booking] });
    return booking;
  },
  cancel(id: string) {
    write({ ...read(), bookings: read().bookings.filter((b) => b.id !== id) });
  },
};
