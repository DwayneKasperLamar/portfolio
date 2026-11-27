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
1. Live and checked: pushed `0f2f2ec` (floating phone menu, simpler phone header); 11 browser checks pass on the live site.
2. NOT yet committed: admin redesign (side menu, dashboard, collection pages), Admin > Gallery with multi-upload, gallery section on the home page, approved message box + WhatsApp button + Admin > Messages. Sandbox tests of the message box pass (15); admin walk on the real database passes, test upload removed. Waiting for "push".
3. Dwayne to do: run `supabase/004_messages.sql`; enter the WhatsApp number in Admin > Messages; Resend account + `RESEND_API_KEY`, `ALERT_EMAIL` in Vercel; upload gallery photos. Then send one real test message.
4. Read the three case study drafts at `/private`; collect real numbers and quotes.

## Open questions
- Case study drafts need a read-through and sign-off before publishing.
- Handle on the phone header comes from the X link; is that the right account?
- Real results to add to the case studies (users, bookings).
- Delete the unused 3D models and textures in `public/`?
