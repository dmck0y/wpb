import { describe, it, expect, vi, beforeEach } from "vitest";
import { createCloudinaryClient } from "../cloudinary-client";
import type { Env } from "../types";

const mockEnv: Env = {
  CLOUD_NAME: "test-cloud",
  API_KEY: "test-key",
  API_SECRET: "test-secret",
};

// Mock the caches.default API
const mockCache = {
  match: vi.fn(),
  put: vi.fn(),
};

vi.stubGlobal("caches", { default: mockCache });

describe("CloudinaryClient", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockCache.match.mockResolvedValue(undefined); // cache miss by default
    mockCache.put.mockResolvedValue(undefined);
  });

  it("fetches and transforms assets from Cloudinary", async () => {
    const client = createCloudinaryClient(mockEnv);

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          resources: [
            {
              asset_id: "abc123",
              secure_url: "https://res.cloudinary.com/test/image/upload/v1/wpb/photo1.jpg",
              created_at: "2024-01-15T10:00:00Z",
            },
            {
              asset_id: "def456",
              secure_url: "https://res.cloudinary.com/test/image/upload/v1/wpb/photo2.jpg",
              created_at: "2024-01-20T10:00:00Z",
            },
          ],
        }),
      })
    );

    const assets = await client.fetchAssets();

    expect(assets).toHaveLength(2);
    // Should be sorted by date descending
    expect(assets[0].uuid).toBe("def456");
    expect(assets[1].uuid).toBe("abc123");
    expect(assets[0].url).toContain("cloudinary.com");
    expect(assets[0].date).toBeInstanceOf(Date);
  });

  it("uses Basic Auth with API credentials", async () => {
    const client = createCloudinaryClient(mockEnv);

    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ resources: [] }),
    });
    vi.stubGlobal("fetch", mockFetch);

    await client.fetchAssets();

    const expectedAuth = btoa(`${mockEnv.API_KEY}:${mockEnv.API_SECRET}`);
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining(mockEnv.CLOUD_NAME),
      expect.objectContaining({
        headers: { Authorization: `Basic ${expectedAuth}` },
      })
    );
  });

  it("throws on failed API response", async () => {
    const client = createCloudinaryClient(mockEnv);

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
      })
    );

    await expect(client.fetchAssets()).rejects.toThrow(
      "Cloudinary API error: 500"
    );
  });

  it("throws on invalid response format", async () => {
    const client = createCloudinaryClient(mockEnv);

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ wrongKey: [] }),
      })
    );

    await expect(client.fetchAssets()).rejects.toThrow(
      "Invalid response format"
    );
  });

  it("returns cached response on cache hit", async () => {
    const client = createCloudinaryClient(mockEnv);

    const cachedImages = [
      {
        uuid: "cached1",
        url: "https://example.com/cached.jpg",
        date: "2024-01-15T10:00:00.000Z",
      },
    ];

    mockCache.match.mockResolvedValue({
      json: async () => ({ images: cachedImages }),
    });

    const mockFetch = vi.fn();
    vi.stubGlobal("fetch", mockFetch);

    const assets = await client.fetchAssets();

    expect(mockFetch).not.toHaveBeenCalled();
    expect(assets).toHaveLength(1);
    expect(assets[0].uuid).toBe("cached1");
    expect(assets[0].date).toBeInstanceOf(Date);
  });

  it("stores response in cache after fetching", async () => {
    const client = createCloudinaryClient(mockEnv);

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          resources: [
            {
              asset_id: "abc123",
              secure_url: "https://example.com/photo.jpg",
              created_at: "2024-01-15T10:00:00Z",
            },
          ],
        }),
      })
    );

    await client.fetchAssets();

    expect(mockCache.put).toHaveBeenCalledOnce();
    const [, cachedResponse] = mockCache.put.mock.calls[0];
    const cachedBody = await cachedResponse.json();
    expect(cachedBody.images).toHaveLength(1);
    expect(cachedBody.images[0].uuid).toBe("abc123");
  });

  it("throws on network failure", async () => {
    const client = createCloudinaryClient(mockEnv);

    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new Error("Network error"))
    );

    await expect(client.fetchAssets()).rejects.toThrow("Network error");
  });
});
