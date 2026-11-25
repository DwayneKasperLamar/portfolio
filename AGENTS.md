# Portfolio — working agreement

This is Dwayne Kasper's personal site: a public portfolio plus a biography, journal, library and a large **private** area
that only he can open. Next.js 14 (App Router), Tailwind, Supabase, deployed on Vercel
(https://portfolio-dwayne.vercel.app). `app/` pages, `src/` shared code, `supabase/` database scripts.

Where things stand is in `memory.md` (root). How each session went is in `docs/sessions/`. `README.md` has setup steps
and the privacy rules in short. This file is *how we work together*; Dwayne's other projects use the same habits and this file was modelled on theirs.

---

## How to talk to Dwayne (applies to every reply)

**Clear, simple language. No jargon.** Explain like to a smart friend who is not a programmer.

- Short sentences, everyday words. If a technical word cannot be avoided, explain it once, right there, with a real example from this project.
- Lead with the answer or the decision needed, then the reason. Short lists.
- When asking for a decision, give two or three plain choices, say what each means for the site and for his privacy, and recommend one.
- Be honest about mistakes, risks and what was not tested.

## This project is a learning vehicle

Dwayne is using his projects to become an **AI Solution Architect / AI Product Engineer**. The site still has to ship, but
every session also teaches: explain the *why* and the options, let him run things himself when it helps, define new terms the
first time they appear. Teach in the reply; keep the *changes* narrow.

---

## Hard rules for this repo

1. **Privacy is the point of this site. Private content must never reach a public page, or a committed file.**
   - The GitHub repository is public unless Dwayne says otherwise. Code, docs, `memory.md`, session posts and seed
     scripts must not name private projects or contain private writing. Private content lives only in the database.
   - Every content row has `visibility`: `public` or `private`. New things default to private; anything unclear becomes private.
   - The server reads Supabase with the service-role key, which ignores database row rules. So `src/lib/content.ts` is the gate:
     `getPublic*` for public pages, `getOwner*` only behind the login. Never call a `getOwner*` function from a public page.
   - `/admin` and `/private` are checked twice: `middleware.ts` and `requireOwner()` inside the page or action. Keep both.
   - Private responses are `no-store` and `noindex`. Never add analytics, logging or third-party embeds to private pages.
   - Text from the admin is rendered as plain text, never HTML. Links go through `safeUrl()`.
2. **Never print, read, commit or paste secrets.** `.env*` files stay git-ignored. Check that an env file exists with `ls`,
   never `cat` it. Secrets never go in docs, `memory.md`, session posts or chat.
3. **Never commit or push unless Dwayne says so.** Deletes of his files: ask first.
4. **Mockup before new UI.** A new public page or a big visual change gets a mockup (artifact) that Dwayne confirms before code.
   Admin forms that copy an existing pattern need none.
5. **Colours are tokens, never typed.** Use `text-primary`, `bg-surface`, `border-line` and the variables in `app/globals.css`.
   No hex values and no raw colour classes in new code. (Existing `text-green-500`/`text-red-500` status colours are known
   leftovers, to move to tokens when next touched.)
6. **Every admin screen has a short dashed explain-it note** (`ExplainNote` in `app/admin/_ui.tsx`) saying in plain words what it is for.
7. **Secure while building:** cap every text input (limits at the top of `app/admin/actions.ts`), check the owner in every
   server action, no network call without a way to fail safely, and write a "wrong person / wrong state / too big" check
   for each new rule, not only the happy path.
8. **Pages must survive a missing table or empty database.** Reads return empty instead of crashing, so a deploy never takes the site down.
9. Files here use Windows line endings (CRLF): a scripted multi-line find-and-replace can silently miss. Use the Edit tool and re-check.

## Stack and commands

Next.js 14, React 18, TypeScript strict, Tailwind with theme variables, `next-themes`, Supabase (`@supabase/supabase-js`).
`npm run dev`, `npm run build`, `npm run lint`, `npm run seed` (once; needs `.env.local`). Check types with
`./node_modules/.bin/tsc --noEmit`. Database scripts are run by hand in the Supabase SQL editor (`supabase/*.sql`, numbered, safe to run twice).
Backend or AI work that outgrows this site follows Dwayne's language policy: **Python** (FastAPI, `uv`, `pydantic`, `pytest`).

---

## Workflow

Skills live in `.claude/skills/` (the same five as his other projects):

- **`/architect`** before any non-trivial feature: align the words, decide with a recommendation, confirm the blueprint, then build.
- **`/review`** after a feature or batch, before calling it done. It reports; it does not fix until he decides.
- **`/recover`** when a build goes sideways after 2+ failed fixes.
- **`/remember save`** at the end of every session; **`/remember restore`** at the start.
- **`/imprint`** after building any UI, to keep `ui-registry.md` true.

**End of session:** a recap in `docs/sessions/YYYY-MM-DD-<slug>.md` (shape in `docs/sessions/README.md`) that splits
*Dwayne's approach* from *Claude's approach*. A learning log, not a changelog. In addition to `/remember save`, not instead of it.
Small fixes (a few lines) need no review or save.
