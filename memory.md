# Memory — Portfolio: work-first home page is live

Last updated: 2026-11-26

## What was built
- Live: pushed `963edee`, deployed and checked (routes, drafts hidden, no dead links, preview image, Kosher Spa logo fixed).
- In that push:
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
1. Live and checked: pushed `5a6fcbf` (new fonts, conventional web layout, tidier phone design). Offered next: the same web menu bar on CV, About, Story and Gallery.
1b. NOT yet committed: phone header without the background banner (photo kept) and a floating see-through bottom bar (`src/components/PhoneDock.tsx`) copied from Dwayne's iOS screenshot; replaces the tabs. 11 browser interaction checks pass at phone size; not tried on a real iPhone. Waiting for "push".
1c. Message box + WhatsApp: chosen and mocked up (https://claude.ai/artifact/7aSn749Q4SC9PjKSrNvY7Y), waiting for approval, a WhatsApp number and the alert email. Needs a database script, a Resend account for the alert address, and spam limits.
2. Dwayne reads the three drafts at `/private`; confirm visits show in Vercel Analytics; collect real numbers and quotes.
3. Tidy-up, if wanted: the old 3D files and packages are now unused.

## Open questions
- Case study drafts need a read-through and sign-off before publishing.
- Handle on the phone header comes from the X link; is that the right account?
- Real results to add to the case studies (users, bookings).
- Delete the unused 3D models and textures in `public/`?
