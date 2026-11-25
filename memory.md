# Memory — Portfolio: private content model built, not yet live

Last updated: 2026-11-25

## What was built
- Content model and privacy: `supabase/002_content_model.sql` (already run by Dwayne), `src/lib/content.ts` (`getPublic*` / `getOwner*`), `src/lib/owner.ts`, `src/lib/auth.ts`, `middleware.ts`, `src/lib/safe-url.ts`.
- Public pages: `/story`, `/journal`, `/journal/[slug]`, `/c/[slug]`, `/p/[slug]`. Owner-only: `/private`, `/private/journal/[slug]`, `/private/p/[slug]`.
- Admin editors: pages, timeline, journal, collections (with items), projects (visibility). Actions in `app/admin/actions.ts`.
- Project setup copied from his other projects: `AGENTS.md`, `CLAUDE.md`, `.claude/skills/` (architect, review, recover, remember, imprint), `docs/sessions/`.
- Checks passed: tsc, lint, production build, and a local test of the login redirects with and without the admin env vars.

## Decisions made
- Private = owner-only login. Visibility is `public` or `private`; default private.
- Privacy enforced in code (service-role key ignores row rules); database row rules are the second lock.
- Plain-text bodies, no markdown or HTML. Images are URLs.
- Nothing committed or pushed yet; commit only when Dwayne says so.

## Problems solved
- Forgeable admin cookie when env vars were unset: now fails closed.
- Scripted multi-line replace missed because files use CRLF: use the Edit tool.

## Current state
- Live site still shows "Content isn't set up yet". On 2026-11-25 `npm run seed` failed: no `.env.local` file exists in the portfolio folder (only `.env.local.example`). The seed script now explains this in plain words.
- Dwayne said the SQL has been run in Supabase. Vercel env vars: not confirmed.

## Next session starts with
1. Confirm `.env.local` exists (check with `ls`, never read it), run `npm run seed`, confirm the four env vars in Vercel, redeploy, and check the live site.
2. Ask whether to commit.
3. Then fill in content with Dwayne (biography, journal, books, politics, playlists) and mock up Story / Library / Playlists before more UI.

## Open questions
- Delete the unused 3D models and textures in `public/` (about 12 MB)?
- Login rate limit and image upload: wanted now or later?
- Amadi-PA (folder `ProjectTasks`): should its to-dos or widget idea feed the portfolio?
