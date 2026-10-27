import { defineConfig } from '@playwright/test';
const out = process.env.VERIFY_OUT;
export default defineConfig({
  testDir: 'scenarios',
  outputDir: `${out}/artifacts`,
  reporter: [['json', { outputFile: `${out}/report.json` }], ['list']],
  use: { baseURL: process.env.APP_URL, trace: 'on', screenshot: 'on', video: 'on' },
  projects: [
    { name: 'desktop', use: { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 } },
    { name: 'phone', use: { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true } },
  ],
});
