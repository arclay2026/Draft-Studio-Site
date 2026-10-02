/* Draft Studio — shared engine for every page.
   Content lives in js/catalog.js; this file turns it into records and
   drives the navigation dock, overlays (index, search, saved, quick look),
   bookmarks, downloads feedback, cursor and scroll reveals. */
(function () {
  "use strict";

  var DATA = window.DRAFT_STUDIO || {};
  var SITE = DATA.site || {};
  var DS = window.DS = { site: SITE };

  /* ---------- helpers ---------- */
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $all(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function uniq(arr) { return arr.filter(function (v, i) { return v && arr.indexOf(v) === i; }); }
  function pad(n, w) { n = String(n); while (n.length < (w || 3)) n = "0" + n; return n; }
  function fileName(p) { return String(p).split("/").pop(); }
  function slug(s) { return String(s).toLowerCase().replace(/\.[a-z0-9]+$/, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""); }
  function fmtDate(d) {
    if (!d) return "—";
    var p = String(d).split("-");
    return p.length === 3 ? p[2] + "." + p[1] + "." + p[0] : d;
  }
  function ago(d) {
    var t = Date.parse(d); if (isNaN(t)) return "";
    var days = Math.round((Date.now() - t) / 864e5);
    if (days <= 0) return "today";
    if (days === 1) return "yesterday";
    if (days < 30) return days + " days ago";
    var m = Math.round(days / 30); return m + (m === 1 ? " month ago" : " months ago");
  }
  DS.$ = $; DS.$all = $all; DS.esc = esc; DS.uniq = uniq; DS.pad = pad; DS.fileName = fileName;
  DS.slug = slug; DS.fmtDate = fmtDate; DS.ago = ago;

  var FORMAT_COLORS = { PSD: "#31a8ff", AI: "#ff9a00", PDF: "#e5322d", SVG: "#ffb13b", EPS: "#9b59b6", PNG: "#2e9e6b", JPG: "#2e9e6b", JPEG: "#2e9e6b", WEBP: "#2e9e6b", ZIP: "#8a8a8a", INDD: "#ff3366", FIG: "#a259ff", XD: "#ff61f6", TTF: "#555", OTF: "#555" };
  DS.fmt = function (f) {
    f = String(f).toUpperCase();
    return '<span class="fmt" style="--c:' + (FORMAT_COLORS[f] || "var(--fg)") + '">' + esc(f) + "</span>";
  };
  DS.fmts = function (list) { return '<span class="fmts">' + list.map(DS.fmt).join("") + "</span>"; };

  /* ---------- icons used by the UI ---------- */
  var I = DS.icon = {
    down: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square"><path class="arrow arrow-down" d="M12 3v14M5 11l7 7 7-7M4 21h16"/></svg>',
    right: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square"><path d="M3 12h17M14 5l7 7-7 7"/></svg>',
    left: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square"><path d="M21 12H4M10 5l-7 7 7 7"/></svg>',
    save: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 3h12v18l-6-5-6 5z" fill="none"/></svg>',
    eye: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>',
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5L21 21"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 5l14 14M19 5L5 19"/></svg>',
    link: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 14a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1"/><path d="M14 10a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1"/></svg>'
  };

  /* ---------- records ---------- */
  function previewOf(it) {
    if (it.preview) return it.preview;
    var svg = (it.files || []).filter(function (f) { return String(f.format).toUpperCase() === "SVG"; })[0];
    if (svg) return svg.path;
    var img = (it.files || []).filter(function (f) { return /^(PNG|JPE?G|WEBP|GIF)$/i.test(f.format); })[0];
    return img ? img.path : "";
  }
  var items = [];
  [["templates", "template", "Template"], ["logos", "logo", "Logo"]].forEach(function (t) {
    (DATA[t[0]] || []).forEach(function (raw, i) {
      items.push({
        id: raw.id, title: raw.title || raw.id, category: raw.category || "Uncategorised",
        description: raw.description || "", tags: raw.tags || [], files: raw.files || [],
        formats: uniq((raw.files || []).map(function (f) { return String(f.format).toUpperCase(); })),
        preview: previewOf(raw), date: raw.date || "", featured: !!raw.featured,
        dimensions: raw.dimensions || "", creator: raw.creator || SITE.name || "Draft Studio",
        requires: raw.requires || "", howTo: raw.howTo || null,
        type: t[1], typeLabel: t[2], page: t[0] + ".html", order: i,
        url: "item.html?id=" + encodeURIComponent(raw.id)
      });
    });
  });
  // Catalogue numbers follow the order designs were filed (oldest = 001).
  // Entries are added at the top of each list, so later list position = older.
  items.slice().sort(function (a, b) {
    return String(a.date).localeCompare(String(b.date)) || (b.order - a.order) || a.type.localeCompare(b.type);
  }).forEach(function (it, n) { it.no = "DS–" + pad(n + 1); it.seq = n + 1; });
  items.sort(function (a, b) { return String(b.date).localeCompare(String(a.date)) || (b.seq - a.seq); });
  DS.items = items;
  DS.byId = function (id) { return items.filter(function (i) { return i.id === id; })[0]; };
  DS.ofType = function (type) { return items.filter(function (i) { return i.type === type; }); };

  DS.icons = (DATA.icons || []).map(function (ic, i) {
    return { id: ic.id, name: ic.name || ic.id, category: ic.category || "General", tags: ic.tags || [], file: ic.file, no: "IC–" + pad(i + 1) };
  });

  DS.matches = function (it, q) {
    if (!q) return true;
    var hay = [it.title, it.name, it.category, it.description, it.no, it.typeLabel, it.creator].concat(it.tags || [], it.formats || []).join(" ").toLowerCase();
    return q.toLowerCase().split(/\s+/).filter(Boolean).every(function (w) { return hay.indexOf(w) !== -1; });
  };

  /* ---------- SVG loading (icons, 3D mark) ---------- */
  var svgCache = {};
  DS.loadSvg = function (path) {
    if (!svgCache[path]) {
      svgCache[path] = fetch(path).then(function (r) { if (!r.ok) throw 0; return r.text(); }).catch(function () { return null; });
    }
    return svgCache[path];
  };
  DS.fluidSvg = function (svg) {
    return svg.replace(/<\?xml[^>]*>/, "").replace(/<svg\b([^>]*)>/, function (m, a) {
      return "<svg" + a.replace(/\s(width|height)="[^"]*"/g, "") + ' aria-hidden="true" focusable="false">';
    });
  };
  DS.glyph = function (el, icon) {
    DS.loadSvg(icon.file).then(function (svg) {
      el.innerHTML = svg ? DS.fluidSvg(svg) : '<img src="' + esc(icon.file) + '" alt="">';
    });
  };

  /* ---------- storage-safe bookmarks ---------- */
  var SAVE_KEY = "ds_saved";
  function readSaved() { try { return JSON.parse(localStorage.getItem(SAVE_KEY)) || []; } catch (e) { return []; } }
  function writeSaved(list) { try { localStorage.setItem(SAVE_KEY, JSON.stringify(list)); } catch (e) {} }
  var saved = readSaved().filter(function (id) { return DS.byId(id); });
  DS.saved = {
    has: function (id) { return saved.indexOf(id) !== -1; },
    list: function () { return saved.map(DS.byId).filter(Boolean); },
    toggle: function (id) {
      var i = saved.indexOf(id);
      if (i === -1) saved.unshift(id); else saved.splice(i, 1);
      writeSaved(saved); syncSaved(true);
      return i === -1;
    }
  };
  function syncSaved(bump) {
    $all("[data-save]").forEach(function (b) {
      var on = DS.saved.has(b.getAttribute("data-save"));
      b.setAttribute("aria-pressed", on);
      var t = (DS.byId(b.getAttribute("data-save")) || {}).title || "design";
      b.setAttribute("aria-label", on ? "Remove " + t + " from saved" : "Save " + t);
      b.title = on ? "Saved" : "Save";
    });
    $all(".saved-n").forEach(function (n) {
      n.textContent = pad(saved.length, 2);
      if (saved.length) n.removeAttribute("data-zero"); else n.setAttribute("data-zero", "");
      if (bump) { n.classList.remove("bump"); void n.offsetWidth; n.classList.add("bump"); }
    });
    if ($("#ov-saved.is-open")) renderSaved();
  }
  DS.syncSaved = syncSaved;

  /* ---------- toast, clipboard, blob download ---------- */
  var toastTimer;
  DS.toast = function (msg) {
    var t = $(".toast");
    if (!t) { t = document.createElement("div"); t.className = "toast"; t.setAttribute("role", "status"); document.body.appendChild(t); }
    t.textContent = msg; t.classList.add("show");
    clearTimeout(toastTimer); toastTimer = setTimeout(function () { t.classList.remove("show"); }, 2200);
  };
  DS.copy = function (text, msg) {
    function fallback() {
      var ta = document.createElement("textarea"); ta.value = text; ta.setAttribute("readonly", "");
      ta.style.position = "fixed"; ta.style.opacity = "0"; document.body.appendChild(ta); ta.select();
      try { document.execCommand("copy"); DS.toast(msg || "Copied"); } catch (e) { DS.toast("Copy failed"); }
      ta.remove();
    }
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(text).then(function () { DS.toast(msg || "Copied"); }, fallback);
    else fallback();
  };
  DS.saveBlob = function (blob, name) {
    var url = URL.createObjectURL(blob), a = document.createElement("a");
    a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 1500);
  };

  /* ---------- plate (the artwork frame used everywhere) ---------- */
  DS.plate = function (it, opt) {
    opt = opt || {};
    var first = DS.quickFile(it);
    return '<article class="plate' + (opt.fixed ? " is-fixed" : "") + '" data-id="' + esc(it.id) + '"' + (opt.i != null ? ' style="--i:' + opt.i + '"' : "") + (opt.reveal ? " data-reveal" : "") + ">" +
      '<a class="plate-media" href="' + it.url + '" data-cursor="View" data-plate-link tabindex="-1" aria-hidden="true">' +
        (it.preview ? '<img src="' + esc(it.preview) + '" alt="' + esc(it.title) + '" loading="lazy" decoding="async">' : '<span class="label">No preview</span>') +
        '<span class="crops" aria-hidden="true"></span>' +
      "</a>" +
      '<button class="save" data-save="' + esc(it.id) + '" aria-pressed="false" aria-label="Save ' + esc(it.title) + '">' + I.save + "</button>" +
      '<div class="plate-tools">' +
        '<button class="tool" data-quick="' + esc(it.id) + '" aria-label="Quick look: ' + esc(it.title) + '">' + I.eye + "<span>Preview</span></button>" +
        (first ? '<a class="tool dl" href="' + esc(first.path) + '"' + DS.dlAttrs(first.path) + ' data-dl aria-label="Download ' + esc(it.title) + (first.bundle ? " — all formats (ZIP)" : " as " + esc(String(first.format).toUpperCase())) + '">' + I.down + "<span>" + (first.bundle ? "All · ZIP" : esc(String(first.format).toUpperCase())) + "</span></a>" : "") +
      "</div>" +
      '<div class="plate-meta">' +
        '<h3 class="plate-title"><a href="' + it.url + '" data-plate-link>' + esc(it.title) + "</a></h3>" +
        (it.requires ? DS.requiresBadge(it) : "") +
        '<div class="plate-sub"><span class="plate-cat">' + esc(it.category) + (opt.showType ? " · " + it.typeLabel : "") + "</span>" + DS.fmts(it.formats) + "</div>" +
      "</div>" +
    "</article>";
  };

  /* ---------- theme ---------- */
  document.addEventListener("click", function (e) {
    var t = e.target.closest("[data-theme-toggle]");
    if (!t) return;
    var dark = document.documentElement.getAttribute("data-theme") === "dark";
    if (dark) document.documentElement.removeAttribute("data-theme"); else document.documentElement.setAttribute("data-theme", "dark");
    try { localStorage.setItem("ds_theme", dark ? "light" : "dark"); } catch (err) {}
  });

  /* ---------- overlays ---------- */
  var stack = [];
  function overlay(id, title, html, noBar) {
    var el = document.getElementById(id);
    if (!el) {
      el = document.createElement("div");
      el.id = id; el.className = "overlay";
      el.setAttribute("role", "dialog"); el.setAttribute("aria-modal", "true");
      document.body.appendChild(el);
      el.addEventListener("click", function (e) {
        if (e.target === el || e.target.closest("[data-close]")) DS.close();
      });
    }
    el.setAttribute("aria-label", title);
    el.innerHTML = '<div class="overlay-panel">' + (noBar ? "" : DS.overlayBar(title)) + html + "</div>";
    return el;
  }
  DS.overlayBar = function (title) {
    return '<div class="overlay-bar"><p class="label">' + esc(title) + '</p><button class="overlay-close" data-close>Close ' + I.close + "</button></div>";
  };
  DS.open = function (el, focusSel) {
    if (stack.indexOf(el) === -1) stack.push({ el: el, focus: document.activeElement });
    el.classList.add("is-open");
    document.documentElement.style.overflow = "hidden";
    var f = focusSel ? $(focusSel, el) : $("[data-close]", el);
    if (f) setTimeout(function () { f.focus(); }, 30);
  };
  DS.close = function () {
    var top = stack.pop(); if (!top) return;
    top.el.classList.remove("is-open");
    if (!stack.length) document.documentElement.style.overflow = "";
    if (top.focus && top.focus.focus) top.focus.focus();
  };
  DS.closeAll = function () { while (stack.length) DS.close(); };

  /* Index (full-screen menu) */
  function openIndex() {
    var t = DS.ofType("template"), l = DS.ofType("logo");
    var cats = uniq(items.map(function (i) { return i.category; })).sort();
    var el = overlay("ov-index", "Index — Draft Studio archive",
      '<ul class="index-list">' +
        row("01", "index.html", "Front page", "", items[0]) +
        row("02", "templates.html", "Templates", pad(t.length, 2), t[0]) +
        row("03", "logos.html", "Logos", pad(l.length, 2), l[0]) +
        row("04", "icons.html", "Icons", pad(DS.icons.length, 2)) +
        row("05", "about.html", "About", "") +
      "</ul>" +
      '<div class="index-foot">' +
        '<div><div class="label">Categories</div>' + cats.map(function (c) {
          var it = items.filter(function (i) { return i.category === c; })[0];
          return '<a href="' + it.page + "?cat=" + encodeURIComponent(c) + '">' + esc(c) + "</a>";
        }).join("") + "</div>" +
        '<div><div class="label">Your archive</div><a href="#" data-open-search>Search the archive</a><a href="#" data-open-saved><span>Saved designs (<span class="saved-n">00</span>)</span></a></div>' +
        (SITE.email ? '<div><div class="label">Contact</div><a href="mailto:' + esc(SITE.email) + '">' + esc(SITE.email) + "</a></div>" : "") +
      "</div>"
    );
    function row(n, href, name, count, it) {
      return '<li><a href="' + href + '"' + (it && it.preview ? ' data-preview="' + esc(it.preview) + '"' : "") + '><span class="n">' + n + "</span><span>" + name + "</span><span class=\"n\">" + count + "</span></a></li>";
    }
    DS.open(el, ".index-list a");
    syncSaved();
    DS.hoverPreview(el, "[data-preview]");
  }

  /* Search */
  var popularTags = (function () {
    var c = {};
    items.forEach(function (i) { i.tags.concat([i.category]).forEach(function (t) { t = String(t).toLowerCase(); c[t] = (c[t] || 0) + 1; }); });
    return Object.keys(c).sort(function (a, b) { return c[b] - c[a]; }).slice(0, 10);
  })();
  function openSearch(initial) {
    var el = overlay("ov-search", "Search the archive",
      '<label class="search-field">' + I.search + '<span class="sr-only">Search templates, logos and icons</span><input type="search" id="q-all" placeholder="Type to search" autocomplete="off" spellcheck="false" enterkeyhint="search"></label>' +
      '<div class="search-meta"><p class="label" id="q-count" aria-live="polite"></p><p class="label hint">Enter ↵ opens the first result · Esc closes</p></div>' +
      '<div id="q-results"></div>'
    );
    var input = $("#q-all", el), out = $("#q-results", el), count = $("#q-count", el);
    function render() {
      var q = input.value.trim();
      if (!q) {
        count.textContent = items.length + " records · " + DS.icons.length + " icons";
        out.innerHTML =
          '<div class="search-group"><span class="label">Try</span><div class="chiplist">' + popularTags.map(function (t) { return '<button data-q="' + esc(t) + '">' + esc(t) + "</button>"; }).join("") + "</div></div>" +
          '<div class="search-group"><span class="label">Recently filed</span>' + plates(items.slice(0, 6)) + "</div>";
        return;
      }
      var p = items.filter(function (i) { return DS.matches(i, q); });
      var ic = DS.icons.filter(function (i) { return DS.matches(i, q); });
      count.textContent = (p.length + ic.length) + " results for “" + q + "”";
      out.innerHTML = (p.length ? '<div class="search-group"><span class="label">Templates & logos — ' + p.length + "</span>" + plates(p.slice(0, 12)) + "</div>" : "") +
        (ic.length ? '<div class="search-group"><span class="label">Icons — ' + ic.length + '</span><div class="search-icons">' + ic.slice(0, 24).map(function (i) {
          return '<a href="icons.html#' + esc(i.id) + '" title="' + esc(i.name) + '" data-glyph="' + esc(i.id) + '"></a>';
        }).join("") + "</div></div>" : "") +
        (!p.length && !ic.length ? '<p class="h3">Nothing filed under “' + esc(q) + '”. <span class="serif muted">Try a broader word.</span></p>' : "");
      $all("[data-glyph]", out).forEach(function (a) { var ic2 = DS.icons.filter(function (i) { return i.id === a.getAttribute("data-glyph"); })[0]; DS.glyph(a, ic2); });
    }
    function plates(list) {
      return '<div class="search-plates">' + list.map(function (i) {
        return '<a href="' + i.url + '"><div class="thumb">' + (i.preview ? '<img src="' + esc(i.preview) + '" alt="" loading="lazy">' : "") + '</div><div class="t">' + esc(i.title) + '</div><div class="label">' + i.no + " · " + esc(i.typeLabel) + "</div></a>";
      }).join("") + "</div>";
    }
    input.addEventListener("input", render);
    input.addEventListener("keydown", function (e) {
      if (e.key === "Enter") { var a = $("a", out); if (a) location.href = a.getAttribute("href"); }
    });
    out.addEventListener("click", function (e) {
      var b = e.target.closest("[data-q]"); if (!b) return;
      input.value = b.getAttribute("data-q"); render(); input.focus();
    });
    input.value = initial || "";
    render();
    DS.open(el, "#q-all");
  }
  DS.openSearch = openSearch;

  /* Saved drawer */
  function renderSaved() {
    var el = $("#ov-saved"); if (!el) return;
    var list = DS.saved.list();
    $(".saved-body", el).innerHTML = list.length ? list.map(function (i) {
      return '<div class="saved-row"><a class="thumb" href="' + i.url + '">' + (i.preview ? '<img src="' + esc(i.preview) + '" alt="">' : "") + '</a><div><div class="label">' + i.no + " · " + esc(i.typeLabel) + '</div><a class="t" href="' + i.url + '">' + esc(i.title) + '</a></div><button data-save="' + esc(i.id) + '">Remove</button></div>';
    }).join("") : '<p class="h3" style="margin-top:20px">Nothing saved yet.</p><p class="muted" style="margin-top:8px">Use the bookmark on any design to keep it here.</p>';
  }
  function openSaved() {
    var el = overlay("ov-saved", "Saved designs", '<h2 class="h2">Your <em class="s">shortlist</em> <sup class="count saved-n">00</sup></h2><div class="saved-body"></div><p class="label" style="margin-top:22px">Saved on this device only</p>');
    renderSaved(); syncSaved(); DS.open(el);
  }

  /* Quick look */
  DS.quick = function (it) {
    var el = overlay("ov-quick", "Quick look: " + it.title,
      '<div class="quick-art">' + (it.preview ? '<img src="' + esc(it.preview) + '" alt="' + esc(it.title) + '">' : "") + '<span class="crops"></span></div>' +
      '<div class="quick-info">' + DS.overlayBar("Quick look") +
        '<div class="label">' + it.no + " · " + esc(it.typeLabel) + " · " + esc(it.category) + "</div>" +
        '<h2 class="h2">' + esc(it.title) + "</h2>" +
        (it.description ? '<p class="muted">' + esc(it.description) + "</p>" : "") +
        DS.requiresNotice(it) + DS.downloads(it) +
        '<div class="btn-row"><a class="btn" href="' + it.url + '">Open full record <span class="arrow arrow-right">' + "→</span></a>" +
        '<button class="btn" data-save="' + esc(it.id) + '" aria-pressed="false">Save</button></div>' +
      "</div>", true
    );
    DS.open(el); syncSaved();
  };
  /* Software requirement ("requires" in the catalog), e.g. "Adobe Photoshop".
     Shown as a badge on plates and a notice above the downloads.            */
  // [letters, background, colour, official logo in assets/apps/ (if uploaded)]
  var APP_MARKS = {
    photoshop: ["Ps", "#001e36", "#31a8ff", "photoshop"], illustrator: ["Ai", "#330000", "#ff9a00", "illustrator"],
    lightroom: ["Lr", "#001e36", "#31a8ff", "lightroom"], premiere: ["Pr", "#00005b", "#9999ff", "premiere"],
    indesign: ["Id", "#49021f", "#ff3366"], figma: ["Fg", "#1e1e1e", "#a259ff"]
  };
  function appKey(req) { return Object.keys(APP_MARKS).filter(function (k) { return String(req).toLowerCase().indexOf(k) !== -1; })[0]; }
  function appTheme(req) { var m = APP_MARKS[appKey(req)]; return m ? ' style="--app-bg:' + m[1] + ";--app-fg:" + m[2] + '"' : ""; }
  function appMark(req) {
    var key = appKey(req);
    var m = key ? APP_MARKS[key] : [String(req).trim().slice(0, 2), "#111111", "#f4f3ef"];
    if (m[3]) return '<img class="app-mark app-logo" src="assets/apps/' + m[3] + '.svg" alt="" width="22" height="22">';
    return '<span class="app-mark" style="--app-bg:' + m[1] + ";--app-fg:" + m[2] + '" aria-hidden="true">' + esc(m[0]) + "</span>";
  }
  function appShort(req) { return String(req).replace(/^adobe\s+/i, ""); }
  DS.requiresBadge = function (it) {
    return '<span class="req-badge"' + appTheme(it.requires) + ">" + appMark(it.requires) + "<span>" + esc(appShort(it.requires)) + " only</span></span>";
  };
  DS.requiresNotice = function (it) {
    if (!it.requires) return "";
    return '<div class="req-notice" role="note"' + appTheme(it.requires) + ">" + appMark(it.requires) +
      '<div><p class="req-title">Works in ' + esc(it.requires) + " only</p>" +
      '<p class="req-text">This file is built for ' + esc(appShort(it.requires)) + " and won’t open correctly in other apps" +
      (/photoshop/i.test(it.requires) ? " (such as Photopea, Affinity, GIMP or Canva). Double-click the smart object layer to place your design." : ".") + "</p></div></div>";
  };

  /* Downloads
     One file  → a single download row.
     Several   → a "Download ▾" menu listing every format, plus a separate
                 "Download all · ZIP" button when the record has a ZIP file. */
  function isZip(f) { return String(f.format).toUpperCase() === "ZIP"; }
  /* Files hosted elsewhere (e.g. Google Drive for files too big for GitHub)
     open in a new tab instead of downloading directly.                      */
  DS.isExternal = function (path) { return /^https?:\/\//i.test(String(path)); };
  DS.hostName = function (path) { return /drive\.google|docs\.google/i.test(path) ? "Google Drive" : /dropbox/i.test(path) ? "Dropbox" : "external link"; };
  DS.dlAttrs = function (path) { return DS.isExternal(path) ? ' target="_blank" rel="noopener"' : " download"; };
  DS.quickFile = function (it) {
    var zip = it.files.filter(isZip)[0];
    if (zip) return { path: zip.path, format: "ZIP", bundle: it.files.length > 1 };
    return it.files[0];
  };
  var menuSeq = 0;
  DS.downloads = function (it) {
    if (!it.files.length) return '<p class="muted">Files coming soon.</p>';
    var zip = it.files.filter(isZip)[0];
    var singles = it.files.filter(function (f) { return !isZip(f); });
    function row(f, cls, attrs) {
      var ext = DS.isExternal(f.path);
      var label = ext ? (f.name || DS.hostName(f.path)) : fileName(f.path);
      return '<a class="' + cls + '" href="' + esc(f.path) + '"' + DS.dlAttrs(f.path) + " data-dl" + (attrs || "") + ">" + DS.fmt(f.format) +
        '<span class="fn">' + esc(label) + (f.size ? " · " + esc(f.size) : "") + '</span><span class="go">' + (ext ? "↗" : I.down) + "</span></a>";
    }
    if (it.files.length === 1) {
      var only = it.files[0], ext1 = DS.isExternal(only.path);
      return '<div class="dl-rows">' + row(only, "dl-row").replace('<span class="go">', '<span class="go">' + (ext1 ? "Download from " + DS.hostName(only.path) + " " : "Download ")) + "</div>" +
        (ext1 ? '<p class="label dl-note">Opens ' + esc(DS.hostName(only.path)) + " in a new tab. Large files may show a “can’t scan for viruses” notice. Click “Download anyway”.</p>" : "");
    }
    var id = "dl-menu-" + (++menuSeq);
    var html = '<div class="dl-box">';
    if (singles.length) {
      html += '<div class="dl-menu" data-dl-menu>' +
        '<button class="btn btn-signal dl-trigger" aria-expanded="false" aria-controls="' + id + '" aria-haspopup="true">' + I.down +
          "<span>Download</span>" + '<span class="dl-count">' + singles.length + " format" + (singles.length > 1 ? "s" : "") + "</span>" +
          '<svg class="caret" viewBox="0 0 12 8" aria-hidden="true"><path d="M1 1.5l5 5 5-5" fill="none" stroke="currentColor" stroke-width="1.8"/></svg></button>' +
        '<div class="dl-list" id="' + id + '" role="menu" aria-label="Choose a format" hidden>' +
          singles.map(function (f) { return row(f, "dl-item", ' role="menuitem"'); }).join("") +
        "</div></div>";
    }
    if (zip) {
      html += '<a class="btn dl-zip" href="' + esc(zip.path) + '" download data-dl>' + I.down +
        "<span>Download all" + '</span><span class="dl-count">ZIP' + (zip.size ? " · " + esc(zip.size) : "") + "</span></a>";
    }
    return html + "</div>";
  };
  function closeMenus(except) {
    $all("[data-dl-menu]").forEach(function (m) {
      if (m === except) return;
      var t = $(".dl-trigger", m), l = $(".dl-list", m);
      if (t) t.setAttribute("aria-expanded", "false");
      if (l) l.hidden = true;
    });
  }
  document.addEventListener("click", function (e) {
    var trig = e.target.closest(".dl-trigger");
    var menu = e.target.closest("[data-dl-menu]");
    if (e.target.closest(".dl-item")) { setTimeout(function () { closeMenus(); }, 0); return; }  // picked a file: close
    closeMenus(menu);
    if (!trig) return;
    var list = $(".dl-list", menu), open = trig.getAttribute("aria-expanded") !== "true";
    trig.setAttribute("aria-expanded", open);
    list.hidden = !open;
    if (open && e.detail === 0) { var first = $(".dl-item", list); if (first) first.focus(); }
  });
  document.addEventListener("keydown", function (e) {
    var menu = e.target.closest && e.target.closest("[data-dl-menu]");
    if (!menu) return;
    var items = $all(".dl-item", menu), i = items.indexOf(document.activeElement);
    if (e.key === "Escape") { e.stopPropagation(); closeMenus(); $(".dl-trigger", menu).focus(); }
    else if (e.key === "ArrowDown") { e.preventDefault(); if ($(".dl-list", menu).hidden) $(".dl-trigger", menu).click(); (items[i + 1] || items[0]).focus(); }
    else if (e.key === "ArrowUp") { e.preventDefault(); (items[i - 1] || items[items.length - 1]).focus(); }
  }, true);

  /* ---------- global interactions ---------- */
  document.addEventListener("click", function (e) {
    var s = e.target.closest("[data-save]");
    if (s) {
      e.preventDefault();
      var added = DS.saved.toggle(s.getAttribute("data-save"));
      s.classList.remove("pop"); void s.offsetWidth; s.classList.add("pop");
      DS.toast(added ? "Saved to your shortlist" : "Removed from saved");
      return;
    }
    var q = e.target.closest("[data-quick]");
    if (q) { e.preventDefault(); var it = DS.byId(q.getAttribute("data-quick")); if (it) DS.quick(it); return; }
    if (e.target.closest("[data-open-index]")) { e.preventDefault(); openIndex(); return; }
    if (e.target.closest("[data-open-search]")) { e.preventDefault(); DS.closeAll(); openSearch(); return; }
    if (e.target.closest("[data-open-saved]")) { e.preventDefault(); DS.closeAll(); openSaved(); return; }
    var dl = e.target.closest("[data-dl]");
    if (dl) {
      dl.classList.remove("is-done"); void dl.offsetWidth; dl.classList.add("is-done");
      var href = dl.getAttribute("href");
      DS.toast(DS.isExternal(href) ? "Opening " + DS.hostName(href) + " in a new tab" : "Downloading " + fileName(href));
    }
    // Shared-element page transition: tag the clicked plate's image
    var pl = e.target.closest("[data-plate-link]");
    if (pl) {
      var img = $("img", pl.closest(".plate") || pl);
      if (img) img.classList.add("plate-hero-vt");
    }
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && stack.length) { DS.close(); return; }
    var typing = /INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName) || document.activeElement.isContentEditable;
    if ((e.key === "/" && !typing) || ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k")) {
      e.preventDefault(); DS.closeAll(); openSearch();
    }
  });
  window.addEventListener("pageshow", function () {
    $all(".plate-hero-vt").forEach(function (i) { i.classList.remove("plate-hero-vt"); });
  });

  /* Floating hover preview for lists */
  var hp;
  DS.hoverPreview = function (root, sel) {
    if (!window.matchMedia("(hover: hover)").matches) return;
    if (!hp) { hp = document.createElement("div"); hp.className = "hover-preview"; hp.innerHTML = "<img alt=''>"; document.body.appendChild(hp); }
    root.addEventListener("mousemove", function (e) {
      var t = e.target.closest(sel);
      if (!t || !t.getAttribute("data-preview")) { hp.classList.remove("is-on"); return; }
      var src = t.getAttribute("data-preview");
      var img = hp.firstChild; if (img.getAttribute("src") !== src) img.setAttribute("src", src);
      hp.style.left = (e.clientX + 150) + "px"; hp.style.top = e.clientY + "px";
      hp.classList.add("is-on");
    });
    root.addEventListener("mouseleave", function () { hp.classList.remove("is-on"); });
  };

  /* Custom cursor (fine pointers, motion allowed) */
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  DS.reduceMotion = reduce;
  if (window.matchMedia("(hover: hover) and (pointer: fine)").matches && !reduce) {
    var cur = document.createElement("div"); cur.className = "cursor"; cur.setAttribute("aria-hidden", "true"); cur.innerHTML = "<span></span>";
    document.body.appendChild(cur);
    var x = -100, y = -100, cx = x, cy = y;
    window.addEventListener("pointermove", function (e) {
      x = e.clientX; y = e.clientY; cur.classList.add("is-on");
      var t = e.target.closest && e.target.closest("[data-cursor]");
      if (t) { cur.firstChild.textContent = t.getAttribute("data-cursor"); cur.classList.add("is-label"); }
      else cur.classList.remove("is-label");
    }, { passive: true });
    document.addEventListener("mouseleave", function () { cur.classList.remove("is-on"); });
    (function loop() { cx += (x - cx) * 0.22; cy += (y - cy) * 0.22; cur.style.transform = "translate(" + cx + "px," + cy + "px)"; requestAnimationFrame(loop); })();
  }

  /* Magnetic buttons */
  if (!reduce && window.matchMedia("(pointer: fine)").matches) {
    document.addEventListener("pointermove", function (e) {
      $all("[data-magnetic]").forEach(function (m) {
        var r = m.getBoundingClientRect(), mx = r.left + r.width / 2, my = r.top + r.height / 2;
        var dx = e.clientX - mx, dy = e.clientY - my, d = Math.hypot(dx, dy);
        m.style.transform = d < 120 ? "translate(" + dx * 0.18 + "px," + dy * 0.18 + "px)" : "";
      });
    }, { passive: true });
  }

  /* Scroll reveal */
  DS.reveal = function (root) {
    var els = $all("[data-reveal]:not(.is-in)", root);
    if (!("IntersectionObserver" in window) || reduce) { els.forEach(function (e) { e.classList.add("is-in"); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); } });
    }, { rootMargin: "0px 0px -8% 0px" });
    els.forEach(function (e) { io.observe(e); });
  };

  /* Navigation: mark the current section (used by record pages) */
  DS.markNav = function (sec) {
    $all(".dock-item[data-sec]").forEach(function (a) {
      if (a.getAttribute("data-sec") === sec) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current");
    });
  };

  /* 3D logo mark: stack flat copies in depth */
  DS.build3d = function (obj, opts) {
    if (!obj) return;
    opts = opts || {};
    var src = obj.getAttribute("data-src"), L = opts.layers || 18, gap = opts.gap || 0.9, html = "";
    for (var n = L; n >= 0; n--) {
      html += '<img src="' + esc(src) + '" alt="" draggable="false"' + (n ? ' style="transform:translateZ(' + (-n * gap).toFixed(2) + "px);filter:brightness(" + (0.45 + 0.3 * (1 - n / L)).toFixed(2) + ')"' : "") + ">";
    }
    obj.innerHTML = html;
    if (reduce) return;
    var t0 = performance.now();
    (function frame(now) {
      var t = (now - t0) / 1000;
      obj.style.setProperty("--ry", (-30 + Math.sin(t * 0.8) * 34).toFixed(2) + "deg");
      obj.style.setProperty("--rx", (10 + Math.sin(t * 0.55) * 8).toFixed(2) + "deg");
      requestAnimationFrame(frame);
    })(t0);
  };

  /* Site details from the catalog */
  $all("[data-site]").forEach(function (el) {
    var k = el.getAttribute("data-site");
    if (k === "email") {
      if (SITE.email) { el.href = "mailto:" + SITE.email; el.innerHTML = esc(SITE.email).replace("@", "@<wbr>"); }  // wraps after "@" if needed
      else el.remove();
    }
    else if (k === "whatsapp") { if (SITE.whatsapp) el.href = "https://wa.me/" + String(SITE.whatsapp).replace(/\D/g, ""); else el.remove(); }
    else if (k === "instagram") { if (SITE.instagram) el.href = SITE.instagram; else el.remove(); }
    else if (k === "commission") { if (SITE.email) el.href = "mailto:" + SITE.email + "?subject=Custom%20design%20enquiry"; else if (SITE.whatsapp) el.href = "https://wa.me/" + String(SITE.whatsapp).replace(/\D/g, ""); else el.remove(); }
    else if (SITE[k]) el.textContent = SITE[k];
  });
  $all("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });
  $all("[data-count]").forEach(function (el) {
    var k = el.getAttribute("data-count");
    var n = k === "icons" ? DS.icons.length : k === "all" ? items.length : DS.ofType(k).length;
    el.textContent = pad(n, 2);
  });

  /* ---------- Custom dropdowns ----------
     Each <select> stays in the page (hidden) and remains the source of truth,
     so page scripts keep reading .value and listening for "change". */
  var csN = 0;
  DS.customSelect = function (sel) {
    if (sel.hasAttribute("data-cs")) return;
    sel.setAttribute("data-cs", ""); sel.setAttribute("tabindex", "-1"); sel.setAttribute("aria-hidden", "true");
    var id = "cs" + (++csN), host = sel.closest("label");
    var nameEl = host && host.querySelector(".k, span:first-child");
    if (nameEl && !nameEl.id) nameEl.id = id + "-k";
    var wrap = document.createElement("span"); wrap.className = "cs";
    var btn = document.createElement("button"); btn.type = "button"; btn.className = "cs-btn"; btn.id = id + "-b";
    btn.setAttribute("aria-haspopup", "listbox"); btn.setAttribute("aria-expanded", "false");
    btn.setAttribute("aria-labelledby", (nameEl ? nameEl.id + " " : "") + btn.id);
    btn.innerHTML = '<span class="cs-v"></span><svg class="cs-chev" viewBox="0 0 10 6" aria-hidden="true" focusable="false"><path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>';
    var list = document.createElement("ul"); list.className = "cs-list"; list.id = id + "-l"; list.setAttribute("role", "listbox"); list.tabIndex = -1; list.hidden = true;
    if (nameEl) list.setAttribute("aria-labelledby", nameEl.id);
    btn.setAttribute("aria-controls", list.id);
    sel.parentNode.insertBefore(wrap, sel); wrap.appendChild(btn); wrap.appendChild(sel); document.body.appendChild(list);
    // Clicks on the label text would otherwise be forwarded to the button as a second click.
    if (host) host.addEventListener("click", function (e) { if (!btn.contains(e.target)) e.preventDefault(); });

    var active = 0, typed = "", typedAt = 0;
    function opts() { return [].slice.call(sel.options); }
    function sync() {
      $(".cs-v", btn).textContent = sel.selectedIndex >= 0 ? sel.options[sel.selectedIndex].text : "";
      if (!list.hidden) build();
    }
    function build() {
      list.innerHTML = opts().map(function (o, i) {
        return '<li role="option" id="' + id + "-o" + i + '" data-i="' + i + '" aria-selected="' + (i === sel.selectedIndex) + '"' + (i === active ? ' class="is-active"' : "") + ">" +
          '<span class="cs-t">' + esc(o.text) + '</span><svg class="cs-tick" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" stroke-width="2.2"/></svg></li>';
      }).join("");
      list.setAttribute("aria-activedescendant", id + "-o" + active);
    }
    function place() {
      var r = btn.getBoundingClientRect(), vw = document.documentElement.clientWidth, vh = window.innerHeight;
      list.style.minWidth = Math.max(r.width, 200) + "px";
      var w = list.offsetWidth, h = list.offsetHeight, gap = 6;
      var below = vh - r.bottom, up = below < h + gap + 8 && r.top > below;
      list.style.left = Math.min(Math.max(8, r.left), vw - w - 8) + "px";
      list.style.top = (up ? r.top - h - gap : r.bottom + gap) + "px";
      list.classList.toggle("is-up", up);
    }
    function move(i) {
      var n = sel.options.length; active = (i + n) % n;
      $all("li", list).forEach(function (li, k) { li.classList.toggle("is-active", k === active); });
      list.setAttribute("aria-activedescendant", id + "-o" + active);
      var li = list.children[active]; if (li) li.scrollIntoView({ block: "nearest" });
    }
    function open() {
      if (!list.hidden) return;
      $all(".cs-list:not([hidden])").forEach(function (l) { l.dispatchEvent(new Event("cs-close")); });
      active = Math.max(0, sel.selectedIndex); build();
      list.hidden = false; btn.setAttribute("aria-expanded", "true"); wrap.classList.add("is-open");
      place(); list.focus({ preventScroll: true });
      window.addEventListener("scroll", place, true); window.addEventListener("resize", place);
    }
    function close(refocus) {
      if (list.hidden) return;
      list.hidden = true; btn.setAttribute("aria-expanded", "false"); wrap.classList.remove("is-open");
      window.removeEventListener("scroll", place, true); window.removeEventListener("resize", place);
      if (refocus) btn.focus({ preventScroll: true });
    }
    function choose(i) {
      if (i !== sel.selectedIndex) { sel.selectedIndex = i; sel.dispatchEvent(new Event("change", { bubbles: true })); }
      close(true);
    }
    list.addEventListener("cs-close", function () { close(false); });
    btn.addEventListener("click", function () { list.hidden ? open() : close(true); });
    btn.addEventListener("keydown", function (e) {
      if (["ArrowDown", "ArrowUp", "Enter", " "].indexOf(e.key) !== -1) { e.preventDefault(); open(); }
    });
    list.addEventListener("click", function (e) { var li = e.target.closest("li"); if (li) choose(+li.getAttribute("data-i")); });
    list.addEventListener("mousemove", function (e) { var li = e.target.closest("li"); if (li && +li.getAttribute("data-i") !== active) move(+li.getAttribute("data-i")); });
    list.addEventListener("keydown", function (e) {
      var k = e.key;
      if (k === "ArrowDown") move(active + 1);
      else if (k === "ArrowUp") move(active - 1);
      else if (k === "Home") move(0);
      else if (k === "End") move(sel.options.length - 1);
      else if (k === "Enter" || k === " ") choose(active);
      else if (k === "Escape") close(true);
      else if (k === "Tab") { close(false); btn.focus({ preventScroll: true }); return; }
      else if (k.length === 1) {   // jump to the option that starts with what was typed
        var now = Date.now(); typed = (now - typedAt > 700 ? "" : typed) + k.toLowerCase(); typedAt = now;
        var hit = opts().findIndex(function (o) { return o.text.toLowerCase().indexOf(typed) === 0; });
        if (hit !== -1) move(hit); return;
      } else return;
      e.preventDefault();
    });
    document.addEventListener("pointerdown", function (e) { if (!list.hidden && !list.contains(e.target) && !btn.contains(e.target)) close(false); });

    // Keep the button in step when a page script sets .value or adds options.
    ["value", "selectedIndex"].forEach(function (p) {
      var d = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, p);
      Object.defineProperty(sel, p, { configurable: true, get: function () { return d.get.call(sel); }, set: function (v) { d.set.call(sel, v); sync(); } });
    });
    new MutationObserver(sync).observe(sel, { childList: true, subtree: true, attributes: true, attributeFilter: ["selected"] });
    sync();
  };

  /* ---------- Custom colour picker ----------
     Like the dropdowns: the native <input type="color"> stays hidden as the
     source of truth; picking a colour sets its value and fires "input". */
  var SWATCHES = [["#111111", "Ink"], ["#f4f3ef", "Paper"], ["#2457ff", "Draft blue"], ["#ffffff", "White"], ["#8e4ec6", "Purple"],
    ["#e5484d", "Red"], ["#f76b15", "Orange"], ["#ffc53d", "Yellow"], ["#30a46c", "Green"], ["#12a594", "Teal"]];
  var RECENT_KEY = "ds_recent_colors";
  function getRecent() { try { return JSON.parse(localStorage.getItem(RECENT_KEY)) || []; } catch (e) { return []; } }
  function addRecent(hex) {
    var r = getRecent().filter(function (c) { return c !== hex; }); r.unshift(hex);
    try { localStorage.setItem(RECENT_KEY, JSON.stringify(r.slice(0, 5))); } catch (e) {}
  }
  function normHex(v) {
    v = String(v || "").trim().replace(/^#/, "").toLowerCase();
    if (/^[0-9a-f]{3}$/.test(v)) v = v.replace(/./g, "$&$&");
    return /^[0-9a-f]{6}$/.test(v) ? "#" + v : null;
  }
  function hexToHsv(hex) {
    var n = parseInt(hex.slice(1), 16), r = (n >> 16 & 255) / 255, g = (n >> 8 & 255) / 255, b = (n & 255) / 255;
    var max = Math.max(r, g, b), d = max - Math.min(r, g, b), h = 0;
    if (d) h = max === r ? ((g - b) / d + 6) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
    return { h: h * 60, s: max ? d / max : 0, v: max };
  }
  function hsvToHex(h, s, v) {
    var f = function (n) { var k = (n + h / 60) % 6; return Math.round((v - v * s * Math.max(0, Math.min(k, 4 - k, 1))) * 255); };
    return "#" + [f(5), f(3), f(1)].map(function (x) { return ("0" + x.toString(16)).slice(-2); }).join("");
  }
  var cpN = 0;
  DS.colorPicker = function (inp) {
    if (inp.hasAttribute("data-cp")) return;
    inp.setAttribute("data-cp", ""); inp.setAttribute("tabindex", "-1"); inp.setAttribute("aria-hidden", "true");
    var id = "cp" + (++cpN), host = inp.closest("label");
    var name = host ? (host.querySelector("span:not(.swatch)") || host).firstChild.textContent.trim() : "Colour";
    var btn = document.createElement("button"); btn.type = "button"; btn.className = "cp-btn";
    btn.setAttribute("aria-haspopup", "dialog"); btn.setAttribute("aria-expanded", "false"); btn.setAttribute("aria-controls", id);
    btn.innerHTML = '<span class="cp-dot"></span>';
    inp.parentNode.insertBefore(btn, inp);

    var pop = document.createElement("div"); pop.className = "cp"; pop.id = id; pop.hidden = true;
    pop.setAttribute("role", "dialog"); pop.setAttribute("aria-label", name + " colour");
    pop.innerHTML =
      '<div class="cp-head"><span class="label">' + esc(name) + ' colour</span><button type="button" class="cp-done">Done</button></div>' +
      '<div class="cp-sw" role="group" aria-label="Swatches">' + SWATCHES.map(function (s) {
        return '<button type="button" data-hex="' + s[0] + '" aria-label="' + s[1] + " " + s[0].toUpperCase() + '" aria-pressed="false"><span style="background:' + s[0] + '"></span></button>';
      }).join("") + "</div>" +
      '<div class="cp-sv" tabindex="0" role="slider" aria-label="Shade (arrow keys: left/right saturation, up/down brightness)"><span class="cp-h"></span></div>' +
      '<div class="cp-hue" tabindex="0" role="slider" aria-label="Hue" aria-valuemin="0" aria-valuemax="360"><span class="cp-h"></span></div>' +
      '<div class="cp-row"><span class="cp-chip" aria-hidden="true"></span><label class="cp-hex"><span class="sr-only">Hex code</span><span aria-hidden="true">#</span>' +
      '<input type="text" maxlength="7" spellcheck="false" autocomplete="off" autocapitalize="off" inputmode="text"></label><button type="button" class="cp-copy">Copy</button></div>' +
      '<div class="cp-recent-wrap"><p class="label">Recent</p><div class="cp-sw cp-recent" role="group" aria-label="Recent colours"></div></div>';
    document.body.appendChild(pop);
    var sv = $(".cp-sv", pop), hue = $(".cp-hue", pop), hexIn = $(".cp-hex input", pop), copyBtn = $(".cp-copy", pop);
    var hsv = hexToHsv(normHex(inp.value) || "#111111"), startHex = null;

    var proto = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value");
    function val() { return proto.get.call(inp); }
    function paint(skipHex) {
      var hex = val();
      btn.style.setProperty("--c", hex); btn.setAttribute("aria-label", name + " colour: " + hex.toUpperCase());
      if (pop.hidden) return;
      sv.style.setProperty("--hue", "hsl(" + hsv.h + ",100%,50%)");
      $(".cp-h", sv).style.cssText = "left:" + (hsv.s * 100) + "%;top:" + ((1 - hsv.v) * 100) + "%;background:" + hex;
      $(".cp-h", hue).style.cssText = "left:" + (hsv.h / 360 * 100) + "%;background:hsl(" + hsv.h + ",100%,50%)";
      sv.setAttribute("aria-valuetext", "saturation " + Math.round(hsv.s * 100) + "%, brightness " + Math.round(hsv.v * 100) + "%");
      hue.setAttribute("aria-valuenow", Math.round(hsv.h));
      $(".cp-chip", pop).style.background = hex;
      if (!skipHex) hexIn.value = hex.slice(1).toUpperCase();
      $all(".cp-sw button", pop).forEach(function (b) { b.setAttribute("aria-pressed", b.getAttribute("data-hex") === hex); });
    }
    function commit(hex, fromHsv, skipHex) {
      if (!fromHsv) hsv = hexToHsv(hex);
      if (hex !== val()) { proto.set.call(inp, hex); inp.dispatchEvent(new Event("input", { bubbles: true })); inp.dispatchEvent(new Event("change", { bubbles: true })); }
      paint(skipHex);
    }
    function fromHsv() { commit(hsvToHex(hsv.h, hsv.s, hsv.v), true); }
    function renderRecent() {
      var r = getRecent();
      $(".cp-recent-wrap", pop).hidden = !r.length;
      $(".cp-recent", pop).innerHTML = r.map(function (c) { return '<button type="button" data-hex="' + c + '" aria-label="Recent ' + c.toUpperCase() + '" aria-pressed="false"><span style="background:' + c + '"></span></button>'; }).join("");
    }
    function place() {
      if (window.innerWidth < 768) { pop.style.left = pop.style.top = ""; return; }   // bottom sheet on phones (CSS)
      var r = btn.getBoundingClientRect(), vw = document.documentElement.clientWidth, vh = window.innerHeight;
      var w = pop.offsetWidth, h = pop.offsetHeight, gap = 8, up = vh - r.bottom < h + gap + 8 && r.top > vh - r.bottom;
      pop.style.left = Math.min(Math.max(8, r.left), vw - w - 8) + "px";
      pop.style.top = Math.max(8, Math.min(up ? r.top - h - gap : r.bottom + gap, vh - h - 8)) + "px";   // never past the screen edge
      pop.classList.toggle("is-up", up);
    }
    function open() {
      if (!pop.hidden) return;
      $all(".cp:not([hidden])").forEach(function (p) { p.dispatchEvent(new Event("cp-close")); });
      hsv = hexToHsv(normHex(val()) || "#111111"); startHex = val();
      renderRecent(); pop.hidden = false; btn.setAttribute("aria-expanded", "true"); paint(); place();
      ($(".cp-sw button[aria-pressed=true]", pop) || sv).focus({ preventScroll: true });
      window.addEventListener("scroll", place, true); window.addEventListener("resize", place);
    }
    function close(refocus) {
      if (pop.hidden) return;
      pop.hidden = true; btn.setAttribute("aria-expanded", "false");
      window.removeEventListener("scroll", place, true); window.removeEventListener("resize", place);
      if (val() !== startHex) addRecent(val());
      if (refocus) btn.focus({ preventScroll: true });
    }
    pop.addEventListener("cp-close", function () { close(false); });
    btn.addEventListener("click", function (e) { e.preventDefault(); pop.hidden ? open() : close(true); });
    $(".cp-done", pop).addEventListener("click", function () { close(true); });
    pop.addEventListener("keydown", function (e) { if (e.key === "Escape") { e.preventDefault(); close(true); } });
    pop.addEventListener("click", function (e) { var s = e.target.closest(".cp-sw button"); if (s) commit(s.getAttribute("data-hex")); });
    document.addEventListener("pointerdown", function (e) { if (!pop.hidden && !pop.contains(e.target) && !btn.contains(e.target)) close(false); });
    pop.addEventListener("focusout", function (e) { if (e.relatedTarget && !pop.contains(e.relatedTarget) && e.relatedTarget !== btn) close(false); });

    function drag(el, set) {
      el.addEventListener("pointerdown", function (e) {
        e.preventDefault(); el.focus({ preventScroll: true }); el.setPointerCapture(e.pointerId);
        var go = function (ev) { var r = el.getBoundingClientRect(); set(Math.min(1, Math.max(0, (ev.clientX - r.left) / r.width)), Math.min(1, Math.max(0, (ev.clientY - r.top) / r.height))); fromHsv(); };
        go(e); el.onpointermove = go;
        el.onpointerup = el.onpointercancel = function () { el.onpointermove = null; };
      });
    }
    drag(sv, function (x, y) { hsv.s = x; hsv.v = 1 - y; });
    drag(hue, function (x) { hsv.h = Math.min(359.9, x * 360); });
    sv.addEventListener("keydown", function (e) {
      var st = e.shiftKey ? .1 : .02, k = e.key;
      if (k === "ArrowLeft") hsv.s = Math.max(0, hsv.s - st); else if (k === "ArrowRight") hsv.s = Math.min(1, hsv.s + st);
      else if (k === "ArrowUp") hsv.v = Math.min(1, hsv.v + st); else if (k === "ArrowDown") hsv.v = Math.max(0, hsv.v - st); else return;
      e.preventDefault(); fromHsv();
    });
    hue.addEventListener("keydown", function (e) {
      var st = e.shiftKey ? 30 : 4, k = e.key;
      if (k === "ArrowLeft" || k === "ArrowDown") hsv.h = Math.max(0, hsv.h - st); else if (k === "ArrowRight" || k === "ArrowUp") hsv.h = Math.min(359.9, hsv.h + st);
      else if (k === "Home") hsv.h = 0; else if (k === "End") hsv.h = 359.9; else return;
      e.preventDefault(); fromHsv();
    });
    hexIn.addEventListener("input", function () { var h = normHex(hexIn.value); if (h && hexIn.value.replace("#", "").length === 6) commit(h, false, true); });
    hexIn.addEventListener("blur", function () { var h = normHex(hexIn.value); if (h) commit(h); else paint(); });
    hexIn.addEventListener("keydown", function (e) { if (e.key === "Enter") { var h = normHex(hexIn.value); if (h) commit(h); } });
    copyBtn.addEventListener("click", function () {
      var t = val().toUpperCase(), done = function () { copyBtn.textContent = "Copied"; setTimeout(function () { copyBtn.textContent = "Copy"; }, 1200); };
      if (navigator.clipboard) navigator.clipboard.writeText(t).then(done, function () {}); else { hexIn.select(); document.execCommand("copy"); done(); }
    });

    // Keep the swatch in step when a page script sets .value.
    Object.defineProperty(inp, "value", { configurable: true, get: val, set: function (v) { proto.set.call(inp, v); hsv = hexToHsv(normHex(val()) || "#111111"); paint(); } });
    paint();
  };

  /* Range sliders: blue fill up to the handle, and the value shown beside it */
  DS.rangeSlider = function (r) {
    var out = document.createElement("output"); out.className = "range-v"; out.setAttribute("aria-hidden", "true");
    r.insertAdjacentElement("afterend", out);
    var unit = r.getAttribute("data-unit") || "";
    var upd = function () { var min = +r.min || 0, max = +r.max || 100; r.style.setProperty("--p", ((r.value - min) / (max - min) * 100) + "%"); out.textContent = r.value + unit; };
    r.addEventListener("input", upd); upd();
  };

  // Page scripts run after this file; finish shared setup once they have rendered.
  document.addEventListener("DOMContentLoaded", function () {
    syncSaved(); DS.reveal();
    $all("select").forEach(DS.customSelect);
    $all('input[type="color"]').forEach(DS.colorPicker);
    $all('input[type="range"]').forEach(DS.rangeSlider);
  });
})();
