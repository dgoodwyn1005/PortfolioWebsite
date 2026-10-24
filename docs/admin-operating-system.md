# Admin Operating System

The admin is the operating layer behind Deshawn Goodwyn, Wyntech, and Wynora. It should remain useful as the portfolio grows from a personal site into a long-lived body of work, commercial system, archive, and operating history.

## Core model

Every admin capability should fit one of five durable groups:

- **Operate** — leads, orders, invoices, active work, and anything requiring a human response.
- **Publish** — personal-site content that becomes part of the public body of work.
- **Ventures** — Wyntech and Wynora content, proof, offers, people, FAQs, and media.
- **Commerce** — products, prices, and payment infrastructure.
- **System** — reusable assets and low-frequency infrastructure controls.

Do not add a new top-level category for every feature. Extend the existing model unless the product has genuinely developed a new long-term operating function.

## The compounding loop

The dashboard is organized around a four-step loop:

1. **Capture** — preserve and respond to real interest.
2. **Ship** — turn work into something usable and public.
3. **Prove** — capture outcomes, testimonials, case studies, and evidence.
4. **Sell** — keep offers and pricing aligned with the current level of work.

A useful feature should strengthen at least one part of this loop. The goal is not to collect controls; the goal is to make each cycle leave the system more valuable than before.

## Preserve history

Long-lived systems need memory.

- Prefer **archive** over permanent deletion for leads and other meaningful records.
- Keep timestamps and status history meaningful.
- Do not erase old work simply because it is no longer featured publicly.
- Separate public visibility from record existence wherever possible.
- Treat testimonials, completed work, customer inquiries, and commercial history as durable institutional memory.

## Authorization

Admin authorization is database-backed.

- `public.user_roles` is the application source of truth for admin membership.
- `private.is_admin()` is used by database policies.
- The Next.js proxy and admin shell consult `user_roles` for route/UI authorization.
- Do **not** make authorization decisions from `user_metadata`. User metadata is profile data, not a permission source.
- Keep RLS as the final data-level boundary even when route protection exists.

## Dashboard philosophy

The dashboard should answer four questions quickly:

1. **What needs attention?**
2. **What is moving?**
3. **What can the public actually see?**
4. **What should become proof or an offer next?**

Prefer operational signals over vanity counts. Useful examples include unresolved leads, lead velocity, conversion, notification health, publishing visibility, content freshness, active offers, and recent activity.

## Scaling rules

When the dataset grows:

- paginate instead of loading an entire table into the browser;
- search and filter server-side through Supabase;
- preserve stable status vocabularies;
- avoid dashboards that require one query per row;
- keep mobile administration usable, not merely technically responsive;
- add indexes only when actual query patterns justify them;
- keep public rendering separate from admin editing concerns.

## Future extensions

Good future additions, when the data exists to support them:

- content freshness and review reminders;
- first-party conversion events and funnel analytics;
- a durable client/project relationship model once leads regularly become multi-step engagements;
- revenue and order trend reporting;
- structured case-study capture after a lead is marked won;
- an append-only admin activity/audit trail if multiple administrators are ever introduced;
- canonical ownership of important remote media in controlled storage.

These should be introduced when they solve a recurring operating problem, not preemptively.

## Design rule

The public site can evolve dramatically. The admin should evolve more slowly.

A good admin is calm, predictable, information-dense without becoming cluttered, fast on a phone, and resilient to years of accumulated data. Stability is a feature.
