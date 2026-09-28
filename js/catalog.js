/*
 * DRAFT STUDIO — CONTENT CATALOG
 * ==============================
 * Everything shown on the site comes from this file. Only you (through your
 * GitHub account) can change it, so only you can add designs.
 *
 * HOW TO ADD A DESIGN
 *   1. On GitHub, upload the files to the right folder:
 *        files/templates/   ← template files (PSD, AI, PDF, SVG, JPG, PNG, ZIP…)
 *        files/logos/       ← logo files
 *        files/icons/       ← SVG icons
 *      Tip: give each design its own folder, e.g. files/logos/dore/
 *   2. Upload a preview image (JPG or PNG, about 1200px wide) to previews/.
 *   3. Copy one of the examples below, paste it INSIDE the right list —
 *      just below the line `templates: [`, `logos: [` or `icons: [` —
 *      fill it in, and click "Commit changes".
 *
 *   Common mistakes that break the whole site:
 *     • pasting an entry above `templates: [` instead of below it
 *     • a missing comma between two entries  },{
 *     • a path that doesn't match the uploaded file name exactly
 *       (names are case-sensitive: "Logo.svg" is not "logo.svg")
 *
 * FIELDS
 *   id          unique, lowercase, no spaces (used in links)
 *   title       name shown on the site
 *   category    any text, e.g. "Flyers", "Lettermarks" (used for filtering)
 *   description one or two sentences (optional)
 *   dimensions  size or format, e.g. "A4 portrait" (optional)
 *   tags        search words
 *   preview     path to the preview image
 *   files       one line per download. With several files the site shows a
 *               "Download ▾" menu; a ZIP becomes the "Download all" button.
 *   creator     who made it (optional; defaults to the site name)
 *   date        YYYY-MM-DD (newest designs are shown first)
 *   featured    true = show in the Editor's Selection on the front page
 *               Files too big for GitHub can live on Google Drive: use the share
 *               link as the path and add name: "file-name.psd" for the label.
 *   requires    (optional) software the file only works in, e.g. "Adobe Photoshop".
 *               Shows a "Photoshop only" badge and a notice above the download.
 *
 * EXAMPLE — a template (copy from { to }, and keep the comma after it)
 *
 *   {
 *     id: "restaurant-menu",
 *     title: "Restaurant Menu",
 *     category: "Menus",
 *     description: "Two-page A4 menu with editable prices.",
 *     dimensions: "A4 portrait",
 *     tags: ["menu", "food", "restaurant"],
 *     preview: "previews/restaurant-menu.jpg",
 *     files: [
 *       { format: "PSD", path: "files/templates/restaurant-menu/restaurant-menu.psd", size: "38 MB" },
 *       { format: "PDF", path: "files/templates/restaurant-menu/restaurant-menu.pdf", size: "4 MB" },
 *       { format: "ZIP", path: "files/templates/restaurant-menu/restaurant-menu.zip", size: "40 MB" }
 *     ],
 *     creator: "Isaac Matovu",
 *     date: "2026-10-01",
 *     featured: false
 *   },
 *
 * EXAMPLE — an icon (one line)
 *
 *   { id: "heart", name: "Heart", category: "Social", tags: ["love", "like"], file: "files/icons/heart.svg" },
 *
 *   Icons should use stroke="currentColor" or fill="currentColor" so visitors
 *   can recolour them.
 */

window.DRAFT_STUDIO = {
  site: {
    name: "Draft Studio",
    tagline: "An open archive of templates, marks and icons for designers",
    email: "thedraftstudio.design@gmail.com",
    whatsapp: "",                              // e.g. "27780000000" (leave empty to hide)
    instagram: "",                             // e.g. "https://instagram.com/draftstudio"
    license:
      "Free for personal and commercial projects. Credit is appreciated but not required. " +
      "You may not resell or redistribute the files as-is."
  },

  templates: [
    {
      id: "t-shirt-mockup-one",
      title: "T-Shirt Mockup — Held Up",
      category: "Mockups",
      description: "A ringer T-shirt held up against a clear blue sky. Place your artwork on the chest through the smart object layer.",
      dimensions: "3328 × 4864 px · portrait",
      requires: "Adobe Photoshop",
      tags: ["mockup", "t-shirt", "tee", "apparel", "merch", "smart object", "photoshop", "psd"],
      preview: "previews/t-shirt-mockup-one.jpg",
      files: [
        // Hosted on Google Drive (too big for GitHub). "name" is what the button shows.
        { format: "PSD", path: "https://drive.google.com/file/d/1HXHTuVA8gntAGUeb1la18R-RaDOHxfpo/view?usp=sharing", name: "t-shirt-mockup-one.psd" }
      ],
      creator: "Isaac Matovu",
      date: "2026-09-28",
      featured: true
    },
  ],

  logos: [
    {
      id: "mato-logo",
      title: "Mato — Letter M Logo",
      category: "Lettermarks",
      description: "A bold geometric M in coral red, paired with a crisp Mato wordmark whose t is capped with a matching red square.",
      dimensions: "Vector · any size (raster 2250 × 2250 px)",
      tags: ["letter m", "lettermark", "monogram", "wordmark", "geometric", "red"],
      preview: "previews/mato-logo.jpg",
      files: [
        { format: "SVG", path: "files/logos/mato/mato-logo.svg", size: "3 KB" },
        { format: "AI",  path: "files/logos/mato/mato-logo.ai",  size: "165 KB" },
        { format: "PDF", path: "files/logos/mato/mato-logo.pdf", size: "44 KB" },
        { format: "PNG", path: "files/logos/mato/mato-logo.png", size: "42 KB" },
        { format: "JPG", path: "files/logos/mato/mato-logo.jpg", size: "104 KB" },
        { format: "ZIP", path: "files/logos/mato/mato-logo.zip", size: "206 KB" }
      ],
      creator: "Isaac Matovu",
      date: "2026-09-28",
      featured: true
    },
    {
      id: "dore-logo",
      title: "Dore — Letter D Logo",
      category: "Lettermarks",
      description: "A letter D built from nested arcs in deep red, paired with a clean geometric DORE wordmark.",
      dimensions: "Vector · any size (raster 2250 × 2250 px)",
      tags: ["letter d", "lettermark", "monogram", "wordmark", "red", "arcs"],
      preview: "previews/dore-logo.jpg",
      files: [
        { format: "SVG", path: "files/logos/dore/dore-logo.svg", size: "4 KB" },
        { format: "AI",  path: "files/logos/dore/dore-logo.ai",  size: "175 KB" },
        { format: "PDF", path: "files/logos/dore/dore-logo.pdf", size: "43 KB" },
        { format: "PNG", path: "files/logos/dore/dore-logo.png", size: "64 KB" },
        { format: "JPG", path: "files/logos/dore/dore-logo.jpg", size: "135 KB" },
        { format: "ZIP", path: "files/logos/dore/dore-logo.zip", size: "271 KB" }
      ],
      creator: "Isaac Matovu",
      date: "2026-09-28",
      featured: true
    },
  ],

  icons: [
  ]
};
