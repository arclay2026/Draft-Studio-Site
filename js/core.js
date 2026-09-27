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
      b.setAttribute("aria-label", on ? "Remove from saved" : "Save");
      b.title = on ? "Saved" : "Save";
    });
    $all(".saved-n").forEach(function (n) {
      n.textContent = pad(saved.length, 2);
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
    var first = it.files[0];
    return '<article class="plate" data-id="' + esc(it.id) + '"' + (opt.i != null ? ' style="--i:' + opt.i + '"' : "") + (opt.reveal ? " data-reveal" : "") + ">" +
      '<a class="plate-media" href="' + it.url + '" data-cursor="View" data-plate-link>' +
        (it.preview ? '<img src="' + esc(it.preview) + '" alt="' + esc(it.title) + '" loading="lazy" decoding="async">' : '<span class="label">No preview</span>') +
        '<span class="crops" aria-hidden="true"></span>' +
      "</a>" +
      '<button class="save" data-save="' + esc(it.id) + '" aria-pressed="false" aria-label="Save">' + I.save + "</button>" +
      '<div class="plate-tools">' +
        '<button class="tool" data-quick="' + esc(it.id) + '">' + I.eye + "<span>Quick look</span></button>" +
        (first ? '<a class="tool dl" href="' + esc(first.path) + '" download data-dl>' + I.down + "<span>" + esc(String(first.format).toUpperCase()) + "</span></a>" : "") +
      "</div>" +
      '<div class="plate-meta">' +
        '<span class="plate-no">' + it.no + "</span>" +
        '<h3 class="plate-title"><a href="' + it.url + '" data-plate-link>' + esc(it.title) + "</a></h3>" +
        "<span></span>" +
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
  function overlay(id, cls, html) {
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
    el.innerHTML = '<div class="overlay-panel ' + (cls || "") + '"><button class="overlay-close" data-close>Close ' + '<span class="kbd">Esc</span></button>' + html + "</div>";
    return el;
  }
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
    var el = overlay("ov-index", "",
      '<div class="label">Index — Draft Studio archive</div>' +
      '<ul class="index-list">' +
        row("01", "index.html", "Front page", "", items[0]) +
        row("02", "templates.html", "Templates", pad(t.length, 2), t[0]) +
        row("03", "logos.html", "Logos", pad(l.length, 2), l[0]) +
        row("04", "icons.html", "Icons", pad(DS.icons.length, 2)) +
      "</ul>" +
      '<div class="index-foot">' +
        '<div><div class="label">Categories</div>' + cats.map(function (c) {
          var it = items.filter(function (i) { return i.category === c; })[0];
          return '<a href="' + it.page + "?cat=" + encodeURIComponent(c) + '">' + esc(c) + "</a>";
        }).join("") + "</div>" +
        '<div><div class="label">Your archive</div><a href="#" data-open-saved>Saved (' + '<span class="saved-n">00</span>)</a><a href="#" data-open-search>Search <span class="kbd">/</span></a></div>' +
        '<div><div class="label">Contributors</div><a href="desk.html">Archive desk — file a design</a>' + (SITE.email ? '<a href="mailto:' + esc(SITE.email) + '">' + esc(SITE.email) + "</a>" : "") + "</div>" +
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
    var el = overlay("ov-search", "",
      '<label class="search-field"><span class="sr-only">Search the archive</span><input type="search" id="q-all" placeholder="Search the archive" autocomplete="off" spellcheck="false"></label>' +
      '<div class="search-meta"><span class="label" id="q-count"></span><span class="label">Enter ↵ open first · Esc close</span></div>' +
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
    var el = overlay("ov-saved", "", '<div class="label">Saved — <span class="saved-n">00</span></div><h2 class="h2" style="margin-top:10px">Your <em class="s">shortlist</em></h2><div class="saved-body"></div><p class="label" style="margin-top:22px">Saved on this device only</p>');
    renderSaved(); syncSaved(); DS.open(el);
  }

  /* Quick look */
  DS.quick = function (it) {
    var el = overlay("ov-quick", "",
      '<div class="quick-art">' + (it.preview ? '<img src="' + esc(it.preview) + '" alt="' + esc(it.title) + '">' : "") + '<span class="crops"></span></div>' +
      '<div class="quick-info">' +
        '<div class="label">' + it.no + " · " + esc(it.typeLabel) + " · " + esc(it.category) + "</div>" +
        '<h2 class="h2">' + esc(it.title) + "</h2>" +
        (it.description ? '<p class="muted">' + esc(it.description) + "</p>" : "") +
        DS.downloads(it) +
        '<div style="display:flex;gap:8px;flex-wrap:wrap"><a class="btn" href="' + it.url + '">Open full record <span class="arrow arrow-right">' + "→</span></a>" +
        '<button class="btn" data-save="' + esc(it.id) + '" aria-pressed="false">Save</button></div>' +
      "</div>"
    );
    DS.open(el); syncSaved();
  };
  DS.downloads = function (it) {
    if (!it.files.length) return '<p class="muted">Files coming soon.</p>';
    return '<div class="dl-rows">' + it.files.map(function (f) {
      return '<a class="dl-row" href="' + esc(f.path) + '" download data-dl>' + DS.fmt(f.format) +
        '<span class="fn">' + esc(fileName(f.path)) + (f.size ? " · " + esc(f.size) : "") + '</span><span class="go">Download ' + I.down + "</span></a>";
    }).join("") + "</div>";
  };

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
      DS.toast("Downloading " + fileName(dl.getAttribute("href")));
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

  /* Dock: compact while scrolling down */
  var dock = $(".dock"), lastY = 0;
  if (dock) window.addEventListener("scroll", function () {
    var y = window.scrollY;
    dock.classList.toggle("is-compact", y > 240 && y > lastY);
    lastY = y;
  }, { passive: true });

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
    if (k === "email") { if (SITE.email) { el.href = "mailto:" + SITE.email; el.textContent = SITE.email; } else el.remove(); }
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

  // Page scripts run after this file; finish shared setup once they have rendered.
  document.addEventListener("DOMContentLoaded", function () { syncSaved(); DS.reveal(); });
})();
