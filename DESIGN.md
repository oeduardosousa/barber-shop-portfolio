---
name: Navalha Barber (sample)
description: A classic barbershop after dark. Warm near-black, one bright gold, cream type, a heavy soft serif, and a pole that never stops turning.
colors:
  coal: "#14100D"
  coal-raised: "#1E1813"
  coal-deep: "#0B0908"
  cream: "#FFF3DA"
  cream-muted: "#C7B3A0"
  gold: "#F5C030"
  gold-hi: "#FFD466"
  gold-deep: "#B38A1E"
  line: "rgba(255, 243, 218, 0.18)"
typography:
  display:
    fontFamily: "Fraunces, Georgia, serif"
    fontSize: "clamp(3rem, 9vw, 7rem)"
    fontWeight: 900
    lineHeight: 0.95
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Fraunces, Georgia, serif"
    fontSize: "clamp(2rem, 4.5vw, 3.25rem)"
    fontWeight: 800
    lineHeight: 1.05
    letterSpacing: "-0.015em"
  title:
    fontFamily: "Fraunces, Georgia, serif"
    fontSize: "1.5rem"
    fontWeight: 700
    lineHeight: 1.2
  body:
    fontFamily: "Instrument Sans, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Instrument Sans, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "0.14em"
  price:
    fontFamily: "Fraunces, Georgia, serif"
    fontSize: "1.75rem"
    fontWeight: 800
    lineHeight: 1
    fontFeature: "'lnum', 'tnum'"
rounded:
  sm: "4px"
  md: "8px"
  pill: "999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "40px"
  2xl: "64px"
  3xl: "96px"
components:
  button-primary:
    backgroundColor: "{colors.gold}"
    textColor: "{colors.coal}"
    rounded: "{rounded.pill}"
    padding: "0 28px"
    height: "52px"
  button-primary-hover:
    backgroundColor: "{colors.gold-hi}"
  button-secondary:
    backgroundColor: "{colors.coal-raised}"
    textColor: "{colors.cream}"
    rounded: "{rounded.pill}"
    padding: "0 28px"
    height: "52px"
  button-on-dark:
    backgroundColor: "{colors.gold}"
    textColor: "{colors.coal}"
    rounded: "{rounded.pill}"
    padding: "0 28px"
    height: "52px"
  card:
    backgroundColor: "{colors.coal-raised}"
    textColor: "{colors.cream}"
    rounded: "{rounded.md}"
    padding: "24px"
  slot-chip:
    backgroundColor: "{colors.coal-raised}"
    textColor: "{colors.cream}"
    rounded: "{rounded.sm}"
    height: "48px"
    width: "88px"
  slot-chip-selected:
    backgroundColor: "{colors.gold}"
    textColor: "{colors.coal}"
  input:
    backgroundColor: "{colors.coal-raised}"
    textColor: "{colors.cream}"
    rounded: "{rounded.sm}"
    height: "52px"
    padding: "0 16px"
---

# Design System: Navalha Barber (sample)

All shop details here are sample content. The name **Navalha Barber** is a placeholder (BRIEF.md); keep it behind one token so the owner can swap it. Sources: [BRIEF.md](BRIEF.md), [PRODUCT.md](PRODUCT.md).

> **Basis.** UXKIN was not connected, so this direction is not based on a comparison of real sites. It comes from the brief, PRODUCT.md, the request for a vivid, dynamic site, and the later request for a dark theme (palette only; layout, type and motion unchanged).

## Overview

**Creative North Star: "The Turning Pole"**

A barber pole is the one object everyone already reads as *barbershop*: bright, striped, and always in motion. The whole site borrows that energy. A warm near-black ground carries cream type, one bright gold does the work, and a heavy soft serif talks like a hand-painted shop window. Things move, but with intent: stripes drift, sections reveal in sequence, prices count into place, and every press answers back.

It is classic barbershop, after dark. Two earlier directions are retired: the muted one (dusty red, navy, brass on cream) and the vivid red, cobalt and amber one, which read as busy. This one is a shop with the lights low and a gold sign in the window: the same structure, type and motion, with a single accent.

