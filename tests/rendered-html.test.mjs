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
  const [page, contract] = await Promise.all([
    readFile(new URL("app/page.tsx", root), "utf8"),
    readFile(new URL("contracts/mock-api.v1.json", root), "utf8"),
  ]);

  for (const role of ["administration", "operations", "human-resources", "drivers", "executive"]) {
    assert.match(page, new RegExp(role));
    assert.match(contract, new RegExp(role));
  }

  assert.match(page, /role-switcher/);
  assert.match(page, /locked/);
  assert.match(page, /Error mock controlado/);
  assert.match(contract, /interfaceOnlyPermissions/);
  assert.match(contract, /Role-based navigation in 02A\.02 controls only interface visibility/);
});
