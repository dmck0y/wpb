import { describe, it, expect } from "vitest";
import { createGallery } from "../gallery";
import type { Asset } from "../types";

const mockImages: Asset[] = [
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

describe("Gallery", () => {
  it("returns all images", () => {
    const gallery = createGallery(mockImages);
    expect(gallery.getImages()).toEqual(mockImages);
  });

  it("returns total image count", () => {
    const gallery = createGallery(mockImages);
    expect(gallery.getTotalImages()).toBe(3);
  });

  it("returns 0 for empty gallery", () => {
    const gallery = createGallery([]);
    expect(gallery.getTotalImages()).toBe(0);
  });

  it("finds an image by ID", () => {
    const gallery = createGallery(mockImages);
    expect(gallery.findImageById("img2")).toEqual(mockImages[1]);
  });

  it("returns null for non-existent image ID", () => {
    const gallery = createGallery(mockImages);
    expect(gallery.findImageById("nonexistent")).toBeNull();
  });

  it("finds image index by ID", () => {
    const gallery = createGallery(mockImages);
    expect(gallery.findImageIndexById("img2")).toBe(1);
    expect(gallery.findImageIndexById("nonexistent")).toBe(-1);
  });

  it("gets image by index", () => {
    const gallery = createGallery(mockImages);
    expect(gallery.getImageByIndex(0)).toEqual(mockImages[0]);
    expect(gallery.getImageByIndex(2)).toEqual(mockImages[2]);
  });

  it("returns null for out-of-bounds index", () => {
    const gallery = createGallery(mockImages);
    expect(gallery.getImageByIndex(-1)).toBeNull();
    expect(gallery.getImageByIndex(10)).toBeNull();
  });

  describe("getNavigation", () => {
    it("returns navigation for a middle image", () => {
      const gallery = createGallery(mockImages);
      const nav = gallery.getNavigation("img2");

      expect(nav).not.toBeNull();
      expect(nav!.current).toEqual(mockImages[1]);
      expect(nav!.prev).toEqual(mockImages[0]);
      expect(nav!.next).toEqual(mockImages[2]);
      expect(nav!.index).toBe(1);
      expect(nav!.total).toBe(3);
    });

    it("returns null prev for first image", () => {
      const gallery = createGallery(mockImages);
      const nav = gallery.getNavigation("img1");

      expect(nav).not.toBeNull();
      expect(nav!.prev).toBeNull();
      expect(nav!.next).toEqual(mockImages[1]);
    });

    it("returns null next for last image", () => {
      const gallery = createGallery(mockImages);
      const nav = gallery.getNavigation("img3");

      expect(nav).not.toBeNull();
      expect(nav!.prev).toEqual(mockImages[1]);
      expect(nav!.next).toBeNull();
    });

    it("returns null for non-existent image ID", () => {
      const gallery = createGallery(mockImages);
      expect(gallery.getNavigation("nonexistent")).toBeNull();
    });
  });
});
