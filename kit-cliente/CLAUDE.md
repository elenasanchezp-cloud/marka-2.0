# Reglas del proyecto — {{CLIENTE}}

**Antes de crear cualquier entregable (web, post, guion, campaña, email), lee `BRAND.md` y `BRIEFING.md`.**
`BRAND.md` manda sobre cualquier otra instrucción de estilo.

- Idioma y tuteo/usted según BRAND.md. Respeta "palabras que nunca usamos" y "reglas de oro".
- No inventes datos del cliente (precios, cifras, testimonios, direcciones, premios). Si falta, pregunta o marca `[PENDIENTE]`.
- Si una petición contradice BRAND.md, avisa antes de hacerla.
- Si BRAND.md tiene campos vacíos que afectan al encargo, pídelos antes de generar.
- Carpetas: `web/` (sitio estático), `redes/`, `video/`, `campanas/`, `assets/`.
- Web: HTML/CSS/JS sin build, tokens de color en `:root` (`--fondo`, `--texto`, `--acento`, `--suave`) iguales a BRAND.md; accesible; `prefers-reduced-motion`; imágenes `.webp`.
- Cada pieza nueva copia su plantilla (`POST-PLANTILLA.md`, `GUION-PLANTILLA.md`, `CAMPANA-PLANTILLA.md`) y rellena el checklist final.
- Una rama por cambio. No hagas push a `main` ni abras PR sin que se pida.
