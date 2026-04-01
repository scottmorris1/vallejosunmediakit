import fs from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";

const outputDir = path.resolve("generated");

const targets = [
  {
    name: "horizontal",
    url: "https://vallejosunmediakit.pages.dev/vallejosun_membership_thermometer?mode=horizontal",
    width: 970,
    height: 250,
    output: path.join(outputDir, "membership-horizontal.png")
  },
  {
    name: "vertical",
    url: "https://vallejosunmediakit.pages.dev/vallejosun_membership_thermometer?mode=vertical",
    width: 300,
    height: 600,
    output: path.join(outputDir, "membership-vertical.png")
  },
  {
    name: "wide",
    url: "https://vallejosunmediakit.pages.dev/vallejosun_membership_thermometer?mode=wide",
    width: 1200,
    height: 300,
    output: path.join(outputDir, "membership-wide.png")
  }
];

async function ensureOutputDir() {
  await fs.mkdir(outputDir, { recursive: true });
}

async function renderTarget(browser, target) {
  const page = await browser.newPage({
    viewport: { width: target.width, height: target.height },
    deviceScaleFactor: 2
  });

  console.log(`Rendering ${target.name}`);

  await page.goto(target.url, { waitUntil: "networkidle" });

  // small delay to ensure fonts + data render
  await page.waitForTimeout(1000);

  await page.screenshot({
    path: target.output,
    type: "png"
  });

  await page.close();
}

async function main() {
  await ensureOutputDir();

  const browser = await chromium.launch({ headless: true });

  try {
    for (const target of targets) {
      await renderTarget(browser, target);
    }
  } finally {
    await browser.close();
  }

  console.log("Done rendering PNGs");
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
