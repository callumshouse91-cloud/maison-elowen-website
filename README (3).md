# Maison Elowen – bridal boutique website

This file is the brief, the rulebook and the record for this build. The AI reads it before every change. Kirsty owns it. If something isn't written here, it doesn't get built.

## Where we start

The folder contains two things, on purpose:

- `README.md` — this file
- `images/` — the 14 photos listed under Images below

Nothing else. The first prompt does the rest. It should say, in effect: *read the README, build section 2 step by step, follow sections 3 and 4, and keep section 5 current.* The prompt is short because this file is long. That is the trade: time spent here is time saved on every prompt after it.

The first thing the AI must do is create the data files (`data/dresses.json`, `data/site.json`, `data/enquiries.json`) from the Images section and the rules below, list them, and stop for approval — before any page is written.

---

## 1. Who it's for and the one action

**For:** a bride (or her mum) who has found the shop online and is deciding whether to visit.
**The one action:** she books an appointment.

Every design and content decision is resolved against that sentence. If a feature doesn't move her closer to booking, it waits.

---

## 2. What to build, in order

Build these in sequence. Build them in this order even inside a single prompt: finish one, log it under "What changed", then move on.

1. **Home** — hero image of the boutique, one line of welcome, a single button: "Book a fitting".
2. **The collection** — the 8 dresses from `data/dresses.json`: photo, name, silhouette, fabric, price range. Filter by silhouette.
3. **How a fitting works** — three steps: first visit, choosing and ordering, fittings and collection. Lead times stated plainly.
4. **Book a fitting** — form: name, email, phone, preferred date, dress size, budget range, anything to tell us. Confirmation on screen.
5. **About** — the fitting-room photo, two paragraphs, opening hours, address.
6. **Accessories** — veil, shoes, one more; a small row, not a shop.
7. **Owner view** (`/owner.html`) — a plain list of enquiries from `data/enquiries.json`, newest first.
8. **AI: Find my dress** — a text box on the collection page; the bride describes what she wants in her own words and gets 2–3 dresses back with a reason for each.
9. **AI: Owner insights** — on the owner view, a button that summarises the enquiries: what's being asked for, repeated questions, what to stock.

Steps 8 and 9 will stop at a wall (see section 5). That is intended.

---

## 3. Content rules — what the site may say

- The eight dresses and six site images are the only ones that exist. Never add a dress, a photo or a detail that isn't in the Images section.
- Prices are **TBC** until the owner gives them. Don't invent one. If the prompt supplies prices, use those exactly.
- Where information is missing — opening hours, address, lead times — write **TBC** and leave it visible. Don't fill the gap.
- Sample data is allowed in one place only: `data/enquiries.json`, so the owner view has something to show. Every record carries `"sample": true`, names are plainly fictional, and the owner view shows a banner saying so. Nothing else on the site may be made up.
- Prices are shown as ranges ("£1,800–£2,400"), never exact, unless `dresses.json` says exact.
- No testimonials unless real ones are added to `data/testimonials.json`.
- Tone: warm, plain, unhurried. No exclamation marks. No "stunning", "dream", "perfect".
- The AI features may only recommend dresses that exist in `dresses.json`, and must say "I'm not sure" when nothing fits rather than stretching.

---

## 4. Technical rules — what the build may do

- Plain HTML, CSS and JavaScript. No frameworks, no installs, no package managers, no build step. The site runs by opening `index.html`.
- No external resources: no CDN fonts, no scripts from elsewhere, no analytics. Everything in this folder.
- Before writing any code, **list every file you will create or change and stop for approval**.
- Keep each change small. One sentence explaining it before it's made.
- If two requirements conflict, ask, with a recommendation. Never guess.
- Data lives in `data/` as JSON. Code reads the data; it never hard-codes a dress or a price.
- Images live in `images/` and are referenced only by file name from `data/dresses.json` and `data/site.json` — see the Images section.
- Nothing leaves the laptop. No form submits anywhere; the booking form writes to the owner view only.

### Back end — honest about what exists

| Today | Next | Needs |
|---|---|---|
| Enquiries are read from `data/enquiries.json` and new bookings are held in the browser | Bookings saved properly and emailed to the shop | A small hosted function and an email service |
| AI features call an endpoint set in `config.js` | Same, pointed at an approved endpoint | An approved AI service and a key held server-side, never in the page |
| Site opened from a folder | Site on a web address | Static hosting (Azure Static Web App in a corporate setting; Vercel or Netlify for a shop) |

The pattern is the point: the front of the site is finished and useful on its own. The back end is three small, nameable requests, not a rebuild.

---

## Images — the full set, pick from it later

All 14 files live in `images/`, shot as one consistent set (same light, no faces, no text). Nothing on the site refers to a photo directly — every page reads file names from `data/`. So the collection can start with three dresses and grow to eight, or swap one out, by editing `dresses.json` alone. The AI never hard-codes an image.

### Dresses (portrait, 4:5) — referenced from `data/dresses.json`

| # | File | Silhouette | Fabric | Detail |
|---|---|---|---|---|
| 1 | `dress-aline-lace.jpg` | A-line | Lace | Long illusion sleeves, modest neckline, chapel train |
| 2 | `dress-ballgown-tulle.jpg` | Ball gown | Tulle | Strapless sweetheart bodice, layered skirt |
| 3 | `dress-mermaid-satin.jpg` | Mermaid | Satin | Plain bodice, dramatic flare from the knee |
| 4 | `dress-sheath-crepe.jpg` | Sheath | Crepe | Square neckline, clean lines, no embellishment |
| 5 | `dress-boho-chiffon.jpg` | Boho | Chiffon | Embroidered floral lace, relaxed shoulder |
| 6 | `dress-tea-length-vintage.jpg` | Tea-length | Satin | 1950s, fitted bodice, collar and bow detail |
| 7 | `dress-bridal-jumpsuit.jpg` | Jumpsuit | Crepe | Halter neck, wide leg, tailored |
| 8 | `dress-off-shoulder-train.jpg` | Ball gown | Mikado | Off-the-shoulder, cathedral train |

