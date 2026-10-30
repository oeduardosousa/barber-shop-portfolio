"use client";

import { Menu, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useRef, useState, useTransition } from "react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { SHOP_NAME } from "@/lib/brand";
import { BookButton, MineButton } from "./booking";
import { ViewSwitch } from "./role-gate";

const LINKS = ["services", "team", "gallery", "plans", "contact"] as const;

export function LangSwitch() {
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

/** Utility row above the header: pick the view (client or barber) and the language. */
export function UtilityBar({ current, always }: { current: "client" | "barber"; always?: boolean }) {
  return (
    <div className={`utility border-b border-line bg-coal ${always ? "" : "hidden xl:block"}`}>
      <div className="flex flex-wrap items-center gap-4 px-4 py-2 sm:px-6 xl:px-10 2xl:px-14">
        <ViewSwitch current={current} />
        <div className="ml-auto">
          <LangSwitch />
        </div>
      </div>
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
    <>
    <div className="stripe" aria-hidden />
    <UtilityBar current="client" />
    <header className="sticky top-0 z-40 border-b border-line bg-coal">
      <div className="flex h-[76px] items-center gap-6 px-4 sm:px-6 xl:h-[92px] xl:px-10 2xl:px-14">
        <a href="#top" className="whitespace-nowrap font-display text-xl font-black tracking-tight sm:text-2xl xl:text-[1.75rem]">
          {SHOP_NAME}
        </a>

        <nav aria-label={t("label")} className="ml-4 hidden items-center gap-2 xl:flex 2xl:ml-10 2xl:gap-4">
          {LINKS.map((k) => (
            <a key={k} href={`#${k}`} className="nav-link">
              {t(k)}
            </a>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-3 sm:gap-4 xl:gap-5">
          <MineButton compact className="btn btn-secondary hidden gap-2 !px-3 !text-sm xl:inline-flex xl:!px-4" />
          <BookButton className="btn btn-primary whitespace-nowrap !px-5">
            <span className="xl:hidden">{t("bookShort")}</span>
            <span className="hidden xl:inline">{t("book")}</span>
          </BookButton>
          <button
            ref={openBtn}
            type="button"
            className="btn btn-secondary !min-h-12 !w-12 !p-0 xl:hidden"
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
        className="menu-panel on-dark xl:hidden"
        data-open={open}
        inert={!open}
        role="dialog"
        aria-modal="true"
        aria-label={t("menu")}
      >
        <div className="flex h-[76px] items-center justify-between px-4">
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
          <BookButton className="btn btn-gold" onClick={() => setOpen(false)}>
            {t("book")}
          </BookButton>
          <MineButton className="btn btn-secondary gap-2" onClick={() => setOpen(false)} />
          <div className="flex flex-wrap items-center justify-between gap-3">
            <LangSwitch />
            <ViewSwitch current="client" onNavigate={() => setOpen(false)} />
          </div>
        </div>
      </div>
    </header>
    </>
  );
}