The brief splits surfaces into two modes, and the system flexes between them:
- **Persuade** (Home, Services, Team, Gallery and reviews, Plans, Contact): full color, large type, rich motion. Expressive, but the "Book a chair" action is always visible.
- **Operate** (Booking, Account, Staff admin): the same palette and type, but calm. Coal backgrounds, one gold action per view, motion limited to state feedback. A client picking a slot or a barber editing a schedule must never fight the decoration.

**Key Characteristics:**
- Saturated primaries on warm near-black; the ground is brown-black and the text warm cream, never pure black or pure white.
- Chunky, soft-edged serif display; plain sans for everything functional.
- One signature motif: the **pole stripe** (diagonal gold / cream band), in motion at rest.
- Flat color blocks and hairlines. Depth comes from color and offset, not blur.
- Prices and times are first-class typography, not afterthoughts.

**Rejected:** neon glow, glassmorphism, purple-to-blue gradients, gradient text, faux-aged textures, cartoon scissors and razors as illustration, military or political insignia, stock-photo smiles, and centering every section over three identical cards.

## Colors

Two colors, plus cream for type: a warm near-black ground and one bright gold. Nothing else. Strategy: **restrained dark with one bold accent**. The theme is dark only (`color-scheme: dark`).

| Token | Hex | Role |
| --- | --- | --- |
| `coal` | `#14100D` | Default page background: warm near-black, never pure black |
| `coal-raised` | `#1E1813` | Alternate bands (Team, Reviews), gallery tiles, secondary buttons, plan cards |
| `coal-deep` | `#0B0908` | Deepest bands: Plans, footer, mobile menu |
| `cream` | `#FFF3DA` | Body text, headings, borders, the cream gallery tile |
| `cream-muted` | `#C7B3A0` | Secondary text, captions, meta |
| `gold` | `#F5C030` | The accent: primary buttons, prices, links, focus ring, highlight text, check icons, the marquee band, the sign shadow, the pole stripe |
| `gold-hi` | `#FFD466` | Hover and pressed for gold buttons |
| `gold-deep` | `#B38A1E` | Second gold, only inside the pole stripe and one gallery tile |
| `line` | `cream` at 18% | Hairlines and borders |

**Measured contrast (WCAG 2.x):**

| Pair | Ratio | Allowed use |
| --- | --- | --- |
| `cream` on `coal` | 17.20 | Body text |
| `cream` on `coal-raised` | 15.97 | Text on bands and cards |
| `cream` on `coal-deep` | 18.06 | Text on the deepest bands |
| `cream-muted` on `coal-raised` | 8.69 | Captions on cards |
| `cream-muted` on `coal-deep` | 9.83 | Meta on the deepest bands |
| `gold` on `coal` | 11.23 | Prices, links, highlight text, focus ring |
| `gold` on `coal-raised` | 10.43 | Same, on raised surfaces |
| `gold` on `coal-deep` | 11.79 | Same, on the deepest bands |
| `coal` on `gold` | 11.23 | Button labels, marquee text, text on gold blocks |
| `coal` on `gold-hi` | 13.39 | Button label on hover |
| `coal` on `gold-deep` | 5.92 | Label on the deep-gold tile |
| `coal` on `cream` | 17.20 | Text on the cream tile and cream portrait backing |

**Rules:**
- Text on gold, gold-hi, gold-deep and cream is always `coal`. Text on coal surfaces is `cream` or `gold`.
- Gold is the only accent. No red, blue, green or purple anywhere, including status: success and check icons are gold plus a word or icon.
- `gold` on `gold-deep` is 1.90, so they never carry text on each other; `gold-deep` is decoration only.
- The "Sample" chip is a `coal` pill with a `gold` outline and `gold` text, so it also reads on gold blocks.
- Status is never color alone: always an icon plus a word.
- Band rhythm: `coal` hero, gold marquee, `coal` services, `coal-raised` team, `coal-deep` plans, `coal` gallery, `coal-raised` reviews, `coal` contact, `coal-deep` footer.

