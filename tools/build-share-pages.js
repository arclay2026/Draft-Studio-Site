#!/usr/bin/env node
/*
 * Builds one small page per design in d/<id>.html so links shared on
 * WhatsApp, Instagram, Facebook, X etc. show a preview card (image, title,
 * price or "Free"). Each page sends visitors straight on to item.html?id=<id>.
 *
 * Runs automatically on GitHub when the site is published (see
 * .github/workflows/pages.yml). To try it locally:
 *     node tools/build-share-pages.js [output-folder]
 */
const fs = require("fs"), path = require("path"), vm = require("vm");
const ROOT = path.join(__dirname, "..");
const OUT = path.resolve(process.argv[2] || ROOT);

const sandbox = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(ROOT, "js/catalog.js"), "utf8"), sandbox);
const data = sandbox.window.DRAFT_STUDIO || {};
const site = data.site || {};
const BASE = String(site.url || "https://arclay2026.github.io/Draft-Studio-Site/").replace(/\/?$/, "/");
const NAME = site.name || "Draft Studio";

const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

// width/height of a JPG or PNG (helps WhatsApp show the image straight away)
function imageSize(file) {
  try {
    const b = fs.readFileSync(file);
    if (b[0] === 0x89 && b.toString("ascii", 1, 4) === "PNG") return [b.readUInt32BE(16), b.readUInt32BE(20)];
    let i = 2;
    while (i < b.length) {
      const m = b[i + 1], len = b.readUInt16BE(i + 2);
      if (m >= 0xc0 && m <= 0xc3) return [b.readUInt16BE(i + 7), b.readUInt16BE(i + 5)];
      i += 2 + len;
    }
  } catch (e) {}
  return null;
}

const items = [].concat(
  (data.templates || []).map((x) => Object.assign({ type: "Template" }, x)),
  (data.logos || []).map((x) => Object.assign({ type: "Logo" }, x))
).filter((x) => x && x.id);

fs.mkdirSync(path.join(OUT, "d"), { recursive: true });
items.forEach((it) => {
  const target = "../item.html?id=" + encodeURIComponent(it.id);
  const formats = [...new Set((it.files && it.files.length ? it.files.map((f) => f.format) : it.includes || []).map((f) => String(f).toUpperCase()))];
  const offer = it.price ? (it.sold ? "Sold" : it.price + " · Exclusive logo, sold once") : "Free download";
  const desc = [offer, formats.length ? formats.join(", ") : "", it.description || ""].filter(Boolean).join(" · ");
  const img = it.preview ? BASE + it.preview.replace(/^\.?\//, "") : BASE + "assets/og-image.png";
  const size = it.preview ? imageSize(path.join(ROOT, it.preview)) : [1200, 630];
  const title = it.title + " — " + NAME;
  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${esc(BASE + "item.html?id=" + encodeURIComponent(it.id))}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${esc(NAME)}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${esc(BASE + "d/" + encodeURIComponent(it.id) + ".html")}">
<meta property="og:image" content="${esc(img)}">
${size ? `<meta property="og:image:width" content="${size[0]}">\n<meta property="og:image:height" content="${size[1]}">\n` : ""}<meta property="og:image:alt" content="${esc(it.title)}">
<meta name="twitter:card" content="summary_large_image">
<meta http-equiv="refresh" content="0; url=${esc(target)}">
<script>location.replace(${JSON.stringify(target)});</script>
</head>
<body style="font-family:system-ui,sans-serif;background:#f4f3ef;color:#111;padding:40px">
<p>Opening <a href="${esc(target)}">${esc(it.title)}</a>…</p>
</body>
</html>
`;
  fs.writeFileSync(path.join(OUT, "d", it.id + ".html"), html);
});
console.log("Share pages: " + items.length + " written to " + path.join(OUT, "d"));
