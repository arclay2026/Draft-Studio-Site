/* Draft Studio — Websites page (web.html): the draft-to-live process
   animation and the website packages (site.webPackages).              */
(function () {
  "use strict";
  var DS = window.DS, $ = DS.$, $all = DS.$all, esc = DS.esc;

  /* ---------- Packages ---------- */
  var grid = $("#pk-grid"), list = (DS.site.webPackages || []).filter(function (x) { return x && x.name; });
  var wa = String(DS.site.whatsapp || "").replace(/\D/g, "");
  if (grid) grid.innerHTML = list.map(function (x, n) {
    var msg = "Hi Draft Studio, I'm interested in a " + x.name.toLowerCase() + (x.price ? " (from " + x.price + ")" : "") + ". Here's a bit about my business: ";
    var href = wa ? "https://wa.me/" + wa + "?text=" + encodeURIComponent(msg) : "mailto:" + (DS.site.email || "") + "?subject=" + encodeURIComponent(x.name);
    return '<article class="svc' + (x.featured ? " is-featured" : "") + '" data-reveal>' +
      '<div class="svc-top"><span class="label">' + DS.pad(n + 1, 2) + "</span>" + (x.featured ? '<span class="label svc-tag">Best value</span>' : "") + "</div>" +
      '<h3 class="svc-name">' + esc(x.name) + "</h3>" +
      (x.price ? '<p class="svc-price"><span class="label">From</span> ' + esc(x.price) + "</p>" : '<p class="svc-price svc-quote">Quote <span class="label">on request</span></p>') +
      (x.text ? '<p class="svc-text">' + esc(x.text) + "</p>" : "") +
      (x.includes && x.includes.length ? '<ul class="svc-inc">' + x.includes.map(function (i) { return "<li>" + esc(i) + "</li>"; }).join("") + "</ul>" : "") +
      '<a class="btn' + (x.featured ? " btn-signal" : "") + ' svc-btn" href="' + esc(href) + '" target="_blank" rel="noopener">' + DS.icon.wa + "Ask on WhatsApp</a>" +
      "</article>";
  }).join("");

  /* ---------- Founding clients (site.foundingSpots; 0 hides the offer) ---------- */
  var spots = +DS.site.foundingSpots || 0, fd = $("#founding");
  if (fd && spots > 0) {
    var words = ["", "one", "two", "three", "four", "five", "six"];
    $("#founding-n").textContent = spots;
    $("h3 em", fd).textContent = (words[spots] || spots) + ".";
    var fmsg = "Hi Ishaaq, I'd like one of your founding client spots for a website. Here's a bit about my business: ";
    $("#founding-btn").href = wa ? "https://wa.me/" + wa + "?text=" + encodeURIComponent(fmsg) : "mailto:" + (DS.site.email || "") + "?subject=" + encodeURIComponent("Founding client spot");
    fd.hidden = false;
  }

  /* ---------- Draft to live: the frame follows the step in view ---------- */
  var wf = $("#wf"), steps = $all(".proc-steps li"), launched = false;
  var TAGS = { 1: "Brief", 2: "Wireframe", 3: "Design", 4: "Build", 5: "Live" };
  function setStage(n) {
    if (!wf || wf.getAttribute("data-stage") === String(n)) return;
    wf.setAttribute("data-stage", n); $(".wf-tag", wf).textContent = "Step " + n + " · " + TAGS[n];
    steps.forEach(function (s) { s.classList.toggle("is-on", s.getAttribute("data-step") === String(n)); });
    if (n === 5 && !launched) { launched = true; var r = wf.getBoundingClientRect(); setTimeout(function () { DS.confetti(r.left + r.width / 2, r.top + r.height * .4, 80); }, 450); }
  }
  if (wf) {
    setStage(1); wf.setAttribute("data-stage", "1"); $(".wf-tag", wf).textContent = "Step 1 · Brief"; steps[0].classList.add("is-on");
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (en) {
        en.forEach(function (e) { if (e.isIntersecting) setStage(+e.target.getAttribute("data-step")); });
      }, { rootMargin: "-45% 0px -45% 0px" });
      steps.forEach(function (s) { io.observe(s); });
    }
    steps.forEach(function (s) { s.addEventListener("click", function () { setStage(+s.getAttribute("data-step")); }); });
  }

  /* ---------- Built with care: a code editor typing real code from this site ---------- */
  var SNIPS = [
    { f: "archive.css", t: '/* The "." in the logo blinks like a cursor */\n.logo-live .lg-dot {\n  animation: lg-blink 1.1s steps(1, end) infinite;\n}\n.brand:hover .lg-box {\n  transform: scaleX(1.045);\n}\n@keyframes lg-blink { 50% { opacity: 0; } }' },
    { f: "boot.js", t: '// the counter runs with the drawing, 000 → 100\nvar p = Math.min(1, (now - t0) / DRAW);\nn.textContent = ("00" + Math.round(p * 100)).slice(-3);\n\n// reveal the page only when the drawing is done\n// AND the page has finished loading\nif (drawn && loaded && !gone) leave();' },
    { f: "web.html", t: '<div class="wf" data-stage="1">\n  <div class="wf-bar">\n    <span class="wf-url">yourbrand.co.za</span>\n    <b class="wf-live">Live</b>\n  </div>\n  <div class="wf-page">…</div>\n</div>' }
  ];
  function hl(src, f) {
    var s = esc(src);
    if (/\.html$/.test(f)) return s.replace(/(&quot;[^&]*?&quot;)/g, '<i class="t-str">$1</i>').replace(/(&lt;\/?)([a-z0-9]+)/g, '$1<i class="t-tag">$2</i>').replace(/ ([a-z-]+)=/g, ' <i class="t-attr">$1</i>=');
    var parts = s.split(/(\/\*[\s\S]*?(?:\*\/|$)|\/\/[^\n]*|&quot;[^\n]*?(?:&quot;|$))/);
    return parts.map(function (p, i) {
      if (i % 2) return '<i class="' + (/^&quot;/.test(p) ? "t-str" : "t-com") + '">' + p + "</i>";
      return p.replace(/\b(\d+(?:\.\d+)?(?:s|px|deg|%)?)\b/g, '<i class="t-num">$1</i>')
        .replace(/\b(var|if|function|return|infinite)\b/g, '<i class="t-key">$1</i>')
        .replace(/(^|\n)(\s*)([.@][\w-]+(?:[ .:][\w-]+)*)/g, '$1$2<i class="t-sel">$3</i>')
        .replace(/\b([a-z-]+)(?=:\s)/g, '<i class="t-attr">$1</i>');
    }).join("");
  }
  var ed = $("#editor"), code = $("#ed-code"), nums = $("#ed-nums"), tabs = $("#ed-tabs"), k = 0, pos = 0, timer = null, live = false;
  var still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function showTab() {
    tabs.innerHTML = SNIPS.map(function (s, i) { return '<span class="' + (i === k ? "on" : "") + '">' + s.f + "</span>"; }).join("");
    $("#ed-file").textContent = SNIPS[k].f;
  }
  function render(txt, typing) {
    code.innerHTML = hl(txt, SNIPS[k].f) + (typing ? '<b class="ed-caret"></b>' : "");
    var n = txt.split("\n").length; nums.innerHTML = Array.apply(null, Array(Math.max(n, 8))).map(function (_, i) { return "<li>" + (i + 1) + "</li>"; }).join("");
  }
  function step() {
    clearTimeout(timer); if (!live) return;
    var t = SNIPS[k].t;
    if (pos <= t.length) { render(t.slice(0, pos), true); pos += t.charAt(pos) === " " ? 2 : 1; timer = setTimeout(step, 22 + Math.random() * 40); }
    else { render(t, true); timer = setTimeout(function () { k = (k + 1) % SNIPS.length; pos = 0; showTab(); step(); }, 2600); }
  }
  if (ed) {
    showTab();
    if (still || !("IntersectionObserver" in window)) render(SNIPS[0].t, false);
    else {
      render("", true);
      new IntersectionObserver(function (en) { live = en[0].isIntersecting; if (live) step(); else clearTimeout(timer); }, { threshold: .3 }).observe(ed);
    }
  }

  /* real numbers for this website, counted on every publish (js/code-stats.json) */
  var st = $("#code-stats");
  function countUp(el, to) {
    if (still) { el.textContent = to.toLocaleString("en-ZA"); return; }
    var t0 = performance.now();
    (function f(now) { var p = Math.min(1, (now - t0) / 1400), e = 1 - Math.pow(1 - p, 3); el.textContent = Math.round(to * e).toLocaleString("en-ZA"); if (p < 1) requestAnimationFrame(f); })(t0);
  }
  if (st) {
    var nums2 = { commits: +st.getAttribute("data-commits"), days: +st.getAttribute("data-days"), lines: +st.getAttribute("data-lines") }, shown = false;
    function show() { if (shown) return; shown = true; DS.$all("[data-k]", st).forEach(function (b) { countUp(b, nums2[b.getAttribute("data-k")]); }); }
    fetch("js/code-stats.json", { cache: "no-store" }).then(function (r) { return r.ok ? r.json() : null; }).then(function (s) {
      if (s) { nums2.commits = s.commits; nums2.days = s.days; nums2.lines = s.lines; if (shown) { shown = false; show(); } }
    }).catch(function () {});
    if ("IntersectionObserver" in window) new IntersectionObserver(function (en) { if (en[0].isIntersecting) show(); }, { threshold: .4 }).observe(st); else show();
  }
})();
