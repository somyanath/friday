// What Playwright reports for each error source, and whether recordVideo works over connectOverCDP.
import { chromium } from 'playwright-core';
import { readdirSync, statSync } from 'node:fs';
const [cdp, url, out] = process.argv.slice(2);
const browser = await chromium.connectOverCDP(cdp);
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true,
  recordVideo: { dir: `${out}/video`, size: { width: 390, height: 844 } } });
const page = await ctx.newPage();
const log = [];
page.on('console', m => log.push({ ev: 'console', type: m.type(), text: m.text(), locationUrl: m.location().url }));
page.on('pageerror', e => log.push({ ev: 'pageerror', text: String(e) }));
page.on('requestfailed', r => log.push({ ev: 'requestfailed', url: r.url(), error: r.failure()?.errorText }));
page.on('response', r => r.status() >= 400 && log.push({ ev: 'response', status: r.status(), url: r.url() }));
await page.goto(url);
await page.getByRole('textbox', { name: 'Name' }).fill('Somya');
await page.getByRole('button', { name: 'Send' }).click();
await page.getByRole('status').filter({ hasText: 'Thanks' }).waitFor();
await page.waitForTimeout(300);
await ctx.close();
for (const e of log) console.log(JSON.stringify(e));
for (const f of readdirSync(`${out}/video`)) console.log('video', f, statSync(`${out}/video/${f}`).size, 'bytes');
await browser.close().catch(() => {});
