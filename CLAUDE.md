# Barber Shop: Project Rules

## Stack
- Use the approved stack documented in BRIEF.md: Next.js (App Router), TypeScript, Tailwind, Supabase, Stripe (test mode), Resend, next-intl, Vercel.
- Do not add a different framework, database, or hosting provider without approval.

## Git
- Commit each completed, verified step with a clear message.
- Never push, force-push, or commit `.env*` files or secrets. Only `.env.example` is allowed.
- Keep `.env*` in `.gitignore` before the first commit.

## Secrets
- Never expose secrets in code, logs, browser bundles, or chat.
- Only `NEXT_PUBLIC_*` values may reach the browser; keep Stripe and Supabase service keys server-side.

## Quality
- Test changes before committing.
- Use the emil-design-eng skill for animations and interactions.
- Use the Impeccable skill for design and UI audits.

## Production
- Obtain approval before any production change or deployment.
