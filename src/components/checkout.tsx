"use client";

import { Check, CircleAlert, Undo2 } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { Link } from "@/i18n/navigation";
import { store } from "@/lib/store";
import { DEPOSIT_PERCENT, PLANS, SERVICES, type Method } from "@/lib/checkout/catalog";
import type { ErrorCode, Quote } from "@/lib/checkout/pricing";

type Item = { kind: "service" | "plan"; id: string };
type Phase = "form" | "paying" | "success" | "failed" | "cancelled";
type Done = { orderId: string; paymentId: string; quote: Quote };

const TEST_CARDS = [
  { key: "fillOk", number: "4242 4242 4242 4242" },
  { key: "fillDecline", number: "4000 0000 0000 0002" },
  { key: "fillFunds", number: "4000 0000 0000 9995" },
] as const;

const groupCard = (v: string) => v.replace(/\D/g, "").slice(0, 16).replace(/(\d{4})(?=\d)/g, "$1 ");
const formatExp = (v: string) => {
  const d = v.replace(/\D/g, "").slice(0, 4);
  return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
};

export function Checkout({ item }: { item: Item | null }) {
  const t = useTranslations("checkout");
  const plans = useTranslations("plans").raw("items") as { name: string }[];
  const services = useTranslations("services").raw("items") as { name: string }[];
  const f = useFormatter();
  const headRef = useRef<HTMLHeadingElement>(null);

  const [qty, setQty] = useState(1);
  const [method, setMethod] = useState<Method>("card");
  const [promoInput, setPromoInput] = useState("");
  const [promo, setPromo] = useState("");
  const [card, setCard] = useState({ number: "", exp: "", cvc: "" });
  const [phase, setPhase] = useState<Phase>("form");
  const [quote, setQuote] = useState<Quote | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [reason, setReason] = useState("");
  const [done, setDone] = useState<Done | null>(null);

  const isPlan = item?.kind === "plan";
  const money = (cents: number) => f.number(cents / 100, { style: "currency", currency: "BRL" });
  const body = item ? { items: [{ ...item, qty: isPlan ? 1 : qty }], method, promo: promo || undefined } : null;
  const bodyKey = JSON.stringify(body);

  // The server prices the order; the browser only displays what comes back.
  useEffect(() => {
    if (!bodyKey || bodyKey === "null") return;
    const ctl = new AbortController();
    fetch("/api/checkout/quote", { method: "POST", headers: { "content-type": "application/json" }, body: bodyKey, signal: ctl.signal })
      .then((r) => r.json())
      .then((r: { ok: boolean; quote?: Quote; errors?: ErrorCode[] }) => {
        if (r.ok && r.quote) {
          setQuote(r.quote);
          setErrors([]);
        } else {
          setQuote(null);
          setErrors(r.errors ?? ["invalid_body"]);
        }
      })
      .catch((e) => {
        if (e.name !== "AbortError") setErrors(["network"]);
      });
    return () => ctl.abort();
  }, [bodyKey]);

  useEffect(() => {
    headRef.current?.focus();
  }, [phase]);

  async function pay(e: React.FormEvent) {
    e.preventDefault();
    if (!quote || phase === "paying") return;
    setPhase("paying");
    setReason("");
    try {
      const r = await fetch("/api/checkout/pay", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...body, card: method === "card" ? card : undefined }),
      });
      const data = await r.json();
      if (data.status === "succeeded") {
        setDone({ orderId: data.orderId, paymentId: data.paymentId, quote: data.quote });
        setCard({ number: "", exp: "", cvc: "" });
        if (item?.kind === "plan") store.setPlan(PLANS.find((x) => x.id === item.id)?.index ?? 0);
        setPhase("success");
      } else if (data.status === "failed") {
        setReason(data.reason);
        setPhase("failed");
      } else {
        setErrors(data.errors ?? ["invalid_body"]);
        setPhase("form");
      }
    } catch {
      setErrors(["network"]);
      setPhase("form");
    }
  }

  const catalog = item?.kind === "plan" ? PLANS : SERVICES;
  const name = item ? (item.kind === "plan" ? plans : services)[catalog.find((x) => x.id === item.id)?.index ?? 0]?.name : "";
  const lineLabel = item?.kind === "plan" ? t("planLine", { name }) : t("depositLine", { name });

  const Banner = (
    <p className="chip-sample w-fit" role="note">
      {t("testBanner")}
    </p>
  );

  if (!item) {
    return (
      <div className="grid max-w-xl gap-5">
        <h1 ref={headRef} tabIndex={-1} className="text-headline outline-none">
          {t("emptyTitle")}
        </h1>
        <p className="text-cream-muted">{t("emptyBody")}</p>
        <Link href="/#plans" className="btn btn-primary w-fit">
          {t("seePlans")}
        </Link>
      </div>
    );
  }

  if (phase === "success" && done) {
    return (
      <div className="grid max-w-xl gap-6" role="status">
        <span className="flex size-14 items-center justify-center rounded-full bg-gold text-coal">
          <Check size={32} aria-hidden />
        </span>
        <h1 ref={headRef} tabIndex={-1} className="text-headline outline-none">
          {t("successTitle")}
        </h1>
        <p className="text-lg">{t("successBody")}</p>
        <dl className="rounded-lg border-2 border-cream bg-coal-raised p-4">
          {[
            [t("order"), done.orderId],
            [t("payment"), done.paymentId],
            [lineLabel, money(done.quote.totalCents)],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between gap-4 py-1.5">
              <dt className="text-cream-muted">{k}</dt>
              <dd className="break-all text-right font-bold">{v}</dd>
            </div>
          ))}
        </dl>
        <Link href="/" className="btn btn-primary w-fit">
          {t("backShop")}
        </Link>
      </div>
    );
  }

  if (phase === "cancelled") {
    return (
      <div className="grid max-w-xl gap-5" role="status">
        <span className="flex size-14 items-center justify-center rounded-full border-2 border-cream text-cream">
          <Undo2 size={28} aria-hidden />
        </span>
        <h1 ref={headRef} tabIndex={-1} className="text-headline outline-none">
          {t("cancelledTitle")}
        </h1>
        <p className="text-lg text-cream-muted">{t("cancelledBody")}</p>
        <div className="flex flex-wrap gap-3">
          <button type="button" className="btn btn-primary" onClick={() => setPhase("form")}>
            {t("resume")}
          </button>
          <Link href="/" className="btn btn-secondary">
            {t("backShop")}
          </Link>
        </div>
      </div>
    );
  }

  const paying = phase === "paying";
  const cardReady = method !== "card" || (card.number.length >= 19 && card.exp.length === 5 && card.cvc.length >= 3);

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_380px] lg:items-start lg:gap-12">
      <div className="grid gap-6">
        <div className="grid gap-3">
          <p className="label text-cream-muted">{t("eyebrow")}</p>
          <h1 ref={headRef} tabIndex={-1} className="text-headline outline-none">
            {t("title")}
          </h1>
          {Banner}
        </div>

        {phase === "failed" && (
          <div role="alert" className="flex gap-3 rounded-lg border-2 border-gold bg-coal-raised p-4">
            <CircleAlert size={24} className="mt-0.5 shrink-0 text-gold" aria-hidden />
            <div>
              <p className="font-display text-xl font-bold">{t("failedTitle")}</p>
              <p>{t(`reason.${reason}` as "reason.card_declined")}</p>
              <p className="text-cream-muted">{t("failedBody")}</p>
            </div>
          </div>
        )}

        <form className="grid gap-6" noValidate onSubmit={pay}>
          <fieldset className="grid gap-3">
            <legend className="label mb-1 text-cream-muted">{t("method")}</legend>
            <div role="radiogroup" aria-label={t("method")} className="flex gap-2">
              {(["card", "pix"] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  role="radio"
                  aria-checked={method === m}
                  disabled={m === "pix" && isPlan}
                  className="book-chip min-w-28"
                  onClick={() => setMethod(m)}
                >
                  {t(m)}
                </button>
              ))}
            </div>
            {isPlan && <p className="text-sm text-cream-muted">{t("pixNote")}</p>}
          </fieldset>

          {method === "card" ? (
            <div className="grid gap-4">
              <label className="grid gap-1.5">
                <span className="font-bold">{t("cardNumber")}</span>
                <input
                  className="book-input"
                  inputMode="numeric"
                  autoComplete="off"
                  placeholder="4242 4242 4242 4242"
                  value={card.number}
                  onChange={(e) => setCard({ ...card, number: groupCard(e.target.value) })}
                />
              </label>
              <div className="grid grid-cols-2 gap-4">
                <label className="grid gap-1.5">
                  <span className="font-bold">{t("cardExp")}</span>
                  <input
                    className="book-input"
                    inputMode="numeric"
                    autoComplete="off"
                    placeholder="12/30"
                    value={card.exp}
                    onChange={(e) => setCard({ ...card, exp: formatExp(e.target.value) })}
                  />
                </label>
                <label className="grid gap-1.5">
                  <span className="font-bold">{t("cardCvc")}</span>
                  <input
                    className="book-input"
                    inputMode="numeric"
                    autoComplete="off"
                    placeholder="123"
                    value={card.cvc}
                    onChange={(e) => setCard({ ...card, cvc: e.target.value.replace(/\D/g, "").slice(0, 4) })}
                  />
                </label>
              </div>
              <div className="grid gap-2">
                <p className="label text-cream-muted">{t("testCards")}</p>
                <div className="flex flex-wrap gap-2">
                  {TEST_CARDS.map((c) => (
                    <button
                      key={c.key}
                      type="button"
                      className="book-chip"
                      onClick={() => setCard({ number: c.number, exp: "12/30", cvc: "123" })}
                    >
                      {t(c.key)} · {c.number.slice(-4)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <p className="rounded-lg border-2 border-line p-4 text-cream-muted">{t("pixNote")}</p>
          )}

          {isPlan && (
            <div className="grid gap-1.5">
              <label htmlFor="promo" className="font-bold">
                {t("promo")}
              </label>
              <div className="flex gap-2">
                <input
                  id="promo"
                  className="book-input min-w-0 flex-1"
                  autoComplete="off"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      setPromo(promoInput.trim());
                    }
                  }}
                />
                <button type="button" className="btn btn-secondary" onClick={() => setPromo(promoInput.trim())}>
                  {t("apply")}
                </button>
              </div>
              <p className="text-sm text-cream-muted">{t("promoHint")}</p>
            </div>
          )}

          {errors.length > 0 && (
            <ul role="alert" className="grid gap-1 text-gold">
              {errors.map((c) => (
                <li key={c}>{t(`errors.${c}` as "errors.invalid_body")}</li>
              ))}
            </ul>
          )}

          <div className="flex flex-wrap gap-3">
            <button type="submit" className="btn btn-primary" disabled={!quote || paying || !cardReady}>
              {paying ? t("paying") : quote ? t(isPlan ? "subscribe" : "pay", { amount: money(quote.totalCents) }) : t("quoting")}
            </button>
            <button type="button" className="btn btn-secondary" disabled={paying} onClick={() => setPhase("cancelled")}>
              {t("cancel")}
            </button>
          </div>
        </form>
      </div>

      <aside aria-label={t("summary")} className="grid gap-4 rounded-lg border-2 border-cream bg-coal-raised p-5 lg:sticky lg:top-24">
        <h2 className="font-display text-2xl font-bold">{t("summary")}</h2>
        <div className="grid gap-3">
          <div className="flex items-start justify-between gap-4">
            <p className="font-bold">{lineLabel}</p>
            <p className="price shrink-0 text-gold">{quote ? money(quote.lines[0].totalCents) : "…"}</p>
          </div>
          {!isPlan && (
            <div role="group" aria-label={t("qty")} className="flex items-center gap-3">
              <button type="button" className="book-chip !min-h-10 w-10" aria-label={t("less")} disabled={qty <= 1} onClick={() => setQty(qty - 1)}>
                −
              </button>
              <span className="min-w-6 text-center font-bold" aria-live="polite">
                {qty}
              </span>
              <button type="button" className="book-chip !min-h-10 w-10" aria-label={t("more")} disabled={qty >= 3} onClick={() => setQty(qty + 1)}>
                +
              </button>
            </div>
          )}
        </div>
        <dl className="border-t border-line pt-3">
          <div className="flex justify-between gap-4 py-1">
            <dt className="text-cream-muted">{t("subtotal")}</dt>
            <dd>{quote ? money(quote.subtotalCents) : "…"}</dd>
          </div>
          {quote && quote.discountCents > 0 && (
            <div className="flex justify-between gap-4 py-1">
              <dt className="text-cream-muted">{t("discount", { code: quote.promo ?? "" })}</dt>
              <dd>−{money(quote.discountCents)}</dd>
            </div>
          )}
          <div className="flex justify-between gap-4 border-t border-line py-2 pt-3">
            <dt className="font-bold">{t("total")}</dt>
            <dd className="price text-gold" aria-live="polite">
              {quote ? money(quote.totalCents) : "…"}
            </dd>
          </div>
        </dl>
        <p className="text-sm text-cream-muted">
          {isPlan && quote
            ? t("recurring", { price: money(quote.subtotalCents) })
            : t("oneTime", { percent: DEPOSIT_PERCENT })}
        </p>
        <p className="text-sm text-cream-muted">{t("serverNote")}</p>
      </aside>
    </div>
  );
}
