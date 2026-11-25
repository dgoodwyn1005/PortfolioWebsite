# Portfolio refinement

- Visuals: existing world layouts, restrained accents, keyboard focus, progressive scroll motion, reduced-motion support.
- Engagement: Vercel Web Analytics custom events `sonisphere_demo_launch`, `sonisphere_demo_external`, `sonisphere_product_visit`, `video_player_launch`, `video_external_open`. Only page, content record ID and platform are included; no email or playback telemetry. These measure intent, not actual plays, watch time, or unique users. Custom events require a supported Vercel plan and enabled analytics.
- Admin: direct analytics dashboard entry point; no fabricated local metrics or additional secrets.
- Reliability: public page ISR every five minutes, strict database reads so transient errors do not replace successful cached content. First builds still require database availability. Client-side commercial content is outside ISR.
- SEO: separate 1200 × 630 share images for Build, Music, Life.
- Link health: run `node scripts/check-public-links.mjs` (fixed destinations, no credentials); bot-blocked destinations need manual review. Weekly automation via GitHub Actions.
- Before release: verify preview build, mobile/desktop and reduced motion, production embed, social cards, analytics receipt, cache refresh after admin edits, and link workflow. Do not intentionally pause production Supabase to test resilience.
- Dependency updates are separate: regenerate pnpm lockfile with the verified patched versions, run tests/typecheck/build and review advisories. Do not hand-edit integrity hashes.
