import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

const isGitHubPages = process.env.GITHUB_ACTIONS === 'true';

export default defineConfig({
  site: 'https://raiyan437.github.io/My-Portfolio/',
  base: isGitHubPages ? '/My-Portfolio/' : '/',
  output: 'static',
  integrations: [sitemap()]
});
