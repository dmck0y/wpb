interface Env {
  CLOUD_NAME: string;
  API_KEY: string;
  API_SECRET: string;
}

interface CloudinaryResource {
  asset_id: string;
  secure_url: string;
  created_at: string;
}

interface CloudinaryResponse {
  resources: CloudinaryResource[];
}

const ALLOWED_ORIGINS = new Set([
  "https://www.wastepaperbasket.ca",
  "https://wastepaperbasket.ca",
  "http://localhost:3000",
  "http://localhost:8788",
  "http://localhost:5173",
]);

function corsHeaders(origin: string | null): Record<string, string> {
  const headers: Record<string, string> = {
    "Access-Control-Allow-Methods": "GET,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };

  if (origin && ALLOWED_ORIGINS.has(origin)) {
    headers["Access-Control-Allow-Origin"] = origin;
    headers["Vary"] = "Origin";
    headers["Access-Control-Allow-Credentials"] = "true";
  }

  return headers;
}

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const origin = request.headers.get("origin");
  const headers = corsHeaders(origin);

  try {
    const auth = btoa(`${env.API_KEY}:${env.API_SECRET}`);
    const url = `https://api.cloudinary.com/v1_1/${env.CLOUD_NAME}/resources/image/upload?prefix=wpb&max_results=999&type=upload`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Basic ${auth}`,
      },
    });

    if (!response.ok) {
      return new Response(JSON.stringify({ error: "Cloudinary query failed" }), {
        status: 500,
        headers: { ...headers, "Content-Type": "application/json" },
      });
    }

    const data = (await response.json()) as CloudinaryResponse;

    const images = data.resources
      .map((img) => ({
        uuid: img.asset_id,
        url: img.secure_url,
        date: new Date(img.created_at),
      }))
      .sort((a, b) => b.date.getTime() - a.date.getTime());

    return new Response(JSON.stringify({ images }), {
      status: 200,
      headers: { ...headers, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: "Cloudinary query failed" }), {
      status: 500,
      headers: { ...headers, "Content-Type": "application/json" },
    });
  }
};

export const onRequestOptions: PagesFunction<Env> = async ({ request }) => {
  const origin = request.headers.get("origin");
  const headers = corsHeaders(origin);

  return new Response(null, { status: 204, headers });
};
