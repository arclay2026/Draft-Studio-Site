# Draft Studio

A free design-resources site: downloadable **PSD, AI, PDF and SVG templates**,
**SVG icons** and **logos**. Plain static site with no build step and no database.
It runs on GitHub Pages or any web host.

## Pages

| Page | What it does |
|------|--------------|
| `index.html` | Front page: a moving wall of your latest previews, a ticker of new records, Editor's Selection, a category index, a "recently filed" shelf, the icon specimen and the studio profile |
| `templates.html` | Templates browser: search, filter by format and category (as a sentence), sort, and switch between **Plates** (masonry) and **Index** (catalogue list) views |
| `logos.html` | Logos browser, same as templates |
| `item.html?id=…` | Full record for one design: large artwork with zoom, spec sheet, downloads, save, share link, previous/next and related designs |
| `icons.html` | Icon specimen sheet with an inspector: recolour, download SVG/PNG, copy code |
| `desk.html` | **Archive desk**, for you: drop your files and it writes the catalog entry and links to the right GitHub upload folders |

Across the site: a floating dock for navigation, a full-screen **Index** menu,
search from anywhere (press `/`), **Quick look** on any design, and
**Saved** (bookmarks kept in the visitor's browser). Every design gets a
catalogue number (DS–001, DS–002 …) automatically, in the order it was filed.

Old share links still work: `templates.html#id` and `logos.html#id` open the
design's record, and `icons.html#id` selects the icon.

## Design system

- Colours: ink `#111111`, paper `#f4f3ef`, blue `#2457ff` (used only as a signal).
  Dark mode swaps ink and paper. Tokens are at the top of `css/archive.css`.
- Type: Manrope (brand), Instrument Serif italic (contrast), JetBrains Mono (metadata).
- Artwork sits on "plates" framed by printer's crop marks. Sharp edges, hairline rules.
- Motion is subtle and respects the visitor's "reduce motion" setting.

## Adding content (all you ever edit is `js/catalog.js`)

1. **Upload the file(s)**
   - Templates → `files/templates/` (e.g. `wedding-invite.psd`, `wedding-invite.ai`, `wedding-invite.pdf`)
   - Logos → `files/logos/`
   - Icons → `files/icons/` (SVG only)
2. **Upload a preview image** (JPG/PNG/WEBP, ~1200px wide) to `previews/`.
   Browsers can't display PSD or AI files, so templates and logos need one.
   Items with an SVG file use it as the preview automatically.
3. **Add an entry** at the top of the right list in `js/catalog.js`. The easiest
   way is to open `desk.html` on your site, drop the files in and copy the entry it writes. The file's
   comments explain every field and include a multi-format example.

On GitHub you can do all of this in the browser: *Add file → Upload files*
into the folder, then edit `js/catalog.js` with the pencil icon.

**Icon tips:** use `stroke="currentColor"` / `fill="currentColor"` in your SVG
icons so the colour picker can recolour them, and keep a `viewBox`.

**Large files:** GitHub rejects files over 100 MB and warns above 50 MB. For big PSDs,
zip them, or host them elsewhere (Google Drive, Dropbox, etc.) and put that link in `path`.

## Branding

- Colours: `#2457ff` (blue), `#f4f3ef` (paper), `#111111` (ink), set at the top of `css/archive.css`.
- Font: Manrope (Google Fonts).
- Original logo upload: `assets/brand/draft-studio-logo-original.svg`. The files below are cut from it.
- Header logo: `assets/logo.svg` (light background) and `assets/logo-dark.svg` (dark mode).
- 3D hero logo: `assets/logo-mark.svg`, the logo symbol on its own. The site
  extrudes it into 3D automatically. Use an SVG, or a PNG with a transparent background.
  If you use a PNG, change `data-src` in `index.html` to point at it.
- Favicon: `assets/favicon.svg`.
- Name, tagline, email, WhatsApp, Instagram and licence text: `site` block in `js/catalog.js`.

## Run locally

```bash
python3 -m http.server 8000
# open http://localhost:8000
```
The live site is published with GitHub Pages from the `main` branch:
https://arclay2026.github.io/Draft-Studio-Site/

(Opening the HTML file directly works, but icon recolouring and the PNG and code
tools need a web server.)
