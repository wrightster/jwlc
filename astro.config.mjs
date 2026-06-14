// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
  // Production origin — used to build absolute canonical + og:image URLs on
  // prerendered pages (social crawlers reject relative paths).
  site: 'https://juliewrightlandcompany.com',
  output: 'server',
  vite: {
    plugins: [tailwindcss()]
  },

  adapter: node({
    mode: 'standalone'
  })
});