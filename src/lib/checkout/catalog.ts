// Server-authoritative catalog. Prices live here, in integer centavos (BRL).
// The browser only ever sends item ids; names and copy come from messages/*.json by position.
export const CURRENCY = "BRL";

export const SERVICES = [
  { id: "haircut", index: 0, cents: 6000 },
  { id: "tint", index: 1, cents: 12000 },
  { id: "beard", index: 2, cents: 4500 },
  { id: "shave", index: 3, cents: 5000 },
  { id: "combo", index: 4, cents: 9500 },
] as const;

export const PLANS = [
  { id: "hair", index: 0, cents: 12900 },
  { id: "beard", index: 1, cents: 9900 },
  { id: "hair-beard", index: 2, cents: 19900 },
] as const;

// A booking is secured with a deposit of 30% of the service price, rounded up to the next centavo.
export const DEPOSIT_PERCENT = 30;
export const MAX_QTY = 3;
export const MAX_LINES = 5;

// Sample promo codes. Percent off, subscriptions only.
export const PROMOS: Record<string, { percent: number }> = {
  WELCOME10: { percent: 10 },
};

export const METHODS = ["card", "pix"] as const;
export type Method = (typeof METHODS)[number];
