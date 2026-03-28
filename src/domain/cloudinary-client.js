/**
 * Cloudinary API Client Abstraction
 * Encapsulates all Cloudinary API interactions
 */

export class CloudinaryClient {
  constructor(apiUrl) {
    this.apiUrl = apiUrl;
  }

  async fetchAssets() {
    const response = await fetch(this.apiUrl);
    
    if (!response.ok) {
      throw new Error(`Cloudinary API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.images || !Array.isArray(data.images)) {
      throw new Error('Invalid response format from Cloudinary API');
    }
    
    return data.images;
  }
}

export function createCloudinaryClient(apiUrl) {
  return new CloudinaryClient(apiUrl);
}
