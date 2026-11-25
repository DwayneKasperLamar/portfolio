# Memory — Portfolio: positioning live, gallery built

Last updated: 2026-11-25 (late)

## What was built
- Live (pushed `aa43080`, checked): software architect intro, "What I do", "Working on now", books (Meditations; Crime and Punishment), widgets with a GitHub "Latest pushes" feed, bigger side icons, the stale-data cache fix.
- NOT yet committed: `/story` depth walk (web) and stacked moments (phone), new `/gallery` living mosaic (web) and folding mosaic (phone), full-screen viewer (photo, .mp4/.webm, YouTube). Files in `src/components/gallery/`. New colour tokens `stage`, `veil`, `on-veil`. Side icons now hide below 900px.
- Mockups: https://claude.ai/artifact/B3sGQY2Fz9FHvpXBJr92SJ
- Checks: build and lint pass. Both layouts screenshotted with sample data in headless Edge (before the final depth-walk spacing tweak). Touch, drag, wheel, hover and the viewer have NOT been tried by hand.

## Decisions made
- Repository stays public for now (Dwayne: push even while public). So no private project names or private writing in committed files.
- Gallery = public items of collections with type "Gallery" (stored kind `carousel`, so no database change). Media are pasted links, no upload.
- Story = timeline events; moments without media show as written cards.

## Current state
- No public timeline events or gallery items yet, so "Story" and "Gallery" are hidden from the menu.

## Next session starts with
1. Ask whether to push the gallery, then check it live.
2. Get real videos and photos (with caption and year) from Dwayne and add them.
3. GitHub widget look: waiting for Dwayne's screenshot.

## Open questions
- Add `GITHUB_TOKEN` in Vercel (avoids GitHub's request limit)?
- Make the repository private later?
- Delete the unused 3D models and textures in `public/`?
