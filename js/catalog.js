/*
 * DRAFT STUDIO — CONTENT CATALOG
 * ==============================
 * This is the only file you need to edit to add, change or remove content.
 *
 * HOW TO ADD A DESIGN
 *   1. Upload the design file(s) to the right folder:
 *        files/templates/   ← PSD, AI, PDF, SVG templates
 *        files/logos/       ← logo files
 *        files/icons/       ← SVG icons
 *   2. (Templates & logos) Upload a preview image (JPG/PNG/WEBP) to previews/.
 *      PSD and AI files can't be shown in a browser, so they need a preview.
 *      If an item has an SVG file and no preview, the SVG is used as the preview.
 *   3. Copy an entry below, paste it at the TOP of its list and fill it in.
 *
 * FIELDS
 *   id          unique, lowercase, no spaces (used in share links)
 *   title       name shown on the card
 *   category    used for the category filter (any text, e.g. "Flyers")
 *   description short sentence shown in the detail view
 *   tags        search words
 *   preview     path to preview image (optional if the item has an SVG file)
 *   files       one entry per downloadable format:
 *                 { format: "PSD", path: "files/templates/name.psd", size: "24 MB" }
 *               format can be PSD, AI, PDF, SVG, EPS, PNG, ZIP… (size is optional)
 *   date        YYYY-MM-DD (newest items are shown first)
 *   featured    true = show in the Editor's Selection on the home page
 *   dimensions  (optional) size or format, e.g. "A4 portrait" or "1080 × 1080 px"
 *   creator     (optional) who made it, e.g. "Jane Doe". Defaults to the site name.
 *
 * Every design gets a catalogue number (DS–001, DS–002 …) automatically,
 * in the order the designs were added (by date).
 *
 * TIP: the Archive Desk page (desk.html) fills this in for you. Drop your
 * files there and it writes the entry to paste into this file.
 *
 * Icons only need: id, name, category, tags, file.
 */

