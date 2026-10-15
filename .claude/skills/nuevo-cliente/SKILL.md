---
name: nuevo-cliente
description: Da de alta un cliente nuevo de MARKA (repo propio o carpeta en clientes/) y prepara BRIEFING.md y BRAND.md. Úsala cuando Elena diga "nuevo cliente", "arranca el proyecto de X" o "crea el repo de X".
---

# Nuevo cliente

## Antes de crear nada
1. Confirma **nombre**, **slug** (solo `a-z`, `0-9` y guiones) y **email**. Si falta alguno, pregúntalo; no lo inventes.
2. Pregunta la modalidad si no está clara:
   - **Repo propio (recomendada):** `scripts/nuevo-repo-cliente.sh <slug> "<Nombre>" [email]` → crea `../marka-<slug>` con git iniciado.
   - **Carpeta en este repo:** `scripts/nuevo-cliente.sh <slug> "<Nombre>" [email]` → crea `clientes/<slug>/`.

## Pasos
1. Ejecuta el script elegido. Si dice que el destino ya existe, para y avisa; no lo sobrescribas.
2. Comprueba que se han sustituido los `{{CLIENTE}}`, `{{SLUG}}`, `{{EMAIL}}`, `{{ANYO}}` e `{{I}}` en `BRIEFING.md`, `BRAND.md`, `CLAUDE.md` y `web/`:
   `grep -rn '{{' <destino> | head`
   Los `{{...}}` de `web/index.html` que quedan (textos, tokens) se rellenan después, al hacer la web.
3. Rellena `BRIEFING.md` y `BRAND.md` **solo con lo que haya dicho Elena o el cliente**. Todo lo demás se deja vacío o con `[PENDIENTE]`. Nunca inventes precios, direcciones, testimonios ni cifras.
4. Crea la rama de trabajo: `git checkout -b web/<slug>` (repo propio: dentro del repo del cliente).
5. No hagas push a `main` ni abras PR si no te lo piden.

## Al terminar, resume en 5 líneas
- Dónde se ha creado.
- Qué campos de `BRIEFING.md` y `BRAND.md` siguen `[PENDIENTE]`.
- Siguiente paso: repo privado en GitHub (`marka-<slug>`), Vercel con Root Directory = `web` (o `clientes/<slug>/web`).
- Recuerda: la marca MARKA no se mezcla con la del cliente, salvo el crédito del pie ("Web por MARKA").
