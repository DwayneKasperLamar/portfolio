# 2026-11-25 — Positioning, widgets and an immersive gallery

**In one line:** repositioned the site around "software architect", added widgets, and built the Story and Gallery layouts.

## What we set out to do
Bigger side logos, a direct and detailed introduction, a "working on" section at the top, a GitHub widget that shows new
pushes, current reading, and a gallery that is not an ordinary carousel, with its own phone layout.

## What we built
Intro and "What I do"; "Working on now"; reading, journal and GitHub widgets; a cache fix; `/story` and `/gallery` with
separate web and phone layouts.

## Dwayne's approach
- Keep the simple, readable look with icons; position the content around architecture, detailed and direct.
- Asked for something immersive and creative, chose two of three concepts for different pages, and insisted phones get their own layout.
- Chose to push while the repository is public.

## Claude's approach
- Mockup first, then build. Phone layouts differ on purpose: a 3D walk fights the swipe, and there is no hover.
- Content lives in collections so no new database changes were needed.
- A safety check blocked one commit because notes named private projects in a public repository; cleaned the files and asked.

## What we learned
- Next.js can cache database requests even on dynamic pages: force `no-store` on the database client.
- Check a repository's visibility from outside (signed out) before trusting what we believe it is.

## Open threads
Push the gallery; real media; GitHub widget look; GitHub token; unused 3D files.
