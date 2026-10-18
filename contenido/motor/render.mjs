// Renderiza una pieza HTML animada (window.render(t), window.DURACION) a MP4 vertical.
// Uso: node motor/render.mjs piezas/x.html salida.mp4 [audio.wav] [--fps 30] [--prueba 12.5]
import { createRequire } from 'node:module';
import { mkdtempSync, rmSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import path from 'node:path';
const require = createRequire(import.meta.url);
const { chromium } = (() => { for (const r of [process.env.PLAYWRIGHT_PATH, 'playwright', '/opt/node22/lib/node_modules/playwright']) { try { if (r) return require(r); } catch {} } throw new Error('Falta Playwright'); })();

const args = process.argv.slice(2);
const opt = (n, d) => { const i = args.indexOf(n); if (i < 0) return d; const v = args[i + 1]; args.splice(i, 2); return v; };
const fps = Number(opt('--fps', 30));
const prueba = opt('--prueba', null);
const [html, salida, audio] = args;
const exe = '/opt/pw-browsers/chromium';
const browser = await chromium.launch(existsSync(exe) ? { executablePath: exe } : {});
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
await page.goto('file://' + path.resolve(html));
await page.evaluate(() => document.fonts.ready);
await page.evaluate(() => window.LISTO || null);
await page.waitForTimeout(400);
const dur = await page.evaluate(() => window.DURACION);
if (prueba !== null) {
  for (const t of prueba.split(',')) {
    await page.evaluate(t => window.render(t), Number(t));
    await page.screenshot({ path: salida.replace(/\.png$/, '') + `-${t}.png` });
  }
  await browser.close(); process.exit(0);
}
const dir = mkdtempSync(path.join(tmpdir(), 'marka-'));
const n = Math.round(dur * fps);
for (let i = 0; i < n; i++) {
  await page.evaluate(t => window.render(t), i / fps);
  await page.screenshot({ path: path.join(dir, String(i).padStart(5, '0') + '.jpg'), type: 'jpeg', quality: 93 });
  if (i % 150 === 0) console.log(`fotograma ${i}/${n}`);
}
await browser.close();
const ff = ['-y', '-framerate', String(fps), '-i', path.join(dir, '%05d.jpg')];
if (audio) ff.push('-i', audio, '-c:a', 'aac', '-b:a', '192k', '-shortest');
ff.push('-c:v', 'libx264', '-preset', 'slow', '-crf', '18', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', salida);
execFileSync('ffmpeg', ff, { stdio: 'inherit' });
rmSync(dir, { recursive: true, force: true });
console.log('listo', salida);
