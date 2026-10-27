// Same Live check with no dependencies: Node 24 built-ins talking CDP to a Chrome started elsewhere.
import { writeFileSync } from 'node:fs';
const [cdpHttp, url, out] = process.argv.slice(2);
const t0 = Date.now();
const { webSocketDebuggerUrl } = await (await fetch(`${cdpHttp}/json/version`)).json();
const ws = new WebSocket(webSocketDebuggerUrl);
await new Promise(r => ws.addEventListener('open', r, { once: true }));
let id = 0; const pending = new Map(); const listeners = [];
ws.addEventListener('message', ev => {
  const m = JSON.parse(ev.data);
  if (m.id && pending.has(m.id)) { const { res, rej } = pending.get(m.id); pending.delete(m.id); m.error ? rej(new Error(m.error.message)) : res(m.result); }
  else listeners.forEach(l => l(m));
});
const send = (method, params = {}, sessionId) => new Promise((res, rej) => { const i = ++id; pending.set(i, { res, rej }); ws.send(JSON.stringify({ id: i, method, params, sessionId })); });
const sleep = ms => new Promise(r => setTimeout(r, ms));
async function waitFor(fn, timeout = 5000) { const end = Date.now() + timeout; while (Date.now() < end) { const v = await fn(); if (v) return v; await sleep(50); } throw new Error('timeout'); }
const result = { url, console: [], pageErrors: [], failedRequests: [], badResponses: [], shots: [] };
for (const size of [{ w: 1440, h: 900, mobile: false }, { w: 390, h: 844, mobile: true }]) {
  const { browserContextId } = await send('Target.createBrowserContext');
  const { targetId } = await send('Target.createTarget', { url: 'about:blank', browserContextId });
  const { sessionId: s } = await send('Target.attachToTarget', { targetId, flatten: true });
  const call = (m, p) => send(m, p, s);
  listeners.length = 0;
  let loaded = false;
  listeners.push(m => {
    if (m.sessionId !== s) return;
    if (m.method === 'Runtime.consoleAPICalled' && m.params.type === 'error') result.console.push(`${size.w}: ${m.params.args.map(a => a.value).join(' ')}`);
    if (m.method === 'Runtime.exceptionThrown') result.pageErrors.push(m.params.exceptionDetails.text);
    if (m.method === 'Network.loadingFailed') result.failedRequests.push(m.params.requestId);
    if (m.method === 'Network.responseReceived' && m.params.response.status >= 400) result.badResponses.push(`${m.params.response.status} ${m.params.response.url}`);
    if (m.method === 'Page.loadEventFired') loaded = true;
  });
  await Promise.all(['Page.enable', 'Runtime.enable', 'Network.enable'].map(m => call(m)));
  await call('Emulation.setDeviceMetricsOverride', { width: size.w, height: size.h, deviceScaleFactor: 2, mobile: size.mobile });
  await call('Emulation.setTouchEmulationEnabled', { enabled: size.mobile, maxTouchPoints: 5 });
  await call('Page.navigate', { url });
  await waitFor(() => loaded);
  const evalJs = async expr => (await call('Runtime.evaluate', { expression: expr, returnByValue: true })).result.value;
  // No role-based lookup or actionability checks: find by CSS, wait until enabled, click at the box centre.
  const centre = async sel => evalJs(`(()=>{const r=document.querySelector(${JSON.stringify(sel)}).getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2}})()`);
  const tap = async ({ x, y }) => { for (const type of ['mousePressed', 'mouseReleased']) await call('Input.dispatchMouseEvent', { type, x, y, button: 'left', clickCount: 1 }); };
  await tap(await centre('input[name=name]'));
  await call('Input.insertText', { text: 'Somya' });
  // A one-off wait for "enabled" raced the page's own timer and clicked a disabled button, so retry the click.
  await waitFor(async () => { if (await evalJs(`!document.querySelector('button').disabled`)) await tap(await centre('button'));
    await sleep(400); return evalJs(`document.getElementById('status').textContent.includes('Thanks')`); });
  result[`hoverNone_${size.w}`] = await evalJs(`matchMedia('(hover: none)').matches`);
  // Settle animations by hand: finish every running animation.
  await evalJs(`document.getAnimations().forEach(a=>{try{a.finish()}catch{}}); true`);
  const { cssContentSize } = await call('Page.getLayoutMetrics');
  const { data } = await call('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true, clip: { x: 0, y: 0, width: size.w, height: Math.ceil(cssContentSize.height), scale: 1 } });
  const f = `${out}/shot-${size.w}.png`; writeFileSync(f, Buffer.from(data, 'base64')); result.shots.push(f);
  await send('Target.disposeBrowserContext', { browserContextId });
}
result.ms = Date.now() - t0;
writeFileSync(`${out}/result.json`, JSON.stringify(result, null, 2));
console.log(JSON.stringify(result));
ws.close();
