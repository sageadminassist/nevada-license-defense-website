# Nevada License Defense (nevadalicensedefense.com) — AI Rules

Read this before doing anything in this repo. These are the owner's standing rules.

## Hard rules

1. **Never push or deploy without asking first.** `bun run deploy`
   publishes the live site. Commit locally, show the change, then
   ask "want me to push?" and wait for a clear yes. One yes covers one push.
2. **Keep the owner's local preview live and current.** The owner watches
   `http://localhost:3334` in their own Chrome. After every change:
   - Make sure the dev server is running (`bun dev` in this folder, port 3334).
   - If you add a new route file, change `vite.config.ts`, or install/upgrade
     packages, **restart the dev server yourself** — new routes and dep
     changes do not hot-reload. If you upgrade packages, also clear the cache:
     `rm -rf node_modules/.vite` before restarting.
   - Tell the owner to hard-refresh (Cmd+Shift+R) if a restart happened.
3. **Verify there are no errors before saying something is done.** Open the
   page, check the browser console for errors, and actually click the thing
   you changed (dropdowns, links, hover states). A page that renders but has
   console errors is broken — the dropdown and animations die silently.
4. **Show, don't describe.** After a visual change, screenshot it at desktop
   width (1440px) and confirm it looks right before reporting back.

## Stack

- TanStack Start + TanStack Router (prerendered static output), React 19
- **Vite 8** (required by TanStack Start ≥1.169 — do not downgrade)
- Tailwind v4, Bun, lucide-react icons
- Dev server: port 3334 (strictPort)

## Where things live

- `src/lib/site.ts` — phone, email, `MORE_BOARDS` (nav dropdown + board list), JSON-LD
- `src/lib/images.ts` — every image path (`IMAGES.*`); add new photos here
- `src/routes/_marketing/*.tsx` — one file per page
- `src/routes/_marketing/index.tsx` — homepage; `MORE_BOARDS_ICONS` maps
  each board to a homepage card icon
- `public/images/` — photo files

## Adding a new licensing board page

All four steps, or it will be missing somewhere:
1. Create `src/routes/_marketing/<slug>.tsx` (copy an existing board page)
2. Add to `MORE_BOARDS` in `src/lib/site.ts` (nav dropdown)
3. Add to `MORE_BOARDS_ICONS` in `src/routes/_marketing/index.tsx` (homepage card)
4. Add `{ path: "/<slug>" }` to `pages` in `vite.config.ts` (prerender)
Then restart the dev server.

## Deploy

- Hostinger's Git connection watches the **`deploy` branch** and copies it
  as-is into `public_html` (no build step on Hostinger).
- `main` = source code. Pushing `main` does NOT change the live site.
- `deploy` = built site only (contents of `dist/client`). Never edit it by hand.
- To go live: commit on `main`, then `bun run deploy` — it builds and pushes
  the output to `deploy`. Ask the owner before running it (it is a live deploy).
- Hostinger's Git connection must point at `deploy`, never `main` — pointing
  it at `main` publishes raw source files and 404s every page.
- Staging URL: https://ghostwhite-stingray-877877.hostingersite.com/

## Content & SEO

- Every page needs title, description, og:*, canonical. Board pages state the
  governing NRS chapter in visible body text and include `LegalService` +
  `Attorney` JSON-LD.
- Keep the Board of Nursing page — it's intentional alongside
  lvnurseattorney.com and craigperry.com (same firm, cross-linked network).
- Sister sites: craigperry.com (firm), lvnurseattorney.com (nurse-only).
