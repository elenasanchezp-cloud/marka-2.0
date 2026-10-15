---
name: brand-book
description: Genera el brand book (HTML + PDF) de un cliente a partir de su BRAND.md con brandbook.mjs. Úsala cuando Elena pida "brand book", "manual de marca" o "guía de marca" de un cliente.
---

# Brand book

El brand book **se genera siempre desde `BRAND.md`**. Nunca se maqueta a mano ni se escribe contenido que no esté ahí.

## Pasos
1. Lee `BRAND.md` (y `BRIEFING.md` por contexto) del cliente.
2. **Busca campos vacíos o `[PENDIENTE]`:** líneas tipo `- **Etiqueta:**` sin valor.
   - Si hay alguno, **lístalos y pídeselos a Elena antes de generar**. No los rellenes tú.
   - Solo genera con huecos si Elena lo confirma de forma explícita; en ese caso saldrán marcados como "pendiente" en el documento.
3. Comprueba que la tabla de colores de `BRAND.md` tiene hex válidos (`#RRGGBB`) con tokens fondo/texto/acento/suave: de ahí sale la paleta del brand book.
4. Genera:
   `node herramientas/brandbook.mjs BRAND.md brandbook`
   (en este repo: `node kit-cliente/herramientas/brandbook.mjs <ruta>/BRAND.md <salida>`).
5. Revisa el HTML en el navegador: colores correctos, tipografías, sin textos cortados, sin la marca MARKA mezclada con la del cliente.
6. Entrega los archivos de `brandbook/` y lista qué campos estaban pendientes, si los hubo.

## Si la marca cambia
Se actualiza `BRAND.md` **primero** y se regenera. Nunca al revés.
