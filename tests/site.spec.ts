import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { mkdir, readFile } from "node:fs/promises";

async function cleanPage(page: Page, visit: () => Promise<void>) {
  const problems: string[] = [];
  page.on("pageerror", (error) => problems.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") problems.push(message.text());
  });
  page.on("response", (response) => {
    if (response.status() >= 400)
      problems.push(response.status() + " " + response.url());
  });
  await visit();
  expect(problems).toEqual([]);
}

test("home, section anchors and desktop screenshot", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await cleanPage(page, async () => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto("./");
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "Padhmaranga Rajarathne",
    );
    await expect(page.locator(".core")).toHaveAttribute(
      "data-core-render",
      "poster",
    );
    await expect(page.locator(".core canvas")).toHaveCount(0);
    await page.evaluate(() => document.fonts.ready);
    await mkdir("artifacts/screenshots", { recursive: true });
    await page.screenshot({ path: "artifacts/screenshots/home-desktop.png" });
    await page
      .getByRole("navigation", { name: "Main navigation" })
      .getByRole("link", { name: "Projects" })
      .click();
    await expect(page).toHaveURL(/#work$/);
    await expect(
      page.getByRole("link", { name: "Projects", exact: true }),
    ).toHaveAttribute("aria-current", "location");
  });
});

for (const width of [360, 390, 768, 1024, 1440, 1920]) {
  test("responsive width " + width, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.setViewportSize({ width, height: 900 });
    for (const route of [
      "./",
      "work/",
      "work/unity-webgl-character-customizer/",
      "writing/",
      "research/",
    ]) {
      await page.goto(route);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - window.innerWidth,
      );
      expect(overflow, route + " overflows at " + width).toBeLessThanOrEqual(1);
      if (width === 390 || width === 1440) {
        await mkdir("artifacts/screenshots", { recursive: true });
        await page.evaluate(() => document.fonts.ready);
        await page.screenshot({
          path:
            "artifacts/screenshots/" +
            (route === "./"
              ? "home"
              : route.replace(/\/$/, "").replaceAll("/", "-")) +
            "-" +
            width +
            ".png",
          fullPage: true,
        });
      }
    }
  });
}

test("mobile menu supports Escape and keyboard focus", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("./");
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "Skip to content" }),
  ).toBeFocused();
  const menu = page.getByRole("button", { name: "Open menu" });
  await menu.focus();
  await page.keyboard.press("Enter");
  await expect(
    page.getByRole("button", { name: "Close menu" }),
  ).toHaveAttribute("aria-expanded", "true");
  await page.keyboard.press("Escape");
  await expect(menu).toBeFocused();
  await expect(
    page.getByRole("navigation", { name: "Main navigation" }),
  ).toBeHidden();
  await menu.click();
  await page
    .getByRole("navigation", { name: "Main navigation" })
    .getByRole("link", { name: "Contact" })
    .click();
  await expect(page).toHaveURL(/#contact$/);
  await expect(menu).toHaveAttribute("aria-expanded", "false");
});

test("filters combine, empty results reset, case-study URL refreshes", async ({
  page,
}) => {
  await cleanPage(page, async () => {
    await page.goto("work/");
    await expect(page.getByRole("status")).toHaveText("14 projects");
    await page.getByLabel("Category").selectOption("Real-Time 3D & XR");
    await page.getByLabel("Technology").selectOption("Unity");
    await page.getByRole("searchbox").fill("animation");
    await expect(page.getByRole("status")).toHaveText("1 project");
    await page.getByRole("searchbox").fill("nonexistent");
    await expect(page.getByRole("status")).toHaveText("0 projects");
    await page.getByRole("button", { name: "Reset filters" }).click();
    await expect(page.getByRole("status")).toHaveText("14 projects");
    await page
      .getByRole("link", { name: /Unity WebGL Character Customizer/ })
      .click();
    await expect(page).toHaveURL(/work\/unity-webgl-character-customizer\/$/);
    await page.reload();
    await expect(
      page.getByRole("heading", {
        name: "Unity WebGL Character Customizer",
        exact: true,
      }),
    ).toBeVisible();
  });
});

test("research sliders and WebGL fallback work", async ({ page }) => {
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (
      this: HTMLCanvasElement,
      type: string,
      ...args: unknown[]
    ) {
      return type.startsWith("webgl")
        ? null
        : Reflect.apply(original, this, [type, ...args]);
    } as typeof original;
  });
  await cleanPage(page, async () => {
    await page.goto("./");
    await expect(page.locator(".hero-portrait img")).toBeVisible();
    await page
      .getByRole("button", { name: "Enable Intelligence Core animation" })
      .click();
    await expect(
      page.getByRole("button", {
        name: "Intelligence Core animation unavailable",
      }),
    ).toBeDisabled();
    await expect(page.locator(".core canvas")).toHaveCount(0);
    await page.goto("research/");
    const speed = page.getByRole("slider", { name: /Starting speed/ });
    await speed.focus();
    await page.keyboard.press("End");
    await expect(page.getByText("100 km/h")).toBeVisible();
    await expect(page.getByText("54.6 m")).toBeVisible();
    await page.getByRole("button", { name: "Reset" }).click();
    await expect(speed).toHaveValue("80");
    await page.getByRole("button", { name: "Show 3D view" }).click();
    await expect(page.getByText("3D requires WebGL 2.")).toBeVisible();
  });
});

