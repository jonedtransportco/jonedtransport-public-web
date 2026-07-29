import { NextResponse } from "next/server";

const allowedMode = process.env.PORTAL_API_MODE;
const allowedDomainMode = process.env.PORTAL_DOMAIN_OWNER_OPERATORS_SOURCE;
const upstreamUrl = process.env.PORTAL_OWNER_OPERATORS_API_URL;

export async function POST(request: Request) {
  if (allowedMode !== "api-real" || allowedDomainMode !== "api-real") {
    return NextResponse.json(
      {
        error: {
          code: "OWNER_OPERATORS_API_MODE_DISABLED",
          message: "Owner-operator api-real is disabled. Keep the domain in mock mode until explicit activation.",
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
          code: "OWNER_OPERATORS_API_URL_MISSING",
          message: "No approved owner-operator API URL is configured for controlled review activation.",
          retryable: false,
        },
      },
      { status: 503 },
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      {
        error: {
          code: "OWNER_OPERATORS_INVALID_PAYLOAD",
          message: "The owner-operator submission body is not valid JSON.",
          retryable: false,
        },
      },
      { status: 400 },
    );
  }

  let upstreamResponse: Response;
  try {
    upstreamResponse = await fetch(upstreamUrl, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });
  } catch {
    return NextResponse.json(
      {
        error: {
          code: "OWNER_OPERATORS_UPSTREAM_UNREACHABLE",
          message: "The approved owner-operator API could not be reached from the controlled portal route.",
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
