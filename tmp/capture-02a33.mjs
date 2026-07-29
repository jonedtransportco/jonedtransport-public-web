import { chromium } from "/Users/JonedTransportCo/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs";

const browser = await chromium.launch({
  headless: true,
  executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
});
const page = await browser.newPage({
  viewport: { width: 1600, height: 1000 },
  deviceScaleFactor: 1,
});

await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
await page.screenshot({
  path: "evidence/02A.33_Public_Web_Desktop_v1.0.png",
  fullPage: true,
});

await page.goto("http://localhost:3000/portal", { waitUntil: "networkidle" });
await page.screenshot({
  path: "evidence/02A.33_Entra_Login_Desktop_v1.0.png",
  fullPage: true,
});
await page.getByRole("button", { name: "Continuar con Microsoft Entra ID" }).click();
await page.screenshot({
  path: "evidence/02A.33_Operations_Portal_Desktop_v1.0.png",
  fullPage: true,
});

const mobile = await browser.newPage({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 1,
});
await mobile.goto("http://localhost:3000/", { waitUntil: "networkidle" });
await mobile.screenshot({
  path: "evidence/02A.33_Public_Web_Mobile_v1.0.png",
  fullPage: true,
});
await mobile.goto("http://localhost:3000/portal", { waitUntil: "networkidle" });
await mobile.screenshot({
  path: "evidence/02A.33_Entra_Login_Mobile_v1.0.png",
  fullPage: true,
});

await browser.close();
