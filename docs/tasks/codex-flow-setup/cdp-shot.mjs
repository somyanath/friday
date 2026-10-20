// Drives a Chrome that runs outside Codex's sandbox, over the DevTools protocol on 127.0.0.1.
import { writeFileSync } from "node:fs";

const CDP = "http://127.0.0.1:4311";
const PAGE = "http://127.0.0.1:4310/page.html";

const version = await (await fetch(`${CDP}/json/version`)).json();
console.log("browser:", version.Browser);

const target = await (await fetch(`${CDP}/json/new?about:blank`, { method: "PUT" })).json();
const ws = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((resolve, reject) => { ws.onopen = resolve; ws.onerror = reject; });

let id = 0;
const pending = new Map();
const events = [];
ws.onmessage = (m) => {
  const msg = JSON.parse(m.data);
  if (msg.id && pending.has(msg.id)) { pending.get(msg.id)(msg); pending.delete(msg.id); }
  else if (msg.method) events.push(msg.method);
};
const send = (method, params = {}) => new Promise((resolve) => {
  const n = ++id; pending.set(n, resolve); ws.send(JSON.stringify({ id: n, method, params }));
});

await send("Page.enable");
await send("Emulation.setDeviceMetricsOverride", { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
await send("Page.navigate", { url: PAGE });
for (let i = 0; i < 50 && !events.includes("Page.loadEventFired"); i++) await new Promise((r) => setTimeout(r, 100));
console.log("loaded:", events.includes("Page.loadEventFired"));

const title = await send("Runtime.evaluate", { expression: "document.title" });
console.log("title:", title.result.result.value);

const shot = await send("Page.captureScreenshot", { format: "png" });
writeFileSync("shot-cdp.png", Buffer.from(shot.result.data, "base64"));
console.log("screenshot: shot-cdp.png");

await fetch(`${CDP}/json/close/${target.id}`);
ws.close();
