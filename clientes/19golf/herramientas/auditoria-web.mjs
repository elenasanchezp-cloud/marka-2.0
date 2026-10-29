#!/usr/bin/env node
// Uso: node herramientas/auditoria-web.mjs <url | ruta/index.html> [--json]
// Auditoría rápida de SEO, accesibilidad básica y rendimiento. Pensada para vender y para vigilar.
import { cargarPlaywright, opcionesNavegador } from './_pw.mjs';
import { resolve } from 'node:path';
import { statSync } from 'node:fs';

const arg = process.argv[2];
if (!arg) { console.error('Uso: node herramientas/auditoria-web.mjs <url | index.html> [--json]'); process.exit(1); }
const url = /^https?:/.test(arg) ? arg : 'file://' + resolve(arg);
const { chromium } = cargarPlaywright();
const b = await chromium.launch(await opcionesNavegador());
const out = [];
const add = (nivel, area, msg) => out.push({ nivel, area, msg }); // nivel: ok | aviso | error

for (const [nombre, w, h] of [['móvil', 390, 844], ['escritorio', 1280, 800]]) {
  const p = await b.newPage({ viewport: { width: w, height: h } });
  const fallos = [];
  p.on('requestfailed', r => fallos.push(r.url()));
  const t0 = Date.now();
  await p.goto(url, { waitUntil: 'load', timeout: 45000 }).catch(e => add('error', 'carga', e.message));
  const ms = Date.now() - t0;
  await p.waitForTimeout(1500);
  const d = await p.evaluate(() => {
    const q = s => [...document.querySelectorAll(s)];
    const m = (n, a = 'name') => document.querySelector(`meta[${a}="${n}"]`)?.content || '';
    const hs = q('h1,h2,h3,h4,h5,h6').map(e => +e.tagName[1]);
    let salto = false; for (let i = 1; i < hs.length; i++) if (hs[i] - hs[i - 1] > 1) salto = true;
    return {
      title: document.title, desc: m('description'), lang: document.documentElement.lang,
      canonical: document.querySelector('link[rel=canonical]')?.href || '', viewport: !!m('viewport'),
      h1: q('h1').length, saltoHeadings: salto, main: q('main').length,
      ogTitle: m('og:title', 'property'), ogDesc: m('og:description', 'property'), ogImg: m('og:image', 'property'),
      ogW: m('og:image:width', 'property'), twCard: m('twitter:card'), twImg: m('twitter:image'),
      jsonld: q('script[type="application/ld+json"]').length, favicon: !!document.querySelector('link[rel~=icon]'),
      imgSinAlt: q('img').filter(i => !i.hasAttribute('alt')).length,
      imgSinDim: q('img').filter(i => !i.getAttribute('width') && !i.getAttribute('height') && getComputedStyle(i).aspectRatio === 'auto' && getComputedStyle(i.parentElement).aspectRatio === 'auto').length,
      botonesSinNombre: q('button').filter(e => !(e.textContent.trim() || e.getAttribute('aria-label') || e.getAttribute('aria-labelledby'))).length,
      enlacesSinNombre: q('a').filter(e => !(e.textContent.trim() || e.getAttribute('aria-label') || e.querySelector('img[alt]:not([alt=""])'))).length,
      inputsSinLabel: q('input,select,textarea').filter(e => e.type !== 'hidden' && !(e.labels?.length || e.getAttribute('aria-label') || e.getAttribute('aria-labelledby'))).length,
      blankSinRel: q('a[target=_blank]').filter(a => !/noopener/.test(a.rel)).length,
      skip: !!q('a[href^="#"]').find(a => /salt|skip/i.test(a.textContent) ),
      desborda: document.documentElement.scrollWidth > innerWidth,
      peso: performance.getEntriesByType('resource').reduce((s, r) => s + (r.transferSize || 0), 0),
      reqs: performance.getEntriesByType('resource').length,
    };
  });
  if (nombre === 'móvil') {
    const a = 'SEO';
    d.title.length >= 30 && d.title.length <= 65 ? add('ok', a, `title (${d.title.length} car.)`) : add('aviso', a, `title de ${d.title.length} car. (ideal 30–65)`);
    d.desc.length >= 110 && d.desc.length <= 160 ? add('ok', a, `meta description (${d.desc.length} car.)`) : add('aviso', a, `meta description de ${d.desc.length} car. (ideal 110–160)`);
    d.lang ? add('ok', a, `lang="${d.lang}"`) : add('error', a, 'falta lang en <html>');
    d.canonical ? add('ok', a, 'canonical') : add('aviso', a, 'falta canonical');
    d.h1 === 1 ? add('ok', a, 'un único h1') : add('error', a, `hay ${d.h1} h1 (debe ser 1)`);
    d.saltoHeadings ? add('aviso', a, 'salto en la jerarquía de títulos (h2→h4…)') : add('ok', a, 'jerarquía de títulos correcta');
    d.ogTitle && d.ogDesc && d.ogImg ? add('ok', a, 'Open Graph completo') : add('aviso', a, 'Open Graph incompleto (title/description/image)');
    /\.(jpe?g|png)(\?|$)/i.test(d.ogImg) ? add('ok', a, 'og:image en JPG/PNG') : d.ogImg && add('aviso', a, 'og:image no es JPG/PNG (WhatsApp/LinkedIn suelen ignorar WebP)');
    d.ogW === '1200' ? add('ok', a, 'og:image 1200 px') : add('aviso', a, 'declara og:image:width/height (1200×630)');
    d.twCard && d.twImg ? add('ok', a, 'Twitter card con imagen') : add('aviso', a, 'falta twitter:card/twitter:image');
    d.jsonld ? add('ok', a, 'datos estructurados JSON-LD') : add('aviso', a, 'sin datos estructurados JSON-LD');
    d.favicon ? add('ok', a, 'favicon') : add('aviso', a, 'sin favicon');
    const b2 = 'Accesibilidad';
    d.main === 1 ? add('ok', b2, 'landmark <main>') : add('error', b2, 'falta (o sobra) <main>');
    d.imgSinAlt ? add('error', b2, `${d.imgSinAlt} imágenes sin atributo alt`) : add('ok', b2, 'todas las imágenes tienen alt');
    d.botonesSinNombre ? add('error', b2, `${d.botonesSinNombre} botones sin nombre accesible`) : add('ok', b2, 'botones con nombre');
    d.enlacesSinNombre ? add('error', b2, `${d.enlacesSinNombre} enlaces sin texto accesible`) : add('ok', b2, 'enlaces con texto');
    d.inputsSinLabel ? add('error', b2, `${d.inputsSinLabel} campos de formulario sin label`) : add('ok', b2, 'formularios etiquetados');
    d.blankSinRel ? add('aviso', b2, `${d.blankSinRel} enlaces target=_blank sin rel="noopener"`) : add('ok', b2, 'enlaces externos seguros');
    d.skip ? add('ok', b2, 'enlace "saltar al contenido"') : add('aviso', b2, 'falta enlace "saltar al contenido"');
  }
  add(d.desborda ? 'error' : 'ok', 'Responsive', `${nombre}: ${d.desborda ? 'hay scroll horizontal' : 'sin scroll horizontal'}`);
  add(ms < 3000 ? 'ok' : 'aviso', 'Rendimiento', `${nombre}: carga en ${ms} ms`);
  if (nombre === 'móvil') {
    /^https?:/.test(arg) && add(d.peso < 1.5e6 ? 'ok' : 'aviso', 'Rendimiento', `${(d.peso / 1024).toFixed(0)} KB transferidos en ${d.reqs} peticiones`);
    d.imgSinDim ? add('aviso', 'Rendimiento', `${d.imgSinDim} imágenes sin width/height (provocan saltos de diseño)`) : add('ok', 'Rendimiento', 'imágenes con dimensiones (sin saltos de diseño)');
    fallos.length && add('aviso', 'Carga', `${fallos.length} recursos fallaron: ${[...new Set(fallos)].slice(0, 3).join(', ')}`);
  }
  await p.close();
}
await b.close();
if (!/^https?:/.test(arg)) { try { statSync(resolve(arg, '..', 'robots.txt')); add('ok', 'SEO', 'robots.txt'); } catch { add('aviso', 'SEO', 'falta robots.txt'); } try { statSync(resolve(arg, '..', 'sitemap.xml')); add('ok', 'SEO', 'sitemap.xml'); } catch { add('aviso', 'SEO', 'falta sitemap.xml'); } }
if (process.argv.includes('--json')) { console.log(JSON.stringify(out, null, 2)); process.exit(0); }
const ic = { ok: '✅', aviso: '⚠️ ', error: '❌' };
console.log(`\nAuditoría de ${arg}\n`);
for (const a of [...new Set(out.map(o => o.area))]) { console.log(`## ${a}`); out.filter(o => o.area === a).forEach(o => console.log(`  ${ic[o.nivel]} ${o.msg}`)); }
const e = out.filter(o => o.nivel === 'error').length, w = out.filter(o => o.nivel === 'aviso').length;
console.log(`\nResumen: ${out.filter(o => o.nivel === 'ok').length} ok · ${w} avisos · ${e} errores`);
process.exit(e ? 1 : 0);
