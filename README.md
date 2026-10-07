# MARKA — Estudio creativo

> No hacemos logos. Hacemos markas.

Web de **MARKA**, estudio creativo de branding, redes, vídeo y campañas.
Sitio estático de una sola página (HTML + CSS + JS inline; GSAP y Lenis por CDN).

- **Producción:** https://marka-estudio.vercel.app/
- **Instagram:** https://www.instagram.com/marka.studio/
- **Contacto:** markastudio20@gmail.com

## Estructura

```
index.html     la web completa (estilos y scripts inline)
icon.svg       favicon / símbolo K
img/           imágenes .webp de los materiales
vercel.json    caché y cabeceras
robots.txt, sitemap.xml
BRAND.md       sistema de marca (colores, tipografía, tono)
CLAUDE.md      reglas para generar/editar webs con Claude
```

## Ver en local

```bash
python3 -m http.server 8000   # y abre http://localhost:8000
```

## Flujo de trabajo

1. `main` = lo que está publicado.
2. Cada cambio o web nueva va en su propia rama (`web/cliente-x`, `mejora/home`).
3. Abre un Pull Request: Vercel genera una **URL de vista previa** para enseñarla antes de publicar.
4. Al fusionar en `main`, se publica solo.
5. Tareas e ideas en **Issues** (hay plantillas); el tablero en **Projects**.

## Publicar

- **Vercel (actual):** importa el repo, sin build, directorio raíz. Despliegue automático.
- **GitHub Pages (alternativa):** Settings → Pages → Deploy from branch `main` / root.


## Máquina de clientes

Cada cliente tiene su sistema de marca por escrito (`BRAND.md`) y todo lo que se produce parte de él:
web, redes, guiones de vídeo y campañas, sin repetir el briefing.

```
kit-cliente/    kit completo: BRIEFING, BRAND, CLAUDE.md, redes/, video/, campanas/, assets/, CI
plantilla/      web base genérica (tokens de color en :root)
clientes/       clientes alojados en este repo (opcional)
scripts/        nuevo-repo-cliente.sh · nuevo-cliente.sh
```

### Opción A — un repo por cliente (recomendada)
```bash
scripts/nuevo-repo-cliente.sh cafe-norte "Café Norte" hola@cafenorte.es
```
Crea `../marka-cafe-norte` con git iniciado. Súbelo a un repo **privado** de GitHub (el script te da los comandos).
Ventajas: el cliente puede tener acceso solo a lo suyo, su historial es propio y entregas el código sin mezclar nada.

### Opción B — dentro de este repo
```bash
scripts/nuevo-cliente.sh cafe-norte "Café Norte" hola@cafenorte.es   # -> clientes/cafe-norte/
```

### Flujo con cada cliente
1. Crear el repo/carpeta con el script.
2. Rellenar `BRIEFING.md` y `BRAND.md` con el cliente (una sola vez).
3. Pedir a Claude, siempre con la misma fórmula: *"Siguiendo BRAND.md, haz [la web / 10 posts de redes / un guion de 30 s / una campaña de X]"*.
4. Rama por entrega → Pull Request → vista previa de Vercel (web) → aprobación del cliente.
5. Web: proyecto de Vercel con Root Directory = `web` (o `clientes/<slug>/web` en la opción B).
6. Si la marca evoluciona, se actualiza `BRAND.md` primero.

El `CLAUDE.md` de cada repo obliga a leer `BRAND.md` antes de producir nada y a no inventar datos del cliente.

## Servicios: herramientas listas para vender

| Servicio | Herramienta | Uso |
|---|---|---|
| **Brand book** | `kit-cliente/herramientas/brandbook.mjs` | `node kit-cliente/herramientas/brandbook.mjs BRAND.md brandbook` → HTML + PDF maquetado con la paleta del propio cliente |
| **Auditoría SEO / accesibilidad / rendimiento** | `kit-cliente/herramientas/auditoria-web.mjs` | `node kit-cliente/herramientas/auditoria-web.mjs <url o index.html>` — resultado de MARKA en [`docs/AUDITORIA-MARKA.md`](docs/AUDITORIA-MARKA.md) |
| **Propuestas y presupuestos** | `agencia/propuestas/` + `presupuesto.mjs` | Plantilla de propuesta y presupuesto en PDF con IVA/IRPF calculado (los precios los pones tú) |
| **Redes** | `kit-cliente/redes/` | Calendario en MD y `calendario.csv` (importable en Notion) + plantilla de pieza que parte de los pilares de `BRAND.md` |

Requieren Node y Playwright con Chromium (`npm i -D playwright && npx playwright install chromium`) para generar PDF/auditar.
Cada repo de cliente los incluye en `herramientas/`.

## Gestión y portfolio
Tablero, etiquetas, releases por entrega, demos privadas en Vercel y casos de portfolio: ver [`docs/GESTION.md`](docs/GESTION.md).

```bash
herramientas/entrega.sh v1.0.0 "Web + brand book"     # entrega = versión etiquetada
herramientas/lanzar.sh https://dominio-cliente.com    # demo noindex -> web pública
```
