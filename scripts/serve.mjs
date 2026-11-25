import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { createServer } from "node:http";
import { extname, resolve, sep } from "node:path";
import { pipeline } from "node:stream";
import { createGzip } from "node:zlib";

const root = resolve("out");
const base = process.env.NEXT_PUBLIC_BASE_PATH || "";
const port = Number(process.env.PORT || 4173);
const compress = process.env.SITE_PREVIEW_GZIP === "1";
const mime = {
  ".html": "text/html; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
  ".json": "application/json",
  ".pdf": "application/pdf",
  ".mp4": "video/mp4",
  ".vtt": "text/vtt",
  ".webp": "image/webp",
  ".jpg": "image/jpeg",
  ".avif": "image/avif",
};

createServer(async (request, response) => {
  let pathname;
  try {
    pathname = decodeURIComponent(
      new URL(request.url, "http://localhost").pathname,
    );
  } catch {
    response.writeHead(400).end();
    return;
  }
  if (base && pathname !== base && !pathname.startsWith(base + "/")) {
    response.writeHead(404).end();
    return;
  }
  const subpath = pathname.slice(base.length);
  const path = resolve(root, "." + (subpath || "/"));
  if (path !== root && !path.startsWith(root + sep)) {
    response.writeHead(403).end();
    return;
  }

  let file = path;
  let status = 200;
  try {
    const info = await stat(file);
    if (info.isDirectory()) {
      if (!pathname.endsWith("/")) {
        response.writeHead(308, { Location: pathname + "/" }).end();
        return;
      }
      file = resolve(file, "index.html");
      await stat(file);
    }
  } catch {
    file = resolve(root, "404.html");
    status = 404;
    try {
      await stat(file);
    } catch {
      response.writeHead(404).end();
      return;
    }
  }
  const extension = extname(file);
  const textAsset =
    compress &&
    /^(?:\.html|\.css|\.js|\.json|\.xml|\.svg|\.txt)$/.test(extension);
  const gzip =
    textAsset &&
    request.headers["accept-encoding"]
      ?.split(",")
      .some((type) => type.trim() === "gzip");
  response.writeHead(status, {
    "Content-Type": mime[extension] || "application/octet-stream",
    ...(textAsset ? { Vary: "Accept-Encoding" } : {}),
    ...(gzip ? { "Content-Encoding": "gzip" } : {}),
  });
  if (request.method === "HEAD") {
    response.end();
    return;
  }
  const fileStream = createReadStream(file);
  if (gzip) pipeline(fileStream, createGzip(), response, () => {});
  else pipeline(fileStream, response, () => {});
}).listen(port, "127.0.0.1", () => {
  console.log("Local static preview at http://127.0.0.1:" + port + base + "/");
});
