import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

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
  assert.match(html, /Movemos tu negocio/);
  assert.match(html, /Acceso al portal/);
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
