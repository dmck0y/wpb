import { Layout } from "./Layout";

export function NotFoundPage() {
  return (
    <Layout title="Not Found - Wastepaperbasket">
      <div class="flex flex-col items-center justify-center min-h-screen gap-4">
        <h1 class="text-4xl font-bold text-white/80">404</h1>
        <p class="text-white/50">Image not found.</p>
        <a
          href="/images"
          class="text-white/60 hover:text-white underline transition-colors"
        >
          Back to gallery
        </a>
      </div>
    </Layout>
  );
}
