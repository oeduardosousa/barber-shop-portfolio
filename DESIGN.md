# DESIGN.md

Visual system for the Barber Shop portfolio demo. The shop is fictional: name, address, hours, prices, staff, reviews and photos are sample content. The name used throughout is the placeholder **Navalha & Co.** (sample). Replace it with a single token when the owner picks a real name.

Source of direction: [BRIEF.md](BRIEF.md) (classic barbershop, warm palette, vintage cues, strong serif/display headings, pt-BR and en).

---

## 1. Visual direction

**Mode:** Persuade for Home, Services, Team, Gallery and Plans. Operate for Booking, Account and Staff admin. Both modes share one system; Operate surfaces use fewer flourishes.

**Concept: a printed shop sign and price card.** The look borrows from 1920s–1950s barbershop signage, enamel signs, printed price lists and barber-pole striping. It is warm and high-contrast, never a costume. Everything is flat: hairline rules, paper-tone backgrounds, no gradients, no skeuomorphic shine.

**Three rules that keep it classic and not kitschy:**
1. Vintage cues are used at most once per screen: a pole stripe, a rule, a numbered price, or a bordered sign. Never all four at once.
2. Display type is large and confident; body type is plain and legible. The serif carries the personality, the sans carries the information.
3. Photography and real content lead. Decoration never sits between a client and a price or a button.

**Avoid:** neon, glassmorphism, purple-to-blue gradients, stock-photo smiles, generic hero illustrations of scissors, cartoon barbers, faux-aged textures, drop shadows as the main depth cue, and emblems that read as military or political insignia.

---

## 2. Color

All colors are tokens on `:root` (CSS custom properties). Tailwind theme keys mirror these names.

| Token | Hex | Role |
| --- | --- | --- |
| `--paper` | `#F4EBD9` | Default page background (warm cream) |
| `--paper-raised` | `#FBF6EC` | Cards, menu panels, booking summary |
| `--ink` | `#1B1A17` | Primary text, headings on paper |
| `--ink-muted` | `#5C5346` | Secondary text, captions, meta (passes AA on paper) |
| `--pole-red` | `#9B2226` | Primary action, key accents, pole stripe |
| `--pole-red-hover` | `#7E1B1F` | Primary action hover and pressed |
| `--navy` | `#1D2D44` | Dark sections (footer, plan feature band), secondary action, header on scroll |
| `--navy-ink` | `#F4EBD9` | Text on navy (same as paper) |
| `--brass` | `#C29B4B` | Decorative rules, numerals, focus accent on navy only |
| `--line` | `rgba(27, 26, 23, 0.16)` | Hairline borders and rules on paper |
| `--success` | `#2F5D3A` | Confirmed booking, active plan |
| `--danger` | `#9B2226` | Errors (same as pole red, always paired with an icon and text) |

**Contrast (WCAG 2.x, measured):**

| Pair | Ratio | Use |
| --- | --- | --- |
| `--ink` on `--paper` | 14.69 : 1 | Body text |
| `--pole-red` on `--paper` | 6.69 : 1 | Links, accents, text buttons (AA and large text) |
| `--ink-muted` on `--paper` | 6.38 : 1 | Captions and meta |
| `--navy` on `--paper` | 11.73 : 1 | Secondary headings |
| `--paper` on `--navy` | 11.73 : 1 | Text on dark bands |
| `--brass` on `--navy` | 5.35 : 1 | Small accents on navy only |
| `--pole-red` on `#FFFFFF` | 7.92 : 1 | Primary button label on white (use paper text on red buttons: see below) |

Rules:
- **Brass never carries text on paper** (2.19 : 1). It is for rules, numerals and ornaments, or for text only on navy.
- Primary button: `--pole-red` background with `--paper` text. Ratio of paper on pole red is 6.69 : 1.
- Gray-on-cream is not allowed for body copy. Use `--ink-muted` instead of a lighter tint.
- Sold-out or unavailable states use `--ink-muted` plus a strikethrough and the word, never color alone.

**Dark mode:** not in v1. The brand is a light, paper-based shop; navy bands provide the dark moments. If dark mode is added later, invert paper and ink tokens, keep brass and red as they are, and re-measure every pair above.

---

## 3. Typography

