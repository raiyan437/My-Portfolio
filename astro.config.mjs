import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import { projects } from "./src/data/projects";

const isGitHubPages = process.env.GITHUB_ACTIONS === "true";
const base = isGitHubPages ? "/My-Portfolio/" : "/";
const site = isGitHubPages ? "https://raiyan437.github.io" : "https://raiyan-uddin.netlify.app";
const unlistedPaths = new Set(projects
  .filter(({ group }) => group === "unlisted")
  .map(({ slug }) => base + "works/" + slug + "/"));

export default defineConfig({
  site,
  base,
  output: "static",
  devToolbar: { enabled: false },
  integrations: [sitemap({
    filter: (url) => !unlistedPaths.has(new URL(url).pathname),
  })],
});
