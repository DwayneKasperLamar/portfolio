# Memory — Portfolio: two booking paths, pay first, waterfall gallery

Last updated: 2026-11-27

## What was built (latest batch)
- `/enquire` has two paths: paid consultation, or a free call for a job offer (recruiter picks a time; held until the
  owner confirms or moves it; 24-hour reply promise).
- Consultation: accept → client pays and presses "I have paid" → owner presses "Payment received" → client picks a time
  from the next day on. Table `payments`.
- Phone gallery is a two-column waterfall; home shows 8 and "See all". Web gallery unchanged.
- `supabase/006_pay_first_and_offers.sql` — check whether it has been run on the real database. Until then only the
  consultation form shows and paid booking stays closed.
- Checks: types, lint, build; 25 database checks on a throwaway Postgres; 23 time-rule checks; 111 browser checks
  against a stand-in database. Not tested: the real database after 006, real alert emails, a real iPhone, real videos
  in the waterfall.

## Earlier, same day
- Pushed `3f6ce2b`: enquiry form, booking link, new admin (Home, Enquiries, Bookings, Profile, Content, Gallery,
  Settings), location removed. SQL 005 has been run.
- At the owner's request all gallery pictures are private for now. Add public ones only after reading what they show.

## Decisions made
- Roles: Software Architect at Kosher Spa; co-founder and Software Architect at Uncollos; previously mobile developer at Spaxe. Open to remote roles.
- Say plainly that AI writes much of the code and Dwayne decides and checks.
- Only prospective clients and recruiters. No AI assistant answers; the owner is only notified. Hourly, in USD.
- Payment is confirmed by hand for now; a payment service (Paystack or similar) comes later.
- Bookings start from the next day (no notice counted in hours). Job offers never pay; reply within 24 hours.
- Chat (documents, audio, video) is the next phase, only for accepted clients. Mockup first. Later: an admin phone app.
- Repository is public: no private project names, drafts or private writing in committed files.

## Next session starts with
1. The to-do list is `TODO.md` in the project root (git-ignored, read by Dwayne's desktop to-do app). Keep it true.
2. Confirm script 006 is run, then one real test of both paths on the live site.
3. Rate, payment link and meeting link in the admin; Resend (`RESEND_API_KEY`, `ALERT_EMAIL` in Vercel).
4. Draw the chat phase.

## Open questions
- Which payment service takes US dollars from abroad and pays out to Dwayne?
- Do the "Email me" buttons stay?
- Case study drafts need a read-through and sign-off before publishing.
- Handle on the phone header comes from the X link; is that the right account?
- The link preview picture still uses the old photo: match the new one?
- Delete the unused 3D models and textures in `public/`?
