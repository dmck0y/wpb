import { Layout } from "./Layout";
import type { Asset } from "../domain/types";

interface GalleryPageProps {
  images: Asset[];
}

export function GalleryPage({ images }: GalleryPageProps) {
  return (
    <Layout title="Gallery - Wastepaperbasket">
      <div class="pt-24 px-4 pb-8 max-w-7xl mx-auto">
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((image) => (
            <a
              href={`/images/${image.uuid}`}
              key={image.uuid}
              class="block overflow-hidden rounded-lg hover:opacity-80 transition-opacity"
            >
              <img
                src={image.url}
                alt="artwork"
                class="w-full h-64 object-cover"
                loading="lazy"
              />
            </a>
          ))}
        </div>
        {images.length === 0 && (
          <p class="text-center text-gray-400 mt-12">No images found.</p>
        )}
      </div>
    </Layout>
  );
}
