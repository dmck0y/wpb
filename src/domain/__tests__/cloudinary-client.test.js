import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createCloudinaryClient } from '../cloudinary-client.js';

describe('Cloudinary Client', () => {
  let client;
  const apiUrl = 'https://api.cloudinary.com/v1_1/test/resources';

  beforeEach(() => {
    client = createCloudinaryClient(apiUrl);
    vi.clearAllMocks();
  });

  it('fetches assets successfully', async () => {
    const mockImages = [
      { uuid: 'img1', url: 'https://example.com/1.jpg' },
      { uuid: 'img2', url: 'https://example.com/2.jpg' },
    ];

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ images: mockImages }),
    });

    const result = await client.fetchAssets();
    
    expect(global.fetch).toHaveBeenCalledWith(apiUrl);
    expect(result).toEqual(mockImages);
  });

  it('throws error on failed API response', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
    });

    await expect(client.fetchAssets()).rejects.toThrow('Cloudinary API error: 500');
  });

  it('throws error on invalid response format', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ wrongKey: [] }),
    });

    await expect(client.fetchAssets()).rejects.toThrow('Invalid response format');
  });

  it('throws error on network failure', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

    await expect(client.fetchAssets()).rejects.toThrow('Network error');
  });
});