window.DRAFT_STUDIO = {
  site: {
    name: "Draft Studio",
    tagline: "An open archive of templates, marks and icons for designers",
    email: "hello@draftstudio.com",           // ← replace with your details
    whatsapp: "",                              // e.g. "27780000000" (leave empty to hide)
    instagram: "",                             // e.g. "https://instagram.com/draftstudio"
    repo: "arclay2026/Draft-Studio-Site",      // GitHub repository (used by the Archive Desk)
    branch: "main",
    license:
      "Free for personal and commercial projects. Credit is appreciated but not required. " +
      "You may not resell or redistribute the files as-is."
  },

  templates: [
    {
      id: "the-start-poster",
      title: "The Start — Magazine Cover",
      category: "Posters",
      description: "Editorial cover with an oversized headline, a date bar and a full-bleed photo that breaks through the type.",
      dimensions: "3:4 portrait · 2700 × 3600 px",
      tags: ["poster", "magazine", "cover", "editorial", "photo"],
      preview: "previews/the-start-poster.jpg",
      files: [
        { format: "JPG", path: "files/templates/the-start-poster.jpg", size: "0.7 MB" }
      ],
      creator: "Isaac Matovu",
      date: "2026-09-27",
      featured: true
    },
    {
      id: "amg-gt-646",
      title: "AMG GT 646",
      category: "Automotive",
      description: "Night car poster with outlined display type layered over the photo.",
      dimensions: "4:3 landscape · 1866 × 1400 px",
      tags: ["cars", "tech", "automotive", "poster", "night"],
      preview: "previews/amg-cle-646.jpg",
      files: [
        { format: "PNG", path: "files/templates/amg-cle-646.png", size: "2.7 MB" }
      ],
      creator: "Isaac Matovu",
      date: "2026-09-27",
      featured: true
    },
    {
      id: "mercedes-amg-gt-coupe",
      title: "Mercedes-AMG GT Coupé Post",
      category: "Social Media",
      description: "Square social post: aerial car shot, bold headline top left, legal line and logo along the bottom.",
      dimensions: "1:1 square · 2113 × 2113 px",
      tags: ["cars", "automotive", "instagram", "social", "square"],
      preview: "previews/mercedes-amg-gt-coupe.jpg",
      files: [
        { format: "PNG", path: "files/templates/mercedes-amg-gt-coupe.png", size: "1.4 MB" }
      ],
      creator: "Isaac Matovu",
      date: "2026-09-27",
      featured: false
    },
    {
      id: "event-flyer",
      dimensions: "A4 portrait",
      title: "Live Music Event Flyer",
      category: "Flyers",
      description: "A4 portrait flyer for concerts, parties and live events. Edit the date, venue and call to action.",
      tags: ["event", "poster", "music", "a4", "party"],
      files: [
        { format: "SVG", path: "files/templates/event-flyer.svg" }
      ],
      date: "2026-09-25",
      featured: true
    },
    {
      id: "social-post-sale",
      dimensions: "1080 × 1080 px",
      title: "Weekend Sale Social Post",
      category: "Social Media",
      description: "1080×1080 Instagram/Facebook post for sales and promotions.",
      tags: ["instagram", "facebook", "sale", "promo", "square"],
      files: [
        { format: "SVG", path: "files/templates/social-post-sale.svg" }
      ],
      date: "2026-09-22",
      featured: true
    },
    {
      id: "business-card-minimal",
      dimensions: "3.5 × 2 in",
      title: "Minimal Business Card",
      category: "Business Cards",
      description: "Clean two-column business card at 3.5×2 in with a bold brand panel.",
      tags: ["business card", "stationery", "print", "minimal"],
      files: [
        { format: "SVG", path: "files/templates/business-card-minimal.svg" }
      ],
      date: "2026-09-20",
      featured: true
    }
    /* Example of a template with several formats (copy, then remove the comment marks):
    ,{
      id: "restaurant-menu",
      title: "Restaurant Menu",
      category: "Menus",
      description: "Two-page A4 menu with editable prices.",
      tags: ["menu", "food", "restaurant"],
      preview: "previews/restaurant-menu.jpg",
      files: [
        { format: "PSD", path: "files/templates/restaurant-menu.psd", size: "38 MB" },
        { format: "AI",  path: "files/templates/restaurant-menu.ai",  size: "12 MB" },
        { format: "PDF", path: "files/templates/restaurant-menu.pdf", size: "4 MB" }
      ],
      date: "2026-10-01",
      featured: false
    }
    */
  ],

  logos: [
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
    {
      id: "summit-coffee",
      dimensions: "Vector · any size",
      title: "Summit Coffee Co.",
      category: "Food & Drink",
      description: "Badge-style mountain logo for cafés and coffee brands.",
      tags: ["coffee", "cafe", "mountain", "badge"],
      files: [{ format: "SVG", path: "files/logos/summit-coffee.svg" }],
      date: "2026-09-24",
      featured: true
    },
    {
      id: "nova-tech",
      dimensions: "Vector · any size",
      title: "Nova Tech",
      category: "Technology",
      description: "Geometric hexagon mark for tech startups and IT companies.",
      tags: ["tech", "startup", "hexagon", "it"],
      files: [{ format: "SVG", path: "files/logos/nova-tech.svg" }],
      date: "2026-09-21"
    },
    {
      id: "bloom-florist",
      dimensions: "Vector · any size",
      title: "Bloom Florist",
      category: "Beauty & Lifestyle",
      description: "Elegant flower logo for florists, salons and boutiques.",
      tags: ["flower", "florist", "feminine", "boutique"],
      files: [{ format: "SVG", path: "files/logos/bloom-florist.svg" }],
      date: "2026-09-19"
    }
  ],

  icons: [
    { id: "home",     name: "Home",     category: "Interface",     tags: ["house", "main"],            file: "files/icons/home.svg" },
    { id: "search",   name: "Search",   category: "Interface",     tags: ["find", "magnifier"],        file: "files/icons/search.svg" },
    { id: "settings", name: "Settings", category: "Interface",     tags: ["gear", "cog", "options"],   file: "files/icons/settings.svg" },
    { id: "bell",     name: "Bell",     category: "Interface",     tags: ["notification", "alert"],    file: "files/icons/bell.svg" },
    { id: "download", name: "Download", category: "Interface",     tags: ["save", "arrow"],            file: "files/icons/download.svg" },
    { id: "upload",   name: "Upload",   category: "Interface",     tags: ["send", "arrow"],            file: "files/icons/upload.svg" },
    { id: "share",    name: "Share",    category: "Interface",     tags: ["network", "send"],          file: "files/icons/share.svg" },
    { id: "heart",    name: "Heart",    category: "Social",        tags: ["love", "like", "favourite"], file: "files/icons/heart.svg" },
    { id: "star",     name: "Star",     category: "Social",        tags: ["rating", "favourite"],      file: "files/icons/star.svg" },
    { id: "user",     name: "User",     category: "Social",        tags: ["profile", "account", "person"], file: "files/icons/user.svg" },
    { id: "mail",     name: "Mail",     category: "Communication", tags: ["email", "envelope"],        file: "files/icons/mail.svg" },
    { id: "phone",    name: "Phone",    category: "Communication", tags: ["call", "contact"],          file: "files/icons/phone.svg" },
    { id: "map-pin",  name: "Map Pin",  category: "Communication", tags: ["location", "address"],      file: "files/icons/map-pin.svg" },
    { id: "calendar", name: "Calendar", category: "Communication", tags: ["date", "event", "schedule"], file: "files/icons/calendar.svg" },
    { id: "cart",     name: "Cart",     category: "Commerce",      tags: ["shop", "basket", "buy"],    file: "files/icons/cart.svg" },
    { id: "camera",   name: "Camera",   category: "Media",         tags: ["photo", "picture"],         file: "files/icons/camera.svg" },
    { id: "image",    name: "Image",    category: "Media",         tags: ["photo", "picture", "gallery"], file: "files/icons/image.svg" },
    { id: "pen-tool", name: "Pen Tool", category: "Design",        tags: ["vector", "bezier", "draw"], file: "files/icons/pen-tool.svg" },
    { id: "layers",   name: "Layers",   category: "Design",        tags: ["stack", "arrange"],         file: "files/icons/layers.svg" },
    { id: "palette",  name: "Palette",  category: "Design",        tags: ["colour", "color", "paint"], file: "files/icons/palette.svg" }
  ]
};
