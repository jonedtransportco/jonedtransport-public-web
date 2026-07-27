import { NextResponse } from "next/server";

const allowedMode = process.env.PORTAL_API_MODE;
const allowedDomainMode = process.env.PORTAL_DOMAIN_REPORTES_SOURCE;
const upstreamUrl = process.env.PORTAL_REPORTES_API_URL;

export async function GET(request: Request) {
  if (allowedMode !== "api-real" || allowedDomainMode !== "api-real") {
    return NextResponse.json(
      {
        error: {
          code: "REPORTS_API_MODE_DISABLED",
          message: "Reportes api-real is disabled. Keep the domain in mock mode until explicit activation.",
          retryable: false,
        },
      },
      { status: 503 },
    );
  }

  if (!upstreamUrl) {
    return NextResponse.json(
      {
        error: {
          code: "REPORTS_API_URL_MISSING",
          message: "No approved reports API URL is configured for controlled read-only activation.",
          retryable: false,
        },
      },
      { status: 503 },
    );
  }

  const sourceUrl = new URL(upstreamUrl);
  const requestUrl = new URL(request.url);
  requestUrl.searchParams.forEach((value, key) => {
    sourceUrl.searchParams.set(key, value);
  });

  let upstreamResponse: Response;
  try {
    upstreamResponse = await fetch(sourceUrl, {
      method: "GET",
      headers: {
        accept: "application/json",
      },
      cache: "no-store",
    });
  } catch {
    return NextResponse.json(
      {
        error: {
          code: "REPORTS_UPSTREAM_UNREACHABLE",
          message: "The approved reports API could not be reached from the controlled portal route.",
          retryable: true,
        },
      },
      { status: 502 },
    );
  }

  const contentType = upstreamResponse.headers.get("content-type") ?? "application/json";
  const text = await upstreamResponse.text();

  return new NextResponse(text, {
    status: upstreamResponse.status,
    headers: {
      "content-type": contentType,
      "cache-control": "no-store",
    },
  });
}
