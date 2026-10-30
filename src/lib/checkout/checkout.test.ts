import { describe, expect, it } from "vitest";
import { depositCents, percentOff, priceOrder, type Quote } from "./pricing";
import { charge, checkCard } from "./sandbox";

const ok = (raw: unknown): Quote => {
  const r = priceOrder(raw);
  if (!r.ok) throw new Error(`expected ok, got ${r.errors.join(",")}`);
  return r.quote;
};
const errs = (raw: unknown) => {
  const r = priceOrder(raw);
  if (r.ok) throw new Error("expected errors");
  return r.errors;
};

describe("price calculation", () => {
  it("rounds the deposit up to the next centavo", () => {
    expect(depositCents(6000)).toBe(1800);
    expect(depositCents(4500)).toBe(1350);
    expect(depositCents(9999)).toBe(3000); // 2999.7 -> 3000
  });

  it("rounds a discount down", () => {
    expect(percentOff(12900, 10)).toBe(1290);
    expect(percentOff(9905, 10)).toBe(990);
  });

  it("prices a booking deposit", () => {
    const q = ok({ items: [{ kind: "service", id: "haircut" }], method: "card" });
    expect(q.mode).toBe("payment");
    expect(q.totalCents).toBe(1800);
  });

  it("multiplies by quantity and merges repeated lines", () => {
    const q = ok({
      items: [
        { kind: "service", id: "haircut", qty: 1 },
        { kind: "service", id: "haircut", qty: 1 },
        { kind: "service", id: "beard" },
      ],
      method: "pix",
    });
    expect(q.lines).toHaveLength(2);
    expect(q.subtotalCents).toBe(1800 * 2 + 1350);
    expect(q.totalCents).toBe(4950);
  });

  it("prices a plan as a subscription at its full monthly price", () => {
    const q = ok({ items: [{ kind: "plan", id: "hair-beard" }], method: "card" });
    expect(q.mode).toBe("subscription");
    expect(q.totalCents).toBe(19900);
  });

  it("applies a promo code to a plan, case-insensitively", () => {
    const q = ok({ items: [{ kind: "plan", id: "hair" }], method: "card", promo: " welcome10 " });
    expect(q.promo).toBe("WELCOME10");
    expect(q.discountCents).toBe(1290);
    expect(q.totalCents).toBe(12900 - 1290);
  });

  it("never lets total + discount drift from the subtotal", () => {
    for (const id of ["hair", "beard", "hair-beard"]) {
      const q = ok({ items: [{ kind: "plan", id }], method: "card", promo: "WELCOME10" });
      expect(q.totalCents + q.discountCents).toBe(q.subtotalCents);
      expect(Number.isInteger(q.totalCents)).toBe(true);
    }
  });
});

describe("order validation", () => {
  const plan = { kind: "plan", id: "hair" };
  const svc = { kind: "service", id: "haircut" };

  it("ignores prices and totals sent by the browser", () => {
    const q = ok({
      items: [{ kind: "service", id: "haircut", price: 1, unitCents: 1, totalCents: 1 }],
      method: "card",
      total: 1,
      totalCents: 1,
      amount: 1,
    });
    expect(q.totalCents).toBe(1800);
  });

  it("rejects non-object and empty bodies", () => {
    expect(errs(null)).toContain("invalid_body");
    expect(errs([])).toContain("invalid_body");
    expect(errs({ items: [], method: "card" })).toContain("empty_order");
    expect(errs({ method: "card" })).toContain("empty_order");
  });

  it("rejects unknown items and kinds", () => {
    expect(errs({ items: [{ kind: "service", id: "mullet" }], method: "card" })).toContain("unknown_item");
    expect(errs({ items: [{ kind: "gift", id: "haircut" }], method: "card" })).toContain("unknown_item");
    expect(errs({ items: [{ kind: "service", id: "__proto__" }], method: "card" })).toContain("unknown_item");
  });

  it("rejects bad quantities", () => {
    for (const qty of [0, -1, 1.5, 4, "2", null, NaN]) {
      expect(errs({ items: [{ ...svc, qty }], method: "card" })).toContain("invalid_quantity");
    }
    expect(errs({ items: [{ ...plan, qty: 2 }], method: "card" })).toContain("invalid_quantity");
    expect(errs({ items: [{ ...svc, qty: 2 }, { ...svc, qty: 2 }], method: "card" })).toContain("invalid_quantity");
  });

  it("limits the number of lines", () => {
    expect(errs({ items: Array(6).fill(svc), method: "card" })).toContain("too_many_items");
  });

  it("does not mix a plan with anything else", () => {
    expect(errs({ items: [plan, svc], method: "card" })).toContain("mixed_order");
    expect(errs({ items: [plan, { kind: "plan", id: "beard" }], method: "card" })).toContain("mixed_order");
  });

  it("validates the payment method", () => {
    expect(errs({ items: [svc], method: "bitcoin" })).toContain("invalid_method");
    expect(errs({ items: [svc] })).toContain("invalid_method");
    expect(errs({ items: [plan], method: "pix" })).toContain("method_not_allowed");
    expect(ok({ items: [svc], method: "pix" }).method).toBe("pix");
  });

  it("validates promo codes", () => {
    expect(errs({ items: [plan], method: "card", promo: "FREE100" })).toContain("invalid_promo");
    expect(errs({ items: [plan], method: "card", promo: "constructor" })).toContain("invalid_promo");
    expect(errs({ items: [plan], method: "card", promo: 10 })).toContain("invalid_promo");
    expect(errs({ items: [svc], method: "card", promo: "WELCOME10" })).toContain("promo_not_allowed");
  });
});

describe("sandbox provider", () => {
  const now = new Date("2026-10-29T12:00:00Z");
  const good = { number: "4242 4242 4242 4242", exp: "12/30", cvc: "123" };
  const quote = ok({ items: [{ kind: "service", id: "haircut" }], method: "card" });

  it("accepts the success test card", () => {
    expect(checkCard(good, now)).toBe("ok");
    const r = charge(quote, good, now);
    expect(r.status).toBe("succeeded");
  });

  it("declines with the matching reason for the failure test cards", () => {
    expect(checkCard({ ...good, number: "4000000000000002" }, now)).toBe("card_declined");
    expect(checkCard({ ...good, number: "4000000000009995" }, now)).toBe("insufficient_funds");
    expect(charge(quote, { ...good, number: "4000000000000002" }, now)).toEqual({ status: "failed", reason: "card_declined" });
  });

  it("refuses any number that is not a published test card", () => {
    expect(checkCard({ ...good, number: "4111111111111111" }, now)).toBe("invalid_card");
    expect(checkCard({ ...good, number: "constructor" }, now)).toBe("invalid_card");
  });

  it("checks expiry and cvc", () => {
    expect(checkCard({ ...good, exp: "09/26" }, now)).toBe("expired_card");
    expect(checkCard({ ...good, exp: "10/26" }, now)).toBe("ok");
    expect(checkCard({ ...good, exp: "13/30" }, now)).toBe("invalid_card");
    expect(checkCard({ ...good, exp: "soon" }, now)).toBe("invalid_card");
    expect(checkCard({ ...good, cvc: "1" }, now)).toBe("invalid_card");
  });

  it("fails a card payment with no card, and passes pix", () => {
    expect(charge(quote, null, now)).toEqual({ status: "failed", reason: "invalid_card" });
    const pix = ok({ items: [{ kind: "service", id: "haircut" }], method: "pix" });
    expect(charge(pix, null, now).status).toBe("succeeded");
  });
});