## Typography

- **Display and prices: Fraunces** (Google Fonts, variable). A chunky, soft-cornered serif with warmth and a little wobble, like a painted shop window. Weights 700 to 900. Use the optical-size axis so large sizes get tighter spacing and small sizes stay open. Lining, tabular numerals for prices and times.
- **Text and UI: Instrument Sans** (Google Fonts). Plain, slightly condensed, legible at small sizes, with full pt-BR accents (ã, ç, é, ê, ó, õ). Weights 400, 500, 700.
- **Labels:** Instrument Sans 700, 12px, uppercase, `0.14em` tracking, for eyebrows, tags and category names.

| Role | Desktop | Phone (≤ 639px) | Notes |
| --- | --- | --- | --- |
| Display | up to 7rem | 3rem | Hero only, one per page. Fluid with `clamp`. |
| Headline | up to 3.25rem | 2rem | Section titles |
| Title | 1.5rem | 1.375rem | Card and service-category titles |
| Body | 1.0625rem (17px) | 1rem | Max line 68ch |
| Small | 0.875rem | 0.875rem | Meta, helper text |
| Label | 0.75rem | 0.75rem | Uppercase eyebrow |
| Price | 1.75rem | 1.5rem | Fraunces 800, tabular |

pt-BR runs 15 to 25 percent longer than English, so no headline or button may depend on a fixed width. Allow two-line headlines and wrap button labels. Never set body in Fraunces; never set display below 24px.

## Layout

- **Container:** 1200px max, centered. Reading text 68ch. Gutter 16px on phone (required), 24px from 640px, 32px from 1024px.
- **Grid:** 4 columns phone, 8 tablet (640 to 1023), 12 desktop (1024+).
- **Spacing scale (4px base):** 4, 8, 16, 24, 40, 64, 96. Section padding 96px desktop, 64px phone. Vary section rhythm: do not give every section the same height and the same centered layout.
- **Breakpoints:** 640, 1024, 1280. Design phone-first; verify at 360px, 390px, 768px and 1280px.

**Page structures (Persuade):**
- **Home:** a color-block hero, left-aligned, not centered. Giant Fraunces headline, one gold "Book a chair" button and one secondary "See services" button, and the pole stripe running along the top edge. A real sample photo (or a flat color block when none exists) takes the right side on desktop and sits below on phone. Then in order: services preview, team strip, plan band (`coal-deep`), gallery, sample reviews, contact and hours. Band rhythm is listed under Colors; never two gold bands in a row.
- **Services:** a printed price list. Categories are headlines; each row is name, short description, duration, a dotted leader, and the price in Fraunces. Two columns on desktop, one on phone. The price column is the loudest thing in the row.
- **Team:** portrait cards, 3:4 photo, name, specialty, "Book with [name]". Two columns on phone, three or four on desktop. Cards alternate a gold, cream, or coal photo backing when the photo is a cutout; otherwise plain.
- **Gallery and reviews:** a 2 / 3 / 4 column grid on 3:4 crops with a few featured tiles that span two cells. Reviews are quotes in Fraunces, each labeled **Sample review**.
- **Plans:** three cards, Hair, Beard, Hair and Beard, on the `coal-deep` band. The last plan carries a gold-outlined "Most chosen" badge (sample). Stacked on phone.
- **Contact:** address and hours marked sample, plus a styled map placeholder (no live map embed).

**Page structures (Operate):**
- **Booking:** three steps (service, barber and date, time and confirm). One column to 640px; two columns from 1024px with a sticky summary card. Step indicator uses numerals in Fraunces.
- **Account and Staff admin:** sidebar from 1024px, top tabs on phone. Tables become stacked cards below 640px. White space and `coal-raised` cards, not color blocks.

**Responsive rules:** no horizontal scroll at any width; tap targets at least 48px; the primary "Book" button stays reachable in the header on phone; the pole stripe thins from 12px to 8px on phone; two-column layouts collapse in reading order; images use fixed aspect ratios so nothing jumps while loading.

