// src/utils/base.ts

/**
 * Returns Astro's base URL normalized with a trailing slash.
 */
export function getBaseUrl(): string {
  const rawBase = import.meta.env.BASE_URL;
  return rawBase.endsWith('/') ? rawBase : rawBase + '/';
}
