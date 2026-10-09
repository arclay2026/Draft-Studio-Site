/* Draft Studio — student portfolio (student.html?id=…). Content comes from
   site.students in js/catalog.js. */
(function () {
  "use strict";
  var DS = window.DS, $ = DS.$, $all = DS.$all, esc = DS.esc, pad = DS.pad;
  var id = new URLSearchParams(location.search).get("id") || "";
  var all = DS.students, s = all.filter(function (x) { return x.id === id; })[0];
  var root = $("#student");
  var wa = String(DS.site.whatsapp || "").replace(/\D/g, "");
  var MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  function monthYear(d) { var m = /^(\d{4})-(\d{2})/.exec(d || ""); return m ? MONTHS[+m[2] - 1] + " " + m[1] : esc(d || ""); }
  var pin = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true" focusable="false"><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/></svg>';
  var ig = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true" focusable="false"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>';

  if (!s) {
    document.title = "Student not found · Draft Studio";
    root.innerHTML = '<section class="page-head"><div class="title-wrap"><p class="label">Students</p><h1 class="display">Student <em class="s">not found</em></h1></div>' +
      '<div class="aside"><p class="lede">This link may be old. See all students on the front page.</p><a class="btn" href="index.html#students">See all students <span class="arrow arrow-right">→</span></a></div></section>';
    return;
  }

  document.title = s.name + "’s portfolio · Draft Studio";
  var md = document.querySelector('meta[name="description"]');
  if (md) md.setAttribute("content", s.name + (s.country ? " from " + s.country : "") + " is learning graphic design with Draft Studio. See their work and progress.");

  var others = all.filter(function (x) { return x.id !== s.id; });
  var waLearn = wa ? "https://wa.me/" + wa + "?text=" + encodeURIComponent("Hi Draft Studio, I saw " + s.name + "’s portfolio and I’d like to learn graphic design with you.") : "";

  root.innerHTML =
    /* ---------- header ---------- */
    '<section class="sp-head">' +
      '<a class="sp-back label" href="index.html#students"><span class="arrow arrow-left" aria-hidden="true">←</span> All students</a>' +
      '<div class="sp-id">' +
        '<div class="stu-photo sp-photo" data-initials="' + esc(DS.initials(s.name)) + '">' +
          (s.photo ? '<img src="' + esc(s.photo) + '" alt="' + esc(s.name) + '" decoding="async" onerror="this.remove()">' : "") + "</div>" +
        '<div class="sp-text">' +
          '<p class="label">Draft Studio student</p>' +
          '<h1 class="display sp-name">' + esc(s.name) + "</h1>" +
          '<div class="sp-facts">' +
            (s.country ? '<span class="stu-country">' + pin + "<span>" + esc(s.country) + "</span></span>" : "") +
            (s.since ? '<span class="label sp-since">Student since ' + monthYear(s.since) + "</span>" : "") +
          "</div>" +
          (s.bio ? '<p class="lede sp-bio">' + esc(s.bio) + "</p>" : "") +
          '<div class="sp-acts">' +
            (s.instagram ? '<a class="btn" href="https://instagram.com/' + encodeURIComponent(s.instagram) + '" target="_blank" rel="noopener">' + ig + " @" + esc(s.instagram) + "</a>" : "") +
            '<button class="btn" type="button" id="sp-share">' + DS.icon.share + " Share portfolio</button>" +
          "</div>" +
        "</div>" +
      "</div>" +
      /* stats */
      '<ul class="facts sp-stats">' +
        '<li class="fact"><b>' + pad(s.work.length, 2) + '</b><span class="label">' + (s.work.length === 1 ? "Design" : "Designs") + "</span></li>" +
        '<li class="fact"><b>' + pad(s.programs.length, 2) + '</b><span class="label">' + (s.programs.length === 1 ? "App" : "Apps") + " learning</span></li>" +
        '<li class="fact"><b>' + pad(s.milestones.length, 2) + '</b><span class="label">Milestones</span></li>' +
      "</ul>" +
    "</section>" +

    /* ---------- apps ---------- */
    (s.programs.length ? '<section class="section"><div class="folio"><span class="label label-ink">01</span><span class="label">Learning</span><span class="rule"></span><span class="label folio-note">' + pad(s.programs.length, 2) + " apps</span></div>" +
      '<ul class="sp-apps">' + s.programs.map(function (p) { return "<li>" + DS.appMark(p) + "<span>" + esc(DS.appShort(p)) + "</span></li>"; }).join("") + "</ul></section>" : "") +

    /* ---------- work ---------- */
    '<section class="section" aria-labelledby="h-work"><div class="folio"><span class="label label-ink">02</span><span class="label">Work</span><span class="rule"></span><span class="label folio-note">' + pad(s.work.length, 2) + " designs</span></div>" +
      '<div class="sect-head"><h2 class="h2" id="h-work">' + esc(s.name) + "’s <em class=\"s\">work</em></h2></div>" +
      (s.work.length ? '<div class="tiles sp-work" id="sp-work"></div>'
        : '<div class="sp-empty"><p class="h3">First designs <em class="s">coming soon</em></p><p class="muted">' + esc(s.name) + "’s work will appear here as they finish their lessons.</p></div>") +
    "</section>" +

    /* ---------- journey ---------- */
    (s.milestones.length ? '<section class="section" aria-labelledby="h-journey"><div class="folio"><span class="label label-ink">03</span><span class="label">Journey</span><span class="rule"></span><span class="label folio-note">Progress</span></div>' +
      '<div class="sect-head"><h2 class="h2" id="h-journey">The <em class="s">journey</em> so far</h2></div>' +
      '<ol class="sp-journey">' + s.milestones.map(function (m) {
        return '<li><span class="label">' + monthYear(m.date) + "</span><p>" + esc(m.text) + "</p></li>";
      }).join("") + "</ol></section>" : "") +

    /* ---------- other students ---------- */
    (others.length ? '<section class="section" aria-labelledby="h-others"><div class="folio"><span class="label label-ink">04</span><span class="label">More students</span><span class="rule"></span><span class="label folio-note">' + pad(others.length, 2) + "</span></div>" +
      '<div class="sp-others">' + others.map(function (o) {
        return '<a class="sp-other" href="' + o.url + '"><div class="stu-photo" data-initials="' + esc(DS.initials(o.name)) + '">' +
          (o.photo ? '<img src="' + esc(o.photo) + '" alt="" loading="lazy" onerror="this.remove()">' : "") + "</div>" +
          '<div><p class="sp-other-n">' + esc(o.name) + '</p><p class="label">' + esc(o.country) + "</p></div><span class=\"arrow arrow-right\" aria-hidden=\"true\">→</span></a>";
      }).join("") + "</div></section>" : "") +

    /* ---------- call to action ---------- */
    (waLearn ? '<section class="about-cta" aria-labelledby="h-sp-cta"><div class="folio"><span class="label">05</span><span class="label">Learn with me</span><span class="rule"></span><span class="label folio-note">One-on-one on WhatsApp</span></div>' +
      '<div class="about-cta-body"><h2 class="display" id="h-sp-cta">Want to learn like ' + esc(s.name) + '? <em class="s">Start today.</em></h2>' +
      '<div class="about-cta-actions"><a class="btn btn-signal" href="' + waLearn + '" target="_blank" rel="noopener">' + DS.icon.wa + ' Message me on WhatsApp <span class="arrow arrow-right">→</span></a>' +
      '<a class="btn about-cta-alt" href="start.html">Read the beginner guide</a></div></div></section>' : "");

  // Number the sections in order (some are hidden when they have no content)
  $all(".folio", root).forEach(function (f, i) { var l = f.querySelector(".label"); if (l) l.textContent = "" + pad(i + 1, 2); });

  /* work gallery: masonry tiles; tap to view bigger */
  var work = $("#sp-work");
  if (work) {
    DS.masonry(work, s.work.map(function (w, i) {
      return '<figure class="tile sp-tile" style="--i:' + i + '"><button class="tile-media" type="button" data-view="' + i + '" aria-label="View ' + esc(w.title || "design " + (i + 1)) + '">' +
        '<img src="' + esc(w.image) + '" alt="' + esc(w.title || "") + '" loading="lazy" decoding="async"></button>' +
        ((w.title || w.app) ? '<figcaption><span>' + esc(w.title || "") + "</span>" + (w.app ? '<span class="label">' + esc(DS.appShort(w.app)) + "</span>" : "") + "</figcaption>" : "") + "</figure>";
    }), { cols: function (w) { return w >= 1024 ? 3 : 2; } });
    var dlg = document.createElement("dialog"); dlg.className = "sp-view"; document.body.appendChild(dlg);
    work.addEventListener("click", function (e) {
      var b = e.target.closest("[data-view]"); if (!b) return;
      var w = s.work[+b.getAttribute("data-view")];
      dlg.innerHTML = '<button class="sp-view-x" type="button" aria-label="Close">✕</button><img src="' + esc(w.image) + '" alt="' + esc(w.title || "") + '">' +
        ((w.title || w.app) ? '<p><b>' + esc(w.title || "") + "</b>" + (w.app ? ' <span class="label">Made in ' + esc(DS.appShort(w.app)) + "</span>" : "") + "</p>" : "");
      dlg.showModal();
    });
    dlg.addEventListener("click", function (e) { if (e.target === dlg || e.target.closest(".sp-view-x")) dlg.close(); });
  }

  /* share */
  var sh = $("#sp-share");
  if (sh) sh.addEventListener("click", function () {
    var data = { title: s.name + "’s portfolio · Draft Studio", url: location.href };
    if (navigator.share) navigator.share(data).catch(function () {}); else DS.copy(location.href, "Link copied");
  });
  if (DS.reveal) DS.reveal();
})();
