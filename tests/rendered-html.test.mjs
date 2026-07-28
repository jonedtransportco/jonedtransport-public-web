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

test("server-renders the governed portal foundation", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /JONED/);
  assert.match(html, /Buenos días, Alex\./);
  assert.match(html, /Resumen ejecutivo/);
  assert.doesNotMatch(html, /Azure SQL|Gusto|PNC|OneRail|Frayt|ELD/);
});

test("02A.02 source includes interface-only role navigation", async () => {
  const [page, contract, reportsAdapter, reportsRoute] = await Promise.all([
    readFile(new URL("app/page.tsx", root), "utf8"),
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
    readFile(new URL("app/page.tsx", root), "utf8"),
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
  const page = await readFile(new URL("app/page.tsx", root), "utf8");

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
    readFile(new URL("app/page.tsx", root), "utf8"),
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
