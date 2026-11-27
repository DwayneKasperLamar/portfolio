# UI registry

What things look like, so new screens match. Approved mockups, 2026-11-26: fonts option A; conventional web layout.

## Type
| Use | Classes |
|---|---|
| Name / page title | `h1` (Newsreader by default) `text-[27px]` phone, `text-[30px]` web, `font-semibold` |
| Headline (one-line promise) | `font-head font-medium` `text-[19px]` phone, `text-[27px]` web, `leading-[1.4]` |
| Item title | `font-head text-lg font-semibold leading-snug text-primary` |
| List term | `font-semibold text-primary` (Inter) |
| Body | Inter, home `text-[15px]`, line height 1.65, `text-secondary` |
| Section label | `.label` |
| Small print | `text-sm` / `text-[13px]` `text-muted` |

Fonts load in `app/layout.tsx` (`--font-head` Newsreader, `--font-body` Inter).

## Layout (home page: one source, two arrangements)
- **Web (768px up):** `SiteHeader` sticky bar (68px) · `Hero` (text + photo) · tool logo band (`bg-surface`) ·
  `Block` sections in a centred 1080px column (`px-10`, `pt-20`, label + 34px heading) · grids of three ·
  reversed contact band (`bg-primary`, `text-inverse`, `border-line-inverse`) · own footer.
- **Phone:** `MobileHeader` (photo, theme button, name and details; no background banner), the same blocks stacked
  with `px-5 pt-8` and thin dividers, and `PhoneDock` floating at the bottom on every public page.
- **Phone dock:** `.glass` surface, full width, `rounded-full`, icons only (52px targets), current item on
  `bg-glass-pick`, photo for About. Shrinks to the current icon on scroll down; opens on scroll up or tap.
- Source order is the phone order; the web moves blocks with `md:order-*`.

## Admin (approved mockup, 2026-11-27)
- `AdminShell`: 216px side menu (`bg-surface`): photo, name, View site; Home, Enquiries (count badge), Bookings;
  "Your site": Profile, Content, Gallery, Settings; Log out at the bottom. Active item `bg-base ring-1 ring-line`.
  Phone: the same seven in a 4-column block, icon over label. Content uses the full width (`px-4`, `md:px-7`).
- Screen: `PageHead` (sticky bar, 26px title, actions on the right), dashed `ExplainNote`, then a grid. Content
  screens get tabs under the bar automatically (`_ContentTabs`).
- Admin buttons: `btnClass`, `btnFillClass` (38px, radius 9px), `smallClass`, `deleteClass` from `_ui.tsx`.
- Stat tile: `rounded-xl border border-line bg-surface p-4`, `.label`, `font-head text-3xl`, 13px muted line.
- List + detail (Enquiries): 340px list, detail card with a 3-column fact grid; phone shows one at a time.
- Waiting / unpaid is a dashed border or dashed `.pill`; done / paid is `.pill` with `.status-dot`.
- A refused change shows `role="alert"` box with `border-primary` at the top of the screen, in plain words.
- Anything that deletes uses `ConfirmButton`.

## Visitor forms
- One column up to 640px. Shared classes in `src/components/form-styles.ts`: `formCard`, `field`, `label`, `chip`
  with `chipOn` / `chipOff` (picked chips fill with `bg-primary`), `alertBox`.
- Choosing a day and time: `SlotPicker` (days in a 3- or 5-column grid, then start times).
- A choice between paths is a card per path (`rounded-2xl border bg-surface p-5`), the recommended one with
  `border-primary`.
- Waiting for the owner: dashed `border-muted` box.

## Gallery
- Web: `Mosaic` (rows of four that swell). Phone: `Waterfall`, two columns, 8px gaps, `rounded-2xl`, each picture at
  its own height; thin grid rows put the next one in the shorter column. Home shows 8 and "See all".

## Pieces
| Piece | Classes / component |
|---|---|
| Buttons | `.btn` (outline), `.btn .btn-fill` (main action); height 44px, radius 10px |
| Status chip | `.pill` with `.status-dot` |
| Company logo | `rounded-xl border border-line bg-chip`; phone 48px top right, web 56px top left of the card |
| Tool logo | 48px (52px from `lg`), `rounded-[14px] bg-chip`; 5 across, 10 from `lg` |
| Card | phone `rounded-xl p-4`, web `rounded-2xl p-6`, `border border-line bg-surface` |
| Store badge | `StoreBadges`: 36px high, dashed and muted when not available |

## Rules
Colours are theme tokens only. Logos always sit on `bg-chip` so dark logos read in dark mode.
