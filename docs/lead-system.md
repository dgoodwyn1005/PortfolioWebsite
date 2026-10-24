# Development and release

Use Node.js 24 and pnpm 11.25.0 (pinned in package.json). pnpm-lock.yaml is authoritative: it was the more recently maintained lockfile; the stale npm lockfile was removed. Do not regenerate both.

```sh
pnpm install --frozen-lockfile
pnpm typecheck
pnpm lint
pnpm test
pnpm build
pnpm dev
```

Fonts are bundled from Fontsource packages, retaining Inter and Geist Mono without build-time Google network requests. Admin routes are dynamic because they depend on the current session. The lint configuration keeps legacy React Compiler and explicit-any findings visible as warnings; these remain a cleanup backlog, not a claim of warning-free lint. Tests require Node's experimental module-mocking flag (provided by `pnpm test`).

## Runtime configuration

Set the actual development Supabase project URL and public anon key in `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` before building. The server also supports `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, but the auth proxy still uses the anon name. `SUPABASE_SECRET_KEY` (or `SUPABASE_SERVICE_ROLE_KEY`) is server-only and required by contact persistence. Never expose it via NEXT_PUBLIC variables. Allow HTTPS to the actual project hostname.

For owner notifications set `RESEND_API_KEY`, `LEAD_FROM_EMAIL` (a sender verified by Resend), and optionally `LEAD_NOTIFICATION_EMAIL` (default: contactme.dkg@gmail.com). Allow api.resend.com. Customer acknowledgements are off unless `LEAD_ACK_EMAILS_ENABLED=true`; enable only after sender verification. `NEXT_PUBLIC_SITE_URL` sets canonical/admin links.

The archive claims schema/security changes were applied live; this environment has no database credentials, so that claim has not been independently verified. Confirm selected_service, owner_notification_status/attempted_at, acknowledgement_status/attempted_at and the six lead stages exist. `scripts/023_lead_delivery_fields.sql` is a reviewable compatibility migration, not executed automatically. The separately mentioned `020_portfolio_lead_security.sql` was not supplied in the archive. Confirm contact_submissions has RLS, no anonymous direct-insert policy, and admin-only access; do not infer security configuration from the archive README. Do not migrate a live database as part of dependency installation.

Supabase persistence is authoritative. Notifications run after save with an 8-second timeout per provider request; failures and status-write exceptions do not reject or delete saved leads. Provider idempotency keys use the saved lead ID. Delivery state is separate from the sales stage. Duplicate checks suppress matching email/message retries within ten minutes; this is best-effort and not an atomic uniqueness guarantee under concurrent submissions. The honeypot and per-email burst guard are lightweight controls, not a substitute for edge rate limits.

## Release order

1. Verify the target database schema/security and configure Supabase and email values securely.
2. Deploy this branch's simplified forms and verify Wynora no longer renders the old package-price options. Verify persistence, notification statuses and admin stages against a development database before production rollout.
3. Only after that deployment is verified, separately review/apply `scripts/021_wynora_market_pricing.sql`. This change includes it as staged SQL; it has NOT been run.

Without Supabase, public world pages use existing fallback content and company routes may return 404. A credential-free build verifies compilation, not live company content or end-to-end email delivery. Browser smoke tests use an isolated local Supabase fixture and never contact the real database or send email.

## Validation evidence

The integration passed a frozen pnpm install, standalone TypeScript, production build, and lint (zero errors; legacy warnings remain). Node regression tests cover persistence/notification ordering, duplicate retries, delivery-status write failure, provider rejection/timeout, honeypots, rate limits and validation. Run `python tests/browser-smoke.py` with Python Playwright and Chromium installed for isolated browser checks: all six public routes, mobile widths 320/375/768/1280, persistent CTAs, Escape/menu state, service selection and simplified form submission, with browser runtime/hydration error collection. Fixture browser tests and mocked unit tests do not establish live Supabase or Resend delivery.
