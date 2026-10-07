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


## Máquina de webs para clientes

```
plantilla/            web base genérica (tokens de color en :root, secciones listas)
clientes/_plantilla/  BRIEFING.md y BRAND.md vacíos
clientes/<slug>/      un cliente: BRIEFING.md, BRAND.md, assets/ y web/
scripts/nuevo-cliente.sh
```

Flujo:

1. `scripts/nuevo-cliente.sh cafe-norte "Café Norte" hola@cafenorte.es`
2. Rellena `clientes/cafe-norte/BRIEFING.md` (con el cliente) y `BRAND.md`.
3. Pide a Claude: *"genera la web de clientes/cafe-norte a partir del briefing"*. Rellena los `{{...}}`, adapta paleta, tipografía y tono, y crea las secciones.
4. Rama `web/cafe-norte` → Pull Request → vista previa de Vercel para enseñársela al cliente.
5. Entrega: proyecto de Vercel nuevo con **Root Directory = `clientes/cafe-norte/web`** y el dominio del cliente.

Si el cliente quiere el código aparte, copia `clientes/<slug>/web` a un repo propio.
