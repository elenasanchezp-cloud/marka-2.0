# {{CLIENTE}}

Proyecto de marca y comunicación de {{CLIENTE}}, por [MARKA](https://marka-estudio.vercel.app/).

```
BRIEFING.md   lo que pide el cliente (se rellena una vez)
BRAND.md      sistema de marca: la fuente única de verdad
CLAUDE.md     reglas para trabajar con Claude en este repo
web/          sitio web (estático)
redes/        calendario y piezas de redes sociales
video/        guiones de vídeo
campanas/     campañas
assets/       logos, tipografías, fotos del cliente
herramientas/ brand book (PDF), auditoría web, presupuestos, entrega y lanzamiento
ENTREGAS.md  historial de entregas (versiones)
```

## Cómo trabajar
1. Rellenar `BRIEFING.md` y `BRAND.md` con el cliente (una sola vez).
2. Para cualquier entrega pedir a Claude: *"Siguiendo BRAND.md, haz [web / 10 posts / guion de 30 s / campaña de X]"*.
3. Rama por entrega → Pull Request → revisión (la web tiene vista previa en Vercel).
4. Si la marca evoluciona, se actualiza `BRAND.md` primero.

## Web
Vercel: Root Directory = `web`. Ver en local: `cd web && python3 -m http.server 8000`.

## Herramientas
```bash
node herramientas/brandbook.mjs BRAND.md brandbook     # brand book HTML + PDF con la paleta del cliente
node herramientas/auditoria-web.mjs web/index.html     # SEO, accesibilidad y rendimiento
node herramientas/presupuesto.mjs partidas.csv --cliente "{{CLIENTE}}"
```
Necesitan Playwright: `npm i -D playwright && npx playwright install chromium`.

## Entregas y lanzamiento
```bash
herramientas/entrega.sh v1.0.0 "Web + brand book"   # crea la versión; luego: git push origin HEAD && git push origin v1.0.0
herramientas/lanzar.sh https://dominio.com          # quita el noindex de la demo y publica
```
La demo está en `noindex` hasta lanzar. Cada entrega genera una *release* en GitHub.
