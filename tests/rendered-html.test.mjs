import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

function extractBlock(source, startToken, endToken) {
  const start = source.indexOf(startToken);
  assert.notEqual(start, -1, `Missing start token: ${startToken}`);
  const end = endToken ? source.indexOf(endToken, start) : source.length;
  assert.notEqual(end, -1, `Missing end token after: ${startToken}`);
  return source.slice(start, end);
}

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the public corporate site", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /JONED/);
  assert.match(html, /Reliable freight movement backed by clearer operations/);
  assert.match(html, /A public company site for services, recruiting, and contact/);
  assert.match(html, /ABOUT JONED/);
  assert.match(html, /Work with JONED/);
  assert.match(html, /Owner Operators/);
  assert.match(html, /Portal access/);
  assert.doesNotMatch(html, /Azure SQL|Gusto|PNC|OneRail|Frayt|ELD/);
});

test("02A.02 source includes interface-only role navigation", async () => {
  const [page, contract, reportsAdapter, reportsRoute] = await Promise.all([
    readFile(new URL("app/portal/page.tsx", root), "utf8"),
    readFile(new URL("contracts/mock-api.v1.json", root), "utf8"),
    readFile(new URL("app/reports-api.ts", root), "utf8"),
    readFile(new URL("app/api/v1/reports/route.ts", root), "utf8"),
  ]);

  for (const role of ["administration", "operations", "human-resources", "drivers", "executive"]) {
    assert.match(page, new RegExp(role));
    assert.match(contract, new RegExp(role));
  }

  assert.match(page, /role-switcher/);
  assert.match(page, /locked/);
  assert.match(page, /Error mock controlado/);
  assert.match(page, /Loading mock/);
  assert.match(page, /Partial data/);
  assert.match(page, /MODO MOCK · FIXTURES LOCALES/);
  assert.match(page, /Retry/);
  assert.match(page, /Filtros persistentes|Filtro persistente/);
  assert.match(page, /selección y detalle expandible desde fixtures locales/);
  assert.match(page, /Frontend mock \/ backend real/);
  assert.match(page, /Formulario base preparado para futura sustitución por API real/);
  assert.match(page, /Responsable visible/);
  assert.match(page, /Subflujo/);
  assert.match(page, /API desacoplada/);
  assert.match(page, /Cache key:/);
  assert.match(page, /Mock mode activo con fixtures locales exclusivamente/);
  assert.match(page, /API real futura deshabilitada en esta fase/);
  assert.match(page, /Reportes api-real/);
  assert.match(page, /Fallback a mock para Reportes/);
  assert.match(page, /Switch strategy: env flag \+ adapter registry \+ contract parity checks/);
  assert.match(page, /mock ↔ API/);
  assert.match(page, /fixtures locales/);
  assert.match(reportsAdapter, /resolveIntegrationMode/);
  assert.match(reportsAdapter, /normalizeReportsApiPayload/);
  assert.match(reportsAdapter, /Approved reports API payload did not include reportCatalog entries/);
  assert.match(reportsRoute, /REPORTS_API_MODE_DISABLED/);
  assert.match(reportsRoute, /REPORTS_API_URL_MISSING/);
  assert.match(reportsRoute, /REPORTS_UPSTREAM_UNREACHABLE/);
  assert.match(contract, /interfaceOnlyPermissions/);
  assert.match(contract, /DomainWorkspaceContract/);
  assert.match(contract, /AdapterBoundary/);
  assert.match(contract, /acciones-por-rol/);
  assert.match(contract, /1\.5\.0-02A\.06/);
  assert.match(contract, /sharedUiPatterns/);
  assert.match(contract, /filtros-persistentes/);
  assert.match(contract, /estado-partial-data/);
  assert.match(contract, /seleccion-de-filas/);
  assert.match(contract, /integrationMode/);
  assert.match(contract, /switchStrategy/);
  assert.match(contract, /ListPayloadContract/);
  assert.match(contract, /DetailPayloadContract/);
  assert.match(contract, /ErrorResponseContract/);
  assert.match(contract, /EmptyStateContract/);
  assert.match(contract, /PartialResponseContract/);
  assert.match(contract, /integrationBoundaries/);
  assert.match(contract, /api-real/);
  assert.match(contract, /QueryState/);
  assert.match(contract, /PaginationMeta/);
  assert.match(contract, /No Azure SQL real, Graph, email, document intake, SharePoint operational/);
  assert.match(contract, /02A\.06 aligns list and detail payloads/);
  assert.match(contract, /Role-based navigation in 02A\.02 controls only interface visibility/);
});

