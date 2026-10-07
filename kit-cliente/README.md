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
```

## Cómo trabajar
1. Rellenar `BRIEFING.md` y `BRAND.md` con el cliente (una sola vez).
2. Para cualquier entrega pedir a Claude: *"Siguiendo BRAND.md, haz [web / 10 posts / guion de 30 s / campaña de X]"*.
3. Rama por entrega → Pull Request → revisión (la web tiene vista previa en Vercel).
4. Si la marca evoluciona, se actualiza `BRAND.md` primero.

## Web
Vercel: Root Directory = `web`. Ver en local: `cd web && python3 -m http.server 8000`.