| Role | Family | Source | Notes |
| --- | --- | --- | --- |
| Display | **Bodoni Moda** | Google Fonts | Headings, price numerals, quotes. Use optical sizing; weights 500 and 700. |
| Text and UI | **Libre Franklin** | Google Fonts | Body, forms, navigation, buttons. Weights 400, 500, 700. Has full Latin coverage for pt-BR accents (ã, ç, é, ê, ó, õ). |
| Label caps | Libre Franklin | Google Fonts | Uppercase, `letter-spacing: 0.14em`, weight 700, size 12–13px. Used for eyebrows and category tags. |

**Scale** (rem, base 16px; line-heights tuned for pt-BR, which runs ~15–25% longer than en):

| Token | Size desktop | Size phone (≤ 639px) | Line-height | Family / weight |
| --- | --- | --- | --- | --- |
| `display-xl` | 4.5rem | 2.75rem | 1.02 | Bodoni Moda 700 |
| `display` | 3rem | 2.25rem | 1.08 | Bodoni Moda 700 |
| `h2` | 2.25rem | 1.875rem | 1.15 | Bodoni Moda 500 |
| `h3` | 1.5rem | 1.375rem | 1.25 | Bodoni Moda 500 |
| `h4` | 1.125rem | 1.0625rem | 1.35 | Libre Franklin 700 |
| `body-lg` | 1.25rem | 1.125rem | 1.6 | Libre Franklin 400 |
| `body` | 1rem | 1rem | 1.6 | Libre Franklin 400 |
| `small` | 0.875rem | 0.875rem | 1.5 | Libre Franklin 400, `--ink-muted` |
| `label` | 0.75rem | 0.75rem | 1.2 | Libre Franklin 700, uppercase |
| `price` | 1.5rem | 1.375rem | 1 | Bodoni Moda 700, tabular figures (`font-variant-numeric: lining-nums tabular-nums`) |

Rules:
- Body text is never below 16px. Labels and captions may go to 12px only in uppercase label style.
- Measure: body copy 60–72 characters (`max-width: 66ch`).
- Headings use `text-wrap: balance`. Body uses `text-wrap: pretty`.
- Prices always use the `price` style and the local currency format (R$ for pt-BR, and the en locale format), with the service duration in `small` beside it.

---

## 4. Spacing, radius, elevation

**Spacing scale (px):** 4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 · 128. Use the scale only; no arbitrary values.

**Section rhythm:** 96px vertical padding on desktop, 64px on phone. Adjacent sections alternate paper and paper-raised, or paper and a navy band. Never two navy bands in a row.

**Gutters:** 16px on phone (required by the brief), 24px at ≥ 640px, 32px at ≥ 1024px.

**Radius:** `2px` for buttons, inputs, cards and chips. Classic signage has crisp corners. Only avatars and the language switcher pill use `999px`.

**Elevation:** flat. Use `--line` hairlines to separate. A single shadow token is allowed for floating menus only: `0 12px 28px rgba(27, 26, 23, 0.14)`. Sticky header gets a hairline bottom border, not a shadow.

**Stripe motif:** a 6px tall band of three diagonal stripes (`--pole-red`, `--paper`, `--navy`) at 45°, used as the top edge of the header and as the section divider in the footer. Never repeated inside content.

---

## 5. Layout

- **Container:** max-width 1200px, centered, with the gutter above. Reading content (articles, terms) uses 720px.
- **Grid:** 12 columns on desktop (≥ 1024px), 8 on tablet (640–1023px), 4 on phone (≤ 639px).
- **Home:** full-bleed hero with the shop photo (sample), display headline, one primary action ("Book a chair") and one secondary ("See services"). Below the hero: a short services preview, the team strip, the monthly plan band (navy), gallery, reviews, contact and hours.
- **Services:** a printed price-list layout. Categories are `h3` headings. Each service is a row: name, short description, duration, then price right-aligned with a dotted leader drawn in `--line`. On desktop, two columns of categories; on phone, one.
- **Team:** portrait cards, 2 columns on phone, 3–4 on desktop. Each card: photo (sample), name, specialty, short bio, "Book with [name]" link.
- **Gallery & reviews:** masonry-like grid of 2 columns on phone, 3 on tablet, 4 on desktop, with consistent 3:4 crops for uniform rhythm. Reviews appear as quotes in `h3`-sized Bodoni, each labeled "Sample review".
- **Booking:** a three-step flow (service → barber and date → time and confirm) on a single column up to 640px; a two-column layout with a sticky summary on desktop.
- **Account and Staff admin:** a left sidebar on desktop (≥ 1024px) that collapses into a top tab row on phone. Tables become stacked cards below 640px.
- **Plans:** one card with the monthly price, a short inclusion list, and the checkout button, on the navy band.

