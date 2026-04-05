import type { MiddlewareHandler } from "hono";

const ALLOWED_ORIGINS = new Set([
  "https://www.wastepaperbasket.ca",
  "https://wastepaperbasket.ca",
  "http://localhost:3000",
  "http://localhost:8787",
  "http://localhost:5173",
]);

export function corsHeaders(origin: string | null): Record<string, string> {
  const headers: Record<string, string> = {};

  if (origin && ALLOWED_ORIGINS.has(origin)) {
    headers["Access-Control-Allow-Origin"] = origin;
    headers["Access-Control-Allow-Methods"] = "GET,OPTIONS";
    headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization";
    headers["Access-Control-Allow-Credentials"] = "true";
    headers["Vary"] = "Origin";
  }

  return headers;
}

export const corsMiddleware: MiddlewareHandler = async (c, next) => {
  const origin = c.req.header("origin") ?? null;
  const headers = corsHeaders(origin);

  if (c.req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers });
  }

  await next();

  for (const [key, value] of Object.entries(headers)) {
    c.res.headers.set(key, value);
  }
};
