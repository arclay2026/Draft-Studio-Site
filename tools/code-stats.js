// Counts the work behind this website and writes js/code-stats.json into
// the published copy, so the Websites page always shows current numbers.
// Usage (in the publish workflow): node tools/code-stats.js _site
const { execSync } = require("child_process");
const fs = require("fs"), path = require("path");
const out = process.argv[2] || ".";
const sh = (c) => execSync(c, { encoding: "utf8" }).trim();
const files = sh("git ls-files '*.html' 'css/*.css' 'js/*.js'").split("\n")
  .filter((f) => f && !/^js\/(vendor|catalog)/.test(f) && !/^concepts\//.test(f));
const lines = files.reduce((n, f) => n + fs.readFileSync(f, "utf8").split("\n").length, 0);
const commits = +sh("git rev-list --count HEAD");
const first = sh("git log --reverse --format=%cs | head -1"), last = sh("git log -1 --format=%cs");
const days = Math.round((Date.parse(last) - Date.parse(first)) / 864e5) + 1;
const stats = { commits, days, lines, files: files.length, since: first, updated: last };
fs.writeFileSync(path.join(out, "js", "code-stats.json"), JSON.stringify(stats));
console.log("code stats:", stats);
