# Auditoría de la web de MARKA (2026-10-07)

Hecha con `kit-cliente/herramientas/auditoria-web.mjs` sobre `index.html` en móvil (390 px) y escritorio (1280 px).

## Qué estaba bien
`lang="es"`, un solo `h1`, jerarquía de títulos correcta, `<main>`, `canonical`, imágenes con `alt` y dimensiones,
botones y enlaces con nombre accesible, enlaces externos con `rel="noopener"`, sin scroll horizontal,
`prefers-reduced-motion` respetado, JSON-LD, robots.txt y sitemap.xml.

## Qué se ha corregido
| Problema | Arreglo |
|---|---|
| `og:image` era un WebP de 820×887: WhatsApp, LinkedIn y otras redes suelen ignorarlo y el recorte salía mal | Nueva `img/og.jpg` de 1200×630 + `og:image:type/width/height/alt` |
| Sin `twitter:title/description/image` | Añadidos |
| `meta description` de 100 caracteres | Ampliada a 151 (rango recomendado 110–160) |
| Sin `og:site_name` | Añadido |
| JSON-LD sin `logo` ni `image` | Añadidos |
| Sin enlace "Saltar al contenido" (teclado y lectores de pantalla) | Añadido, visible al enfocar |
| `sitemap.xml` sin fecha | `lastmod`, `changefreq`, `priority` |

## Pendiente (no he podido o no es mío decidir)
- **Librerías por CDN sin SRI** (GSAP, ScrollTrigger, Lenis). Recomendado: alojarlas en `/js/` (mejor rendimiento y sin depender de terceros) o añadir `integrity`. Desde este entorno no tengo salida a esos CDN, así que **no he podido comprobar las animaciones ni calcular los hashes**.
- **Neue Montreal** está declarada como fuente display pero no se carga: se ve Hanken Grotesk. Cargarla (con licencia) o quitarla de `--display`.
- **Rendimiento real** (LCP, CLS, INP): medir en producción con PageSpeed Insights / Lighthouse; aquí solo he medido la carga local.
- **Contraste**: no hay contraste automático en la herramienta; revisar con axe/Lighthouse sobre producción.
- El correo `markastudio20@gmail.com` es el contacto público del estudio y aparece en el JSON-LD; se mantiene.

## Cómo repetirla
```bash
node kit-cliente/herramientas/auditoria-web.mjs index.html
node kit-cliente/herramientas/auditoria-web.mjs https://marka-estudio.vercel.app/
```
Sirve igual para las webs de clientes: es un entregable vendible ("auditoría SEO y accesibilidad").
