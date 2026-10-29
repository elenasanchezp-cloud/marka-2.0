// Carga Playwright desde donde esté: paquete local, global o ruta en PLAYWRIGHT_PATH.
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
export function cargarPlaywright() {
  const rutas = [process.env.PLAYWRIGHT_PATH, 'playwright', '/opt/node-tools/node_modules/playwright'].filter(Boolean);
  for (const r of rutas) { try { return require(r); } catch {} }
  throw new Error('Falta Playwright. Instala con: npm i -D playwright && npx playwright install chromium (o define PLAYWRIGHT_PATH)');
}
export function opcionesNavegador() {
  const exe = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium';
  return import('node:fs').then(fs => (fs.existsSync(exe) ? { executablePath: exe } : {}));
}
