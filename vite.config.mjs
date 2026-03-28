import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig(({ mode }) => {
  const production = mode === 'production';

  return {
    plugins: [svelte({
      compilerOptions: {
        compatibility: {
          componentApi: 4
        }
      }
    })],
    build: {
      outDir: 'dist',
    },
    publicDir: 'public',
  };
});
