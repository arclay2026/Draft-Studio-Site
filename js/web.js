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
      '<div class="svc-top"><span class="label">' + DS.pad(n + 1, 2) + "</span>" + (x.featured ? '<span class="label svc-tag">Most popular</span>' : "") + "</div>" +
      '<h3 class="svc-name">' + esc(x.name) + "</h3>" +
      (x.price ? '<p class="svc-price"><span class="label">From</span> ' + esc(x.price) + "</p>" : '<p class="svc-price svc-quote">Quote <span class="label">on request</span></p>') +
      (x.text ? '<p class="svc-text">' + esc(x.text) + "</p>" : "") +
      (x.includes && x.includes.length ? '<ul class="svc-inc">' + x.includes.map(function (i) { return "<li>" + esc(i) + "</li>"; }).join("") + "</ul>" : "") +
      '<a class="btn' + (x.featured ? " btn-signal" : "") + ' svc-btn" href="' + esc(href) + '" target="_blank" rel="noopener">' + DS.icon.wa + "Ask on WhatsApp</a>" +
      "</article>";
  }).join("");

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
  /* ---------- "Site by Draft Studio" badge: copy the embed code ---------- */
  var base = String(DS.site.url || (location.origin + location.pathname.replace(/[^/]*$/, ""))).replace(/\/?$/, "/");
  $all("[data-badge]").forEach(function (b) {
    b.addEventListener("click", function () {
      var v = b.getAttribute("data-badge");
      DS.copy('<a href="' + base + 'web.html" target="_blank" rel="noopener" title="Site by Draft Studio"><img src="' + base +
        "assets/badge/site-by-draft-studio-" + v + '.svg" alt="Site by Draft Studio" width="184" height="36"></a>', "Badge code copied");
    });
  });
})();