## Elevation & Depth

Flat, with one playful exception. Depth is color layering and hairlines, never blur.

- **Offset shadow ("sign shadow"):** `4px 4px 0` in `gold` on key cards and the primary hero image: a hard, unblurred offset, like a printed sign mounted on a board. Use on at most two elements per screen. It moves on hover (see Motion).
- **Floating menus** (language menu, mobile nav): `0 12px 28px rgba(43, 20, 13, 0.18)`.
- Everything else: a 1px `line` border or a color change. Sticky header: 1px bottom border.

## Shapes

A friendly, painted-sign geometry: round where you press, crisp where you read.
- **Buttons, language switcher, chips for filters, badges:** pill (`999px`).
- **Cards, images:** `8px`.
- **Inputs and time-slot chips:** `4px`.
- **Pole stripe:** 45-degree bands, width 24px, colors gold / cream / gold-deep / cream.
- **Icons:** one set (Lucide), 2px stroke, rounded caps; sized 20px, 24px in navigation. No emoji as icons.

## Components

**Header.** `coal` background, pole stripe on the top edge (animated). Wordmark in Fraunces 900. Navigation: Services, Team, Gallery, Plans, Contact. Right: PT / EN pill switcher (`aria-pressed`), then the primary "Book" button. On phone: wordmark, "Book" button, menu button. The menu opens a full-height panel with large Fraunces links, staggered in.

**Buttons.** Pill, 52px high (48px minimum on phone), label Instrument Sans 700 at 16px.
- *Primary:* `gold` fill, `coal` text. Hover `gold-hi`. One per view.
- *Secondary:* `coal-raised` fill, 2px `cream` border, `cream` text.
- *On dark / on color:* `gold` fill, `coal` text (same as primary).
- *Text link:* `gold`, 2px underline with 4px offset; hover thickens the underline.
- *Focus:* 3px `gold` ring with 3px offset everywhere.
- *Disabled:* `line` fill, `cream-muted` text, `aria-disabled`, and a visible reason nearby.
- *Loading:* the label is replaced by a small turning-pole spinner; the button keeps its width and sets `aria-busy`.

**Service row.** Name (title), description (small), duration (label), dotted leader (`line`), price. Only the "Book this" control is interactive. Hover on fine pointers tints the row `coal-raised`.

**Barber card.** 3:4 portrait, name, specialty as a label, one-line bio, "Book with [name]" text link. A **Sample** tag sits on every portrait while photos are placeholders.

**Plan card.** Name, price in Fraunces 900 with "/month" in small, inclusion list with check icons, button. Featured plan has the gold-outlined badge and the sign shadow. Marked **Sample price** and **Test mode: no real charge**.

**Step indicator.** Numerals in Fraunces inside 40px circles: current = `gold` fill, done = `gold` outline with a check, upcoming = outlined. `aria-current="step"` on the current one.

**Calendar.** Month grid; today has a gold ring; selected day is a solid `gold` circle; days with no availability are struck through and `aria-disabled`.

**Time-slot chip.** 48px high, 88px wide minimum, 4px radius, 1px `line` border.
- *Available:* `coal-raised`, `cream`.
- *Selected:* `gold` fill, `coal` text, check icon.
- *Unavailable:* `cream-muted`, strikethrough, `aria-disabled`, with the word "Unavailable" in its accessible name.
- *Held by someone else (race):* gold outline, "Just taken" message, announced politely.

**Form fields.** Labels above, always visible. 52px high, 1px `line` border, `cream` on hover, 2px `gold` ring on focus. Error: dashed `cream` border, an alert icon, and a message under the field linked with `aria-describedby`.

**Toasts and confirmation.** A booking confirmation is a full card with a large check, date, time, barber, deposit (test mode) and the 2-hour cancellation rule stated plainly. Toasts are `cream` fill with `coal` text, bottom-center on phone.

**Sample-content markers.** A small `coal` pill with a `gold` outline, "Sample", next to photos, prices, reviews, address and hours. This is a requirement from the brief, not decoration; keep it readable (12px label, `gold` on `coal`).

