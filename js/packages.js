/* Draft Studio — Packages page (packages.html): design packages
   (site.services) and website packages (site.webPackages) in one place. */
(function () {
  "use strict";
  var DS = window.DS, $ = DS.$, esc = DS.esc;
  var wa = String(DS.site.whatsapp || "").replace(/\D/g, "");
  function waLink(msg, subject) { return wa ? "https://wa.me/" + wa + "?text=" + encodeURIComponent(msg) : "mailto:" + (DS.site.email || "") + "?subject=" + encodeURIComponent(subject); }

  function cards(list, kind) {
    return list.map(function (x, n) {
      var msg = kind === "web"
        ? "Hi Draft Studio, I'm interested in a " + x.name.toLowerCase() + (x.price ? " (from " + x.price + ")" : "") + ". Here's a bit about my business: "
        : "Hi Draft Studio, I'd like to order a " + x.name.toLowerCase() + (x.price ? " (from " + x.price + ")" : "") + ". Here's a bit about my project: ";
      var tag = x.featured ? (kind === "web" ? "Best value" : "Most complete") : "";
      return '<article class="svc' + (x.featured ? " is-featured" : "") + '" data-reveal>' +
        '<div class="svc-top"><span class="label">' + DS.pad(n + 1, 2) + "</span>" + (tag ? '<span class="label svc-tag">' + tag + "</span>" : "") + "</div>" +
        '<h3 class="svc-name">' + esc(x.name) + "</h3>" +
        (x.price ? '<p class="svc-price"><span class="label">From</span> ' + esc(x.price) + "</p>" : '<p class="svc-price svc-quote">Quote <span class="label">on request</span></p>') +
        (x.text ? '<p class="svc-text">' + esc(x.text) + "</p>" : "") +
        (x.includes && x.includes.length ? '<ul class="svc-inc">' + x.includes.map(function (i) { return "<li>" + esc(i) + "</li>"; }).join("") + "</ul>" : "") +
        '<a class="btn' + (x.featured ? " btn-signal" : "") + ' svc-btn" href="' + esc(waLink(msg, x.name)) + '" target="_blank" rel="noopener">' + DS.icon.wa + (kind === "web" ? "Ask on WhatsApp" : "Order on WhatsApp") + "</a>" +
        "</article>";
    }).join("");
  }
  var design = (DS.site.services || []).filter(function (x) { return x && x.name; });
  var web = (DS.site.webPackages || []).filter(function (x) { return x && x.name; });
  $("#design-grid").innerHTML = cards(design, "design");
  $("#web-grid").innerHTML = cards(web, "web");
  $("#design-n").textContent = design.length + " packages";
  $("#web-n").textContent = web.length + " packages";

  /* founding clients (site.foundingSpots; 0 hides the offer) */
  var spots = +DS.site.foundingSpots || 0, fd = $("#founding");
  if (fd && spots > 0) {
    var words = ["", "one", "two", "three", "four", "five", "six"];
    $("#founding-n").textContent = spots;
    $("h3 em", fd).textContent = (words[spots] || spots) + ".";
    $("#founding-btn").href = waLink("Hi Ishaaq, I'd like one of your founding client spots for a website. Here's a bit about my business: ", "Founding client spot");
    fd.hidden = false;
  }
})();
