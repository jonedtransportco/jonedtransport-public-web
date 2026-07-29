import { cp, mkdir, rm, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const root = process.cwd();
const distRoot = resolve(root, "dist");
const clientRoot = resolve(distRoot, "client");
const serverEntry = resolve(distRoot, "server", "index.js");
const outputRoot = resolve(distRoot, "public-static");
const routes = [
  { path: "/", output: "index.html" },
  { path: "/services", output: "services/index.html" },
  { path: "/coverage", output: "coverage/index.html" },
  { path: "/about", output: "about/index.html" },
  { path: "/resources", output: "resources/index.html" },
  { path: "/contact", output: "contact/index.html" },
  { path: "/quote", output: "quote/index.html" },
  { path: "/tracking", output: "tracking/index.html" },
  { path: "/drivers", output: "drivers/index.html" },
  { path: "/drivers/es", output: "drivers/es/index.html" },
  { path: "/drivers/actions", output: "drivers/actions/index.html" },
  { path: "/drivers/actions/es", output: "drivers/actions/es/index.html" },
  { path: "/owner-operators", output: "owner-operators/index.html" },
  { path: "/owner-operators/es", output: "owner-operators/es/index.html" },
  { path: "/owner-operators/actions", output: "owner-operators/actions/index.html" },
  { path: "/owner-operators/actions/es", output: "owner-operators/actions/es/index.html" },
];

async function main() {
  await rm(outputRoot, { recursive: true, force: true });
  await mkdir(outputRoot, { recursive: true });
  await cp(clientRoot, outputRoot, { recursive: true });

  const workerUrl = pathToFileURL(serverEntry);
  workerUrl.searchParams.set("export", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  for (const route of routes) {
    const html = await renderRoute(worker, route.path);
    const outputPath = resolve(outputRoot, route.output);
    await mkdir(resolve(outputPath, ".."), { recursive: true });
    await writeFile(outputPath, html, "utf8");
  }

  await writeFile(resolve(outputRoot, ".nojekyll"), "", "utf8");
  await writeFile(resolve(outputRoot, "CNAME"), "jonedtransport.com\n", "utf8");
  await writeFile(
    resolve(outputRoot, "export-manifest.json"),
    `${JSON.stringify({
      exportedAtUtc: new Date().toISOString(),
      deploymentType: "public-corporate-multipage",
      routes: routes.map((route) => route.path),
      outputRoot: "dist/public-static",
    }, null, 2)}\n`,
    "utf8",
  );
}

async function renderRoute(worker, path) {
  const response = await worker.fetch(
    new Request(`https://jonedtransport.com${path}`, {
      headers: {
        accept: "text/html",
        host: "jonedtransport.com",
        "x-forwarded-host": "jonedtransport.com",
      },
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
