#!/usr/bin/env node
// Uso: node herramientas/brandbook.mjs [BRAND.md] [salida-dir]
// Convierte BRAND.md en un brand book maquetado (HTML + PDF) usando la propia paleta del cliente.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { cargarPlaywright, opcionesNavegador } from './_pw.mjs';

const entrada = resolve(process.argv[2] || 'BRAND.md');
const salida = resolve(process.argv[3] || 'brandbook');
const md = readFileSync(entrada, 'utf8');

const esc = t => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const inline = t => esc(t).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/`(.+?)`/g, '<code>$1</code>').replace(/\*(.+?)\*/g, '<em>$1</em>');

// Colores: filas de tabla con un hex válido
const colores = [];
for (const l of md.split('\n')) {
  const c = l.split('|').map(x => x.trim());
  const hex = c.find(x => /^`?#[0-9a-fA-F]{6}`?$/.test(x));
  if (c.length > 3 && hex) colores.push({ token: c[1].replace(/`/g, ''), hex: hex.replace(/`/g, ''), uso: c[3] || '' });
}
const tk = n => colores.find(c => c.token.includes(n))?.hex;
const fondo = tk('fondo') || '#1A1A1A', texto = tk('texto') || '#F4F1EB', acento = tk('acento') || '#D9D5CC', suave = tk('suave') || '#B7AEA4';

