import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const root = process.cwd();
const distRoot = resolve(root, "dist");
const clientRoot = resolve(distRoot, "client");
const serverEntry = resolve(distRoot, "server", "index.js");
const outputRoot = resolve(distRoot, "azure-static");
const routes = [
  { path: "/", output: "index.html" },
  { path: "/portal", output: "portal/index.html" },
  { path: "/drivers", output: "drivers/index.html" },
  { path: "/owner-operators", output: "owner-operators/index.html" },
];

async function main() {
  await rm(outputRoot, { recursive: true, force: true });
  await mkdir(outputRoot, { recursive: true });
  await cp(clientRoot, outputRoot, { recursive: true });
  await cp(resolve(root, "staticwebapp.config.json"), resolve(outputRoot, "staticwebapp.config.json"));

  const workerUrl = pathToFileURL(serverEntry);
  workerUrl.searchParams.set("export", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  for (const route of routes) {
    const html = await renderRoute(worker, route.path);
    const outputPath = resolve(outputRoot, route.output);
    await mkdir(resolve(outputPath, ".."), { recursive: true });
    await writeFile(outputPath, html, "utf8");
  }

  const manifest = {
    exportedAtUtc: new Date().toISOString(),
    routes: routes.map((route) => route.path),
    sourceClientRoot: "dist/client",
    outputRoot: "dist/azure-static",
  };
  await writeFile(
    resolve(outputRoot, "export-manifest.json"),
    `${JSON.stringify(manifest, null, 2)}\n`,
    "utf8",
  );
}

async function renderRoute(worker, path) {
  const response = await worker.fetch(
    new Request(`http://localhost${path}`, {
      headers: { accept: "text/html" },
    }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Failed to render ${path}: ${response.status} ${body}`);
  }

  const html = await response.text();
  if (!html.includes("<!DOCTYPE html>")) {
    throw new Error(`Rendered output for ${path} did not produce a full HTML document.`);
  }

  return html;
}

await main();
