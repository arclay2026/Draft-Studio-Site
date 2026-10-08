/* Draft Studio — Design eye test (eye.html)
   8 quick rounds, 2 of each challenge, in random order:
     kern   drag the middle letters until the spacing looks even
     centre tap the true centre (centre of mass) of a shape
     colour match a colour with hue / saturation / lightness sliders
     font   name the font from four choices
   Each round scores 0–100; the final score is the average.             */
(function () {
  "use strict";
  var DS = window.DS, $ = DS.$, $all = DS.$all, esc = DS.esc;
  var root = $("#eye");
  if (!root) return;
  var NS = "http://www.w3.org/2000/svg";
  var BEST_KEY = "ds_eye_best";
  function best() { try { return +localStorage.getItem(BEST_KEY) || 0; } catch (e) { return 0; } }
  function setBest(v) { try { localStorage.setItem(BEST_KEY, v); } catch (e) {} }
  function rnd(a, b) { return a + Math.random() * (b - a); }
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function clamp(v, a, b) { return Math.min(b, Math.max(a, v)); }

  var TYPES = {
    kern: { name: "Kern it", how: "Drag the middle letters left or right until the spaces between all the letters look even." },
    centre: { name: "Find the centre", how: "Tap where you think the true centre of this shape is: the point it would balance on." },
    colour: { name: "Match the colour", how: "Move the sliders until your colour (right) matches the target (left)." },
    font: { name: "Name that font", how: "Which font is this? Pick one." }
  };
  var FONTS = [
    { f: "Playfair Display", w: 700 }, { f: "Bebas Neue", w: 400 }, { f: "Pacifico", w: 400 }, { f: "Montserrat", w: 700 },
    { f: "Lora", w: 500 }, { f: "Oswald", w: 500 }, { f: "Space Grotesk", w: 600 }, { f: "Courier Prime", w: 400 },
    { f: "Lobster", w: 400 }, { f: "Roboto Slab", w: 600 }, { f: "Abril Fatface", w: 400 }, { f: "Caveat", w: 600 }
  ];
  var fontsLoaded = false;
  function loadFonts() {
    if (fontsLoaded) return; fontsLoaded = true;
    var l = document.createElement("link"); l.rel = "stylesheet";
    l.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Bebas+Neue&family=Montserrat:wght@700&family=Lora:wght@500&family=Oswald:wght@500&family=Space+Grotesk:wght@600&family=Courier+Prime&family=Lobster&family=Roboto+Slab:wght@600&family=Abril+Fatface&family=Caveat:wght@600&display=swap";
    document.head.appendChild(l);
  }

  var rounds = [], idx = 0, scores = [];

  /* ---------------- screens ---------------- */
  function intro() {
    var b = best();
    root.innerHTML =
      '<div class="eye-card eye-intro">' +
        '<p class="label">8 rounds · about 2 minutes</p>' +
        '<h2 class="display">How good is your <em class="s blue">design eye?</em></h2>' +
        '<ul class="eye-types">' + Object.keys(TYPES).map(function (k) { return '<li><span class="eye-ic eye-ic-' + k + '" aria-hidden="true"></span>' + TYPES[k].name + "</li>"; }).join("") + "</ul>" +
        '<div class="eye-go"><button class="btn btn-signal" type="button" id="eye-start">Start the test <span class="arrow arrow-right">→</span></button>' +
        (b ? '<span class="label">Your best: ' + b + " / 100</span>" : "") + "</div></div>";
    $("#eye-start").addEventListener("click", start);
  }

  function start() {
    loadFonts();
    var list = shuffle(["kern", "kern", "centre", "centre", "colour", "colour", "font", "font"]);
    rounds = list.map(function (t) { return { type: t }; }); idx = 0; scores = [];
    var fontPool = shuffle(FONTS);
    rounds.filter(function (r) { return r.type === "font"; }).forEach(function (r, i) { r.font = fontPool[i]; });
    var words = shuffle(["DRAFT", "TYPE", "KERN", "WAVE", "LOGO", "VOLT", "PRINT", "MAKE"]);
    rounds.filter(function (r) { return r.type === "kern"; }).forEach(function (r, i) { r.word = words[i]; });
    next();
  }

  function next() {
    if (idx >= rounds.length) return done();
    var r = rounds[idx], T = TYPES[r.type];
    root.innerHTML =
      '<div class="eye-card eye-round">' +
        '<div class="eye-top"><span class="label">Round ' + (idx + 1) + " / " + rounds.length + '</span><span class="eye-dots">' +
          rounds.map(function (x, i) { return '<i class="' + (i < idx ? "is-done" : i === idx ? "is-now" : "") + '"></i>'; }).join("") + "</span></div>" +
        '<h2 class="h2">' + T.name + '</h2><p class="lede eye-how">' + T.how + "</p>" +
        '<div class="eye-play" id="eye-play"></div>' +
        '<div class="eye-result" id="eye-result" hidden></div>' +
        '<div class="eye-actions"><button class="btn btn-signal" type="button" id="eye-check">Check</button></div>' +
      "</div>";
    var play = $("#eye-play"), check = $("#eye-check");
    var game = ({ kern: kern, centre: centre, colour: colour, font: font })[r.type](play, r);
    var checked = false;
    check.addEventListener("click", function () {
      if (!checked) {
        var res = game.check(); if (res === null) return;
        checked = true; scores.push({ type: r.type, score: res.score });
        if (res.score >= 100 && DS.sound) DS.sound.play("stamp");
        var out = $("#eye-result");
        out.innerHTML = '<b class="eye-pts">' + res.score + "</b><span>" + res.note + "</span>";
        out.hidden = false; out.className = "eye-result " + (res.score >= 80 ? "is-great" : res.score >= 50 ? "is-ok" : "is-low");
        check.innerHTML = idx === rounds.length - 1 ? 'See my score <span class="arrow arrow-right">→</span>' : 'Next round <span class="arrow arrow-right">→</span>';
        check.focus();
      } else { idx++; next(); }
    });
    root.scrollIntoView({ block: "start", behavior: "smooth" });
  }

  function rank(s) {
    return s >= 90 ? ["Pixel perfect", "You notice everything. Designers would trust your eye."]
         : s >= 75 ? ["Sharp eye", "Very good. A little more practice and you’re a pro."]
         : s >= 55 ? ["Getting there", "Good start. Your eye is training, so keep going."]
         : ["Keep practising", "Everyone starts here. Play again and watch your score climb."];
  }

  function done() {
    var total = Math.round(scores.reduce(function (a, s) { return a + s.score; }, 0) / scores.length);
    var prev = best(), isBest = total > prev; if (isBest) setBest(total);
    if ((isBest || total >= 90) && DS.sound) DS.sound.play("stamp");
    var rk = rank(total), byType = {};
    scores.forEach(function (s) { (byType[s.type] = byType[s.type] || []).push(s.score); });
    var url = (DS.site.url || location.origin + "/") + "eye.html";
    var msg = "I scored " + total + "/100 on the Draft Studio design eye test (" + rk[0] + "). Can you beat me? " + url;
    root.innerHTML =
      '<div class="eye-card eye-end">' +
        '<p class="label">Your score' + (isBest && prev ? " · new best!" : "") + "</p>" +
        '<div class="eye-big"><b>' + total + "</b><span>/ 100</span></div>" +
        '<h2 class="h2">' + rk[0] + '</h2><p class="lede">' + rk[1] + "</p>" +
        '<ul class="eye-break">' + Object.keys(TYPES).map(function (k) {
          var a = byType[k] || [0], v = Math.round(a.reduce(function (x, y) { return x + y; }, 0) / a.length);
          return '<li><span>' + TYPES[k].name + '</span><span class="eye-bar"><i style="width:' + v + '%"></i></span><b>' + v + "</b></li>";
        }).join("") + "</ul>" +
        '<div class="eye-share">' +
          '<a class="btn btn-signal" target="_blank" rel="noopener" href="https://wa.me/?text=' + encodeURIComponent(msg) + '">' + DS.icon.wa + " Share on WhatsApp</a>" +
          '<button class="btn" type="button" id="eye-card-btn">' + (navigator.canShare ? "Share to Instagram" : "Save score card") + "</button>" +
          '<button class="btn" type="button" id="eye-again">Play again</button>' +
        '</div><p class="muted eye-small">Instagram: save the score card, then post it to your story and tag a friend.</p></div>';
    $("#eye-again").addEventListener("click", start);
    $("#eye-card-btn").addEventListener("click", function () { scoreCard(total, rk[0], msg); });
    root.scrollIntoView({ block: "start", behavior: "smooth" });
  }

  /* score card image (portrait, Instagram story friendly) */
  function scoreCard(total, title, msg) {
    var W = 1080, H = 1350, cv = document.createElement("canvas"); cv.width = W; cv.height = H;
    var x = cv.getContext("2d");
    x.fillStyle = "#111111"; x.fillRect(0, 0, W, H);
    x.fillStyle = "#86de4e"; x.fillRect(0, H - 18, W, 18);
    x.fillStyle = "#f4f3ef"; x.font = "500 34px 'JetBrains Mono', monospace"; x.fillText("DRAFT STUDIO · DESIGN EYE TEST", 80, 130);
    x.font = "400 92px Pacifico, cursive"; x.fillStyle = "#86de4e"; x.fillText("My design eye", 80, 330);
    x.fillStyle = "#f4f3ef"; x.font = "800 420px 'Bricolage Grotesque', system-ui, sans-serif"; x.fillText(String(total), 60, 760);
    var nw = x.measureText(String(total)).width;
    x.font = "700 70px 'Bricolage Grotesque', system-ui, sans-serif"; x.fillStyle = "rgba(244,243,239,.55)"; x.fillText("/ 100", 60 + nw + 24, 760);
    x.fillStyle = "#f4f3ef"; x.font = "800 84px 'Bricolage Grotesque', system-ui, sans-serif"; x.fillText(title, 80, 1010);
    x.font = "500 44px 'Bricolage Grotesque', system-ui, sans-serif"; x.fillStyle = "rgba(244,243,239,.7)"; x.fillText("Can you beat me?", 80, 1090);
    x.font = "500 30px 'JetBrains Mono', monospace"; x.fillText(String(DS.site.url || location.origin).replace(/^https?:\/\//, "").replace(/\/$/, "") + "/eye.html", 80, 1240);
    cv.toBlob(function (blob) {
      var file = new File([blob], "my-design-eye-score.png", { type: "image/png" });
      if (navigator.canShare && navigator.canShare({ files: [file] })) navigator.share({ files: [file], text: msg }).catch(function () {});
      else { DS.saveBlob(blob, file.name); DS.toast("Score card saved"); }
    });
  }

  /* ---------------- round: kern ---------------- */
  function kern(play, r) {
    var FS = 200, word = r.word, n = word.length;
    play.innerHTML = '<div class="eye-stage eye-kern"><svg viewBox="0 0 1000 300" id="kern-svg" role="img" aria-label="The word ' + word + ', drag the middle letters"></svg></div><p class="label eye-tip">Tip: use the left and right arrow keys after tapping a letter.</p>';
    var svg = $("#kern-svg"), ready = false, xs = [], prof = [], ideal = [];
    var font = "800 " + FS + "px 'Bricolage Grotesque', system-ui, sans-serif";
    function profile(ch) {   // left/right ink edge per row, relative to the letter origin
      var c = document.createElement("canvas"), S = FS * 1.4; c.width = S; c.height = S;
      var g = c.getContext("2d", { willReadFrequently: true }); g.font = font; g.fillStyle = "#000"; g.textBaseline = "alphabetic";
      var ox = FS * .2, base = FS * 1.05; g.fillText(ch, ox, base);
      var d = g.getImageData(0, 0, S, S).data, top = Math.round(base - FS * .72), L = [], R = [];
      for (var y = top; y < base; y += 2) {
        var l = NaN, rr = NaN;
        for (var x = 0; x < S; x++) if (d[(y * S + x) * 4 + 3] > 120) { if (isNaN(l)) l = x - ox; rr = x - ox; }
        L.push(l); R.push(rr);
      }
      return { L: L, R: R, adv: g.measureText(ch).width };
    }
    var MAXG = FS * .42;
    function gap(i) {   // average white space between letter i and i+1 over the cap height (each row capped)
      var a = prof[i], b = prof[i + 1], s = 0, k = 0;
      for (var y = 0; y < a.L.length; y++) {
        var ra = a.R[y], lb = b.L[y], gy;
        if (isNaN(ra) || isNaN(lb)) gy = MAXG; else gy = clamp((xs[i + 1] + lb) - (xs[i] + ra), 0, MAXG);
        s += gy; k++;
      }
      return s / k;
    }
    function solve() {   // equal gaps, first and last letters fixed
      var keep = xs.slice();
      for (var it = 0; it < 400; it++) for (var i = 1; i < n - 1; i++) xs[i] += (gap(i) - gap(i - 1)) * .5;
      var out = xs.slice(); xs = keep; return out;
    }
    var nodes = [];
    function draw() { nodes.forEach(function (t, i) { t.setAttribute("x", xs[i]); }); }
    document.fonts.load(font).then(function () {
      prof = word.split("").map(profile);
      var total = prof.reduce(function (a, p) { return a + p.adv; }, 0) + (n - 1) * FS * .08, x0 = (1000 - total) / 2;
      xs = []; var cx = x0; prof.forEach(function (p) { xs.push(cx); cx += p.adv + FS * .08; });
      ideal = solve();
      xs = ideal.slice();
      for (var i = 1; i < n - 1; i++) xs[i] += (Math.random() < .5 ? -1 : 1) * rnd(.08, .16) * FS;
      word.split("").forEach(function (ch, i) {
        var t = document.createElementNS(NS, "text"); t.textContent = ch; t.setAttribute("y", 230); t.setAttribute("class", i === 0 || i === n - 1 ? "kern-fixed" : "kern-move");
        if (i > 0 && i < n - 1) { t.setAttribute("tabindex", "0"); t.setAttribute("role", "slider"); t.setAttribute("aria-label", "Letter " + ch); }
        svg.appendChild(t); nodes.push(t);
      });
      draw(); ready = true;
      var drag = -1, sx = 0, s0 = 0;
      function toSvg(e) { var p = svg.createSVGPoint(); p.x = e.clientX; p.y = e.clientY; return p.matrixTransform(svg.getScreenCTM().inverse()).x; }
      function limit(i, v) { return clamp(v, xs[i - 1] + prof[i - 1].adv * .3, xs[i + 1] - prof[i].adv * .7); }
      nodes.forEach(function (t, i) {
        if (i === 0 || i === n - 1) return;
        t.addEventListener("pointerdown", function (e) { e.preventDefault(); drag = i; sx = toSvg(e); s0 = xs[i]; t.setPointerCapture(e.pointerId); t.classList.add("is-drag"); });
        t.addEventListener("pointermove", function (e) { if (drag !== i) return; xs[i] = limit(i, s0 + toSvg(e) - sx); draw(); });
        t.addEventListener("pointerup", function () { drag = -1; t.classList.remove("is-drag"); });
        t.addEventListener("keydown", function (e) {
          var st = e.shiftKey ? 10 : 2;
          if (e.key === "ArrowLeft") xs[i] = limit(i, xs[i] - st); else if (e.key === "ArrowRight") xs[i] = limit(i, xs[i] + st); else return;
          e.preventDefault(); draw();
        });
      });
    });
    return {
      check: function () {
        if (!ready) return null;
        var gs = []; for (var i = 0; i < n - 1; i++) gs.push(gap(i));
        var m = gs.reduce(function (a, b) { return a + b; }, 0) / gs.length;
        var err = gs.reduce(function (a, g) { return a + Math.abs(g - m); }, 0) / gs.length / FS;
        var score = Math.round(100 * clamp(1 - Math.max(0, err - .006) / .045, 0, 1));   // a pixel or two of slack
        // show the ideal spacing as a ghost
        word.split("").forEach(function (ch, i) {
          var t = document.createElementNS(NS, "text"); t.textContent = ch; t.setAttribute("x", ideal[i]); t.setAttribute("y", 230); t.setAttribute("class", "kern-ghost"); svg.insertBefore(t, svg.firstChild);
        });
        nodes.forEach(function (t) { t.removeAttribute("tabindex"); t.style.pointerEvents = "none"; });
        return { score: score, note: score >= 80 ? "Beautifully even. The green ghost shows the ideal spacing." : "The green ghost shows evenly spaced letters. Compare the gaps." };
      }
    };
  }

  /* ---------------- round: find the centre ---------------- */
  function centre(play) {
    var shape = pick(["tri", "tri", "L", "semi", "kite"]), pts, cx, cy, d;
    function centroid(p) {   // polygon centre of mass
      var A = 0, x = 0, y = 0;
      for (var i = 0; i < p.length; i++) { var a = p[i], b = p[(i + 1) % p.length], c = a[0] * b[1] - b[0] * a[1]; A += c; x += (a[0] + b[0]) * c; y += (a[1] + b[1]) * c; }
      A /= 2; return [x / (6 * A), y / (6 * A)];
    }
    if (shape === "tri") {
      pts = [[rnd(120, 320), rnd(330, 380)], [rnd(680, 880), rnd(300, 380)], [rnd(250, 750), rnd(40, 90)]];
    } else if (shape === "L") {
      var w = rnd(140, 200); pts = [[230, 60], [230 + w, 60], [230 + w, 380 - w], [770, 380 - w], [770, 380], [230, 380]];
    } else if (shape === "kite") {
      pts = [[500, 40], [rnd(640, 760), rnd(150, 200)], [500, 390], [rnd(240, 360), rnd(150, 200)]];
    } else {   // half circle
      pts = []; for (var a = 0; a <= 180; a += 6) pts.push([500 + 260 * Math.cos(a * Math.PI / 180), 340 - 260 * Math.sin(a * Math.PI / 180)]);
    }
    var cen = centroid(pts); cx = cen[0]; cy = cen[1];
    d = pts.map(function (p) { return p.join(","); }).join(" ");
    play.innerHTML = '<div class="eye-stage eye-centre"><svg viewBox="0 0 1000 420" id="cen-svg" role="img" aria-label="A shape. Tap its centre."><polygon points="' + d + '" class="cen-shape"/></svg></div>';
    var svg = $("#cen-svg"), guess = null, mark = null, locked = false;
    svg.addEventListener("pointerdown", function (e) {
      if (locked) return;
      var p = svg.createSVGPoint(); p.x = e.clientX; p.y = e.clientY; var q = p.matrixTransform(svg.getScreenCTM().inverse());
      guess = [q.x, q.y];
      if (!mark) { mark = document.createElementNS(NS, "g"); mark.setAttribute("class", "cen-guess"); mark.innerHTML = '<circle r="11"/><path d="M-18 0H18M0 -18V18"/>'; svg.appendChild(mark); }
      mark.setAttribute("transform", "translate(" + q.x + " " + q.y + ")");
    });
    return {
      check: function () {
        if (!guess) { DS.toast("Tap the shape where you think the centre is"); return null; }
        locked = true;
        var dist = Math.hypot(guess[0] - cx, guess[1] - cy), score = Math.round(100 * clamp(1 - dist / 70, 0, 1));
        var t = document.createElementNS(NS, "g"); t.setAttribute("class", "cen-true"); t.setAttribute("transform", "translate(" + cx + " " + cy + ")");
        t.innerHTML = '<circle r="9"/><circle r="22" class="ring"/>'; svg.appendChild(t);
        var ln = document.createElementNS(NS, "line"); ln.setAttribute("class", "cen-line");
        ln.setAttribute("x1", guess[0]); ln.setAttribute("y1", guess[1]); ln.setAttribute("x2", cx); ln.setAttribute("y2", cy); svg.insertBefore(ln, mark);
        return { score: score, note: score >= 80 ? "Spot on. The green dot is the true centre." : "The green dot is the true centre (its centre of mass). It’s often lower or nearer the heavy side than you’d think." };
      }
    };
  }

  /* ---------------- round: match the colour ---------------- */
  function hsl2rgb(h, s, l) {
    s /= 100; l /= 100; var a = s * Math.min(l, 1 - l), f = function (n) { var k = (n + h / 30) % 12; return l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1)); };
    return [f(0) * 255, f(8) * 255, f(4) * 255];
  }
  function lab(rgb) {
    var v = rgb.map(function (c) { c /= 255; return c > .04045 ? Math.pow((c + .055) / 1.055, 2.4) : c / 12.92; });
    var X = (v[0] * .4124 + v[1] * .3576 + v[2] * .1805) / .95047, Y = v[0] * .2126 + v[1] * .7152 + v[2] * .0722, Z = (v[0] * .0193 + v[1] * .1192 + v[2] * .9505) / 1.08883;
    var f = function (t) { return t > .008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116; };
    return [116 * f(Y) - 16, 500 * (f(X) - f(Y)), 200 * (f(Y) - f(Z))];
  }
  function css(h, s, l) { return "hsl(" + h + " " + s + "% " + l + "%)"; }
  function colour(play) {
    var T = [Math.round(rnd(0, 360)), Math.round(rnd(45, 90)), Math.round(rnd(32, 68))];
    var U = [(T[0] + Math.round(rnd(70, 200))) % 360, Math.round(rnd(20, 95)), Math.round(rnd(25, 80))];
    play.innerHTML =
      '<div class="eye-stage eye-colour"><div class="col-pair"><div class="col-sw" id="col-t" style="background:' + css(T[0], T[1], T[2]) + '"><span class="label">Target</span></div>' +
      '<div class="col-sw" id="col-u"><span class="label">Yours</span></div></div>' +
      '<div class="col-sliders">' +
        '<label class="field"><span>Hue</span><input type="range" min="0" max="359" id="col-h" class="col-hue"></label>' +
        '<label class="field"><span>Saturation</span><input type="range" min="0" max="100" id="col-s" data-unit="%"></label>' +
        '<label class="field"><span>Lightness</span><input type="range" min="0" max="100" id="col-l" data-unit="%"></label>' +
      "</div></div>";
    var h = $("#col-h"), s = $("#col-s"), l = $("#col-l"), u = $("#col-u");
    h.value = U[0]; s.value = U[1]; l.value = U[2];
    [h, s, l].forEach(function (r) { if (DS.rangeSlider) DS.rangeSlider(r); });
    function paint() { u.style.background = css(+h.value, +s.value, +l.value); s.style.setProperty("--track", "linear-gradient(90deg," + css(+h.value, 0, +l.value) + "," + css(+h.value, 100, +l.value) + ")"); l.style.setProperty("--track", "linear-gradient(90deg,#000," + css(+h.value, +s.value, 50) + ",#fff)"); }
    [h, s, l].forEach(function (r) { r.addEventListener("input", paint); }); paint();
    return {
      check: function () {
        var a = lab(hsl2rgb(T[0], T[1], T[2])), b = lab(hsl2rgb(+h.value, +s.value, +l.value));
        var dE = Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]), score = Math.round(100 * clamp(1 - dE / 28, 0, 1));
        [h, s, l].forEach(function (r) { r.disabled = true; });
        u.insertAdjacentHTML("beforeend", '<span class="col-diff">ΔE ' + dE.toFixed(1) + "</span>");
        return { score: score, note: dE < 3 ? "Practically identical. Most people can’t see a difference under 3." : "ΔE " + dE.toFixed(1) + " is how far apart the two colours look. Under 3 is a perfect match." };
      }
    };
  }

  /* ---------------- round: which font ---------------- */
  function font(play, r) {
    var F = r.font, others = shuffle(FONTS.filter(function (x) { return x.f !== F.f; })).slice(0, 3), opts = shuffle(others.concat([F]));
    var sample = pick(["Fresh bread, baked daily", "Make it yours", "Big summer sale", "Hello, designer", "Coffee & Co."]);
    play.innerHTML = '<div class="eye-stage eye-font"><p class="font-sample" style="font-family:\'' + F.f + '\',serif;font-weight:' + F.w + ';opacity:0">' + esc(sample) + '</p></div>' +
      '<div class="font-opts" role="radiogroup" aria-label="Choose the font">' + opts.map(function (o) { return '<button type="button" role="radio" aria-checked="false" data-f="' + esc(o.f) + '">' + esc(o.f) + "</button>"; }).join("") + "</div>";
    var smp = $(".font-sample", play), chosen = null;
    document.fonts.load(F.w + ' 60px "' + F.f + '"').then(function () { smp.style.opacity = 1; }, function () { smp.style.opacity = 1; });
    setTimeout(function () { smp.style.opacity = 1; }, 2500);
    var btns = $all(".font-opts button", play);
    btns.forEach(function (b) { b.addEventListener("click", function () { if (b.disabled) return; chosen = b.getAttribute("data-f"); btns.forEach(function (x) { x.setAttribute("aria-checked", x === b); }); }); });
    return {
      check: function () {
        if (!chosen) { DS.toast("Pick one of the fonts"); return null; }
        var ok = chosen === F.f;
        btns.forEach(function (b) { b.disabled = true; var f = b.getAttribute("data-f"); if (f === F.f) b.classList.add("is-right"); else if (f === chosen) b.classList.add("is-wrong"); });
        return { score: ok ? 100 : 0, note: ok ? "Correct! It’s " + F.f + "." : "It was " + F.f + ". Find it on the Font pairs page." };
      }
    };
  }

  intro();
})();
