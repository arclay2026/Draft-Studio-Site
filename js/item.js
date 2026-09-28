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

    '<nav class="pager" aria-label="Neighbouring records">' +
      (prev ? '<a href="' + prev.url + '"><span class="label">← Previous · ' + prev.no + '</span><span class="t">' + esc(prev.title) + "</span></a>" : "<span></span>") +
      (next ? '<a href="' + next.url + '"><span class="label">Next · ' + next.no + ' →</span><span class="t">' + esc(next.title) + "</span></a>" : "<span></span>") +
    "</nav>" +

    (related.length ? '<section class="section"><div class="folio"><span class="label label-ink">§ Related</span><span class="label">More from the archive</span><span class="rule"></span><span class="label folio-note">' + DS.pad(related.length, 2) + " records</span></div>" +
      '<div class="sect-head"><h2 class="h2">Also filed <em class="s">nearby</em></h2></div>' +
      '<div class="shelf" tabindex="0" aria-label="Related designs">' + related.map(function (r) { return DS.plate(r, { showType: true, fixed: true }); }).join("") + "</div></section>" : "");

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

  $("#share-btn").addEventListener("click", function () { DS.copy(location.href, "Link copied"); });
  var sb = $("#save-btn");
  function saveLabel() { sb.querySelector("span").textContent = DS.saved.has(it.id) ? "Saved" : "Save"; }
  sb.addEventListener("click", function () { setTimeout(saveLabel, 0); });
  saveLabel();
})();
