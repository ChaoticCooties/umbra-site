import { defineConfig } from 'astro/config';
import { accessibleCode } from './src/plugins/accessible-code.mjs';

// Project Umbra — static disclosure ledger.
export default defineConfig({
  site: 'https://umbra.cooties.io',
  trailingSlash: 'ignore',
  markdown: { rehypePlugins: [accessibleCode] },
});
