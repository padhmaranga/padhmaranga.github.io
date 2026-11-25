import { readFile, writeFile } from "node:fs/promises";
import { chromium } from "@playwright/test";

const artwork = await readFile("public/visuals/core.svg");
const source = "data:image/svg+xml;base64," + artwork.toString("base64");
const browser = await chromium.launch();
try {
  const page = await browser.newPage();
  const image = await page.evaluate(async (src) => {
    const svg = new Image();
    svg.src = src;
    await svg.decode();
    const canvas = document.createElement("canvas");
    canvas.width = 1080;
    canvas.height = 878;
    const context = canvas.getContext("2d");
    context.fillStyle = "#0b0910";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(svg, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/webp", 0.85).split(",")[1];
  }, source);
  await writeFile("public/visuals/core.webp", Buffer.from(image, "base64"));
} finally {
  await browser.close();
}
