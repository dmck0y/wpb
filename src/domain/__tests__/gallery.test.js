import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createGallery } from '../gallery.js';

describe('Gallery Module', () => {
  let mockClient;
  let gallery;

  const mockImages = [
    { uuid: 'img1', url: 'https://example.com/1.jpg', date: new Date('2024-01-01') },
    { uuid: 'img2', url: 'https://example.com/2.jpg', date: new Date('2024-01-02') },
    { uuid: 'img3', url: 'https://example.com/3.jpg', date: new Date('2024-01-03') },
  ];

  beforeEach(() => {
    mockClient = {
      fetchAssets: vi.fn().mockResolvedValue(mockImages),
    };
  });

  it('fetches and stores images', async () => {
    // Create gallery with API URL (will create client internally)
    gallery = createGallery('https://api.example.com/assets');
    
    // Mock global fetch
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ images: mockImages }),
    });

    await gallery.fetchImages();
    
    expect(gallery.getImages()).toEqual(mockImages);
    expect(gallery.isLoading()).toBe(false);
  });

  it('finds image index by ID', async () => {
    gallery = createGallery('https://api.example.com/assets');
    
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ images: mockImages }),
    });

    await gallery.fetchImages();
    
    expect(gallery.findImageIndexById('img2')).toBe(1);
    expect(gallery.findImageIndexById('nonexistent')).toBe(-1);
  });

  it('gets image by index', async () => {
    gallery = createGallery('https://api.example.com/assets');
    
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ images: mockImages }),
    });

    await gallery.fetchImages();
    
    expect(gallery.getImageByIndex(0)).toEqual(mockImages[0]);
    expect(gallery.getImageByIndex(10)).toBeNull();
    expect(gallery.getImageByIndex(-1)).toBeNull();
  });

  it('returns total images count', async () => {
    gallery = createGallery('https://api.example.com/assets');
    
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ images: mockImages }),
    });

    await gallery.fetchImages();
    
    expect(gallery.getTotalImages()).toBe(3);
  });

  it('handles fetch errors gracefully', async () => {
    gallery = createGallery('https://api.example.com/assets');
    
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
    });

    await expect(gallery.fetchImages()).rejects.toThrow();
    expect(gallery.getError()).toBeTruthy();
  });
});
