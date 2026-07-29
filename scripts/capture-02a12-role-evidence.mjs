import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { chromium, devices } from "/Users/JonedTransportCo/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs";

const baseUrl = process.env.PORTAL_BASE_URL ?? "http://127.0.0.1:3100";
const evidenceDir = path.resolve("evidence");
const chromeExecutable = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const roleFilter = process.env.ROLE_FILTER?.trim();
const modeFilter = process.env.MODE_FILTER?.trim();

const desktop = { width: 1440, height: 1600 };
const mobileDevice = devices["iPhone 14"];

const roleScenarios = [
  {
    id: "Admin",
    roleButton: "Admin",
    desktopFile: "02A.12_Admin_Desktop_v1.0.png",
    mobileFile: "02A.12_Admin_Mobile_v1.0.png",
    module: "Reportes",
    search: "REP",
    tab: "detalle",
    note: "Admin with full mock visibility on Reportes.",
  },
  {
    id: "Ops",
    roleButton: "Ops",
    desktopFile: "02A.12_Ops_Desktop_v1.0.png",
    mobileFile: "02A.12_Ops_Mobile_v1.0.png",
    module: "Reportes",
    search: "widgets",
    tab: "resumen",
    note: "Operations with Reportes visible and request affordance only.",
  },
  {
    id: "HR",
    roleButton: "HR",
    desktopFile: "02A.12_HR_Desktop_v1.0.png",
    mobileFile: "02A.12_HR_Mobile_v1.0.png",
    module: "Reportes",
    search: "People",
    tab: "listado",
    note: "HR with Reportes visible and read-oriented partial state.",
  },
  {
    id: "Driver",
    roleButton: "Driver",
    desktopFile: "02A.12_Driver_Desktop_v1.0.png",
    mobileFile: "02A.12_Driver_Mobile_v1.0.png",
    module: "Conductores",
    search: "driver",
    tab: "resumen",
    note: "Driver role with Reportes absent from navigation.",
  },
  {
    id: "Executive",
    roleButton: "Exec",
    desktopFile: "02A.12_Executive_Desktop_v1.0.png",
    mobileFile: "02A.12_Executive_Mobile_v1.0.png",
    module: "Reportes",
    search: "REP",
    tab: "listado",
    note: "Executive read-only with visual export affordance in Reportes.",
  },
].filter((scenario) => !roleFilter || scenario.id === roleFilter);

async function signIn(page) {
  console.log("goto", baseUrl);
  await page.goto(baseUrl, { waitUntil: "domcontentloaded" });
  await page.waitForLoadState("networkidle");
  const accessButton = page.getByRole("button", { name: /Acceso al portal|Entrar con Microsoft/ });
  await accessButton.first().click();
  await page.waitForSelector(".app-shell");
}

async function setRole(page, roleButton, isMobile) {
  console.log("role", roleButton);
  if (isMobile) {
    await page.getByRole("button", { name: "Abrir menú" }).click();
    await page.waitForTimeout(150);
  }
  await page.locator(".role-switcher button", { hasText: roleButton }).click();
  await page.waitForTimeout(150);
}

async function openModule(page, moduleName, isMobile) {
  console.log("module", moduleName, isMobile ? "mobile" : "desktop");
  if (isMobile) {
    const sidebarOpen = await page.locator(".sidebar.open").count();
    if (!sidebarOpen) {
      await page.getByRole("button", { name: "Abrir menú" }).click();
      await page.waitForTimeout(150);
    }
  }

  const target = page.locator(".side-nav button").filter({ hasText: moduleName }).first();
  await target.click();
  await page.waitForTimeout(250);
}

async function applySearch(page, value) {
  console.log("search", value);
  const search = page.getByLabel("Buscar");
  await search.fill("");
  await search.fill(value);
  await page.waitForTimeout(250);
}

async function openTab(page, tab) {
  console.log("tab", tab);
  const labels = {
    listado: "Listado",
    detalle: "Detalle",
    resumen: "Resumen",
    formulario: "Formulario",
  };
  await page.locator(".tab-row").getByRole("button", { name: new RegExp(`^${labels[tab]}$`, "i") }).click();
  await page.waitForTimeout(200);
}

async function prepareScenario(page, scenario, isMobile) {
  await signIn(page);
  await setRole(page, scenario.roleButton, isMobile);
  await openModule(page, scenario.module, isMobile);
  await applySearch(page, scenario.search);
  await openTab(page, scenario.tab);
}

async function captureOne(browser, scenario, isMobile) {
  console.log("capture", scenario.id, isMobile ? "mobile" : "desktop");
  const context = await browser.newContext(
    isMobile
      ? {
          ...mobileDevice,
          viewport: mobileDevice.viewport,
        }
      : {
          viewport: desktop,
          deviceScaleFactor: 1,
        },
  );
  const page = await context.newPage();
  await prepareScenario(page, scenario, isMobile);

  const clipTarget = page.locator(isMobile ? ".main-panel" : ".content");
  await clipTarget.screenshot({
    path: path.join(evidenceDir, isMobile ? scenario.mobileFile : scenario.desktopFile),
  });

  await context.close();
}

async function main() {
  await mkdir(evidenceDir, { recursive: true });
  const browser = await chromium.launch({ headless: true, executablePath: chromeExecutable });

  try {
    for (const scenario of roleScenarios) {
      if (!modeFilter || modeFilter === "desktop") {
        await captureOne(browser, scenario, false);
      }
      if (!modeFilter || modeFilter === "mobile") {
        await captureOne(browser, scenario, true);
      }
    }

    await writeFile(
      path.join(evidenceDir, "02A.12_capture_manifest_v1.0.json"),
      JSON.stringify(
        {
          packageId: "02A.12",
          baseUrl,
          generatedAt: new Date().toISOString(),
          roles: roleScenarios,
        },
        null,
        2,
      ),
      "utf8",
    );
  } finally {
    await browser.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
