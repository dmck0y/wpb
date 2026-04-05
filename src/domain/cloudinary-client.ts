import type { Asset, Env, CloudinaryResponse } from "./types";

const CACHE_TTL_SECONDS = 300; // 5 minutes

export class CloudinaryClient {
  private env: Env;

  constructor(env: Env) {
    this.env = env;
  }

  async fetchAssets(): Promise<Asset[]> {
    const url = `https://api.cloudinary.com/v1_1/${this.env.CLOUD_NAME}/resources/image/upload?prefix=wpb&max_results=999&type=upload`;

    const cache = caches.default;
    const cacheKey = new Request(url, { method: "GET" });

    // Check cache first
    const cached = await cache.match(cacheKey);
    if (cached) {
      const data = (await cached.json()) as { images: Asset[] };
      return data.images.map((img) => ({
        ...img,
        date: new Date(img.date),
      }));
    }

    // Fetch from Cloudinary
    const auth = btoa(`${this.env.API_KEY}:${this.env.API_SECRET}`);
    const response = await fetch(url, {
      headers: {
        Authorization: `Basic ${auth}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Cloudinary API error: ${response.status}`);
    }

    const data = (await response.json()) as CloudinaryResponse;

    if (!data.resources || !Array.isArray(data.resources)) {
      throw new Error("Invalid response format from Cloudinary API");
    }

    const images: Asset[] = data.resources
      .map((resource) => ({
        uuid: resource.asset_id,
        url: resource.secure_url,
        date: new Date(resource.created_at),
      }))
      .sort((a, b) => b.date.getTime() - a.date.getTime());

    // Store transformed response in cache
    const cacheBody = JSON.stringify({ images });
    const cacheResponse = new Response(cacheBody, {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": `s-maxage=${CACHE_TTL_SECONDS}`,
      },
    });
    await cache.put(cacheKey, cacheResponse);

    return images;
  }
}

export function createCloudinaryClient(env: Env): CloudinaryClient {
  return new CloudinaryClient(env);
}