// Markdown mínimo → HTML (títulos, listas, tablas, citas, párrafos)
const lineas = md.split('\n'); let html = '', lista = null, tabla = [], seccion = 0, primero = true;
const cierraLista = () => { if (lista) { html += `</${lista}>`; lista = null; } };
const cierraTabla = () => {
  if (!tabla.length) return;
  const filas = tabla.filter(r => !/^\|?\s*-+/.test(r.replace(/\|/g, '').trim() ? r : '')).filter(r => !/^[\s|:-]+$/.test(r));
  const cel = r => r.split('|').slice(1, -1).map(x => x.trim());
  const esColor = cel(filas[0] || '').some(x => /uso/i.test(x)) && colores.length;
  if (esColor) {
    html += '<div class="swatches">' + colores.map(c => `<div class="sw"><span style="background:${c.hex}"></span><b>${esc(c.token)}</b><i>${esc(c.hex)}</i><small>${inline(c.uso)}</small></div>`).join('') + '</div>';
  } else {
    html += '<table><thead><tr>' + cel(filas[0]).map(x => `<th>${inline(x)}</th>`).join('') + '</tr></thead><tbody>' + filas.slice(1).map(r => '<tr>' + cel(r).map(x => `<td>${inline(x)}</td>`).join('') + '</tr>').join('') + '</tbody></table>';
  }
  tabla = [];
};
for (const raw of lineas) {
  const l = raw.replace(/\s+$/, '');
  if (/^\|/.test(l)) { cierraLista(); tabla.push(l); continue; } else cierraTabla();
  let m;
  if ((m = l.match(/^# (.+)/))) { cierraLista(); html += `<header class="portada"><p class="k">Brand book</p><h1>${inline(m[1])}</h1></header>`; continue; }
  if ((m = l.match(/^## (.+)/))) { cierraLista(); if (!primero) html += '</section>'; primero = false; seccion++; html += `<section><p class="n">${String(seccion).padStart(2, '0')}</p><h2>${inline(m[1].replace(/^\d+\.\s*/, ''))}</h2>`; continue; }
  if ((m = l.match(/^### (.+)/))) { cierraLista(); html += `<h3>${inline(m[1])}</h3>`; continue; }
  if ((m = l.match(/^> (.+)/))) { cierraLista(); html += `<blockquote>${inline(m[1])}</blockquote>`; continue; }
  if ((m = l.match(/^\s*(?:[-*]|\d+\.)\s+(.*)/))) {
    const t = /^\s*\d+\./.test(l) ? 'ol' : 'ul';
    if (lista !== t) { cierraLista(); lista = t; html += `<${t}>`; }
    // campo vacío ("**Etiqueta:**") se resalta como pendiente
    html += /^\*\*[^*]+:\*\*\s*$/.test(m[1]) ? `<li class="vacio">${inline(m[1])} <span>pendiente</span></li>` : `<li>${inline(m[1])}</li>`;
    continue;
  }
  if (!l.trim()) { cierraLista(); continue; }
  cierraLista(); html += `<p>${inline(l)}</p>`;
}
cierraLista(); cierraTabla(); if (!primero) html += '</section>';

const pagina = `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Brand book</title>
<style>
:root{--fondo:${fondo};--texto:${texto};--acento:${acento};--suave:${suave};--linea:color-mix(in srgb,${texto} 16%,transparent)}
*{box-sizing:border-box;margin:0}
body{background:var(--fondo);color:var(--texto);font:16px/1.6 "Inter",system-ui,sans-serif;-webkit-font-smoothing:antialiased}
main{max-width:980px;margin:0 auto;padding:0 clamp(20px,5vw,64px)}
.portada{min-height:80vh;display:flex;flex-direction:column;justify-content:flex-end;padding-bottom:64px}
.k,.n{font-size:12px;letter-spacing:.24em;text-transform:uppercase;color:var(--suave)}
h1{font:600 clamp(48px,10vw,128px)/.92 "Hanken Grotesk",system-ui,sans-serif;letter-spacing:-.04em;text-transform:uppercase;margin-top:16px}
section{border-top:1px solid var(--linea);padding:clamp(48px,8vw,96px) 0}
h2{font:500 clamp(30px,5vw,56px)/1 "Hanken Grotesk",system-ui,sans-serif;letter-spacing:-.03em;margin:8px 0 28px}
h3{font-size:12px;letter-spacing:.2em;text-transform:uppercase;color:var(--suave);margin:32px 0 12px}
p{margin:0 0 14px;max-width:62ch} ul,ol{margin:0 0 16px 1.2em;max-width:62ch} li{margin:6px 0}
li strong{color:var(--acento)} blockquote{border-left:2px solid var(--acento);padding-left:16px;color:var(--suave);margin:0 0 24px}
code{background:var(--linea);padding:1px 6px;border-radius:4px;font-size:.9em}
.vacio{color:var(--suave)} .vacio span{font-size:11px;border:1px dashed var(--suave);border-radius:999px;padding:1px 8px;margin-left:6px}
.swatches{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:16px;margin:16px 0 28px}
.sw{display:flex;flex-direction:column;gap:2px}.sw span{height:120px;border-radius:12px;border:1px solid var(--linea);margin-bottom:8px}
.sw i{font-style:normal;color:var(--suave);font-size:14px}.sw small{color:var(--suave)}
table{border-collapse:collapse;width:100%;margin:12px 0 24px}th,td{text-align:left;padding:10px 12px;border-bottom:1px solid var(--linea)}th{font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:var(--suave)}
@media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact}section{break-inside:avoid}.portada{min-height:90vh}}
</style></head><body><main>${html}</main></body></html>`;

mkdirSync(salida, { recursive: true });
writeFileSync(join(salida, 'index.html'), pagina);
console.log('HTML:', join(salida, 'index.html'));
if (!process.argv.includes('--sin-pdf')) {
  try {
    const { chromium } = cargarPlaywright();
    const b = await chromium.launch(await opcionesNavegador());
    const p = await b.newPage();
    await p.goto('file://' + join(salida, 'index.html'));
    await p.pdf({ path: join(salida, 'brand-book.pdf'), format: 'A4', printBackground: true, margin: { top: '14mm', bottom: '14mm', left: '12mm', right: '12mm' } });
    await b.close();
    console.log('PDF: ', join(salida, 'brand-book.pdf'));
  } catch (e) { console.log('PDF no generado (' + e.message + '). El HTML sí.'); }
}
