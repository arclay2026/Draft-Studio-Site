/* Draft Studio — branded QR code maker (qr.html, desktop only)
   QR encoding: js/vendor/qrcode.js (qrcode-generator, MIT). Everything runs
   in the browser; uploaded logos never leave the visitor's computer.        */
(function () {
  "use strict";
  var DS = window.DS, $ = DS.$, $all = DS.$all;
  if (!window.qrcode) return;
  if (qrcode.stringToBytesFuncs && qrcode.stringToBytesFuncs["UTF-8"]) qrcode.stringToBytes = qrcode.stringToBytesFuncs["UTF-8"];

  var el = {
    type: $("#qr-type"), fields: $all("[data-for]"), url: $("#qr-url"), waNum: $("#qr-wa-num"), waMsg: $("#qr-wa-msg"),
    ig: $("#qr-ig"), text: $("#qr-text"), fg: $("#qr-fg"), bg: $("#qr-bg"), dots: $("#qr-dots"), eyes: $("#qr-eyes"),
    logo: $("#qr-logo"), logoName: $("#qr-logo-name"), logoClear: $("#qr-logo-clear"), useMark: $("#qr-use-mark"),
    out: $("#qr-out"), warn: $("#qr-warn"), data: $("#qr-data"), png: $("#qr-png"), svg: $("#qr-svg"), size: $("#qr-size")
  };
  var logoSrc = "", logoImg = null;

  function payload() {
    var t = el.type.value;
    if (t === "whatsapp") {
      var n = el.waNum.value.replace(/\D/g, "");
      if (!n) return "";
      return "https://wa.me/" + n + (el.waMsg.value.trim() ? "?text=" + encodeURIComponent(el.waMsg.value.trim()) : "");
    }
    if (t === "instagram") { var u = el.ig.value.trim().replace(/^@/, "").replace(/^https?:\/\/(www\.)?instagram\.com\//i, "").replace(/\/.*$/, ""); return u ? "https://instagram.com/" + u : ""; }
    if (t === "text") return el.text.value.trim();
    var url = el.url.value.trim();
    if (url && !/^[a-z]+:/i.test(url)) url = "https://" + url;
    return url;
  }

  /* colour contrast (scanners need dark-on-light with enough difference) */
  function lum(h) {
    h = h.replace("#", ""); return [0, 2, 4].map(function (i) { var v = parseInt(h.substr(i, 2), 16) / 255; return v <= .03928 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4); })
      .reduce(function (a, v, i) { return a + v * [.2126, .7152, .0722][i]; }, 0);
  }
  function ratio(a, b) { var x = lum(a), y = lum(b); return (Math.max(x, y) + .05) / (Math.min(x, y) + .05); }

  /* build the QR as SVG (crisp at any size) */
  function build() {
    var fh = $("#qr-fg-hex"), bh = $("#qr-bg-hex"); if (fh) fh.textContent = el.fg.value.toUpperCase(); if (bh) bh.textContent = el.bg.value.toUpperCase();
    var text = payload();
    if (!text) { el.out.innerHTML = '<p class="qr-empty">Fill in the details to see your QR code.</p>'; el.data.textContent = ""; toggleDl(false); el.warn.hidden = true; return null; }
    var qr = qrcode(0, logoSrc ? "H" : "M"); qr.addData(text); qr.make();
    var n = qr.getModuleCount(), q = 4, size = n + q * 2, fg = el.fg.value, bg = el.bg.value, dots = el.dots.value, eyes = el.eyes.value;
    function inEye(r, c) { return (r < 7 && c < 7) || (r < 7 && c >= n - 7) || (r >= n - 7 && c < 7); }
    var hole = 0;
    if (logoSrc) { hole = Math.round(n * .22); if (hole % 2 !== n % 2) hole++; }
    var h0 = (n - hole) / 2, h1 = h0 + hole;
    function on(r, c) {
      if (r < 0 || c < 0 || r >= n || c >= n || !qr.isDark(r, c) || inEye(r, c)) return false;
      return !(hole && r >= h0 - .5 && r < h1 + .5 && c >= h0 - .5 && c < h1 + .5);
    }
    // Dots touch their neighbours (scanners need that); only the outside
    // corners of each shape are rounded — the same trick pro QR tools use.
    var rad = dots === "dots" ? .5 : dots === "rounded" ? .32 : 0, d = "";
    for (var r = 0; r < n; r++) for (var c = 0; c < n; c++) {
      if (!on(r, c)) continue;
      var x = c + q, y = r + q;
      if (!rad) { d += "M" + x + " " + y + "h1v1h-1z"; continue; }
      var up = on(r - 1, c), dn = on(r + 1, c), lf = on(r, c - 1), rt = on(r, c + 1);
      var tl = !up && !lf ? rad : 0, tr = !up && !rt ? rad : 0, br = !dn && !rt ? rad : 0, bl = !dn && !lf ? rad : 0;
      d += "M" + (x + tl) + " " + y + "H" + (x + 1 - tr) + (tr ? "A" + tr + " " + tr + " 0 0 1 " + (x + 1) + " " + (y + tr) : "") +
           "V" + (y + 1 - br) + (br ? "A" + br + " " + br + " 0 0 1 " + (x + 1 - br) + " " + (y + 1) : "") +
           "H" + (x + bl) + (bl ? "A" + bl + " " + bl + " 0 0 1 " + x + " " + (y + 1 - bl) : "") +
           "V" + (y + tl) + (tl ? "A" + tl + " " + tl + " 0 0 1 " + (x + tl) + " " + y : "") + "Z";
    }
    var body = '<path d="' + d + '"/>';
    function eye(x, y) {
      var R = eyes === "round" ? [2.2, 1.5, 1.1] : eyes === "soft" ? [1.6, 1, .7] : [0, 0, 0];
      return '<rect x="' + (x + .5) + '" y="' + (y + .5) + '" width="6" height="6" rx="' + R[0] + '" fill="none" stroke="' + fg + '" stroke-width="1"/>' +
             '<rect x="' + (x + 2) + '" y="' + (y + 2) + '" width="3" height="3" rx="' + R[2] + '"/>';
    }
    body += eye(q, q) + eye(q + n - 7, q) + eye(q, q + n - 7);
    var logo = "";
    if (logoSrc) {
      var pad = .9, lx = q + h0 + pad, lw = hole - pad * 2;
      logo = '<rect x="' + (q + h0) + '" y="' + (q + h0) + '" width="' + hole + '" height="' + hole + '" rx="' + (hole * .22) + '" fill="' + bg + '"/>' +
             '<image href="' + logoSrc + '" x="' + lx + '" y="' + lx + '" width="' + lw + '" height="' + lw + '" preserveAspectRatio="xMidYMid meet"/>';
    }
    var svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + size + " " + size + '" shape-rendering="' + (dots === "square" ? "crispEdges" : "geometricPrecision") + '">' +
      '<rect width="' + size + '" height="' + size + '" fill="' + bg + '"/><g fill="' + fg + '">' + body + "</g>" + logo + "</svg>";
    el.out.innerHTML = svg;
    el.data.textContent = text;
    var cr = ratio(fg, bg), inverted = lum(fg) > lum(bg);
    el.warn.hidden = !(cr < 4 || inverted);
    el.warn.textContent = inverted ? "Light dots on a dark background don’t scan on many phones. Use a darker dot colour than the background."
                                   : "These colours are too close. Some phones may not scan it. Make the dots darker or the background lighter.";
    toggleDl(true);
    return { svg: svg, size: size };
  }
  function toggleDl(on) { el.png.disabled = el.svg.disabled = !on; }

  function fileName(ext) { return "qr-" + (el.type.value) + "." + ext; }
  el.svg.addEventListener("click", function () {
    var r = build(); if (!r) return;
    DS.saveBlob(new Blob([r.svg], { type: "image/svg+xml" }), fileName("svg")); DS.toast("Saved " + fileName("svg"));
  });
  el.png.addEventListener("click", function () {
    var r = build(); if (!r) return;
    var px = +el.size.value || 1024, img = new Image();
    img.onload = function () {
      var cv = document.createElement("canvas"); cv.width = cv.height = px;
      var x = cv.getContext("2d"); x.imageSmoothingEnabled = el.dots.value !== "square"; x.drawImage(img, 0, 0, px, px);
      cv.toBlob(function (b) { DS.saveBlob(b, fileName("png")); DS.toast("Saved " + px + " px PNG"); });
    };
    img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(r.svg);
  });

  /* logo: upload, or use the Draft Studio mark */
  function setLogo(src, name) { logoSrc = src; el.logoName.textContent = name || "No logo"; el.logoClear.hidden = !src; build(); }
  el.logo.addEventListener("change", function () {
    var f = el.logo.files[0]; if (!f) return;
    if (f.size > 2e6) { DS.toast("Please use an image under 2 MB"); el.logo.value = ""; return; }
    var rd = new FileReader(); rd.onload = function () { setLogo(rd.result, f.name); }; rd.readAsDataURL(f);
  });
  el.logoClear.addEventListener("click", function () { el.logo.value = ""; setLogo("", ""); });
  el.useMark.addEventListener("click", function () {
    fetch("assets/logo-mark.svg").then(function (r) { return r.text(); }).then(function (t) {
      setLogo("data:image/svg+xml;charset=utf-8," + encodeURIComponent(t), "Draft Studio mark");
    });
  });

  /* show the fields for the chosen type */
  function showFields() { el.fields.forEach(function (f) { f.hidden = f.getAttribute("data-for") !== el.type.value; }); build(); }
  el.type.addEventListener("change", showFields);
  [el.url, el.waNum, el.waMsg, el.ig, el.text, el.fg, el.bg, el.dots, el.eyes].forEach(function (i) { i.addEventListener("input", build); i.addEventListener("change", build); });
  $all("[data-preset]").forEach(function (b) {
    b.addEventListener("click", function () {
      var p = b.getAttribute("data-preset").split(","); el.fg.value = p[0]; el.bg.value = p[1];
      [el.fg, el.bg].forEach(function (i) { i.dispatchEvent(new Event("input", { bubbles: true })); });
      build();
    });
  });

  // start with a working example: a link to this site
  el.type.value = "link"; el.url.value = DS.site.url || location.origin;
  showFields();
})();
