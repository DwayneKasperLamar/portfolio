# Memory — Portfolio: enquiries, paid bookings and the new admin pushed

Last updated: 2026-11-27

## What was built (pushed 2026-11-27)
- Enquiry form `/enquire` (replaces the message box once SQL 005 has run), private booking page `/book/<token>` in US
  dollars, admin redesign: Home, Enquiries, Bookings, Profile (live phone preview, LinkedIn), Content, Gallery, Settings.
- `supabase/005_enquiries_bookings.sql` HAS been run: tables checked present on the real database (read only).
- Location removed from the whole site, the admin form, the description and the preview card.
- Checks: types, lint, build; 20 database checks on a throwaway Postgres; 20 time-zone checks; 92 browser checks
  against a stand-in database (phone and web). Not tested: a real enquiry or booking on the live database, real email
  alerts, a real iPhone.
- The stand-in database does not enforce column limits: compare app limits with the SQL when changing either.

## Decisions made
- Roles: Software Architect at Kosher Spa; co-founder and Software Architect at Uncollos; previously mobile developer at Spaxe. Open to remote roles.
- Say plainly that AI writes much of the code and Dwayne decides and checks.
- Only prospective clients: nobody books without an accepted enquiry. No AI assistant answers; the owner is only
  notified. Consultations are hourly, charged in USD.
- No payment provider yet: a saved payment link, and the owner marks sessions paid.
- Chat (documents, audio, video) is the next phase, only for accepted clients. Mockup first. Later: an admin phone app.
- Repository is public: no private project names, drafts or private writing in committed files.

## Next session starts with
1. Confirm, then build, two rules Dwayne gave when approving the push (wording to confirm):
   a paid session starts some hours after payment, or from the next day; job offers and recruiters get answers first
   and fast. Also still open from the review: no alert when a client cancels, "Email me" buttons bypass the form.
2. Set rate, hours and payment link in the admin.
3. Dwayne to do: Resend account plus `RESEND_API_KEY` and `ALERT_EMAIL` in Vercel (without it there are no alerts);
   WhatsApp number; gallery uploads; LinkedIn.
4. Design the chat phase (mockup).
5. Read the three case study drafts at `/private`; collect real numbers and quotes.

## Open questions
- Which payment service takes US dollars from abroad and pays out to Dwayne?
- Case study drafts need a read-through and sign-off before publishing.
- Handle on the phone header comes from the X link; is that the right account?
- The link preview picture still uses the old photo: match the new one?
- Delete the unused 3D models and textures in `public/`?
