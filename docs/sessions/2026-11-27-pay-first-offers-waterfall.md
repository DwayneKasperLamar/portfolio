# 2026-11-27 — Pay first, free calls for job offers, a waterfall gallery

**In one line:** split visitors into paying clients and recruiters, made payment come before the time, and rebuilt the
phone gallery.

## What we set out to do
Make a to-do list a desktop app can read; a Pinterest-style gallery on phones; "pay, then book, from the next day";
recruiters pay nothing and pick a call time.

## What we built
A local, git-ignored `TODO.md`; two paths on `/enquire`; payments the owner confirms before a time can be picked; held
call times with confirm or move in the admin; next-day booking instead of hours of notice; a waterfall gallery; database
script 006.

## Dwayne's approach
- Cut "some hours after payment" to one plain rule: from the next day.
- Recruiters should never meet a payment, and should hear back fast: 24 hours.
- Named a product people know (Pinterest) to say what the gallery should feel like.
- Put privacy ahead of looks: had the gallery made private before anything else was built.

## Claude's approach
- Drew the screens first, with blank blocks in place of real pictures.
- Looked at what a visitor can actually read on the live site, and asked before changing any live data.
- Money rules live in the database too: one waiting payment per client, no priced calls, no free sessions. The
  stand-in test database copies those rules, after an earlier miss where it enforced none.
- A payment is "used up" in one step before the booking is made, so a double press books once; if the booking fails the
  payment is handed back.
- The site keeps working before script 006 runs: only the new parts stay closed.
- First waterfall alternated left and right and left one column far shorter; replaced with thin grid rows so the
  browser fills the shorter column.

## What we learned
- Confirming payment by hand is the cheapest honest version of "pay first". Its cost is waiting.
- A screenshot is data: it can publish keys, links and other people's code.
- Three failing checks were the test matching words already on the page. Check the thing, not a nearby word.

## Open threads
Run script 006; rate, payment link, meeting link; email alerts; payment service; chat mockup; admin phone app.
