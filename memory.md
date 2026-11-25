# Memory — Portfolio: content positioning, widgets, gallery concepts

Last updated: 2026-11-25 (evening)

## What was built (NOT committed or pushed; live site has only commit 871e670)
- Bigger side tech icons on a light chip; vertical spread fixed. Not yet looked at in a browser.
- Intro rewritten as "Software Architect", detailed and direct (role, intro, Now). Applied to the database.
- "What I do" section (public collection `what-i-do`) and "Working on now" (public collection `working-on`).
- Books collection (public): Meditations and Crime and Punishment, status "reading now"; Open Library covers.
- Widgets: GitHub "Latest pushes" commit feed (public repos only, cached 15 min, optional `GITHUB_TOKEN`), Reading now, Latest journal.
- Bug fix: `src/lib/supabase.ts` now uses `cache: 'no-store'`. Next.js was serving cached rows, so the live site kept the old intro.
- `scripts/seed-content.ts` holds PUBLIC starter content only.
- Gallery mockup, three concepts (A light table = recommended, B depth walk, C living mosaic): https://claude.ai/artifact/B3sGQY2Fz9FHvpXBJr92SJ
- Checks: build passes, lint clean; local run against the real database showed the new content and no private items on the home page.

## Decisions made
- The GitHub repository is public: no private project names or private writing in any committed file (rule added to AGENTS.md).
- Gallery is not built until Dwayne picks a concept.

## Problems solved
- Stale live content: Next data cache on Supabase requests (see above).
- A commit was blocked by the safety check because the batch named private projects in a public repo. Files were cleaned afterwards; nothing was pushed. Commit 871e670 (already pushed) still contains two private project names in AGENTS.md, memory.md and a session post.

## Next session starts with
1. Push: Dwayne said "push" believing the repo is private, but an anonymous check on 2026-11-25 showed it still PUBLIC. Push only after it checks as private, or after a clear yes to push it public.
2. After deploy: check the live intro, widgets and icons. Until then, do not press Save on /admin/profile (the live form may show cached old text).
3. Gallery: Dwayne chose C and B for different pages. Mockup v2 (web + phone layouts) published, waiting for approval. Proposed: Story page = depth walk (phone: stacked moments); Gallery page = living mosaic (phone: folding mosaic). Then build and ask for real videos and photos.
4. GitHub widget look: waiting for Dwayne's screenshot.

## Open questions
- Is the page assignment and each phone layout approved?
- Add `GITHUB_TOKEN` in Vercel?
- Delete the unused 3D models and textures in `public/`?
