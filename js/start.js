/* Draft Studio — Start here (beginner guide) */
(function () {
  "use strict";
  var DS = window.DS, $ = DS.$, esc = DS.esc;

  // Free apps for beginners. "opens" lists the file types each one can open.
  var APPS = [
    { name: "Photopea", where: "Browser · computer or phone", best: "Mockups", url: "https://www.photopea.com",
      text: "A free Photoshop in your browser. It opens PSD mockups, smart objects and all.", opens: ["PSD", "AI", "SVG", "PDF", "PNG", "JPG"] },
    { name: "Canva", where: "Phone app · browser", best: "Social posts", url: "https://www.canva.com",
      text: "Drag-and-drop design with thousands of fonts and photos. The easiest place to begin.", opens: ["SVG", "PDF", "PNG", "JPG"] },
    { name: "PixelLab", where: "Android phone", best: "Text and logos on the go", url: "https://play.google.com/store/apps/details?id=com.imaginstudio.imagetools.pixellab",
      text: "Add text, shapes, stickers and effects to pictures, right on your phone.", opens: ["PNG", "JPG"] },
    { name: "Figma", where: "Browser · computer", best: "Logos, icons and layouts", url: "https://www.figma.com",
      text: "A professional design tool with a free plan. Great for clean vector work.", opens: ["SVG", "PNG", "JPG"] },
    { name: "Inkscape", where: "Windows · Mac · Linux", best: "Logos", url: "https://inkscape.org",
      text: "A free alternative to Illustrator for editing logos and other vector shapes.", opens: ["SVG", "PDF", "AI"] },
    { name: "GIMP", where: "Windows · Mac · Linux", best: "Photo editing", url: "https://www.gimp.org",
      text: "A free photo editor with layers. It opens PSDs, but not mockup smart objects.", opens: ["PSD", "PNG", "JPG"] }
  ];

  var grid = $("#st-apps");
  if (grid) grid.innerHTML = APPS.map(function (a) {
    return '<a class="st-app" href="' + esc(a.url) + '" target="_blank" rel="noopener" data-reveal>' +
      '<div class="st-app-top">' + DS.appMark(a.name) + '<div><h3>' + esc(a.name) + '</h3><p class="label">' + esc(a.where) + "</p></div>" +
        '<span class="st-free">Free</span></div>' +
      "<p>" + esc(a.text) + "</p>" +
      '<p class="st-best"><span class="label">Best for</span>' + esc(a.best) + "</p>" +
      '<div class="st-opens-row"><span class="label">Opens</span>' + DS.fmts(a.opens) + "</div>" +
      '<span class="st-go">Get ' + esc(a.name) + ' <span aria-hidden="true">↗</span></span>' +
    "</a>";
  }).join("");

  // WhatsApp button with a ready-made message
  var wa = String(DS.site.whatsapp || "").replace(/\D/g, ""), learn = $("#st-learn");
  if (learn && wa) learn.href = "https://wa.me/" + wa + "?text=" + encodeURIComponent("Hi Draft Studio, I'm new to design and I'd like to learn with you.");

  if (DS.reveal) DS.reveal();
})();
