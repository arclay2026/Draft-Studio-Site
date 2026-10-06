/* Draft Studio — browsing (templates.html, logos.html) */
(function () {
  "use strict";
  var DS = window.DS, $ = DS.$, $all = DS.$all, esc = DS.esc, pad = DS.pad;
  var type = document.body.getAttribute("data-type");
  var all = DS.ofType(type);

  // Old share links (templates.html#id) now open the full record
  var hashId = decodeURIComponent(location.hash.slice(1));
  if (hashId && DS.byId(hashId)) { location.replace("item.html?id=" + encodeURIComponent(hashId)); return; }

  var params = new URLSearchParams(location.search);
  var state = {
    q: params.get("q") || "", cat: params.get("cat") || "", fmt: (params.get("fmt") || "").toUpperCase(),
    sort: params.get("sort") || "new", view: params.get("view") === "index" ? "index" : "plates"
  };

  var fmtSel = $("#f-fmt"), catSel = $("#f-cat"), sortSel = $("#f-sort"), find = $("#f-q"), reset = $("#f-reset");
  var out = $("#results"), meta = $("#r-count");

  DS.uniq([].concat.apply([], all.map(function (i) { return i.formats; }))).sort().forEach(function (f) {
    fmtSel.insertAdjacentHTML("beforeend", '<option value="' + esc(f) + '">' + esc(f) + " files</option>");
  });
  DS.uniq(all.map(function (i) { return i.category; })).sort().forEach(function (c) {
    catSel.insertAdjacentHTML("beforeend", '<option value="' + esc(c) + '">' + esc(c) + "</option>");
  });
  if (state.fmt && !$('option[value="' + state.fmt + '"]', fmtSel)) state.fmt = "";
  fmtSel.value = state.fmt; catSel.value = state.cat; sortSel.value = state.sort; find.value = state.q;

  function sizeSelect(sel) {
    // Let the inline select hug its current text, like a word in the sentence
    var probe = document.createElement("span");
    probe.style.cssText = "position:absolute;visibility:hidden;white-space:nowrap;font:inherit";
    probe.textContent = sel.options[sel.selectedIndex].text;
    sel.parentNode.appendChild(probe);
    sel.style.setProperty("--w", (probe.getBoundingClientRect().width + 26) + "px");
    probe.remove();
  }

  function render() {
    var list = all.filter(function (i) {
      return DS.matches(i, state.q) && (!state.cat || i.category === state.cat) && (!state.fmt || i.formats.indexOf(state.fmt) !== -1);
    });
    if (state.sort === "old") list.reverse();
    if (state.sort === "az") list.sort(function (a, b) { return a.title.localeCompare(b.title); });

    if (!list.length) {
      out.innerHTML = '<div class="empty"><p class="label">No records</p><p class="h2">' +
        (all.length ? 'Nothing filed under that. <em class="s">Try another word.</em>' : 'New work is <em class="s">on the way.</em>') + "</p></div>";
    } else if (state.view === "plates") {
      out.innerHTML = '<div class="tiles">' + list.map(function (it, n) { return DS.tile(it, { i: n }); }).join("") + "</div>";
    } else {
      out.innerHTML = '<div class="index-table" role="table">' +
        '<div class="index-row head label" role="row"><span></span><span>Title</span><span class="cat">Category</span><span class="fm">Formats</span><span class="date">Filed</span><span>Actions</span></div>' +
        list.map(function (it, n) {
          var f = DS.quickFile(it);
          return '<div class="index-row" role="row" style="--i:' + n + '" data-preview="' + esc(it.preview) + '">' +
            '<a class="thumb" href="' + it.url + '" data-plate-link tabindex="-1">' + (it.preview ? '<img src="' + esc(it.preview) + '" alt="" loading="lazy">' : "") + "</a>" +
            '<span><a class="t" href="' + it.url + '" data-plate-link>' + esc(it.title) + '</a><span class="sub label">' + esc(it.category) + "</span></span>" +
            '<span class="cat muted">' + esc(it.category) + "</span>" +
            '<span class="fm">' + DS.fmts(it.formats) + "</span>" +
            '<span class="date label">' + DS.fmtDate(it.date) + "</span>" +
            '<span class="acts"><button class="save" data-save="' + esc(it.id) + '" aria-pressed="false" aria-label="Save ' + esc(it.title) + '">' + DS.icon.save + "</button>" +
            (it.price ? (it.sold ? '<span class="dl-sq is-sold" aria-label="Sold">Sold</span>' : '<a class="dl-sq" href="' + esc(DS.buyUrl(it)) + '" target="_blank" rel="noopener" aria-label="Buy ' + esc(it.title) + " for " + esc(it.price) + ' on WhatsApp">' + DS.icon.wa + "</a>") : "") +
            (f ? '<a class="dl-sq" href="' + esc(f.path) + '"' + DS.dlAttrs(f.path) + ' data-dl aria-label="Download ' + esc(it.title) + (f.bundle ? " — all formats (ZIP)" : " as " + esc(String(f.format).toUpperCase())) + '">' + DS.icon.down + "</a>" : "") + "</span></div>";
        }).join("") + "</div>";
    }
    meta.textContent = "Showing " + pad(list.length, 2) + " of " + pad(all.length, 2);
    reset.hidden = !(state.q || state.cat || state.fmt || state.sort !== "new");
    $all(".viewtoggle button").forEach(function (b) { b.setAttribute("aria-pressed", b.getAttribute("data-view") === state.view); });
    [fmtSel, catSel, sortSel].forEach(sizeSelect);
    DS.syncSaved();

    var p = new URLSearchParams();
    if (state.q) p.set("q", state.q);
    if (state.cat) p.set("cat", state.cat);
    if (state.fmt) p.set("fmt", state.fmt);
    if (state.sort !== "new") p.set("sort", state.sort);
    if (state.view !== "plates") p.set("view", state.view);
    var qs = p.toString();
    history.replaceState(null, "", location.pathname + (qs ? "?" + qs : ""));
  }

  fmtSel.addEventListener("change", function () { state.fmt = fmtSel.value; render(); });
  catSel.addEventListener("change", function () { state.cat = catSel.value; render(); });
  sortSel.addEventListener("change", function () { state.sort = sortSel.value; render(); });
  find.addEventListener("input", function () { state.q = find.value.trim(); render(); });
  reset.addEventListener("click", function () {
    state = { q: "", cat: "", fmt: "", sort: "new", view: state.view };
    find.value = ""; fmtSel.value = ""; catSel.value = ""; sortSel.value = "new"; render();
  });
  $all(".viewtoggle button").forEach(function (b) {
    b.addEventListener("click", function () { state.view = b.getAttribute("data-view"); render(); });
  });
  DS.hoverPreview(out, ".index-row[data-preview]");
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { [fmtSel, catSel, sortSel].forEach(sizeSelect); });
  render();
})();
