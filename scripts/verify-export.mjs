import assert from "node:assert/strict";
import { readFile, readdir, stat } from "node:fs/promises";
import { join, resolve } from "node:path";

const root = resolve("out");
const base = process.env.NEXT_PUBLIC_BASE_PATH || "";
const routes = [
  "/",
  "/about/",
  "/experience/",
  "/work/",
  "/research/",
  "/skills/",
  "/lab/",
  "/products/",
  "/writing/",
  "/education/",
  "/recruiter/",
  "/contact/",
];
const outputFiles = await readdir(root, { recursive: true });
const pages = outputFiles.filter((file) => file.endsWith("index.html"));
assert(
  pages.some((file) => /^work[\\/][^\\/]+[\\/]index\.html$/.test(file)),
  "Expected at least one exported case study",
);
for (const file of [
  ".nojekyll",
  "robots.txt",
  "sitemap.xml",
  "404.html",
  "visuals/share.png",
  ...routes.map((route) => route.slice(1) + "index.html"),
])
  await stat(join(root, file));

const failures = new Set();
let checked = 0;
for (const file of [...pages, "404.html"]) {
  const html = await readFile(join(root, file), "utf8");
  assert(/<title>.+?<\/title>/.test(html), "Missing title in " + file);
  // Connection hints target an origin, not a document path.
  const linkedContent = html.replaceAll(
    /<link\b[^>]*\brel="(?:preconnect|dns-prefetch)"[^>]*>/g,
    "",
  );
  for (const match of linkedContent.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
    const raw = match[1].replaceAll("&amp;", "&");
    if (!raw.startsWith("/") || raw.startsWith("//")) continue;
    const target = new URL(raw, "https://export.test");
    if (base && !target.pathname.startsWith(base + "/")) {
      failures.add(file + " points outside base path: " + raw);
      continue;
    }
    const path = decodeURIComponent(target.pathname.slice(base.length));
    const resolved = join(root, path, path.endsWith("/") ? "index.html" : "");
    try {
      const info = await stat(resolved);
      const destination = info.isDirectory()
        ? join(resolved, "index.html")
        : resolved;
      if (target.hash) {
        const contents = await readFile(destination, "utf8");
        if (
          !contents.includes(
            'id="' + decodeURIComponent(target.hash.slice(1)) + '"',
          )
        )
          failures.add(file + " missing anchor " + raw);
      }
      checked++;
    } catch {
      failures.add(file + " missing " + raw);
    }
  }
}
assert.equal(failures.size, 0, [...failures].join("\n"));
console.log(
  "Verified " +
    pages.length +
    " exported routes and " +
    checked +
    " internal URL references.",
);