---

## 6. Components

**Header.** Paper background, stripe motif on top, logo wordmark in Bodoni Moda (text wordmark only; no logo asset provided). Navigation: Services, Team, Gallery, Plans, Contact. Right side: language switcher (PT / EN pill, `aria-pressed` on the active one), then the primary button "Book". Phone: wordmark left, "Book" and a menu button right; the menu opens as a full-height panel.

**Buttons.**
- `primary`: `--pole-red` background, `--paper` text, label 700 at 15px, height 48px on phone and 44px on desktop, padding 0 24px, radius 2px.
- `secondary`: transparent, 1px `--ink` border, `--ink` text. On navy, the border and text switch to `--paper`.
- `text`: `--pole-red` text with an underline offset 4px. Used for inline "See all" links.
- States: hover darkens by one step (`--pole-red-hover`); focus-visible draws a 2px outline in `--ink` with 2px offset on paper, or `--brass` on navy; disabled uses `--line` background and `--ink-muted` text, with `aria-disabled` and a visible reason nearby.

**Service row.** Name in `h4`, description in `small`, duration in `label` style, price in `price`. The whole row is not clickable; only "Book this" is (text button or secondary button depending on width).

**Barber card.** Portrait image 3:4, name `h4`, specialty `label`, one-line bio `small`, and a text button to book with that barber. Hover (fine pointer only) lifts the image slightly; no other change.

**Booking step indicator.** Three numbered steps. Numerals use `--brass` on navy or `--pole-red` on paper. The current step has an `aria-current="step"` label; completed steps show a check with the word "Done".

**Time slot chip.** Height 44px, min-width 84px, radius 2px, 1px `--line` border.
- Available: paper-raised background, ink text.
- Selected: `--ink` background, `--paper` text, with a check icon.
- Unavailable: `--paper` background, `--ink-muted` text, strikethrough, and `aria-disabled`. The word "Unavailable" is present in the accessible name.
- Never shown as a color-only difference.

**Form fields.** Labels above the field, always visible (no placeholder-as-label). Input height 48px, 1px `--line` border at rest, 1px `--ink` border on hover, and a focus ring of 2px solid `--pole-red` with 2px offset (`--brass` on navy). Error: a border in `--danger`, an icon, and a message in `small` under the field, linked with `aria-describedby`.

**Plan card (navy band).** Price in `display` on paper, "per month" in `small`, inclusion list with brass check icons, primary-style button inverted: paper background with navy text, since red on navy is not used for buttons.

**Notice / toast.** Paper-raised panel, 1px `--line` border, 4px left bar in the status color (success green, danger red). Icon plus text, never color alone. Lives bottom-center on phone, top-right on desktop.

**Sample marker.** A small label "Sample content" in `label` style, placed in the footer and once per page near the hero. It is visible text, not a watermark.

**Footer.** Navy band with the stripe motif at top. Address, hours and contact in paper text (all marked sample), links to Services, Team, Plans, Account, and language switch. Copyright line with the "Sample content" statement.

---

## 7. Imagery and content rules

- Photography: warm, natural light; tight crops on hands, tools and faces; no stock smiles. Consistent color grade toward cream and warm shadows.
- Every image has descriptive `alt` text in the current locale. Decorative images use `alt=""`.
- Sample people are labeled as sample in alt text or caption where the shop is presented as real.
- No logos, trademarks or real businesses referenced.
- Reviews are fabricated sample text and must read as sample (see "Sample review" label above).

---

## 8. Responsive rules

- **Design phone first at 375px width.** No horizontal scroll at any width from 320px up. Test with long pt-BR strings.
- **Breakpoints:** 640px (tablet), 1024px (desktop), 1280px (wide container).
- **Phone (≤ 639px):**
  - 16px gutter; type scale per the phone column above.
  - Full-width buttons in forms and at section ends; inline buttons otherwise.
  - Primary "Book" action is pinned in a bottom bar on Services, Team and Barber pages, with `padding-bottom: env(safe-area-inset-bottom)`. The bar is hidden while a form field has focus.
  - Tap targets at least 44 × 44px.
  - Tables become stacked cards.
  - Gallery in 2 columns; masonry is replaced by a uniform grid.
