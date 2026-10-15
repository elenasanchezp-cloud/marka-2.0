---
name: propuesta
description: Redacta la propuesta comercial de un cliente con la plantilla de MARKA y prepara el presupuesto en PDF desde un CSV. Úsala cuando Elena pida "propuesta", "presupuesto" u "oferta" para un cliente o prospecto.
---

# Propuesta y presupuesto

**Regla de oro: nunca inventes precios, plazos ni resultados.** Los precios los pone Elena en el CSV. Todo lo que falte se marca `[PENDIENTE]`.

## Propuesta
1. Lee el `BRIEFING.md` del cliente (si no existe, pide a Elena los datos básicos).
2. Copia `agencia/propuestas/PROPUESTA-PLANTILLA.md` a `<cliente>-propuesta.md` y rellénala:
   - Solo con lo que consta en el briefing o lo que ha dicho Elena.
   - Tono MARKA: directo, breve, tuteo, español de España.
   - En "Qué hacemos" deja solo lo que se contrata.
   - Fechas, plazos, forma de pago y exclusiones sin confirmar → `[PENDIENTE]`.
3. No metas cifras de resultados esperados (ventas, seguidores, ROI) que nadie haya acordado.

## Presupuesto
1. Copia `agencia/propuestas/partidas-ejemplo.csv` a `partidas.csv` con columnas `concepto,descripcion,cantidad,precio` (precio unitario sin IVA).
2. **Los precios los escribe Elena.** Si el CSV tiene precios en `0` o vacíos, pídeselos; no propongas tarifas.
3. Genera:
   `node kit-cliente/herramientas/presupuesto.mjs partidas.csv --cliente "<Nombre>" --num AAAA-NNN --iva 21 [--irpf N] [--validez 30]`
   Saca `presupuesto.html` y `presupuesto.pdf` con base, IVA, IRPF y total.
4. Recuerda a Elena que **revise los impuestos con su gestoría** antes de enviar.

## Entrega
Resume: qué contiene la propuesta, qué quedó `[PENDIENTE]`, total calculado y archivos generados. Al aceptarse: skill `nuevo-cliente`.
