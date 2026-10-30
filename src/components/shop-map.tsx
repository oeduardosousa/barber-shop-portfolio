"use client";

import "leaflet/dist/leaflet.css";
import { useEffect, useRef } from "react";

// Copacabana Beach, Rio de Janeiro. The shop itself is fictional.
const CENTER: [number, number] = [-22.9711, -43.1823];

const PIN = `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="48" viewBox="0 0 24 29" aria-hidden="true"><path d="M12 1.5C6.8 1.5 3 5.4 3 10.3c0 6.6 9 17 9 17s9-10.4 9-17C21 5.4 17.2 1.5 12 1.5z" fill="#f5c030" stroke="#14100d" stroke-width="1.8"/><circle cx="12" cy="10.3" r="3.2" fill="#14100d"/></svg>`;

export function ShopMap({ label, popupTitle, popupNote }: { label: string; popupTitle: string; popupNote: string }) {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    let map: import("leaflet").Map | undefined;
    let cancelled = false;

    import("leaflet").then((L) => {
      if (cancelled) return;
      map = L.map(el, { center: CENTER, zoom: 15, scrollWheelZoom: false });
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);

      const icon = L.divIcon({ html: PIN, className: "shop-pin", iconSize: [40, 48], iconAnchor: [20, 46], popupAnchor: [0, -44] });
      const popup = document.createElement("div");
      const title = document.createElement("strong");
      title.textContent = popupTitle;
      const note = document.createElement("span");
      note.textContent = popupNote;
      popup.append(title, note);
      L.marker(CENTER, { icon, title: popupTitle }).addTo(map).bindPopup(popup).openPopup();

      // Wheel zoom only once the map is focused, so scrolling the page never gets trapped.
      map.on("focus click", () => map?.scrollWheelZoom.enable());
      map.on("blur", () => map?.scrollWheelZoom.disable());
    });

    return () => {
      cancelled = true;
      map?.remove();
    };
  }, [popupTitle, popupNote]);

  return <div ref={host} role="region" aria-label={label} className="shop-map h-full w-full" />;
}
