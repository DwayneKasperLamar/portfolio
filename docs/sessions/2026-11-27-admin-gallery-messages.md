# 2026-11-27 — Admin layout, gallery and message box

**In one line:** made the admin usable, made the gallery reachable, and added the first way for visitors to write.

## What we set out to do
A proper admin layout with grids, a gallery that can be seen and managed, and the approved message box with WhatsApp.

## What we built
Side-menu admin with a dashboard; a Gallery screen with multi-upload; collections as cards with their own pages; a
Gallery block on the home page; message form, inbox, WhatsApp setting and optional email alerts.

## Dwayne's approach
- Reported it from use: could not find or see the gallery anywhere.
- Approved the message box mockup (form, WhatsApp, private inbox).

## Claude's approach
- Found the cause first: no gallery list existed and the way to make one was buried; an upload test was already in storage as the profile photo.
- The message form stays hidden until its table exists, so nothing public can fail.
- Treated the form as the site's one public door: trap field, caps, limits, fail closed; attacked it against a stand-in database.
- Built the admin directly (behind login) and showed screenshots instead of a mockup.

## What we learned
A feature nobody can find does not exist: give common jobs their own screen.

## Open threads
Run the 004 script; WhatsApp number; email alerts; push.
