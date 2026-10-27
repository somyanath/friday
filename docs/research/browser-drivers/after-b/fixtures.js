// Attach to the Chrome that launch started, instead of launching one (Chrome can't start inside Codex's sandbox).
import { test as base, chromium } from '@playwright/test';
export const test = base.extend({
  browser: [async ({}, use) => { await use(await chromium.connectOverCDP(process.env.CDP_URL)); }, { scope: 'worker' }],
});
export { expect } from '@playwright/test';
