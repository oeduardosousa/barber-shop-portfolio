"use client";

import { Menu, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useRef, useState, useTransition } from "react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { BOOK_HREF, SHOP_NAME } from "@/lib/brand";

const LINKS = ["services", "team", "gallery", "plans", "contact"] as const;

function LangSwitch() {
  const t = useTranslations("lang");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [, startTransition] = useTransition();

  return (
    <div role="group" aria-label={t("label")} className="lang">
      <span
        aria-hidden
        className="lang-thumb"
        style={{ transform: locale === "en" ? "translateX(100%)" : "none" }}
      />
      {routing.locales.map((l) => (
        <button
          key={l}
          type="button"
          lang={l}
          aria-pressed={l === locale}
          onClick={() => startTransition(() => router.replace(pathname, { locale: l }))}
        >
          {l === "pt-BR" ? "PT" : "EN"}
        </button>
      ))}
    </div>
  );
}

export function Header() {
  const t = useTranslations("nav");
  const [open, setOpen] = useState(false);
  const openBtn = useRef<HTMLButtonElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const wasOpen = useRef(false);

  useEffect(() => {
    const main = document.getElementById("main");
    if (open) {
      if (main) main.inert = true;
      document.body.style.overflow = "hidden";
      closeBtn.current?.focus();
      wasOpen.current = true;
      const onKey = (e: KeyboardEvent) => {
        if (e.key === "Escape") setOpen(false);
      };
      document.addEventListener("keydown", onKey);
      return () => {
        document.removeEventListener("keydown", onKey);
        if (main) main.inert = false;
        document.body.style.overflow = "";
      };
    }
    if (wasOpen.current) {
      wasOpen.current = false;
      openBtn.current?.focus();
    }
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-coal">
      <div className="stripe" aria-hidden />
      <div className="wrap flex h-[64px] items-center justify-between gap-3 lg:h-[72px]">
        <a href="#top" className="whitespace-nowrap font-display text-xl font-black tracking-tight sm:text-2xl lg:text-[1.75rem]">
          {SHOP_NAME}
        </a>

        <nav aria-label={t("label")} className="hidden items-center gap-1 lg:flex">
          {LINKS.map((k) => (
            <a key={k} href={`#${k}`} className="nav-link">
              {t(k)}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden lg:block">
            <LangSwitch />
          </div>
          <a href={BOOK_HREF} className="btn btn-primary !px-5">
            <span className="lg:hidden">{t("bookShort")}</span>
            <span className="hidden lg:inline">{t("book")}</span>
          </a>
          <button
            ref={openBtn}
            type="button"
            className="btn btn-secondary !min-h-12 !w-12 !p-0 lg:hidden"
            aria-label={t("menu")}
            aria-expanded={open}
            aria-controls="menu"
            onClick={() => setOpen(true)}
          >
            <Menu size={24} aria-hidden />
          </button>
        </div>
      </div>

      <div
        id="menu"
        className="menu-panel on-dark lg:hidden"
        data-open={open}
        inert={!open}
        role="dialog"
        aria-modal="true"
        aria-label={t("menu")}
      >
        <div className="flex h-[64px] items-center justify-between px-4">
          <span className="font-display text-2xl font-black">{SHOP_NAME}</span>
          <button
            ref={closeBtn}
            type="button"
            className="btn btn-gold !min-h-12 !w-12 !p-0"
            aria-label={t("close")}
            onClick={() => setOpen(false)}
          >
            <X size={24} aria-hidden />
          </button>
        </div>
        <nav aria-label={t("label")} className="flex flex-1 flex-col justify-center gap-2 px-4">
          {LINKS.map((k, i) => (
            <a
              key={k}
              href={`#${k}`}
              className="menu-link font-display text-4xl font-black leading-tight py-1"
              style={{ "--i": i } as React.CSSProperties}
              onClick={() => setOpen(false)}
            >
              {t(k)}
            </a>
          ))}
        </nav>
        <div className="flex flex-col gap-4 p-4 pb-8">
          <a href={BOOK_HREF} className="btn btn-gold" onClick={() => setOpen(false)}>
            {t("book")}
          </a>
          <div>
            <LangSwitch />
          </div>
        </div>
      </div>
    </header>
  );
}
