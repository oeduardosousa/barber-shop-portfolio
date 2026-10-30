import { priceOrder } from "@/lib/checkout/pricing";
import { charge, type Card } from "@/lib/checkout/sandbox";

// Sandbox only: this route never contacts a real payment network. Card fields are read, checked and dropped;
// nothing is logged or stored.
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = priceOrder(body);
  if (!parsed.ok) return Response.json(parsed, { status: 400 });

  const raw = (body as { card?: unknown }).card;
  const card = typeof raw === "object" && raw !== null ? (raw as Card) : null;
  const result = charge(parsed.quote, card);
  return Response.json({ ...result, quote: parsed.quote }, { status: result.status === "succeeded" ? 200 : 402 });
}
