/* Draft Studio — opening animation (first page of a visit only).
   The logo is drafted on a blueprint: guide lines, outlined letters that
   fill in, the green box sweeping across, "Studio" rising into it and the
   dot dropping like a cursor. The animation always plays to the end, and
   the page is only revealed once it has finished AND the page has loaded.
   Then the logo flies into its place in the header.                    */
(function () {
  var html = document.documentElement;
  // arriving through the page-change wipe: slide the green panel away
  if (/\bds-wipe-in\b/.test(html.className)) {
    requestAnimationFrame(function () { requestAnimationFrame(function () {
      html.classList.add("ds-wipe-out");
      setTimeout(function () { html.classList.remove("ds-wipe-in", "ds-wipe-out"); }, 420);
    }); });
  }
  // the Websites page can replay the intro on demand
  window.DSPlayIntro = function () { if (document.getElementById("boot")) return; html.classList.add("ds-boot"); play(true); };
  if (/\bds-boot\b/.test(html.className)) play(false);

  function play(replay) {
  var src = document.querySelector(".masthead .logo-live");
  if (!src) { html.classList.remove("ds-boot", "ds-booting"); return; }

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var DRAW = reduce ? 700 : 2600;          // the animation itself
  var LIMIT = 9000;                        // never hold the page longer than this

  var boot = document.createElement("div");
  boot.id = "boot"; boot.setAttribute("aria-hidden", "true");
  if (reduce) boot.className = "boot-rm";
  var logo = src.cloneNode(true);
  logo.removeAttribute("width"); logo.removeAttribute("height");
  logo.setAttribute("class", "boot-logo");
  // keep "Studio" inside the green box while it rises
  var ns = "http://www.w3.org/2000/svg", box = logo.querySelector(".lg-box");
  var defs = document.createElementNS(ns, "defs"), clip = document.createElementNS(ns, "clipPath");
  clip.setAttribute("id", "boot-clip"); clip.appendChild(box.cloneNode()); clip.firstChild.removeAttribute("class");
  defs.appendChild(clip); logo.insertBefore(defs, logo.firstChild);
  var studio = logo.querySelector(".lg-studio"), g = document.createElementNS(ns, "g");
  g.setAttribute("clip-path", "url(#boot-clip)"); studio.parentNode.insertBefore(g, studio); g.appendChild(studio);
  logo.querySelector(".lg-draft").setAttribute("pathLength", "1");

  boot.innerHTML =
    '<div class="boot-bg"></div><div class="boot-grid"></div>' +
    '<div class="boot-stage">' +
      '<span class="bl bl-cap"><i>cap height</i></span><span class="bl bl-base"><i>baseline</i></span>' +
      '<span class="bl bl-l"></span><span class="bl bl-r"></span>' +
      '<span class="reg reg-tl"></span><span class="reg reg-br"></span>' +
      '<div class="boot-mark"></div>' +
    "</div>" +
    '<div class="boot-foot"><span class="boot-n">Drafting <b>000</b></span><span class="boot-tag">Start as a draft.</span></div>' +
    '<div class="boot-bar"><i></i></div>';
  boot.querySelector(".boot-mark").appendChild(logo);
  var header = src.closest("header");
  if (replay) document.body.appendChild(boot); else header.parentNode.insertBefore(boot, header.nextSibling);
  html.classList.add("ds-booting");

  // the counter runs with the drawing, 000 → 100
  var n = boot.querySelector(".boot-n b"), t0 = performance.now();
  (function tick(now) {
    var p = Math.min(1, (now - t0) / DRAW);
    n.textContent = ("00" + Math.round(p * 100)).slice(-3);
    if (p < 1 && boot.isConnected) requestAnimationFrame(tick);
  })(t0);
  requestAnimationFrame(function () { boot.classList.add("is-on"); });

  var drawn = false, loaded = replay || document.readyState === "complete", gone = false;
  setTimeout(function () { drawn = true; maybeGo(); }, DRAW);
  window.addEventListener("load", function () { loaded = true; maybeGo(); });
  setTimeout(function () { loaded = true; drawn = true; maybeGo(); }, LIMIT);
  function maybeGo() { if (drawn && loaded && !gone) { gone = true; leave(); } }

  function leave() {
    // fly the logo to where the header logo sits
    var from = logo.getBoundingClientRect(), to = src.getBoundingClientRect();
    if (!reduce && to.width && to.bottom > 0) {
      var s = to.width / from.width, dx = to.left - from.left, dy = to.top - from.top;
      logo.style.transformOrigin = "0 0";
      logo.style.transform = "translate(" + dx + "px," + dy + "px) scale(" + s + ")";
    }
    boot.classList.add("is-out");
    setTimeout(function () {
      html.classList.remove("ds-boot", "ds-booting");
      boot.classList.add("is-gone");
      setTimeout(function () { boot.remove(); }, 400);
    }, reduce ? 300 : 820);
  }
  }
})();
