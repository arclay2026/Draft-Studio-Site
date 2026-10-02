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
          (it.tryOn ? '<a class="btn btn-sm" href="#try" id="to-jump">' + DS.icon.up + " Try with your logo</a>" : "") +
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

    (it.tryOn ? tryOnHtml() : "") +

    '<nav class="pager" aria-label="Neighbouring records">' +
      (prev ? '<a href="' + prev.url + '"><span class="label">← Previous · ' + prev.no + '</span><span class="t">' + esc(prev.title) + "</span></a>" : "<span></span>") +
      (next ? '<a href="' + next.url + '"><span class="label">Next · ' + next.no + ' →</span><span class="t">' + esc(next.title) + "</span></a>" : "<span></span>") +
    "</nav>" +

    (related.length ? '<section class="section"><div class="folio"><span class="label label-ink">§ Related</span><span class="label">More from the archive</span><span class="rule"></span><span class="label folio-note">' + DS.pad(related.length, 2) + " records</span></div>" +
      '<div class="sect-head"><h2 class="h2">Also filed <em class="s">nearby</em></h2></div>' +
      '<div class="shelf" tabindex="0" aria-label="Related designs">' + related.map(function (r) { return DS.plate(r, { showType: true, fixed: true }); }).join("") + "</div></section>" : "");

  function tryOnHtml() {
    var a = it.tryOn.area || [30, 35, 40, 30];
    var garment = /hoodie/i.test(it.title) ? "hoodie" : /shirt|tee/i.test(it.title) ? "T-shirt" : "mockup";
    return '<section class="section tryon" id="try" aria-labelledby="to-title">' +
      '<div class="folio"><span class="label label-ink">§ Try it</span><span class="label">Live preview</span><span class="rule"></span><span class="label folio-note">Stays on your device</span></div>' +
      '<div class="sect-head"><h2 class="h2" id="to-title">Try it with <em class="s">your logo</em></h2></div>' +
      '<div class="tryon-grid">' +
        '<div class="tryon-stage" id="to-stage">' +
          '<div class="to-frame"><img class="to-base" src="' + esc(it.tryOn.image) + '" alt="' + esc(it.title) + ' with an empty print area">' +
          '<div class="to-area" id="to-area" style="left:' + a[0] + "%;top:" + a[1] + "%;width:" + a[2] + "%;height:" + a[3] + '%">' +
            '<span class="to-hint" id="to-hint" aria-hidden="true">Your logo here</span>' +
            '<div class="to-art" id="to-art" tabindex="0" role="img" aria-label="Your logo. Drag, or use the arrow keys, to move it" hidden></div>' +
          "</div></div>" +
          '<p class="to-drop" aria-hidden="true">Drop your logo</p>' +
        "</div>" +
        '<div class="tryon-panel">' +
          '<p class="lede">Upload your logo and see it printed on the ' + garment + '. White backgrounds disappear automatically, and the fabric folds show through.</p>' +
          '<label class="btn btn-signal to-upload">' + DS.icon.up + ' <span id="to-up-t">Upload your logo</span><input type="file" id="to-file" class="sr-only" accept="image/png,image/svg+xml,image/jpeg,image/webp"></label>' +
          '<p class="label to-types">PNG with a transparent background works best · SVG · JPG</p>' +
          '<div class="to-controls" id="to-controls" hidden>' +
            '<label class="field"><span>Size</span><input type="range" id="to-size" min="15" max="100" value="55" data-unit="%"></label>' +
            '<div class="field"><span id="to-ink-k">Print colour</span><div class="to-ink" role="radiogroup" aria-labelledby="to-ink-k">' +
              '<button type="button" role="radio" aria-checked="true" data-ink="orig">Original</button>' +
              '<button type="button" role="radio" aria-checked="false" data-ink="one">One colour</button>' +
              '<label class="to-ink-c" id="to-ink-c" hidden><span class="sr-only">Print colour</span><input type="color" id="to-color" value="#111111"></label>' +
            "</div></div>" +
            '<div class="btn-row"><button type="button" class="btn btn-sm" id="to-center">Centre it</button><button type="button" class="btn btn-sm" id="to-dl">' + DS.icon.down + ' Save preview</button><button type="button" class="btn btn-sm" id="to-clear">Remove</button></div>' +
          "</div>" +
          '<p class="to-note">This is a quick preview. For the full-quality result, <a class="link" href="#record-top" id="to-psd">download the PSD</a> and place your logo in the smart object.</p>' +
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

  if (it.tryOn) tryOn();
  function tryOn() {
    var stage = $("#to-stage"), area = $("#to-area"), art = $("#to-art"), hint = $("#to-hint"), file = $("#to-file");
    var controls = $("#to-controls"), size = $("#to-size"), color = $("#to-color"), inkC = $("#to-ink-c");
    var st = { url: "", img: null, cx: .5, cy: .5, size: .55, ink: "orig", name: "logo" };

    function draw() {
      art.hidden = !st.url; hint.hidden = !!st.url; controls.hidden = !st.url;
      $("#to-up-t").textContent = st.url ? "Use a different logo" : "Upload your logo";
      if (!st.url) { art.innerHTML = ""; return; }
      var r = st.img.naturalHeight / st.img.naturalWidth || 1;
      var ar = area.offsetWidth / Math.max(1, area.offsetHeight);
      art.style.cssText = "left:" + st.cx * 100 + "%;top:" + st.cy * 100 + "%;width:" + st.size * 100 + "%;height:" + st.size * r * ar * 100 + "%";
      var one = st.ink === "one";
      art.innerHTML = one ? '<span class="to-mask" style="background:' + color.value + ";-webkit-mask-image:url(" + st.url + ");mask-image:url(" + st.url + ')"></span>'
                          : '<img src="' + st.url + '" alt="">';
    }
    function load(f) {
      if (!f || !/^image\//.test(f.type)) { DS.toast("Please choose an image file (PNG, SVG or JPG)"); return; }
      var url = URL.createObjectURL(f), img = new Image();
      img.onload = function () {
        if (st.url) URL.revokeObjectURL(st.url);
        if (!img.naturalWidth) { img.width = 400; img.height = 400; }   // SVG without a size
        st.url = url; st.img = img; st.name = f.name.replace(/\.[^.]+$/, "") || "logo";
        st.cx = .5; st.cy = .45; draw();
        if (window.matchMedia("(hover: hover)").matches) art.focus({ preventScroll: true });
      };
      img.onerror = function () { DS.toast("That image could not be opened"); URL.revokeObjectURL(url); };
      img.src = url;
    }
    file.addEventListener("change", function () { load(file.files[0]); file.value = ""; });
    ["dragenter", "dragover"].forEach(function (t) { stage.addEventListener(t, function (e) { e.preventDefault(); stage.classList.add("is-drop"); }); });
    ["dragleave", "drop"].forEach(function (t) { stage.addEventListener(t, function () { stage.classList.remove("is-drop"); }); });
    stage.addEventListener("drop", function (e) { e.preventDefault(); load(e.dataTransfer.files[0]); });

    // Move: drag with mouse or finger, or arrow keys
    art.addEventListener("pointerdown", function (e) {
      e.preventDefault(); art.setPointerCapture(e.pointerId); art.classList.add("is-drag");
      var b = area.getBoundingClientRect(), sx = e.clientX, sy = e.clientY, cx = st.cx, cy = st.cy;
      art.onpointermove = function (ev) {
        st.cx = Math.min(1, Math.max(0, cx + (ev.clientX - sx) / b.width));
        st.cy = Math.min(1, Math.max(0, cy + (ev.clientY - sy) / b.height)); draw();
      };
      art.onpointerup = art.onpointercancel = function () { art.onpointermove = null; art.classList.remove("is-drag"); };
    });
    art.addEventListener("keydown", function (e) {
      var d = e.shiftKey ? .05 : .01, k = e.key;
      if (k === "ArrowLeft") st.cx -= d; else if (k === "ArrowRight") st.cx += d;
      else if (k === "ArrowUp") st.cy -= d; else if (k === "ArrowDown") st.cy += d;
      else if (k === "+" || k === "=") st.size = Math.min(1, st.size + .03); else if (k === "-") st.size = Math.max(.15, st.size - .03);
      else return;
      e.preventDefault(); st.cx = Math.min(1, Math.max(0, st.cx)); st.cy = Math.min(1, Math.max(0, st.cy));
      size.value = Math.round(st.size * 100); size.dispatchEvent(new Event("input")); draw();
    });
    size.addEventListener("input", function () { st.size = size.value / 100; draw(); });
    DS.$all(".to-ink button").forEach(function (b) {
      b.addEventListener("click", function () {
        st.ink = b.getAttribute("data-ink");
        DS.$all(".to-ink button").forEach(function (x) { x.setAttribute("aria-checked", x === b); });
        inkC.hidden = st.ink !== "one"; draw();
      });
    });
    color.addEventListener("input", draw);
    $("#to-center").addEventListener("click", function () { st.cx = .5; st.cy = .5; draw(); });
    $("#to-clear").addEventListener("click", function () { URL.revokeObjectURL(st.url); st.url = ""; st.img = null; draw(); });
    window.addEventListener("resize", function () { if (st.url) draw(); });

    // "Download the PSD" jumps back up to the download buttons
    $("#to-psd").addEventListener("click", function (e) { e.preventDefault(); var d = $(".spec .dl-row, .spec .dl-box, .spec .req-notice"); (d || $(".spec")).scrollIntoView({ behavior: "smooth", block: "center" }); });

    // Save the preview as a PNG (drawn at the mockup's full size)
    $("#to-dl").addEventListener("click", function () {
      var base = $(".to-base", stage), W = base.naturalWidth, H = base.naturalHeight, a = it.tryOn.area;
      var c = document.createElement("canvas"); c.width = W; c.height = H; var g = c.getContext("2d");
      g.drawImage(base, 0, 0, W, H);
      var ax = a[0] / 100 * W, ay = a[1] / 100 * H, aw = a[2] / 100 * W, ah = a[3] / 100 * H;
      var lw = st.size * aw, lh = lw * (st.img.naturalHeight / st.img.naturalWidth || 1);
      var lx = ax + st.cx * aw - lw / 2, ly = ay + st.cy * ah - lh / 2;
      var art2 = document.createElement("canvas"); art2.width = Math.max(1, Math.round(lw)); art2.height = Math.max(1, Math.round(lh));
      var g2 = art2.getContext("2d"); g2.drawImage(st.img, 0, 0, art2.width, art2.height);
      if (st.ink === "one") { g2.globalCompositeOperation = "source-in"; g2.fillStyle = color.value; g2.fillRect(0, 0, art2.width, art2.height); }
      g.save(); g.beginPath(); g.rect(ax, ay, aw, ah); g.clip();
      g.globalCompositeOperation = "multiply"; g.globalAlpha = .96; g.drawImage(art2, lx, ly, lw, lh); g.restore();
      g.font = "500 " + Math.round(W / 60) + "px 'JetBrains Mono', monospace"; g.fillStyle = "rgba(17,17,17,.55)"; g.textAlign = "right";
      g.fillText("Preview · Draft Studio", W - W / 40, H - W / 40);
      c.toBlob(function (blob) {
        var u = URL.createObjectURL(blob), l = document.createElement("a");
        l.href = u; l.download = st.name + "-on-" + it.id + ".png"; document.body.appendChild(l); l.click(); l.remove();
        setTimeout(function () { URL.revokeObjectURL(u); }, 4000); DS.toast("Preview saved");
      }, "image/png");
    });
    draw();
  }

  $("#share-btn").addEventListener("click", function () { DS.copy(location.href, "Link copied"); });
  var sb = $("#save-btn");
  function saveLabel() { sb.querySelector("span").textContent = DS.saved.has(it.id) ? "Saved" : "Save"; }
  sb.addEventListener("click", function () { setTimeout(saveLabel, 0); });
  saveLabel();
})();
