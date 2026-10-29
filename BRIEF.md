# Barber Shop: Project Brief

## Business
A portfolio demo of a classic barbershop. The shop is fictional sample content, not a real business. It shows booking, membership plans, team, and client accounts, built to demonstrate craft.

## Audience
- Clients who want to see services and prices, pick a barber, and book a slot.
- Clients who want a monthly plan: hair, beard, or hair and beard.
- Staff: an admin who manages the shop, and barbers who manage their own schedule.
- Portfolio reviewers evaluating the work.

## Goals
1. Show the shop's services, prices, team, and gallery and reviews in a classic barbershop style.
2. Let a client book an appointment online with a real calendar and time slots.
3. Let a client start a monthly plan in Stripe test mode.
4. Let staff manage schedules and services.
5. Support Portuguese (pt-BR) and English.

## Content
- Pages: Home, Services (menu with prices), Team (barber bios), Gallery and reviews, Contact and location, Booking, Plans, Account, Staff admin.
- Offers: three monthly plans, Hair, Beard, and Hair and Beard. Prices are sample values.
- Sample content only: shop name, address, hours, prices, staff names, reviews, and photos are placeholders and must be marked as sample. No invented real addresses or real testimonials presented as genuine.

## Features
- Online booking: calendar, time slots, per-barber availability, confirmation.
- Cancellation: clients can cancel up to 2 hours before the slot.
- Payments: a deposit on each booking and the monthly plan, both simulated through Stripe test mode. No live charges.
- Accounts: clients sign up, log in, and view or cancel their own bookings.
- Staff: an admin logs in to manage barbers, services, and prices. Each barber logs in to manage their own schedule.
- Email reminders for upcoming bookings through Resend. SMS and calendar sync are out of scope.
- Multi-language: pt-BR and en, with a language switcher.
- Visual style: warm vintage. Cream and warm brown palette, red or amber accents, strong serif display headings.

## Stack
- Framework: Next.js (App Router) with TypeScript and Tailwind CSS.
- Backend and data: Supabase (Postgres, Auth, Row Level Security).
- Payments: Stripe, test mode only.
- Email: Resend (free tier) for booking reminders.
- Internationalization: next-intl.
- Animation: Motion where needed, guided by the emil-design-eng skill.
- Design and UI audits: Impeccable skill.

Why this stack: Next.js on Vercel is the simplest free deployment for a portfolio with server rendering and API routes. Supabase gives a real Postgres database, auth, and row-level security on its free tier without running a server. Stripe has a free test mode for subscriptions and deposits. Resend has a free tier for reminder emails. next-intl handles pt-BR and en inside the App Router. Everything fits the free tiers.

## Deployment
- Hosting: Vercel (free Hobby plan), connected to a GitHub repository.
- Database and auth: Supabase free project.
- Domain: default `*.vercel.app` subdomain. No custom domain; budget is free.
- Secrets: only in Vercel and local `.env.local`, never committed.

## Acceptance Criteria
- Home, Services, Team, Gallery and reviews, and Contact pages render with sample content, in pt-BR and en.
- A logged-in client can book an available slot, see it under Account, and cancel it up to 2 hours before.
- Booking respects barber availability and does not double-book a slot.
- A client can start a monthly plan in Stripe test mode and see the active plan.
- Staff can add or edit a service and price. An admin can manage all barbers. Each barber can change their own schedule.
- A reminder email is sent for an upcoming booking, verified in test mode.
- Layout works at phone width (16px gutter, no horizontal scroll) and on desktop.
- No secrets in the repository, client bundle, logs, or chat.
- Lint, type-check, and tests pass before each commit.

## Assumptions
- Portfolio only: no real customers, real payments, or live production traffic.
- Stripe and Resend run in test mode; keys are supplied by the owner.
- Sample content is acceptable for all shop details.
- Free tiers on Vercel, Supabase, Stripe test mode, and Resend are sufficient.
- The shop name is a fictional placeholder chosen during the build.

## Open Questions
- GitHub repository: the owner asked for one to be created for Vercel. The account name is still needed, so it is not created yet, and nothing is pushed without approval.
- Shop name: a placeholder is used unless the owner supplies one.
- Languages beyond pt-BR and en: none planned.
