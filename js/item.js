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
    '<nav class="crumbs label" aria-label="Breadcrumb"><span><a href="index.html">Archive</a><span class="sep">/</span><a href="' + it.page + '">' + esc(it.typeLabel) + 's</a><span class="sep">/</span><a href="' + it.page + "?cat=" + encodeURIComponent(it.category) + '">' + esc(it.category) + '</a><span class="sep">/</span><span class="label-ink">' + it.no + "</span></span>" +
    "<span>" + (prev ? '<a href="' + prev.url + '">← ' + prev.no + "</a>" : "") + (prev && next ? '<span class="sep">·</span>' : "") + (next ? '<a href="' + next.url + '">' + next.no + " →</a>" : "") + "</span></nav>" +

    '<section class="record">' +
      '<div class="lighttable" id="lt">' +
        (it.preview ? '<img class="plate-hero-vt" src="' + esc(it.preview) + '" alt="' + esc(it.title) + '">' : '<p class="label">No preview available</p>') +
        '<span class="crops" aria-hidden="true"></span><span class="reg t" aria-hidden="true"></span><span class="reg b" aria-hidden="true"></span>' +
        '<span class="lt-note label">' + (it.preview ? "Click artwork to zoom" : "") + "</span>" +
      "</div>" +
      '<aside class="spec">' +
        '<div class="label">' + it.no + " — " + esc(it.typeLabel) + "</div>" +
        "<h1>" + esc(it.title) + "</h1>" +
        (it.description ? '<p class="lede">' + esc(it.description) + "</p>" : "") +
        '<div><div class="label" style="margin-bottom:8px">Download — free</div>' + DS.downloads(it) + "</div>" +
        '<div style="display:flex;gap:8px;flex-wrap:wrap">' +
          '<button class="btn btn-sm" data-save="' + esc(it.id) + '" aria-pressed="false" id="save-btn">' + DS.icon.save.replace("<svg", '<svg width="15" height="15"') + ' <span>Save</span></button>' +
          '<button class="btn btn-sm" id="share-btn">' + DS.icon.link.replace("<svg", '<svg width="15" height="15"') + " Copy link</button>" +
          '<button class="btn btn-sm" data-quick="' + esc(it.id) + '">Quick look</button>' +
        "</div>" +
        '<dl class="spec-table">' +
          row("Catalogue", it.no) +
          row("Type", it.typeLabel) +
          row("Category", '<a class="link" href="' + it.page + "?cat=" + encodeURIComponent(it.category) + '">' + esc(it.category) + "</a>", true) +
          (it.dimensions ? row("Size", it.dimensions) : "") +
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

    (related.length ? '<section class="sect"><div class="folio"><span class="label label-ink">§ Related</span><span class="label">More from the archive</span><span class="rule"></span><span class="label folio-note">' + DS.pad(related.length, 2) + " records</span></div>" +
      '<div class="sect-head" style="margin-top:20px"><h2 class="h2">Also filed <em class="s">nearby</em></h2></div>' +
      '<div class="shelf-wrap"><div class="shelf">' + related.map(function (r) { return DS.plate(r, { showType: true }); }).join("") + "</div></div></section>" : "");

  function row(k, v, raw) { return "<div><dt>" + k + "</dt><dd>" + (raw ? v : esc(v)) + "</dd></div>"; }

  // Zoom on the light table
  var lt = $("#lt"), img = $("#lt img");
  if (img) lt.addEventListener("click", function () {
    lt.classList.toggle("is-zoom");
    $(".lt-note", lt).textContent = lt.classList.contains("is-zoom") ? "Click to fit · scroll to pan" : "Click artwork to zoom";
  });

  $("#share-btn").addEventListener("click", function () { DS.copy(location.href, "Link copied"); });
  var sb = $("#save-btn");
  function saveLabel() { sb.querySelector("span").textContent = DS.saved.has(it.id) ? "Saved" : "Save"; }
  sb.addEventListener("click", function () { setTimeout(saveLabel, 0); });
  saveLabel();
})();
