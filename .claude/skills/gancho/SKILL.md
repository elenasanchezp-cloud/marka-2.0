---
name: gancho
description: Genera el gancho gratis de MARKA (mini-diagnóstico K.O. para Marca, análisis de local para Empresa, revisión de perfil para Persona) a partir de la ficha rellenada. Usar cuando Elena pida "haz el gancho de…", "prepara el entregable para captar a…" o pase una FICHA-GANCHO.
---

# Skill: gancho

Objetivo: con una ficha rellenada, producir en un solo paso el entregable gratuito que capta al cliente y los mensajes para enviarlo. Debe persuadir de que contratar a MARKA es el siguiente paso lógico, sin mentir ni exagerar.

## Antes de escribir
1. Lee `BRAND.md` (tono: directo, seguro, breve, se tutea, sin exclamaciones ni jerga).
2. Lee `agencia/ganchos/FICHA-GANCHO.md` rellenada por Elena y `agencia/campanas/ENFOQUE.md` (para el tipo de cliente y la propuesta que encaja).
3. Abre los enlaces o capturas de la ficha. Solo se afirma lo que se vea ahí.
4. Si falta información clave (tipo, nombre, enlaces o los 3 hallazgos y no hay capturas), pregúntala antes de generar.

## Qué generar
Usa `agencia/ganchos/ENTREGABLE-PLANTILLA.md` y entrega, en este orden:
1. **El entregable de una página:** lo visto (3 hallazgos con qué pasa y qué te cuesta), un adelanto resuelto gratis, lo que queda por resolver, siguiente paso.
2. **Mensaje de envío** adaptado al canal y al tono de la ficha.
3. **Seguimientos** a +2 y +5 días.
4. **Comprobaciones** de la plantilla, marcadas.

Guarda el resultado en `clientes-potenciales/<slug>/gancho.md` (crea la carpeta si no existe).

## Persuasión honesta
- Muestra el problema con evidencia concreta y la consecuencia, en cualitativo.
- El adelanto debe ser útil de verdad. Eso es lo que demuestra el nivel.
- Lo que queda por resolver se explica con claridad, pero no se resuelve: es lo que se contrata.
- Cierra con un paso pequeño (reunión de 15–20 minutos), no con presión.
- Prohibido: urgencia falsa, cifras o comparaciones inventadas, decir que "sin nosotras" es imposible, críticas a personas.

## Reglas del proyecto
- No inventes datos del cliente (precios, cifras, testimonios, direcciones). Si falta, `[PENDIENTE]`.
- Los precios los pone Elena.
- Una rama por cambio; no hagas push a `main` ni abras PR sin que se pida.
