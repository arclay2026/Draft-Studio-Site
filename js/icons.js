/* Draft Studio — icon specimen sheet + inspector (icons.html) */
(function () {
  "use strict";
  var DS = window.DS, $ = DS.$, $all = DS.$all, esc = DS.esc, pad = DS.pad;
  var all = DS.icons;
  var params = new URLSearchParams(location.search);
  var state = { q: params.get("q") || "", cat: params.get("cat") || "" };

  var grid = $("#cells"), meta = $("#r-count"), find = $("#f-q"), catSel = $("#f-cat");
  var colorIn = $("#icon-color"), sizeIn = $("#icon-size");
  var insp = $("#inspector"), mColor = $("#m-color"), mHex = $("#m-hex"), mSize = $("#m-size"), code = $("#m-code");
  var initialHash = decodeURIComponent(location.hash.slice(1));
  var current = null, raw = null;

  var ink = function () { return document.documentElement.getAttribute("data-theme") === "dark" ? "#f4f3ef" : "#111111"; };
  colorIn.value = ink(); mColor.value = ink(); mHex.textContent = mColor.value;
  find.value = state.q;
  DS.uniq(all.map(function (i) { return i.category; })).sort().forEach(function (c) {
    catSel.insertAdjacentHTML("beforeend", '<option value="' + esc(c) + '">' + esc(c) + "</option>");
  });
  catSel.value = state.cat;

  function look() {
    grid.style.setProperty("--icon-color", colorIn.value);
    grid.style.setProperty("--icon-size", sizeIn.value + "px");
  }
  colorIn.addEventListener("input", function () { look(); mColor.value = colorIn.value; syncColor(); });
  sizeIn.addEventListener("input", look);
  look();

  function render() {
    var list = all.filter(function (i) { return DS.matches(i, state.q) && (!state.cat || i.category === state.cat); });
    grid.innerHTML = list.length ? list.map(function (ic, n) {
      return '<button class="icon-cell" style="--i:' + n + '" data-id="' + esc(ic.id) + '" aria-pressed="false" aria-label="' + esc(ic.name) + '">' +
        '<span class="n">' + ic.no.replace("IC–", "") + '</span><span class="g"></span><span class="nm">' + esc(ic.name) + "</span></button>";
    }).join("") : '<div class="empty" style="grid-column:1/-1"><p class="label">' + (all.length ? "No results" : "Coming soon") + '</p><p class="h2">' +
      (all.length ? 'No icons match. <em class="s">Try another word.</em>' : 'Icons are <em class="s">on the way.</em>') + "</p></div>";
    insp.hidden = !all.length;
    grid.classList.toggle("is-empty", !list.length);
    $all(".icon-cell", grid).forEach(function (b) {
      var ic = all.filter(function (i) { return i.id === b.getAttribute("data-id"); })[0];
      DS.glyph($(".g", b), ic);
    });
    mark();
    meta.textContent = "Showing " + pad(list.length, 2) + " of " + pad(all.length, 2);
    var p = new URLSearchParams();
    if (state.q) p.set("q", state.q);
    if (state.cat) p.set("cat", state.cat);
    var qs = p.toString();
    history.replaceState(null, "", location.pathname + (qs ? "?" + qs : "") + (current ? "#" + current.id : ""));
  }
  function mark() {
    $all(".icon-cell", grid).forEach(function (b) { b.setAttribute("aria-pressed", !!current && b.getAttribute("data-id") === current.id); });
  }

  function currentSvg() { return raw ? raw.replace(/currentColor/g, mColor.value).trim() : ""; }
  function syncColor() {
    mHex.textContent = mColor.value;
    $(".stage", insp).style.setProperty("--icon-color", mColor.value);
    if (raw) code.value = currentSvg();
  }

  function select(ic, openSheet) {
    current = ic; raw = null; mark();
    $("#m-no").textContent = ic.no + " · " + ic.category;
    $("#m-name").textContent = ic.name;
    $("#m-tags").textContent = ic.tags.length ? "#" + ic.tags.join("  #") : "";
    DS.glyph($(".stage .g", insp), ic);
    code.value = "Loading…";
    DS.loadSvg(ic.file).then(function (svg) {
      if (current !== ic) return;
      raw = svg;
      code.value = svg ? currentSvg() : "SVG code preview needs the site to be served from a web server (e.g. GitHub Pages).";
    });
    syncColor();
    history.replaceState(null, "", location.pathname + location.search + "#" + ic.id);
    if (openSheet) insp.classList.add("is-open");
  }

  grid.addEventListener("click", function (e) {
    var b = e.target.closest(".icon-cell"); if (!b) return;
    var ic = all.filter(function (i) { return i.id === b.getAttribute("data-id"); })[0];
    if (ic) select(ic, true);
  });
  $("#sheet-close").addEventListener("click", function () { insp.classList.remove("is-open"); });
  mColor.addEventListener("input", syncColor);
  find.addEventListener("input", function () { state.q = find.value.trim(); render(); });
  catSel.addEventListener("change", function () { state.cat = catSel.value; render(); });

  insp.addEventListener("click", function (e) {
    var b = e.target.closest("[data-act]"); if (!b || !current) return;
    var act = b.getAttribute("data-act");
    if (!raw) { window.open(current.file, "_blank"); return; }
    b.classList.remove("is-done"); void b.offsetWidth; b.classList.add("is-done");
    if (act === "copy") DS.copy(currentSvg(), "SVG code copied");
    if (act === "svg") { DS.saveBlob(new Blob([currentSvg()], { type: "image/svg+xml" }), current.id + ".svg"); DS.toast("Downloading " + current.id + ".svg"); }
    if (act === "png") {
      var size = parseInt(mSize.value, 10), img = new Image();
      var svg = currentSvg().replace(/<svg\b([^>]*)>/, function (m, a) {
        return "<svg" + a.replace(/\s(width|height)="[^"]*"/g, "") + ' width="' + size + '" height="' + size + '">';
      });
      img.onload = function () {
        var cv = document.createElement("canvas"); cv.width = cv.height = size;
        cv.getContext("2d").drawImage(img, 0, 0, size, size);
        cv.toBlob(function (bl) { DS.saveBlob(bl, current.id + "-" + size + ".png"); DS.toast("Downloading " + current.id + "-" + size + ".png"); });
      };
      img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
    }
  });

  current = all.filter(function (i) { return i.id === initialHash; })[0] || null;
  render();
  var fromHash = all.filter(function (i) { return i.id === initialHash; })[0];
  if (fromHash) select(fromHash, true);
  else if (all[0] && window.matchMedia("(min-width: 1024px)").matches) select(all[0], false);
})();
