/* Draft Studio — colour palettes (palettes.html)

   PALETTES: to add one, copy a line below and change the name, the five
   hex colours and the moods. Moods used by the filter buttons:
   Warm, Cool, Pastel, Earthy, Bold, Dark, Neutral.                        */
(function () {
  "use strict";
  var DS = window.DS, $ = DS.$, $all = DS.$all, esc = DS.esc, pad = DS.pad;

  var PALETTES = [
    { name: "Draft Studio",       colors: ["#111111", "#2E7A14", "#86DE4E", "#E8E6DF", "#F4F3EF"], moods: ["Bold", "Neutral"] },
    { name: "Lagos Market",       colors: ["#E63946", "#F4A261", "#E9C46A", "#2A9D8F", "#264653"], moods: ["Warm", "Bold"] },
    { name: "Joburg Dusk",        colors: ["#2B2D42", "#8D99AE", "#EDF2F4", "#EF233C", "#D90429"], moods: ["Cool", "Bold"] },
    { name: "Karoo Sand",         colors: ["#582F0E", "#7F5539", "#A68A64", "#C2A878", "#E6D5B8"], moods: ["Earthy", "Warm"] },
    { name: "Ocean Drive",        colors: ["#03045E", "#0077B6", "#00B4D8", "#90E0EF", "#CAF0F8"], moods: ["Cool"] },
    { name: "Peach Fuzz",         colors: ["#3D405B", "#E07A5F", "#FFBE98", "#FFD6BA", "#FFF1E6"], moods: ["Pastel", "Warm"] },
    { name: "Matcha Latte",       colors: ["#6C584C", "#A98467", "#ADC178", "#DDE5B6", "#F0EAD2"], moods: ["Earthy", "Pastel"] },
    { name: "Midnight Neon",      colors: ["#0D0D0D", "#1F1F1F", "#FF2E63", "#08D9D6", "#EAEAEA"], moods: ["Dark", "Bold"] },
    { name: "Cotton Candy",       colors: ["#CDB4DB", "#FFC8DD", "#FFAFCC", "#BDE0FE", "#A2D2FF"], moods: ["Pastel"] },
    { name: "Forest Floor",       colors: ["#283618", "#606C38", "#FEFAE0", "#DDA15E", "#BC6C25"], moods: ["Earthy"] },
    { name: "Electric Lime",      colors: ["#111111", "#2B2B2B", "#7A7A7A", "#F5F5F5", "#CCFF00"], moods: ["Bold", "Dark"] },
    { name: "Terracotta",         colors: ["#3D405B", "#E07A5F", "#81B29A", "#F2CC8F", "#F4F1DE"], moods: ["Warm", "Earthy"] },
    { name: "Nordic Frost",       colors: ["#2E3440", "#4C566A", "#5E81AC", "#88C0D0", "#D8DEE9"], moods: ["Cool", "Neutral"] },
    { name: "Mango Tango",        colors: ["#FF9F1C", "#FFBF69", "#FFFFFF", "#CBF3F0", "#2EC4B6"], moods: ["Warm", "Bold"] },
    { name: "Royal Plum",         colors: ["#10002B", "#3C096C", "#7B2CBF", "#C77DFF", "#E0AAFF"], moods: ["Dark", "Cool"] },
    { name: "Coffee Shop",        colors: ["#3E2723", "#6D4C41", "#A1887F", "#D7CCC8", "#EFEBE9"], moods: ["Earthy", "Neutral"] },
    { name: "Paper & Ink",        colors: ["#0D0D0D", "#595959", "#BFBFBF", "#F2F2F2", "#FFFFFF"], moods: ["Neutral"] },
    { name: "Cherry Blossom",     colors: ["#FB6F92", "#FF8FAB", "#FFB3C6", "#FFC2D1", "#FFE5EC"], moods: ["Pastel"] },
    { name: "Deep Sea",           colors: ["#001219", "#005F73", "#0A9396", "#94D2BD", "#E9D8A6"], moods: ["Cool", "Dark"] },
    { name: "Retro Diner",        colors: ["#003049", "#D62828", "#F77F00", "#FCBF49", "#EAE2B7"], moods: ["Warm", "Bold"] },
    { name: "Lavender Field",     colors: ["#B8C0FF", "#BBD0FF", "#C8B6FF", "#E6E6FA", "#FFD6FF"], moods: ["Pastel", "Cool"] },
    { name: "Savanna",            colors: ["#6D6875", "#B5838D", "#E5989B", "#FFB4A2", "#FFCDB2"], moods: ["Warm", "Pastel"] },
    { name: "Graphite",           colors: ["#212529", "#343A40", "#495057", "#ADB5BD", "#F8F9FA"], moods: ["Neutral", "Dark"] },
    { name: "Tropical",           colors: ["#073B4C", "#118AB2", "#06D6A0", "#FFD166", "#EF476F"], moods: ["Bold"] },
    { name: "Olive Grove",        colors: ["#344E41", "#3A5A40", "#588157", "#A3B18A", "#DAD7CD"], moods: ["Earthy"] },
    { name: "Golden Hour",        colors: ["#997B66", "#B58463", "#D08C60", "#E8AC65", "#FFCB69"], moods: ["Warm", "Earthy"] },
    { name: "Ice Cream",          colors: ["#F9F7F3", "#FFF1E6", "#FDE2E4", "#FAD2E1", "#EDDCD2"], moods: ["Pastel", "Neutral"] },
    { name: "Night Drive",        colors: ["#22223B", "#4A4E69", "#9A8C98", "#C9ADA7", "#F2E9E4"], moods: ["Dark", "Cool"] },
    { name: "Citrus Pop",         colors: ["#F94144", "#F3722C", "#F8961E", "#F9C74F", "#90BE6D"], moods: ["Bold", "Warm"] },
    { name: "Arctic",             colors: ["#1B4F72", "#5DADE2", "#AED6F1", "#D6EAF8", "#F0F8FF"], moods: ["Cool"] },
    { name: "Brick & Mortar",     colors: ["#6A040F", "#9D0208", "#D00000", "#DC2F02", "#E85D04"], moods: ["Warm", "Bold"] },
    { name: "Sage & Stone",       colors: ["#2F3E46", "#354F52", "#52796F", "#84A98C", "#CAD2C5"], moods: ["Cool", "Earthy"] },
    { name: "Bubblegum Pop",      colors: ["#FF006E", "#FB5607", "#FFBE0B", "#8338EC", "#3A86FF"], moods: ["Bold"] },
    { name: "Desert Rose",        colors: ["#6B4E4E", "#9E6B6B", "#D4A5A5", "#E8D1C5", "#F5EBE0"], moods: ["Earthy", "Warm"] },
    { name: "Black & Gold",       colors: ["#0B0B0B", "#1C1C1C", "#C9A227", "#E6C36A", "#F5F0E1"], moods: ["Dark", "Bold"] },
    { name: "Fresh Mint",         colors: ["#40916C", "#74C69D", "#95D5B2", "#B7E4C7", "#D8F3DC"], moods: ["Cool", "Pastel"] }
  ];
  var MOODS = ["Warm", "Cool", "Pastel", "Earthy", "Bold", "Dark", "Neutral"];

  /* ---------- colour helpers ---------- */
  function hexToRgb(h) { h = h.replace("#", ""); return [0, 2, 4].map(function (i) { return parseInt(h.substr(i, 2), 16); }); }
  function lum(h) {
    return hexToRgb(h).map(function (v) { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); })
      .reduce(function (a, v, i) { return a + v * [0.2126, 0.7152, 0.0722][i]; }, 0);
  }
  function ink(h) { return lum(h) > 0.36 ? "#111111" : "#ffffff"; }   // readable text on a swatch
  function hsl(h, s, l) {
    h = ((h % 360) + 360) % 360; s /= 100; l /= 100;
    var a = s * Math.min(l, 1 - l), f = function (n) { var k = (n + h / 30) % 12; return l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1)); };
    return "#" + [f(0), f(8), f(4)].map(function (v) { return ("0" + Math.round(v * 255).toString(16)).slice(-2); }).join("").toUpperCase();
  }
  function rnd(a, b) { return a + Math.random() * (b - a); }

  /* ---------- export ---------- */
  function cssOf(name, colors) {
    var slug = String(name || "palette").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    return ":root {\n" + colors.map(function (c, i) { return "  --" + slug + "-" + (i + 1) + ": " + c + ";"; }).join("\n") + "\n}";
  }
  function savePng(name, colors) {
    var W = 1500, H = 900, cv = document.createElement("canvas"), x = cv.getContext("2d"), w = W / colors.length;
    cv.width = W; cv.height = H;
    colors.forEach(function (c, i) {
      x.fillStyle = c; x.fillRect(i * w, 0, Math.ceil(w), H - 120);
      x.fillStyle = ink(c); x.font = "600 34px 'Bricolage Grotesque', system-ui, sans-serif"; x.fillText(c, i * w + 32, H - 170);
    });
    x.fillStyle = "#f4f3ef"; x.fillRect(0, H - 120, W, 120);
    x.fillStyle = "#111111"; x.font = "800 40px 'Bricolage Grotesque', system-ui, sans-serif"; x.fillText(name, 32, H - 50);
    x.font = "500 22px 'Azeret Mono', monospace"; x.fillStyle = "#5f5e59";
    var tag = "DRAFT STUDIO · PALETTES"; x.fillText(tag, W - 32 - x.measureText(tag).width, H - 52);
    cv.toBlob(function (b) { DS.saveBlob(b, String(name).toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-palette.png"); DS.toast("Saved " + name + " as PNG"); });
  }
  function swatchHtml(c, extra) {
    return '<button class="pal-sw" style="--c:' + c + ";--ink:" + ink(c) + '" data-copy="' + c + '" aria-label="Copy ' + c + '"' + (extra || "") + '><span class="hex">' + c + "</span></button>";
  }

  /* ---------- generator ---------- */
  var gen = $("#pal-gen"), cur = [], locked = [false, false, false, false, false];
  var SCHEMES = {
    "Analogous": function (h) { var s = rnd(45, 80); return [-32, -16, 0, 16, 32].map(function (d, i) { return hsl(h + d, s, [88, 72, 56, 40, 24][i]); }); },
    "Monochrome": function (h) { var s = rnd(35, 75); return [94, 78, 58, 38, 18].map(function (l) { return hsl(h, s, l); }); },
    "Complementary": function (h) { var s = rnd(50, 80); return [hsl(h, s, 22), hsl(h, s, 45), hsl(h, 15, 94), hsl(h + 180, s, 60), hsl(h + 180, s, 38)]; },
    "Triadic": function (h) { var s = rnd(55, 85); return [hsl(h, s, 30), hsl(h, s, 55), hsl(h + 120, s, 58), hsl(h + 240, s, 62), hsl(h, 12, 95)]; },
    "Split": function (h) { var s = rnd(50, 80); return [hsl(h, 20, 14), hsl(h, s, 50), hsl(h + 150, s, 62), hsl(h + 210, s, 55), hsl(h, 25, 93)]; }
  };
  var schemeName = "";
  function generate() {
    var names = Object.keys(SCHEMES); schemeName = names[Math.floor(Math.random() * names.length)];
    var fresh = SCHEMES[schemeName](Math.random() * 360);
    cur = fresh.map(function (c, i) { return locked[i] && cur[i] ? cur[i] : c; });
    drawGen();
  }
  function drawGen() {
    if (!gen) return;
    gen.innerHTML = cur.map(function (c, i) {
      return '<div class="pal-gen-sw" style="--c:' + c + ";--ink:" + ink(c) + '">' +
        '<button class="pal-gen-copy" data-copy="' + c + '" aria-label="Copy ' + c + '"><span class="hex">' + c + '</span><span class="label">Copy</span></button>' +
        '<button class="pal-lock" data-lock="' + i + '" aria-pressed="' + locked[i] + '" aria-label="' + (locked[i] ? "Unlock " : "Lock ") + c + '">' +
          (locked[i] ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>'
                     : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 7.75-1.4"/></svg>') +
        "</button></div>";
    }).join("");
    var sn = $("#pal-scheme"); if (sn) sn.textContent = schemeName;
  }
  if (gen) {
    generate();
    $("#pal-new").addEventListener("click", generate);
    $("#pal-gen-css").addEventListener("click", function () { DS.copy(cssOf("brand", cur), "CSS copied"); });
    $("#pal-gen-png").addEventListener("click", function () { savePng("My palette", cur); });
    gen.addEventListener("click", function (e) {
      var l = e.target.closest("[data-lock]");
      if (l) { var i = +l.getAttribute("data-lock"); locked[i] = !locked[i]; drawGen(); }
    });
    document.addEventListener("keydown", function (e) {
      if (e.code !== "Space" || /INPUT|TEXTAREA|SELECT|BUTTON|A/.test(document.activeElement.tagName) || document.querySelector(".overlay:not([hidden])")) return;
      e.preventDefault(); generate();
    });
  }

  /* ---------- palette from a photo ----------
     The photo is read only inside the browser (never uploaded). Colours are
     found with k-means clustering on a small copy of the image; each colour
     gets a marker on the spot of the photo it came from.                    */
  var ph = $("#pal-photo");
  if (ph) {
    var drop = $("#ph-drop"), file = $("#ph-file"), stage = $("#ph-stage"), img = $("#ph-img"), marks = $("#ph-marks"),
        out = $("#ph-out"), countSel = $("#ph-count"), bar = $("#ph-bar"), pixels = null, W = 0, H = 0, colors = [];
    var hex = function (c) { return "#" + c.map(function (v) { return ("0" + Math.round(v).toString(16)).slice(-2); }).join("").toUpperCase(); };
    var dist = function (a, b) { var r = (a[0] + b[0]) / 2, dr = a[0] - b[0], dg = a[1] - b[1], db = a[2] - b[2]; return (2 + r / 256) * dr * dr + 4 * dg * dg + (2 + (255 - r) / 256) * db * db; };

    function load(f) {
      if (!f || !/^image\//.test(f.type)) { DS.toast("Please choose a photo (JPG, PNG or WebP)"); return; }
      var url = URL.createObjectURL(f), im = new Image();
      im.onload = function () {
        var s = Math.min(1, 160 / Math.max(im.naturalWidth, im.naturalHeight)); W = Math.max(1, Math.round(im.naturalWidth * s)); H = Math.max(1, Math.round(im.naturalHeight * s));
        var cv = document.createElement("canvas"); cv.width = W; cv.height = H; var x = cv.getContext("2d", { willReadFrequently: true }); x.drawImage(im, 0, 0, W, H);
        var d = x.getImageData(0, 0, W, H).data; pixels = [];
        for (var i = 0; i < d.length; i += 4) if (d[i + 3] > 200) pixels.push([d[i], d[i + 1], d[i + 2], (i / 4) % W, Math.floor(i / 4 / W)]);
        img.src = url; ph.classList.add("has-photo"); extract();
      };
      im.onerror = function () { DS.toast("That photo couldn’t be opened"); };
      im.src = url;
    }

    function extract() {
      if (!pixels || !pixels.length) return;
      var k = +countSel.value || 5, cents = [], i, j;
      // k-means++ start: spread the starting colours apart
      cents.push(pixels[Math.floor(Math.random() * pixels.length)].slice(0, 3));
      while (cents.length < k) {
        var best = null, bd = -1;
        for (i = 0; i < pixels.length; i += 3) { var m = Infinity; for (j = 0; j < cents.length; j++) m = Math.min(m, dist(pixels[i], cents[j])); if (m > bd) { bd = m; best = pixels[i]; } }
        cents.push(best.slice(0, 3));
      }
      var asg = new Array(pixels.length);
      for (var it = 0; it < 12; it++) {
        var sum = cents.map(function () { return [0, 0, 0, 0]; });
        for (i = 0; i < pixels.length; i++) {
          var bi = 0, bv = Infinity; for (j = 0; j < k; j++) { var dv = dist(pixels[i], cents[j]); if (dv < bv) { bv = dv; bi = j; } }
          asg[i] = bi; sum[bi][0] += pixels[i][0]; sum[bi][1] += pixels[i][1]; sum[bi][2] += pixels[i][2]; sum[bi][3]++;
        }
        cents = sum.map(function (s, n) { return s[3] ? [s[0] / s[3], s[1] / s[3], s[2] / s[3]] : cents[n]; });
      }
      // for each colour: the photo pixel closest to it (where the marker goes) and how much of the photo it covers
      colors = cents.map(function (c, n) {
        var near = null, nd = Infinity, share = 0;
        for (i = 0; i < pixels.length; i++) if (asg[i] === n) { share++; var dv = dist(pixels[i], c); if (dv < nd) { nd = dv; near = pixels[i]; } }
        var cl = function (v) { return Math.min(.94, Math.max(.06, v)); };
        return { hex: hex(c), x: near ? cl((near[3] + .5) / W) : .5, y: near ? cl((near[4] + .5) / H) : .5, share: share / pixels.length };
      }).filter(function (c) { return c.share > 0; })
        .sort(function (a, b) { return lum(a.hex) - lum(b.hex); });   // dark → light, like the curated palettes
      draw();
    }

    function draw() {
      out.innerHTML = '<div class="pal-strip ph-strip">' + colors.map(function (c) { return swatchHtml(c.hex); }).join("") + "</div>" +
        '<ul class="ph-list">' + colors.map(function (c) {
          return '<li><button class="ph-sw" data-copy="' + c.hex + '" style="--c:' + c.hex + '" aria-label="Copy ' + c.hex + '"></button><span><b>' + c.hex + "</b><span class=\"label\">" + Math.max(1, Math.round(c.share * 100)) + "% of the photo</span></span></li>";
        }).join("") + "</ul>";
      marks.innerHTML = colors.map(function (c, n) {
        return '<span class="ph-mark" style="left:' + (c.x * 100) + "%;top:" + (c.y * 100) + "%;--c:" + c.hex + ";--i:" + n + '"></span>';
      }).join("");
      bar.hidden = false;
    }

    file.addEventListener("change", function () { load(file.files[0]); file.value = ""; });
    ["dragenter", "dragover"].forEach(function (t) { drop.addEventListener(t, function (e) { e.preventDefault(); drop.classList.add("is-over"); }); });
    ["dragleave", "drop"].forEach(function (t) { drop.addEventListener(t, function (e) { e.preventDefault(); drop.classList.remove("is-over"); }); });
    drop.addEventListener("drop", function (e) { if (e.dataTransfer.files[0]) load(e.dataTransfer.files[0]); });
    document.addEventListener("paste", function (e) {
      var f = [].slice.call((e.clipboardData || {}).files || []).filter(function (x) { return /^image\//.test(x.type); })[0];
      if (f) { load(f); ph.scrollIntoView({ behavior: "smooth", block: "start" }); }
    });
    countSel.addEventListener("change", extract);
    $("#ph-again").addEventListener("click", extract);
    $("#ph-new").addEventListener("click", function () { file.click(); });
    $("#ph-css").addEventListener("click", function () { DS.copy(cssOf("photo", colors.map(function (c) { return c.hex; })), "CSS copied"); });
    $("#ph-png").addEventListener("click", function () { savePng("From my photo", colors.map(function (c) { return c.hex; })); });
  }

  /* ---------- curated palettes ---------- */
  var grid = $("#pal-grid"), chips = $("#pal-moods"), count = $("#pal-n"), mood = "";
  function render() {
    var list = PALETTES.filter(function (p) { return !mood || p.moods.indexOf(mood) !== -1; });
    grid.innerHTML = list.map(function (p, n) {
      var idx = PALETTES.indexOf(p);
      return '<article class="pal-card" style="--i:' + n + '">' +
        '<div class="pal-strip">' + p.colors.map(function (c) { return swatchHtml(c); }).join("") + "</div>" +
        '<div class="pal-meta"><div><h3>' + esc(p.name) + '</h3><p class="label">' + p.moods.join(" · ") + "</p></div>" +
          '<div class="pal-acts">' +
            '<button class="pal-act" data-css="' + idx + '" aria-label="Copy ' + esc(p.name) + ' as CSS">CSS</button>' +
            '<button class="pal-act" data-png="' + idx + '" aria-label="Save ' + esc(p.name) + ' as PNG">PNG</button>' +
          "</div></div></article>";
    }).join("");
    if (count) count.textContent = pad(list.length, 2) + " palettes";
    $all("[data-mood]", chips).forEach(function (b) { b.setAttribute("aria-pressed", b.getAttribute("data-mood") === mood); });
  }
  if (grid) {
    chips.innerHTML = ['<button data-mood="">All</button>'].concat(MOODS.map(function (m) { return '<button data-mood="' + m + '">' + m + "</button>"; })).join("");
    chips.addEventListener("click", function (e) { var b = e.target.closest("[data-mood]"); if (b) { mood = b.getAttribute("data-mood"); render(); } });
    grid.addEventListener("click", function (e) {
      var c = e.target.closest("[data-css]"), p = e.target.closest("[data-png]");
      if (c) { var a = PALETTES[+c.getAttribute("data-css")]; DS.copy(cssOf(a.name, a.colors), a.name + " CSS copied"); }
      if (p) { var b = PALETTES[+p.getAttribute("data-png")]; savePng(b.name, b.colors); }
    });
    render();
  }

  // Click any swatch to copy its hex code
  document.addEventListener("click", function (e) {
    var s = e.target.closest("[data-copy]");
    if (s) DS.copy(s.getAttribute("data-copy"), s.getAttribute("data-copy") + " copied");
  });
})();
