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
- **Phone:** `MobileHeader`, sticky `PhoneTabs`, the same blocks stacked with `px-5 pt-8` and thin dividers.
- Source order is the phone order; the web moves blocks with `md:order-*`.

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
