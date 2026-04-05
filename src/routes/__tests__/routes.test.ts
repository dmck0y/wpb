import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Asset } from "../../domain/types";

// Mock the cloudinary client before importing the app
vi.mock("../../domain/cloudinary-client", () => {
  const mockAssets: Asset[] = [
    {
      uuid: "img1",
      url: "https://example.com/1.jpg",
      date: new Date("2024-01-03"),
    },
    {
      uuid: "img2",
      url: "https://example.com/2.jpg",
      date: new Date("2024-01-02"),
    },
    {
      uuid: "img3",
      url: "https://example.com/3.jpg",
      date: new Date("2024-01-01"),
    },
  ];

  return {
    createCloudinaryClient: vi.fn(() => ({
      fetchAssets: vi.fn().mockResolvedValue(mockAssets),
    })),
    CloudinaryClient: vi.fn(),
  };
});

// Must import after mock
import app from "../../index";

describe("Route handlers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("GET /", () => {
    it("redirects to /images with 302", async () => {
      const res = await app.request("/");
      expect(res.status).toBe(302);
      expect(res.headers.get("Location")).toBe("/images");
    });
  });

  describe("GET /health", () => {
    it("returns 200 OK", async () => {
      const res = await app.request("/health");
      expect(res.status).toBe(200);
      const text = await res.text();
      expect(text).toBe("OK");
    });
  });

  describe("GET /images", () => {
    it("returns HTML with gallery content", async () => {
      const res = await app.request("/images", undefined, {
        CLOUD_NAME: "test",
        API_KEY: "key",
        API_SECRET: "secret",
      });

      expect(res.status).toBe(200);
      const html = await res.text();
      expect(html).toContain("<!DOCTYPE html>");
      expect(html).toContain("Gallery");
      expect(html).toContain("/images/img1");
      expect(html).toContain("/images/img2");
      expect(html).toContain("/images/img3");
      expect(html).toContain("wastepaperbasket");
    });
  });

  describe("GET /images/:id", () => {
    it("returns HTML for a valid image", async () => {
      const res = await app.request("/images/img2", undefined, {
        CLOUD_NAME: "test",
        API_KEY: "key",
        API_SECRET: "secret",
      });

      expect(res.status).toBe(200);
      const html = await res.text();
      expect(html).toContain("https://example.com/2.jpg");
      expect(html).toContain('id="prev-link"');
      expect(html).toContain('id="next-link"');
    });

    it("returns HTML with no prev link for first image", async () => {
      const res = await app.request("/images/img1", undefined, {
        CLOUD_NAME: "test",
        API_KEY: "key",
        API_SECRET: "secret",
      });

      expect(res.status).toBe(200);
      const html = await res.text();
      expect(html).toContain("https://example.com/1.jpg");
      expect(html).not.toContain('id="prev-link"');
      expect(html).toContain('id="next-link"');
    });

    it("returns HTML with no next link for last image", async () => {
      const res = await app.request("/images/img3", undefined, {
        CLOUD_NAME: "test",
        API_KEY: "key",
        API_SECRET: "secret",
      });

      expect(res.status).toBe(200);
      const html = await res.text();
      expect(html).toContain("https://example.com/3.jpg");
      expect(html).toContain('id="prev-link"');
      expect(html).not.toContain('id="next-link"');
    });

    it("returns 404 for invalid image ID", async () => {
      const res = await app.request("/images/nonexistent", undefined, {
        CLOUD_NAME: "test",
        API_KEY: "key",
        API_SECRET: "secret",
      });

      expect(res.status).toBe(404);
      const html = await res.text();
      expect(html).toContain("404");
      expect(html).toContain("Not Found");
    });
  });

  describe("GET /api/v1/assets", () => {
    it("returns JSON with images array", async () => {
      const res = await app.request("/api/v1/assets", undefined, {
        CLOUD_NAME: "test",
        API_KEY: "key",
        API_SECRET: "secret",
      });

      expect(res.status).toBe(200);
      const data = (await res.json()) as { images: Asset[] };
      expect(data.images).toHaveLength(3);
      expect(data.images[0]).toHaveProperty("uuid");
      expect(data.images[0]).toHaveProperty("url");
      expect(data.images[0]).toHaveProperty("date");
    });
  });

  describe("OPTIONS /api/v1/assets", () => {
    it("returns 204 with CORS headers for allowed origin", async () => {
      const res = await app.request(
        "/api/v1/assets",
        {
          method: "OPTIONS",
          headers: { Origin: "https://www.wastepaperbasket.ca" },
        },
        {
          CLOUD_NAME: "test",
          API_KEY: "key",
          API_SECRET: "secret",
        }
      );

      expect(res.status).toBe(204);
      expect(res.headers.get("Access-Control-Allow-Origin")).toBe(
        "https://www.wastepaperbasket.ca"
      );
      expect(res.headers.get("Access-Control-Allow-Methods")).toContain("GET");
    });
  });

  describe("CORS headers", () => {
    it("includes CORS headers for allowed origin on GET", async () => {
      const res = await app.request(
        "/api/v1/assets",
        {
          headers: { Origin: "https://www.wastepaperbasket.ca" },
        },
        {
          CLOUD_NAME: "test",
          API_KEY: "key",
          API_SECRET: "secret",
        }
      );

      expect(res.headers.get("Access-Control-Allow-Origin")).toBe(
        "https://www.wastepaperbasket.ca"
      );
    });

    it("does not include CORS origin header for disallowed origin", async () => {
      const res = await app.request(
        "/api/v1/assets",
        {
          headers: { Origin: "https://evil.com" },
        },
        {
          CLOUD_NAME: "test",
          API_KEY: "key",
          API_SECRET: "secret",
        }
      );

      expect(res.headers.get("Access-Control-Allow-Origin")).toBeNull();
    });
  });
});