test("WebGL hero and optional twin initialize with software rendering", async ({
  browser,
  baseURL,
}) => {
  const chromium = await browser.browserType().launch({
    args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"],
  });
  try {
    const page = await chromium.newPage({
      baseURL,
      viewport: { width: 1440, height: 900 },
    });
    await cleanPage(page, async () => {
      await page.goto("./");
      await page.locator(".core").hover();
      await expect(page.locator(".core")).toHaveAttribute(
        "data-core-render",
        "webgl",
        { timeout: 20_000 },
      );
      await mkdir("artifacts/screenshots", { recursive: true });
      await page.waitForTimeout(800);
      await page.screenshot({ path: "artifacts/screenshots/home-webgl.png" });
      await page
        .getByRole("button", { name: "Pause Intelligence Core animation" })
        .click();
      await expect(
        page.getByRole("button", { name: "Play Intelligence Core animation" }),
      ).toBeVisible();
      await page
        .getByRole("button", { name: "Play Intelligence Core animation" })
        .click();
      await page.goto("research/");
      await page.getByRole("button", { name: "Show 3D view" }).click();
      await page.locator("#sandbox-3d").scrollIntoViewIfNeeded();
      await expect(page.locator("#sandbox-3d canvas")).toBeVisible({
        timeout: 20_000,
      });
    });
  } finally {
    await chromium.close();
  }
});

test("principal routes pass automated WCAG 2.2 AA checks", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const route of [
    "./",
    "work/",
    "work/unity-webgl-character-customizer/",
    "writing/",
    "research/",
    "recruiter/",
    "contact/",
    "lab/",
  ]) {
    await page.goto(route);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(results.violations, route).toEqual([]);
  }
});

test("lab controls change their displays and lighting loads only on request", async ({
  page,
}) => {
  await page.goto("lab/");
  await page.getByText("Neural Network Explorer", { exact: true }).click();
  await page.getByRole("slider", { name: "Input strength" }).focus();
  await page.keyboard.press("End");
  await expect(page.getByText("Input 1.00", { exact: false })).toBeVisible();
  await page.getByText("System Architecture Explorer", { exact: true }).click();
  await page.getByRole("button", { name: "Static host" }).click();
  await expect(
    page.getByText("Serves HTML, styles and scripts", { exact: false }),
  ).toBeVisible();
  await page.getByText("Real-Time 3D Showcase", { exact: true }).click();
  await expect(page.locator("#lighting-demo canvas")).toHaveCount(0);
  await page.getByRole("button", { name: "Load lighting controls" }).click();
  const roughness = page.getByRole("slider", { name: /Surface roughness/ });
  await roughness.focus();
  await page.keyboard.press("End");
  await expect(roughness).toHaveValue("1");
});

test("landscape and JavaScript-free navigation retain core content", async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    baseURL,
    viewport: { width: 844, height: 390 },
  });
  try {
    const page = await context.newPage();
    await page.goto("./");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.locator(".hero-portrait img")).toBeVisible();
    await page.getByRole("link", { name: "View Projects" }).click();
    await expect(
      page.getByRole("heading", { name: "Projects", level: 1 }),
    ).toBeVisible();
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBeLessThanOrEqual(844);
  } finally {
    await context.close();
  }
});

