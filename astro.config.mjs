import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://raiyan437.github.io',
  base: '/My-Portfolio',
  output: 'static',
  outDir: './dist',
  devToolbar: {
    enabled: false
  },
  vite: {
    server: {
      watch: {
        usePolling: true,
        interval: 500,
        ignored: ['**/dist/**', '**/build_output/**', '**/node_modules/**']
      }
    }
  }
});