test("role matrix keeps the approved Reportes visibility boundary", async () => {
  const [page, contract] = await Promise.all([
    readFile(new URL("app/portal/page.tsx", root), "utf8"),
    readFile(new URL("contracts/mock-api.v1.json", root), "utf8"),
  ]);

  const operationsBlock = extractBlock(page, "operations: {", '"human-resources": {');
  const hrBlock = extractBlock(page, '"human-resources": {', "drivers: {");
  const driversBlock = extractBlock(page, "drivers: {", "executive: {");
  const executiveBlock = extractBlock(page, "executive: {", "};");
  const adminContractRole = extractBlock(contract, '"id": "administration"', '"id": "operations"');
  const operationsContractRole = extractBlock(contract, '"id": "operations"', '"id": "human-resources"');
  const hrContractRole = extractBlock(contract, '"id": "human-resources"', '"id": "drivers"');
  const driversContractRole = extractBlock(contract, '"id": "drivers"', '"id": "executive"');
  const executiveContractRole = extractBlock(contract, '"id": "executive"', "  ]");

  assert.match(page, /administration:\s*\{[\s\S]*?modules:\s*modules\.map/);
  assert.match(operationsBlock, /"Reportes"/);
  assert.match(hrBlock, /"Reportes"/);
  assert.match(executiveBlock, /"Reportes"/);
  assert.match(driversBlock, /"Configuración"/);
  assert.doesNotMatch(driversBlock, /"Reportes"/);

  assert.match(adminContractRole, /"Reportes"/);
  assert.match(operationsContractRole, /"Reportes"/);
  assert.match(hrContractRole, /"Reportes"/);
  assert.match(executiveContractRole, /"Reportes"/);
  assert.doesNotMatch(driversContractRole, /"Reportes"/);
});

test("Reportes keeps the approved mock-only action and state guardrails", async () => {
  const page = await readFile(new URL("app/portal/page.tsx", root), "utf8");

  assert.match(page, /Reportes:\s*\{[\s\S]*title:\s*"Decisiones con perspectiva"/);
  assert.match(page, /Reportes:\s*\{[\s\S]*state:\s*"partial"/);
  assert.match(page, /Reportes:\s*\{[\s\S]*label:\s*"Solicitar reporte"[\s\S]*permission:\s*"create"[\s\S]*when:\s*"always"/);
  assert.match(page, /Reportes:\s*\{[\s\S]*label:\s*"Abrir dashboard"[\s\S]*permission:\s*"view"[\s\S]*when:\s*"ready"/);
  assert.match(page, /Reportes:\s*\{[\s\S]*label:\s*"Exportar vista"[\s\S]*permission:\s*"export-mock"[\s\S]*when:\s*"partial"/);
  assert.match(page, /internalTabs:\s*\[[\s\S]*label:\s*"Catálogo"[\s\S]*label:\s*"Widgets"[\s\S]*label:\s*"Programación"/);
  assert.match(page, /hint:\s*"No operativa"/);
  assert.match(page, /futureSource:\s*"Reporting API"/);
  assert.match(page, /cacheKey:\s*"reports-workspace"/);
  assert.match(page, /Sin mezcla financiera real/);
});

test("frontend source preserves api-real rollback and non-operational filtering for Reportes", async () => {
  const [page, reportsAdapter, reportsRoute] = await Promise.all([
    readFile(new URL("app/portal/page.tsx", root), "utf8"),
    readFile(new URL("app/reports-api.ts", root), "utf8"),
    readFile(new URL("app/api/v1/reports/route.ts", root), "utf8"),
  ]);

  assert.match(page, /reportsIntegrationEnabled = name === "Reportes" && globalIntegrationMode === "api-real"/);
  assert.match(page, /Fallback a mock para Reportes:/);
  assert.match(page, /source:\s*"mock-fallback"/);
  assert.match(page, /Reportes remains in mock mode until explicit api-real activation\./);
  assert.match(page, /action\.label === "Solicitar reporte" \|\| action\.label === "Exportar vista"/);
  assert.match(page, /Reportes puede usar una ruta read-only controlada; los demás dominios siguen en mock\./);
  assert.match(page, /Reportes usa una ruta read-only controlada con fallback a mock\./);

  assert.match(reportsAdapter, /if \(globalMode === "api-real" && domainMode === "api-real"\)/);
  assert.match(reportsAdapter, /throw new Error\("Approved reports API payload did not include reportCatalog entries\."\)/);
  assert.match(reportsAdapter, /resolvedState === "partial"/);
  assert.match(reportsAdapter, /API real de solo lectura activa para Reportes\./);

  assert.match(reportsRoute, /allowedMode !== "api-real" \|\| allowedDomainMode !== "api-real"/);
  assert.match(reportsRoute, /REPORTS_API_MODE_DISABLED/);
  assert.match(reportsRoute, /REPORTS_API_URL_MISSING/);
  assert.match(reportsRoute, /REPORTS_UPSTREAM_UNREACHABLE/);
  assert.match(reportsRoute, /cache-control": "no-store"/);
});

test("owner operators page keeps the public intake framing", async () => {
  const ownerPage = await readFile(new URL("app/owner-operators/page.tsx", root), "utf8");

  assert.match(ownerPage, /Owner-operator intake\./);
  assert.match(ownerPage, /Start your owner-operator profile with Joned Transpor Co\./);
  assert.match(ownerPage, /owner-operators/);
  assert.match(ownerPage, /PublicHeader/);
  assert.match(ownerPage, /PublicFooter/);
  assert.doesNotMatch(ownerPage, /Apply through the path that fits your operation/);
});

test("drivers page keeps the public driver intake framing", async () => {
  const driversPage = await readFile(new URL("app/drivers/page.tsx", root), "utf8");
  const driversForm = await readFile(new URL("app/drivers/prequalification-form.tsx", root), "utf8");

  assert.match(driversPage, /Driver intake\./);
  assert.match(driversPage, /Start your driver profile with Joned Transpor Co\./);
  assert.match(driversPage, /drivers/);
  assert.match(driversPage, /PublicHeader/);
  assert.match(driversPage, /PublicFooter/);
  assert.match(driversPage, /DriversPrequalificationForm/);
  assert.match(driversForm, /Driver prequalification/);
  assert.match(driversForm, /P3/);
  assert.match(driversForm, /P4/);
  assert.match(driversForm, /No-vehicle route only/);
  assert.match(driversForm, /Personal or business is allowed/);
  assert.match(driversForm, /Not every driver route requires CDL/);
  assert.match(driversForm, /This is a mock step-based intake only/);
});

test("public intake transition boundary reserves Drivers as the first review-only api-real candidate", async () => {
  const transition = await readFile(new URL("app/public-intake-transition.ts", root), "utf8");

  assert.match(transition, /type PublicIntakeDomain = "drivers" \| "owner-operators"/);
  assert.match(transition, /const reviewEligibleDomains: PublicIntakeDomain\[] = \["drivers"\]/);
  assert.match(transition, /PUBLIC_INTAKE_API_MODE/);
  assert.match(transition, /PUBLIC_INTAKE_DRIVERS_SOURCE/);
  assert.match(transition, /PUBLIC_INTAKE_OWNER_OPERATORS_SOURCE/);
  assert.match(transition, /PUBLIC_INTAKE_DRIVERS_API_URL/);
  assert.match(transition, /PUBLIC_INTAKE_OWNER_OPERATORS_API_URL/);
  assert.match(transition, /env-flag-plus-domain-allowlist-plus-contract-parity-checks-plus-mock-fallback/);
  assert.match(transition, /Domain is not approved for review-environment api-real preparation/);
});

test("public Drivers readiness pack keeps the approved route codes, flags, and parity boundary", async () => {
  const contract = await readFile(new URL("contracts/public-intake-drivers.v1.json", root), "utf8");

  assert.match(contract, /"domain": "drivers-public-intake"/);
  assert.match(contract, /"selectedFirstReviewDomain": true/);
  assert.match(contract, /"allowedRouteCodes": \["P3", "P4", "B3", "B4"\]/);
  assert.match(contract, /PUBLIC_INTAKE_API_MODE/);
  assert.match(contract, /PUBLIC_INTAKE_DRIVERS_SOURCE/);
  assert.match(contract, /PUBLIC_INTAKE_OWNER_OPERATORS_SOURCE/);
  assert.match(contract, /PUBLIC_INTAKE_DRIVERS_API_URL/);
  assert.match(contract, /PUBLIC_INTAKE_DRIVERS_CONTRACT_PARITY_FAILED/);
  assert.match(contract, /owner-operators-stays-mock/);
});

test("public Owner Operators readiness pack keeps the approved route matrix and remains outside review eligibility", async () => {
  const contract = await readFile(new URL("contracts/public-intake-owner-operators.v1.json", root), "utf8");

  assert.match(contract, /"domain": "owner-operators-public-intake"/);
  assert.match(contract, /"selectedFirstReviewDomain": false/);
  assert.match(contract, /"reviewEligibleNow": false/);
  assert.match(contract, /"allowedRouteCodes": \["P1", "P2", "P3", "P4", "B1", "B2", "B3", "B4"\]/);
  assert.match(contract, /PUBLIC_INTAKE_API_MODE/);
  assert.match(contract, /PUBLIC_INTAKE_OWNER_OPERATORS_SOURCE/);
  assert.match(contract, /PUBLIC_INTAKE_DRIVERS_SOURCE/);
  assert.match(contract, /PUBLIC_INTAKE_OWNER_OPERATORS_API_URL/);
  assert.match(contract, /PUBLIC_INTAKE_OWNER_OPERATORS_CONTRACT_PARITY_FAILED/);
  assert.match(contract, /drivers-remains-first-domain/);
});
