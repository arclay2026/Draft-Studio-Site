/* Draft Studio — Archive Desk (desk.html)
   The site has no server: files live in the GitHub repository. The desk
   reads the files you drop (locally, nothing is uploaded), builds the
   catalogue entry for js/catalog.js, and links straight to the right
   GitHub upload folders. */
(function () {
  "use strict";
  var DS = window.DS, $ = DS.$, $all = DS.$all, esc = DS.esc;
  var repo = DS.site.repo || "", branch = DS.site.branch || "main";
  var gh = repo ? "https://github.com/" + repo : "";

  var DESIGN = /^(PSD|AI|PDF|SVG|EPS|ZIP|INDD|FIG|XD|TTF|OTF)$/;
  var IMAGE = /^(PNG|JPE?G|WEBP|GIF)$/;
  var files = []; // { file, name, ext, size, role: "design"|"preview", url }

  var drop = $("#drop"), input = $("#drop-input"), list = $("#filelist");
  var f = {
    kind: function () { return ($('input[name="kind"]:checked') || {}).value || "template"; },
    title: $("#d-title"), id: $("#d-id"), cat: $("#d-cat"), tags: $("#d-tags"), desc: $("#d-desc"),
    dims: $("#d-dims"), creator: $("#d-creator"), featured: $("#d-featured")
  };
  var idTouched = false;

  // Category suggestions from what's already filed
  $("#cat-options").innerHTML = DS.uniq(DS.items.map(function (i) { return i.category; }).concat(DS.icons.map(function (i) { return i.category; })))
    .sort().map(function (c) { return '<option value="' + esc(c) + '">'; }).join("");
  f.creator.placeholder = DS.site.name || "Draft Studio";

  function human(b) { return b > 1048576 ? (b / 1048576).toFixed(b > 104857600 ? 0 : 1) + " MB" : Math.max(1, Math.round(b / 1024)) + " KB"; }
  function ext(n) { var m = /\.([a-z0-9]+)$/i.exec(n); return m ? m[1].toUpperCase() : "FILE"; }
  function folder() { return f.kind() === "logo" ? "files/logos" : f.kind() === "icon" ? "files/icons" : "files/templates"; }

  function addFiles(fl) {
    Array.prototype.forEach.call(fl, function (file) {
      if (files.some(function (x) { return x.name === file.name; })) return;
      var e = ext(file.name);
      var role = IMAGE.test(e) && files.every(function (x) { return x.role !== "preview"; }) ? "preview" : "design";
      files.push({ file: file, name: file.name, ext: e === "JPEG" ? "JPG" : e, size: file.size, role: role, url: URL.createObjectURL(file) });
    });
    var first = files.filter(function (x) { return x.role === "design"; })[0] || files[0];
    if (first && !f.title.value) {
      f.title.value = first.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ").replace(/\b\w/g, function (c) { return c.toUpperCase(); });
    }
    if (!idTouched) f.id.value = DS.slug(f.title.value);
    update();
  }

  drop.addEventListener("dragover", function (e) { e.preventDefault(); drop.classList.add("is-over"); });
  drop.addEventListener("dragleave", function () { drop.classList.remove("is-over"); });
  drop.addEventListener("drop", function (e) { e.preventDefault(); drop.classList.remove("is-over"); addFiles(e.dataTransfer.files); });
  input.addEventListener("change", function () { addFiles(input.files); input.value = ""; });

  list.addEventListener("click", function (e) {
    var b = e.target.closest("button"); if (!b) return;
    var i = +b.getAttribute("data-i");
    if (b.getAttribute("data-act") === "remove") { URL.revokeObjectURL(files[i].url); files.splice(i, 1); }
    if (b.getAttribute("data-act") === "role") {
      var toPreview = files[i].role !== "preview";
      files.forEach(function (x) { if (toPreview && x.role === "preview") x.role = "design"; });
      files[i].role = toPreview ? "preview" : "design";
    }
    update();
  });
  f.title.addEventListener("input", function () { if (!idTouched) f.id.value = DS.slug(f.title.value); update(); });
  f.id.addEventListener("input", function () { idTouched = true; f.id.value = DS.slug(f.id.value) || f.id.value.toLowerCase(); update(); });
  $all("#desk-form input, #desk-form textarea").forEach(function (el) { el.addEventListener("input", update); el.addEventListener("change", update); });

  function q(s) { return JSON.stringify(String(s)); }

  function update() {
    var kind = f.kind(), dir = folder();
    var design = files.filter(function (x) { return x.role === "design"; });
    var preview = files.filter(function (x) { return x.role === "preview"; })[0];
    var id = f.id.value || "new-design";
    var tags = f.tags.value.split(",").map(function (t) { return t.trim(); }).filter(Boolean);
    var today = new Date().toISOString().slice(0, 10);

    // File list
    list.innerHTML = files.length ? files.map(function (x, i) {
      var canPreview = IMAGE.test(x.ext) || x.ext === "SVG";
      return '<div class="row">' + DS.fmt(x.ext) + '<span class="fn">' + esc(x.name) + '</span><span class="label size">' + human(x.size) + "</span>" +
        '<span class="role-slot">' + (kind === "icon" ? "" : (canPreview ? '<button data-act="role" data-i="' + i + '" aria-pressed="' + (x.role === "preview") + '">' + (x.role === "preview" ? '<span class="role">Preview image ✓</span>' : "Use as preview") + "</button>" : '<span class="role">Design file</span>')) + "</span>" +
        '<button class="rm" data-act="remove" data-i="' + i + '" aria-label="Remove ' + esc(x.name) + '">Remove</button></div>';
    }).join("") : "";

    // Warnings
    var warn = [];
    if (DS.byId(id) || DS.icons.some(function (i) { return i.id === id; })) warn.push("The ID “" + id + "” is already in the catalogue. Choose another.");
    if (kind !== "icon" && design.some(function (x) { return /^(PSD|AI|EPS|INDD|FIG|XD)$/.test(x.ext); }) && !preview && !design.some(function (x) { return x.ext === "SVG"; }))
      warn.push("PSD/AI files can’t be shown in a browser. Add a JPG or PNG preview.");
    if (files.some(function (x) { return x.size > 100 * 1048576; })) warn.push("GitHub rejects files over 100 MB. Zip the file or host it elsewhere and paste that link as the path.");
    if (kind === "icon" && design.some(function (x) { return x.ext !== "SVG"; })) warn.push("Icons must be SVG files.");
    $("#d-warn").innerHTML = warn.map(function (w) { return "<p>" + esc(w) + "</p>"; }).join("");

    // Catalogue entry
    var entry;
    if (kind === "icon") {
      var svg = design.filter(function (x) { return x.ext === "SVG"; })[0];
      entry = "{ id: " + q(id) + ", name: " + q(f.title.value || id) + ", category: " + q(f.cat.value || "General") + ", tags: " + JSON.stringify(tags) + ", file: " + q(dir + "/" + (svg ? svg.name : id + ".svg")) + " },";
    } else {
      var lines = ["{",
        "  id: " + q(id) + ",",
        "  title: " + q(f.title.value || "Untitled") + ",",
        "  category: " + q(f.cat.value || "Uncategorised") + ","];
      if (f.dims.value) lines.push("  dimensions: " + q(f.dims.value) + ",");
      if (f.desc.value) lines.push("  description: " + q(f.desc.value) + ",");
      lines.push("  tags: " + JSON.stringify(tags) + ",");
      if (preview) lines.push("  preview: " + q("previews/" + preview.name) + ",");
      lines.push("  files: [");
      (design.length ? design : [{ ext: "PSD", name: id + ".psd", size: 0 }]).forEach(function (x, n, arr) {
        lines.push("    { format: " + q(x.ext) + ", path: " + q(dir + "/" + x.name) + (x.size ? ", size: " + q(human(x.size)) : "") + " }" + (n < arr.length - 1 ? "," : ""));
      });
      lines.push("  ],");
      if (f.creator.value) lines.push("  creator: " + q(f.creator.value) + ",");
      lines.push("  date: " + q(today) + ",");
      lines.push("  featured: " + (f.featured.checked ? "true" : "false"));
      lines.push("},");
      entry = lines.join("\n");
    }
    $("#d-code").value = entry;

    // Steps
    var listName = kind === "logo" ? "logos" : kind === "icon" ? "icons" : "templates";
    $("#s1-files").textContent = design.length ? design.map(function (x) { return x.name; }).join(", ") : "Your design files";
    $("#s1-dir").textContent = dir + "/";
    $("#s1-go").href = gh ? gh + "/upload/" + branch + "/" + dir : "#";
    $("#s2").hidden = kind === "icon";
    $("#s2-files").textContent = preview ? preview.name : "Not needed if the design has an SVG";
    $("#s2-go").href = gh ? gh + "/upload/" + branch + "/previews" : "#";
    $("#s3-list").textContent = listName;
    $("#s3-go").href = gh ? gh + "/edit/" + branch + "/js/catalog.js" : "#";

    // Live proof of the plate
    var proof = $("#proof");
    if (kind === "icon") {
      var s = design.filter(function (x) { return x.ext === "SVG"; })[0];
      proof.innerHTML = '<div class="plate"><div class="plate-media" style="display:grid;place-items:center;aspect-ratio:1">' + (s ? '<img src="' + s.url + '" alt="" style="width:30%;box-shadow:none">' : '<span class="label">Drop an SVG icon</span>') + '<span class="crops"></span></div>' +
        '<div class="plate-meta"><span class="plate-no">IC–NEW</span><h3 class="plate-title">' + esc(f.title.value || "Icon name") + "</h3></div></div>";
    } else {
      var src = preview ? preview.url : (design.filter(function (x) { return x.ext === "SVG"; })[0] || {}).url;
      proof.innerHTML = '<div class="plate"><div class="plate-media">' + (src ? '<img src="' + src + '" alt="">' : '<div style="aspect-ratio:4/3;display:grid;place-items:center"><span class="label">Preview appears here</span></div>') + '<span class="crops"></span></div>' +
        '<div class="plate-meta"><span class="plate-no">DS–NEW</span><h3 class="plate-title">' + esc(f.title.value || "Untitled design") + "</h3><span></span>" +
        '<div class="plate-sub"><span class="plate-cat">' + esc(f.cat.value || "Category") + "</span>" + DS.fmts(DS.uniq(design.map(function (x) { return x.ext; }))) + "</div></div></div>";
    }
  }

  $("#d-copy").addEventListener("click", function () { DS.copy($("#d-code").value, "Entry copied. Paste it into catalog.js"); });
  $all('input[name="kind"]').forEach(function (r) { r.addEventListener("change", update); });
  update();
})();
