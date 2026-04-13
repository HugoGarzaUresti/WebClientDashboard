import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

function extractCookiePairs(setCookieHeaders: string[]) {
  return setCookieHeaders
    .map((cookie) => cookie.split(";", 1)[0])
    .filter(Boolean)
    .join("; ");
}

function getSetCookieHeaders(headers: Headers) {
  if (typeof headers.getSetCookie === "function") {
    return headers.getSetCookie();
  }

  const header = headers.get("set-cookie");
  return header ? [header] : [];
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = typeof body?.email === "string" ? body.email.trim() : "";
    const password = typeof body?.password === "string" ? body.password : "";
    const callbackUrl =
      typeof body?.callbackUrl === "string" && body.callbackUrl
        ? body.callbackUrl
        : "/dashboard";

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 },
      );
    }

    const csrfResponse = await fetch(`${request.nextUrl.origin}/api/auth/csrf`, {
      headers: {
        cookie: request.headers.get("cookie") ?? "",
      },
      cache: "no-store",
    });

    if (!csrfResponse.ok) {
      return NextResponse.json(
        { error: "Unable to initialize login" },
        { status: 500 },
      );
    }

    const csrfData = (await csrfResponse.json()) as { csrfToken?: string };
    const csrfToken = csrfData.csrfToken;

    if (!csrfToken) {
      return NextResponse.json(
        { error: "Unable to initialize login" },
        { status: 500 },
      );
    }

    const csrfCookies = getSetCookieHeaders(csrfResponse.headers);
    const forwardedCookies = [request.headers.get("cookie"), extractCookiePairs(csrfCookies)]
      .filter(Boolean)
      .join("; ");

    const callbackResponse = await fetch(
      `${request.nextUrl.origin}/api/auth/callback/credentials`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          cookie: forwardedCookies,
        },
        body: new URLSearchParams({
          email,
          password,
          csrfToken,
          callbackUrl,
          json: "true",
        }),
        cache: "no-store",
        redirect: "manual",
      },
    );

    const responseData = (await callbackResponse.json()) as { url?: string };
    const error = responseData.url
      ? new URL(responseData.url, request.nextUrl.origin).searchParams.get(
          "error",
        )
      : null;

    const response = NextResponse.json(
      {
        ok: callbackResponse.ok && !error,
        url: error ? null : responseData.url ?? callbackUrl,
        error,
      },
      { status: callbackResponse.status },
    );

    for (const cookie of [...csrfCookies, ...getSetCookieHeaders(callbackResponse.headers)]) {
      response.headers.append("set-cookie", cookie);
    }

    return response;
  } catch (error) {
    console.error("Login endpoint error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
