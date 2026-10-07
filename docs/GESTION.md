# GitHub como gestor y portfolio de MARKA

## 1. Tablero (GitHub Projects)
**Recomendación: un solo tablero "Clientes" con un campo `Cliente`**, no un proyecto por cliente.
Escala mejor, ves toda la carga de trabajo junta y creas una *vista filtrada* por cliente cuando la necesites.
Solo tiene sentido un tablero propio si el cliente va a tener acceso y quieres que vea únicamente lo suyo.

Pasos (una sola vez, en la web de GitHub; no se puede automatizar con los permisos de este entorno):
1. Tu perfil → **Projects** → **New project** → plantilla **Board**. Nómbralo `Clientes`.
2. Columnas de estado: `Idea` · `Briefing` · `En curso` · `Revisión cliente` · `Entregado`.
3. Campos: `Cliente` (texto o selección), `Servicio` (selección: web, redes, vídeo, branding, campaña), `Fecha entrega` (fecha).
4. Vistas: **Tablero** (por estado), **Por cliente** (agrupado por `Cliente`), **Calendario** (por `Fecha entrega`).
5. Automatización: en el proyecto → *Workflows* → "Item added" → estado `Idea`; "Item closed" → `Entregado`.
6. Para que issues y PRs entren solos: define la variable de repo `PROJECT_URL` y el secreto `ADD_TO_PROJECT_PAT` (workflow `add-to-project.yml`, ya incluido).

## 2. Issues
- Un issue por entrega, con las plantillas "Entrega" y "Nueva web de cliente".
- Etiquetas de `.github/labels.json` (se crean solas al ejecutar el workflow *Sincronizar etiquetas* desde la pestaña Actions).
- Cada issue de un cliente lleva la etiqueta `cliente` y la de servicio (`web`, `redes`, `video`, `branding`, `campaña`).
- Bloqueado esperando al cliente → `bloqueado`; enviado para revisar → `revisión-cliente`.

## 3. Releases = entregas
Cada entrega a un cliente es una versión: `v1.0.0` primera entrega, `v1.1.0` ampliación, `v1.0.1` corrección.
```bash
herramientas/entrega.sh v1.0.0 "Web + brand book"   # anota en ENTREGAS.md y crea la etiqueta
git push origin HEAD && git push origin v1.0.0       # GitHub crea la release con notas automáticas
```
Así el cliente tiene un historial claro y tú puedes volver a cualquier entrega.

## 4. Demo por proyecto (Vercel)
1. Vercel → *Add New Project* → importa el repo del cliente → **Root Directory = `web`** (en el repo de MARKA: `clientes/<slug>/web`). Framework: *Other*, sin build.
2. Cada rama y PR tiene su URL de vista previa; `main` es la demo del cliente.
3. **Las demos son privadas para buscadores**: la plantilla trae `noindex` (meta, cabecera y robots.txt). No se indexan hasta publicar.
4. Al lanzar con dominio propio: `herramientas/lanzar.sh https://dominio.com` quita el `noindex`, abre robots y genera sitemap. Luego `auditoria-web.mjs` y `entrega.sh`.
5. Para una demo con contraseña, usa *Deployment Protection* de Vercel (según plan).

## 5. Portfolio
- Cada proyecto terminado → un caso en `agencia/portfolio/` (plantilla `CASO-PLANTILLA.md`), **con permiso del cliente**.
- Los repos de cliente son **privados**. Lo público es la web de MARKA y los casos que decidas publicar.
- Opcional: README de perfil de GitHub (repo `<tu-usuario>/<tu-usuario>`) con enlaces a los mejores casos.
- Ajustes del repo `marka-2.0` (Settings, no automatizable aquí): descripción, *topics* (`branding`, `estudio-creativo`, `web`), y marcarlo como **Template repository**.