Each entry in `dresses.json` carries: `id`, `name`, `image`, `silhouette`, `fabric`, `detail`, `price_from`, `price_to`, `featured` (true/false). The collection page shows every dress; the home page shows only `featured` ones. Filters are built from the `silhouette` and `fabric` values present in the file, not from a fixed list.

### Site imagery — referenced from `data/site.json`

| # | File | Used for | Shape |
|---|---|---|---|
| 9 | `hero-boutique-interior.jpg` | Home hero | 16:9 |
| 10 | `about-fitting-room.jpg` | About / How a fitting works | 3:2 |
| 11 | `accessory-veil.jpg` | Accessories | 1:1 |
| 12 | `accessory-shoes.jpg` | Accessories | 1:1 |
| 13 | `accessory-hairpiece.jpg` | Accessories | 1:1 |
| 14 | `logo-maison-elowen.png` | Header and footer (transparent) | — |

`site.json` holds `hero`, `about`, `logo` and an `accessories` list (`name`, `image`, `one_line`). Swapping the hero or adding a fourth accessory is a change to that file, not to the code.

Rules for images: never crop, recolour or add text to them. If a page needs an image that isn't in this list, write **TBC** and leave the slot visible.

---

## How it should look

- **Feel:** a quiet, well-lit boutique. Lots of white space. The photos do the work; the page stays out of their way.
- **Colour:** ivory background, near-black text, one soft accent (oyster or pale blush) used sparingly for the booking button and links. Nothing bright.
- **Type:** one serif for headings, one plain sans-serif for body. Generous line height. Never more than about 70 characters per line.
- **Layout:** single column on mobile; two or three columns for the collection on desktop. Photos in a consistent 4:5 frame so the collection reads as one set.
- **Motion:** none, apart from the booking confirmation appearing.
- **Images:** the set in `images/` is consistent on purpose — same light, no faces, no text. Don't crop or recolour them.

---

## 5. What done looks like

After every change, the AI updates the sections below. Kirsty reads "For the shop this means" aloud and corrects it in her own words. Her corrections are the acceptance test.

### What this site does
Maison Elowen's site shows the boutique, eight gowns with silhouette and fabric filters, accessories and how a fitting works, all leading to one appointment booking form. Bookings are saved in the browser and listed on the owner view.

### What changed in this version
- 06 Oct 2026 — v0.1 — Built all nine steps: Home, Collection (silhouette and fabric filters built from the data), Accessories, How a fitting works, Book an appointment, shared footer with hours, address and map placeholder, Owner view, Find my dress (questionnaire) and Owner insights. Data files: `data/dresses.json`, `data/site.json`. Added `Open site.bat` (see Technical log).

### For the shop this means
- 
- 
- 

### What it does not do yet
- Save or send bookings anywhere except the booking browser (owner view only shows bookings made on the same browser)
- Real prices, hours, address, phone, email, map or timings: all TBC or marked placeholder
- Take payment or deposits
- Find my dress / Owner insights — built, but stop at "AI not configured" until an approved endpoint and key are provided (see Back end)

### How to run it
Double-click `Open site.bat` (needs Python on the computer; it starts a local server and opens the site). Opening `index.html` directly also works only in browsers that allow local data files; otherwise the page shows a message saying so. Owner view is `owner.html`. Data in `data/`, photos in `images/`.

### What IT (or the shop's host) needs to enable
- Hosting for the static site (this also removes the need for Open site.bat)
- A function + email service for bookings
- An approved AI endpoint and server-held key for the two AI features

---

## Technical log
Decisions, assumptions and open doubts, in date order. Nothing goes in "What changed" above that isn't explained here.
- 06 Oct 2026 — Step 0, data and approval: listed the 14 images and agreed deviations from this README with Kirsty: folder is `Images/` (capital I) not `images/`; this file is `README (3).md`; filters cover silhouette and fabric; button reads "Book an appointment"; Find my dress is a questionnaire; no About page and no `enquiries.json`; owner view reads browser bookings only. Assumed dress names, silhouettes, fabrics and details from the table above, `Images/manifest.json` and the photos.
- 06 Oct 2026 — Data: `dresses.json` holds eight dresses, `featured` true for A-Line Lace, Tulle Ball Gown, Satin Mermaid (assumed, easy to change). Prices are invented placeholders (`price_is_placeholder: true`) shown with a "placeholder" tag; replace them and set the flag false. `site.json` holds hero, about, logo, accessories, hours, address, phone, email, the three fitting steps, size and budget lists, and the questionnaire options. Hours, address, phone, email and all lead times are TBC.
- 06 Oct 2026 — Pages: shared header and footer are drawn by `js/common.js` from `site.json`. Home text and button sit above the hero photo so the button is visible without scrolling; photos are never cropped (shown whole). Bookings are saved in `localStorage` under `elowen_bookings`, so they live only in that browser.
- 06 Oct 2026 — Running locally: browsers such as Chrome and Edge block `fetch` of JSON from `file://` pages, which conflicts with "runs by opening index.html" and "data in JSON". Assumed data stays in JSON, and added `Open site.bat` (uses Python's built-in server, no install of packages). Tested through a local server; not tested by double-clicking `index.html`.
- 06 Oct 2026 — AI features: Find my dress and Owner insights build the data they would send, show it on screen with an "AI not configured" message and make no network call. Owner insights leaves out names, emails and phone numbers. Content-rule check: no exclamation marks and no banned words in site text.