**Footer.** `coal-deep` band with the stripe along its top, address and hours (sample), language switcher, and a "Portfolio demo" notice.

## Motion

Guided by emil-design-eng. The site should feel alive, but motion is spent where it earns attention: Persuade pages get rich motion, Operate pages get feedback only.

**Rules**
- Ask first: how often is this seen? Anything used many times a day (opening the language menu, keyboard navigation, choosing a time slot repeatedly) is instant or nearly so. **Never animate keyboard-initiated actions.**
- Animate only `transform` and `opacity` (plus `clip-path`). Never `transition: all`. Never `ease-in`.
- UI animation stays under 300ms. Scroll-reveals and the hero may run longer.
- Never enter from `scale(0)`: start at `scale(0.95)` with `opacity: 0`.
- Exit faster than enter (about 60 percent of the enter time).
- Hover effects only inside `@media (hover: hover) and (pointer: fine)`.
- Prefer CSS transitions for UI that can be triggered rapidly (interruptible); use CSS keyframes for predetermined loops; use Motion (the library) for gestures, springs and shared layout.

**Easing tokens**
| Token | Value | Use |
| --- | --- | --- |
| `ease-out` | `cubic-bezier(0.23, 1, 0.32, 1)` | Entrances, press feedback, most UI |
| `ease-in-out` | `cubic-bezier(0.77, 0, 0.175, 1)` | On-screen movement and morphs |
| `ease-drawer` | `cubic-bezier(0.32, 0.72, 0, 1)` | Mobile menu panel |
| Spring | `duration 0.5, bounce 0.2` | Plan card lift, gallery drag, the booking confirmation check |

**Duration tokens:** press 120ms; hover 150ms; menus and popovers 180 to 220ms; panels 300ms; scroll reveals 500ms; hero sequence up to 900ms in total.

**The signature moves (Persuade)**
1. **Spinning pole.** The stripe band in the header and footer drifts continuously along its diagonal (a looped background-position or transform, linear, 12s per cycle). It is the one thing that always moves. It pauses when the tab is hidden.
2. **Hero entrance.** On first load only: the headline reveals line by line (`clip-path: inset(0 0 100% 0)` to `inset(0)`, 600ms, `ease-in-out`), staggered 60ms; the buttons fade up (8px) after; the hero image slides in 24px with a fade. Never replay on language switch or client-side navigation back.
3. **Scroll reveals.** Section content enters with `translateY(16px)` and fade at 500ms `ease-out`, once, as 15 percent of the section is visible. Children stagger 50ms, capped at 6 items so long lists do not crawl.
4. **Price count-in.** Plan prices count up from 0 to their value over 700ms the first time they are seen. The final number is in the DOM from the start (for screen readers and no-JS).
5. **Marquee strip.** A slow `linear` loop of services ("Cut · Beard · Shave · Fade") under the hero, paused on hover, and stopped under reduced motion.
6. **Gallery.** Tiles reveal with `clip-path` wipes; on fine pointers, hover lifts the image `scale(1.03)` over 250ms inside its overflow-hidden frame. A lightbox opens from the tapped tile's position (origin-aware) and closes on Escape with no delay.
7. **Sign-shadow cards.** On hover (fine pointer) the card moves `translate(-2px, -2px)` and its offset shadow grows from 4px to 6px, 150ms. On press it settles to `translate(2px, 2px)` with the shadow at 2px.

**Interaction feedback (everywhere, including Operate)**
- Every pressable thing gets `scale(0.97)` on `:active`, 120ms `ease-out`.
- Language switch: the active pill slides under the new choice (200ms); page text swaps with no animation.
- Mobile menu: panel slides in with `ease-drawer` at 300ms; links stagger 40ms; closes in 180ms. Keyboard-opened and mouse-opened behave the same.
- Calendar day and slot selection: the selected state fills in 120ms; the summary card updates in place with a 150ms cross-fade, using a subtle `blur(2px)` bridge if the swap looks like two objects.
- Step changes in Booking: content slides 24px and fades at 250ms; focus moves to the new step heading.
- Form errors: the field border changes at 150ms and the message fades in. No shaking.
- Booking confirmation: the check draws itself (stroke, 400ms), the card enters with a spring, and a gold confetti-free pulse rings once. This is a rare, first-time-style moment, so delight is allowed.
- Cancel: the booking card collapses with opacity and a 200ms height-safe transform; offer an undo toast first where the rule allows.
- Skeletons while slots load: a calm `coal-raised` shimmer at 1.4s, no spinner on tiny areas.

