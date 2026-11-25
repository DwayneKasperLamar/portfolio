# Dwayne Kasper — portfolio, story and private notebook

Next.js 14 (App Router) + Tailwind + Supabase. Public site on top, a private area behind one owner login.

## What is on the site

| Where | What | Who sees it |
|---|---|---|
| `/` | Intro, projects, stack, now, contact, menu | everyone |
| `/story` | Biography timeline | public moments only |
| `/journal`, `/journal/<slug>` | Journal | public entries only |
| `/c/<slug>` | A collection: books, playlists, links, politics, life's works, image carousel | public collections and public items |
| `/p/<slug>` | A free-form page | public pages only |
| `/private/*` | Everything marked private, in one place | owner only (login) |
| `/admin/*` | Editors for all of the above | owner only (login) |

Every piece of content has a **visibility**: `public` or `private`. New things default to **private**.
The menu on the public site only lists things that exist and are public.

## Set up (once)

1. Supabase > SQL editor: run `supabase/schema.sql`, then `supabase/002_content_model.sql` (safe to run twice).
2. Copy `.env.local.example` to `.env.local` and fill the four values. Add the same four in Vercel and redeploy.
3. `npm install`, then `npm run seed` once (starter profile and projects).
4. `npm run dev`, open `/admin/login`.

If the live site says "Content isn't set up yet", step 1, 2 or 3 is missing.

## How privacy is enforced

- The server reads Supabase with the service-role key, which ignores database row rules. So `src/lib/content.ts`
  is the gate: `getPublic*` functions filter on `visibility = 'public'`; `getOwner*` functions return everything and
  are only used behind the login. Do not call a `getOwner*` function from a public page.
- Second lock: the database also has row rules (`002_content_model.sql`) so the anon key can only read public rows.
- `/admin` and `/private` are checked twice: in `middleware.ts` and again inside the page/action (`requireOwner`).
- Private pages are sent with `Cache-Control: private, no-store` and `noindex`.
- If `ADMIN_PASSWORD` or `ADMIN_SESSION_SECRET` is missing, nobody can log in (it fails closed).
- Text typed in the admin is shown as plain text, never as HTML. Links must be http(s) or mailto.

## Known limits

- One shared password, no login rate limit yet. Use a long password.
- No image upload: images are URLs (paste a link).
- Not yet built: search, RSS, drafts/scheduling, sharing a private page with a chosen person by link.
