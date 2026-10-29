# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Confirmed from BRIEF.md: Next.js (App Router) with TypeScript and Tailwind CSS, Supabase (Postgres, Auth, RLS), Stripe (test mode only), Resend for reminder email, next-intl for pt-BR and en, Motion where needed, deployed on Vercel.

## Users

Prospective clients of a classic barbershop who want to see services and prices, pick a barber, and book a slot, or start a monthly plan. Staff (barbers and admin) manage their schedule and services. Portfolio reviewers evaluate the build.

## Product Purpose

A fictional, sample-content barbershop demo that shows real booking, accounts, subscriptions, and staff administration. Success means a reviewer can book an appointment, see it under Account, cancel it, start a plan in Stripe test mode, and see staff edit a service or schedule.

## Positioning

The demo proves working product flows (calendar, per-barber availability, no double-booking, accounts, subscription checkout, staff admin), not brand storytelling. Visual craft supports these flows rather than replacing them.

## Operating Context

Demo use only. Stripe and Resend run in test mode with owner-supplied keys. No live charges, no real customers, no production traffic.

## Capabilities and Constraints

- Online booking with calendar, time slots, per-barber availability, and confirmation.
- Booking requires a deposit in addition to the monthly plan. Both are simulated: Stripe test mode only, with no live charges.
- Client accounts: sign up, log in, view and cancel own bookings.
- Staff admin: manage barbers, services, prices, and schedules.
- Email reminders for upcoming bookings (SMS out of scope).
- Portuguese (pt-BR) and English, with a language switcher. No further languages are planned.
- Layout must work at phone width (16px gutter, no horizontal scroll) and on desktop.
- Undecided: whether a real GitHub repository and Vercel project will be created.

## Brand Commitments

- The shop name is a fictional placeholder, chosen by the builder and clearly marked as sample content. Logo and brand colors are not provided.
- Visual style is classic barbershop: warm palette, vintage cues, and strong serif or display headings. The palette and typography are for the design step to decide, not this record.

## Evidence on Hand

None. No logo, photos, reviews, or real shop details exist. Addresses, hours, prices, staff names, reviews, and photos are placeholders and must be marked as sample. Future work must not fabricate testimonials, customers, or claims presented as genuine.

## Product Principles

- Make the path from landing to booking short and obvious.
- Show services and prices plainly; clients compare before they book.
- Keep sample content honest and clearly marked, and easy to replace.
- Show real flows (booking, accounts, plans, admin) rather than simulated screens.
