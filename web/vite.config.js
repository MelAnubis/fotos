import { sveltekit } from '@sveltejs/kit/vite';
import path from 'path';
import { isoImport } from 'vite-plugin-iso-import';

const upstream = {
  target: process.env.IMMICH_SERVER_URL || 'http://immich-server:3001/',
  secure: true,
  changeOrigin: true,
  logLevel: 'info',
  ws: true,
};

/** @type {import('vite').UserConfig} */
const config = {
  resolve: {
    alias: {
      'xmlhttprequest-ssl': './node_modules/engine.io-client/lib/xmlhttprequest.js',
      '@api': path.resolve('./src/api'),
    },
  },
  server: {
    // connect to a remote backend during web-only development
    proxy: {
      '/api': upstream,
      '/.well-known/immich': upstream,
      '/custom.css': upstream,
    },
  },
  plugins: [sveltekit()],
  optimizeDeps: {
    entries: ['src/**/*.{svelte,ts,html}'],
  },
};

export default config;
