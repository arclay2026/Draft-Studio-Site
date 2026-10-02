/* Draft Studio — front page */
(function () {
  "use strict";
  var DS = window.DS, $ = DS.$, $all = DS.$all, esc = DS.esc, pad = DS.pad;
  var items = DS.items, icons = DS.icons;

  /* ---------- 1. Design wall: real previews drifting in columns ---------- */
  var wall = $("#wall");
  if (wall) {
    var withArt = items.filter(function (i) { return i.preview; });
    var cats = DS.uniq(items.map(function (i) { return i.category; }));
    var COLS = 4, cols = [];
    for (var c = 0; c < COLS; c++) cols.push([]);

    function artTile(it) {
      return '<a class="wall-tile" href="' + it.url + '" data-cursor="Open" tabindex="-1"><span class="tag">' + it.no + '</span><img src="' + esc(it.preview) + '" alt="" decoding="async"></a>';
    }
    function typeTile(cat, n, blue) {
      var count = items.filter(function (i) { return i.category === cat; }).length;
      var first = items.filter(function (i) { return i.category === cat; })[0];
      return '<a class="wall-type' + (blue ? " blue-t" : "") + '" href="' + first.page + "?cat=" + encodeURIComponent(cat) + '" tabindex="-1" data-cursor="Browse">' +
        '<span class="label">Category ' + pad(n + 1, 2) + "</span>" +
        "<span><b>" + esc(cat) + '</b><br><em class="s">' + pad(count, 2) + " filed</em></span></a>";
    }
    function glyphTile(ic) {
      return '<a class="wall-glyph" href="icons.html#' + esc(ic.id) + '" tabindex="-1" data-cursor="Icon" data-g="' + esc(ic.id) + '"></a>';
    }

    // Deal artwork, category and icon tiles across the columns, offset per column
    var pool = [];
    withArt.forEach(function (it) { pool.push(artTile(it)); });
    cats.forEach(function (cat, n) { pool.splice(Math.min(pool.length, 2 + n * 3), 0, typeTile(cat, n, n % 2 === 1)); });
    icons.slice(0, 6).forEach(function (ic, n) { pool.splice(Math.min(pool.length, 4 + n * 4), 0, glyphTile(ic)); });
    if (pool.length) {
      var perCol = Math.max(5, Math.ceil(pool.length / COLS) + 2);
      for (c = 0; c < COLS; c++) {
        for (var k = 0; k < perCol; k++) cols[c].push(pool[(c * 3 + k) % pool.length]);
      }
      wall.innerHTML = cols.map(function (list, n) {
        var html = list.join("");
        return '<div class="wall-col" style="--dur:' + (54 + n * 11) + 's">' + html + html + "</div>";
      }).join("");
      $all("[data-g]", wall).forEach(function (a) {
        var ic = icons.filter(function (i) { return i.id === a.getAttribute("data-g"); })[0];
        if (ic) DS.glyph(a, ic);
      });
    }
  }

  /* Intro details */
  var last = items[0];
  var lf = $("#last-filed");
  if (lf && last) lf.innerHTML = '<span class="label">Last filed</span><a href="' + last.url + '">' + esc(last.title) + '</a><span class="label when">' + last.no + " · " + esc(DS.ago(last.date)) + "</span>";
  var searchBtn = $("#intro-search");
  if (searchBtn) searchBtn.querySelector(".ph").textContent = "Search " + (items.length + icons.length) + " designs & icons";
  if (window.matchMedia("(min-width: 768px)").matches) DS.build3d($(".seal .logo3d-obj"), { layers: 14, gap: 0.8 });

  /* ---------- 2. Ticker of newest records ---------- */
  var tick = $("#ticker");
  if (tick) {
    var t = items.slice(0, 8).map(function (it) {
      return '<a class="ticker-item" href="' + it.url + '" tabindex="-1"><span class="star">✦</span><span class="label label-ink">' + it.no + '</span><span class="t">' + esc(it.title) + "</span>" + DS.fmts(it.formats) + '<span class="label">' + DS.fmtDate(it.date) + "</span></a>";
    }).join("");
    tick.innerHTML = '<div class="ticker-track">' + t + t + t + t + "</div>";
  }

  /* ---------- 3. Editor's selection spread ---------- */
  var spread = $("#spread");
  if (spread) {
    var picks = items.filter(function (i) { return i.featured; });
    items.forEach(function (i) { if (picks.length < 3 && picks.indexOf(i) === -1) picks.push(i); });
    picks = picks.slice(0, 3);
    spread.innerHTML = picks.map(function (it, n) {
      return '<div class="p' + (n + 1) + '" data-reveal style="--d:' + (n * 0.12) + 's">' + DS.plate(it, { showType: true }) + "</div>";
    }).join("") +
      '<div class="caption" data-reveal style="--d:.3s"><div class="big-no">' + pad(picks.length, 2) + '</div><p class="label" style="margin-top:14px">Chosen by the studio. Updated as new work is filed.</p></div>';
  }

  /* ---------- 4. Category index with floating previews ---------- */
  var catList = $("#cat-list");
  if (catList) {
    var groups = {};
    items.forEach(function (i) {
      var key = i.type + "|" + i.category;
      (groups[key] = groups[key] || { cat: i.category, type: i.typeLabel, page: i.page, n: 0, preview: i.preview }).n++;
    });
    var rows = Object.keys(groups).map(function (k) { return groups[k]; }).sort(function (a, b) { return b.n - a.n || a.cat.localeCompare(b.cat); });
    catList.innerHTML = rows.map(function (g, n) {
      return '<li data-reveal style="--d:' + (n * 0.05) + 's"><a href="' + g.page + "?cat=" + encodeURIComponent(g.cat) + '" data-preview="' + esc(g.preview) + '">' +
        '<span class="label">' + pad(n + 1, 2) + '</span><span class="name">' + esc(g.cat) + '</span><span class="label ty">' + esc(g.type) + 's</span><span class="c">' + pad(g.n, 2) + "</span></a></li>";
    }).join("");
    DS.hoverPreview(catList, "[data-preview]");
  }

  /* ---------- 5. Recently filed shelf (horizontal) ---------- */
  var shelf = $("#shelf");
  if (shelf) {
    shelf.innerHTML = items.slice(0, 10).map(function (it) { return DS.plate(it, { showType: true, fixed: true }); }).join("");
    var counter = $("#shelf-n");
    function upd() {
      var max = shelf.scrollWidth - shelf.clientWidth;
      var p = max > 0 ? shelf.scrollLeft / max : 0;
      var n = Math.min(items.length, Math.round(p * (Math.min(items.length, 10) - 1)) + 1);
      if (counter) counter.textContent = pad(n, 2) + " / " + pad(Math.min(items.length, 10), 2);
    }
    shelf.addEventListener("scroll", upd, { passive: true }); upd();
    $all("[data-shelf]").forEach(function (b) {
      b.addEventListener("click", function () { shelf.scrollBy({ left: (b.getAttribute("data-shelf") === "next" ? 1 : -1) * shelf.clientWidth * 0.8, behavior: "smooth" }); });
    });
    // Drag to scroll with a mouse
    var down = false, sx = 0, sl = 0, moved = false;
    shelf.addEventListener("pointerdown", function (e) { if (e.pointerType !== "mouse") return; down = true; moved = false; sx = e.clientX; sl = shelf.scrollLeft; });
    window.addEventListener("pointermove", function (e) {
      if (!down) return;
      if (Math.abs(e.clientX - sx) > 5) { moved = true; shelf.classList.add("is-drag"); }
      shelf.scrollLeft = sl - (e.clientX - sx);
    });
    window.addEventListener("pointerup", function () { down = false; setTimeout(function () { shelf.classList.remove("is-drag"); }, 0); });
    shelf.addEventListener("click", function (e) { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; } }, true);
  }

  /* ---------- 6. Icon specimen ---------- */
  var cells = $("#spec-cells"), focus = $("#spec-focus");
  if (!icons.length) {                       // no icons yet: hide the specimen section
    var spec = cells && cells.closest(".specimen"); if (spec) spec.hidden = true;
  } else if (cells && focus) {
    var sample = icons.slice(0, 12);
    cells.innerHTML = sample.map(function (ic, n) {
      return '<a href="icons.html#' + esc(ic.id) + '" data-i="' + n + '" aria-label="' + esc(ic.name) + '"><span class="n">' + pad(n + 1, 2) + '</span><span class="g"></span></a>';
    }).join("");
    $all("a", cells).forEach(function (a, n) { DS.glyph($(".g", a), sample[n]); });
    function show(n) {
      var ic = sample[n]; if (!ic || !focus.offsetParent) return;
      $all("a", cells).forEach(function (a, i) { a.classList.toggle("is-on", i === n); });
      DS.glyph($(".glyph", focus), ic);
      $(".nm", focus).textContent = ic.name;
      $(".no", focus).textContent = ic.no;
      $(".ct", focus).textContent = ic.category;
    }
    cells.addEventListener("mouseover", function (e) { var a = e.target.closest("[data-i]"); if (a) show(+a.getAttribute("data-i")); });
    cells.addEventListener("focusin", function (e) { var a = e.target.closest("[data-i]"); if (a) show(+a.getAttribute("data-i")); });
    show(0);
  }

  /* ---------- 7. Services & prices ---------- */
  var svc = $("#svc-grid"), services = (DS.site.services || []).filter(function (x) { return x && x.name; });
  if (svc && services.length) {
    var wa = String(DS.site.whatsapp || "").replace(/\D/g, "");
    svc.innerHTML = services.map(function (x, n) {
      var msg = "Hi Draft Studio, I'd like to order a " + x.name.toLowerCase() + (x.price ? " (from " + x.price + ")" : "") + ". Here's a bit about my project: ";
      var href = wa ? "https://wa.me/" + wa + "?text=" + encodeURIComponent(msg) : (DS.site.email ? "mailto:" + DS.site.email + "?subject=" + encodeURIComponent(x.name) : "");
      return '<article class="svc' + (x.featured ? " is-featured" : "") + '" data-reveal>' +
        '<div class="svc-top"><span class="label">' + pad(n + 1, 2) + "</span>" + (x.featured ? '<span class="label svc-tag">Most complete</span>' : "") + "</div>" +
        '<h3 class="svc-name">' + esc(x.name) + "</h3>" +
        (x.price ? '<p class="svc-price"><span class="label">From</span> ' + esc(x.price) + "</p>" : '<p class="svc-price"><span class="label">Price</span> On request</p>') +
        (x.text ? '<p class="svc-text">' + esc(x.text) + "</p>" : "") +
        (x.includes && x.includes.length ? '<ul class="svc-inc">' + x.includes.map(function (i) { return "<li>" + esc(i) + "</li>"; }).join("") + "</ul>" : "") +
        (href ? '<a class="btn' + (x.featured ? " btn-signal" : "") + ' svc-btn" href="' + esc(href) + '" target="_blank" rel="noopener" aria-label="Order ' + esc(x.name) + ' on WhatsApp">' +
          '<svg class="wa-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>Order on WhatsApp</a>' : "") +
        "</article>";
    }).join("");
    $("#services").hidden = false;
  }

  /* ---------- 8. Studio / creator ---------- */
  var st = $("#creator-stats");
  if (st) {
    var mine = items; // every design in the archive is the studio's own
    var fmts = DS.uniq([].concat.apply([], mine.map(function (i) { return i.formats; })));
    st.innerHTML = "<div><b>" + pad(mine.length, 2) + '</b><span class="label">Records</span></div><div><b>' + pad(icons.length, 2) + '</b><span class="label">Icons</span></div><div><b>' + pad(fmts.length, 2) + '</b><span class="label">Formats</span></div>';
  }
})();
