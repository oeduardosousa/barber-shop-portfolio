import { CURRENCY, DEPOSIT_PERCENT, MAX_LINES, MAX_QTY, METHODS, PLANS, PROMOS, SERVICES, type Method } from "./catalog";

export type ErrorCode =
  | "invalid_body"
  | "empty_order"
  | "too_many_items"
  | "unknown_item"
  | "invalid_quantity"
  | "mixed_order"
  | "invalid_method"
  | "method_not_allowed"
  | "invalid_promo"
  | "promo_not_allowed";

export type Line = {
  kind: "service" | "plan";
  id: string;
  index: number;
  qty: number;
  unitCents: number;
  totalCents: number;
};

export type Quote = {
  currency: typeof CURRENCY;
  mode: "payment" | "subscription";
  lines: Line[];
  subtotalCents: number;
  discountCents: number;
  totalCents: number;
  promo: string | null;
  method: Method;
};

export type Parsed = { ok: true; quote: Quote } | { ok: false; errors: ErrorCode[] };

const isObj = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null && !Array.isArray(v);

export const depositCents = (priceCents: number) => Math.ceil((priceCents * DEPOSIT_PERCENT) / 100);
export const percentOff = (cents: number, percent: number) => Math.floor((cents * percent) / 100);

// Validates an untrusted order and prices it. Any price, total or amount sent by the browser is ignored:
// only item ids, quantities, method and promo code are read.
export function priceOrder(raw: unknown): Parsed {
  if (!isObj(raw)) return { ok: false, errors: ["invalid_body"] };
  const errors = new Set<ErrorCode>();

  const method = METHODS.find((m) => m === raw.method);
  if (!method) errors.add("invalid_method");

  if (!Array.isArray(raw.items) || raw.items.length === 0) return { ok: false, errors: ["empty_order", ...errors] };
  if (raw.items.length > MAX_LINES) return { ok: false, errors: ["too_many_items", ...errors] };

  const merged = new Map<string, Line>();
  for (const item of raw.items) {
    if (!isObj(item)) {
      errors.add("invalid_body");
      continue;
    }
    const qty = item.qty === undefined ? 1 : item.qty;
    const qtyOk = typeof qty === "number" && Number.isInteger(qty) && qty >= 1 && qty <= MAX_QTY;
    if (!qtyOk) errors.add("invalid_quantity");

    if (item.kind === "service") {
      const s = SERVICES.find((x) => x.id === item.id);
      if (!s) errors.add("unknown_item");
      else if (qtyOk) {
        const key = `service:${s.id}`;
        const nextQty = (merged.get(key)?.qty ?? 0) + (qty as number);
        if (nextQty > MAX_QTY) errors.add("invalid_quantity");
        const unitCents = depositCents(s.cents);
        merged.set(key, { kind: "service", id: s.id, index: s.index, qty: nextQty, unitCents, totalCents: unitCents * nextQty });
      }
    } else if (item.kind === "plan") {
      const p = PLANS.find((x) => x.id === item.id);
      if (!p) errors.add("unknown_item");
      else if (qty !== 1) errors.add("invalid_quantity");
      else merged.set(`plan:${p.id}`, { kind: "plan", id: p.id, index: p.index, qty: 1, unitCents: p.cents, totalCents: p.cents });
    } else {
      errors.add("unknown_item");
    }
  }

  const lines = [...merged.values()];
  const hasPlan = lines.some((l) => l.kind === "plan");
  // A subscription is bought on its own: one plan, nothing else.
  if (hasPlan && lines.length > 1) errors.add("mixed_order");

  const mode = hasPlan ? "subscription" : "payment";
  if (method === "pix" && mode === "subscription") errors.add("method_not_allowed");

  let promo: string | null = null;
  if (raw.promo !== undefined && raw.promo !== null && raw.promo !== "") {
    const code = typeof raw.promo === "string" ? raw.promo.trim().toUpperCase() : "";
    if (!Object.hasOwn(PROMOS, code)) errors.add("invalid_promo");
    else if (mode !== "subscription") errors.add("promo_not_allowed");
    else promo = code;
  }

  if (errors.size > 0 || !method) return { ok: false, errors: [...errors] };

  const subtotalCents = lines.reduce((sum, l) => sum + l.totalCents, 0);
  const discountCents = promo ? percentOff(subtotalCents, PROMOS[promo].percent) : 0;
  return {
    ok: true,
    quote: {
      currency: CURRENCY,
      mode,
      lines,
      subtotalCents,
      discountCents,
      totalCents: subtotalCents - discountCents,
      promo,
      method,
    },
  };
}
