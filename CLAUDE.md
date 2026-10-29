# Barber Shop: Project Rules

## Stack (approved, see BRIEF.md)
- Next.js (App Router), TypeScript, Tailwind CSS, next-intl (pt-BR, en).
- Supabase (Postgres, Auth, RLS), Stripe (test mode only), Resend, Vercel Hobby.
- Do not add a different framework, database, or host without approval.

## Git
- Commit each completed, verified step with a clear message. Test before committing.
- Never push, force-push, or commit `.env*` files or secrets. Only `.env.example` is allowed.
- `.env*` must be in `.gitignore` before the first commit.

## Secrets
- Never expose secrets in code, logs, browser bundles, or chat.
- Only `NEXT_PUBLIC_*` values may reach the browser.

## Quality and Production
- Use emil-design-eng for animations and interactions.
- Use Impeccable for design and UI audits.
- Obtain approval before any production change or deployment.
