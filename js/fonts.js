/* Draft Studio — font pairings (fonts.html)

   PAIRS: each pair has a heading font and a body font from Google Fonts.
   To add one, copy a line and change the names. "w" is the weight to use;
   it must be a weight the font actually has on fonts.google.com (fonts
   with only one style, like Bebas Neue, use 400). Moods used by the
   filter: Modern, Classic, Editorial, Bold, Playful, Luxury, Tech.        */
(function () {
  "use strict";
  var DS = window.DS, $ = DS.$, $all = DS.$all, esc = DS.esc, pad = DS.pad;

  var PAIRS = [
    { h: { f: "Pacifico", w: 400, s: "cursive" },  b: { f: "Geist", s: "sans-serif" }, moods: ["Editorial", "Modern"], note: "The Draft Studio pair" },
    { h: { f: "Playfair Display", w: 700, s: "serif" },  b: { f: "Source Sans 3", s: "sans-serif" }, moods: ["Editorial", "Classic"] },
    { h: { f: "Montserrat", w: 700, s: "sans-serif" },   b: { f: "Merriweather", s: "serif" }, moods: ["Modern", "Classic"] },
    { h: { f: "Bebas Neue", w: 400, s: "sans-serif" },   b: { f: "Inter", s: "sans-serif" }, moods: ["Bold"] },
    { h: { f: "DM Serif Display", w: 400, s: "serif" },  b: { f: "DM Sans", s: "sans-serif" }, moods: ["Editorial", "Luxury"] },
    { h: { f: "Space Grotesk", w: 700, s: "sans-serif" }, b: { f: "Inter", s: "sans-serif" }, moods: ["Tech", "Modern"] },
    { h: { f: "Poppins", w: 700, s: "sans-serif" },      b: { f: "Lora", s: "serif" }, moods: ["Modern", "Playful"] },
    { h: { f: "Fraunces", w: 700, s: "serif" },          b: { f: "Work Sans", s: "sans-serif" }, moods: ["Playful", "Editorial"] },
    { h: { f: "Archivo Black", w: 400, s: "sans-serif" }, b: { f: "Archivo", s: "sans-serif" }, moods: ["Bold", "Modern"] },
    { h: { f: "Syne", w: 800, s: "sans-serif" },         b: { f: "Inter", s: "sans-serif" }, moods: ["Bold", "Tech"] },
    { h: { f: "Cormorant Garamond", w: 600, s: "serif" }, b: { f: "Proza Libre", s: "sans-serif" }, moods: ["Luxury", "Classic"] },
    { h: { f: "Oswald", w: 600, s: "sans-serif" },       b: { f: "Open Sans", s: "sans-serif" }, moods: ["Bold"] },
    { h: { f: "Abril Fatface", w: 400, s: "serif" },     b: { f: "Lato", s: "sans-serif" }, moods: ["Editorial", "Bold"] },
    { h: { f: "Raleway", w: 800, s: "sans-serif" },      b: { f: "Lora", s: "serif" }, moods: ["Modern", "Classic"] },
    { h: { f: "Outfit", w: 700, s: "sans-serif" },       b: { f: "Nunito Sans", s: "sans-serif" }, moods: ["Modern", "Playful"] },
    { h: { f: "Libre Baskerville", w: 700, s: "serif" }, b: { f: "Montserrat", s: "sans-serif" }, moods: ["Classic", "Luxury"] },
    { h: { f: "Bricolage Grotesque", w: 800, s: "sans-serif" }, b: { f: "Instrument Sans", s: "sans-serif" }, moods: ["Bold", "Playful"] },
    { h: { f: "Unbounded", w: 700, s: "sans-serif" },    b: { f: "Manrope", s: "sans-serif" }, moods: ["Tech", "Bold"] },
    { h: { f: "Prata", w: 400, s: "serif" },             b: { f: "Lato", s: "sans-serif" }, moods: ["Luxury", "Editorial"] },
    { h: { f: "Righteous", w: 400, s: "sans-serif" },    b: { f: "Nunito", s: "sans-serif" }, moods: ["Playful"] },
    { h: { f: "Sora", w: 700, s: "sans-serif" },         b: { f: "Karla", s: "sans-serif" }, moods: ["Tech", "Modern"] },
    { h: { f: "Pacifico", w: 400, s: "cursive" },        b: { f: "Quicksand", s: "sans-serif" }, moods: ["Playful"] },
    { h: { f: "Anton", w: 400, s: "sans-serif" },        b: { f: "Roboto", s: "sans-serif" }, moods: ["Bold"] },
    { h: { f: "Josefin Sans", w: 700, s: "sans-serif" }, b: { f: "Lora", s: "serif" }, moods: ["Classic", "Modern"] },
    { h: { f: "Plus Jakarta Sans", w: 800, s: "sans-serif" }, b: { f: "Newsreader", s: "serif" }, moods: ["Editorial", "Modern"] },
    { h: { f: "Rubik", w: 700, s: "sans-serif" },        b: { f: "Karla", s: "sans-serif" }, moods: ["Playful", "Modern"] }
  ];
  var MOODS = ["Modern", "Classic", "Editorial", "Bold", "Playful", "Luxury", "Tech"];
  var DEFAULT_H = "Good design starts with a draft";
  var BODY = "Pair a strong heading font with an easy-to-read body font. Use the heading for titles and short phrases, and the body font for everything people need to read.";

  function plus(f) { return f.replace(/ /g, "+"); }
  function cssUrl(p) {
    var fams = [plus(p.h.f) + ":wght@" + p.h.w];
    if (p.b.f !== p.h.f) fams.push(plus(p.b.f) + ":wght@400");
    return "https://fonts.googleapis.com/css2?" + fams.map(function (f) { return "family=" + f; }).join("&") + "&display=swap";
  }
  function specimen(f) { return "https://fonts.google.com/specimen/" + plus(f); }
  function cssOf(p) {
    return "/* " + p.h.f + " + " + p.b.f + " (Draft Studio font pairs) */\n" +
      "@import url('" + cssUrl(p) + "');\n\n" +
      "h1, h2, h3 { font-family: \"" + p.h.f + "\", " + p.h.s + "; font-weight: " + p.h.w + "; }\n" +
      "body { font-family: \"" + p.b.f + "\", " + p.b.s + "; }";
  }

  // Load each pair's fonts only when its card scrolls near the screen
  var loaded = {};
  function loadFonts(i) {
    if (loaded[i]) return; loaded[i] = true;
    var p = PAIRS[i];
    if (p.h.f === "Pacifico" && p.b.f === "Geist") return;   // already on every page
    var l = document.createElement("link"); l.rel = "stylesheet"; l.href = cssUrl(p); document.head.appendChild(l);
  }
  var io = "IntersectionObserver" in window ? new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { loadFonts(+e.target.getAttribute("data-pair")); io.unobserve(e.target); } });
  }, { rootMargin: "600px 0px" }) : null;

  var grid = $("#fp-grid"), chips = $("#fp-moods"), count = $("#fp-n"), input = $("#fp-text"), mood = "";
  function headline() { return (input && input.value.trim()) || DEFAULT_H; }

  function render() {
    var list = PAIRS.map(function (p, i) { return { p: p, i: i }; }).filter(function (x) { return !mood || x.p.moods.indexOf(mood) !== -1; });
    grid.innerHTML = list.map(function (x, n) {
      var p = x.p;
      return '<article class="fp-card" data-pair="' + x.i + '" style="--i:' + n + '">' +
        '<div class="fp-top"><span class="label">' + pad(x.i + 1, 2) + (p.note ? " · " + esc(p.note) : "") + '</span><span class="label">' + p.moods.join(" · ") + "</span></div>" +
        '<h3 class="fp-h" style="font-family:\'' + p.h.f + "'," + p.h.s + ";font-weight:" + p.h.w + '">' + esc(headline()) + "</h3>" +
        '<p class="fp-b" style="font-family:\'' + p.b.f + "'," + p.b.s + '">' + BODY + "</p>" +
        '<div class="fp-foot">' +
          '<dl class="fp-names"><div><dt class="label">Heading</dt><dd><a href="' + specimen(p.h.f) + '" target="_blank" rel="noopener">' + esc(p.h.f) + "&nbsp;↗</a></dd></div>" +
          '<div><dt class="label">Body</dt><dd><a href="' + specimen(p.b.f) + '" target="_blank" rel="noopener">' + esc(p.b.f) + "&nbsp;↗</a></dd></div></dl>" +
          '<button class="fp-css" data-css="' + x.i + '" aria-label="Copy CSS for ' + esc(p.h.f) + " and " + esc(p.b.f) + '">Copy CSS</button>' +
        "</div></article>";
    }).join("");
    $all(".fp-card", grid).forEach(function (c) { if (io) io.observe(c); else loadFonts(+c.getAttribute("data-pair")); });
    if (count) count.textContent = pad(list.length, 2) + " pairs";
    $all("[data-mood]", chips).forEach(function (b) { b.setAttribute("aria-pressed", b.getAttribute("data-mood") === mood); });
  }

  if (grid) {
    chips.innerHTML = ['<button data-mood="">All</button>'].concat(MOODS.map(function (m) { return '<button data-mood="' + m + '">' + m + "</button>"; })).join("");
    chips.addEventListener("click", function (e) { var b = e.target.closest("[data-mood]"); if (b) { mood = b.getAttribute("data-mood"); render(); } });
    grid.addEventListener("click", function (e) {
      var c = e.target.closest("[data-css]");
      if (c) { var p = PAIRS[+c.getAttribute("data-css")]; DS.copy(cssOf(p), p.h.f + " + " + p.b.f + " CSS copied"); }
    });
    if (input) input.addEventListener("input", function () {
      var t = headline(); $all(".fp-h", grid).forEach(function (h) { h.textContent = t; });
    });
    render();
  }
})();
