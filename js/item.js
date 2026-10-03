/* Draft Studio — record page (item.html?id=…) */
(function () {
  "use strict";
  var DS = window.DS, $ = DS.$, esc = DS.esc;
  var id = new URLSearchParams(location.search).get("id");
  var it = id && DS.byId(id);
  var root = $("#record-root");

  if (!it) {
    document.title = "Record not found | Draft Studio";
    root.innerHTML = '<div class="empty"><p class="label">Error — no such record</p><p class="display" style="margin-top:14px">Not in <em class="s">the archive.</em></p>' +
      '<p style="margin-top:26px"><a class="btn" href="templates.html">Browse templates <span class="arrow arrow-right">→</span></a></p></div>';
    return;
  }

  document.title = it.title + " — " + it.no + " | Draft Studio";
  var md = document.querySelector('meta[name="description"]');
  if (md) md.setAttribute("content", it.description || it.title);

  // Neighbours by catalogue number
  var bySeq = DS.items.slice().sort(function (a, b) { return a.seq - b.seq; });
  var idx = bySeq.indexOf(it);
  var prev = bySeq[idx - 1], next = bySeq[idx + 1];

  var related = DS.items.filter(function (i) { return i !== it && i.category === it.category; })
    .concat(DS.items.filter(function (i) { return i !== it && i.category !== it.category && i.type === it.type; }))
    .concat(DS.items.filter(function (i) { return i !== it && i.type !== it.type; }))
    .slice(0, 8);

  // Logos with a local SVG file get the colour tester
  var lcFile = it.type === "logo" && it.files.filter(function (f) { return String(f.format).toUpperCase() === "SVG" && !DS.isExternal(f.path); })[0];
  var lcSvg = lcFile ? lcFile.path : "";
  var lcArt = it.type === "logo" && !lcSvg ? it.art : "";   // logos for sale: a transparent PNG preview instead
  var LC_PRESETS = [
    ["Original on paper", "#f4f3ef", ""], ["Original on white", "#ffffff", ""], ["Original on ink", "#111111", ""], ["Reversed on ink", "#111111", "rev"],
    ["Ink on paper", "#f4f3ef", "#111111"], ["White on ink", "#111111", "#ffffff"], ["White on blue", "#2457ff", "#ffffff"]
  ];

  var sizes = it.files.filter(function (f) { return f.size; }).map(function (f) { return String(f.format).toUpperCase() + " " + f.size; });

  root.innerHTML =
    '<nav class="crumbs label" aria-label="Breadcrumb"><ol><li><a href="index.html">Archive</a></li><li><a href="' + it.page + '">' + esc(it.typeLabel) + 's</a></li><li><a href="' + it.page + "?cat=" + encodeURIComponent(it.category) + '">' + esc(it.category) + '</a></li><li><span class="label-ink" aria-current="page">' + it.no + "</span></li></ol>" +
    '<span class="nav">' + (prev ? '<a href="' + prev.url + '" aria-label="Previous record">← ' + prev.no + "</a>" : "") + (next ? '<a href="' + next.url + '" aria-label="Next record">' + next.no + " →</a>" : "") + "</span></nav>" +

    '<section class="record">' +
      '<div class="lighttable" id="lt">' +
        (it.preview ? '<img class="plate-hero-vt" src="' + esc(it.preview) + '" alt="' + esc(it.title) + '">' : '<p class="label">No preview available</p>') +
        '<span class="deco" aria-hidden="true"><span class="crops"></span><span class="reg t"></span><span class="reg b"></span></span>' +
        (it.preview ? '<button class="btn btn-sm zoom-btn" id="zoom-btn" aria-pressed="false">Zoom in</button>' : "") +
      "</div>" +
      '<aside class="spec">' +
        '<div class="label">' + it.no + " — " + esc(it.typeLabel) + "</div>" +
        "<h1>" + esc(it.title) + "</h1>" +
        (it.description ? '<p class="lede">' + esc(it.description) + "</p>" : "") +
        '<div><div class="label" style="margin-bottom:8px">' + (it.price ? (it.sold ? "Sold" : "Buy — exclusive") : "Download — free") + "</div>" + DS.requiresNotice(it) + (it.price ? DS.buyBox(it) : DS.downloads(it)) + (it.sold ? "" : '<a class="howto-jump" href="#how-to-use">How to use this file <span aria-hidden="true">↓</span></a>') + "</div>" +
        '<div class="btn-row">' +
          '<button class="btn btn-sm" data-save="' + esc(it.id) + '" aria-pressed="false" id="save-btn">' + DS.icon.save + ' <span>Save</span></button>' +
          '<button class="btn btn-sm" id="share-btn">' + DS.icon.link + " Copy link</button>" +
          '<button class="btn btn-sm" data-quick="' + esc(it.id) + '">Quick look</button>' +
        "</div>" +
        '<div class="share-row" role="group" aria-labelledby="share-k"><span class="label" id="share-k">Share</span>' +
          '<a class="share-btn" id="sh-wa" href="#" target="_blank" rel="noopener">' + DS.icon.wa + "<span>WhatsApp</span></a>" +
          '<button type="button" class="share-btn" id="sh-ig">' + DS.icon.ig + "<span>Instagram</span></button>" +
          '<button type="button" class="share-btn" id="sh-more" hidden>' + DS.icon.share + "<span>More</span></button>" +
        "</div>" +
        '<dl class="spec-table">' +
          row("Catalogue", it.no) +
          row("Type", it.typeLabel) +
          row("Category", '<a class="link" href="' + it.page + "?cat=" + encodeURIComponent(it.category) + '">' + esc(it.category) + "</a>", true) +
          (it.dimensions ? row("Size", it.dimensions) : "") +
          (it.requires ? row("Software", '<strong class="req-inline">' + esc(it.requires) + " only</strong>", true) : "") +
          row("Formats", DS.fmts(it.formats), true) +
          (sizes.length ? row("File size", sizes.join(" · ")) : "") +
          row("Filed", DS.fmtDate(it.date)) +
          row("Creator", it.creator) +
          (it.price ? row("Price", it.price + (it.priceWithName ? " · " + it.priceWithName + " with your brand name" : "")) : "") +
          (it.price ? row("Licence", "Exclusive. Sold to one buyer only, who gets full rights to use it as their brand.")
                    : DS.site.license ? row("Licence", DS.site.license) : "") +
        "</dl>" +
        (it.tags.length ? '<div class="tags">' + it.tags.map(function (t) { return '<a href="' + it.page + "?q=" + encodeURIComponent(t) + '">#' + esc(t) + "</a>"; }).join("") + "</div>" : "") +
      "</aside>" +
    "</section>" +

    (it.sold ? "" : howToHtml()) +

    (lcSvg || lcArt ? colourTestHtml() : "") +

    '<nav class="pager" aria-label="Neighbouring records">' +
      (prev ? '<a href="' + prev.url + '"><span class="label">← Previous · ' + prev.no + '</span><span class="t">' + esc(prev.title) + "</span></a>" : "<span></span>") +
      (next ? '<a href="' + next.url + '"><span class="label">Next · ' + next.no + ' →</span><span class="t">' + esc(next.title) + "</span></a>" : "<span></span>") +
    "</nav>" +

    (related.length ? '<section class="section"><div class="folio"><span class="label label-ink">§ Related</span><span class="label">More from the archive</span><span class="rule"></span><span class="label folio-note">' + DS.pad(related.length, 2) + " records</span></div>" +
      '<div class="sect-head"><h2 class="h2">Also filed <em class="s">nearby</em></h2></div>' +
      '<div class="shelf" tabindex="0" aria-label="Related designs">' + related.map(function (r) { return DS.plate(r, { showType: true, fixed: true }); }).join("") + "</div></section>" : "");

  /* ---------- How to use: steps picked for the kind of file ---------- */
  function howToSteps() {
    if (it.howTo && it.howTo.length) return it.howTo.map(function (x) { return typeof x === "string" ? ["", x] : [x.title || "", x.text || ""]; });
    var ext = it.files.some(function (f) { return DS.isExternal(f.path); });
    var has = function (fmt) { return it.formats.indexOf(fmt) !== -1; };
    var dl = ext ? ["Download", "Click “Download from Google Drive”. If Drive says it can’t scan the file for viruses, click “Download anyway”: the file is simply too big to scan."]
                 : ["Download", it.files.length > 1 ? "Pick one format from the Download menu, or take everything at once with “Download all · ZIP”." : "Click the download button to save the file to your computer."];
    if (it.price) return [
      ["Choose an option", "Buy the logo as it is (" + it.price + ")" + (it.priceWithName ? ", or have it customised with your own brand name (" + it.priceWithName + ")" : "") + "."],
      ["Message on WhatsApp", "Tap the Buy button. A message is written for you: just send it, and I’ll confirm the logo is still available."],
      ["Pay", "Pay by EFT or instant payment. The details are shared in the chat."],
      ["Get your files", "You receive the " + it.formats.join(", ") + " files on WhatsApp or by email. The logo is then marked “Sold”, so it’s yours alone."]
    ];
    if (it.type === "logo") return [
      ["Choose a format", "Not sure which one? See “Which file should I use?”: SVG for screens, PDF for print, AI for editing."],
      dl,
      ["Make it yours", "Open the SVG or AI file in Illustrator, Figma, Affinity Designer or Inkscape (free) to change the name, colours or shape." + (lcSvg ? " Try colours first in the Colour test below." : "")],
      ["Use it", "Use it for your brand, client work or products. Credit is appreciated, but please don’t resell the files as they are."]
    ];
    if (/photoshop/i.test(it.requires) || has("PSD")) return [
      dl,
      ["Open it in Photoshop", "Open the .psd file in Adobe Photoshop. Other apps (Photopea, GIMP, Canva) don’t keep the smart objects working."],
      ["Open the smart object", "In the Layers panel, find the smart object layer (its thumbnail has a small page icon in the corner) and double-click the thumbnail. It opens in a new tab."],
      ["Place your design", "Drag your logo or artwork into that tab. Press Ctrl + T (⌘ + T on Mac) to resize it, and hide the sample design."],
      ["Save and close", "Press Ctrl + S (⌘ + S), then close the tab. Back in the mockup, your design now sits on the product, with the folds and shadows."],
      ["Export", "Go to File → Export → Export As…, choose JPG or PNG, and save your finished mockup."]
    ];
    var app = has("AI") ? "Adobe Illustrator" : has("PSD") ? "Adobe Photoshop" : has("FIG") ? "Figma" : "your design app";
    return [dl,
      ["Open it", "Open the file in " + app + (has("PDF") ? ", or use the PDF to print straight away" : "") + "."],
      ["Edit the text and images", "Replace the sample text, photos and colours with your own. Fonts used are listed in the file."],
      ["Export", "Save a copy as PDF for print or PNG/JPG for screens and social media."]
    ];
  }
  function howToHtml() {
    var FORMAT_USE = {
      SVG: "Websites, apps and any size on screen. Stays sharp at every size.",
      PNG: "Documents, slides and social posts. Transparent background.",
      JPG: "Quick sharing and photos. White background, no transparency.",
      PDF: "Printing, and sending to a print shop.",
      AI: "Editing the logo in Adobe Illustrator.",
      EPS: "Older print and sign-making software.",
      ZIP: "Every format at once, in one download."
    };
    var steps = howToSteps();
    if (!steps.length) return "";
    var fmts = it.type === "logo" ? it.formats.filter(function (f) { return FORMAT_USE[f]; }) : [];
    return '<section class="section howto" id="how-to-use" aria-labelledby="ht-title">' +
      '<div class="folio"><span class="label label-ink">§ How to use</span><span class="label">Step by step</span><span class="rule"></span><span class="label folio-note">' + DS.pad(steps.length, 2) + " steps</span></div>" +
      '<div class="sect-head"><h2 class="h2" id="ht-title">How to use <em class="s">this file.</em></h2></div>' +
      '<div class="howto-grid' + (fmts.length ? " has-formats" : "") + '">' +
        '<ol class="howto-steps' + (steps.length > 4 ? " is-long" : "") + '">' + steps.map(function (x, n) {
          return '<li><span class="howto-n" aria-hidden="true">' + DS.pad(n + 1, 2) + "</span>" + (x[0] ? "<h3>" + esc(x[0]) + "</h3>" : "") + "<p>" + esc(x[1]) + "</p></li>";
        }).join("") + "</ol>" +
        (fmts.length ? '<aside class="howto-formats" aria-labelledby="ht-f"><h3 class="label" id="ht-f">Which file should I use?</h3><dl>' +
          fmts.map(function (f) { return "<div><dt>" + DS.fmts([f]) + "</dt><dd>" + esc(FORMAT_USE[f]) + "</dd></div>"; }).join("") + "</dl></aside>" : "") +
      "</div></section>";
  }

  function colourTestHtml() {
    return '<section class="section lc" id="colour-test" aria-labelledby="lc-title">' +
      '<div class="folio"><span class="label label-ink">§ Colour test</span><span class="label">Try the mark</span><span class="rule"></span><span class="label folio-note">Live · from the SVG</span></div>' +
      '<div class="sect-head"><h2 class="h2" id="lc-title">See it in <em class="s">any colour.</em></h2></div>' +
      '<div class="lc-grid">' +
        '<div class="lc-stage" id="lc-stage"><div class="lc-art" id="lc-art" role="img" aria-label="' + esc(it.title) + ' in the chosen colours"><p class="label">Loading…</p></div>' +
          '<p class="label lc-contrast" id="lc-contrast" aria-live="polite"></p></div>' +
        '<div class="lc-panel">' +
          '<div class="field"><span id="lc-pk">Quick looks</span><div class="lc-presets" role="group" aria-labelledby="lc-pk">' +
            LC_PRESETS.map(function (p, i) {
              return '<button type="button" data-p="' + i + '" aria-pressed="' + (i === 0) + '"><span class="lc-chip"' + (p[2] === "rev" ? " data-rev" : "") + ' style="background:' + p[1] + ";color:" + (p[2] && p[2] !== "rev" ? p[2] : "#ff4e3b") + '" aria-hidden="true">' +
                (p[2] && p[2] !== "rev" ? "" : '<i style="background:#ff4e3b"></i><i style="background:#2457ff"></i>') + "</span>" + p[0] + "</button>";
            }).join("") + "</div></div>" +
          '<div class="lc-pickers">' +
            '<div class="field"><span>Background</span><label class="lc-pick"><span class="sr-only">Background</span><input type="color" id="lc-bg" value="#f4f3ef"><code id="lc-bg-hex"></code></label></div>' +
            '<div class="field"><span id="lc-ik">Logo colour</span><div class="lc-ink" role="radiogroup" aria-labelledby="lc-ik">' +
              '<button type="button" role="radio" aria-checked="true" data-ink="orig">Original</button>' +
              '<button type="button" role="radio" aria-checked="false" data-ink="rev">Reversed</button>' +
              '<button type="button" role="radio" aria-checked="false" data-ink="one">One colour</button>' +
              '<label class="lc-pick" id="lc-ink-pick" hidden><span class="sr-only">Logo</span><input type="color" id="lc-ink" value="#111111"></label>' +
            "</div></div>" +
          "</div>" +
          (lcSvg ? '<div class="btn-row"><button type="button" class="btn btn-sm" id="lc-png">' + DS.icon.down + ' Save PNG</button><button type="button" class="btn btn-sm" id="lc-svgdl">' + DS.icon.down + " Save SVG</button></div>" +
            '<p class="lc-note">Check how the mark holds up on light, dark and brand colours before you use it. Saved files use the colours shown here.</p>'
            : '<p class="lc-note">Check how the mark holds up on light, dark and brand colours before you buy. The files you receive are full-quality vectors.</p>') +
        "</div>" +
      "</div></section>";
  }

  function row(k, v, raw) { return "<div><dt>" + k + "</dt><dd>" + (raw ? v : esc(v)) + "</dd></div>"; }

  DS.markNav(it.type === "logo" ? "logos" : "templates");

  // Zoom on the light table (hover/desktop only; touch devices pinch-zoom)
  var lt = $("#lt"), img = $("#lt img"), zb = $("#zoom-btn");
  function toggleZoom() {
    if (!window.matchMedia("(hover: hover) and (min-width: 1024px)").matches) return;
    var on = lt.classList.toggle("is-zoom");
    if (zb) { zb.textContent = on ? "Fit to screen" : "Zoom in"; zb.setAttribute("aria-pressed", on); }
  }
  if (img) img.addEventListener("click", toggleZoom);
  if (zb) zb.addEventListener("click", function (e) { e.stopPropagation(); toggleZoom(); });

  if (lcSvg || lcArt) colourTest();
  function colourTest() {
    var stage = $("#lc-stage"), art = $("#lc-art"), bgIn = $("#lc-bg"), inkIn = $("#lc-ink"), out = $("#lc-contrast");
    var st = { bg: "#f4f3ef", ink: "", raw: "", svg: null, colours: [] };
    var lum = function (hex) {
      var n = parseInt(hex.slice(1), 16), c = [n >> 16 & 255, n >> 8 & 255, n & 255].map(function (v) { v /= 255; return v <= .03928 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4); });
      return .2126 * c[0] + .7152 * c[1] + .0722 * c[2];
    };
    var ratio = function (a, b) { var x = lum(a), y = lum(b); return (Math.max(x, y) + .05) / (Math.min(x, y) + .05); };
    var full = function (h) { h = h.toLowerCase(); return h.length === 4 ? "#" + h.slice(1).replace(/./g, "$&$&") : h; };

    // "Reversed": the logo's near-black parts turn white, brand colours stay as they are
    var isDark = function (r, g, b) { return Math.max(r, g, b) < 80 && Math.max(r, g, b) - Math.min(r, g, b) < 40; };
    var hexRgb = function (h) { var n = parseInt(h.slice(1), 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; };
    var revHex = function (h) { var c = hexRgb(h); return isDark(c[0], c[1], c[2]) ? "#ffffff" : h; };
    var mode = function () { return !st.ink ? "orig" : st.ink === "rev" ? "rev" : "one"; };
    function showColours() {   // the "Original" and "Reversed" chips show the logo's own colours
      DS.$all(".lc-chip:not(:empty)").forEach(function (ch) {
        ch.innerHTML = st.colours.slice(0, 3).map(function (c) { return '<i style="background:' + (ch.hasAttribute("data-rev") ? revHex(c) : c) + '"></i>'; }).join("");
      });
    }
    var revUrl = "";
    function reversedArt() {   // PNG preview with its dark pixels turned white (made once)
      if (revUrl) return revUrl;
      try {
        var c = document.createElement("canvas"); c.width = im.naturalWidth; c.height = im.naturalHeight;
        var g = c.getContext("2d"); g.drawImage(im, 0, 0);
        var data = g.getImageData(0, 0, c.width, c.height), d = data.data;
        for (var i = 0; i < d.length; i += 4) if (d[i + 3] && isDark(d[i], d[i + 1], d[i + 2])) { d[i] = d[i + 1] = d[i + 2] = 255; }
        g.putImageData(data, 0, 0); revUrl = c.toDataURL("image/png");
      } catch (e) { revUrl = lcArt; }
      return revUrl;
    }
    function reverseSvg(on) {   // SVG: swap near-black fills/strokes for white
      if (!st.svg) return;
      DS.$all("path, rect, circle, ellipse, polygon, polyline, line, text", st.svg).forEach(function (el) {
        if (!el.hasAttribute("data-f")) { var cs = getComputedStyle(el); el.setAttribute("data-f", cs.fill); el.setAttribute("data-s", cs.stroke); }
        ["f", "s"].forEach(function (k) {
          var m = (el.getAttribute("data-" + k) || "").match(/\d+/g), prop = k === "f" ? "fill" : "stroke";
          el.style[prop] = on && m && m.length >= 3 && isDark(+m[0], +m[1], +m[2]) ? "#ffffff" : "";
        });
      });
    }
    if (lcArt) {   // PNG preview: recolour through a mask, read its colours from the pixels
      art.innerHTML = '<img class="lc-img" src="' + esc(lcArt) + '" alt=""><span class="lc-mask" style="-webkit-mask-image:url(' + esc(lcArt) + ");mask-image:url(" + esc(lcArt) + ')"></span>';
      var im = $(".lc-img", art);
      var read = function () {
        try {
          var w = 160, h = Math.max(1, Math.round(w * im.naturalHeight / im.naturalWidth)), c = document.createElement("canvas"); c.width = w; c.height = h;
          var g = c.getContext("2d"); g.drawImage(im, 0, 0, w, h);
          var d = g.getImageData(0, 0, w, h).data, buckets = {}, total = 0;
          for (var i = 0; i < d.length; i += 4) {
            if (d[i + 3] < 230) continue; total++;
            var k = (d[i] >> 4) + "," + (d[i + 1] >> 4) + "," + (d[i + 2] >> 4), b = buckets[k] || (buckets[k] = [0, 0, 0, 0]);
            b[0] += d[i]; b[1] += d[i + 1]; b[2] += d[i + 2]; b[3]++;
          }
          st.colours = Object.keys(buckets).map(function (k) { return buckets[k]; }).filter(function (b) { return b[3] / total > .06; })
            .sort(function (a, b) { return b[3] - a[3]; })
            .map(function (b) { return "#" + [0, 1, 2].map(function (j) { return ("0" + Math.round(b[j] / b[3]).toString(16)).slice(-2); }).join(""); });
        } catch (e) { st.colours = []; }
        showColours(); paint();
      };
      if (im.complete && im.naturalWidth) read(); else im.addEventListener("load", read, { once: true });
    } else DS.loadSvg(lcSvg).then(function (txt) {
      if (!txt) { art.innerHTML = '<p class="label">Preview unavailable</p>'; return; }
      // keep the logo's class names from clashing with anything else on the page
      txt = txt.replace(/<\?xml[^>]*>/, "").replace(/\bcls-/g, "lc-cls-").replace(/\sid="[^"]*"/g, "");
      art.innerHTML = txt;
      var svg = $("svg", art); st.svg = svg;
      svg.removeAttribute("width"); svg.removeAttribute("height"); svg.setAttribute("aria-hidden", "true"); svg.setAttribute("focusable", "false");
      try {   // crop the artboard to the artwork, with a little breathing room
        var bb = svg.getBBox(), pad = Math.max(bb.width, bb.height) * .08;
        if (bb.width && bb.height) svg.setAttribute("viewBox", [bb.x - pad, bb.y - pad, bb.width + pad * 2, bb.height + pad * 2].map(function (v) { return +v.toFixed(2); }).join(" "));
      } catch (e) {}
      st.colours = DS.uniq((txt.match(/#[0-9a-f]{6}\b|#[0-9a-f]{3}\b/gi) || []).map(full));
      showColours(); paint();
    });

    function paint() {
      stage.style.setProperty("--lc-bg", st.bg);
      var md = mode();
      art.classList.toggle("is-one", md === "one");
      art.style.setProperty("--lc-ink", md === "one" ? st.ink : "currentColor");
      if (lcArt && im && im.naturalWidth) { var want = md === "rev" ? reversedArt() : lcArt; if (im.getAttribute("src") !== want) im.setAttribute("src", want); }
      if (lcSvg) reverseSvg(md === "rev");
      $("#lc-bg-hex").textContent = st.bg.toUpperCase();
      var inks = md === "one" ? [st.ink] : md === "rev" ? DS.uniq(st.colours.map(revHex)) : st.colours, low = inks.length ? Math.min.apply(null, inks.map(function (c) { return ratio(c, st.bg); })) : 0;
      var r = Math.round(low * 10) / 10, verdict = r >= 4.5 ? "Strong contrast" : r >= 3 ? "Reads well" : r >= 2 ? "Borderline, use with care" : "Hard to see";
      out.textContent = inks.length ? (md === "one" ? "Contrast " : "Lowest contrast ") + r.toFixed(1) + ":1 · " + verdict : "";
      out.classList.toggle("is-low", !!inks.length && r < 3);
      out.style.color = lum(st.bg) > .4 ? "#111111" : "#f4f3ef";
      DS.$all(".lc-presets button").forEach(function (b) { var p = LC_PRESETS[+b.getAttribute("data-p")]; b.setAttribute("aria-pressed", p[1] === st.bg && (p[2] || "") === st.ink); });
      DS.$all(".lc-ink button").forEach(function (b) { b.setAttribute("aria-checked", b.getAttribute("data-ink") === md); });
      $("#lc-ink-pick").hidden = md !== "one";
    }
    DS.$all(".lc-presets button").forEach(function (b) {
      b.addEventListener("click", function () {
        var p = LC_PRESETS[+b.getAttribute("data-p")];
        st.bg = p[1]; st.ink = p[2]; bgIn.value = p[1]; if (p[2] && p[2] !== "rev") inkIn.value = p[2]; paint();
      });
    });
    bgIn.addEventListener("input", function () { st.bg = bgIn.value; paint(); });
    inkIn.addEventListener("input", function () { st.ink = inkIn.value; paint(); });
    DS.$all(".lc-ink button").forEach(function (b) {
      b.addEventListener("click", function () { var m = b.getAttribute("data-ink"); st.ink = m === "one" ? inkIn.value : m === "rev" ? "rev" : ""; paint(); });
    });

    // The SVG exactly as shown (cropped, and recoloured when "One colour" is on)
    function currentSvg() {
      var c = st.svg.cloneNode(true);
      c.setAttribute("xmlns", "http://www.w3.org/2000/svg"); c.removeAttribute("aria-hidden"); c.removeAttribute("focusable");
      if (mode() === "one") {
        var css = document.createElementNS("http://www.w3.org/2000/svg", "style");
        css.textContent = "*:not([fill=none]){fill:" + st.ink + "!important}[stroke]:not([stroke=none]){stroke:" + st.ink + "!important}";
        c.appendChild(css);
      }
      return new XMLSerializer().serializeToString(c).replace(/\blc-cls-/g, "cls-");
    }
    function save(blob, ext) {
      var u = URL.createObjectURL(blob), l = document.createElement("a");
      l.href = u; l.download = it.id + (mode() === "rev" ? "-reversed" : st.ink ? "-" + st.ink.slice(1) : "") + "." + ext; document.body.appendChild(l); l.click(); l.remove();
      setTimeout(function () { URL.revokeObjectURL(u); }, 4000); DS.toast("Saved " + ext.toUpperCase());
    }
    if (lcSvg) $("#lc-svgdl").addEventListener("click", function () { if (st.svg) save(new Blob([currentSvg()], { type: "image/svg+xml" }), "svg"); });
    if (lcSvg) $("#lc-png").addEventListener("click", function () {
      if (!st.svg) return;
      var vb = st.svg.viewBox.baseVal, W = 2000, H = Math.round(W * vb.height / vb.width);
      var img = new Image(), u = URL.createObjectURL(new Blob([currentSvg()], { type: "image/svg+xml" }));
      img.onload = function () {
        var c = document.createElement("canvas"); c.width = W; c.height = H; var g = c.getContext("2d");
        g.fillStyle = st.bg; g.fillRect(0, 0, W, H); g.drawImage(img, 0, 0, W, H); URL.revokeObjectURL(u);
        c.toBlob(function (b) { save(b, "png"); }, "image/png");
      };
      img.src = u;
    });
    paint();
  }

  /* ---------- Sharing ----------
     Links point at d/<id>.html when it exists (built when the site is published):
     that page carries the preview card (image, title, price) for WhatsApp,
     Instagram and other apps, then opens this page. */
  var shareUrl = location.href.split("#")[0];
  var offer = it.price ? (it.sold ? "Sold" : it.price + ", exclusive logo") : "free download";
  function shareText() { return it.title + " (" + offer + ") on Draft Studio"; }
  function updateShare() { $("#sh-wa").href = "https://wa.me/?text=" + encodeURIComponent(shareText() + "\n" + shareUrl); }
  updateShare();
  if (window.fetch && location.protocol !== "file:") {
    var card = "d/" + encodeURIComponent(it.id) + ".html";
    fetch(card, { method: "HEAD" }).then(function (r) { if (r.ok) { shareUrl = new URL(card, location.href).href; updateShare(); } }).catch(function () {});
  }
  $("#sh-ig").addEventListener("click", function () {
    DS.copy(shareUrl, "Link copied: paste it in your Instagram story (link sticker), bio or a DM");
  });
  if (navigator.share) {
    var more = $("#sh-more"); more.hidden = false;
    more.addEventListener("click", function () { navigator.share({ title: it.title, text: shareText(), url: shareUrl }).catch(function () {}); });
  }
  $("#share-btn").addEventListener("click", function () { DS.copy(shareUrl, "Link copied"); });
  var sb = $("#save-btn");
  function saveLabel() { sb.querySelector("span").textContent = DS.saved.has(it.id) ? "Saved" : "Save"; }
  sb.addEventListener("click", function () { setTimeout(saveLabel, 0); });
  saveLabel();
})();
