import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const publicSource = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
const publicShellSource = await readFile(new URL("../app/public-shell.tsx", import.meta.url), "utf8");
const portalSource = await readFile(new URL("../app/portal/page.tsx", import.meta.url), "utf8");
const layoutSource = await readFile(new URL("../app/layout.tsx", import.meta.url), "utf8");
const privateConfig = await readFile(new URL("../staticwebapp.config.json", import.meta.url), "utf8");
const privateExport = await readFile(new URL("../build/export-azure-static.mjs", import.meta.url), "utf8");
const publicExport = await readFile(new URL("../build/export-public-static.mjs", import.meta.url), "utf8");

test("public website uses English copy and the confirmed company name", () => {
  assert.match(publicShellSource, /Joned Transpor Co home/);
  assert.match(publicSource, /We move your freight and help grow/);
  assert.match(publicSource, /Mexico, the United States, and Canada/);
  assert.doesNotMatch(publicSource, /Solicitar cotización|Rastrea tu envío|Iniciar sesión|Nosotros/);
  assert.match(layoutSource, /Joned Transpor Co \| Moving freight, advancing your business/);
  assert.match(layoutSource, /og-v3\.png/);
  assert.match(publicShellSource, /href="\/services\/"/);
  assert.match(publicShellSource, /href="\/coverage\/"/);
  assert.match(publicShellSource, /href="\/about\/"/);
  assert.match(publicShellSource, /href="\/resources\/"/);
  assert.match(publicShellSource, /href="\/contact\/"/);
});

test("private portal provides English and Spanish language states", () => {
  assert.match(portalSource, /type Language = "en" \| "es"/);
  assert.match(portalSource, /const copy: Record<Language, PortalCopy>/);
  assert.match(portalSource, /onClick=\{\(\) => setLanguage\("en"\)\}/);
  assert.match(portalSource, /onClick=\{\(\) => setLanguage\("es"\)\}/);
  assert.match(portalSource, /English/);
  assert.match(portalSource, /Español/);
  assert.match(portalSource, /Continue with Microsoft Entra ID/);
  assert.match(portalSource, /Continuar con Microsoft Entra ID/);
  assert.match(portalSource, /\/\.auth\/login\/aad\?post_login_redirect_uri=\/workspace/);
});

test("public/private location boundary remains explicit", () => {
  assert.doesNotMatch(publicSource, /connected drivers|exact location|GPS position/);
  assert.match(portalSource, /Visible only after authentication and within assigned role scope/);
  assert.match(portalSource, /Visible solo después de autenticación y dentro del alcance del rol asignado/);
});

test("public and private deployment artifacts are physically separated", () => {
  assert.match(privateConfig, /"route": "\/workspace\*"/);
  assert.match(privateConfig, /"allowedRoles": \["authenticated"\]/);
  assert.match(privateConfig, /"exclude": \["\/\.auth\/\*"/);
  assert.doesNotMatch(privateExport, /owner-operators|drivers|services|coverage/);
  assert.match(privateExport, /private-portal-only/);
  assert.match(publicExport, /public-corporate-multipage/);
  assert.doesNotMatch(publicExport, /\/workspace|\/portal/);
});
