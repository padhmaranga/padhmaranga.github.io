import { readFile } from "node:fs/promises";
import { chromium } from "@playwright/test";

const portrait = await readFile("public/images/padhmaranga-rajarathne.webp");
const browser = await chromium.launch();
try {
  const page = await browser.newPage({
    viewport: { width: 1200, height: 630 },
  });
  await page.setContent(`<!doctype html><html lang="en"><meta charset="utf-8"><style>
 *{box-sizing:border-box}body{background:#0b0910;color:#f4eff9;margin:0;font-family:Arial,sans-serif}
 main{position:absolute;inset:38px;border:1px solid #453351;border-radius:16px;background:radial-gradient(ellipse at 77% 48%,#322343,transparent 68%);display:grid;grid-template-columns:1fr 410px;gap:30px;align-items:center;padding:48px}
 .mark{font-size:27px;font-weight:bold;letter-spacing:-2px}.mark b,em{color:#d5baff}h1{font-size:69px;letter-spacing:-4.7px;line-height:1;margin:34px 0 15px}em{font-style:normal}.role{font-size:25px;font-weight:bold;margin:0}.tag{color:#c8bdd5;font-size:18px;margin:24px 0 0}img{width:410px;height:410px;object-fit:cover;border-radius:13px;border:1px solid #674f76}
 </style><main><div><div class="mark">PR<b>.</b></div><h1>Padhmaranga<br><em>Rajarathne.</em></h1><p class="role">Senior Game Developer &amp; Software Engineer</p><p class="tag">Unreal Engine · Unity · Applied AI</p></div><img src="data:image/webp;base64,${portrait.toString("base64")}" alt=""></main></html>`);
  await page.screenshot({ path: "public/visuals/share.png" });
} finally {
  await browser.close();
}
