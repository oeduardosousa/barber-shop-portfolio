<div align="center">

# Navalha Barber

**A classic barbershop demo, in Portuguese and English.**
Clients book a chair. Barbers see their day.

[![Live demo](https://img.shields.io/badge/Live_demo-barber--shop--portfolio--weld.vercel.app-111?style=for-the-badge&logo=vercel&logoColor=white)](https://barber-shop-portfolio-weld.vercel.app/)

![Next.js](https://img.shields.io/badge/Next.js_16-000?style=flat-square&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React_19-20232A?style=flat-square&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![next-intl](https://img.shields.io/badge/next--intl-i18n-1E40AF?style=flat-square)
![Vitest](https://img.shields.io/badge/Vitest-6E9F18?style=flat-square&logo=vitest&logoColor=white)

<img src="docs/preview.webp" alt="Entry screen of the barbershop demo on a dark background: one card for clients, one for barbers." width="820">

</div>

> **Portfolio project.** The shop is fictional. Names, prices, reviews and photos are sample content, and no real payment is ever made.

## Highlights

- **Two entry points:** a client experience and a barber experience.
- **Online booking** with per-barber availability and time slots.
- **Monthly plans** (hair, beard, or both) with a simulated checkout.
- **Barber schedule** showing the day's appointments, including the bookings made on the client side.
- **Bilingual:** Brazilian Portuguese and English with a language switcher (`next-intl`).
- **Warm vintage design:** cream and brown palette, strong serif headings, map of the shop.
- **Tested pricing logic** with Vitest.

## Tech stack

| Area | Choice |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS 4 |
| i18n | next-intl (`pt-BR`, `en`) |
| Map and icons | Leaflet, lucide-react |
| Tests | Vitest |

## Getting started

```bash
npm install
npm run dev        # http://localhost:3000
```

No environment variables are required to run the demo. [`.env.example`](.env.example) lists nothing secret.

| Command | What it does |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Type-check with TypeScript |
| `npm test` | Run the Vitest suite |

## Project structure

```
messages/       Translations: en.json, pt-BR.json
src/
  app/          [locale] pages (home, barber, checkout) and checkout API routes
  components/   Booking flow, checkout, sections, map, role gate
  lib/          Schedule, team, brand and checkout logic (with tests)
  i18n/         next-intl setup
```

Design rules live in [`DESIGN.md`](DESIGN.md) and the scope in [`BRIEF.md`](BRIEF.md).

## Author

Built by **Eduardo Sousa**, web developer in Belo Horizonte, Brazil.

[Portfolio](https://oeduardosousa.com) · [LinkedIn](https://www.linkedin.com/in/eduardo-sousa-528b77334) · [GitHub](https://github.com/oeduardosousa)
