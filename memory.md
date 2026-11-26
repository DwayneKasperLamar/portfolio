# Memory — Portfolio: work-first home page built, not yet pushed

Last updated: 2026-11-26

## What was built
- Live code: up to `3ea6edc`. The database content changes below already show on the live site.
- NOT yet committed:
  - Uploads (private bucket, `/media/[name]`), phone-only profile header.
  - Home page order: headline + Email, work experience, case studies, how I work with AI, what I do, work with me, about, tools, contact. New `/work`, `/cv` (prints on one page), `/about`; draft preview at `/private/work/[slug]`.
  - Link preview image, Vercel Analytics on public pages only. GitHub widget and "Working on now" removed.
- Database (applied): new headline/about/availability text; lists `experience`, `ai-workflow`, `work-with-me`, `contact`, empty `quotes`; three PRIVATE case study drafts; tools updated; two dead project links removed; one product description corrected.
- Checks: types, lint, build; strangers cannot open drafts or private pages; no dead links; screenshots of web, phone, CV, preview image.

## Decisions made
- Roles: Software Architect at Kosher Spa; co-founder and Software Architect at Uncollos; previously mobile developer at Spaxe. Open to remote roles.
- Say plainly that AI writes much of the code and Dwayne decides and checks.
- Uncollos logo is correct as it is. Both email addresses are shown.
- Web header stays simple text; the photo header is phone-only.
- Repository is public: no private project names, drafts or private writing in committed files.

## Next session starts with
1. Ask whether to push. After deploy: set the Kosher Spa project logo to `/assets/logos/kosher-spa.png` (not before, the file is not live yet), check the preview card, turn on Analytics in Vercel.
2. Dwayne reads the three drafts at `/private` and publishes the ones that are ready.
3. Collect real numbers and quotes.

## Open questions
- Case study drafts need a read-through and sign-off before publishing.
- Handle on the phone header comes from the X link; is that the right account?
- Real results to add to the case studies (users, bookings).
- Delete the unused 3D models and textures in `public/`?
