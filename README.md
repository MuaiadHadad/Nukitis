# NUKITIS

A mobile-first black-and-gold performance nutrition campaign, built with HTML, CSS, TypeScript, and Vite. Original Chocolate and Vanilla product compositions are served as responsive transparent WebP artwork, not as page backgrounds.

## Routes

- `/` is the NUKITIS editorial homepage.
- `/products/chocolate` opens the product experience on Chocolate.
- `/products/vanilla` opens the same experience on Vanilla.

Client-side navigation uses the History API, preserves Back and Forward behavior,
and updates the product URL when a flavor changes. Vite development and preview
servers provide the SPA fallback needed for direct route refreshes. Production
hosting should rewrite these two product paths to `index.html`.

## Editorial homepage

The Red Bull Portugal homepage and Energy Drink page were inspected across the
supported desktop, tablet, and mobile viewports. Their layout and interaction
patterns informed this original NUKITIS implementation; no proprietary code,
fonts, text, logos, photography, or video are included.

The homepage includes an overlaid, scroll-aware header, hover/click desktop
dropdowns, a full-screen mobile menu, local search, product and editorial rails,
event tabs, a campaign banner, discipline cards, a discovery grid with progressive
loading, and a multi-column footer. Content cards open accessible detail dialogs.
All copy is original; event formats and athlete portraits are explicitly previews,
not invented schedules, endorsements, or profiles.

| Width | Hero height | Side gutters | Rail columns |
| --- | --- | --- | --- |
| 375–430 px | 596 px | 16 px | One large card + next-card preview |
| 768 px | 664 px | 40 px | Two cards + preview |
| 1024 px | 768 px | 64 px | Three cards + preview |
| 1440 px | 768 px | 64 px | Four cards + preview |
| 1920 px | 768 px | 224 px | Four cards in a 1472 px content area |

### Replacing media

Original SVG placeholders are in `public/images/placeholders/`; their names
identify the intended subject and orientation. Every editorial placeholder is
visibly labeled. Replace them with licensed NUKITIS media, then update the paths
and alt text in `src/components/content.ts` (and the banner/hero in `index.html`).

The hero backdrop uses a 1920 × 1080 source with `object-fit: cover`, a 60% horizontal
focal point, and fixed responsive hero heights. The campaign banner uses a
1600 × 900 source, cropped into a tall mobile slot and a 16:9 desktop slot.
Editorial cards use 1200 × 800 source illustrations, with a 1.95:1 mobile image
slot and 1.3:1 desktop slot. Athlete imagery uses fixed card-height proportions
and centered cover cropping; the dedicated running portrait is 900 × 1200.
Product imagery always uses `contain`. Existing image-slot dimensions remain
reserved during loading.

Approved legal documents, athlete photography, real event schedules, and campaign
video are not supplied. The UI makes those omissions explicit rather than linking
to fictional pages or showing a nonfunctional video player.

## Product stage

Chocolate and Vanilla are presented in full-viewport product panels. At desktop
sizes the stage pins while vertical scroll drives the panels horizontally, with a
visible edge of the next flavor. Arrows, keyboard controls, and the two indicators
move to an exact panel. On mobile and tablet, horizontal touch or pointer swipes
switch flavors directly while vertical page scrolling remains available. The
transition uses compositor-only transforms and reduced-motion mode removes the
animated travel.

## Development

```sh
npm install
npm run dev
```

Open the local URL printed by Vite (normally `http://127.0.0.1:5173`).
In WebStorm, select the shared **NUKITIS Dev** run configuration and click Run.
Do not run `src/index.ts` directly with Node.js: it is a browser entry point
and uses `document` and `window`, which are not available in Node.js.
If PowerShell blocks `npm.ps1` on Windows, use `npm.cmd run dev`.

## Production

```sh
npm run build
npm run preview
```

Deploy the generated `dist` directory to a static host.

## Browser coverage

```sh
npx playwright install chromium
npm test
```

Browser coverage includes both flavors at 375, 390, 430, 768, 1024, 1440, and 1920 px, stationary CTA/page geometry during transitions, image preloading, five-second rotation, pause/resume, real touch swipes, mouse dragging, keyboard navigation, reduced motion, and transition frame sampling.

Editorial coverage includes reference-derived dimensions, image loading, horizontal
overflow, mobile menu focus/close behavior, desktop dropdowns, local search and
detail dialogs, rail navigation and dragging, event tabs, discovery pagination,
and scroll-aware header behavior.

Both flavor shop CTAs link to `https://www.nukitis.com/`. Replace the shared `href`
in `index.html` and the product detail link in `src/components/details.ts` with
approved destinations when available; no checkout or product URL has been invented.

The locally hosted Barlow Condensed font is licensed under the SIL Open Font License; see `public/fonts/OFL.txt`.
