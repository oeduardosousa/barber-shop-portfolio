import { priceOrder } from "@/lib/checkout/pricing";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = priceOrder(body);
  return Response.json(parsed, { status: parsed.ok ? 200 : 400 });
}
