import { Layout } from "./Layout";
import type { ImageNavigation } from "../domain/gallery";

interface ImagePageProps {
  nav: ImageNavigation;
}

export function ImagePage({ nav }: ImagePageProps) {
  const { current, prev, next, index, total } = nav;

  return (
    <Layout title={`Image ${index + 1} of ${total} - Wastepaperbasket`}>
      <div class="flex items-center justify-center min-h-screen">
        <img
          src={current.url}
          alt="artwork"
          class="max-w-full max-h-screen object-contain"
        />
      </div>
      <nav class="fixed inset-0 flex items-center justify-between pointer-events-none z-40">
        {prev ? (
          <a
            href={`/images/${prev.uuid}`}
            id="prev-link"
            class="pointer-events-auto px-4 py-8 text-white/50 hover:text-white transition-colors text-4xl select-none"
            aria-label="Previous image"
          >
            &#8249;
          </a>
        ) : (
          <span class="px-4 py-8 text-white/10 text-4xl select-none">
            &#8249;
          </span>
        )}
        {next ? (
          <a
            href={`/images/${next.uuid}`}
            id="next-link"
            class="pointer-events-auto px-4 py-8 text-white/50 hover:text-white transition-colors text-4xl select-none"
            aria-label="Next image"
          >
            &#8250;
          </a>
        ) : (
          <span class="px-4 py-8 text-white/10 text-4xl select-none">
            &#8250;
          </span>
        )}
      </nav>
      <div class="fixed bottom-4 left-1/2 -translate-x-1/2 text-white/40 text-sm z-40">
        {index + 1} / {total}
      </div>
    </Layout>
  );
}
