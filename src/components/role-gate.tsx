"use client";

import { Scissors, User } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { SHOP_NAME } from "@/lib/brand";

const KEY = "nb-role";
export const ROLE_EVENT = "nb:role";

export function setRole(role: "client" | "barber") {
  try {
    sessionStorage.setItem(KEY, role);
  } catch {
    /* ignore */
  }
}

/** Start screen: pick the client site or the barber's dashboard. Shown once per browser session. */
export function RoleGate() {
  const t = useTranslations("gate");
  const router = useRouter();
  const ref = useRef<HTMLDialogElement>(null);
  const [chosen, setChosen] = useState(false);

  useEffect(() => {
    const show = () => {
      setChosen(false);
      requestAnimationFrame(() => {
        if (ref.current && !ref.current.open) ref.current.showModal();
      });
    };
    let seen = false;
    try {
      seen = !!sessionStorage.getItem(KEY);
    } catch {
      /* ignore */
    }
    if (!seen) show();
    window.addEventListener(ROLE_EVENT, show);
    return () => window.removeEventListener(ROLE_EVENT, show);
  }, []);

  function pick(role: "client" | "barber") {
    setRole(role);
    setChosen(true);
    ref.current?.close();
    if (role === "barber") router.push("/barber");
  }

  if (chosen) return null;

  return (
    <dialog
      ref={ref}
      className="gate"
      aria-labelledby="gate-title"
      onCancel={(e) => {
        e.preventDefault();
        pick("client");
      }}
    >
      <div className="wrap flex min-h-dvh flex-col justify-center gap-8 py-10">
        <div>
          <p className="label mb-3 text-cream-muted">{SHOP_NAME}</p>
          <h1 id="gate-title" className="text-headline">
            {t("title")}
          </h1>
          <p className="mt-3 max-w-[52ch] text-cream-muted">{t("note")}</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <button type="button" className="sign gate-card" onClick={() => pick("client")}>
            <User size={36} aria-hidden />
            <span className="font-display text-3xl font-black">{t("client")}</span>
            <span className="text-cream-muted">{t("clientDesc")}</span>
          </button>
          <button type="button" className="sign gate-card" onClick={() => pick("barber")}>
            <Scissors size={36} aria-hidden />
            <span className="font-display text-3xl font-black">{t("barber")}</span>
            <span className="text-cream-muted">{t("barberDesc")}</span>
          </button>
        </div>
      </div>
    </dialog>
  );
}

export function SwitchViewButton({ className, onClick }: { className?: string; onClick?: () => void }) {
  const t = useTranslations("gate");
  return (
    <button
      type="button"
      className={className}
      onClick={() => {
        onClick?.();
        window.dispatchEvent(new Event(ROLE_EVENT));
      }}
    >
      {t("switch")}
    </button>
  );
}

/** Segmented toggle between the client site and the barber dashboard. */
export function ViewSwitch({ current, onNavigate }: { current: "client" | "barber"; onNavigate?: () => void }) {
  const t = useTranslations("gate");
  const router = useRouter();
  const go = (role: "client" | "barber") => {
    if (role === current) return;
    setRole(role);
    onNavigate?.();
    router.push(role === "barber" ? "/barber" : "/");
  };
  return (
    <div role="group" aria-label={t("switch")} className="lang lang-wide">
      <span aria-hidden className="lang-thumb" style={{ transform: current === "barber" ? "translateX(100%)" : "none" }} />
      {(["client", "barber"] as const).map((r) => (
        <button key={r} type="button" aria-pressed={r === current} onClick={() => go(r)}>
          {t(`short.${r}`)}
        </button>
      ))}
    </div>
  );
}