**Operate surfaces:** no scroll reveals, no marquee, no count-in. Only press, hover, selection, step and confirmation feedback.

**Reduced motion (`prefers-reduced-motion: reduce`):** remove all translation, scale, marquee, counting and stripe drift; keep opacity fades at 150ms and color changes. The stripe becomes static. Loading states keep a non-moving "Loading" label.

**Performance:** animate only compositor-friendly properties; load Motion only where gestures need it (lightbox, confirmation); use CSS for scroll reveals where possible (`@starting-style` and view timelines when supported, with an IntersectionObserver fallback); animation must never delay input; Largest Contentful Paint (the hero) must not wait on an entrance animation.

## Accessibility

- **Contrast:** every text pair is in the table above and meets AA (normal text 4.5:1). Large text (24px, or 18.66px bold) at 3:1 only where explicitly noted.
- **Focus:** always visible: 3px `gold` ring with 3px offset. Never `outline: none` without a replacement. Skip link to main content as the first tab stop.
- **Targets:** 48px minimum for buttons, chips and menu items; 8px gaps.
- **Semantics:** a real `h1` per page and ordered headings; landmarks; the calendar as a grid with arrow-key navigation; slots as a radio group; step progress via `aria-current`; the language switcher with `lang` attributes on swapped content and `hreflang` alternates.
- **Not color alone:** unavailable, selected, error, success and sample states each carry text or an icon.
- **Live regions:** slot-taken, booking confirmed, booking cancelled and form errors announce politely.
- **Motion:** see Reduced motion. Nothing flashes more than three times a second; the marquee and stripe can be paused (a visible pause control for anything that runs over five seconds).
- **Forms:** visible labels, correct `autocomplete`, errors that say what to do, and no loss of input on error.
- **Text:** supports 200 percent zoom and larger system text; line length capped; no text inside images.
- **Imagery:** meaningful alt text for people and spaces; decorative stripes and marks are `aria-hidden`.

## Do's and Don'ts

**Do**
- Make "Book a chair" the most obvious action on every Persuade page, within one tap on phone.
- Gold is the only accent; use it for actions, prices and highlights, not for body text.
- Show prices big, plain and comparable.
- Mark every placeholder with the Sample tag.
- Make motion respond to the user first, decorate second.
- Test pt-BR strings at every breakpoint.

**Don't**
- Don't use gradients, glows, glass, or blurred shadows as decoration.
- Don't center every section or repeat three identical feature cards.
- Don't add a second accent color; no red, blue, green or purple, even for status.
- Don't animate on every scroll position or replay entrance animations on navigation.
- Don't use scissors, razors or cartoon barbers as illustrations; real photography or flat color blocks carry the imagery.
- Don't add vintage ornament beyond the pole stripe and the sign shadow.
- Don't invent testimonials, awards, addresses or staff and present them as real.

## Imagery Sourcing

This is a portfolio, so photos come from free-licence stock libraries (Unsplash, Pexels), not from invented real people.
- Use only images whose licence allows free use without payment; record each image's source URL and photographer in a credits list (footer link or `/credits`).
- Pick photos of barbershop interiors, tools, hands at work and unnamed clients. Team portraits are stock models and stay tagged **Sample**; never attach a stock face to a claim of being a real employee or customer.
- Warm tones preferred, to sit on the warm dark ground. Crop to 3:4 for portraits and gallery, 16:10 for the hero.
- Serve optimised (AVIF/WebP, sized per breakpoint, explicit width and height, lazy-loaded below the fold), with meaningful alt text.
