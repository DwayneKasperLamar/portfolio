# 2026-11-25 — Private content model, owner area and admin editors

**In one line:** turned a one-page portfolio into a site with a biography, journal, library and a private area, and made privacy the main rule.

## What we set out to do
Bring live content onto the site (it showed "Content isn't set up yet") and grow it into a documentary and biography: pages,
carousels, links, journals, playlists, books, politics, life's works, with a large private part. Study Dwayne's other projects first, especially their skills and `AGENTS.md`.

## What we built
- `supabase/002_content_model.sql`: `visibility` on everything; new tables `pages`, `timeline_events`, `journal_entries`, `collections`, `collection_items`; row rules so the anon key sees only public rows.
- Public pages `/story`, `/journal`, `/c/<slug>`, `/p/<slug>`; owner-only `/private/*`; admin editors for Pages, Timeline, Journal, Collections.
- `src/lib/content.ts` split into `getPublic*` and `getOwner*`; `requireOwner()`; `safeUrl()`; constant-time login checks; the login now fails closed when env vars are missing.
- This project now has `AGENTS.md`, `CLAUDE.md`, the five shared skills, and this log.

## Dwayne's approach
- Asked to study the sibling projects first and to make the whole thing a documentary and biography, with much of it private.
- Chose: owner-only login for private content (no accounts for other people yet), data model and admin editors first, and he keeps his own Supabase keys (never pasted into chat).
- Pushed on the right habit: study how the other projects are run (skills, `AGENTS.md`) and use the same setup here.

## Claude's approach
- One flexible `collections` + `items` pair instead of a table per topic (books, playlists, links, politics...). New topics need no new table.
- The server uses the service-role key, which ignores database row rules, so privacy is enforced in code (`getPublic*` vs `getOwner*`) with the database rules as a second lock. Rejected: switching the site to the anon key now (needs another env var and a bigger change).
- Found and fixed a real hole: with no admin password set, the admin cookie was the hash of "undefined:undefined" and anyone could forge it.
- Plain text only (no HTML or markdown library): nothing typed in the admin can inject markup.
- Rejected: Clerk accounts (more to maintain for one user), image upload (URLs for now).

## What we learned
- A private area is only as safe as its weakest read path. List every place content is read, and put the filter in one place.
- Files with Windows line endings make scripted multi-line replaces miss silently; verify with a diff.
- A seed script should say what is wrong in plain words when `.env.local` is missing.

## Open threads
- Dwayne runs `npm run seed` once `.env.local` exists, sets the four Vercel env vars and redeploys.
- Biography, journal, books and politics content: needs Dwayne (typed in admin, or a short interview).
- Mockups for Story, Library and Playlists; login rate limit; image upload; sharing a private page by link; delete unused 3D files in `public/` (ask first).
- Nothing is committed yet.
