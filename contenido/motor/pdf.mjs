// Exporta un carrusel HTML (secciones .pag de 1080x1350) a PDF y a PNG por página.
// Uso: node motor/pdf.mjs piezas/x.html salida.pdf [carpeta-png]
import { createRequire } from 'node:module';
import { mkdirSync } from 'node:fs';
import path from 'node:path';
const require = createRequire(import.meta.url);
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const [html, pdf, pngDir] = process.argv.slice(2);
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const pg = await b.newPage({ viewport: { width: 1080, height: 1350 } });
await pg.goto('file://' + path.resolve(html));
await pg.evaluate(() => document.fonts.ready); await pg.waitForTimeout(400);
await pg.pdf({ path: pdf, width: '1080px', height: '1350px', printBackground: true, preferCSSPageSize: true });
if (pngDir) {
  mkdirSync(pngDir, { recursive: true });
  const n = await pg.evaluate(() => document.querySelectorAll('.pag').length);
  for (let i = 0; i < n; i++) await (await pg.$$('.pag'))[i].screenshot({ path: path.join(pngDir, `${String(i + 1).padStart(2, '0')}.png`) });
}
await b.close(); console.log('listo', pdf);
