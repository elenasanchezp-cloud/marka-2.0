#!/usr/bin/env node
// Uso: node herramientas/presupuesto.mjs <partidas.csv> --cliente "Café Norte" [--num 2026-001] [--iva 21] [--irpf 0] [--validez 30] [--salida presupuesto]
// CSV: concepto,descripcion,cantidad,precio   (precio unitario sin IVA)
// Genera presupuesto.html y presupuesto.pdf con totales calculados. NO inventa precios: los pones tú en el CSV.
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { cargarPlaywright, opcionesNavegador } from './_pw.mjs';

const a = process.argv.slice(2);
const flag = (n, d) => { const i = a.indexOf('--' + n); return i > -1 ? a[i + 1] : d; };
const csv = a[0];
if (!csv || csv.startsWith('--')) { console.error('Uso: node herramientas/presupuesto.mjs <partidas.csv> --cliente "Nombre" [--num 2026-001] [--iva 21] [--irpf 0] [--validez 30]'); process.exit(1); }
const cliente = flag('cliente', 'Cliente'), num = flag('num', new Date().getFullYear() + '-001');
const iva = +flag('iva', 21), irpf = +flag('irpf', 0), validez = +flag('validez', 30);
const salida = resolve(flag('salida', 'presupuesto'));

const parse = t => { // CSV simple con comillas
  const rows = []; let r = [], c = '', q = false;
  for (let i = 0; i < t.length; i++) { const ch = t[i];
    if (q) { if (ch === '"' && t[i + 1] === '"') { c += '"'; i++; } else if (ch === '"') q = false; else c += ch; }
    else if (ch === '"') q = true; else if (ch === ',') { r.push(c); c = ''; }
    else if (ch === '\n' || ch === '\r') { if (ch === '\r' && t[i + 1] === '\n') i++; r.push(c); c = ''; if (r.some(x => x.trim())) rows.push(r); r = []; }
    else c += ch; }
  if (c || r.length) { r.push(c); rows.push(r); }
  return rows;
};
const [cab, ...filas] = parse(readFileSync(csv, 'utf8'));
const idx = n => cab.map(x => x.trim().toLowerCase()).indexOf(n);
const [iC, iD, iQ, iP] = ['concepto', 'descripcion', 'cantidad', 'precio'].map(idx);
if ([iC, iQ, iP].some(i => i < 0)) { console.error('El CSV necesita las columnas: concepto,descripcion,cantidad,precio'); process.exit(1); }
const num2 = s => { const v = parseFloat(String(s).replace(',', '.')); return Number.isFinite(v) ? v : NaN; };
const partidas = filas.map((f, n) => {
  const q = num2(f[iQ]), p = num2(f[iP]);
  if (!Number.isFinite(q) || !Number.isFinite(p)) { console.error(`Fila ${n + 2}: cantidad o precio no válidos (¿falta rellenarlos?)`); process.exit(1); }
  return { c: f[iC], d: iD > -1 ? f[iD] : '', q, p, t: Math.round(q * p * 100) / 100 };
});
if (partidas.some(x => x.p === 0)) console.error('⚠️  Hay partidas con precio 0: revisa el CSV antes de enviar.');
const base = Math.round(partidas.reduce((s, x) => s + x.t, 0) * 100) / 100;
const cIva = Math.round(base * iva) / 100, cIrpf = Math.round(base * irpf) / 100, total = Math.round((base + cIva - cIrpf) * 100) / 100;
const eur = n => n.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' });
const esc = t => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const fecha = new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });

const html = `<!doctype html><html lang="es"><meta charset="utf-8"><title>Presupuesto ${esc(num)}</title><style>
*{box-sizing:border-box;margin:0}body{font:14px/1.5 "Inter",system-ui,sans-serif;color:#1A1A1A;padding:48px;max-width:860px;margin:auto}
h1{font:600 40px/1 "Hanken Grotesk",system-ui,sans-serif;letter-spacing:-.03em;text-transform:uppercase}
.meta{display:flex;justify-content:space-between;margin:28px 0 36px;color:#555}.meta b{color:#1A1A1A}
table{width:100%;border-collapse:collapse}th{font-size:11px;letter-spacing:.16em;text-transform:uppercase;text-align:left;color:#777;padding:8px 6px;border-bottom:2px solid #1A1A1A}
td{padding:12px 6px;border-bottom:1px solid #ddd;vertical-align:top}td small{display:block;color:#666}.r{text-align:right;white-space:nowrap}
.tot{margin:24px 0 0 auto;width:280px}.tot div{display:flex;justify-content:space-between;padding:5px 0}.tot .g{border-top:2px solid #1A1A1A;margin-top:6px;padding-top:10px;font-size:18px;font-weight:700}
.n{margin-top:40px;color:#555;font-size:12px}
</style><h1>Presupuesto</h1>
<div class="meta"><div><b>${esc(cliente)}</b><br>Nº ${esc(num)}</div><div style="text-align:right">${fecha}<br>Válido ${validez} días</div></div>
<table><thead><tr><th>Concepto</th><th class="r">Cant.</th><th class="r">Precio</th><th class="r">Importe</th></tr></thead><tbody>
${partidas.map(x => `<tr><td>${esc(x.c)}${x.d ? `<small>${esc(x.d)}</small>` : ''}</td><td class="r">${x.q}</td><td class="r">${eur(x.p)}</td><td class="r">${eur(x.t)}</td></tr>`).join('')}
</tbody></table>
<div class="tot"><div><span>Base imponible</span><span>${eur(base)}</span></div><div><span>IVA ${iva}%</span><span>${eur(cIva)}</span></div>${irpf ? `<div><span>IRPF −${irpf}%</span><span>−${eur(cIrpf)}</span></div>` : ''}<div class="g"><span>Total</span><span>${eur(total)}</span></div></div>
<p class="n">Condiciones de pago y plazos según la propuesta. Revisa impuestos (IVA/IRPF) con tu gestoría antes de enviar.</p></html>`;
writeFileSync(salida + '.html', html);
console.log(`Base ${eur(base)} · IVA ${eur(cIva)}${irpf ? ' · IRPF −' + eur(cIrpf) : ''} · Total ${eur(total)}\nHTML: ${salida}.html`);
try {
  const { chromium } = cargarPlaywright(); const b = await chromium.launch(await opcionesNavegador()); const p = await b.newPage();
  await p.goto('file://' + salida + '.html'); await p.pdf({ path: salida + '.pdf', format: 'A4', printBackground: true, margin: { top: '12mm', bottom: '12mm' } }); await b.close(); console.log('PDF: ' + salida + '.pdf');
} catch (e) { console.log('PDF no generado (' + e.message + ')'); }
