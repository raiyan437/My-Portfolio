import { defineConfig } from 'astro/config';

// Automatically detect deployment platform
const isGitHubPages = process.env.GITHUB_ACTIONS === 'true';

export default defineConfig({
  site: isGitHubPages 
    ? 'https://raiyan437.github.io' 
    : (process.env.URL || 'https://localhost:4321'),
  base: isGitHubPages ? '/My-Portfolio/' : '/',
  output: 'static'
});
