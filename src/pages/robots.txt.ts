import type { APIRoute } from "astro";
import { getBaseUrl } from "../utils/base";

export const GET: APIRoute = ({ site }) => {
  const sitemap = new URL(getBaseUrl() + "sitemap-index.xml", site);
  return new Response("User-agent: *\nAllow: /\n\nSitemap: " + sitemap.href + "\n", {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
