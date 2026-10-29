# Barber Shop: Project Brief

## Business
A portfolio demo of a classic barbershop. The shop is fictional/sample content, not a real business. It shows booking, services, team, and client accounts, built to demonstrate craft.

## Audience
- Clients who want to see services and prices, pick a barber, and book a slot.
- Clients who want a subscription plan (monthly membership).
- Staff (barbers/admin) who manage their schedule and services.
- Portfolio reviewers evaluating the work.

## Goals
1. Show the shop's services, prices, team, and gallery/reviews in a clear, classic barbershop style.
2. Let a client book an appointment online with a real calendar and time slots.
3. Let a client buy a monthly plan (subscription).
4. Let staff manage schedule and services.
5. Support Portuguese and English.

## Content
- Pages: Home, Services (menu with prices), Team (barber bios), Gallery & reviews, Contact & location, Booking, Plans, Account, Staff admin.
- Sample content only: shop name, address, hours, prices, staff names, reviews, and photos are placeholders and must be marked as sample. No invented real addresses or real testimonials presented as genuine.

## Features
- Online booking: calendar, time slots, per-barber availability, confirmation.
- Client accounts: sign up, log in, view and cancel own bookings.
- Staff admin: manage barbers, services, prices, schedule.
- Payments: Stripe test mode for the monthly subscription and any deposit. No live charges.
- Email reminders for upcoming bookings (SMS out of scope).
- Multi-language: Portuguese (pt-BR) and English, with a language switcher.
- Visual style: classic barbershop (warm palette, vintage cues, strong serif/display headings).

## Stack
- Framework: Next.js (App Router) with TypeScript and Tailwind CSS.
- Backend and data: Supabase (Postgres, Auth, Row Level Security).
- Payments: Stripe (test mode only).
- Email: Resend (free tier) for booking reminders.
- Internationalization: next-intl.
- Animation: Motion (framer-motion) where needed, guided by the emil-design-eng skill.
- Design and UI audits: Impeccable skill.

Why this stack: Next.js + Vercel is the simplest free deployment for a portfolio with server rendering and API routes. Supabase gives a real database and auth on its free tier without running a server. Stripe is the standard for subscriptions and has a free test mode. Resend has a free tier for reminder emails. Everything fits the free tiers.

## Deployment
- Hosting: Vercel (free Hobby plan), connected to the GitHub repository.
- Database and auth: Supabase free project.
- Domain: default `*.vercel.app` subdomain (no custom domain; budget is free).
- Secrets: only in Vercel and local `.env.local`, never committed.

## Acceptance Criteria
- Home, Services, Team, Gallery & reviews, and Contact pages render with sample content, in pt-BR and en.
- A logged-in client can book an available slot, see it under Account, and cancel it.
- Booking respects barber availability and does not double-book a slot.
- A client can start a monthly plan checkout in Stripe test mode and see the active plan.
- Staff can add or edit a service and price, and change a barber's schedule.
- Reminder email is sent for an upcoming booking (verified in test mode).
- Layout works at phone width (16px gutter, no horizontal scroll) and desktop.
- No secrets in the repository, client bundle, logs, or chat.
- Lint, type-check, and tests pass before each commit.

## Assumptions
- Portfolio only: no real customers, real payments, or live production traffic.
- Stripe and Resend run in test mode; keys are supplied by the owner.
- Sample content is acceptable for all shop details.
- Free tiers on Vercel, Supabase, Stripe test mode, and Resend are sufficient.

## Open Questions
- Shop name, logo, and brand colors (none provided; a placeholder name will be used).
- Should booking require a deposit, or only the subscription be paid?
- Which languages beyond pt-BR and en, if any?
- Is a GitHub repository to be created for Vercel deployment, and under which account?
- Should the earlier PRODUCT.md (inferred, not confirmed) be replaced with this brief? It currently reads as an assumption.
