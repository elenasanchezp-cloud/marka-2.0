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
