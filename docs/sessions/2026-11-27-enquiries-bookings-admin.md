# 2026-11-27 — Client enquiries, paid bookings and a new admin

**In one line:** turned "send me a message" into enquiry, approval and booking, and rebuilt the admin around it.

## What we set out to do
It started as "add a chat with audio, video, documents and hourly consultations". It was narrowed to: only serious
clients, with a clear message first; bookings; a better admin. The chat moved to a later phase.

## What we built
A required-fields enquiry form; accept or decline in the admin; a secret booking link per accepted client; free-time
calculation in the owner's time zone shown in the client's; prices in US dollars; a database rule against double
booking; seven admin screens; location removed from the site.

## Dwayne's approach
- Cut the scope: no AI replying to clients, only notifications; booking can be automatic.
- Set the order: approval first, chat after.
- Asked from a screenshot for every menu section to be designed and built, not only the new ones.
- Chose US dollars.

## Claude's approach
- Mockup first, then the database script, tested on a throwaway Postgres before any screen existed.
- One function (`openSlots`) both draws the booking page and judges a booking request, so they cannot disagree.
- Double bookings are refused by the database itself, so two people clicking at once cannot both win.
- No payment provider yet: a saved link and a manual "paid" mark. Less to build and nothing to leak; the cost is that
  payment is not enforced.
- The site keeps the old message box until the new tables exist, so pushing before running SQL breaks nothing.
- Added the missing second login check to older admin pages while there.
- Attacked it: tampered times and lengths, another client's session, a logged-out page, a refused form.

## What we learned
- A secret link is a login without a password: treat its address as private (no analytics, no referrer).
- Never trust what the browser sends for price or time; recompute on the server.
- A test can lie too: one failure was the test filling the page's hidden "description" tag instead of the form box.

## After the review
Before the push, reading the SQL beside the app showed the admin accepted up to 720 hours' notice while the database
allows 336: saving a large number would have crashed. The stand-in database had not caught it because it enforces no
column limits. A test double only proves what it imitates.

## Open threads
Booking timing and fast answers for recruiters (to confirm); alerts; payment service; chat mockup; admin phone app.