- **Tablet (640–1023px):** two-column content grids, sidebar becomes a tab row, booking stays single column.
- **Desktop (≥ 1024px):** full layout, sticky booking summary, 12-column grid, hover states enabled.
- **Images:** responsive `srcset`, aspect ratios fixed in CSS to prevent layout shift.
- **Long text:** allow pt-BR to wrap; no fixed-width buttons; `min-width: 0` on flex children; `overflow-wrap: anywhere` only on user-generated strings.

---

## 9. Accessibility

- **Contrast:** every text pair is at least 4.5 : 1 (AA). Large display text is well above 3 : 1. The table in section 2 is the source of truth; re-measure if a token changes.
- **Focus:** a visible focus ring on every interactive element (2px outline, 2px offset). Never removed. Brass ring on navy, red or ink ring on paper.
- **Keyboard:** full keyboard path through the booking flow; the slot grid uses roving tabindex with arrow keys.
- **Semantics:** one `h1` per page; sections have headings; the language switcher uses `lang` on the document and `hreflang` links; forms use real `label` elements and `aria-describedby` for hints and errors.
- **Color is never the only signal.** Errors have icons and text; availability has strikethrough and text; the active nav item has an underline and `aria-current`.
- **Motion:** respects `prefers-reduced-motion` (section 10).
- **Language:** `<html lang="pt-BR">` or `lang="en"`, switched per route. Date and currency formatted per locale.
- **Touch:** 44px minimum targets; 8px minimum spacing between adjacent targets.
- **Screen readers:** sample content labeled as sample; decorative stripes and rules are `aria-hidden`.

---

## 10. Animation and motion

Guided by the emil-design-eng principles: motion serves feedback, orientation or a one-time reveal; nothing animates on the keyboard or in the flow a client repeats many times.

### Rules
- **Frequency first.** Keyboard-triggered actions, slot toggling in the booking grid on repeat, and nav link hovers do not animate beyond a color change.
- **Only `transform` and `opacity` animate.** No `width`, `height`, `padding` or `margin` animation, except the menu height in the single case noted below, which uses `grid-template-rows`.
- **Named properties only.** No `transition: all`.
- **Ease out for entrances and feedback.** Use `cubic-bezier(0.23, 1, 0.32, 1)` for UI. Use `cubic-bezier(0.77, 0, 0.175, 1)` only for on-screen movement such as the gallery lightbox moving between images. Never `ease-in` on UI.
- **Duration under 300ms** for every UI interaction. Reveals may run to 600ms but only once per page load.
- **Exit faster than enter.** Entrance 240ms, exit 160ms.
- **Enter from ~95% scale or a small offset, never from `scale(0)`.** Pair with opacity 0 at the start.
- **Popovers scale from their trigger** using `transform-origin: var(--transform-origin)`. Modals keep `transform-origin: center` and centered placement.
- **Interruptible.** Use CSS transitions for states that can be toggled rapidly (menu, tabs, slot selection). Use keyframes only for one-shot reveals.
- **Hover effects only on fine pointers:** `@media (hover: hover) and (pointer: fine)`.
- **Decorative motion never blocks** interaction; stagger never delays a control from being usable.
- **Motion library:** use Motion (framer-motion) only where a value must follow a gesture or spring (booking step swipe on phone, lightbox drag). Use the full `transform` string for hardware acceleration, not the `x`/`y` shorthands, when the page is busy.

### Tokens

```css
:root {
  --ease-out: cubic-bezier(0.23, 1, 0.32, 1);
  --ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);
  --ease-drawer: cubic-bezier(0.32, 0.72, 0, 1);
  --dur-press: 160ms;
  --dur-hover: 200ms;
  --dur-popover: 180ms;
  --dur-drawer: 300ms;
  --dur-reveal: 480ms;
  --dur-toast: 280ms;
}
```

### Interaction map

