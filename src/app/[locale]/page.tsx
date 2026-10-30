import { setRequestLocale, getTranslations } from "next-intl/server";
import { Header } from "@/components/Header";
import { RevealObserver } from "@/components/client-bits";
import { Contact, Footer, Gallery, Hero, Marquee, Plans, Reviews, Services, Team } from "@/components/sections";

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-full focus:bg-amber focus:px-6 focus:py-3 focus:font-bold focus:text-coal"
      >
        {t("skip")}
      </a>
      <Header />
      <main id="main" tabIndex={-1} className="outline-none">
        <Hero />
        <Marquee />
        <Services />
        <Team />
        <Plans />
        <Gallery />
        <Reviews />
        <Contact />
      </main>
      <Footer />
      <RevealObserver />
    </>
  );
}
