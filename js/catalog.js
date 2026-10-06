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
 *   howTo       (optional) your own "How to use" steps, replacing the automatic ones:
 *               howTo: [{ title: "Open it", text: "Open the file in Photoshop." }, …]
 *
 * SELLING A LOGO (instead of a free download)
 *   price          e.g. "R350": shows the price and a "Buy on WhatsApp" button
 *   priceWithName  (optional) e.g. "R500": second option, customised with the buyer's name
 *   sold           true = shows "Sold" and stops new orders
 *   includes       the formats the buyer gets, e.g. ["SVG", "AI", "PDF", "PNG", "JPG"]
 *   art            (optional) transparent PNG of the logo for the Colour test
 *   Don't upload the real files of a logo you sell: everything on GitHub can be
 *   downloaded. Keep them on your computer and send them to the buyer.
 *
 * FREE LOGO (like Dore)
 *   Leave out price, priceWithName, sold and includes. Upload the files to
 *   files/logos/<name>/ and list them under files, exactly like a template.
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
    url: "https://arclay2026.github.io/Draft-Studio-Site/",   // the site's address (change it if you get your own domain)
    tagline: "An open archive of templates, marks and icons for designers",
    email: "thedraftstudio.design@gmail.com",
    whatsapp: "27736684875",                   // +27 73 668 4875 (South Africa)
    instagram: "",                             // e.g. "https://instagram.com/draftstudio"
    license:
      "Free for personal and commercial projects. Credit is appreciated but not required. " +
      "You may not resell or redistribute the files as-is.",

    // SERVICES & PRICES — shown in "Work with the studio" on the home page.
    // Edit the text and prices freely; each card gets a WhatsApp button with
    // a ready-made message. featured: true highlights a card. Delete a {…}
    // block to remove a service; an empty list hides the whole section.
    services: [
      {
        name: "Logo design",
        price: "R800",
        text: "A custom logo built around your name, your story and your audience.",
        includes: ["3 first concepts to choose from", "2 rounds of changes", "SVG, AI, PDF, PNG and JPG files"]
      },
      {
        name: "Custom mockup",
        price: "R350",
        text: "Your brand placed on a realistic product, ready to post or pitch.",
        includes: ["Hoodie, T-shirt, cup or packaging", "High-resolution JPG and PNG", "1 round of changes"]
      },
      {
        name: "Social media pack",
        price: "R600",
        text: "Matching post and story designs in your brand style.",
        includes: ["6 posts and 3 stories", "Editable files you can reuse", "1 round of changes"]
      },
      {
        name: "Full brand kit",
        price: "R2,500",
        featured: true,
        text: "Everything a new brand needs to launch with confidence.",
        includes: ["Logo design (as above)", "Colour palette and font pairing", "Brand guide PDF", "Business card and 3 social posts", "2 mockups of your brand"]
      }
    ],

    // STUDENTS — shown in "Students" on the home page.
    //   name      first name (or full name)
    //   photo     upload a square photo to the students/ folder, e.g.
    //             "students/blessed.jpg". Leave "" to show their initials.
    //   country   e.g. "South Africa"
    //   programs  the apps they're learning, e.g. ["Photoshop", "Illustrator"]
    //             (Photoshop, Illustrator, Lightroom and Premiere show their logo)
    // Add a {…} block for each new student. An empty list hides the section.
    students: [
      { name: "Blessed", photo: "", country: "", programs: [] },
      { name: "Sudais",  photo: "", country: "", programs: [] }
    ]
  },

  templates: [
    {
      id: "hoodie-mockup-one",
      title: "Hoodie Mockup — Flat Lay",
      category: "Mockups",
      description: "A two-tone hoodie laid flat on concrete, styled with a branded coffee cup and burger wrapper on a tray. Place your artwork through the smart object layers.",
      dimensions: "3456 × 4608 px · portrait",
      requires: "Adobe Photoshop",
      tags: ["mockup", "hoodie", "sweatshirt", "apparel", "merch", "flat lay", "cup", "packaging", "smart object", "photoshop", "psd"],
      preview: "previews/hoodie-mockup-one.jpg",
      files: [
        // Hosted on Google Drive (too big for GitHub). "name" is what the button shows.
        { format: "PSD", path: "https://drive.google.com/file/d/16XtB5is0IBh-21NNVC92bz6gr_rTmDUT/view?usp=sharing", name: "hoodie-mockup-one.psd" }
      ],
      creator: "Isaac Matovu",
      date: "2026-09-29",
      featured: true
    },
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
      // FOR SALE — exclusive, sold once. Set sold: true after someone buys it.
      price: "R350",
      priceWithName: "R500",
      sold: false,
      includes: ["SVG", "AI", "PDF", "PNG", "JPG"],
      art: "previews/mato-logo-art.png",
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
      // FREE — anyone can download it.
      files: [
        { format: "SVG", path: "files/logos/dore/dore-logo.svg", size: "4 KB" },
        { format: "AI",  path: "files/logos/dore/dore-logo.ai",  size: "175 KB" },
        { format: "PDF", path: "files/logos/dore/dore-logo.pdf", size: "43 KB" },
        { format: "PNG", path: "files/logos/dore/dore-logo.png", size: "64 KB" },
        { format: "JPG", path: "files/logos/dore/dore-logo.jpg", size: "134 KB" },
        { format: "ZIP", path: "files/logos/dore/dore-logo.zip", size: "271 KB" }
      ],
      art: "previews/dore-logo-art.png",
      creator: "Isaac Matovu",
      date: "2026-09-28",
      featured: true
    },
  ],

  icons: [
  ]
};