| Element | Trigger | Motion | Duration / easing | Notes |
| --- | --- | --- | --- | --- |
| Primary and secondary button | `:active` | `transform: scale(0.97)` | 160ms `--ease-out` | Every pressable element, 0.95–0.98 range |
| Text link | hover (fine pointer) | Color and underline offset | 200ms `ease` | No transform |
| Barber card image | hover (fine pointer) | `scale(1.02)` on the image inside `overflow: hidden` | 240ms `--ease-out` | Gated behind the hover media query |
| Language switcher pill | click | Thumb slides to the new position | 200ms `--ease-out` | Use transform, not left/width |
| Header menu (phone) | open / close | Panel slides from top, `transform: translateY(-100%)` to `0` | Open 300ms `--ease-drawer`, close 200ms `--ease-out` | Backdrop fades in 200ms |
| Language or sort dropdown | open | Scale from trigger: `scale(0.96)` + opacity | 180ms `--ease-out`, `transform-origin` from trigger | Popover rule applies |
| Modal (confirm cancel, sign-in) | open | Fade + `scale(0.96)` from center | 240ms `--ease-out` | `transform-origin: center`; exit 160ms |
| Booking step change | Next / Back | Current step fades and shifts 12px; next enters from the side it came from | Enter 240ms `--ease-out`, exit 160ms | Reduced motion: opacity only |
| Time slot chip | select | Background and text color change | 120ms `ease` | Color only, no movement |
| Form error message | validation | Fade and 4px slide down | 180ms `--ease-out` | Announced via `aria-live="polite"` |
| Toast / notice | show / dismiss | Slide in from bottom (phone) or top-right (desktop) with opacity | Enter 280ms `--ease-out`, exit 200ms | Pauses timer when tab is hidden; uses `@starting-style` where supported |
| Section reveal on scroll | first intersection | Opacity 0 to 1, `translateY(8px)` to `0` | 480ms `--ease-out`, once per page load | Stagger 50ms between cards, max 4 items in sequence |
| Gallery image reveal | first intersection | `clip-path: inset(0 0 100% 0)` to `inset(0 0 0 0)` | 600ms `--ease-in-out`, once | Skip if reduced motion |
| Gallery lightbox | next / prev | Image slides horizontally | 320ms `--ease-in-out` | Drag with spring (Motion); reduced motion: crossfade 160ms |
| Plan card "active" state | purchase success | Badge scales from `0.95` with opacity | 240ms `--ease-out` | One-time, on success only |
| Sold-out chip | page load | None | n/a | Static state; no motion |
| Stripe redirect | navigate | None on our side | n/a | Show a static "Redirecting…" text |

### Reduced motion

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 1ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 120ms !important;
    scroll-behavior: auto !important;
  }
  .reveal, .gallery-reveal { opacity: 1; transform: none; clip-path: none; }
}
```

Reduced motion keeps opacity and color changes (they aid comprehension) and removes transform-based movement, reveals and parallax.

### Things we do not animate
- The header on scroll (it stays put with a hairline border).
- Price changes, or any number that a client is comparing.
- Page-to-page route transitions beyond a 160ms opacity change.
- Keyboard shortcuts and the language toggle's text.
- Loading states beyond a static skeleton with no shimmer; if a spinner is needed, rotate it fast (under 800ms per turn) so the wait feels shorter.

---

## 11. Copy and labels (visual rules only)

- Buttons use verbs: "Book a chair", "Choose a time", "Confirm booking", "Start monthly plan", "Cancel booking".
- Prices always show the currency and the duration next to them.
- Sample content is labeled once per screen where a claim could be read as real.
- Language switch labels are "PT" and "EN", with `aria-label` "Português (Brasil)" and "English".

---

## 12. Implementation notes

- Tokens live in `:root` and are mirrored in the Tailwind theme.
- Fonts load from Google Fonts with `display=swap`; subset to Latin, with `font-display: swap` and a serif fallback (`Georgia, serif`) and a sans fallback (`system-ui, sans-serif`).
- No secrets or service keys in this file.
- Any new color or spacing value must be added as a token first, then measured for contrast before use.

---

## 13. Open decisions (owner input needed)

- Shop name and logo (placeholder "Navalha & Co." in use; no logo provided, so the wordmark is set type only).
- Brand colors: this palette is a proposal. Replace the cream, red and navy tokens together if the owner has brand colors; re-measure section 2.
- Whether booking requires a deposit (affects the booking summary layout, not the palette).
- Additional languages beyond pt-BR and en (would need a type check for diacritics and text expansion).
