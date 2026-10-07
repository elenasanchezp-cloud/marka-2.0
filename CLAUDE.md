# Reglas del proyecto MARKA

Web estática de una página (`index.html`). Sigue `BRAND.md` siempre.

- Idioma: español (es-ES), tono directo y breve.
- Sin frameworks ni build: HTML/CSS/JS en `index.html`; librerías solo por CDN (GSAP, Lenis).
- Usa los tokens de `:root` (`--carbon`, `--hueso`, `--arena`, `--piedra`); no inventes colores.
- Accesibilidad: un solo `h1`, `aria-label` en secciones, `alt` en imágenes, foco visible, respeta `prefers-reduced-motion`.
- Rendimiento: imágenes `.webp` en `img/`, `loading="lazy"` salvo el hero.
- Mantén metadatos (title, description, Open Graph, JSON-LD) coherentes al cambiar textos.
- Trabaja en una rama por cambio; no hagas push a `main` ni abras PR sin que se pida.
- Antes de dar algo por hecho, ábrelo en el navegador y revisa móvil (390px) y escritorio.

## Clientes
- Un repo por cliente (`scripts/nuevo-repo-cliente.sh`) o una carpeta en `clientes/<slug>/` (`scripts/nuevo-cliente.sh`). La fuente de verdad de cada cliente es su `BRAND.md`; el kit está en `kit-cliente/` y la web base en `plantilla/`.
- Para cualquier entregable de un cliente: lee su `BRAND.md` y `BRIEFING.md` antes, y usa las plantillas de `redes/`, `video/` y `campanas/`.
- Web: rellena todos los `{{...}}` de `web/index.html`, ajusta los tokens de `:root` a la paleta del cliente y adapta secciones y copy a su tono. No dejes ningún `{{...}}` sin sustituir.
- No inventes datos del cliente (precios, direcciones, testimonios, cifras). Si falta, pregunta o marca `[PENDIENTE]`.
- No mezcles la marca MARKA con la del cliente salvo el crédito del pie ("Web por MARKA").
- Las imágenes del cliente van en `web/img/` en `.webp`.