test("the AR clip plays locally and profile routes link to public sources", async ({
  page,
}) => {
  {
    const route = "work/web-ar-character-simulation/";
    const mediaRequests: string[] = [];
    const onRequest = (request: { url(): string }) => {
      if (request.url().endsWith(".mp4")) mediaRequests.push(request.url());
    };
    page.on("request", onRequest);
    await page.goto(route);
    const video = page.locator("video");
    await expect(video).toHaveAttribute("preload", "none");
    await expect(video).toHaveAttribute("poster", /still\.webp$/);
    await expect(video.locator("track")).toHaveAttribute("kind", "captions");
    expect(mediaRequests).toHaveLength(0);
    await page.getByRole("link", { name: "Watch the project capture" }).click();
    await expect(page).toHaveURL(/#project-capture$/);
    await video.evaluate(async (element) => {
      await (element as HTMLVideoElement).play();
    });
    await expect
      .poll(() =>
        video.evaluate((element) => (element as HTMLVideoElement).currentTime),
      )
      .toBeGreaterThan(0);
    await video.evaluate((element) => (element as HTMLVideoElement).pause());
    page.off("request", onRequest);
  }
  await page.goto("experience/");
  await expect(page.getByText(/Dubai, UAE/)).toBeVisible();
  await page.getByText(/CeylonX Corporation.*Colombo/).click();
  await expect(
    page.getByRole("link", { name: "CeylonX company portfolio" }),
  ).toHaveAttribute("href", "https://ceylonx.co/portfolio/");
  await page.goto("education/");
  await expect(
    page.getByText(/Kingston University.*In progress/),
  ).toBeVisible();
  await page.goto("products/");
  await expect(
    page.getByRole("link", { name: /on the App Store/ }),
  ).toHaveCount(7);
  await page.goto("writing/");
  await expect(
    page.getByRole("link", { name: /Read on LinkedIn/ }),
  ).toHaveCount(4);
  await page.goto("contact/");
  await expect(
    page.getByRole("link", { name: "Connect on LinkedIn" }),
  ).toHaveAttribute(
    "href",
    "https://www.linkedin.com/in/padhmaranga-madhurshika/",
  );
});

const deckVideos = [
  [
    "unreal-multiplayer-gameplay",
    "1BIKn6RFSg-SReR0Xl0EKtOJoldJ5zmNF",
    "unreal-multiplayer/showcase.webp",
  ],
  [
    "conversational-character-assistant",
    "1xr31STcE61oxGjDg3LLm6hFKqq7Ox8sH",
    "character-assistant/showcase.webp",
  ],
  [
    "motionbridge",
    "15cVSgqv5jATC6SaGe4DngJvXaiyARAgK",
    "motionbridge/motion-preview.webp",
  ],
  [
    "unity-webgl-character-customizer",
    "1uNnXro_Z3ZXvlJjugu6FIIeKc_zAticQ",
    "dashbo/character-hub.webp",
  ],
] as const;

test("case study stills and Drive videos match the deck", async ({ page }) => {
  await page.route("https://drive.google.com/file/d/*/preview", (route) =>
    route.fulfill({
      body: "Preview request verified",
      contentType: "text/plain",
    }),
  );
  for (const [slug, id, cover] of deckVideos) {
    await page.goto("work/" + slug + "/");
    await expect(page.locator(".case-hero img")).toHaveAttribute(
      "src",
      new RegExp(cover.replace(".", "\\.") + "$"),
    );
    await expect(page.locator("iframe")).toHaveCount(0);
    const clip = page.locator("#project-capture");
    const drive = "https://drive.google.com/file/d/" + id;
    await expect(
      clip.getByRole("link", { name: "Open in Google Drive" }),
    ).toHaveAttribute("href", drive + "/view");
    await page.getByRole("link", { name: "Watch the project capture" }).click();
    await expect(page).toHaveURL(/#project-capture$/);
    await clip.getByRole("button", { name: "Load video" }).click();
    await expect(clip.locator("iframe")).toHaveAttribute(
      "src",
      drive + "/preview",
    );
    await clip.getByRole("button", { name: "Hide video" }).click();
    await expect(clip.locator("iframe")).toHaveCount(0);
  }
  await page.goto("work/blender-python-pipeline/");
  await expect(page.locator(".case-hero img")).toHaveAttribute(
    "src",
    /blender-pipeline\/variants\.webp$/,
  );
  await expect(page.locator(".case-content img")).toHaveCount(2);
});

test("client-branded media is available in the local review build", async ({
  page,
}) => {
  test.skip(
    process.env.PORTFOLIO_LOCAL_MEDIA_REVIEW !== "1" ||
      !!process.env.NEXT_PUBLIC_SITE_URL,
  );
  const entries: Record<string, { videos: { driveId: string }[] }> = JSON.parse(
    await readFile("private/media-review/deck/local-review.json", "utf8"),
  );
  for (const slug of ["unreal-alpha-gameplay", "smart-npc-digital-library"]) {
    const id = entries[slug].videos[0].driveId;
    await page.goto("work/" + slug + "/");
    await expect(page.locator(".case-hero img")).toHaveAttribute(
      "src",
      /^data:image\/webp;base64,/,
    );
    await expect(
      page.getByRole("link", { name: "Open in Google Drive" }),
    ).toHaveAttribute(
      "href",
      "https://drive.google.com/file/d/" + id + "/view",
    );
  }
});

test("captioned project covers stay clear of captions while scrolling", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("work/unity-webgl-character-customizer/");
    const figure = page.locator(".case-hero");
    await figure.evaluate((element) =>
      element.scrollIntoView({ block: "start", behavior: "instant" }),
    );
    const clearance = await figure.evaluate((element) => {
      const image = element.querySelector("img")!;
      const caption = element.querySelector("figcaption")!;
      return (
        caption.getBoundingClientRect().top -
        image.getBoundingClientRect().bottom
      );
    });
    expect(clearance).toBeGreaterThanOrEqual(-0.5);
  }
});
