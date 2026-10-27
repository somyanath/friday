// Live check via playwright-core attached over CDP to a Chrome started elsewhere.
import { chromium } from 'playwright-core';
import { writeFileSync } from 'node:fs';
const [cdp, url, out] = process.argv.slice(2);
const t0 = Date.now();
const browser = await chromium.connectOverCDP(cdp);
const result = { url, console: [], pageErrors: [], failedRequests: [], badResponses: [], shots: [] };
for (const size of [{ w: 1440, h: 900, mobile: false }, { w: 390, h: 844, mobile: true }]) {
  const ctx = await browser.newContext({ viewport: { width: size.w, height: size.h }, deviceScaleFactor: 2, isMobile: size.mobile, hasTouch: size.mobile });
  const page = await ctx.newPage();
  page.on('console', m => m.type() === 'error' && result.console.push(`${size.w}: ${m.text()}`));
  page.on('pageerror', e => result.pageErrors.push(String(e)));
  page.on('requestfailed', r => result.failedRequests.push(r.url()));
  page.on('response', r => r.status() >= 400 && result.badResponses.push(`${r.status()} ${r.url()}`));
  await page.goto(url);
  await page.getByRole('textbox', { name: 'Name' }).fill('Somya');
  await page.getByRole('button', { name: 'Send' }).click();   // auto-waits while the button is briefly disabled
  await page.getByRole('status').filter({ hasText: 'Thanks' }).waitFor();
  result[`hoverNone_${size.w}`] = await page.evaluate(() => matchMedia('(hover: none)').matches);
  const f = `${out}/shot-${size.w}.png`;
  await page.screenshot({ path: f, fullPage: true, animations: 'disabled' });
  result.shots.push(f);
  await ctx.close();
}
result.ms = Date.now() - t0;
writeFileSync(`${out}/result.json`, JSON.stringify(result, null, 2));
console.log(JSON.stringify(result));
await browser.close().catch(() => {});
