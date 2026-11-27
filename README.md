# Dwayne Kasper — portfolio, story and private notebook

Next.js 14 (App Router) + Tailwind + Supabase. Public site on top, a private area behind one owner login.

## What is on the site

| Where | What | Who sees it |
|---|---|---|
| `/` | Headline, work experience, case studies, how I work with AI, services, about, tools, contact | everyone |
| `/work`, `/work/<title>` | Case studies | public ones only |
| `/cv` | One printable page built from the same content | everyone |
| `/about` | Links to story, gallery, journal, books; reading now; projects | public things only |
| `/story` | Biography as a depth walk (web) or stacked moments (phone), plus a plain list | public moments only |
| `/gallery` | Videos and photos: living mosaic (web) or folding mosaic (phone) | public items in public "Gallery" collections |
| `/journal`, `/c/<slug>`, `/p/<slug>` | Journal, collections, free-form pages | public only |
| `/enquire` | Enquiry form for prospective clients | everyone |
| `/book/<token>` | Pick a day, time and length; price in US dollars | only the accepted client with the link |
| `/private/*` | Everything marked private, including case study drafts | owner only (login) |
| `/admin/*` | Home, Enquiries, Bookings, Profile, Content, Gallery, Settings | owner only (login) |

## Clients: enquiry, answer, booking

1. A visitor fills the enquiry form: who they are, company, role, country, city, what they need (100 characters or
   more), budget and start. All required. 3 an hour per visitor, 50 a day in total.
2. You read it in Admin > Enquiries. **Accept** creates a secret booking link, which you email from your own inbox.
   **Decline** switches any link off.
3. The client books a free time. The session is **unpaid** until you mark it paid in Admin > Bookings. The site takes
   no money itself: the "Pay" button opens the payment link saved in Admin > Settings. An unpaid session keeps its
   time until you or the client cancel it.
4. Set the hourly rate, open days and hours, and blocked days in Admin > Bookings. No rate means booking is closed.

- All of this appears after `005_enquiries_bookings.sql` has run. Until then the short message box stays.
- The WhatsApp button appears once a number is saved in Admin > Settings. It lets people write without the form.
- Email alerts (new enquiry, new booking) go only to you and need `RESEND_API_KEY` and `ALERT_EMAIL` (the Resend
  account's own address, unless a domain is verified). The site never emails clients.

## Gallery

- Admin > Gallery: upload several photos or videos at once, choose private or public, add YouTube links.
  Public ones show on the home page and `/gallery`.

## Home page lists

Edit these in Admin > Collections. The slug decides where a list appears:
`experience` (title = company, author = role, status = current/previous), `case-studies` (author = where and role,
status = one-line summary, notes = the study; its web address comes from the title, so renaming breaks shared links),
`ai-workflow`, `what-i-do`, `work-with-me`, `quotes` (real ones only), `contact` (extra addresses).
In long text, `## Heading` makes a heading and `Flow: step | step` draws the steps.

- **Link preview:** `app/opengraph-image.png`. It is a fixed picture: remake it if the headline or photo changes.
- **Visit counting:** Vercel Web Analytics, public pages only. Turn it on in Vercel > project > Analytics.

Every piece of content has a **visibility**: `public` or `private`. New things default to **private**.
The menu lists only what exists and is public.

## Adding to the Story and Gallery

- **Story:** Admin > Timeline. Each moment can carry a photo or video link.
- **Gallery:** Admin > Collections > new collection, type "Gallery (photos and videos)", visibility public, then add items.
  "Image URL" is the photo or the still; "Link" is the video (YouTube, `.mp4`, `.webm`). Nothing is uploaded: paste links.
- The menu shows "Story" and "Gallery" only once something public exists.
- **Uploads:** the admin has upload buttons (photos, MP4, WebM, MOV; 50 MB per file). Files go to a private storage
  bucket and are served by `/media/<name>`, which lets a visitor see a file only while something public uses it.

## Set up (once)

1. Supabase > SQL editor: run `supabase/schema.sql`, then `supabase/002_content_model.sql`,
   `supabase/003_profile_and_media.sql`, `supabase/004_messages.sql` and `supabase/005_enquiries_bookings.sql`
   (the numbered ones are safe to run twice).
2. Copy `.env.local.example` to `.env.local` and fill the four values. Add the same four in Vercel and redeploy.
3. `npm install`, then `npm run seed` once (starter profile and projects).
4. `npm run seed:content` once for the home page lists, then `npm run dev` and open `/admin/login`.

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
- A booking link has no second check: whoever holds it can book in that client's name until you switch it off.
- A client cancelling a session does not send an alert. Unpaid sessions do not expire by themselves.
- Deleting an entry does not delete its uploaded file from storage. A link already handed out stays valid for up to an hour.
- Not yet built: search, RSS, drafts/scheduling, sharing a private page with a chosen person by link.
