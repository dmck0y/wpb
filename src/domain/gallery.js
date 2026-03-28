/**
 * Gallery Domain Module
 * Encapsulates image fetching, sorting, and selection logic
 */

import { createCloudinaryClient } from './cloudinary-client.js';

class Gallery {
  constructor(cloudinaryClient) {
    this.cloudinaryClient = cloudinaryClient;
    this.images = null;
    this.loading = true;
    this.error = null;
  }

  async fetchImages() {
    try {
      this.loading = true;
      this.images = await this.cloudinaryClient.fetchAssets();
      this.loading = false;
      return this.images;
    } catch (err) {
      this.error = err.message;
      this.loading = false;
      throw err;
    }
  }

  getImages() {
    return this.images;
  }

  findImageIndexById(id) {
    if (!this.images) return -1;
    return this.images.findIndex(img => img.uuid === id);
  }

  getImageByIndex(index) {
    if (!this.images || index < 0 || index >= this.images.length) {
      return null;
    }
    return this.images[index];
  }

  getTotalImages() {
    return this.images ? this.images.length : 0;
  }

  isLoading() {
    return this.loading;
  }

  getError() {
    return this.error;
  }
}

// Factory function for creating gallery instance
export function createGallery(apiUrl) {
  const cloudinaryClient = createCloudinaryClient(apiUrl);
  return new Gallery(cloudinaryClient);
}
