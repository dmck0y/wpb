import type { Asset } from "./types";

export interface ImageNavigation {
  current: Asset;
  prev: Asset | null;
  next: Asset | null;
  index: number;
  total: number;
}

export class Gallery {
  private images: Asset[];

  constructor(images: Asset[]) {
    this.images = images;
  }

  getImages(): Asset[] {
    return this.images;
  }

  getTotalImages(): number {
    return this.images.length;
  }

  findImageById(id: string): Asset | null {
    return this.images.find((img) => img.uuid === id) ?? null;
  }

  findImageIndexById(id: string): number {
    return this.images.findIndex((img) => img.uuid === id);
  }

  getImageByIndex(index: number): Asset | null {
    if (index < 0 || index >= this.images.length) {
      return null;
    }
    return this.images[index];
  }

  getNavigation(id: string): ImageNavigation | null {
    const index = this.findImageIndexById(id);
    if (index === -1) return null;

    return {
      current: this.images[index],
      prev: index > 0 ? this.images[index - 1] : null,
      next: index < this.images.length - 1 ? this.images[index + 1] : null,
      index,
      total: this.images.length,
    };
  }
}

export function createGallery(images: Asset[]): Gallery {
  return new Gallery(images);
}
