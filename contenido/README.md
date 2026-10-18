# Contenido animado de MARKA

Vídeos verticales (1080×1920) y carruseles hechos con código, sin grabar a nadie.

- `piezas/*.html`: cada pieza define `window.DURACION` y `window.render(t)` (todo depende de `t`).
- `piezas/*.audio.json`: golpes, whooshes y base rítmica de cada vídeo.
- `motor/`: utilidades (`motor.js`, `base.css`), render a MP4 (`render.mjs`), audio (`audio.py`) y PDF (`pdf.mjs`).

```bash
python3 motor/audio.py piezas/01-que-es-marka.audio.json /tmp/a.wav
node motor/render.mjs piezas/01-que-es-marka.html salida.mp4 /tmp/a.wav
node motor/render.mjs piezas/01-que-es-marka.html prueba.png --prueba 2,8,15   # fotogramas sueltos
node motor/pdf.mjs piezas/03-linkedin-hemos-montado-marka.html carrusel.pdf
```
