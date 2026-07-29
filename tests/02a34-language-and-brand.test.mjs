import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const publicSource = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
const portalSource = await readFile(new URL("../app/portal/page.tsx", import.meta.url), "utf8");
const layoutSource = await readFile(new URL("../app/layout.tsx", import.meta.url), "utf8");

test("public website uses English copy and the confirmed company name", () => {
  assert.match(publicSource, /Joned Transpor Co home/);
  assert.match(publicSource, /We move your freight and help grow/);
  assert.match(publicSource, /Mexico, the United States, and Canada/);
  assert.match(publicSource, /Public status without exposing operations/);
  assert.match(publicSource, /Contact Joned Transpor Co/);
  assert.doesNotMatch(publicSource, /Solicitar cotización|Rastrea tu envío|Iniciar sesión|Nosotros/);
  assert.match(layoutSource, /Joned Transpor Co \| Moving freight, advancing your business/);
  assert.match(layoutSource, /og-v3\.png/);
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
});

test("public/private location boundary remains explicit", () => {
  assert.match(publicSource, /does not expose driver names, GPS position, stops/);
  assert.match(portalSource, /Visible only after authentication and within assigned role scope/);
  assert.match(portalSource, /Visible solo después de autenticación y dentro del alcance del rol asignado/);
});
