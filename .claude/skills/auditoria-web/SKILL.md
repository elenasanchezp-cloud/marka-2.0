---
name: auditoria-web
description: Audita una web (SEO, accesibilidad básica, rendimiento y responsive móvil 390px / escritorio) con la herramienta de MARKA y corrige los errores. Úsala al terminar una web de cliente, antes de entregar, o cuando Elena pida una auditoría.
---

# Auditoría web

Herramienta: `auditoria-web.mjs` (en el repo de un cliente: `herramientas/auditoria-web.mjs`; en este repo: `kit-cliente/herramientas/auditoria-web.mjs`). Necesita Node y Playwright con Chromium.

## Pasos
1. Localiza la web: `web/index.html` del cliente, o una URL si ya está publicada.
2. Ejecuta:
   `node herramientas/auditoria-web.mjs web/index.html`
   (o con `<url>`; añade `--json` si quieres procesar el resultado).
   Si falla por Playwright, usa `PLAYWRIGHT_PATH`/`CHROMIUM_PATH` o instala con `npm i -D playwright && npx playwright install chromium`. No desactives comprobaciones.
3. Revisa el resultado por niveles: ❌ error, ⚠️ aviso, ✅ ok.
4. **Corrige todos los ❌** en `web/index.html`. Reglas que no se negocian:
   - Un solo `h1`, `lang` en `<html>`, `<main>`, `aria-label` en secciones.
   - `alt` en todas las imágenes; botones, enlaces y campos con nombre accesible.
   - Foco visible y `prefers-reduced-motion` respetado.
   - Sin scroll horizontal en 390px.
   - Imágenes `.webp` en `img/`, `loading="lazy"` salvo el hero.
   - Metadatos coherentes con los textos: title, description, Open Graph, JSON-LD.
   - Ningún `{{...}}` sin sustituir: `grep -n '{{' web/index.html`.
5. Vuelve a ejecutar hasta que no quede ningún ❌. Los ⚠️ se explican o se corrigen si es razonable.
6. Abre la web en el navegador y comprueba móvil (390px) y escritorio antes de darla por buena.

## Informe
Entrega al final: errores encontrados → corregidos, avisos que quedan (con motivo) y qué no se ha podido comprobar. No digas "todo OK" si algún paso no se ha ejecutado de verdad.
