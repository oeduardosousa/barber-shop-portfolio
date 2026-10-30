import { setRequestLocale } from "next-intl/server";
import { BarberApp } from "@/components/barber-app";

export default async function BarberPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <BarberApp />;
}
