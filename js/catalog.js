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
      { name: "Blessed", photo: "students/blessed.jpg", country: "Nigeria", programs: ["PixelLab"] },
      { name: "Sudais",  photo: "students/sudais.jpg",  country: "South Africa", programs: ["Adobe Illustrator", "Adobe Photoshop"] }
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
    // Interface
    { id: "home", name: "Home", category: "Interface", tags: ["house", "start"], file: "files/icons/home.svg" },
    { id: "search", name: "Search", category: "Interface", tags: ["find", "magnifier", "look"], file: "files/icons/search.svg" },
    { id: "menu", name: "Menu", category: "Interface", tags: ["hamburger", "list", "navigation"], file: "files/icons/menu.svg" },
    { id: "close", name: "Close", category: "Interface", tags: ["x", "cancel", "exit"], file: "files/icons/close.svg" },
    { id: "plus", name: "Plus", category: "Interface", tags: ["add", "new", "create"], file: "files/icons/plus.svg" },
    { id: "check", name: "Check", category: "Interface", tags: ["tick", "done", "yes"], file: "files/icons/check.svg" },
    { id: "arrow-right", name: "Arrow right", category: "Interface", tags: ["next", "forward"], file: "files/icons/arrow-right.svg" },
    { id: "arrow-left", name: "Arrow left", category: "Interface", tags: ["back", "previous"], file: "files/icons/arrow-left.svg" },
    { id: "arrow-up", name: "Arrow up", category: "Interface", tags: ["top", "increase"], file: "files/icons/arrow-up.svg" },
    { id: "arrow-down", name: "Arrow down", category: "Interface", tags: ["bottom", "decrease"], file: "files/icons/arrow-down.svg" },
    { id: "chevron-right", name: "Chevron right", category: "Interface", tags: ["next", "more"], file: "files/icons/chevron-right.svg" },
    { id: "settings", name: "Settings", category: "Interface", tags: ["gear", "cog", "options"], file: "files/icons/settings.svg" },
    { id: "user", name: "User", category: "Interface", tags: ["person", "profile", "account"], file: "files/icons/user.svg" },
    { id: "bell", name: "Bell", category: "Interface", tags: ["notification", "alert"], file: "files/icons/bell.svg" },
    { id: "filter", name: "Filter", category: "Interface", tags: ["funnel", "sort"], file: "files/icons/filter.svg" },
    { id: "more", name: "More", category: "Interface", tags: ["dots", "options", "ellipsis"], file: "files/icons/more.svg" },
    { id: "external-link", name: "External link", category: "Interface", tags: ["open", "new tab"], file: "files/icons/external-link.svg" },
    { id: "refresh", name: "Refresh", category: "Interface", tags: ["reload", "sync", "repeat"], file: "files/icons/refresh.svg" },
    // Files
    { id: "download", name: "Download", category: "Files", tags: ["save", "get"], file: "files/icons/download.svg" },
    { id: "upload", name: "Upload", category: "Files", tags: ["send", "share"], file: "files/icons/upload.svg" },
    { id: "share", name: "Share", category: "Files", tags: ["network", "send"], file: "files/icons/share.svg" },
    { id: "link", name: "Link", category: "Files", tags: ["chain", "url"], file: "files/icons/link.svg" },
    { id: "edit", name: "Edit", category: "Files", tags: ["write", "pen", "compose"], file: "files/icons/edit.svg" },
    { id: "trash", name: "Trash", category: "Files", tags: ["delete", "bin", "remove"], file: "files/icons/trash.svg" },
    { id: "copy", name: "Copy", category: "Files", tags: ["duplicate", "clone"], file: "files/icons/copy.svg" },
    { id: "folder", name: "Folder", category: "Files", tags: ["directory", "files"], file: "files/icons/folder.svg" },
    { id: "file", name: "File", category: "Files", tags: ["document", "page", "paper"], file: "files/icons/file.svg" },
    { id: "image", name: "Image", category: "Files", tags: ["picture", "photo", "gallery"], file: "files/icons/image.svg" },
    { id: "lock", name: "Lock", category: "Files", tags: ["secure", "private", "password"], file: "files/icons/lock.svg" },
    { id: "eye", name: "Eye", category: "Files", tags: ["view", "see", "preview"], file: "files/icons/eye.svg" },
    // Social
    { id: "mail", name: "Mail", category: "Social", tags: ["email", "envelope", "message"], file: "files/icons/mail.svg" },
    { id: "phone", name: "Phone", category: "Social", tags: ["call", "telephone"], file: "files/icons/phone.svg" },
    { id: "chat", name: "Chat", category: "Social", tags: ["message", "comment", "talk"], file: "files/icons/chat.svg" },
    { id: "send", name: "Send", category: "Social", tags: ["paper plane", "message"], file: "files/icons/send.svg" },
    { id: "heart", name: "Heart", category: "Social", tags: ["love", "like", "favourite"], file: "files/icons/heart.svg" },
    { id: "star", name: "Star", category: "Social", tags: ["rating", "favourite", "review"], file: "files/icons/star.svg" },
    { id: "bookmark", name: "Bookmark", category: "Social", tags: ["save", "saved"], file: "files/icons/bookmark.svg" },
    { id: "thumbs-up", name: "Thumbs up", category: "Social", tags: ["like", "approve", "good"], file: "files/icons/thumbs-up.svg" },
    { id: "at", name: "At sign", category: "Social", tags: ["email", "mention", "username"], file: "files/icons/at.svg" },
    { id: "globe", name: "Globe", category: "Social", tags: ["world", "website", "internet"], file: "files/icons/globe.svg" },
    { id: "camera", name: "Camera", category: "Social", tags: ["photo", "picture", "instagram"], file: "files/icons/camera.svg" },
    { id: "video", name: "Video", category: "Social", tags: ["record", "film", "call"], file: "files/icons/video.svg" },
    // Design
    { id: "pen-tool", name: "Pen tool", category: "Design", tags: ["vector", "nib", "illustrator"], file: "files/icons/pen-tool.svg" },
    { id: "brush", name: "Brush", category: "Design", tags: ["paint", "art", "draw"], file: "files/icons/brush.svg" },
    { id: "pencil", name: "Pencil", category: "Design", tags: ["draw", "sketch", "write"], file: "files/icons/pencil.svg" },
    { id: "palette", name: "Palette", category: "Design", tags: ["colour", "color", "paint"], file: "files/icons/palette.svg" },
    { id: "ruler", name: "Ruler", category: "Design", tags: ["measure", "size"], file: "files/icons/ruler.svg" },
    { id: "crop", name: "Crop", category: "Design", tags: ["trim", "cut", "resize"], file: "files/icons/crop.svg" },
    { id: "layers", name: "Layers", category: "Design", tags: ["stack", "arrange", "photoshop"], file: "files/icons/layers.svg" },
    { id: "grid", name: "Grid", category: "Design", tags: ["layout", "columns", "guides"], file: "files/icons/grid.svg" },
    { id: "type", name: "Type", category: "Design", tags: ["text", "font", "typography"], file: "files/icons/type.svg" },
    { id: "eyedropper", name: "Eyedropper", category: "Design", tags: ["colour picker", "sample", "pipette"], file: "files/icons/eyedropper.svg" },
    { id: "vector", name: "Vector", category: "Design", tags: ["bezier", "curve", "anchor"], file: "files/icons/vector.svg" },
    { id: "artboard", name: "Artboard", category: "Design", tags: ["frame", "canvas", "page"], file: "files/icons/artboard.svg" },
    { id: "align-center", name: "Align centre", category: "Design", tags: ["align", "center", "layout"], file: "files/icons/align-center.svg" },
    { id: "magic", name: "Magic wand", category: "Design", tags: ["effects", "auto", "sparkle"], file: "files/icons/magic.svg" },
    { id: "t-shirt", name: "T-shirt", category: "Design", tags: ["mockup", "clothing", "merch"], file: "files/icons/t-shirt.svg" },
    // Business
    { id: "cart", name: "Cart", category: "Business", tags: ["shopping", "buy", "store"], file: "files/icons/cart.svg" },
    { id: "bag", name: "Shopping bag", category: "Business", tags: ["shop", "buy", "store"], file: "files/icons/bag.svg" },
    { id: "tag", name: "Tag", category: "Business", tags: ["price", "label", "sale"], file: "files/icons/tag.svg" },
    { id: "wallet", name: "Wallet", category: "Business", tags: ["money", "pay", "cash"], file: "files/icons/wallet.svg" },
    { id: "credit-card", name: "Credit card", category: "Business", tags: ["payment", "bank", "pay"], file: "files/icons/credit-card.svg" },
    { id: "receipt", name: "Receipt", category: "Business", tags: ["invoice", "bill", "order"], file: "files/icons/receipt.svg" },
    { id: "bar-chart", name: "Bar chart", category: "Business", tags: ["stats", "graph", "growth"], file: "files/icons/bar-chart.svg" },
    { id: "line-chart", name: "Line chart", category: "Business", tags: ["trend", "graph", "analytics"], file: "files/icons/line-chart.svg" },
    { id: "briefcase", name: "Briefcase", category: "Business", tags: ["work", "job", "business"], file: "files/icons/briefcase.svg" },
    { id: "store", name: "Store", category: "Business", tags: ["shop", "business", "market"], file: "files/icons/store.svg" },
    { id: "gift", name: "Gift", category: "Business", tags: ["present", "reward", "birthday"], file: "files/icons/gift.svg" },
    { id: "calendar", name: "Calendar", category: "Business", tags: ["date", "event", "schedule"], file: "files/icons/calendar.svg" },
    // Media
    { id: "play", name: "Play", category: "Media", tags: ["start", "video", "music"], file: "files/icons/play.svg" },
    { id: "pause", name: "Pause", category: "Media", tags: ["stop", "hold"], file: "files/icons/pause.svg" },
    { id: "music", name: "Music", category: "Media", tags: ["song", "note", "audio"], file: "files/icons/music.svg" },
    { id: "mic", name: "Microphone", category: "Media", tags: ["voice", "record", "podcast"], file: "files/icons/mic.svg" },
    { id: "volume", name: "Volume", category: "Media", tags: ["sound", "speaker", "audio"], file: "files/icons/volume.svg" },
    { id: "headphones", name: "Headphones", category: "Media", tags: ["listen", "audio", "music"], file: "files/icons/headphones.svg" },
    { id: "film", name: "Film", category: "Media", tags: ["movie", "cinema", "video"], file: "files/icons/film.svg" },
    { id: "monitor", name: "Monitor", category: "Media", tags: ["screen", "desktop", "computer"], file: "files/icons/monitor.svg" },
    { id: "smartphone", name: "Smartphone", category: "Media", tags: ["mobile", "phone", "device"], file: "files/icons/smartphone.svg" },
    // Weather
    { id: "sun", name: "Sun", category: "Weather", tags: ["sunny", "day", "light"], file: "files/icons/sun.svg" },
    { id: "moon", name: "Moon", category: "Weather", tags: ["night", "dark", "sleep"], file: "files/icons/moon.svg" },
    { id: "cloud", name: "Cloud", category: "Weather", tags: ["cloudy", "weather", "storage"], file: "files/icons/cloud.svg" },
    { id: "rain", name: "Rain", category: "Weather", tags: ["rainy", "weather", "storm"], file: "files/icons/rain.svg" },
    { id: "bolt", name: "Lightning", category: "Weather", tags: ["storm", "power", "fast"], file: "files/icons/bolt.svg" },
    { id: "snow", name: "Snowflake", category: "Weather", tags: ["cold", "winter", "ice"], file: "files/icons/snow.svg" },
    { id: "wind", name: "Wind", category: "Weather", tags: ["breeze", "air", "weather"], file: "files/icons/wind.svg" },
    { id: "leaf", name: "Leaf", category: "Weather", tags: ["nature", "eco", "plant"], file: "files/icons/leaf.svg" },
    { id: "tree", name: "Tree", category: "Weather", tags: ["nature", "forest", "park"], file: "files/icons/tree.svg" },
    { id: "flame", name: "Flame", category: "Weather", tags: ["fire", "hot", "trending"], file: "files/icons/flame.svg" },
    // Travel
    { id: "map-pin", name: "Map pin", category: "Travel", tags: ["location", "place", "address"], file: "files/icons/map-pin.svg" },
    { id: "map", name: "Map", category: "Travel", tags: ["directions", "travel", "route"], file: "files/icons/map.svg" },
    { id: "compass", name: "Compass", category: "Travel", tags: ["explore", "direction", "navigate"], file: "files/icons/compass.svg" },
    { id: "car", name: "Car", category: "Travel", tags: ["drive", "transport", "taxi"], file: "files/icons/car.svg" },
    { id: "plane", name: "Plane", category: "Travel", tags: ["flight", "travel", "airport"], file: "files/icons/plane.svg" },
    { id: "building", name: "Building", category: "Travel", tags: ["office", "city", "company"], file: "files/icons/building.svg" },
    { id: "coffee", name: "Coffee", category: "Travel", tags: ["cafe", "drink", "break"], file: "files/icons/coffee.svg" },
    // General
    { id: "clock", name: "Clock", category: "General", tags: ["time", "hour", "watch"], file: "files/icons/clock.svg" },
    { id: "lightbulb", name: "Lightbulb", category: "General", tags: ["idea", "tip", "creative"], file: "files/icons/lightbulb.svg" },
    { id: "rocket", name: "Rocket", category: "General", tags: ["launch", "start", "fast"], file: "files/icons/rocket.svg" },
    { id: "trophy", name: "Trophy", category: "General", tags: ["award", "winner", "prize"], file: "files/icons/trophy.svg" },
    { id: "smile", name: "Smile", category: "General", tags: ["happy", "emoji", "face"], file: "files/icons/smile.svg" }
  ]
};
