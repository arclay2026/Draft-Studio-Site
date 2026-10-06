/* Draft Studio — logo breakdown pages (breakdown.html?id=dore-logo)

   Each breakdown tells how a logo was made. The construction drawings are
   measured from the logo's own SVG file (units are the SVG's units).

   YOUR STORY — fill these in for each logo (leave "" or [] to hide):
     idea       a few sentences: what the logo means and where it came from
     sketches   photos of early sketches, uploaded to files/logos/<name>/sketches/
                [{ image: "files/logos/dore/sketches/1.jpg", caption: "First idea" }]
     font       the font the wordmark started from, e.g. "Questrial"            */
(function () {
  "use strict";
  var DS = window.DS, $ = DS.$, $all = DS.$all, esc = DS.esc;

  var BREAKDOWNS = {
    "dore-logo": {
      name: "Dore",
      svg: "files/logos/dore/dore-logo.svg",
      red: "#A32D2D",
      idea: "",
      sketches: [],
      font: "",
      // crop of the SVG that frames the logo, and the mark on its own
      view: "200 405 680 270", markView: "216 418 214 244",
      // measurements (from the SVG)
      g: { x0: 236.16, x1: 409, top: 437.73, bot: 642.27, cx: 306.75, cy: 540, r: 102.27,
           cap: 485.75, base: 594.25, oTop: 483.79, oBot: 596.23, oCx: 608.5, oR: 56.22,
           wordL: 444.47, wordR: 843.83, stroke: 14.55 },
      facts: [
        ["A half-circle on a square stem", "The D is exactly half a circle (radius 102) joined to a short straight stem. Its centre sits on the logo’s middle line."],
        ["Ten arcs, rippling outwards", "Inside the D, ten nested arcs (plus a thin outer sliver) rise from the base. The gaps get wider as they grow, like ripples in water."],
        ["One shared centre line", "The wordmark is centred on the symbol, so both share the same middle line (green dashed)."],
        ["The symbol is ~1.9× the letters", "The symbol is 204 units tall, the capitals are 108. Almost exactly double, which keeps them balanced."],
        ["A 3 : 1 lockup", "The whole logo is almost exactly three times as wide as it is tall: easy to fit on headers, shirts and signs."]
      ],
      lessons: [
        ["Build curves from circles", "Don’t draw curves by hand. The D here is a perfect half-circle, so it looks clean at any size."],
        ["Round letters need overshoot", "Make O, C and G slightly taller than flat letters, or they’ll look too small."],
        ["Line things up on purpose", "Give the symbol and the text one shared centre line. Small alignments make a logo feel solid."]
      ]
    }
  };

  var id = new URLSearchParams(location.search).get("id") || "";
  var B = BREAKDOWNS[id], it = DS.byId(id), root = $("#breakdown");
  var preview = /[?&]preview=1/.test(location.search);
  if (!B || !it) {
    root.innerHTML = '<section class="page-head"><div class="title-wrap"><p class="label">Logo breakdown</p><h1 class="display">Not <em class="s">found</em></h1></div>' +
      '<div class="aside"><p class="lede">This breakdown doesn’t exist yet.</p><a class="btn" href="logos.html">Browse logos <span class="arrow arrow-right">→</span></a></div></section>';
    return;
  }
  document.title = "How " + B.name + " was made · Logo breakdown · Draft Studio";

  var g = B.g, R = B.red;
  function hex2rgb(h) { h = h.replace("#", ""); return [0, 2, 4].map(function (i) { return parseInt(h.substr(i, 2), 16); }); }
  function lum(h) { return hex2rgb(h).map(function (v) { v /= 255; return v <= .03928 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4); }).reduce(function (a, v, i) { return a + v * [.2126, .7152, .0722][i]; }, 0); }
  function contrast(a, b) { var x = lum(a), y = lum(b); return ((Math.max(x, y) + .05) / (Math.min(x, y) + .05)).toFixed(1); }
  function n(v) { return Math.round(v); }

  /* construction drawings (SVG overlays in the logo's own units) */
  var line = function (x1, y1, x2, y2, cls) { return '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" class="' + (cls || "") + '"/>'; };
  var label = function (x, y, t, anchor) { return '<text x="' + x + '" y="' + y + '"' + (anchor ? ' text-anchor="' + anchor + '"' : "") + ">" + t + "</text>"; };
  var vb = B.view.split(" ").map(Number), L = vb[0], RR = vb[0] + vb[2];
  var grid =
    line(L, g.cy, RR, g.cy, "bd-key") +
    line(L, g.top, RR, g.top) + line(L, g.bot, RR, g.bot) +
    line(g.wordL - 6, g.cap, RR, g.cap, "bd-soft") + line(g.wordL - 6, g.base, RR, g.base, "bd-soft") +
    '<circle cx="' + g.cx + '" cy="' + g.cy + '" r="' + g.r + '" class="bd-key"/>' +
    '<rect x="' + g.x0 + '" y="' + g.top + '" width="' + (g.cx - g.x0) + '" height="' + (g.bot - g.top) + '"/>' +
    line(g.cx, g.top - 10, g.cx, g.bot + 10) +
    '<circle cx="' + g.cx + '" cy="' + g.cy + '" r="3" class="bd-dot"/>' +
    '<circle cx="' + g.oCx + '" cy="' + g.cy + '" r="' + g.oR + '" class="bd-soft"/>' +
    line(g.x1, g.cy - 30, g.x1, g.cy + 30) + line(g.wordL, g.cy - 30, g.wordL, g.cy + 30) +
    '<path d="M' + g.x1 + " " + (g.cy + 22) + "H" + g.wordL + '" class="bd-arrow"/>' +
    label((g.x1 + g.wordL) / 2, g.cy + 40, "gap", "middle") +
    label(RR - 4, g.cy - 5, "centre line", "end") + label(RR - 4, g.cap - 5, "cap height", "end") + label(RR - 4, g.base + 14, "baseline", "end") +
    label(g.cx + 6, g.top - 4, "r = " + n(g.r));

  var markSvg = null;
  function logo(cls, view) { return markSvg ? markSvg.replace(/<svg\b[^>]*>/, '<svg viewBox="' + (view || B.view) + '" class="' + (cls || "") + '" aria-hidden="true" focusable="false">') : ""; }
  var dPath = "M" + g.x0 + " " + g.top + "H" + g.cx + "A" + g.r + " " + g.r + " 0 0 1 " + g.cx + " " + g.bot + "H" + g.x0 + "Z";

  function step(n, title, text, art) {
    return '<li class="bd-step"><div class="bd-step-art">' + art + '</div><span class="st-n">' + n + "</span><h3>" + title + "</h3><p>" + text + "</p></li>";
  }
  function placeholder(t) { return preview ? '<div class="sp-empty bd-ph"><p class="h3">' + t + '</p><p class="muted">Ishaaq’s notes and sketches go here.</p></div>' : ""; }

  function render() {
    var mv = B.markView;
    var frame = function (inner, view) { return '<svg viewBox="' + (view || mv) + '" aria-hidden="true">' + inner + "</svg>"; };
    root.innerHTML =
      /* ---------- hero ---------- */
      '<section class="page-head bd-head"><div class="title-wrap"><p class="label">Logo breakdown · ' + esc(it.no) + '</p><h1 class="display">How <em class="s blue">' + esc(B.name) + "</em> was made</h1></div>" +
        '<div class="aside"><p class="lede">From a simple circle to a finished logo: the shapes, measurements and colour choices behind ' + esc(B.name) + ', step by step.</p>' +
        '<div class="btn-row"><a class="btn btn-signal" href="' + it.url + '">' + (it.price ? "Get this logo" : "Download " + esc(B.name) + " · free") + ' <span class="arrow arrow-right">→</span></a></div></div></section>' +
      '<div class="bd-hero-art">' + logo("bd-hero-svg") + "</div>" +

      /* ---------- idea ---------- */
      (B.idea ? '<section class="section"><div class="folio"><span class="label label-ink">§</span><span class="label">The idea</span><span class="rule"></span></div><p class="bd-idea">' + esc(B.idea) + "</p></section>"
              : (preview ? '<section class="section"><div class="folio"><span class="label label-ink">§</span><span class="label">The idea</span><span class="rule"></span></div>' + placeholder("The idea behind " + esc(B.name)) + "</section>" : "")) +
      (B.sketches.length ? '<section class="section"><div class="folio"><span class="label label-ink">§</span><span class="label">Sketches</span><span class="rule"></span></div><div class="bd-sketches">' +
          B.sketches.map(function (s) { return '<figure><img src="' + esc(s.image) + '" alt="' + esc(s.caption || "") + '" loading="lazy">' + (s.caption ? "<figcaption class=\"label\">" + esc(s.caption) + "</figcaption>" : "") + "</figure>"; }).join("") + "</div></section>"
        : (preview ? '<section class="section"><div class="folio"><span class="label label-ink">§</span><span class="label">Sketches</span><span class="rule"></span></div>' + placeholder("Early sketches") + "</section>" : "")) +

      /* ---------- step by step ---------- */
      '<section class="section"><div class="folio"><span class="label label-ink">§</span><span class="label">Step by step</span><span class="rule"></span><span class="label folio-note">4 steps</span></div>' +
        '<div class="sect-head"><h2 class="h2">Built from <em class="s">simple shapes</em></h2></div><ol class="bd-steps">' +
        step(1, "A circle and a square", "Start with a circle and a square stem of the same height.",
          frame('<circle cx="' + g.cx + '" cy="' + g.cy + '" r="' + g.r + '" class="bd-guide"/><rect x="' + g.x0 + '" y="' + g.top + '" width="' + (g.cx - g.x0) + '" height="' + (g.bot - g.top) + '" class="bd-guide"/>')) +
        step(2, "Merge them into a D", "Keep the right half of the circle and join it to the stem.",
          frame('<circle cx="' + g.cx + '" cy="' + g.cy + '" r="' + g.r + '" class="bd-guide bd-faint"/><path d="' + dPath + '" fill="' + R + '"/>')) +
        step(3, "Fill it with arcs", "Ten nested arcs rise from the base, spreading wider as they grow.",
          frame('<path d="' + dPath + '" fill="' + R + '" opacity=".14"/>' + (markSvg ? (markSvg.match(/<path class="cls-1"[^>]*\/>/) || [""])[0].replace('class="cls-1"', 'fill="' + R + '"') : ""))) +
        step(4, "Add the wordmark", "Set DORE in a clean geometric sans, centred on the symbol.", logo("", B.view)) +
      "</ol></section>" +

      /* ---------- construction grid ---------- */
      '<section class="section"><div class="folio"><span class="label label-ink">§</span><span class="label">The grid</span><span class="rule"></span><span class="label folio-note">Drag to reveal</span></div>' +
        '<div class="sect-head"><h2 class="h2">The <em class="s">construction</em> grid</h2><div class="sect-aside"><p class="lede">Drag the handle to reveal the lines the logo is built on.</p></div></div>' +
        '<div class="bd-reveal" id="bd-reveal" style="--x:55%">' + logo("bd-base") +
          '<svg class="bd-grid" viewBox="' + B.view + '" aria-hidden="true">' + grid + "</svg>" +
          '<span class="bd-handle" aria-hidden="true"></span>' +
          '<input type="range" min="0" max="100" value="55" id="bd-range" aria-label="Reveal the construction grid">' +
        "</div>" +
        '<ol class="bd-facts">' + B.facts.map(function (f, i) { return "<li><span class=\"st-n\">" + (i + 1) + "</span><div><h3>" + f[0] + "</h3><p>" + f[1] + "</p></div></li>"; }).join("") + "</ol>" +
      "</section>" +

      /* ---------- wordmark ---------- */
      '<section class="section"><div class="folio"><span class="label label-ink">§</span><span class="label">The wordmark</span><span class="rule"></span></div>' +
        '<div class="sect-head"><h2 class="h2">Spacing &amp; <em class="s">overshoot</em></h2><div class="sect-aside"><p class="lede">' +
          (B.font ? "The wordmark started from " + esc(B.font) + ". " : "") + "Round letters are drawn a little bigger than flat ones so they look the same size.</p></div></div>" +
        '<div class="bd-word">' + logo("bd-word-svg", (g.wordL - 20) + " 470 " + (g.wordR - g.wordL + 40) + " 140") +
          '<svg class="bd-word-grid" viewBox="' + (g.wordL - 20) + " 470 " + (g.wordR - g.wordL + 40) + ' 140" aria-hidden="true">' +
            line(g.wordL - 20, g.cap, g.wordR + 20, g.cap) + line(g.wordL - 20, g.base, g.wordR + 20, g.base) +
            line(g.oCx - 70, g.oTop, g.oCx + 70, g.oTop, "bd-key") + line(g.oCx - 70, g.oBot, g.oCx + 70, g.oBot, "bd-key") +
          "</svg></div>" +
        '<ul class="bd-word-notes">' +
          "<li><b>+" + ((g.oBot - g.oTop) / (g.base - g.cap) * 100 - 100).toFixed(1) + "%</b><span>The O is taller than D, R and E (green lines), so it doesn’t look smaller.</span></li>" +
          "<li><b>≈ 1 stroke</b><span>The space between letters is about one letter-stroke wide, for an even rhythm.</span></li>" +
          "<li><b>≈ " + ((g.wordL - g.x1) / g.stroke).toFixed(1) + " strokes</b><span>The gap between symbol and text, wide enough to breathe but close enough to read as one logo.</span></li>" +
        "</ul></section>" +

      /* ---------- colour ---------- */
      '<section class="section"><div class="folio"><span class="label label-ink">§</span><span class="label">Colour</span><span class="rule"></span></div>' +
        '<div class="sect-head"><h2 class="h2">One strong <em class="s">colour</em></h2></div>' +
        '<div class="bd-colours">' +
          '<button class="bd-sw" data-copy="' + R + '" style="--c:' + R + ';--ink:#fff"><span class="label">Deep red</span><b>' + R + "</b><span>RGB " + hex2rgb(R).join(", ") + "</span><span>On white: " + contrast(R, "#ffffff") + ":1 contrast</span></button>" +
          '<button class="bd-sw" data-copy="#000000" style="--c:#000;--ink:#fff"><span class="label">Black</span><b>#000000</b><span>For the wordmark</span><span>On white: 21:1 contrast</span></button>' +
        '</div><p class="muted bd-note">A single deep red keeps the symbol bold without shouting, and the black wordmark stays easy to read. Try it on other backgrounds with the <a href="' + it.url + '#colour-test">Colour test</a>, or find matching colours on the <a href="palettes.html">Palettes</a> page.</p></section>' +

      /* ---------- versions ---------- */
      '<section class="section"><div class="folio"><span class="label label-ink">§</span><span class="label">Versions</span><span class="rule"></span></div>' +
        '<div class="sect-head"><h2 class="h2">Works <em class="s">everywhere</em></h2></div>' +
        '<div class="bd-versions">' +
          '<figure class="bd-v v-light">' + logo() + '<figcaption class="label">On light</figcaption></figure>' +
          '<figure class="bd-v v-dark">' + logo() + '<figcaption class="label">On dark</figcaption></figure>' +
          '<figure class="bd-v v-red">' + logo() + '<figcaption class="label">One colour on red</figcaption></figure>' +
          '<figure class="bd-v v-sizes"><div>' + [96, 56, 32, 20].map(function (s) { return '<span style="width:' + s + "px;padding:" + Math.round(s * .12) + 'px">' + logo("", B.markView) + "</span>"; }).join("") + '</div><figcaption class="label">Symbol at small sizes</figcaption></figure>' +
        "</div></section>" +

      /* ---------- lessons ---------- */
      '<section class="section"><div class="folio"><span class="label label-ink">§</span><span class="label">For beginners</span><span class="rule"></span></div>' +
        '<div class="sect-head"><h2 class="h2">What you can <em class="s">learn</em> from it</h2></div>' +
        '<ol class="st-steps bd-lessons">' + B.lessons.map(function (l, i) { return '<li><span class="st-n">' + (i + 1) + "</span><h3>" + l[0] + "</h3><p>" + l[1] + "</p></li>"; }).join("") + "</ol></section>" +

      /* ---------- next ---------- */
      '<section class="about-cta"><div class="folio"><span class="label">§</span><span class="label">Your turn</span><span class="rule"></span></div>' +
        '<div class="about-cta-body"><h2 class="display">Now make <em class="s">your own.</em></h2><div class="about-cta-actions">' +
        '<a class="btn btn-signal" href="' + it.url + '">' + (it.price ? "Get " + esc(B.name) : "Download " + esc(B.name) + " · free") + ' <span class="arrow arrow-right">→</span></a>' +
        '<a class="btn about-cta-alt" href="start.html">Read the beginner guide</a><a class="btn about-cta-alt" href="logos.html">Browse logos</a></div></div></section>';

    // number the sections in order
    $all(".folio", root).forEach(function (f, i) { var l = f.querySelector(".label"); if (l) l.textContent = "§ " + DS.pad(i + 1, 2); });

    var rev = $("#bd-reveal"), rng = $("#bd-range");
    if (rng) rng.addEventListener("input", function () { rev.style.setProperty("--x", rng.value + "%"); });
    root.addEventListener("click", function (e) { var c = e.target.closest("[data-copy]"); if (c) DS.copy(c.getAttribute("data-copy"), c.getAttribute("data-copy") + " copied"); });
    if (DS.reveal) DS.reveal();
  }

  DS.loadSvg(B.svg).then(function (svg) { markSvg = svg ? svg.replace(/<\?xml[^>]*>/, "") : null; render(); });
})();
