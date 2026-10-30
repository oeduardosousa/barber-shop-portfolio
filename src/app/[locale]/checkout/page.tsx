import { setRequestLocale } from "next-intl/server";
import { Checkout } from "@/components/checkout";
import { Header } from "@/components/Header";
import { BookingProvider } from "@/components/booking";
import { Footer } from "@/components/sections";
import { PLANS, SERVICES } from "@/lib/checkout/catalog";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ plan?: string; service?: string }>;
};

export default async function CheckoutPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { plan, service } = await searchParams;
  setRequestLocale(locale);

  // Only ids are read from the URL; the server re-validates and prices them.
  const item = PLANS.some((p) => p.id === plan)
    ? ({ kind: "plan", id: plan as string } as const)
    : SERVICES.some((s) => s.id === service)
      ? ({ kind: "service", id: service as string } as const)
      : null;

  return (
    <BookingProvider>
      <Header />
      <main id="main" tabIndex={-1} className="section outline-none">
        <div className="wrap">
          <Checkout key={item ? `${item.kind}:${item.id}` : "empty"} item={item} />
        </div>
      </main>
      <Footer />
    </BookingProvider>
  );
}
