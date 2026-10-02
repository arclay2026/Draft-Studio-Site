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
  var LC_PRESETS = [
    ["Original on paper", "#f4f3ef", ""], ["Original on white", "#ffffff", ""], ["Original on ink", "#111111", ""],
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
        '<div><div class="label" style="margin-bottom:8px">Download — free</div>' + DS.requiresNotice(it) + DS.downloads(it) + "</div>" +
        '<div class="btn-row">' +
          '<button class="btn btn-sm" data-save="' + esc(it.id) + '" aria-pressed="false" id="save-btn">' + DS.icon.save + ' <span>Save</span></button>' +
          '<button class="btn btn-sm" id="share-btn">' + DS.icon.link + " Copy link</button>" +
          '<button class="btn btn-sm" data-quick="' + esc(it.id) + '">Quick look</button>' +
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
          (DS.site.license ? row("Licence", DS.site.license) : "") +
        "</dl>" +
        (it.tags.length ? '<div class="tags">' + it.tags.map(function (t) { return '<a href="' + it.page + "?q=" + encodeURIComponent(t) + '">#' + esc(t) + "</a>"; }).join("") + "</div>" : "") +
      "</aside>" +
    "</section>" +

    (lcSvg ? colourTestHtml() : "") +

    '<nav class="pager" aria-label="Neighbouring records">' +
      (prev ? '<a href="' + prev.url + '"><span class="label">← Previous · ' + prev.no + '</span><span class="t">' + esc(prev.title) + "</span></a>" : "<span></span>") +
      (next ? '<a href="' + next.url + '"><span class="label">Next · ' + next.no + ' →</span><span class="t">' + esc(next.title) + "</span></a>" : "<span></span>") +
    "</nav>" +

    (related.length ? '<section class="section"><div class="folio"><span class="label label-ink">§ Related</span><span class="label">More from the archive</span><span class="rule"></span><span class="label folio-note">' + DS.pad(related.length, 2) + " records</span></div>" +
      '<div class="sect-head"><h2 class="h2">Also filed <em class="s">nearby</em></h2></div>' +
      '<div class="shelf" tabindex="0" aria-label="Related designs">' + related.map(function (r) { return DS.plate(r, { showType: true, fixed: true }); }).join("") + "</div></section>" : "");

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
              return '<button type="button" data-p="' + i + '" aria-pressed="' + (i === 0) + '"><span class="lc-chip" style="background:' + p[1] + ";color:" + (p[2] || "#ff4e3b") + '" aria-hidden="true">' +
                (p[2] ? "" : '<i style="background:#ff4e3b"></i><i style="background:#2457ff"></i>') + "</span>" + p[0] + "</button>";
            }).join("") + "</div></div>" +
          '<div class="lc-pickers">' +
            '<div class="field"><span>Background</span><label class="lc-pick"><span class="sr-only">Background</span><input type="color" id="lc-bg" value="#f4f3ef"><code id="lc-bg-hex"></code></label></div>' +
            '<div class="field"><span id="lc-ik">Logo colour</span><div class="lc-ink" role="radiogroup" aria-labelledby="lc-ik">' +
              '<button type="button" role="radio" aria-checked="true" data-ink="orig">Original</button>' +
              '<button type="button" role="radio" aria-checked="false" data-ink="one">One colour</button>' +
              '<label class="lc-pick" id="lc-ink-pick" hidden><span class="sr-only">Logo</span><input type="color" id="lc-ink" value="#111111"></label>' +
            "</div></div>" +
          "</div>" +
          '<div class="btn-row"><button type="button" class="btn btn-sm" id="lc-png">' + DS.icon.down + ' Save PNG</button><button type="button" class="btn btn-sm" id="lc-svgdl">' + DS.icon.down + " Save SVG</button></div>" +
          '<p class="lc-note">Check how the mark holds up on light, dark and brand colours before you use it. Saved files use the colours shown here.</p>' +
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

  if (lcSvg) colourTest();
  function colourTest() {
    var stage = $("#lc-stage"), art = $("#lc-art"), bgIn = $("#lc-bg"), inkIn = $("#lc-ink"), out = $("#lc-contrast");
    var st = { bg: "#f4f3ef", ink: "", raw: "", svg: null, colours: [] };
    var lum = function (hex) {
      var n = parseInt(hex.slice(1), 16), c = [n >> 16 & 255, n >> 8 & 255, n & 255].map(function (v) { v /= 255; return v <= .03928 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4); });
      return .2126 * c[0] + .7152 * c[1] + .0722 * c[2];
    };
    var ratio = function (a, b) { var x = lum(a), y = lum(b); return (Math.max(x, y) + .05) / (Math.min(x, y) + .05); };
    var full = function (h) { h = h.toLowerCase(); return h.length === 4 ? "#" + h.slice(1).replace(/./g, "$&$&") : h; };

    DS.loadSvg(lcSvg).then(function (txt) {
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
      // the "Original" chips show the logo's own colours
      DS.$all(".lc-chip:not(:empty)").forEach(function (ch) {
        ch.innerHTML = st.colours.slice(0, 3).map(function (c) { return '<i style="background:' + c + '"></i>'; }).join("");
      });
      paint();
    });

    function paint() {
      stage.style.setProperty("--lc-bg", st.bg);
      art.classList.toggle("is-one", !!st.ink);
      art.style.setProperty("--lc-ink", st.ink || "currentColor");
      $("#lc-bg-hex").textContent = st.bg.toUpperCase();
      var inks = st.ink ? [st.ink] : st.colours, low = inks.length ? Math.min.apply(null, inks.map(function (c) { return ratio(c, st.bg); })) : 0;
      var r = Math.round(low * 10) / 10, verdict = r >= 4.5 ? "Strong contrast" : r >= 3 ? "Reads well" : r >= 2 ? "Borderline, use with care" : "Hard to see";
      out.textContent = inks.length ? (st.ink ? "Contrast " : "Lowest contrast ") + r.toFixed(1) + ":1 · " + verdict : "";
      out.classList.toggle("is-low", !!inks.length && r < 3);
      out.style.color = lum(st.bg) > .4 ? "#111111" : "#f4f3ef";
      DS.$all(".lc-presets button").forEach(function (b) { var p = LC_PRESETS[+b.getAttribute("data-p")]; b.setAttribute("aria-pressed", p[1] === st.bg && (p[2] || "") === st.ink); });
      DS.$all(".lc-ink button").forEach(function (b) { b.setAttribute("aria-checked", (b.getAttribute("data-ink") === "one") === !!st.ink); });
      $("#lc-ink-pick").hidden = !st.ink;
    }
    DS.$all(".lc-presets button").forEach(function (b) {
      b.addEventListener("click", function () {
        var p = LC_PRESETS[+b.getAttribute("data-p")];
        st.bg = p[1]; st.ink = p[2]; bgIn.value = p[1]; if (p[2]) inkIn.value = p[2]; paint();
      });
    });
    bgIn.addEventListener("input", function () { st.bg = bgIn.value; paint(); });
    inkIn.addEventListener("input", function () { st.ink = inkIn.value; paint(); });
    DS.$all(".lc-ink button").forEach(function (b) {
      b.addEventListener("click", function () { st.ink = b.getAttribute("data-ink") === "one" ? inkIn.value : ""; paint(); });
    });

    // The SVG exactly as shown (cropped, and recoloured when "One colour" is on)
    function currentSvg() {
      var c = st.svg.cloneNode(true);
      c.setAttribute("xmlns", "http://www.w3.org/2000/svg"); c.removeAttribute("aria-hidden"); c.removeAttribute("focusable");
      if (st.ink) {
        var css = document.createElementNS("http://www.w3.org/2000/svg", "style");
        css.textContent = "*:not([fill=none]){fill:" + st.ink + "!important}[stroke]:not([stroke=none]){stroke:" + st.ink + "!important}";
        c.appendChild(css);
      }
      return new XMLSerializer().serializeToString(c).replace(/\blc-cls-/g, "cls-");
    }
    function save(blob, ext) {
      var u = URL.createObjectURL(blob), l = document.createElement("a");
      l.href = u; l.download = it.id + (st.ink ? "-" + st.ink.slice(1) : "") + "." + ext; document.body.appendChild(l); l.click(); l.remove();
      setTimeout(function () { URL.revokeObjectURL(u); }, 4000); DS.toast("Saved " + ext.toUpperCase());
    }
    $("#lc-svgdl").addEventListener("click", function () { if (st.svg) save(new Blob([currentSvg()], { type: "image/svg+xml" }), "svg"); });
    $("#lc-png").addEventListener("click", function () {
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

  $("#share-btn").addEventListener("click", function () { DS.copy(location.href, "Link copied"); });
  var sb = $("#save-btn");
  function saveLabel() { sb.querySelector("span").textContent = DS.saved.has(it.id) ? "Saved" : "Save"; }
  sb.addEventListener("click", function () { setTimeout(saveLabel, 0); });
  saveLabel();
})();
