// Simulated payment provider. It mirrors Stripe's published test cards and never talks to a network.
// Only the test numbers below are accepted, so a real card number can never be "charged" or kept.
import type { Quote } from "./pricing";

export type DeclineReason = "card_declined" | "insufficient_funds" | "expired_card" | "invalid_card";
export type Card = { number: unknown; exp: unknown; cvc: unknown };
export type Result =
  | { status: "succeeded"; orderId: string; paymentId: string }
  | { status: "failed"; reason: DeclineReason };

const OUTCOMES: Record<string, "ok" | DeclineReason> = {
  "4242424242424242": "ok",
  "5555555555554444": "ok",
  "4000000000000002": "card_declined",
  "4000000000009995": "insufficient_funds",
  "4000000000000069": "expired_card",
};

export function checkCard(card: Card, now = new Date()): DeclineReason | "ok" {
  const number = typeof card.number === "string" ? card.number.replace(/[\s-]/g, "") : "";
  const cvc = typeof card.cvc === "string" ? card.cvc : "";
  const exp = typeof card.exp === "string" ? /^(\d{2})\s*\/\s*(\d{2})$/.exec(card.exp.trim()) : null;
  if (!/^\d{3,4}$/.test(cvc) || !exp) return "invalid_card";
  const month = Number(exp[1]);
  const year = 2000 + Number(exp[2]);
  if (month < 1 || month > 12) return "invalid_card";
  if (year < now.getFullYear() || (year === now.getFullYear() && month < now.getMonth() + 1)) return "expired_card";
  return Object.hasOwn(OUTCOMES, number) ? OUTCOMES[number] : "invalid_card";
}

const id = (prefix: string) => `${prefix}_${crypto.randomUUID().replace(/-/g, "").slice(0, 12)}`;

export function charge(quote: Quote, card: Card | null, now = new Date()): Result {
  if (quote.method === "card") {
    const verdict = card ? checkCard(card, now) : "invalid_card";
    if (verdict !== "ok") return { status: "failed", reason: verdict };
  }
  // Pix is simulated as an instant success.
  return { status: "succeeded", orderId: id("NB").toUpperCase(), paymentId: id("sim_pi") };
}
